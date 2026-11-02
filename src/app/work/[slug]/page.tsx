import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Markdown from '@/components/Markdown';
import Nav from '@/components/Nav';
import { site } from '@/data/site';
import { getProject, getProjects, hasCaseStudy } from '@/lib/projects';

type Params = { params: Promise<{ slug: string }> };

// Only the projects listed in src/data/site.ts exist; any other address is a 404.
export const dynamicParams = false;
export const generateStaticParams = () => getProjects().map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} — case study`,
    description: p.summary ?? `Case study of ${p.title} by ${site.name}.`,
    alternates: { canonical: `/work/${p.slug}` },
    // A page with no story yet stays out of search results.
    robots: { index: hasCaseStudy(p), follow: true },
  };
}

const Ph = ({ children }: { children: React.ReactNode }) => <span className="ph">{children}</span>;

export default async function CaseStudy({ params }: Params) {
  const { slug } = await params;
  const all = getProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const p = all[i];
  const next = all[(i + 1) % all.length];

  return (
    <>
      <Nav base="/" />
      <main id="top" className="case">
        <header className={`case-hero ${p.visual}`}>
          <div className="wrap">
            <p className="mono">
              {p.index} / Case study
            </p>
            <h1>{p.title}</h1>
            <p className="case-sum">{p.summary ?? <Ph>One-line summary: add it in content/projects/{p.slug}.md</Ph>}</p>
          </div>
        </header>

        <div className="wrap case-wrap">
          <dl className="case-meta">
            <div>
              <dt>Status</dt>
              <dd>{p.status ?? <Ph>To confirm</Ph>}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{p.year ?? <Ph>To add</Ph>}</dd>
            </div>
            <div>
              <dt>My role</dt>
              <dd>{p.role ?? <Ph>To add</Ph>}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>{p.stack ?? <Ph>To add</Ph>}</dd>
            </div>
          </dl>

          {p.tags && p.tags.length > 0 ? (
            <ul className="case-tags">
              {p.tags.map((t) => (
                <li className="chip" key={t}>
                  {t}
                </li>
              ))}
            </ul>
          ) : null}

          <article className="case-main">
            {p.problem ? (
              <>
                <h2>The problem</h2>
                <p>{p.problem}</p>
              </>
            ) : null}
            {p.decisions ? (
              <>
                <h2>Key decisions</h2>
                <p>{p.decisions}</p>
              </>
            ) : null}
            {p.body ? (
              <Markdown source={p.body} />
            ) : (
              <p className="ph">
                The story goes here. Write it in content/projects/{p.slug}.md and this page fills itself in.
              </p>
            )}
          </article>

          <p className="links">
            {p.live ? (
              <a className="btn" href={p.live} target="_blank" rel="noopener noreferrer">
                Live demo ↗
              </a>
            ) : null}
            {p.source ? (
              <a className="btn" href={p.source} target="_blank" rel="noopener noreferrer">
                Source ↗
              </a>
            ) : null}
          </p>

          <nav className="case-next" aria-label="More projects">
            <Link href="/#work">← All work</Link>
            <Link href={`/work/${next.slug}`}>
              Next: {next.title} →
            </Link>
          </nav>
        </div>
      </main>
      <footer className="sub-footer">
        <p className="mono">© {site.year} · {site.name}</p>
      </footer>
    </>
  );
}
