import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { projects as base, type Project } from '@/data/site';

/**
 * A project is described in two places:
 *  - src/data/site.ts           : title, order, colour and the basic links (what the home page needs)
 *  - content/projects/<slug>.md : the full write-up (frontmatter fields + a markdown story)
 * Anything written in the markdown file wins over site.ts. Nothing here invents content.
 */
export type CaseProject = Project & { slug: string; body?: string; image?: string };

export const slugOf = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const FIELDS = ['summary', 'status', 'problem', 'role', 'stack', 'decisions', 'live', 'source', 'year', 'tags'] as const;

/** Only web addresses are accepted from the markdown files. */
const safeUrl = (v?: string) => (v && /^https?:\/\//i.test(v) ? v : undefined);

function parse(raw: string): { data: Record<string, string>; body: string } {
  const text = raw.replace(/\r\n/g, '\n');
  if (!text.startsWith('---\n')) return { data: {}, body: text.trim() };
  const end = text.indexOf('\n---', 4);
  if (end === -1) return { data: {}, body: text.trim() };
  const data: Record<string, string> = {};
  for (const line of text.slice(4, end).split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue; // blank lines and comments
    const i = t.indexOf(':');
    if (i < 1) continue;
    const key = t.slice(0, i).trim();
    const value = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (value && (FIELDS as readonly string[]).includes(key)) data[key] = value;
  }
  return { data, body: text.slice(end + 4).replace(/^\n/, '').trim() };
}

/** A screenshot dropped at public/projects/<slug>.png (or .jpg / .jpeg / .webp) is picked up automatically. */
function findImage(slug: string): string | undefined {
  for (const ext of ['webp', 'png', 'jpg', 'jpeg']) {
    if (existsSync(join(process.cwd(), 'public', 'projects', `${slug}.${ext}`))) return `/projects/${slug}.${ext}`;
  }
  return undefined;
}

function load(p: Project): CaseProject {
  const slug = slugOf(p.title);
  const image = findImage(slug);
  const file = join(process.cwd(), 'content', 'projects', `${slug}.md`);
  if (!existsSync(file)) return { ...p, slug, image };
  const { data, body } = parse(readFileSync(file, 'utf8'));
  return {
    ...p,
    slug,
    image,
    body: body || undefined,
    summary: data.summary ?? p.summary,
    status: data.status ?? p.status,
    problem: data.problem ?? p.problem,
    role: data.role ?? p.role,
    stack: data.stack ?? p.stack,
    decisions: data.decisions ?? p.decisions,
    year: data.year ?? p.year,
    live: safeUrl(data.live) ?? p.live,
    source: safeUrl(data.source) ?? p.source,
    tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : p.tags,
  };
}

export const getProjects = (): CaseProject[] => base.map(load);
export const getProject = (slug: string) => getProjects().find((p) => p.slug === slug);
/** A project gets a public case-study link only once its markdown file has a story. */
export const hasCaseStudy = (p: CaseProject) => Boolean(p.body);
