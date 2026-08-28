'use client';

import React, { useState,forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from '../../theme/IconsProvider';

export const Input = forwardRef(({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  leftIcon,
  error,
  keyboardType,
  autoCapitalize = 'none',
  theme,
  ...props
},ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily.medium,
              fontSize:theme.typography.fontSize.xs,
            },
          ]}
          allowFontScaling={false}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error
              ? theme.colors.error
              : isFocused
              ? theme.colors.primary
              : theme.colors.primaryLight,
            backgroundColor: theme.colors.primaryLight,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        <TextInput
        ref={ref} 
          style={[
            styles.input,
            {
              fontFamily: theme.typography.fontFamily.regular,
                fontSize:theme.typography.fontSize.s,
              color: '#000',
              paddingLeft: leftIcon ? 0 : 12,
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          {...props}
          allowFontScaling={false}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={togglePasswordVisibility}
          >
            <Icon
              icon={isPasswordVisible ? 'Eye' : 'EyeOff'}
              size={25}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text
          style={[
            styles.errorText,
            {
              color: theme.colors.error,
              fontFamily: theme.typography.fontFamily.regular,
                fontSize:theme.typography.fontSize.xs,
            },
          ]}
          allowFontScaling={false}
        >
          {error}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    
    
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 55,
    paddingHorizontal: 8,
  },
  iconContainer: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  passwordToggle: {
    paddingHorizontal: 8,
  },
  errorText: {
  
    marginTop: 4,
  },
});
