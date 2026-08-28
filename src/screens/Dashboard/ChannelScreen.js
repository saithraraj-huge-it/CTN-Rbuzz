import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Header from '../../components/layout/Header'
import { useTheme } from '../../contexts/ThemeContext'
import Icon from '../../theme/IconsProvider'
import Toast from 'react-native-toast-message';


function ChannelScreen({ navigation }) {
  const { theme } = useTheme()

  const channels = [
    { id: 1, name: 'CTN TV', icon: 'channelIcon' },
    { id: 2, name: 'ARASU TV', icon: 'channelIcon' },
    { id: 3, name: 'MAKKAH 786 LIVE', icon: 'channelIcon' },
  ]

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <Header
        title="Channels"
        showBack
        alignTitleCenter={false}
        onBackPress={() => navigation.goBack()}
      />

      <View className="p-4">
        {channels.map((channel) => (
          
          <TouchableOpacity
  key={channel.id}
  activeOpacity={0.7}
  onPress={() => {
    Toast.show({
      type: 'success',
      text1: 'There is no live feed available at the moment',
      position: 'bottom',
      visibilityTime: 2000,
    });
  }}
  className="flex-row items-center p-2 mb-2 rounded-2xl"
  style={{
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    backgroundColor: theme.colors.card,
  }}
>

            <View
              className="w-10 h-10 rounded-full justify-center items-center mr-2"
            style={{ backgroundColor: `${theme.colors.primary}20` }}
            >
              <Icon icon={channel.icon} size={28} color={theme.colors.primary} />
            </View>
            <Text style={{ color: theme.colors.text,fontFamily:theme.typography.fontFamily.medium, fontSize:theme.typography.fontSize.s }}  allowFontScaling={false}>
              {channel.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default ChannelScreen
