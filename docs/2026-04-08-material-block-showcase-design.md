# Angular Material Block Showcase — Design Document

| Field | Value |
| --- | --- |
| Document ID | `2026-04-08-material-block-showcase-design` |
| Status | Draft — revised after MCP live verification (2026-04-08) |
| Authors | Technical Lead / System Architect |
| Created | 2026-04-08 |
| Revised | 2026-04-08 (post MCP verification) |
| Target Stack | Angular 20 (zoneless) · Angular Material 20.2.5 (M3) · Tailwind v4.1.12 · TypeScript strict |
| Source Catalog | https://ui.angular-material.dev (licensed, All Access Pass) |
| Registry | `https://ui.angular-material.dev/api/registry` — 449 blocks across 43 user-facing display categories |

---

## 1. Purpose & Goals

Build an internal reference site that serves two audiences at once:

1. **Learning** — every Angular Material Block published on `ui.angular-material.dev` is demonstrated in isolation with live preview, source code, API documentation, and best-practice notes.
2. **Team design reference** — the same blocks are assembled into a realistic SaaS admin dashboard so engineers and designers can see the blocks working in production-like contexts.

**Success criteria**

- 100% of the **43 user-facing display categories** listed in Section 3.2 have a dedicated Catalog page, and every category's **variant selector** exposes every variant shipped in the official registry manifest (449 block variants total).
- Every display category is used **at least once** in the Live Showcase in a realistic context.
- A new team member can find, read about, and copy any block inside 60 seconds.
- The site respects every rule in `CLAUDE.md` and `.claude/rules/*.md` (zoneless, OnPush, signals, native control flow, `inject()`, signal inputs/outputs, kebab-case filenames, feature-area directories, a11y AA).
- `ng build` / `ng lint` / `ng test` stay green on the trunk at every milestone.

## 2. Scope Decisions (Locked)

| Topic | Decision | Reason |
| --- | --- | --- |
| Information architecture | Hybrid: Catalog + Live Showcase | Covers both learning and realistic composition. |
| Scope strategy | MVP + progressive milestones (M0 → M4) grouped **by display category** | 43 display categories × average 10 variants each is infeasible in one release; milestones slice by category family (shells, headings, forms, lists, charts, marketing). |
| Catalog granularity | **One page per display category, with variant selector** | Matches official site structure; a single `/catalog/kpi-cards` page carries 29 variants rather than 29 sibling pages. |
| Business domain for Live Showcase | SaaS product admin ("Glacier Analytics") | Naturally exercises billing, usage, notifications, authentication, pricing blocks. |
| UI language | zh-TW primary, proper nouns in English | Matches team reading preference. |
| Mock data | In-memory signal stores + static JSON in `assets/mock-data/` | No backend dependency, offline friendly, simplest to maintain. |
| Theme system | Material 3 tokens + light/dark switch | Showcases M3 theming best practice. |
| Authentication | Mock auth flow with functional guards | Demonstrates Authentication blocks end-to-end without external provider. |
| Catalog page template | Page Heading + 4 content zones (Live Preview + Variant Selector · Source Code · API · Best Practices) | Enforced template ensures consistency across 43 pages regardless of variant count. |
| Shell architecture | **Split Shell** (Landing / Catalog / Admin / Auth) | Each Application Shell variant gets a real usage context. |
| Block source pipeline | `@ngm-dev/cli add` → `src/app/blocks/<category>/<variant>/` (no MCP for content) | Confirmed via live test 2026-04-08; MCP `generate-angular-material-block` is advisory only and returns a CLI command string. |
| Charting library | `ng2-charts@^8.0.0` + `chart.js@^4.3.0` (locked by registry manifest) | Every chart block ships these dependencies; no manual selection needed. |

## 3. Angular Material Block Catalog (Authoritative Inventory)

**Source of truth:** the live registry manifest at `https://ui.angular-material.dev/api/registry/ngm-dev-cli-manifest.json` fetched on 2026-04-08. The previous sitemap-based inventory (36 pages) was incomplete — the real catalog contains **449 block variants across 43 user-facing display categories** plus 10 non-user-facing infrastructure categories (editor configs, device mocks, shared styles, utils, wrappers). See Section 17 (MCP Verification) for the verification log.

### 3.1 Catalog by Display Category

"Display category" merges the `free-<x>` and `<x>` registry categories into a single user-facing page. The variant selector inside each Catalog page lists every free + paid variant.

#### Application Categories (29 pages)

| # | Display Category | Free | Paid | Total | Registry names |
| --- | --- | --- | --- | --- | --- |
| 1 | account-user-management | 0 | 10 | 10 | `account-user-management` |
| 2 | area-charts | 1 | 14 | 15 | `free-area-charts`, `area-charts` |
| 3 | authentication | 1 | 7 | 8 | `free-authentication`, `authentication` |
| 4 | badges | 1 | 11 | 12 | `free-badges`, `badges` |
| 5 | bar-charts | 1 | 8 | 9 | `free-bar-charts`, `bar-charts` |
| 6 | bar-lists | 0 | 7 | 7 | `bar-lists` |
| 7 | billing-usage | 0 | 6 | 6 | `billing-usage` |
| 8 | chart-compositions | 0 | 14 | 14 | `chart-compositions` |
| 9 | chart-tooltips | 0 | 21 | 21 | `chart-tooltips` |
| 10 | components | 0 | 11 | 11 | `components` (breadcrumbs, big-button, progress-circle, category-bar, etc.) |
| 11 | dialogs | 1 | 5 | 6 | `free-dialogs`, `dialogs` |
| 12 | donut-charts | 1 | 6 | 7 | `free-donut-charts`, `donut-charts` |
| 13 | empty-states | 0 | 10 | 10 | `empty-states` |
| 14 | file-upload | 0 | 7 | 7 | `file-upload` |
| 15 | filterbar | 0 | 12 | 12 | `filterbar` |
| 16 | flyout-menus | 1 | 8 | 9 | `free-flyout-menus`, `flyout-menus` |
| 17 | form-layouts | 0 | 6 | 6 | `form-layouts` |
| 18 | grid-lists | 1 | 14 | 15 | `free-grid-lists`, `grid-lists` |
| 19 | line-charts | 1 | 7 | 8 | `free-line-charts`, `line-charts` |
| 20 | lists | 2 | 11 | 13 | `free-lists`, `lists` (onboarding + feeds combined) |
| 21 | multi-column | 1 | 5 | 6 | `free-multi-column`, `multi-column` |
| 22 | page-headings | 1 | 12 | 13 | `free-page-headings`, `page-headings` |
| 23 | page-shells | 1 | 5 | 6 | `free-page-shells`, `page-shells` |
| 24 | section-headings | 0 | 10 | 10 | `section-headings` |
| 25 | spark-area-charts | 0 | 6 | 6 | `spark-area-charts` |
| 26 | stacked-layouts | 1 | 8 | 9 | `free-stacked-layouts`, `stacked-layouts` |
| 27 | stacked-lists | 1 | 12 | 13 | `free-stacked-lists`, `stacked-lists` |
| 28 | status-monitoring | 0 | 10 | 10 | `status-monitoring` |
| 29 | tables | 1 | 17 | 18 | `free-tables`, `tables` |

#### Marketing Categories (14 pages)

| # | Display Category | Free | Paid | Total | Registry names |
| --- | --- | --- | --- | --- | --- |
| 30 | banners | 0 | 5 | 5 | `banners` |
| 31 | bento-grids | 0 | 6 | 6 | `bento-grids` |
| 32 | blog-sections | 1 | 9 | 10 | `free-blog-sections`, `blog-sections` |
| 33 | contact-sections | 1 | 9 | 10 | `free-contact-sections`, `contact-sections` |
| 34 | cta-sections | 0 | 16 | 16 | `cta-sections` |
| 35 | fancy | 2 | 0 | 2 | `free-fancy` (memory-album, words-album) |
| 36 | feature-sections | 0 | 20 | 20 | `feature-sections` |
| 37 | header-sections | 0 | 6 | 6 | `header-sections` |
| 38 | hero-sections | 0 | 9 | 9 | `hero-sections` |
| 39 | kpi-cards | 0 | 29 | 29 | `kpi-cards` |
| 40 | newsletter-sections | 0 | 6 | 6 | `newsletter-sections` |
| 41 | pricing-sections | 1 | 15 | 16 | `free-pricing-sections`, `pricing-sections` |
| 42 | stats-sections | 3 | 6 | 9 | `free-stats-sections`, `stats-sections` |
| 43 | testimonial-sections | 0 | 8 | 8 | `testimonial-sections` |

**Total: 43 display categories / 449 block variants** (25 free + 424 paid).

#### Non-user-facing registry categories (not Catalog pages)

These are consumed at build or initialisation time but do not appear as Catalog pages:

- Editor configs (6): `.cursor`, `.github`, `.idx`, `.junie`, `.vscode`, `.windsurf`
- Infrastructure (4): `device-mocks`, `wrappers`, `styles`, `utils`

### 3.2 Coverage Matrix (Display Category ↔ Live Showcase)

Every row has both a Catalog page and at least one Live Showcase usage point. This is the acceptance criterion for "100% coverage".

| # | Display Category | Catalog Route | Live Showcase Usage |
| --- | --- | --- | --- |
| 1 | account-user-management | `/catalog/account-user-management` | `/app/settings/profile`, `/app/users/:id` |
| 2 | area-charts | `/catalog/area-charts` | `/app/dashboard` revenue trend |
| 3 | authentication | `/catalog/authentication` | `/auth/*` sign-in, sign-up, reset, 2FA |
| 4 | badges | `/catalog/badges` | status tags across all pages |
| 5 | bar-charts | `/catalog/bar-charts` | `/app/reports` category breakdown |
| 6 | bar-lists | `/catalog/bar-lists` | `/app/dashboard` top pages, `/app/reports` top items |
| 7 | billing-usage | `/catalog/billing-usage` | `/app/billing`, `/app/billing/usage` |
| 8 | chart-compositions | `/catalog/chart-compositions` | `/app/reports` composed chart |
| 9 | chart-tooltips | `/catalog/chart-tooltips` | every chart hover across `/app/*` |
| 10 | components | `/catalog/components` | various — breadcrumbs in `/app/*`, progress-circle in `/app/billing/usage`, category-bar in `/app/reports` |
| 11 | dialogs | `/catalog/dialogs` | `/app/users` delete confirm, `/app/billing` payment, `/app/settings/api-keys` reveal |
| 12 | donut-charts | `/catalog/donut-charts` | `/app/dashboard` plan distribution |
| 13 | empty-states | `/catalog/empty-states` | `/app/users` empty list, `/app/notifications` no-unread |
| 14 | file-upload | `/catalog/file-upload` | `/app/settings/profile` avatar, `/app/reports` import CSV |
| 15 | filterbar | `/catalog/filterbar` | `/app/users` filter, `/app/billing/invoices` filter, `/app/reports` |
| 16 | flyout-menus | `/catalog/flyout-menus` | `/app` topbar user menu, `/app/users` row context menu |
| 17 | form-layouts | `/catalog/form-layouts` | `/app/settings/*` settings forms |
| 18 | grid-lists | `/catalog/grid-lists` | `/app/settings/integrations` |
| 19 | line-charts | `/catalog/line-charts` | `/app/reports` long-range trend |
| 20 | lists | `/catalog/lists` | `/app/dashboard` onboarding checklist, `/app/notifications` feed |
| 21 | multi-column | `/catalog/multi-column` | `/app/users/:id` detail, `/app/settings` |
| 22 | page-headings | `/catalog/page-headings` | every `/app/*` inner page |
| 23 | page-shells | `/catalog/page-shells` | `/` Landing page |
| 24 | section-headings | `/catalog/section-headings` | `/app/settings/*` sub-sections |
| 25 | spark-area-charts | `/catalog/spark-area-charts` | KPI cards in `/app/dashboard` |
| 26 | stacked-layouts | `/catalog/stacked-layouts` | `/catalog` docs layout itself |
| 27 | stacked-lists | `/catalog/stacked-lists` | `/app/teams`, `/app/settings/api-keys` webhooks |
| 28 | status-monitoring | `/catalog/status-monitoring` | `/app/dashboard` system status card |
| 29 | tables | `/catalog/tables` | `/app/users`, `/app/billing/invoices` |
| 30 | banners | `/catalog/banners` | `/` hero banner, `/app/billing` upgrade nag |
| 31 | bento-grids | `/catalog/bento-grids` | `/` landing feature grid |
| 32 | blog-sections | `/catalog/blog-sections` | `/` landing blog preview |
| 33 | contact-sections | `/catalog/contact-sections` | `/` landing footer area |
| 34 | cta-sections | `/catalog/cta-sections` | `/` landing mid/bottom CTA |
| 35 | fancy | `/catalog/fancy` | `/` landing hero animation |
| 36 | feature-sections | `/catalog/feature-sections` | `/` landing product features |
| 37 | header-sections | `/catalog/header-sections` | `/` landing navigation header |
| 38 | hero-sections | `/catalog/hero-sections` | `/` landing hero |
| 39 | kpi-cards | `/catalog/kpi-cards` | `/` landing trust metrics, `/app/dashboard` KPI row |
| 40 | newsletter-sections | `/catalog/newsletter-sections` | `/` landing footer subscribe |
| 41 | pricing-sections | `/catalog/pricing-sections` | `/`, `/app/billing/plans` |
| 42 | stats-sections | `/catalog/stats-sections` | `/` landing company stats |
| 43 | testimonial-sections | `/catalog/testimonial-sections` | `/` landing social proof |

> **Coverage target: 43 / 43 display categories. Each page's variant selector must expose 100% of its registry variants (449 total).**

## 4. Project Architecture

### 4.1 Workspace Layout

Single Angular 20 application organised by feature area (no Nx monorepo).

```text
angular-material-block/
├─ docs/
│  └─ 2026-04-08-material-block-showcase-design.md
├─ src/
│  ├─ main.ts
│  ├─ index.html
│  ├─ styles.css                       # global M3 tokens + Tailwind directives
│  ├─ app/
│  │  ├─ app.ts                        # root component, <router-outlet/>
│  │  ├─ app.routes.ts                 # top-level split routes
│  │  ├─ app.config.ts                 # providers (zoneless, router, HttpClient, animations)
│  │  │
│  │  ├─ core/
│  │  │  ├─ theme/                     # ThemeStore (signal), css-var writer effect
│  │  │  ├─ auth/                      # AuthStore, authMatchGuard, auth.interceptor
│  │  │  ├─ mock-api/                  # MockUsersApi, MockBillingApi, ... + fixture loader
│  │  │  ├─ layout/                    # ShellLink, NavItem, Breadcrumb models
│  │  │  └─ i18n/                      # I18nStore + translate pipe
│  │  │
│  │  ├─ layouts/
│  │  │  ├─ landing-layout/            # marketing-style shell
│  │  │  ├─ catalog-layout/            # docs-style shell (left tree + right ToC)
│  │  │  ├─ admin-layout/              # SaaS admin shell (uses Application Shells block)
│  │  │  └─ auth-layout/               # minimal centered card
│  │  │
│  │  ├─ landing/                      # feature: marketing landing page
│  │  ├─ catalog/
│  │  │  ├─ catalog.routes.ts
│  │  │  ├─ shared/                    # block-preview, code-viewer, api-table, best-practices
│  │  │  └─ blocks/
│  │  │     ├─ application-shells/
│  │  │     ├─ headings/
│  │  │     ├─ components/
│  │  │     ├─ forms/
│  │  │     ├─ lists/
│  │  │     ├─ elements/
│  │  │     ├─ overlays/
│  │  │     ├─ feedbacks/
│  │  │     ├─ charts/
│  │  │     ├─ marketing/
│  │  │     └─ enhanced/
│  │  ├─ app-shell/                    # feature: Live Showcase root
│  │  │  ├─ app-shell.routes.ts
│  │  │  ├─ dashboard/
│  │  │  ├─ users/
│  │  │  ├─ teams/
│  │  │  ├─ billing/
│  │  │  ├─ reports/
│  │  │  ├─ notifications/
│  │  │  └─ settings/
│  │  └─ auth/
│  │     ├─ auth.routes.ts
│  │     ├─ sign-in/
│  │     ├─ sign-up/
│  │     ├─ forgot-password/
│  │     ├─ reset-password/
│  │     └─ two-factor/
│  └─ assets/
│     ├─ mock-data/                    # seed JSON files
│     ├─ block-sources/                # per-block source snapshots from MCP
│     └─ i18n/
│        └─ zh-TW.json
├─ angular.json
├─ package.json
└─ tsconfig.json
```

### 4.2 Top-level Routing

```ts
// src/app/app.routes.ts
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/landing-layout/landing-layout').then(m => m.LandingLayout),
    loadChildren: () =>
      import('./landing/landing.routes').then(m => m.LANDING_ROUTES),
  },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./layouts/catalog-layout/catalog-layout').then(m => m.CatalogLayout),
    loadChildren: () =>
      import('./catalog/catalog.routes').then(m => m.CATALOG_ROUTES),
  },
  {
    path: 'app',
    canMatch: [authMatchGuard],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    loadChildren: () =>
      import('./app-shell/app-shell.routes').then(m => m.APP_SHELL_ROUTES),
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout').then(m => m.AuthLayout),
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
```

### 4.3 Technology Stack

Exact peer dependency versions are **locked by the registry manifest** (verified 2026-04-08). Do not drift from these unless `@ngm-dev/cli` publishes an update.

| Concern | Choice | Version | Notes |
| --- | --- | --- | --- |
| Angular | 20.x (zoneless) | 20.x | `provideZonelessChangeDetection()` in `app.config.ts`; CLI invoked with `--angular-version 20` |
| UI components | Angular Material + Material Symbols | `@angular/material@20.2.5`, `@angular/cdk@20.2.5` | Source of Material 3 tokens; locked by registry |
| Utility CSS | Tailwind | `tailwindcss@4.1.12`, `@tailwindcss/postcss@4.1.12`, `postcss@8.5.6` | `@theme` directive reads M3 CSS variables; locked by registry |
| Chart library | ng2-charts + chart.js | `ng2-charts@^8.0.0`, `chart.js@^4.3.0` | Required by every chart-family block; installed via `@ngm-dev/cli add` dependency resolution |
| State | Signal-based stores | — | No NgRx / no RxJS subjects for app state |
| Async data | `resource()` / `linkedSignal()` | — | Avoids manual `effect()` + fetch patterns |
| Forms | Angular Signal Forms (preferred) / Reactive Forms | — | Rule: see `.claude/rules/angular-framework.md` |
| Routing | `@angular/router` with `withComponentInputBinding()` | — | Typed params via signal inputs |
| HTTP | `HttpClient` (mock JSON via `assets/mock-data/`) | — | |
| Testing | Karma + Jasmine | — | CLI default |
| Lint | ESLint + angular-eslint + Prettier | — | |
| Typography | Inter (UI) + JetBrains Mono (code) | — | Matches official block site |
| Block source pipeline | `@ngm-dev/cli@2.0.2+` | — | Project config in `ngm-dev-cli.json`; auth token in `~/.config/@ngm-dev/cli-nodejs/config.json` |
| i18n | Custom `I18nStore` + `assets/i18n/zh-TW.json` | — | `@angular/localize` deferred until M3 if needed |

### 4.4 `ngm-dev-cli.json` (project config, created in M0)

```json
{
  "$schema": "https://unpkg.com/@ngm-dev/cli/schemas/project-config.json",
  "repos": ["https://ui.angular-material.dev/api/registry"],
  "includeTests": false,
  "watermark": true,
  "formatter": "prettier",
  "paths": {
    "*": "./src/app/blocks"
  },
  "configFiles": {}
}
```

Block variants land under `./src/app/blocks/<registry-category>/<variant-name>/` with the category name preserved (e.g. `src/app/blocks/page-shells/page-shell-2/`, `src/app/blocks/free-page-shells/page-shell-1/`). The Catalog page wraps the filesystem category pair (free + paid) into a single display category.

### 4.5 Authentication & Block Download Workflow

**One-time per machine** (human action, not automation):

```bash
# 1. Log out any stale machine binding
npx @ngm-dev/cli auth --force

# 2. Create / copy a fresh token
#    https://ui.angular-material.dev/account/tokens

# 3. Re-authenticate (rebinds token to this machine)
npx @ngm-dev/cli auth http \
  --username <account-email> \
  --token <fresh-token>
```

**Per project (M0)**:

```bash
# Inside the Angular workspace root
npx @ngm-dev/cli init --angular-version 20
#   → creates ngm-dev-cli.json, postcssrc.json, installs peer deps,
#     adds Material Symbols and Tailwind setup to angular.json
```

**Per block variant** (triggered by Catalog page scaffolding or milestone scripts):

```bash
npx @ngm-dev/cli add <registry-category>/<variant-name> \
  --angular-version 20 \
  --yes \
  --skip-asking-for-dependencies
```

The CLI fetches source from
`https://ui.angular-material.dev/api/registry/ui/blocks/src/lib/v20/{free|paid}/{application|marketing}/<category>/<variant>/*.component.{html,ts,scss}?version=20`
and writes files to the path from `ngm-dev-cli.json`, with an auto-generated header:

```ts
/*
    Installed from https://ui.angular-material.dev/
    Update this file using `npx @ngm-dev/cli update <category>/<variant-name>`
*/
```

**Do not edit installed block files** directly — use `npx @ngm-dev/cli update` to pull upstream changes.

## 5. Information Architecture & Sitemap

### 5.1 Sitemap

```text
/                                     Landing (marketing)
/catalog                              Catalog index
  # Application group (29)
  /catalog/account-user-management
  /catalog/area-charts
  /catalog/authentication
  /catalog/badges
  /catalog/bar-charts
  /catalog/bar-lists
  /catalog/billing-usage
  /catalog/chart-compositions
  /catalog/chart-tooltips
  /catalog/components
  /catalog/dialogs
  /catalog/donut-charts
  /catalog/empty-states
  /catalog/file-upload
  /catalog/filterbar
  /catalog/flyout-menus
  /catalog/form-layouts
  /catalog/grid-lists
  /catalog/line-charts
  /catalog/lists
  /catalog/multi-column
  /catalog/page-headings
  /catalog/page-shells
  /catalog/section-headings
  /catalog/spark-area-charts
  /catalog/stacked-layouts
  /catalog/stacked-lists
  /catalog/status-monitoring
  /catalog/tables
  # Marketing group (14)
  /catalog/banners
  /catalog/bento-grids
  /catalog/blog-sections
  /catalog/contact-sections
  /catalog/cta-sections
  /catalog/fancy
  /catalog/feature-sections
  /catalog/header-sections
  /catalog/hero-sections
  /catalog/kpi-cards
  /catalog/newsletter-sections
  /catalog/pricing-sections
  /catalog/stats-sections
  /catalog/testimonial-sections
  # Each page has query-string variant selector: ?v=<variant-name>
  #   e.g. /catalog/kpi-cards?v=kpi-card-07

/app                                  Live Showcase (authenticated)
  /app/dashboard
  /app/users
  /app/users/:id
  /app/users/new
  /app/teams
  /app/billing
  /app/billing/invoices
  /app/billing/usage
  /app/billing/plans
  /app/reports
  /app/notifications
  /app/settings/profile
  /app/settings/security
  /app/settings/api-keys
  /app/settings/integrations
  /app/settings/preferences

/auth                                 Auth flow
  /auth/sign-in
  /auth/sign-up
  /auth/forgot-password
  /auth/reset-password
  /auth/two-factor
```

## 6. Catalog Page Template (Standardised)

All Catalog pages must use the `<app-catalog-page>` shell. A specific block page only supplies metadata and a preview component; layout is shared.

### 6.1 Page Structure: Heading + Four Content Zones

Every Catalog page renders a top-of-page heading followed by four mandatory content zones in this exact order.

**Page Heading** — renders the `Page Headings` block with title, subtitle, tags, and category chip. Not counted in the four zones because it is the page header, not content.

**Four mandatory content zones:**

1. **Live Preview + Variant Selector** — interactive render of the currently selected variant with `light/dark`, `zh-TW/en`, `mobile/desktop` toggles. A **Variant Selector** (dropdown or chip group) at the top of this zone lists every variant for the category, loaded from the Catalog registry. The selected variant is reflected in the URL (`?v=<variant-name>`) for deep-linking. When a page covers both free and paid variants (e.g. `area-charts` has 1 free + 14 paid), the selector visually groups them (Free · Paid) but switching is seamless.
2. **Source Code** — tabs for TS / HTML / CSS / Usage snippet. Source is read at **build time** from `src/app/blocks/<registry-category>/<variant>/*.component.{ts,html,scss}` (the files `@ngm-dev/cli add` produced) and inlined into the Catalog page via a small build step (`scripts/bake-block-sources.ts`) that walks `src/app/blocks/` and writes `src/assets/block-sources/<registry-category>__<variant>.json`. This eliminates any runtime MCP dependency.
3. **API & Props** — signal inputs, outputs, content slots, CSS custom properties.
4. **Best Practices** — `When to use` / `When not to use` / `Pitfalls` / `Related blocks`.

A `Prev / Next` navigator lives below the four zones and reads from the Catalog registry.

### 6.2 Shared Components

```text
catalog/shared/
├─ catalog-page/                      # the 5-zone shell
├─ block-preview/                     # renders the supplied previewComponent inside variant chrome
├─ code-viewer/                       # Monaco-like tabbed source code panel (Prism highlight)
├─ api-table/                         # typed API documentation table
├─ best-practices-panel/              # accepts structured notes object
└─ catalog-nav/                       # left sidebar tree + prev/next pager
```

### 6.3 `CatalogBlockMeta` Contract

```ts
export interface CatalogBlockMeta {
  readonly id: string;                          // stable slug, e.g. "stacked-lists"
  readonly title: string;
  readonly category: 'application' | 'marketing' | 'enhanced';
  readonly subcategory: string;                 // e.g. "Lists"
  readonly summary: string;                     // one-paragraph intro (zh-TW)
  readonly tags: readonly string[];
  readonly variants: readonly BlockVariant[];
  readonly api: ApiDocumentation;
  readonly bestPractices: BestPracticeNotes;
  readonly relatedBlockIds: readonly string[];
}

export interface BlockVariant {
  readonly id: string;
  readonly label: string;
  readonly component: Type<unknown>;
}

export interface ApiDocumentation {
  readonly inputs: readonly ApiEntry[];
  readonly outputs: readonly ApiEntry[];
  readonly slots: readonly ApiEntry[];
  readonly cssProperties: readonly ApiEntry[];
}

export interface ApiEntry {
  readonly name: string;
  readonly type: string;
  readonly default: string | null;
  readonly required: boolean;
  readonly description: string;                 // zh-TW
}

export interface BestPracticeNotes {
  readonly whenToUse: readonly string[];
  readonly whenNotToUse: readonly string[];
  readonly pitfalls: readonly string[];
  readonly accessibility: readonly string[];
}
```

### 6.4 Catalog Registry

`catalog/blocks/registry.ts` exports a readonly array of all `CatalogBlockMeta` plus a lookup by id. The left-nav tree, sitemap, Prev/Next navigator, and search are all driven by this single registry — there is no other source of truth.

## 7. Live Showcase Feature Designs

Business context: **Glacier Analytics**, a SaaS web analytics product. All mock data is themed around that product.

### 7.1 `/app/dashboard`

- Header: `PageHeading` with action `自訂版面` (opens Drag Elements grid to reorder cards).
- Row 1: 4× `MarketingKpiCard` with embedded Spark Area charts.
- Row 2: left 2/3 Area Chart (revenue trend), right 1/3 Donut Chart (plan distribution).
- Row 3: left Bar List (top 10 pages), right Category Bar (regions).
- Row 4: Feeds block (system notifications + user activities).
- Overlay: Onboarding checklist card, visible only when `OnboardingStore.dismissed() === false`, stored in `localStorage`.

### 7.2 `/app/users`

- `PageHeading` + "新增使用者" action → navigates to `/app/users/new`.
- `Breadcrumbs` and `EnhancedBreadcrumbs`.
- Filters bar: text search + status (`active | invited | suspended`) + role dropdown.
- Tables block: sticky header, column sort, row selection, bulk actions ("停用", "匯出").
- Empty states for: no data, no search results, no permission — all wired to `EmptyStates` variants.
- Row action `刪除` opens `EnhancedDialogs` confirmation modal.

#### `/app/users/:id`

- Multi-column layout: left 1/3 user summary card, right 2/3 Tabs (`活動`, `權限`, `裝置`).
- Uses Account & User Management form variants.

#### `/app/users/new`

- `Stepper`: 基本資料 → 角色 → 通知偏好 → 確認。
- Built with Angular Signal Forms; validation errors surfaced inline.

### 7.3 `/app/teams`

- Stacked Lists block of members.
- Role change action opens Enhanced Dialog with Rich Tooltip explaining each permission.

### 7.4 `/app/billing`

| Sub-route | Blocks used |
| --- | --- |
| `/app/billing` | current plan card, next invoice, payment methods (Billing form) |
| `/app/billing/invoices` | Tables + mock PDF download |
| `/app/billing/usage` | Progress Circle + Line Chart + upgrade Banner |
| `/app/billing/plans` | Pricing Sections block with "升級" action |

### 7.5 `/app/reports`

- Filter bar (date range + dimension picker).
- Category Bar for metric selection.
- Chart Compositions (Line + Bar overlay).
- Bar Lists (top content).
- Export button (mock download).

### 7.6 `/app/notifications`

- Feeds block with infinite scroll and group-by-date.
- Filter chips: `全部`, `未讀`, `系統`, `帳單`.
- Click-through navigates to the source page.

### 7.7 `/app/settings/*`

| Sub-route | Block |
| --- | --- |
| profile | Account Management forms + avatar drop zone (Drag Elements) |
| security | Authentication sub-form + active sessions Tables + 2FA Stepper |
| api-keys | Tables + Dialog (key revealed once) + Webhooks Stacked Lists |
| integrations | Grid List + Badges + Enhanced Breadcrumbs |
| preferences | Section Headings + switch groups |

### 7.8 `/` Landing

- Header Banner (announcement).
- Page Shell wrapper.
- Feature Sections × 2 (key product features).
- KPI Cards (trust metrics).
- Pricing Sections.
- Footer.

### 7.9 `/auth/*`

- Auth layout (centered card, minimal chrome).
- Each route directly renders the matching Authentication form variant.

## 8. Theming & Design System

### 8.1 ThemeStore

```ts
@Injectable({ providedIn: 'root' })
export class ThemeStore {
  private readonly _mode = signal<'light' | 'dark' | 'system'>('system');
  private readonly _systemPrefers = signal<'light' | 'dark'>('light');

  readonly mode = this._mode.asReadonly();
  readonly effectiveMode = computed<'light' | 'dark'>(() =>
    this._mode() === 'system' ? this._systemPrefers() : (this._mode() as 'light' | 'dark'),
  );
  readonly isDark = computed(() => this.effectiveMode() === 'dark');

  constructor() {
    this._mode.set(this.restoreFromStorage());
    this.watchSystemPreference();
    effect(() => {
      document.documentElement.classList.toggle('dark', this.isDark());
    });
  }

  setMode(mode: 'light' | 'dark' | 'system'): void {
    this._mode.set(mode);
    localStorage.setItem('theme-mode', mode);
  }

  private restoreFromStorage(): 'light' | 'dark' | 'system' {
    const raw = localStorage.getItem('theme-mode');
    return raw === 'light' || raw === 'dark' ? raw : 'system';
  }

  private watchSystemPreference(): void {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    this._systemPrefers.set(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', e =>
      this._systemPrefers.set(e.matches ? 'dark' : 'light'),
    );
  }
}
```

### 8.2 Token Strategy

- `@use '@angular/material' as mat;` inside `styles.css` calls `mat.theme()` to emit M3 tokens.
- `:root { ... }` holds light values; `.dark { ... }` overrides for dark mode.
- Tailwind v4 `@theme` block reads those CSS variables so both systems share one set of tokens.
- Brand custom properties live under `--glacier-brand-*` and map to Material `--mat-sys-primary`-style tokens where appropriate.

### 8.3 Dark Mode Rules

- Never hard-code colours — always use tokens.
- Every catalog page must be verified in both modes before a milestone ships.
- Chart palettes are token-aware (derived from primary / secondary / tertiary roles).

## 9. State Management

### 9.1 Signal Store Pattern

Each feature or resource gets its own `@Injectable({ providedIn: 'root' })` store following this shape:

```ts
@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly api = inject(MockUsersApi);

  private readonly _users = signal<readonly User[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly users = this._users.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly activeUsers = computed(() =>
    this._users().filter(u => u.status === 'active'),
  );

  async load(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const users = await this.api.list();
      this._users.set(users);
    } catch (err) {
      this._error.set(toMessage(err));
      throw err;
    } finally {
      this._loading.set(false);
    }
  }

  async create(input: CreateUserInput): Promise<User> {
    const user = await this.api.create(input);
    this._users.update(list => [...list, user]);
    return user;
  }

  async update(id: string, patch: Partial<User>): Promise<User> {
    const updated = await this.api.update(id, patch);
    this._users.update(list => list.map(u => (u.id === id ? updated : u)));
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.api.remove(id);
    this._users.update(list => list.filter(u => u.id !== id));
  }
}
```

### 9.2 Rules

- Writable signals are `private` and exposed via `.asReadonly()`.
- Never `.mutate()`; only `.set()` or `.update(prev => next)` returning a new reference.
- Derived state uses `computed()`; do not use `effect()` to sync signals.
- Cross-async boundaries: read signal values **before** `await`.
- Async data fetching prefers `resource()` for list / detail loads.
- `linkedSignal({ source, computation })` powers pagination and infinite scroll.

## 10. Mock API Layer

### 10.1 Fixture Files

```text
src/assets/mock-data/
├─ users.json              # ~50 seed records
├─ teams.json
├─ invoices.json
├─ plans.json              # drives Pricing Sections + /app/billing/plans
├─ notifications.json      # 100 seed events across 30 days
├─ metrics.json            # dashboard KPIs + time-series
├─ integrations.json
└─ api-keys.json
```

### 10.2 Service Shape

```ts
@Injectable({ providedIn: 'root' })
export class MockUsersApi {
  private readonly http = inject(HttpClient);
  private readonly store = signal<readonly User[]>([]);

  async list(): Promise<readonly User[]> {
    if (this.store().length === 0) {
      const seed = await firstValueFrom(
        this.http.get<User[]>('assets/mock-data/users.json'),
      );
      this.store.set(seed);
    }
    await this.simulateLatency();
    return this.store();
  }

  async create(input: CreateUserInput): Promise<User> {
    const user: User = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.store.update(list => [...list, user]);
    await this.simulateLatency();
    return user;
  }

  async update(id: string, patch: Partial<User>): Promise<User> {
    await this.simulateLatency();
    let updated!: User;
    this.store.update(list =>
      list.map(u => {
        if (u.id !== id) return u;
        updated = { ...u, ...patch };
        return updated;
      }),
    );
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.simulateLatency();
    this.store.update(list => list.filter(u => u.id !== id));
  }

  private simulateLatency(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 400));
  }
}
```

### 10.3 Error Injection (Dev Only)

`MockErrorSwitch` service exposes a signal toggle. When enabled in dev mode, every mock API randomly fails 5% of the time so Empty / Error / Retry blocks can be exercised.

## 11. Authentication

### 11.1 AuthStore

```ts
interface AuthState {
  readonly user: User | null;
  readonly token: string | null;
  readonly expiresAt: number | null;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _state = signal<AuthState>({
    user: null,
    token: null,
    expiresAt: null,
  });

  readonly state = this._state.asReadonly();
  readonly user = computed(() => this._state().user);
  readonly isAuthenticated = computed(() => {
    const s = this._state();
    return !!s.token && (s.expiresAt ?? 0) > Date.now();
  });

  async signIn(email: string, password: string): Promise<void> {
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const user = await this.lookupOrSeed(email);
    const token = this.generateMockJwt(user);
    this._state.set({
      user,
      token,
      expiresAt: Date.now() + 1000 * 60 * 60 * 8,
    });
    localStorage.setItem('auth', JSON.stringify(this._state()));
  }

  signOut(): void {
    this._state.set({ user: null, token: null, expiresAt: null });
    localStorage.removeItem('auth');
  }

  restore(): void {
    const raw = localStorage.getItem('auth');
    if (!raw) return;
    try {
      const restored = JSON.parse(raw) as AuthState;
      if ((restored.expiresAt ?? 0) > Date.now()) {
        this._state.set(restored);
      }
    } catch {
      // corrupted storage — ignore and require re-login
    }
  }
}
```

### 11.2 Functional Guard

```ts
export const authMatchGuard: CanMatchFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.createUrlTree(['/auth/sign-in']);
};
```

### 11.3 UX Helpers

- `/auth/sign-in` provides a **"一鍵登入測試帳號"** button that fills the seeded demo credential and submits.
- Password length (≥ 6) is the only real validation; everything else is simulated.
- `/auth/two-factor` demonstrates the 2FA block using a mock TOTP code (`123456`).

## 12. Internationalisation (zh-TW first)

- `I18nStore` holds a `Record<string, string>` dictionary signal and `locale` signal.
- Template usage: `{{ 'users.title' | t }}` with a signal-aware `TPipe`.
- Dictionary files live in `src/assets/i18n/zh-TW.json`; a second locale (en) can be added later without touching call sites.
- `@angular/localize` is **not** enabled in M0–M2. It is deferred to M3 only if needed.

## 13. Milestones

Milestones are counted **by display category** (Section 3.2), not by block variant. A display category is "done" when (a) its Catalog page is wired up, (b) its variant selector exposes 100% of the manifest variants for that category, and (c) every variant's source lives under `src/app/blocks/<category>/<variant>/` via `@ngm-dev/cli add`.

### M0 — Workspace Bootstrap & Auth Refresh

1. **Auth refresh (pre-flight, manual)** — run `npx @ngm-dev/cli auth --force`, generate a fresh token at `https://ui.angular-material.dev/account/tokens`, re-authenticate via `npx @ngm-dev/cli auth http --username <email> --token <new-token>`. Verify by successfully running `npx @ngm-dev/cli add page-shells/page-shell-2` in a scratch directory (paid block). This **must** succeed before M0 starts writing code.
2. `ng new angular-material-block-showcase` under a **native Linux path** (`/home/gxuan/workspace/...`) to avoid WSL-mount latency.
3. Enable zoneless, strict mode, plain CSS (no SCSS), Angular 20.
4. Run `npx @ngm-dev/cli init --angular-version 20` (or `setup-angular-material-blocks` MCP) to install `@angular/material@20.2.5`, `@angular/cdk@20.2.5`, `tailwindcss@4.1.12`, `@tailwindcss/postcss@4.1.12`, `postcss@8.5.6`, configure `postcssrc.json`, seed `angular.json` style entries, and bootstrap Material Symbols.
5. Check in the generated `ngm-dev-cli.json` exactly as in Section 4.4 (override `paths` if the CLI default differs).
6. Install `ng2-charts@^8.0.0`, `chart.js@^4.3.0`, Inter + JetBrains Mono font packages.
7. Scaffold `core/`, `layouts/`, `landing/`, `catalog/`, `app-shell/`, `auth/` with empty shells.
8. Configure ESLint, angular-eslint, Prettier.
9. Wire `authMatchGuard`, `ThemeStore`, `AuthStore` (stubs).
10. Write `scripts/bake-block-sources.ts` — a Node TS script that walks `src/app/blocks/` after each `ng build` and produces `src/assets/block-sources/<category>__<variant>.json` files for the Catalog page to inline.
11. **Smoke test**: run `npx @ngm-dev/cli add free-page-shells/page-shell-1` and `npx @ngm-dev/cli add page-shells/page-shell-1`. Both files should land in `src/app/blocks/`. Paid add must succeed (proves auth refresh worked).
- **Deliverable:** `ng build` + `ng lint` + `ng test` green; all four layouts reachable by URL; one free and one paid block installed and rendered on a placeholder test page; bake script runs in CI.

### M1 — Catalog Shell + Layout Family (10 display categories)

Ship the Catalog page shell and the categories that define the layout primitives of the whole site — these unblock every other milestone.

- Build `CatalogPage` shell + all shared sub-components (`block-preview`, `variant-selector`, `code-viewer`, `api-table`, `best-practices-panel`, `catalog-nav`).
- Implement Catalog registry (`catalog/blocks/registry.ts`) as a single source of truth for all 43 display categories.
- Route all 43 Catalog URLs to the shell (empty states OK for unshipped categories).
- Ship these **10 display categories** in full (Catalog page + variant selector + baked sources + Best Practices notes):
  1. `page-shells` (6 variants)
  2. `stacked-layouts` (9 variants)
  3. `multi-column` (6 variants)
  4. `page-headings` (13 variants)
  5. `section-headings` (10 variants)
  6. `components` (11 variants — breadcrumbs, big-button, bar-list, category-bar, progress-circle, etc.)
  7. `flyout-menus` (9 variants)
  8. `dialogs` (6 variants)
  9. `empty-states` (10 variants)
  10. `banners` (5 variants)
- Dark/light switcher wired via `ThemeStore`.
- First pass of `zh-TW.json` dictionary (category titles + shell chrome).
- **Deliverable:** `/catalog/**` reachable with 10 complete pages covering **85 variants**; all 43 URLs return non-404 (unshipped return "Coming soon" placeholder page); left-tree navigation complete.

### M2 — Live Showcase Core (Landing + Dashboard + Auth)

Ship the realistic shell of the SaaS product and the marketing landing page, exercising the visual-impact categories.

- Admin layout uses `multi-column` variant from the installed blocks.
- Auth layout + full `authentication` category (Catalog + `/auth/*` routes) + mock auth flow + guards.
- Landing page uses `hero-sections`, `feature-sections`, `pricing-sections`, `cta-sections`, `header-sections`, `stats-sections`, `bento-grids`, `testimonial-sections`, `newsletter-sections`, `contact-sections`, `fancy`, `blog-sections`.
- Dashboard (`/app/dashboard`) uses `kpi-cards`, `spark-area-charts`, `area-charts`, `donut-charts`, `bar-lists`, `components/category-bar`, `lists` (onboarding + feeds), `status-monitoring`, `page-headings`.
- Ship the corresponding **18 Catalog pages** in full: `authentication`, `hero-sections`, `feature-sections`, `pricing-sections`, `cta-sections`, `header-sections`, `stats-sections`, `bento-grids`, `testimonial-sections`, `newsletter-sections`, `contact-sections`, `fancy`, `blog-sections`, `kpi-cards`, `spark-area-charts`, `area-charts`, `donut-charts`, `lists`.
- **Deliverable:** sign-in flow end-to-end; landing page fully populated; dashboard shows realistic Glacier Analytics data; Catalog covers **10 + 18 = 28 display categories / ~220 variants**.

### M3 — Users, Forms, Lists & Data Collection

Ship the data-heavy pages and their supporting form and list categories.

- Live Showcase: `/app/users`, `/app/users/:id`, `/app/users/new`, `/app/teams`, `/app/notifications`.
- Ship these **8 display categories** in full:
  - `tables` (18 variants)
  - `stacked-lists` (13 variants)
  - `grid-lists` (15 variants)
  - `badges` (12 variants)
  - `filterbar` (12 variants)
  - `form-layouts` (6 variants)
  - `account-user-management` (10 variants)
  - `file-upload` (7 variants)
- Signal Forms for the Create User stepper; Tables block for users list; Enhanced Dialogs for destructive actions; Empty States already shipped in M1.
- **Deliverable:** end-to-end CRUD flow for users; Catalog coverage **28 + 8 = 36 display categories / ~313 variants**.

### M4 — Charts, Billing, Reports, Settings (Full Coverage)

Ship the remaining charting categories and the billing / reports / settings pages to reach 100%.

- Live Showcase: `/app/billing/**`, `/app/reports`, `/app/settings/**`.
- Ship the remaining **7 display categories**:
  - `bar-charts` (9 variants)
  - `line-charts` (8 variants)
  - `chart-compositions` (14 variants)
  - `chart-tooltips` (21 variants)
  - `billing-usage` (6 variants)
  - `status-monitoring` (10 variants — if not already shipped in M2)
  - `components` completeness sweep for any remaining variants
- **Deliverable:** **43 / 43 display categories (100% coverage) / 449 variants** and every Live Showcase route from Section 5.1 is implemented.

### Definition of Done (applies to every milestone)

- `ng build` passes with no warnings.
- `ng lint` passes.
- `ng test` passes with coverage ≥ 80% for newly added code.
- `@axe-core/angular` reports no critical/serious issues on every new page.
- Lighthouse (desktop) a11y ≥ 95 and best-practices ≥ 95.
- Every newly shipped display category has the heading + 4 content zones populated, and the variant selector exposes **100% of the manifest variants** for that category.
- Source files for every shipped variant exist under `src/app/blocks/<registry-category>/<variant>/` and are baked into `src/assets/block-sources/` by `scripts/bake-block-sources.ts`.
- Code comments in English; UI copy in zh-TW.
- Milestone changelog appended to `docs/CHANGELOG.md` (created in M0).

## 14. Testing Strategy

| Layer | Tooling | Coverage Target |
| --- | --- | --- |
| Unit (stores, guards, utils) | Karma + Jasmine | 90% |
| Component (block wrappers, Catalog shell, forms) | Karma + Jasmine + TestBed | 80% |
| Accessibility (automated) | `@axe-core/angular` | Every layout and every page, zero critical/serious |
| Accessibility (manual) | NVDA + keyboard + contrast | Before each milestone ship |

**Testing rules (reinforced from `.claude/rules/testing.md`):**

- Never call `fixture.detectChanges()`; use `await fixture.whenStable()`.
- Prefer component-level tests that assert rendered output over unit tests that reach into internals.
- Signal stores: test by calling mutating methods and asserting readonly signal values.
- Mock API: test that latency simulation resolves and error injection toggles errors.

## 15. Quality Gates (CI)

```text
lint → test → a11y-scan → build → (manual) deploy
```

- `lint`: `ng lint`
- `test`: `ng test --watch=false --browsers=ChromeHeadless`
- `a11y-scan`: Playwright + `@axe-core/playwright` nightly smoke pass (post-M2)
- `build`: `ng build --configuration production`
- `deploy`: manual approval to Cloudflare Pages / GitHub Pages (post-M2)

## 16. Risks & Mitigations

| # | Risk | Impact | Mitigation |
| --- | --- | --- | --- |
| R1 | `ngm-dev-blocks` MCP tool surface is narrower than the description implies. `get-all-block-names` returns an empty string (verified 2026-04-08 — appears broken); `generate-angular-material-block` returns only a CLI advisory string, not source code; `setup-angular-material-blocks` is a one-shot init wrapper. | The project cannot rely on MCP alone to pull block inventories or sources during development or CI. | (a) Use the official registry manifest `https://ui.angular-material.dev/api/registry/ngm-dev-cli-manifest.json` as the authoritative list (fetched at design time, snapshotted in this document). (b) Use `@ngm-dev/cli add` directly (not the MCP) to fetch block sources — confirmed end-to-end working for free blocks (200 OK) on 2026-04-08. (c) Treat MCP `setup-angular-material-blocks` as a one-time M0 convenience and call `@ngm-dev/cli init` directly in CI. (d) `scripts/bake-block-sources.ts` reads from `src/app/blocks/` (the CLI's output directory), decoupling the Catalog page from any runtime MCP dependency. |
| R2 | `@ngm-dev/cli` token-machine binding rejects paid block downloads with `401 Unauthorized — Token is bound to a different machine` on the current config (verified 2026-04-08 on paid block `page-shells/page-shell-2`). Free blocks work fine, but 424 paid variants are blocked. | M0 cannot ship a working block pipeline until auth is refreshed. | Before starting M0 code changes: `npx @ngm-dev/cli auth --force` to clear binding, generate a fresh token at `https://ui.angular-material.dev/account/tokens`, then `npx @ngm-dev/cli auth http --username <email> --token <new-token>` to rebind on this WSL host. Validate with `npx @ngm-dev/cli add page-shells/page-shell-2 --angular-version 20 --yes --skip-asking-for-dependencies` in a scratch directory — expect 200 OK. If rebinding still fails, contact `ui.angular-material.dev` support; do not proceed with M0 until resolved. |
| R3 | Windows-mounted WSL path (`/mnt/c/...`) is slow for `ng serve` / `ng build` and npm install. | Developer productivity, CI time. | Host the working copy under `/home/gxuan/workspace/angular-material-block-showcase` (native Linux filesystem). Keep only design docs (`docs/`) on the Windows side if convenient. |
| R4 | Tailwind v4 and Material 3 token collisions. | Visual inconsistency between block styles and custom CSS. | Single source of truth: `mat.theme()` emits CSS variables; Tailwind `@theme` reads them. Verified in the official block source header of `free-page-shells/page-shell-1` (uses Tailwind classes alongside Material components). |
| R5 | Manual maintenance of 43 Catalog metadata entries (+449 variant entries) is error-prone. | Drift, inconsistency, silent gaps when ngm-dev ships new variants. | Centralise in `CatalogBlockMeta` registry with a strict TypeScript interface. Add a CI job that re-fetches the manifest and diffs it against the committed registry; failing the build on any drift. |
| R6 | Chart blocks depend on `ng2-charts@^8.0.0` + `chart.js@^4.3.0` (confirmed via registry manifest for `free-area-charts/area-chart-1`). These are transitive but must stay in sync across variants. | Version skew when mixing chart variants in Live Showcase. | Pin `ng2-charts` and `chart.js` in `package.json` to the exact versions the manifest lists; let `ng test` / `ng build` catch drift. |
| R7 | Mock auth gives a false sense of security. | Demo leak into prod. | Only gate demo routes with mock auth; never copy `AuthStore` into a real product; label `/auth/*` clearly as mock in the UI footer. |
| R8 | `ngm-dev-blocks` licence is per-buyer (All Access Pass). Team members rendering the showcase cannot copy source code to their own projects without their own licence. | Team sharing & compliance risk. | Deploy the showcase behind SSO; add a footer notice linking to the licensing page; never publish the compiled showcase on a public URL. |
| R9 | `@ngm-dev/cli` version drift vs. what the registry manifest expects. Installed block files contain a watermark referencing a specific CLI version, and the CLI evolves. | Future `update` command may fail or produce diffs that break the Catalog bake script. | Pin `@ngm-dev/cli` as a `devDependency` (not `npx -y`) in `package.json` and upgrade only during a dedicated maintenance milestone. Re-run the bake script after any CLI upgrade and visually inspect Catalog pages. |

## 17. MCP Verification (2026-04-08 Live Test)

This section captures the evidence behind R1 and R2 so future maintenance knows what was actually tested and observed.

### 17.1 MCP Tool Behaviour

| MCP tool | Observed behaviour | Effective use |
| --- | --- | --- |
| `get-all-block-names` | Returns empty string `""` on every invocation | **Broken / not usable** — fall back to the manifest endpoint |
| `generate-angular-material-block` | Accepts an array of block names and returns a list of **CLI command strings** (e.g. `npx @ngm-dev/cli add free-page-shells/page-shell-1 --skip-asking-for-dependencies`). Does not download source code. | **Advisory only** — at best, it wraps knowledge of the CLI command format. Catalog automation should call the CLI directly. |
| `setup-angular-material-blocks` | Wraps `@ngm-dev/cli init`; creates `ngm-dev-cli.json`, `postcssrc.json`, installs Tailwind + Angular Material peer deps, configures `angular.json`. | **Usable** once per project at M0. Equivalent to calling `npx @ngm-dev/cli init` directly. |

### 17.2 Registry Endpoints

| Purpose | Method | URL | Auth Required |
| --- | --- | --- | --- |
| Manifest (all categories + variants + peer deps) | GET | `/api/registry/ngm-dev-cli-manifest.json` | CLI headers only (no user token needed for the manifest in practice) |
| Block file content | GET | `/api/registry/ui/blocks/src/lib/v{20\|21}/{free\|paid}/{application\|marketing}/<category>/<variant>/<file>?version={20\|21}` | **All five CLI headers** + machine binding |

### 17.3 Required HTTP Headers (from `@ngm-dev/cli@2.0.2` source inspection)

```
user-agent: ngm-dev-cli
x-cli-token: <public CLI identifier hardcoded in CLI binary>
authorization: Bearer <per-user token from ~/.config/@ngm-dev/cli-nodejs/config.json>
x-username: <account email>
x-machine-id: cli_<os-username>@<hostname>_<install-timestamp>
```

### 17.4 End-to-end Test Results

| Test | Command | Result |
| --- | --- | --- |
| Manifest fetch | `GET /api/registry/ngm-dev-cli-manifest.json` with 5 headers | **200 OK** — 195 KB JSON, 73 categories |
| Free block add | `npx @ngm-dev/cli add free-page-shells/page-shell-1 --angular-version 20 --allow --yes --skip-installing-dependencies --skip-asking-for-dependencies` | **SUCCESS** — `page-shell-1.component.{html,ts}` written to `./src/app/blocks/free-page-shells/page-shell-1/` |
| Paid block add | `npx @ngm-dev/cli add page-shells/page-shell-2 --angular-version 20 --allow --yes --skip-installing-dependencies --skip-asking-for-dependencies` | **FAIL** — `401 Unauthorized: Token is bound to a different machine`. Auth refresh required (see R2). |

### 17.5 Peer Dependency Versions (locked by registry manifest)

```
tailwindcss@4.1.12
@tailwindcss/postcss@4.1.12
postcss@8.5.6
@angular/material@20.2.5
@angular/cdk@20.2.5
ng2-charts@^8.0.0         (chart-family blocks only)
chart.js@^4.3.0           (chart-family blocks only)
```

The manifest's default peer deps reference `@angular/material@21.1.6`, but the CLI resolves version-specific peer deps when `--angular-version 20` is specified. This project pins to Angular 20.

### 17.6 File Header Watermark

Every file installed by `@ngm-dev/cli add` begins with:

```ts
/*
    Installed from https://ui.angular-material.dev/
    Update this file using `npx @ngm-dev/cli update <category>/<variant-name>`
*/
```

**Rule:** never hand-edit installed block files. The Catalog page wraps them in a shell component or composes them in a parent component; use `@ngm-dev/cli update` to pull upstream changes.

## 18. Open Questions (none blocking)

None at time of writing. Any new questions will be captured inline in subsequent milestone plans.

## 19. Decision Log

| Date | Decision | Alternatives considered |
| --- | --- | --- |
| 2026-04-08 | Hybrid Catalog + Live Showcase | Pure catalog; realistic app only |
| 2026-04-08 | MVP + progressive milestones (M0–M4) | Single big release; MVP-only |
| 2026-04-08 | SaaS admin ("Glacier Analytics") as business domain | E-commerce; DevOps/observability |
| 2026-04-08 | zh-TW UI copy, English code comments | Full English; bilingual from day one |
| 2026-04-08 | In-memory signal store + JSON fixtures | MSW; json-server |
| 2026-04-08 | Material 3 + light/dark toggle | Single-theme light only; multi-theme switcher |
| 2026-04-08 | Mock authentication flow | No auth; real OAuth provider |
| 2026-04-08 | Catalog page = Page Heading + 4 content zones + Prev/Next nav | Preview + code only; full tutorial per block |
| 2026-04-08 | Split Shell architecture (four layouts) | Unified shell; iframe wrapping |
| 2026-04-08 (revised) | **One Catalog page per display category with variant selector** (43 pages covering 449 variants) | One page per variant (449 pages, infeasible); one page per top-level group (too coarse) |
| 2026-04-08 (revised) | **Block source pipeline = `@ngm-dev/cli add` → `src/app/blocks/` → bake script → Catalog** | MCP `generate-angular-material-block` for runtime content (doesn't return source); direct registry HTTP calls from the Angular app (violates auth machine binding) |
| 2026-04-08 (revised) | **Milestones counted by display category**, not by variant | Counting by variant (misleading; M1 "10 blocks" was 10 variants but the real M1 is 10 categories / ~85 variants) |
