import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

const NoInternetScreen = ({onRetry}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.noInternetText} allowFontScaling={false}>
        No Internet Connection
      </Text>
      <Text style={styles.cardText} allowFontScaling={false}>
        Your internet connection is currently not available. Please check or try
        again.
      </Text>
      <Button mode="contained" onPress={onRetry} style={styles.retryButton}>
        Try Again
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.globalbg,
    width: '100%',
    paddingHorizontal: 0,
  },
  noInternetText: {
    fontSize: 24,
    color: Colors.black,
    fontFamily: 'SF_Bold',
  },
  cardText: {
    fontSize: 12,
    color: Colors.textGray,
    fontFamily: 'SF_Light',
    textAlign: 'center',
    width: '70%',
    paddingVertical: 6,
  },
  retryButton: {
    width: '80%',
    marginTop: 50,
    backgroundColor: Colors.Green,
    borderRadius: 6,
  },
});

export default NoInternetScreen;
