import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Animated,
  useWindowDimensions,
} from 'react-native';
import Header from '../../components/layout/Header';
import {useTheme} from '../../contexts/ThemeContext';
import {useData} from '../../contexts/DataProvider';

const AccountScreen = ({navigation}) => {
  const {theme} = useTheme();
  const {getAccountInfo} = useData();

  const {width, height} = useWindowDimensions();

  const cardSpacing = 8;
  const boxSize = (width - 40 - cardSpacing) / 2; // 40 = horizontal padding, 15 = space between

  const [values, setValues] = useState(null);
  const [loading, setLoading] = useState(true);

  const animations = Array(5)
    .fill(0)
    .map(() => ({
      opacity: useRef(new Animated.Value(0)).current,
      scale: useRef(new Animated.Value(0.8)).current,
    }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await getAccountInfo();
        if (Array.isArray(list) && list.length > 0) {
          const {OBA, SAL, ABA, EAR, PUR} = list[0];
          setValues({
            opening: `₹ ${Number(OBA).toFixed(2)}`,
            purchase: `₹ ${Number(PUR).toFixed(2)}`,
            sales: `₹ ${Number(SAL).toFixed(2)}`,
            Accountbalance: `₹ ${Number(ABA).toFixed(2)}`,
            earning: `₹ ${Number(EAR).toFixed(2)}`,
          });
        }
      } catch (error) {
        console.error('Error fetching account info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && values) {
      const animationsSequence = animations.map((anim, index) =>
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 400,
            delay: index * 120,
            useNativeDriver: true,
          }),
          Animated.spring(anim.scale, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
          }),
        ]),
      );
      Animated.stagger(120, animationsSequence).start();
    }
  }, [loading, values]);

  const Card = ({title, value, anim, isLeft, fullWidth}) => (
    <Animated.View
      style={{
        width: fullWidth ? width - 40 : boxSize,
        height: height * 0.16,
        backgroundColor: theme.colors.primary,
        marginRight: isLeft && !fullWidth ? cardSpacing : 0,
        marginBottom: cardSpacing,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
        opacity: anim.opacity,
        transform: [{scale: anim.scale}],
      }}>
      <Text
        style={{
          fontSize: Math.min(width * 0.055, 14),
          color: theme.colors.buttonText,
          fontFamily: theme.typography.fontFamily.medium,
        }}
        allowFontScaling={false}>
        {value}
      </Text>
      <Text
        style={{
          textAlign: 'center',
          color: theme.colors.buttonText,
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: Math.min(width * 0.06, 16),
        }}
        allowFontScaling={false}>
        {title}
      </Text>
    </Animated.View>
  );

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <Header
        title="Account"
        showBack
        alignTitleCenter={false}
        onBackPress={() => navigation.goBack()}
      />

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        values && (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              paddingHorizontal: 20,
              paddingTop: 10,
            }}>
            <Card
              title="Opening"
              value={values.opening}
              anim={animations[0]}
              isLeft
            />
            <Card
              title="My Purchase"
              value={values.purchase}
              anim={animations[1]}
            />
            <Card
              title="Sales"
              value={values.sales}
              anim={animations[2]}
              isLeft
            />
            <Card
              title="Acc Balance"
              value={values.Accountbalance}
              anim={animations[3]}
            />
            <Card
              title="Earning"
              value={values.earning}
              anim={animations[4]}
              fullWidth
            />
          </View>
        )
      )}
    </View>
  );
};

export default AccountScreen;
