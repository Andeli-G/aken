import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SearchBox from "@/components/SearchBox";

// La page est recalculée au plus toutes les heures : le mot du jour change donc à minuit (heure du Cameroun, à une heure près).
export const revalidate = 3600;

// Lettres de l'alphabet bulu (sans C, Q, R, X)
const LETTERS = "ABDEFGHIJKLMNOPSTUVWYZ".split("");

type Entry = {
  id: number;
  headword: string;
  tone: string | null;
  phonetic: string | null;
  noun_class: string | null;
  senses: string[];
  examples: string[];
};

const FIELDS = "id, headword, tone, phonetic, noun_class, senses, examples";

// Transforme une date en nombre : le même jour donne toujours le même nombre.
function dayNumber(day: string): number {
  let n = 0;
  for (const ch of day) n = (n * 31 + ch.charCodeAt(0)) % 1_000_003;
  return n;
}

async function getWordOfTheDay(today: string, total: number): Promise<Entry | null> {
  // 1. Le choix de l'administratrice, s'il existe pour aujourd'hui
  const { data: chosen } = await supabase
    .from("daily_content")
    .select("entry_id")
    .eq("kind", "word_of_day")
    .eq("publish_date", today)
    .eq("status", "published")
    .maybeSingle();

  if (chosen?.entry_id) {
    const { data } = await supabase.from("entries").select(FIELDS).eq("id", chosen.entry_id).maybeSingle();
    if (data) return data as Entry;
  }

  // 2. Sinon, choix automatique parmi les mots publiés
  if (total === 0) return null;
  const start = dayNumber(today) % total;
  const { data } = await supabase
    .from("entries")
    .select(FIELDS)
    .eq("status", "published")
    .order("id")
    .range(start, start + 9);
  return ((data ?? []) as Entry[]).find((e) => e.senses.length > 0) ?? null;
}

export default async function Home() {
  const now = new Date();
  // Date du jour au Cameroun, au format 2026-10-16
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Africa/Douala" }).format(now);
  const dateLabel = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeZone: "Africa/Douala" }).format(now);

  const { count } = await supabase
    .from("entries")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");
  const total = count ?? 0;

  const word = await getWordOfTheDay(today, total);

  const meta = word
    ? [
        word.noun_class && `classe ${word.noun_class}`,
        word.tone && `ton ${word.tone}`,
        word.phonetic && `/${word.phonetic}/`,
      ].filter(Boolean)
    : [];

  return (
    <>
      <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-24">
        <Link
          href={`/mot/${encodeURIComponent("Akeñ")}`}
          className="inline-block text-xs font-semibold uppercase tracking-widest text-clay hover:underline"
        >
          Akeñ · intelligence
        </Link>
        <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight tracking-tight text-forest sm:text-6xl">
          Retrouvez les mots,
          <br />
          découvrez la langue bulu.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
          Cherchez un mot bulu pour en connaître le sens, le ton, la prononciation et des exemples.
        </p>
        <div className="mx-auto mt-10 max-w-xl">
          <SearchBox placeholder="Un mot bulu, par exemple « mvoé »" centered />
        </div>
      </section>

      {word && (
        <section aria-labelledby="mot-du-jour" className="bg-surface-low py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-clay">Mot du jour</p>
            <p className="mt-2 text-sm capitalize text-outline">{dateLabel}</p>

            <div className="mt-8 rounded-2xl border border-surface-high bg-white p-8 sm:p-12">
              <h2 id="mot-du-jour" className="font-serif text-5xl font-semibold leading-tight text-forest sm:text-6xl">
                {word.headword}
              </h2>
              {meta.length > 0 && <p className="mt-3 text-sm text-ink-soft">{meta.join(" · ")}</p>}
              <p className="mt-8 font-serif text-2xl leading-relaxed">{word.senses[0]}</p>
              {word.examples[0] && (
                <p className="mt-8 border-l-2 border-clay-soft pl-4 font-serif text-xl italic leading-relaxed">
                  {word.examples[0]}
                </p>
              )}
              <Link
                href={`/mot/${encodeURIComponent(word.headword)}`}
                className="mt-10 inline-block font-medium text-forest hover:underline"
              >
                Voir la fiche complète →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-5 py-14 text-center">
        <h2 className="font-serif text-2xl font-semibold text-forest">Parcourir par initiale</h2>
        <ul className="mt-5 flex flex-wrap justify-center gap-1.5">
          {LETTERS.map((letter) => (
            <li key={letter}>
              <Link
                href={`/recherche?q=${letter}`}
                className="block min-w-9 rounded-md border border-surface-high bg-surface-low px-2.5 py-1.5 font-serif text-lg text-forest hover:bg-clay-soft"
              >
                {letter}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-forest py-14 text-center text-white">
        <div className="mx-auto max-w-3xl px-5">
          <p className="font-serif text-5xl font-semibold">{total.toLocaleString("fr-FR")}</p>
          <p className="mt-1 text-forest-soft">entrées consultables</p>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-forest-soft">
            Akeñ rassemble des ouvrages de référence sur la langue bulu, avec leurs auteurs.
          </p>
          <Link href="/sources" className="mt-5 inline-block font-medium underline underline-offset-4 hover:text-white">
            Sources et auteurs
          </Link>
        </div>
      </section>
    </>
  );
}
