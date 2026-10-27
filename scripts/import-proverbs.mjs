// Importe les proverbes dans la table proverbs de Supabase.
//
// Lancer depuis le dossier du projet (après avoir exécuté 20261018_proverbs.sql) :
//   node --env-file=.env.local scripts/import-proverbs.mjs
//
// Il lit data/processed/proverbs.json (fichier privé, ignoré par Git) et applique les corrections d'attribution :
//  - l'ancien champ « commentary » (mélange du texte de l'auteur et d'ajouts) n'est PAS importé ;
//  - les ajouts qui ne figuraient pas dans l'article sont retirés ;
//  - la formulation française du proverbe 7 est marquée comme formulation d'Akeñ.
// Les proverbes déjà présents sont ignorés : relancer le script n'écrase jamais tes modifications.

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const SOURCE_TITLE = "Proverbes bulu";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Résumés courts, dans nos propres mots, de ce que dit l'auteur (le texte de l'article n'est pas recopié).
const AUTHOR_SUMMARIES = {
  "same-same-a-nga-toe-eves":
    "Selon l'auteur, qui lit ce proverbe dans le cadre du repas communautaire, celui qui hésite à choisir ou veut tout avoir risque de se retrouver avec presque rien : le proverbe condamne l'indécision.",
  "te-wua-ofukaa-si-te-tobane-kuna-nsen":
    "Selon l'auteur, ce proverbe enseigne qu'un bien que l'on tient vaut mieux qu'un espoir plus grand mais incertain.",
  "ngoe-a-nga-sup-minlak-ndom-nyan-ebili":
    "Selon l'auteur, le cochon a perdu les avantages que détenait son oncle maternel par excès de confiance et lenteur : il faut profiter de l'occasion quand elle se présente, et ne pas compter sur un bien qu'on ne possède pas encore.",
  "a-bo-ke-a-boo-na-otele-kindii-yai-wo-na-osoe-kpwa":
    "Selon l'auteur, il ne faut pas crier victoire au stade des projets : la communauté voudra vérifier, et prendra pour un mensonge un succès annoncé trop tôt.",
  "abim-otonon-abim-te-dumba":
    "Selon l'auteur, ce proverbe se résume à la nécessité de connaître ses propres limites.",
  "mot-a-ne-te-tyele-mfek-eza-nte":
    "L'auteur le cite à la suite de « à petit oiseau, petit nid », comme une formulation de la même idée : chacun doit rester à sa place et à sa mesure.",
  "bijo-bi-ebon-ojo-moyon-obaale-enjoe":
    "Selon l'auteur, l'accent est mis sur l'hypocrisie : reprocher à autrui ce que l'on fait soi-même en secret. Il le rapproche de la paille et de la poutre dans l'œil.",
};

const { data: source, error: sourceError } = await supabase
  .from("sources")
  .select("id")
  .eq("title", SOURCE_TITLE)
  .single();
if (sourceError) {
  console.error("Source introuvable : as-tu exécuté 20261018_proverbs.sql ?", sourceError.message);
  process.exit(1);
}

const proverbs = JSON.parse(readFileSync("data/processed/proverbs.json", "utf-8"));

const rows = proverbs.map((p) => {
  let equivalents = p.equivalents ?? [];

  // Équivalents ajoutés qui ne figurent pas dans l'article
  if (p.slug === "mot-a-ne-te-tyele-mfek-eza-nte") equivalents = [];
  if (p.slug === "ngoe-a-nga-sup-minlak-ndom-nyan-ebili") {
    equivalents = equivalents.map((eq) => {
      if (eq.language !== "Chinois") return eq;
      const { translation, ...rest } = eq; // on retire la traduction ajoutée
      return rest;
    });
  }

  return {
    slug: p.slug,
    title: p.title,
    bulu: p.bulu,
    phonetic: p.phonetic ?? null,
    french: p.french,
    french_by: p.slug === "bijo-bi-ebon-ojo-moyon-obaale-enjoe" ? "akene" : "author",
    theme: p.theme,
    theme_category: p.theme_category,
    author_commentary: AUTHOR_SUMMARIES[p.slug] ?? null,
    editor_note: null,
    equivalents,
    source_id: source.id,
    source_page: p.source_page ?? null,
    status: "published",
  };
});

console.log(`Lecture de ${rows.length} proverbes...`);
const { data, error } = await supabase
  .from("proverbs")
  .upsert(rows, { onConflict: "slug", ignoreDuplicates: true })
  .select("slug");

if (error) {
  console.error("Erreur :", error.message);
  process.exit(1);
}
console.log(`${data.length} proverbe(s) ajouté(s), ${rows.length - data.length} déjà présent(s).`);
