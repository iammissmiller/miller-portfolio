/**
 * Tiny sound engine. Every sound is synthesised with the Web Audio API,
 * so there are no audio files and no licensing questions.
 * Browsers only allow sound after a click, so unlock() must be called from a click handler.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let enabled = false;

export const setEnabled = (v: boolean) => {
  enabled = v;
};
export const isEnabled = () => enabled;

export function unlock(): boolean {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return false;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return true;
  } catch {
    return false;
  }
}

/** A pitched blip that slides from f0 to f1. */
function tone(type: OscillatorType, f0: number, f1: number, dur: number, vol: number, at = 0) {
  if (!ctx || !master) return;
  const t = ctx.currentTime + at;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

/** Filtered noise: the body of whooshes, thumps and paper sounds. `peak` is where the swell tops out (0..1). */
function noise(filter: BiquadFilterType, f0: number, f1: number, dur: number, vol: number, at = 0, peak = 0.08, q = 1) {
  if (!ctx || !master || !noiseBuf) return;
  const t = ctx.currentTime + at;
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  s.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = filter;
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, t);
  f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + dur * peak);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(master);
  s.start(t);
  s.stop(t + dur + 0.05);
}

const NOTES = [440, 523, 659, 587, 784, 494, 698];

export type Sfx = 'pop' | 'slap' | 'whoosh' | 'stab' | 'chime' | 'tick' | 'click';

/** `i` varies the pitch of pops; `delay` (seconds) schedules the sound on the audio clock. */
export function play(name: Sfx, i = 0, delay = 0) {
  if (!enabled || !ctx) return;
  switch (name) {
    case 'pop': {
      const f = NOTES[i % NOTES.length];
      tone('sine', f * 1.5, f * 0.7, 0.13, 0.5, delay);
      noise('highpass', 4000, 4000, 0.03, 0.12, delay, 0.1);
      break;
    }
    case 'slap':
      tone('sine', 150, 45, 0.24, 0.9, delay);
      noise('lowpass', 1400, 200, 0.14, 0.45, delay, 0.05);
      break;
    case 'whoosh':
      noise('bandpass', 300, 3600, 0.75, 0.55, delay, 0.45, 0.8);
      break;
    case 'stab':
      tone('triangle', 220, 215, 0.34, 0.3, delay);
      tone('triangle', 330, 325, 0.34, 0.24, delay);
      tone('triangle', 440, 435, 0.34, 0.2, delay);
      tone('sine', 110, 55, 0.3, 0.5, delay);
      break;
    case 'chime':
      tone('sine', 880, 876, 0.7, 0.32, delay);
      tone('sine', 1318, 1310, 0.95, 0.26, delay + 0.12);
      break;
    case 'tick':
      noise('highpass', 5000, 5000, 0.02, 0.1, delay, 0.1);
      tone('sine', 1800, 1200, 0.035, 0.06, delay);
      break;
    case 'click':
      tone('sine', 700, 330, 0.08, 0.32, delay);
      break;
  }
}
