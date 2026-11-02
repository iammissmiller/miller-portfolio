'use client';

import { useEffect } from 'react';

/**
 * Cards marked with the `tilt` class lean toward the pointer (mouse only, off for reduced motion).
 * It only writes two CSS variables on the card under the pointer, once per frame.
 */
export default function CardTilt() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    let cur: HTMLElement | null = null;
    let ev: PointerEvent | null = null;
    let raf = 0;

    const clear = (el: HTMLElement | null) => {
      el?.style.removeProperty('--rx');
      el?.style.removeProperty('--ry');
    };
    const apply = () => {
      raf = 0;
      if (!cur || !ev) return;
      const r = cur.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      cur.style.setProperty('--rx', `${(-y * 12).toFixed(2)}deg`);
      cur.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const t = (e.target as Element).closest<HTMLElement>('.tilt');
      if (t !== cur) {
        clear(cur);
        cur = t;
      }
      ev = e;
      if (cur && !raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      clear(cur);
      cur = null;
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      clear(cur);
    };
  }, []);

  return null;
}
