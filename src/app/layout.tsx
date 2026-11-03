import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, DM_Mono, Manrope, Rozha_One } from 'next/font/google';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import SoundGate from '@/components/SoundGate';
import { site } from '@/data/site';
import './globals.css';

// Display: Bricolage Grotesque, heavy (name and headings). Hindi: Rozha One. Body: Manrope. Labels: DM Mono.
const display = Bricolage_Grotesque({ weight: ['700', '800'], subsets: ['latin'], variable: '--font-display', display: 'swap' });
const hindi = Rozha_One({ weight: '400', subsets: ['latin', 'devanagari'], variable: '--font-hindi', display: 'swap' });
const body = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const mono = DM_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const title = `${site.name} — Portfolio`;

/** Background music: put a track at public/audio/theme.mp3 (or .m4a / .ogg). Without one, only the sound effects play. */
const music = ['mp3', 'm4a', 'ogg']
  .map((ext) => `/audio/theme.${ext}`)
  .find((src) => existsSync(join(process.cwd(), 'public', src)));

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: title,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [site.name, 'portfolio', 'developer', 'computer science student', 'UI/UX', 'web development'],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: { title, description: site.description, url: '/', siteName: title, type: 'website', locale: 'en_IN' },
  twitter: { card: 'summary_large_image', title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: '#F6E7C8',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Runs before first paint. Decides whether the opening sequence plays:
 *   - not when the visitor prefers reduced motion
 *   - only on the home page (other pages have no intro)
 *   - waits behind the Enter screen (`gated`) until the visitor clicks
 *   - otherwise it plays on every visit and every reload
 * Without JavaScript the page simply shows its final state.
 */
const introScript = `
(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && location.pathname === '/') {  // only the home page has an intro
    root.classList.add('playing', 'gated');
    // safety net: if the page's scripts never start, do not leave the visitor stuck behind the Enter screen
    setTimeout(function () { if (!root.classList.contains('js')) root.classList.remove('playing', 'gated'); }, 8000);
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${hindi.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        {children}
        <SoundGate name={site.name} nameHindi={site.nameHindi} year={site.year} music={music} copy={site.gate} />
      </body>
    </html>
  );
}
