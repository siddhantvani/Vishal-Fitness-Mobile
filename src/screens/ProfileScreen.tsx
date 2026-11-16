import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenContainer, GlassCard } from '../components/UI';
import { UserAvatar } from '../components/UserAvatar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Settings, LogOut, Award, CalendarCheck, ChevronRight, Users, BookOpen } from 'lucide-react-native';

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: theme.surface }]}>
          <View style={styles.headerGlow} />
          <View style={{ marginBottom: 24, zIndex: 10, alignSelf: 'center' }}>
            <UserAvatar 
              name={`${user?.firstName || ''} ${user?.lastName || ''}`.trim()} 
              imageUri={user?.profileImage}
              size={128} 
              theme={theme} 
            />
          </View>
          <Text style={[styles.nameText, { color: theme.text }]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={[styles.emailText, { color: theme.textSecondary }]}>{user?.email}</Text>
          {user?.phone && (
            <Text style={[styles.emailText, { color: theme.textSecondary, marginTop: -8 }]}>{user?.phone}</Text>
          )}
          
          <View style={[styles.badge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
            <Text style={[styles.badgeText, { color: theme.badgeText }]}>{user?.role || 'MEMBER'}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Account</Text>
          
          <TouchableOpacity onPress={() => navigation.navigate('Progress')} activeOpacity={0.8}>
            <GlassCard style={styles.menuItem}>
              <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(255, 107, 0, 0.1)', borderColor: 'rgba(255, 107, 0, 0.2)' }]}>
                <Award color="#ff6b00" size={24} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.text }]}>My Progress</Text>
              <ChevronRight color={theme.textMuted} size={24} />
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Bookings')} activeOpacity={0.8}>
            <GlassCard style={styles.menuItem}>
              <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.2)' }]}>
                <BookOpen color="#8b5cf6" size={24} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.text }]}>My Bookings</Text>
              <ChevronRight color={theme.textMuted} size={24} />
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Attendance')} activeOpacity={0.8}>
            <GlassCard style={styles.menuItem}>
              <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <CalendarCheck color="#10b981" size={24} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.text }]}>Attendance History</Text>
              <ChevronRight color={theme.textMuted} size={24} />
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Trainers')} activeOpacity={0.8}>
            <GlassCard style={styles.menuItem}>
              <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)' }]}>
                <Users color="#3b82f6" size={24} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.text }]}>Our Trainers</Text>
              <ChevronRight color={theme.textMuted} size={24} />
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Settings')} activeOpacity={0.8}>
            <GlassCard style={styles.menuItem}>
              <View style={[styles.menuIconContainer, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                <Settings color={theme.textSecondary} size={24} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.text }]}>Settings</Text>
              <ChevronRight color={theme.textMuted} size={24} />
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: theme.surfaceElevated, borderColor: 'rgba(239, 68, 68, 0.2)' }]}
            onPress={logout}
            activeOpacity={0.8}
          >
            <LogOut color="#ef4444" size={20} style={{ marginRight: 12 }} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 64, paddingBottom: 48, position: 'relative', overflow: 'hidden' },
  headerGlow: { position: 'absolute', inset: 0, backgroundColor: 'rgba(255, 107, 0, 0.05)' },
  nameText: { fontSize: 32, fontWeight: '900', marginBottom: 4, zIndex: 10 },
  emailText: { fontWeight: '500', zIndex: 10, marginBottom: 16 },
  badge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, borderWidth: 1, zIndex: 10 },
  badgeText: { fontWeight: 'bold', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' },
  content: { paddingHorizontal: 16, paddingTop: 32, paddingBottom: 100 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginLeft: 8, marginBottom: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 12 },
  menuIconContainer: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1 },
  menuItemText: { flex: 1, fontSize: 18, fontWeight: 'bold' },
  logoutButton: { marginTop: 32, paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderWidth: 1 },
  logoutText: { color: '#ef4444', fontWeight: 'bold', fontSize: 18, letterSpacing: 0.5 }
});

export default ProfileScreen;

