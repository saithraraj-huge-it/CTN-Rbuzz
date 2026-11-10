import {useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {SharedElement} from 'react-navigation-shared-element';
import Icon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

export const AnimatedFlatList = ({
  data,
  onItemPress,
  refreshing,
  onRefresh,
  animationType = 'scale', // 'scale', 'fade', 'slide'
  numColumns = 1,
  renderType = 'list', // 'list', 'grid'
}) => {
  const {theme} = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;

  const itemHeight = renderType === 'grid' ? 160 : 220; // Estimated item height for inputRange

  const renderListItem = ({item, index}) => {
    const inputRange = [
      index * itemHeight,
      index * itemHeight + 50,
      index * itemHeight + 100,
      index * itemHeight + 150,
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: animationType === 'scale' ? [1, 1, 1, 0.9] : [1, 1, 1, 1],
      extrapolate: 'clamp',
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: animationType === 'fade' ? [1, 1, 1, 0.5] : [1, 1, 1, 1],
      extrapolate: 'clamp',
    });

    const translateX = scrollY.interpolate({
      inputRange,
      outputRange: animationType === 'slide' ? [0, 0, 0, -50] : [0, 0, 0, 0],
      extrapolate: 'clamp',
    });

    if (renderType === 'grid') {
      return (
        <Animated.View
          style={{
            opacity,
            transform: [{scale}, {translateX}],
            width: width / numColumns - 20,
            margin: 5,
          }}>
          <TouchableOpacity
            style={[
              styles.gridItem,
              {backgroundColor: theme.colors.backgroundSecondary},
            ]}
            onPress={() => onItemPress && onItemPress(item)}
            activeOpacity={0.8}>
            <SharedElement id={`item.${item.id}.image`}>
              <Image source={{uri: item.image}} style={styles.gridImage} />
            </SharedElement>
            <View style={styles.gridContent}>
              <SharedElement id={`item.${item.id}.title`}>
                <Text
                  style={[styles.gridTitle, {color: theme.colors.text}]}
                  numberOfLines={1}>
                  {item.title}
                </Text>
              </SharedElement>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        style={{
          opacity,
          transform: [{scale}, {translateX}],
        }}>
        <TouchableOpacity
          style={[
            styles.listItem,
            {backgroundColor: theme.colors.backgroundSecondary},
          ]}
          onPress={() => onItemPress && onItemPress(item)}
          activeOpacity={0.8}>
          <SharedElement id={`item.${item.id}.image`}>
            <Image source={{uri: item.image}} style={styles.listImage} />
          </SharedElement>
          <View style={styles.listContent}>
            <SharedElement id={`item.${item.id}.title`}>
              <Text style={[styles.listTitle, {color: theme.colors.text}]}>
                {item.title}
              </Text>
            </SharedElement>
            {item.description && (
              <Text
                style={[
                  styles.listDescription,
                  {color: theme.colors.textSecondary},
                ]}
                numberOfLines={2}>
                {item.description}
              </Text>
            )}
            {item.price && (
              <Text style={[styles.listPrice, {color: theme.colors.primary}]}>
                ${item.price.toFixed(2)}
              </Text>
            )}
            {(item.likes !== undefined || item.comments !== undefined) && (
              <View style={styles.listStats}>
                {item.likes !== undefined && (
                  <View style={styles.statItem}>
                    <Icon
                      name="heart-outline"
                      size={16}
                      color={theme.colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.statText,
                        {color: theme.colors.textSecondary},
                      ]}>
                      {item.likes}
                    </Text>
                  </View>
                )}
                {item.comments !== undefined && (
                  <View style={styles.statItem}>
                    <Icon
                      name="chatbubble-outline"
                      size={16}
                      color={theme.colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.statText,
                        {color: theme.colors.textSecondary},
                      ]}>
                      {item.comments}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.FlatList
      data={data}
      renderItem={renderListItem}
      keyExtractor={item => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      refreshing={refreshing}
      onRefresh={onRefresh}
      numColumns={numColumns}
      key={numColumns}
      onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
        useNativeDriver: true,
      })}
      scrollEventThrottle={16}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 15,
  },
  listItem: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  listContent: {
    flex: 1,
    padding: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  listDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  listPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listStats: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
  },
  gridItem: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gridImage: {
    width: '100%',
    height: 120,
  },
  gridContent: {
    padding: 8,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
