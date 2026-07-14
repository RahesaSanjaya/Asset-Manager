# JJS Soundboard

A web-based sound library and audio ID repository for Roblox "Jujutsu Shenanigans" (JJS) game development.

## Overview

This project provides **596 Roblox audio IDs** organized across **26 categories** and characters from the Jujutsu Kaisen universe. Roblox developers can quickly find and copy audio IDs for use in their JJS-themed Roblox games.

## Features

- **Search & Filter**: Real-time search across sound names, Roblox IDs, and categories
- **Favorites System**: Star/unstar sounds, persisted in localStorage
- **Copy ID**: One-click copy of Roblox audio IDs to clipboard
- **Dark/Light Theme**: Persistent theme toggle
- **Mobile-Responsive**: Works on desktop, tablet, and mobile devices
- **Category Navigation**: Browse sounds by character and game section

## Architecture

This is a **pnpm monorepo** with a layered architecture:

```
workspace (root)
├── lib/                          # Shared libraries
│   ├── api-spec/                 # OpenAPI 3.1.0 spec + Orval codegen
│   ├── api-client-react/         # React Query hooks (generated from OpenAPI)
│   ├── api-zod/                  # Zod validation schemas (generated from OpenAPI)
│   └── db/                       # PostgreSQL with Drizzle ORM
├── artifacts/                    # Deployable applications
│   ├── api-server/               # Express 5 REST API
│   ├── jjs-soundboard/           # React SPA frontend
│   └── mockup-sandbox/           # UI prototyping sandbox
└── scripts/                      # Utility scripts
```

## Tech Stack

- **Framework**: Node.js 18, pnpm workspaces, React 19, Vite 7, TypeScript 5.9
- **API**: Express 5, PostgreSQL + Drizzle ORM, Zod v4
- **Validation**: Orval (from OpenAPI spec), zod (v4), drizzle-zod
- **Build**: esbuild (CJS bundle), Vite
- **State**: TanStack React Query, Wouter router, Next.js themes
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york variant)

## Running

### Development

Since pnpm is not available in this environment, you can use `npm` commands instead:

```bash
# Install dependencies (via pnpm workspace)
npm i

# Type check all packages
npm run typecheck

# Run dev server (requires pnpm)
# npm run dev  # This script uses pnpm commands

# Build all packages
npm run build

# Codegen API hooks from OpenAPI spec
npm --prefix lib/api-spec run codegen
```

### Database

1. Provision a PostgreSQL database
2. Set `DATABASE_URL` environment variable
3. Push schema:

```bash
npx drizzle-kit push --config lib/db/drizzle.config.ts
```

4. Seed data (requires script to be created)

### API Server

```bash
pnpm --filter @workspace/api-server run dev
```

### JJS Soundboard

```bash
pnpm --filter @workspace/jjs-soundboard run dev
```

## Project Structure

### Key Files

- **API Contract**: `lib/api-spec/openapi.yaml` - Source of truth for API endpoints
- **Database Schema**: `lib/db/src/schema/` - Sounds, categories tables
- **API Client**: `lib/api-client-react/` - React Query hooks for frontend
- **Sound Data**: `artifacts/jjs-soundboard/src/data/sounds.ts` - 596 sound entries
- **Main Soundboard**: `artifacts/jjs-soundboard/src/pages/Soundboard.tsx`
- **Audio Engine**: `artifacts/jjs-soundboard/src/lib/audioEngine.ts` - Web Audio API synth

### Development Workflow

1. **Phase 1**: Define database schema (completed)
2. **Phase 2**: Extend API spec and implement REST endpoints (completed)
3. **Phase 3**: Connect frontend to API (in progress)
4. **Phase 4**: Integrate audio playback (pending)
5. **Phase 5**: Create mockup sandbox components (pending)
6. **Phase 6**: Cleanup and polish (pending)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Run tests if available
5. Submit a pull request

## License

MIT

---

## Setup Notes

This project is designed to run in a Replit environment with pnpm workspaces. If you're running locally, you may need to install pnpm and set up the proper environment configuration.