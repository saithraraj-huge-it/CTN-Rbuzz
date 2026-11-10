import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useServerStatus} from '../contexts/ServerStatusContext';
import AuthEvents from '../utils/AuthEvents';
import LottieView from 'lottie-react-native';

const ServerDownScreen = () => {
  const {isServerDown, setServerDown} = useServerStatus();

  useEffect(() => {
    if (isServerDown) {
      const timer = setTimeout(() => {
        setServerDown(false);
        AuthEvents.emit('logout');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isServerDown]);

  if (!isServerDown) return null;

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/error.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.title}>Server is Down</Text>
      <Text style={styles.subtitle}>Please contact system administrator.</Text>
    </View>
  );
};

export default ServerDownScreen;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
  },
});
