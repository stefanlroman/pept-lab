export const metadata = { title: "Forschungshinweis — PEPT.LAB" };

export default function DisclaimerPage() {
  return (
    <div className="px-6 pb-24 pt-32 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
          Wichtiger Hinweis
        </span>
        <h1 className="font-display mt-3 text-4xl">Forschungshinweis</h1>

        <div className="mt-8 flex flex-col gap-6 font-sans text-sm leading-relaxed text-fg-muted">
          <p>
            Alle auf dieser Website angebotenen Peptide sind{" "}
            <strong className="text-fg">
              ausschließlich für Labor- und Forschungszwecke
            </strong>{" "}
            bestimmt. Sie sind keine Arzneimittel, keine
            Nahrungsergänzungsmittel und keine Kosmetikprodukte im Sinne der
            jeweils geltenden Gesetze.
          </p>
          <p>
            Die Produkte sind{" "}
            <strong className="text-fg">
              nicht für den menschlichen oder tierischen Verzehr, die
              Anwendung am Menschen oder Tier
            </strong>{" "}
            bestimmt. Ein Verkauf erfolgt ausschließlich an Käufer, die die
            Produkte im Rahmen wissenschaftlicher, präklinischer oder
            analytischer Forschung in dafür vorgesehenen Einrichtungen
            einsetzen.
          </p>
          <p>
            Die auf den Produktseiten dargestellten Informationen fassen
            veröffentlichte Forschungsergebnisse zusammen und stellen keine
            Wirkversprechen, keine Heilaussagen und keine medizinische
            Beratung dar. Sie ersetzen keine ärztliche oder wissenschaftliche
            Fachberatung.
          </p>
          <p>
            Mit dem Kauf bestätigt der Käufer, volljährig zu sein, die
            Produkte im Einklang mit den in seinem Land geltenden Gesetzen zu
            verwenden und die alleinige Verantwortung für die
            bestimmungsgemäße Verwendung zu tragen.
          </p>
        </div>
      </div>
    </div>
  );
}
