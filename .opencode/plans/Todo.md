# Project Review & Execution Plan

## Review: Arsitektur, Logika, dan Konsep Code

### Ringkasan Project

Project ini adalah **JJS Soundboard** — website soundboard dan repository audio ID untuk game Roblox "Jujutsu Shenanigans" (JJS). Dibangun sebagai **pnpm monorepo** di Replit dengan arsitektur terpisah antara library layer, API server, dan frontend.

**Stack:** Node.js 24, TypeScript 5.9, pnpm workspaces, React 19, Vite 7, TailwindCSS 4, Express 5, Drizzle ORM + PostgreSQL, Zod v4, Orval (API codegen).

---

### Struktur Arsitektur

```
workspace (root)
├── lib/                          # Shared libraries (4 packages)
│   ├── api-spec/                 # OpenAPI 3.1.0 spec + Orval codegen config
│   ├── api-client-react/         # React Query hooks (generated from OpenAPI)
│   ├── api-zod/                  # Zod validation schemas (generated from OpenAPI)
│   └── db/                       # Drizzle ORM + PostgreSQL connection
├── artifacts/                    # Deployable applications (3 artifacts)
│   ├── api-server/               # Express 5 REST API
│   ├── jjs-soundboard/           # React SPA frontend (CORE PRODUCT)
│   └── mockup-sandbox/           # UI prototyping sandbox (component preview)
├── scripts/                      # Utility scripts + post-merge hook
└── package.json                  # Root workspace config
```

### Data Flow Architecture

```
openapi.yaml ──(orval codegen)──> api-client-react/  (React Query hooks)
                   │
                   └────────────> api-zod/            (Zod schemas)

custom-fetch.ts ────(used by)───> generated/api.ts   (HTTP layer)
                                        │
                                        └──> React components (useXxxQuery hooks)

openapi.yaml ──(manual parity)──> db/schema/*.ts      (Drizzle table definitions)
                      │
                      └──> drizzle-orm queries via `db` instance
```

---

### Temuan Review

#### 1. KONDISI SAAT INI (Scaffolded, belum implementasi)

| Komponen | Status | Detail |
|----------|--------|--------|
| `lib/db` | Kosong | Schema belum ada table. Koneksi PostgreSQL + Drizzle sudah terpasang. |
| `lib/api-spec` | Minimal | Hanya 1 endpoint: `GET /healthz`. OpenAPI 3.1.0 + Orval codegen sudah terkonfigurasi. |
| `lib/api-client-react` | Generated | React Query hooks tergenerate dari spec. `custom-fetch.ts` (371 baris) sudah robust. |
| `lib/api-zod` | Generated | Zod schemas tergenerate. `HealthCheckResponse` adalah satu-satunya schema. |
| `api-server` | Scaffolded | Express 5 + pino-http + CORS. Hanya ada route `/api/healthz`. |
| `jjs-soundboard` | **Functional** | 596 sounds hardcoded di `data/sounds.ts`. UI lengkap dengan search, favorites, copy ID. |
| `mockup-sandbox` | Kosong | Plugin Vite + auto-discovery sudah jalan. Belum ada mockup components. |

#### 2. MASALAH ARSITEKTUR

**A. Data Hardcoded (Critical)**
- 596 sound entries di `src/data/sounds.ts` adalah array statis — tidak terhubung ke database atau API.
- Tidak ada mekanisme untuk CRUD data sounds dari sisi admin/user.
- Product requirements menyebutkan "mock data ready to swap" — ini masih dalam kondisi itu.

**B. Audio Engine Dead Code**
- `src/lib/audioEngine.ts` (synthesizer Web Audio API) sudah diimplementasi dengan kategori karakter yang berbeda (Gojo: ethereal sine, Sukuna: dark sawtooth, Hakari: square-wave, dll).
- **Tidak diimport atau digunakan** di manapun dalam UI. Ini dead code.
- Product requirements menyebutkan "Play/Pause button for instant audio preview" — fitur ini belum terhubung.

**C. Dependency Tidak Terpakai**
- `cookie-parser` di `api-server` sudah terinstall tapi belum digunakan (mungkin untuk auth nanti).
- `@workspace/db` sudah jadi dependency `api-server` tapi belum diimport di route manapun.
- `@workspace/api-client-react` di-reference di `jjs-soundboard` tapi belum diimport di source code.
- `@tanstack/react-query` di `jjs-soundboard` sudah setup sebagai provider tapi tidak aktif fetch data.

**D. Nama Project vs Produk**
- Root package bernama `workspace`, folder `Asset-Manager` — tapi produk sebenarnya adalah JJS Soundboard.
- `replit.md` masih placeholder (belum diisi).

**E. UI Over-Installed**
- `jjs-soundboard` punya ~60 shadcn/ui components terinstall, tapi hanya `Input`, `Badge`, `Card` yang dipakai.
- `mockup-sandbox` punya 50+ shadcn/ui components — ini bagus untuk prototyping.

#### 3. POSITIF

- **Architecture-first approach**: OpenAPI spec sebagai single source of truth, codegen untuk type safety.
- **Custom fetch layer**: `custom-fetch.ts` sangat robust — handle auth, React Native edge cases, error parsing.
- **Security**: Logger redact authorization headers + cookies. `minimumReleaseAge` di pnpm workspace.
- **Build system**: esbuild dengan CJS compatibility shim, source maps, pino plugin.
- **DevOps**: Post-merge hook otomatis `pnpm install` + `db push`. Replit artifact deployment.
- **Theme system**: Dark/light mode dengan CSS custom properties, JJK-inspired colors (deep purple primary).

---

## Plan Pengerjaan

### Phase 1: Database Schema & Seed Data

**Goal:** Migrate data hardcoded ke PostgreSQL, setup schema yang proper.

#### Task 1.1: Define Database Schema
- [ ] Buat `lib/db/src/schema/sounds.ts` — table `sounds` dengan columns:
  - `id` (serial, primary key)
  - `title` (text, not null)
  - `category` (text, not null)
  - `robloxId` (text, not null, unique)
  - `character` (text, nullable) — untuk grouping per karakter
  - `createdAt` (timestamp, default now)
  - `updatedAt` (timestamp, default now)
- [ ] Buat `lib/db/src/schema/categories.ts` — table `categories`:
  - `id` (serial, primary key)
  - `name` (text, not null, unique)
  - `slug` (text, not null, unique)
  - `icon` (text, nullable)
  - `sortOrder` (integer, default 0)
- [ ] Update `lib/db/src/schema/index.ts` untuk export semua schemas
- [ ] Buat Zod insert schemas dengan `drizzle-zod` (ikuti pattern di comments yang sudah ada)

#### Task 1.2: Seed Data Migration
- [ ] Buat script `scripts/src/seed-sounds.ts` untuk import 596 sounds dari `jjs-soundboard/src/data/sounds.ts` ke database
- [ ] Parse existing data structure → map ke database columns
- [ ] Jalankan seed script, verifikasi data masuk

#### Task 1.3: Push Schema
- [ ] Jalankan `pnpm --filter @workspace/db run push` untuk apply schema ke PostgreSQL
- [ ] Verifikasi table terbuat dengan benar

---

### Phase 2: OpenAPI Spec & API Endpoints

**Goal:** Extend API spec dan implementasi routes untuk CRUD sounds.

#### Task 2.1: Extend OpenAPI Spec
- [ ] Tambahkan schemas di `lib/api-spec/openapi.yaml`:
  - `Sound` (id, title, category, robloxId, character, createdAt, updatedAt)
  - `SoundList` (array of Sound + pagination meta)
  - `Category` (id, name, slug, icon, sortOrder)
  - `CreateSoundRequest`, `UpdateSoundRequest`
- [ ] Tambahkan endpoints:
  - `GET /sounds` — list sounds (query params: search, category, page, limit)
  - `GET /sounds/:id` — get single sound
  - `POST /sounds` — create sound
  - `PUT /sounds/:id` — update sound
  - `DELETE /sounds/:id` — delete sound
  - `GET /categories` — list categories
- [ ] Jalankan `pnpm --filter @workspace/api-spec run codegen` untuk regenerate hooks + Zod schemas

#### Task 2.2: Implement API Routes
- [ ] Buat `artifacts/api-server/src/routes/sounds.ts`:
  - `GET /api/sounds` — query dengan Drizzle, support search (ILIKE), filter by category, pagination
  - `GET /api/sounds/:id` — select by ID
  - `POST /api/sounds` — insert with Zod validation
  - `PUT /api/sounds/:id` — update with Zod validation
  - `DELETE /api/sounds/:id` — delete by ID
- [ ] Buat `artifacts/api-server/src/routes/categories.ts`:
  - `GET /api/categories` — select all, ordered by sortOrder
- [ ] Register routes di `artifacts/api-server/src/routes/index.ts`
- [ ] Import `@workspace/db` di route files untuk akses database

#### Task 2.3: Verify API
- [ ] Test setiap endpoint dengan curl atau API client
- [ ] Pastikan search, filter, pagination berfungsi

---

### Phase 3: Frontend — Connect to API

**Goal:** Replace hardcoded data dengan API calls menggunakan React Query hooks.

#### Task 3.1: Setup API Client
- [ ] Import `setBaseUrl` dari `@workspace/api-client-react` di `jjs-soundboard/src/main.tsx` atau `App.tsx`
- [ ] Set base URL ke `/api`
- [ ] Pastikan `QueryClientProvider` sudah terpasang (sudah ada)
- [ ] Import dan gunakan generated hooks (`useSoundsQuery`, `useCategoriesQuery`, dll)

#### Task 3.2: Refactor Soundboard Page
- [ ] Replace `import { sounds } from "@/data/sounds"` dengan API query
- [ ] Gunakan `useSoundsQuery({ search, category })` untuk fetch data
- [ ] Handle loading state (skeleton/spinner)
- [ ] Handle error state (retry button)
- [ ] Hapus atau archive `src/data/sounds.ts` (tidak perlu lagi hardcoded)

#### Task 3.3: Categories Navigation
- [ ] Fetch categories dari API
- [ ] Update tab/category navigation untuk use API data
- [ ] Pastikan filtering by category berfungsi dengan API query params

---

### Phase 4: Audio Playback Integration

**Goal:** Aktifkan audio engine yang sudah ada untuk preview sounds.

#### Task 4.1: Audio Engine Review
- [ ] Review `src/lib/audioEngine.ts` — pastikan API-nya sesuai dengan kebutuhan UI
- [ ] Buat hook `src/hooks/useAudioPlayer.ts` yang wrap audioEngine:
  - `play(sound)` — play preview, auto-stop previous
  - `stop()` — stop current
  - `isPlaying(id)` — check if specific sound is playing
  - State: `currentSound`, `isPlaying`

#### Task 4.2: UI Integration
- [ ] Tambahkan tombol Play/Pause di setiap `SoundCard`
- [ ] Visual feedback: icon berubah play/pause, highlight saat playing
- [ ] Auto-stop sebelumnya saat play baru (sesuai requirements)
- [ ] Handle mobile: Web Audio API membutuhkan user interaction pertama

#### Task 4.3: Audio Behavior
- [ ] Implementasi auto-stop: ketika play sound baru, stop yang sebelumnya
- [ ] Loading state saat audio initializing
- [ ] Error handling untuk browser yang tidak support Web Audio API

---

### Phase 5: Mockup Sandbox — Create Component Mockups

**Goal:** Buat komponen UI mockup di mockup sandbox untuk visualisasi design.

#### Task 5.1: Setup Mockup Directory
- [ ] Buat `artifacts/mockup-sandbox/src/components/mockups/` directory
- [ ] Verifikasi Vite plugin auto-detect component baru

#### Task 5.2: Create Soundboard Mockups
- [ ] Buat `SoundCardMockup.tsx` — mockup komponen kartu suara dengan:
  - Title, category badge, Roblox ID, play button, copy button, favorite star
- [ ] Buat `SoundboardLayoutMockup.tsx` — mockup layout keseluruhan:
  - Header dengan search bar, category tabs, grid of sound cards
- [ ] Buat `CategoryNavMockup.tsx` — mockup navigasi kategori
- [ ] Akses via `/preview/SoundCardMockup`, `/preview/SoundboardLayoutMockup`, dll

#### Task 5.3: Theme Variants
- [ ] Buat dark mode dan light mode variants
- [ ] Test responsive layout (mobile vs desktop)

---

### Phase 6: Cleanup & Polish

**Goal:** Bersihkan dead code, update documentation, pastikan everything works.

#### Task 6.1: Remove Dead Code
- [ ] Hapus atau comment `cookie-parser` dari `api-server` dependencies jika tidak dipakai
- [ ] Evaluate `audioEngine.ts` — apakah perlu refactor atau sudah cukup
- [ ] Hapus unused shadcn/ui components dari `jjs-soundboard` (yang tidak dipakai)

#### Task 6.2: Update Documentation
- [ ] Update `replit.md` dengan informasi project yang sebenarnya
- [ ] Isi section "Where things live", "Architecture decisions", "Product", "User preferences", "Gotchas"
- [ ] Add README.md dengan setup instructions

#### Task 6.3: Final Verification
- [ ] `pnpm run typecheck` — pastikan tidak ada type errors
- [ ] `pnpm run build` — pastikan build sukses
- [ ] Test full flow: search → filter → copy ID → play audio
- [ ] Test deployment di Replit

---

## Dependency Graph

```
Phase 1 (DB Schema)
    ↓
Phase 2 (API Endpoints) ←── depends on Phase 1
    ↓
Phase 3 (Frontend Connect) ←── depends on Phase 2
    ↓
Phase 4 (Audio Playback) ←── depends on Phase 3 (needs data from API)
    ↓
Phase 5 (Mockup Sandbox) ←── can run in parallel with Phase 3-4
    ↓
Phase 6 (Cleanup) ←── depends on all above
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/api-spec/openapi.yaml` | OpenAPI spec (source of truth untuk API contract) |
| `lib/api-spec/orval.config.ts` | Orval codegen config (2 targets: react-query + zod) |
| `lib/db/src/schema/index.ts` | Database schema exports |
| `lib/db/drizzle.config.ts` | Drizzle Kit config |
| `lib/api-client-react/src/custom-fetch.ts` | Custom HTTP layer (371 baris) |
| `artifacts/api-server/src/app.ts` | Express app setup + middleware |
| `artifacts/api-server/src/routes/index.ts` | Route aggregator |
| `artifacts/jjs-soundboard/src/data/sounds.ts` | Hardcoded sound data (596 entries) |
| `artifacts/jjs-soundboard/src/pages/Soundboard.tsx` | Main soundboard UI |
| `artifacts/jjs-soundboard/src/lib/audioEngine.ts` | Web Audio API synthesizer (dead code) |
| `artifacts/mockup-sandbox/mockupPreviewPlugin.ts` | Vite plugin for mockup auto-discovery |

## Notes untuk Model Lain

1. **Pattern untuk schema**: Ikuti comments di `lib/db/src/schema/index.ts` — setiap table di file terpisah, export Drizzle table + Zod insert schema + types.
2. **Pattern untuk routes**: Lihat `artifacts/api-server/src/routes/health.ts` sebagai contoh.
3. **Pattern untuk hooks**: Lihat `lib/api-client-react/src/generated/api.ts` — hooks sudah tergenerate dari spec.
4. **Zod version**: Project ini pakai `zod/v4` (bukan v3 standar). Import path-nya `import { z } from "zod/v4"`.
5. **Build command**: `pnpm run build` untuk full build, `pnpm run typecheck` untuk type-check saja.
6. **DB push**: `pnpm --filter @workspace/db run push` untuk apply schema changes.
7. **Codegen**: `pnpm --filter @workspace/api-spec run codegen` untuk regenerate hooks + schemas dari OpenAPI spec.
