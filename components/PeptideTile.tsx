import Link from "next/link";
import Image from "next/image";
import { Peptide, formatPrice, categoryColors } from "@/lib/peptides";
import { basePath } from "@/lib/basePath";

const badgeColor: Record<string, string> = {
  Bestseller: "text-accent border-accent-dim",
  Neu: "text-accent-warm border-accent-warm/40",
  Limitiert: "text-fg border-fg/30",
};

export default function PeptideTile({
  peptide,
  index,
}: {
  peptide: Peptide;
  index: number;
}) {
  return (
    <Link
      href={`/peptide/${peptide.slug}`}
      className="peptide-tile tile-border group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-2xl bg-bg-elevated/40 sm:min-h-[300px]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={`${basePath}/images/peptides/${peptide.slug}.png`}
          alt={`${peptide.name} — ${peptide.tagline}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated via-bg-elevated/10 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="font-mono text-[11px] text-fg-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          {peptide.badge && (
            <span
              className={`rounded-full border bg-bg/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest backdrop-blur-sm ${
                badgeColor[peptide.badge]
              }`}
            >
              {peptide.badge}
            </span>
          )}
        </div>
      </div>

      <div className="relative px-5 pb-5 sm:px-6 sm:pb-6">
        <h3 className="font-display text-xl leading-tight transition-colors group-hover:text-accent sm:text-2xl">
          {peptide.name}
        </h3>
        <p
          className="mt-2 font-sans text-sm"
          style={{ color: categoryColors[peptide.category] }}
        >
          {peptide.tagline}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <span className="font-mono text-[11px] text-fg-muted">
            {peptide.vial}
          </span>
          <span className="font-mono text-sm text-fg">
            {formatPrice(peptide.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
