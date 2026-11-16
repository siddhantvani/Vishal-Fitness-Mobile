import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ScreenContainer, GlassCard, PrimaryButton } from '../components/UI';
import { useTheme } from '../context/ThemeContext';
import { User as UserIcon, Clock, Activity } from 'lucide-react-native';
import apiClient from '../api/api';
import { GymClass } from '../api/types';

const ClassesScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [classes, setClasses] = React.useState<GymClass[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchClasses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/classes');
      // Ensure we only show active classes
      const activeClasses = response.data.filter((c: GymClass) => c.isActive);
      setClasses(activeClasses);
    } catch (err: any) {
      setError(err.message || 'Failed to load classes.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClasses();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <Text style={{ color: theme.textSecondary }}>Loading classes...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={{ color: theme.error, marginBottom: 16 }}>{error}</Text>
          <PrimaryButton title="Retry" onPress={fetchClasses} />
        </View>
      );
    }

    if (classes.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={{ color: theme.textSecondary }}>No classes available at the moment.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Classes</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Book your next session</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ClassDetails', { classItem: item })} activeOpacity={0.9}>
            <GlassCard style={styles.card}>
              <View style={styles.bgImageContainer}>
                <Image 
                  source={{ uri: index % 2 === 0 ? 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1469&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop' }} 
                  style={styles.bgImage}
                  resizeMode="cover"
                />
                <View style={[styles.gradientOverlay, { backgroundColor: theme.glassOverlay }]} />
              </View>

              <View style={styles.content}>
                <View style={styles.mainInfo}>
                  <View style={styles.typeRow}>
                    <View style={[styles.typeBadge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                      <Text style={[styles.typeText, { color: theme.badgeText }]}>{item.type}</Text>
                    </View>
                  </View>
                  <Text style={[styles.className, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
                  <Text style={[styles.trainerText, { color: theme.textSecondary }]}>
                    {item.defaultTrainer ? `by ${item.defaultTrainer.firstName} ${item.defaultTrainer.lastName}` : 'Instructor TBD'}
                  </Text>
                  
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <UserIcon color="#ff6b00" size={14} style={{ marginRight: 8 }} />
                      <Text style={[styles.detailTextWhite, { color: theme.text }]}>Capacity: {item.capacity}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Activity color={theme.textSecondary} size={14} style={{ marginRight: 8 }} />
                      <Text style={[styles.detailTextMuted, { color: theme.textSecondary }]}>{item.isActive ? 'Active' : 'Inactive'}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={[styles.durationSide, { borderLeftColor: theme.border }]}>
                  <Text style={[styles.durationText, { color: theme.textSecondary }]}>
                    {item.duration} MIN
                  </Text>
                </View>
              </View>
            </GlassCard>
          </TouchableOpacity>
        )}
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
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  container: { paddingHorizontal: 16, paddingTop: 16 },
  listContent: { paddingBottom: 100 },
  header: { marginBottom: 24, marginTop: 16 },
  title: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, marginTop: 4 },
  card: { marginBottom: 16, padding: 0, overflow: 'hidden' },
  bgImageContainer: { position: 'absolute', inset: 0, opacity: 0.25 },
  bgImage: { width: '100%', height: '100%' },
  gradientOverlay: { position: 'absolute', inset: 0 },
  content: { padding: 20, flexDirection: 'row', zIndex: 10 },
  mainInfo: { flex: 1, marginRight: 16 },
  typeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1 },
  typeText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  className: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  trainerText: { fontSize: 14, fontWeight: '500', marginBottom: 20 },
  detailsRow: { flexDirection: 'row', alignItems: 'center' },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  detailTextWhite: { fontWeight: 'bold', fontSize: 14 },
  detailTextMuted: { fontWeight: 'bold', fontSize: 14 },
  durationSide: { width: 48, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, paddingLeft: 16 },
  durationText: { fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase', transform: [{ rotate: '-90deg' }], width: 100, textAlign: 'center', letterSpacing: 2 }
});

export default ClassesScreen;

