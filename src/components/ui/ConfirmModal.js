import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import {useEffect, useRef} from 'react';

const ConfirmModal = ({
  visible,
  message,
  onConfirm,
  onCancel,
  userName,
  image,
  theme,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View
          className="flex-1 justify-center items-center px-5"
          style={{backgroundColor: theme.colors.overlay}}>
          <Animated.View
            className="rounded-2xl p-5 w-full max-w-xs shadow-lg"
            style={{
              backgroundColor: theme.colors.background,
              transform: [{scale: scaleAnim}],
              shadowColor: theme.colors.shadowColor,
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 3,
            }}>
            <View className="items-center mb-4">
              {image && (
                <View
                  className="rounded-full p-2 mb-2"
                  style={{backgroundColor: theme.colors.gray}}>
                  <Image
                    source={image}
                    className="w-12 h-12"
                    resizeMode="contain"
                    style={{width: 50, height: 50}}
                  />
                </View>
              )}
              <Text
                className="text-center mt-1"
                style={{
                  color: theme.colors.textPrimary,
                  fontFamily: theme.typography.fontFamily.regular,
                  fontSize: theme.typography.fontSize.m,
                }}
                allowFontScaling={false}>
                {userName}
              </Text>
            </View>

            <Text
              className="text-center mb-5"
              style={{
                fontSize: theme.typography.fontSize.m,
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily.medium,
              }}
              allowFontScaling={false}>
              {message}
            </Text>

            <View className="flex-row justify-between space-x-3">
              <TouchableOpacity
                className="flex-1 rounded-xl border-2 py-2 items-center"
                onPress={onCancel}
                style={{
                  borderColor: theme.colors.primary,
                  backgroundColor: theme.colors.card,
                }}>
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontFamily: theme.typography.fontFamily.medium,
                    fontSize: theme.typography.fontSize.s,
                  }}
                  allowFontScaling={false}>
                  No
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-xl py-2 items-center"
                onPress={onConfirm}
                style={{
                  backgroundColor: theme.colors.primary,
                  shadowColor: theme.colors.shadowColor,
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: theme.typography.fontFamily.medium,
                    fontSize: theme.typography.fontSize.s,
                    color: theme.colors.background,
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConfirmModal;
