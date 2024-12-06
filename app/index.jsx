import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './LoginScreen'; // Ensure these are the correct paths to your screens
import HomeScreen from './HomeScreen';
import SplashScreen from './SplashScreen'; // Import the SplashScreen component
import ProfileUpdateScreen from './ProfileUpdateScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state to show splash screen

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setIsLoggedIn(true);
      }
      setLoading(false); // Stop loading after the check is complete
    };
    checkLoginStatus();
  }, []);

  if (loading) {
    return <SplashScreen />; // Show splash screen while checking login status
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'Home' : 'Login'} // Dynamically set the initial route
        screenOptions={{
          headerBackVisible: false, // Globally disable back button (optional)
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false, // Optionally hide the header on the login screen
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerLeft: null, // Prevent back navigation on the Home screen
            gestureEnabled: false, // Disable swipe-to-go-back gesture
          }}
        />
        <Stack.Screen
          name="ProfileUpdate"
          component={ProfileUpdateScreen}
          options={{ title: 'Update Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
