import React, {useRef, useEffect, useContext} from 'react';
import {View, Animated, StyleSheet, Easing} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

const Skeleton = ({
  type = 'line', // 'line' | 'circle' | 'square' | 'custom'
  width = '100%',
  height = 16,
  borderRadius,
  style = {},
  animate = true,
}) => {
  const shimmer = useRef(new Animated.Value(0)).current;
  const {theme} = useTheme();
  const baseColor = theme.colors.skeleton;
  const highlightColor = theme.colors.skeletonHighlight;

  useEffect(() => {
    if (!animate) return;
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [animate]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 200],
  });

  const getShapeStyle = () => {
    switch (type) {
      case 'circle':
        return {
          width,
          height,
          borderRadius: width / 2,
        };
      case 'square':
        return {
          width,
          height: width,
          borderRadius: borderRadius ?? 8,
        };
      case 'line':
      default:
        return {
          width,
          height,
          borderRadius: borderRadius ?? 4,
        };
    }
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: baseColor, overflow: 'hidden'},
        getShapeStyle(),
        style,
      ]}>
      {animate && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: highlightColor,
              opacity: 0.3,
              transform: [{translateX}],
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});

export default Skeleton;
