
import React, { useCallback, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { THEME, getBadgeColor } from "../../constants/theme";
import GlassButton from "../ui/GlassButton";
import type { MusicChallenge } from "../../types";

interface ChallengeCardProps {
  challenge: MusicChallenge;
  onPlay: (challenge: MusicChallenge) => void;
  isCurrentTrack?: boolean;
  isPlaying?: boolean;
  currentPosition?: number;
  completedChallenges?: string[];
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onPlay,
  isCurrentTrack = false,
  isPlaying = false,
  currentPosition = 0,
  completedChallenges = [],
  accessibilityLabel,
  accessibilityHint,
}) => {
  const isCompleted = completedChallenges.includes(challenge.id);

  const progressPercent = useMemo(() => {
    const duration = challenge.duration ?? 0;
    if (isCurrentTrack && duration && currentPosition != null) {
      return Math.max(0, Math.min(100, (currentPosition / duration) * 100));
    }
    return typeof challenge.progress === "number"
      ? Math.max(0, Math.min(100, challenge.progress))
      : 0;
  }, [challenge.progress, challenge.duration, currentPosition, isCurrentTrack]);

  const handlePlay = useCallback(() => onPlay(challenge), [onPlay, challenge]);

  return (
    <View
      style={[styles.cardWrapper, isCurrentTrack && styles.currentTrackCard]}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessible={!!accessibilityLabel}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{challenge.title}</Text>
            <Text style={styles.artist}>{challenge.artist}</Text>
          </View>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: getBadgeColor(challenge.difficulty) },
            ]}
          >
            <Text style={styles.difficultyText}>
              {challenge.difficulty?.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{challenge.description}</Text>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>
              {Math.floor((challenge.duration || 0) / 60)}:
              {String((challenge.duration || 0) % 60).padStart(2, "0")}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Points</Text>
            <Text style={styles.infoValue}>{challenge.points}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Progress</Text>
            <Text style={styles.infoValue}>{Math.round(progressPercent)}%</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View
          style={styles.progressBar}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: Math.round(progressPercent) }}
        >
          <View style={[styles.progressFill, { width: `${Math.round(progressPercent)}%` }]} />
        </View>

        {/* Play Button */}
        <GlassButton
          title={
            isCompleted
              ? "✅ Completed"
              : isCurrentTrack && isPlaying
              ? "⏸ Pause"
              : "▶️ Play Challenge"
          }
          onPress={handlePlay}
          disabled={isCompleted}
          style={styles.playButton}
        />
      </View>
    </View>
  );
};

export default React.memo(ChallengeCard);

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: THEME.spacing.md,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
 
  },
  currentTrackCard: {
    borderWidth: 2,
    borderColor: THEME.colors.primary,
  },
  content: {
    padding: THEME.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: THEME.spacing.sm,
  },
  titleSection: { flex: 1, marginRight: THEME.spacing.sm },
  title: { fontWeight: "bold", fontSize: 18, color: "#fff" },
  artist: { color: "#ccc" },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  description: {
    marginBottom: THEME.spacing.md,
    color: "#ddd",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: { alignItems: "center" },
  infoLabel: { color: "#aaa", fontSize: 12 },
  infoValue: { color: "#fff", fontWeight: "bold" },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: THEME.colors.accent,
  },
  playButton: {
    marginTop: THEME.spacing.md,
  },
});
