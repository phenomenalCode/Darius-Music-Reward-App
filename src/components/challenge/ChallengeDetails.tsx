import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../ui/GlassCard';
import GlassButton  from '../ui/GlassButton';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { usePointsCounter } from '../../hooks/usePointsCounter';
import type { MusicChallenge } from '../../types';
import { THEME } from '../../constants/theme';


interface ChallengeDetailProps {
  challenge: MusicChallenge;
  onClose: () => void;
}

export function ChallengeDetail({ challenge, onClose }: ChallengeDetailProps) {
  const { play, pause, isPlaying: globalIsPlaying, currentTrack } = useMusicPlayer();
 const {
  currentPoints,
  pointsEarned,
  startCounting,
  resetProgress
} = usePointsCounter();


  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(challenge.progress);

  const handlePlayPause = useCallback(async () => {
    try {
      if (isPlaying) {
        pause();
        setIsPlaying(false);
      } else {
        await play(challenge);
        setIsPlaying(true);
       startCounting({ totalPoints: challenge.points,
  durationSeconds: challenge.duration,
  challengeId: challenge.id, });
      }
    } catch (error) {
      console.error('Playback failed:', error);
    }
  }, [isPlaying, play, pause, challenge, startCounting]);

  useEffect(() => {
    if (currentTrack?.id !== challenge.id) {
      setIsPlaying(false);
      resetProgress();
    }
  }, [currentTrack, challenge.id, resetProgress]);

  // Format mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <BlurView intensity={80} tint="light" style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <GlassCard style={styles.card}>
          {/* Track Info */}
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.artist}>{challenge.artist}</Text>
          <Text style={styles.description}>{challenge.description}</Text>
          <Text style={styles.duration}>Duration: {formatTime(challenge.duration)}</Text>

          {/* Progress */}
          <View
            style={styles.progressBar}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: progress }}
            accessibilityLabel={`Progress for ${challenge.title}`}
          >
            <LinearGradient
              colors={[THEME.colors.accent, THEME.colors.secondary]}
              start={[0, 0]}
              end={[1, 0]}
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
         <Text style={styles.progressText}>
  {Math.round(progress)}% • {currentPoints} points
</Text>


          {/* Controls */}
          <GlassButton
            title={isPlaying ? 'Pause' : 'Play'}
            onPress={handlePlayPause}
            accessibilityLabel={isPlaying ? 'Pause track' : 'Play track'}
            accessibilityHint={`Toggles playback for ${challenge.title}`}
          />

          {/* Close Button */}
          <GlassButton
            title="Close"
            onPress={onClose}
            accessibilityLabel="Close challenge detail"
            accessibilityHint="Closes this modal and returns to the previous screen"
            style={{ marginTop: THEME.spacing.md }}
          />
        </GlassCard>
      </ScrollView>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: THEME.spacing.lg,
  },
  card: {
    padding: THEME.spacing.lg,
    borderRadius: 20,
  },
  title: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  artist: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.tertiary,
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  duration: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: THEME.spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  controls: {
    marginTop: THEME.spacing.md,
  },
});
