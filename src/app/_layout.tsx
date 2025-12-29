import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useEffect, useState } from 'react';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useUserStore, selectHasMaxPoints } from '../stores/userStore';

export default function RootLayout() {
  const hasMaxPoints = useUserStore(selectHasMaxPoints);
  const resetProgress = useUserStore((s) => s.resetProgress);
  const clearMaxFlag = useUserStore((s) => s.clearMaxFlag);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (hasMaxPoints) {
      console.log('🎉 Confetti triggered globally!');
      setShowConfetti(true);

      const timer = setTimeout(() => {
        setShowConfetti(false);
        //resetProgress();  reset points & challenges
        clearMaxFlag();  // reset confetti flag
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [hasMaxPoints]);

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          contentStyle: {},
        }}
      >
        {/* Main app tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Modals (e.g., Player modal) */}
        <Stack.Screen
          name="(modals)"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack>

      {/* 🎊 GLOBAL CONFETTI OVERLAY */}
      {showConfetti && (
        <ConfettiCannon
          count={250}
          origin={{ x: -10, y: 0 }}
          fadeOut
          autoStart
        />
      )}
    </View>
  );
}
