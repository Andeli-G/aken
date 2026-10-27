import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SearchBox from "@/components/SearchBox";
import ToneCurve from "@/components/ToneCurve";
import AkenNotice from "@/components/AkenNotice";
import ToneGuide from "@/components/ToneGuide";
import Logo from "@/components/Logo";

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

  return (
    <>
      {/* En-tête éditorial et barre de recherche */}
      <section className="mx-auto max-w-3xl px-5 pt-14 pb-10 text-center sm:pt-20 sm:pb-16">
        <p className="font-serif text-sm italic tracking-wide text-clay sm:text-base">
          « Se sentir en paix, accueillir une autre forme d’intelligence. »
        </p>

        <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight text-forest sm:text-6xl">
          Retrouvez les mots,
          <br />
          découvrez la langue bulu.
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          Cherchez un mot pour en écouter les tons, comprendre ses nuances
          et explorer un trésor linguistique du Cameroun.
        </p>

        <div className="mx-auto mt-8 max-w-xl">
          <SearchBox placeholder="Un mot bulu, par exemple « mvoé »" centered />
        </div>
      </section>

      {/* Notice de l'entrée fondatrice : Akeñ */}
      <section className="mx-auto max-w-3xl px-5 pb-16 sm:pb-20">
        <AkenNotice />
      </section>

      {/* Mot du jour */}
      {word && (
        <section aria-labelledby="mot-du-jour" className="bg-surface-low/60 py-16 sm:py-24 border-y border-surface-high/50">
          <div className="mx-auto max-w-3xl px-5">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-clay">Mot du jour</p>
                <p className="mt-1 text-sm capitalize text-outline">{dateLabel}</p>
              </div>
              <span className="text-xs text-outline italic">Tiré des ouvrages de référence</span>
            </div>

            <div className="mt-8 rounded-2xl border border-surface-high bg-white p-8 sm:p-12 shadow-[0_2px_16px_rgba(13,56,41,0.03)]">
              <div className="flex flex-wrap items-baseline gap-4">
                <h2 id="mot-du-jour" className="font-serif text-4xl font-semibold leading-tight text-forest sm:text-6xl">
                  {word.headword}
                </h2>
                {word.phonetic && (
                  <span className="font-serif text-xl text-ink-soft sm:text-2xl">
                    /{word.phonetic}/
                  </span>
                )}
                {word.tone && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-low px-3 py-1 text-xs text-forest">
                    <span>ton {word.tone}</span>
                    <ToneCurve tone={word.tone} size="sm" />
                  </div>
                )}
                {word.noun_class && (
                  <span className="rounded-full bg-surface-low px-2.5 py-0.5 text-xs text-outline">
                    classe {word.noun_class}
                  </span>
                )}
              </div>

              <p className="mt-8 font-serif text-2xl leading-relaxed text-ink">
                {word.senses[0]}
              </p>

              {word.examples[0] && (
                <div className="mt-8 border-l-2 border-clay-soft pl-4">
                  <p className="font-serif text-xl italic leading-relaxed text-ink-soft">
                    {word.examples[0]}
                  </p>
                </div>
              )}

              <div className="mt-10 pt-6 border-t border-surface-high flex items-center justify-between">
                <Link
                  href={`/mot/${encodeURIComponent(word.headword)}`}
                  className="font-medium text-forest hover:text-clay transition-colors inline-flex items-center gap-1.5 text-sm"
                >
                  <span>Consulter la fiche complète</span>
                  <span>→</span>
                </Link>
                <span className="text-xs text-outline">Mis à jour quotidiennement</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Repère culturel : la musique des tons */}
      <section className="mx-auto max-w-3xl px-5 py-14">
        <ToneGuide />
      </section>

      {/* Parcourir par initiale */}
      <section className="mx-auto max-w-3xl px-5 py-12 text-center">
        <h2 className="font-serif text-2xl font-semibold text-forest">Parcourir par initiale</h2>
        <p className="mx-auto mt-2 max-w-md text-xs text-outline">
          L’alphabet bulu réunit 22 lettres fondamentales, excluant le C, le Q, le R et le X.
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {LETTERS.map((letter) => (
            <li key={letter}>
              <Link
                href={`/recherche?q=${letter}&page=1`}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-high bg-white font-serif text-lg text-forest transition hover:bg-clay-soft/50 hover:border-clay/40"
              >
                {letter}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Colophon calme de transmission (espace de recueillement, aucun compteur qui presse) */}
      <section className="bg-forest py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-5">
          <Logo size={40} className="mx-auto mb-6 text-white opacity-90" />
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Un travail patient de mémoire et de transmission
          </h2>
          <p className="mt-4 leading-relaxed text-forest-soft text-sm sm:text-base">
            Akeñ préserve et partage plus de {total.toLocaleString("fr-FR")} entrées issues des dictionnaires
            et travaux de référence sur la langue bulu. Chaque mot est rattaché à son ouvrage d’origine
            et à sa page, avec le plus profond respect pour les auteurs qui ont fixé cette tradition.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/sources"
              className="font-medium text-white underline underline-offset-4 hover:text-clay-soft transition-colors"
            >
              Découvrir les sources et auteurs
            </Link>
            <span className="text-forest-soft">·</span>
            <Link
              href="/recherche"
              className="font-medium text-white underline underline-offset-4 hover:text-clay-soft transition-colors"
            >
              Explorer le dictionnaire complet
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
