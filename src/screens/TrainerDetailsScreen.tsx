import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, StyleSheet } from 'react-native';
import { ScreenContainer, GlassCard } from '../components/UI';
import { ArrowLeft, Star, Briefcase, Calendar } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const TrainerDetailsScreen = ({ route, navigation }: any) => {
  const { trainer } = route.params;
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />
      
      <View style={[styles.heroBackground, { backgroundColor: isDark ? '#18181b' : '#e4e4e7' }]}>
        <Image 
          source={{ uri: trainer.profileImage || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop' }} 
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(9, 9, 11, 0.5)' : 'rgba(244, 244, 245, 0.4)' }]} />
        
        <View style={styles.backBtnWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)', borderColor: theme.border }]}>
            <ArrowLeft color={theme.textPrimary} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScreenContainer style={styles.transparentContainer}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>{trainer.firstName} {trainer.lastName}</Text>
            <View style={styles.specBadge}>
              <Text style={styles.specText}>{trainer.specialization || 'Fitness Expert'}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <GlassCard style={styles.statCard}>
              <Star color="#f59e0b" size={28} style={styles.statIcon} fill="#f59e0b" />
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>5.0</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Rating</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <Briefcase color="#3b82f6" size={28} style={styles.statIcon} />
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>{trainer.experience || 0}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Years Exp.</Text>
            </GlassCard>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Biography</Text>
          <Text style={[styles.bioText, { color: theme.textSecondary }]}>{trainer.bio || 'No biography available.'}</Text>

          <GlassCard style={styles.availCard}>
            <View style={styles.availIconBox}>
              <Calendar color="#ff6b00" size={32} />
            </View>
            <View>
              <Text style={[styles.availLabel, { color: theme.textMuted }]}>Availability</Text>
              <Text style={[styles.availValue, { color: theme.textPrimary }]}>{trainer.availability || 'Contact for schedule'}</Text>
            </View>
          </GlassCard>
        </ScrollView>
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
    height: 380,
    backgroundColor: '#18181b',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.55,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 9, 11, 0.5)',
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
  scroll: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 240, paddingBottom: 60 },
  header: { marginBottom: 28 },
  title: { fontSize: 36, fontWeight: '900', color: '#ffffff', letterSpacing: -0.5, marginBottom: 8 },
  specBadge: {
    backgroundColor: 'rgba(255, 107, 0, 0.2)',
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    borderColor: 'rgba(255, 107, 0, 0.3)',
    borderWidth: 1,
  },
  specText: { color: '#ff6b00', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 20, marginHorizontal: 4 },
  statIcon: { marginBottom: 8 },
  statValue: { color: '#ffffff', fontWeight: 'bold', fontSize: 20 },
  statLabel: { color: '#a1a1aa', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginBottom: 12 },
  bioText: { color: '#a1a1aa', fontSize: 15, lineHeight: 24, marginBottom: 28, fontWeight: '500' },
  availCard: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  availIconBox: { width: 60, height: 60, backgroundColor: 'rgba(255, 107, 0, 0.15)', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16, borderColor: 'rgba(255, 107, 0, 0.3)', borderWidth: 1 },
  availLabel: { color: '#a1a1aa', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  availValue: { color: '#ffffff', fontWeight: 'bold', fontSize: 18 }
});

export default TrainerDetailsScreen;

