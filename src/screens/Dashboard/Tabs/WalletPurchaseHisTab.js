import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import InlineDateRangePicker from '../../../components/ui/InlineDateRange';
import { Button } from '../../../components/ui/Button';
import { useTheme } from '../../../contexts/ThemeContext';

const WalletPurchaseHisTab = ({ navigation }) => {
  const { theme } = useTheme();

  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('start');

  const formatDate = (date) => {
    if (!date) return 'Select Date';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getFullYear()}`;
  };

  const handleFilter = () => {
    console.log('Filtering from', startDate, 'to', endDate);
  };

  const reports = [
    {
      loginName: '902515****',
      mobileNumber: '883899****',
      rechargeType: 'Mobile',
      amount: '20.00',
      operator: 'BSNL',
      date: '04-10-2022 19:30:57',
      status: 'Success',
    },
    {
      loginName: '902515****',
      mobileNumber: '960064****',
      rechargeType: 'Mobile',
      amount: '99.00',
      operator: 'Airtel',
      date: '05-10-2022 18:35:20',
      status: 'Success',
    },
    {
      loginName: '902515****',
      mobileNumber: '904307****',
      rechargeType: 'Mobile',
      amount: '179.00',
      operator: 'Airtel',
      date: '06-10-2022 14:22:18',
      status: 'Success',
    },
  ];

 
  const renderCard = (item, index) => (
    <View
      key={index}
      className="rounded-xl p-3 mb-3 "
      style={{
        backgroundColor: theme.colors.card || '#fff',
        shadowColor: theme.colors.shadow || '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      {[
        ['Login Name', item.loginName],
        ['Mobile Number', item.mobileNumber],
        ['Recharge Type', item.rechargeType],
        ['Amount (Rs.)', item.amount],
        ['Operator', item.operator],
        ['Date', item.date],
        ['Status', item.status],
      ].map(([label, value], idx) => (
        <View key={idx} className="flex-row justify-between mb-1.5">
          <Text
            className="text-sm"
            style={{ color: theme.colors.text , fontFamily:theme.typography.fontFamily.regular}}
            allowFontScaling={false}
          >
            {label}
          </Text>
          <Text
            className="text-sm"
            style={{
              color: label === 'Status' ? theme.colors.success || 'green' : theme.colors.textSecondary,
              fontFamily:theme.typography.fontFamily.regular
            }}
            allowFontScaling={false}
          >
            {value}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
   
    <View className="flex-1 p-4" style={{ backgroundColor: theme.colors.background }}>
      <View className="flex-row justify-between items-center space-x-2">
        <TouchableOpacity
          onPress={() => {
            setCurrentPicker('start');
            setPickerVisible(true);
          }}
          className="py-2 px-5 min-w-[110px] rounded-lg items-center"
          style={{
            backgroundColor: theme.colors.surfaceVariant || '#e0f2f1',
          }}
        >
          <Text
            className="text-sm"
            style={{
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily.regular,
            }}
            allowFontScaling={false}
          >
            {formatDate(startDate)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setCurrentPicker('end');
            setPickerVisible(true);
          }}
          className="py-2 px-5 min-w-[110px] rounded-lg items-center"
          style={{
            backgroundColor: theme.colors.surfaceVariant || '#e0f2f1',
          }}
        >
          <Text
            className="text-sm"
            style={{
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily.regular,
            }}
            allowFontScaling={false}
          >
            {formatDate(endDate)}
          </Text>
        </TouchableOpacity>

        <Button title="Filter" onPress={handleFilter} theme={theme} size="small" />
      </View>

      {pickerVisible && (
        <InlineDateRangePicker
          startDate={startDate}
          endDate={endDate}
          currentPicker={currentPicker}
          setPickerVisible={setPickerVisible}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          theme={theme}
        />
      )}

      <ScrollView className="mt-5 p-1" showsVerticalScrollIndicator={false}>
        {reports.map((item, index) => renderCard(item, index))}
      </ScrollView>
    </View>
  );
};

export default WalletPurchaseHisTab;
