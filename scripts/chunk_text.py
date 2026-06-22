"""Découpe les documents extraits (data/processed/*.json) en chunks avec métadonnées,
vers data/processed/chunks.jsonl."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROCESSED_DIR = ROOT / "data" / "processed"
OUTPUT_FILE = PROCESSED_DIR / "chunks.jsonl"

CHUNK_SIZE_CHARS = 1800  # ~ 500-700 tokens
OVERLAP_CHARS = 200


def clean(text: str) -> str:
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def split_with_overlap(text: str, size: int, overlap: int) -> list[str]:
    text = clean(text)
    if not text:
        return []
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + size, len(text))
        # essaye de couper sur une fin de phrase/paragraphe proche de la limite
        boundary = text.rfind("\n\n", start, end)
        if boundary == -1 or boundary <= start + size // 2:
            boundary = text.rfind(". ", start, end)
        if boundary == -1 or boundary <= start + size // 2:
            boundary = end
        else:
            boundary += 1
        chunk = text[start:boundary].strip()
        if chunk:
            chunks.append(chunk)
        if boundary >= len(text):
            break
        start = max(boundary - overlap, start + 1)
    return chunks


def chunk_pdf_doc(doc: dict) -> list[dict]:
    results = []
    for page in doc["pages"]:
        for idx, chunk in enumerate(split_with_overlap(page["text"], CHUNK_SIZE_CHARS, OVERLAP_CHARS)):
            results.append({
                "source_id": doc["source_id"],
                "source_title": doc["source_title"],
                "source_url": doc["source_url"],
                "source_type": doc["source_type"],
                "category": doc["category"],
                "last_checked": doc["last_checked"],
                "page": page["page"],
                "chunk_index": idx,
                "content": chunk,
            })
    return results


def chunk_html_doc(doc: dict) -> list[dict]:
    return [
        {
            "source_id": doc["source_id"],
            "source_title": doc["source_title"],
            "source_url": doc["source_url"],
            "source_type": doc["source_type"],
            "category": doc["category"],
            "last_checked": doc["last_checked"],
            "page": None,
            "chunk_index": idx,
            "content": chunk,
        }
        for idx, chunk in enumerate(split_with_overlap(doc["text"], CHUNK_SIZE_CHARS, OVERLAP_CHARS))
    ]


def main() -> None:
    all_chunks = []
    for json_file in sorted(PROCESSED_DIR.glob("*.json")):
        doc = json.loads(json_file.read_text(encoding="utf-8"))
        if doc["source_type"] == "pdf":
            all_chunks.extend(chunk_pdf_doc(doc))
        else:
            all_chunks.extend(chunk_html_doc(doc))

    with OUTPUT_FILE.open("w", encoding="utf-8") as f:
        for i, chunk in enumerate(all_chunks):
            chunk["id"] = i
            f.write(json.dumps(chunk, ensure_ascii=False) + "\n")

    print(f"{len(all_chunks)} chunks -> {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
