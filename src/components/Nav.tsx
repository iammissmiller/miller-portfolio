'use client';

import { useState } from 'react';
import { site } from '@/data/site';

const links = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#journey', label: 'Journey' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav" id="nav">
      <a className="nav-mark" href="#top" aria-label="Back to top">
        <span>{site.initials}</span>
        <i>/{site.year}</i>
      </a>
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
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
