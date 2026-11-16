import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export const getAuthToken = async () => {
  try {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem('authToken');
    }
    return await SecureStore.getItemAsync('authToken');
  } catch (e) {
    return null;
  }
};

export const setAuthToken = async (value: string) => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem('authToken', value);
    } else {
      await SecureStore.setItemAsync('authToken', value);
    }
  } catch (e) {
    console.log('Error saving auth token:', e);
  }
};

export const deleteAuthToken = async () => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('authToken');
    } else {
      await SecureStore.deleteItemAsync('authToken');
    }
  } catch (e) {
    console.log('Error deleting auth token:', e);
  }
};
