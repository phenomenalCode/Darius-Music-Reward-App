// playbackService.ts
import { useState, useEffect } from 'react';
import TrackPlayer, { Event, Track , Capability} from 'react-native-track-player';

// ------------------------- Safe call helper -------------------------
const safeCall = async (fn: () => Promise<void>, action: string) => {
  try {
    await fn();
  } catch (err) {
    console.error(`${action} error:`, err);
  }
};

// ------------------------- React Hook -------------------------
// export const usePlaybackState = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [position, setPosition] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

//   // Subscribe to TrackPlayer events
//   useEffect(() => {
//     const updatePosition = async () => {
//       const pos = await TrackPlayer.getPosition();
//       const dur = await TrackPlayer.getDuration();
//       const trackId = await TrackPlayer.getCurrentTrack();
//       const track = trackId ? await TrackPlayer.getTrack(trackId) : null;

//       setPosition(pos);
//       setDuration(dur);
//       setCurrentTrack(track);
//     };

//     const onPlay = () => setIsPlaying(true);
//     const onPause = () => setIsPlaying(false);
//     const onProgress = () => updatePosition();
//     const onQueueEnded = () => console.log('Playback queue ended');

//     // Remote controls
//     const subscriptions = [
//       TrackPlayer.addEventListener(Event.RemotePlay, onPlay),
//       TrackPlayer.addEventListener(Event.RemotePause, onPause),
//       TrackPlayer.addEventListener(Event.RemoteNext, () => safeCall(() => TrackPlayer.skipToNext(), 'RemoteNext')),
//       TrackPlayer.addEventListener(Event.RemotePrevious, () => safeCall(() => TrackPlayer.skipToPrevious(), 'RemotePrevious')),
//       TrackPlayer.addEventListener(Event.RemoteSeek, (event) => safeCall(() => TrackPlayer.seekTo(event.position), 'RemoteSeek')),
//       TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, onProgress),
//       TrackPlayer.addEventListener(Event.PlaybackQueueEnded, onQueueEnded),
//       TrackPlayer.addEventListener(Event.PlaybackError, (event) => console.error('Playback error:', event)),
//     ];

//     // Initial fetch
//     updatePosition();

//     return () => {
//       subscriptions.forEach((sub) => sub.remove());
//     };
//   }, []);

//   // Control functions
//   const play = () => safeCall(() => TrackPlayer.play(), 'Play');
//   const pause = () => safeCall(() => TrackPlayer.pause(), 'Pause');
//   const skipNext = () => safeCall(() => TrackPlayer.skipToNext(), 'SkipNext');
//   const skipPrevious = () => safeCall(() => TrackPlayer.skipToPrevious(), 'SkipPrevious');
//   const seekTo = (seconds: number) => safeCall(() => TrackPlayer.seekTo(seconds), 'SeekTo');

//   return {
//     isPlaying,
//     position,
//     duration,
//     currentTrack,
//     play,
//     pause,
//     skipNext,
//     skipPrevious,
//     seekTo,
//   };
// };

// ------------------------- Background Service -------------------------
export default async function playbackService() {
  // Register remote events for background mode
  TrackPlayer.addEventListener(Event.RemotePlay, () => safeCall(() => TrackPlayer.play(), 'RemotePlay'));
  TrackPlayer.addEventListener(Event.RemotePause, () => safeCall(() => TrackPlayer.pause(), 'RemotePause'));
  TrackPlayer.addEventListener(Event.RemoteNext, () => safeCall(() => TrackPlayer.skipToNext(), 'RemoteNext'));
  TrackPlayer.addEventListener(Event.RemotePrevious, () => safeCall(() => TrackPlayer.skipToPrevious(), 'RemotePrevious'));
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => safeCall(() => TrackPlayer.seekTo(event.position), 'RemoteSeek'));

  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (event) => console.log('Playback queue ended:', event));
  TrackPlayer.addEventListener(Event.PlaybackError, (event) => console.error('Playback error:', event));

  console.log('Playback service initialized');
}

// For RN background service compatibility
//module.exports = playbackService;
