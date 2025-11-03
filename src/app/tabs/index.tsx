import React, { useCallback, memo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ChallengeCard } from '../../components/challenge/ChallengeCard';
import { GlassCard } from '../../components/ui/GlassCard'; // ✅ Added
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import {
  useMusicStore,
  selectChallenges,
  selectCurrentTrack,
  selectIsPlaying,
} from '../../stores/musicStores';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';

export default function HomeScreen() {
  const challenges = useMusicStore(selectChallenges);
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const { play } = useMusicPlayer();

  const handlePlayChallenge = useCallback(
    async (challenge: MusicChallenge) => {
      try {
        await play(challenge);
        router.push('/(modals)/player');
      } catch (error) {
        console.error('Failed to play challenge:', error);
      }
    },
    [play]
  );

  const renderChallenge = useCallback(
    ({ item }: { item: MusicChallenge }) => (
      <GlassCard
        style={styles.glassWrapper}
        blurIntensity={30}
        gradientColors={[
          'rgba(255,255,255,0.12)',
          'rgba(255,255,255,0.05)',
        ]}
      >
        <ChallengeCard
          challenge={item}
          onPlay={handlePlayChallenge}
          isCurrentTrack={currentTrack?.id === item.id}
          isPlaying={isPlaying}
          accessibilityLabel={`Challenge: ${item.title}, ${item.points} points`}
          accessibilityHint="Tap to start playback and open player modal"
        />
      </GlassCard>
    ),
    [currentTrack, isPlaying, handlePlayChallenge]
  );

  return (
    <LinearGradient
      colors={[THEME.colors.background, THEME.colors.secondaryBackground]}
      style={styles.container}
    >
      <BlurView intensity={50} style={styles.blurContainer} tint="dark">
        <Text
          style={styles.header}
          accessibilityRole="header"
          accessibilityLabel="Music Challenges"
        >
          Music Challenges
        </Text>
        <Text style={styles.subtitle}>
          Complete listening challenges to earn points and unlock achievements
        </Text>

        {challenges.length === 0 ? (
          <Text style={styles.emptyText}>No challenges available</Text>
        ) : (
          <FlatList
            data={challenges}
            renderItem={renderChallenge}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            accessibilityLabel="List of available challenges"
          />
        )}
      </BlurView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.lg,
  },
  header: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
  listContainer: {
    paddingBottom: THEME.spacing.xl,
  },
  glassWrapper: {
    marginBottom: THEME.spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyText: {
    textAlign: 'center',
    color: THEME.colors.text.secondary,
    fontSize: THEME.fonts.sizes.md,
    marginTop: THEME.spacing.lg,
  },
});
