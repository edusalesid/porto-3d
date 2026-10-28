import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Rizal OS — Virtual Office Portfolio',
  description:
    'Interactive 3D Virtual Office Portfolio for Rizal — Technical Project Manager specializing in project execution, product development, software systems, and AI-enabled workflows.',
  openGraph: {
    title: 'Rizal OS — Virtual Office Portfolio',
    description:
      'Explore the work. Understand the thinking. See the impact. Interactive spatial portfolio for Technical Project Management & Product Systems.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rizal OS — Virtual Office Portfolio',
    description:
      'Interactive 3D Virtual Office Portfolio for Rizal — Technical Project Manager.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jakarta.variable} ${jetbrainsMono.variable} dark`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#0B0F17] text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200 font-sans min-h-screen overflow-x-hidden"
      >
        {children}
      </body>
    </html>
  );
}

