import Link from "next/link";

const SECTIONS = [
  {
    title: "Formation",
    text: "BUT Science des Données en 3 ans (180 ECTS), à l'IUT de Metz (Université de Lorraine), campus du Saulcy. Deux parcours à partir de la 2ᵉ année : EMS (Exploration et Modélisation Statistique) et VCOD (Visualisation, Conception d'Outils Décisionnels).",
  },
  {
    title: "Compétences",
    text: "Le référentiel national (PPN) définit les compétences du BUT SD, les ressources associées et les SAÉ (Situations d'Apprentissage et d'Évaluation) qui les mobilisent.",
  },
  {
    title: "Stages / alternance",
    text: "Formation initiale classique en 1ʳᵉ année. La 3ᵉ année peut se faire en alternance selon le parcours.",
  },
  {
    title: "Portfolio",
    text: "Le portfolio relie les projets réalisés aux compétences visées, avec des preuves justifiant leur acquisition.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Assistant non officiel pour le BUT Science des Données
          </h1>
          <p className="mt-4 text-zinc-600">
            Cet outil pédagogique répond aux questions sur le BUT SD (IUT de Metz) en
            s&apos;appuyant uniquement sur des sources publiques officielles : programme
            national, pages institutionnelles, fiches Onisep/Parcoursup. Il ne sait
            rien d&apos;ARCHE, des notes ou des modalités internes — et le dit clairement.
          </p>
          <Link
            href="/assistant"
            className="mt-6 inline-block rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Poser une question →
          </Link>

          <div className="mt-10 grid gap-4">
            {SECTIONS.map((s) => (
              <div key={s.title} className="rounded-lg border border-zinc-200 bg-white p-4">
                <h2 className="font-medium">{s.title}</h2>
                <p className="mt-1 text-sm text-zinc-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="font-medium">Ce que l&apos;assistant refuse de faire</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-600">
            <li>Donner des coefficients exacts ou des modalités de calcul de moyenne.</li>
            <li>Inventer des règles internes ou des informations issues d&apos;ARCHE.</li>
            <li>Statuer sur un cas personnel d&apos;étudiant.</li>
            <li>Répondre sans citer ses sources.</li>
          </ul>
          <p className="mt-4 text-sm text-zinc-500">
            Voir le détail dans <Link href="/disclaimer" className="underline">les mentions légales</Link> et{" "}
            <Link href="/sources" className="underline">les sources intégrées</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
