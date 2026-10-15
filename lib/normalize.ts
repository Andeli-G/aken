// Version "simplifiée" d'un mot pour la recherche : sans tons, sans accents, en minuscules.
// Doit rester identique à la fonction du script d'import.
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ɔ/g, "o")
    .replace(/[ǝɛ]/g, "e")
    .replace(/ŋ/g, "n")
    .replace(/['’‘]/g, "")
    .toLowerCase()
    .trim();
}
