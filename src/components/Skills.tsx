import type { CSSProperties } from 'react';
import { skillGroups } from '@/data/site';

export default function Skills() {
  return (
    <section className="section skills" id="skills" aria-labelledby="skills-h">
      <div className="wrap">
        <div className="grid head">
          <p className="label reveal">
            <span>03</span> / Skills <i lang="hi">हुनर</i>
          </p>
          <h2 id="skills-h" className="h-display reveal">
            What I work with.
          </h2>
        </div>
        <div className="skill-grid">
          {skillGroups.map((g, gi) => (
            <div className="skill-wrap reveal" key={g.title} style={{ '--i': gi } as CSSProperties}>
              <div className="skill-card tilt">
                <h3 className="mono">{g.title}</h3>
                <ul>
                  {g.skills.length > 0
                    ? g.skills.map((s) => (
                        <li className="chip" key={s}>
                          {s}
                        </li>
                      ))
                    : [0, 1].map((n) => (
                        <li className="chip ph" key={n}>
                          add verified skill
                        </li>
                      ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
