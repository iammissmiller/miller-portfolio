'use client';

import Link from 'next/link';
import { useState } from 'react';
import { site } from '@/data/site';

const links = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#journey', label: 'Journey' },
  { href: '#contact', label: 'Contact' },
];

/** `base` is '' on the home page and '/' on other pages, so the links always land on the home sections. */
export default function Nav({ base = '' }: { base?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav" id="nav">
      <Link className="nav-mark" href={`${base}#top`} aria-label={base ? 'Home' : 'Back to top'}>
        <span>{site.initials}</span>
        <i>/{site.year}</i>
      </Link>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="nav-links"
        onClick={() => setOpen((v) => !v)}
      >
        Menu
      </button>
      <nav aria-label="Primary" className={open ? 'open' : undefined}>
        <ul id="nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={`${base}${l.href}`} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
