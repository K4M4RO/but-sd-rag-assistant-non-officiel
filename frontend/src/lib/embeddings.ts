import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-embedding-001";
const OUTPUT_DIMENSIONALITY = 768;

let client: GoogleGenAI | null = null;

function getClient() {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY manquant dans .env");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

// Même modèle et même outputDimensionality que scripts/generate_embeddings.py,
// sinon la recherche vectorielle dans Supabase ne serait pas cohérente.
export async function embedQuery(question: string): Promise<number[]> {
  const ai = getClient();
  const response = await ai.models.embedContent({
    model: MODEL_NAME,
    contents: question,
    config: {
      taskType: "RETRIEVAL_QUERY",
      outputDimensionality: OUTPUT_DIMENSIONALITY,
    },
  });

  const values = response.embeddings?.[0]?.values;
  if (!values) {
    throw new Error("Réponse d'embedding vide");
  }
  return values;
}
