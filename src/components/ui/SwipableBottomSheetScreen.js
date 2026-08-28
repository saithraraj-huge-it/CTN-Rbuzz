
import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Header } from '../../components/layout/Header';

const { height: screenHeight } = Dimensions.get('window');
const HALF_HEIGHT = screenHeight * 0.5;
const EXPANDED_HEIGHT = 100;

function PostPaidScreen({ navigation }) {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const bottomSheetTranslateY = useRef(new Animated.Value(HALF_HEIGHT)).current;
  const scrollOffset = useRef(0);
  let gestureStartY = HALF_HEIGHT;

  const animateSheet = (toValue) => {
    Animated.spring(bottomSheetTranslateY, {
      toValue,
      useNativeDriver: false,
      tension: 80,
      friction: 12,
    }).start();
  };

  const toggleSheet = () => {
    const toValue = isExpanded ? HALF_HEIGHT : EXPANDED_HEIGHT;
    animateSheet(toValue);
    setIsExpanded(!isExpanded);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderGrant: () => {
        bottomSheetTranslateY.stopAnimation(value => {
          gestureStartY = value;
        });
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = gestureStartY + gestureState.dy;
        bottomSheetTranslateY.setValue(Math.max(EXPANDED_HEIGHT, Math.min(HALF_HEIGHT, newY)));
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;
        if (dy < -50 || vy < -0.3) {
          setIsExpanded(true);
          animateSheet(EXPANDED_HEIGHT);
        } else {
          setIsExpanded(false);
          animateSheet(HALF_HEIGHT);
        }
      },
    })
  ).current;

  const topSectionTranslateY = bottomSheetTranslateY.interpolate({
    inputRange: [EXPANDED_HEIGHT, HALF_HEIGHT],
    outputRange: [-300, 0],
    extrapolate: 'clamp',
  });

  const topSectionOpacity = bottomSheetTranslateY.interpolate({
    inputRange: [EXPANDED_HEIGHT, HALF_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const plans = [
    { price: 129, validity: 28, desc: 'Get Truly Unlimited Local/National Calls to all Networks + 2GB + 300 SMS' },
    { price: 199, validity: 28, desc: 'Unlimited Calls + 1.5GB/day + 100 SMS/day' },
    { price: 249, validity: 28, desc: 'Unlimited Calls + 2GB/day + 100 SMS/day' },
    { price: 299, validity: 28, desc: 'Unlimited Calls + 3GB/day + 100 SMS/day' },
    { price: 399, validity: 56, desc: 'Unlimited Calls + 2.5GB/day + 100 SMS/day' },
    { price: 499, validity: 56, desc: 'Unlimited Calls + 3GB/day + 100 SMS/day + Disney+ Hotstar' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Airtel Prepaid"
        showBack
        alignTitleCenter={false}
        onBackPress={() => navigation.goBack()}
      />

      <Animated.View
        style={[
          styles.topSection,
          {
            transform: [{ translateY: topSectionTranslateY }],
            opacity: topSectionOpacity,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.centered}>
            <Text style={styles.title}>Airtel Prepaid</Text>
            <Text style={styles.subtitle}>Select a plan below to get started</Text>

            <View style={styles.additionalContent}>
              {[{ title: 'Popular Plans', desc: 'Choose from our most popular prepaid plans with unlimited calling and high-speed data.' },
              { title: 'Special Offers', desc: 'Get extra benefits with our special recharge offers. Limited time deals available.' },
              { title: 'Data Add-ons', desc: 'Need more data? Choose from our flexible data add-on packs starting from ₹19.' },
              { title: 'Roaming Plans', desc: 'Stay connected while traveling with our affordable international roaming plans.' },
              { title: 'Family Plans', desc: 'Save more with family plans that offer shared data and calling benefits.' }].map((section, i) => (
                <View key={i}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionDesc}>{section.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      <Animated.View
        style={[styles.bottomSheet, { transform: [{ translateY: bottomSheetTranslateY }] }]}
        {...panResponder.panHandlers}
      >
        {/* Touchable Handle to Toggle */}
        <TouchableOpacity style={styles.handleArea} onPress={toggleSheet} activeOpacity={0.8}>
          <View style={styles.handle} />
        </TouchableOpacity>

        <View style={styles.contentArea}>
          <View style={styles.tabRow}>
            {['For You', 'Data', 'Special Recharge', 'Topup'].map(tab => (
              <Text key={tab} style={styles.tabText}>
                {tab}
              </Text>
            ))}
          </View>

          <ScrollView
            style={styles.planScrollView}
            contentContainerStyle={styles.planScrollContent}
            showsVerticalScrollIndicator
            nestedScrollEnabled
            scrollEnabled={isExpanded}
            onScroll={(e) => {
              scrollOffset.current = e.nativeEvent.contentOffset.y;
              if (scrollOffset.current > 10 && !isExpanded) {
                setIsExpanded(true);
                animateSheet(EXPANDED_HEIGHT);
              }
            }}
            scrollEventThrottle={16}
          >
            {plans.map((plan, index) => (
              <TouchableOpacity key={index} style={styles.card}>
                <Text style={styles.planPrice}>₹{plan.price}</Text>
                <Text style={styles.planDetail}>Talktime: ₹0</Text>
                <Text style={styles.planDetail}>Validity: {plan.validity} days</Text>
                <Text style={styles.planDesc}>{plan.desc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: screenHeight * 0.6,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
    color: '#E60012',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  additionalContent: {
    width: '100%',
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  sectionDesc: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: screenHeight,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 2,
  },
  handleArea: {
    height: 32,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  handle: {
    height: 4,
    width: 40,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    paddingVertical: 8,
  },
  planScrollView: {
    flex: 1,
  },
  planScrollContent: {
    paddingBottom: 100,
  },
  card: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E60012',
  },
  planDetail: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
  planDesc: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default PostPaidScreen

