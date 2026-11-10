import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {Header} from '../../components/layout/Header';
import {TabView} from '../../components/ui/TabView';
import CableRechargeTab from './Tabs/CableRechargeTab';
import CableHistory from './Tabs/CableHistory';

const CableTvScreen = ({navigation}) => {
  const {theme} = useTheme();

  const tabs = [
    {key: 'Recharge', title: 'Recharge', component: CableRechargeTab},
    {key: 'History', title: 'History', component: CableHistory},
  ];

  return (
    <View className="flex-1" style={{backgroundColor: theme.colors.background}}>
      <Header
        title="SGS Cable Tv"
        showBack
        alignTitleCenter={false}
        onBackPress={() => navigation.goBack()}
      />
      {/* <TabView tabs={tabs} /> */}
    </View>
  );
};

export default CableTvScreen;
