import { load } from "js-yaml";
import { readFileSync } from "fs";
import path from "path";

type Source = {
  id: string;
  title: string;
  type: string;
  url: string;
  status: string;
  category: string;
  publisher?: string;
  last_checked: string;
};

function loadSources(): Source[] {
  const filePath = path.join(process.cwd(), "..", "data", "sources.yaml");
  const raw = readFileSync(filePath, "utf-8");
  const parsed = load(raw) as { sources: Source[] };
  return parsed.sources;
}

export default function SourcesPage() {
  const sources = loadSources();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Sources publiques intégrées</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Liste exhaustive des sources utilisées par l&apos;assistant. Toutes sont publiques et
        officielles (ministère, IUT de Metz / Université de Lorraine, Onisep, Parcoursup).
      </p>

      <ul className="mt-6 space-y-4">
        {sources.map((s) => (
          <li key={s.id} className="rounded-lg border border-zinc-200 bg-white p-4">
            <a href={s.url} target="_blank" rel="noreferrer" className="font-medium underline">
              {s.title}
            </a>
            <div className="mt-1 text-xs text-zinc-500">
              {s.publisher && <span>{s.publisher} · </span>}
              {s.type.toUpperCase()} · {s.category} · vérifié le {s.last_checked}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
