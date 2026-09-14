const steps = [
  {
    label: "Bausteine",
    text: "Es gibt 20 natürliche Aminosäuren — kleine, exakt definierte Moleküle. Wie Buchstaben eines Alphabets lassen sie sich in praktisch unendlicher Reihenfolge kombinieren.",
  },
  {
    label: "Sequenz",
    text: "Über Peptidbindungen verknüpft entsteht eine Kette. Ein Peptid ist genau das: eine kurze Aminosäurekette, deren Abfolge bestimmt, wie sie sich im Raum faltet.",
  },
  {
    label: "Funktion",
    text: "Diese Faltung entscheidet über die biologische Funktion. Eine einzige veränderte Aminosäure kann eine völlig andere Wirkung ergeben — deshalb unterscheiden sich unsere 24 Peptide trotz gemeinsamer chemischer Basis grundlegend.",
  },
];

export default function AminoAcidExplainer() {
  return (
    <section className="relative border-y border-line px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
          Grundlagen
        </span>
        <h2 className="font-display mt-3 max-w-2xl text-3xl sm:text-4xl">
          Erst die Aminosäure.{" "}
          <span className="text-accent">Dann die Funktion.</span>
        </h2>
        <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-fg-muted sm:text-base">
          Aminosäuren sind die molekularen Bausteine des Lebens. Wer versteht,
          wie aus ihnen ein Peptid entsteht, versteht auch, warum 24
          scheinbar ähnliche Moleküle völlig unterschiedliche
          Forschungsfelder abdecken.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.label} className="border-t border-line pt-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg">{step.label}</span>
              </div>
              <p className="mt-3 font-sans text-sm leading-relaxed text-fg-muted">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
