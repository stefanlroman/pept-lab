import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  peptides,
  getPeptideBySlug,
  getRelatedPeptides,
  categories,
  categoryColors,
  formatPrice,
} from "@/lib/peptides";
import AddToCartButton from "@/components/AddToCartButton";
import PeptideTile from "@/components/PeptideTile";
import { basePath } from "@/lib/basePath";

export function generateStaticParams() {
  return peptides.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const peptide = getPeptideBySlug(slug);
  if (!peptide) return {};
  return {
    title: `${peptide.name} — PEPT.LAB`,
    description: peptide.description,
  };
}

export default async function PeptidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const peptide = getPeptideBySlug(slug);
  if (!peptide) notFound();

  const related = getRelatedPeptides(peptide);
  const categoryLabel = categories.find((c) => c.id === peptide.category)?.label;

  return (
    <div className="px-6 pb-24 pt-32 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/#katalog"
          className="font-sans text-sm text-fg-muted hover:text-accent"
        >
          ← Zurück zum Katalog
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="relative mb-8 aspect-square w-full overflow-hidden rounded-2xl border border-line sm:aspect-[4/3]">
              <Image
                src={`${basePath}/images/peptides/${peptide.slug}.png`}
                alt={`${peptide.name} — ${peptide.tagline}`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            </div>

            <span
              className="font-sans text-sm font-medium"
              style={{ color: categoryColors[peptide.category] }}
            >
              {categoryLabel}
            </span>
            <h1 className="font-display mt-3 text-4xl sm:text-5xl">
              {peptide.name}
            </h1>
            {peptide.aliases && (
              <p className="mt-2 font-sans text-sm text-fg-muted">
                {peptide.aliases}
              </p>
            )}
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-fg-muted">
              {peptide.description}
            </p>

            <div className="mt-10">
              <span className="font-sans text-sm text-fg-muted">
                Forschungsschwerpunkte
              </span>
              <ul className="mt-4 flex flex-col gap-3">
                {peptide.effects.map((effect, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 border-t border-line pt-3 font-sans text-sm text-fg"
                  >
                    <span className="mt-1 font-mono text-xs text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {effect}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="h-fit rounded-2xl border border-line bg-bg-elevated/40 p-6 sm:p-8">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-3xl">
                {formatPrice(peptide.price)}
              </span>
              <span className="font-mono text-xs text-fg-muted">
                {peptide.vial} / Vial
              </span>
            </div>
            <p className="mt-2 font-mono text-[11px] text-fg-muted">
              HPLC-verifizierte Reinheit ≥ 98 %
            </p>
            <p className="mt-1 font-mono text-[11px] text-fg-muted">
              Darreichungsform: {peptide.form}
            </p>

            <div className="mt-6">
              <AddToCartButton peptide={peptide} />
            </div>

            <p className="mt-6 border-t border-line pt-5 font-sans text-xs leading-relaxed text-fg-muted">
              Ausschließlich für Forschungs- und Laborzwecke. Kein
              Arzneimittel. Nicht für den menschlichen oder tierischen
              Verzehr bestimmt. Verkauf nur an gewerbliche und
              wissenschaftliche Abnehmer.
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display mb-6 text-2xl">Verwandte Peptide</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((p, i) => (
                <PeptideTile key={p.slug} peptide={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
