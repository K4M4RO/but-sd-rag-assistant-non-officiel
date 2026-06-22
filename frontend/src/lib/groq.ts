import { SYSTEM_PROMPT } from "./systemPrompt";
import type { MatchedChunk } from "./supabase";

const MODEL_NAME = "llama-3.3-70b-versatile";
const URL = "https://api.groq.com/openai/v1/chat/completions";

function buildContext(chunks: MatchedChunk[]): string {
  return chunks
    .map(
      (c, i) =>
        `[Extrait ${i + 1}] (source: ${c.title} — ${c.url}${c.page ? `, page ${c.page}` : ""})\n${c.content}`
    )
    .join("\n\n");
}

export async function generateAnswer(question: string, chunks: MatchedChunk[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY manquant dans .env");
  }

  const context = buildContext(chunks);
  const body = {
    model: MODEL_NAME,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Contexte (extraits de sources publiques) :\n\n${context}\n\nQuestion de l'étudiant : ${question}`,
      },
    ],
  };

  // L'API peut renvoyer des erreurs transitoires (429/503) ; on retente quelques
  // fois avant d'abandonner pour éviter de montrer une erreur évitable.
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content ?? "";
    }

    lastError = new Error(`Groq API error ${response.status}: ${await response.text()}`);
    await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
  }
  throw lastError;
}
