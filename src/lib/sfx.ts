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
      master.gain.value = 0.7;
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

export type Sfx = 'pop' | 'slap' | 'whoosh' | 'stab' | 'chime' | 'tick' | 'click';

/**
 * Deliberately soft and low: dull paper taps and thumps, no high beeps.
 * `i` varies the pitch of taps slightly; `delay` (seconds) schedules the sound on the audio clock.
 */
export function play(name: Sfx, i = 0, delay = 0) {
  if (!enabled || !ctx) return;
  switch (name) {
    case 'pop': {
      const f = 230 + (i % 5) * 22;
      tone('sine', f, f * 0.45, 0.1, 0.5, delay);
      noise('lowpass', 1800, 300, 0.07, 0.2, delay, 0.1);
      break;
    }
    case 'slap':
      tone('sine', 120, 45, 0.24, 0.9, delay);
      noise('lowpass', 900, 150, 0.14, 0.4, delay, 0.05);
      break;
    case 'whoosh':
      noise('lowpass', 250, 1800, 0.7, 0.95, delay, 0.5, 0.5);
      break;
    case 'stab':
      tone('sine', 98, 55, 0.45, 0.95, delay);
      tone('triangle', 196, 190, 0.35, 0.14, delay);
      break;
    case 'chime':
      tone('sine', 660, 656, 0.7, 0.26, delay);
      tone('sine', 990, 985, 0.9, 0.2, delay + 0.12);
      break;
    case 'tick':
      break; // hover ticks removed: too busy
    case 'click':
      tone('sine', 260, 140, 0.08, 0.35, delay);
      break;
  }
}

/* ---------------- Ambient background music (generated, no file) ----------------
 * A slow, warm loop: a soft pad on four chords (Am, F, C, G), a quiet hand-drum pulse
 * and now and then a plucked note from the A minor pentatonic scale with a gentle echo.
 * If a real track exists at public/audio/theme.mp3 it is used instead (see SoundGate). */

const CHORDS = [
  [110, 164.8, 220, 261.6], // Am
  [87.3, 130.8, 174.6, 220], // F
  [130.8, 196, 261.6, 329.6], // C
  [98, 146.8, 196, 246.9], // G
];
const PENTA = [220, 261.6, 293.7, 329.6, 392, 440, 523.3, 587.3]; // A C D E G A C D
const BPM = 78;
const STEP = 60 / BPM / 4; // a sixteenth note, in seconds

let amb: { bus: GainNode; timer: number; next: number; step: number; echo: GainNode } | null = null;

function padNote(f: number, at: number, dur: number, bus: GainNode) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const lp = ctx.createBiquadFilter();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.value = f;
  o.detune.value = (Math.random() - 0.5) * 8;
  lp.type = 'lowpass';
  lp.frequency.value = 700;
  g.gain.setValueAtTime(0.0001, at);
  g.gain.linearRampToValueAtTime(0.05, at + 1.2);
  g.gain.linearRampToValueAtTime(0.0001, at + dur);
  o.connect(lp).connect(g).connect(bus);
  o.start(at);
  o.stop(at + dur + 0.1);
}

function pluck(f: number, at: number, bus: GainNode, echo: GainNode) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const lp = ctx.createBiquadFilter();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.value = f;
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(2200, at);
  lp.frequency.exponentialRampToValueAtTime(500, at + 0.5);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(0.11, at + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, at + 0.8);
  o.connect(lp).connect(g);
  g.connect(bus);
  g.connect(echo);
  o.start(at);
  o.stop(at + 0.9);
}

function drum(kind: 'thump' | 'tick', at: number, bus: GainNode) {
  if (!ctx || !noiseBuf) return;
  if (kind === 'thump') {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(95, at);
    o.frequency.exponentialRampToValueAtTime(48, at + 0.18);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.28, at + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.28);
    o.connect(g).connect(bus);
    o.start(at);
    o.stop(at + 0.3);
  } else {
    const s = ctx.createBufferSource();
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    s.buffer = noiseBuf;
    f.type = 'bandpass';
    f.frequency.value = 3200;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.045, at + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
    s.connect(f).connect(g).connect(bus);
    s.start(at);
    s.stop(at + 0.08);
  }
}

function tick() {
  if (!ctx || !amb) return;
  while (amb.next < ctx.currentTime + 0.5) {
    const st = amb.step;
    const t = amb.next;
    const bar = Math.floor(st / 16) % CHORDS.length;
    const chord = CHORDS[bar];
    if (st % 16 === 0) chord.forEach((f, k) => padNote(f, t + k * 0.05, STEP * 16 + 1.5, amb!.bus));
    if (st % 16 === 0 || st % 16 === 10) drum('thump', t, amb.bus);
    if (st % 4 === 2) drum('tick', t, amb.bus);
    if (st % 2 === 0 && Math.random() < 0.28) {
      const pool = Math.random() < 0.5 ? chord.map((f) => f * 2) : PENTA;
      pluck(pool[Math.floor(Math.random() * pool.length)], t, amb.bus, amb.echo);
    }
    amb.step++;
    amb.next += STEP;
  }
}

export function startAmbient() {
  if (!ctx || !master) return;
  if (amb) {
    amb.bus.gain.cancelScheduledValues(ctx.currentTime);
    amb.bus.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);
    return;
  }
  const bus = ctx.createGain();
  bus.gain.value = 0.0001;
  bus.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);
  bus.connect(ctx.destination);
  const echo = ctx.createGain();
  echo.gain.value = 0.5;
  const dl = ctx.createDelay(1);
  dl.delayTime.value = STEP * 6;
  const fb = ctx.createGain();
  fb.gain.value = 0.38;
  echo.connect(dl);
  dl.connect(fb).connect(dl);
  dl.connect(bus);
  amb = { bus, timer: window.setInterval(tick, 120), next: ctx.currentTime + 0.1, step: 0, echo };
  tick();
}

export function stopAmbient() {
  if (!ctx || !amb) return;
  const a = amb;
  amb = null;
  window.clearInterval(a.timer);
  a.bus.gain.cancelScheduledValues(ctx.currentTime);
  a.bus.gain.setValueAtTime(Math.max(0.0001, a.bus.gain.value), ctx.currentTime);
  a.bus.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
  window.setTimeout(() => a.bus.disconnect(), 1400);
}

/** Pause or resume everything (used when the tab is hidden). */
export function suspendAudio(pause: boolean) {
  if (!ctx) return;
  if (pause) void ctx.suspend();
  else void ctx.resume();
}
