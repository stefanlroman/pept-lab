"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { peptides, categories, categoryColors } from "@/lib/peptides";
import ChainErrorBoundary from "./ChainErrorBoundary";

const PeptideChainCanvas = dynamic(() => import("./PeptideChainCanvas"), {
  ssr: false,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PeptideChainSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [enable3d, setEnable3d] = useState(false);
  const [lite, setLite] = useState(false);
  const [noWebgl, setNoWebgl] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Some privacy-hardened browsers (Brave's "aggressive" fingerprinting
    // protection is the common one) make WebGL context creation fail on
    // purpose, since a GPU's exact capabilities are a fingerprinting
    // vector. Feature-detect for real rather than assuming a phone-class
    // device can always render this — a silent blank section is worse
    // than telling the visitor why it's off.
    let hasWebgl = false;
    try {
      const probe = document.createElement("canvas");
      hasWebgl = !!(
        probe.getContext("webgl2") || probe.getContext("webgl")
      );
    } catch {
      hasWebgl = false;
    }

    // WebGL runs on phones too — only bail out for reduced-motion or a
    // missing/blocked WebGL context. Below ~768px we still render the
    // scene, just with fewer particles/polys and lighter post-processing
    // (see PeptideChainCanvas), since a real phone GPU is a very
    // different budget than a resized desktop window.
    setEnable3d(!reduceMotion && hasWebgl);
    setNoWebgl(!hasWebgl);
    setLite(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (!enable3d || !wrapperRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        const idx = Math.round(self.progress * (peptides.length - 1));
        setActiveIndex((prev) => (prev === idx ? prev : idx));
      },
    });
    return () => trigger.kill();
  }, [enable3d]);

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    );
  }, [activeIndex]);

  const active = peptides[activeIndex];
  const categoryLabel = categories.find((c) => c.id === active.category)?.label;
  const accent = categoryColors[active.category];

  if (!enable3d) {
    return (
      <section className="relative border-y border-line px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
            Die Peptidkette
          </span>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl">
            24 Aminosäureketten, eine durchgehende Struktur
          </h2>
          <p className="mt-4 font-sans text-sm text-fg-muted">
            {noWebgl
              ? "Die animierte 3D-Ansicht ist in diesem Browser deaktiviert — meist blockiert ein Privatsphäre-/Fingerprinting-Schutz (z. B. Brave Shields) WebGL. Der restliche Katalog funktioniert unabhängig davon ganz normal."
              : "Deine Systemeinstellungen bevorzugen reduzierte Bewegung — die animierte 3D-Peptidkette bleibt hier deshalb aus."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapperRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-bg">
        <ChainErrorBoundary>
          <PeptideChainCanvas
            progressRef={progressRef}
            activeIndex={activeIndex}
            lite={lite}
          />
        </ChainErrorBoundary>

        {/* vignette so the HTML chrome stays legible over the scene */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_100%,rgba(6,7,10,0.75),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg/70 to-transparent" />

        <div className="pointer-events-none absolute left-6 top-8 font-mono text-[11px] uppercase tracking-widest text-fg-muted sm:left-10">
          Die Peptidkette
        </div>
        <div className="pointer-events-none absolute right-6 top-8 font-mono text-[11px] uppercase tracking-widest text-fg-muted sm:right-10">
          {String(activeIndex + 1).padStart(2, "0")} / {peptides.length}
        </div>

        <Link
          href={`/peptide/${active.slug}`}
          className="group absolute bottom-24 left-6 max-w-[calc(100vw-3rem)] rounded-2xl border border-line bg-bg/60 p-5 backdrop-blur-md transition-colors hover:border-[var(--accent-live)] sm:bottom-16 sm:left-10 sm:max-w-xs sm:p-6"
          style={{ "--accent-live": accent } as CSSProperties}
        >
          <div ref={panelRef}>
            <span
              className="font-mono text-[11px] uppercase tracking-widest transition-colors duration-300"
              style={{ color: accent }}
            >
              {categoryLabel}
            </span>
            <h3 className="font-display mt-2 text-3xl text-fg sm:text-4xl">
              {active.name}
            </h3>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-fg-muted">
              {active.tagline}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-fg-muted transition-colors group-hover:text-fg">
              Zum Peptid →
            </span>
          </div>
        </Link>

        <div className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {peptides.map((p, i) => (
            <span
              key={p.slug}
              className="h-1 w-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  i === activeIndex ? categoryColors[p.category] : "#1e2128",
                transform: i === activeIndex ? "scale(2.4)" : "scale(1)",
              }}
            />
          ))}
        </div>

        {activeIndex === 0 && (
          <div className="pointer-events-none absolute bottom-8 right-6 font-mono text-[11px] uppercase tracking-widest text-fg-muted opacity-80 sm:right-10">
            Scroll ↓
          </div>
        )}
      </div>
    </section>
  );
}
