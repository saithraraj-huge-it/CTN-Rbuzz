import React, {useEffect, useState} from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {useAuth} from '../contexts/AuthContext';
import {useConnectivity} from '../contexts/ConnectivityContext';
import SplashScreen from '../screens/SplashScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import NoInternetScreen from '../screens/NoInternetScreen';
import PrePaidScreen from '../screens/Dashboard/PrePaidScreen';
import PostPaidScreen from '../screens/Dashboard/PostPaidScreen';
import DTHScreen from '../screens/Dashboard/DTHScreen';
import ElectricityScreen from '../screens/Dashboard/ElectricityScreen';
import AddOnServiceScreen from '../screens/Dashboard/AddOnServiceScreen';
import WalletPurchaseScreen from '../screens/Dashboard/WalletPurchaseScreen';
import TrafficChallanScreen from '../screens/Dashboard/TrafficChallanScreen';
import ChannelScreen from '../screens/Dashboard/ChannelScreen';
import CableTvScreen from '../screens/Dashboard/CableTvScreen';
import RechargeReportScreen from '../screens/Dashboard/RechargeReportScreen';
import TotalSalesScreen from '../screens/Dashboard/TotalSalesScreen';
import PurchaseReportScreen from '../screens/Dashboard/PurchaseReportScreen';
import AccountScreen from '../screens/MyAccount/AccountScreen';
import ComplaintScreen from '../screens/MyAccount/ComplaintScreen';
import HelplineScreen from '../screens/MyAccount/HelplineScreen';
import ChangePinScreen from '../screens/MyAccount/ChangePinScreen';
import AccSettingsScreen from '../screens/MyAccount/AccSettingsScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createSharedElementStackNavigator();

const RootNavigator = () => {
  const {user, authLoading} = useAuth();
  const {isConnected} = useConnectivity();
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  if (!isConnected) return <NoInternetScreen />;
  if (authLoading || isSplashVisible) return <SplashScreen />;

  return (
     <SafeAreaView
    style={{ flex: 1, backgroundColor: '#FFFFFF' }}
    edges={['top', 'bottom']}
  >
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="PrepaidMobile" component={PrePaidScreen} />
          <Stack.Screen name="PostpaidMobile" component={PostPaidScreen} />
          <Stack.Screen name="DTHRecharge" component={DTHScreen} />
          <Stack.Screen name="ElectricityScreen" component={ElectricityScreen} />
          <Stack.Screen name="AddOnService" component={AddOnServiceScreen} />
          <Stack.Screen name="WalletPurchase" component={WalletPurchaseScreen} />
          <Stack.Screen name="TrafficChallan" component={TrafficChallanScreen}/>
          <Stack.Screen name="ChannelScreen" component={ChannelScreen} />
          <Stack.Screen name="CableTvScreen" component={CableTvScreen} />
          <Stack.Screen name="RechargeReport" component={RechargeReportScreen}/>
          <Stack.Screen name="TotalSales" component={TotalSalesScreen} />
          <Stack.Screen name="PurchaseReport" component={PurchaseReportScreen} />
          <Stack.Screen name="AccountScreen" component={AccountScreen} />
          <Stack.Screen name="ComplaintScreen" component={ComplaintScreen} />
          <Stack.Screen name="HelplineScreen" component={HelplineScreen} />
          <Stack.Screen name="ChangePinScreen" component={ChangePinScreen} />
          <Stack.Screen name="AccSettingsScreen" component={AccSettingsScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
    </SafeAreaView>
  );
};

export default RootNavigator;
