import Link from "next/link";
import { getProverbs, type Proverb } from "@/lib/proverbs";

export const metadata = {
  title: "Ngana — Proverbes bulu · Akeñ",
  description:
    "Proverbes et maximes de la tradition orale bulu, avec traductions, commentaires et correspondances universelles.",
};

// Seule une source confirmée est nommée ; sinon on le dit.
function sourceLabel(p: Proverb): string {
  const s = p.sources;
  if (!s || s.status !== "confirmed") return "source en cours de vérification";
  const who = s.authors ?? s.title;
  return p.source_page ? `${who}, p. ${p.source_page}` : who;
}

const THEMES = [
  { id: "all", label: "Tous les proverbes" },
  { id: "social", label: "Vie sociale & Communauté" },
  { id: "animal", label: "Le règne animal" },
  { id: "endurance", label: "Prévoyance & Endurance" },
];

export default async function ProverbsPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string }>;
}) {
  const { theme = "all" } = await searchParams;
  const proverbs = await getProverbs(theme);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16 relative z-10">
      {/* En-tête éditorial */}
      <header className="border-b border-surface-high/80 pb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-clay">
          <span>Littérature orale</span>
          <span>·</span>
          <span>Ngana</span>
        </div>

        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-forest sm:text-5xl">
          Proverbes bulu
        </h1>

        <p className="mt-4 font-serif text-lg italic text-forest/90 leading-relaxed sm:text-xl">
          « Le proverbe africain naît de l’expérience empirique »
          <span className="not-italic text-sm text-outline"> — Maxime Meto’o</span>
        </p>

        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Ces proverbes viennent d’ouvrages publiés : chaque carte indique sa source. Le commentaire de l’auteur
          est présenté séparément de nos propres notes, et les thèmes de classement sont ceux d’Akeñ. Voir{" "}
          <Link href="/sources" className="underline underline-offset-4 hover:text-forest">
            Sources et auteurs
          </Link>
          .
        </p>

        {/* Filtres par thèmes */}
        <nav aria-label="Filtrer par thème" className="mt-8 flex flex-wrap gap-2">
          {THEMES.map((t) => {
            const isActive = theme === t.id;
            return (
              <Link
                key={t.id}
                href={`/proverbes${t.id === "all" ? "" : `?theme=${t.id}`}`}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? "bg-forest text-white shadow-xs"
                    : "bg-surface-low border border-surface-high text-forest hover:bg-clay-soft/50 hover:border-clay/40"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Liste ordonnée des proverbes */}
      <div className="mt-12 space-y-12">
        {proverbs.length === 0 && (
          <p className="text-center text-ink-soft">Aucun proverbe à afficher pour le moment.</p>
        )}
        {proverbs.map((p, idx) => (
          <article
            key={p.id}
            id={p.slug}
            className="rounded-2xl border border-surface-high bg-white p-7 sm:p-10 shadow-[0_2px_18px_rgba(13,56,41,0.03)]"
          >
            {/* Métadonnées : thème et pagination source */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-high/60 pb-4">
              {p.theme ? (
                <span className="rounded-full bg-clay-soft/60 px-3 py-0.5 text-xs font-medium text-clay">
                  {p.theme}
                </span>
              ) : (
                <span />
              )}
              <span className="text-xs text-outline">
                {`Proverbe #${idx + 1} · ${sourceLabel(p)}`}
              </span>
            </div>

            {/* 1. Le proverbe en bulu : AU CENTRE, en majesté */}
            <div className="mt-6 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-outline mb-2">
                En langue bulu
              </p>
              <blockquote className="font-serif text-3xl font-semibold leading-tight text-forest sm:text-4xl">
                « {p.bulu} »
              </blockquote>
            </div>

            {/* 2. Traduction française */}
            <div className="mt-5 border-l-2 border-clay-soft pl-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-clay mb-1">
                Traduction{p.french_by === "akene" ? " (formulation d’Akeñ)" : ""}
              </p>
              <p className="font-serif text-xl italic text-ink sm:text-2xl leading-relaxed">
                {p.french}
              </p>
            </div>

            {/* 3. Commentaire de l'auteur (fidèle à la source) */}
            {p.author_commentary && (
              <div className="mt-7 rounded-xl bg-surface-low/70 p-5 sm:p-6 border border-surface-high/80">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-forest mb-2">
                  Commentaire de {p.sources?.status === "confirmed" && p.sources.authors ? p.sources.authors : "l’auteur"}
                </h2>
                <p className="text-sm leading-relaxed text-ink-soft sm:text-base">{p.author_commentary}</p>
              </div>
            )}

            {/* 4. Note d'Akeñ : nos propres ajouts, clairement séparés de l'auteur */}
            {p.editor_note && (
              <div className="mt-4 rounded-xl border border-dashed border-clay/40 p-5 sm:p-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-clay mb-2">Note d’Akeñ</h2>
                <p className="text-sm leading-relaxed text-ink-soft sm:text-base">{p.editor_note}</p>
              </div>
            )}

            {/* 5. Les équivalents dans d’autres langues (en dernier, comme échos universels) */}
            {p.equivalents && p.equivalents.length > 0 && (
              <div className="mt-8 border-t border-surface-high/80 pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-outline mb-3">
                  Équivalents cités par l’auteur
                </h3>
                <p className="-mt-1 mb-3 text-xs text-outline">Certaines traductions sont de l’éditrice (Akeñ).</p>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {p.equivalents.map((eq, j) => (
                    <li
                      key={j}
                      className="rounded-lg border border-surface-high/60 bg-surface/50 p-3 text-xs leading-relaxed"
                    >
                      <span className="font-semibold text-forest block mb-0.5">
                        {eq.language}
                      </span>
                      <span className="italic text-ink font-serif text-sm block">
                        « {eq.text} »
                      </span>
                      {eq.translation && (
                        <span className="text-outline mt-1 block">
                          {eq.translation}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Épilogue et perspective sur les proverbes */}
      <footer className="mt-16 rounded-2xl border border-surface-high bg-forest p-8 text-center text-white sm:p-10 shadow-xs">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Ériger la parole orale en trésor vivant
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-forest-soft sm:text-base">
          Maxime Meto’o proposait de classer les proverbes africains par thèmes
          (<em>végétal, minéral, animal, l’absence, l’amour, la dette, l’endurance…</em>) pour en faire
          la base d’une étude des fondements de la pensée africaine.
          Ils viendront bientôt nourrir une nouvelle rubrique : le <strong>Proverbe du jour</strong>.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-medium">
          <Link
            href="/sources"
            className="text-white underline underline-offset-4 hover:text-clay-soft transition"
          >
            Consulter la référence complète
          </Link>
          <span className="text-forest-soft">·</span>
          <Link
            href="/recherche"
            className="text-white underline underline-offset-4 hover:text-clay-soft transition"
          >
            Explorer le dictionnaire
          </Link>
        </div>
      </footer>
    </div>
  );
}
