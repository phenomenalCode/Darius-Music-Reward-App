import { useCallback, useEffect, useState, useRef } from 'react';
import { Audio } from 'expo-av';
import { useMusicStore, selectCurrentTrack, selectIsPlaying } from '../stores/musicStores';
import { useUserStore } from '../stores/userStore';
import type { MusicChallenge, UseMusicPlayerReturn } from '../types';
import { challengeToTrack } from '../utils/trackHelper';
import { AVPlaybackStatus } from 'expo-av';


export const useMusicPlayer = (): UseMusicPlayerReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const setCurrentTrack = useMusicStore((state) => state.setCurrentTrack);
  const setIsPlaying = useMusicStore((state) => state.setIsPlaying);
  const setCurrentPosition = useMusicStore((state) => state.setCurrentPosition);
  const updateProgress = useMusicStore((state) => state.updateProgress);
  const markChallengeComplete = useMusicStore((state) => state.markChallengeComplete);
  // const addPoints = useUserStore((state) => state.addPoints);
  const completeChallenge = useUserStore((state) => state.completeChallenge);
  const completionLockRef = useRef(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);

  const play = useCallback(async (track: MusicChallenge) => {
    try {
      setLoading(true);
      setError(null);
      completionLockRef.current = false;
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current.setOnPlaybackStatusUpdate(null);
        soundRef.current = null;
      }

      const trackData = challengeToTrack(track);
      const { sound } = await Audio.Sound.createAsync(
        { uri: trackData.url },
        { shouldPlay: true },
        (status) => setStatus(status) //  Status inferred automatically
      );

      soundRef.current = sound;
      setCurrentTrack(track);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Playback failed');
      console.error('Playback error:', err);
    } finally {
      setLoading(false);
    }
  }, [setCurrentTrack]);

  const pause = useCallback(async () => { await soundRef.current?.pauseAsync(); }, []);
 
  const seekTo = useCallback(async (seconds: number) => { await soundRef.current?.setPositionAsync(seconds * 1000); }, []);

useEffect(() => {
  if (!status) return;

  //  ERROR STATE (must be handled FIRST)
  if (!status.isLoaded) {
    setError(`Playback error: ${status.error}`);
    setLoading(false);
    return;
  }

  //  SUCCESS STATE (TS now knows this is AVPlaybackStatusSuccess)
  const currentlyPlaying = status.isPlaying;
  if (currentlyPlaying !== isPlaying) {
    setIsPlaying(currentlyPlaying);
  }

  

  if (!currentTrack) return;

  const currentSeconds = (status.positionMillis ?? 0) / 1000;
  const durationSeconds = (status.durationMillis ?? 0) / 1000;

  setCurrentPosition(currentSeconds);

  const progressPercentage =
    durationSeconds > 0
      ? (currentSeconds / durationSeconds) * 100
      : 0;

  updateProgress(currentTrack.id, progressPercentage);

  if (progressPercentage >= 99 && !completionLockRef.current) {
    completionLockRef.current = true;

    markChallengeComplete(currentTrack.id);
    completeChallenge(currentTrack.id, currentTrack.points);
  }
},  [
  status,
  currentTrack,
  isPlaying,
  setIsPlaying,
  setCurrentPosition,
  updateProgress,
  markChallengeComplete,
  completeChallenge,
  // addPoints,
]);

  useEffect(() => () => { soundRef.current?.unloadAsync(); }, []);

  return {
    isPlaying: status?.isLoaded ? status.isPlaying : false,
    currentTrack,
 currentPosition: status?.isLoaded ? status.positionMillis / 1000 : 0,
   duration: status?.isLoaded
    ? (status.durationMillis ?? 0) / 1000
    : 0,
    play,
    pause,
    seekTo,
    loading,
    error,
  };
};

// // useMusicPlayer hook - Integrates react-native-track-player with Zustand
// import { useCallback, useEffect, useState } from 'react';
// import TrackPlayer, {
//   State,
//   usePlaybackState,
//   useProgress,
//   Event,
//   useTrackPlayerEvents, Capability
// } from 'react-native-track-player';
// import { useMusicStore, selectCurrentTrack, selectIsPlaying } from '../stores/musicStores';
// import { useUserStore } from '../stores/userStore';
// import type { MusicChallenge, UseMusicPlayerReturn } from '../types';
// import { challengeToTrack } from '../utils/trackHelper'; // ✅ Added

// export const useMusicPlayer = (): UseMusicPlayerReturn => {
//   // TrackPlayer hooks
//   const playbackState = usePlaybackState();
//   const progress = useProgress();
  
//   // Local state
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
  
//   // Zustand store selectors
//   const currentTrack = useMusicStore(selectCurrentTrack);
//   const isPlaying = useMusicStore(selectIsPlaying);
//   const setCurrentTrack = useMusicStore((state) => state.setCurrentTrack);
//   const setIsPlaying = useMusicStore((state) => state.setIsPlaying);
//   const setCurrentPosition = useMusicStore((state) => state.setCurrentPosition);
//   const updateProgress = useMusicStore((state) => state.updateProgress);
//   const markChallengeComplete = useMusicStore((state) => state.markChallengeComplete);
//   const addPoints = useUserStore((state) => state.addPoints);
//   const completeChallenge = useUserStore((state) => state.completeChallenge);

//   // Track playback state changes
//   useEffect(() => {
//     let stateValue: any = playbackState;
//     if (typeof playbackState === 'object' && playbackState !== null && 'state' in playbackState) {
//       stateValue = playbackState.state;
//     }
//     const isCurrentlyPlaying = stateValue === State.Playing;
//     if (isCurrentlyPlaying !== isPlaying) {
//       setIsPlaying(isCurrentlyPlaying);
//     }
//   }, [playbackState, isPlaying, setIsPlaying]);

//   // Update position and calculate progress/points
//   useEffect(() => {
//     if (currentTrack && progress.position > 0) {
//       setCurrentPosition(progress.position);
//       const progressPercentage = (progress.position / progress.duration) * 100;

//       updateProgress(currentTrack.id, progressPercentage);

//       if (progressPercentage >= 90 && !currentTrack.completed) {
//         markChallengeComplete(currentTrack.id);
//         completeChallenge(currentTrack.id);
//         addPoints(currentTrack.points);
//       }
//     }
//   }, [
//     progress.position,
//     progress.duration,
//     currentTrack,
//     setCurrentPosition,
//     updateProgress,
//     markChallengeComplete,
//     completeChallenge,
//     addPoints,
//   ]);

//   // Handle track player events
//   useTrackPlayerEvents([Event.PlaybackError], (event) => {
//     if (event.type === Event.PlaybackError) {
//       setError(`Playback error: ${event.message}`);
//       setLoading(false);
//     }
//   });

//   const play = useCallback(async (track: MusicChallenge) => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Convert MusicChallenge → Track for TrackPlayer
//       const trackData = challengeToTrack(track);

//       await TrackPlayer.reset();
//       await TrackPlayer.add(trackData);
//       await TrackPlayer.play();
//       setCurrentTrack(track);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Playback failed';
//       setError(errorMessage);
//       console.error('TrackPlayer error:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [setCurrentTrack]);

//   const pause = useCallback(async () => {
//     try {
//       await TrackPlayer.pause();
//     } catch (err) {
//       console.error('Pause error:', err);
//     }
//   }, []);

//   const seekTo = useCallback(async (seconds: number) => {
//     try {
//       await TrackPlayer.seekTo(seconds);
//     } catch (err) {
//       console.error('Seek error:', err);
//     }
//   }, []);

//   const resume = useCallback(async () => {
//     try {
//       await TrackPlayer.play();
//     } catch (err) {
//       console.error('Resume error:', err);
//     }
//   }, []);

//   let stateValue: any = playbackState;
//   if (typeof playbackState === 'object' && playbackState !== null && 'state' in playbackState) {
//     stateValue = playbackState.state;
//   }

//   return {
//     isPlaying: stateValue === State.Playing,
//     currentTrack,
//     currentPosition: progress.position,
//     duration: progress.duration,
//     play,
//     pause,
//     seekTo,
//     loading,
//     error,
//   };
// };










// // useMusicPlayer hook - Integrates react-native-track-player with Zustand
// import { useCallback, useEffect, useState } from 'react';
// import TrackPlayer, {
//   State,
//   usePlaybackState,
//   useProgress,
//   Event,
//   useTrackPlayerEvents,
// } from 'react-native-track-player';
// import { useMusicStore, selectCurrentTrack, selectIsPlaying } from '../stores/musicStore';
// import { useUserStore } from '../stores/userStore';
// import type { MusicChallenge, UseMusicPlayerReturn } from '../types';

// export const useMusicPlayer = (): UseMusicPlayerReturn => {
//   // TrackPlayer hooks
//   const playbackState = usePlaybackState();
//   const progress = useProgress();
  
//   // Local state
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
  
//   // Zustand store selectors
//   const currentTrack = useMusicStore(selectCurrentTrack);
//   const isPlaying = useMusicStore(selectIsPlaying);
//   const setCurrentTrack = useMusicStore((state) => state.setCurrentTrack);
//   const setIsPlaying = useMusicStore((state) => state.setIsPlaying);
//   const setCurrentPosition = useMusicStore((state) => state.setCurrentPosition);
//   const updateProgress = useMusicStore((state) => state.updateProgress);
//   const markChallengeComplete = useMusicStore((state) => state.markChallengeComplete);
//   const addPoints = useUserStore((state) => state.addPoints);
//   const completeChallenge = useUserStore((state) => state.completeChallenge);

//   // Track playback state changes
//   useEffect(() => {
//     // Some versions of usePlaybackState may return an object, so extract value if needed
//     let stateValue: any = playbackState;
//     if (typeof playbackState === 'object' && playbackState !== null && 'state' in playbackState) {
//       stateValue = playbackState.state;
//     }
//     const isCurrentlyPlaying = stateValue === State.Playing;
//     if (isCurrentlyPlaying !== isPlaying) {
//       setIsPlaying(isCurrentlyPlaying);
//     }
//   }, [playbackState, isPlaying, setIsPlaying]);

//   // Update position and calculate progress/points
//   useEffect(() => {
//     if (currentTrack && progress.position > 0) {
//       setCurrentPosition(progress.position);
      
//       // Calculate progress percentage
//       const progressPercentage = (progress.position / progress.duration) * 100;
//       updateProgress(currentTrack.id, progressPercentage);
      
//       // Check if track is completed (90% threshold to account for small timing issues)
//       if (progressPercentage >= 90 && !currentTrack.completed) {
//         markChallengeComplete(currentTrack.id);
//         completeChallenge(currentTrack.id);
//         addPoints(currentTrack.points);
//       }
//     }
//   }, [progress.position, progress.duration, currentTrack, setCurrentPosition, updateProgress, markChallengeComplete, completeChallenge, addPoints]);

//   // Handle track player events
//   useTrackPlayerEvents([Event.PlaybackError], (event) => {
//     if (event.type === Event.PlaybackError) {
//       setError(`Playback error: ${event.message}`);
//       setLoading(false);
//     }
//   });

//   const play = useCallback(async (track: MusicChallenge) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Reset and add new track
//       await TrackPlayer.reset();
//       await TrackPlayer.add({
//         id: track.id,
//         url: track.audioUrl,
//         title: track.title,
//         artist: track.artist,
//         duration: track.duration,
//       });
      
//       // Start playback
//       await TrackPlayer.play();
//       setCurrentTrack(track);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Playback failed';
//       setError(errorMessage);
//       console.error('TrackPlayer error:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [setCurrentTrack]);

//   const pause = useCallback(async () => {
//     try {
//       await TrackPlayer.pause();
//     } catch (err) {
//       console.error('Pause error:', err);
//     }
//   }, []);

//   const seekTo = useCallback(async (seconds: number) => {
//     try {
//       await TrackPlayer.seekTo(seconds);
//     } catch (err) {
//       console.error('Seek error:', err);
//     }
//   }, []);

//   const resume = useCallback(async () => {
//     try {
//       await TrackPlayer.play();
//     } catch (err) {
//       console.error('Resume error:', err);
//     }
//   }, []);

//   // Extract value for isPlaying return as well
//   let stateValue: any = playbackState;
//   if (typeof playbackState === 'object' && playbackState !== null && 'state' in playbackState) {
//     stateValue = playbackState.state;
//   }
//   return {
//     isPlaying: stateValue === State.Playing,
//     currentTrack,
//     currentPosition: progress.position,
//     duration: progress.duration,
//     play,
//     pause,
//     seekTo,
//     resume,
//     loading,
//     error,
//   };
// };