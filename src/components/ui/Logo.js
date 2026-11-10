import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const Logo = ({size = 40, color = '#6200ee', showText = false}) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.logoCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}>
        <Icon name="layers" size={size * 0.5} color="#FFFFFF" />
      </View>
      {showText && (
        <Text style={[styles.logoText, {color, fontSize: size * 0.4}]}>
          CTN RBuzz
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: 'bold',
    marginTop: 8,
  },
});
