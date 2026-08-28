import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  RefreshControl,
  FlatList,
  Text,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import {Header} from '../../components/layout/Header';
import {useTheme} from '../../contexts/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {Input} from '../../components/ui/Input';
import {Button} from '../../components/ui/Button';
import AnimatedDropdown from '../../components/ui/AnimatedDropdown';
import RechargeBottomSheet from '../../components/ui/BottomScreen';
import PinModal from '../../components/ui/PinModal';
import HistoryCard from './HistoryCard/PrePaidHisCard';
import { useData } from '../../contexts/DataProvider';
import { Easing } from 'react-native'; 
import NotificationEvents from '../../utils/NotificationEvents';
import Toast from 'react-native-toast-message';
import { validateAmount } from '../../utils/validation';

const { height: screenHeight } = Dimensions.get("window")


function DTHScreen() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const { getPendingRecharge,getMasterOptions ,createRecharge, loading} = useData()
  const [dthNumber, setDthNumber] = useState('');
  const [rechargeAmt, setRechargeAmt] = useState('');
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
 const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState(["", "", "", ""])
  const [pinError, setPinError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [pendingRecharges, setPendingRecharges] = useState([])
  const [pendingLoading, setPendingLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
 const [topLoading, setTopLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

    const mobileInputRef = useRef(null);
  const amountInputRef = useRef(null);

   useEffect(() => {
      fetchPendingRecharges()
    }, [])


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
    console.log('[Notification] Recalling getPendingRecharge');
    fetchPendingRecharges(3);
  };

  NotificationEvents.on('getPendingRecharge', refreshFromNotification);

  return () => {
    NotificationEvents.off('getPendingRecharge', refreshFromNotification);
  };
}, []);
    

    const fetchPendingRecharges = async (showRefreshing = false) => {
      if (showRefreshing) setRefreshing(true)
      else setPendingLoading(true)
      try {
        const data = await getPendingRecharge(3)
        setPendingRecharges(data || [])
      } catch (error) {
        console.error("Error fetching pending recharges:", error)
        setPendingRecharges([])
      } finally {
        setPendingLoading(false)
        setRefreshing(false)
      setTopLoading(false);

      }
    }
   
  const validate = () => {
    const newErrors = {};
if (!dthNumber || !/^\d{1,16}$/.test(dthNumber)) {
  newErrors.dthNumber = "Please enter a valid DTH Number"
}

    if (!selectedOperator) {
      newErrors.operator = "Please select an operator"
    }
    
     if (!validateAmount(rechargeAmt, 10)) {
      newErrors.rechargeAmt = 'Please enter a valid amount';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = () => {
    if (!validate()) return
    setPinError("")
    setPin(["", "", "", ""])
    setShowPinModal(true)
  }

  const handleRecharge = async (enteredPin) => {
  if (!enteredPin || enteredPin.length !== 4) {
    setPinError("Please enter complete 4-digit PIN")
    return
  }

  setIsProcessing(true)

  const payload = {
    itemId: selectedOperator.value,
    mobileNo: dthNumber,
    amount: Number.parseFloat(rechargeAmt),
    pin: enteredPin,
  }

  try {
    const response = await createRecharge(payload)
    if (response?.data?.result) {
      setShowPinModal(false)
             
 Toast.show({
  type: 'success',
  text1: response.Message,
 position: 'bottom',
});
      setDthNumber("")
      setRechargeAmt("")
      setSelectedOperator(null)
      setErrors({})
      fetchPendingRecharges()

  Keyboard.dismiss();

  setTimeout(() => {
    mobileInputRef.current?.focus();
  }, 300);
      
    }  else {
      const message = response?.Message || "Transaction failed";
      setPinError(message);

      Toast.show({
        type: 'error',
        text1: message,
        position: 'bottom',
      });
    }
  } catch (error) {
    const message = error?.Message || "Something went wrong";
    setPinError(message);

    Toast.show({
      type: 'error',
      text1: message,
      position: 'bottom',
    });
  } finally {
    setIsProcessing(false)
  }
}

 
  const renderHistoryItem = ({ item }) => <HistoryCard item={item} theme={theme}  />

  const renderEmptyHistory = () => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          color: theme.colors.textSecondary,
           fontFamily: theme.typography.fontFamily.regular,
                   fontSize:theme.typography.fontSize.m,
          textAlign: "center",
        }}
      >
      No records found
      </Text>
    </View>
  )

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
          keyExtractor={(item) => item.RID?.toString() || Math.random().toString()}
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
      console.log('[PullRefresh] User triggered refresh');
      await fetchPendingRecharges(true);
      console.log('[PullRefresh] Refresh completed');
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
    )
  }
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setActiveDropdown(null);
      }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Header title="DTH" showBack alignTitleCenter={false} onBackPress={() => navigation.goBack()} />
        <RechargeBottomSheet
          title="Pending Recharge"
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
          bottomContent={renderHistoryContent()}
        >
        {topLoading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : (
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              
       <Input
              ref={mobileInputRef}
  value={dthNumber}
  onChangeText={text => {
    const numericText = text.replace(/[^0-9]/g, '');
    setDthNumber(numericText);
    setErrors(prev => ({ ...prev, dthNumber: undefined }));
  }}
  placeholder="DTH Number"
  keyboardType="numeric"
  autoCapitalize="none"
  error={errors.dthNumber}
  theme={theme}
  onFocus={() => setActiveDropdown(null)}
  maxLength={16}
/>

          <AnimatedDropdown
            id="operator"
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            placeholder="Select Operator"
            options={getMasterOptions(3)}
            selected={selectedOperator}
            setSelected={setSelectedOperator} 
            onSelect={item => {
              setErrors(prev => ({...prev, operator: undefined}));
            }}
                nextInputRef={amountInputRef} 

            error={errors.operator}
            theme={theme}
          />

          <Input
              ref={amountInputRef} 
            value={rechargeAmt}
            onChangeText={text => {
              setRechargeAmt(text);
              setErrors(prev => ({...prev, rechargeAmt: undefined}));
            }}
            placeholder="Recharge amount ₹"
            keyboardType="numeric"
            autoCapitalize="none"
            error={errors.rechargeAmt}
            theme={theme}
            onFocus={() => setActiveDropdown(null)}
          />

         

          <Button
            title="Continue"
            className="mt-3"
            theme={theme}
            onPress={handleSubmit}
            disabled={loading}
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
          onSubmit={(enteredPin) => handleRecharge(enteredPin)}
         />

      </View>
    </TouchableWithoutFeedback>
  );
}

export default DTHScreen;
