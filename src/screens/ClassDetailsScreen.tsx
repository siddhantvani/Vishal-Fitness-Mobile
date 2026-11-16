import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, StatusBar, StyleSheet } from 'react-native';
import { ScreenContainer, PrimaryButton, GlassCard } from '../components/UI';
import { ArrowLeft, Clock, Users, CalendarDays, MapPin } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../api/api';
import { GymClass, Schedule } from '../api/types';

const ClassDetailsScreen = ({ route, navigation }: any) => {
  const { classItem } = route.params as { classItem: GymClass };
  const { theme, isDark } = useTheme();

  const [schedules, setSchedules] = React.useState<Schedule[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = React.useState(true);
  const [scheduleError, setScheduleError] = React.useState<string | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = React.useState<string | null>(null);
  const [isBooking, setIsBooking] = React.useState(false);

  const fetchSchedules = async () => {
    setIsLoadingSchedules(true);
    setScheduleError(null);
    try {
      const response = await apiClient.get('/schedules');
      const now = new Date();
      
      const upcoming = response.data.filter((s: Schedule) => {
        const scheduleDate = new Date(s.startTime);
        return s.classId === classItem.id && scheduleDate > now && s.status === 'ACTIVE';
      }).sort((a: Schedule, b: Schedule) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      
      setSchedules(upcoming);
      if (upcoming.length > 0 && !selectedScheduleId) {
        setSelectedScheduleId(upcoming[0].id);
      }
    } catch (error: any) {
      setScheduleError('Failed to load schedules.');
    } finally {
      setIsLoadingSchedules(false);
    }
  };

  React.useEffect(() => {
    fetchSchedules();
  }, [classItem.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleBook = async () => {
    if (!selectedScheduleId) return;
    
    setIsBooking(true);
    try {
      await apiClient.post('/bookings', { scheduleId: selectedScheduleId });
      Alert.alert("Success", "Class booked successfully!");
      fetchSchedules(); // refresh to update available slots
      navigation.navigate('My Bookings'); // Navigate to bookings tab if it exists
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to book the class. Please try again.';
      Alert.alert("Booking Failed", message);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />
      
      {/* Hero Section */}
      <View style={[styles.heroBackground, { backgroundColor: isDark ? '#18181b' : '#e4e4e7' }]}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1469&auto=format&fit=crop' }} 
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(9, 9, 11, 0.55)' : 'rgba(244, 244, 245, 0.45)' }]} />
        
        <View style={styles.backBtnWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)', borderColor: theme.border }]}>
            <ArrowLeft color={theme.textPrimary} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScreenContainer style={styles.transparentContainer}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{classItem.type}</Text>
            </View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>{classItem.name}</Text>
          </View>

          {/* Info Grid */}
          <View style={styles.grid}>
            <GlassCard style={styles.gridCard}>
              <Clock color="#10b981" size={24} style={styles.gridIcon} />
              <Text style={[styles.gridLabel, { color: theme.textMuted }]}>Duration</Text>
              <Text style={[styles.gridValue, { color: theme.textPrimary }]}>{classItem.duration} min</Text>
            </GlassCard>
            <GlassCard style={styles.gridCard}>
              <Users color="#3b82f6" size={24} style={styles.gridIcon} />
              <Text style={[styles.gridLabel, { color: theme.textMuted }]}>Capacity</Text>
              <Text style={[styles.gridValue, { color: theme.textPrimary }]}>{classItem.capacity} max</Text>
            </GlassCard>
            <GlassCard style={styles.gridCard}>
              <MapPin color={theme.textMuted} size={24} style={styles.gridIcon} />
              <Text style={[styles.gridLabel, { color: theme.textMuted }]}>Location</Text>
              <Text style={[styles.gridValue, { color: theme.textPrimary }]}>Main Studio</Text>
            </GlassCard>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>About this class</Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>{classItem.description}</Text>
          </View>

          {classItem.defaultTrainer ? (
            <GlassCard style={styles.trainerCard}>
              <View style={[styles.trainerAvatar, { backgroundColor: isDark ? '#27272a' : '#e4e4e7', borderColor: theme.border }]}>
                <Text style={[styles.trainerAvatarText, { color: theme.textPrimary }]}>{classItem.defaultTrainer.firstName[0]}</Text>
              </View>
              <View>
                <Text style={styles.trainerLabel}>Default Instructor</Text>
                <Text style={[styles.trainerName, { color: theme.textPrimary }]}>{classItem.defaultTrainer.firstName} {classItem.defaultTrainer.lastName}</Text>
              </View>
            </GlassCard>
          ) : (
            <View style={styles.trainerCard}>
              <Text style={{ color: theme.textSecondary }}>No default trainer assigned.</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Upcoming Schedules</Text>
            {isLoadingSchedules ? (
              <Text style={{ color: theme.textSecondary }}>Loading schedules...</Text>
            ) : scheduleError ? (
              <Text style={{ color: theme.error }}>{scheduleError}</Text>
            ) : schedules.length === 0 ? (
              <Text style={{ color: theme.textSecondary }}>No upcoming sessions for this class.</Text>
            ) : (
              schedules.map((schedule) => {
                const isSelected = selectedScheduleId === schedule.id;
                const isFull = schedule.availableSlots <= 0;
                return (
                  <TouchableOpacity 
                    key={schedule.id} 
                    onPress={() => !isFull && setSelectedScheduleId(schedule.id)}
                    activeOpacity={0.7}
                    disabled={isFull}
                  >
                    <GlassCard 
                      style={[
                        styles.scheduleCard, 
                        isSelected && { borderColor: theme.primary, borderWidth: 2 },
                        isFull && { opacity: 0.5 }
                      ]}
                    >
                      <View style={styles.scheduleInfo}>
                        <Text style={[styles.scheduleDate, { color: theme.textPrimary }]}>
                          {formatDate(schedule.startTime)}
                        </Text>
                        <Text style={[styles.scheduleTime, { color: theme.textSecondary }]}>
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </Text>
                        <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
                          Trainer: {schedule.trainer.firstName} {schedule.trainer.lastName}
                        </Text>
                      </View>
                      <View style={styles.scheduleSlots}>
                        <Text style={[styles.slotNumber, { color: isFull ? theme.error : theme.primary }]}>{schedule.availableSlots}</Text>
                        <Text style={[styles.slotLabel, { color: theme.textSecondary }]}>{isFull ? 'Full' : 'Slots Left'}</Text>
                      </View>
                    </GlassCard>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>

        <View style={[styles.footerContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <PrimaryButton 
            title={schedules.length === 0 ? "No Schedules Available" : "Book Selected Schedule"} 
            onPress={handleBook} 
            disabled={!selectedScheduleId || schedules.length === 0}
            isLoading={isBooking}
          />
        </View>
      </ScreenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  heroBackground: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 320,
    backgroundColor: '#18181b',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 9, 11, 0.55)',
  },
  backBtnWrapper: {
    position: 'absolute',
    top: 48,
    left: 16,
    zIndex: 20,
  },
  backBtn: {
    width: 40, height: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  transparentContainer: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingTop: 180,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  typeBadge: {
    backgroundColor: 'rgba(255, 107, 0, 0.2)',
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderColor: 'rgba(255, 107, 0, 0.3)',
    borderWidth: 1,
  },
  typeText: {
    color: '#ff6b00',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  gridCard: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  gridIcon: {
    marginBottom: 8,
  },
  gridLabel: {
    color: '#a1a1aa',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  gridValue: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  description: {
    color: '#a1a1aa',
    fontSize: 15,
    lineHeight: 24,
  },
  trainerCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainerAvatar: {
    width: 56, height: 56,
    backgroundColor: '#27272a',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  trainerAvatarText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 22,
  },
  trainerLabel: {
    color: '#ff6b00',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  trainerName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 16,
    paddingTop: 24,
    backgroundColor: 'rgba(9, 9, 11, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  scheduleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleDate: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 14,
  },
  scheduleSlots: {
    alignItems: 'center',
    marginLeft: 16,
  },
  slotNumber: {
    fontSize: 20,
    fontWeight: '900',
  },
  slotLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
  }
});

export default ClassDetailsScreen;

