import Image from 'next/image';
import { site } from '@/data/site';
import ReplayButton from './ReplayButton';

type Item = { label: string; href?: string; text?: string; fallback: string; external?: boolean };

export default function Contact() {
  const items: Item[] = [
    { label: 'GitHub', href: site.github, text: site.github.replace('https://', ''), fallback: '', external: true },
    { label: 'LinkedIn', href: site.linkedin, text: site.linkedin?.replace('https://', ''), fallback: 'link to add', external: true },
    { label: 'Email', href: site.email ? `mailto:${site.email}` : undefined, text: site.email, fallback: 'address to add' },
    { label: 'Resume', href: site.resume, text: 'Download PDF', fallback: 'PDF to add' },
  ];

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-h">
      <div className="contact-art" aria-hidden="true">
        {/* decorative: the same illustration is described in About */}
        <Image src="/assets/eyes-art.jpg" alt="" width={1672} height={941} sizes="100vw" />
      </div>
      <div className="wrap">
        <p className="label reveal">
          <span>05</span> / Contact
        </p>
        <h2 id="contact-h" className="contact-h reveal">
          Let&apos;s make
          <br />
          something warm.
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
