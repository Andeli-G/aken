import { supabase } from "@/lib/supabase";

type Source = {
  id: number;
  title: string;
  authors: string | null;
  publisher: string | null;
  year: number | null;
  place: string | null;
  isbn: string | null;
  status: "confirmed" | "to_confirm";
};

export const metadata = { title: "Sources et auteurs — Akeñ" };

export default async function Sources() {
  const { data } = await supabase
    .from("sources")
    .select("id, title, authors, publisher, year, place, isbn, status")
    .order("id");
  const sources = (data ?? []) as Source[];

  return (
    <section className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      <div className="border-b border-surface-high/80 pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-clay">
          Patrimoine & Bibliographie
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-forest sm:text-5xl">
          Sources et auteurs
        </h1>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-ink-soft">
          Chaque entrée du dictionnaire Akeñ provient directement d’un ouvrage imprimé et vérifié.
          Rien n’est inventé : chaque mot, ton, exemple et glose est scrupuleusement rattaché
          à sa page d’origine, afin de rendre hommage aux chercheurs, auteurs et locuteurs
          qui ont consigné la mémoire de la langue bulu.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        <h2 className="font-serif text-2xl font-semibold text-forest">
          Ouvrages référencés
        </h2>

        <ul className="space-y-5">
          {sources.map((source) => (
            <li
              key={source.id}
              className="rounded-2xl border border-surface-high bg-white p-6 sm:p-8 shadow-[0_2px_12px_rgba(13,56,41,0.02)]"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-outline">
                  Ouvrage #{source.id}
                </span>
                {source.status === "confirmed" ? (
                  <span className="rounded-full bg-forest-soft/30 px-2.5 py-0.5 text-xs font-medium text-forest">
                    Référence confirmée
                  </span>
                ) : (
                  <span className="rounded-full bg-clay-soft/50 px-2.5 py-0.5 text-xs font-medium text-clay">
                    Vérification en cours
                  </span>
                )}
              </div>

              {source.status === "confirmed" ? (
                <div className="mt-4 space-y-2">
                  <p className="font-serif text-2xl font-semibold text-forest">
                    {source.title}
                  </p>
                  <p className="text-base text-ink-soft">
                    {[source.authors, source.place, source.publisher, source.year?.toString()]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {source.isbn && (
                    <p className="text-xs text-outline">ISBN : {source.isbn}</p>
                  )}
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  <p className="font-serif text-2xl font-semibold text-forest">
                    {source.title || "Dictionnaire bulu–français"}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {source.authors || "Auteurs en cours de confirmation bibliographique."}
                  </p>
                  <p className="text-xs text-outline">
                    Les données sont extraites avec précision des pages numérisées de l’ouvrage de référence.
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Note sur la démarche éthique et patrimoniale */}
      <div className="mt-12 rounded-2xl border border-surface-high bg-surface-low/60 p-6 sm:p-8">
        <h3 className="font-serif text-xl font-semibold text-forest">
          Démarche de transmission et droits
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Akeñ est un projet patrimonial à visée pédagogique et culturelle. Les contenus linguistiques demeurent
          la propriété morale et intellectuelle de leurs auteurs et éditeurs respectifs.
          Pour toute question, précision ou suggestion concernant ces références, vous pouvez nous contacter.
        </p>
      </div>
    </section>
  );
}
