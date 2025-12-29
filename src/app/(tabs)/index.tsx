import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChallengeCard from '../../components/challenge/ChallengeCard';
import { useMusicStore, selectChallenges, selectCurrentTrack, selectIsPlaying, selectCurrentPosition } from '../../stores/musicStores';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { useUserStore } from '../../stores/userStore';

export default function HomeScreen() {
  const challenges = useMusicStore(selectChallenges);
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const currentPosition = useMusicStore(selectCurrentPosition);
  const completedChallenges = useUserStore((state) => state.completedChallenges);

  const { play, pause } = useMusicPlayer();

  const renderChallenge = useCallback(
    ({ item }: { item: MusicChallenge }) => {
      const isCurrent = currentTrack?.id === item.id;

      return (
        <View
          style={{ marginBottom: THEME.spacing.md, backgroundColor: "rgba(255,0,0,0.05)" }}
          onStartShouldSetResponder={() => {
            console.log(" renderChallenge container touched:", item.title);
            return false; // Don't block children touches
          }}
        >
          <ChallengeCard
            challenge={item}
            isCurrentTrack={isCurrent}
            isPlaying={isPlaying && isCurrent}
            accessibilityLabel={`Challenge: ${item.title}, ${item.points} points`}
            onPlay={async (challenge) => {
              if (!challenge?.id || !challenge?.title) {
                console.error("Invalid challenge data:", challenge);
                Alert.alert("Error", "Invalid challenge data. Please try again.");
                return;
              }

              try {
                const isCurrentTrackPlaying = currentTrack?.id === challenge.id && isPlaying;

                if (isCurrentTrackPlaying) {
                  console.log("⏸ Pausing track:", challenge.title);
                  pause();
                } else {
                  console.log("▶️ Playing track:", challenge.title);
                  await play(challenge);
                }
              } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                console.error("Error controlling playback:", {
                  challenge: challenge.title,
                  error: errorMessage,
                });
                Alert.alert("Playback Error", `Unable to play/pause this challenge: ${errorMessage}`);
              }
            }}
          />
        </View>
      );
    },
    [currentTrack, isPlaying, currentPosition, play, pause]
  );

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const captureHandler = (e: MouseEvent) => {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        console.log('DOM capture click', {
          x: e.clientX,
          y: e.clientY,
          targetTag: (e.target as Element | null)?.tagName,
          elementFromPoint: el?.tagName,
          className: (el as Element | null)?.className,
        });
      };
      document.addEventListener('click', captureHandler, true);
      return () => document.removeEventListener('click', captureHandler, true);
    }
  }, []);

  // original DOM capture useEffect remains above; no additional debug logging here

  return (
    <LinearGradient
      colors={[THEME.colors.background, THEME.colors.primary]}
      style={[styles.container]}
    >
      <Text style={styles.header}>Music Challenges</Text>
      <Text style={styles.subtitle}>
        Complete listening challenges to earn points and unlock achievements
      </Text>

      {challenges.length === 0 ? (
        <Text style={styles.emptyText}>No challenges available</Text>
      ) : (
      <FlatList
  data={challenges}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <ChallengeCard
      challenge={item}
      isCurrentTrack={currentTrack?.id === item.id}
      isPlaying={isPlaying && currentTrack?.id === item.id}
      currentPosition={currentPosition} // pass position
      completedChallenges={completedChallenges} // pass completed
      onPlay={async (challenge) => {
        const isCurrentTrackPlaying = currentTrack?.id === challenge.id && isPlaying;
        if (isCurrentTrackPlaying) pause();
        else await play(challenge);
      }}
    />
  )}
  extraData={{ currentTrack, isPlaying, currentPosition, completedChallenges }}
  contentContainerStyle={styles.listContainer}
  showsVerticalScrollIndicator={false}
/>

      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  listContainer: { paddingBottom: THEME.spacing.xl },
  emptyText: {
    textAlign: 'center',
    color: THEME.colors.text.secondary,
    fontSize: THEME.fonts.sizes.md,
    marginTop: THEME.spacing.lg,
  },
});
