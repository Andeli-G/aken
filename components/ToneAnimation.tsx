import type { CSSProperties } from "react";
import styles from "./ToneAnimation.module.css";

// Hauteur de chaque ton (plus petit = plus haut), comme dans ToneCurve.
const Y = { h: 8, m: 24, b: 40 } as const;
type Tone = keyof typeof Y;

// Une petite voix qui se dessine : décorative, donc cachée aux lecteurs d'écran.
export default function ToneAnimation({ tones, className = "" }: { tones: Tone[]; className?: string }) {
  const step = 44;
  const points = tones.map((tone, i) => ({ x: 20 + i * step, y: Y[tone] }));
  const width = 40 + (tones.length - 1) * step;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg
      width={width}
      height={48}
      viewBox={`0 0 ${width} 48`}
      aria-hidden="true"
      className={`text-clay ${className}`}
    >
      <path
        d={path}
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.line}
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="5"
          fill="currentColor"
          className={styles.dot}
          style={{ "--i": i } as CSSProperties}
        />
      ))}
    </svg>
  );
}
