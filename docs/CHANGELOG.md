# Changelog

All milestone deliveries are recorded here in reverse-chronological order.
See `docs/2026-04-08-material-block-showcase-design.md` §13 for milestone definitions.

## M4 — Charts, Billing, Reports, Settings (100% Coverage) — 2026-04-09

**Delivered**

- **7 new catalog pages + 75 new vendor variants** installed and baked. Final coverage: **43 / 43 display categories (100%) · 449 variants**.
  - bar-charts (9), line-charts (8), chart-compositions (14), chart-tooltips (21), bar-lists (7), billing-usage (6), status-monitoring (10).
- **10 new Live Showcase routes** under `/app/billing/*`, `/app/reports`, `/app/settings/*`:
  - **Billing** (4 routes): overview · invoices · usage · plans. BillingShell with mat-tab-nav-bar.
  - **Reports** (1 route): KPI summary cards · trend overview · top pages list · CSV export.
  - **Settings** (5 routes): profile · security (2FA) · api-keys · integrations · preferences. SettingsShell with mat-tab-nav-bar.
- **3 new Mock APIs**: MockBillingApi (plan/invoices/usage/payments), MockReportsApi (kpis/series/topItems), MockSettingsApi (profile/2FA/apiKeys/integrations/preferences).
- **6 new fixture files**: plans.json, invoices.json, payment-methods.json, usage-metrics.json, reports-metrics.json, api-keys.json, integrations.json.
- **Admin sidenav fully live**: 7 nav items, 0 "即將推出" badges. Billing/Reports/Settings flipped from `soon` to live.
- **i18n expansion**: Added `billing.*`, `reports.*`, `settings.*`, `admin.nav.*`, additional `common.*` keys (80+ new entries).
- **CatalogBlockMeta extended**: Added optional `previewMinHeight` for tall chart previews (chart-compositions: 560px, chart-tooltips: 520px).
- **Catalog registry/routes**: All 7 entries flipped to `shipped`; ComingSoon routes replaced with `loadComponent` lazy loaders; 0 coming-soon entries remain.
- **Tests**: 142/142 SUCCESS (11 new tests for mock APIs + updated specs).
- **Bulk variant screenshots**: 75/75 OK + 10/10 showcase pages OK. Visual check report: `docs/verification/m4-visual-check/REPORT.md`.

**Design Decisions**

- D1: Sub-nav uses `mat-tab-nav-bar`, not expanded sidenav — keeps top-level nav at 7 flat items.
- D2: All new forms use ReactiveForms with `m5-signal-forms-migration` TODO (Angular 20.3 → Signal Forms blocked on v21).
- D3: Chart preview min-height applied via `previewMinHeight` field on CatalogBlockMeta, propagated to `.catalog-page__zone` via `[style.min-height.px]`.

**Known Follow-ups**

- Production build (`ng build --configuration production`) not yet verified (open tech debt from M2).
- Signal Forms migration blocked on Angular 21.
- Chart tooltip palette unification with ChartPaletteService (cosmetic enhancement).

---

## M3 — Users, Forms, Lists & Data Collection — 2026-04-09

**Delivered**

- **8 new catalog pages + 93 new vendor variants** installed and baked. Cumulative coverage: **36 / 43 display categories (84%) · 374 variants**.

  | Category | Free | Paid | Total |
  | --- | ---: | ---: | ---: |
  | `tables` | 1 | 17 | 18 |
  | `stacked-lists` | 1 | 12 | 13 |
  | `grid-lists` | 1 | 14 | 15 |
  | `badges` | 1 | 11 | 12 |
  | `filterbar` | 0 | 12 | 12 |
  | `form-layouts` | 0 | 6 | 6 |
  | `account-user-management` | 0 | 10 | 10 |
  | `file-upload` | 0 | 7 | 7 |
  | **M3 TOTAL** | **4** | **89** | **93** |

- **`/app/users` list view** (`src/app/app-shell/users/`) — reactive filter form (search + status + role) wired to `MockUsersApi.setFilters()`. MatTable with `SelectionModel` for bulk actions, header stats (total / active / invited / suspended), sortable columns (displayName, role, lastLoginAt), row-level destructive confirm, empty state when filters yield no results. Clicking a row navigates to `/app/users/:id`.
- **`/app/users/:id` detail view** — multi-column layout (1/3 summary card + 2/3 tab group). The `id` param flows through `withComponentInputBinding()` → signal `input()` → computed `user()`. Three tabs: **活動** (audit feed synthesized from role), **權限** (slide-toggle list computed from role), **裝置** (mock device list with current-device chip). Header delete action confirms via `ConfirmDestructiveDialog`, removes via `MockUsersApi.remove()`, then navigates back to the list.
- **`/app/users/new` stepper** — 4-step `MatStepper` (基本資料 → 指派角色 → 通知偏好 → 確認). Uses ReactiveForms with explicit `m5-signal-forms-migration` TODO: spec §2 / §13 require Signal Forms but Angular 20.3 does not yet support it (requires v21+). Submit calls `MockUsersApi.create()` which returns a Result; on success navigates to `/app/users/:id`.
- **`/app/teams`** (`src/app/app-shell/teams/`) — 6 cross-department team cards with lead callout, member `mat-list`, role chips, and navigation into user detail. Uses `MockTeamsApi` + `MockUsersApi` together via a `resolved()` computed that resolves member-id references to full user objects.
- **`/app/notifications`** (`src/app/app-shell/notifications/`) — feed view with `mat-chip-listbox` filter (全部 / 未讀 / 系統 / 帳單), unread badge on the 未讀 chip, severity-tinted icons, mark-as-read on click, and a `全部標記為已讀` action in the header.
- **Mock API layer** (`src/app/core/mock-api/`):
  - `MockUsersApi` — 35-user Glacier Analytics fixture (`assets/mock-data/users.json`). Signal-based `filteredUsers` / `stats` computeds. `create` / `update` / `remove` / `bulkRemove` with Result pattern covering `InvalidCredentials` / `EmailAlreadyInUse` / `UserNotFound` codes.
  - `MockNotificationsApi` — 12 mixed system/billing/invite entries with 4-way filter signal and mark-as-read mutations.
  - `MockTeamsApi` — 6 teams with lead + member id references.
- **`ConfirmDestructiveDialog`** (`src/app/core/dialogs/`) — injectable service wrapping `MatDialog` with a reusable `role="alertdialog"` confirmation. Options for title / message / confirmLabel / cancelLabel / destructive / icon. Auto-focus first tabbable, returns `Promise<boolean>`.
- **Admin sidenav flipped** — `NAV_ITEMS` updated so `users`, `teams`, `notifications` are now live and `billing`, `reports`, `settings` remain `soon` (M4 scope). Total 7 nav items · 4 live · 3 soon.
- **New runtime dependencies** — `@ngx-dropzone/cdk`, `@ngx-dropzone/material` (required by `file-upload/*` variants), `@octokit/core`, `@octokit/openapi-types` (required by `tables/filter-http-data-source-table`). Installed with `--legacy-peer-deps` due to `@ngxpert/avvvatars@2.0.3` pre-existing Angular 18 peer range.
- **`provideNativeDateAdapter()`** added to `app.config.ts` — required by `filterbar/filterbar-11`'s MatDatepicker. No M2/M1 variant used datepicker so this was latent until the M3 catalog surfaced it.

**i18n (Task G)**

- `src/assets/i18n/zh-TW.json` grew from 97 → 150+ keys covering `users.*` (40 keys: filters, columns, status/role labels, stepper steps), `teams.*`, `notifications.*`, `confirm.*`, and `admin.nav.teams`.

**Visual verification (Task H)**

- `scripts/m3-bulk-variant-screenshots.mjs` — new runner walking the 8 M3 categories, auto-detecting variants from the selector, and screenshotting every preview zone.
- **Captured 93 / 93 M3 variants** with zero failures after the 3 fixes below (manifest in `docs/verification/m3-visual-check/variants/_manifest.json`).
- All 5 new Live Showcase routes screenshotted into `docs/verification/m3-visual-check/pages/`.
- Full report at `docs/verification/m3-visual-check/REPORT.md`.

**Fixes caught during visual check**

1. **`filterbar/filterbar-11` — Missing `DateAdapter` provider** — variant uses `MatDatepicker`. Fixed by adding `provideNativeDateAdapter()` to `app.config.ts`.
2. **`file-upload/file-upload-{2-7}` — Wrong component class exported** — vendor ships two components per file (inner `FileUpload{N}DropzoneComponent` + outer `FileUpload{N}Component`). Our catalog page was importing the inner class which requires `<input fileInput>` projection from a parent. Fixed by switching imports to the outer `FileUpload{N}Component` class for variants 2-7.
3. **`/app/notifications` layout overlap** — using `<mat-list>` with `matListItemTitle` / `matListItemLine` slots caused title + message + meta to stack. Replaced with a native `<ul>` + `<button>` grid layout; each row is keyboard-focusable via `:focus-visible` outline and satisfies `@angular-eslint/template/click-events-have-key-events` + `interactive-supports-focus` rules.

**Definition of Done**

- `npm run lint` ✅
- `npm run format:check` ✅
- `ng build --configuration development` ✅
- `ng test --watch=false --browsers=ChromeHeadless` ✅ — **131 / 131 tests green** (113 M2 baseline + 18 new M3 tests).
- 93 / 93 M3 variant screenshots captured with zero failures.
- `/app/users` list + detail + new · `/app/teams` · `/app/notifications` manually verified.
- Admin sidenav shows 4 live + 3 soon items.
- M3 entry appended to `docs/CHANGELOG.md`.
- Annotated tag `m3-users-forms` on the final commit.

**Deferred to M5 (not a blocker)**

- Signal Forms migration for `/app/users/new` — waiting on Angular 21 upgrade.

## M2 — Live Showcase Core — 2026-04-09

**Delivered**

- **18 new catalog pages + 196 new vendor variants** installed and baked. Cumulative coverage: **28 / 43 display categories (65%) · 281 variants**.

  | Category | Free | Paid | Total |
  | --- | ---: | ---: | ---: |
  | `authentication` | 1 | 7 | 8 |
  | `hero-sections` | 0 | 9 | 9 |
  | `feature-sections` | 0 | 20 | 20 |
  | `pricing-sections` | 1 | 15 | 16 |
  | `cta-sections` | 0 | 16 | 16 |
  | `header-sections` | 0 | 6 | 6 |
  | `stats-sections` | 3 | 6 | 9 |
  | `bento-grids` | 0 | 6 | 6 |
  | `testimonial-sections` | 0 | 8 | 8 |
  | `newsletter-sections` | 0 | 6 | 6 |
  | `contact-sections` | 1 | 9 | 10 |
  | `fancy` | 2 | 0 | 2 |
  | `blog-sections` | 1 | 9 | 10 |
  | `kpi-cards` | 0 | 29 | 29 |
  | `spark-area-charts` | 0 | 6 | 6 |
  | `area-charts` | 1 | 14 | 15 |
  | `donut-charts` | 1 | 6 | 7 |
  | `lists` | 2 | 11 | 13 |
  | **M2 TOTAL** | **12** | **184** | **196** |

- **Glacier Analytics marketing landing** (`src/app/landing/landing-page.ts`) composes 13 vendor blocks top-to-bottom (hero · stats · feature · bento · feature · pricing · testimonial · hero · blog · cta · fancy · newsletter · contact). Each section inherits Material 3 tokens so theme + palette swaps reflow globally. The `fancy/memory-album` block is wrapped in a fixed-height frame so its absolute-positioned `h1` is contained.
- **Admin shell** (`src/app/layouts/admin-layout/`) rewritten as a full `MatSidenavContainer` — 260px sidenav with brand lock-up, 6 nav items (dashboard live, five marked `即將推出` with tooltips), sticky Material topbar carrying the theme toggle, palette selector, notification icon, and a `MatMenu` user menu with real sign-out → `/auth/sign-in`.
- **`/app/dashboard`** (`src/app/app-shell/dashboard/`) composes a KPI row, 90-day revenue area chart, plan-distribution donut chart, top-pages bar list, activity feed, and a dismissible onboarding checklist. Data comes from `MockDashboardApi` (HTTP-backed JSON fixtures) and charts render via `ng2-charts` `BaseChartDirective` wired to `ChartPaletteService`. An internal `effect()` rebuilds chart configs whenever either `theme.effectiveMode()` or `theme.palette()` changes.
- **6 new auth routes** (`src/app/auth/`):
  - `sign-in` — rewritten with `ReactiveForms` + Material outline fields, wired to `AuthStore` Result-pattern, navigates to `/app/dashboard` on success.
  - `sign-up` — name + email + password with min-8 validation.
  - `forgot-password` — email form with inline success banner once reset link is queued.
  - `reset-password` — new password + confirm with cross-field mismatch validator.
  - `two-factor` — 6-digit numeric code field (test code `123456`, `000000` triggers TooManyAttempts).
  - `check-email` — confirmation screen with resend button.
  - All forms surface typed `AuthErrorCode` strings via a shared `describeAuthError()` helper with zh-TW copy for every code.
- **Mock API layer** (`src/app/core/mock-api/`):
  - `MockAuthApi` — Result pattern covering sign-in / up / forgot / reset / verify-2fa, with deterministic failure triggers (`locked@`, `network@`, `exists@`, `unknown@`, short passwords). `AuthStore` refactored to delegate and now returns `AuthResult<AuthUser>` instead of throwing.
  - `MockDashboardApi` — loads four JSON fixtures (`dashboard-kpis.json`, `dashboard-plans.json`, `dashboard-top-pages.json`, `dashboard-feeds.json`) via `HttpClient`, plus a deterministic 90-day revenue series computed in-memory with a growth curve + weekend dip.
  - `OnboardingStore` — localStorage-backed `dismissed` flag + 4 default checklist steps.
- **Chart palette utility** (`src/app/core/charts/`):
  - `ChartPaletteService.palette()` — signal exposing `primary / secondary / tertiary / error / success / warning / surface / onSurface / onSurfaceVariant / outlineVariant / categorical` derived from `--mat-sys-*` tokens. Recomputes via an internal effect that tracks both `theme.effectiveMode()` and `theme.palette()`, so palette swaps redraw charts without manual plumbing.
  - `lineDataset()` / `donutDataset()` helpers return chart.js-compatible dataset fragments.
  - `chart-defaults.ts` + `applyChartDefaults()` register font family, grid color, tooltip, and legend defaults. Wired into `app.config.ts` alongside `Chart.register(...registerables)`.

**New feature (beyond the original M2 spec) — M3 palette theme switcher**

The user asked for all Material 3 palette options to be exposed alongside the existing light / dark toggle. We layered a complete palette switcher on top of the existing `.dark` class wiring:

- **`src/styles/themes.scss`** — single SCSS source-of-truth that loops over all twelve M3 palettes (`azure`, `blue`, `violet`, `magenta`, `rose`, `red`, `orange`, `yellow`, `chartreuse`, `green`, `spring-green`, `cyan`) and emits one `:root[data-palette='…']` + `:root[data-palette='…'].dark` pair per palette via `mat.theme()`. `angular.json` now compiles this file instead of the hardcoded `azure-blue` prebuilt theme, so every Material token is available in all 12 × 2 combinations without any runtime CSS injection.
- **`ThemeStore` extended** with `palette: Signal<ThemePalette>` and `setPalette(id)`. Two effects attach `.dark` class and `data-palette` attribute to `<html>`. Both are persisted to localStorage (`theme-mode`, `theme-palette`).
- **`index.html` pre-paint script** reads the stored palette + mode from localStorage before Angular bootstraps, setting the correct attribute / class so there is no flash of wrong-palette content.
- **`ThemePaletteSelector` component** — compact trigger with a swatch + palette icon opens a CDK overlay grid of twelve 24px swatches labelled in zh-TW. Keyboard-accessible (escape to close), persists selection through `ThemeStore.setPalette()`.
- Wired into `CatalogLayout`, `LandingLayout`, `AuthLayout`, and the new `AdminLayout` — palette selector sits next to the existing `ThemeToggle` in every layout.

**i18n (Task G)**

- `src/assets/i18n/zh-TW.json` grew from 54 → 97 keys covering `landing.*`, `dashboard.*`, `auth.*` (+ 9 typed error codes), `admin.*`, `theme.palette.*`, and `common.*`.

**Visual verification (Task H)**

- `scripts/m2-bulk-variant-screenshots.mjs` — new runner that walks all 18 M2 categories, auto-detects variants from the selector, and screenshots every preview zone.
- **Captured 196 / 196 M2 variants** with zero failures (manifest in `docs/verification/m2-visual-check/variants/_manifest.json`).
- All feature screens (landing top & full, dashboard light & dark, palette overlay open, 6 auth routes, 4 chart catalog pages) screenshotted into `docs/verification/m2-visual-check/pages/`.
- Full report at `docs/verification/m2-visual-check/REPORT.md`.

**Fixes caught by visual check**

1. Landing page — `header-section-1` duplicated the hero content and `memory-album` overflowed neighbouring sections. Swapped `header-section-1` for `hero-section-5` as a mid-page break and wrapped `memory-album` in a fixed 420px frame with `overflow: hidden`.
2. Charts stayed on the old primary after palette swaps — `ChartPaletteService` now tracks `theme.palette()` in its effect and defers the CSS re-read one microtask.
3. `catalog-registry` + `catalog-nav` specs hardcoded the M1 split — updated to assert 28 shipped / 15 coming-soon after the M2 flips.

**Definition of Done**

- `npm run lint` ✅ — all files pass linting.
- `npm run format:check` ✅ — Prettier clean.
- `ng build --configuration development` ✅ — bundle generation complete.
- `ng test --watch=false --browsers=ChromeHeadless` ✅ — **113 / 113 tests green** (66 M1 baseline + 47 new M2 / palette tests).
- 196 / 196 M2 variant screenshots captured.
- Landing · dashboard · 6 auth routes · admin layout manually verified in light + dark + rose palette combinations.
- M2 entry appended to `docs/CHANGELOG.md`.
- Annotated tag `m2-live-core` on the final commit.

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
