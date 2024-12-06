import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_BASE_URL } from '../constants/Config';

// Axios interceptor to log requests, good for debugging API requests
// axios.interceptors.request.use(request => {
//     console.log("Request:", request);
//     return request;
// });

const ProfileUpdateScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Fetch user info from AsyncStorage
  useEffect(() => {
    const loadUserInfo = async () => {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      } else {
        Alert.alert('Session Expired', 'Please log in again.');
        navigation.replace('Login'); // Redirect to the Login screen if userInfo is missing
      }
    };
    loadUserInfo();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Correctly set the image URI
    }
  };

  const handleUpdateProfile = async () => {
    if (!username || !imageUri) {
      Alert.alert('Error', 'Please provide both a username and a profile picture.');
      return;
    }

    const formData = new FormData();
    formData.append('user_id', userInfo?.userId);
    formData.append('username', username);
    formData.append('profilePicture', {
      uri: imageUri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/profile-update`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${userInfo?.token}`, // Use the stored token
          },
        }
      );
      
      console.log(response);
      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update profile.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the profile.');
      console.error('Error details:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Welcome, {userInfo?.email || 'User'}</Text>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
      />
      <Button title="Pick Profile Picture" onPress={pickImage} />
      {imageUri && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        </View>
      )}
      <Button title="Update Profile" onPress={handleUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});

export default ProfileUpdateScreen;
