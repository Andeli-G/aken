// Importe dans la table proverbs les proverbes trouvés dans le dictionnaire (data/processed/proverbs_dictionary.json).
//
//   node --env-file=.env.local scripts/import-dictionary-proverbs.mjs
//
// Ils arrivent en BROUILLON : relis-les dans le Table Editor de Supabase, corrige si besoin,
// puis publie ceux que tu valides (status = published). Relancer le script n'écrase rien.

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const SOURCE_TITLES = [
  "Dictionnaire boulou-français, français-boulou, avec grammaire", // après source_dictionnaire.sql
  "Dictionnaire bulu-français (référence à confirmer)", // avant
];

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data: sources, error: sourceError } = await supabase.from("sources").select("id, title").in("title", SOURCE_TITLES);
if (sourceError || !sources?.length) {
  console.error("Source du dictionnaire introuvable.", sourceError?.message ?? "");
  process.exit(1);
}
const source = sources[0];

const items = JSON.parse(readFileSync("data/processed/proverbs_dictionary.json", "utf-8"));

// Une précision d'un seul mot (« Prudence ») est un thème ; sinon c'est une explication donnée par le dictionnaire.
const isTheme = (note) => note && /^[A-ZÀ-Þ][\wÀ-ÿ’' -]{2,30}$/.test(note) && !note.includes(" ");

const rows = items.map((p) => ({
  slug: `dico-${p.slug}`,
  title: p.headword, // l'entrée du dictionnaire où le proverbe figure
  bulu: p.bulu,
  french: p.french,
  french_by: "author",
  theme: isTheme(p.note) ? p.note : null,
  theme_category: null,
  author_commentary: p.note && !isTheme(p.note) ? p.note : null, // explication donnée par le dictionnaire
  editor_note: null,
  equivalents: [],
  source_id: source.id,
  source_page: null, // les pages de la base sont celles du fichier, pas du livre imprimé
  status: "draft",
}));

const { data, error } = await supabase.from("proverbs").upsert(rows, { onConflict: "slug", ignoreDuplicates: true }).select("slug");
if (error) {
  console.error("Erreur :", error.message);
  process.exit(1);
}
console.log(`${data.length} proverbe(s) ajouté(s) en brouillon, ${rows.length - data.length} déjà présent(s).`);
