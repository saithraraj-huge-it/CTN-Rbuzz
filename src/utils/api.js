import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthEvents from './AuthEvents';
import {serverStatusRef} from './serverStatusRef';

// const API_ENDPOINT = 'http://117.241.29.133:8086';

// const API_ENDPOINT = 'https://demo.ctnrbuzz.com';

// const API_ENDPOINT = 'http://demo.ctnrbuzz.com:8086/';

// const API_ENDPOINT = 'https://beta.ctnrbuzz.com';

const API_ENDPOINT = 'http://beta.ctnrbuzz.com:8086';

const SERVER_DOWN_MESSAGE =
  'Server is down. Please contact system administrator.';

const SESSION_EXPIRED_MESSAGE = 'Your session has expired. Please login again.';

let isLoggingOut = false;

export const axiosPost = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true,
});

export const axiosGet = axios.create({
  baseURL: API_ENDPOINT,
  headers: {'Content-Type': 'application/json'},
  withCredentials: true,
});

const attachAuthCookie = async config => {
  const authCookie = await AsyncStorage.getItem('auth_cookie');

  if (authCookie) {
    config.headers.Cookie = authCookie;
  }

  return config;
};

axiosPost.interceptors.request.use(attachAuthCookie);
axiosGet.interceptors.request.use(attachAuthCookie);

const callLogoutAPI = async () => {
  try {
    const authCookie = await AsyncStorage.getItem('auth_cookie');

    if (authCookie) {
      await axiosPost.post(
        '/api/atomService/secure/updateLogout',
        {},
        {
          headers: {
            Cookie: authCookie,
          },
        },
      );
    }
  } catch (logoutError) {
    console.warn('Logout API Error:', logoutError.message);
  }
};

const handleSessionExpired = async () => {
  if (isLoggingOut) return;

  isLoggingOut = true;

  // Call logout API first
  await callLogoutAPI();

  // Clear local storage
  await AsyncStorage.multiRemove([
    'auth_cookie',
    'user_mobile',
    'user_info',
    'fcm_token',
  ]);

  Toast.show({
    type: 'error',
    text1: SESSION_EXPIRED_MESSAGE,
    position: 'top',
  });

  AuthEvents.emit('logout');

  setTimeout(() => {
    isLoggingOut = false;
  }, 2000);
};

const responseSuccessHandler = async response => {
  const message = response?.data?.Message;

  if (
    message === 'No Authentication Information Found' ||
    message === 'Authentication Failed' ||
    message === 'Session Expired'
  ) {
    await handleSessionExpired();
  }

  return response;
};

const responseErrorHandler = async error => {
  if (error.response?.status === 401 || error.response?.status === 404) {
    await handleSessionExpired();
    return Promise.reject(error);
  }

  if (!error.response || error.response.status >= 500) {
    if (!isLoggingOut) {
      Toast.show({
        type: 'error',
        text1: SERVER_DOWN_MESSAGE,
        position: 'top',
      });

      if (serverStatusRef?.setServerDown) {
        serverStatusRef.setServerDown(true);
      }
    }

    return Promise.reject(error);
  }

  return Promise.reject(error);
};

axiosPost.interceptors.response.use(
  responseSuccessHandler,
  responseErrorHandler,
);

axiosGet.interceptors.response.use(
  responseSuccessHandler,
  responseErrorHandler,
);
