import { NextResponse } from "next/server";
import { embedQuery } from "@/lib/embeddings";
import { generateAnswer } from "@/lib/gemini";
import { getSupabaseServerClient, type MatchedChunk } from "@/lib/supabase";
import { FALLBACK_MESSAGE } from "@/lib/systemPrompt";

const MATCH_COUNT = 5;
const SIMILARITY_THRESHOLD = 0.78;

export async function POST(request: Request) {
  const { question } = await request.json();

  if (!question || typeof question !== "string" || question.trim().length === 0) {
    return NextResponse.json({ error: "question manquante" }, { status: 400 });
  }

  const embedding = await embedQuery(question);

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: embedding,
    match_count: MATCH_COUNT,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const chunks = (data ?? []) as MatchedChunk[];
  const relevant = chunks.filter((c) => c.similarity >= SIMILARITY_THRESHOLD);

  if (relevant.length === 0) {
    return NextResponse.json({ answer: FALLBACK_MESSAGE, sources: [] });
  }

  const answer = await generateAnswer(question, relevant);

  const sources = Array.from(
    new Map(relevant.map((c) => [c.document_id, { title: c.title, url: c.url }])).values()
  );

  return NextResponse.json({ answer, sources });
}
