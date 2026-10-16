import Link from "next/link";

type Entry = {
  id: number;
  headword: string;
  tone: string | null;
  phonetic: string | null;
  noun_class: string | null;
  senses: string[];
};

export default function EntryCard({
  headword,
  homographs,
}: {
  headword: string;
  homographs: Entry[];
}) {
  return (
    <li className="py-6">
      <h2 className="font-serif text-3xl font-semibold text-forest">{headword}</h2>
      <Link
        href={`/mot/${encodeURIComponent(headword)}`}
        className="mt-1 text-sm font-medium text-forest hover:underline"
      >
        Voir la page du mot
      </Link>
      <ol className="mt-3 space-y-4">
        {homographs.map((entry, i) => (
          <li key={entry.id} className="flex gap-3">
            {homographs.length > 1 && (
              <span className="w-5 shrink-0 pt-0.5 font-serif text-lg text-clay">{i + 1}.</span>
            )}
            <div>
              <p className="text-sm text-outline">
                {[
                  entry.tone && `ton ${entry.tone}`,
                  entry.noun_class && `classe ${entry.noun_class}`,
                  entry.phonetic && `/${entry.phonetic}/`,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {entry.senses.map((sense, j) => (
                <p key={j} className="mt-0.5 max-w-prose font-serif text-lg leading-relaxed text-ink">
                  {sense}
                </p>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </li>
  );
}