import { useState, useCallback, useRef, useEffect } from "react";
import { Sound } from "@workspace/api-client-react";
import { getProfile, playProfile } from "@/lib/audioEngine";

export interface AudioPlayerState {
  currentSound: Sound | null;
  isPlaying: boolean;
  currentProfileId: string | null;
  error: string | null;
}

export interface UseAudioPlayerReturn extends AudioPlayerState {
  play: (sound: Sound) => void;
  stop: () => void;
  isPlaying: (soundId: string) => boolean;
  playSound: (sound: Sound) => void;
  stopCurrent: () => void;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
  const [state, setState] = useState<AudioPlayerState>({
    currentSound: null,
    isPlaying: false,
    currentProfileId: null,
    error: null,
  });

  const previousSoundRef = useRef<Sound | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const stop = useCallback(() => {
    if (audioContextRef.current?.state === "running") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      isPlaying: false,
      currentSound: null,
      currentProfileId: null,
      error: null,
    }));
  }, []);

  const isPlaying = useCallback((soundId: string) => {
    return state.currentSound?.id === soundId && state.isPlaying;
  }, [state.currentSound?.id, state.isPlaying]);

  const play = useCallback((sound: Sound) => {
    // Stop any currently playing sound
    stop();

    try {
      // Get the appropriate profile for this sound
      const profile = getProfile(sound.id);

      // Create and configure audio context
      const ac = new AudioContext();
      audioContextRef.current = ac;

      // Start playing
      const cleanup = playProfile(profile);

      // Update state
      setState({
        currentSound: sound,
        isPlaying: true,
        currentProfileId: sound.id,
        error: null,
      });

      // Store cleanup function to call when sound ends
      (ac as any).cleanup = cleanup;

      // Handle AudioContext suspension on user gesture
      if (ac.state === "suspended") {
        ac.resume();
      }

      // Auto-stop after profile duration (approximate)
      const duration = profile.duration + profile.release + profile.attack;
      setTimeout(() => {
        if (state.currentProfileId === sound.id) {
          stop();
        }
      }, duration * 1000);

    } catch (error) {
      console.error("Error playing sound:", error);
      setState((prev) => ({
        ...prev,
        error: "Failed to play sound. Please try again.",
      }));
    }
  }, [stop, state.currentProfileId]);

  const playSound = play; // Alias for consistency
  const stopCurrent = stop;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      stop();
    };
  }, [stop]);

  return {
    ...state,
    play,
    stop,
    isPlaying,
    playSound,
    stopCurrent,
  };
}