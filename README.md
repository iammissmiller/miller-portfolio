# Praptee Miller / प्राप्ति मिलर: Portfolio

**Live:** https://miller-portfolio-pi.vercel.app

A personal portfolio built with Next.js (App Router), React and TypeScript. No UI library: the look is hand-written CSS in `src/app/globals.css`.

**Look and feel:** an Indian pop-art poster collage. A patchwork-carpet backdrop, a red poster with an illustrated cutout, heavy display type, Devanagari accents, sticker-style UI and paper grain.

## Run it

```
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (run this before pushing)
npm run start      # serve the production build
npm run typecheck  # TypeScript check
```

Needs Node 20.9 or newer.

## What's on the site

| Page | What it is |
|---|---|
| `/` | Enter screen, animated intro, Hero, About, Work, Skills, Journey, Contact |
| `/work/<slug>` | A case-study page for each project, written in a markdown file |
| `/resume` | A printable resume built from the site data ("Print / Save as PDF") |
| `/sitemap.xml`, `/robots.txt` | Generated automatically |
| 404 | A custom "not found" page |

### Enter screen and intro

The home page opens on an **Enter screen** with a punchline and two choices: sound or silent. Browsers only allow sound after a click, so the intro waits for that click and then plays (about 6.6 seconds): stickers slap onto the carpet, burst away, and the poster, figure and name are pasted on in turn. The "Replay the opening" button in the footer plays it again.

- Visitors who prefer **reduced motion** get no Enter screen and no intro.
- Without JavaScript the page simply shows its final state. If the scripts do not start within 8 seconds the Enter screen removes itself.
- The Enter-screen words live in `src/data/site.ts` under `gate`.

### Sound

Sound is off until the visitor chooses it. A "Sound on/off" sticker (bottom left) controls it everywhere.

- **Effects** are synthesised in the browser with the Web Audio API (`src/lib/sfx.ts`), so there are no audio files and nothing to license.
- **Background music** is a generated ambient loop by default. To use a real track instead, add one at `public/audio/theme.mp3` (or `.m4a` / `.ogg`); it is picked up automatically, loops, fades in and pauses when the tab is hidden. Only use music you have the right to use.

### Motion and cursor

- On devices with a mouse, the pointer becomes a patterned soda can that tilts as it moves and pops open over links.
- The hero tilts in 3D with the pointer, and large outlined words drift behind the poster.
- Touch devices and reduced-motion visitors get the normal cursor and no drifting or tilting.

## Where things live

| To change | Edit |
|---|---|
| Name, links, About, skills, journey, Enter-screen words | `src/data/site.ts` |
| Project list, order and card colour | `projects` in `src/data/site.ts` |
| Each project's details and story | `content/projects/<slug>.md` (how-to in `content/projects/_guide.md`) |
| Project screenshots | `public/projects/<slug>.png` (or `.jpg` / `.webp`), picked up automatically |
| Background music | `public/audio/theme.mp3` |
| Hero picture | `public/assets/hero-illustration.webp` (transparent background, 3:4 portrait) |
| Carpet and poster paper | `public/assets/carpet.jpg`, `carpet-tall.jpg`, `paper.jpg` |
| Cursor images | `public/assets/can.webp`, `can-pop.webp` |
| Favicon and app icon | `src/app/icon.png`, `apple-icon.png`, `favicon.ico` |
| Link-preview image (Open Graph / Twitter card, 1200×630) | `src/app/opengraph-image.jpg`, `twitter-image.jpg` |
| Page title, description, SEO | `src/app/layout.tsx` and `site` in `src/data/site.ts` |
| Colours, spacing, animation timing | `src/app/globals.css` (colours at the top, in `:root`) |
| Fonts | `src/app/layout.tsx` (Bricolage Grotesque, Manrope, DM Mono, Rozha One via `next/font`) |
| Intro timeline | `STEPS` and `END_MS` in `src/components/IntroEngine.tsx` |
| Sound design | `src/lib/sfx.ts`, wiring in `src/components/SoundGate.tsx` |

### Project case studies

Project names and links come from `src/data/site.ts` and `content/projects/<slug>.md`; anything written in the markdown file wins. A project's case-study page is linked from the home page as soon as its markdown file has a story under the fields. Long write-ups use plain markdown (headings, lists, quotes, links, images).

### Resume

`/resume` is built from `site.ts` and the project files, and prints cleanly (use "Save as PDF" in the print dialog). To use a ready-made PDF instead, put it in `public/` and set `resume: '/resume.pdf'` in `src/data/site.ts`.

## Project structure

```
content/projects/      project write-ups (markdown)
public/                images, audio, project screenshots
src/app/               pages, layout, metadata, icons, sitemap, robots, global CSS
src/components/        Hero, About, Work, Skills, Journey, Contact, Nav, intro and sound components
src/data/site.ts       all editable content
src/lib/               project loader (reads the markdown), sound engine
```

## Deploy

Works on Vercel with the default Next.js settings: import the repository, keep the defaults, deploy. Run `npm run build` locally first so any error shows up before the deploy does.

## Notes

- Only add information that is true. Fields left empty simply do not show.
- Link previews are cached by WhatsApp, LinkedIn and Facebook. After changing the preview image, re-scrape the link (LinkedIn Post Inspector, Facebook Sharing Debugger).
- Fonts load from Google Fonts at build time through `next/font`.