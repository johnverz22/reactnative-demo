import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken'); // Clear auth token
    Alert.alert('Logged out', 'You have been logged out successfully.');
    navigation.replace('Login'); // Navigate to login screen
  };

  const navigateToProfileUpdate = () => {
    navigation.navigate('ProfileUpdate'); // Navigate to ProfileUpdateScreen
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Update Profile" onPress={navigateToProfileUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
});

export default HomeScreen;
