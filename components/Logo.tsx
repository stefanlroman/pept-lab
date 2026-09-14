// A tiny three-node peptide chain as the mark — the same "beads on a
// backbone" motif as the 3D chain and the product imagery, just distilled
// down to something legible at 20–28px in a nav bar.
export default function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <line
        x1="6.5"
        y1="20"
        x2="14"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <line
        x1="14"
        y1="14"
        x2="21.5"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="6.5" cy="20" r="2.75" fill="currentColor" opacity="0.55" />
      <circle cx="21.5" cy="8" r="3" fill="currentColor" opacity="0.8" />
      <circle cx="14" cy="14" r="3.75" fill="currentColor" />
    </svg>
  );
}
