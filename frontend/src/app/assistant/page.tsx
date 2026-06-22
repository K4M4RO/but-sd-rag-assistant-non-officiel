"use client";

import { useState } from "react";

type Source = { title: string; url: string };
type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendQuestion() {
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Erreur inconnue");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, sources: data.sources },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Une erreur technique est survenue. Réessaie, ou vérifie la configuration du backend.",
        },
      ]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-130px)] max-w-3xl flex-col px-6 py-8">
      <h1 className="mb-1 text-xl font-semibold">Assistant BUT Science des Données</h1>
      <p className="mb-4 text-xs text-zinc-500">
        Réponses générées par une IA (Gemini) à partir de sources publiques. Elles peuvent
        contenir des erreurs — vérifie toujours les informations importantes auprès de l&apos;IUT
        ou sur ARCHE.
      </p>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-4">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-500">
            Pose une question sur le BUT SD (parcours, compétences, stages, portfolio...).
            L&apos;assistant répond uniquement à partir de sources publiques.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={
                "inline-block max-w-[85%] whitespace-pre-wrap rounded-lg px-4 py-2 text-sm " +
                (m.role === "user" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-900")
              }
            >
              {m.content}
            </div>
            {m.sources && m.sources.length > 0 && (
              <div className="mt-1 space-x-2 text-xs text-zinc-500">
                Sources :{" "}
                {m.sources.map((s, j) => (
                  <a key={j} href={s.url} target="_blank" rel="noreferrer" className="underline">
                    {s.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <p className="text-sm text-zinc-400">L&apos;assistant réfléchit…</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendQuestion();
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Quels sont les parcours du BUT SD ?"
          className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
