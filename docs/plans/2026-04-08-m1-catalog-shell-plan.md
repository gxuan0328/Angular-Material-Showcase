# Milestone M1 — Catalog Shell + 10 Display Categories Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for inline execution. This plan was authored after M0 shipped (commit `98c7ce5`, tag `m0-workspace-bootstrap`). It assumes the M0 workspace exists and all M0 quality gates are green.

**Spec reference:** `docs/2026-04-08-material-block-showcase-design.md` §13 (M1) and §6 (Catalog Page Template).

**Goal:** Ship the Catalog page shell, register all 43 display categories (with "Coming soon" placeholders for the 33 unshipped ones), and ship 10 fully-populated catalog pages covering the layout-primitive families. After M1, every other milestone has a working catalog scaffold to plug into.

**Architecture:** Single `<app-catalog-page>` shell component takes a `CatalogBlockMeta` input and composes five zones (heading, preview+variant-selector, source code, API table, best practices). Each of the 10 shipped categories is a thin per-category component file that supplies metadata + a static array of variant components statically imported from `src/app/blocks/<registry-category>/<variant>/`. Source code for each variant is read from `src/assets/block-sources/<registry-category>__<variant>.json` (baked at build time by `scripts/bake-block-sources.ts`). The catalog registry (`src/app/catalog/shared/catalog-registry.ts`) is the single source of truth for all 43 display categories — left-tree nav, prev/next navigator, sitemap, and route table all read from it.

**Tech Stack additions:** Angular Material 20.2.5 prebuilt theme CSS · Material Symbols icon font · `*ngComponentOutlet` for dynamic variant rendering · query-string variant deep-linking via `withComponentInputBinding()`.

---

## Scope (locked)

| In | Out (M2+) |
| --- | --- |
| 43 catalog routes wired (10 shipped + 33 "Coming soon") | Real Live Showcase pages (M2 dashboard, M3 forms, M4 charts) |
| Catalog page shell + 6 shared sub-components | Block API extraction automation (manual metadata in M1) |
| Material 3 prebuilt theme + Material Symbols | Custom M3 token wiring (deferred until needed) |
| Dark mode toggle button in all four layouts | i18n locale switcher (zh-TW only in M1) |
| Auto-restore AuthStore on app boot | Real auth form blocks (M2) |
| First-pass zh-TW dictionary (catalog chrome strings only) | Live Showcase chrome (sidenav, breadcrumbs in M2) |

---

## File Structure

```text
src/app/
├─ app.config.ts                                       # + provideAppInitializer for AuthStore.restore
├─ catalog/
│  ├─ catalog.routes.ts                                # 43 routes — 10 lazy components, 33 ComingSoon
│  ├─ catalog-index.ts                                 # Grid index page listing all 43 categories
│  ├─ coming-soon.ts                                   # Generic "Coming soon" placeholder
│  ├─ shared/
│  │  ├─ catalog-registry.ts                          # Single source of truth — array of 43 entries
│  │  ├─ catalog-registry.spec.ts
│  │  ├─ catalog-page/
│  │  │  ├─ catalog-page.ts                           # Shell hosting all five zones
│  │  │  ├─ catalog-page.html
│  │  │  ├─ catalog-page.css
│  │  │  └─ catalog-page.spec.ts
│  │  ├─ block-preview/
│  │  │  ├─ block-preview.ts                          # ngComponentOutlet wrapper + viewport chrome
│  │  │  ├─ block-preview.html
│  │  │  ├─ block-preview.css
│  │  │  └─ block-preview.spec.ts
│  │  ├─ variant-selector/
│  │  │  ├─ variant-selector.ts                       # native <select> + URL sync
│  │  │  ├─ variant-selector.html
│  │  │  ├─ variant-selector.css
│  │  │  └─ variant-selector.spec.ts
│  │  ├─ code-viewer/
│  │  │  ├─ code-viewer.ts                            # tabs for component files (ts/html/css)
│  │  │  ├─ code-viewer.html
│  │  │  ├─ code-viewer.css
│  │  │  └─ code-viewer.spec.ts
│  │  ├─ api-table/
│  │  │  ├─ api-table.ts                              # static API entries table
│  │  │  ├─ api-table.html
│  │  │  ├─ api-table.css
│  │  │  └─ api-table.spec.ts
│  │  ├─ best-practices-panel/
│  │  │  ├─ best-practices-panel.ts                   # 4-section list (when/when-not/pitfalls/a11y)
│  │  │  ├─ best-practices-panel.html
│  │  │  ├─ best-practices-panel.css
│  │  │  └─ best-practices-panel.spec.ts
│  │  └─ catalog-nav/
│  │     ├─ catalog-nav.ts                            # left tree from registry, grouped app/marketing
│  │     ├─ catalog-nav.html
│  │     ├─ catalog-nav.css
│  │     └─ catalog-nav.spec.ts
│  ├─ models/
│  │  ├─ catalog-block-meta.ts                        # CatalogBlockMeta interface
│  │  ├─ block-variant.ts                             # BlockVariant interface
│  │  ├─ api-documentation.ts                         # ApiDocumentation, ApiEntry interfaces
│  │  ├─ best-practice-notes.ts                       # BestPracticeNotes interface
│  │  └─ models.spec.ts                               # Type smoke tests
│  ├─ blocks/                                         # one .page.ts per shipped category
│  │  ├─ page-shells.page.ts
│  │  ├─ stacked-layouts.page.ts
│  │  ├─ multi-column.page.ts
│  │  ├─ page-headings.page.ts
│  │  ├─ section-headings.page.ts
│  │  ├─ components.page.ts
│  │  ├─ flyout-menus.page.ts
│  │  ├─ dialogs.page.ts
│  │  ├─ empty-states.page.ts
│  │  └─ banners.page.ts
├─ blocks/                                            # vendor — installed by @ngm-dev/cli
│  ├─ free-page-shells/page-shell-1/
│  ├─ page-shells/page-shell-{2..6}/
│  ├─ free-stacked-layouts/<variant>/
│  ├─ stacked-layouts/<variants>/
│  └─ ...                                             # ~85 variant dirs total after M1
└─ assets/
   └─ block-sources/                                  # 85 baked JSON files after M1
      ├─ free-page-shells__page-shell-1.json
      ├─ page-shells__page-shell-2.json
      └─ ...
```

---

## Key Design Decisions

### D1 — Variant rendering: `ngComponentOutlet`

Each catalog page imports its variant components statically and exposes them as a `BlockVariant[]`. The `<app-block-preview>` reuses Angular's `*ngComponentOutlet` to mount the currently selected variant. This is simpler than dynamic `import()` and acceptable for M1 (each catalog page bundles its own variants; lazy boundaries are at the route level — one chunk per catalog page).

### D2 — Source code zone: read from baked JSON

`<app-code-viewer>` accepts `category: string` and `variant: string` inputs. On change, it issues `HttpClient.get<BakedBlock>('/assets/block-sources/<category>__<variant>.json')` and renders the file map as tabbed `<pre><code>` blocks. No syntax highlighter in M1 (Prism/Shiki deferred to a later milestone).

### D3 — API metadata: static TS objects

The 36 manifest entries do not ship machine-readable API surface descriptions. M1 hand-writes a small `ApiDocumentation` object per category (inputs, outputs, slots, css custom properties) — kept in the per-category `.page.ts` file alongside the variant array. Future milestones can introduce a doc-extraction script if drift becomes painful.

### D4 — Best practices: Chinese (zh-TW), in TS objects

Same pattern as D3. Each category's `BestPracticeNotes` is a TS const literal with `whenToUse`, `whenNotToUse`, `pitfalls`, `accessibility` arrays.

### D5 — Variant selector: native `<select>` + URL query param

For M1 we use a plain `<select>` (a11y baseline + form control simplicity). Switching variants writes `?v=<variant-id>` to the URL via `Router.navigate([], { queryParams })`. The URL is the source of truth — page reloads on a deep link land on the right variant. M2+ may upgrade to Material chip-set or radio group.

### D6 — Material theme: prebuilt CSS

`angular.json` `styles` array adds `node_modules/@angular/material/prebuilt-themes/azure-blue.css`. We do **not** wire `@use '@angular/material'` SCSS in M1 (the registry style files are SCSS-only and `@ngm-dev/cli init` failed on them in M0). Custom M3 token customisation deferred until a later milestone needs it.

### D7 — Coming-soon route handling

The 33 unshipped categories all map to `ComingSoon` component, a single shared placeholder that reads the route's `data.category` and shows "<title> — 即將推出". This satisfies spec §13 M1 acceptance ("all 43 URLs return non-404; unshipped return 'Coming soon'").

### D8 — Auto-restore Auth in app boot

Add `provideAppInitializer(() => inject(AuthStore).restore())` to `app.config.ts`. The function runs synchronously on boot, hydrating `_state` from localStorage if a non-expired session exists. Matches the gap discovered during M0 integration verification.

### D9 — Theme toggle: dropdown in each layout's header chrome

Each of the four layout shells gains an `<app-theme-toggle>` button-group component (3 options: Light / Dark / System) bound to `ThemeStore.setMode()`. Component lives at `src/app/core/theme/theme-toggle.ts` so all four layouts can import the same component.

---

## Tasks

| # | Task | Files |
| --- | --- | --- |
| **A1** | Catalog model types (TDD) | `src/app/catalog/models/*.ts` (5 files) |
| **A2** | Catalog registry (43 categories) | `src/app/catalog/shared/catalog-registry.{ts,spec.ts}` |
| **A3** | CatalogPage shell + tests | `src/app/catalog/shared/catalog-page/*` (4 files) |
| **A4** | Six shared sub-components (block-preview, variant-selector, code-viewer, api-table, best-practices-panel, catalog-nav) + tests | `src/app/catalog/shared/{...}/*` (24 files) |
| **A5** | 43 routes + Catalog index + ComingSoon | `src/app/catalog/{catalog.routes,catalog-index,coming-soon}.ts` |
| **B1** | Material prebuilt theme in angular.json + Material Symbols | `angular.json`, `src/index.html` |
| **B2** | `app-theme-toggle` component + wire into 4 layouts | `src/app/core/theme/theme-toggle.{ts,html,css,spec.ts}` + 4 layout templates |
| **C1** | Auto-restore AuthStore on boot | `src/app/app.config.ts` |
| **D**  | Bulk download 85 variants × 10 categories + bake | `src/app/blocks/**`, `src/assets/block-sources/**` |
| **E1**–**E10** | One per-category `.page.ts` file with variant array, API metadata, best practices | `src/app/catalog/blocks/<category>.page.ts` (10 files) |
| **F**  | First-pass zh-TW.json (catalog chrome strings) | `src/assets/i18n/zh-TW.json` |
| **G**  | DoD verification + integration test + CHANGELOG + tag `m1-catalog-shell` | `docs/CHANGELOG.md` |

---

## Definition of Done

- `npm run lint` green (vendor blocks ignored)
- `npm run format:check` green
- `npm run build -- --configuration development` green
- `npm run bake:test` green (3/3)
- `npm test` green (M0 28 baseline + ~30 new M1 tests = ~58 SUCCESS expected)
- All 43 `/catalog/<id>` URLs return 200 in `ng serve` and render either the shipped category page or the ComingSoon placeholder
- Each of the 10 shipped categories renders its variant selector with all variants from the manifest, switches variants by `?v=` query param, shows source code from baked JSON, displays API table and best practices in zh-TW
- Theme toggle visible in each of the 4 layouts and the document `dark` class flips on click
- Authenticated session persists across page reloads (AuthStore restore)
- M1 entry appended to `docs/CHANGELOG.md`
- Annotated tag `m1-catalog-shell` on the final commit

---

## Risks & Mitigations

| # | Risk | Mitigation |
| --- | --- | --- |
| M1.R1 | Variant component selector collisions (each block uses `ngm-dev-block-*` selectors) | Vendor blocks already use namespaced `ngm-dev-block-*` selectors, no collision with our `app-*` prefix. |
| M1.R2 | Bulk download (85 variants) takes a long time / hits rate limit | Run downloads in batches per category; commit per category; resume on failure. |
| M1.R3 | Per-category `.page.ts` files balloon with 10+ variants of imports | Acceptable for M1 (max 13 variants per page = 13 imports); refactor to lazy import only if a category file exceeds 200 lines. |
| M1.R4 | Material Symbols icon font 404s | Use the CDN link from Google Fonts; M1 doesn't ship offline. |
| M1.R5 | Routing integration tests slow down as 43 routes get wired | Single integration test that walks all 43 routes is OK; per-category page tests use `RouterTestingHarness` only when needed. |
