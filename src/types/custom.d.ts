declare module 'react-native-track-player' {
  const TrackPlayer: any;
  export default TrackPlayer;
  export const Event: any;
  export const Track: any;
  export const Capability: any;
}

declare module 'expo-router' {
  import * as React from 'react';

  const router: any;
  export { router };

  // Minimal runtime stubs for common expo-router exports used in the app
  export const Slot: React.FC<any>;

  type ScreenComponent = React.FC<any>;

  export const Stack: React.FC<any> & { Screen: ScreenComponent };
  export const Tabs: React.FC<any> & { Screen: ScreenComponent };

  export function useRouter(): any;
  export function useSegments(): string[];
}
