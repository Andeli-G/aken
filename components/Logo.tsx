// Marque d'Akeñ : un « ñ » dont la tilde rappelle la courbe d'un ton.
export default function Logo({ size = 30, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <rect width="64" height="64" rx="14" fill="#0d3829" />
      <path
        d="M17 20 C23 11 30 11 34 16 S45 22 49 13"
        fill="none" stroke="#ffdbcf" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M21 51 V30 M21 38 C21 33 26 30 32 30 C38 30 43 33 43 40 V51"
        fill="none" stroke="#fff8f5" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
