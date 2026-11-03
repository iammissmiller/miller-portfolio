import Link from 'next/link';
import { getProjects, hasCaseStudy, type CaseProject } from '@/lib/projects';

function Links({ p }: { p: CaseProject }) {
  const hasAny = Boolean(p.live || p.source);
  return (
    <p className="links">
      {hasCaseStudy(p) ? (
        <Link className="btn" href={`/work/${p.slug}`}>
          Case study →
        </Link>
      ) : null}
      {p.live ? (
        <a className="btn" href={p.live} target="_blank" rel="noopener noreferrer">
          Live demo ↗
        </a>
      ) : p.size === 'feature' ? (
        <a className="btn disabled" aria-disabled="true">
          Live demo soon
        </a>
      ) : null}
      {p.source ? (
        <a className="btn" href={p.source} target="_blank" rel="noopener noreferrer">
          Source ↗
        </a>
      ) : null}
      {!hasAny && p.size === 'mini' ? (
        <a className="btn disabled" aria-disabled="true">
          Details soon
        </a>
      ) : null}
    </p>
  );
}

function Card({ p, flip }: { p: CaseProject; flip: boolean }) {
  const feature = p.size === 'feature';
  return (
    <article className={`project${feature ? '' : ' mini'}${flip ? ' flip' : ''} reveal`}>
      {p.image ? (
        <div className={`project-visual tilt has-img ${p.visual}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={`Screenshot of ${p.title}`} loading="lazy" decoding="async" />
          <span className="pv-index">{p.index}</span>
        </div>
      ) : (
        <div className={`project-visual tilt ${p.visual}`} role="img" aria-label={p.title}>
          <span className="pv-index">{p.index}</span>
          <span className="pv-title">{p.title}</span>
        </div>
      )}
      <div className="project-body">
        <p className="mono tag">{p.status ?? 'Status to confirm'}</p>
        <h3>{p.title}</h3>
        <p className={p.summary ? undefined : 'ph'}>
          {p.summary ?? 'One-line description — to be written from your own notes.'}
        </p>
        {feature ? (
          <dl>
            {([
              ['Problem', p.problem],
              ['My role', p.role],
              ['Stack', p.stack],
              ['Key decisions', p.decisions],
            ] as const).map(([label, value]) =>
              value ? (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ) : null,
            )}
          </dl>
        ) : null}
        <Links p={p} />
      </div>
    </article>
  );
}

export default function Work() {
  const projects = getProjects();
  const features = projects.filter((p) => p.size === 'feature');
  const minis = projects.filter((p) => p.size === 'mini');
  return (
    <section className="section work" id="work" aria-labelledby="work-h">
      <div className="wrap">
        <div className="grid head">
          <p className="label reveal">
            <span>02</span> / Selected work <i lang="hi">काम</i>
          </p>
          <h2 id="work-h" className="h-display reveal">
            Things I&apos;ve built.
          </h2>
        </div>

        {features.map((p, i) => (
          <Card key={p.index} p={p} flip={i % 2 === 1} />
        ))}

        {minis.length > 0 ? (
          <div className="project-row">
            {minis.map((p) => (
              <Card key={p.index} p={p} flip={false} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
