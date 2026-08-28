import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { useTheme } from '../contexts/ThemeContext';
import Icon from '../theme/IconsProvider';
import HomeScreen from '../screens/main/HomeScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import ReportScreen from '../screens/main/ReportScreen';
import { Dimensions, Platform } from 'react-native';

const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createSharedElementStackNavigator();
const ReportStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const NotificationsStack = createStackNavigator();

const { height } = Dimensions.get('window');

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
  </HomeStack.Navigator>
);

const ReportStackNavigator = () => (
  <ReportStack.Navigator screenOptions={{ headerShown: false }}>
    <ReportStack.Screen name="ReportMain" component={ReportScreen} />
  </ReportStack.Navigator>
);

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
    <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
  </SettingsStack.Navigator>
);

const NotificationsStackNavigator = () => (
  <NotificationsStack.Navigator screenOptions={{ headerShown: false }}>
    <NotificationsStack.Screen
      name="NotificationsMain"
      component={NotificationsScreen}
    />
  </NotificationsStack.Navigator>
);

const TabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarAllowFontScaling: false,
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: height * 0.012,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          height: height * 0.075,
          paddingBottom: Platform.OS === 'ios' ? height * 0.015 : height * 0.01,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'HomeFill' : 'Home';
              break;
            case 'Report':
              iconName = focused ? 'ChartFill' : 'ReportIcon';
              break;
            case 'Notifications':
              iconName = focused ? 'NotifyFill' : 'notifyicon';
              break;
            case 'Account':
              iconName = focused ? 'UserFill' : 'settingsicon';
              break;
            default:
              iconName = 'Home';
          }

          return <Icon icon={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Report" component={ReportStackNavigator} />
      <Tab.Screen
        name="Notifications"
        component={NotificationsStackNavigator}
      />
      <Tab.Screen name="Account" component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
};

const MainNavigator = () => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen name="Tabs" component={TabNavigator} />

  </RootStack.Navigator>
);

export default MainNavigator;
