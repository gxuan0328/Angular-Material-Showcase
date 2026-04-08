# Milestone M2 — Live Showcase Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for inline execution. This plan was authored after M1 shipped (commit `1d27140`, tag `m1-catalog-shell` + visual-check fixes).

**Spec reference:** `docs/2026-04-08-material-block-showcase-design.md` §13 (M2), §7 (Live Showcase feature designs), §3.2 (coverage matrix).

**Goal:** Ship the realistic Glacier Analytics SaaS shell. Implement the marketing landing page, the `/app/dashboard`, the full `/auth/*` flow (sign-in/sign-up/forgot/reset/2FA), and **18 new fully-populated Catalog pages** covering marketing and first-wave dashboard categories. After M2 the showcase has a complete end-to-end sign-in → dashboard experience.

**Architecture:** Reuse the `<app-catalog-page>` shell, `BlockVariant` interface, and demo-wrapper pattern shipped in M1. New Live-Showcase routes compose vendor blocks directly in feature components under `src/app/landing/`, `src/app/app-shell/`, `src/app/auth/`. A new `MockAuthApi` sits behind `AuthStore.signIn()` to surface realistic error paths. A new `ChartPalette` utility reads Material token CSS variables and exposes theme-aware chart.js dataset colors.

**Tech Stack additions:** `ng2-charts@^8.0.0` + `chart.js@^4.5.1` (already in package.json; wired up in M2 dashboard + charts catalog pages) · Material Symbols icons already wired in M1 · Signal Forms NOT used yet (authentication blocks use ReactiveForms per vendor source — consume as-is).

---

## Scope (locked)

| In | Out (M3+) |
| --- | --- |
| 18 new catalog pages (full variant coverage) | Remaining 15 catalog pages (M3: 8, M4: 7) |
| 196 new vendor variants installed + baked | ng2-charts customization beyond dataset colors |
| Landing page at `/` composed of 12+ marketing blocks | Landing blog detail pages / newsletter backend |
| `/app/dashboard` with KPI row + charts + feeds + onboarding | `/app/users`, `/app/billing`, `/app/reports` (M3/M4) |
| Full `/auth/*` (sign-in / sign-up / forgot / reset / 2fa / check-email) | OAuth providers, real backend |
| Admin layout sidenav + header using `multi-column` variant | Breadcrumbs in admin layout (M3) |
| Mock AuthApi with realistic failure paths | Persisted user profile editing |
| Chart palette utility (`ChartPalette.getLineDataset()` etc.) | Chart-compositions / chart-tooltips (M4) |
| Expand zh-TW.json with landing / dashboard / auth keys | locale switcher UI |

**Total M2 catalog shipped after completion: 28 / 43 display categories / ~281 variants (62% coverage).**

---

## Variants to install (locked inventory from spec §3.1)

| # | Category | Free | Paid | Total | Registry names |
| --- | --- | --- | --- | --- | --- |
| 1 | `authentication` | 1 | 7 | 8 | `free-authentication/*`, `authentication/*` |
| 2 | `hero-sections` | 0 | 9 | 9 | `hero-sections/*` |
| 3 | `feature-sections` | 0 | 20 | 20 | `feature-sections/*` |
| 4 | `pricing-sections` | 1 | 15 | 16 | `free-pricing-sections/*`, `pricing-sections/*` |
| 5 | `cta-sections` | 0 | 16 | 16 | `cta-sections/*` |
| 6 | `header-sections` | 0 | 6 | 6 | `header-sections/*` |
| 7 | `stats-sections` | 3 | 6 | 9 | `free-stats-sections/*`, `stats-sections/*` |
| 8 | `bento-grids` | 0 | 6 | 6 | `bento-grids/*` |
| 9 | `testimonial-sections` | 0 | 8 | 8 | `testimonial-sections/*` |
| 10 | `newsletter-sections` | 0 | 6 | 6 | `newsletter-sections/*` |
| 11 | `contact-sections` | 1 | 9 | 10 | `free-contact-sections/*`, `contact-sections/*` |
| 12 | `fancy` | 2 | 0 | 2 | `free-fancy/memory-album`, `free-fancy/words-album` |
| 13 | `blog-sections` | 1 | 9 | 10 | `free-blog-sections/*`, `blog-sections/*` |
| 14 | `kpi-cards` | 0 | 29 | 29 | `kpi-cards/*` |
| 15 | `spark-area-charts` | 0 | 6 | 6 | `spark-area-charts/*` |
| 16 | `area-charts` | 1 | 14 | 15 | `free-area-charts/*`, `area-charts/*` |
| 17 | `donut-charts` | 1 | 6 | 7 | `free-donut-charts/*`, `donut-charts/*` |
| 18 | `lists` | 2 | 11 | 13 | `free-lists/*`, `lists/*` |

**Total new variants: 196**. Combined with M1's 85 → **281 baked JSON files** after M2.

---

## File Structure

```text
src/app/
├─ auth/
│  ├─ auth.routes.ts                                 # + sign-up / forgot / reset / 2fa / check-email
│  ├─ sign-in/sign-in.ts                             # real form, uses authentication block variant
│  ├─ sign-up/sign-up.ts                             # real form
│  ├─ forgot-password/forgot-password.ts
│  ├─ reset-password/reset-password.ts
│  ├─ two-factor/two-factor.ts
│  └─ check-email/check-email.ts
├─ core/
│  └─ mock-api/
│     ├─ mock-auth-api.ts                           # happy path + 3 failure paths (wrong pw / unknown / locked)
│     ├─ mock-auth-api.spec.ts
│     ├─ mock-users.ts                              # tiny seed list reused by dashboard
│     ├─ mock-dashboard.ts                          # Glacier Analytics mock (revenue, plan dist, feeds, etc.)
│     └─ mock-dashboard.spec.ts
├─ core/charts/
│  ├─ chart-palette.ts                              # reads CSS --mat-sys-* vars, returns dataset colors
│  ├─ chart-palette.spec.ts
│  └─ chart-defaults.ts                             # chart.js global defaults (font family, grid color)
├─ landing/
│  ├─ landing.routes.ts
│  ├─ landing-page.ts                               # composes marketing blocks (12+)
│  ├─ landing-page.html
│  └─ landing-page.css
├─ app-shell/
│  ├─ dashboard/
│  │  ├─ dashboard.ts                               # composes KPI row / charts / feeds / onboarding
│  │  ├─ dashboard.html
│  │  ├─ dashboard.css
│  │  ├─ dashboard.spec.ts
│  │  ├─ onboarding-store.ts                        # localStorage-backed dismiss flag
│  │  └─ onboarding-store.spec.ts
│  └─ app-shell.routes.ts                           # no changes from M1
├─ layouts/
│  ├─ admin-layout/                                 # wire to multi-column sidenav variant + theme-toggle
│  │  ├─ admin-layout.ts
│  │  ├─ admin-layout.html
│  │  └─ admin-layout.css
│  └─ auth-layout/                                  # minor restyling; uses real auth blocks
├─ catalog/
│  └─ blocks/                                       # + 18 new per-category pages
│     ├─ authentication.page.ts
│     ├─ hero-sections.page.ts
│     ├─ feature-sections.page.ts
│     ├─ pricing-sections.page.ts
│     ├─ cta-sections.page.ts
│     ├─ header-sections.page.ts
│     ├─ stats-sections.page.ts
│     ├─ bento-grids.page.ts
│     ├─ testimonial-sections.page.ts
│     ├─ newsletter-sections.page.ts
│     ├─ contact-sections.page.ts
│     ├─ fancy.page.ts
│     ├─ blog-sections.page.ts
│     ├─ kpi-cards.page.ts
│     ├─ spark-area-charts.page.ts
│     ├─ area-charts.page.ts
│     ├─ donut-charts.page.ts
│     ├─ lists.page.ts
│     └─ <category>-demos/                         # per-category demoInputs or wrapper components
└─ blocks/                                         # + 18 new vendor directories (installed by @ngm-dev/cli)
   ├─ free-authentication/
   ├─ authentication/
   ├─ hero-sections/
   ├─ free-area-charts/ ...

src/assets/
├─ i18n/zh-TW.json                                  # + landing.* / dashboard.* / auth.* / common.* keys
├─ mock-data/
│  ├─ dashboard-revenue.json                        # 90-day daily revenue for area chart
│  ├─ dashboard-plans.json                          # plan distribution donut
│  ├─ dashboard-top-pages.json                      # bar-list data
│  ├─ dashboard-feeds.json                          # activity feed entries
│  └─ landing-testimonials.json                     # optional — inline if small
└─ block-sources/                                   # + 196 new baked json files
```

---

## Key Design Decisions

### D1 — Vendor block integration for Live Showcase

Feature components (landing-page, dashboard, sign-in, etc.) **directly import** the vendor component classes and compose them in templates. We do NOT use `*ngComponentOutlet` for Live Showcase — that pattern is only for the variant-switching catalog preview. Composition is straightforward Angular template usage, same as if a developer were using a published UI library.

### D2 — Required inputs + TemplateRef content projection

Same techniques as M1's `components` category visual fix, but applied directly in feature templates:
- For vendor blocks with `input.required<T>()` — provide concrete values from mock data or signals.
- For vendor blocks using `contentChildren(TemplateRefDirective)` — use `<ng-template ngmDevBlockUi...>` in the feature template.
- For vendor blocks using `<ng-content>` projection — project concrete content.

No new demo-wrappers needed in feature code (wrappers live only in the `catalog/blocks/<category>-demos/` directory for the catalog preview).

### D3 — Mock AuthApi

A new `MockAuthApi` class (providedIn root) simulates realistic auth:
- `sign-in(email, password)` → success for any email + `password.length >= 6`, throws `'InvalidCredentials'` for `password.length < 6`, throws `'AccountLocked'` when email starts with `locked@`, throws `'Unknown'` for network-simulated failure (email starts with `network@`).
- `sign-up(input)`, `forgot-password(email)`, `reset-password(token, newPassword)`, `verify-2fa(code)` → similar happy-path + failure-path fake behaviour.
- Returns Promise with ≥200ms simulated latency so loading states are visible.
- `AuthStore.signIn` is refactored to delegate to `MockAuthApi` and surface typed errors via the Result pattern — no behaviour change for existing callers.

### D4 — ChartPalette utility

`ChartPalette.build()` returns `{ primary, secondary, tertiary, success, warning, error, surface, onSurface }`, each read from `getComputedStyle(document.documentElement).getPropertyValue('--mat-sys-primary')` etc. Called inside dashboard chart configs in `ngOnInit` once; re-reads on theme change via a `ThemeStore.effectiveMode` effect. This keeps the charts theme-aware without reaching into chart.js plugins.

### D5 — Dashboard composition reads directly from mock JSON

`MockDashboardApi.load()` fetches `src/assets/mock-data/dashboard-*.json` via `HttpClient`. Returns signals for `revenue`, `plans`, `topPages`, `feeds`. Dashboard component composes KPI cards + charts + lists with realistic Glacier Analytics data (10k sessions, $84,900 MRR, 96.5% uptime, etc.).

### D6 — Admin sidenav layout via `multi-column` variant

Pick `multi-column/multi-column-1` (standard SaaS sidenav + topbar) as the admin layout host. Nav items wire to `/app/dashboard`, `/app/users` (ComingSoon until M3), `/app/billing` (ComingSoon until M4), `/app/reports` (ComingSoon until M4), `/app/settings` (ComingSoon until M4), `/app/notifications`. Topbar includes `<app-theme-toggle>`, mock user avatar + menu, sign-out action (calls `AuthStore.signOut()` → navigates to `/auth/sign-in`).

### D7 — Onboarding overlay on dashboard

`OnboardingStore.dismissed = localStorage.getItem('onboarding.dismissed') === 'true'`. The dashboard renders a checklist card (using `lists/list-1` or free-lists) until dismissed. Dismiss button persists to localStorage.

### D8 — Landing page layout

Single `landing-page.ts` component composes (top-to-bottom):
1. `header-sections/*` — navigation header
2. `hero-sections/*` — big hero
3. `stats-sections/*` — trust metrics
4. `feature-sections/*` — 3 product features (2 rows)
5. `bento-grids/*` — landing feature grid
6. `pricing-sections/*` — plan pricing
7. `testimonial-sections/*` — social proof
8. `blog-sections/*` — blog teasers
9. `cta-sections/*` — mid-page CTA
10. `newsletter-sections/*` — footer subscribe
11. `contact-sections/*` — footer contact
12. `fancy/*` — optional eye-candy strip
13. Footer (reused from landing-layout or inline)

Each section uses a specific variant chosen for visual coherence; the catalog variant selector still exposes 100% of the variants.

### D9 — Auth routes + guards

Public routes (work without AuthStore): `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/check-email`, `/auth/two-factor`.
Successful sign-in → redirect to `/app/dashboard` (via `router.navigate(['/app/dashboard'])`).
`authMatchGuard` already protects `/app/**` from M0 — no changes required.
Each auth route uses a specific `authentication` variant for its form.

### D10 — Catalog page authoring template

Every new catalog `.page.ts` follows M1's exact pattern:
- `VARIANTS` const array with `id / label / registryCategory / component / isFree / demoInputs?`
- `API` object with inputs / outputs / slots / cssProperties
- `BEST_PRACTICES` object with whenToUse / whenNotToUse / pitfalls / accessibility (zh-TW)
- `META` object with id / title / category / subcategory / summary / tags / status='shipped' / variants / api / bestPractices / relatedBlockIds
- The component class extends the standard `@Component` template from M1, no new shell work.

Where a variant has required inputs, supply `demoInputs`. Where a variant uses content projection, create a per-category `*-demos/` wrapper.

### D11 — Chart catalog pages (spark-area, area, donut)

Chart blocks take `data` / `labels` / `datasets` as required inputs. All three catalog pages ship:
- A shared `chart-samples.ts` helper exporting typed sample datasets.
- `demoInputs` per variant pointing at the sample dataset shape the variant expects.
- Theme-aware palette via `ChartPalette` — dashboard and catalog share the same palette output.

---

## Tasks

| # | Task | Files | Notes |
| --- | --- | --- | --- |
| **A** | Write this plan + commit | `docs/plans/2026-04-08-m2-live-core-plan.md` | |
| **B** | Bulk install 196 variants (18 categories) | `src/app/blocks/**` | Batch per category; run bake:build; commit per batch if practical |
| **C** | Update catalog-registry + catalog.routes lazy loadComponents | `catalog-registry.ts`, `catalog.routes.ts` | Flip 18 entries to 'shipped' and wire loadComponent paths |
| **D1–D18** | 18 per-category `.page.ts` files (+ demo wrappers as needed) | `catalog/blocks/<cat>.page.ts` | Dispatch via sub-agents in 4-5 parallelizable batches; each sub-agent gets 2-4 categories |
| **E1** | Chart palette utility + chart defaults | `core/charts/*` | |
| **E2** | Mock AuthApi + refactor AuthStore.signIn to use it | `core/mock-api/mock-auth-api.{ts,spec.ts}`, `core/auth/auth-store.ts` | |
| **E3** | Mock dashboard API + JSON fixtures | `core/mock-api/mock-dashboard.{ts,spec.ts}`, `assets/mock-data/*.json` | |
| **E4** | OnboardingStore | `app-shell/dashboard/onboarding-store.{ts,spec.ts}` | |
| **F1** | Auth layout shell + 6 /auth/* routes using real authentication blocks | `auth/**` | |
| **F2** | Landing page composition | `landing/**` | |
| **F3** | Dashboard page composition | `app-shell/dashboard/**` | |
| **F4** | Admin layout with multi-column variant + sidenav links + topbar + sign-out | `layouts/admin-layout/**` | |
| **G** | Expand zh-TW.json (landing / dashboard / auth / common) | `assets/i18n/zh-TW.json` | |
| **H** | Bulk variant screenshots (M1 tooling) verify 281 variants all render | `docs/verification/m2-visual-check/` | |
| **I** | CHANGELOG + tag `m2-live-core` + final commit | `docs/CHANGELOG.md` | |

---

## Definition of Done

- `npm run lint` green
- `npm run format:check` green
- `npm run build -- --configuration development` green
- `npm run bake:test` green
- `npm test -- --watch=false --browsers=ChromeHeadless` green (M1 66/66 baseline + ~30 new M2 tests)
- All 28 shipped catalog pages render their variant selector, source code, API, and best practices
- `/` landing page renders with at least 12 sections from the marketing blocks
- `/app/dashboard` renders KPI row, area chart, donut chart, bar list, activity feed, onboarding overlay
- `/auth/sign-in` form accepts credentials, surfaces errors inline, navigates to `/app/dashboard` on success
- `/auth/sign-up` / `/auth/forgot-password` / `/auth/reset-password` / `/auth/two-factor` / `/auth/check-email` render with real vendor variants
- Admin sidenav has nav items + theme toggle + sign-out; sign-out returns user to `/auth/sign-in`
- Bulk variant screenshots (`node scripts/bulk-variant-screenshots.mjs`) succeed for all 281 variants
- M2 entry appended to `docs/CHANGELOG.md`
- Annotated tag `m2-live-core` on the final commit

---

## Risks & Mitigations

| # | Risk | Mitigation |
| --- | --- | --- |
| M2.R1 | Bulk install of 196 variants exceeds rate limits / takes hours | Batch per category; resume on failure; tolerate partial failure and retry only missing variants. |
| M2.R2 | Many vendor blocks have `input.required<T>()` → NG0950 in catalog preview | Apply M1's demoInputs pattern; add per-category `*-demos/` wrappers where content projection is needed. |
| M2.R3 | chart.js chart resize issues inside OnPush + zoneless Angular | Use ng2-charts' BaseChartDirective which already handles ngZone gaps; set `responsive: true` + explicit `aspectRatio` in configs. |
| M2.R4 | ChartPalette reading CSS vars returns empty strings on SSR / first paint | Gate the read via `if (typeof document !== 'undefined')` and recompute inside a `afterNextRender()` hook; dashboard uses a default palette until computed. |
| M2.R5 | Landing page becomes huge (12 sections × vendor blocks) → slow dev rebuild | Landing is one lazy-loaded chunk (already lazy via routes); OnPush + no top-level effects keeps runtime fast. |
| M2.R6 | Authentication vendor blocks use ReactiveForms / their own form groups | Consume as-is in M2 per vendor's API; Signal Forms migration is M3+ only if time permits. |
| M2.R7 | 18 new catalog pages × best-practice zh-TW content is tedious to author | Parallelize authoring via sub-agents (3-4 categories per sub-agent); use M1 `components.page.ts` as reference template. |
| M2.R8 | WSL file watcher on `/mnt/c/` misses vendor block source changes | Restart `ng serve` after each bulk install batch; already mitigated by M1 troubleshooting notes. |
