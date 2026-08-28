"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { lightTheme, darkTheme } from "../theme"

const ThemeContext = createContext({
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [theme, setThemeState] = useState(lightTheme)

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme")
        if (savedTheme) {
          const themePreference = JSON.parse(savedTheme)
          setIsDarkMode(themePreference === "dark")
          setThemeState(themePreference === "dark" ? darkTheme : lightTheme)
        } else {
          setIsDarkMode(deviceTheme === "dark")
          setThemeState(deviceTheme === "dark" ? darkTheme : lightTheme)
        }
      } catch (error) {
        console.log("Error loading theme preference:", error)
      }
    }

    loadThemePreference()
  }, [deviceTheme])

  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode
      setIsDarkMode(newMode)
      setThemeState(newMode ? darkTheme : lightTheme)
      await AsyncStorage.setItem("theme", JSON.stringify(newMode ? "dark" : "light"))
    } catch (error) {
      console.log("Error saving theme preference:", error)
    }
  }

  const setTheme = async (mode) => {
    try {
      setIsDarkMode(mode === "dark")
      setThemeState(mode === "dark" ? darkTheme : lightTheme)
      await AsyncStorage.setItem("theme", JSON.stringify(mode))
    } catch (error) {
      console.log("Error saving theme preference:", error)
    }
  }

  return <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>
}
