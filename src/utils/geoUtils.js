import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const getGeoLocation = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Location permission denied');
      }
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          resolve({latitude, longitude});
        },
        error => {
          console.error('Geolocation error:', error);
          reject(new Error('Failed to get location'));
        },
        {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000},
      );
    });
  } catch (error) {
    console.error('Permission or geolocation error:', error);
    return null;
  }
};
