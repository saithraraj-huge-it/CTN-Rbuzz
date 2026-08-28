'use client';

import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components/layout/Header';
import Icon from '../../theme/IconsProvider';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AddOnServiceScreen = () => {
  const { theme } = useTheme();
    const {user} = useAuth();

  const navigation = useNavigation();

  const handlePress = (title) => {
    if (title.includes('@')) {
      Linking.openURL(`mailto:${title}`);
    } else if (/^\d+$/.test(title)) {
      Linking.openURL(`tel:${title}`);
    }
  };

  const SettingItem = ({ icon, title, description, type = 'switch', onPress }) => {
    const isInteractive = onPress || title.includes('@') || /^\d+$/.test(title);

    return (
      <TouchableOpacity
        onPress={() => isInteractive && handlePress(title)}
        disabled={!isInteractive}
        className="flex-row items-center justify-between py-2"
      >
        <View className="flex-row items-center flex-1">
          <View
            className="w-10 h-10 rounded-full justify-center items-center mr-3"
            style={{ backgroundColor: `${theme.colors.primary}20` }}
          >
            <Icon icon={icon} size={28} color={theme.colors.primary} />
          </View>
          <View className="flex-1">
            <Text style={{ color: theme.colors.text, fontFamily:theme.typography.fontFamily.regular, fontSize:theme.typography.fontSize.s }}  allowFontScaling={false}>
              {title}
            </Text>
            {description && (
              <Text style={{ color: theme.colors.textSecondary }} className="text-sm mt-1">
                {description}
              </Text>
            )}
          </View>
        </View>
      
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ backgroundColor: theme.colors.background }} className="flex-1">
      <Header
        title="Other Addon Services"
        showBack
        alignTitleCenter={false}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-2 px-5">
          <View className="flex-row justify-between items-center my-3">
            <Text style={{ color: theme.colors.text, fontFamily:theme.typography.fontFamily.medium, fontSize:theme.typography.fontSize.s}} allowFontScaling={false}>
              CTN RBuzz Services
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(user?.url)}
              className="rounded-3xl px-4 py-1.5 border"
              style={{ borderColor: theme.colors.primary }}
            >
              <Text style={{ color: theme.colors.primary,fontFamily:theme.typography.fontFamily.medium ,fontSize:theme.typography.fontSize.xs }}  allowFontScaling={false}>
                Visit
              </Text>
            </TouchableOpacity>
          </View>

          <SettingItem icon="waterbill" title="Water Bill Payment" />
          <SettingItem icon="busTicket" title="Bus Ticket Booking" />
          <SettingItem icon="gasbill" title="Gas Bill Payment" />
          <SettingItem icon="insurance" title="Insurance Bill Payment" />
          <SettingItem icon="BroadBand" title="BroadBand Bill Payment" />
          <SettingItem icon="moneytransfer" title="Money Transfer" />
          <SettingItem icon="apiIcon" title="API Service" />
        </View>

        <View className="mb-2 px-5">
          <View className="flex-row justify-between items-center my-3">
            <Text style={{ color: theme.colors.text,fontFamily:theme.typography.fontFamily.medium , fontSize:theme.typography.fontSize.s }}  allowFontScaling={false}>
              SGS DVS Services
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(user?.url1)}
              className="rounded-3xl px-4 py-2 border"
              style={{ borderColor: theme.colors.primary }}
            >
              <Text style={{ color: theme.colors.primary,fontFamily:theme.typography.fontFamily.medium ,fontSize:theme.typography.fontSize.s }}  allowFontScaling={false}>
                Visit
              </Text>
            </TouchableOpacity>
          </View>
          <SettingItem icon="CableTv" title="Cable TV Recharge" />
          <SettingItem icon="BroadBand" title="BroadBand Bill Payment" />
        </View>

        <View className="mb-2 px-5">
          <View className="flex-row justify-between items-center my-3">
            <Text style={{ color: theme.colors.text,fontFamily:theme.typography.fontFamily.medium,fontSize:theme.typography.fontSize.s  }}  allowFontScaling={false}>
              CTN Live Services
            </Text>
            <TouchableOpacity
               onPress={() => Linking.openURL(user?.url2)}
              className="rounded-3xl px-4 py-2 border"
              style={{ borderColor: theme.colors.primary }}
            >
              <Text style={{ color: theme.colors.primary,fontFamily:theme.typography.fontFamily.medium,fontSize:theme.typography.fontSize.s  }}  allowFontScaling={false}>
                Visit
              </Text>
            </TouchableOpacity>
          </View>
          <SettingItem icon="OttIcon" title="OTT Services" />
        </View>

        <View className="mb-2 px-5">
          <Text style={{ color: theme.colors.text,fontFamily:theme.typography.fontFamily.medium,fontSize:theme.typography.fontSize.s }} className=" my-3" allowFontScaling={false}>
            For Other Helpline Services Contact
          </Text>
         
                  <SettingItem icon="SmsIcon"  title={user?.email || 'No Email Found'}/>
      <SettingItem
  icon="callIcon"
  title={user?.phNo || 'No Mobile Number'}
/>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddOnServiceScreen;
