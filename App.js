import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './src/contexts/AuthContext';
import {ConnectivityProvider} from './src/contexts/ConnectivityContext';
import RootNavigator from './src/navigation/RootNavigator';
import {ThemeProvider, useTheme} from './src/contexts/ThemeContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {DataProvider} from './src/contexts/DataProvider';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import NotificationEvents from './src/utils/NotificationEvents';
import Toast from 'react-native-toast-message';
import toastConfig from './src/utils/toastConfig.js';
import {StatusBar} from 'react-native';
import ServerDownScreen from './src/screens/ServerDownScreen.js';
import {ServerStatusProvider} from './src/contexts/ServerStatusContext.js';

export default function App() {
  const [loading, setLoading] = useState(true);
  const {theme} = useTheme();

  const onMessageReceived = async remoteMessage => {
    const apiToTrigger = remoteMessage.data?.api;

    if (apiToTrigger) {
      NotificationEvents.emit(apiToTrigger);
    }

    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: remoteMessage.notification?.title || 'New Notification',
      body: remoteMessage.notification?.body || '',
      android: {
        channelId,
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
      },
    });
  };

  // Firebase listeners
  useEffect(() => {
    // Foreground
    const unsubscribeOnMessage = messaging().onMessage(onMessageReceived);

    // Background handler (for headless task)
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.warn('Background FCM:', remoteMessage);
    });

    return () => {
      unsubscribeOnMessage();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider>
        <ServerStatusProvider>
          <ConnectivityProvider>
            <NavigationContainer>
              <AuthProvider>
                <DataProvider>
                  <SafeAreaProvider>
                    <StatusBar backgroundColor={theme.colors.background} />
                    <RootNavigator />
                    <ServerDownScreen />
                    <Toast config={toastConfig} />
                  </SafeAreaProvider>
                </DataProvider>
              </AuthProvider>
            </NavigationContainer>
          </ConnectivityProvider>
        </ServerStatusProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
