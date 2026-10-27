import Link from "next/link";
import ToneCurve from "@/components/ToneCurve";

export default function AkenNotice() {
  return (
    <aside
      aria-label="À propos du mot Akeñ"
      className="relative overflow-hidden rounded-2xl border border-surface-high bg-white/70 p-7 sm:p-10 shadow-[0_2px_24px_rgba(13,56,41,0.04)] backdrop-blur-xs"
    >
      {/* Liseré discret d'argile en haut */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-clay/40 to-transparent" />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-clay-soft/50 px-2.5 py-0.5 text-xs font-medium text-clay">
              Entrée éponyme
            </span>
            <span className="text-xs text-outline">
              Dictionnaire bulu–français · classe III · page 16
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-forest sm:text-4xl">
              Akeñ
            </h2>
            <span className="font-serif text-lg text-ink-soft">/àkǝ́ ŋ/</span>
            <div className="inline-flex items-center gap-1.5 text-xs text-clay">
              <ToneCurve tone="h" size="sm" />
              <span>ton haut</span>
            </div>
          </div>

          <p className="font-serif text-xl leading-relaxed text-ink">
            « Intelligent, intelligence. »
          </p>

          <p className="text-sm text-outline">
            Voir aussi le renvoi vers{" "}
            <Link
              href="/mot/Atye%C3%B1"
              className="font-medium text-forest underline decoration-clay/40 underline-offset-4 hover:decoration-clay hover:text-clay"
            >
              Atyeñ
            </Link>{" "}
            <span className="italic">(« intelligent, adroit, habile, intelligence, habileté »)</span>.
          </p>
        </div>

        <div className="max-w-xs rounded-xl bg-surface-low/80 p-5 border border-surface-high/60 sm:shrink-0">
          <p className="font-serif text-base italic leading-relaxed text-forest">
            « Se sentir en paix, accueillir une autre forme d’intelligence. »
          </p>
          <p className="mt-3 text-xs leading-relaxed text-ink-soft">
            Cette application porte le nom d’une de ses propres entrées. Le savoir s’y découvre avec calme,
            dans l’écoute des mots et la musique de leur voix.
          </p>
          <div className="mt-4 pt-3 border-t border-surface-high">
            <Link
              href="/mot/Ake%C3%B1"
              className="text-xs font-medium text-clay hover:underline inline-flex items-center gap-1"
            >
              <span>Consulter l’entrée complète</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
