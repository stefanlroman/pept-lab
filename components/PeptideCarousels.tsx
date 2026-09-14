"use client";

import { useRef } from "react";
import { peptides, categories, categoryColors, Category } from "@/lib/peptides";
import PeptideTile from "./PeptideTile";

const CARD_WIDTH = 300; // px, keep in sync with the card wrapper below

function CategoryRow({ categoryId, label }: { categoryId: Category; label: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const items = peptides.filter((p) => p.category === categoryId);
  const accent = categoryColors[categoryId];

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({
      left: dir * (CARD_WIDTH + 16) * 2,
      behavior: "smooth",
    });
  };

  // Plain click-drag on desktop — touch already scrolls natively, but a
  // mouse has no built-in way to "swipe" a horizontal row.
  const drag = useRef<{ startX: number; startScroll: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { startX: e.clientX, startScroll: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !scrollerRef.current) return;
    scrollerRef.current.scrollLeft =
      drag.current.startScroll - (e.clientX - drag.current.startX);
  };
  const endDrag = () => {
    drag.current = null;
  };

  return (
    <div className="mb-14">
      <div className="mb-5 flex items-end justify-between px-6 sm:px-10">
        <div>
          <span
            className="font-mono text-[11px] uppercase tracking-widest"
            style={{ color: accent }}
          >
            {label}
          </span>
          <h3 className="font-display mt-1 text-2xl sm:text-3xl">
            {items.length} {items.length === 1 ? "Peptid" : "Peptide"}
          </h3>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Zurück"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-accent-dim"
          >
            ←
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Weiter"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-accent-dim"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 cursor-grab active:cursor-grabbing sm:px-10"
      >
        {items.map((peptide) => (
          <div
            key={peptide.slug}
            style={{ width: CARD_WIDTH }}
            className="shrink-0 snap-start"
          >
            <PeptideTile peptide={peptide} index={peptide.id - 1} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PeptideCarousels() {
  return (
    <section id="katalog" className="relative py-24">
      <div className="mb-12 px-6 sm:px-10">
        <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
          Katalog
        </span>
        <h2 className="font-display mt-2 max-w-xl text-3xl sm:text-4xl">
          24 Peptide, nach Anwendung sortiert
        </h2>
        <p className="mt-3 max-w-md font-sans text-sm text-fg-muted">
          Sieben Forschungsfelder, jeweils zum Durchscrollen — zieh eine
          Reihe zur Seite oder nutze die Pfeile.
        </p>
      </div>

      {categories.map((c) => (
        <CategoryRow key={c.id} categoryId={c.id} label={c.label} />
      ))}
    </section>
  );
}
