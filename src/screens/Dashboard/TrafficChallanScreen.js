import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Dimensions, RefreshControl, Text, Animated, ActivityIndicator, Keyboard } from 'react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import RadioButtonGroup from '../../components/ui/RadioButtonGroup';
import { useTheme } from '../../contexts/ThemeContext';
import Header from '../../components/layout/Header';
import { useData } from '../../contexts/DataProvider';
import PinModal from '../../components/ui/PinModal';
import RechargeBottomSheet from '../../components/ui/BottomScreen';
import HistoryCard from './HistoryCard/PrePaidHisCard';
import { Easing } from 'react-native';
import NotificationEvents from '../../utils/NotificationEvents';
import Toast from 'react-native-toast-message';
import { validateAmount,validateMobile, validateServiceNumberFlexible } from '../../utils/validation';

const { height: screenHeight } = Dimensions.get('window');


const TrafficChallanScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { createTrafficChallan, getPendingTrafficChallan } = useData();

  const mobileRef = useRef(null);


  const [selectedOption, setSelectedOption] = useState('challan');
  const [form, setForm] = useState({
    mobile: '', challanNumber: '', vehicleNumber: '',
    engineNumber: '', chassisNumber: '', dlNumber: '',
    amount: ''
  });
  const [errors, setErrors] = useState({});
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinError, setPinError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingRecharges, setPendingRecharges] = useState([]);

  const [pendingLoading, setPendingLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [topLoading, setTopLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    fetchPendingRecharges();
  }, []);


  useEffect(() => {
  const refreshFromNotification = () => {
    fetchPendingRecharges(true);
  };

  NotificationEvents.on('getPendingRecharge', refreshFromNotification);

  return () => {
    NotificationEvents.off('getPendingRecharge', refreshFromNotification);
  };
}, []);


  useEffect(() => {
    if (!topLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [topLoading]);


  const fetchPendingRecharges = async (showRefreshing = false) => {
    showRefreshing ? setRefreshing(true) : setPendingLoading(true);
    try {
      const data = await getPendingTrafficChallan();
      setPendingRecharges(data || []);
    } catch (error) {
      console.error('Error fetching pending recharges:', error);
      setPendingRecharges([]);
    } finally {
      setPendingLoading(false);
      setRefreshing(false);
      setTopLoading(false)
    }
  };

  const update = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[field];  
      return updatedErrors;
    });
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setErrors({});
    setForm((prev) => ({
      ...prev,
      challanNumber: option === 'challan' ? prev.challanNumber : '',
      vehicleNumber: option === 'vehicle' ? prev.vehicleNumber : '',
      engineNumber: option === 'vehicle' ? prev.engineNumber : '',
      chassisNumber: option === 'vehicle' ? prev.chassisNumber : '',
      dlNumber: option === 'dl' ? prev.dlNumber : ''
    }));
  };



const validateForm = () => {
  const newErrors = {};

if (!validateMobile(form.mobile)) {
  newErrors.mobile = 'Please enter a valid 10-digit mobile number';
}


if (!validateAmount(form.amount, 10)) {
  newErrors.amount = 'Please enter a valid amount';
}


 if (selectedOption === 'challan') {
    if (!validateServiceNumberFlexible(form.challanNumber)) {
      newErrors.challanNumber =
        'Challan number is required';
    }
  }
  

  if (selectedOption === 'vehicle') {

  if (!form.vehicleNumber) {
  newErrors.vehicleNumber = 'Vehicle number is required';
}

  if (!validateServiceNumberFlexible(form.engineNumber)) {
  newErrors.engineNumber =
    'Engine Number is required';
}

if (!validateServiceNumberFlexible(form.chassisNumber)) {
  newErrors.chassisNumber = 'Chassis Number is required';
}


  }

if (selectedOption === 'dl') {
    if (!validateServiceNumberFlexible(form.dlNumber)) {
      newErrors.dlNumber =
        'DL Number is required';
    }
  }


  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = () => {
    if (!validateForm()) return;
    setPinModalVisible(true);
  };


  const handlePinSubmit = async (pinValue) => {
    if (!pinValue || pinValue.length !== 4) {
        setPinError('Please enter a 4-digit PIN');
        return;
    }

    setIsProcessing(true);
    setPinError('');

    const trafficChallanTypeId =
        selectedOption === 'vehicle' ? 2 :
        selectedOption === 'dl' ? 3 : 1;

    try {
        const result = await createTrafficChallan({
            trafficChallanTypeId,
            mobileNumber: form.mobile,
            challanNumber: form.challanNumber,
            vehicleNumber: form.vehicleNumber,
            engineNumber: form.engineNumber,
            chassisNumber: form.chassisNumber,
            DLNumber: form.dlNumber,
            amount: parseFloat(form.amount),
            pinNo: parseInt(pinValue)
        });

        if (result?.data?.result) {
            setPinModalVisible(false);
            Toast.show({
                type: 'success',
                text1: result?.Message,
                position: 'bottom',
            });

            resetForm();
            fetchPendingRecharges();

  Keyboard.dismiss();

  setTimeout(() => {
    mobileRef.current?.focus();
  }, 400);

        } else {
      const errorMsg = result?.Message || 'Transaction failed';
      setPinError(errorMsg);
      Toast.show({
        type: 'error',
        text1: errorMsg,
        position: 'bottom',
      });
      setPinModalVisible(true);
    }

  } catch (error) {
    const errorMsg = error?.Message || 'Something went wrong';
    setPinError(errorMsg);
    Toast.show({
      type: 'error',
      text1: errorMsg,
      position: 'bottom',
    });
    setPinModalVisible(true);
  } finally {
        setIsProcessing(false);
    }
};

  const resetForm = () => {
    setForm({
      mobile: '', challanNumber: '', vehicleNumber: '',
      engineNumber: '', chassisNumber: '', dlNumber: '',
      amount: ''
    });
    setErrors({});
    setSelectedOption('challan');
  };

    

  const renderHistoryItem = ({ item }) => {
    console.log(item,"resposneyrshhjb");
    
    const mappedItem = {
      MNO: item.MNO,           
      AMT: item.AMT,
      EDT: item.EDT,
      CDT: item.CDT,
      SPN: item.DES,
      INM: item.TCTN
    };

    return <HistoryCard item={mappedItem} theme={theme} />;
  };


  const renderEmptyHistory = () => (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 20 }}>
      <Text style={{ color: theme.colors.textSecondary, 
         fontFamily: theme.typography.fontFamily.regular,
                   fontSize:theme.typography.fontSize.m, textAlign: 'center' }}>
     No records found
      </Text>
    </View>
  );


  const renderHistoryContent = () => {
    if (pendingLoading && !refreshing) {
      return (
        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <HistoryCard key={idx} loading theme={theme} />
          ))}
        </View>
      );
    }

    return (
      <View style={{ flex: 1, marginTop: 16, paddingBottom: 100 }}>
        <FlatList
          data={pendingRecharges}
          keyExtractor={item => item.RID?.toString() || Math.random().toString()}
          renderItem={renderHistoryItem}
          ListEmptyComponent={renderEmptyHistory}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
                 onRefresh={() => {
      console.log('[PullRefresh] User triggered refresh');
      fetchPendingRecharges(true).then(() => {
        console.log('[PullRefresh] Refresh completed');
      });
    }}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={5}
          getItemLayout={(data, index) => ({
            length: 120,
            offset: 120 * index,
            index,
          })}
        />
      </View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <Header title="Traffic Challan" showBack onBackPress={() => navigation.goBack()} />
      <RechargeBottomSheet
        title="Pending Bills"
        theme={theme}
        collapsedHeight={screenHeight * 0.8}
        expandedHeight={100}
        isInitiallyExpanded={false}
        enableGestures
        swipeThreshold={60}
        velocityThreshold={0.4}
        animationTension={100}
        animationFriction={10}
        showTabs
        showHandle
        handleColor={theme.colors.textSecondary}
        bottomContent={renderHistoryContent()}
      >
        {topLoading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <RadioButtonGroup
              options={[
                { label: 'Challan', value: 'challan' },
                { label: 'Vehicle', value: 'vehicle' },
                { label: 'DL', value: 'dl' },
              ]}
              selected={selectedOption}
              onSelect={handleOptionChange}
              theme={theme}
            />
            <Input
            ref={mobileRef}
              placeholder="Mobile Number"
              value={form.mobile}
              onChangeText={update('mobile')}
              keyboardType="numeric"
              theme={theme}
              error={errors.mobile}
              maxLength={10}
            />

            {selectedOption === 'challan' && (
              <Input
                placeholder="Challan Number"
                value={form.challanNumber}
    onChangeText={(text) =>
      update('challanNumber')(
        text
          .toUpperCase()              
          .replace(/[^A-Z0-9]/g, '') 
      )
    }
                theme={theme}
                error={errors.challanNumber}
                keyboardType="default"
                maxLength={25}
              />
            )}

            {selectedOption === 'vehicle' && (
              <>
            <Input
  placeholder="Vehicle Number"
  value={form.vehicleNumber}
  onChangeText={(text) =>
    update('vehicleNumber')(
      text.toUpperCase().replace(/[^A-Z0-9]/g, '')
    )
  }
  theme={theme}
  error={errors.vehicleNumber}
  autoCapitalize="characters"
/>

                <Input
                  placeholder="Engine Number"
                  value={form.engineNumber}
                 
                   onChangeText={(text) =>
      update('engineNumber')(
        text
          .toUpperCase()              
          .replace(/[^A-Z0-9]/g, '') 
      )
    }
                  theme={theme}
                  error={errors.engineNumber}
                  maxLength={25}

                />
                <Input
                  placeholder="Chassis Number"
                  value={form.chassisNumber}
                  onChangeText={(text) =>
      update('chassisNumber')(
        text
          .toUpperCase()              
          .replace(/[^A-Z0-9]/g, '') 
      )
    }
                  theme={theme}
                  error={errors.chassisNumber}
                  maxLength={25}
                />
              </>
            )}

            {selectedOption === 'dl' && (
              <Input
                placeholder="DL Number"
                value={form.dlNumber}
                   onChangeText={(text) =>
      update('dlNumber')(
        text
          .toUpperCase()              
          .replace(/[^A-Z0-9]/g, '') 
      )
    }
                theme={theme}
                error={errors.dlNumber}
                maxLength={25}
              />
            )}

            <Input
              placeholder="Amount"
              value={form.amount}
              onChangeText={update('amount')}
              keyboardType="numeric"
              theme={theme}
              error={errors.amount}
            />

            <Button title="Proceed" onPress={handleSubmit} className="mt-3" theme={theme} />
          </Animated.View>
        )}
      </RechargeBottomSheet>
      <PinModal
        visible={pinModalVisible}
        onClose={() => setPinModalVisible(false)}
        pinError={pinError}
        isProcessing={isProcessing}
        theme={theme}
         onSubmit={enteredPin => handlePinSubmit(enteredPin)}
      />
    </View>
  );
};

export default TrafficChallanScreen;
