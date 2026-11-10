import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  FlatList,
  Text,
  RefreshControl,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {Easing} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';
import {Input} from '../../../components/ui/Input';
import {Button} from '../../../components/ui/Button';
import HistoryCard from '../../../screens/Dashboard/HistoryCard/PrePaidHisCard';
import PinModal from '../../../components/ui/PinModal';
import {useData} from '../../../contexts/DataProvider';
import Toast from 'react-native-toast-message';
import AnimatedDropdown from '../../../components/ui/AnimatedDropdown';
import NotificationEvents from '../../../utils/NotificationEvents';

const {height: screenHeight} = Dimensions.get('window');

function ComplaintRequestTab({navigation, onComplaintCreated}) {
  const {theme} = useTheme();
  const {createComplaint, getPendingComplaint, getComplaintTypes} = useData();

  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [pinError, setPinError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingRecharges, setPendingRecharges] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [topLoading, setTopLoading] = useState(true);
  const [complaintTypesOptions, setComplaintTypesOptions] = useState([]);
  const [selectedComplaintType, setSelectedComplaintType] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const refreshFromNotification = () => {
      fetchPendingComplaints(true);
    };

    NotificationEvents.on('getPendingRecharge', refreshFromNotification);

    return () => {
      NotificationEvents.off('getPendingRecharge', refreshFromNotification);
    };
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setTopLoading(true);

        const types = await getComplaintTypes();
        setComplaintTypesOptions(types || []);

        await fetchPendingComplaints(false);
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initializeData();
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

  const fetchPendingComplaints = async (showRefreshing = false) => {
    showRefreshing ? setRefreshing(true) : setPendingLoading(true);
    try {
      const data = await getPendingComplaint();
      setPendingRecharges(data || []);
    } catch (error) {
      console.error('Error fetching pending complaints:', error);
      setPendingRecharges([]);
    } finally {
      setPendingLoading(false);
      setRefreshing(false);
      setTopLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedComplaintType) {
      newErrors.complaintType = 'Please select a complaint type';
    }
    if (!description || description.trim() === '') {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
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
      complaintDetails: description,
      pin: enteredPin,
      complaintTypeId: selectedComplaintType?.value,
    };

    try {
      const response = await createComplaint(payload);
      if (response?.result) {
        setShowPinModal(false);
        Toast.show({
          type: 'success',
          text1: response.Message,
          position: 'top',
        });
        setDescription('');
        setErrors({});
        fetchPendingComplaints();
        if (onComplaintCreated) {
          onComplaintCreated();
        }
      } else {
        const errorMsg = response?.Message || 'Complaint creation failed';
        setPinError(errorMsg);
        Toast.show({
          type: 'error',
          text1: errorMsg,
          position: 'top',
        });
        setShowPinModal(true);
      }
    } catch (error) {
      const errorMsg = error?.Message || 'Something went wrong';
      setPinError(errorMsg);
      Toast.show({
        type: 'error',
        text1: errorMsg,
        position: 'top',
      });
      setShowPinModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderHistoryItem = ({item}) => {
    const mappedItem = {
      SPN: item.CTN,
      MNO: item.DET,
      SNM: item.SNM,
      CDT: item.CDT,
    };

    return <HistoryCard item={mappedItem} theme={theme} />;
  };

  const renderEmptyHistory = () => (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
      }}>
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontFamily: theme.typography.fontFamily.regular,
          fontSize: theme.typography.fontSize.m,
        }}>
        No records found
      </Text>
    </View>
  );

  const renderHistoryContent = () => {
    if (pendingLoading && !refreshing) {
      return (
        <View style={{paddingVertical: 10, alignItems: 'center'}}>
          {Array.from({length: 10}).map((_, idx) => (
            <HistoryCard key={idx} loading theme={theme} />
          ))}
        </View>
      );
    }

    return (
      <FlatList
        data={pendingRecharges}
        keyExtractor={(item, index) => item.RID?.toString() || index.toString()}
        renderItem={renderHistoryItem}
        ListEmptyComponent={renderEmptyHistory}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchPendingComplaints(true)}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        showsVerticalScrollIndicator={false}
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
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          padding: 16,
        }}>
        {topLoading ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <Animated.View
            style={{opacity: fadeAnim, transform: [{translateY: slideAnim}]}}>
            <AnimatedDropdown
              id="Complaint Type"
              placeholder="Select Complaint Type"
              options={complaintTypesOptions}
              selected={selectedComplaintType}
              setSelected={setSelectedComplaintType}
              onSelect={() =>
                setErrors(prev => ({...prev, complaintType: undefined}))
              }
              error={errors.complaintType}
              theme={theme}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />

            <Input
              value={description}
              onChangeText={setDescription}
              placeholder="Enter Description"
              multiline
              numberOfLines={6}
              error={errors.description}
              theme={theme}
            />
            <Button
              title="Proceed"
              className="mt-1"
              theme={theme}
              onPress={handleSubmit}
            />
          </Animated.View>
        )}

        <Text
          style={{
            fontSize: theme.typography.fontSize.m,
            fontFamily: theme.typography.fontFamily.medium,
            color: theme.colors.text,
            marginTop: 20,
            marginBottom: 16,
          }}>
          Pending Complaints
        </Text>

        {renderHistoryContent()}

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

export default ComplaintRequestTab;
