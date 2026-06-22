"""Extrait le texte des PDF listés dans data/sources.yaml (type: pdf) vers data/processed/*.json."""
import json
from pathlib import Path

import yaml
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
SOURCES_FILE = ROOT / "data" / "sources.yaml"
OUTPUT_DIR = ROOT / "data" / "processed"


def extract_pdf(source: dict) -> dict:
    pdf_path = ROOT / source["local_path"]
    reader = PdfReader(str(pdf_path))
    pages = [
        {"page": i + 1, "text": page.extract_text() or ""}
        for i, page in enumerate(reader.pages)
    ]
    return {
        "source_id": source["id"],
        "source_title": source["title"],
        "source_url": source["url"],
        "source_type": "pdf",
        "category": source["category"],
        "last_checked": source["last_checked"],
        "pages": pages,
    }


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    sources = yaml.safe_load(SOURCES_FILE.read_text(encoding="utf-8"))["sources"]
    for source in sources:
        if source["type"] != "pdf":
            continue
        data = extract_pdf(source)
        out_path = OUTPUT_DIR / f"{source['id']}.json"
        out_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"OK {source['id']} -> {out_path} ({len(data['pages'])} pages)")


if __name__ == "__main__":
    main()
