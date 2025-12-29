// Profile screen - User progress and stats (refactored)
import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import GlassCard from '../../components/ui/GlassCard';
import { useMusicStore, selectChallenges } from '../../stores/musicStores';
import { useUserStore, selectTotalPoints, selectCompletedChallenges } from '../../stores/userStore';
import { THEME } from '../../constants/theme';
import { Button } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";




export default function ProfileScreen() {
  const challenges = useMusicStore(selectChallenges);
 const totalPoints = useUserStore(selectTotalPoints);
  const completedChallenges = useUserStore(selectCompletedChallenges);

  useEffect(() => {
    console.log(" ProfileScreen Debug — Values from Stores:");
    console.log(" challenges:", challenges);
    console.log(" completedChallenges:", completedChallenges);
    console.log(" totalPoints:", totalPoints);
  }, [challenges, completedChallenges, totalPoints]); // only log when they change



const totalChallenges = challenges.length;
  const completionRate =
    totalChallenges > 0 ? (completedChallenges.length / totalChallenges) * 100 : 0;

  const renderChallengeItem = useCallback(
    (challenge: typeof challenges[0]) => {
      const isCompleted = completedChallenges.includes(challenge.id);

      return (
        <View
          key={challenge.id}
          style={styles.challengeItem}
          accessible
          accessibilityLabel={`Challenge ${challenge.title}, ${Math.round(
            challenge.progress
          )} percent complete, ${challenge.points} points`}
          accessibilityHint={isCompleted ? 'Completed' : 'In progress'}
        >
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text
              style={[
                styles.challengeStatus,
                { color: isCompleted ? THEME.colors.secondary : THEME.colors.text.secondary },
              ]}
            >
              {isCompleted ? 'yes' : 'no'}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBar} accessibilityRole="progressbar">
            <LinearGradient
              colors={[THEME.colors.accent, THEME.colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${challenge.progress}%` }]}
            />
          </View>

          <Text style={styles.progressText}>
            {Math.round(challenge.progress)}% • {challenge.points} points
          </Text>
        </View>
      );
    },
    [completedChallenges]
  );

  return (
    <ScrollView style={styles.container}>
      <BlurView intensity={50} style={{ flex: 1 }}>
        <Text style={styles.header}>Your Progress</Text>

        {/* Stats Overview */}
      
      <GlassCard style={styles.statsCard} accessibilityRole="summary">
  <View style={styles.statsGrid}>
    <View style={styles.statItem}>
      <Text style={styles.statValue} accessibilityLabel={`Total points: ${totalPoints}`}>
        {totalPoints}
      </Text>
      <Text style={styles.statLabel}>Total Points</Text>
    </View>

    <View style={styles.statItem}>
      <Text style={styles.statValue} accessibilityLabel={`Completed challenges: ${completedChallenges.length}`}>
        {completedChallenges.length}
      </Text>
      <Text style={styles.statLabel}>Completed</Text>
    </View>

    <View style={styles.statItem}>
      <Text style={styles.statValue} accessibilityLabel={`Success rate: ${Math.round(completionRate)} percent`}>
        {Math.round(completionRate)}%
      </Text>
      <Text style={styles.statLabel}>Success Rate</Text>
    </View>
  </View>
</GlassCard>


        {/* Challenge Progress */}
        <GlassCard style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Challenge Progress</Text>
          {challenges.length > 0 ? (
            challenges.map(renderChallengeItem)
          ) : (
            <Text style={styles.noChallenges}>No challenges available</Text>
          )}
        </GlassCard>

        {/* Achievements */}
        <GlassCard style={styles.achievementsCard}>
          <Text style={styles.sectionTitle}>Achievements</Text>

          {totalPoints >= 100 && (
            <Achievement icon="🏆" text="First 100 Points!" label="Achievement: First 100 Points" />
          )}

          {completedChallenges.length >= 1 && (
            <Achievement icon="🎵" text="Music Lover" label="Achievement: Music Lover" />
          )}

          {completionRate >= 100 && (
            <Achievement icon="🌟" text="Perfect Score!" label="Achievement: Perfect Score" />
          )}

          {totalPoints === 0 && completedChallenges.length === 0 && (
            <Text style={styles.noAchievements}>
              Complete challenges to unlock achievements!
            </Text>
          )}
        </GlassCard>
        {/* <Button title="Reset Points" onPress={() => useUserStore.getState().resetProgress()} /> */}
<Button
  title="Reset All Progress"
  onPress={() => {
    const resetProgress = useUserStore.getState().resetProgress;
    resetProgress();
    console.log("🔄 User progress reset");
  }}
/>


      </BlurView>
    </ScrollView>
  );
}

/* ——— Small Reusable Achievement Component ——— */
function Achievement({
  icon,
  text,
  label,
}: {
  icon: string;
  text: string;
  label: string;
}) {
  return (
    <View style={styles.achievement} accessible accessibilityLabel={label}>
      <Text style={styles.achievementIcon}>{icon}</Text>
      <Text style={styles.achievementText}>{text}</Text>
    </View>
  );
}

/* ——— Styles ——— */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.md,
  },
  header: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginVertical: THEME.spacing.lg,
    textAlign: 'center',
  },
  statsCard: { marginBottom: THEME.spacing.md },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: 'bold',
    color: THEME.colors.accent,
    marginBottom: THEME.spacing.xs,
  },
  statLabel: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  progressCard: { marginBottom: THEME.spacing.md },
  sectionTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
  },
  challengeItem: { marginBottom: THEME.spacing.md },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.xs,
  },
  challengeTitle: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.primary,
  },
  challengeStatus: { fontSize: THEME.fonts.sizes.lg },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: THEME.spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  noChallenges: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  achievementsCard: { marginBottom: THEME.spacing.xl },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  achievementIcon: {
    fontSize: THEME.fonts.sizes.xl,
    marginRight: THEME.spacing.md,
  },
  achievementText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.primary,
  },
  noAchievements: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
