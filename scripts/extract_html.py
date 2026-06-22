"""Récupère et extrait le texte des pages HTML listées dans data/sources.yaml vers data/processed/*.json."""
import json
import time
from pathlib import Path

import requests
import yaml
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
SOURCES_FILE = ROOT / "data" / "sources.yaml"
OUTPUT_DIR = ROOT / "data" / "processed"
HEADERS = {"User-Agent": "Mozilla/5.0 (BUT-SD-RAG-Assistant educational project)"}


def extract_html(source: dict) -> dict:
    resp = requests.get(source["url"], headers=HEADERS, timeout=20)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    for tag in soup(["script", "style", "nav", "footer", "header", "noscript"]):
        tag.decompose()

    main = soup.find("main") or soup.find("article") or soup.body or soup
    text = "\n".join(
        line.strip() for line in main.get_text("\n").splitlines() if line.strip()
    )

    return {
        "source_id": source["id"],
        "source_title": source["title"],
        "source_url": source["url"],
        "source_type": "html",
        "category": source["category"],
        "last_checked": source["last_checked"],
        "text": text,
    }


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    sources = yaml.safe_load(SOURCES_FILE.read_text(encoding="utf-8"))["sources"]
    for source in sources:
        if source["type"] != "html":
            continue
        try:
            data = extract_html(source)
        except requests.RequestException as exc:
            print(f"FAIL {source['id']}: {exc}")
            continue
        out_path = OUTPUT_DIR / f"{source['id']}.json"
        out_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"OK {source['id']} -> {out_path} ({len(data['text'])} chars)")
        time.sleep(1)


if __name__ == "__main__":
    main()
