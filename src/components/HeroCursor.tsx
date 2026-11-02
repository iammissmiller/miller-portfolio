'use client';

import { useEffect } from 'react';

/**
 * Cursor effects (mouse only, off for reduced motion):
 *  - everywhere: the pointer becomes a patterned soda can that tilts as you move and pops open over links
 *  - in the hero only: a warm light follows the pointer and the layers drift at different depths
 */
export default function HeroCursor() {
  useEffect(() => {
    const hero = document.getElementById('hero');
    const root = document.documentElement;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hero || !fine || reduce) return;

    const can = document.createElement('div');
    can.className = 'cursor-ring';
    can.setAttribute('aria-hidden', 'true');
    can.innerHTML =
      '<img class="can-idle" src="/assets/can.webp" alt="" draggable="false" /><img class="can-pop" src="/assets/can-pop.webp" alt="" draggable="false" />';
    document.body.appendChild(can);
    root.classList.add('can-cursor');

    let cx = 0, cy = 0;        // pointer in viewport px
    let tilt = 0, lastX = 0;
    let px = 0, py = 0;        // hero parallax, eased -1..1
    let seen = false, pending = false, inside = false, raf = 0;
    const last = { px: '', py: '', sx: '', sy: '' };

    // The loop only runs while something is actually changing; it stops when the pointer rests.
    const tick = () => {
      const r = hero.getBoundingClientRect(); // read first, so no forced layout after writes
      const moving = pending;
      pending = false;

      tilt += (Math.max(-22, Math.min(22, (cx - lastX) * 1.4)) - tilt) * 0.18;
      lastX = cx;
      can.style.transform = `translate(${cx}px, ${cy}px) rotate(${tilt.toFixed(1)}deg)`;

      const inHero = seen && cy >= r.top && cy <= r.bottom && cx >= r.left && cx <= r.right;
      const nx = inHero ? ((cx - r.left) / r.width) * 2 - 1 : 0;
      const ny = inHero ? ((cy - r.top) / r.height) * 2 - 1 : 0;
      px += (nx - px) * 0.1;
      py += (ny - py) * 0.1;
      if (Math.abs(px - nx) < 0.002) px = nx;
      if (Math.abs(py - ny) < 0.002) py = ny;

      const v = { px: px.toFixed(3), py: py.toFixed(3), sx: `${(cx - r.left).toFixed(0)}px`, sy: `${(cy - r.top).toFixed(0)}px` };
      if (v.px !== last.px) hero.style.setProperty('--px', (last.px = v.px));
      if (v.py !== last.py) hero.style.setProperty('--py', (last.py = v.py));
      if (inHero && v.sx !== last.sx) hero.style.setProperty('--sx', (last.sx = v.sx));
      if (inHero && v.sy !== last.sy) hero.style.setProperty('--sy', (last.sy = v.sy));
      if (inHero !== inside) hero.classList.toggle('pointer-in', (inside = inHero));

      const busy = moving || Math.abs(tilt) > 0.05 || px !== nx || py !== ny;
      raf = busy ? requestAnimationFrame(tick) : 0;
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      cx = e.clientX;
      cy = e.clientY;
      if (!seen) lastX = cx;
      seen = true;
      pending = true;
      can.classList.add('show');
      can.classList.toggle('on-link', !!(e.target as Element).closest('a, button, [role="button"]'));
      start();
    };
    const onLeave = () => {
      seen = false;
      can.classList.remove('show', 'on-link');
      start();
    };
    document.addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      root.classList.remove('can-cursor');
      can.remove();
    };
  }, []);

  return null;
}