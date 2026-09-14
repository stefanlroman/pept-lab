"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Logo from "./Logo";

const MIN_VISIBLE_MS = 900;
const MAX_WAIT_MS = 8000;

// Covers the page until the hero background video can actually play
// through, so it never pops in half-loaded. Tracks the video's real
// buffered range for the progress bar, with a gentle trickle on top so
// it never looks stalled while waiting for the first byte, and a hard
// timeout so a slow/broken video never blocks the site indefinitely.
export default function LoadingScreen() {
  const [progress, setProgress] = useState(6);
  const [mounted, setMounted] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    const startedAt = Date.now();
    document.documentElement.style.overflow = "hidden";

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setProgress(100);
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.7,
        delay: 0.2,
        ease: "power2.out",
        onComplete: () => {
          document.documentElement.style.overflow = "";
          setMounted(false);
        },
      });
    };

    const finishNoEarlierThan = (ms: number) => {
      const elapsed = Date.now() - startedAt;
      if (elapsed >= ms) finish();
      else setTimeout(finish, ms - elapsed);
    };

    const video = document.querySelector("video");

    const onProgress = () => {
      if (!video || !video.duration || !video.buffered.length) return;
      const buffered = video.buffered.end(video.buffered.length - 1);
      setProgress((p) =>
        Math.max(p, Math.round((buffered / video.duration) * 92))
      );
    };
    const onReady = () => finishNoEarlierThan(MIN_VISIBLE_MS);

    if (video) {
      video.addEventListener("progress", onProgress);
      video.addEventListener("canplaythrough", onReady);
      video.addEventListener("error", onReady);
      onProgress();
      if (video.readyState >= 3) onReady();
    } else {
      finishNoEarlierThan(MIN_VISIBLE_MS);
    }

    // Perceived-progress trickle — eases toward 90% so the bar is always
    // visibly moving even before the video reports real buffered data.
    const trickle = setInterval(() => {
      setProgress((p) => (p < 90 ? p + (90 - p) * 0.06 : p));
    }, 180);

    const maxTimer = setTimeout(finish, MAX_WAIT_MS);

    return () => {
      clearInterval(trickle);
      clearTimeout(maxTimer);
      if (video) {
        video.removeEventListener("progress", onProgress);
        video.removeEventListener("canplaythrough", onReady);
        video.removeEventListener("error", onReady);
      }
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-bg"
    >
      <div className="flex items-center gap-3">
        <Logo className="h-6 w-6 text-accent" />
        <span className="font-display text-lg tracking-tight">
          PEPT<span className="text-accent">.</span>LAB
        </span>
      </div>
      <div className="h-px w-48 overflow-hidden bg-line">
        <div
          className="h-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <span className="font-mono text-[11px] tabular-nums text-fg-muted">
        {Math.min(Math.round(progress), 100)}%
      </span>
    </div>
  );
}
