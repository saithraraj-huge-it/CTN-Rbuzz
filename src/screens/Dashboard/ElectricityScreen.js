import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  RefreshControl,
  Text,
  FlatList,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {Header} from '../../components/layout/Header';
import {useTheme} from '../../contexts/ThemeContext';
import {Input} from '../../components/ui/Input';
import {Button} from '../../components/ui/Button';
import AnimatedDropdown from '../../components/ui/AnimatedDropdown';
import RechargeBottomSheet from '../../components/ui/BottomScreen';
import HistoryCard from './HistoryCard/PrePaidHisCard';
import {useData} from '../../contexts/DataProvider';
import PinModal from '../../components/ui/PinModal';
import {Easing} from 'react-native';
import NotificationEvents from '../../utils/NotificationEvents';
import Toast from 'react-native-toast-message';
import {
  validateAmount,
  validateEmail,
  validateMobile,
  validateServiceNumberFlexible,
} from '../../utils/validation';

const {height: screenHeight} = Dimensions.get('window');

function ElectricityScreen({navigation}) {
  const {theme} = useTheme();
  const {getPendingService, getMasterOptions, createElectricityService} =
    useData();

  const [serviceNumber, setServiceNumber] = useState('');
  const [rechargeAmt, setRechargeAmt] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [enterPin, setEnterPin] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [pinError, setPinError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingRecharges, setPendingRecharges] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [topLoading, setTopLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const serviceNumberRef = useRef(null);
  const amountRef = useRef(null);
  const customerNameRef = useRef(null);
  const contactNumberRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    fetchPendingRecharges();
  }, []);

  useEffect(() => {
    const handleNotification = () => {
      fetchPendingRecharges(true);
    };

    NotificationEvents.on('getPendingRecharge', handleNotification);

    return () => {
      NotificationEvents.off('getPendingRecharge', handleNotification);
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

  useEffect(() => {
    const refreshFromNotification = () => {
      fetchPendingRecharges(4);
    };

    NotificationEvents.on('getPendingRecharge', refreshFromNotification);

    return () => {
      NotificationEvents.off('getPendingRecharge', refreshFromNotification);
    };
  }, []);

  const fetchPendingRecharges = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setPendingLoading(true);
    try {
      const data = await getPendingService(4);
      setPendingRecharges(data || []);
    } catch (error) {
      console.error('Error fetching pending services:', error);
      setPendingRecharges([]);
    } finally {
      setPendingLoading(false);
      setRefreshing(false);
      setTopLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedProvider) newErrors.provider = 'Provider is required';

    if (!validateServiceNumberFlexible(serviceNumber, 1, 25)) {
      newErrors.serviceNumber = 'Service number is required';
    }

    if (!validateAmount(rechargeAmt, 10)) {
      newErrors.rechargeAmt = 'Please enter a valid amount';
    }

    if (!customerName?.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!validateMobile(contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setPinError('');
    setPin(['', '', '', '']);

    setShowPinModal(true);
  };

  const handleRecharge = async enteredPin => {
    if (!enteredPin || enteredPin.length !== 4) {
      setPinError('Please enter complete 4-digit PIN');
      return;
    }

    setIsProcessing(true);

    const payload = {
      itemId: selectedProvider.value,
      serviceNumber,
      rechargeAmt,
      enteredPin,
      contactNumber,
      customerName,
      email,
    };

    try {
      const response = await createElectricityService(payload);

      if (response?.result) {
        setShowPinModal(false);
        Toast.show({
          type: 'success',
          text1: response.Message,
          position: 'top',
        });

        setServiceNumber('');
        setRechargeAmt('');
        setCustomerName('');
        setContactNumber('');
        setEmail('');
        setEnterPin('');
        setSelectedProvider(null);
        setErrors({});
        fetchPendingRecharges();

        Keyboard.dismiss();

        setTimeout(() => {
          serviceNumberRef.current?.focus();
        }, 400);
      } else {
        const message = response?.Message || 'Transaction failed';
        setPinError(message);

        Toast.show({
          type: 'error',
          text1: message,
          position: 'top',
        });
      }
    } catch (error) {
      const message = error?.Message || 'Something went wrong';
      setPinError(message);

      Toast.show({
        type: 'error',
        text1: message,
        position: 'top',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderHistoryItem = ({item}) => (
    <HistoryCard item={item} theme={theme} />
  );

  const renderEmptyHistory = () => (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
      }}>
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontFamily: theme.typography.fontFamily.regular,
          fontSize: theme.typography.fontSize.m,
          textAlign: 'center',
        }}>
        No records found
      </Text>
    </View>
  );

  const renderHistoryContent = () => {
    if (pendingLoading && !refreshing) {
      return (
        <View style={{paddingVertical: 20, alignItems: 'center'}}>
          {Array.from({length: 5}).map((_, idx) => (
            <HistoryCard key={idx} loading theme={theme} />
          ))}
        </View>
      );
    }

    return (
      <View style={{flex: 1, marginTop: 16, paddingBottom: 100}}>
        <FlatList
          data={pendingRecharges}
          keyExtractor={item =>
            item.RID?.toString() || Math.random().toString()
          }
          renderItem={renderHistoryItem}
          ListEmptyComponent={renderEmptyHistory}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                await fetchPendingRecharges(true);
              }}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          removeClippedSubviews={true}
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
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setActiveDropdown(null);
      }}>
      <View style={{flex: 1, backgroundColor: theme.colors.background}}>
        <Header
          title="Electricity"
          showBack
          alignTitleCenter={false}
          onBackPress={() => navigation.goBack()}
        />
        <RechargeBottomSheet
          title="Pending Bills"
          theme={theme}
          collapsedHeight={screenHeight * 0.8}
          expandedHeight={100}
          isInitiallyExpanded={false}
          enableGestures={true}
          swipeThreshold={60}
          velocityThreshold={0.4}
          animationTension={100}
          animationFriction={10}
          showTabs={true}
          showHandle={true}
          handleColor={theme.colors.textSecondary}
          bottomContent={renderHistoryContent()}>
          {topLoading ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
              }}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : (
            <Animated.View
              style={{opacity: fadeAnim, transform: [{translateY: slideAnim}]}}>
              <AnimatedDropdown
                id="provider"
                placeholder="Select Service Provider"
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                options={getMasterOptions(4)}
                selected={selectedProvider}
                setSelected={setSelectedProvider}
                onSelect={item => {
                  setErrors(prev => ({...prev, provider: undefined}));
                }}
                nextInputRef={serviceNumberRef}
                error={errors.provider}
                theme={theme}
              />

              <Input
                ref={serviceNumberRef}
                value={serviceNumber}
                // onChangeText={text => {
                //   setServiceNumber(text);
                //   setErrors(prev => ({ ...prev, serviceNumber: undefined }));
                // }}
                onChangeText={text => {
                  const cleanedText = text.replace(/[^a-zA-Z0-9]/g, '');
                  setServiceNumber(cleanedText);
                  setErrors(prev => ({...prev, serviceNumber: undefined}));
                }}
                placeholder="Enter Service Number"
                keyboardType="default"
                autoCapitalize="none"
                error={errors.serviceNumber}
                theme={theme}
                onFocus={() => setActiveDropdown(null)}
                maxLength={25}
              />

              <Input
                ref={amountRef}
                value={rechargeAmt}
                onChangeText={text => {
                  setRechargeAmt(text);
                  setErrors(prev => ({...prev, rechargeAmt: undefined}));
                }}
                placeholder="Enter Amount ₹"
                keyboardType="numeric"
                autoCapitalize="none"
                error={errors.rechargeAmt}
                theme={theme}
                onFocus={() => setActiveDropdown(null)}
              />

              <Input
                ref={customerNameRef}
                value={customerName}
                onChangeText={text => {
                  setCustomerName(text);
                  setErrors(prev => ({...prev, customerName: undefined}));
                }}
                placeholder="Enter Customer Name"
                autoCapitalize="words"
                error={errors.customerName}
                theme={theme}
                onFocus={() => setActiveDropdown(null)}
              />

              <Input
                ref={contactNumberRef}
                value={contactNumber}
                onChangeText={text => {
                  setContactNumber(text);
                  setErrors(prev => ({...prev, contactNumber: undefined}));
                }}
                placeholder="Enter Contact Number"
                keyboardType="numeric"
                error={errors.contactNumber}
                theme={theme}
                onFocus={() => setActiveDropdown(null)}
                maxLength={10}
              />

              <Input
                ref={emailRef}
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setErrors(prev => ({...prev, email: undefined}));
                }}
                placeholder="Enter Email ID"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                theme={theme}
                onFocus={() => setActiveDropdown(null)}
              />

              <Button
                className="mt-3"
                title="Pay Bill"
                theme={theme}
                onPress={handleSubmit}
              />
            </Animated.View>
          )}
        </RechargeBottomSheet>
        <PinModal
          visible={showPinModal}
          onClose={() => setShowPinModal(false)}
          pinError={pinError}
          isProcessing={isProcessing}
          theme={theme}
          onSubmit={enteredPin => handleRecharge(enteredPin)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default ElectricityScreen;
