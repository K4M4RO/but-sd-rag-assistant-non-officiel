"""Envoie les documents (data/sources.yaml) et les chunks+embeddings
(data/processed/chunks_with_embeddings.jsonl) vers Supabase.
Nécessite SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env (schema.sql doit déjà être appliqué)."""
import json
import os
from pathlib import Path

import yaml
from dotenv import load_dotenv
from supabase import create_client

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]


def main() -> None:
    client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    sources = yaml.safe_load((ROOT / "data" / "sources.yaml").read_text(encoding="utf-8"))["sources"]
    documents = [
        {
            "id": s["id"],
            "title": s["title"],
            "url": s["url"],
            "type": s["type"],
            "category": s["category"],
            "publisher": s.get("publisher"),
            "last_checked": s["last_checked"],
        }
        for s in sources
    ]
    client.table("documents").upsert(documents).execute()
    print(f"{len(documents)} documents upserted")

    chunks_file = ROOT / "data" / "processed" / "chunks_with_embeddings.jsonl"
    rows = []
    for line in chunks_file.read_text(encoding="utf-8").splitlines():
        c = json.loads(line)
        rows.append({
            "id": c["id"],
            "document_id": c["source_id"],
            "content": c["content"],
            "embedding": c["embedding"],
            "page": c["page"],
            "chunk_index": c["chunk_index"],
        })

    batch_size = 100
    for i in range(0, len(rows), batch_size):
        batch = rows[i : i + batch_size]
        client.table("chunks").upsert(batch).execute()
        print(f"upserted chunks {i} -> {i + len(batch)}")

    print(f"Done: {len(rows)} chunks ingérés.")


if __name__ == "__main__":
    main()
