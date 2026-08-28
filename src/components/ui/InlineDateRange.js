import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format, parse } from 'date-fns';
import Icon from '../../theme/IconsProvider';

const { width } = Dimensions.get('window');

const InlineDateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  currentPicker,
  setPickerVisible,
  theme,
}) => {
  const [tempDate, setTempDate] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [inputDate, setInputDate] = useState('');

  useEffect(() => {
    const defaultDate = currentPicker === 'start' ? startDate : endDate;
    setTempDate(defaultDate || new Date().toISOString().split('T')[0]);
   setInputDate(defaultDate ? format(new Date(defaultDate), 'dd-MM-yyyy') : '');

    setEditMode(false);
  }, [currentPicker, startDate, endDate]);

  const formatFullDate = (dateStr) => {
    if (!dateStr) return '';
    return format(new Date(dateStr), 'dd-MM-yyyy');

  };

  const handleInputChange = (text) => {
    setInputDate(text);
    try {
     const parsed = parse(text, 'dd-MM-yyyy', new Date());

      if (!isNaN(parsed)) {
        setTempDate(format(parsed, 'yyyy-MM-dd'));
      }
    } catch {
    }
  };

  const onDayPress = (day) => {
    setTempDate(day.dateString);
    setInputDate(format(new Date(day.dateString), 'dd-MM-yyyy'));
  };

  const handleCancel = () => setPickerVisible(false);

  const handleOk = () => {
    if (currentPicker === 'start') {
      onStartDateChange(tempDate);
    } else {
      onEndDateChange(tempDate);
    }
    setPickerVisible(false);
  };

 const getMarkedDates = () => {
  const marked = {};

  if (startDate) {
    marked[startDate] = {
      selected: true,
      selectedColor: theme.colors.primary,
      selectedTextColor: theme.colors.card,
    };
  }

  if (endDate) {
    marked[endDate] = {
      selected: true,
      selectedColor: theme.colors.primary,
      selectedTextColor: theme.colors.card,
    };
  }

  if (tempDate) {
    marked[tempDate] = {
      selected: true,
      selectedColor: theme.colors.primary,
      selectedTextColor: theme.colors.card,
    };
  }

  return marked;
};


  return (
    <Modal
      animationType="fade"
      transparent
      visible
      onRequestClose={() => setPickerVisible(false)}
    >
      <View className="flex-1 justify-center items-center p-2 " style={{ backgroundColor: theme.colors.overlay }}>
        <View className="rounded-3xl w-[90%] max-w-[400px] shadow p-0" style={{ backgroundColor: theme.colors.background, elevation: 5,  }}>
          <View className="p-4 pb-2">
            <Text
            style={{ color: theme.colors.textSecondary,fontFamily:theme.typography.fontFamily.regular,
                fontSize:theme.typography.fontSize.s }} allowFontScaling={false}>
              Select date
            </Text>
          </View>

          <View
          className="flex-row justify-between items-center px-4 pb-3"
          style={{borderBottomWidth:1,borderColor:theme.colors.border}}
          >
            <Text 
             style={{ 
              color: theme.colors.text,
              borderColor:theme.colors.border,
              fontFamily:theme.typography.fontFamily.regular,
               fontSize:theme.typography.fontSize.xl
               }} allowFontScaling={false}
               >
              {formatFullDate(tempDate)}
            </Text>
            <TouchableOpacity onPress={() => setEditMode(!editMode)}>
            <Icon icon={editMode ? 'CalendarIcon' : 'DateEditIcon'} size={25} />
            </TouchableOpacity>

          </View>
          {editMode && (
            <View className="px-5 pb-4">
              <Text 
              style={{ 
                color: theme.colors.textSecondary,
                marginBottom: 4,
                fontFamily:theme.typography.fontFamily.regular,
                 fontSize:theme.typography.fontSize.xs,
                marginTop:6 }}
                allowFontScaling={false}
                >Enter Date</Text>
              <TextInput
                editable={true}
                value={inputDate}
                onChangeText={handleInputChange}
                placeholder="DD-MM-YYYY"
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 6,
                  padding: 10,
                  fontSize:theme.typography.fontSize.s,
                  fontFamily:theme.typography.fontFamily.regular,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.card,
                }}
              />
            </View>
          )}

          {!editMode && (
            <Calendar
            maxDate={new Date().toISOString().split('T')[0]}
              onDayPress={onDayPress}
              markedDates={getMarkedDates()}
              theme={{
                selectedDayBackgroundColor: theme.colors.primary,
                selectedDayTextColor: theme.colors.background,
                todayTextColor: theme.colors.primary,
                dayTextColor: theme.colors.text,
                 textDisabledColor: theme.colors.textSecondary + '80',
                calendarBackground: theme.colors.background,
                monthTextColor: theme.colors.text,
                arrowColor: theme.colors.primary,
                stylesheet: {
      day: {
        disabled: {
          opacity: 0.3,   
        },
      },
    },
              }}
              style={{ padding: 2 }}
            />
          )}

          <View className="flex-row justify-end px-5 pt-2 pb-5">
            <TouchableOpacity className="px-4 py-2 mr-4" onPress={handleCancel}>
              <Text  style={{ color: theme.colors.primary,fontSize:theme.typography.fontSize.m,
                  fontFamily:theme.typography.fontFamily.medium }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 py-2" onPress={handleOk}>
              <Text  style={{ color: theme.colors.primary ,fontSize:theme.typography.fontSize.m,
                  fontFamily:theme.typography.fontFamily.medium}}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default InlineDateRangePicker;
