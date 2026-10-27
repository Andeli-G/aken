import Link from "next/link";
import ToneCurve from "@/components/ToneCurve";

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
  const isEponym = headword.trim().toLowerCase() === "akeñ";

  return (
    <li className="group py-7 transition-colors">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <Link
            href={`/mot/${encodeURIComponent(headword)}`}
            className="font-serif text-3xl font-semibold text-forest hover:text-clay"
          >
            {headword}
          </Link>
          {isEponym && (
            <span className="rounded-full bg-clay-soft/60 px-2.5 py-0.5 text-xs font-medium text-clay">
              Entrée éponyme
            </span>
          )}
        </div>
        <Link
          href={`/mot/${encodeURIComponent(headword)}`}
          className="text-xs font-medium tracking-wide text-outline group-hover:text-forest"
        >
          Consulter la fiche →
        </Link>
      </div>

      <ol className="mt-4 space-y-4">
        {homographs.map((entry, i) => (
          <li key={entry.id} className="flex gap-3.5">
            {homographs.length > 1 && (
              <span className="w-5 shrink-0 pt-0.5 font-serif text-lg text-clay">{i + 1}.</span>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-outline">
                {entry.tone && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-forest">
                    <span>ton {entry.tone}</span>
                    <ToneCurve tone={entry.tone} size="sm" />
                  </span>
                )}
                {entry.noun_class && <span>· cl. {entry.noun_class}</span>}
                {entry.phonetic && <span>· /{entry.phonetic}/</span>}
              </div>
              {entry.senses.map((sense, j) => (
                <p key={j} className="mt-1.5 max-w-prose font-serif text-lg leading-relaxed text-ink">
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