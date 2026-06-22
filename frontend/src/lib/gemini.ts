import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./systemPrompt";
import type { MatchedChunk } from "./supabase";

const MODEL_NAME = "gemini-2.5-flash-lite";

function buildContext(chunks: MatchedChunk[]): string {
  return chunks
    .map(
      (c, i) =>
        `[Extrait ${i + 1}] (source: ${c.title} — ${c.url}${c.page ? `, page ${c.page}` : ""})\n${c.content}`
    )
    .join("\n\n");
}

export async function generateAnswer(question: string, chunks: MatchedChunk[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY manquant dans .env");
  }

  const ai = new GoogleGenAI({ apiKey });
  const context = buildContext(chunks);

  // L'API Gemini renvoie parfois un 503 transitoire ("high demand") ; on retente
  // quelques fois avant d'abandonner pour éviter de montrer une erreur évitable.
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Contexte (extraits de sources publiques) :\n\n${context}\n\nQuestion de l'étudiant : ${question}`,
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });
      return response.text ?? "";
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw lastError;
}
