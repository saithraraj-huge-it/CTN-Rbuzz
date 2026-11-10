'use client';
import {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import Icon from '../../theme/IconsProvider';
import Skeleton from '../../components/ui/Skeleton';
import {useAuth} from '../../contexts/AuthContext';
import {useData} from '../../contexts/DataProvider';

const services = [
  {key: 'PrepaidMobile', label: 'Prepaid Mobile ', icon: 'PrepaidIcon'},
  {key: 'PostpaidMobile', label: 'Postpaid Mobile', icon: 'PostPaidIcon'},
  {key: 'DTHRecharge', label: 'DTH', icon: 'DthIcon'},
  {key: 'ElectricityScreen', label: 'Electricity', icon: 'ElectricityIcon'},
  {key: 'TrafficChallan', label: 'Traffic Challan', icon: 'TrafficIcon'},
  {key: 'ChannelScreen', label: 'Channels', icon: 'channelIcon'},
  {key: 'CableTvScreen', label: 'Cable TV', icon: 'televisionIcon'},
  {key: 'AddOnService', label: 'Other Add-On Services', icon: 'ServiceIcon'},
];

const HomeScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [loading, setLoading] = useState(true);
  const {user} = useAuth();
  const {getAccountInfo} = useData();

  const screenWidth = Dimensions.get('window').width;
  const padding = 16;
  const gap = 8;
  const rowGap = 16;
  const itemWidth = (screenWidth - padding - rowGap * 2) / 3;
  const itemHeight = itemWidth * 1.0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const createRows = () => {
    const rows = [];
    for (let i = 0; i < services.length; i += 3) {
      rows.push(services.slice(i, i + 3));
    }
    return rows;
  };

  const [accountBalance, setAccountBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await getAccountInfo();
        if (Array.isArray(list) && list.length > 0) {
          const {OBA, SAL, ABA, EAR, PUR} = list[0];
          setAccountBalance(Number(ABA).toFixed(2));
        }
      } catch (error) {
        console.error('Error fetching account info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView
      className="flex-1 px-4 pt-2"
      style={{backgroundColor: theme.colors.background}}>
      {loading ? (
        <>
          <View className="flex-row items-center justify-between w-full mb-4">
            <View style={{flex: 1, paddingRight: 10}}>
              <Skeleton width="40%" height={18} style={{marginBottom: 8}} />
              <Skeleton width="60%" height={22} style={{marginBottom: 8}} />
              <Skeleton width="50%" height={18} style={{marginBottom: 8}} />
              <Skeleton width="70%" height={16} />
            </View>
            <Skeleton type="square" width={80} height={80} borderRadius={12} />
          </View>

          <Skeleton width="40%" height={18} style={{marginBottom: 14}} />

          <View style={{alignItems: 'center'}}>
            {Array.from({length: 3}).map((_, rowIndex) => (
              <View
                key={rowIndex}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: gap,
                }}>
                {Array.from({length: 3}).map((_, colIndex) => (
                  <Skeleton
                    key={`${rowIndex}-${colIndex}`}
                    type="square"
                    width={itemWidth}
                    height={itemHeight}
                    borderRadius={12}
                  />
                ))}
              </View>
            ))}
          </View>

          <Skeleton
            width="50%"
            height={18}
            style={{marginTop: 20, marginBottom: 10}}
          />

          <View
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: 12,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 4,
              minHeight: 50,
              justifyContent: 'center',
              padding: 10,
            }}>
            <Skeleton width="80%" height={16} />
          </View>
        </>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <View style={{flex: 1, flexShrink: 1, paddingRight: 10}}>
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fontFamily.medium,
                  fontSize: theme.typography.fontSize.m,
                }}>
                Hello!
              </Text>
              <Text
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily.medium,
                  fontSize: theme.typography.fontSize.m,
                  flexWrap: 'wrap',
                }}
                numberOfLines={2}>
                {user?.accountName}
              </Text>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontFamily: theme.typography.fontFamily.medium,
                  fontSize: theme.typography.fontSize.s,
                  flexWrap: 'wrap',
                }}
                numberOfLines={2}>
                {user?.accountCode}
              </Text>
              <Text
                className="mt-1"
                style={{
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily.regular,
                  fontSize: theme.typography.fontSize.m,
                }}>
                AccBal:{' '}
                <Text
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.typography.fontFamily.medium,
                    fontSize: theme.typography.fontSize.m,
                  }}>
                  {accountBalance}
                </Text>
              </Text>
            </View>

            <View style={{width: 100, alignItems: 'center'}}>
              <Icon icon="LoginLogo" size={120} />
            </View>
          </View>

          <Text
            className="mt-2 mb-4"
            style={{
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily.medium,
              fontSize: theme.typography.fontSize.m,
            }}>
            Recharges
          </Text>

          <View style={{alignItems: 'center'}}>
            {createRows().map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: gap,
                }}>
                {row.map((service, colIndex) => (
                  <TouchableOpacity
                    key={`${rowIndex}-${colIndex}`}
                    onPress={() => {
                      if (service.key === 'WalletPurchase') return;

                      if (service.key === 'CableTvScreen') {
                        if (user?.url) {
                          Linking.openURL(user.url);
                        } else {
                          console.warn('Cable TV URL is missing');
                        }
                      } else {
                        navigation.navigate(service.key);
                      }
                    }}
                    style={{
                      width: itemWidth,
                      height: itemHeight,
                      backgroundColor: theme.colors.card,
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 6,
                      elevation: 5,
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.2,
                      shadowRadius: 6,
                      opacity: service.key === 'WalletPurchase' ? 0.9 : 1,
                    }}
                    disabled={service.key === 'WalletPurchase'}>
                    <Icon icon={service.icon} size={45} />
                    <Text
                      style={{
                        color: theme.colors.text,
                        fontFamily: theme.typography.fontFamily.regular,
                        textAlign: 'center',
                        fontSize: theme.typography.fontSize.xs,
                        marginTop: 6,
                        flexWrap: 'wrap',
                      }}
                      numberOfLines={2}>
                      {service.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                {row.length < 3 &&
                  Array.from({length: 3 - row.length}).map((_, emptyIndex) => (
                    <View
                      key={`empty-${rowIndex}-${emptyIndex}`}
                      style={{width: itemWidth, height: itemHeight}}
                    />
                  ))}
              </View>
            ))}
          </View>

          <Text
            className="mb-2 mt-4"
            style={{
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily.medium,
              fontSize: theme.typography.fontSize.m,
            }}>
            For More Services
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (user?.url) {
                Linking.openURL(
                  user.url.startsWith('http')
                    ? user.url
                    : `https://${user.url}`,
                );
              }
            }}
            className="p-4 rounded-xl shadow-sm"
            style={{
              backgroundColor: theme.colors.card,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 4,
              minHeight: 50,
            }}>
            <Text
              className="text-center"
              style={{
                color: theme.colors.primary,
                fontFamily: theme.typography.fontFamily.bold,
                fontSize: theme.typography.fontSize.s,
              }}>
              {user?.url}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default HomeScreen;
