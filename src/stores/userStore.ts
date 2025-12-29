import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------------- User Store Interface -------------------------
export interface UserStore {
  totalPoints: number;
  completedChallenges: string[];
  hasMaxPoints: boolean;

  // Actions
  addPoints: (points: number) => void;
  completeChallenge: (challengeId: string, points: number) => void;
  resetProgress: () => void;
  clearMaxFlag: () => void;
}

// ------------------------- User Store -------------------------
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      totalPoints: 0,
      completedChallenges: [],
      hasMaxPoints: false,

      addPoints: (points: number) => {
        set((state) => {
          const newTotal = state.totalPoints + points;
          console.log("🟢 addPoints called:", {
            oldTotal: state.totalPoints,
            pointsAdded: points,
            newTotal,
          });

          return {
            totalPoints: newTotal >= 700 ? 700 : newTotal,
            hasMaxPoints: newTotal >= 700 ? true : state.hasMaxPoints,
          };
        });
      },

      completeChallenge: (challengeId: string, points: number) => {
        set((state) => {
          if (state.completedChallenges.includes(challengeId)) {
            console.log("⚠️ Challenge already completed:", challengeId);
            return state; // Prevent double-counting
          }

          const updatedChallenges = [...state.completedChallenges, challengeId];
          const newTotal = state.totalPoints + points;

          console.log("🏆 completeChallenge called:", {
            challengeId,
            pointsAdded: points,
            newTotal,
            updatedChallenges,
          });

          return {
            completedChallenges: updatedChallenges,
            totalPoints: newTotal >= 700 ? 700 : newTotal,
            hasMaxPoints: newTotal >= 700 ? true : state.hasMaxPoints,
          };
        });
      },

      resetProgress: () => {
        console.log("🔄 resetProgress called");
        set({
          totalPoints: 0,
          completedChallenges: [],
          hasMaxPoints: false,
        });
      },

      clearMaxFlag: () => {
        console.log("🟡 clearMaxFlag called");
        set({ hasMaxPoints: false });
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        totalPoints: state.totalPoints,
        completedChallenges: state.completedChallenges,
        hasMaxPoints: state.hasMaxPoints,
      }),
    }
  )
);

// ------------------------- Selectors -------------------------
export const selectTotalPoints = (s: UserStore) => s.totalPoints;
export const selectCompletedChallenges = (s: UserStore) => s.completedChallenges;
export const selectHasMaxPoints = (s: UserStore) => s.hasMaxPoints;
