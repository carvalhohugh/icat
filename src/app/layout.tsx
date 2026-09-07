import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Instituto Catalano — ICAT | Transformando vidas',
  description: 'O Instituto Catalano promove educação, esporte, cultura, assistência social e oportunidades para transformar vidas.',
  openGraph: {
    title: 'Instituto Catalano — ICAT',
    description: 'O Instituto Catalano promove educação, esporte, cultura, assistência social e oportunidades para transformar vidas.',
    url: 'https://icat.org.br',
    siteName: 'Instituto Catalano — ICAT',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <main className="min-h-screen bg-icat-gray-light flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
