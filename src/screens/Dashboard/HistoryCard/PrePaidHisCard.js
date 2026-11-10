import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Skeleton from '../../../components/ui/Skeleton';

const HistoryCard = ({item, theme, onPress, loading = false}) => {
  const getStatusColor = status => {
    switch ((status || '').toLowerCase()) {
      case 'success':
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
      case 'failure':
        return '#F44336';
      default:
        return theme?.colors?.textSecondary;
    }
  };

  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatTime = dateString => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => !loading && onPress?.(item)}
      activeOpacity={0.8}
      style={{
        width: '100%',
        backgroundColor: theme.colors.card,
        padding: 10,
        borderRadius: 12,
        marginBottom: 4,
        borderColor: theme.colors.border,
        borderWidth: 1,
      }}>
      {loading ? (
        <>
          <Skeleton
            type="line"
            width="60%"
            height={16}
            style={{marginBottom: 6}}
          />
          <Skeleton type="line" width="40%" height={14} />
          <Skeleton
            type="line"
            width="80%"
            height={12}
            style={{marginTop: 8}}
          />
        </>
      ) : (
        <>
          <View style={{flexDirection: 'column'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexShrink: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {item?.CNM ? (
                  <Text
                    style={{
                      fontSize: theme.typography.fontSize.s,
                      color: theme?.colors?.text,
                      fontFamily: theme.typography.fontFamily.medium,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.CNM}
                  </Text>
                ) : (
                  item?.INM && (
                    <Text
                      style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme?.colors?.text,
                        fontFamily: theme.typography.fontFamily.regular,
                        flexShrink: 1,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {item?.INM || '—'}
                    </Text>
                  )
                )}
              </View>

              {item?.AMT && (
                <Text
                  style={{
                    fontFamily: theme.typography.fontFamily.medium,
                    color: theme?.colors?.text,
                    fontSize: theme.typography.fontSize.m,
                    marginLeft: 8,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  ₹{item?.AMT ? Number(item.AMT).toFixed(0) : '0'}
                </Text>
              )}
            </View>

            {item?.CNM && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginTop: 2,
                }}>
                {item?.ANM && (
                  <Text
                    style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme?.colors?.text,
                      fontFamily: theme.typography.fontFamily.regular,
                      flex: 1,
                      flexWrap: 'wrap',
                    }}
                    ellipsizeMode="tail">
                    {item?.ANM || '—'}
                  </Text>
                )}

                {item?.SPN && (
                  <Text
                    style={{
                      fontSize: theme.typography.fontSize.s,
                      color: theme?.colors?.textSecondary,
                      fontFamily: theme.typography.fontFamily.regular,
                      marginLeft: 8,
                      textAlign: 'right',
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item?.SPN}
                  </Text>
                )}
              </View>
            )}
          </View>

          {item?.CNO && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: theme.typography.fontSize.s,
                  color: theme?.colors?.text,
                  flexShrink: 1,
                  fontFamily: theme.typography.fontFamily.medium,
                  textAlign: 'left',
                  flex: 1,
                }}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item?.CNO || ''}
              </Text>
              <Text
                style={{
                  fontSize: theme.typography.fontSize.s,
                  color: theme?.colors?.textSecondary,
                  fontFamily: theme.typography.fontFamily.regular,
                  flexShrink: 1,
                  textAlign: 'right',
                  marginLeft: 8,
                }}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item?.SNO || ''}
              </Text>
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {item?.EID && (
              <Text
                style={{
                  fontSize: theme.typography.fontSize.s,
                  fontFamily: theme.typography.fontFamily.regular,
                  color: theme?.colors?.textSecondary,
                  flexShrink: 1,
                }}
                numberOfLines={1}
                ellipsizeMode="middle">
                {item.EID}
              </Text>
            )}
            <Text
              style={{
                fontSize: theme.typography.fontSize.s,
                color: theme?.colors?.text,
                flexShrink: 1,
                fontFamily: theme.typography.fontFamily.medium,
                textAlign: 'left',
                flex: 1,
              }}
              numberOfLines={1}
              ellipsizeMode="tail">
              {item?.MNO || ''}
            </Text>
          </View>

          {!item?.CNM && item?.SPN && (
            <Text
              style={{
                fontSize: theme.typography.fontSize.s,
                color: theme?.colors?.textSecondary,
                fontFamily: theme.typography.fontFamily.regular,
                flexShrink: 1,
              }}
              ellipsizeMode="tail">
              {item?.SPN || ''}
            </Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme?.colors?.textSecondary,
                fontFamily: theme.typography.fontFamily.regular,
              }}
              numberOfLines={1}
              ellipsizeMode="tail">
              {`${formatDate(item.CDT)} • ${formatTime(item.CDT)}`}
            </Text>
            {item?.SNM && (
              <View
                style={{
                  backgroundColor: getStatusColor(item?.SNM) + '20',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 10,
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.xs,
                    fontFamily: theme.typography.fontFamily.medium,
                    color: getStatusColor(item?.SNM),
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {item?.SNM || ''}
                </Text>
              </View>
            )}
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

export default HistoryCard;
