/**
 * All editable content lives here.
 *
 * Any field left as `undefined` shows a clearly marked placeholder on the page.
 * Fill a field in and the placeholder disappears. Only write things that are true.
 */

export const site = {
  name: 'Your Name', // TODO: confirm the name to show
  initials: 'YN',
  year: '2026',
  eyebrow: 'Computer science student · Developer · Design-minded',
  tagline: 'Golden hour, in code.',
  description:
    'Portfolio of a computer science student and developer with an eye for design.',
  github: 'https://github.com/iammissmiller',
  linkedin: undefined as string | undefined, // e.g. 'https://www.linkedin.com/in/...'
  email: undefined as string | undefined, // e.g. 'you@example.com'
  resume: undefined as string | undefined, // e.g. '/resume.pdf' (put the file in /public)
};

export const about = {
  lede: undefined as string | undefined, // 3-4 specific, honest sentences
  studying: undefined as string | undefined, // course, year, college
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
};

// Only titles and two verified repository links are filled in. Everything else is pending.
export const projects: Project[] = [
  { index: '01', title: 'Rakta', visual: 'v1', size: 'feature', source: 'https://github.com/iammissmiller/Rakta' },
  { index: '02', title: 'HackBIOS', visual: 'v2', size: 'feature', source: 'https://github.com/iammissmiller/hack-bios' },
  { index: '03', title: 'Yumemi', visual: 'v3', size: 'mini' },
  { index: '04', title: 'Haven & Her', visual: 'v4', size: 'mini' },
];

export type SkillGroup = { title: string; skills: string[] };

// Add only skills you actually have. Empty groups show placeholder chips.
export const skillGroups: SkillGroup[] = [
  { title: 'Languages', skills: [] },
  { title: 'Frontend', skills: [] },
  { title: 'Frameworks & libraries', skills: [] },
  { title: 'Tools & platforms', skills: [] },
  { title: 'UI / UX & design', skills: [] },
  { title: 'Other interests', skills: [] },
];

export type JourneyItem = { when?: string; title?: string; detail?: string };

// Real hackathons, contributions and roles only. Empty items show placeholders.
export const journey: JourneyItem[] = [{}, {}, {}];
