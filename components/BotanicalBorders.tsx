// Colonne ondulée de lianes et de fleurs de la forêt équatoriale (Sud-Cameroun)
// Cadre architectural végétal et discret pour habiller les marges latérales sur grands écrans.

export default function BotanicalBorders() {
  return (
    <>
      {/* Colonne gauche */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-y-0 left-1 xl:left-4 2xl:left-10 z-0 hidden lg:block w-16 xl:w-20 select-none opacity-60 transition-opacity duration-700"
      >
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="botanical-vine-left"
              width="72"
              height="280"
              patternUnits="userSpaceOnUse"
            >
              {/* Liane ondulante principale (onde sinueuse douce) */}
              <path
                d="M 36 0 C 16 45, 16 95, 36 140 C 56 185, 56 235, 36 280"
                fill="none"
                stroke="#0d3829"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeOpacity="0.28"
              />

              {/* Vrille secondaire fine */}
              <path
                d="M 36 40 C 24 50, 14 70, 20 85 C 24 93, 34 90, 31 80"
                fill="none"
                stroke="#a8cfbd"
                strokeWidth="1"
                strokeLinecap="round"
                strokeOpacity="0.45"
              />

              {/* Première feuille stylisée (gauche) */}
              <path
                d="M 24 55 C 10 48, 6 66, 14 74 C 21 68, 23 60, 24 55 Z"
                fill="#a8cfbd"
                fillOpacity="0.25"
                stroke="#0d3829"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
              <path
                d="M 23 57 Q 15 63 14 74"
                fill="none"
                stroke="#0d3829"
                strokeWidth="0.7"
                strokeOpacity="0.3"
              />

              {/* Bourgeon / fleur délicate de liane en argile (accent culturel) */}
              <g transform="translate(14, 110)">
                <path
                  d="M 18 10 C 13 8, 8 13, 10 20 C 13 23, 18 22, 20 16 Z"
                  fill="#ffdbcf"
                  fillOpacity="0.6"
                  stroke="#9b4420"
                  strokeWidth="0.9"
                  strokeOpacity="0.45"
                />
                <circle cx="15" cy="15" r="1.2" fill="#9b4420" fillOpacity="0.6" />
                <path
                  d="M 22 22 C 20 17, 20 12, 18 10"
                  fill="none"
                  stroke="#0d3829"
                  strokeWidth="0.9"
                  strokeOpacity="0.3"
                />
              </g>

              {/* Deuxième feuille stylisée (droite) */}
              <path
                d="M 48 185 C 62 178, 66 196, 58 204 C 51 198, 49 190, 48 185 Z"
                fill="#a8cfbd"
                fillOpacity="0.25"
                stroke="#0d3829"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
              <path
                d="M 49 187 Q 57 193 58 204"
                fill="none"
                stroke="#0d3829"
                strokeWidth="0.7"
                strokeOpacity="0.3"
              />

              {/* Vrille délicate droite */}
              <path
                d="M 45 220 C 56 228, 64 242, 58 252 C 54 258, 46 254, 48 245"
                fill="none"
                stroke="#a8cfbd"
                strokeWidth="1"
                strokeLinecap="round"
                strokeOpacity="0.4"
              />

              {/* Petite fleur épanouie de sous-bois */}
              <g transform="translate(44, 235)">
                <circle cx="8" cy="8" r="2" fill="#ffdbcf" stroke="#9b4420" strokeWidth="0.8" strokeOpacity="0.5" />
                <path
                  d="M 8 3 Q 10 6 8 8 Q 6 6 8 3 M 13 8 Q 10 10 8 8 Q 10 6 13 8 M 8 13 Q 6 10 8 8 Q 10 10 8 13 M 3 8 Q 6 6 8 8 Q 6 10 3 8"
                  fill="none"
                  stroke="#9b4420"
                  strokeWidth="0.7"
                  strokeOpacity="0.4"
                />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#botanical-vine-left)" />
        </svg>
      </div>

      {/* Colonne droite (symétrique et en miroir) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-y-0 right-1 xl:right-4 2xl:right-10 z-0 hidden lg:block w-16 xl:w-20 select-none opacity-60 transition-opacity duration-700"
      >
        <svg
          className="h-full w-full -scale-x-100"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <rect width="100%" height="100%" fill="url(#botanical-vine-left)" />
        </svg>
      </div>
    </>
  );
}
