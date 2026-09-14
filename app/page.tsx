import Hero from "@/components/Hero";
import AminoAcidExplainer from "@/components/AminoAcidExplainer";
import PeptideCarousels from "@/components/PeptideCarousels";
import PeptideChainSection from "@/components/chain/PeptideChainSection";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Hero />
      <AminoAcidExplainer />
      <PeptideChainSection />
      <PeptideCarousels />

      <section className="relative border-t border-line px-6 py-24 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 rounded-2xl border border-line bg-bg-elevated/40 p-8 sm:flex-row sm:items-center sm:p-12">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
              Forschungshinweis
            </span>
            <h2 className="font-display mt-3 max-w-lg text-2xl sm:text-3xl">
              Alle Produkte sind ausschließlich für den Laborgebrauch bestimmt.
            </h2>
            <p className="mt-3 max-w-lg font-sans text-sm text-fg-muted">
              Nicht für den menschlichen oder tierischen Verzehr. Kein
              Arzneimittel, kein Nahrungsergänzungsmittel. Der Verkauf erfolgt
              ausschließlich an Institute, Labore und wissenschaftliche
              Einrichtungen.
            </p>
          </div>
          <Link
            href="/disclaimer"
            className="shrink-0 rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
          >
            Mehr erfahren →
          </Link>
        </div>
      </section>
    </>
  );
}
