import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TabNavigator from './src/navigation/TabNavigator';
import WorkoutDetailsScreen from './src/screens/WorkoutDetailsScreen';
import ClassDetailsScreen from './src/screens/ClassDetailsScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import TrainersScreen from './src/screens/TrainersScreen';
import TrainerDetailsScreen from './src/screens/TrainerDetailsScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, isLoading } = useAuth();
  const { theme, isDark } = useTheme();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
            <Stack.Screen name="ClassDetails" component={ClassDetailsScreen} />
            <Stack.Screen 
              name="Bookings" 
              component={BookingsScreen} 
              options={{ 
                headerShown: true, 
                title: 'My Bookings', 
                headerStyle: { backgroundColor: theme.headerBg }, 
                headerTintColor: theme.headerTint 
              }} 
            />
            <Stack.Screen 
              name="Trainers" 
              component={TrainersScreen} 
              options={{ 
                headerShown: true, 
                title: 'Trainers', 
                headerStyle: { backgroundColor: theme.headerBg }, 
                headerTintColor: theme.headerTint 
              }} 
            />
            <Stack.Screen name="TrainerDetails" component={TrainerDetailsScreen} />
            <Stack.Screen 
              name="Attendance" 
              component={AttendanceScreen} 
              options={{ 
                headerShown: true, 
                title: 'Attendance History', 
                headerStyle: { backgroundColor: theme.headerBg }, 
                headerTintColor: theme.headerTint 
              }} 
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen} 
              options={{ 
                headerShown: true, 
                title: 'Settings', 
                headerStyle: { backgroundColor: theme.headerBg }, 
                headerTintColor: theme.headerTint 
              }} 
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

import { testBackendConnection } from './src/api/testConnection';

export default function App() {
  React.useEffect(() => {
    // Phase 7.4.1 Development Test - Verify Backend Connectivity
    const runConnectivityTest = async () => {
      const result = await testBackendConnection();
      if (result.success) {
        console.log('[Phase 7.4.1] Connectivity Test Passed:', result.data);
      } else {
        console.error('[Phase 7.4.1] Connectivity Test Failed:', result.message);
      }
    };
    runConnectivityTest();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

