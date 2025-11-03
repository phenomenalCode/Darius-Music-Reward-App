import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------------- User Store Interface -------------------------
export interface UserStore {
  // State
  totalPoints: number;
  completedChallenges: string[];

  // Actions
  addPoints: (points: number) => void;
  completeChallenge: (challengeId: string) => void;
  resetProgress: () => void;
}

// ------------------------- User Store -------------------------
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      totalPoints: 0,
      completedChallenges: [],

      // Actions
      addPoints: (points: number) =>
        set((state) => ({
          totalPoints: state.totalPoints + points,
        })),

      completeChallenge: (challengeId: string) =>
        set((state) => ({
          completedChallenges: state.completedChallenges.includes(challengeId)
            ? state.completedChallenges
            : [...state.completedChallenges, challengeId],
        })),

      resetProgress: () =>
        set({
          totalPoints: 0,
          completedChallenges: [],
        }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        totalPoints: state.totalPoints,
        completedChallenges: state.completedChallenges,
      }),
    }
  )
);

// ------------------------- Selectors (Belong style) -------------------------
export const selectTotalPoints = (state: UserStore) => state.totalPoints;
export const selectCompletedChallenges = (state: UserStore) =>
  state.completedChallenges;

// ------------------------- Usage Example -------------------------
// const totalPoints = useUserStore(selectTotalPoints);
// const addPoints = useUserStore((s) => s.addPoints);
