import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StatusBar, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { ScreenContainer, PrimaryButton, GlassCard } from '../components/UI';
import { Dumbbell, User, Mail, Lock, Phone } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../api/api';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  const { theme, isDark } = useTheme();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/register', { 
        firstName: firstName.trim(), 
        lastName: lastName.trim(), 
        email: email.trim(), 
        password 
      });
      // The backend returns { message, token, user } on successful registration
      if (response.data.token && response.data.user) {
        await login(response.data.token, response.data.user);
      } else {
        // If it doesn't auto-login for some reason, navigate back to login
        navigation.goBack();
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />
      
      <View style={styles.bgImageContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop' }} 
          style={styles.bgImage}
          resizeMode="cover"
        />
        <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(9, 9, 11, 0.65)' : 'rgba(244, 244, 245, 0.55)' }]} />
      </View>

      <ScreenContainer style={styles.transparentContainer}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            
            <View style={styles.header}>
              <View style={[styles.logoBox, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                <Dumbbell color={theme.primary} size={36} />
              </View>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Join The Club</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Start your premium fitness journey today.</Text>
            </View>

            <GlassCard style={styles.card}>
              {errorMessage ? (
                <View style={[styles.errorBox, { backgroundColor: theme.error + '20', borderColor: theme.error }]}>
                  <Text style={[styles.errorText, { color: theme.error }]}>{errorMessage}</Text>
                </View>
              ) : null}

              <View style={styles.formGroup}>
                <View style={styles.row}>
                  <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                    <Text style={[styles.label, { color: theme.textMuted }]}>First Name</Text>
                    <View style={styles.inputContainer}>
                      <View style={styles.iconLeft}>
                        <User color={theme.textMuted} size={18} />
                      </View>
                      <TextInput 
                        style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.textPrimary }]} 
                        placeholder="John" 
                        placeholderTextColor={theme.textMuted} 
                        value={firstName}
                        onChangeText={setFirstName}
                        accessibilityLabel="First Name Input"
                      />
                    </View>
                  </View>
                  <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                    <Text style={[styles.label, { color: theme.textMuted }]}>Last Name</Text>
                    <View style={styles.inputContainer}>
                      <View style={styles.iconLeft}>
                        <User color={theme.textMuted} size={18} />
                      </View>
                      <TextInput 
                        style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.textPrimary }]} 
                        placeholder="Doe" 
                        placeholderTextColor={theme.textMuted} 
                        value={lastName}
                        onChangeText={setLastName}
                        accessibilityLabel="Last Name Input"
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={[styles.label, { color: theme.textMuted }]}>Email</Text>
                  <View style={styles.inputContainer}>
                    <View style={styles.iconLeft}>
                      <Mail color={theme.textMuted} size={18} />
                    </View>
                    <TextInput 
                      style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.textPrimary }]} 
                      placeholder="member@example.com" 
                      placeholderTextColor={theme.textMuted} 
                      keyboardType="email-address" 
                      autoCapitalize="none" 
                      value={email}
                      onChangeText={setEmail}
                      accessibilityLabel="Email Input"
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={[styles.label, { color: theme.textMuted }]}>Phone (Optional)</Text>
                  <View style={styles.inputContainer}>
                    <View style={styles.iconLeft}>
                      <Phone color={theme.textMuted} size={18} />
                    </View>
                    <TextInput 
                      style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.textPrimary }]} 
                      placeholder="+91 9876543210" 
                      placeholderTextColor={theme.textMuted} 
                      keyboardType="phone-pad" 
                      value={phone}
                      onChangeText={setPhone}
                      accessibilityLabel="Phone Input"
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={[styles.label, { color: theme.textMuted }]}>Password</Text>
                  <View style={styles.inputContainer}>
                    <View style={styles.iconLeft}>
                      <Lock color={theme.textMuted} size={18} />
                    </View>
                    <TextInput 
                      style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.textPrimary }]} 
                      placeholder="••••••••" 
                      placeholderTextColor={theme.textMuted} 
                      secureTextEntry 
                      value={password}
                      onChangeText={setPassword}
                      accessibilityLabel="Password Input"
                    />
                  </View>
                </View>
              </View>

              <PrimaryButton title="Create Account" onPress={handleRegister} isLoading={isLoading} style={styles.btnSpacing} accessibilityLabel="Create Account Button" />

              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.textSecondary }]}>Already a member? </Text>
                <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Navigate to Sign In" accessibilityRole="button">
                  <Text style={[styles.linkText, { color: theme.primary }]}>Sign In</Text>
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
    backgroundColor: '#09090b',
  },
  bgImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    opacity: 0.35,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 9, 11, 0.65)',
  },
  transparentContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 48,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    color: '#a1a1aa',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    padding: 24,
    marginBottom: 32,
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
  row: {
    flexDirection: 'row',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#a1a1aa',
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
  input: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  btnSpacing: {
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  linkText: {
    color: '#ff6b00',
    fontWeight: 'bold',
    fontSize: 14,
  }
});

export default RegisterScreen;

