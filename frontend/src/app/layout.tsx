import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BUT SD RAG Assistant",
  description:
    "Assistant IA non officiel pour le BUT Science des Données (IUT de Metz), basé uniquement sur des sources publiques.",
};

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/assistant", label: "Assistant" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "Fonctionnement" },
  { href: "/disclaimer", label: "Mentions" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <header className="border-b border-zinc-200 bg-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-semibold tracking-tight">
              BUT SD RAG Assistant
            </Link>
            <div className="flex gap-5 text-sm text-zinc-600">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-zinc-900">
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 bg-white py-4 text-center text-xs text-zinc-500">
          Projet non officiel, basé uniquement sur des sources publiques. Vérifiez toujours les informations importantes auprès de l&apos;IUT ou sur ARCHE.
        </footer>
      </body>
    </html>
  );
}
