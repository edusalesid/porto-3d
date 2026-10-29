import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');

export const viewport: Viewport = {
  themeColor: '#08090a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Rizal OS — Virtual Office Portfolio',
  description:
    'Interactive 3D Virtual Office Portfolio for Rizal — Technical Project Manager specializing in project execution, product development, software systems, and AI-enabled workflows.',
  openGraph: {
    title: 'Rizal OS — Virtual Office Portfolio',
    description:
      'Explore the work. Understand the thinking. See the impact. Interactive spatial portfolio for Technical Project Management & Product Systems.',
    type: 'website',
    url: siteUrl,
    siteName: 'Rizal OS — Virtual Office Portfolio',
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
      className={`${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#08090a] text-[#f7f8f8] antialiased selection:bg-[#5e6ad2]/30 selection:text-[#f7f8f8] font-sans min-h-screen overflow-x-hidden"
      >
        {children}
      </body>
    </html>
  );
}
