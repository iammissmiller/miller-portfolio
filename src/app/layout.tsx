import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, DM_Mono, Manrope } from 'next/font/google';
import { site } from '@/data/site';
import './globals.css';

// Display: Bricolage Grotesque, heavy (name and headings). Body: Manrope. Labels: DM Mono.
const display = Bricolage_Grotesque({ weight: ['700', '800'], subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const mono = DM_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: `${site.name} — Portfolio`,
  description: site.description,
  openGraph: {
    title: `${site.name} — Portfolio`,
    description: site.description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Portfolio`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: '#F6E7C8',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Runs before first paint. Decides whether the opening sequence plays:
 *   - not when the visitor prefers reduced motion
 *   - otherwise it plays on every visit and every reload
 * Without JavaScript the page simply shows its final state.
 */
const introScript = `
(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) {
    root.classList.add('playing');
    setTimeout(function () { root.classList.remove('playing'); }, 9000); // safety net
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}