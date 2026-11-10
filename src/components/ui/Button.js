import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';

export const Button = ({
  title,
  onPress,
  variant = 'filled',
  size = 'medium',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  theme,
  fullWidth = false,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [
      styles.button,
      styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`],
    ];

    if (fullWidth) baseStyle.push({width: '100%'});

    if (disabled) {
      return [
        ...baseStyle,
        {
          backgroundColor:
            variant === 'filled'
              ? theme.colors.disabledBackground
              : 'transparent',
          borderColor:
            variant === 'outlined'
              ? theme.colors.disabledBackground
              : 'transparent',
          borderWidth: variant === 'outlined' ? 1 : 0,
        },
        style,
      ];
    }

    switch (variant) {
      case 'outlined':
        return [
          ...baseStyle,
          {
            backgroundColor: 'transparent',
            borderColor: theme.colors.primary,
            borderWidth: 1,
          },
          style,
        ];
      case 'text':
        return [
          ...baseStyle,
          {
            backgroundColor: 'transparent',
            paddingHorizontal: 8,
          },
          style,
        ];
      default:
        return [
          ...baseStyle,
          {
            backgroundColor: theme.colors.primary,
          },
          style,
        ];
    }
  };

  const getTextStyle = () => {
    if (disabled) {
      return [
        {
          color: theme.colors.disabledText,
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: theme.typography.fontSize.s,
        },
        textStyle,
      ];
    }

    const color =
      variant === 'filled' ? theme.colors.buttonText : theme.colors.primary;

    return [
      {
        color,
        fontFamily: theme.typography.fontFamily.medium,
      },
      textStyle,
    ];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}>
      {isLoading ? (
        <ActivityIndicator
          color={
            variant === 'filled'
              ? theme.colors.buttonText
              : theme.colors.primary
          }
          size="small"
        />
      ) : (
        <View style={styles.buttonContent}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={getTextStyle()} allowFontScaling={false}>
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    minHeight: 36,
  },
  buttonMedium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 50,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 55,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
