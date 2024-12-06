import React, { useState } from 'react';
import { Text, View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/Config';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.token) {
        const userInfo = {
          token: response.data.token,
          userId: response.data.user.user_id, // Assuming the response includes a user object with ID
          email: response.data.user.email, // Assuming email is included
        };

        // Store user info in AsyncStorage
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

        Alert.alert('Login Successful', `Welcome back, ${userInfo.email}`);
        navigation.navigate('Home');
      } else {
        Alert.alert('Login failed', 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong during login.');
      if (axios.isAxiosError(error)) {
        console.error('Axios Error Details:');
        console.error('Message:', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
