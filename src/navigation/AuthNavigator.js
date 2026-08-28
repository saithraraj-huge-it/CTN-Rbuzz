import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import LoginScreen from "../screens/auth/LoginScreen"
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen"

const Stack = createStackNavigator()

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{
              ...TransitionPresets.SlideFromRightIOS,
            }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{
              ...TransitionPresets.SlideFromRightIOS,
            }} />
    </Stack.Navigator>
  )
}

export default AuthNavigator
