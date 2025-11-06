
import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChallengeCard } from '../../components/challenge/ChallengeCard';
import { useMusicStore, selectChallenges, selectCurrentTrack, selectIsPlaying, selectCurrentPosition } from '../../stores/musicStores';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';

export default function HomeScreen() {
  console.log('🏠 HomeScreen render start');

  // ------------------ Store state ------------------
  const challenges = useMusicStore(selectChallenges);
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const currentPosition = useMusicStore(selectCurrentPosition);

  // ------------------ Music Player ------------------
  const { play, pause, seekTo, loading, error } = useMusicPlayer();

  // ------------------ Debugging ------------------
  useEffect(() => {
    console.log('🟢 HomeScreen useEffect triggered');
    console.log('🎵 Challenges loaded:', challenges.length);
    console.log('🎶 Current track ->', currentTrack?.title ?? 'none');
    console.log('⏯️ Is playing ->', isPlaying);
    console.log('⏱️ Current position ->', currentPosition);
    console.log('⏳ Loading ->', loading);
    console.log('❌ Error ->', error);
  }, [challenges, currentTrack, isPlaying, currentPosition, loading, error]);

  // ------------------ Render Challenge ------------------
  const renderChallenge = useCallback(
  ({ item }: { item: MusicChallenge }) => {
    const isCurrent = currentTrack?.id === item.id;

    console.log("🎨 Rendering ChallengeCard:", {
      title: item.title,
      id: item.id,
      isCurrent,
      isPlaying,
    });

    return (
      <View
        style={{ 
          marginBottom: THEME.spacing.md, 
          backgroundColor: "rgba(255,0,0,0.05)",
        }}
        onStartShouldSetResponder={() => {
          console.log("👆 renderChallenge container touched:", item.title);
          return false; // Don't block children touches
        }}
      >
        <ChallengeCard
          challenge={item}
          isCurrentTrack={isCurrent}
          isPlaying={isPlaying && isCurrent}
          accessibilityLabel={`Challenge: ${item.title}, ${item.points} points`}
          onPlay={async (challenge) => {
            console.log("🎮 Button pressed");
            console.log("▶️ HomeScreen.onPlay fired for:", challenge?.title ?? 'undefined challenge');
            
            // Early validation with user feedback
            if (!challenge?.id || !challenge?.title) {
              console.error("❌ Invalid challenge data:", challenge);
              Alert.alert(
                "Error",
                "Invalid challenge data. Please try again."
              );
              return;
            }


            try {
              // Start playback first
              console.log("🎶 Starting playback for:", {
                id: challenge.id,
                title: challenge.title,
                audioUrl: challenge.audioUrl
              });
              
              await play(challenge);
              console.log("✅ Playback started successfully for:", challenge.title);

              // Only navigate if playback started successfully
              console.log("🚀 Navigating to player...");
              router.push("/modals/player");
              console.log("✅ Navigation completed");
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : String(err);
              console.error("❌ Error playing challenge:", {
                challenge: challenge.title,
                error: errorMessage
              });
              // Here you might want to show an error toast/alert to the user
              Alert.alert(
                "Playback Error",
                `Unable to play this challenge: ${errorMessage}. Please try again.`
              );
            }
          }}
        />

        {isCurrent && (
          <View
            style={[styles.buttonRow, { pointerEvents: 'auto' }]}
            
            onStartShouldSetResponder={() => {
              console.log("👆 Player control row touched for:", item.title);
              return false;
            }}
          >
            <Button
              title={isPlaying ? "⏸ Pause" : "▶️ Play"}
              onPress={() => {
                  console.log("🔘 Control button pressed:", isPlaying ? "Pause" : "Play");
                try {
                  if (isPlaying) pause();
                  else play(item);
                    console.log("✅ Control action completed successfully");
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : String(err);
                    console.error("❌ Error in Play/Pause button:", {
                      action: isPlaying ? "pause" : "play",
                      error: errorMessage
                    });
                    Alert.alert(
                      "Playback Control Error",
                      `Unable to ${isPlaying ? "pause" : "play"}: ${errorMessage}`
                    );
                }
              }}
            />
            <Button
              title="⏩ +10s"
              onPress={() => {
                console.log("⏩ Seek pressed (+10s)");
                try {
                  seekTo(currentPosition + 10);
                } catch (err) {
                  console.error("❌ Error in SeekTo:", err);
                }
              }}
            />
          </View>
        )}
      </View>
    );
  },
  [currentTrack, isPlaying, currentPosition, play, pause, seekTo]
);

useEffect(() => {
  if (typeof document !== 'undefined') {
    const captureHandler = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      console.log('🖱️ DOM capture click', { x: e.clientX, y: e.clientY, targetTag: (e.target as Element | null)?.tagName, elementFromPoint: el?.tagName, className: (el as Element | null)?.className });
    };
    // use capture = true so we see the event even if propagation is stopped later
    document.addEventListener('click', captureHandler, true);
    return () => document.removeEventListener('click', captureHandler, true);
  }
}, []);


  // ------------------ JSX ------------------
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
          <>
            {/* 🧩 GLOBAL TOUCH DETECTOR - TEMP DEBUG LAYER
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 0, 0, 0.05)', // very light red overlay
                zIndex: 9999,
              }}
              pointerEvents="auto"
              onStartShouldSetResponder={() => {
                console.log('🟥 GLOBAL TOUCH DETECTOR: received touch');
                return false; // don't block children
              }}
            /> */}
            <FlatList
              data={challenges}
              keyExtractor={(item) => item.id}
              renderItem={renderChallenge}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              removeClippedSubviews={false}
            />
          </>
        )}
 
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  listContainer: { paddingBottom: THEME.spacing.xl },
  emptyText: {
    textAlign: 'center',
    color: THEME.colors.text.secondary,
    fontSize: THEME.fonts.sizes.md,
    marginTop: THEME.spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});
