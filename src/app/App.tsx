// App.tsx
import React, { useEffect } from "react";
import { Slot } from "expo-router";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import { Platform, NativeModules, TurboModuleRegistry } from "react-native";

// 🧠 Configure audio + log TurboModules
async function setupAudio() {
  try {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true, // Background play
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      shouldDuckAndroid: true, // Pause other audio when playing
    });

    console.log("🎧 Audio setup complete");

    // ✅ bypass type error safely
    const moduleNames =
      (TurboModuleRegistry as any)?.getTurboModuleNames?.() ?? "⚠️ Not available";
    console.log("💥 TurboModule names:", moduleNames);
  } catch (err) {
    console.error("❌ Audio setup failed:", err);
  }
}

// 🔍 NativeModule + TurboModule diagnostics
function diagnoseNativeModules() {
  try {
    console.log("🧩 Platform:", Platform.OS);
    console.log(
      "🧩 React Native version:",
      NativeModules.PlatformConstants?.reactNativeVersion
    );
    console.log("🧩 Available NativeModules:", Object.keys(NativeModules));

    if (!NativeModules.PlatformConstants) {
      console.warn("⚠️ PlatformConstants missing – native bridge not initialized.");
    }

    // Optional TurboModule inspection
    try {
      const names = ["PlatformConstants", "Performance", "DeviceInfo"];
      names.forEach((n) => {
        const mod = (TurboModuleRegistry as any)?.get?.(n);
        console.log(`🔍 TurboModule ${n}:`, mod ? "✅ found" : "❌ missing");
      });
    } catch (err) {
      console.error("💥 TurboModuleRegistry inspection failed:", err);
    }
  } catch (e) {
    console.error("💥 Error inspecting NativeModules:", e);
  }
}

export default function App() {
  useEffect(() => {
    setupAudio();
    diagnoseNativeModules();

    return () => {
      console.log("🧹 App cleanup");
    };
  }, []);

  return <Slot />;
}




// // App.tsx
// import React, { useEffect } from "react";
// import { Slot } from "expo-router";
// import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av'; // ✅ Expo-AV for global audio config

// async function setupAudio() {
//   try {
//     // Global audio mode (replaces TrackPlayer.setupPlayer/options)
//     await Audio.setAudioModeAsync({
//       staysActiveInBackground: true, // Background play
//   // Use the named enums provided by expo-av
//   interruptionModeIOS: InterruptionModeIOS.DoNotMix,
//       playsInSilentModeIOS: true,
//   interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
//       shouldDuckAndroid: true, // Pause other audio when playing
//     });
//     console.log("Audio setup complete"); // ✅ Log for debug
//   } catch (err) {
//     console.error("Audio setup failed:", err);
//   }
// }

// export default function App() {
//   useEffect(() => {
//     setupAudio();

//     // Cleanup: No reset needed for expo-av (hook handles per-sound unload)
//     return () => {
//       console.log("App cleanup"); // Optional log
//     };
//   }, []);

//   return <Slot />; // Your router magic stays the same
//}
// // App.tsx
// import React, { useEffect } from "react";
// import { Slot } from "expo-router";
// import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from "react-native-track-player";

// // Import your service
// import playbackService from "../services/playbackService";

// async function setupTrackPlayer() {
//   try {
//     // 1. Setup player
//     await TrackPlayer.setupPlayer();

//     // 2. Update options
//     await TrackPlayer.updateOptions({
//       android: {
//         appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
//       },
//       capabilities: [
//         Capability.Play,
//         Capability.Pause,
//         Capability.SkipToNext,
//         Capability.SkipToPrevious,
//         Capability.Stop,
//       ],
//       compactCapabilities: [Capability.Play, Capability.Pause],
//       progressUpdateEventInterval: 2,
//     });

//     // 3. Register service AFTER setup
//     TrackPlayer.registerPlaybackService(() => playbackService);
//   } catch (err) {
//     console.error("TrackPlayer setup failed:", err);
//   }
// }

// export default function App() {
//   useEffect(() => {
//     setupTrackPlayer();

//     return () => {
//       TrackPlayer.reset();
//     };
//   }, []);

//   return <Slot />;
// }
















// import React, { useEffect } from "react";
// import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from "react-native-track-player";
// import { Slot } from "expo-router";

// async function setupTrackPlayer() {
//   try {
//     await TrackPlayer.setupPlayer();

//     await TrackPlayer.updateOptions({
//       android: {
//         // Ensures playback stops cleanly when app is killed
//         appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
//       },
//       capabilities: [
//         Capability.Play,
//         Capability.Pause,
//         Capability.SkipToNext,
//         Capability.SkipToPrevious,
//         Capability.Stop,
//       ],
//       compactCapabilities: [Capability.Play, Capability.Pause],
//       progressUpdateEventInterval: 2,
//     });
//   } catch (err) {
//     console.error("Error setting up TrackPlayer:", err);
//   }
// }

// export default function App() {
//   useEffect(() => {
//     setupTrackPlayer();

//     // Proper cleanup on unmount
//     return () => {
//       TrackPlayer.reset();
//     };
//   }, []);

//   return <Slot />; // Required for Expo Router navigation
// }
