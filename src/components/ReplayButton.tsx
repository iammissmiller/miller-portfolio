'use client';

export default function ReplayButton() {
  return (
    <button
      type="button"
      className="replay"
      id="replay"
      onClick={() => window.dispatchEvent(new Event('portfolio:replay'))}
    >
      ↺ Replay the opening
    </button>
  );
}
