# MusicRewards — Project Overview & File Map

This README documents the structure and purpose of the app in this workspace and explains the important files and libraries used. It's meant as a quick orientation and a debugging guide (especially for the play button / touch issues).

## Project structure (top-level)

- app.json — Expo app configuration
- babel.config.js — Babel config for React Native / Expo
- eas.json — EAS build configuration
- index.js — Expo entry shim
- metro.config.js — Metro bundler configuration
- package.json — npm/yarn scripts and dependencies
- tsconfig.json — TypeScript configuration
- android/ — Native Android project files (for EAS / dev-client builds)
- assets/ — app assets (audio, images)
- patches/ — patch files applied by patch-package (example: react-native-track-player patch)
- src/ — TypeScript/React Native source code

  src/app/ — Expo Router pages and layout
    (tabs)/index.tsx — Main Home screen that lists music challenges and triggers playback
    (tabs)/_layout.tsx — Tabs layout (app-level routing)
    (modals)/player.tsx — Full-screen player modal

  src/components/ — Reusable UI components
    challenge/ChallengeCard.tsx — Renders an individual challenge with Play button
    challenge/ChallengeList.tsx — (if present) lists challenges
    ui/GlassButton.tsx — A stylized button used across the app

  src/hooks/ — Custom React hooks
    useMusicPlayer.ts — Hook that controls audio playback (expo-av based)
    useChallenges.ts — Data-loading for challenges
    usePointsCounter.ts — Points display/logic

  src/stores/ — Zustand global state stores
    musicStores.ts — Music-related state (current track, progress, playing state)
    userStore.ts — User state (points, completed challenges)

  src/services/ — Platform/service integrations
    audioService.ts — Optional audio abstraction (if present)
    playbackService.ts — Optional playback control wrappers

  src/utils/ — Utility helpers
    trackHelper.ts — Converts Challenge -> playable track data
    (other utilities)


## Key files explained (what they do & why)

### `src/app/(tabs)/index.tsx`
- Purpose: Main home screen. Displays the list of music challenges via `FlatList` and composes `ChallengeCard` for each item.
- Important responsibilities:
  - Reads challenge list and playback state from `musicStores` (Zustand selectors).
  - Uses the `useMusicPlayer` hook to `play`, `pause`, `seekTo`, and report `loading`/`error`.
  - Handles user interactions (play button press) and navigates to the player modal after playback starts.
- Notes & tips:
  - The file contains added console logging to trace play flow (start -> playback -> navigation).
  - It uses a `LinearGradient` background from `expo-linear-gradient`.
  - It includes an optional DOM capture listener (web-only) for debugging clicks when running in web.

### `src/components/challenge/ChallengeCard.tsx`
- Purpose: Visual card for a single challenge and the Play control.
- Important responsibilities:
  - Render challenge metadata (title, artist, difficulty, description, duration, points, progress).
  - Provide a `GlassButton` with `onPress` (wired to `onPlay` prop) to start playback.
  - Animate and display progress.
- Important issue observed:
  - The file contains multiple `pointerEvents` usages: `pointerEvents: 'box-none'` on the wrapper and inner content and `pointerEvents: 'none'` on header/info rows. Overuse of `pointerEvents` can accidentally block touches on nested children.
  - For React Native, prefer letting children be interactive (remove pointerEvents usage unless required). If you need some areas non-interactive, use `pointerEvents="none"` only on those specific views.

### `src/hooks/useMusicPlayer.ts`
- Purpose: Encapsulates audio playback. The active implementation uses `expo-av` (Audio.Sound) to create and control sound playback.
- Important responsibilities:
  - Configure Audio mode (staysActiveInBackground, playsInSilentModeIOS, etc.)
  - Create Audio.Sound instances, play/ pause/ seek, and update status.
  - Synchronize playback state with Zustand stores (currentTrack, currentPosition, isPlaying).
  - Track progress and mark challenges complete at >= 90% progress.
- Notes & tips:
  - The file contains robust logging and status updates. It returns an object { play, pause, seekTo, loading, error, ... } consumed by UI.
  - There is commented/legacy code showing integration with `react-native-track-player`. That indicates an alternative implementation or previous approach.

### `src/components/ui/GlassButton.tsx`
- Purpose: Stylized pressable component used as the Play button in `ChallengeCard`.
- Important responsibilities:
  - Expose an `onPress` prop and forward accessibility props.
  - Ensure it uses `Pressable`/`TouchableOpacity` or similar so touches propagate correctly.
  - Should not set `pointerEvents` to a value that blocks interaction unless intentional.

### `src/stores/musicStores.ts` and `src/stores/userStore.ts`
- Purpose: Global state implemented with Zustand. Keep track of track list, current track, playing state, progress, points, and completed status.
- Why: Zustand provides a lightweight store suitable for React Native without boilerplate.


## Libraries & tools used (explain what for)

- Expo / React Native — app runtime and mobile building.
- TypeScript — static typing (tsconfig present).
- expo-av (Audio) — playing audio via `Audio.Sound` (current `useMusicPlayer` implementation).
- expo-linear-gradient — background gradients used on home screen.
- Zustand — app state management (stores for music and user state).
- EAS / Gradle / Android — native build pipeline (android folder present; used for dev-client/EAS builds).
- react-native-track-player — referenced in commented code and a patch exists in `patches/`; indicates either prior or optional alternative playback implementation.
- patch-package — used in the repo to apply fixes to node_modules (see `patches/` directory).


## Contract / expectations for playback API (brief)

- Inputs: `play(track: MusicChallenge)` where track has `id, title, audioUrl (or url), duration, points`.
- Outputs: Hook returns playback state: `isPlaying`, `currentTrack`, `currentPosition`, `duration`, `loading`, `error`.
- Error modes: network/uri not found, audio decode failure, permission or platform audio mode failures.


## Edge cases and recommended handling

- Touches not received: remove broad `pointerEvents: 'box-none'` from parent wrappers; keep interactive components' pointerEvents at default.
- No logs on button press: ensure the UI button is reachable — add an explicit `onStartShouldSetResponder` or use `Pressable` and `onPressIn` to trace first-level touch events.
- Playback failure: show user-friendly Alert messages and log full error (message + stack if available).
- Multiple play calls: ensure previous `Audio.Sound` is unloaded before creating a new one (already implemented in `useMusicPlayer` with unloadAsync).
- Background/foreground transitions: confirm Audio mode options and test iOS silent/background behavior.


## How to run (dev) — Windows PowerShell

Open a PowerShell terminal at the project root and run:

```powershell
npx expo install  # if needed to ensure dependencies installed (or use yarn/npm)
npx expo start --dev-client
```

For a normal managed workflow (no dev-client), run:

```powershell
npx expo start
```


## Debugging tips (for the play/touch issue)

1. Confirm the button is actually being pressed:
   - Add temporary `onPressIn={() => console.log('onPressIn', challenge.id)}` on the Play button. If that logs, the `onPress` path is reachable.

2. Check for blocking `pointerEvents`:
   - Search for `pointerEvents` across the project; remove or narrow uses that wrap interactive children.

3. Verify console output target:
   - If running on a device/emulator, use `npx expo start` and the Metro log panel, or `adb logcat` for Android native logs. For web, check the browser console.

4. Use the DOM capture listener (index.tsx contains one) when running on web to see if clicks reach the DOM and where they land.

5. Reproduce a play error and check `useMusicPlayer` logs that now print status updates and errors with context.


## Next recommended tasks

1. Remove or tighten `pointerEvents` usage in `ChallengeCard.tsx` and any top-level wrappers — prefer not to set pointer events on big containers.
2. Add a simple unit/integration test (Jest + react-native-testing-library) for `ChallengeCard` to assert `onPress` is called.
3. Add an accessible `onPressIn` log to the `GlassButton` to quickly confirm touches in a running app.
4. Run TypeScript check: `npx tsc --noEmit` and fix any leftover type issues.


## Closing

The README above is a point-in-time map of the app and actionable guidance to debug play/touch issues. If you want, I can:

- open and remove the problematic `pointerEvents` lines in `ChallengeCard.tsx` and other affected files, and re-run a quick type-check; or
- add `onPressIn` hooks to the `GlassButton` and `ChallengeCard` to confirm touch delivery.

Tell me which follow-up you'd like and I'll make the edits and validate.
