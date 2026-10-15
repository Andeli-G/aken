// Importe les entrées du dictionnaire dans Supabase, en pouvant REPRENDRE après une coupure.
//
// Lancer depuis le dossier du projet :
//   node --env-file=.env.local scripts/import-entries.mjs
//
// Le fichier .env.local doit contenir :
//   SUPABASE_URL=...
//   SUPABASE_SECRET_KEY=sb_secret_...   (clé secrète : ne jamais la partager ni la mettre dans le frontend)
//   (l'ancien nom SUPABASE_SERVICE_ROLE_KEY fonctionne aussi, avec l'ancienne clé service_role)
//
// Principe : avant chaque paquet, le script demande à la base combien d'entrées sont déjà
// enregistrées et reprend exactement à partir de là. On peut donc le relancer sans risque
// de doublons, même si la connexion a été coupée en plein milieu.

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const SOURCE_TITLE = "Dictionnaire bulu-français (référence à confirmer)";
const BATCH_SIZE = 250;
const MAX_ERRORS = 5; // nombre d'échecs consécutifs avant d'abandonner

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

// 2. Lire le fichier JSON produit par extract_dictionary.py
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

// 3. Envoyer par paquets, en reprenant là où la base s'est arrêtée
let errors = 0;
let first = true;
while (true) {
  const { count: done, error: countError } = await supabase
    .from("entries")
    .select("id", { count: "exact", head: true })
    .eq("source_id", source.id);

  if (countError) {
    errors++;
    console.warn(`Connexion instable (${errors}/${MAX_ERRORS}) : ${countError.message}`);
    if (errors >= MAX_ERRORS) process.exit(1);
    await sleep(2000 * errors);
    continue;
  }

  if (done > rows.length) {
    console.error(`La base contient ${done} entrées pour ${rows.length} attendues : vérifier les doublons.`);
    process.exit(1);
  }
  if (done === rows.length) break;
  if (first && done > 0) console.log(`Reprise : ${done} entrées déjà enregistrées.`);
  first = false;

  const batch = rows.slice(done, done + BATCH_SIZE);
  const { error } = await supabase.from("entries").insert(batch);
  if (error) {
    errors++;
    console.warn(`Échec du paquet (${errors}/${MAX_ERRORS}) : ${error.message}. Nouvel essai...`);
    if (errors >= MAX_ERRORS) {
      console.error("Trop d'échecs consécutifs : arrêt. Relancer le script reprendra à cet endroit.");
      process.exit(1);
    }
    await sleep(2000 * errors);
    continue;
  }
  errors = 0;
  console.log(`${done + batch.length} / ${rows.length}`);
}
console.log(`Import terminé : ${rows.length} entrées en base.`);
