// src/app/(modals)/_layout.tsx
import { Stack } from 'expo-router';
import { THEME } from '../../constants/theme';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: THEME.colors.background,
        },
        headerTintColor: THEME.colors.text.primary,
        presentation: 'modal',
      }}
    />
  );
}
