import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

  return (
    <article className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/recherche" className="text-sm text-ink-soft hover:text-forest">
        ← Retour à la recherche
      </Link>

      <h1 className="mt-4 font-serif text-5xl font-semibold text-forest">{headword}</h1>
      {entries.length > 1 && (
        <p className="mt-1 text-sm text-outline">{entries.length} emplois</p>
      )}

      <div className="mt-8 space-y-6">
        {entries.map((entry, i) => {
          const meta = [
            entry.pos,
            entry.noun_class && `classe ${entry.noun_class}`,
            entry.tone && `ton ${entry.tone}`,
            entry.phonetic && `/${entry.phonetic}/`,
          ].filter(Boolean);
          const entryNotes = notes.filter((n) => n.entry_id === entry.id);

          return (
            <section key={entry.id} className="rounded-xl border border-surface-high bg-white p-6">
              <header className="flex items-baseline gap-3">
                {entries.length > 1 && (
                  <span className="font-serif text-2xl text-clay">{i + 1}.</span>
                )}
                <p className="text-sm text-ink-soft">{meta.join(" · ")}</p>
              </header>

              {entry.senses.map((sense, j) => (
                <p key={j} className="mt-3 font-serif text-xl leading-relaxed">
                  {sense}
                </p>
              ))}

              {entry.examples.length > 0 && (
                <div className="mt-5">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-clay">Exemples</h2>
                  <ul className="mt-2 space-y-2">
                    {entry.examples.map((example, j) => (
                      <li key={j} className="border-l-2 border-clay-soft pl-3 font-serif text-lg italic">
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* À TOI : affiche ici les renvois (entry.cross_refs), s'il y en a. */}

              {entryNotes.map((note) => (
                <aside key={note.id} className="mt-5 rounded-lg bg-surface-mid p-4">
                  {note.title && <h2 className="font-serif text-lg font-semibold text-forest">{note.title}</h2>}
                  <p className="mt-1 leading-relaxed text-ink-soft">{note.body}</p>
                </aside>
              ))}

              <p className="mt-5 border-t border-surface-high pt-3 text-xs text-outline">
                {citation(entry.sources, entry.source_page)}
              </p>
            </section>
          );
        })}
      </div>
    </article>
  );
}
