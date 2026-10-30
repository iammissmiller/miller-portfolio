'use client';

import { useEffect } from 'react';

/**
 * Cursor effects for the hero (mouse only, off for reduced motion):
 *  1. a warm light follows the pointer across the carpet
 *  2. carpet, figure and stickers drift at different depths (parallax)
 *  3. the pointer becomes a patterned soda can that tilts as you move and pops open over links
 */
export default function HeroCursor() {
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    ring.innerHTML = '<img class="can-idle" src="/assets/can.webp" alt="" draggable="false" /><img class="can-pop" src="/assets/can-pop.webp" alt="" draggable="false" />';
    hero.appendChild(ring);
    hero.classList.add('can-cursor');
    let tilt = 0, lastX = 0;

    let tx = 0, ty = 0;        // target (pointer, px inside hero)
    let rx = 0, ry = 0;        // ring position (eased)
    let px = 0, py = 0;        // parallax (eased, -1..1)
    let inside = false, raf = 0;

    const tick = () => {
      const r = hero.getBoundingClientRect();
      rx = tx;
      ry = ty;
      tilt += (Math.max(-22, Math.min(22, (tx - lastX) * 1.4)) - tilt) * 0.18;
      lastX = tx;
      const nx = inside ? (tx / r.width) * 2 - 1 : 0;
      const ny = inside ? (ty / r.height) * 2 - 1 : 0;
      px += (nx - px) * 0.07;
      py += (ny - py) * 0.07;
      hero.style.setProperty('--px', px.toFixed(3));
      hero.style.setProperty('--py', py.toFixed(3));
      hero.style.setProperty('--sx', `${tx.toFixed(0)}px`);
      hero.style.setProperty('--sy', `${ty.toFixed(0)}px`);
      ring.style.transform = `translate(${rx}px, ${ry}px) rotate(${tilt.toFixed(1)}deg)`;
      const moving = Math.abs(nx - px) + Math.abs(ny - py) + Math.abs(tilt) > 0.05;
      raf = moving || inside ? requestAnimationFrame(tick) : 0;
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = hero.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!inside) { rx = tx; ry = ty; }
      inside = true;
      hero.classList.add('pointer-in');
      const t = e.target as Element;
      ring.classList.toggle('on-link', !!t.closest('a, button'));
      start();
    };
    const onLeave = () => {
      inside = false;
      hero.classList.remove('pointer-in');
      ring.classList.remove('on-link');
      start();
    };
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      hero.classList.remove('can-cursor');
      ring.remove();
    };
  }, []);

  return null;
}
