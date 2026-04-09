# Milestone M4 — Charts, Billing, Reports, Settings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for inline execution. This plan was authored after M3 shipped (tag `m3-users-forms`).

**Spec reference:** `docs/2026-04-08-material-block-showcase-design.md` §13 (M4), §7.4 / §7.5 / §7.7 (Live Showcase feature designs), §3.2 (coverage matrix), §5.1 (route map).

**Goal:** Ship the **final** catalog categories and the remaining Live Showcase routes (`/app/billing/**`, `/app/reports`, `/app/settings/**`) to reach **43 / 43 display categories (100%) / 449 baked variants**. After M4 the admin sidenav has **seven live destinations** (dashboard, users, teams, notifications, billing, reports, settings) with zero "即將推出" badges, and every route listed in design §5.1 is implemented.

**Architecture:** Reuse the `<app-catalog-page>` shell, `BlockVariant` interface, Result-pattern mock API, `ChartPaletteService`, `ConfirmDestructiveDialog`, and Playwright verification tooling shipped in M1/M2/M3. Billing and Settings use a **secondary `mat-tab-nav-bar`** for sub-routes (not an expanded left sidenav) so the top-level nav stays flat at 7 items. Three new mock APIs — `MockBillingApi`, `MockReportsApi`, `MockSettingsApi` — sit alongside the existing mock layer.

**Tech stack additions:** None. M0–M3 already installed `@angular/material@20.2.5`, Tailwind, Material Symbols, ng2-charts, `@ngx-dropzone/*`, Playwright, axe. Signal Forms remains unavailable on Angular 20.3 → all new forms use ReactiveForms with the `m5-signal-forms-migration` TODO established in M3.

---

## Scope (locked)

| In | Out (future) |
| --- | --- |
| 7 new catalog pages with full variant coverage | Angular v21 upgrade + Signal Forms migration (M5) |
| 75 new vendor variants installed + baked | Multi-tenant workspace switcher |
| `/app/billing` overview (current plan + next invoice + payment methods) | Real Stripe / payment integration |
| `/app/billing/invoices` (table + mock PDF download) | True PDF rendering |
| `/app/billing/usage` (progress circle + line chart + upgrade banner) | Usage-based throttling |
| `/app/billing/plans` (pricing-sections + upgrade confirm) | Real checkout flow |
| `/app/reports` (filterbar + chart composition + bar list + mock export) | Custom report builder |
| `/app/settings/profile` (account-user-management form + avatar file-upload) | Avatar cropping |
| `/app/settings/security` (2FA ReactiveForms stepper + active sessions table) | WebAuthn / passkeys |
| `/app/settings/api-keys` (tables + reveal dialog + webhooks stacked list) | Real token generation |
| `/app/settings/integrations` (grid-list + badges + detail drawer) | OAuth connect flow |
| `/app/settings/preferences` (section headings + switch groups) | Import/export preferences |
| `MockBillingApi` + `MockReportsApi` + `MockSettingsApi` + fixtures | — |
| Admin sidenav flipped: billing/reports/settings all live | — |
| Expand zh-TW.json with billing/reports/settings/common keys | locale switcher UI |
| Bulk variant screenshots extended to 75 new variants | Production build budget polish pass (tracked as open tech-debt from M2/M3) |

**Total catalog shipped after M4: 43 / 43 display categories / ~449 variants (100%).**

---

## Variants to install (locked inventory from ngm-dev-blocks MCP)

| # | Category | Free | Paid | Total | Vendor ids |
| --- | --- | ---: | ---: | ---: | --- |
| 1 | `bar-charts` | 1 | 8 | 9 | `free-bar-charts/bar-chart-1`, `bar-charts/bar-chart-{2..9}` |
| 2 | `line-charts` | 1 | 7 | 8 | `free-line-charts/line-chart-1`, `line-charts/line-chart-{2..8}` |
| 3 | `chart-compositions` | 0 | 14 | 14 | `chart-compositions/chart-composition-{1..6, 8..15}` (no `7`) |
| 4 | `chart-tooltips` | 0 | 21 | 21 | `chart-tooltips/chart-tooltip-{1..21}` |
| 5 | `bar-lists` | 0 | 7 | 7 | `bar-lists/bar-list-{1..7}` |
| 6 | `billing-usage` | 0 | 6 | 6 | `billing-usage/billing-usage-{1..6}` |
| 7 | `status-monitoring` | 0 | 10 | 10 | `status-monitoring/status-monitoring-{1..10}` |

**Total new variants: 75**. Combined with M0/M1/M2/M3's 374 → **449 baked JSON files** after M4.

---

## File Structure

```text
src/app/
├─ core/
│  └─ mock-api/
│     ├─ mock-billing.ts                             # plan, invoices, usage, paymentMethods, upgradePlan (Result)
│     ├─ mock-billing.spec.ts
│     ├─ mock-reports.ts                             # metrics, series, dimensions, export (Result)
│     ├─ mock-reports.spec.ts
│     ├─ mock-settings.ts                            # profile, 2FA, apiKeys, integrations, preferences (Result)
│     └─ mock-settings.spec.ts
├─ app-shell/
│  ├─ billing/
│  │  ├─ billing-shell.ts                            # Wrapper with mat-tab-nav-bar + <router-outlet>
│  │  ├─ billing-shell.html
│  │  ├─ billing-shell.css
│  │  ├─ billing-overview.ts                         # /app/billing
│  │  ├─ billing-overview.html
│  │  ├─ billing-overview.css
│  │  ├─ billing-invoices.ts                         # /app/billing/invoices
│  │  ├─ billing-invoices.html
│  │  ├─ billing-invoices.css
│  │  ├─ billing-usage.ts                            # /app/billing/usage
│  │  ├─ billing-usage.html
│  │  ├─ billing-usage.css
│  │  ├─ billing-plans.ts                            # /app/billing/plans
│  │  ├─ billing-plans.html
│  │  ├─ billing-plans.css
│  │  └─ billing.routes.ts
│  ├─ reports/
│  │  ├─ reports.ts                                  # /app/reports
│  │  ├─ reports.html
│  │  └─ reports.css
│  ├─ settings/
│  │  ├─ settings-shell.ts                           # Wrapper with mat-tab-nav-bar + <router-outlet>
│  │  ├─ settings-shell.html
│  │  ├─ settings-shell.css
│  │  ├─ settings-profile.ts                         # /app/settings/profile
│  │  ├─ settings-profile.html
│  │  ├─ settings-profile.css
│  │  ├─ settings-security.ts                        # /app/settings/security
│  │  ├─ settings-security.html
│  │  ├─ settings-security.css
│  │  ├─ settings-api-keys.ts                        # /app/settings/api-keys
│  │  ├─ settings-api-keys.html
│  │  ├─ settings-api-keys.css
│  │  ├─ settings-integrations.ts                    # /app/settings/integrations
│  │  ├─ settings-integrations.html
│  │  ├─ settings-integrations.css
│  │  ├─ settings-preferences.ts                     # /app/settings/preferences
│  │  ├─ settings-preferences.html
│  │  ├─ settings-preferences.css
│  │  └─ settings.routes.ts
│  └─ app-shell.routes.ts                            # + billing/reports/settings lazy children
├─ catalog/
│  └─ blocks/                                        # + 7 new per-category pages
│     ├─ bar-charts.page.ts
│     ├─ line-charts.page.ts
│     ├─ chart-compositions.page.ts
│     ├─ chart-tooltips.page.ts
│     ├─ bar-lists.page.ts
│     ├─ billing-usage.page.ts
│     └─ status-monitoring.page.ts
└─ blocks/                                           # + 7 vendor dirs (installed by @ngm-dev/cli)
   ├─ free-bar-charts/
   ├─ bar-charts/
   ├─ free-line-charts/
   ├─ line-charts/
   ├─ chart-compositions/
   ├─ chart-tooltips/
   ├─ bar-lists/
   ├─ billing-usage/
   └─ status-monitoring/

src/assets/
├─ i18n/zh-TW.json                                   # + billing.* / reports.* / settings.* keys
├─ mock-data/
│  ├─ plans.json                                     # 3 tiers: Starter / Growth / Scale
│  ├─ invoices.json                                  # 12 historical invoices
│  ├─ payment-methods.json                           # 2 cards + 1 ACH
│  ├─ usage-metrics.json                             # 12-month series for 5 metrics
│  ├─ reports-metrics.json                           # aggregated metrics for /app/reports
│  ├─ api-keys.json                                  # 6 keys with scopes + last used
│  └─ integrations.json                              # 12 integrations, 3 connected
└─ block-sources/                                    # + 75 new baked json files
```

---

## Key Design Decisions

### D1 — Sub-nav uses `mat-tab-nav-bar`, not expanded sidenav

`/app/billing/*` and `/app/settings/*` each get a `BillingShell` / `SettingsShell` wrapper component that renders:

```
<page heading>
<mat-tab-nav-bar>
  <a mat-tab-link routerLink="overview" routerLinkActive #rla="routerLinkActive" [active]="rla.isActive">總覽</a>
  ...
</mat-tab-nav-bar>
<router-outlet />
```

Top-level sidenav remains 7 flat items. Spec §5.1 route map is still honored — URLs stay `/app/billing/invoices`, etc. — but the visual grouping happens inside the wrapper.

### D2 — ReactiveForms everywhere (Signal Forms deferred — M3 precedent)

`settings-profile.ts`, `settings-security.ts` (2FA stepper), `settings-api-keys.ts` (create key), `settings-preferences.ts` all use `FormBuilder` + `FormGroup` with the same TODO comment:

```ts
// TODO(m5-signal-forms-migration): upgrade to Angular 21 + Signal Forms per
// spec §2 and §13 once the workspace migrates off v20.
```

### D3 — Chart catalog preview min-height

Chart-compositions and chart-tooltips variants need ~520 px of vertical room to render their tallest layouts without clipping. Apply `min-height: 520px` to the `.catalog-page__zone` host **only on these categories** via an optional `previewMinHeight` field on `CatalogBlockMeta`. Other catalog pages stay untouched.

### D4 — MockBillingApi schema

```ts
export interface Plan {
  readonly id: string;
  readonly name: string;
  readonly priceMonthly: number;
  readonly priceYearly: number;
  readonly currency: 'USD' | 'TWD';
  readonly features: readonly string[];
  readonly seatLimit: number;
  readonly recommended?: boolean;
}

export interface Invoice {
  readonly id: string;
  readonly number: string;
  readonly amount: number;
  readonly currency: 'USD' | 'TWD';
  readonly issuedAt: string;  // ISO
  readonly paidAt: string | null;  // null = unpaid
  readonly status: 'paid' | 'due' | 'overdue' | 'refunded';
  readonly downloadUrl: string;  // mock
}

export interface PaymentMethod {
  readonly id: string;
  readonly brand: 'visa' | 'mastercard' | 'amex' | 'ach';
  readonly last4: string;
  readonly expMonth: number;
  readonly expYear: number;
  readonly isDefault: boolean;
}

export interface UsageMetric {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly limit: number;
  readonly unit: string;
  readonly series: readonly { month: string; value: number }[];  // 12 months
}
```

Exposes signal-based state + `upgradePlan(planId)` returning `AuthResult<Plan>` (wrapped in `ConfirmDestructiveDialog`).

### D5 — MockReportsApi schema

```ts
export interface ReportMetric {
  readonly id: string;
  readonly label: string;
  readonly delta: number;        // % change vs. previous period
  readonly value: number;
  readonly unit: string;
}

export interface ReportSeriesPoint {
  readonly date: string;         // ISO
  readonly dimension: string;
  readonly value: number;
}

export interface TopItem {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly unit: string;
}
```

`/app/reports` binds:
- metrics → 4 `kpi-cards` already available from M2
- chart-compositions → `chart-compositions/chart-composition-1` with series data
- bar-lists → `bar-lists/bar-list-1` with `topItems`
- filterbar → `filterbar/filterbar-5` (date range)
- export button → Blob download of CSV of the current metrics

### D6 — MockSettingsApi schema

```ts
export interface UserProfile {
  readonly userId: string;
  readonly displayName: string;
  readonly email: string;
  readonly avatarUrl: string;
  readonly locale: string;
  readonly timezone: string;
}

export interface TwoFactorState {
  readonly enabled: boolean;
  readonly method: 'none' | 'totp' | 'sms';
  readonly backupCodesGeneratedAt: string | null;
}

export interface ApiKey {
  readonly id: string;
  readonly label: string;
  readonly prefix: string;        // first 8 chars (e.g., `sk_live_`)
  readonly lastFour: string;
  readonly scopes: readonly string[];
  readonly createdAt: string;
  readonly lastUsedAt: string | null;
}

export interface Integration {
  readonly id: string;
  readonly name: string;
  readonly category: 'messaging' | 'observability' | 'storage' | 'auth';
  readonly icon: string;
  readonly connected: boolean;
  readonly connectedAt: string | null;
}

export interface PreferenceGroup {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly options: readonly {
    readonly id: string;
    readonly label: string;
    readonly description: string;
    readonly enabled: boolean;
  }[];
}
```

### D7 — Billing overview composition

`billing-overview.ts`:
- Header: 當前方案卡 (plan name + 月費 + upcoming invoice date)
- Row 1: `billing-usage/billing-usage-1` bound to `MockBillingApi.currentPlan()`
- Row 2: 支付方式列表（卡片樣式，可新增 / 設為預設）
- Row 3: `banners/banner-2` 作為「即將到期」提醒（由 `mockBilling.upcomingInvoice()` 驅動）

### D8 — Billing invoices composition

`billing-invoices.ts`:
- Filterbar: 狀態 select + 日期範圍 (reuse `filterbar/filterbar-11` provider)
- `tables/full-width-table` with invoice rows (狀態 badge, download button)
- Click 「下載」 → mock Blob download (`application/pdf` with text body `Mock invoice <id>`)

### D9 — Billing usage composition

`billing-usage.ts`:
- `components/progress-circle` × 3 (storage, api calls, seats)
- `line-charts/line-chart-1` for 12-month API call trend
- `banners/banner-4` upgrade nag if any metric ≥ 80% of limit

### D10 — Billing plans composition

`billing-plans.ts`:
- `pricing-sections/pricing-section-2` (already shipped in M2) with real plan data from `MockBillingApi`
- Click 「選擇方案」 → `ConfirmDestructiveDialog.confirm({ title: '確認升級', destructive: false })` → `mockBilling.upgradePlan(planId)`

### D11 — Reports composition

`reports.ts`:
- Page heading with date range indicator
- 4 KPI cards (`kpi-cards/kpi-card-07` style)
- `chart-compositions/chart-composition-1` bound to `MockReportsApi.series()`
- `bar-lists/bar-list-1` for top items
- `filterbar/filterbar-5` at top for date + dimension
- `button[mat-raised-button]` 匯出 CSV → Blob download

### D12 — Settings profile composition

`settings-profile.ts`:
- Avatar file-upload via `file-upload/file-upload-1`
- `form-layouts/form-layout-3` ReactiveForms: displayName / email (readonly) / locale select / timezone select
- Save button → `mockSettings.updateProfile()`

### D13 — Settings security composition

`settings-security.ts`:
- 4-step MatStepper ReactiveForms (same pattern as `/app/users/new`):
  1. 選擇方式 (TOTP / SMS)
  2. 掃描 QR Code (display placeholder)
  3. 輸入驗證碼 (6-digit input)
  4. 備用碼 (display + copy button)
- Active sessions table below: `tables/simple-card-table` bound to a mocked `sessions` array

### D14 — Settings api-keys composition

`settings-api-keys.ts`:
- `tables/full-width-table` with ApiKey rows (label, prefix, lastFour, createdAt, lastUsedAt, scopes chips, delete button)
- 「建立金鑰」 button → dialog ReactiveForms (label + scopes checkbox group) → reveal dialog showing full key once (copy to clipboard) → `ConfirmDestructiveDialog` for delete

### D15 — Settings integrations composition

`settings-integrations.ts`:
- `grid-lists/grid-list-3` with integration cards (icon + name + connected badge + connect/disconnect button)
- Click card → side drawer with integration details (mock description)

### D16 — Settings preferences composition

`settings-preferences.ts`:
- `section-headings/section-heading-2` per group
- `mat-slide-toggle` for each option
- Save button → `mockSettings.updatePreferences()`

### D17 — Admin sidenav flip

Before M4: 4 live + 3 soon (billing, reports, settings).
After M4: 7 live, 0 soon.

Update `NAV_ITEMS` in `admin-layout.ts` (remove `soon: true` from all three) and update `admin-layout.spec.ts` to expect 0 soon items.

### D18 — Catalog page authoring template (unchanged from M2/M3)

Every new catalog `.page.ts` follows the M1/M2/M3 pattern: `VARIANTS`, `API`, `BEST_PRACTICES`, `META` — with an added optional `previewMinHeight: 520` for chart-compositions / chart-tooltips (D3).

### D19 — Bulk verification tooling

Rename `m3-bulk-variant-screenshots.mjs` usage into a shared library or copy it to `m4-bulk-variant-screenshots.mjs` with a new `CATEGORIES` list of the 7 M4 categories. Output: `docs/verification/m4-visual-check/variants/*.png` + `_manifest.json`. Page screenshots under `docs/verification/m4-visual-check/pages/*.png` for all 10 new showcase routes.

### D20 — i18n expansion

Add top-level `billing`, `reports`, `settings` sections + `common.download`, `common.export`, `common.add`, `common.remove`, `common.active`, `common.inactive` in `assets/i18n/zh-TW.json`.

---

## Tasks

| # | Task | Files | Notes |
| --- | --- | --- | --- |
| **A** | Write this plan + commit | `docs/plans/2026-04-09-m4-charts-billing-plan.md` | |
| **B** | Bulk install 75 variants (7 categories) | `src/app/blocks/**` | Batch per category; resume on failure |
| **C** | Update catalog-registry + catalog.routes lazy loadComponents | `catalog-registry.ts`, `catalog.routes.ts` | Flip 7 entries to 'shipped'; add 'previewMinHeight' on chart types |
| **D1–D7** | 7 per-category `.page.ts` files | `catalog/blocks/<cat>.page.ts` | Chart categories get `previewMinHeight: 520` |
| **E1** | MockBillingApi + fixtures | `core/mock-api/mock-billing.{ts,spec.ts}`, `assets/mock-data/{plans,invoices,payment-methods,usage-metrics}.json` | |
| **E2** | MockReportsApi + fixtures | `core/mock-api/mock-reports.{ts,spec.ts}`, `assets/mock-data/reports-metrics.json` | |
| **E3** | MockSettingsApi + fixtures | `core/mock-api/mock-settings.{ts,spec.ts}`, `assets/mock-data/{api-keys,integrations}.json` (profile + preferences inline) | |
| **F1** | Billing shell + 4 routes | `app-shell/billing/**` | |
| **F2** | Reports route | `app-shell/reports/**` | |
| **F3** | Settings shell + 5 routes | `app-shell/settings/**` | |
| **F4** | Wire billing/reports/settings into app-shell routes | `app-shell/app-shell.routes.ts` | |
| **F5** | Admin sidenav: flip billing/reports/settings to live | `layouts/admin-layout/admin-layout.ts`, `admin-layout.spec.ts` | Expect 0 soon; 7 nav items |
| **G** | Expand zh-TW.json | `assets/i18n/zh-TW.json` | |
| **H1** | Bulk variant screenshots for 75 new variants | `scripts/m4-bulk-variant-screenshots.mjs`, `docs/verification/m4-visual-check/variants/` | |
| **H2** | Page screenshots for 10 showcase routes | `docs/verification/m4-visual-check/pages/` | |
| **H3** | Fix any layout / style / console errors discovered | — | Iterate until all 75 variants + 10 pages render clean |
| **I** | CHANGELOG + tag `m4-charts-billing` + final commit | `docs/CHANGELOG.md` | |

---

## Definition of Done

- `npm run lint` green
- `npm run format:check` green
- `npm run build -- --configuration development` green
- `npm run bake:test` green
- `npm test -- --watch=false --browsers=ChromeHeadless` green (M3 baseline 131 + new M4 tests)
- All 43 shipped catalog pages render their variant selector, source code, API, best practices
- `/app/billing/*` (4 sub-routes) render without overlap and navigate correctly via the tab-nav
- `/app/reports` renders the filterbar + chart composition + bar list + export button
- `/app/settings/*` (5 sub-routes) render without overlap and navigate correctly via the tab-nav
- Admin sidenav shows **7 live** items with zero soon badges
- Bulk variant screenshots (`node scripts/m4-bulk-variant-screenshots.mjs`) succeed for all **75 new M4 variants** with **zero console errors**
- Page screenshots captured for all 10 new showcase routes (`pages/*.png`)
- M4 entry appended to `docs/CHANGELOG.md`
- Annotated tag `m4-charts-billing` on the final commit
- All 4 milestone tags present: `m0-workspace-bootstrap`, `m1-catalog-shell`, `m2-live-core`, `m3-users-forms`, `m4-charts-billing`

---

## Risks & Mitigations

| # | Risk | Mitigation |
| --- | --- | --- |
| M4.R1 | 21 chart-tooltip variants + 14 chart-composition variants stress the bake pipeline and may trigger rate limits | Batch install one category at a time with ≥ 10 s pause between categories; resume on failure; treat partial failures as recoverable |
| M4.R2 | Chart variants have `input.required<ChartData>()` causing NG0950 in the catalog preview | Apply M2/M3 demoInputs pattern: capture the vendor demo dataset into a shared `CHART_DEMO_DATA` constant per category and pass via `demoInputs` |
| M4.R3 | Chart preview zone clips tall layouts at 900 px viewport | D3: add `previewMinHeight: 520` to chart-compositions and chart-tooltips `CatalogBlockMeta`; propagate to `.catalog-page__zone` style |
| M4.R4 | Dark-mode text contrast inside chart tooltips | Reuse `ChartPaletteService` tooltip bg/fg resolver from M2; visual-check report must inspect at least 3 tooltip variants in dark mode |
| M4.R5 | Billing "upgradePlan" flow confusingly uses `ConfirmDestructiveDialog` for a non-destructive action | Pass `destructive: false` so the dialog renders in primary color; still gets the a11y + keyboard support for free |
| M4.R6 | `mat-tab-nav-bar` inside an existing router outlet may cause double scrolling | Use `scrollable="true"` + fixed container height in the billing/settings shells; test in 1440×900 viewport |
| M4.R7 | Chart-tooltip variants with custom HTML tooltip templates may bypass `ChartPaletteService` defaults | If detected, patch the variant wrapper to apply palette CSS variables on the tooltip root; document in Best Practices |
| M4.R8 | ReactiveForms 2FA stepper duplicates `/app/users/new` logic | Extract shared `stepperValidators` helper into `core/forms/` if duplication exceeds ~30 lines; otherwise inline (YAGNI) |
| M4.R9 | `/app/settings/api-keys` reveal dialog must be copy-clipboard-safe under zoneless change detection | Use `ClipboardModule` from `@angular/cdk/clipboard` (already indirectly pulled by Material) and show a snackbar via `MatSnackBar` on success |
| M4.R10 | WSL `/mnt/c/` file watcher misses bulk install changes | Continue the M2/M3 workaround: restart `ng serve` after each bulk batch; clear `.angular/cache` between batches when screenshots look stale |
| M4.R11 | 449 variants in bulk screenshot runner may take > 10 minutes and exhaust Playwright context | Split M3 + M4 runs into separate scripts; M4 runs only the 7 new categories (75 variants); total Playwright time ≤ 3 minutes |
