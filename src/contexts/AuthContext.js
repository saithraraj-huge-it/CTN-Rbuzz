import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {axiosPost} from '../utils/api';
import {getGeoLocation} from '../utils/geoUtils';
import DeviceInfo from 'react-native-device-info';
import AuthEvents from '../utils/AuthEvents';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
    };

    AuthEvents.on('logout', handleLogout);

    return () => {
      AuthEvents.off('logout', handleLogout);
    };
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedCookie = await AsyncStorage.getItem('auth_cookie');

        const storedMobile = await AsyncStorage.getItem('user_mobile');
        const storedUserInfo = await AsyncStorage.getItem('user_info');

        if (storedCookie && storedMobile && storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          // setUser({ mobileNo: storedMobile, ...parsedUserInfo });
          setUser(parsedUserInfo);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('Failed to load user:', e);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (mobileNo, password, fcmToken) => {
    try {
      const location = await getGeoLocation();
      const geoLocation = location
        ? `${location.latitude},${location.longitude}`
        : '0.000000,0.000000';

      const deviceType = DeviceInfo.getDeviceType();
      const deviceName = await DeviceInfo.getDeviceName();

      const response = await axiosPost.post(
        '/api/atomService/session/checkAuth',
        {
          mobileNo,
          password,
          loginModeId: 2,
          geoLocation,
          fcmToken,
          deviceType,
          deviceName,
        },
      );
      if (response.data.result === true) {
        const userInfo = {
          ...response.data?.info,
          email: response.data?.emailId,
          phNo: response.data?.mobileNo,
          url: response.data?.url,
          url1: response.data?.url1,
          url2: response.data?.url2,
        };

        const setCookieHeader = response.headers['set-cookie'];
        let sessionCookie = null;

        if (setCookieHeader && setCookieHeader.length > 0) {
          sessionCookie = setCookieHeader[0].split(';')[0];
          await AsyncStorage.setItem('auth_cookie', sessionCookie);
        } else {
          console.warn('No Set-Cookie header found in response');
        }

        await AsyncStorage.setItem('user_mobile', mobileNo);
        await AsyncStorage.setItem('user_info', JSON.stringify(userInfo));
        await AsyncStorage.setItem('fcm_token', fcmToken);
        setUser({mobileNo, ...userInfo});

        return {success: true};
      } else {
        return {
          success: false,
          message: response.data.Message || 'Login failed',
        };
      }
    } catch (error) {
      return {success: false, message: 'Something went wrong'};
    }
  };

  const logout = async () => {
    try {
      const authCookie = await AsyncStorage.getItem('auth_cookie');

      if (authCookie) {
        const response = await axiosPost.post(
          '/api/atomService/secure/updateLogout',
          {},
          {
            headers: {
              Cookie: authCookie,
            },
          },
        );
      }
    } catch (error) {
      console.error('Logout API Error:', error.message);
    }

    await AsyncStorage.multiRemove([
      'auth_cookie',
      'user_mobile',
      'fcm_token',
      'user_info',
    ]);
    setUser(null);
  };

  const forgotPassword = async keyValue => {
    try {
      const response = await axiosPost.post(
        '/api/atomService/session/resetPassword',
        {
          keyValue,
        },
      );

      if (response?.data?.result === true) {
        return {success: true, message: response.data.Message};
      } else {
        const message = response?.data?.Message;
        throw new Error(message);
      }
    } catch (error) {
      throw error;
    }
  };

  const changePin = async (oldPin, newPin) => {
    try {
      const authCookie = await AsyncStorage.getItem('auth_cookie');

      const response = await axiosPost.post(
        '/api/atomService/secure/updatePINNo',
        {
          pinNo: newPin,
          prepinNo: oldPin,
        },
        {
          headers: {
            Cookie: authCookie,
          },
        },
      );
      if (response?.data?.result === true) {
        return response.data;
      } else {
        throw new Error(response?.data?.Message);
      }
    } catch (error) {
      console.error('Change PIN error:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{user, authLoading, login, logout, forgotPassword, changePin}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
