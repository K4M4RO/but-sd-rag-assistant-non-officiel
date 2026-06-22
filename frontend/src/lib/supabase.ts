import { createClient } from "@supabase/supabase-js";

// Client serveur uniquement : utilise la service_role key, ne doit jamais être exposé au frontend.
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env");
  }

  return createClient(url, serviceRoleKey);
}

export type MatchedChunk = {
  id: number;
  content: string;
  page: number | null;
  document_id: string;
  title: string;
  url: string;
  category: string;
  similarity: number;
};
