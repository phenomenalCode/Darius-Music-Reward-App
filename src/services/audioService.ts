// audioService.ts
import { useState, useEffect } from 'react';
import TrackPlayer, { Capability, AppKilledPlaybackBehavior, Track, Event } from 'react-native-track-player';

// ------------------------- Reactive Hook -------------------------
export const useAudioService = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // ------------------------- Safe call helper -------------------------
  const safeCall = async (fn: () => Promise<void>, action: string) => {
    try {
      await fn();
    } catch (err) {
      console.error(`${action} error:`, err);
    }
  };

  // ------------------------- Player setup -------------------------
  const setupPlayer = async () => {
    const running = await TrackPlayer.isServiceRunning();
    if (running) return;

    await TrackPlayer.setupPlayer({ waitForBuffer: true, maxCacheSize: 1024 * 10 });

    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
      notificationCapabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
      android: { appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification },
      alwaysPauseOnInterruption: true,
    //   stopWithApp: false,
    });

    console.log('TrackPlayer setup complete');
  };

  // ------------------------- Hook Event Listeners -------------------------
  useEffect(() => {
    const updatePosition = async () => {
      const pos = await TrackPlayer.getPosition();
      const dur = await TrackPlayer.getDuration();
      const trackId = await TrackPlayer.getCurrentTrack();
      const track = trackId ? await TrackPlayer.getTrack(trackId) : null;

      setPosition(pos);
      setDuration(dur);
      setCurrentTrack(track);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const subscriptions = [
      TrackPlayer.addEventListener(Event.RemotePlay, onPlay),
      TrackPlayer.addEventListener(Event.RemotePause, onPause),
      TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, updatePosition),
      TrackPlayer.addEventListener(Event.PlaybackQueueEnded, updatePosition),
      TrackPlayer.addEventListener(Event.PlaybackError, (event) => console.error('Playback error:', event)),
    ];

    updatePosition(); // initial fetch

    return () => subscriptions.forEach((sub) => sub.remove());
  }, []);

  // ------------------------- Player Controls -------------------------
  const addTrack = async (track: Track) => {
    await setupPlayer();
    await safeCall(() => TrackPlayer.add(track).then(() => {}), 'Add track');
  };

  const play = async () => {
    await safeCall(() => TrackPlayer.play(), 'Play track');
  };

  const pause = async () => {
    await safeCall(() => TrackPlayer.pause(), 'Pause track');
  };

  const seekTo = async (seconds: number) => {
    await safeCall(() => TrackPlayer.seekTo(seconds), 'Seek track');
  };

  const reset = async () => {
    await safeCall(() => TrackPlayer.reset(), 'Reset player');
    setCurrentTrack(null);
    setPosition(0);
    setDuration(0);
    setIsPlaying(false);
  };

  // ------------------------- Expose Hook State -------------------------
  return {
    currentTrack,
    position,
    duration,
    isPlaying,
    addTrack,
    play,
    pause,
    seekTo,
    reset,
    setupPlayer,
  };
};
