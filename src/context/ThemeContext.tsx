import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  isDark: boolean;
  background: string;
  surface: string;
  surfaceElevated: string;
  card: string;
  glass: string;
  glassOverlay: string;
  border: string;
  borderStrong: string;
  text: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  inputBackground: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  tabBarBackground: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  statusBar: 'light-content' | 'dark-content';
  statusBg: string;
  cardHighlight: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  success: string;
  error: string;
  warning: string;
  headerBg: string;
  headerTint: string;
}

export const darkTheme: Theme = {
  isDark: true,
  background: '#09090b',
  surface: '#18181b',
  surfaceElevated: '#27272a',
  card: '#18181b',
  glass: 'rgba(24, 24, 27, 0.85)',
  glassOverlay: 'rgba(9, 9, 11, 0.65)',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.15)',
  text: '#ffffff',
  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  primary: '#ff6b00',
  primaryLight: '#ff8e33',
  primaryDark: '#cc4e00',
  inputBackground: 'rgba(0, 0, 0, 0.4)',
  inputBorder: 'rgba(255, 255, 255, 0.1)',
  inputText: '#ffffff',
  inputPlaceholder: '#52525b',
  tabBarBackground: '#09090b',
  tabBarBorder: '#27272a',
  tabBarActive: '#ff6b00',
  tabBarInactive: '#71717a',
  statusBar: 'light-content',
  statusBg: '#09090b',
  cardHighlight: 'rgba(255, 107, 0, 0.05)',
  badgeBg: 'rgba(255, 107, 0, 0.2)',
  badgeBorder: 'rgba(255, 107, 0, 0.3)',
  badgeText: '#ff6b00',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  headerBg: '#09090b',
  headerTint: '#ffffff',
};

export const lightTheme: Theme = {
  isDark: false,
  background: '#f4f4f5',
  surface: '#ffffff',
  surfaceElevated: '#e4e4e7',
  card: '#ffffff',
  glass: 'rgba(255, 255, 255, 0.95)',
  glassOverlay: 'rgba(244, 244, 245, 0.7)',
  border: '#e4e4e7',
  borderStrong: '#d4d4d8',
  text: '#18181b',
  textPrimary: '#18181b',
  textSecondary: '#52525b',
  textMuted: '#71717a',
  primary: '#ff6b00',
  primaryLight: '#ff8e33',
  primaryDark: '#cc4e00',
  inputBackground: '#ffffff',
  inputBorder: '#d4d4d8',
  inputText: '#18181b',
  inputPlaceholder: '#a1a1aa',
  tabBarBackground: '#ffffff',
  tabBarBorder: '#e4e4e7',
  tabBarActive: '#ff6b00',
  tabBarInactive: '#71717a',
  statusBar: 'dark-content',
  statusBg: '#f4f4f5',
  cardHighlight: 'rgba(255, 107, 0, 0.05)',
  badgeBg: 'rgba(255, 107, 0, 0.12)',
  badgeBorder: 'rgba(255, 107, 0, 0.25)',
  badgeText: '#ff6b00',
  success: '#059669',
  error: '#dc2626',
  warning: '#d97706',
  headerBg: '#ffffff',
  headerTint: '#18181b',
};

interface ThemeContextType {
  isDark: boolean;
  theme: Theme;
  toggleTheme: () => void;
  setThemeMode: (mode: 'dark' | 'light') => void;
}

const THEME_STORAGE_KEY = '@user_theme_preference';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved !== null) {
          setIsDark(saved === 'dark');
        } else if (systemColorScheme) {
          setIsDark(systemColorScheme === 'dark');
        }
      } catch (e) {
        console.log('Error loading theme:', e);
      }
    };
    loadSavedTheme();
  }, [systemColorScheme]);

  const toggleTheme = async () => {
    try {
      const nextMode = !isDark;
      setIsDark(nextMode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode ? 'dark' : 'light');
    } catch (e) {
      console.log('Error saving theme:', e);
    }
  };

  const setThemeMode = async (mode: 'dark' | 'light') => {
    try {
      const nextIsDark = mode === 'dark';
      setIsDark(nextIsDark);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      console.log('Error saving theme:', e);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
