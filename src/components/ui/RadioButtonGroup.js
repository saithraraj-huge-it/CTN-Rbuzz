import React from 'react';
import { View } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';

const RadioButtonGroup = ({
  options,
  selected,
  onSelect,
  theme,
  direction = 'row',
}) => {
  const radioButtons = options.map(option => ({
    id: option.value.toString(),
    label: option.label,
    value: option.value,
    labelStyle: {
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.m,
      color: selected === option.value 
        ? theme.colors.primary 
        : theme.colors.text,
    },
     size: 18,
     color: selected === option.value
    ? theme.colors.primary
    : theme.colors.text,
    containerStyle: {
      alignItems: 'center',
      marginRight: 8,
    },
  }));

  return (
    <View style={{ 
      flexDirection: direction, 
      flexWrap: 'wrap',
      marginBottom: 16,
    }}>
      <RadioGroup
        radioButtons={radioButtons}
        selectedId={selected?.toString()}
        onPress={(id) => {
          const selectedOption = options.find(opt => 
            opt.value.toString() === id
          );
          if (selectedOption) onSelect(selectedOption.value);
        }}
        layout={direction === 'column' ? 'column' : 'row'}
        containerStyle={{
          flexDirection: direction,
        }}
      
      />
    </View>
  );
};

export default RadioButtonGroup;
