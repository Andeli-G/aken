import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ToneCurve from "@/components/ToneCurve";

type Source = {
  title: string;
  authors: string | null;
  publisher: string | null;
  year: number | null;
  status: "confirmed" | "to_confirm";
};

type Entry = {
  id: number;
  headword: string;
  tone: string | null;
  phonetic: string | null;
  noun_class: string | null;
  pos: string | null;
  senses: string[];
  examples: string[];
  cross_refs: string[];
  source_page: number | null;
  sources: Source | null;
};

type Note = { id: number; entry_id: number; title: string | null; body: string };

// On n'affiche une référence que si la source est confirmée.
function citation(source: Source | null, page: number | null): string {
  if (!source || source.status !== "confirmed") return "Source en cours de vérification";
  const parts = [source.authors, source.title, source.publisher, source.year?.toString()].filter(Boolean);
  return parts.join(", ") + (page ? `, p. ${page}` : "");
}

export default async function WordPage({
  params,
}: {
  params: Promise<{ headword: string }>;
}) {
  const { headword: raw } = await params;
  const headword = decodeURIComponent(raw);

  const { data, error } = await supabase
    .from("entries")
    .select(
      "id, headword, tone, phonetic, noun_class, pos, senses, examples, cross_refs, source_page, sources(title, authors, publisher, year, status)"
    )
    .eq("headword", headword)
    .order("id");

  if (error) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-clay">Cette fiche est momentanément indisponible. Réessayez dans un instant.</p>
      </section>
    );
  }

  const entries = (data ?? []) as unknown as Entry[];
  if (entries.length === 0) notFound();

  // Notes éditoriales publiées (rédigées par l'administratrice)
  const { data: noteRows } = await supabase
    .from("entry_notes")
    .select("id, entry_id, title, body")
    .in("entry_id", entries.map((e) => e.id))
    .eq("status", "published")
    .order("id");
  const notes = (noteRows ?? []) as Note[];

  const isEponym = headword.trim().toLowerCase() === "akeñ";

  return (
    <article className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/recherche"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-forest transition-colors"
        >
          <span>←</span>
          <span>Retour à la recherche</span>
        </Link>
        <span className="text-xs text-outline">Dictionnaire bulu–français</span>
      </div>

      {isEponym && (
        <aside
          aria-label="À propos du nom Akeñ"
          className="mb-8 rounded-2xl border border-clay-soft/80 bg-clay-soft/20 p-6 sm:p-7 shadow-[0_2px_12px_rgba(155,68,32,0.04)]"
        >
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-clay px-2.5 py-0.5 text-xs font-medium text-white">
              Entrée éponyme
            </span>
            <span className="text-xs text-clay font-medium">Origine du nom de l’application</span>
          </div>
          <p className="mt-3 font-serif text-xl italic text-forest sm:text-2xl">
            « Se sentir en paix, accueillir une autre forme d’intelligence. »
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Cette application porte le nom de cette entrée. Dans la pensée et la langue bulu,
            l’intelligence n’est pas qu’une abstraction : elle est discernement, sagacité,
            artisanat du verbe et harmonie avec le monde.
          </p>
        </aside>
      )}

      <div className="flex flex-wrap items-baseline gap-4">
        <h1 className="font-serif text-5xl font-semibold tracking-tight text-forest sm:text-6xl">
          {headword}
        </h1>
        {entries.length > 1 && (
          <span className="rounded-full bg-surface-low px-3 py-1 text-xs text-outline">
            {entries.length} emplois distincts
          </span>
        )}
      </div>

      <div className="mt-8 space-y-8">
        {entries.map((entry, i) => {
          const meta = [
            entry.pos,
            entry.noun_class && `classe ${entry.noun_class}`,
            entry.tone && `ton ${entry.tone}`,
            entry.phonetic && `/${entry.phonetic}/`,
          ].filter(Boolean);
          const entryNotes = notes.filter((n) => n.entry_id === entry.id);

          return (
            <section
              key={entry.id}
              className="rounded-2xl border border-surface-high bg-white p-7 sm:p-9 shadow-[0_2px_16px_rgba(13,56,41,0.02)]"
            >
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-high/60 pb-4">
                <div className="flex items-center gap-3">
                  {entries.length > 1 && (
                    <span className="font-serif text-xl font-semibold text-clay">{i + 1}.</span>
                  )}
                  <p className="text-xs font-medium text-ink-soft">{meta.join(" · ")}</p>
                </div>
                {entry.tone && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-low px-3 py-1 text-xs text-forest">
                    <span>mélodie</span>
                    <ToneCurve tone={entry.tone} size="sm" />
                  </div>
                )}
              </header>

              <div className="mt-5 space-y-3">
                {entry.senses.map((sense, j) => (
                  <p key={j} className="font-serif text-2xl leading-relaxed text-ink">
                    {sense}
                  </p>
                ))}
              </div>

              {entry.examples.length > 0 && (
                <div className="mt-6 border-t border-surface-high/60 pt-5">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-clay">
                    Exemples d’usage
                  </h2>
                  <ul className="mt-3 space-y-3">
                    {entry.examples.map((example, j) => {
                      const parts = example.split(/\s*=\s*/);
                      return (
                        <li key={j} className="border-l-2 border-clay-soft pl-4">
                          <p className="font-serif text-lg italic text-ink">{parts[0]}</p>
                          {parts[1] && (
                            <p className="mt-0.5 text-sm text-ink-soft">{parts[1]}</p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {entry.cross_refs.length > 0 && (
                <div className="mt-6 border-t border-surface-high/60 pt-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-clay">
                    Voir aussi
                  </h2>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {entry.cross_refs.map((ref, j) => (
                      <li key={j}>
                        <Link
                          href={`/mot/${encodeURIComponent(ref)}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-surface-high bg-surface-low px-3 py-1.5 text-sm font-medium text-forest hover:border-clay/40 hover:bg-clay-soft/40 transition-colors"
                        >
                          <span>{ref}</span>
                          <span className="text-xs text-clay">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {entryNotes.map((note) => (
                <aside key={note.id} className="mt-6 rounded-xl bg-surface-mid/70 p-5 border border-surface-high">
                  {note.title && (
                    <h2 className="font-serif text-lg font-semibold text-forest">{note.title}</h2>
                  )}
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{note.body}</p>
                </aside>
              ))}

              <footer className="mt-6 border-t border-surface-high pt-4 text-xs text-outline flex items-center justify-between">
                <span>{citation(entry.sources, entry.source_page)}</span>
                {entry.source_page && <span>Page {entry.source_page}</span>}
              </footer>
            </section>
          );
        })}
      </div>
    </article>
  );
}
