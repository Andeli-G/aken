import type { Metadata } from "next";
import Link from "next/link";
import { EB_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import Logo from "@/components/Logo";
import BotanicalBorders from "@/components/BotanicalBorders";
import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Akeñ — Dictionnaire bulu–français",
  description: "Rechercher et comprendre les mots de la langue bulu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${garamond.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col antialiased bg-surface text-ink selection:bg-clay-soft selection:text-forest relative">
        {/* Colonnes ondulées de lianes et fleurs structurant les marges extérieures */}
        <BotanicalBorders />

        {/* Bandeau d'ambiance calme et patrimoniale */}
        <div className="border-b border-surface-high/70 bg-surface-low/80 px-5 py-2 text-center text-xs tracking-wide text-ink-soft">
          <span className="font-serif italic text-forest">Akeñ</span> · Dictionnaire et mémoire de la langue bulu · Cameroun
        </div>

        <header className="border-b border-surface-high/80 bg-surface/90 backdrop-blur-xs sticky top-0 z-20">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
            <Link
              href="/"
              className="flex items-center gap-3 font-serif text-2xl font-semibold tracking-tight text-forest hover:opacity-90 transition-opacity"
            >
              <Logo size={28} />
              <span className="flex items-baseline gap-2">
                <span>Akeñ</span>
                <span className="hidden font-sans text-xs font-normal text-outline sm:inline">
                  /àkǝ́ ŋ/
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium text-ink-soft">
              <Link href="/" className="hover:text-forest transition-colors">
                Accueil
              </Link>
              <Link href="/recherche" className="hover:text-forest transition-colors">
                Dictionnaire
              </Link>
              <Link href="/francais" className="hover:text-forest transition-colors">Français → bulu</Link>
              <Link href="/proverbes" className="hover:text-forest transition-colors">
                Proverbes
              </Link>
              <Link href="/sources" className="hover:text-forest transition-colors">
                Sources
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>
        <footer className="border-t border-surface-high">
  <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-6 text-sm text-outline">
    <p>Akeñ </p>
    <nav aria-label="Contact" className="flex flex-wrap items-center gap-x-5 gap-y-1">
      <Link href="/retours" className="hover:text-forest">Retours et commentaires</Link>
      <a href="mailto:dulzuradelight@gmail.com" className="hover:text-forest">dulzuradelight@gmail.com</a>
      <a
        href="https://github.com/Andeli-G"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-forest"
      >
        GitHub · Andeli-G
      </a>
      <p>dictionnaire de référence de la langue bulu (Cameroun). </p>
      <p>Conçu pour accueillir une autre forme d’intelligence dans le calme, la rigueur et le recueillement. Projet en développement.</p>
    </nav>
  </div>
 </footer>

        
      </body>
    </html>
    

/*
//  /*<footer className="border-t border-surface-high/80 bg-surface-low/40 mt-16">
          <div className="mx-auto max-w-5xl px-5 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <Link href="/" className="flex items-center gap-2 font-serif text-lg font-semibold text-forest">
                <Logo size={20} />
                <span>Akeñ</span>
              </Link>
              <p className="text-xs leading-relaxed text-outline">
                Dictionnaire de référence de la langue bulu (Cameroun). Conçu pour accueillir une autre forme
                d’intelligence dans le calme, la rigueur et le recueillement.
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2 text-xs text-outline">
              <div className="flex gap-4">
                <Link href="/mot/Ake%C3%B1" className="hover:text-forest transition-colors">
                  Le mot Akeñ
                </Link>
                <span>·</span>
                <Link href="/recherche" className="hover:text-forest transition-colors">
                  Recherche
                </Link>
                <span>·</span>
                <Link href="/proverbes" className="hover:text-forest transition-colors">
                  Proverbes
                </Link>
                <span>·</span>
                <Link href="/sources" className="hover:text-forest transition-colors">
                  Sources & Droits
                </Link>
              </div>
              <p>Ouvrages et glossaires sous droits de leurs auteurs respectifs.</p>
            </div>
          </div>
        </footer> 





*/



  );
}



