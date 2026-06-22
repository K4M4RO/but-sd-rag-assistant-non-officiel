# BUT SD RAG Assistant (non officiel)

Assistant RAG **non officiel** pour aider les étudiants à comprendre le BUT Science des
Données (IUT de Metz, Université de Lorraine), à partir uniquement de sources publiques
officielles (programme national, pages institutionnelles, fiches Onisep/Parcoursup).

Ce projet n'utilise et n'utilisera jamais de documents ARCHE, supports de cours privés,
notes, coefficients non publics ou données personnelles d'étudiants. Si une information
n'est pas dans les sources publiques intégrées, l'assistant le dit clairement plutôt que
d'inventer une réponse. Voir [docs/project_scope.md](docs/project_scope.md).

## Architecture

```
Sources publiques (PDF/HTML)
        -> extraction (scripts/extract_pdf.py, extract_html.py)
        -> chunking (scripts/chunk_text.py)
        -> embeddings locaux multilingual-e5-small (scripts/generate_embeddings.py)
        -> Supabase PostgreSQL + pgvector (scripts/schema.sql, scripts/ingest.py)
        -> question utilisateur -> embedding -> recherche vectorielle (match_chunks)
        -> si rien de pertinent : réponse de repli, sinon Gemini Flash-Lite génère la réponse
        -> réponse + sources affichées dans le frontend Next.js
```

## Structure

- `frontend/` — application Next.js (pages + route API `/api/chat`).
- `scripts/` — pipeline d'ingestion Python (extraction, chunking, embeddings, ingestion Supabase).
- `data/sources.yaml` — liste des sources publiques utilisées (avec métadonnées).
- `docs/` — périmètre du projet et questions cibles.

## Lancer le projet

### 1. Pipeline d'ingestion (Python)

```bash
python -m venv .venv
.venv/Scripts/activate  # ou source .venv/bin/activate
pip install -r scripts/requirements.txt

python scripts/extract_pdf.py
python scripts/extract_html.py
python scripts/chunk_text.py
python scripts/generate_embeddings.py
```

Applique ensuite `scripts/schema.sql` dans le SQL Editor de ton projet Supabase, puis :

```bash
python scripts/ingest.py
```

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Copie `.env.example` vers `frontend/.env.local` et renseigne tes clés (Supabase, Gemini).

## Limites

Ce projet est une démonstration pédagogique, sans lien officiel avec l'IUT de Metz,
l'Université de Lorraine ou le ministère. Voir [/disclaimer](frontend/src/app/disclaimer/page.tsx)
pour le détail des limites et le contact en cas de demande de retrait.
