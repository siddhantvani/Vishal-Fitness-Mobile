import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, StyleSheet } from 'react-native';
import { ScreenContainer, PrimaryButton, GlassCard } from '../components/UI';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Clock, Flame, Play, MoreHorizontal } from 'lucide-react-native';

const WorkoutDetailsScreen = ({ route, navigation }: any) => {
  const { workout } = route.params;
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />
      
      <View style={styles.bgImageContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop' }} 
          style={styles.bgImage}
          resizeMode="cover"
        />
        <View style={[styles.overlay, { backgroundColor: theme.glassOverlay }]} />
      </View>

      <ScreenContainer style={styles.transparentContainer}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.iconBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <ArrowLeft color={theme.text} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <MoreHorizontal color={theme.text} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.diffBadge}>
              <Text style={styles.diffText}>{workout.difficulty}</Text>
            </View>
            <Text style={[styles.title, { color: theme.text }]}>{workout.title}</Text>
            <Text style={[styles.notes, { color: theme.textSecondary }]}>{workout.description || workout.goal || 'No description provided.'}</Text>
          </View>

          <View style={styles.statsRow}>
            <GlassCard style={styles.statCard}>
              <Clock color="#ff6b00" size={24} style={styles.statIcon} />
              <Text style={[styles.statValue, { color: theme.text }]}>{workout.duration || '--'} min</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Est. Time</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <Flame color="#ef4444" size={24} style={styles.statIcon} />
              <Text style={[styles.statValue, { color: theme.text }]}>{workout.difficulty}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Intensity</Text>
            </GlassCard>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Exercises</Text>
            <Text style={[styles.exerciseCount, { color: theme.textSecondary }]}>{workout.exercises?.length || 0} Total</Text>
          </View>
          
          {(workout.exercises || []).map((ex: any, idx: number) => (
            <GlassCard key={idx} style={styles.exerciseCard}>
              <View style={[styles.numberBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                <Text style={[styles.numberText, { color: theme.text }]}>{idx + 1}</Text>
              </View>
              <View style={styles.exerciseDetails}>
                <Text style={[styles.exerciseName, { color: theme.text }]}>{ex.name}</Text>
                <Text style={styles.exerciseSub}>
                  <Text style={styles.setsText}>{ex.sets || 0} sets </Text>
                  <Text style={[styles.repsText, { color: theme.textSecondary }]}>
                    • {ex.repetitions > 0 ? `${ex.repetitions} reps` : ex.duration ? `${ex.duration}s` : ''}
                  </Text>
                </Text>
                {ex.notes && (
                  <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>{ex.notes}</Text>
                )}
              </View>
              <View style={[styles.restBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                <Text style={[styles.restLabel, { color: theme.textSecondary }]}>Rest</Text>
                <Text style={[styles.restValue, { color: theme.text }]}>{ex.restTime ? `${ex.restTime}s` : '--'}</Text>
              </View>
            </GlassCard>
          ))}
        </ScrollView>

        <View style={[styles.footerContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <PrimaryButton title="Start Workout" onPress={() => {}} />
        </View>
      </ScreenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImageContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 300,
  },
  bgImage: {
    width: '100%',
    height: '100%',
    opacity: 0.35,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  transparentContainer: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  navBar: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  iconBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  scroll: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 16, paddingBottom: 120 },
  header: { marginBottom: 24 },
  diffBadge: {
    backgroundColor: 'rgba(255, 107, 0, 0.2)',
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderColor: 'rgba(255, 107, 0, 0.3)',
    borderWidth: 1,
  },
  diffText: {
    color: '#ff6b00',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  notes: {
    fontSize: 15,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 4,
  },
  statIcon: { marginBottom: 8 },
  statValue: { fontWeight: 'bold', fontSize: 18 },
  statLabel: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  exerciseCount: {
    fontWeight: '500',
  },
  exerciseCard: {
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberBox: {
    width: 44, height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
  },
  numberText: { fontWeight: '900', fontSize: 18 },
  exerciseDetails: { flex: 1 },
  exerciseName: { fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  exerciseSub: { fontSize: 14 },
  setsText: { color: '#ff6b00', fontWeight: 'bold' },
  repsText: {},
  restBox: {
    alignItems: 'flex-end',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  restLabel: { fontSize: 9, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 2 },
  restValue: { fontWeight: 'bold', fontSize: 12 },
  footerContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 16,
    paddingTop: 24,
    borderTopWidth: 1,
  }
});

export default WorkoutDetailsScreen;


