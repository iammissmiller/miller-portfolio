import { projects, type Project } from '@/data/site';

function Pending({ value, fallback }: { value?: string; fallback: string }) {
  return value ? <>{value}</> : <span className="ph">{fallback}</span>;
}

function Links({ p }: { p: Project }) {
  const hasAny = Boolean(p.live || p.source);
  return (
    <p className="links">
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

function Card({ p, flip }: { p: Project; flip: boolean }) {
  const feature = p.size === 'feature';
  return (
    <article className={`project${feature ? '' : ' mini'}${flip ? ' flip' : ''} reveal`}>
      <div className={`project-visual ${p.visual}`} role="img" aria-label={`Visual placeholder for ${p.title}`}>
        <span className="pv-index">{p.index}</span>
        <span className="pv-title">{p.title}</span>
        <span className="pv-note">{feature ? 'screenshot goes here' : 'visual goes here'}</span>
      </div>
      <div className="project-body">
        <p className="mono tag">{p.status ?? 'Status to confirm'}</p>
        <h3>{p.title}</h3>
        <p className={p.summary ? undefined : 'ph'}>
          {p.summary ?? 'One-line description — to be written from your own notes.'}
        </p>
        {feature ? (
          <dl>
            <div>
              <dt>Problem</dt>
              <dd>
                <Pending value={p.problem} fallback="To be added" />
              </dd>
            </div>
            <div>
              <dt>My role</dt>
              <dd>
                <Pending value={p.role} fallback="To be added" />
              </dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>
                <Pending value={p.stack} fallback="To be verified" />
              </dd>
            </div>
            <div>
              <dt>Key decisions</dt>
              <dd>
                <Pending value={p.decisions} fallback="To be added" />
              </dd>
            </div>
          </dl>
        ) : null}
        <Links p={p} />
      </div>
    </article>
  );
}

export default function Work() {
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