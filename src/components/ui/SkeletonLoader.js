'use client';

import {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Easing, Dimensions} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

const {width} = Dimensions.get('window');

export const SkeletonLoader = ({type = 'list', count = 3}) => {
  const {theme} = useTheme();
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

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
    ).start();
  }, [fadeAnim]);

  const renderListSkeleton = () => {
    return Array.from({length: count}).map((_, index) => (
      <Animated.View
        key={`skeleton-${index}`}
        style={[
          styles.listItem,
          {
            backgroundColor: theme.colors.backgroundSecondary,
            opacity: fadeAnim,
          },
        ]}>
        <View
          style={[
            styles.listImage,
            {backgroundColor: theme.colors.skeletonHighlight},
          ]}
        />
        <View style={styles.listContent}>
          <View
            style={[
              styles.listTitle,
              {backgroundColor: theme.colors.skeletonHighlight},
            ]}
          />
          <View
            style={[
              styles.listDescription,
              {backgroundColor: theme.colors.skeletonHighlight},
            ]}
          />
          <View
            style={[
              styles.listDescription,
              {
                width: '60%',
                backgroundColor: theme.colors.skeletonHighlight,
              },
            ]}
          />
        </View>
      </Animated.View>
    ));
  };

  const renderGridSkeleton = () => {
    return (
      <View style={styles.gridContainer}>
        {Array.from({length: count}).map((_, index) => (
          <Animated.View
            key={`skeleton-${index}`}
            style={[
              styles.gridItem,
              {
                backgroundColor: theme.colors.backgroundSecondary,
                opacity: fadeAnim,
              },
            ]}>
            <View
              style={[
                styles.gridImage,
                {backgroundColor: theme.colors.skeletonHighlight},
              ]}
            />
            <View style={styles.gridContent}>
              <View
                style={[
                  styles.gridTitle,
                  {backgroundColor: theme.colors.skeletonHighlight},
                ]}
              />
            </View>
          </Animated.View>
        ))}
      </View>
    );
  };

  const renderNotificationSkeleton = () => {
    return Array.from({length: count}).map((_, index) => (
      <Animated.View
        key={`skeleton-${index}`}
        style={[
          styles.notificationItem,
          {
            backgroundColor: theme.colors.backgroundSecondary,
            opacity: fadeAnim,
          },
        ]}>
        <View
          style={[
            styles.notificationIcon,
            {backgroundColor: theme.colors.skeletonHighlight},
          ]}
        />
        <View style={styles.notificationContent}>
          <View
            style={[
              styles.notificationText,
              {backgroundColor: theme.colors.skeletonHighlight},
            ]}
          />
          <View
            style={[
              styles.notificationTime,
              {backgroundColor: theme.colors.skeletonHighlight},
            ]}
          />
        </View>
      </Animated.View>
    ));
  };

  switch (type) {
    case 'grid':
      return <View style={styles.container}>{renderGridSkeleton()}</View>;
    case 'notification':
      return (
        <View style={styles.container}>{renderNotificationSkeleton()}</View>
      );
    case 'list':
    default:
      return <View style={styles.container}>{renderListSkeleton()}</View>;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  listItem: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  listImage: {
    width: 100,
    height: 100,
  },
  listContent: {
    flex: 1,
    padding: 12,
  },
  listTitle: {
    height: 20,
    width: '70%',
    borderRadius: 4,
    marginBottom: 12,
  },
  listDescription: {
    height: 14,
    width: '100%',
    borderRadius: 4,
    marginBottom: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: width / 3 - 20,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
  },
  gridImage: {
    width: '100%',
    height: 120,
  },
  gridContent: {
    padding: 8,
  },
  gridTitle: {
    height: 16,
    width: '100%',
    borderRadius: 4,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    height: 16,
    width: '90%',
    borderRadius: 4,
    marginBottom: 8,
  },
  notificationTime: {
    height: 12,
    width: '40%',
    borderRadius: 4,
  },
});
