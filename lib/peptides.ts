export type Category =
  | "Regeneration"
  | "Stoffwechsel"
  | "Wachstumshormon"
  | "Langlebigkeit"
  | "Immunsystem"
  | "Hormonell"
  | "Kognition";

export const categories: { id: Category; label: string }[] = [
  { id: "Regeneration", label: "Regeneration & Heilung" },
  { id: "Stoffwechsel", label: "Stoffwechsel & Gewicht" },
  { id: "Wachstumshormon", label: "Wachstumshormon-Sekretagoga" },
  { id: "Langlebigkeit", label: "Langlebigkeit & Zellgesundheit" },
  { id: "Immunsystem", label: "Immunsystem" },
  { id: "Hormonell", label: "Hormonell & Libido" },
  { id: "Kognition", label: "Kognition & Stimmung" },
];

export const categoryColors: Record<Category, string> = {
  Regeneration: "#79ffc7",
  Stoffwechsel: "#ff8a5c",
  Wachstumshormon: "#6fb8ff",
  Langlebigkeit: "#b28dff",
  Immunsystem: "#d4ff6a",
  Hormonell: "#ff6ab3",
  Kognition: "#9dfff0",
};

export interface Peptide {
  id: number;
  slug: string;
  name: string;
  aliases?: string;
  category: Category;
  tagline: string;
  effects: string[];
  description: string;
  vial: string;
  /** Physical shipped form — a packaging fact, not usage guidance. */
  form: string;
  price: number;
  badge?: "Bestseller" | "Neu" | "Limitiert";
}

export const peptides: Peptide[] = [
  {
    id: 1,
    slug: "bpc-157",
    name: "BPC-157",
    aliases: "Body Protection Compound",
    category: "Regeneration",
    tagline: "Gewebe- und Sehnenregeneration",
    effects: [
      "Wird in präklinischen Studien auf Wundheilungsprozesse untersucht",
      "Untersuchungsgegenstand für Sehnen- und Bandregeneration",
      "In Tiermodellen mit gastrointestinaler Schleimhautregeneration assoziiert",
    ],
    description:
      "BPC-157 ist ein synthetisches Peptidfragment, das von einem im Magensaft vorkommenden Protein abgeleitet ist. In der präklinischen Forschung ist es eines der meistuntersuchten Peptide im Bereich Gewebereparatur.",
    vial: "5 mg",
    form: "Lyophilisiertes Pulver",
    price: 39,
    badge: "Bestseller",
  },
  {
    id: 2,
    slug: "tb-500",
    name: "TB-500",
    aliases: "Thymosin Beta-4 Fragment",
    category: "Regeneration",
    tagline: "Zellmigration und Wundheilung",
    effects: [
      "Untersucht im Zusammenhang mit Zellmigration bei Gewebeschäden",
      "Gegenstand von Studien zur Reduktion von Entzündungsmarkern",
      "In der Forschung häufig in Kombination mit BPC-157 betrachtet",
    ],
    description:
      "TB-500 ist ein synthetisches Fragment des natürlich vorkommenden Proteins Thymosin Beta-4 und wird in der Grundlagenforschung zu Aktin-Regulierung und Zellbeweglichkeit eingesetzt.",
    vial: "5 mg",
    form: "Lyophilisiertes Pulver",
    price: 42,
    badge: "Bestseller",
  },
  {
    id: 3,
    slug: "ghk-cu",
    name: "GHK-Cu",
    aliases: "Kupfer-Tripeptid-1",
    category: "Regeneration",
    tagline: "Hautstruktur und Kollagensynthese",
    effects: [
      "Vielfach untersucht im Kontext von Kollagen- und Elastinsynthese",
      "Forschungsgegenstand der dermatologischen Wirkstoffentwicklung",
      "In Zellstudien mit antioxidativen Eigenschaften in Verbindung gebracht",
    ],
    description:
      "GHK-Cu ist ein natürlich im menschlichen Plasma vorkommender Kupferkomplex, dessen Konzentration mit dem Alter abnimmt. Es zählt zu den am längsten erforschten Peptiden der Hautforschung.",
    vial: "50 mg",
    form: "Lyophilisiertes Pulver",
    price: 35,
  },
  {
    id: 4,
    slug: "semaglutide",
    name: "Semaglutid",
    aliases: "GLP-1-Rezeptoragonist",
    category: "Stoffwechsel",
    tagline: "Appetitregulation und Glukosestoffwechsel",
    effects: [
      "GLP-1-Rezeptoragonist, umfassend in der Stoffwechselforschung untersucht",
      "Gegenstand klinischer Studien zu Appetitregulation und Sättigung",
      "Erforscht im Zusammenhang mit glykämischer Kontrolle",
    ],
    description:
      "Semaglutid ist ein langwirksamer GLP-1-Rezeptoragonist und eines der am intensivsten klinisch untersuchten Moleküle im Bereich Stoffwechselforschung.",
    vial: "5 mg",
    form: "Lyophilisiertes Pulver",
    price: 89,
    badge: "Bestseller",
  },
  {
    id: 5,
    slug: "tirzepatide",
    name: "Tirzepatid",
    aliases: "GIP/GLP-1 Dual-Agonist",
    category: "Stoffwechsel",
    tagline: "Dualer Inkretin-Mechanismus",
    effects: [
      "Dualer GIP- und GLP-1-Rezeptoragonist in aktiver klinischer Erforschung",
      "Untersuchungsgegenstand für Energiehomöostase",
      "Gegenstand vergleichender Stoffwechselstudien",
    ],
    description:
      "Tirzepatid kombiniert eine GIP- und GLP-1-Rezeptoraktivierung in einem Molekül und gilt als eines der derzeit meistdiskutierten Forschungspeptide im Stoffwechselbereich.",
    vial: "10 mg",
    form: "Lyophilisiertes Pulver",
    price: 109,
    badge: "Neu",
  },
  {
    id: 6,
    slug: "aod-9604",
    name: "AOD-9604",
    aliases: "hGH-Fragment 176-191",
    category: "Stoffwechsel",
    tagline: "Fettstoffwechsel-Fragment",
    effects: [
      "Fragment des Wachstumshormons ohne dessen metabolische Wirkbreite",
      "Untersucht im Kontext der Lipolyse-Forschung",
      "Gegenstand von Studien ohne Einfluss auf Blutzucker- oder IGF-1-Spiegel",
    ],
    description:
      "AOD-9604 ist ein modifiziertes Fragment des humanen Wachstumshormons, das gezielt den fettstoffwechselrelevanten Bereich des Moleküls isoliert.",
    vial: "5 mg",
    form: "Lyophilisiertes Pulver",
    price: 45,
  },
  {
    id: 7,
    slug: "ipamorelin",
    name: "Ipamorelin",
    category: "Wachstumshormon",
    tagline: "Selektiver GH-Sekretagogue",
    effects: [
      "Selektiver Ghrelin-Rezeptor-Agonist mit Fokus auf pulsatile GH-Freisetzung",
      "Gilt in der Forschung als vergleichsweise selektiv gegenüber anderen Sekretagoga",
      "Häufig in Kombinationsprotokollen mit CJC-1295 untersucht",
    ],
    description:
      "Ipamorelin gehört zur Klasse der Growth-Hormone-Releasing-Peptide (GHRP) und wird für seine im Vergleich zu älteren Sekretagoga hohe Rezeptorselektivität in der Forschung geschätzt.",
    vial: "5 mg",
    form: "Lyophilisiertes Pulver",
    price: 32,
    badge: "Bestseller",
  },
  {
    id: 8,
    slug: "cjc-1295-no-dac",
    name: "CJC-1295 ohne DAC",
    aliases: "Modified GRF 1-29",
    category: "Wachstumshormon",
    tagline: "Kurzwirksames GHRH-Analogon",
    effects: [
      "GHRH-Analogon mit kurzer Halbwertszeit für pulsatile Protokolle",
      "Häufiger Kombinationspartner in der Sekretagoga-Forschung",
      "Untersuchungsgegenstand für natürliche GH-Pulsdynamik",
    ],
    description:
      "CJC-1295 ohne DAC ist ein Analogon des growth-hormone-releasing hormone (GHRH) mit kurzer Wirkdauer, das die körpereigene, pulsatile Ausschüttungsdynamik nachbilden soll.",
    vial: "5 mg",
    form: "Lyophilisiertes Pulver",
    price: 34,
  },
  {
    id: 9,
    slug: "cjc-1295-dac",
    name: "CJC-1295 mit DAC",
    aliases: "Drug Affinity Complex",
    category: "Wachstumshormon",
    tagline: "Langwirksames GHRH-Analogon",
    effects: [
      "GHRH-Analogon mit verlängerter Halbwertszeit durch DAC-Bindung",
      "Untersucht für konstant erhöhte GH- und IGF-1-Basiswerte",
      "Gegenstand von Studien zu Dosierintervallen im Wochenrhythmus",
    ],
    description:
      "Durch die Anbindung eines Drug Affinity Complex (DAC) erreicht diese Variante von CJC-1295 eine deutlich verlängerte Halbwertszeit gegenüber der unmodifizierten Form.",
    vial: "2 mg",
    form: "Lyophilisiertes Pulver",
    price: 48,
  },
  {
    id: 10,
    slug: "sermorelin",
    name: "Sermorelin",
    category: "Wachstumshormon",
    tagline: "GHRH-Fragment 1-29",
    effects: [
      "Eines der am längsten erforschten GHRH-Fragmente",
      "Gegenstand historischer klinischer Studien zur GH-Achse",
      "Vergleichsreferenz für neuere Sekretagoga in der Forschung",
    ],
    description:
      "Sermorelin bildet die ersten 29 Aminosäuren des natürlichen GHRH ab und zählt zu den am gründlichsten dokumentierten Molekülen dieser Peptidklasse.",
    vial: "5 mg",
    form: "Lyophilisiertes Pulver",
    price: 30,
  },
  {
    id: 11,
    slug: "tesamorelin",
    name: "Tesamorelin",
    category: "Wachstumshormon",
    tagline: "Stabilisiertes GHRH-Analogon",
    effects: [
      "Stabilisiertes GHRH-Analogon mit Fokus auf viszerales Fettgewebe",
      "Umfassend in klinischen Studien zur Körperzusammensetzung untersucht",
      "Referenzmolekül für GHRH-Stabilitätsforschung",
    ],
    description:
      "Tesamorelin ist ein stabilisiertes GHRH-Analogon, das durch eine trans-3-Hexensäure-Modifikation eine höhere Resistenz gegenüber enzymatischem Abbau aufweist.",
    vial: "5 mg",
    form: "Lyophilisiertes Pulver",
    price: 52,
  },
  {
    id: 12,
    slug: "hexarelin",
    name: "Hexarelin",
    category: "Wachstumshormon",
    tagline: "Potentes GHRP",
    effects: [
      "Eines der potentesten bekannten Growth-Hormone-Releasing-Peptide",
      "Gegenstand kardiologischer Grundlagenforschung",
      "Untersucht im Vergleich zu selektiveren Sekretagoga",
    ],
    description:
      "Hexarelin zählt zu den wirkstärksten GHRP-Verbindungen und wird in der Forschung unter anderem als Vergleichssubstanz zu selektiveren Sekretagoga wie Ipamorelin herangezogen.",
    vial: "5 mg",
    form: "Lyophilisiertes Pulver",
    price: 33,
  },
  {
    id: 13,
    slug: "ghrp-2",
    name: "GHRP-2",
    category: "Wachstumshormon",
    tagline: "Growth-Hormone-Releasing-Peptid",
    effects: [
      "Ghrelin-Rezeptor-Agonist mit ausgeprägter GH-Freisetzung",
      "Untersucht im Zusammenhang mit Appetitsignalwegen",
      "Vergleichsmolekül in der Sekretagoga-Forschung",
    ],
    description:
      "GHRP-2 ist ein synthetisches Hexapeptid aus der Growth-Hormone-Releasing-Peptide-Familie und wird häufig im Forschungsvergleich zu GHRP-6 herangezogen.",
    vial: "5 mg",
    form: "Lyophilisiertes Pulver",
    price: 29,
  },
  {
    id: 14,
    slug: "ghrp-6",
    name: "GHRP-6",
    category: "Wachstumshormon",
    tagline: "Erstes erforschtes GHRP",
    effects: [
      "Eines der ersten synthetisierten Growth-Hormone-Releasing-Peptide",
      "Ausgeprägte Ghrelin-Rezeptor-Affinität in In-vitro-Studien",
      "Historische Referenzsubstanz der GHRP-Forschung",
    ],
    description:
      "GHRP-6 war eines der ersten entwickelten Peptide seiner Klasse und bildete die Grundlage für zahlreiche nachfolgende Sekretagoga-Studien.",
    vial: "5 mg",
    form: "Lyophilisiertes Pulver",
    price: 28,
  },
  {
    id: 15,
    slug: "igf-1-lr3",
    name: "IGF-1 LR3",
    aliases: "Long Arg3-IGF-1",
    category: "Wachstumshormon",
    tagline: "Verlängerter Insulin-like Growth Factor",
    effects: [
      "Modifizierte IGF-1-Variante mit reduzierter Bindungsprotein-Affinität",
      "Untersucht im Kontext von Zellproliferation in vitro",
      "Referenzmolekül der IGF-Achsen-Forschung",
    ],
    description:
      "IGF-1 LR3 ist eine verlängerte Variante des Insulin-like Growth Factor 1 mit einer Aminosäuresubstitution, die die Bindung an IGF-Bindungsproteine reduziert.",
    vial: "1 mg",
    form: "Lyophilisiertes Pulver",
    price: 55,
  },
  {
    id: 16,
    slug: "follistatin-344",
    name: "Follistatin 344",
    category: "Wachstumshormon",
    tagline: "Myostatin-Antagonist",
    effects: [
      "Untersucht als natürlicher Antagonist von Myostatin",
      "Gegenstand präklinischer Studien zur Muskelzelldifferenzierung",
      "Vergleichsmolekül in der Muskelwachstums-Grundlagenforschung",
    ],
    description:
      "Follistatin 344 ist ein Glykoprotein, das in präklinischen Modellen als Bindungsprotein für Myostatin und verwandte Faktoren der TGF-beta-Familie untersucht wird.",
    vial: "1 mg",
    form: "Lyophilisiertes Pulver",
    price: 78,
    badge: "Limitiert",
  },
  {
    id: 17,
    slug: "mots-c",
    name: "MOTS-c",
    category: "Langlebigkeit",
    tagline: "Mitochondriales Signalpeptid",
    effects: [
      "Mitochondrial kodiertes Peptid, Gegenstand der Langlebigkeitsforschung",
      "Untersucht im Zusammenhang mit AMPK-Signalwegen",
      "Forschungsfokus auf Stoffwechselhomöostase unter Belastung",
    ],
    description:
      "MOTS-c ist eines von mehreren mitochondrial kodierten Peptiden (Mitochondrial-Derived Peptides), die in den letzten Jahren verstärkt in der Alters- und Stoffwechselforschung untersucht werden.",
    vial: "10 mg",
    form: "Lyophilisiertes Pulver",
    price: 62,
    badge: "Neu",
  },
  {
    id: 18,
    slug: "epithalon",
    name: "Epithalon",
    aliases: "Epitalon",
    category: "Langlebigkeit",
    tagline: "Synthetisches Telomerase-Peptid",
    effects: [
      "Synthetisches Tetrapeptid, ursprünglich aus der Zirbeldrüsenforschung",
      "Untersucht im Zusammenhang mit Telomerase-Aktivität in Zellkulturen",
      "Gegenstand russischer Langlebigkeitsstudien seit den 1980er-Jahren",
    ],
    description:
      "Epithalon ist ein synthetisches Analogon des natürlichen Peptids Epithalamin und zählt zu den am längsten untersuchten Molekülen der Langlebigkeitsforschung.",
    vial: "10 mg",
    form: "Lyophilisiertes Pulver",
    price: 58,
  },
  {
    id: 19,
    slug: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    category: "Immunsystem",
    tagline: "Immunmodulatorisches Peptid",
    effects: [
      "Natürlich vorkommendes Thymuspeptid, immunmodulatorisch untersucht",
      "Gegenstand klinischer Forschung im infektiologischen Kontext",
      "Untersucht im Zusammenhang mit T-Zell-Reifung",
    ],
    description:
      "Thymosin Alpha-1 ist ein natürlich im Thymus produziertes Peptid, das seit Jahrzehnten in der immunologischen Grundlagen- und klinischen Forschung untersucht wird.",
    vial: "10 mg",
    form: "Lyophilisiertes Pulver",
    price: 65,
  },
  {
    id: 20,
    slug: "pt-141",
    name: "PT-141",
    aliases: "Bremelanotid",
    category: "Hormonell",
    tagline: "Melanocortin-Rezeptor-Agonist",
    effects: [
      "Melanocortin-Rezeptor-Agonist, zentralnervös statt vaskulär wirksam",
      "Gegenstand klinischer Studien zur sexuellen Reaktion",
      "Abgeleitet aus der Melanotan-II-Forschung",
    ],
    description:
      "PT-141 ist ein Metabolit von Melanotan II, der gezielt Melanocortin-Rezeptoren im zentralen Nervensystem anspricht und dessen Wirkmechanismus in klinischen Studien untersucht wurde.",
    vial: "10 mg",
    form: "Lyophilisiertes Pulver",
    price: 49,
  },
  {
    id: 21,
    slug: "melanotan-ii",
    name: "Melanotan II",
    category: "Hormonell",
    tagline: "Melanocortin-Analogon",
    effects: [
      "Analogon des alpha-MSH mit Fokus auf Melanocortin-Rezeptoren",
      "Ursprünglich für die Pigmentierungsforschung entwickelt",
      "Vorläufermolekül von PT-141 in der Wirkstoffforschung",
    ],
    description:
      "Melanotan II wurde ursprünglich an der University of Arizona zur Erforschung von Pigmentierungsprozessen entwickelt und diente später als Ausgangspunkt für PT-141.",
    vial: "10 mg",
    form: "Lyophilisiertes Pulver",
    price: 40,
  },
  {
    id: 22,
    slug: "kisspeptin-10",
    name: "Kisspeptin-10",
    category: "Hormonell",
    tagline: "Regulator der Gonadotropin-Achse",
    effects: [
      "Schlüsselregulator der Hypothalamus-Hypophysen-Gonaden-Achse",
      "Untersucht im Kontext der Reproduktionsendokrinologie",
      "Gegenstand von Studien zur GnRH-Sekretion",
    ],
    description:
      "Kisspeptin-10 ist das aktive Fragment des Kisspeptin-Proteins und gilt in der Endokrinologie als zentraler Regulator der hormonellen Fortpflanzungsachse.",
    vial: "5 mg",
    form: "Lyophilisiertes Pulver",
    price: 44,
  },
  {
    id: 23,
    slug: "selank",
    name: "Selank",
    category: "Kognition",
    tagline: "Anxiolytisches Peptid",
    effects: [
      "Synthetisches Analogon eines körpereigenen Immunmodulator-Peptids",
      "Untersucht im Zusammenhang mit Angst- und Stressmodellen",
      "Gegenstand russischer neuropharmakologischer Forschung",
    ],
    description:
      "Selank ist ein synthetisches Peptid, das an das körpereigene Tuftsin angelehnt ist und in der neuropharmakologischen Forschung auf anxiolytische Eigenschaften untersucht wird.",
    vial: "10 mg",
    form: "Lyophilisiertes Pulver",
    price: 46,
  },
  {
    id: 24,
    slug: "semax",
    name: "Semax",
    category: "Kognition",
    tagline: "Nootropes Peptid",
    effects: [
      "Synthetisches ACTH-Fragment ohne hormonelle Restwirkung",
      "Untersucht im Zusammenhang mit BDNF-Expression",
      "Gegenstand kognitiver Forschung seit den 1980er-Jahren in Russland",
    ],
    description:
      "Semax ist ein synthetisches Fragment des adrenocorticotropen Hormons (ACTH) und zählt zu den am längsten dokumentierten nootropen Peptiden der neuropharmakologischen Forschung.",
    vial: "10 mg",
    form: "Lyophilisiertes Pulver",
    price: 46,
    badge: "Neu",
  },
];

export function getPeptideBySlug(slug: string): Peptide | undefined {
  return peptides.find((p) => p.slug === slug);
}

export function getRelatedPeptides(current: Peptide, count = 3): Peptide[] {
  const sameCategory = peptides.filter(
    (p) => p.category === current.category && p.id !== current.id
  );
  const rest = peptides.filter(
    (p) => p.category !== current.category && p.id !== current.id
  );
  return [...sameCategory, ...rest].slice(0, count);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
