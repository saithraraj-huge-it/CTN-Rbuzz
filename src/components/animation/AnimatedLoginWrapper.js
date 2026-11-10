import React, {useRef, useEffect} from 'react';
import {Animated, Easing} from 'react-native';

function AnimatedLoginWrapper({children}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const topImageAnim = useRef(new Animated.Value(-100)).current;
  const logoAnim = useRef(new Animated.Value(-40)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const bottomImageAnim = useRef(new Animated.Value(100)).current;

  const usernameScale = useRef(new Animated.Value(0.8)).current;
  const usernameOpacity = useRef(new Animated.Value(0)).current;
  const passwordScale = useRef(new Animated.Value(0.8)).current;
  const passwordOpacity = useRef(new Animated.Value(0)).current;

  const buttonAnim = useRef(new Animated.Value(40)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.timing(topImageAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoAnim, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(usernameOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(usernameScale, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.parallel([
        Animated.timing(passwordOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(passwordScale, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000);
  };

  return children({
    fadeStyle: {opacity: fadeAnim},
    topImageStyle: {transform: [{translateY: topImageAnim}]},
    logoStyle: {opacity: logoOpacity, transform: [{translateY: logoAnim}]},
    bottomImageStyle: {transform: [{translateY: bottomImageAnim}]},
    usernameWrapperStyle: {
      opacity: usernameOpacity,
      transform: [{scale: usernameScale}],
      width: '100%',
    },
    passwordWrapperStyle: {
      opacity: passwordOpacity,
      transform: [{scale: passwordScale}],
      width: '100%',
    },
    buttonWrapperStyle: {
      opacity: buttonOpacity,
      transform: [{translateY: buttonAnim}],
      width: '100%',
    },
  });
}

export default AnimatedLoginWrapper;
