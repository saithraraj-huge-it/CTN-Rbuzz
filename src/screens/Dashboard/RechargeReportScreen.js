import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  RefreshControl,
} from 'react-native';
import InlineDateRangePicker from '../../components/ui/InlineDateRange';
import {Button} from '../../components/ui/Button';
import {useTheme} from '../../contexts/ThemeContext';
import {useData} from '../../contexts/DataProvider';
import dayjs from 'dayjs';
import Icons from '../../theme/IconsProvider';
import HistoryCard from './HistoryCard/PrePaidHisCard';
import Header from '../../components/layout/Header';

const RechargeReportScreen = ({navigation}) => {
  const {theme} = useTheme();
  const {getRechargeReport} = useData();

  const today = dayjs().format('YYYY-MM-DD');

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('start');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      const result = await getRechargeReport(today, today);
      setReports(result || []);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  const handleFilter = async () => {
    setLoading(true);
    const result = await getRechargeReport(startDate, endDate);
    setReports(result || []);
    setLoading(false);
  };

  const handleReset = async () => {
    setStartDate(today);
    setEndDate(today);
    setLoading(true);
    const result = await getRechargeReport(today, today);
    setReports(result || []);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await getRechargeReport(startDate, endDate);
    setReports(result || []);
    setRefreshing(false);
  };

  const renderHistoryItem = ({item}) => {
    const mappedItem = {
      INM: item.INM,
      ANM: item.ANM,
      SNM: item.SNM,
      CDT: item.CDT,
      SPN: item.SPN,
      MNO: item.MNO,
      AMT: item.AMT,
    };

    return <HistoryCard item={mappedItem} theme={theme} />;
  };

  const renderHistoryLoading = () => {
    return (
      <View style={{paddingVertical: 8, paddingHorizontal: 0}}>
        {Array.from({length: 10}).map((_, idx) => (
          <HistoryCard key={idx} loading theme={theme} />
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1" style={{backgroundColor: theme.colors.background}}>
      <Header
        title="Recharge Report"
        showBack
        alignTitleCenter={false}
        onBackPress={() => navigation.goBack()}
      />
      <View className="flex-1 p-4">
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
            gap: 6,
            flexWrap: 'nowrap',
          }}>
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
            }}>
            <Text
              numberOfLines={1}
              style={{
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily.medium,
                fontSize: theme.typography.fontSize.s,
              }}>
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
            }}>
            <Text
              numberOfLines={1}
              style={{
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily.medium,
                fontSize: theme.typography.fontSize.s,
              }}>
              {dayjs(endDate).format('DD-MM-YYYY')}
            </Text>
          </TouchableOpacity>

          <View style={{flexShrink: 1}}>
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
            }}>
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

        {loading ? (
          renderHistoryLoading()
        ) : (
          <FlatList
            className="mt-1"
            data={reports}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderHistoryItem}
            contentContainerStyle={{paddingBottom: 80}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 20,
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fontFamily.regular,
                  fontSize: theme.typography.fontSize.m,
                }}>
                No records found
              </Text>
            }
          />
        )}
      </View>
    </View>
  );
};

export default RechargeReportScreen;
