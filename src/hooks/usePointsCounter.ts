import { useState, useEffect, useCallback } from "react";
import type { PointsCounterConfig, UsePointsCounterReturn } from "../types";
import { useMusicPlayer } from "./useMusicPlayer";
import { useUserStore } from "../stores/userStore";

export const usePointsCounter = (): UsePointsCounterReturn => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState<PointsCounterConfig | null>(null);

  const { currentTrack, currentPosition, duration } = useMusicPlayer();

  // Store actions
  const completeChallenge = useUserStore((s) => s.completeChallenge);
  const completedChallenges = useUserStore((s) => s.completedChallenges);

  // Start counting for a challenge
  const startCounting = useCallback(
    (newConfig: PointsCounterConfig) => {
      if (newConfig.challengeId === currentTrack?.id) {
        setConfig(newConfig);
        setIsActive(true);
        setCurrentPoints(0);
        setPointsEarned(0);
      }
    },
    [currentTrack?.id]
  );

  const stopCounting = useCallback(() => setIsActive(false), []);

  const resetProgress = useCallback(() => {
    setCurrentPoints(0);
    setPointsEarned(0);
  }, []);

  // Update points as playback progresses
  useEffect(() => {
    if (!isActive || !config || duration <= 0) return;

    const progressPercentage = (currentPosition / duration) * 100;
    const earnedPoints = Math.floor((progressPercentage / 100) * config.totalPoints);

    setPointsEarned((prev) => Math.max(prev, earnedPoints));
    setCurrentPoints((prev) => Math.max(prev, earnedPoints));

    // Stop counting if track changed
    if (config.challengeId !== currentTrack?.id) {
      stopCounting();
    }
  }, [currentPosition, duration, isActive, config, currentTrack?.id, stopCounting]);

  // Stop counting automatically when store says challenge completed
  useEffect(() => {
    if (!config) return;
    if (completedChallenges.includes(config.challengeId)) {
      console.log(`Challenge ${config.challengeId} completed → stopping counter`);
      stopCounting();
    }
  }, [completedChallenges, config, stopCounting]);

  // Progress % calculation
  const progress = config && duration > 0 ? (currentPosition / duration) * 100 : 0;

  return {
    currentPoints,
    pointsEarned,
    progress,
    isActive,
    startCounting,
    stopCounting,
    resetProgress,
  };
};
