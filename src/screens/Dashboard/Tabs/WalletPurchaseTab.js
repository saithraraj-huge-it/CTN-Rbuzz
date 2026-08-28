import React, {useState} from 'react';
import {
  ScrollView,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';
import {Input} from '../../../components/ui/Input';
import {Button} from '../../../components/ui/Button';
import AnimatedDropdown from '../../../components/ui/AnimatedDropdown';

const WalletPurchaseTab = ({navigation}) => {
  const {theme} = useTheme();

  const [mobile, setMobile] = useState('');
  const [walletAmt, setWalletAmt] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [transferRate, setTransferRate] = useState('');
  const [enterPin, setEnterPin] = useState('');
  const [remark, setRemark] = useState('');
  const [errors, setErrors] = useState({});

  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleSubmit = () => {
    const newErrors = {};

    if (!mobile) newErrors.mobile = 'Mobile number is required';
    if (!walletAmt) newErrors.walletAmt = 'Amount is required';
    if (!transactionId) newErrors.transactionId = 'Transaction ID is required';
    if (!transferRate) newErrors.transferRate = 'Transfer rate is required';
    if (!enterPin) newErrors.enterPin = 'PIN is required';
    if (!remark) newErrors.remark = 'Remark is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Submit wallet purchase');
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setActiveDropdown(null);
      }}>
      <View className="flex-1">
        <ScrollView
          contentContainerStyle={{padding: 16}}
          keyboardShouldPersistTaps="handled">
          <AnimatedDropdown
            id="category"
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            placeholder="Select Category"
            options={[
              {label: 'Prepaid', value: 'prepaid'},
              {label: 'Postpaid', value: 'postpaid'},
              {label: 'DTH', value: 'dth'},
            ]}
            onSelect={item => console.log('Selected category:', item)}
              error={errors.operator}
            theme={theme}
          />

          <AnimatedDropdown
            id="retailer"
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            placeholder="Select Retailer"
            options={[
              {label: 'Retailer A', value: 'a'},
              {label: 'Retailer B', value: 'b'},
            ]}
            onSelect={item => console.log('Selected retailer:', item)}
              error={errors.operator}
            theme={theme}
          />

          <AnimatedDropdown
            id="bank"
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            placeholder="Select Bank"
            options={[
              {label: 'Bank A', value: 'a'},
              {label: 'Bank B', value: 'b'},
            ]}
            onSelect={item => console.log('Selected bank:', item)}
              error={errors.operator}
            theme={theme}
          />

          <Input
            value={mobile}
            onChangeText={setMobile}
            placeholder="Enter your mobile number"
            keyboardType="numeric"
            autoCapitalize="none"
            error={errors.mobile}
            theme={theme}
            onFocus={() => setActiveDropdown(null)}
          />
          <Input
            value={walletAmt}
            onChangeText={setWalletAmt}
            placeholder="Amount ₹"
            keyboardType="numeric"
            autoCapitalize="none"
            error={errors.walletAmt}
            theme={theme}
            onFocus={() => setActiveDropdown(null)}
          />
          <Input
            value={transactionId}
            onChangeText={setTransactionId}
            placeholder="Transaction ID"
            keyboardType="default"
            autoCapitalize="none"
            error={errors.transactionId}
            theme={theme}
            onFocus={() => setActiveDropdown(null)}
          />
          <Input
            value={transferRate}
            onChangeText={setTransferRate}
            placeholder="Transfer Rate"
            keyboardType="numeric"
            autoCapitalize="none"
            error={errors.transferRate}
            theme={theme}
            onFocus={() => setActiveDropdown(null)}
          />
          <Input
            value={enterPin}
            onChangeText={setEnterPin}
            placeholder="Enter PIN"
            secureTextEntry
            error={errors.enterPin}
            theme={theme}
            onFocus={() => setActiveDropdown(null)}
          />
          <Input
            value={remark}
            onChangeText={setRemark}
            placeholder="Remarks"
            error={errors.remark}
            theme={theme}
            onFocus={() => setActiveDropdown(null)}
          />

          <Button
            title="Add Wallet"
            className="mt-4"
            onPress={handleSubmit}
            theme={theme}
          />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default WalletPurchaseTab;
