/**
 * All editable content lives here.
 *
 * Any field left as `undefined` shows a clearly marked placeholder on the page.
 * Fill a field in and the placeholder disappears. Only write things that are true.
 */

export const site = {
  name: 'Praptee Miller',
  url: 'https://miller-portfolio-pi.vercel.app', // the live address; used for share links, sitemap and the resume page
  nameHindi: 'प्राप्ति मिलर' as string | undefined, // Devanagari spelling: please confirm. Set to undefined to hide.
  initials: 'PM',
  year: '2026',
  eyebrow: 'Computer science student · Developer · Design-minded',
  tagline: 'Golden hour, in code.',
  description:
    'Computer science student who designs and builds interfaces directly in code: visual identity, interaction and responsive layout.',
  github: 'https://github.com/iammissmiller',
  linkedin: 'https://linkedin.com/in/praptee-miller-896a50323' as string | undefined,
  email: 'millerpraptee@gmail.com' as string | undefined,
  resume: undefined as string | undefined, // optional: a ready-made PDF, e.g. '/resume.pdf'. Leave undefined to use the built-in /resume page.
};

export const about = {
  lede: 'Computer science student who designs and builds interfaces directly in code, with a focus on visual identity, interaction and responsive layout. Experience across live, user-facing sites and an award-winning hackathon platform.' as string | undefined,
  studying: 'B.E./B.Tech, Computer Science Engineering · 3rd year · Shri Shankaracharya Technical Campus, Junwani, Bhilai · CGPA 7.8 · Graduation 2028' as string | undefined,
  interestedIn: 'Software · UI/UX · product experiences',
  openTo: 'Internships · open source · hackathons',
};

export type Project = {
  index: string;
  title: string;
  visual: 'v1' | 'v2' | 'v3' | 'v4';
  size: 'feature' | 'mini';
  status?: string; // e.g. 'Live', 'Prototype', 'Concept'
  summary?: string;
  problem?: string;
  role?: string;
  stack?: string;
  decisions?: string;
  live?: string;
  source?: string;
  year?: string;
  tags?: string[];
};
// Longer write-ups live in content/projects/<slug>.md (see content/projects/_guide.md).

export const projects: Project[] = [
  { index: '01', title: 'Rakta', visual: 'v1', size: 'feature' },
  { index: '02', title: 'HackBIOS', visual: 'v2', size: 'feature' },
  { index: '03', title: 'Yumemi', visual: 'v3', size: 'mini' },
  { index: '04', title: 'Haven & Her', visual: 'v4', size: 'mini' },
  { index: '05', title: 'S.A.M.U.D.R.A', visual: 'v2', size: 'mini' },
  { index: '06', title: 'BreatheSafe', visual: 'v1', size: 'mini' },
];
// The details of each project live in content/projects/<slug>.md.

export type SkillGroup = { title: string; skills: string[] };

// Add only skills you actually have. Empty groups show placeholder chips.
export const skillGroups: SkillGroup[] = [
  { title: 'Design', skills: ['UI/UX Design', 'Visual & Interaction Design', 'Responsive Design', 'Typography & Colour Systems', 'Motion Design (GSAP)', 'Coded Prototyping', 'Accessibility'] },
  { title: 'Frontend', skills: ['React.js', 'Next.js', 'HTML / CSS', 'JavaScript', 'TypeScript', 'Tailwind CSS'] },
  { title: 'Backend & tools', skills: ['Node.js', 'Firebase', 'PostgreSQL', 'Prisma', 'Git & GitHub', 'Docker', 'CI/CD', 'Vercel'] },
  { title: 'Familiar with', skills: ['C++', 'Java', 'Python'] },
];

export type JourneyItem = { when?: string; title?: string; detail?: string };

// Real hackathons, contributions and roles only.
export const journey: JourneyItem[] = [
  { when: '2026', title: 'GSSoC 2026: open source', detail: 'Fixed accessibility issues in story-spark-ai; merged 40+ PRs in EaseMotion CSS (animation utilities, landing pages, dashboard components); implemented Issue #5886 (Minimal Compact View mode) in CommitPulse.' },
  { when: '2026', title: 'Smart India Hackathon: selected at college level', detail: 'Co-built S.A.M.U.D.R.A, an explainable 7-stage oil spill investigation dashboard.' },
  { title: 'TechSprint (GDG SSTC Bhilai): 2nd Runner-Up', detail: "Haven & Her, a women's health awareness platform." },
  { title: 'Organizing & Management Team, HackBios', detail: 'Served on the organizing team alongside 50+ volunteers for a hackathon with 300+ participants across 70+ teams.' },
  { title: 'Tech Team Member, GeeksforGeeks (GFG) Campus Club' },
];
