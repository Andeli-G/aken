type Entry = {
  // à toi : recopie les champs depuis le type Entry de page.tsx
};

export default function WordCard({
  headword,
  homographs,
}: {
  headword: string;
  homographs: Entry[];
}) {
  return (
        <li> 
            <h2 className="font-serif text-3xl font-semibold text-forest">{headword}</h2>

            <ol className="mt-3 space-y-4">
                {homographs.map((entry, i) => (
                  <li key={entry.id} className="flex gap-3">
                    {homographs.length > 1 && (
                      <span className="w-5 shrink-0 pt-0.5 font-serif text-lg text-clay">{i + 1}.</span>
                    )}
                    <div>
                      <p className="text-sm text-outline">
                        {[entry.tone && `ton ${entry.tone}`, entry.noun_class && `classe ${entry.noun_class}`, entry.phonetic && `/${entry.phonetic}/`]
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
            </ol> </li>    
        
           
  );
}


 