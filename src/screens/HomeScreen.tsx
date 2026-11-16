import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ScreenContainer, GlassCard } from '../components/UI';
import { UserAvatar } from '../components/UserAvatar';
import { Dumbbell, Target, Activity, ArrowRight, Clock, MapPin, Bell } from 'lucide-react-native';
import apiClient from '../api/api';
import { Booking, Workout } from '../api/types';
const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  
  const [upcomingBooking, setUpcomingBooking] = React.useState<Booking | null>(null);
  const [isLoadingBooking, setIsLoadingBooking] = React.useState(true);
  const [bookingError, setBookingError] = React.useState<string | null>(null);

  const [activeWorkout, setActiveWorkout] = React.useState<Workout | null>(null);

  const fetchDashboardData = async () => {
    setIsLoadingBooking(true);
    setBookingError(null);
    try {
      const [bookingsRes, workoutsRes] = await Promise.all([
        apiClient.get('/bookings'),
        apiClient.get('/workouts')
      ]);

      const now = new Date();
      
      const upcoming = bookingsRes.data.filter((b: Booking) => {
        return b.status === 'CONFIRMED' && new Date(b.schedule.startTime!) > now;
      }).sort((a: Booking, b: Booking) => new Date(a.schedule.startTime!).getTime() - new Date(b.schedule.startTime!).getTime());
      
      setUpcomingBooking(upcoming.length > 0 ? upcoming[0] : null);

      const active = workoutsRes.data.filter((w: Workout) => w.status === 'ACTIVE');
      setActiveWorkout(active.length > 0 ? active[0] : null);

    } catch (err: any) {
      setBookingError('Failed to load dashboard data.');
    } finally {
      setIsLoadingBooking(false);
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDashboardData();
    });
    return unsubscribe;
  }, [navigation]);

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />
      
      <View style={styles.heroBackground}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop' }} 
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={[styles.overlay, { backgroundColor: theme.glassOverlay }]} />
      </View>

      <ScreenContainer style={styles.transparentBg}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <View>
              <Text style={[styles.greetingText, { color: theme.primary }]}>Welcome Back</Text>
              <Text style={[styles.nameText, { color: theme.text }]}>{user?.firstName}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                <Bell color={theme.text} size={20} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')} accessibilityLabel="Profile" accessibilityRole="button">
                <UserAvatar 
                  name={`${user?.firstName || ''} ${user?.lastName || ''}`.trim()} 
                  size={48} 
                  theme={theme} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.content}>
            {activeWorkout ? (
              <TouchableOpacity onPress={() => navigation.navigate('Workouts')} activeOpacity={0.9}>
                <View style={[styles.workoutCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={[styles.cardHighlight, { backgroundColor: theme.cardHighlight }]} />
                  <View style={styles.workoutCardInner}>
                    <View style={[styles.badge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                      <Text style={[styles.badgeText, { color: theme.badgeText }]}>Today's Plan</Text>
                    </View>
                    <Text style={[styles.workoutTitle, { color: theme.text }]}>{activeWorkout.title}</Text>
                    <Text style={[styles.workoutSubtitle, { color: theme.textSecondary }]}>{activeWorkout.exercises?.length || 0} Exercises • {activeWorkout.difficulty} Intensity</Text>
                    
                    <View style={styles.workoutFooter}>
                      <View style={styles.workoutAction}>
                        <View style={[styles.miniIconBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                          <Dumbbell color={theme.primary} size={14} />
                        </View>
                        <Text style={[styles.startText, { color: theme.text }]}>Start Training</Text>
                      </View>
                      <View style={[styles.arrowBox, { backgroundColor: theme.primary }]}>
                        <ArrowRight color="#ffffff" size={20} />
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate('Workouts')} activeOpacity={0.9}>
                <View style={[styles.workoutCard, { backgroundColor: theme.surface, borderColor: theme.border, alignItems: 'center', justifyContent: 'center', padding: 24 }]}>
                  <Text style={{ color: theme.textSecondary }}>No active workouts assigned.</Text>
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.statsRow}>
              <GlassCard style={styles.statCard}>
                <Target color={theme.primary} size={24} style={styles.statIcon} />
                <Text style={[styles.statValue, { color: theme.text }]}>{user?.weight || '--'} kg</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Weight</Text>
              </GlassCard>
              <GlassCard style={styles.statCard}>
                <Activity color={theme.success} size={24} style={styles.statIcon} />
                <Text style={[styles.statValue, { color: theme.text }]}>{user?.bodyFat != null ? `${user.bodyFat}%` : '--'}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Body Fat</Text>
              </GlassCard>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Next Class</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Bookings')} accessibilityLabel="See all bookings" accessibilityRole="button">
                <Text style={[styles.seeAllText, { color: theme.primary }]}>See all</Text>
              </TouchableOpacity>
            </View>

            {isLoadingBooking ? (
              <GlassCard style={styles.emptyStateCard}>
                <Text style={{ color: theme.textSecondary }}>Loading bookings...</Text>
              </GlassCard>
            ) : bookingError ? (
              <GlassCard style={styles.emptyStateCard}>
                <Text style={{ color: theme.error, marginBottom: 8 }}>{bookingError}</Text>
                <TouchableOpacity onPress={fetchDashboardData}>
                  <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Retry</Text>
                </TouchableOpacity>
              </GlassCard>
            ) : !upcomingBooking ? (
              <GlassCard style={styles.emptyStateCard}>
                <Text style={{ color: theme.textSecondary }}>No upcoming classes booked.</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Classes')} style={{ marginTop: 12 }}>
                  <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Find a class</Text>
                </TouchableOpacity>
              </GlassCard>
            ) : (
              <TouchableOpacity activeOpacity={0.9} accessibilityLabel="Upcoming Class Details" accessibilityRole="button">
                <GlassCard style={styles.classCard}>
                  <View style={[styles.classStrip, { backgroundColor: theme.primary }]} />
                  <View style={styles.classContent}>
                    <View style={styles.classTopRow}>
                      <View>
                        <Text style={[styles.className, { color: theme.text }]}>{upcomingBooking.schedule.class.name}</Text>
                        <Text style={[styles.classTrainer, { color: theme.textSecondary }]}>with {upcomingBooking.schedule.trainer.firstName} {upcomingBooking.schedule.trainer.lastName}</Text>
                      </View>
                      <View style={[styles.classTypeBadge, { backgroundColor: theme.badgeBg }]}>
                        <Text style={[styles.classTypeText, { color: theme.badgeText }]}>{upcomingBooking.schedule.class.type}</Text>
                      </View>
                    </View>
                    
                    <View style={[styles.classBottomRow, { borderTopColor: theme.border }]}>
                      <View style={styles.classDetailItem}>
                        <Clock color={theme.textSecondary} size={14} style={{ marginRight: 8 }} />
                        <Text style={[styles.classDetailText, { color: theme.textSecondary }]}>
                          {formatDate(upcomingBooking.schedule.startTime!)} at {formatTime(upcomingBooking.schedule.startTime!)}
                        </Text>
                      </View>
                      <View style={styles.classDetailItem}>
                        <MapPin color={theme.textSecondary} size={14} style={{ marginRight: 8 }} />
                        <Text style={[styles.classDetailText, { color: theme.textSecondary }]}>Main Studio</Text>
                      </View>
                    </View>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            )}
            
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>
      </ScreenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroBackground: { position: 'absolute', top: 0, left: 0, right: 0, height: '45%' },
  heroImage: { width: '100%', height: '100%', opacity: 0.2 },
  overlay: { position: 'absolute', inset: 0 },
  transparentBg: { backgroundColor: 'transparent' },
  scroll: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 48, paddingBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greetingText: { fontSize: 12, fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  nameText: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginRight: 16 },
  content: { paddingHorizontal: 16 },
  workoutCard: { borderRadius: 24, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  cardHighlight: { position: 'absolute', inset: 0 },
  workoutCardInner: { padding: 24 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, alignSelf: 'flex-start', marginBottom: 16, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  workoutTitle: { fontWeight: '900', fontSize: 24, marginBottom: 8 },
  workoutSubtitle: { fontSize: 14, marginBottom: 24 },
  workoutFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  workoutAction: { flexDirection: 'row', alignItems: 'center' },
  miniIconBox: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginRight: 8 },
  startText: { fontWeight: 'bold', fontSize: 14 },
  arrowBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 20, marginHorizontal: 8 },
  statIcon: { marginBottom: 8 },
  statValue: { fontWeight: 'bold', fontSize: 20, marginBottom: 4 },
  statLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, paddingHorizontal: 8 },
  sectionTitle: { fontWeight: '900', fontSize: 20, letterSpacing: -0.5 },
  seeAllText: { fontWeight: 'bold', fontSize: 14 },
  classCard: { padding: 0, overflow: 'hidden', flexDirection: 'row' },
  classStrip: { width: 4, height: '100%' },
  classContent: { flex: 1, padding: 20, paddingLeft: 24 },
  classTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  className: { fontWeight: 'bold', fontSize: 18, marginBottom: 2 },
  classTrainer: { fontSize: 14 },
  classTypeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  classTypeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  classBottomRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  classDetailItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  classDetailText: { fontSize: 12, fontWeight: '500' },
  emptyStateCard: { padding: 24, alignItems: 'center', justifyContent: 'center' }
});

export default HomeScreen;
