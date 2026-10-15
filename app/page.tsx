import Link from "next/link";

// Lettres de l'alphabet bulu (sans C, Q, R, X)
const LETTERS = "ABDEFGHIJKLMNOPSTUVWYZ".split("");

export default function Home() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-24">
      <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-forest sm:text-6xl">
        Retrouvez les mots,
        <br />
        découvrez la langue bulu.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
        Cherchez un mot bulu pour en connaître le sens, le ton, la prononciation et des exemples.
      </p>

      <form action="/recherche" className="mx-auto mt-10 flex max-w-xl gap-2">
        <label htmlFor="q" className="sr-only">Mot à rechercher</label>
        <input
          id="q"
          name="q"
          type="search"
          required
          placeholder="Un mot bulu, par exemple « mvoé »"
          className="min-w-0 flex-1 rounded-lg border border-line bg-white px-4 py-3 text-base"
        />
        <button
          type="submit"
          className="rounded-lg bg-forest px-5 py-3 font-medium text-white hover:bg-forest-mid"
        >
          Chercher
        </button>
      </form>

      <nav aria-label="Parcourir par lettre" className="mt-14">
        <p className="mb-3 text-sm text-outline">Parcourir par initiale</p>
        <ul className="flex flex-wrap justify-center gap-1.5">
          {LETTERS.map((letter) => (
            <li key={letter}>
              <Link
                href={`/recherche?q=${letter}`}
                className="block min-w-9 rounded-md border border-surface-high bg-surface-low px-2.5 py-1.5 font-serif text-lg text-forest hover:bg-clay-soft"
              >
                {letter}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
