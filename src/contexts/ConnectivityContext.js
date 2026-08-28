"use client"

import React, { createContext, useState, useContext, useEffect, useRef } from "react"
import NetInfo from "@react-native-community/netinfo"
import Toast from "react-native-toast-message"

const ConnectivityContext = createContext({
  isConnected: true,
  checkConnection: async () => {},
})

export const useConnectivity = () => useContext(ConnectivityContext)

export const ConnectivityProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true) 
  const previousStatus = useRef(true)

  const checkConnection = async () => {
    const state = await NetInfo.fetch()
    setIsConnected(state.isConnected)
    return state.isConnected
  }

  useEffect(() => {
    checkConnection()

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected)

      if (state.isConnected !== previousStatus.current) {
        if (!state.isConnected) {
          Toast.show({
            type: "error",
            text1: "No Internet Connection",
            text2: "Please check your connection and try again",
            position: 'bottom',
            visibilityTime: 2000,
          })
        } else {
          Toast.show({
            type: "success",
            text1: "Connected",
            position: 'bottom',
            text2: "Your internet connection has been restored",
            visibilityTime: 2000,
          })
        }

        previousStatus.current = state.isConnected
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <ConnectivityContext.Provider value={{ isConnected, checkConnection }}>
      {children}
    </ConnectivityContext.Provider>
  )
}
