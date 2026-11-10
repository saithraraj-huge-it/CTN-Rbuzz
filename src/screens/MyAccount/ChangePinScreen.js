'use client';

import {useState} from 'react';
import {View} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';
import {Input} from '../../components/ui/Input';
import {Button} from '../../components/ui/Button';
import Header from '../../components/layout/Header';

const ChangePinScreen = ({navigation}) => {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const {changePin} = useAuth();
  const {theme} = useTheme();

  const handleChangePin = async () => {
    let tempErrors = {};

    if (!oldPin) tempErrors.oldPin = 'Enter current PIN';
    if (!newPin) tempErrors.newPin = 'Enter new PIN';
    if (!confirmPin) tempErrors.confirmPin = 'Confirm your PIN';
    if (newPin && confirmPin && newPin !== confirmPin) {
      tempErrors.confirmPin = 'PINs do not match';
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      const res = await changePin(oldPin, newPin, confirmPin);

      if (res?.Message && !res.result) {
        setErrors(res.Message);
        return;
      }

      navigation.goBack();
    } catch (e) {
      setErrors({general: e.message || 'Something went wrong'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <Header
        title="Change PIN"
        showBack
        alignTitleCenter={false}
        onBackPress={() => navigation.goBack()}
      />

      <View style={{paddingHorizontal: 15, marginTop: 10}}>
        <Input
          value={oldPin}
          onChangeText={setOldPin}
          placeholder="Enter Current PIN"
          secureTextEntry
          keyboardType="numeric"
          error={errors.oldPin}
          theme={theme}
        />
        <Input
          value={newPin}
          onChangeText={setNewPin}
          placeholder="Enter New PIN"
          secureTextEntry
          keyboardType="numeric"
          error={errors.newPin}
          theme={theme}
        />
        <Input
          value={confirmPin}
          onChangeText={setConfirmPin}
          placeholder="Confirm New PIN"
          secureTextEntry
          keyboardType="numeric"
          error={errors.confirmPin}
          theme={theme}
        />

        <Button
          title="Change PIN"
          onPress={handleChangePin}
          isLoading={isLoading}
          style={{marginTop: 20}}
          theme={theme}
        />
      </View>
    </View>
  );
};

export default ChangePinScreen;
