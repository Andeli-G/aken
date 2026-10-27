import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { foldFrench } from "@/lib/normalize";

export const metadata = { title: "Du français au bulu — Akeñ" };

type Entry = {
  id: number;
  headword: string;
  tone: string | null;
  noun_class: string | null;
  senses: string[];
};

const FETCH_LIMIT = 300; // lignes lues dans la base
const SHOWN = 30; // résultats affichés

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Plus le score est haut, plus la définition « dit » le mot cherché.
function score(entry: Entry, term: string): number {
  const first = foldFrench(entry.senses[0] ?? "");
  const all = foldFrench(entry.senses.join(" "));
  const glosses = first.split(/[,;()]/).map((g) => g.replace(/^(?:(?:le|la|les|un|une|des|du)\s+|l'|d')/, "").trim());
  const word = new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}([^a-z0-9]|$)`);

  if (glosses.some((g) => g === term)) return 100; // la définition est exactement ce mot
  if (glosses.some((g) => g.startsWith(term) && word.test(g))) return 80; // une des gloses commence par ce mot
  if (word.test(first)) return 60; // le mot figure dans la première définition
  if (word.test(all)) return 40; // le mot figure dans une autre définition
  return 10;
}

async function search(term: string): Promise<Entry[]> {
  const { data, error } = await supabase
    .from("entries")
    .select("id, headword, tone, noun_class, senses")
    .ilike("senses_fr", `%${term}%`)
    .limit(FETCH_LIMIT);
  if (error) throw error;
  return data as Entry[];
}

export default async function Francais({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const term = foldFrench(q).replace(/[%_]/g, "");

  let results: Entry[] = [];
  let usedTerm = term; // le mot réellement cherché (singulier si le pluriel ne donne rien)
  let failed = false;

  if (term) {
    try {
      results = await search(term);
      // « maisons » → « maison » si rien n'est trouvé
      if (results.length === 0 && term.length > 3 && /[sx]$/.test(term)) {
        usedTerm = term.slice(0, -1);
        results = await search(usedTerm);
      }
    } catch {
      failed = true;
    }
  }

  const ranked = results
    .map((entry) => ({ entry, score: score(entry, usedTerm) }))
    .sort((a, b) => b.score - a.score || (a.entry.senses[0]?.length ?? 0) - (b.entry.senses[0]?.length ?? 0))
    .slice(0, SHOWN);

  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-serif text-4xl font-semibold text-forest">Du français au bulu</h1>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">
        Cette recherche parcourt les définitions du dictionnaire boulou-français. Ce n’est pas encore un dictionnaire
        français-bulu complet : un mot peut manquer s’il n’apparaît dans aucune définition.
      </p>

      <form action="/francais" className="mt-6 flex gap-2">
        <label htmlFor="q" className="sr-only">Mot français</label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Un mot français, par exemple « maison »"
          className="min-w-0 flex-1 rounded-lg border border-line bg-white px-4 py-3"
        />
        <button type="submit" className="rounded-lg bg-forest px-5 py-3 font-medium text-white hover:bg-forest-mid">
          Chercher
        </button>
      </form>

      <div className="mt-8">
        {!term && <p className="text-ink-soft">Saisissez un mot français pour trouver les mots bulu qui le désignent.</p>}
        {failed && <p className="text-clay">La recherche est momentanément indisponible. Réessayez dans un instant.</p>}
        {term && !failed && ranked.length === 0 && (
          <p className="text-ink-soft">Aucun mot bulu trouvé pour « {q} ». Essayez un synonyme.</p>
        )}

        <ul className="divide-y divide-surface-high">
          {ranked.map(({ entry }) => (
            <li key={entry.id} className="py-5">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <Link
                  href={`/mot/${encodeURIComponent(entry.headword)}`}
                  className="font-serif text-3xl font-semibold text-forest hover:underline"
                >
                  {entry.headword}
                </Link>
                <span className="text-sm text-outline">
                  {[entry.tone && `ton ${entry.tone}`, entry.noun_class && `classe ${entry.noun_class}`].filter(Boolean).join(", ")}
                </span>
              </div>
              <p className="mt-1 max-w-prose font-serif text-lg leading-relaxed text-ink">
                {(entry.senses[0] ?? "").slice(0, 200)}
                {(entry.senses[0] ?? "").length > 200 ? "…" : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
