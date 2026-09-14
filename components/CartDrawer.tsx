"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/peptides";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } =
    useCart();

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-line bg-bg-elevated transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-lg">Warenkorb</h2>
          <button
            onClick={closeCart}
            className="font-mono text-xl text-fg-muted transition-colors hover:text-fg"
            aria-label="Schließen"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center font-mono text-xs uppercase tracking-widest text-fg-muted">
              Dein Warenkorb ist leer
            </p>
          ) : (
            <ul className="flex flex-col gap-5">
              {items.map((item) => (
                <li key={item.slug} className="flex gap-3 border-b border-line pb-5">
                  <Link
                    href={`/peptide/${item.slug}`}
                    onClick={closeCart}
                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line"
                  >
                    <Image
                      src={`/images/peptides/${item.slug}.png`}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-1">
                    <Link
                      href={`/peptide/${item.slug}`}
                      onClick={closeCart}
                      className="font-display text-sm hover:text-accent"
                    >
                      {item.name}
                    </Link>
                    <span className="font-mono text-[11px] text-fg-muted">
                      Vial {item.vial}
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                        className="h-6 w-6 rounded-full border border-line font-mono text-xs hover:border-accent-dim"
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-mono text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                        className="h-6 w-6 rounded-full border border-line font-mono text-xs hover:border-accent-dim"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="font-mono text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.slug)}
                      className="font-mono text-[10px] uppercase tracking-widest text-fg-muted hover:text-accent-warm"
                    >
                      Entfernen
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-line px-6 py-5">
          <div className="mb-4 flex items-center justify-between font-mono text-sm">
            <span className="text-fg-muted">Zwischensumme</span>
            <span className="text-base">{formatPrice(totalPrice)}</span>
          </div>
          <Link
            href="/warenkorb"
            onClick={closeCart}
            className={`block w-full rounded-full bg-accent py-3 text-center font-mono text-xs uppercase tracking-widest text-bg transition-opacity ${
              items.length === 0 ? "pointer-events-none opacity-40" : "hover:opacity-90"
            }`}
          >
            Zur Kasse
          </Link>
          <p className="mt-3 text-center font-mono text-[10px] leading-relaxed text-fg-muted">
            Nur für Forschungszwecke. Nicht für den menschlichen Verzehr.
          </p>
        </div>
      </aside>
    </>
  );
}
