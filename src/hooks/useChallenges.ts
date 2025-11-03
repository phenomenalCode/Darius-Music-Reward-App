import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useMusicStore, selectChallenges } from '../stores/musicStores';
import { useUserStore } from '../stores/userStore';
import { useMusicPlayer } from './useMusicPlayer';
import type { MusicChallenge, UseChallengesReturn } from '../types';

export const useChallenges = (): UseChallengesReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const challenges = useMusicStore(selectChallenges);
  const completeChallenge = useUserStore((state) => state.completeChallenge);

  const completedChallenges = useMemo(
    () => challenges.filter(c => c.completed).map(c => c.id),
    [challenges]
  );

  const { currentTrack, currentPosition, duration } = useMusicPlayer();

  // Keep track of already auto-completed challenges to prevent multiple calls
  const autoCompletedRef = useRef<Set<string>>(new Set());

  const markComplete = useCallback(
    async (challengeId: string) => {
      try {
        setLoading(true);
        setError(null);

        const challenge = challenges.find(c => c.id === challengeId);
        if (!challenge) throw new Error('Challenge not found');

        completeChallenge(challengeId);
      } catch (err: any) {
        setError(err.message || 'Failed to complete challenge');
      } finally {
        setLoading(false);
      }
    },
    [challenges, completeChallenge]
  );

  // Auto-complete challenges when track reaches ≥90%
  useEffect(() => {
    if (!currentTrack || currentTrack.completed) return;
    if (duration === 0) return;
    if (autoCompletedRef.current.has(currentTrack.id)) return;

    const progressPercent = (currentPosition / duration) * 100;
    if (progressPercent >= 90) {
      markComplete(currentTrack.id);
      autoCompletedRef.current.add(currentTrack.id);
    }
  }, [currentTrack, currentPosition, duration, markComplete]);

  const refreshChallenges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate async fetch
      await new Promise((res) => setTimeout(res, 300));
      // Here you could replace with actual API fetch and update musicStore
    } catch (err: any) {
      setError(err.message || 'Failed to load challenges');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    challenges,
    completedChallenges,
    loading,
    error,
    refreshChallenges,
    completeChallenge: markComplete,
  };
};
