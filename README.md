# MARDZ — Portfolio site

Personal portfolio (Next.js 14, App Router, TypeScript, Tailwind CSS, Framer Motion) per the repo PRD. Target domain: [marcoaurelio.mx](https://marcoaurelio.mx).

## Requirements

- Node.js 18+
- npm (or pnpm/yarn)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### If the site looks unstyled and the console shows 404s for `/_next/static/...`

Usually a stale or inconsistent `.next` folder (common for projects on `Desktop` with iCloud). Stop the server (`Ctrl+C`) and run:

```bash
npm run dev:clean
```

That deletes `.next` and restarts. Optional: hard refresh or clear the browser cache.

## Environment variables (contact email)

The form uses the `/api/contact` API with [Resend](https://resend.com).

1. Copy `.env.example` to `.env.local`.
2. Set:

- `RESEND_API_KEY` — Resend API key.
- `CONTACT_TO_EMAIL` — Inbox where you receive messages.
- `CONTACT_FROM` — Verified sender in Resend (e.g. `Portfolio <onboarding@resend.dev>` for tests).

Without these, the API returns 503 and the UI prompts you to configure the service or use the fallback.

### No-backend fallback: Formspree

1. Create a form at [Formspree](https://formspree.io).
2. Option A: In `src/components/sections/Contact.tsx`, replace the `fetch` with a form `action` pointing to the Formspree URL.
3. Option B: Link a “Contact” button to that URL from the CTA.

## Deploy on Vercel via GitHub

1. Push the code to GitHub (if needed):

   ```bash
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
   git push -u origin main
   ```

2. In [Vercel](https://vercel.com): **Add New Project** → import the GitHub repo.
3. Framework: Next.js (auto-detected). Add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM` under **Settings → Environment Variables** (Production / Preview as needed).
4. **Custom domain**: **Settings → Domains** → add `marcoaurelio.mx` and the DNS records your registrar shows (A/AAAA or CNAME to Vercel).

## Scripts

| Command         | Description           |
| --------------- | --------------------- |
| `npm run dev`   | Development server    |
| `npm run build` | Production build      |
| `npm run start` | Server after `build`  |
| `npm run lint`  | ESLint                |

## Project layout

- `src/app/` — routes (`/`, `/work/[slug]`, `/api/contact`, `sitemap.ts`).
- `src/components/` — layout, sections, UI.
- `src/data/` — projects, capabilities, speaking.
- `src/styles/globals.css` — design tokens (monochrome palette, typography).
- `public/og-image.jpg` — Open Graph image (replaceable).

## Spec

Product requirements: [PORTFOLIO-PRD.md](./PORTFOLIO-PRD.md).
