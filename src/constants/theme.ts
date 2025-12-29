import { MusicChallenge } from '../types/index';
// 🎨 Design tokens (constants/theme.ts)
export const THEME = {
  colors: {
    primary: '#7553DB',     // Belong purple
    secondary: '#34CB76',   // Belong green  
    accent: '#FCBE25',      // Belong yellow
    background: '#1a1a1a',
    glass: 'rgba(255, 255, 255, 0.1)',
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.5)', // descriptions, captions
    },
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  glass: {
    gradientColors: {
      primary: [
        'rgba(117, 83, 219, 0.4)', // purple tone
        'rgba(117, 83, 219, 0.1)',
      ] as const,
      secondary: [
        'rgba(52, 203, 118, 0.4)', // green tone
        'rgba(52, 203, 118, 0.1)',
      ]
    },
  },
  // Badge colors for challenge difficulties. Use `THEME.badge.difficultyColors`
  // or the exported `getBadgeColor()` helper in components.
  badge: {
    difficultyColors: {
      easy: '#34CB76',   // green
      medium: '#FCBE25', // yellow
         hard: '#F50707', // red
    } 
  },
};

// Helper: get a badge color for a difficulty string (falls back to secondary)
export const getBadgeColor = (difficulty?: string) => {
  const map = THEME.badge.difficultyColors as Record<string, string>;
  if (!difficulty) return THEME.colors.secondary;
  return map[difficulty] ?? THEME.colors.secondary;
};

// 🎧 Challenge list
export const SAMPLE_CHALLENGES: MusicChallenge[] = [
  {
    id: 'challenge-1',
    title: 'All Night',
    artist: 'Camo & Krooked',
    duration: 219, // 3:39
    points: 150,
    audioUrl:
      'https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/Camo-Krooked-All-Night.mp3',
    description: 'Listen to this drum & bass classic to earn points.',
    difficulty: 'easy',
    completed: false,
    progress: 0,
  },
  {
    id: 'challenge-2',
    title: 'Camo % Crooked',
    artist: 'Camo & Krooked',
    duration: 219, // 3:39
    points: 250,
    audioUrl:
      'https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/Camo-Krooked-All-Night.mp3',
    description: 'Finish this bonus challenge for extra points!',
    difficulty: 'medium',
    completed: false,
    progress: 0,
  },  {
    id: 'challenge-3',
    title: 'New Forms',
    artist: 'Roni Size',
    duration: 464, // 7:44
    points: 300,
    audioUrl:
      'https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/New-Forms-Roni+Size.mp3',
    description: 'Complete this legendary track for bonus points.',
    difficulty: 'hard',
    completed: false,
    progress: 0,
  },
];
