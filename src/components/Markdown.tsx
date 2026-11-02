import type { ReactNode } from 'react';

/**
 * A small, safe markdown renderer for the case studies. Supported:
 *   ## / ### headings, paragraphs, - lists, 1. lists, > quotes, --- rules,
 *   **bold**, *italic*, `code`, [links](https://...), and ![alt](/images/file.png) on their own line.
 * Everything is built as React elements (no raw HTML), and only http(s), mailto, / and # links are allowed.
 */

const okHref = (h: string) => /^(https?:\/\/|mailto:|\/|#)/i.test(h);
const okSrc = (h: string) => /^(https?:\/\/|\/)/i.test(h);

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyBase}-${n++}`;
    if (tok.startsWith('**')) out.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith('`')) out.push(<code key={key}>{tok.slice(1, -1)}</code>);
    else if (tok.startsWith('[')) {
      const mm = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(tok);
      if (mm && okHref(mm[2])) {
        const external = /^https?:/i.test(mm[2]);
        out.push(
          <a key={key} href={mm[2]} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {mm[1]}
          </a>,
        );
      } else out.push(tok);
    } else out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();
    if (!t) {
      i++;
      continue;
    }
    if (/^-{3,}$/.test(t)) {
      blocks.push(<hr key={k++} />);
      i++;
      continue;
    }
    const h = /^(#{1,3})\s+(.*)$/.exec(t);
    if (h) {
      blocks.push(h[1].length === 3 ? <h3 key={k++}>{inline(h[2], `h${k}`)}</h3> : <h2 key={k++}>{inline(h[2], `h${k}`)}</h2>);
      i++;
      continue;
    }
    const img = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(t);
    if (img && okSrc(img[2])) {
      blocks.push(
        <figure key={k++}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img[2]} alt={img[1]} loading="lazy" />
          {img[1] ? <figcaption>{img[1]}</figcaption> : null}
        </figure>,
      );
      i++;
      continue;
    }
    if (t.startsWith('>')) {
      const q: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) q.push(lines[i].trim().replace(/^>\s?/, '')), i++;
      blocks.push(<blockquote key={k++}>{inline(q.join(' '), `q${k}`)}</blockquote>);
      continue;
    }
    if (/^[-*]\s+/.test(t)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) items.push(lines[i].trim().replace(/^[-*]\s+/, '')), i++;
      blocks.push(
        <ul key={k++}>
          {items.map((it, j) => (
            <li key={j}>{inline(it, `u${k}-${j}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (/^\d+\.\s+/.test(t)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) items.push(lines[i].trim().replace(/^\d+\.\s+/, '')), i++;
      blocks.push(
        <ol key={k++}>
          {items.map((it, j) => (
            <li key={j}>{inline(it, `o${k}-${j}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,3}\s|-{3,}$|>|[-*]\s|\d+\.\s|!\[)/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim());
      i++;
    }
    if (!para.length) {
      para.push(t);
      i++;
    }
    blocks.push(<p key={k++}>{inline(para.join(' '), `p${k}`)}</p>);
  }

  return <div className="md">{blocks}</div>;
}
