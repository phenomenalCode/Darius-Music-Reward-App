
import React, { useCallback, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Animated, Platform } from "react-native";
import { THEME } from "../../constants/theme";
import GlassButton from "../ui/GlassButton";
import type { ChallengeCardProps } from "../../types";
export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onPlay,
  isCurrentTrack = false,
  isPlaying = false,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: challenge.progress || 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [challenge.progress]);

  const handlePlay = useCallback(() => onPlay(challenge), [onPlay, challenge]);

  return (
    <View
      style={[
        styles.cardWrapper,
        isCurrentTrack && styles.currentTrackCard,
        { pointerEvents: 'box-none' }
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessible={!!accessibilityLabel}
    >
      {/* make the internal layout non-blocking too */}
      <View style={[styles.content, { pointerEvents: 'box-none' }]}>
        <View style={[styles.header, { pointerEvents: 'none' }]}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{challenge.title}</Text>
            <Text style={styles.artist}>{challenge.artist}</Text>
          </View>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: THEME.colors.secondary },
            ]}
          >
            <Text style={styles.difficultyText}>
              {challenge.difficulty?.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{challenge.description}</Text>

        <View style={styles.infoRow} pointerEvents="none">
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>3:39</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Points</Text>
            <Text style={styles.infoValue}>150</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Progress</Text>
            <Text style={styles.infoValue}>0%</Text>
          </View>
        </View>

        {/* ✅ the only element with pointerEvents:auto */}
        <GlassButton
          title="Play Challenge"
          onPress={handlePlay}
          style={styles.playButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: THEME.spacing.md,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    overflow: "hidden",
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
  title: { fontWeight: "bold", fontSize: 18 },
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
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    alignItems: "center",
  },
  infoLabel: {
    color: "#aaa",
    fontSize: 12,
  },
  infoValue: {
    color: "#fff",
    fontWeight: "bold",
  },
  playButton: {
    marginTop: THEME.spacing.md,
    zIndex: 10,
  },
});
