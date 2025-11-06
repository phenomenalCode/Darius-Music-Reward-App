// src/components/challenge/ChallengeList.tsx
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ListRenderItemInfo,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { ChallengeCard } from "./ChallengeCard";
import GlassCard from '../ui/GlassCard';
import GlassButton  from '../ui/GlassButton';
import { THEME, SAMPLE_CHALLENGES } from "../../constants/theme";
import type { MusicChallenge } from "../../types";
 // path suggested earlier

interface ChallengeListProps {
  challenges?: MusicChallenge[]; // optional prop — defaults to SAMPLE_CHALLENGES
  onPlay?: (challenge: MusicChallenge) => Promise<void> | void;
  refreshing?: boolean;
  onRefresh?: () => Promise<void> | void;
}

export const ChallengeList: React.FC<ChallengeListProps> = ({
  challenges = SAMPLE_CHALLENGES,
  onPlay = () => {},
  refreshing = false,
  onRefresh = () => {},
}) => {
  const [localRefreshing, setLocalRefreshing] = useState(false);

  // combined refreshing state so parent can control or local fallback is used
  const isRefreshing = refreshing || localRefreshing;

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      try {
        setLocalRefreshing(true);
        await onRefresh();
      } finally {
        setLocalRefreshing(false);
      }
    }
  }, [onRefresh]);

  const keyExtractor = useCallback((item: MusicChallenge) => item.id, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MusicChallenge>) => (
      <ChallengeCard
        challenge={item}
        onPlay={onPlay}
        isCurrentTrack={false} // if you have store selectors, pass in real value
        isPlaying={false}
      />
    ),
    [onPlay]
  );

  const emptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <GlassCard style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No challenges found</Text>
          <Text style={styles.emptySubtitle}>
            Check back later or pull to refresh to load new challenges.
          </Text>
          <GlassButton
            title="Refresh"
            onPress={handleRefresh}
            accessibilityLabel="Refresh challenges"
            accessibilityHint="Attempts to reload challenge data"
            style={{ marginTop: THEME.spacing.md }}
          />
        </GlassCard>
      </View>
    ),
    [handleRefresh]
  );

  return (
    <BlurView intensity={40} tint="dark" style={{...styles.wrapper, pointerEvents: 'box-none'}}>
      <LinearGradient
        colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0.45)"]}
        start={[0, 0]}
        end={[0, 1]}
        style={[styles.gradient, { pointerEvents: 'none' }]}
      />
      <FlatList
        data={challenges}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[styles.listContainer, { pointerEvents: 'box-none' }]}
        showsVerticalScrollIndicator={false}
        style={{ pointerEvents: 'box-none' }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={emptyComponent}
        accessibilityLabel="List of music challenges"
        accessibilityHint="Browse challenges and tap play to start a challenge"
      />
    </BlurView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  listContainer: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xl,
  },
  emptyContainer: {
    paddingTop: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.md,
  },
  emptyCard: {
    padding: THEME.spacing.lg,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: "bold",
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
  },
  emptySubtitle: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    textAlign: "center",
  },
});
