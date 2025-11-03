import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MusicStore, MusicChallenge } from '../types';
import { SAMPLE_CHALLENGES } from '../constants/theme';

// ------------------------- Music Store -------------------------
export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      // === State ===
      challenges: SAMPLE_CHALLENGES,
      currentTrack: null,        // ⚠️ Optional: persist for resume
      isPlaying: false,
      currentPosition: 0,        // ⚠️ Optional: persist playback position

      // === Actions ===

      // Load challenges (async-ready for API)
      loadChallenges: async () => {
        try {
          // Uncomment for API-based loading
          // const response = await fetch('/api/challenges');
          // const data = await response.json();
          // set({ challenges: data });
          set({ challenges: SAMPLE_CHALLENGES });
        } catch (err) {
          console.error('Failed to load challenges:', err);
        }
      },

      setCurrentTrack: (track: MusicChallenge | null) => set({ currentTrack: track }),

      updateProgress: (challengeId: string, progress: number) => {
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? { ...challenge, progress: Math.min(progress, 100) }
              : challenge
          ),
        }));
      },

      markChallengeComplete: (challengeId: string) => {
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  completed: true,
                  progress: 100,
                  completedAt: new Date().toISOString(),
                }
              : challenge
          ),
        }));
      },

      setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
      setCurrentPosition: (position: number) => set({ currentPosition: position }),
    }),
    {
      name: 'music-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        challenges: state.challenges,
        currentTrack: state.currentTrack,
        currentPosition: state.currentPosition,
      }),
    }
  )
);

// ------------------------- Selectors (Belong style) -------------------------
export const selectChallenges = (state: MusicStore) => state.challenges;
export const selectCurrentTrack = (state: MusicStore) => state.currentTrack;
export const selectIsPlaying = (state: MusicStore) => state.isPlaying;
export const selectCurrentPosition = (state: MusicStore) => state.currentPosition;

// ------------------------- Usage Example -------------------------
// const challenges = useMusicStore(selectChallenges);
// const play = useMusicStore(s => s.setCurrentTrack);
