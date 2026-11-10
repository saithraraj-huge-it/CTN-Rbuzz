import React, {useState, useRef, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';

const PinModal = ({
  visible,
  onClose,
  pinError,
  isProcessing,
  theme,
  onSubmit,
}) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const pinRefs = [useRef(), useRef(), useRef(), useRef()];
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [focusedIndex, setFocusedIndex] = useState(null);

  useEffect(() => {
    if (visible) {
      setPin(['', '', '', '']);
      setTimeout(() => pinRefs[0].current?.focus(), 300);
    }
  }, [visible]);

  useEffect(() => {
    if (pinError) {
      HapticFeedback.trigger('notificationError');
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [pinError]);

  const handleChange = (text, index) => {
    const newPin = [...pin];
    newPin[index] = text.replace(/[^0-9]/g, '');
    setPin(newPin);

    if (text && index < 3) {
      pinRefs[index + 1].current?.focus();
    }

    if (index === 3 && newPin.every(digit => digit !== '')) {
      const joined = newPin.join('');
      HapticFeedback.trigger('impactLight');
      setTimeout(() => onSubmit?.(joined), 150);
    }
  };

  // const handleKeyPress = (e, index) => {
  //   if (e.nativeEvent.key === 'Backspace' && pin[index] === '' && index > 0) {
  //     pinRefs[index - 1].current?.focus();
  //   }
  // };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (pin[index] === '') {
        if (index > 0) {
          const newPin = [...pin];
          newPin[index - 1] = '';
          setPin(newPin);
          pinRefs[index - 1].current?.focus();
        }
      } else {
        const newPin = [...pin];
        newPin[index] = '';
        setPin(newPin);
      }
    }
  };

  const handleReset = () => {
    const cleared = ['', '', '', ''];
    setPin(cleared);
    pinRefs[0].current?.focus();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Animated.View
          style={{
            width: '85%',
            backgroundColor: theme.colors.card,
            borderRadius: 20,
            padding: 28,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
            transform: [{translateX: shakeAnim}],
          }}>
          <Text
            style={{
              fontFamily: theme.typography.fontFamily.medium,
              marginBottom: 20,
              color: theme.colors.text,
              fontSize: theme.typography.fontSize.l,
            }}>
            Enter 4-digit PIN
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            {pin.map((digit, i) => (
              <TextInput
                key={i}
                ref={pinRefs[i]}
                value={digit ? '•' : ''}
                onChangeText={text => handleChange(text, i)}
                onKeyPress={e => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={1}
                secureTextEntry
                onFocus={() => setFocusedIndex(i)} // <- Set focus index
                onBlur={() => setFocusedIndex(null)}
                style={{
                  width: 55,
                  height: 55,
                  borderWidth: 2,

                  borderRadius: 12,
                  textAlign: 'center',
                  fontFamily: theme.typography.fontFamily.bold,
                  color: theme.colors.text,
                  marginHorizontal: 6,

                  fontSize: theme.typography.fontSize.xl,
                  backgroundColor: digit
                    ? theme.colors.primary + '20'
                    : theme.colors.background,
                  borderColor: digit
                    ? theme.colors.primary + '20'
                    : theme.colors.border + '40',
                }}
              />
            ))}
          </View>

          {pinError ? (
            <Text
              style={{
                color: 'red',
                fontFamily: theme.typography.fontFamily.medium,
                fontSize: theme.typography.fontSize.s,
                marginBottom: 10,
              }}>
              {pinError}
            </Text>
          ) : null}

          {isProcessing && (
            <Text
              style={{
                color: theme.colors.text,
                marginTop: 8,
                fontFamily: theme.typography.fontFamily.medium,
                fontSize: theme.typography.fontSize.s,
              }}>
              Processing...
            </Text>
          )}

          <View style={{flexDirection: 'row', marginTop: 20, gap: 20}}>
            <TouchableOpacity onPress={onClose} disabled={isProcessing}>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontFamily: theme.typography.fontFamily.medium,
                  fontSize: theme.typography.fontSize.s,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleReset} disabled={isProcessing}>
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fontFamily.medium,
                  fontSize: theme.typography.fontSize.s,
                }}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>

          {isProcessing && (
            <ActivityIndicator
              size="small"
              color={theme.colors.primary}
              style={{marginTop: 16}}
            />
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default PinModal;
