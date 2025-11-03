import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Animated, AccessibilityProps } from 'react-native';
import GlassCard from '../ui/GlassCard';
import GlassButton  from '../ui/GlassButton';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';

interface ChallengeCardProps extends AccessibilityProps {
  challenge: MusicChallenge;
  onPlay: (challenge: MusicChallenge) => void;
  isCurrentTrack?: boolean;
  isPlaying?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = React.memo(({
  challenge,
  onPlay,
  isCurrentTrack = false,
  isPlaying = false,
}) => {
  const progressAnim = new Animated.Value(challenge.progress);

  // Animate progress bar
  Animated.timing(progressAnim, {
    toValue: challenge.progress,
    duration: 500,
    useNativeDriver: false,
  }).start();

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return THEME.colors.secondary;
      case 'medium': return THEME.colors.accent;
      case 'hard': return THEME.colors.primary;
      default: return THEME.colors.text.secondary;
    }
  };

  const getButtonTitle = () => {
    if (challenge.completed) return 'Completed ✓';
    if (isCurrentTrack && isPlaying) return 'Playing...';
    if (isCurrentTrack && !isPlaying) return 'Resume';
    return 'Play Challenge';
  };

  const handlePlay = useCallback(() => {
    onPlay(challenge);
  }, [onPlay, challenge]);

  return (
    <GlassCard
      style={StyleSheet.flatten([styles.card, isCurrentTrack && styles.currentTrackCard])}
      gradientColors={isCurrentTrack
        ? THEME.glass.gradientColors.primary
        : THEME.glass.gradientColors.secondary
      }
     
      accessibilityLabel={`Challenge: ${challenge.title} by ${challenge.artist}`}
      accessibilityHint={`Tap to ${getButtonTitle()} and earn ${challenge.points} points`}
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{challenge.title || 'Untitled Challenge'}</Text>
          <Text style={styles.artist}>{challenge.artist || 'Unknown Artist'}</Text>
        </View>
        <View style={StyleSheet.flatten([
          styles.difficultyBadge,
          { backgroundColor: getDifficultyColor(challenge.difficulty) }
        ])}>
          <Text style={styles.difficultyText}>
            {challenge.difficulty?.toUpperCase() || 'N/A'}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {challenge.description || 'No description available.'}
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Duration</Text>
          <Text style={styles.infoValue}>{formatDuration(challenge.duration || 0)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Points</Text>
          <Text style={[styles.infoValue, { color: THEME.colors.accent }]}>
            {challenge.points || 0}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Progress</Text>
          <Text style={styles.infoValue}>{Math.round(challenge.progress) || 0}%</Text>
        </View>
      </View>

      {challenge.progress > 0 && (
        <View
          style={styles.progressContainer}
          accessible
          accessibilityRole="progressbar"
          accessibilityValue={{
            min: 0,
            max: 100,
            now: Math.round(challenge.progress),
          }}
        >
          <Animated.View
            style={[
              styles.progressTrack,
              { width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                })
              }
            ]}
          >
            <Animated.View style={[styles.progressFill]} />
          </Animated.View>
        </View>
      )}

      <GlassButton
        title={getButtonTitle()}
        onPress={handlePlay}
        variant={isCurrentTrack ? 'primary' : 'secondary'}
        disabled={challenge.completed}
        style={styles.playButton}
      />
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: THEME.spacing.md,
  },
  currentTrackCard: {
    borderWidth: 2,
    borderColor: THEME.colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.sm,
  },
  titleSection: {
    flex: 1,
    marginRight: THEME.spacing.sm,
  },
  title: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs,
  },
  artist: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
  },
  difficultyBadge: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.sm,
  },
  difficultyText: {
    fontSize: THEME.fonts.sizes.xs,
    fontWeight: 'bold',
    color: THEME.colors.background,
  },
  description: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.tertiary,
    lineHeight: 20,
    marginBottom: THEME.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.md,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.text.tertiary,
    marginBottom: THEME.spacing.xs,
  },
  infoValue: {
    fontSize: THEME.fonts.sizes.sm,
    fontWeight: '600',
    color: THEME.colors.text.primary,
  },
  progressContainer: {
    marginBottom: THEME.spacing.md,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  progressTrack: {
    height: '100%',
    width: '100%',
    borderRadius: 3,
    backgroundColor: THEME.colors.accent,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  playButton: {
    marginTop: THEME.spacing.sm,
  },
});
