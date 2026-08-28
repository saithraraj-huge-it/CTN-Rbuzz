import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../theme/IconsProvider';
import { useTheme } from '../contexts/ThemeContext';

const ToastView = ({ text1, type = 'success' }) => {
  const { theme } = useTheme();

  const isError = type === 'error';

  return (
    <View
      style={[
        styles.toastContainer,
        { backgroundColor: isError ? 'rgba(255,0,0,0.45)' : 'rgba(0,0,0,0.40)' },
      ]}
    >
      <View style={styles.iconWrap}>
        <Icon
          icon={isError ? 'LoginLogo' : 'LoginLogo'}
          size={18}
        />
      </View>

      <Text
        style={[
          styles.message,
          {
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.fontSize.s,
          },
        ]}
        numberOfLines={2}
      >
        {text1}
      </Text>
    </View>
  );
};

const toastConfig = {
  success: ({ text1 }) => (
    <ToastView text1={text1} type="success" />
  ),
  error: ({ text1 }) => (
    <ToastView text1={text1} type="error" />
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,

    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },

  iconWrap: {
    width: 18,
    height: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  message: {
    flexShrink: 1,
    color: '#fff',
  },
});

export default toastConfig;
