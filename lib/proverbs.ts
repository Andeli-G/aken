import { supabase } from "@/lib/supabase";

export type Equivalent = {
  language: string;
  text: string;
  translation?: string;
};

export type Proverb = {
  id: number;
  slug: string;
  title: string;
  bulu: string;
  phonetic?: string | null;
  french: string;
  french_by?: "author" | "akene"; // qui a formulé la traduction française
  theme: string;
  theme_category: string;
  author_commentary?: string | null; // commentaire de l'auteur, fidèle à la source
  editor_note?: string | null; // note d'Akeñ : nos propres ajouts
  equivalents: Equivalent[];
  source_id: number;
  source_page?: number | null;
  status: "published" | "draft" | "archived";
};

// La base de données est la seule source : pas de repli sur un fichier local,
// qui contournerait les statuts brouillon/publié et empêcherait le déploiement.
export async function getProverbs(theme?: string): Promise<Proverb[]> {
  let query = supabase
    .from("proverbs")
    .select("*")
    .eq("status", "published")
    .order("id");

  if (theme && theme !== "all") {
    query = query.eq("theme_category", theme);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Proverbes indisponibles :", error.message);
    return [];
  }
  return (data ?? []) as Proverb[];
}

export async function getProverbBySlug(slug: string): Promise<Proverb | null> {
  const { data, error } = await supabase
    .from("proverbs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Proverbe indisponible :", error.message);
    return null;
  }
  return (data as Proverb) ?? null;
}
