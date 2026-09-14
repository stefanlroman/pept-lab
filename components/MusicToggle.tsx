"use client";

import { useRef, useState } from "react";
import { basePath } from "@/lib/basePath";

// Browsers block audio-with-sound autoplay, so playback only ever starts
// from this direct click (a real user gesture) — never automatically.
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = 0.35;
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="none" src={`${basePath}/audio/melodic-techno-journey.mp3`} />
      <button
        onClick={toggle}
        aria-label={isPlaying ? "Musik stumm schalten" : "Musik abspielen"}
        aria-pressed={isPlaying}
        className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg/70 backdrop-blur-md transition-colors hover:border-accent-dim"
      >
        {isPlaying ? (
          <span className="flex items-end gap-[3px]" aria-hidden="true">
            <span className="eq-bar h-2 w-[3px] rounded-full bg-accent" />
            <span className="eq-bar h-3.5 w-[3px] rounded-full bg-accent" style={{ animationDelay: "0.15s" }} />
            <span className="eq-bar h-2.5 w-[3px] rounded-full bg-accent" style={{ animationDelay: "0.3s" }} />
          </span>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-fg-muted" aria-hidden="true">
            <path
              d="M4 15V9a1 1 0 0 1 1-1h3l5-4v16l-5-4H5a1 1 0 0 1-1-1Z"
              fill="currentColor"
            />
            <path
              d="M17 8.5c1 .8 1 6.2 0 7"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
          </svg>
        )}
      </button>
    </>
  );
}
