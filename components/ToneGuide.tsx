import ToneCurve from "@/components/ToneCurve";

export default function ToneGuide() {
  return (
    <div className="rounded-2xl border border-surface-high bg-surface-low/50 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-clay">
            La musique de la langue
          </p>
          <h3 className="mt-1 font-serif text-2xl font-semibold text-forest">
            Les tons comme repères de sens
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
            En bulu, la hauteur et la mélodie de la voix ne sont pas de simples intonations :
            elles font partie intégrante du mot et en déterminent le sens.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2 sm:pt-0">
          <div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 border border-surface-high">
            <ToneCurve tone="h" size="sm" />
            <span className="text-xs text-ink-soft">
              <strong className="font-medium text-forest">Haut</strong> (h)
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 border border-surface-high">
            <ToneCurve tone="m" size="sm" />
            <span className="text-xs text-ink-soft">
              <strong className="font-medium text-forest">Moyen</strong> (m)
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 border border-surface-high">
            <ToneCurve tone="b" size="sm" />
            <span className="text-xs text-ink-soft">
              <strong className="font-medium text-forest">Bas</strong> (b)
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 border border-surface-high">
            <ToneCurve tone="hb" size="sm" />
            <span className="text-xs text-ink-soft">
              <strong className="font-medium text-forest">Modulé</strong> (hb)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
