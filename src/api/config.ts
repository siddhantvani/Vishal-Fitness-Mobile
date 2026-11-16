// Central API configuration

// Use environment variable if provided, otherwise default to Android Emulator loopback
// 10.0.2.2 points to the host machine from the Android emulator.
// For testing on a physical device, use your machine's actual LAN IP (e.g. 192.168.x.x)
const EXPO_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api';

export const API_CONFIG = {
  baseURL: EXPO_API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
