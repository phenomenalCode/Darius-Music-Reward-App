# Source files documentation (src/)

This document describes every file under `src/` in this repository, what it exports/does, and important notes for debugging (especially native module / touch issues).

-- NOTE: this file is informational only. If you want me to make any of the suggested code changes (pointerEvents removal, debug logs injected), tell me which ones and I'll apply them.

---

## src/app

- `App.tsx`
  - App root for the Expo Router setup. Likely sets up providers (Zustand, theme) and global configuration.
  - Responsible for global wrappers, fonts, and possibly Audio mode setup.

- `_layout.tsx` (app-level)
  - App routing layout used by Expo Router. Registers tab/navigation layout and shared UI (status bar, safe area).

### src/app/(tabs)

- `index.tsx`
  - Main Home screen. Renders a list of music challenges using `FlatList`.
  - Reads state via `musicStores` selectors and uses the `useMusicPlayer` hook to control playback.
  - Handles `onPlay` logic: calls `play()` from the hook and navigates to `/modals/player` on success.
  - Contains helpful debugging logs (playback start/err) and a web-only DOM capture hook used for click debugging.

- `profile.tsx`
  - Tab screen for user profile. Likely displays user's points, completed challenges and settings.

- `Welcome.tsx`
  - Tab screen shown to new users; may contain onboarding text and links.

- `_layout.tsx` (tabs)
  - Layout wrapper for tab screens (defines bottom tabs or header styling for these screens).

### src/app/(modals)

- `player.tsx`
  - Player modal UI. Displays the full-screen player including progress, controls, and additional metadata while a challenge is playing.

- `_layout.tsx` (modals)
  - Modal routing layout to show modal screens (e.g., player) using Expo Router modal presentation.

---

## src/components

### src/components/challenge

- `ChallengeCard.tsx`
  - Renders a challenge card: title, artist, difficulty badge, description, info row (duration / points / progress), animated progress bar and a `GlassButton` Play button.
  - Props: `challenge`, `onPlay`, `isCurrentTrack`, `isPlaying`, `accessibilityLabel`, `accessibilityHint`.
  - Important: the file contains several `pointerEvents` values (`box-none`, `none`) which can block or allow touches. Overuse may cause child Pressable components to not receive touch events.

- `ChallengeList.tsx`
  - (If used) wrapper list component around `FlatList` to render multiple `ChallengeCard` entries. Handles list optimizations and empty state UI.

- `ChallengeDetails.tsx`
  - Detail view for a single challenge. Shows full description, artist info, and may include extra CTA buttons.

### src/components/ui

- `GlassButton.tsx`
  - Stylized button component used across the app. Should forward accessibility props and ensure `onPress` is wired to a `Pressable` or `Touchable*` component.
  - If not using `Pressable`/`TouchableOpacity` properly, `onPress` may not fire.

- `GlassCard.tsx`
  - Reusable card wrapper with glass-style background used for small UI blocks.

---

## src/constants

- `theme.ts`
  - Central theme variables (colors, spacing, font sizes) used throughout the app to maintain consistent styling.

---

## src/hooks

- `useMusicPlayer.ts`
  - Hook wrapping `expo-av`'s `Audio.Sound` to create, play, pause, and seek audio.
  - Synchronizes `Audio` status with `musicStores` (Zustand) and triggers challenge completion at >= 90% progress.
  - Exposes: `play(track)`, `pause()`, `seekTo(seconds)`, `loading`, `error`, `currentTrack`, `isPlaying`, `currentPosition`, `duration`.
  - Contains audio mode configuration (staysActiveInBackground, playsInSilentModeIOS, etc.).

- `useChallenges.ts`
  - Loads challenge data from local JSON or remote endpoint, and populates `musicStores`.

- `usePointsCounter.ts`
  - Hook exposing user's points count and perhaps animation/side effects when points increase.

---

## src/services

- `audioService.ts`
  - Abstraction over `expo-av` for higher-level audio operations (e.g., load, play, prefetch). May be thin wrapper used by `useMusicPlayer`.

- `playbackService.ts`
  - Optional helper for controlling playback across app lifecycle (e.g., handling app background/foreground transitions or audio focus events).

---

## src/stores

- `musicStores.ts`
  - Zustand store for music state. Likely contains: `challenges[]`, `currentTrack`, `isPlaying`, `currentPosition`, `updateProgress()`, `setCurrentTrack()`, `setIsPlaying()`.
  - Acts as the single source of truth for track playback state and progress across components.

- `userStore.ts`
  - Zustand store for user data: `points`, `completedChallenges[]`, and methods `addPoints()`, `completeChallenge()`, etc.

---

## src/types

- `custom.d.ts`
  - Type declarations and global ambient types used by the TypeScript compiler.

- `index.ts`
  - Central export of TypeScript types and interfaces such as `MusicChallenge`, `UseMusicPlayerReturn`, `ChallengeCardProps`, etc.

---

## src/utils

- `trackHelper.ts`
  - Converts an app `MusicChallenge` to a playable track object expected by `expo-av` or other player libs (sets `url`, `title`, `artist`, `duration` fields).

---

# Debug snippets (paste into root screen or App.tsx to inspect native runtime)

1) NativeModules status

```ts
import { useEffect } from 'react';
import { NativeModules, Platform } from 'react-native';

useEffect(() => {
  console.log('[diag] Platform:', Platform.OS);
  try {
    console.log('[diag] NativeModules keys:', Object.keys(NativeModules || {}));
    console.log('[diag] PlatformConstants:', NativeModules?.PlatformConstants);
  } catch (e) {
    console.error('[diag] inspect NativeModules error', e);
  }
}, []);
```

2) TurboModule registry keys (if available)

```ts
import { useEffect } from 'react';
import { TurboModuleRegistry } from 'react-native';

useEffect(() => {
  try {
    console.log('[diag] TurboModuleRegistry.getTurboModuleNames()', TurboModuleRegistry.getTurboModuleNames?.());
  } catch (e) {
    console.warn('[diag] TurboModuleRegistry unavailable', e);
  }
}, []);
```

3) Quick onPress tracer for `GlassButton` or `ChallengeCard` (temporary)

```tsx
<GlassButton
  title="Play Challenge"
  onPress={(...) => {
    console.log('[diag] GlassButton onPress', challenge?.id, challenge?.title);
    handlePlay(...);
  }}
  onPressIn={() => console.log('[diag] GlassButton onPressIn', challenge?.id)}
/>
```

---

# Next recommended actions

1. Add the NativeModules diagnostic snippet to `src/app/(tabs)/index.tsx` (or `App.tsx`) and run the app on a native device/emulator. If `PlatformConstants` is missing, you need to rebuild a native binary that includes your native modules (see README.md in repo root for commands).

2. Remove the broad `pointerEvents` settings in `ChallengeCard.tsx` and only set `pointerEvents='none'` on small non-interactive pieces (header/info row). Then add `onPressIn` to `GlassButton` to confirm touches.

3. If using `expo start --dev-client`, rebuild the dev-client after adding/removing native modules: `npx expo prebuild --clean` -> `npx expo run:android` (or use EAS dev build).

4. Run `npx expo start -c` to clear Metro cache and retest.

---

If you want, I can now:
- A) Insert the NativeModules diagnostic snippet into `src/app/(tabs)/index.tsx` and save the file; or
- B) Remove/tighten `pointerEvents` in `ChallengeCard.tsx` and add `onPressIn` logs to `GlassButton`; or
- C) Both A & B.

Tell me which option and I will make the edits and run quick checks (or provide the exact PowerShell commands you should run next).
