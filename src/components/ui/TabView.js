'use client';

import {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

const {width} = Dimensions.get('window');

export const TabView = ({tabs, initialIndex = 0, nestedTabs = false}) => {
  const {theme} = useTheme();
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const scrollX = useRef(new Animated.Value(initialIndex * width)).current;
  const scrollViewRef = useRef(null);

  const handleTabPress = index => {
    setActiveIndex(index);
    scrollViewRef.current?.scrollTo({x: index * width, animated: true});
  };

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {
      useNativeDriver: false,
      listener: event => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / width);
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
        }
      },
    },
  );

  const renderTabBar = () => {
    const inputRange = tabs.map((_, i) => i * width);

    return (
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: theme.colors.background,
            borderBottomColor: theme.colors.border,
          },
        ]}>
        {tabs.map((tab, index) => {
          const color = scrollX.interpolate({
            inputRange,
            outputRange: tabs.map((_, i) =>
              i === index ? theme.colors.primary : theme.colors.textSecondary,
            ),
            extrapolate: 'clamp',
          });

          const fontWeight = scrollX.interpolate({
            inputRange,
            outputRange: tabs.map((_, i) => (i === index ? '600' : '400')),
            extrapolate: 'clamp',
          });

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => handleTabPress(index)}
              activeOpacity={0.7}>
              <Animated.Text
                style={[
                  {
                    color,
                    fontWeight,
                    fontFamily: theme.typography.fontFamily.medium,
                    fontSize: theme.typography.fontSize.s,
                  },
                ]}>
                {tab.title}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
        <Animated.View
          style={[
            styles.indicator,
            {
              backgroundColor: theme.colors.primary,
              transform: [
                {
                  translateX: scrollX.interpolate({
                    inputRange,
                    outputRange: tabs.map(
                      (_, i) =>
                        i * (width / tabs.length) +
                        (width / tabs.length - 80) / 2,
                    ),
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    );
  };

  if (nestedTabs) {
    return (
      <View style={styles.container}>
        {renderTabBar()}
        <View style={styles.contentContainer}>
          {tabs.map((tab, index) => {
            const TabComponent = tab.component;
            return (
              <View
                key={tab.key}
                style={[
                  styles.tabContent,
                  {display: activeIndex === index ? 'flex' : 'none'},
                ]}>
                <TabComponent />
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderTabBar()}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}>
        {tabs.map((tab, index) => {
          const TabComponent = tab.component;
          return (
            <View key={tab.key} style={[styles.tabContent, {width}]}>
              <TabComponent />
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 48,
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: 80,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});
