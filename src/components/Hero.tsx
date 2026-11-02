import Image from 'next/image';
import type { CSSProperties } from 'react';
import { site } from '@/data/site';

/** Words for the big background rows. Each row drifts in the opposite direction. */
const BIGWORDS: Array<{ text: string; lang?: string }> = [
  { text: 'PORTFOLIO — 2026 — PORTFOLIO — 2026 — ' },
  { text: site.nameHindi ? `${site.nameHindi} · ${site.nameHindi} · ${site.nameHindi} · ` : 'PRAPTEE MILLER · PRAPTEE MILLER · ', lang: site.nameHindi ? 'hi' : undefined },
];

type Frenzy = { t?: string; img?: string; k: string; hi?: boolean; c?: string; x: number; y: number; r: number; z?: number };

const style = (vars: Record<string, string>) => vars as CSSProperties;

export default function Hero() {
  const roles = site.eyebrow.split('·').map((r) => r.trim());
  const nameWords = (site.nameHindi ?? site.name).trim().split(/\s+/);
  const hi = Boolean(site.nameHindi);
  /** Intro stickers, in the order they land. x / y are percentages of the screen. Keep the words true. */
  const frenzy: Frenzy[] = [
    { t: 'Portfolio', k: 'y', x: 50, y: 44, r: -4, z: 3.4 },
    { t: nameWords[0], k: 'red', hi, x: 24, y: 26, r: 5, z: 3.1 },
    { t: nameWords[1] ?? '', k: 'teal', hi, x: 76, y: 24, r: -6, z: 3.1 },
    { t: '2026', k: 'burst', x: 66, y: 62, r: 8, z: 2 },
    { t: roles[1] ?? 'Developer', k: 'cream', x: 20, y: 58, r: -7 },
    { t: roles[2] ?? 'Design-minded', k: 'y', x: 78, y: 82, r: 4 },
    { t: roles[0] ?? 'Student', k: 'teal', x: 30, y: 73, r: 3 },
    { img: '/assets/can.webp', k: 'img', x: 90, y: 50, r: 12 },
    { img: '/assets/can-pop.webp', k: 'img', x: 6, y: 86, r: -14 },
    { t: 'नमस्ते', k: 'cream', hi: true, x: 50, y: 16, r: -3, z: 2.4 },
    { t: 'GitHub ↗', k: 'red', x: 58, y: 86, r: 3 },
    { k: 'star', x: 12, y: 18, r: 10 },
    { k: 'star', c: 'c1', x: 87, y: 15, r: -12 },
    { k: 'star', c: 'c2', x: 44, y: 62, r: 6 },
  ];
  return (
    <section className="hero" id="hero" aria-labelledby="name" style={style({ '--len': String(site.name.trim().length) })}>
      <button className="skip-intro" id="skip-intro" type="button">
        Skip intro <span aria-hidden="true">→</span>
      </button>

      {/* Layer 1: what lies UNDER the paper. Carpet of arches, a red poster, the figure breaking out of it. */}
      <div className="under">
        <div className="carpet" aria-hidden="true" />

        {/* Huge outlined words drifting behind the poster. Edit BIGWORDS below to change them. */}
        <div className="bigtype" aria-hidden="true">
          {BIGWORDS.map((row, i) => (
            <div key={i} className={`bigrow r${i}`} lang={row.lang}>
              <div className="track">
                <span>{row.text}</span>
                <span>{row.text}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="poster">
          <div className="poster-bg" aria-hidden="true" />

          <ul className="caps">
            {roles.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          {/* To change the picture, replace /public/assets/hero-illustration.webp (transparent background, 3:4). */}
          <div className="figure">
            <Image
              src="/assets/hero-illustration.webp"
              alt="Illustrated portrait of the site owner in a floral halter dress, hair swept to one side"
              width={1086}
              height={1448}
              sizes="(max-width: 760px) 70vw, 46vw"
              priority
            />
          </div>

          <h1
            className={site.nameHindi ? 'name name-hi' : 'name'}
            id="name"
            lang={site.nameHindi ? 'hi' : undefined}
            aria-label={site.name}
          >
            {site.nameHindi ?? site.name}
          </h1>

          <p className="sticker s1">Portfolio {site.year}</p>
          <a className="sticker s2" href="#work">
            See the work <span aria-hidden="true">↓</span>
          </a>
          <a className="sticker s3" href={site.github} target="_blank" rel="noopener noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* Intro: stickers slap onto the carpet, then burst away (only visible while the intro plays) */}
      <div className="frenzy" aria-hidden="true">
        {frenzy.map((f, i) => (
          <span
            key={i}
            className={`fs fs-${f.k}${f.hi ? ' fs-hi' : ''}${f.c ? ` ${f.c}` : ''}`}
            style={style({ '--x': String(f.x), '--y': String(f.y), '--r': `${f.r}deg`, '--d': `${(0.2 + i * 0.17).toFixed(2)}s`, '--z': String(f.z ?? 1) })}
          >
            {f.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.img} alt="" />
            ) : (
              f.t
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
