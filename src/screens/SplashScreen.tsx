import React from 'react';
import { View, Text, ActivityIndicator, Image, StatusBar, StyleSheet } from 'react-native';
import { Dumbbell } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const SplashScreen = () => {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />
      
      <View style={styles.background}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop' }} 
          style={styles.bgImage}
          resizeMode="cover"
        />
        <View style={[styles.overlay, { backgroundColor: theme.glassOverlay }]} />
      </View>

      <View style={[styles.logoBox, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder, shadowColor: theme.primary }]}>
        <Dumbbell color={theme.primary} size={54} />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>VISHAL FITNESS</Text>
      <Text style={[styles.subtitle, { color: theme.primary }]}>The Club</Text>
      
      <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFill,
  },
  bgImage: {
    width: '100%',
    height: '100%',
    opacity: 0.25,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 48,
  },
  loader: {
    marginTop: 16,
  }
});

export default SplashScreen;


