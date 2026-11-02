import { site } from '@/data/site';
import ReplayButton from './ReplayButton';

/** Splits text into hoverable letters; each word stays together so lines never break mid-word. */
function Wobble({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, wi) => (
        <span key={wi} aria-hidden="true">
          {wi > 0 ? ' ' : null}
          <span className="word">
            {word.split('').map((c, ci) => (
              <span key={ci} className="w">
                {c}
              </span>
            ))}
          </span>
        </span>
      ))}
    </>
  );
}

type Item = { label: string; href?: string; text?: string; fallback: string; external?: boolean };

export default function Contact() {
  const items: Item[] = [
    { label: 'GitHub', href: site.github, text: site.github.replace('https://', ''), fallback: '', external: true },
    { label: 'LinkedIn', href: site.linkedin, text: site.linkedin?.replace('https://', ''), fallback: 'link to add', external: true },
    { label: 'Email', href: site.email ? `mailto:${site.email}` : undefined, text: site.email, fallback: 'address to add' },
    { label: 'Resume', href: site.resume ?? '/resume', text: site.resume ? 'Download PDF' : 'View resume', fallback: '' },
  ];

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-h">
      <div className="wrap">
        <p className="label reveal">
          <span>05</span> / Contact <i lang="hi">संपर्क</i>
        </p>
        <h2 id="contact-h" className="contact-h reveal" aria-label="Let's make something warm.">
          <Wobble text="Let's make" />
          <br />
          <Wobble text="something warm." />
        </h2>
        <ul className="contact-links reveal">
          {items.map((it) => (
            <li key={it.label}>
              {it.href ? (
                <a href={it.href} {...(it.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <span className="mono">{it.label}</span>
                  {it.text} {it.external ? '↗' : ''}
                </a>
              ) : (
                <a className="disabled" aria-disabled="true">
                  <span className="mono">{it.label}</span>
                  {it.fallback}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
      <footer className="footer">
        <p className="mono">© {site.year} · Built with care, in warm light.</p>
        <ReplayButton />
      </footer>
    </section>
  );
}
