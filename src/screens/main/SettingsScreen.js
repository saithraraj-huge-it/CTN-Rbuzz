'use client';

import {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../contexts/ThemeContext';
import {Header} from '../../components/layout/Header';
import Icon from '../../theme/IconsProvider';
import ConfirmModal from '../../components/ui/ConfirmModal';
import {useAuth} from '../../contexts/AuthContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const {logout, user} = useAuth();
  console.log(user,"uer");
  

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleNavigate = screen => {
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    setIsModalVisible(false);
    logout();
    navigation.replace('Login');
  };

  const renderSectionHeading = (iconName, title) => (
    <View className="flex-row items-center my-3">
      <Icon name={iconName} size={18} color={theme.colors.primary} />
      <Text
        className="ml-2"
        style={{color: theme.colors.text, 
          fontSize:theme.typography.fontSize.l,
          fontFamily: theme.typography.fontFamily.regular,
          }}
        allowFontScaling={false}>
        {title}
      </Text>
    </View>
  );

  const renderMenuItem = (iconName, title, screen) => (
    <TouchableOpacity
      key={title}
      className="flex-row items-center justify-between py-4 "
      style={{borderBottomWidth:1,borderBottomColor:theme.colors.border}}
      onPress={() => handleNavigate(screen)}>
      <View className="flex-row items-center">
        <View
          className="w-9 h-9 justify-center items-center rounded-full"
            style={{ backgroundColor: `${theme.colors.primary}20` }}
          >
          <Icon icon={iconName} size={28} />
        </View>
        <Text
          className="ml-2"
          style={{color: theme.colors.text, 
             fontSize:theme.typography.fontSize.m,
          fontFamily: theme.typography.fontFamily.regular,
          }}
          allowFontScaling={false}>
          {title}
        </Text>
      </View>
      <Icon
        icon="chevron-forward"
        size={20}
        color={theme.colors.textSecondary}
      />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1" style={{backgroundColor: theme.colors.background}}>
      <Header title="My Account" showBack={false} />

      <View className="flex-1 justify-between">
        <ScrollView showsVerticalScrollIndicator={false} className="px-5">
          <View className="mb-6">
            {/* {renderSectionHeading('person-circle-outline', 'My Account')} */}
            {renderMenuItem('UserIcon', 'Account', 'AccountScreen')}
            {renderMenuItem(
              'ComplaintIcon',
              'Complaint Request',
              'ComplaintScreen',
            )}
            {renderMenuItem(
              'HelpLineIcon',
              'Helpline Services',
              'HelplineScreen',
            )}
            {renderMenuItem(
              'passwordIcon',
              'Change PIN',
              'ChangePinScreen',
            )}
            {renderMenuItem(
              'SettingsIcon',
              'Settings',
              'AccSettingsScreen',
            )}
          </View>
        </ScrollView>

        <View className="px-5 pb-8">
          <TouchableOpacity
            className="py-3 border rounded-lg items-center"
            style={{
              borderColor: theme.colors.primary,
              backgroundColor: theme.colors.white,
            }}
            onPress={() => setIsModalVisible(true)}>
            <Text
              style={{
                color: theme.colors.text,
                fontSize:theme.typography.fontSize.m,
          fontFamily: theme.typography.fontFamily.regular,
              }}
              allowFontScaling={false}>
              LOG OUT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ConfirmModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={handleLogout}
        message="Are you sure you want to logout?"
       userName={`👋 Hi ${user?.accountName}`}
        theme={theme}
      />
    </View>
  );
};

export default SettingsScreen;
