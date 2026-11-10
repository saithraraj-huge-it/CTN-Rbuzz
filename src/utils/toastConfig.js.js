import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from '../theme/IconsProvider';
import {useTheme} from '../contexts/ThemeContext';

const ToastView = ({text1, type = 'success'}) => {
  const {theme} = useTheme();
  const isError = type === 'error';

  return (
    <View
      style={[
        styles.toastContainer,
        {
          backgroundColor: isError ? '#B42318' : '#166534',
          borderLeftColor: isError ? '#FCA5A5' : '#86EFAC',
        },
      ]}>
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: isError ? '#FEE2E2' : '#DCFCE7',
          },
        ]}>
        <Icon icon={isError ? 'LoginLogo' : 'LoginLogo'} size={18} />
      </View>

      <Text
        style={[
          styles.message,
          {
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: theme.typography.fontSize.s,
          },
        ]}
        numberOfLines={2}>
        {text1}
      </Text>
    </View>
  );
};

const toastConfig = {
  success: ({text1}) => <ToastView text1={text1} type="success" />,
  error: ({text1}) => <ToastView text1={text1} type="error" />,
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 12,
    borderLeftWidth: 4,
    paddingHorizontal: 14,
    paddingVertical: 14,

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },

  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  message: {
    flex: 1,
    color: '#FFFFFF',
    lineHeight: 20,
  },
});

export default toastConfig;
