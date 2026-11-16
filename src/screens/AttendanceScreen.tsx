import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ScreenContainer, GlassCard, StatusBadge } from '../components/UI';
import { useTheme } from '../context/ThemeContext';
import { Clock } from 'lucide-react-native';
import apiClient from '../api/api';
import { Attendance } from '../api/types';

const AttendanceScreen = ({ navigation }: any) => {
  const { theme } = useTheme();

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/attendance');
        setAttendance(response.data);
      } catch (err: any) {
        setError('Failed to load attendance records.');
      } finally {
        setIsLoading(false);
      }
    };
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAttendance();
    });
    
    return unsubscribe;
  }, [navigation]);

  return (
    <ScreenContainer style={styles.container}>
      {isLoading && attendance.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#ff6b00" />
        </View>
      ) : error && attendance.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={{ color: theme.error, textAlign: 'center', marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity onPress={() => navigation.emit({ type: 'focus' })}>
            <Text style={{ color: '#ff6b00', fontWeight: 'bold' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : attendance.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>No attendance records yet.</Text>
        </View>
      ) : (
      <FlatList
        data={attendance}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Attendance</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your recent club check-ins</Text>
          </View>
        }
        renderItem={({ item }) => (
          <GlassCard style={styles.card}>
            <View style={[styles.cardHeader, { backgroundColor: theme.surfaceElevated, borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.className, { color: theme.text }]}>{item.schedule?.class?.name || 'Session'}</Text>
                <Text style={[styles.dateText, { color: theme.textSecondary }]}>{new Date(item.checkInTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
              </View>
              <StatusBadge status={item.status} />
            </View>
            
            <View style={styles.timesRow}>
              <View style={styles.timeItem}>
                <View style={[styles.clockIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
                  <Clock color="#10b981" size={16} />
                </View>
                <View>
                  <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Check In</Text>
                  <Text style={[styles.timeValue, { color: theme.text }]}>{new Date(item.checkInTime).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</Text>
                </View>
              </View>
              <View style={styles.timeItem}>
                <View style={[styles.clockIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)' }]}>
                  <Clock color="#ef4444" size={16} />
                </View>
                <View>
                  <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Check Out</Text>
                  <Text style={[styles.timeValue, { color: theme.text }]}>{item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '—'}</Text>
                </View>
              </View>
            </View>
          </GlassCard>
        )}
      />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 16 },
  listContent: { paddingBottom: 40 },
  header: { marginBottom: 24, marginTop: 16 },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, marginTop: 4 },
  card: { marginBottom: 16, padding: 0, overflow: 'hidden' },
  cardHeader: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1 },
  className: { fontSize: 20, fontWeight: 'bold', marginBottom: 2 },
  dateText: { fontSize: 14, fontWeight: '500' },
  timesRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  timeItem: { flexDirection: 'row', alignItems: 'center' },
  clockIconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1 },
  timeLabel: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  timeValue: { fontWeight: 'bold', fontSize: 15 }
});

export default AttendanceScreen;


