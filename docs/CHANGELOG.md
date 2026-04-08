# Changelog

All milestone deliveries are recorded here in reverse-chronological order.
See `docs/2026-04-08-material-block-showcase-design.md` §13 for milestone definitions.

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
