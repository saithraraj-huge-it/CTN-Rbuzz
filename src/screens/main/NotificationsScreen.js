
"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { Header } from "../../components/layout/Header"
import { SkeletonLoader } from "../../components/ui/SkeletonLoader"
import { useData } from "../../contexts/DataProvider"
import NotificationEvents from "../../utils/NotificationEvents"
import Toast from 'react-native-toast-message';


const NotificationsScreen = () => {
  const { theme } = useTheme()
  const { getNotification,clearNotification } = useData()

  const [notifications, setNotifications] = useState([])
  console.log(notifications,"notify");
  
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)


  useEffect(() => {
  fetchNotifications();

  const refreshListener = () => {
    console.log('Notification event received — refreshing');
    fetchNotifications();
  };

  NotificationEvents.on('getPendingRecharge', refreshListener);

  return () => {
    NotificationEvents.off('getPendingRecharge', refreshListener);
  };
}, []);


const fetchNotifications = async () => {
  try {
    setLoading(true);

    const list = await getNotification();
    if (!list || list.length === 0) {
      setNotifications([]);
      return;
    }

    const mapped = list.map(item => ({
      id: item.NID?.toString() || Math.random().toString(),
      message: item.MSG || '',
      cby: item.CBY || '',
      time: item.CDT
        ? new Date(item.CDT).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
        : '',
    }));

    setNotifications(mapped);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    setNotifications([]);
  } finally {
    setLoading(false);
  }
};



const handleClearNotifications = async () => {
  setNotifications([]);
  setLoading(true);

  try {
    const response = await clearNotification();

    if (response?.result) {
      Toast.show({
        type: 'success',
        text1: response?.Message || 'Notifications cleared successfully!',
      });

      const list = await getNotification(); 
      const mapped = list?.map(item => ({
        id: item.NID?.toString() || Math.random().toString(),
        message: item.MSG || '',
        cby: item.CBY || '',
        time: item.CDT
          ? new Date(item.CDT).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })
          : '',
      })) || [];

      setNotifications(mapped);
    }
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Failed to clear notifications',
    });
  } finally {
    setLoading(false);
  }
};


  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchNotifications()
    setRefreshing(false)
  }

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
          backgroundColor: theme.colors.primaryLight,
        }}
      >
        {/* <Text
          style={{
            fontSize: theme.typography.fontSize.xxl,
            fontFamily: theme.typography.fontFamily.medium,
            color: theme.colors.primary,
          }}
        >
          {item.cby ? item.cby.charAt(0).toUpperCase() : "?"}
        </Text> */}
        <Text
  style={{
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primary,
  }}
>
  {item.message
    ? item.message.charAt(0).toUpperCase()
    : item.message
    ? item.message.charAt(0).toUpperCase()
    : "?"}
</Text>

      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: theme.typography.fontSize.m,
            marginBottom: 4,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily.regular,
          }}
          allowFontScaling={false}
        >
          {item.message}
        </Text>
        <Text
          style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.textSecondary,
            fontFamily: theme.typography.fontFamily.regular,
          }}
          allowFontScaling={false}
        >
          {item.time}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const renderEmptyComponent = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 96,
      }}
    >
      <Text
        style={{
          fontSize: theme.typography.fontSize.m,
          marginTop: 16,
          color: theme.colors.textSecondary,
          fontFamily: theme.typography.fontFamily.medium,
        }}
        allowFontScaling={false}
      >
        No notifications yet
      </Text>
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Notifications" 
      showBack={false}
      notificationsLength={notifications.length}  
      isRefreshing={refreshing || loading} 
   rightComponent={
          notifications.length > 0 && !loading && !refreshing && (
            <TouchableOpacity
              onPress={handleClearNotifications}
              style={{
                paddingVertical: 4,
                paddingHorizontal: 8,
                backgroundColor: theme.colors.primary,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: theme.typography.fontSize.xs,
                  fontFamily: theme.typography.fontFamily.medium,
                }}
                allowFontScaling={false}
              >
                Clear All
              </Text>
            </TouchableOpacity>
          )
        }
      
      />

    
      {loading && !refreshing ? (
        <SkeletonLoader type="notification" count={10} />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </View>
  )
}

export default NotificationsScreen
