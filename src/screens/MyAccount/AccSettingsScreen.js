import React from 'react';
import {Switch, Text, TouchableOpacity, View} from 'react-native';
import Header from '../../components/layout/Header';
import {useTheme} from '../../contexts/ThemeContext';
import Icon from '../../theme/IconsProvider';

function AccSettingsScreen({navigation}) {
  const {theme, toggleTheme, isDarkMode} = useTheme();

  const SettingItem = ({
    icon,
    title,
    description,
    value,
    onValueChange,
    type = 'switch',
    onPress,
  }) => {
    return (
      <TouchableOpacity
        className="flex-row items-center justify-between py-3 px-1"
        onPress={onPress}
        disabled={!onPress}>
        <View className="flex-row items-center flex-1 w-10 h-10">
          <View className="flex-1">
            <Text
              style={{
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.fontSize.m,
              }}
              allowFontScaling={false}>
              {title}
            </Text>
            {description && (
              <Text
                className="text-sm mt-0.5"
                style={{
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fontFamily.medium,
                }}
                allowFontScaling={false}>
                {description}
              </Text>
            )}
          </View>
        </View>

        {type === 'switch' && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={value ? theme.colors.primary : '#f4f3f4'}
          />
        )}
        {type === 'chevron' && (
          <Icon
            name="chevron-forward"
            size={20}
            color={theme.colors.textSecondary}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1" style={{backgroundColor: theme.colors.background}}>
      <Header
        title="Settings"
        showBack
        alignTitleCenter={false}
        onBackPress={() => navigation.goBack()}
      />
      <View className="mb-2 px-5 mt-2">
        <SettingItem
          icon="moon-outline"
          title="Dark Mode"
          value={isDarkMode}
          onValueChange={toggleTheme}
        />
      </View>
    </View>
  );
}

export default AccSettingsScreen;
