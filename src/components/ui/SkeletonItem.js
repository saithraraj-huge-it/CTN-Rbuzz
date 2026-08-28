"use client"

import { useEffect, useRef } from "react"
import { View, StyleSheet, Animated, Easing } from "react-native"

export const SkeletonItem = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [fadeAnim])

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.image} />
      <View style={styles.content}>
        <View style={styles.title} />
        <View style={styles.description} />
        <View style={[styles.description, { width: "60%" }]} />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    height: 160,
    width: "100%",
    backgroundColor: "#e0e0e0",
  },
  content: {
    padding: 16,
  },
  title: {
    height: 20,
    width: "70%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 12,
  },
  description: {
    height: 14,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 8,
  },
})
