'use client';

import { useEffect } from 'react';

/**
 * A small can rides down the right edge as you scroll and leans with the scroll speed.
 * One fixed element, transform only, so it costs almost nothing. Wide screens and motion-friendly visitors only.
 */
export default function ScrollCan() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = document.createElement('div');
    el.className = 'scrollcan';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<img src="/assets/can.webp" alt="" draggable="false" />';
    document.body.appendChild(el);

    let ticking = false;
    let lastY = window.scrollY;
    let tilt = 0;

    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const track = Math.max(0, window.innerHeight - 190);
      const target = Math.max(-25, Math.min(25, (window.scrollY - lastY) * 0.6));
      lastY = window.scrollY;
      tilt += (target - tilt) * 0.4;
      el.style.transform = `translate3d(0, ${(p * track).toFixed(1)}px, 0) rotate(${tilt.toFixed(1)}deg)`;
      if (Math.abs(tilt) > 0.3) {
        ticking = true;
        requestAnimationFrame(update); // let the lean settle once scrolling stops
      }
    };
    const kick = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    update();
    return () => {
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
      el.remove();
    };
  }, []);

  return null;
}
