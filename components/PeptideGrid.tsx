"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { peptides, categories, Category } from "@/lib/peptides";
import PeptideTile from "./PeptideTile";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PeptideGrid() {
  const [active, setActive] = useState<Category | "Alle">("Alle");
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered =
    active === "Alle" ? peptides : peptides.filter((p) => p.category === active);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tiles = gridRef.current?.querySelectorAll(".peptide-tile");
      if (!tiles) return;
      gsap.fromTo(
        tiles,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: { each: 0.045, grid: "auto", from: "start" },
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [active]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const handleMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        ".peptide-tile"
      ) as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--x", `${e.clientX - rect.left}px`);
      target.style.setProperty("--y", `${e.clientY - rect.top}px`);
    };
    grid.addEventListener("mousemove", handleMove);
    return () => grid.removeEventListener("mousemove", handleMove);
  }, [active]);

  return (
    <section id="katalog" className="relative px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
              Katalog
            </span>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl">
              24 Peptide, 7 Kategorien
            </h2>
          </div>
          <span className="font-mono text-xs text-fg-muted">
            {filtered.length.toString().padStart(2, "0")} / 24 angezeigt
          </span>
        </div>

        <div className="mb-12 flex flex-wrap gap-2">
          <FilterPill
            label="Alle"
            active={active === "Alle"}
            onClick={() => setActive("Alle")}
          />
          {categories.map((c) => (
            <FilterPill
              key={c.id}
              label={c.label}
              active={active === c.id}
              onClick={() => setActive(c.id)}
            />
          ))}
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((peptide, i) => (
            <PeptideTile key={peptide.slug} peptide={peptide} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
        active
          ? "border-accent bg-accent text-bg"
          : "border-line text-fg-muted hover:border-accent-dim hover:text-fg"
      }`}
    >
      {label}
    </button>
  );
}
