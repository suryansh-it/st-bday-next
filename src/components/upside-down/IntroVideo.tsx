"use client";

import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

interface IntroVideoProps {
  onEnd: () => void;
}

export default function IntroVideo({ onEnd }: IntroVideoProps) {
  const [muted, setMuted] = useState(true);

  // On first user click anywhere, unmute
  useEffect(() => {
    const handler = () => {
      setMuted(false);
      window.removeEventListener('click', handler);
    };
    window.addEventListener('click', handler, { once: true });
    return () => window.removeEventListener('click', handler);
  }, []);

  return (
    <div className="fixed inset-0 z-[150] bg-black flex items-center justify-center">
      <ReactPlayer
        url="https://vimeo.com/1088481503"    // just the watch URL
        playing
        muted={muted}
        controls={false}
        width="100%"
        height="100%"
        onEnded={onEnd}
        config={{
          vimeo: {
            playerOptions: {
              autoplay: true,
              muted,
              playsinline: true,
            }
          }
        }}
      />

      {muted && (
        <button
          className="absolute z-10 px-4 py-2 bg-white/20 text-white rounded"
          onClick={() => setMuted(false)}
        >
           click me
        </button>
      )}
    </div>
  );
}
