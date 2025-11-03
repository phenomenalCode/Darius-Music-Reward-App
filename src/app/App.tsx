import React, { useEffect } from "react";
import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from "react-native-track-player";
import { Slot } from "expo-router";

async function setupTrackPlayer() {
  try {
    await TrackPlayer.setupPlayer();

    await TrackPlayer.updateOptions({
      android: {
        // Ensures playback stops cleanly when app is killed
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
      progressUpdateEventInterval: 2,
    });
  } catch (err) {
    console.error("Error setting up TrackPlayer:", err);
  }
}

export default function App() {
  useEffect(() => {
    setupTrackPlayer();

    // Proper cleanup on unmount
    return () => {
      TrackPlayer.reset();
    };
  }, []);

  return <Slot />; // Required for Expo Router navigation
}
