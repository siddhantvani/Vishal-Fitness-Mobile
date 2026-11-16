import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export const PrimaryButton = ({ title, onPress, isLoading, disabled, style, accessibilityLabel, ...props }: any) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || isLoading}
      style={[
        styles.primaryButton,
        { backgroundColor: theme.primary },
        disabled && { opacity: 0.5 },
        style
      ]}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || isLoading, busy: isLoading }}
      accessibilityLabel={accessibilityLabel || title}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={styles.primaryButtonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export const SecondaryButton = ({ title, onPress, disabled, style, accessibilityLabel, ...props }: any) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      style={[
        styles.secondaryButton,
        { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
        disabled && { opacity: 0.5 },
        style
      ]}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel || title}
      {...props}
    >
      <Text style={[styles.secondaryButtonText, { color: theme.text }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export const Card = ({ children, style }: any) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, style]}>
      {children}
    </View>
  );
};

export const GlassCard = ({ children, style }: any) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.glassCard, { backgroundColor: theme.glass, borderColor: theme.border }, style]}>
      {children}
    </View>
  );
};

export const ScreenContainer = ({ children, style, edges = ['top', 'left', 'right'] }: any) => {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={[styles.screenContainer, { backgroundColor: theme.background }, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
};

export const StatusBadge = ({ status }: { status: string }) => {
  const { theme } = useTheme();
  let bgColor = theme.surfaceElevated;
  let borderColor = theme.border;
  let textColor = theme.textSecondary;
  
  if (status === 'COMPLETED' || status === 'CONFIRMED' || status === 'PRESENT') {
    bgColor = 'rgba(16, 185, 129, 0.12)';
    borderColor = 'rgba(16, 185, 129, 0.3)';
    textColor = theme.success;
  } else if (status === 'PENDING' || status === 'LATE') {
    bgColor = 'rgba(245, 158, 11, 0.12)';
    borderColor = 'rgba(245, 158, 11, 0.3)';
    textColor = theme.warning;
  } else if (status === 'CANCELLED' || status === 'ABSENT') {
    bgColor = 'rgba(239, 68, 68, 0.12)';
    borderColor = 'rgba(239, 68, 68, 0.3)';
    textColor = theme.error;
  }

  return (
    <View style={[styles.badgeContainer, { backgroundColor: bgColor, borderColor }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    width: '100%',
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  glassCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  screenContainer: {
    flex: 1,
  },
  badgeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});

