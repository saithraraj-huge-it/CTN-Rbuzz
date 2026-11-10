import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Dimensions,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';
import {Input} from '../../components/ui/Input';
import {Button} from '../../components/ui/Button';
import Icon from '../../theme/IconsProvider';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {SafeAreaView} from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';

const {height: screenHeight} = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [storedMobile, setStoredMobile] = useState('');
  const [storedPassword, setStoredPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const {login} = useAuth();
  const {theme} = useTheme();
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    const requestPermissionAndGetToken = async () => {
      try {
        if (Platform.OS === 'android') {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
        }

        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const token = await messaging().getToken();
          setFcmToken(token);
        }
      } catch (error) {
        console.warn('FCM Permission Error:', error);
      }
    };

    requestPermissionAndGetToken();
  }, []);

  useEffect(() => {
    const generateCaptcha = () => {
      const newCaptcha = Math.floor(100000 + Math.random() * 900000).toString();
      setCaptcha(newCaptcha);
    };

    const loadStoredCredentials = async () => {
      try {
        const savedMobile = await AsyncStorage.getItem('storedMobile');
        const savedPassword = await AsyncStorage.getItem('storedPassword');

        if (savedMobile && savedPassword) {
          setStoredMobile(savedMobile);
          setStoredPassword(savedPassword);
          setMobile(savedMobile);
          setPassword(savedPassword);
        }
      } catch (error) {
        console.warn('Error loading stored credentials', error);
      }
    };

    generateCaptcha();
    loadStoredCredentials();
  }, []);

  const refreshCaptcha = () => {
    const newCaptcha = Math.floor(100000 + Math.random() * 900000).toString();
    setCaptcha(newCaptcha);
    setCaptchaInput('');
  };

  const handleRememberMeToggle = value => {
    setRememberMe(value);

    if (!value) {
      setMobile('');
      setPassword('');
    } else {
      if (storedMobile && storedPassword) {
        setMobile(storedMobile);
        setPassword(storedPassword);
      }
    }
  };

  const handleLogin = async () => {
    setErrors({});
    let hasError = false;
    let fieldErrors = {};

    if (!mobile.trim()) {
      fieldErrors.mobile = 'Enter registered mobile number';
      hasError = true;
    }

    if (!password.trim()) {
      fieldErrors.password = 'Enter login password';
      hasError = true;
    }

    if (!captchaInput.trim()) {
      fieldErrors.captcha = 'Enter captcha';
      hasError = true;
    } else if (captchaInput !== captcha) {
      fieldErrors.captcha = 'Captcha does not match';
      hasError = true;
    }

    if (hasError) {
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const response = await login(mobile, password, fcmToken);
    setIsLoading(false);

    if (response.success) {
      if (rememberMe) {
        await AsyncStorage.setItem('storedMobile', mobile);
        await AsyncStorage.setItem('storedPassword', password);
        setStoredMobile(mobile);
        setStoredPassword(password);
      }

      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    } else {
      const apiMessage = response.message;
      if (apiMessage.toLowerCase().includes('mobile')) {
        setErrors({mobile: apiMessage});
      } else if (apiMessage.toLowerCase().includes('password')) {
        setErrors({password: apiMessage});
      } else {
        Alert.alert('Error', apiMessage);
      }
    }
  };

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';

    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1}}>
            <ScrollView
              style={{flex: 1}}
              contentContainerStyle={{
                flexGrow: 1,
                paddingHorizontal: 20,
                paddingTop: 0,
                paddingBottom: 40,
              }}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <View style={{width: '100%', maxWidth: 400}}>
                  <View
                    style={{
                      alignItems: 'center',
                      marginBottom: keyboardVisible ? 12 : 28,
                    }}>
                    <Icon icon="LoginLogo" size={140} />

                    <Text
                      style={{
                        color: theme.colors.primary,
                        fontFamily: theme.typography.fontFamily.bold,
                        fontSize: theme.typography.fontSize.m,
                        marginTop: keyboardVisible ? -5 : -12,
                      }}
                      allowFontScaling={false}>
                      Welcome!
                    </Text>

                    {!keyboardVisible && (
                      <Text
                        style={{
                          color: theme.colors.text,
                          fontFamily: theme.typography.fontFamily.regular,
                          fontSize: theme.typography.fontSize.m,
                          marginTop: 8,
                          textAlign: 'center',
                        }}
                        allowFontScaling={false}>
                        Hey! Sign in to enjoy the service
                      </Text>
                    )}
                  </View>

                  <Input
                    label="Enter Registered Mobile Number"
                    value={mobile}
                    onChangeText={text => {
                      setMobile(text);
                      if (errors.mobile)
                        setErrors(prev => ({...prev, mobile: ''}));
                    }}
                    placeholder="Enter your mobile number"
                    keyboardType="numeric"
                    autoCapitalize="none"
                    error={errors.mobile}
                    theme={theme}
                    maxLength={10}
                  />

                  <Input
                    label="Enter Login Password"
                    value={password}
                    onChangeText={text => {
                      setPassword(text);
                      if (errors.password)
                        setErrors(prev => ({...prev, password: ''}));
                    }}
                    placeholder="Enter your password"
                    secureTextEntry
                    error={errors.password}
                    theme={theme}
                  />

                  <View style={{marginTop: 6, flexDirection: 'row'}}>
                    <View
                      style={{
                        backgroundColor: theme.colors.primary,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 10,
                        minWidth: 150,
                        height: 55,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: theme.colors.background,
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}
                        allowFontScaling={false}>
                        {captcha}
                      </Text>
                      <TouchableOpacity
                        onPress={refreshCaptcha}
                        style={{marginLeft: 15}}>
                        <Icon icon="RefreshIcon" size={25} />
                      </TouchableOpacity>
                    </View>

                    <View style={{flex: 1, marginLeft: 12}}>
                      <Input
                        value={captchaInput}
                        onChangeText={text => {
                          setCaptchaInput(text);
                          if (errors.captcha)
                            setErrors(prev => ({...prev, captcha: ''}));
                        }}
                        placeholder="Enter Captcha"
                        keyboardType="numeric"
                        theme={theme}
                        error={errors.captcha}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      marginBottom: 18,
                    }}>
                    <Text
                      style={{
                        color: theme.colors.text,
                        fontFamily: theme.typography.fontFamily.regular,
                        fontSize: 14,
                        marginRight: 8,
                      }}
                      allowFontScaling={false}>
                      Remember Me
                    </Text>

                    <BouncyCheckbox
                      isChecked={rememberMe}
                      onPress={handleRememberMeToggle}
                      text=""
                      disableText
                      size={20}
                      fillColor="#219653"
                      unFillColor="#FFFFFF"
                      iconStyle={{
                        borderRadius: 4,
                        borderColor: '#219653',
                      }}
                      innerIconStyle={{
                        borderRadius: 4,
                      }}
                      style={{
                        width: 20,
                        margin: 0,
                        padding: 0,
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={{alignSelf: 'center', marginTop: 35}}>
                    <Text
                      style={{
                        color: theme.colors.primary,
                        fontFamily: theme.typography.fontFamily.medium,
                        fontSize: 14,
                      }}
                      allowFontScaling={false}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  <View style={{marginTop: 15}}>
                    <Button
                      title="Sign In"
                      onPress={handleLogin}
                      isLoading={isLoading}
                      theme={theme}
                      size="medium"
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
