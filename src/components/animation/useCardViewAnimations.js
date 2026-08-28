import {
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
} from 'react-native-reanimated'

import { useTheme } from '../../contexts/ThemeContext'

export const useCardViewAnimations = () => {
  const { theme, isDarkMode } = useTheme()

  // Safeguard fallback colors
  const safePrimary = theme?.colors?.primary ?? '#3B82F6'
  const safeAccent = theme?.colors?.accent ?? '#FACC15'

  // Shared animation values
  const animatedIndex = useSharedValue(0)
  const sheetAnimation = useSharedValue(0)
  const pulseAnimation = useSharedValue(1)
  const rotateAnimation = useSharedValue(0)
  const headerOpacity = useSharedValue(1)
  const sharedValue = useSharedValue(0)

  // Animate on entry
  const startInitialAnimations = () => {
    sheetAnimation.value = withDelay(
      300,
      withSpring(1, {
        damping: 12,
        stiffness: 90,
        mass: 0.8,
      })
    )

    startPulseAnimation()

    rotateAnimation.value = withDelay(
      500,
      withTiming(1, {
        duration: 800,
      })
    )
  }

  const startPulseAnimation = () => {
    pulseAnimation.value = withSequence(
      withTiming(1.2, { duration: 800 }),
      withTiming(1, { duration: 800 }),
      withTiming(1.2, { duration: 800 }),
      withTiming(1, { duration: 800 })
    )
  }

  const handleSheetChanges = (index) => {
    animatedIndex.value = withTiming(index, { duration: 250 })
    headerOpacity.value = withTiming(index === 0 ? 1 : 0.6, { duration: 200 })

    if (index === 1) {
      pulseAnimation.value = 1
    } else {
      startPulseAnimation()
    }
  }

  // Animated styles

  const handleIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      [safePrimary, safeAccent]
    ),
    width: interpolate(animatedIndex.value, [0, 1], [50, 40], Extrapolation.CLAMP),
  }))

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      {
        translateY: interpolate(
          animatedIndex.value,
          [0, 1],
          [0, -5],
          Extrapolation.CLAMP
        ),
      },
    ],
  }))

  const dividerStyle = useAnimatedStyle(() => ({
    width: `${interpolate(animatedIndex.value, [0, 1], [100, 85], Extrapolation.CLAMP)}%`,
    alignSelf: 'center',
    opacity: interpolate(animatedIndex.value, [0, 1], [1, 0.7], Extrapolation.CLAMP),
    height: interpolate(animatedIndex.value, [0, 1], [1, 2], Extrapolation.CLAMP),
    backgroundColor: theme?.colors?.lightBackground ?? '#E5E7EB',
  }))

  const sheetContainerStyle = useAnimatedStyle(() => ({
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: interpolate(sheetAnimation.value, [0, 1], [0, 0.2], Extrapolation.CLAMP),
    shadowRadius: 5,
    elevation: 10,
    transform: [
      {
        translateY: interpolate(sheetAnimation.value, [0, 1], [100, 0], Extrapolation.CLAMP),
      },
    ],
    backgroundColor: theme?.colors?.white ?? '#FFFFFF',
  }))

  const contentContainerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sheetAnimation.value, [0, 1], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(sheetAnimation.value, [0, 1], [50, 0], Extrapolation.CLAMP),
      },
      {
        scale: interpolate(sheetAnimation.value, [0, 1], [0.95, 1], Extrapolation.CLAMP),
      },
    ],
  }))

  return {
    animatedIndex,
    sheetAnimation,
    pulseAnimation,
    rotateAnimation,
    headerOpacity,
    sharedValue,

    startInitialAnimations,
    startPulseAnimation,
    handleSheetChanges,

    handleIndicatorStyle,
    headerStyle,
    dividerStyle,
    sheetContainerStyle,
    contentContainerStyle,
  }
}
