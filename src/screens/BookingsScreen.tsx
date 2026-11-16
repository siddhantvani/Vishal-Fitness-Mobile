import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { ScreenContainer, GlassCard, StatusBadge, PrimaryButton } from '../components/UI';
import { useTheme } from '../context/ThemeContext';
import { CalendarX2 } from 'lucide-react-native';
import apiClient from '../api/api';
import { Booking } from '../api/types';

const BookingsScreen = () => {
  const { theme } = useTheme();
  
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchBookings = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/bookings');
      setBookings(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bookings.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    Alert.alert("Cancel Booking", "Are you sure you want to cancel this class?", [
      { text: "No", style: "cancel" },
      { 
        text: "Yes, Cancel", 
        style: "destructive", 
        onPress: async () => {
          try {
            await apiClient.patch(`/bookings/${id}/cancel`);
            Alert.alert("Cancelled", "Booking has been removed.");
            fetchBookings(true);
          } catch (err: any) {
            Alert.alert("Error", err.response?.data?.message || 'Failed to cancel booking.');
          }
        }
      }
    ]);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'TBD';
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderContent = () => {
    if (isLoading && !isRefreshing) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={{ color: theme.textSecondary }}>Loading bookings...</Text>
        </View>
      );
    }

    if (error && bookings.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={{ color: theme.error, marginBottom: 16 }}>{error}</Text>
          <PrimaryButton title="Retry" onPress={() => fetchBookings(false)} />
        </View>
      );
    }

    return (
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        refreshing={isRefreshing}
        onRefresh={() => fetchBookings(true)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>My Bookings</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Manage your schedule</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <CalendarX2 color={theme.textMuted} size={40} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No active bookings</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>You haven't booked any classes yet. Head over to the Classes tab to get started.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isCancelled = item.status === 'CANCELLED';
          return (
            <GlassCard style={[styles.card, isCancelled && { opacity: 0.6 }]}>
              <View style={[styles.cardTop, { borderBottomColor: theme.border }]}>
                <View style={styles.classInfo}>
                  <Text style={[styles.className, { color: theme.text }]}>{item.schedule.class.name}</Text>
                  <Text style={[styles.trainerName, { color: theme.textSecondary }]}>with {item.schedule.trainer.firstName} {item.schedule.trainer.lastName}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
              
              <View style={[styles.scheduleBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                <View>
                  <Text style={[styles.scheduleLabel, { color: theme.textSecondary }]}>Date</Text>
                  <Text style={[styles.scheduleValue, { color: theme.text }]}>{formatDate(item.schedule.startTime)}</Text>
                </View>
                <View style={styles.alignRight}>
                  <Text style={[styles.scheduleLabel, { color: theme.textSecondary }]}>Time</Text>
                  <Text style={[styles.scheduleValue, { color: theme.text }]}>{formatTime(item.schedule.startTime)}</Text>
                </View>
              </View>

              {!isCancelled && (
                <TouchableOpacity 
                  style={styles.cancelBtn}
                  activeOpacity={0.8}
                  onPress={() => handleCancel(item.id)}
                >
                  <Text style={styles.cancelText}>Cancel Booking</Text>
                </TouchableOpacity>
              )}
            </GlassCard>
          );
        }}
      />
    );
  };

  return (
    <ScreenContainer style={styles.container}>
      {renderContent()}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 16 },
  listContent: { paddingBottom: 40 },
  header: { marginBottom: 24, marginTop: 16 },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, marginTop: 4 },
  card: { marginBottom: 16, padding: 20 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1 },
  classInfo: { flex: 1, marginRight: 16 },
  className: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  trainerName: { fontSize: 14 },
  scheduleBox: { padding: 16, borderRadius: 12, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1 },
  scheduleLabel: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  scheduleValue: { fontWeight: 'bold', fontSize: 15 },
  alignRight: { alignItems: 'flex-end' },
  cancelBtn: { backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingVertical: 14, borderRadius: 12, alignItems: 'center', borderColor: 'rgba(239, 68, 68, 0.3)', borderWidth: 1 },
  cancelText: { color: '#ef4444', fontWeight: 'bold', fontSize: 14, letterSpacing: 0.5 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80, paddingHorizontal: 24 },
  emptyIconBox: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { textAlign: 'center', fontSize: 14, lineHeight: 20 }
});

export default BookingsScreen;


