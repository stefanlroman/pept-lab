"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { basePath } from "@/lib/basePath";

const words = ["REGENERATION", "STOFFWECHSEL", "LANGLEBIGKEIT", "KOGNITION"];

// A tiny inline double-helix, used as the marquee separator instead of a
// plain bullet — one full twist plus three rungs, sized to sit on the
// text baseline.
function DnaSeparator() {
  return (
    <svg
      viewBox="0 0 20 14"
      className="h-3.5 w-5 shrink-0 text-accent"
      aria-hidden="true"
    >
      <path
        d="M1.5 1.5C1.5 7 18.5 7 18.5 12.5"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M1.5 12.5C1.5 7 18.5 7 18.5 1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        opacity="0.45"
      />
      <line x1="4.6" y1="3.6" x2="4.6" y2="5.1" stroke="currentColor" strokeWidth="1" />
      <line x1="10" y1="6.3" x2="10" y2="7.7" stroke="currentColor" strokeWidth="1" />
      <line x1="15.4" y1="8.9" x2="15.4" y2="10.4" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-line span", { yPercent: 110 });
      gsap
        .timeline({ delay: 0.2 })
        .to(".hero-line span", {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.06,
        })
        .from(
          ".hero-sub, .hero-meta, .hero-scroll",
          { opacity: 0, y: 16, duration: 0.8, stagger: 0.08, ease: "power3.out" },
          "-=0.6"
        );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden px-6 pt-28 sm:px-10"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        src={`${basePath}/videos/hero-assembly.mp4`}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/70 to-bg" />

      <div className="hero-meta relative mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-fg-muted">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
        24 Forschungspeptide · Laborqualität ≥ 98 % Reinheit
      </div>

      <h1 className="font-display relative max-w-4xl text-[13vw] font-medium leading-[0.92] tracking-tight sm:text-[7.5vw]">
        <span className="hero-line block overflow-hidden">
          <span className="inline-block">Die</span>
        </span>
        <span className="hero-line block overflow-hidden">
          <span className="inline-block text-accent">Bausteine</span>
        </span>
        <span className="hero-line block overflow-hidden">
          <span className="inline-block">des Lebens.</span>
        </span>
      </h1>

      <p className="hero-sub relative mt-8 max-w-md font-sans text-sm leading-relaxed text-fg-muted sm:text-base">
        Kuratiertes Sortiment synthetischer Peptide für Labore und
        wissenschaftliche Anwender — von Geweberegeneration bis Kognition.
        Klicke dich durch den Katalog wie durch ein Archiv.
      </p>

      <div className="hero-scroll relative mt-16 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest text-fg-muted">
        <span>Katalog erkunden</span>
        <span className="h-px w-10 bg-line" />
        <span>↓</span>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 w-full overflow-hidden border-t border-line py-3">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-fg-muted">
          {[...words, ...words, ...words].map((w, i) => (
            <span key={i} className="flex items-center gap-10">
              {w} <DnaSeparator />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
