// // services/audioService.ts
// import { useCallback, useRef, useState } from 'react';
// import { Audio, AVPlaybackStatusSuccess } from 'expo-av';
// import type { MusicChallenge, Track } from '../types';
// import { challengeToTrack } from '../utils/trackHelper';
// import { useMusicStore } from '../stores/musicStores';

// export const useButtonLogic = () => {
//   const soundRef = useRef<Audio.Sound | null>(null);

//   // ====== Sync with global store ======
//   const currentTrack = useMusicStore((s) => s.currentTrack);
//   const setCurrentTrack = useMusicStore((s) => s.setCurrentTrack);
//   const isPlayingGlobal = useMusicStore((s) => s.isPlaying);
//   const setIsPlayingGlobal = useMusicStore((s) => s.setIsPlaying);

//   const [position, setPosition] = useState(0);
//   const [duration, setDuration] = useState(0);

//   // ------------------------- Play -------------------------
//   const handlePlayTrack = useCallback(
//     async (challenge: MusicChallenge) => {
//       console.log('▶️ Play button pressed ->', challenge.title);
//       try {
//         // Unload previous sound
//         if (soundRef.current) {
//           await soundRef.current.unloadAsync();
//           soundRef.current.setOnPlaybackStatusUpdate(null);
//           soundRef.current = null;
//         }

//         const trackData: Track = challengeToTrack(challenge);

//         const { sound } = await Audio.Sound.createAsync(
//           { uri: trackData.url },
//           { shouldPlay: true },
//           (status) => {
//             const s = status as AVPlaybackStatusSuccess;
//             // Only check if it's playing
//             setIsPlayingGlobal(s.isPlaying);
//             setPosition((s.positionMillis ?? 0) / 1000);
//             setDuration((s.durationMillis ?? 0) / 1000);
//           }
//         );

//         soundRef.current = sound;
//         setCurrentTrack(challenge); // Update global store
//       } catch (err) {
//         console.error('❌ Failed to play track:', err);
//       }
//     },
//     [setCurrentTrack, setIsPlayingGlobal]
//   );

//   // ------------------------- Pause -------------------------
//   const handlePauseTrack = useCallback(async () => {
//     try {
//       await soundRef.current?.pauseAsync();
//       setIsPlayingGlobal(false);
//     } catch (err) {
//       console.error('❌ Failed to pause track:', err);
//     }
//   }, [setIsPlayingGlobal]);

//   // ------------------------- Resume -------------------------
//   const handleResumeTrack = useCallback(async () => {
//     try {
//       await soundRef.current?.playAsync();
//       setIsPlayingGlobal(true);
//     } catch (err) {
//       console.error('❌ Failed to resume track:', err);
//     }
//   }, [setIsPlayingGlobal]);

//   // ------------------------- Seek -------------------------
//   const handleSeek = useCallback(async (seconds: number) => {
//     try {
//       await soundRef.current?.setPositionAsync(seconds * 1000);
//       setPosition(seconds);
//     } catch (err) {
//       console.error('❌ Failed to seek track:', err);
//     }
//   }, []);

//   // ------------------------- Reset -------------------------
//   const handleReset = useCallback(async () => {
//     try {
//       await soundRef.current?.unloadAsync();
//       soundRef.current = null;
//       setCurrentTrack(null);
//       setIsPlayingGlobal(false);
//       setPosition(0);
//       setDuration(0);
//     } catch (err) {
//       console.error('❌ Failed to reset player:', err);
//     }
//   }, [setCurrentTrack, setIsPlayingGlobal]);

//   return {
//     currentTrack,
//     isPlaying: isPlayingGlobal,
//     position,
//     duration,
//     handlePlayTrack,
//     handlePauseTrack,
//     handleResumeTrack,
//     handleSeek,
//     handleReset,
//   };
// };
