"use client"
import { View, Text, TouchableOpacity, StatusBar } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import Icon from "../../theme/IconsProvider"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const Header = ({
  title,
  subtitle,
  showBack = false,
  showNotification = false,
  onBackPress,
  rightComponent,
  alignTitleCenter = true,
  notificationsLength = 0, 
  isRefreshing = false,
}) => {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  
const renderRightComponent = () => {
    if (rightComponent) return rightComponent;
    
    if (showNotification) {
      return (
        <TouchableOpacity className="p-1">
          <Icon name="notifications-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      );
    }
    
    return null;
  };
  return (
    <View
      className={`pt-[${insets.top}px] ${
        showBack ? '' : 'border-b'
      }` }
      style={{ backgroundColor: theme.colors.background ,zIndex: 100,borderColor:theme.colors.border}}
    >
      <StatusBar
        barStyle={theme.dark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />

      <View className="h-14 flex-row items-center px-2">
        <View className="w-10 justify-center">
          {showBack && (
            <TouchableOpacity
              onPress={onBackPress}
              className="p-1"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon icon="LeftArrow" size={24}  />
            </TouchableOpacity>
          )}
        </View>

        <View
          className={`flex-1 justify-center ${
            alignTitleCenter ? 'items-center' : 'items-start'
          }`}
        >
          <Text
            numberOfLines={1}
            className="text-xl"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.typography.fontFamily.medium,
              fontSize:theme.typography.fontSize.l,
              textAlign: alignTitleCenter ? "center" : "left",
            }}
            allowFontScaling={false}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              numberOfLines={1}
              className="text-xs"
              style={{
                color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily.medium,
              fontSize:theme.typography.fontSize.m,
                textAlign: alignTitleCenter ? "center" : "left",
              }}
              allowFontScaling={false}
            >
              {subtitle}
            </Text>
          )}
        </View>

       
      <View className="min-w-[60px] items-end justify-center">
          {renderRightComponent()}
        </View>
      </View>
    </View>
  )
}

export default Header
