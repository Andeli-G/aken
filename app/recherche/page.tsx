import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { normalize } from "@/lib/normalize";
import EntryCard from "@/components/EntryCard";
import SearchBox from "@/components/SearchBox";

type Entry = {
  id: number;
  headword: string;
  tone: string | null;
  phonetic: string | null;
  noun_class: string | null;
  senses: string[];
};

// Nombre d'entrées par page (permet d'afficher plus de 30 mots tout en restant fluide et rapide)
const ROWS_PER_PAGE = 45;

// Lettres de l'alphabet bulu
const LETTERS = "ABDEFGHIJKLMNOPSTUVWYZ".split("");

// Mots phares de la culture et de la sagesse bulu pour guider le lecteur
const LANDMARK_WORDS = [
  { word: "Akeñ", tag: "éponyme", meaning: "intelligence, savoir-faire", tone: "h" },
  { word: "Mvôé", tag: "fraternité", meaning: "paix, ami, allié", tone: "h" },
  { word: "Atyeñ", tag: "sagacité", meaning: "habileté, esprit avisé", tone: "h" },
  { word: "Ngana", tag: "tradition", meaning: "proverbe, sagesse orale", tone: "h" },
  { word: "Kalate", tag: "savoir", meaning: "livre, écrit, science", tone: "b" },
];

function groupByHeadword(entries: Entry[]): Map<string, Entry[]> {
  const groups = new Map<string, Entry[]>();
  for (const entry of entries) {
    const list = groups.get(entry.headword) ?? [];
    list.push(entry);
    groups.set(entry.headword, list);
  }
  return groups;
}

// Calcule les numéros de page à afficher (avec points de suspension si nécessaire)
function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default async function Recherche({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const term = normalize(q).replace(/[%_]/g, "");
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);

  let words: [string, Entry[]][] = [];
  let totalCount = 0;
  let totalPages = 1;
  let failed = false;

  const isSingleLetter = term.length === 1 && LETTERS.includes(term.toUpperCase());
  const currentLetter = isSingleLetter ? term.toUpperCase() : null;
  const letterIndex = currentLetter ? LETTERS.indexOf(currentLetter) : -1;
  const prevLetter = letterIndex > 0 ? LETTERS[letterIndex - 1] : null;
  const nextLetter = letterIndex >= 0 && letterIndex < LETTERS.length - 1 ? LETTERS[letterIndex + 1] : null;

  if (term) {
    const from = (pageNumber - 1) * ROWS_PER_PAGE;
    const to = from + ROWS_PER_PAGE - 1;

    const { data, count, error } = await supabase
      .from("entries")
      .select("id, headword, tone, phonetic, noun_class, senses", { count: "exact" })
      .ilike("headword_norm", `${term}%`)
      .eq("status", "published")
      .order("headword_norm")
      .order("id")
      .range(from, to);

    if (error) {
      failed = true;
    } else {
      totalCount = count ?? 0;
      totalPages = Math.max(1, Math.ceil(totalCount / ROWS_PER_PAGE));
      words = [...groupByHeadword((data ?? []) as Entry[])];
    }
  }

  const startEntry = totalCount > 0 ? (pageNumber - 1) * ROWS_PER_PAGE + 1 : 0;
  const endEntry = Math.min(pageNumber * ROWS_PER_PAGE, totalCount);

  return (
    <section className="mx-auto max-w-3xl px-5 py-10 sm:py-14 relative z-10">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-forest sm:text-4xl">
          Consulter le dictionnaire
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Parcourez le dictionnaire lettre par lettre ou cherchez directement un mot en bulu.
        </p>
      </div>

      <SearchBox initialValue={q} placeholder="Chercher un mot (ex. akeñ, mvôé, kalate...)" />

      {/* Ruban horizontal des 22 lettres pour feuilleter facilement le dictionnaire */}
      <div className="mt-6 border-b border-surface-high/80 pb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-outline">
          Parcourir par initiale
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {LETTERS.map((letter) => {
            const isActive = currentLetter === letter;
            return (
              <li key={letter}>
                <Link
                  href={`/recherche?q=${letter}&page=1`}
                  className={`flex h-8 w-8 items-center justify-center rounded-md font-serif text-sm transition ${
                    isActive
                      ? "bg-forest text-white font-semibold shadow-xs"
                      : "bg-white border border-surface-high text-forest hover:bg-clay-soft/50 hover:border-clay/40"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {letter}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8">
        {!term && (
          <div className="space-y-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-clay">
                Mots repères pour débuter
              </p>
              <p className="mt-1 text-xs text-outline">
                Quelques notions clés de la langue et de la pensée bulu :
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {LANDMARK_WORDS.map((item) => (
                  <Link
                    key={item.word}
                    href={`/mot/${encodeURIComponent(item.word)}`}
                    className="flex flex-col rounded-xl border border-surface-high bg-white p-4 transition hover:border-clay/40 hover:bg-surface-low/40"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-serif text-xl font-semibold text-forest">
                        {item.word}
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-wide text-clay">
                        {item.tag}
                      </span>
                    </div>
                    <p className="mt-1 font-serif text-sm italic text-ink-soft">
                      {item.meaning}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-surface-high bg-surface-low/40 p-6">
              <h2 className="font-serif text-lg font-semibold text-forest">
                Parcours complet du dictionnaire
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                Choisissez une lettre ci-dessus pour feuilleter l’ensemble de ses entrées.
                Vous pourrez naviguer page par page jusqu’à la lettre suivante pour explorer
                l’intégralité de l’ouvrage.
              </p>
            </div>
          </div>
        )}

        {failed && (
          <p className="rounded-xl border border-clay-soft bg-clay-soft/20 p-4 text-sm text-clay">
            La consultation est momentanément indisponible. Réessayez dans un instant.
          </p>
        )}

        {term && !failed && words.length === 0 && (
          <div className="rounded-2xl border border-surface-high bg-white p-8 text-center">
            <p className="font-serif text-xl text-forest">
              Aucune entrée trouvée pour « {q} »
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              Essayez avec moins de lettres, ou vérifiez l’orthographe avec les caractères bulu proposés ci-dessus.
            </p>
            <div className="mt-6">
              <Link
                href="/recherche"
                className="text-xs font-medium text-clay hover:underline"
              >
                ← Réinitialiser la recherche
              </Link>
            </div>
          </div>
        )}

        {term && words.length > 0 && (
          <div>
            {/* En-tête des résultats et positionnement dans le dictionnaire */}
            <div className="mb-6 rounded-xl border border-surface-high/60 bg-white p-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  {isSingleLetter ? (
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-semibold text-forest">
                        Lettre {currentLetter}
                      </span>
                      <span className="text-xs text-outline">
                        · {totalCount.toLocaleString("fr-FR")} entrées
                      </span>
                    </div>
                  ) : (
                    <p className="font-serif text-lg text-forest">
                      Résultats pour « <span className="font-semibold">{q}</span> »
                    </p>
                  )}
                  <p className="text-xs text-outline mt-0.5">
                    Entrées {startEntry} à {endEntry} sur {totalCount.toLocaleString("fr-FR")}
                    {totalPages > 1 && ` · Page ${pageNumber} sur ${totalPages}`}
                  </p>
                </div>

                {/* Liens de saut vers lettres précédente et suivante */}
                {isSingleLetter && (
                  <div className="flex items-center gap-4 text-xs font-medium text-forest">
                    {prevLetter ? (
                      <Link
                        href={`/recherche?q=${prevLetter}&page=1`}
                        className="hover:text-clay transition-colors"
                      >
                        ← Lettre {prevLetter}
                      </Link>
                    ) : (
                      <span className="text-line">Première lettre</span>
                    )}
                    <span className="text-line">·</span>
                    {nextLetter ? (
                      <Link
                        href={`/recherche?q=${nextLetter}&page=1`}
                        className="hover:text-clay transition-colors"
                      >
                        Lettre {nextLetter} →
                      </Link>
                    ) : (
                      <span className="text-line">Dernière lettre</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Liste paginée des mots */}
            <ul className="divide-y divide-surface-high bg-white/70 rounded-2xl border border-surface-high px-6 shadow-xs">
              {words.map(([headword, homographs]) => (
                <EntryCard key={headword} headword={headword} homographs={homographs} />
              ))}
            </ul>

            {/* Barre de pagination multi-pages */}
            {totalPages > 1 && (
              <nav
                aria-label="Pagination des entrées"
                className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-surface-high bg-white p-4 shadow-xs"
              >
                {/* Bouton Précédent */}
                {pageNumber > 1 ? (
                  <Link
                    href={`/recherche?q=${encodeURIComponent(q)}&page=${pageNumber - 1}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-surface-high bg-surface-low px-3 py-1.5 text-xs font-medium text-forest hover:bg-clay-soft/50 hover:border-clay/40 transition"
                  >
                    <span>←</span>
                    <span>Page précédente</span>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-line/30 bg-surface-low/30 px-3 py-1.5 text-xs font-medium text-outline/50 cursor-not-allowed">
                    <span>←</span>
                    <span>Page précédente</span>
                  </span>
                )}

                {/* Numéros de page */}
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {getPageNumbers(pageNumber, totalPages).map((p, idx) => {
                    if (p === "...") {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-2 text-xs text-outline">
                          …
                        </span>
                      );
                    }
                    const isCurrent = p === pageNumber;
                    return (
                      <Link
                        key={`page-${p}`}
                        href={`/recherche?q=${encodeURIComponent(q)}&page=${p}`}
                        className={`flex h-8 min-w-8 px-2 items-center justify-center rounded-md text-xs font-serif transition ${
                          isCurrent
                            ? "bg-forest text-white font-semibold"
                            : "bg-surface-low text-forest border border-surface-high hover:bg-clay-soft/50 hover:border-clay/40"
                        }`}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        {p}
                      </Link>
                    );
                  })}
                </div>

                {/* Bouton Suivant */}
                {pageNumber < totalPages ? (
                  <Link
                    href={`/recherche?q=${encodeURIComponent(q)}&page=${pageNumber + 1}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-surface-high bg-surface-low px-3 py-1.5 text-xs font-medium text-forest hover:bg-clay-soft/50 hover:border-clay/40 transition"
                  >
                    <span>Page suivante</span>
                    <span>→</span>
                  </Link>
                ) : nextLetter ? (
                  <Link
                    href={`/recherche?q=${nextLetter}&page=1`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-clay/40 bg-clay-soft/40 px-3 py-1.5 text-xs font-medium text-clay hover:bg-clay-soft transition"
                  >
                    <span>Lettre suivante ({nextLetter})</span>
                    <span>→</span>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-line/30 bg-surface-low/30 px-3 py-1.5 text-xs font-medium text-outline/50 cursor-not-allowed">
                    <span>Page suivante</span>
                    <span>→</span>
                  </span>
                )}
              </nav>
            )}

            {/* Note en fin de lettre pour continuer le parcours fluide */}
            {isSingleLetter && pageNumber === totalPages && nextLetter && (
              <div className="mt-8 rounded-2xl border border-surface-high bg-surface-low/50 p-6 text-center">
                <p className="font-serif text-lg text-forest">
                  Fin des entrées pour la lettre {currentLetter}
                </p>
                <p className="mt-1 text-xs text-outline">
                  Poursuivez la découverte du dictionnaire avec les mots commençant par {nextLetter}.
                </p>
                <div className="mt-4">
                  <Link
                    href={`/recherche?q=${nextLetter}&page=1`}
                    className="inline-flex items-center gap-2 rounded-lg bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-forest-mid transition shadow-xs"
                  >
                    <span>Explorer la lettre {nextLetter}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}