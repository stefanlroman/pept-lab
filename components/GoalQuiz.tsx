"use client";

import { useMemo, useState } from "react";
import { peptides, categories, categoryColors, Category } from "@/lib/peptides";
import PeptideTile from "./PeptideTile";

export default function GoalQuiz() {
  const [selected, setSelected] = useState<Category[]>([]);

  const toggle = (id: Category) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const matches = useMemo(
    () =>
      selected.length
        ? peptides.filter((p) => selected.includes(p.category)).slice(0, 6)
        : [],
    [selected]
  );

  return (
    <section className="relative border-y border-line px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display max-w-xl text-3xl sm:text-4xl">
          Worauf legst du bei deiner Forschung Wert?
        </h2>
        <p className="mt-3 max-w-md font-sans text-sm text-fg-muted">
          Wähle ein oder mehrere Forschungsfelder — wir zeigen dir passende
          Peptide aus dem Katalog.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((c) => {
            const active = selected.includes(c.id);
            const accent = categoryColors[c.id];
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                aria-pressed={active}
                className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border p-5 text-left transition-colors"
                style={{
                  borderColor: active ? accent : "var(--color-line)",
                  backgroundColor: active ? `${accent}14` : "transparent",
                }}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full transition-transform group-hover:scale-125"
                  style={{
                    backgroundColor: accent,
                    boxShadow: active ? `0 0 12px ${accent}` : "none",
                  }}
                />
                <span className="font-sans text-sm leading-snug text-fg">
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-14">
          {matches.length === 0 ? (
            <p className="font-sans text-sm text-fg-muted">
              {selected.length === 0
                ? "Noch keine Auswahl — tippe auf ein Feld oben."
                : "Keine passenden Peptide gefunden."}
            </p>
          ) : (
            <>
              <div className="mb-5 flex items-end justify-between">
                <span className="font-sans text-sm text-fg-muted">
                  {matches.length} passende{" "}
                  {matches.length === 1 ? "Peptid" : "Peptide"}
                </span>
                <a
                  href="#katalog"
                  className="font-sans text-sm text-accent hover:underline"
                >
                  Ganzer Katalog
                </a>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {matches.map((p, i) => (
                  <PeptideTile key={p.slug} peptide={p} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
