import { about } from '@/data/site';

export default function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-h">
      <div className="wrap grid">
        <p className="label reveal">
          <span>01</span> / About <i lang="hi">परिचय</i>
        </p>
        <div className="about-body reveal">
          <h2 id="about-h" className="h-display">
            Nice to meet <mark className="mk">you.</mark>
          </h2>
          <p className={about.lede ? 'lede' : 'lede ph'}>
            {about.lede ??
              "Your intro goes here: two or three plain sentences on what you study, what you build and what you care about."}
          </p>
          <ul className="facts">
            <li>
              <span className="mono">Studying</span>
              <b className={about.studying ? undefined : 'ph'}>{about.studying ?? 'Course · year · college — to add'}</b>
            </li>
            <li>
              <span className="mono">Interested in</span>
              <b>{about.interestedIn}</b>
            </li>
            <li>
              <span className="mono">Open to</span>
              <b>{about.openTo}</b>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
