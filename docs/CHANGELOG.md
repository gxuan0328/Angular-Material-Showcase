# Changelog

All milestone deliveries are recorded here in reverse-chronological order.
See `docs/2026-04-08-material-block-showcase-design.md` §13 for milestone definitions.

## M1 — Catalog Shell + 10 Display Categories — 2026-04-08

**Delivered**

- **Catalog model layer** (`src/app/catalog/models/`) — `CatalogBlockMeta`, `BlockVariant`, `ApiDocumentation`, `ApiEntry`, `BestPracticeNotes`, with `EMPTY_API` / `EMPTY_BEST_PRACTICES` constants.
- **Catalog registry** (`src/app/catalog/shared/catalog-registry.ts`) — single source of truth for all 43 display categories (29 Application + 14 Marketing). 10 entries flagged `status: 'shipped'`, 33 as `'coming-soon'`. Helpers: `findCatalogEntry`, `findCatalogIndex`, `getNextEntry`, `getPreviousEntry`, `buildCatalogStub`.
- **`CatalogPage` shell** — takes a `CatalogBlockMeta` input, renders heading + 4 content zones (Live Preview · Source Code · API & Props · Best Practices) via `<ng-content select="[slot=...]">` + prev/next navigator.
- **Six shared sub-components**:
  - `BlockPreview` — wraps the variant component via `NgComponentOutlet` in a resizable viewport frame
  - `VariantSelector` — native `<select>` grouped by Free / Paid, emits `selectionChange`
  - `CodeViewer` — tabbed source-code viewer; fetches baked JSON (`assets/block-sources/<category>__<variant>.json`) via `HttpClient`
  - `ApiTable` — 4-section (inputs/outputs/slots/css-properties) typed table
  - `BestPracticesPanel` — 4-card grid (when/when-not/pitfalls/a11y) with tone colours
  - `CatalogNav` — 2-section left tree (Application / Marketing) grouped by subcategory, `routerLinkActive` highlighting, `soon` badge on coming-soon entries
- **43 catalog routes** wired in `catalog.routes.ts`:
  - `/catalog` index page (`CatalogIndex`) — grid card listing of all 43 categories with shipped/coming-soon pill
  - 10 shipped categories lazy-load to `src/app/catalog/blocks/<category>.page.ts`
  - 33 coming-soon categories use the shared `ComingSoon` component (reads `route.data.id` to resolve registry entry)
- **10 shipped display categories** — 85 total block variants:

  | Category | Free | Paid | Total |
  | --- | ---: | ---: | ---: |
  | `page-shells` | 1 | 5 | 6 |
  | `stacked-layouts` | 1 | 8 | 9 |
  | `multi-column` | 1 | 5 | 6 |
  | `page-headings` | 1 | 12 | 13 |
  | `section-headings` | 0 | 10 | 10 |
  | `components` | 0 | 11 | 11 |
  | `flyout-menus` | 1 | 8 | 9 |
  | `dialogs` | 1 | 5 | 6 |
  | `empty-states` | 0 | 10 | 10 |
  | `banners` | 0 | 5 | 5 |
  | **TOTAL** | **5** | **80** | **85** |

  Each `<category>.page.ts` imports its variant components statically from `src/app/blocks/<registry-category>/<variant>/`, exposes `VARIANTS: BlockVariant[]`, `API: ApiDocumentation`, `BEST_PRACTICES: BestPracticeNotes`, `META: CatalogBlockMeta`, and renders through the `CatalogPage` shell with content projection into the 4 slots.
- **Angular Material prebuilt theme** (`azure-blue.css`) wired into `angular.json` (both build and test targets). Material Symbols icon font linked in `src/index.html`. `styles.css` bundle grew from 20 kB (M0) to 91 kB.
- **`ThemeToggle` component** — 3-option radio group (Light / Dark / System) with Material Symbols icons, bound to `ThemeStore.setMode()`. Integrated into all four layouts:
  - `LandingLayout`: brand + theme toggle in flex header
  - `CatalogLayout`: brand link + theme toggle in topbar, `CatalogNav` wired into the left aside
  - `AdminLayout`: brand + theme toggle in topbar
  - `AuthLayout`: theme toggle pinned absolute top-right
- **Auto-restore `AuthStore`** on boot via `provideAppInitializer(() => inject(AuthStore).restore())`. A new 5th test in `app.routes.spec.ts` verifies a persisted localStorage session survives bootstrap and `/app/dashboard` resolves without a fresh `signIn()` call.
- **First-pass zh-TW i18n**:
  - `src/assets/i18n/zh-TW.json` — 43 entries covering brand, nav, theme labels, catalog chrome, best-practices titles, footer
  - `src/app/core/i18n/i18n-store.ts` — signal-based dictionary loader with `t(key, params?)` helper (supports `{name}` interpolation)
  - 4/4 unit tests via HttpTesting
- **`angular.json` assets fix** — added `src/assets` as a second build input so `/assets/**` URLs resolve in both dev and test (previously only `public/` was served; CodeViewer 404'd on every variant).
- **`ComingSoon` fix** — reads `route.data.id` instead of `paramMap('id')` so each coming-soon page shows its actual category title and breadcrumb.

**Coverage**

- Catalog routes: **43 / 43** reachable (10 shipped with full content, 33 coming-soon showing the shared placeholder)
- Block variants: **85 / 85** downloaded via `@ngm-dev/cli add`, all baked into `src/assets/block-sources/*.json` by `scripts/bake-block-sources.ts`
- Dependencies auto-installed by vendor blocks: `clsx ^2.1.1`, `tailwind-merge ^3.5.0` + utility dirs `utils/functions`, `utils/services`, `wrappers/overlay-wrapper`

**Quality gate**

- `npm run lint` — green (vendor `src/app/blocks/**` ignored)
- `npm run format:check` — green
- `npm run build -- --configuration development` — green, 41 lazy chunks (10 per-category catalog pages + 4 layouts + 4 feature routes + Material theme chunks)
- `npm run bake:test` — 3/3 passing
- `npm test` — **66 / 66 passing** (28 M0 baseline + 38 M1 tests: 5 models + 8 registry + 5 catalog-page + 1 block-preview + 3 variant-selector + 1 code-viewer + 2 api-table + 2 best-practices + 3 catalog-nav + 3 theme-toggle + 4 i18n-store + 1 app.routes.spec new auth-restore test)
- Browser integration verified end-to-end via Playwright:
  - `/catalog` index renders 43 cards + left tree + theme toggle
  - `/catalog/page-shells` renders Live Preview (real Page Shell 1 component), Source Code (baked JSON via `CodeViewer`), API table, Best Practices panel, prev/next nav
  - `/catalog/kpi-cards` (coming-soon) shows title "KPI Cards", breadcrumb "Catalog · Page Sections", "即將推出" pill

**Plan deviations** (recorded in commits)

- `CatalogNav` was authored in A4 as a standalone but only wired into `CatalogLayout` during B2 — a gap closed as a bonus during theme-toggle integration. Users now see the tree immediately in `/catalog/**`.
- `angular.json` assets array needed a manual patch (Angular 20's `@angular/build:application` only serves `public/` by default). Discovered during browser verification.
- Vendor dialog files contain two components each (wrapper + dialog content); the E8 task imports the wrapper class only.

**Deferred to later milestones**

- Variant metadata auto-extraction (M1 metadata is hand-authored per category)
- Syntax highlighting in `CodeViewer` (current `<pre><code>` is plain)
- i18n locale switcher UI (zh-TW dictionary is loaded but not wired into catalog chrome yet — components still use inline zh-TW strings)
- M3 SCSS theme customisation (M1 uses prebuilt `azure-blue.css`)
- Real Live Showcase content (dashboard, users, forms, charts) — M2+

## M0 — Workspace Bootstrap — 2026-04-08

**Delivered**

- Angular 20.3.x zoneless workspace (`--style=css`, `--strict`, `--routing`, Karma + Jasmine via `@angular/build:karma`).
- Angular Material 20.2.5 + CDK 20.2.5 + Tailwind 4.1.12 + PostCSS 8.5.6 + `@tailwindcss/postcss` 4.1.12 (peer-dep locked by registry manifest).
- `@angular/animations` ^20.3.18 (manually installed; not in `ng new` defaults but required by `provideAnimationsAsync`).
- `@ngm-dev/cli` 2.0.2 integration: `ngm-dev-cli.json` points to `src/app/blocks/`; `.postcssrc.json` configured for Tailwind v4.
- `ng2-charts` ^8.0.0 + `chart.js` ^4.5.1 (chart-family blocks).
- `@fontsource/inter` + `@fontsource/jetbrains-mono` vendored web fonts.
- Four layout shells (`LandingLayout`, `CatalogLayout`, `AdminLayout`, `AuthLayout`) — OnPush, hosting `<router-outlet />`, with smoke tests.
- Split-shell routing in `src/app/app.routes.ts`:
  - `/` → LandingLayout + LANDING_ROUTES
  - `/catalog` → CatalogLayout + CATALOG_ROUTES
  - `/app/**` → AdminLayout + APP_SHELL_ROUTES (gated by `authMatchGuard`)
  - `/auth/**` → AuthLayout + AUTH_ROUTES
- Core signal stores:
  - `ThemeStore` — light/dark/system mode, localStorage persistence, system pref watcher, DOM `dark` class sync via `effect()`
  - `AuthStore` — mock JWT 8-hour session, localStorage persistence, password ≥ 6 chars validation, `restore()` for rehydration
  - `authMatchGuard` — functional `CanMatchFn` redirecting unauthenticated users to `/auth/sign-in`
- Shared layout type models (`NavItem`, `Breadcrumb`, `ShellLink`, `BlockDisplayCategory`).
- Feature route stubs for landing / catalog / app-shell / auth.
- ESLint (angular-eslint flat config) + Prettier; `eslint-config-prettier` integrated; `format` + `format:check` npm scripts.
- `.prettierignore` excluding vendor block source and baked block-source JSON.
- `scripts/bake-block-sources.ts` — Node script (via `tsx`) walking `src/app/blocks/<category>/<variant>/` and emitting `src/assets/block-sources/<category>__<variant>.json` for Catalog pages to inline at build time. Covered by `node:test`.
- End-to-end smoke test: downloaded `free-page-shells/page-shell-1` (free) and `page-shells/page-shell-2` (paid) via `npx @ngm-dev/cli add`, baked both into JSON.

**Quality gate**

- `npm run lint` — green (vendor `src/app/blocks/**` ignored).
- `npm run format:check` — green (vendor block files and baked JSON ignored via `.prettierignore`).
- `npm run build -- --configuration development` — green, no warnings, 4 layout chunks + 4 routes chunks lazy-loaded.
- `npm run bake:test` — 3/3 passing (`node --test` via `tsx`).
- `npm test -- --watch=false --browsers=ChromeHeadless` — **28/28 passing** across:
  - 2 App component tests (`src/app/app.spec.ts`)
  - 4 model type tests (`src/app/core/layout/models.spec.ts`)
  - 5 ThemeStore tests (`src/app/core/theme/theme-store.spec.ts`)
  - 7 AuthStore tests (`src/app/core/auth/auth-store.spec.ts`)
  - 2 authMatchGuard tests (`src/app/core/auth/auth-match.guard.spec.ts`)
  - 4 layout smoke tests (`src/app/layouts/*/*.spec.ts`)
  - 4 routing integration tests (`src/app/app.routes.spec.ts`)

**Plan deviations from the original spec / plan (recorded inline as `docs(m0):` commits)**

- `ng new` in CLI 20.3.22 does not accept `--test-runner=karma` (Karma is the default). Plan Task 2 corrected.
- Karma + `karma-chrome-launcher` requires `CHROME_BIN` to be a chromium binary. WSL has none preinstalled. Solution: point at Playwright's existing chromium at `/home/gxuan/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome`. Plan Task 2 corrected.
- `@angular/animations` is not installed by `ng new` defaults but is dynamically imported by `provideAnimationsAsync()`. Plan Task 3 corrected.
- The scaffold `app.spec.ts` uses `fixture.detectChanges()` (forbidden by `.claude/rules/testing.md`) and asserts the welcome page `h1`. Rewritten to follow Act → Wait → Assert with `await fixture.whenStable()`. Plan Task 3 corrected.
- `@ngm-dev/cli init` fails with a node-fetch error when fetching SCSS theme files (`_warn.scss`); curl can fetch the same URL successfully, so it is a CLI internal issue, not auth. M0 keeps Tailwind only and defers full Material 3 SCSS theme wiring to M1 when the first Material component appears.

**Deferred to later milestones**

- M3 SCSS theme integration via `@use '@angular/material' as mat`.
- Catalog registry, page shell, and block detail pages (M1).
- Auth form blocks, Landing page content, Dashboard content (M2).
- Real Material navigation chrome (sidenav, topbar) — M1 onwards.
- `@angular/localize` is **not** enabled; plan defers it to M3 if needed.
