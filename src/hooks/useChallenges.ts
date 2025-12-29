import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useMusicStore, selectChallenges } from '../stores/musicStores';
import type { UseChallengesReturn } from '../types';

export const useChallenges = (): UseChallengesReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //  Get challenges from store
  const challenges = useMusicStore(selectChallenges);

  const completedChallenges = useMemo(
    () => challenges.filter(c => c.completed).map(c => c.id),
    [challenges]
  );

  //  Use store values directly instead of calling useMusicPlayer
  const currentTrack = useMusicStore((s) => s.currentTrack);
  const currentPosition = useMusicStore((s) => s.currentPosition);
  const duration = currentTrack?.duration ?? 0;

  // Keep track of already "seen" challenges to avoid repeated effects
  const seenRef = useRef<Set<string>>(new Set());

  const markSeen = useCallback(
    (challengeId: string) => {
      if (seenRef.current.has(challengeId)) return;
      seenRef.current.add(challengeId);
    },
    []
  );

  // Track progress and "observe" challenges without completing them
  useEffect(() => {
    if (!currentTrack || duration <= 0) return;
    if (seenRef.current.has(currentTrack.id)) return;

    const progressPercent = (currentPosition / duration) * 100;
    if (progressPercent >= 90) {
      markSeen(currentTrack.id);
    }
  }, [currentTrack, currentPosition, duration, markSeen]);

  const refreshChallenges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate async fetch
      await new Promise((res) => setTimeout(res, 300));
      // Could replace with real API fetch
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
    completeChallenge: (_challengeId: string): Promise<void> => {
      // noop: usePointsCounter handles completion
      return Promise.resolve();
    }
  };
};
