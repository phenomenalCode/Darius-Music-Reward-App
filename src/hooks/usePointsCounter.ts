import { useState, useEffect, useCallback } from 'react';
import { useProgress } from 'react-native-track-player';
import type { PointsCounterConfig, UsePointsCounterReturn } from '../types';

export const usePointsCounter = (): UsePointsCounterReturn => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState<PointsCounterConfig | null>(null);

  const progress = useProgress(); // TrackPlayer progress

  const startCounting = useCallback((newConfig: PointsCounterConfig) => {
    setConfig(newConfig);
    setIsActive(true);
    setCurrentPoints(0);
    setPointsEarned(0);
  }, []);

  const stopCounting = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetProgress = useCallback(() => {
    setCurrentPoints(0);
    setPointsEarned(0);
  }, []);

  // Update points based on TrackPlayer progress
  useEffect(() => {
    if (!isActive || !config || progress.duration === 0) return;

    const progressPercentage = (progress.position / progress.duration) * 100;
    const earnedPoints = Math.floor((progressPercentage / 100) * config.totalPoints);

    // Functional update to avoid stale closures
    setPointsEarned((prev) => Math.max(prev, earnedPoints));
    setCurrentPoints((prev) => Math.max(prev, earnedPoints));
  }, [progress.position, progress.duration, isActive, config]);

  return {
    currentPoints,
    pointsEarned,
    progress: config && progress.duration > 0
      ? (progress.position / progress.duration) * 100
      : 0,
    isActive,
    startCounting,
    stopCounting,
    resetProgress,
  };
};
