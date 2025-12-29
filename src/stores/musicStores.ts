import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MusicStore, MusicChallenge } from '../types';
import { SAMPLE_CHALLENGES } from '../constants/theme';
import { useUserStore } from './userStore';  // Import for cross-sync

// ------------------------- Music Store -------------------------
export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      // === State ===
      challenges: SAMPLE_CHALLENGES,
      currentTrack: null,
      isPlaying: false,
      currentPosition: 0,

      // === Actions ===
      loadChallenges: async () => {
        try {
          console.log('🎵 loadChallenges: Starting...');  // Debug
          // Uncomment for API
          // const response = await fetch('/api/challenges');
          // if (!response.ok) throw new Error('API failed');
          // const data = await response.json();
          // set({ challenges: data });
          set({ challenges: SAMPLE_CHALLENGES });
          console.log('🎵 loadChallenges: Success, loaded', SAMPLE_CHALLENGES.length, 'challenges');  // Debug
        } catch (err) {
          console.error('🎵 loadChallenges ERROR:', err);
          // Optional: set error state
        }
      },

      setCurrentTrack: (track: MusicChallenge | null) => {
        console.log('🎵 setCurrentTrack:', track?.title || 'null');  // Debug
        set({ currentTrack: track });
      },

      updateProgress: (challengeId: string, progress: number) => {
        const freshChallenges = get().challenges;  // Fresh data
        console.log('🎵 updateProgress:', challengeId, 'to', progress.toFixed(1) + '%');  // Debug
        set({
          challenges: freshChallenges.map((challenge) =>
            challenge.id === challengeId
              ? { ...challenge, progress: Math.min(progress, 100) }
              : challenge
          ),
        });
      },

      markChallengeComplete: (challengeId: string) => {
        const freshChallenges = get().challenges;
        const challenge = freshChallenges.find(c => c.id === challengeId);
        if (!challenge) {
          console.error('🎵 markChallengeComplete: Challenge not found', challengeId);  // Error
          return;
        }

        console.log('🎵 markChallengeComplete:', challenge.title, 'Points:', challenge.points);  // Debug
        set({
          challenges: freshChallenges.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  completed: true,
                  progress: 100,
                  completedAt: new Date().toISOString(),
                }
              : challenge
          ),
        });

        // Cross-sync: Update userStore
        useUserStore.getState().completeChallenge(challengeId, challenge.points);
        
      },

      setIsPlaying: (playing: boolean) => {
        console.log('🎵 setIsPlaying:', playing);  // Debug
        set({ isPlaying: playing });
      },

      setCurrentPosition: (position: number) => {
        console.log('🎵 setCurrentPosition:', position.toFixed(1) + 's');  // Debug
        set({ currentPosition: position });
      },
    }),
    {
      name: 'music-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        challenges: state.challenges,
        currentTrack: state.currentTrack,
        currentPosition: state.currentPosition,
        // Added completedAt for history
        // Note: completedAt is per-challenge, so it's in challenges array
      }),
    }
  )
);

// Selectors
export const selectChallenges = (state: MusicStore) => state.challenges;
export const selectCurrentTrack = (state: MusicStore) => state.currentTrack;
export const selectIsPlaying = (state: MusicStore) => state.isPlaying;
export const selectCurrentPosition = (state: MusicStore) => state.currentPosition;