// utils/trackHelpers.ts
import  { MusicChallenge, Track } from '../types';

/**
 * Convert a single MusicChallenge into a Track
 */
export function challengeToTrack(challenge: MusicChallenge): Track {
  return {
    id: challenge.id,
    url: challenge.audioUrl,
    title: challenge.title,
    artist: challenge.artist,
    artwork: challenge.imageUrl,   // optional
    duration: challenge.duration,  // optional
  };
}

/**
 * Convert an array of MusicChallenge objects into Track objects
 */
export function challengesToTracks(challenges: MusicChallenge[]): Track[] {
  return challenges.map(challengeToTrack);
}
