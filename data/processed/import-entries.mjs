// Importe les entrées du dictionnaire dans Supabase.
//
// Lancer depuis le dossier du projet :
//   node --env-file=.env.local scripts/import-entries.mjs
//
// Le fichier .env.local doit contenir :
//   SUPABASE_URL=...
//   SUPABASE_SECRET_KEY=sb_secret_...   (clé secrète : ne jamais la partager ni la mettre dans le frontend)
//   (l'ancien nom SUPABASE_SERVICE_ROLE_KEY fonctionne aussi, avec l'ancienne clé service_role)

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const SOURCE_TITLE = "Dictionnaire bulu-français (référence à confirmer)";
const BATCH_SIZE = 500;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Version "simplifiée" d'un mot pour la recherche : sans tons, sans accents, en minuscules.
function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // retire les accents et marques de ton
    .replace(/ɔ/g, "o")
    .replace(/[ǝɛ]/g, "e")
    .replace(/ŋ/g, "n")
    .replace(/['’‘]/g, "")
    .toLowerCase()
    .trim();
}

// 1. Trouver la source à laquelle rattacher les entrées
const { data: source, error: sourceError } = await supabase
  .from("sources")
  .select("id")
  .eq("title", SOURCE_TITLE)
  .single();
if (sourceError) throw sourceError;

// 2. Ne pas importer deux fois
const { count } = await supabase
  .from("entries")
  .select("id", { count: "exact", head: true })
  .eq("source_id", source.id);
if (count > 0) {
  console.log(`Déjà ${count} entrées pour cette source : import annulé.`);
  process.exit(0);
}

// 3. Lire le fichier JSON produit par extract_dictionary.py
const entries = JSON.parse(readFileSync("data/processed/entries.json", "utf-8"));

const rows = entries.map((e) => ({
  kind: "word",
  headword: e.headword,
  headword_norm: normalize(e.headword),
  tone: e.tone,
  plural_prefix: e.plural_prefix,
  noun_class: e.noun_class,
  pos: e.pos,
  phonetic: e.phonetic,
  senses: e.senses,
  examples: e.examples,
  cross_refs: e.cross_refs,
  raw: e.raw,
  source_id: source.id,
  source_page: e.page,
  status: "draft", // rien n'est public tant que l'admin n'a pas publié
}));

// 4. Envoyer par paquets
for (let i = 0; i < rows.length; i += BATCH_SIZE) {
  const batch = rows.slice(i, i + BATCH_SIZE);
  const { error } = await supabase.from("entries").insert(batch);
  if (error) {
    console.error(`Erreur au paquet commençant à ${i} :`, error.message);
    process.exit(1);
  }
  console.log(`${Math.min(i + BATCH_SIZE, rows.length)} / ${rows.length}`);
}
console.log("Import terminé.");
