import React, { useRef, useState, useEffect } from "react"
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native"

const { height: screenHeight } = Dimensions.get("window")

const RechargeBottomSheet = ({
  children,
  bottomContent,
  title = "Plans",
  tabs = [],
  theme,
  hasHeader = true,
  emptyText = "No plans or data available",
  collapsedHeight = screenHeight * 0.5,
  expandedHeight = 100,
  isInitiallyExpanded = false,
  enableGestures = true,
  swipeThreshold = 50,
  velocityThreshold = 0.3,
  animationTension = 80,
  animationFriction = 12,
  showTabs = true,
  showHandle = true,
  handleColor = theme.colors.border,
  onStateChange,
  data = [], 
  renderItem, 
}) => {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded)
  const bottomSheetTranslateY = useRef(
    new Animated.Value(isInitiallyExpanded ? expandedHeight : collapsedHeight)
  ).current

  let gestureStartY = isInitiallyExpanded ? expandedHeight : collapsedHeight

  useEffect(() => {
    gestureStartY = isExpanded ? expandedHeight : collapsedHeight
  }, [isExpanded, expandedHeight, collapsedHeight])

  const animateSheet = (toValue, callback) => {
    Animated.spring(bottomSheetTranslateY, {
      toValue,
      useNativeDriver: false,
      tension: animationTension,
      friction: animationFriction,
    }).start(callback)
  }

  const toggleSheet = () => {
    const toValue = isExpanded ? collapsedHeight : expandedHeight
    const newExpandedState = !isExpanded

    animateSheet(toValue, () => {
      onStateChange && onStateChange(newExpandedState)
    })

    setIsExpanded(newExpandedState)
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enableGestures,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        enableGestures && Math.abs(gestureState.dy) > 5,
      onPanResponderGrant: () => {
        bottomSheetTranslateY.stopAnimation((value) => {
          gestureStartY = value
        })
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = gestureStartY + gestureState.dy
        bottomSheetTranslateY.setValue(
          Math.max(expandedHeight, Math.min(collapsedHeight, newY))
        )
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState
        if (dy < -swipeThreshold || vy < -velocityThreshold) {
          setIsExpanded(true)
          animateSheet(expandedHeight, () => {
            onStateChange && onStateChange(true)
          })
        } else if (dy > swipeThreshold || vy > velocityThreshold) {
          setIsExpanded(false)
          animateSheet(collapsedHeight, () => {
            onStateChange && onStateChange(false)
          })
        } else {
          const currentPosition = gestureStartY + dy
          const midPoint = (expandedHeight + collapsedHeight) / 2
          const shouldExpand = currentPosition < midPoint

          setIsExpanded(shouldExpand)
          animateSheet(
            shouldExpand ? expandedHeight : collapsedHeight,
            () => {
              onStateChange && onStateChange(shouldExpand)
            }
          )
        }
      },
    })
  ).current

  const topSectionTranslateY = bottomSheetTranslateY.interpolate({
    inputRange: [expandedHeight, collapsedHeight],
    outputRange: [-300, 0],
    extrapolate: "clamp",
  })

  const topSectionOpacity = bottomSheetTranslateY.interpolate({
    inputRange: [expandedHeight, collapsedHeight],
    outputRange: [0, 1],
    extrapolate: "clamp",
  })

  const dynamicPaddingBottom = screenHeight - collapsedHeight + 10

  return (
    <>
      {/* ✅ Replaced ScrollView with FlatList */}
      <Animated.View
        style={[
          styles.topSection,
          {
            top: hasHeader ? 40 : 0,
            transform: [{ translateY: topSectionTranslateY }],
            opacity: topSectionOpacity,
          },
        ]}
      >
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <View style={styles.centered}>
              <View style={styles.formContainer}>{children}</View>
            </View>
          }
          contentContainerStyle={{
            paddingBottom: dynamicPaddingBottom,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY: bottomSheetTranslateY }],
            backgroundColor: theme?.colors?.card,
            height: screenHeight,
          },
        ]}
        {...(enableGestures ? panResponder.panHandlers : {})}
      >
        {showHandle && (
          <TouchableOpacity
            style={styles.handleArea}
            onPress={toggleSheet}
            activeOpacity={0.8}
          >
            <View style={[styles.handle, { backgroundColor: handleColor }]} />
          </TouchableOpacity>
        )}

        <View style={styles.contentArea}>
          {title && (
            <Text
              style={[
                styles.title,
                {
                  color: theme?.colors?.text,
                  fontFamily: theme.typography.fontFamily.bold,
                  fontSize: theme.typography.fontSize.m,
                },
              ]}
            >
              {title}
            </Text>
          )}

          {showTabs && tabs.length > 0 && (
            <View style={styles.tabRow}>
              {tabs.map((tab) => (
                <Text
                  key={tab}
                  style={[styles.tabText, { color: theme?.colors?.text }]}
                >
                  {tab}
                </Text>
              ))}
            </View>
          )}

          <View
            style={[
              styles.contentContainer,
              !enableGestures && { paddingBottom: 80 },
            ]}
          >
            {React.Children.count(bottomContent) > 0 ? (
              bottomContent
            ) : (
              <View style={styles.emptyState}>
                <Text
                  style={[
                    styles.emptyText,
                    { color: theme?.colors?.textSecondary, fontSize: theme.typography.fontSize.m,fontFamily: theme.typography.fontFamily.bold },
                  ]}
                >
                  {emptyText}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  topSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  centered: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  formContainer: {
    width: "100%",
  },
  title: {
    textAlign: "center",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    paddingBottom:20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 2,
  },
  handleArea: {
    height: 32,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  handle: {
    height: 4,
    width: 40,
    borderRadius: 2,
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    paddingVertical: 8,
  },
  contentContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
   
    textAlign: "center",
  },
})

export default RechargeBottomSheet
