// index.js
import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { registerRootComponent } from 'expo';
import App from './App';

// Register the main app with Expo
registerRootComponent(App);

// Register the TrackPlayer service
TrackPlayer.registerPlaybackService(() => require('./src/services/playbackService').default);
