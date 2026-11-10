import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {Header} from '../../components/layout/Header';
import {useTheme} from '../../contexts/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import Icon from '../../theme/IconsProvider';

const reports = [
  {
    title: 'Recharge Report',
    icon: 'RechargeReportIcon',
    screen: 'RechargeReport',
  },
  {
    title: 'Sale Report',
    icon: 'SalesReportIcon',
    screen: 'TotalSales',
  },
  {
    title: 'Purchase Report',
    icon: 'PurchaseReportIcon',
    screen: 'PurchaseReport',
  },
];

export default function ReportScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();

  const renderCard = ({title, icon, screen}) => (
    <TouchableOpacity
      key={title}
      className="mb-2 p-4 rounded-2xl"
      style={{
        backgroundColor: theme.colors.card,
        shadowColor: theme.colors.shadow,
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 2},
        elevation: 2,
      }}
      onPress={() => navigation.navigate(screen)}>
      <View className="flex-row items-center">
        <View
          className="w-10 h-10 mr-2 rounded-full justify-center items-center"
          style={{backgroundColor: `${theme.colors.primary}20`}}>
          <Icon icon={icon} size={28} />
        </View>
        <View className="flex-1">
          <Text
            style={{
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.fontSize.m,
            }}
            allowFontScaling={false}>
            {title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1" style={{backgroundColor: theme.colors.background}}>
      <Header title="Reports" showBack={false} />
      <ScrollView className="px-2 py-4">{reports.map(renderCard)}</ScrollView>
    </View>
  );
}
