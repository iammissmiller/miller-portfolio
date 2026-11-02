# Portfolio

A personal portfolio built with Next.js (App Router) and TypeScript. The look is hand-written CSS in `src/app/globals.css`.

**Look and feel:** Indian pop-art poster collage. A patchwork-carpet backdrop, a red poster with an illustrated cutout, heavy display type, a paper-tear intro and a soda-can cursor.

## Run it

```
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (run this before deploying)
npm run start      # serve the production build
npm run typecheck  # TypeScript check
```

Needs Node 20.9 or newer.

## What's on the page

Hero · About · Work · Skills · Journey · Contact

- **Intro:** a sheet of paper reading "PORTFOLIO" tears open to reveal the hero. It plays on every visit. Visitors can skip it (button or Esc) and replay it from the footer. It is skipped for visitors who prefer reduced motion, and the page works without JavaScript.
- **Cursor:** on devices with a mouse, the pointer becomes a patterned soda can that tilts as it moves and pops open over links. In the hero, a warm light follows the pointer and the layers drift at different depths. Touch devices and reduced-motion visitors get the normal cursor.

## Where things live

| To change | Edit |
|---|---|
| Name, tagline, links, About, projects, skills, journey | `src/data/site.ts` (empty fields show placeholders) |
| Hero picture | replace `public/assets/hero-illustration.webp` (transparent background, 3:4 portrait) |
| Contact backdrop | replace `public/assets/eyes-art.jpg` (16:9 landscape) |
| Carpet and poster paper | `public/assets/carpet.jpg`, `carpet-tall.jpg`, `paper.jpg` |
| Cursor images | `public/assets/can.webp`, `can-pop.webp` |
| Colours, spacing, fonts, animation timing | `src/app/globals.css` (colours are at the top, in `:root`) |
| Fonts | `src/app/layout.tsx` (Bricolage Grotesque, Manrope, DM Mono via `next/font`) |
| Intro timeline (when each step starts) | `STEPS` and `END_MS` in `src/components/IntroEngine.tsx` |
| Cursor behaviour | `src/components/HeroCursor.tsx` |
| Page title and social-share text | `src/app/layout.tsx` |

## Notes

- Add `?intro=1` to the URL, or use the "Replay the opening" button in the footer, to play the intro again.
- Resume: put the PDF in `public/` (for example `public/resume.pdf`) and set `resume: '/resume.pdf'` in `src/data/site.ts`.
- Placeholders ("link to add", "To be added" and similar) mark content that has not been written yet. Only add information that is true.

## Deploy

Works on Vercel with the default Next.js settings: import the repository, keep the defaults, deploy.
