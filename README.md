# Portfolio — Brown Beauty in Sunlight

Next.js (App Router) + TypeScript. The look is plain CSS in `src/app/globals.css`.

## Run it

```
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (run this before deploying)
npm run start      # serve the production build
```

Needs Node 20.9 or newer.

## Where things live

| To change | Edit |
|---|---|
| Name, tagline, links, About, projects, skills, journey | `src/data/site.ts` (empty fields show placeholders) |
| The eyes picture | replace `public/assets/eyes.jpg` (keep a 16:9 landscape) |
| Colours, spacing, fonts, animation timing | `src/app/globals.css` (colours are at the top, in `:root`) |
| Intro timeline (when each step starts) | `STEPS` and `END_MS` in `src/components/IntroEngine.tsx` |
| Page title and social-share text | `src/app/layout.tsx` |

## Notes

- Add `?intro=1` to the URL to force the opening sequence to play again.
- The intro plays once per visitor, is skipped for reduced-motion users, and the page works without JavaScript.
- Resume: put the PDF in `public/` (e.g. `public/resume.pdf`) and set `resume: '/resume.pdf'` in `src/data/site.ts`.
