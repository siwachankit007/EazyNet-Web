# EazyNet Workspace

**Fast. Organized. Focused.**

EazyNet Workspace turns tab chaos into an intelligent workspace: faster memory use, AI-powered grouping, and a focused workflow for power users.

Live site: [eazynet.app](https://eazynet.app)  
Chrome extension: [Chrome Web Store](https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc)

## Features

- **Fast memory management** — Intelligent workspace memory optimization
- **AI-powered grouping** — Organize tabs by domain and path
- **Focused workflow** — Learns your patterns and suggests optimizations
- **Smart workspace search** — Find anything in your workspace instantly
- **Cross-device sync** — Your workspace follows you
- **Workspace sessions** — Save and restore complete workspace states

## Tech stack

| Area | Version |
| --- | --- |
| Next.js | 16.3.2 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 3 |
| Auth | Supabase (Google OAuth) |
| Lint | ESLint 9 + `eslint-config-next` 16.3.2 |

## Getting started

### Prerequisites

- Node.js 20 or later
- npm 11 or later

### Install

```bash
git clone https://github.com/siwachankit007/EazyNet-Web.git
cd EazyNet-Web
npm install
```

### Environment

Copy the development template and fill in your values:

```bash
cp env.development.template .env.local
```

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_EAZYNET_API_URL=https://localhost:7061
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

Do not commit `.env.local`. Use Vercel (or your host) environment settings for production.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run tunnel` | Expose localhost with the official `@ngrok/ngrok` CLI |

## Security

Dependency advisories reported on GitHub have been patched by:

- Upgrading **Next.js** and **eslint-config-next** to **16.3.2**
- Upgrading **Swiper** to **12.2.0** (fixes a critical advisory)
- Removing the unpatched **`ngrok`** npm package (`extract-zip` came with it)
- Pinning patched transitive packages with npm `overrides`

After install, `npm audit` should report **0 vulnerabilities**. GitHub Dependabot will refresh after this branch is merged.

## Deploy

The app is Vercel-ready. Set the production environment variables from `env.production.template`, then:

```bash
npm ci
npm run build
npm start
```

See [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) for the full production checklist.

## More docs

- [Development setup](./DEVELOPMENT_SETUP.md)
- [Backend integration](./EAZYNET_BACKEND_INTEGRATION.md)
- [Profiles migration](./PROFILES_MIGRATION_GUIDE.md)
