import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ScreenContainer, GlassCard } from '../components/UI';
import { useTheme } from '../context/ThemeContext';
import { Target, Activity, Ruler, TrendingUp } from 'lucide-react-native';
import apiClient from '../api/api';
import { Progress } from '../api/types';

const ProgressScreen = ({ navigation }: any) => {
  const { theme } = useTheme();

  const [progressHistory, setProgressHistory] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/progress');
        setProgressHistory(response.data);
      } catch (err: any) {
        setError('Failed to load progress data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProgress();
    });
    
    return unsubscribe;
  }, [navigation]);

  const latestProgress = progressHistory.length > 0 ? progressHistory[0] : null;

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Your Progress</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Track your fitness metrics & evolution</Text>
        </View>

        {isLoading && progressHistory.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
            <ActivityIndicator size="large" color="#ff6b00" />
          </View>
        ) : error && progressHistory.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40, padding: 20 }}>
            <Text style={{ color: theme.error, textAlign: 'center', marginBottom: 16 }}>{error}</Text>
            <TouchableOpacity onPress={() => navigation.emit({ type: 'focus' })}>
              <Text style={{ color: '#ff6b00', fontWeight: 'bold' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : progressHistory.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40, padding: 20 }}>
            <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>No progress recorded yet.</Text>
          </View>
        ) : (
          <>
            <View style={styles.statsRow}>
          <GlassCard style={[styles.statCard, { borderTopColor: '#ff6b00' }]}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 107, 0, 0.15)', borderColor: 'rgba(255, 107, 0, 0.3)' }]}>
              <Target color="#ff6b00" size={24} />
            </View>
              <Text style={[styles.statValue, { color: theme.text }]}>{latestProgress?.weight || '--'} kg</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Current Weight</Text>
            </GlassCard>
            <GlassCard style={[styles.statCard, { borderTopColor: '#10b981' }]}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
                <Activity color="#10b981" size={24} />
              </View>
              <Text style={[styles.statValue, { color: theme.text }]}>{latestProgress?.bodyFatPercentage != null ? `${latestProgress.bodyFatPercentage}%` : '--'}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Body Fat</Text>
            </GlassCard>
          </View>

          <GlassCard style={styles.heightCard}>
            <View style={[styles.heightIconBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <Ruler color={theme.textSecondary} size={28} />
            </View>
            <View>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Height</Text>
              <Text style={[styles.heightValue, { color: theme.text }]}>{latestProgress?.height || '--'} cm</Text>
            </View>
          </GlassCard>

          <View style={styles.historyHeader}>
            <TrendingUp color="#ff6b00" size={22} style={{ marginRight: 10 }} />
            <Text style={[styles.historyTitle, { color: theme.text }]}>History</Text>
          </View>
          
          {progressHistory.map((prog) => (
            <View key={prog.id} style={styles.historyRow}>
              <View style={[styles.dateBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                <Text style={[styles.dateMonth, { color: theme.text }]}>{new Date(prog.recordedAt).toLocaleDateString(undefined, { month: 'short' })}</Text>
                <Text style={[styles.dateYear, { color: theme.textSecondary }]}>{new Date(prog.recordedAt).getFullYear()}</Text>
              </View>
              <GlassCard style={styles.historyCard}>
                <View>
                  <Text style={[styles.historyLabel, { color: theme.textSecondary }]}>Weight</Text>
                  <Text style={[styles.historyValue, { color: theme.text }]}>{prog.weight} kg</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <View style={styles.alignRight}>
                  <Text style={[styles.historyLabel, { color: theme.textSecondary }]}>Body Fat</Text>
                  <Text style={[styles.historyValue, { color: theme.text }]}>{prog.bodyFatPercentage != null ? `${prog.bodyFatPercentage}%` : '--'}</Text>
                </View>
              </GlassCard>
            </View>
          ))}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 16 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { marginBottom: 24, marginTop: 16 },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 20, marginHorizontal: 4, borderTopWidth: 3 },
  iconBox: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1 },
  statValue: { fontWeight: '900', fontSize: 26, marginBottom: 4 },
  statLabel: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  heightCard: { flexDirection: 'row', alignItems: 'center', padding: 20, marginBottom: 28 },
  heightIconBox: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 20, borderWidth: 1 },
  heightValue: { fontWeight: 'bold', fontSize: 22, marginTop: 2 },
  historyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  historyTitle: { fontSize: 22, fontWeight: 'bold', letterSpacing: -0.5 },
  historyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dateBox: { width: 60, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1 },
  dateMonth: { fontWeight: 'bold', fontSize: 15 },
  dateYear: { fontSize: 11 },
  historyCard: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  historyLabel: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  historyValue: { fontWeight: 'bold', fontSize: 18 },
  divider: { width: 1, height: 32 },
  alignRight: { alignItems: 'flex-end' }
});

export default ProgressScreen;


