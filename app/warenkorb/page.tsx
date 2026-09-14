"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/peptides";

export default function WarenkorbPage() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", organisation: "" });

  const shipping = items.length > 0 ? 6.9 : 0;
  const grandTotal = totalPrice + shipping;

  if (placed) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center px-6 pt-24 text-center">
        <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
          Anfrage übermittelt
        </span>
        <h1 className="font-display mt-4 max-w-lg text-3xl sm:text-4xl">
          Danke, {form.name.split(" ")[0] || "für deine Bestellung"}.
        </h1>
        <p className="mt-4 max-w-md font-sans text-sm text-fg-muted">
          Dies ist eine Demo-Bestellstrecke ohne echte Zahlungsabwicklung. In
          einer produktiven Version würde hier eine Zahlungs- und
          Versandbestätigung folgen.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-accent hover:text-accent"
        >
          Zurück zum Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 pb-24 pt-32 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
          Checkout
        </span>
        <h1 className="font-display mt-3 text-4xl">Warenkorb</h1>

        {items.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-line bg-bg-elevated/40 p-10 text-center">
            <p className="font-mono text-sm text-fg-muted">
              Dein Warenkorb ist leer.
            </p>
            <Link
              href="/#katalog"
              className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-bg hover:opacity-90"
            >
              Katalog durchsuchen
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li
                    key={item.slug}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line p-4"
                  >
                    <div>
                      <Link
                        href={`/peptide/${item.slug}`}
                        className="font-display text-lg hover:text-accent"
                      >
                        {item.name}
                      </Link>
                      <p className="font-mono text-[11px] text-fg-muted">
                        Vial {item.vial} · {formatPrice(item.price)} / Stk.
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 rounded-full border border-line px-2 py-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.slug, item.quantity - 1)
                          }
                          className="font-mono text-sm text-fg-muted hover:text-fg"
                        >
                          −
                        </button>
                        <span className="w-4 text-center font-mono text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.slug, item.quantity + 1)
                          }
                          className="font-mono text-sm text-fg-muted hover:text-fg"
                        >
                          +
                        </button>
                      </div>
                      <span className="w-20 text-right font-mono text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.slug)}
                        className="font-mono text-xs text-fg-muted hover:text-accent-warm"
                        aria-label="Entfernen"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={clearCart}
                className="mt-4 font-mono text-[11px] uppercase tracking-widest text-fg-muted hover:text-accent-warm"
              >
                Warenkorb leeren
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPlaced(true);
              }}
              className="h-fit rounded-2xl border border-line bg-bg-elevated/40 p-6 sm:p-8"
            >
              <h2 className="font-display text-xl">Bestellübersicht</h2>
              <div className="mt-4 flex flex-col gap-2 border-b border-line pb-4 font-mono text-sm">
                <div className="flex justify-between text-fg-muted">
                  <span>Zwischensumme</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-fg-muted">
                  <span>Versand</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
              </div>
              <div className="flex justify-between py-4 font-mono text-base">
                <span>Gesamt</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>

              <div className="flex flex-col gap-3">
                <input
                  required
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-lg border border-line bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-accent-dim"
                />
                <input
                  required
                  type="email"
                  placeholder="E-Mail"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-lg border border-line bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-accent-dim"
                />
                <input
                  placeholder="Institut / Organisation (optional)"
                  value={form.organisation}
                  onChange={(e) =>
                    setForm({ ...form, organisation: e.target.value })
                  }
                  className="rounded-lg border border-line bg-transparent px-4 py-3 font-sans text-sm outline-none focus:border-accent-dim"
                />
              </div>

              <label className="mt-4 flex items-start gap-2 font-mono text-[11px] leading-relaxed text-fg-muted">
                <input required type="checkbox" className="mt-0.5" />
                Ich bestätige, dass ich diese Produkte ausschließlich für
                Forschungszwecke erwerbe und nicht für den menschlichen oder
                tierischen Verzehr verwende.
              </label>

              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-accent py-3.5 font-mono text-xs uppercase tracking-widest text-bg hover:opacity-90"
              >
                Bestellung abschließen
              </button>
              <p className="mt-3 text-center font-mono text-[10px] text-fg-muted">
                Demo-Checkout ohne echte Zahlungsabwicklung.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
