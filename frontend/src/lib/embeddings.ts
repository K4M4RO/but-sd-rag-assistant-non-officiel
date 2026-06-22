import { pipeline, type FeatureExtractionPipeline } from "@huggingface/transformers";

const MODEL_NAME = "Xenova/multilingual-e5-small";

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", MODEL_NAME);
  }
  return extractorPromise;
}

// Le modèle e5 attend un préfixe "query: " pour les questions (et "passage: "
// pour les documents, utilisé côté script Python d'ingestion). Les deux côtés
// doivent utiliser le même modèle pour que la recherche vectorielle soit cohérente.
export async function embedQuery(question: string): Promise<number[]> {
  const extractor = await getExtractor();
  const output = await extractor(`query: ${question}`, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data as Float32Array);
}
