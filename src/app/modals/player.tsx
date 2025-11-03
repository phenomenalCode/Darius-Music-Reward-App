// src/app/(modals)/player.tsx
import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  AccessibilityRole,
} from 'react-native';
import { GlassCard, GlassButton } from '../../components/ui/GlassCard';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { usePointsCounter } from '../../hooks/usePointsCounter';
import { THEME } from '../../constants/theme';

export default function PlayerModal() {
  const {
    currentTrack,
    isPlaying,
    currentPosition,
    duration,
    play,
    pause,
    resume,
    seekTo,
    loading,
    error,
  } = useMusicPlayer();

  const {
    currentPoints,
    startCounting,
    stopCounting,
    progress: pointsProgress,
  } = usePointsCounter();

  // Start points counter when track changes
  useEffect(() => {
    if (currentTrack) {
      startCounting({
        totalPoints: currentTrack.points,
        durationSeconds: currentTrack.duration,
        challengeId: currentTrack.id,
      });
    }
    return () => {
      stopCounting(); // Cleanup timer to prevent memory leaks
    };
  }, [currentTrack]);

  // Error handling with Alert side-effect
  useEffect(() => {
    if (error) {
      Alert.alert('Playback Error', error);
    }
  }, [error]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!duration || duration === 0) return 0;
    return (currentPosition / duration) * 100;
  };

  const handleSeek = (percentage: number) => {
    if (duration) {
      const newPosition = (percentage / 100) * duration;
      seekTo(newPosition);
    }
  };

  const handlePlayPause = useCallback(async () => {
    if (isPlaying) {
      await pause();
    } else {
      if (currentTrack) {
        await resume();
      }
    }
  }, [isPlaying, currentTrack]);

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <GlassCard style={styles.noTrackCard}>
          <Text style={styles.noTrackText}>No track selected</Text>
          <Text style={styles.noTrackSubtext}>
            Go back and select a challenge to start playing music
          </Text>
        </GlassCard>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Track Info */}
        <GlassCard style={styles.trackInfoCard}>
          <Text style={styles.trackTitle}>{currentTrack.title}</Text>
          <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
          <Text style={styles.trackDescription}>{currentTrack.description}</Text>

          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>Challenge Points</Text>
            <Text
              style={styles.pointsValue}
              accessibilityLabel={`Current points: ${currentPoints}`}
              accessibilityHint="Points earned as track progresses"
            >
              {currentPoints} / {currentTrack.points}
            </Text>
          </View>
        </GlassCard>

        {/* Progress Section */}
        <GlassCard style={styles.progressCard}>
          <Text style={styles.progressLabel}>Listening Progress</Text>
          <TouchableOpacity
            style={styles.progressTrack}
            accessibilityRole="adjustable"
            accessibilityLabel="Track progress"
            accessibilityHint="Tap to seek within track"
            onPress={(event) => {
              const { locationX, width } = event.nativeEvent as any;
              const percentage = (locationX / width) * 100;
              handleSeek(percentage);
            }}
          >
            <View style={styles.progressBackground}>
              <View style={[styles.progressFill, { width: `${getProgress()}%` }]} />
            </View>
          </TouchableOpacity>

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          <Text style={styles.progressPercentage}>
            {Math.round(getProgress())}% Complete
          </Text>
        </GlassCard>

        {/* Controls */}
        <GlassCard style={styles.controlsCard}>
          <View style={styles.controlsRow}>
            <GlassButton
              title="⏪ -10s"
              onPress={() =>
                handleSeek(Math.max(0, getProgress() - (10 / duration) * 100))
              }
              variant="secondary"
              style={styles.controlButton}
              accessibilityLabel="Rewind 10 seconds"
              accessibilityHint="Skips backward 10 seconds in track"
            />
            <GlassButton
              title={loading ? '...' : isPlaying ? '⏸️ Pause' : '▶️ Play'}
              onPress={handlePlayPause}
              variant="primary"
              style={styles.mainControlButton}
              loading={loading}
              accessibilityLabel={isPlaying ? 'Pause track' : 'Play track'}
              accessibilityHint="Controls track playback"
            />
            <GlassButton
              title="⏩ +10s"
              onPress={() =>
                handleSeek(Math.min(100, getProgress() + (10 / duration) * 100))
              }
              variant="secondary"
              style={styles.controlButton}
              accessibilityLabel="Forward 10 seconds"
              accessibilityHint="Skips forward 10 seconds in track"
            />
          </View>
        </GlassCard>

        {/* Challenge Progress */}
        <GlassCard style={styles.challengeCard}>
          <Text style={styles.challengeLabel}>Challenge Status</Text>
          <View style={styles.challengeInfo}>
            <Text
              style={[
                styles.challengeStatus,
                {
                  color: currentTrack.completed
                    ? THEME.colors.secondary
                    : THEME.colors.accent,
                },
              ]}
              accessibilityLabel={`Challenge status: ${
                currentTrack.completed ? 'Completed' : 'In Progress'
              }`}
            >
              {currentTrack.completed ? '✅ Completed' : '🎧 In Progress'}
            </Text>
            <Text style={styles.challengeProgress}>
              {Math.round(currentTrack.progress)}% of challenge complete
            </Text>
            {/* Points Progress */}
<Text
  style={styles.pointsProgressText}
  accessible={true}
  accessibilityLabel={`Points progress: ${currentPoints} out of ${currentTrack.points} points, ${Math.round(pointsProgress)} percent complete`}
  accessibilityRole="text"
>
  Points Progress: {currentPoints} / {currentTrack.points} ({Math.round(pointsProgress)}%)
</Text>

          </View>
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    flex: 1,
    padding: THEME.spacing.lg,
    justifyContent: 'space-between',
  },
  noTrackCard: {
    margin: THEME.spacing.xl,
    alignItems: 'center',
  },
  noTrackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
  },
  noTrackSubtext: {
    fontSize: 16,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
  trackInfoCard: {
    alignItems: 'center',
  },
  trackTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.xs,
  },
  trackArtist: {
    fontSize: 18,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.md,
  },
  trackDescription: {
    fontSize: 14,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 14,
    color: THEME.colors.text.secondary,
  },
  pointsValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.colors.accent,
  },
  progressCard: {},
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  progressTrack: {
    marginBottom: THEME.spacing.md,
  },
  progressBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.sm,
  },
  timeText: {
    fontSize: 12,
    color: THEME.colors.text.secondary,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.colors.accent,
    textAlign: 'center',
  },
  controlsCard: {},
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButton: {
    flex: 0.25,
    marginHorizontal: THEME.spacing.xs,
  },
  mainControlButton: {
    flex: 0.4,
    marginHorizontal: THEME.spacing.xs,
  },
  challengeCard: {},
  challengeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  challengeInfo: {
    alignItems: 'center',
  },
  challengeStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.xs,
  },
  challengeProgress: {
    fontSize: 14,
    color: THEME.colors.text.secondary,
  },
  pointsProgressText: {
  fontSize: THEME.fonts.sizes.md,
  color: THEME.colors.accent,
  fontWeight: '600',
  textAlign: 'center',
  marginTop: THEME.spacing.sm,
},
});
