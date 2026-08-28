import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import icons from '../theme/icons';

const Icon = ({ onPress, icon, viewStyle, style, size }) => {
  const SvgIcon = icons[icon];

  if (!SvgIcon) {
    console.warn(`Icon "${icon}" not found`);
    return null;
  }

  const content = (
    <View style={viewStyle}>
      <SvgIcon width={size}  height={size} style={style} />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default Icon;
