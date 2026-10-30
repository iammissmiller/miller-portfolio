'use client';

import { useEffect } from 'react';

/**
 * Behaviour layer. Renders nothing. It:
 *  1. builds the torn-paper edge (one jagged line shared by both paper halves)
 *  2. runs the opening sequence by adding classes to <html>; the CSS does the animating
 *  3. handles Skip, Esc, Replay, first-visit-only and reduced motion
 *  4. reveals sections on scroll and dims the golden-hour light as you scroll down
 *
 * The page content is plain server-rendered HTML, so everything still works without this.
 */

const SEEN_KEY = 'portfolio-intro-seen-v1';
const STEPS: Array<[string, number]> = [
  ['p-write', 300],
  ['p-tear', 2700],
  ['p-reveal', 3500],
  ['p-id', 4300],
];
const END_MS = 5800;
const ALL = ['playing', 'p-write', 'p-tear', 'p-reveal', 'p-id'];

/** Seeded random so the tear is identical on every load. */
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pct = (n: number) => `${n.toFixed(2)}%`;

function buildTear(hero: HTMLElement) {
  const rnd = mulberry32(2026);
  const n = 44;
  const base = 58;
  let y = base;
  const edge: Array<[number, number]> = [];
  for (let i = 0; i <= n; i++) {
    let x = (i / n) * 100;
    if (i > 0 && i < n) x += (rnd() - 0.5) * 0.5;
    y += (rnd() - 0.5) * 1.5; // slow wander = organic tear
    y = Math.max(base - 2.4, Math.min(base + 2.4, y));
    edge.push([x, y + (rnd() - 0.5) * 0.45]); // fine fibre-level jitter
  }
  const fiber = edge.map(([x, ey]): [number, number] => [x, ey + 0.55 + rnd() * 1.25]);

  const top = ['0% 0%', '100% 0%'];
  for (let a = edge.length - 1; a >= 0; a--) top.push(`${pct(edge[a][0])} ${pct(edge[a][1])}`);

  const bottom = edge.map(([x, ey]) => `${pct(x)} ${pct(ey)}`);
  bottom.push('100% 100%', '0% 100%');

  const fib = edge.map(([x, ey]) => `${pct(x)} ${pct(ey)}`);
  for (let b = fiber.length - 1; b >= 0; b--) fib.push(`${pct(fiber[b][0])} ${pct(fiber[b][1])}`);

  hero.style.setProperty('--clip-top', `polygon(${top.join(',')})`);
  hero.style.setProperty('--clip-bottom', `polygon(${bottom.join(',')})`);
  hero.style.setProperty('--clip-fiber', `polygon(${fib.join(',')})`);
}

/** Torn divider between the hero and the About section. */
function buildDivider() {
  const el = document.getElementById('torn-divider');
  if (!el) return;
  const rnd = mulberry32(77);
  const pts: string[] = [];
  const n = 60;
  let y = 40;
  for (let i = 0; i <= n; i++) {
    y += (rnd() - 0.5) * 22;
    y = Math.max(12, Math.min(70, y));
    pts.push(`${pct((i / n) * 100)} ${pct(y)}`);
  }
  pts.push('100% 100%', '0% 100%');
  el.style.clipPath = `polygon(${pts.join(',')})`;
}

export default function IntroEngine() {
  useEffect(() => {
    const root = document.documentElement;
    const hero = document.getElementById('hero');
    if (!hero) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.classList.add('js');

    let timers: number[] = [];
    const clearTimers = () => {
      timers.forEach((t) => window.clearTimeout(t));
      timers = [];
    };
    const markSeen = () => {
      try {
        localStorage.setItem(SEEN_KEY, '1');
      } catch {
        /* storage unavailable: fine, the intro simply plays again next time */
      }
    };

    const finish = (focusName = false) => {
      clearTimers();
      ALL.forEach((c) => root.classList.remove(c));
      markSeen();
      if (focusName) {
        const h = document.getElementById('name');
        if (h) {
          h.setAttribute('tabindex', '-1');
          h.focus({ preventScroll: true });
        }
      }
    };

    const play = () => {
      clearTimers();
      ALL.forEach((c) => root.classList.remove(c));
      root.classList.add('playing');
      void hero.offsetWidth; // restart CSS animations cleanly
      STEPS.forEach(([cls, ms]) => {
        timers.push(window.setTimeout(() => root.classList.add(cls), ms));
      });
      timers.push(window.setTimeout(() => finish(), END_MS));
    };

    buildTear(hero);
    buildDivider();

    // The inline script in <head> already decided: first visit and motion allowed.
    if (root.classList.contains('playing')) play();

    const skip = document.getElementById('skip-intro');
    const onSkip = () => finish(true);
    skip?.addEventListener('click', onSkip);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && root.classList.contains('playing')) finish(true);
    };
    document.addEventListener('keydown', onKey);

    const onReplay = () => {
      window.scrollTo(0, 0);
      if (!reduceMotion) play(); // respect the setting: no animated replay
    };
    window.addEventListener('portfolio:replay', onReplay);


    // reveal on scroll
    const reveals = document.querySelectorAll<HTMLElement>('.reveal');
    let io: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add('in');
              io?.unobserve(en.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
      reveals.forEach((el) => io?.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('in'));
    }

    // scroll-linked golden-hour light
    let ticking = false;
    const updateBeam = () => {
      const v = Math.max(0, 1 - window.scrollY / (window.innerHeight * 2.4));
      root.style.setProperty('--beam', v.toFixed(3));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateBeam);
      }
    };
    if (!reduceMotion) {
      window.addEventListener('scroll', onScroll, { passive: true });
      updateBeam();
    }

    return () => {
      clearTimers();
      skip?.removeEventListener('click', onSkip);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('portfolio:replay', onReplay);
      window.removeEventListener('scroll', onScroll);
      io?.disconnect();
    };
  }, []);

  return null;
}
