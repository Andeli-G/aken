export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-8 px-4 py-12">
      <header className="text-center">
        <h1 className="font-serif text-5xl font-semibold tracking-tight text-forest">
          Akeñ
        </h1>
        <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-terracotta">
          Atelier linguistique bulu
        </p>
      </header>

      <input
        type="search"
        placeholder="Rechercher un mot…"
        className="w-full rounded-md border border-rule-strong bg-card px-4 py-3 text-[0.9375rem] outline-none focus:border-forest focus:outline-[1.5px] focus:outline-forest"
      />

      {/* Carte d'exemple : contenu provisoire */}
      <article className="rounded-md border border-rule-strong bg-card p-6 shadow-[0_2px_8px_-2px_rgba(36,27,21,0.05)]">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="font-serif text-3xl font-medium text-forest">
            Mot bulu
          </h2>
          <span className="text-[0.9375rem] font-medium tracking-wide text-ochre">
            /prononciation/
          </span>
          <span className="rounded-sm border border-rule-strong bg-canvas px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.06em]">
            N.M.
          </span>
        </div>
        <p className="mt-3 font-serif text-lg italic">
          Exemple de définition en français.
        </p>
      </article>
    </main>
  );
}