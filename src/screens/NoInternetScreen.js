import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useConnectivity} from '../contexts/ConnectivityContext';
import {useTheme} from '../contexts/ThemeContext';
import LottieView from 'lottie-react-native';

const NoInternetScreen = () => {
  const {checkConnection} = useConnectivity();
  const {theme} = useTheme();

  const handleRetry = async () => {
    await checkConnection();
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <LottieView
        source={require('../assets/Animation - 1747225327081.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={[styles.title, {color: theme.colors.text}]}>
        No Internet Connection
      </Text>
      <Text style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
        Please check your internet connection and try again
      </Text>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: theme.colors.primary}]}
        onPress={handleRetry}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default NoInternetScreen;
