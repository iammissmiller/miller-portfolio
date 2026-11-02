import type { Metadata } from 'next';
import Link from 'next/link';
import PrintButton from '@/components/PrintButton';
import { about, journey, site, skillGroups } from '@/data/site';
import { getProjects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Resume',
  description: `Resume of ${site.name}: ${site.eyebrow}.`,
  alternates: { canonical: '/resume' },
};

/** A resume section. Missing content shows a note on screen only: it never prints. */
function Block({ title, filled, hint, children }: { title: string; filled: boolean; hint: string; children?: React.ReactNode }) {
  return (
    <section className="rs">
      <h2>{title}</h2>
      {filled ? children : <p className="ph screen-only">{hint}</p>}
    </section>
  );
}

export default function ResumePage() {
  const projects = getProjects();
  const groups = skillGroups.filter((g) => g.skills.length > 0);
  const roles = journey.filter((j) => j.title);
  const contacts: Array<{ label: string; href: string }> = [
    ...(site.email ? [{ label: site.email, href: `mailto:${site.email}` }] : []),
    { label: site.github.replace('https://', ''), href: site.github },
    ...(site.linkedin ? [{ label: site.linkedin.replace('https://', ''), href: site.linkedin }] : []),
    { label: site.url.replace('https://', ''), href: site.url },
  ];

  return (
    <main className="resume-page">
      <div className="resume-bar screen-only">
        <Link className="btn" href="/">
          ← Back to site
        </Link>
        <PrintButton />
        <p className="mono">Use “Save as PDF” in the print dialog. Margins: default. Turn on “Background graphics” for colour.</p>
      </div>

      <article className="resume">
        <header className="r-head">
          <h1>{site.name}</h1>
          {site.nameHindi ? (
            <p className="r-hi" lang="hi">
              {site.nameHindi}
            </p>
          ) : null}
          <p className="r-sub">{site.eyebrow}</p>
          <ul className="r-contact">
            {contacts.map((c) => (
              <li key={c.href}>
                <a href={c.href}>{c.label}</a>
              </li>
            ))}
          </ul>
          {!site.email ? <p className="ph screen-only">Add your email in src/data/site.ts so it prints here.</p> : null}
        </header>

        <Block title="Summary" filled={Boolean(about.lede)} hint="Add the About text (about.lede in src/data/site.ts).">
          <p>{about.lede}</p>
        </Block>

        <Block title="Education" filled={Boolean(about.studying)} hint="Add course, year and college (about.studying in src/data/site.ts).">
          <p>{about.studying}</p>
        </Block>

        <Block title="Projects" filled={projects.length > 0} hint="">
          <ul className="r-list">
            {projects.map((p) => (
              <li key={p.slug}>
                <div className="r-row">
                  <b>{p.title}</b>
                  {p.status || p.year ? <span className="mono">{[p.status, p.year].filter(Boolean).join(' · ')}</span> : null}
                </div>
                {p.summary ? <p>{p.summary}</p> : null}
                {p.stack ? <p className="r-meta">Stack: {p.stack}</p> : null}
                {p.live || p.source ? (
                  <p className="r-meta">
                    {p.live ? <a href={p.live}>{p.live.replace(/^https?:\/\//, '')}</a> : null}
                    {p.live && p.source ? ' · ' : null}
                    {p.source ? <a href={p.source}>{p.source.replace(/^https?:\/\//, '')}</a> : null}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Skills" filled={groups.length > 0} hint="Add skills (skillGroups in src/data/site.ts).">
          <ul className="r-skills">
            {groups.map((g) => (
              <li key={g.title}>
                <b>{g.title}:</b> {g.skills.join(', ')}
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Hackathons, contributions & roles" filled={roles.length > 0} hint="Add entries (journey in src/data/site.ts).">
          <ul className="r-list">
            {roles.map((j, i) => (
              <li key={i}>
                <div className="r-row">
                  <b>{j.title}</b>
                  {j.when ? <span className="mono">{j.when}</span> : null}
                </div>
                {j.detail ? <p>{j.detail}</p> : null}
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Interests" filled={true} hint="">
          <p>
            {about.interestedIn}. Open to: {about.openTo}.
          </p>
        </Block>
      </article>
    </main>
  );
}
