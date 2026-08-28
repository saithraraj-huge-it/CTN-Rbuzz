import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import InlineDateRangePicker from '../../components/ui/InlineDateRange';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataProvider';
import dayjs from 'dayjs';
import Icons from '../../theme/IconsProvider';
import Header from '../../components/layout/Header';
import ReportTable from '../../components/ui/ReportTable';

const PurchaseReportScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { getPurchaseReport } = useData();

 const today = dayjs().format('YYYY-MM-DD');


  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('start');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchReports(startDate, endDate);
  }, []);

  const fetchReports = async (from, to) => {
    setLoading(true);
    const result = await getPurchaseReport(from, to);
    setReports(result || []);
    setLoading(false);
  };

  const handleFilter = () => {
  console.log('Applying Filter:', startDate, endDate); 
  fetchReports(startDate, endDate);
};

  const handleReset = () => {
    setStartDate(today);
    setEndDate(today);
    fetchReports(today, today);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await getPurchaseReport(startDate, endDate);
    setReports(result || []);
    setRefreshing(false);
  };

  const headers = ['S.No', 'Date', 'Description', 'Opening', 'Credit', 'Debit', 'Closing'];


  const formatRowData = (item, index) => [
    index + 1,
    dayjs(item.EDT).format('DD-MM-YYYY'),
    item.DES,
    item.OPE?.toFixed?.(2) ?? '-',
    item.CRE?.toFixed?.(2) ?? '-',
    item.DEB?.toFixed?.(2) ?? '-',
    item.CLO?.toFixed?.(2) ?? '-',
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <Header
        title="Purchase Report"
        showBack
        alignTitleCenter={false}
        onBackPress={() => navigation.goBack()}
      />
{loading && reports.length === 0 ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  ) : (
      <View className="flex-1 p-4">
      
        <View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
    flexWrap: 'nowrap',
  }}
>
  <TouchableOpacity
    onPress={() => {
      setCurrentPicker('start');
      setPickerVisible(true);
    }}
    style={{
      flex: 1,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: theme.colors.primaryLight,
    }}
  >
    <Text
      numberOfLines={1}
      style={{
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: theme.typography.fontSize.s,
      }}
    >
      {dayjs(startDate).format('DD-MM-YYYY')}

    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => {
      setCurrentPicker('end');
      setPickerVisible(true);
    }}
    style={{
      flex: 1,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: theme.colors.primaryLight,
    }}
  >
    <Text
      numberOfLines={1}
      style={{
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily.medium,
        fontSize: theme.typography.fontSize.s,
      }}
    >
      {dayjs(endDate).format('DD-MM-YYYY')}

    </Text>
  </TouchableOpacity>

  <View style={{ flexShrink: 1 }}>
    <Button
      title="Apply"
      onPress={handleFilter}
      theme={theme}
      size="small"
    />
  </View>

  <TouchableOpacity
    onPress={handleReset}
    style={{
      width: 36,
      height: 36,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <Icons icon="ResetIcon" size={18} color={theme.colors.primary} />
  </TouchableOpacity>
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

        {reports.length === 0 && !loading ? (
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily.regular,
              fontSize:theme.typography.fontSize.m
            }}
          >
           No records found
          </Text>
        ) : (
          <View className="mt-1">
            <ReportTable
              headers={headers}
              data={reports}
              loading={loading}
              refreshing={refreshing}
              onRefresh={onRefresh}
              formatRowData={formatRowData}
            theme={theme}

            />
          </View>
        )}
      </View>
  )}
    </View>
  );
};

export default PurchaseReportScreen;
