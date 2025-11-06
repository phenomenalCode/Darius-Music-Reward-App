
import type { ReactNode } from "react";
import type { ColorValue, ViewStyle, TextStyle } from "react-native";

export interface GlassCardProps {
  children: ReactNode;
  blurIntensity?: number;
  borderRadius?: number;
  style?: ViewStyle;
  gradientColors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
    accessibilityRole?: string;
   accessibilityLabel?: string;
  accessibilityHint?: string;
}


export interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  blurIntensity?: number;
  borderRadius?: number;
  accessibilityRole?: string;
    accessibilityLabel?: string;
  accessibilityHint?: string;
}


export interface GlassButton {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityRole?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface ChallengeCardProps {
  challenge: MusicChallenge;
  onPlay: (challenge: MusicChallenge) => void;
  isCurrentTrack?: boolean;
  isPlaying?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface MusicStore {
  // State
  challenges: MusicChallenge[];
  currentTrack: MusicChallenge | null;
  isPlaying: boolean;
  currentPosition: number;
  
  // Actions
  loadChallenges: () => void;
  setCurrentTrack: (track: MusicChallenge | null) => void;
  updateProgress: (challengeId: string, progress: number) => void;
  markChallengeComplete: (challengeId: string) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentPosition: (position: number) => void;
}
export interface MusicChallenge {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  points: number;
  audioUrl: string;
  imageUrl?: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  progress: number; // 0-100
  completedAt?: string;
}
 // Required custom hooks following Belong patterns
export interface UseMusicPlayerReturn {
  isPlaying: boolean;
  currentTrack: MusicChallenge | null;
  currentPosition: number;
  duration: number;
  play: (track: MusicChallenge) => Promise<void>;
  pause: () => void;
  seekTo: (seconds: number) => void;
  loading: boolean;
  error: string | null;
}
export interface PointsCounterConfig {
  totalPoints: number;
  durationSeconds: number;
  challengeId: string;
}

export interface UsePointsCounterReturn {
  currentPoints: number;
  pointsEarned: number;
  progress: number; // 0-100
  isActive: boolean;
  startCounting: (config: PointsCounterConfig) => void;
  stopCounting: () => void;
  resetProgress: () => void;
}

export interface UseChallengesReturn {
  challenges: MusicChallenge[];
  completedChallenges: string[];
  loading: boolean;
  error: string | null;
  refreshChallenges: () => Promise<void>;
  completeChallenge: (challengeId: string) => Promise<void>;
}

// Track structure for the provided sample
export interface Track {
  id: string;
  url: string; // Local file path to provided .mp3
  title: string;
  artist: string;
  artwork?: string;
  duration?: number;
}