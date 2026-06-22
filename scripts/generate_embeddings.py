"""Génère les embeddings locaux (multilingual-e5-small) pour chaque chunk
de data/processed/chunks.jsonl, vers data/processed/chunks_with_embeddings.jsonl."""
import json
from pathlib import Path

from sentence_transformers import SentenceTransformer

ROOT = Path(__file__).resolve().parent.parent
INPUT_FILE = ROOT / "data" / "processed" / "chunks.jsonl"
OUTPUT_FILE = ROOT / "data" / "processed" / "chunks_with_embeddings.jsonl"

MODEL_NAME = "intfloat/multilingual-e5-small"
# e5 attend un préfixe "passage: " pour les documents et "query: " pour les questions.
PASSAGE_PREFIX = "passage: "


def main() -> None:
    model = SentenceTransformer(MODEL_NAME)

    chunks = [json.loads(line) for line in INPUT_FILE.read_text(encoding="utf-8").splitlines()]
    texts = [PASSAGE_PREFIX + c["content"] for c in chunks]

    embeddings = model.encode(texts, batch_size=32, show_progress_bar=True, normalize_embeddings=True)

    with OUTPUT_FILE.open("w", encoding="utf-8") as f:
        for chunk, emb in zip(chunks, embeddings):
            chunk["embedding"] = emb.tolist()
            f.write(json.dumps(chunk, ensure_ascii=False) + "\n")

    print(f"{len(chunks)} embeddings ({len(embeddings[0])} dims) -> {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
