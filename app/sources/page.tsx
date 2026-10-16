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
    <section className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif text-4xl font-semibold text-forest">Sources et auteurs</h1>
      <p className="mt-3 max-w-prose leading-relaxed text-ink-soft">
        Les contenus d'Akeñ viennent d'ouvrages publiés. Chaque mot est rattaché à son ouvrage et à sa page.
        Cette version est une alpha : certaines références sont encore en cours de vérification.
      </p>

      <ul className="mt-8 space-y-5">
        {sources.map((source) => (
          <li key={source.id} className="rounded-xl border border-surface-high bg-white p-5">
            {source.status === "confirmed" ? (
              <>
                <p className="font-serif text-xl text-forest">{source.title}</p>
                <p className="mt-1 text-ink-soft">
                  {[source.authors, source.place, source.publisher, source.year?.toString()]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {source.isbn && <p className="mt-1 text-sm text-outline">ISBN {source.isbn}</p>}
              </>
            ) : (
              <>
                <p className="font-serif text-xl text-forest">Dictionnaire bulu–français</p>
                <p className="mt-1 text-ink-soft">Référence en cours de vérification.</p>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
