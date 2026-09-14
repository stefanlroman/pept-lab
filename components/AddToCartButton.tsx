"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Peptide } from "@/lib/peptides";

export default function AddToCartButton({ peptide }: { peptide: Peptide }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="font-sans text-sm text-fg-muted">Menge</span>
        <div className="flex items-center gap-3 rounded-full border border-line px-3 py-1.5">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="font-mono text-sm text-fg-muted hover:text-fg"
            aria-label="Menge verringern"
          >
            −
          </button>
          <span className="w-4 text-center font-mono text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="font-mono text-sm text-fg-muted hover:text-fg"
            aria-label="Menge erhöhen"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          addItem(peptide, quantity);
          setJustAdded(true);
          setTimeout(() => setJustAdded(false), 1600);
        }}
        className="rounded-full bg-accent px-8 py-3.5 font-sans text-sm font-medium text-bg transition-opacity hover:opacity-90"
      >
        {justAdded ? "Hinzugefügt ✓" : "In den Warenkorb"}
      </button>
    </div>
  );
}
