import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import Icon from '../../theme/IconsProvider'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const scale = useSharedValue(1)

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label = options.tabBarLabel ?? route.name
        const isFocused = state.index === index
        const isCenter = route.name === 'Home'

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }

          // animate only center tab on press
          if (isCenter) {
            scale.value = 0.8
            scale.value = withTiming(1, { duration: 300 })
          }
        }

        const renderIcon = () => {
          let iconName = ''
          if (route.name === 'Home') iconName = 'Home'
          else if (route.name === 'Report') iconName = 'ReportIcon'
          else if (route.name === 'Notifications') iconName = 'notifyicon'
          else if (route.name === 'Settings') iconName = 'settingsicon'

          return <Icon icon={iconName} size={24} color={isFocused ? '#fff' : '#ccc'} />
        }

        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [{ scale: isCenter ? scale.value : 1 }],
          }
        })

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            onPress={onPress}
            style={isCenter ? styles.centerButtonWrapper : styles.tabButton}
          >
            {isCenter ? (
              <Animated.View style={[styles.centerButton, animatedStyle]}>
                {renderIcon()}
              </Animated.View>
            ) : (
              <>
                {renderIcon()}
                <Text style={[styles.label, isFocused && styles.focusedLabel]}>{label}</Text>
              </>
            )}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#5e2a84',
    height: 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
  focusedLabel: {
    color: '#fff',
  },
  centerButtonWrapper: {
    top: -20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
  },
  centerButton: {
    backgroundColor: '#5e2a84',
    borderRadius: 35,
    padding: 15,
    borderWidth: 4,
    borderColor: 'white',
  },
})

export default CustomTabBar
