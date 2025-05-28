"use client";

import React, { useRef, useEffect } from 'react';
import { AUDIO_SRC } from '@/config/constants';

interface BackgroundAudioProps {
  isMuted: boolean;
  onInitialPlayFailed?: () => void; // Callback if autoplay fails
}

const BackgroundAudio: React.FC<BackgroundAudioProps> = ({ isMuted, onInitialPlayFailed }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted && audioRef.current.paused) {
        audioRef.current.play().catch(error => {
          console.warn("Audio autoplay failed:", error);
          if (onInitialPlayFailed) {
            onInitialPlayFailed();
          }
        });
      } else if (isMuted && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isMuted, onInitialPlayFailed]);
  
  // Attempt to play on mount if not muted (might be blocked by browser)
  useEffect(() => {
    if (audioRef.current && !isMuted) {
      // A short timeout can sometimes help with autoplay policies
      setTimeout(() => {
        audioRef.current?.play().catch(error => {
          console.warn("Audio autoplay on mount failed:", error);
          if (onInitialPlayFailed) {
            onInitialPlayFailed();
          }
        });
      }, 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return <audio ref={audioRef} src={AUDIO_SRC} loop preload="auto" />;
};

export default BackgroundAudio;
