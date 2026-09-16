"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { basePath } from "@/lib/basePath";
import { categories, categoryColors } from "@/lib/peptides";
import { Button } from "@/components/ui/button";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import FigureErrorBoundary from "@/components/hero3d/FigureErrorBoundary";

const HeroFigureCanvas = dynamic(
  () => import("@/components/hero3d/HeroFigureCanvas"),
  { ssr: false }
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [enable3d, setEnable3d] = useState(false);

  useEffect(() => {
    let hasWebgl = false;
    try {
      const probe = document.createElement("canvas");
      hasWebgl = !!(probe.getContext("webgl2") || probe.getContext("webgl"));
    } catch {
      hasWebgl = false;
    }
    setEnable3d(hasWebgl);
  }, []);

  // The figure turns as the hero scrolls past — progress 0 at the top of
  // the viewport, 1 once the section has scrolled fully out of view, no
  // pin involved (the page keeps scrolling normally underneath it).
  useEffect(() => {
    if (!enable3d || !visualRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: visualRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, [enable3d]);

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
          ".hero-sub, .hero-meta, .hero-cta",
          { opacity: 0, y: 16, duration: 0.8, stagger: 0.08, ease: "power3.out" },
          "-=0.6"
        );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="overflow-x-hidden">
      <section className="relative">
        <div className="px-6 py-24 sm:px-10 md:pb-32 lg:pb-36 lg:pt-40">
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col">
            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
              <div className="hero-meta relative mb-6 flex items-center justify-center gap-3 font-sans text-sm text-fg-muted lg:justify-start">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
                24 Forschungspeptide in Laborqualität, jedes ≥ 98 % Reinheit
              </div>

              <h1 className="font-display relative max-w-3xl text-5xl font-medium leading-[0.95] tracking-tight sm:text-6xl xl:text-7xl">
                <span className="hero-line block overflow-hidden">
                  <span className="inline-block">Die Bausteine</span>
                </span>
                <span className="hero-line block overflow-hidden">
                  <span className="inline-block">des Lebens.</span>
                </span>
              </h1>

              <p className="hero-sub relative mx-auto mt-8 max-w-md font-sans text-base leading-relaxed text-fg-muted lg:mx-0">
                Kuratiertes Sortiment synthetischer Peptide für Labore und
                wissenschaftliche Anwender — von Geweberegeneration bis
                Kognition. Klicke dich durch den Katalog wie durch ein
                Archiv.
              </p>

              <div className="hero-cta relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Button asChild size="lg" className="h-12 rounded-full px-7 text-base">
                  <Link href="#kette">Start</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-12 rounded-full px-7 text-base"
                >
                  <Link href="#katalog">Katalog ansehen</Link>
                </Button>
              </div>
            </div>
          </div>

          <div
            ref={visualRef}
            className="absolute inset-1 -z-10 overflow-hidden rounded-3xl border border-line"
          >
            <video
              className="size-full object-cover opacity-40"
              src={`${basePath}/videos/hero-assembly.mp4`}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
            {enable3d && (
              <FigureErrorBoundary>
                <div className="absolute inset-0">
                  <HeroFigureCanvas progressRef={progressRef} />
                </div>
              </FigureErrorBoundary>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
          </div>
        </div>
      </section>

      <section className="bg-bg pb-16">
        <div className="group relative mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="shrink-0 md:max-w-52 md:border-r md:border-line md:pr-6">
              <p className="text-center font-sans text-sm text-fg-muted md:text-right">
                Sortiert nach Forschungsfeld
              </p>
            </div>
            <div className="relative w-full py-2 md:w-[calc(100%-13rem)]">
              <InfiniteSlider duration={30} durationOnHover={60} gap={32}>
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 whitespace-nowrap font-sans text-sm text-fg-muted"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: categoryColors[c.id] }}
                    />
                    {c.label}
                  </div>
                ))}
              </InfiniteSlider>

              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent" />
              <ProgressiveBlur
                className="pointer-events-none absolute left-0 top-0 h-full w-16"
                direction="left"
                blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute right-0 top-0 h-full w-16"
                direction="right"
                blurIntensity={1}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
