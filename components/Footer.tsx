import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line px-6 py-16 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-xl">
            PEPT<span className="text-accent">.</span>LAB
          </p>
          <p className="mt-3 font-mono text-xs leading-relaxed text-fg-muted">
            Forschungspeptide für Labore, Institute und wissenschaftliche
            Anwender. Ausschließlich für In-vitro- und präklinische
            Forschungszwecke – nicht für den menschlichen oder tierischen
            Verzehr bestimmt.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-fg-muted">
              Shop
            </p>
            <ul className="flex flex-col gap-2 font-mono text-xs">
              <li>
                <Link href="/#katalog" className="hover:text-accent">
                  Katalog
                </Link>
              </li>
              <li>
                <Link href="/warenkorb" className="hover:text-accent">
                  Warenkorb
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-accent">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-fg-muted">
              Rechtliches
            </p>
            <ul className="flex flex-col gap-2 font-mono text-xs">
              <li>
                <Link href="/disclaimer" className="hover:text-accent">
                  Forschungshinweis
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="hover:text-accent">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-accent">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="hover:text-accent">
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-14 max-w-6xl font-mono text-[10px] text-fg-muted">
        © {new Date().getFullYear()} PEPT.LAB — Alle Produkte ausschließlich
        für Forschungszwecke.
      </p>
    </footer>
  );
}
