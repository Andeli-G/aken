// Importe les proverbes de Maxime Meto'o dans la table proverbs de Supabase.
// Usage : node --env-file=.env.local scripts/import-proverbs.mjs

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const proverbs = JSON.parse(readFileSync("data/processed/proverbs.json", "utf-8"));
  console.log(`Lecture de ${proverbs.length} proverbes...`);

  for (const p of proverbs) {
    const { data, error } = await supabase
      .from("proverbs")
      .upsert(
        {
          id: p.id,
          slug: p.slug,
          title: p.title,
          bulu: p.bulu,
          phonetic: p.phonetic,
          french: p.french,
          theme: p.theme,
          theme_category: p.theme_category,
          commentary: p.commentary,
          equivalents: p.equivalents,
          source_id: p.source_id,
          source_page: p.source_page,
          status: p.status,
        },
        { onConflict: "id" }
      )
      .select();

    if (error) {
      console.error(`Erreur pour "${p.title}" :`, error.message);
    } else {
      console.log(`✓ Inséré/Mis à jour : ${p.title}`);
    }
  }

  console.log("Terminé.");
}

main().catch(console.error);
