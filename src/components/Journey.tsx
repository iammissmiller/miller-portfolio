import { journey } from '@/data/site';

export default function Journey() {
  return (
    <section className="section journey" id="journey" aria-labelledby="journey-h">
      <div className="wrap">
        <div className="grid head">
          <p className="label reveal">
            <span>04</span> / Journey
          </p>
          <h2 id="journey-h" className="h-display reveal">
            Hackathons, contributions &amp; more.
          </h2>
        </div>
        <ol className="timeline">
          {journey.map((j, i) => (
            <li className="reveal" key={i}>
              <span className={`mono when${j.when ? '' : ' ph'}`}>{j.when ?? 'Year — to add'}</span>
              <div>
                <h3 className={j.title ? undefined : 'ph'}>{j.title ?? 'Hackathon / contribution / role'}</h3>
                <p className={j.detail ? undefined : 'ph'}>
                  {j.detail ?? 'One line on what you did and what you learned. Real information only.'}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
