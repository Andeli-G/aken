// Dessine la « musique » d'un mot : une courbe harmonique qui rend visible la mélodie vocale selon ses tons.
// Exemple : le ton "hb" (haut puis bas) dessine une onde descendante douce.

const CONFIG = {
  sm: {
    y: { h: 4, m: 10, b: 16 },
    height: 20,
    spacing: 16,
    padding: 10,
    stroke: 1.8,
    radius: 2.2,
  },
  md: {
    y: { h: 6, m: 13, b: 20 },
    height: 26,
    spacing: 22,
    padding: 14,
    stroke: 2.4,
    radius: 3.2,
  },
  lg: {
    y: { h: 8, m: 17, b: 26 },
    height: 34,
    spacing: 28,
    padding: 18,
    stroke: 2.8,
    radius: 4,
  },
} as const;

const NAME = { h: "haut", m: "moyen", b: "bas" } as const;
type Tone = "h" | "m" | "b";

export default function ToneCurve({
  tone,
  size = "md",
  className = "",
}: {
  tone: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  if (!tone) return null;

  const letters = tone.toLowerCase().replace(/[^hmb]/g, "").split("") as Tone[];
  if (letters.length === 0) return null;

  const cfg = CONFIG[size];
  const points = letters.map((letter, i) => ({
    x: cfg.padding + i * cfg.spacing,
    y: cfg.y[letter],
  }));

  const width = cfg.padding * 2 + (letters.length - 1) * cfg.spacing;

  // Construction d'un tracé fluide (courbe harmonique de Bézier)
  let path = "";
  if (points.length === 1) {
    const y = points[0].y;
    const startX = cfg.padding - 6;
    const endX = cfg.padding + 6;
    path = `M ${startX} ${y} H ${endX}`;
  } else {
    path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
  }

  const label = letters.map((l) => NAME[l]).join(" puis ");

  return (
    <svg
      width={width}
      height={cfg.height}
      viewBox={`0 0 ${width} ${cfg.height}`}
      role="img"
      aria-label={`Mélodie du ton : ${label}`}
      className={`inline-block align-middle text-clay ${className}`}
    >
      <title>{`Mélodie du ton : ${label}`}</title>
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={cfg.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={cfg.radius} fill="currentColor" />
      ))}
    </svg>
  );
}

