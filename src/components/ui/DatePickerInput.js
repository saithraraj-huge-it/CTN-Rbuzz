import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '../../theme/IconsProvider';
import { useTheme } from '../../contexts/ThemeContext';

export default function DatePickerInput({ label, value, onChange, error }) {
  const [showPicker, setShowPicker] = useState(false);
  const { theme } = useTheme();

  const showDatepicker = () => setShowPicker(true);

  const onDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) onChange(selectedDate);
  };

  const formattedDate = value ? new Date(value).toLocaleDateString() : '';

  return (
    <View className="mb-1 w-full">
      {label && (
        <Text
          className="text-xs font-bold mb-1 font-montserrat"
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            marginBottom: 4,
          }}
          allowFontScaling={false}
        >
          {label}
        </Text>
      )}

      <TouchableOpacity
        onPress={showDatepicker}
        className="flex-row items-center justify-between w-full border rounded-md px-4 py-3"
        style={{
          borderColor: error ? theme.colors.error : theme.colors.textSecondary,
          backgroundColor: theme.colors.background,
        }}
      >
        <Text 
          className="flex-1 text-base font-montserrat"
          style={{
            color: formattedDate ? theme.colors.textPrimary : theme.colors.textPrimary,
          }}
          allowFontScaling={false}
        >
          {formattedDate || 'Select Date'}
        </Text>
         <Icon icon={theme ? 'DarkDateIcon' : 'DateIcon'} size={20} color={theme.colors.gray} />
      </TouchableOpacity>

      {!!error && (
        <Text
          className="text-sm font-semibold mt-1 ml-1 font-montserrat"
          style={{ color: theme.colors.error }}
          allowFontScaling={false}
        >
          {error}
        </Text>
      )}

      {showPicker && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date(2100, 12, 31)}
        />
      )}
    </View>
  );
}
