type Word = { t: string; hi?: boolean };

/**
 * A slow marquee band between two sections. Purely decorative (hidden from screen readers).
 * `tone` picks the colour; `reverse` runs it the other way so neighbouring bands don't move in step.
 */
export default function Strip({ words, tone, reverse }: { words: Word[]; tone: 'sun' | 'red' | 'teal' | 'ink'; reverse?: boolean }) {
  const set = (key: number) => (
    <span className="strip-set" key={key}>
      {words.map((w, i) => (
        <span key={i} className={w.hi ? 'hi' : undefined} lang={w.hi ? 'hi' : undefined}>
          {w.t}
          <b aria-hidden="true">★</b>
        </span>
      ))}
    </span>
  );
  return (
    <div className={`strip ${tone}${reverse ? ' rev' : ''}`} aria-hidden="true">
      <div className="strip-track">{[0, 1, 2, 3].map(set)}</div>
    </div>
  );
}
