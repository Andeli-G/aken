import type { Metadata } from "next";
import Link from "next/link";
import { EB_Garamond, Plus_Jakarta_Sans } from "next/font/google";
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
  title: "Akeñ — Dictionnaire bulu–français",
  description: "Rechercher et comprendre les mots de la langue bulu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${garamond.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <header className="border-b border-surface-high">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
            <Link href="/" className="font-serif text-2xl font-semibold text-forest">
              Akeñ
            </Link>
            <div className="flex gap-6 text-sm font-medium text-ink-soft">
              <Link href="/" className="hover:text-forest">Accueil</Link>
              <Link href="/recherche" className="hover:text-forest">Dictionnaire</Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-surface-high">
          <p className="mx-auto max-w-5xl px-5 py-6 text-sm text-outline">
            Akeñ, dictionnaire bulu–français. Projet en développement.
          </p>
        </footer>
      </body>
    </html>
  );
}
