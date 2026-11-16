import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ScreenContainer, PrimaryButton, GlassCard } from '../components/UI';
import apiClient from '../api/api';
import { Dumbbell, Eye, EyeOff, Mail, Lock } from 'lucide-react-native';

const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  const { theme, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { email: email.trim(), password });
      await login(response.data.token, response.data.user);
    } catch (error: any) {
      setErrorMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />
      
      {/* Background Hero Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop' }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={[styles.overlayDark, { backgroundColor: theme.glassOverlay }]} />
      </View>

      <ScreenContainer style={styles.transparentContainer}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoSection}>
              <View style={[styles.logoBox, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                <Dumbbell color={theme.primary} size={40} />
              </View>
              <Text style={[styles.title, { color: theme.text }]}>VISHAL FITNESS</Text>
              <Text style={[styles.subtitle, { color: theme.primary }]}>The Club</Text>
            </View>

            <GlassCard style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={[styles.welcomeText, { color: theme.text }]}>Welcome Back</Text>
                <Text style={[styles.supportText, { color: theme.textSecondary }]}>Sign in to continue your fitness journey</Text>
              </View>

              {errorMessage ? (
                <View style={[styles.errorBox, { backgroundColor: theme.error + '20', borderColor: theme.error }]}>
                  <Text style={[styles.errorText, { color: theme.error }]}>{errorMessage}</Text>
                </View>
              ) : null}

              <View style={styles.formGroup}>
                <View style={styles.inputWrapper}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>Email Address</Text>
                  <View style={styles.inputContainer}>
                    <View style={styles.iconLeft}>
                      <Mail color={theme.textMuted} size={20} />
                    </View>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.inputText }]}
                      placeholder="member@example.com"
                      placeholderTextColor={theme.inputPlaceholder}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      accessibilityLabel="Email Address Input"
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>Password</Text>
                  <View style={styles.inputContainer}>
                    <View style={styles.iconLeft}>
                      <Lock color={theme.textMuted} size={20} />
                    </View>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.inputText }]}
                      placeholder="••••••••"
                      placeholderTextColor={theme.inputPlaceholder}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      accessibilityLabel="Password Input"
                    />
                    <TouchableOpacity 
                      style={styles.iconRight}
                      onPress={() => setShowPassword(!showPassword)}
                      accessibilityLabel={showPassword ? "Hide Password" : "Show Password"}
                      accessibilityRole="button"
                    >
                      {showPassword ? <EyeOff color={theme.textMuted} size={20} /> : <Eye color={theme.textMuted} size={20} />}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <PrimaryButton title="Sign In" onPress={handleLogin} isLoading={isLoading} style={styles.btnSpacing} accessibilityLabel="Sign In Button" />
              
              <View style={styles.footer}>
                <Text style={[styles.supportText, { color: theme.textSecondary }]}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')} accessibilityLabel="Navigate to Register" accessibilityRole="button">
                  <Text style={[styles.linkText, { color: theme.primary }]}>Register Now</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.35,
  },
  overlayDark: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  transparentContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 32,
  },
  logoSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 32,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#ff6b00',
    fontWeight: 'bold',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  card: {
    padding: 24,
  },
  cardHeader: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
  },
  errorBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    justifyContent: 'center',
  },
  iconLeft: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  iconRight: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 48,
    paddingRight: 48,
    paddingVertical: 16,
    fontWeight: '500',
  },
  btnSpacing: {
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: '#ff6b00',
    fontWeight: 'bold',
  }
});

export default LoginScreen;

