"use client";

import { useState } from "react";

// Caractères réellement présents dans les mots du dictionnaire (ô, é, ñ, apostrophe du coup de glotte)
// et dans les transcriptions phonétiques (ǝ, ɔ, ŋ).
const CHARACTERS = ["ô", "é", "ñ", "’", "ǝ", "ɔ", "ŋ"];

export default function SearchBox({
  initialValue = "",
  placeholder = "Un mot bulu",
  centered = false,
}: {
  initialValue?: string;
  placeholder?: string;
  centered?: boolean;
}) {
  // `value` = le texte actuellement dans la barre ; `setValue(...)` le remplace.
  const [value, setValue] = useState(initialValue);

  // Appelée quand on clique sur un bouton du clavier : `char` est la lettre du bouton.
  function insertChar(char: string) {
    // Nouveau texte = ancien texte + la lettre cliquée.
    setValue(value + char);
  }

  return (
    <form action="/recherche" className="w-full">
      <div className="flex gap-2">
        <label htmlFor="q" className="sr-only">Mot à rechercher</label>
        <input
          id="q"
          name="q"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-lg border border-line bg-white px-4 py-3 text-base"
        />
        <button
          type="submit"
          className="rounded-lg bg-forest px-5 py-3 font-medium text-white hover:bg-forest-mid"
        >
          Chercher
        </button>
      </div>

      <div
        role="group"
        aria-label="Caractères bulu"
        className={`mt-3 flex flex-wrap items-center gap-1.5 ${centered ? "justify-center" : ""}`}
      >
        <span className="mr-1 text-sm text-outline">Caractères bulu</span>
        {CHARACTERS.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => insertChar(char)}
            aria-label={`Insérer ${char}`}
            className="min-w-9 rounded-md border border-line bg-white px-2.5 py-1 font-serif text-lg text-forest hover:bg-clay-soft"
          >
            {char}
          </button>
        ))}
      </div>
    </form>
  );
}
