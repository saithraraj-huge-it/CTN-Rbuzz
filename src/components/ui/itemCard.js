import React from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"

const ItemCard = ({ item, onPress }) => {
    console.log(item,"item");
    
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.description || "No description available."}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
})

export default ItemCard
