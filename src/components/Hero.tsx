import Image from 'next/image';
import type { CSSProperties } from 'react';
import { site } from '@/data/site';

/** One entry per letter: animation delay, rotation and baseline wobble give the hand-cut feel. */
const LETTERS: Array<{ ch: string; d: string; r: string; y: string }> = [
  { ch: 'P', d: '0s', r: '-3deg', y: '2px' },
  { ch: 'O', d: '.16s', r: '2deg', y: '-3px' },
  { ch: 'R', d: '.32s', r: '-2deg', y: '3px' },
  { ch: 'T', d: '.48s', r: '3deg', y: '-2px' },
  { ch: 'F', d: '.64s', r: '-1deg', y: '2px' },
  { ch: 'O', d: '.8s', r: '2deg', y: '-3px' },
  { ch: 'L', d: '.96s', r: '-3deg', y: '2px' },
  { ch: 'I', d: '1.12s', r: '1deg', y: '-2px' },
  { ch: 'O', d: '1.28s', r: '-2deg', y: '3px' },
];

const style = (vars: Record<string, string>) => vars as CSSProperties;

export default function Hero() {
  const roles = site.eyebrow.split('·').map((r) => r.trim());
  return (
    <section className="hero" id="hero" aria-labelledby="name" style={style({ '--len': String(site.name.trim().length) })}>
      <button className="skip-intro" id="skip-intro" type="button">
        Skip intro <span aria-hidden="true">→</span>
      </button>

      {/* Layer 1: what lies UNDER the paper. Carpet of arches, a red poster, the figure breaking out of it. */}
      <div className="under">
        <div className="carpet" aria-hidden="true" />

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

          <h1 className="name" id="name">
            {site.name}
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

      {/* Layer 2: light spilling through the tear */}
      <div className="spill" aria-hidden="true" />

      {/* Layer 3: lower half of the paper, peels away */}
      <div className="piece piece-bottom" aria-hidden="true">
        <div className="paper">
          <div className="sunlight" />
        </div>
      </div>

      {/* Layer 4: upper half of the paper, carries the title and rises to the top */}
      <div className="piece piece-top" aria-hidden="true">
        <div className="fiber" />
        <div className="paper">
          <div className="sunlight" />
          <div className="stage">
            <svg className="doodle d-star" viewBox="0 0 100 100">
              <path pathLength={1} d="M50 6 L58 38 L92 30 L66 52 L90 80 L56 66 L46 96 L40 62 L8 70 L34 46 L14 18 L44 36 Z" />
            </svg>
            <svg className="doodle d-spark1" viewBox="0 0 60 60">
              <path pathLength={1} d="M30 4 V56 M4 30 H56 M12 12 L48 48 M48 12 L12 48" />
            </svg>
            <svg className="doodle d-sun" viewBox="0 0 120 120">
              <circle pathLength={1} cx="60" cy="60" r="20" />
              <path pathLength={1} d="M60 14 V28 M60 92 V106 M14 60 H28 M92 60 H106 M27 27 L37 37 M83 83 L93 93 M93 27 L83 37 M37 83 L27 93" />
            </svg>
            <svg className="doodle d-leaf" viewBox="0 0 100 100">
              <path pathLength={1} d="M18 82 C10 40 44 12 86 14 C88 54 62 86 18 82 Z M18 82 C34 62 52 44 78 24" />
            </svg>
            <svg className="doodle d-spark2" viewBox="0 0 60 60">
              <path pathLength={1} d="M30 6 V54 M6 30 H54" />
            </svg>

            <p className="title" aria-hidden="true">
              {LETTERS.map((l, i) => (
                <span key={i} className="letter" style={style({ '--d': l.d, '--r': l.r, '--y': l.y })}>
                  {l.ch}
                </span>
              ))}
            </p>
            <p className="year" aria-hidden="true">
              <span>{site.year}</span>
              <svg viewBox="0 0 220 24" preserveAspectRatio="none">
                <path pathLength={1} d="M4 8 Q60 2 110 7 T216 6" />
                <path pathLength={1} d="M26 18 Q90 12 140 17 T196 16" />
              </svg>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
