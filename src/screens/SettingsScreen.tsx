import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenContainer, GlassCard } from '../components/UI';
import { useTheme } from '../context/ThemeContext';
import { ChevronRight } from 'lucide-react-native';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        </View>

        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Preferences</Text>
        <GlassCard style={styles.card}>
          <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <Text style={[styles.itemText, { color: theme.text }]}>Push Notifications</Text>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications} 
              trackColor={{ false: '#3f3f46', true: '#ff6b00' }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={[styles.row, styles.noBorder]}>
            <Text style={[styles.itemText, { color: theme.text }]}>Dark Mode</Text>
            <Switch 
              value={isDark} 
              onValueChange={toggleTheme} 
              trackColor={{ false: '#d4d4d8', true: '#ff6b00' }}
              thumbColor="#ffffff"
            />
          </View>
        </GlassCard>

        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>About</Text>
        <GlassCard style={styles.card}>
          <TouchableOpacity style={[styles.row, { borderBottomColor: theme.border }]} activeOpacity={0.7}>
            <Text style={[styles.itemText, { color: theme.text }]}>Terms of Service</Text>
            <ChevronRight color={theme.textMuted} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row, { borderBottomColor: theme.border }]} activeOpacity={0.7}>
            <Text style={[styles.itemText, { color: theme.text }]}>Privacy Policy</Text>
            <ChevronRight color={theme.textMuted} size={20} />
          </TouchableOpacity>
          <View style={[styles.row, styles.noBorder]}>
            <Text style={[styles.itemText, { color: theme.text }]}>App Version</Text>
            <Text style={[styles.versionText, { color: theme.textSecondary }]}>1.0.0</Text>
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 16 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { marginBottom: 24, marginTop: 16 },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  sectionLabel: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
  card: { marginBottom: 28, padding: 0, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  noBorder: { borderBottomWidth: 0 },
  itemText: { fontWeight: 'bold', fontSize: 16 },
  versionText: { fontWeight: '500', fontSize: 14 }
});

export default SettingsScreen;


