const STEPS = [
  "Les sources publiques (PDF, HTML) sont extraites et nettoyées.",
  "Le texte est découpé en chunks (~1800 caractères, léger overlap).",
  "Chaque chunk est transformé en embedding via un modèle local (multilingual-e5-small).",
  "Les chunks et leurs embeddings sont stockés dans Supabase PostgreSQL + pgvector.",
  "La question posée par l'utilisateur est elle aussi transformée en embedding.",
  "Une recherche vectorielle (similarité cosinus) retrouve les chunks les plus pertinents.",
  "Si aucun chunk n'est suffisamment proche, l'assistant répond directement le message de repli, sans appeler le LLM.",
  "Sinon, les chunks sont envoyés à Gemini Flash-Lite avec un prompt strict, et la réponse est renvoyée avec ses sources.",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Comment fonctionne l&apos;assistant (RAG)</h1>
      <p className="mt-2 text-sm text-zinc-600">
        L&apos;assistant utilise une architecture RAG (Retrieval-Augmented Generation) :
        il ne répond qu&apos;à partir d&apos;extraits de sources réellement retrouvés, jamais
        de mémoire pure du modèle.
      </p>
      <ol className="mt-6 space-y-3">
        {STEPS.map((step, i) => (
          <li key={i} className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-3 text-sm">
            <span className="font-mono text-zinc-400">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
