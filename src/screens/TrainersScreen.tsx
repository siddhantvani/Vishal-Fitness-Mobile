import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ScreenContainer, GlassCard } from '../components/UI';
import { useTheme } from '../context/ThemeContext';
import { UserAvatar } from '../components/UserAvatar';
import { Star, ChevronRight } from 'lucide-react-native';
import apiClient from '../api/api';
import { Trainer } from '../api/types';

const TrainersScreen = ({ navigation }: any) => {
  const { theme } = useTheme();

  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/trainers');
        const activeTrainers = response.data.filter((t: Trainer) => t.isActive);
        setTrainers(activeTrainers);
      } catch (err: any) {
        setError('Failed to load trainers. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTrainers();
    });
    
    return unsubscribe;
  }, [navigation]);

  return (
    <ScreenContainer style={styles.container}>
      {isLoading && trainers.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#ff6b00" />
        </View>
      ) : error && trainers.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={{ color: theme.error, textAlign: 'center', marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity onPress={() => navigation.emit({ type: 'focus' })}>
            <Text style={{ color: '#ff6b00', fontWeight: 'bold' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : trainers.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>No active trainers available right now.</Text>
        </View>
      ) : (
      <FlatList
        data={trainers}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Our Trainers</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Learn from elite fitness experts</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => navigation.navigate('TrainerDetails', { trainer: item })} activeOpacity={0.85}>
            <GlassCard style={styles.card}>
              <View style={styles.cardInner}>
                <View style={[styles.avatarContainer, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                  <UserAvatar 
                    name={`${item.firstName} ${item.lastName}`} 
                    imageUri={item.profileImage}
                    size={80} 
                    theme={theme} 
                  />
                </View>
                <View style={styles.info}>
                  <Text style={[styles.trainerName, { color: theme.text }]}>{item.firstName} {item.lastName}</Text>
                  <Text style={styles.specialization}>{item.specialization || 'Fitness Expert'}</Text>
                  <View style={[styles.ratingBadge, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                    <Star color="#f59e0b" size={14} style={{ marginRight: 4 }} fill="#f59e0b" />
                    <Text style={[styles.ratingText, { color: theme.text }]}>5.0</Text>
                  </View>
                </View>
                <ChevronRight color={theme.textMuted} size={24} />
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
  listContent: { paddingBottom: 40 },
  header: { marginBottom: 24, marginTop: 16 },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, marginTop: 4 },
  card: { marginBottom: 16, padding: 0, overflow: 'hidden' },
  cardInner: { padding: 16, flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { width: 80, height: 80, borderRadius: 16, marginRight: 16, overflow: 'hidden', borderWidth: 1, backgroundColor: '#1a1a1a' },
  info: { flex: 1 },
  trainerName: { fontSize: 20, fontWeight: 'bold', marginBottom: 2 },
  specialization: { color: '#ff6b00', fontSize: 11, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  ratingText: { fontWeight: 'bold', fontSize: 12 }
});

export default TrainersScreen;


