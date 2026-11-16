import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { ScreenContainer, GlassCard, StatusBadge } from '../components/UI';
import { useTheme } from '../context/ThemeContext';
import { Play } from 'lucide-react-native';
import apiClient from '../api/api';
import { Workout } from '../api/types';
import { UserAvatar } from '../components/UserAvatar';

const WorkoutsScreen = ({ navigation }: any) => {
  const { theme } = useTheme();

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/workouts');
        setWorkouts(response.data);
      } catch (err: any) {
        setError('Failed to load workouts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchWorkouts();
    });
    
    return unsubscribe;
  }, [navigation]);

  return (
    <ScreenContainer style={styles.container}>
      {isLoading && workouts.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#ff6b00" />
        </View>
      ) : error && workouts.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={{ color: theme.error, textAlign: 'center', marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity onPress={() => navigation.emit({ type: 'focus' })}>
            <Text style={{ color: '#ff6b00', fontWeight: 'bold' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : workouts.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>No workouts assigned yet.</Text>
        </View>
      ) : (
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Your Plan</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Consistency is the key to progress.</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => navigation.navigate('WorkoutDetails', { workout: item })} activeOpacity={0.9}>
            <GlassCard style={styles.card}>
              <View style={styles.bgImageContainer}>
                <Image 
                  source={{ uri: index % 2 === 0 ? 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop' }} 
                  style={styles.bgImage}
                  resizeMode="cover"
                />
              </View>
              
              <View style={[styles.cardTop, { borderBottomColor: theme.border }]}>
                <View style={styles.cardTopLeft}>
                  <Text style={[styles.workoutName, { color: theme.text }]}>{item.title}</Text>
                  <View style={styles.infoRow}>
                    <View style={[styles.diffBadge, { backgroundColor: theme.badgeBg }]}>
                      <Text style={[styles.diffText, { color: theme.badgeText }]}>{item.difficulty}</Text>
                    </View>
                    <Text style={[styles.exCount, { color: theme.textSecondary }]}>{item.exercises?.length || 0} Exercises</Text>
                  </View>
                </View>
                <StatusBadge status={item.status} />
              </View>
              
              <View style={[styles.cardBottom, { backgroundColor: theme.surfaceElevated }]}>
                <View style={styles.trainerRow}>
                  <UserAvatar 
                    name={item.trainer ? `${item.trainer.firstName} ${item.trainer.lastName}` : '?'} 
                    size={32} 
                    theme={theme} 
                  />
                  <Text style={[styles.trainerText, { color: theme.textSecondary, marginLeft: 12 }]}>
                    Assigned by {item.trainer ? `${item.trainer.firstName} ${item.trainer.lastName}` : 'System'}
                  </Text>
                </View>
                <View style={styles.playBtn}>
                  <Play color="white" size={12} style={{ marginLeft: 2 }} />
                </View>
              </View>
            </GlassCard>
          </TouchableOpacity>
        )}
      />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 16 },
  listContent: { paddingBottom: 100 },
  header: { marginBottom: 24, marginTop: 16 },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, marginTop: 4 },
  card: { marginBottom: 16, padding: 0, overflow: 'hidden' },
  bgImageContainer: { position: 'absolute', inset: 0, opacity: 0.1 },
  bgImage: { width: '100%', height: '100%' },
  cardTop: { padding: 20, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 10 },
  cardTopLeft: { flex: 1, marginRight: 16 },
  workoutName: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 12 },
  diffText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  exCount: { fontSize: 14 },
  cardBottom: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  trainerRow: { flexDirection: 'row', alignItems: 'center' },
  trainerText: { fontSize: 14 },
  playBtn: { width: 32, height: 32, backgroundColor: '#ff6b00', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }
});

export default WorkoutsScreen;

