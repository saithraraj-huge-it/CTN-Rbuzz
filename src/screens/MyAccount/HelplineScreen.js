'use client';

import {useTheme} from '../../contexts/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {Header} from '../../components/layout/Header';
import Icon from '../../theme/IconsProvider';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import React from 'react';
import {useAuth} from '../../contexts/AuthContext';

const HelplineScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {user} = useAuth();

  const handlePress = title => {
    if (title.includes('@')) {
      Linking.openURL(`mailto:${title}`);
    } else if (/^\d+$/.test(title)) {
      Linking.openURL(`tel:${title}`);
    }
  };

  const SettingItem = ({
    icon,
    title,
    description,
    type = 'switch',
    onPress,
  }) => {
    const isInteractive = onPress || title.includes('@') || /^\d+$/.test(title);

    return (
      <TouchableOpacity
        onPress={() => isInteractive && handlePress(title)}
        disabled={!isInteractive}
        className="flex-row items-center justify-between py-1">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-full justify-center items-center mr-2">
            <Icon icon={icon} size={25} color={theme.colors.primary} />
          </View>
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
                style={{color: theme.colors.textSecondary}}
                allowFontScaling={false}
                className="text-sm mt-1">
                {description}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{backgroundColor: theme.colors.background}} className="flex-1">
      <Header
        title="Helpline Services"
        showBack
        alignTitleCenter={false}
        onBackPress={() => navigation.goBack()}
      />

      <View className="mb-2 px-5 mt-2">
        <SettingItem icon="SmsIcon" title={user?.email || 'No Email Found'} />
        <SettingItem icon="callIcon" title={user?.phNo || 'No Mobile Number'} />
      </View>
    </View>
  );
};

export default HelplineScreen;
