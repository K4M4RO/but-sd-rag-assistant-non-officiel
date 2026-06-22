-- Schéma Supabase pgvector pour le BUT SD RAG Assistant
-- A exécuter dans Supabase SQL Editor après avoir activé l'extension "vector".
--
-- NOTE: passage des embeddings de multilingual-e5-small (384 dim, local) à
-- gemini-embedding-001 (768 dim, API) -- la table chunks est recréée car la
-- dimension d'un type vector() ne peut pas être modifiée en place.

create extension if not exists vector;

drop function if exists match_chunks(vector(384), int);
drop function if exists match_chunks(vector(768), int);
drop table if exists chunks;

create table if not exists documents (
  id text primary key,
  title text not null,
  url text not null,
  type text not null,
  category text not null,
  publisher text,
  last_checked date
);

create table chunks (
  id bigint primary key,
  document_id text not null references documents(id) on delete cascade,
  content text not null,
  embedding vector(768) not null,
  page int,
  chunk_index int not null
);

create index chunks_embedding_idx
  on chunks using hnsw (embedding vector_cosine_ops);

-- Recherche par similarité cosinus, renvoie les k chunks les plus proches
-- avec leurs métadonnées de source pour la citation.
create or replace function match_chunks(
  query_embedding vector(768),
  match_count int default 5
)
returns table (
  id bigint,
  content text,
  page int,
  document_id text,
  title text,
  url text,
  category text,
  similarity float
)
language sql stable
as $$
  select
    chunks.id,
    chunks.content,
    chunks.page,
    documents.id as document_id,
    documents.title,
    documents.url,
    documents.category,
    1 - (chunks.embedding <=> query_embedding) as similarity
  from chunks
  join documents on documents.id = chunks.document_id
  order by chunks.embedding <=> query_embedding
  limit match_count;
$$;
