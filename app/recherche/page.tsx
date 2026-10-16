import { supabase } from "@/lib/supabase";
import { normalize } from "@/lib/normalize";
import EntryCard from "@/components/EntryCard";

type Entry = {
  id: number;
  headword: string;
  tone: string | null;
  phonetic: string | null;
  noun_class: string | null;
  senses: string[];
};

const ROW_LIMIT = 150; // lignes lues dans la base
const WORD_LIMIT = 30; // mots affichés

// Regroupe les entrées qui s'écrivent pareil : un mot -> la liste de ses sens,
// comme un dictionnaire (clé -> valeurs). L'ordre du dictionnaire est conservé.
function groupByHeadword(entries: Entry[]): Map<string, Entry[]> {
  const groups = new Map<string, Entry[]>();
  for (const entry of entries) {
    const list = groups.get(entry.headword) ?? [];
    list.push(entry);
    groups.set(entry.headword, list);
  }
  return groups;
}

export default async function Recherche({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const term = normalize(q).replace(/[%_]/g, "");

  let words: [string, Entry[]][] = [];
  let failed = false;

  if (term) {
    const { data, error } = await supabase
      .from("entries")
      .select("id, headword, tone, phonetic, noun_class, senses")
      .ilike("headword_norm", `${term}%`)
      .order("headword_norm")
      .order("id")
      .limit(ROW_LIMIT);

    if (error) {
      failed = true;
    } else {
      words = [...groupByHeadword(data as Entry[])];
      // Si la lecture a atteint la limite, le dernier mot est peut-être incomplet : on l'écarte.
      if (data.length === ROW_LIMIT) words.pop();
      words = words.slice(0, WORD_LIMIT);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <form action="/recherche" className="flex gap-2">
        <label htmlFor="q" className="sr-only">Mot à rechercher</label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Un mot bulu"
          className="min-w-0 flex-1 rounded-lg border border-line bg-white px-4 py-3"
        />
        <button
          type="submit"
          className="rounded-lg bg-forest px-5 py-3 font-medium text-white hover:bg-forest-mid"
        >
          Chercher
        </button>
      </form>

      <div className="mt-8">
        {!term && (
          <p className="text-ink-soft">Saisissez un mot ou le début d'un mot pour lancer la recherche.</p>
        )}
        {failed && (
          <p className="text-clay">La recherche est momentanément indisponible. Réessayez dans un instant.</p>
        )}
        {term && !failed && words.length === 0 && (
          <p className="text-ink-soft">Aucun mot ne commence par « {q} ». Essayez avec moins de lettres.</p>
        )}

        <ul className="divide-y divide-surface-high">
          {words.map(([headword, homographs]) => (
            <EntryCard key={headword} headword={headword} homographs={homographs} />
          ))}
        </ul>
      </div>
    </section>
  );
}