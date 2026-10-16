// Dessine la « musique » d'un mot : une courbe qui monte, descend ou reste plate selon ses tons.
// Exemple : le ton "hb" (haut puis bas) donne une ligne qui descend.

// Hauteur de chaque ton dans le dessin (plus le nombre est petit, plus le ton est haut).
const Y = { h: 6, m: 14, b: 22 } as const;
const NAME = { h: "haut", m: "moyen", b: "bas" } as const;
type Tone = keyof typeof Y;

export default function ToneCurve({ tone }: { tone: string | null }) {
  if (!tone) return null;

  
  const letters = tone.toLowerCase().replace(/[^hmb]/g, "").split("") as Tone[];

  if (letters.length === 0) return null;

  const points = letters.map((letter, i) => ({ x: 14 + i * 22, y: Y[letter] }));
  const width = 28 + (letters.length - 1) * 22;
  const path =
    letters.length === 1
      ? `M 4 ${points[0].y} H 24` // un seul ton : une ligne plate
      : points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const label = letters.map((letter) => NAME[letter]).join(" puis ");

  return (
    <svg
      width={width}
      height={28}
      viewBox={`0 0 ${width} 28`}
      role="img"
      aria-label={`ton ${label}`}
      className="inline-block align-middle text-clay"
    >
      <title>{`ton ${label}`}</title>
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.2" fill="currentColor" />
      ))}
    </svg>
  );
}
