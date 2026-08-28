"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { Header } from "../../components/layout/Header"
import { Button } from "../../components/ui/Button"
import Icon from "react-native-vector-icons/Ionicons"
import { SharedElement } from "react-navigation-shared-element"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated"

const { width } = Dimensions.get("window")

const ItemDetailScreen = ({ route, navigation }) => {
  const { item } = route.params
  const { theme } = useTheme()
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(50)

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    })
    translateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    })
  }, [opacity, translateY])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    }
  })

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Details" showBack={true} onBackPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <SharedElement id={`item.${item.id}.image`}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </SharedElement>
        </View>

        <Animated.View style={[styles.contentContainer, animatedStyle]}>
          <View style={styles.headerRow}>
            <SharedElement id={`item.${item.id}.title`}>
              <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
            </SharedElement>
            <TouchableOpacity style={styles.favoriteButton}>
              <Icon name="heart-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.category, { color: theme.colors.textSecondary }]}>{item.category}</Text>

          <View style={styles.ratingContainer}>
            <Icon name="star" size={18} color="#FFD700" />
            <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
              {item.rating} ({item.reviews} reviews)
            </Text>
          </View>

          <Text style={[styles.price, { color: theme.colors.primary }]}>${item.price.toFixed(2)}</Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{item.description}</Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Add to Cart"
              leftIcon={<Icon name="cart-outline" size={20} color="#FFFFFF" />}
              style={styles.button}
              theme={theme}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: width * 0.8,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  category: {
    fontSize: 16,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  button: {
    height: 50,
  },
})

export default ItemDetailScreen
