"""Génère les embeddings via l'API Gemini (gemini-embedding-001) pour chaque chunk
de data/processed/chunks.jsonl, vers data/processed/chunks_with_embeddings.jsonl.
Même modèle et mêmes paramètres que frontend/src/lib/embeddings.ts, sinon la
recherche vectorielle dans Supabase ne serait pas cohérente."""
import json
import os
import time
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

INPUT_FILE = ROOT / "data" / "processed" / "chunks.jsonl"
OUTPUT_FILE = ROOT / "data" / "processed" / "chunks_with_embeddings.jsonl"

API_KEY = os.environ["GEMINI_API_KEY"]
MODEL_NAME = "gemini-embedding-001"
OUTPUT_DIMENSIONALITY = 768
BATCH_SIZE = 20
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:batchEmbedContents?key={API_KEY}"


def embed_batch(texts: list[str]) -> list[list[float]]:
    body = {
        "requests": [
            {
                "model": f"models/{MODEL_NAME}",
                "content": {"parts": [{"text": text}]},
                "taskType": "RETRIEVAL_DOCUMENT",
                "outputDimensionality": OUTPUT_DIMENSIONALITY,
            }
            for text in texts
        ]
    }
    for attempt in range(6):
        resp = requests.post(URL, json=body, timeout=60)
        if resp.status_code == 429:
            wait = 15 * (attempt + 1)
            print(f"rate limited, retry in {wait}s...")
            time.sleep(wait)
            continue
        resp.raise_for_status()
        data = resp.json()
        return [e["values"] for e in data["embeddings"]]
    raise RuntimeError("Trop de 429, abandon")


def main() -> None:
    chunks = [json.loads(line) for line in INPUT_FILE.read_text(encoding="utf-8").splitlines()]

    with OUTPUT_FILE.open("w", encoding="utf-8") as f:
        for i in range(0, len(chunks), BATCH_SIZE):
            batch = chunks[i : i + BATCH_SIZE]
            embeddings = embed_batch([c["content"] for c in batch])
            for chunk, emb in zip(batch, embeddings):
                chunk["embedding"] = emb
                f.write(json.dumps(chunk, ensure_ascii=False) + "\n")
            print(f"embedded {i + len(batch)} / {len(chunks)}")
            time.sleep(12)  # reste sous la limite de requêtes/minute du free tier

    print(f"{len(chunks)} embeddings ({OUTPUT_DIMENSIONALITY} dims) -> {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
