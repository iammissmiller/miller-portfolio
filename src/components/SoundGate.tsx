'use client';

import { useEffect, useRef, useState } from 'react';
import { play, setEnabled, startAmbient, stopAmbient, suspendAudio, unlock } from '@/lib/sfx';

type Props = {
  name: string;
  nameHindi?: string;
  year: string;
  music?: string;
  copy: { line: string; loud: string; quiet: string; note: string };
};

const MUSIC_VOLUME = 0.35;

/**
 * 1. The "Enter" screen: browsers only allow sound after a click, so the intro waits for one.
 * 2. Sound: intro effects, small UI sounds, and optional background music (public/audio/theme.mp3).
 * 3. The Sound on/off sticker.
 * Sound is always off until the visitor chooses it.
 */
export default function SoundGate({ name, nameHindi, year, music, copy }: Props) {
  const [on, setOn] = useState(false);
  const onRef = useRef(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const fader = useRef<number | undefined>(undefined);
  const primary = useRef<HTMLButtonElement>(null);

  const fadeTo = (target: number, done?: () => void) => {
    window.clearInterval(fader.current);
    fader.current = window.setInterval(() => {
      const a = audio.current;
      if (!a) return window.clearInterval(fader.current);
      const step = target > a.volume ? 0.025 : -0.04;
      const v = Math.min(1, Math.max(0, a.volume + step));
      a.volume = v;
      if ((step > 0 && v >= target) || (step < 0 && v <= target)) {
        a.volume = target;
        window.clearInterval(fader.current);
        done?.();
      }
    }, 50);
  };

  const startMusic = () => {
    if (!music) return startAmbient(); // no track supplied: use the generated background loop
    let a = audio.current;
    if (!a) {
      a = new Audio(music);
      a.loop = true;
      a.preload = 'auto';
      a.volume = 0;
      audio.current = a;
    }
    a.play().catch(() => {
      /* blocked or file missing: stay silent */
    });
    fadeTo(MUSIC_VOLUME);
  };

  /** Must be called from a click handler. */
  const setSound = (v: boolean) => {
    onRef.current = v;
    setOn(v);
    setEnabled(v);
    if (v) {
      unlock();
      startMusic();
    } else {
      stopAmbient();
      fadeTo(0, () => audio.current?.pause());
    }
  };

  const enter = (withSound: boolean) => {
    setSound(withSound);
    document.documentElement.classList.remove('gated');
    window.dispatchEvent(new Event('portfolio:enter'));
  };

  useEffect(() => {
    if (document.documentElement.classList.contains('gated')) primary.current?.focus();

    // intro effects, timed to the classes IntroEngine adds
    const onSfx = (e: Event) => {
      if (!onRef.current) return;
      const cls = (e as CustomEvent<string>).detail;
      if (cls === 'p-hit') {
        // a soft tap for every other sticker, so it stays light
        document.querySelectorAll<HTMLElement>('.fs').forEach((el, i) => {
          if (i % 2) return;
          const d = parseFloat(el.style.getPropertyValue('--d')) || 0;
          play('pop', i, d);
        });
      } else if (cls === 'p-clear') play('whoosh');
      else if (cls === 'p-poster' || cls === 'p-figure') play('slap');
      else if (cls === 'p-name') play('stab');
      else if (cls === 'p-stk') play('pop', 2);
      else if (cls === 'p-id') play('chime');
    };
    window.addEventListener('portfolio:sfx', onSfx);

    // a soft click on buttons and links (no hover sounds)
    const onDown = (e: PointerEvent) => {
      if (!onRef.current) return;
      const el = (e.target as Element).closest?.('a, button');
      if (el && !el.closest('.gate')) play('click');
    };
    document.addEventListener('pointerdown', onDown);

    // pause the music while the tab is hidden
    const onVis = () => {
      if (!onRef.current) return;
      suspendAudio(document.hidden);
      const a = audio.current;
      if (!a) return;
      if (document.hidden) a.pause();
      else a.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      window.removeEventListener('portfolio:sfx', onSfx);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', onVis);
      window.clearInterval(fader.current);
    };
  }, []);

  return (
    <>
      <div className="gate" role="dialog" aria-modal="true" aria-label={`Enter ${name}'s portfolio`}>
        <div className="gate-card">
          <p className="mono">Portfolio / {year}</p>
          <h2 className="gate-name">{name}</h2>
          {nameHindi ? (
            <p className="gate-hi" lang="hi">
              {nameHindi}
            </p>
          ) : null}
          <p className="gate-line">{copy.line}</p>
          <div className="gate-actions">
            <button type="button" className="btn" ref={primary} onClick={() => enter(true)}>
              {copy.loud}
            </button>
            <button type="button" className="btn quiet" onClick={() => enter(false)}>
              {copy.quiet}
            </button>
          </div>
          <p className="gate-note mono">{copy.note}</p>
        </div>
      </div>

      <button type="button" className="sound-toggle" aria-pressed={on} onClick={() => setSound(!on)}>
        <span aria-hidden="true">♪</span> Sound {on ? 'on' : 'off'}
      </button>
    </>
  );
}
