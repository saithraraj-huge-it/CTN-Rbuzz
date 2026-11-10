import {useState} from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';
import {Input} from '../../components/ui/Input';
import {Button} from '../../components/ui/Button';
import Header from '../../components/layout/Header';

const ForgotPasswordScreen = ({navigation}) => {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const {forgotPassword} = useAuth();
  const {theme} = useTheme();

  const validate = () => {
    const newErrors = {};
    if (!input || input.length < 6) {
      newErrors.input = 'Enter a valid registered mobile number or email.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const result = await forgotPassword(input);
      Alert.alert('Success', result.message || 'Reset link/OTP sent');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message || 'Reset password failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{backgroundColor: theme.colors.background}}>
      <Header
        title="Reset Password"
        showBack
        alignTitleCenter={false}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={{flexGrow: 1}} className="p-5">
        <View className="flex-1">
          <Input
            value={input}
            onChangeText={setInput}
            placeholder="Registered Mobile Number or Email"
            keyboardType="default"
            autoCapitalize="none"
            error={errors.input}
            theme={theme}
          />

          <Button
            title="Submit"
            onPress={handleForgotPassword}
            isLoading={isLoading}
            className="mt-3"
            theme={theme}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
