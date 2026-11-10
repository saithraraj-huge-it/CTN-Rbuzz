import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {Header} from '../../components/layout/Header';
import {TabView} from '../../components/ui/TabView';
import WalletPurchaseTab from '../Dashboard/Tabs/WalletPurchaseTab';
import WalletPurchaseHisTab from '../Dashboard/Tabs/WalletPurchaseHisTab';

const WalletPurchaseScreen = ({navigation}) => {
  const {theme} = useTheme();

  const tabs = [
    {
      key: 'WalletPurchase',
      title: 'Wallet Purchase',
      component: WalletPurchaseTab,
    },
    {
      key: 'WalletPurchaseHisTab',
      title: 'Wallet Purchase History',
      component: WalletPurchaseHisTab,
    },
  ];

  return (
    <View className="flex-1" style={{backgroundColor: theme.colors.background}}>
      <Header
        title="E-Wallet Purchase"
        showBack
        alignTitleCenter={false}
        onBackPress={() => navigation.goBack()}
      />
      {/* <TabView tabs={tabs} /> */}
    </View>
  );
};

export default WalletPurchaseScreen;
