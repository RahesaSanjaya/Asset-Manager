# JJS Soundboard

## Project Overview

This project is a **web-based sound library and audio ID repository for Roblox "Jujutsu Shenanigans" (JJS) game development**. It provides developers with quick access to **596 Roblox audio IDs** organized across **26 categories** and characters from the Jujutsu Kaisen universe.

## Run & Operate

### Development Commands

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/jjs-soundboard run dev` — run the soundboard frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

### Environment Variables

- `DATABASE_URL` — Required: PostgreSQL connection string
- `PORT` — API server port (default: 5000)

## Stack

- **pnpm workspaces, Node.js 24, TypeScript 5.9**
- **API**: Express 5, PostgreSQL + Drizzle ORM, Zod (v4), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Frontend**: React 19, Vite 7, Tailwind CSS 4, shadcn/ui
- **State Management**: TanStack React Query, Wouter router
- **Build**: esbuild (CJS bundle)
- **Testing**: TypeScript strict mode

## Where Things Live

### Library Layer (`lib/`)

**Source of Truth & Shared Libraries:**
- `lib/api-spec/` — OpenAPI 3.1.0 specification + Orval codegen configuration (the single source of truth for API contracts)
- `lib/api-client-react/` — React Query hooks and custom fetch layer for frontend API consumption (generated from OpenAPI spec)
- `lib/api-zod/` — Zod validation schemas for request/response validation on both client and server (generated from OpenAPI spec)
- `lib/db/` — PostgreSQL connection + Drizzle ORM instance + database schema

### Applications (`artifacts/`)

**Deployable Services:**
- `artifacts/api-server/` — Express 5 REST API service implementing the OpenAPI specification
- `artifacts/jjs-soundboard/` — React SPA frontend for the JJS Soundboard application
- `artifacts/mockup-sandbox/` — UI prototyping sandbox with auto-discovery of mockup components

### Tools & Scripts (`scripts/`)

- `scripts/post-merge.sh` — Automated post-merge workflow: installs dependencies and pushes database schema
- `scripts/src/hello.ts` — Simple TypeScript script to verify the build pipeline

## Architecture Decisions

1. **Single Source of Truth**: The OpenAPI specification (`lib/api-spec/openapi.yaml`) is the authoritative definition for all API-related code generation. This ensures consistency between API spec and generated client/server code.

2. **Dual Generated Packages**: The API spec generates two parallel packages:
   - `api-client-react`: React Query hooks for frontend consumption
   - `api-zod`: Zod schemas for runtime validation (usable server-side or client-side)

3. **Custom Fetch Layer**: `lib/api-client-react/src/custom-fetch.ts` (371 lines) provides robust, mobile-aware HTTP layer with base URL injection, auth token support, React Native edge cases, and comprehensive error handling.

4. **Database-First for Product**: While the API spec drives API contracts, the database schema is defined manually in Drizzle format. This allows for migration of the hardcoded 596 sounds into PostgreSQL.

5. **Security-Conscious Architecture**:
   - Pino logger with authorization header + cookie redaction
   - pnpm workspace with `minimumReleaseAge: 1440` for supply-chain attack protection
   - Strict TypeScript configuration (`strict` mode enabled)

## Product

The JJS Soundboard is designed for **Roblox Studio developers** who need quick access to Jujutsu Kaisen character sound effects, music tracks, and audio items for their games.

### Key Features

1. **Comprehensive Sound Library**: 
   - 596 sound entries across 26 categories
   - Character-specific organization (Gojo, Sukuna, Yuji, etc.)
   - Real-time search and filtering by category

2. **User Experience**:
   - Favorites system with persistent `localStorage`
   - One-click copy of Roblox audio IDs to clipboard
   - Dark/Light theme toggle (persisted)
   - Mobile-responsive design

3. **Audio Preview (Planned)**:
   - Interactive play/pause buttons for sound preview
   - Character-appropriate synthesized audio using Web Audio API
   - Auto-stop mechanism to prevent overlap

## User Preferences

1. **Theme Preference**: Dark mode is default (JJK-inspired) with system preference override
2. **Search Behavior**: Real-time filtering across sound titles, Roblox IDs, and categories
3. **Favorites**: Persistent across sessions via `localStorage`
4. **Mobile**: Touch-friendly interface with responsive grid layout

## Gotchas

1. **pnpm Dependency**: This project requires pnpm. The root package.json enforces pnpm usage via the preinstall script.

2. **Database Migration**: The `jjs-soundboard/src/data/sounds.ts` contains the hardcoded 596 sounds that need to be migrated to PostgreSQL. Use the `db:push` and `db:seed` scripts from `@workspace/scripts`.

3. **API Codegen**: Changes to the OpenAPI spec require running `pnpm --filter @workspace/api-spec run codegen` to regenerate hooks and Zod schemas.

4. **Schema Parity**: Database schema must be manually synchronized with API spec changes since they serve different purposes.

5. **TypeScript Builds**: All typechecking uses project references (`tsc --build`) for incremental compilation across the monorepo.

## Pointers

- **See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details**
- **API Contract**: Always reference `lib/api-spec/openapi.yaml` for endpoint definitions
- **Database Schema**: Defined in `lib/db/src/schema/` with migrations via Drizzle Kit
- **Generated Code**: Look in `lib/api-client-react/src/generated/` for React Query hooks
- **Sound Data Migration**: Use `pnpm --filter @workspace/scripts run db:push-seed` to migrate from hardcoded data to PostgreSQL