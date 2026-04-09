# Milestone M3 — Users, Forms, Lists & Data Collection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for inline execution. This plan was authored after M2 shipped (tag `m2-live-core`).

**Spec reference:** `docs/2026-04-08-material-block-showcase-design.md` §13 (M3), §7.2–7.3 / §7.6 (Live Showcase feature designs), §3.2 (coverage matrix).

**Goal:** Ship the data-heavy surface of the Glacier Analytics SaaS — full CRUD for users, a team roster page, a notifications center, and **8 new fully-populated Catalog pages** covering the remaining form / list / data-entry primitives. After M3 the admin sidenav has four live destinations (dashboard, users, teams, notifications) and the catalog sits at **36 / 43 display categories (84%)**.

**Architecture:** Reuse the `<app-catalog-page>` shell, `BlockVariant` interface, Result-pattern mock API, and `ChartPaletteService` shipped in M1/M2. New feature components live under `src/app/app-shell/users/`, `src/app/app-shell/teams/`, `src/app/app-shell/notifications/`. A new `MockUsersApi` + `MockNotificationsApi` + `MockTeamsApi` triplet sits alongside the existing M2 mock layer. A new `ConfirmDestructiveDialog` service wraps `MatDialog` with the M1 `dialogs/dialog-*` variant for every destructive row action.

**Tech Stack additions:** None — M2 already installed `@angular/material@20.2.5`, Tailwind, Material Symbols, ng2-charts. Signal Forms remains unavailable on Angular 20.3 (spec §13 says v21+), so the create-user stepper uses ReactiveForms with an explicit migration comment.

---

## Scope (locked)

| In | Out (M4) |
| --- | --- |
| 8 new catalog pages (full variant coverage) | Remaining 7 catalog pages (bar-charts, line-charts, chart-compositions, chart-tooltips, billing-usage, status-monitoring, bar-lists) |
| 93 new vendor variants installed + baked | Chart composition customization beyond dataset colors |
| `/app/users` list route with filterbar + tables + bulk actions | `/app/billing/**` (M4) |
| `/app/users/:id` detail route with multi-column + tabs | `/app/reports` (M4) |
| `/app/users/new` stepper wired to ReactiveForms (Signal Forms deferred) | `/app/settings/**` (M4) |
| `/app/teams` stacked-lists composition | — |
| `/app/notifications` feeds + filter chips | — |
| `MockUsersApi` (CRUD + search + filter + pagination, Result pattern) | Multi-user role-based guards |
| `MockNotificationsApi` + `MockTeamsApi` | Real-time push notifications |
| `ConfirmDestructiveDialog` service | Optimistic update rollback animations |
| Admin sidenav flipped: users + notifications now live, billing/reports/settings remain soon | — |
| Expand zh-TW.json with users/teams/notifications/common keys | locale switcher UI |

**Total M3 catalog shipped after completion: 36 / 43 display categories / ~374 variants (83%).**

---

## Variants to install (locked inventory from ngm-dev-blocks MCP)

| # | Category | Free | Paid | Total | Registry prefix |
| --- | --- | ---: | ---: | ---: | --- |
| 1 | `tables` | 1 | 17 | 18 | `free-tables/simple-table`, `tables/*` |
| 2 | `stacked-lists` | 1 | 12 | 13 | `free-stacked-lists/simple`, `stacked-lists/*` |
| 3 | `grid-lists` | 1 | 14 | 15 | `free-grid-lists/grid-list-1`, `grid-lists/*` |
| 4 | `badges` | 1 | 11 | 12 | `free-badges/badge-1`, `badges/*` |
| 5 | `filterbar` | 0 | 12 | 12 | `filterbar/*` |
| 6 | `form-layouts` | 0 | 6 | 6 | `form-layouts/*` |
| 7 | `account-user-management` | 0 | 10 | 10 | `account-user-management/*` |
| 8 | `file-upload` | 0 | 7 | 7 | `file-upload/*` |

**Total new variants: 93**. Combined with M0/M1/M2's 281 → **374 baked JSON files** after M3.

---

## File Structure

```text
src/app/
├─ core/
│  └─ mock-api/
│     ├─ mock-users.ts                              # CRUD + search + filter + pagination, Result pattern
│     ├─ mock-users.spec.ts
│     ├─ mock-notifications.ts                      # Feed paging + mark-as-read mutation
│     ├─ mock-notifications.spec.ts
│     ├─ mock-teams.ts                              # Team members + role change mutation
│     └─ mock-teams.spec.ts
├─ core/dialogs/
│  ├─ confirm-destructive-dialog.ts                 # Wraps MatDialog with vendor dialog-2 variant
│  └─ confirm-destructive-dialog.spec.ts
├─ app-shell/
│  ├─ users/
│  │  ├─ users.ts                                   # List page (filters + table + bulk actions)
│  │  ├─ users.html
│  │  ├─ users.css
│  │  ├─ users.spec.ts
│  │  ├─ user-detail.ts                             # /:id tabbed detail view
│  │  ├─ user-detail.html
│  │  ├─ user-detail.css
│  │  ├─ user-new.ts                                # /new stepper form (ReactiveForms)
│  │  ├─ user-new.html
│  │  ├─ user-new.css
│  │  └─ users.routes.ts
│  ├─ teams/
│  │  ├─ teams.ts
│  │  ├─ teams.html
│  │  ├─ teams.css
│  │  └─ teams.routes.ts
│  ├─ notifications/
│  │  ├─ notifications.ts
│  │  ├─ notifications.html
│  │  ├─ notifications.css
│  │  └─ notifications.routes.ts
│  └─ app-shell.routes.ts                           # + users, teams, notifications lazy loaders
├─ catalog/
│  └─ blocks/                                       # + 8 new per-category pages
│     ├─ tables.page.ts
│     ├─ stacked-lists.page.ts
│     ├─ grid-lists.page.ts
│     ├─ badges.page.ts
│     ├─ filterbar.page.ts
│     ├─ form-layouts.page.ts
│     ├─ account-user-management.page.ts
│     └─ file-upload.page.ts
└─ blocks/                                          # + 8 new vendor directories (installed by @ngm-dev/cli)
   ├─ free-tables/
   ├─ tables/
   ├─ free-stacked-lists/
   ├─ stacked-lists/
   ├─ free-grid-lists/
   ├─ grid-lists/
   ├─ free-badges/
   ├─ badges/
   ├─ filterbar/
   ├─ form-layouts/
   ├─ account-user-management/
   └─ file-upload/

src/assets/
├─ i18n/zh-TW.json                                  # + users.* / teams.* / notifications.* / common.* keys
├─ mock-data/
│  ├─ users.json                                    # ~50 Glacier Analytics team members
│  ├─ notifications.json                            # ~40 mixed system + billing + invite entries
│  └─ teams.json                                    # ~12 sub-teams with membership
└─ block-sources/                                   # + 93 new baked json files
```

---

## Key Design Decisions

### D1 — Keep vendor block composition pattern from M2

M3 feature components (users, user-detail, user-new, teams, notifications) **directly import** vendor component classes and compose them in templates. Required inputs come from mock data via demoInputs pattern. `<ng-content>` projection is handled inline. No catalog-only wrappers leak into feature components.

### D2 — ReactiveForms for `/app/users/new` stepper (Signal Forms deferred)

Spec §13 M3 mandates Signal Forms for the stepper, but spec §2 also says Signal Forms is "v21+". We run Angular 20.3.18. **Decision**: use ReactiveForms in M3 with a header comment:

```ts
// TODO(m5-signal-forms-migration): upgrade to Angular 21 + Signal Forms per
// spec §2 and §13 once the workspace migrates off v20.
```

`mock-users.ts` stays framework-agnostic so the migration only touches `user-new.ts`.

### D3 — MockUsersApi schema

```ts
export interface MockUser {
  id: string;
  email: string;
  displayName: string;
  role: 'owner' | 'admin' | 'analyst' | 'viewer';
  status: 'active' | 'invited' | 'suspended';
  avatar: string;        // initials or data URL
  lastLoginAt: string;   // ISO
  createdAt: string;     // ISO
  tags: readonly string[];
}
```

`list()` returns a paginated slice + total count. `filter()` accepts `{ search, status, role }` and returns a filtered list. `create()`, `update()`, `remove()`, `bulkRemove()` all return `AuthResult`-style results.

### D4 — ConfirmDestructiveDialog service

Wraps `MatDialog.open(...)` with one of the M1 `dialogs/dialog-*` variants pre-loaded (specifically `dialogs/dialog-2` which is the warning dialog). API:

```ts
confirm(options: {
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
}): Promise<boolean>;
```

Used by users list bulk delete, user detail delete, teams role change confirmation.

### D5 — Users list composition

`users.ts` composes:
1. Page heading (inline, not a vendor variant — needs real action buttons with routerLink)
2. `filterbar/filterbar-1` wrapped with real form controls (search text + status select + role select)
3. `tables/full-width-avatar-table` or `tables/simple-card-table` — whichever best fits avatars + role badges
4. Bulk action bar appearing when rows selected → "停用", "匯出"
5. Empty state (`empty-states/empty-state-1`) when filter yields no results

All hardcoded vendor demo data is replaced with `MockUsersApi.list()` values via computed signals.

### D6 — User detail composition

`user-detail.ts` uses:
- Route param → `resource()` from `MockUsersApi.getById()`
- Left 1/3: summary card (avatar + name + email + role + status + last login)
- Right 2/3: `mat-tab-group`:
  - `活動` — list of audit events (mocked)
  - `權限` — toggle list of permissions (read-only in M3)
  - `裝置` — list of devices (mocked)
- Header action: `刪除使用者` → `ConfirmDestructiveDialog` → `MockUsersApi.remove()` → navigate back to list

### D7 — User new stepper composition

`user-new.ts` uses `MatStepper` with 4 steps:
1. **基本資料** — form-layout-1 style fields (email, displayName, avatar picker from file-upload-1)
2. **角色** — radio group of role options with description cards
3. **通知偏好** — toggle group (email, in-app, digest frequency)
4. **確認** — summary card + `建立帳號` submit button

On submit → `MockUsersApi.create()` → navigate to `/app/users/:id`.

### D8 — Teams composition

`teams.ts` uses `stacked-lists/with-badges-button-action-menu` with mock team data. Each row:
- Avatar + name + email
- Role badge (green for owner, blue for admin, grey for viewer)
- Action menu (變更角色 / 移除) where "變更角色" opens Enhanced Dialog

### D9 — Notifications composition

`notifications.ts` uses `lists/feed-with-comments-01` (already installed in M2) as the base visual but wires to `MockNotificationsApi`:
- Filter chips: 全部 / 未讀 / 系統 / 帳單
- Infinite scroll via IntersectionObserver + `loadMore()`
- Click item → mark as read + navigate to source page (mocked as no-op for M3)

### D10 — Admin sidenav flip

Before M3: 1 live (dashboard), 5 soon.
After M3: 4 live (dashboard, users, teams, notifications), 3 soon (billing, reports, settings).

Update `NAV_ITEMS` in `admin-layout.ts` and the soon-item count test.

### D11 — Catalog page authoring template (unchanged from M2)

Every new catalog `.page.ts` follows the M1/M2 pattern:
- `VARIANTS` const array with `id / label / registryCategory / component / isFree / demoInputs?`
- `API` object with inputs / outputs / slots / cssProperties
- `BEST_PRACTICES` object with whenToUse / whenNotToUse / pitfalls / accessibility (zh-TW)
- `META` object with id / title / category / subcategory / summary / tags / status='shipped' / variants / api / bestPractices / relatedBlockIds
- The component class extends the standard `@Component` template from M1.

### D12 — Tables catalog — required input handling

Vendor `tables/*` variants typically consume a `data` input and a `columns` input. We supply `demoInputs` with a shared `TABLE_DEMO_DATA` constant so every variant renders consistently.

### D13 — Filterbar catalog — real form controls

Vendor `filterbar/*` variants demo form state internally. We wrap each in a thin `FilterbarDemo` component under `catalog/blocks/filterbar-demos/` that provides deterministic options arrays, so the Source tab shows useful demoInputs.

### D14 — Form-layouts catalog — static demo

`form-layouts/*` variants are self-contained form scaffolding. We consume them with empty demoInputs (the demo text in vendor source is sufficient) and record layout best-practices in zh-TW.

---

## Tasks

| # | Task | Files | Notes |
| --- | --- | --- | --- |
| **A** | Write this plan + commit | `docs/plans/2026-04-09-m3-users-forms-plan.md` | |
| **B** | Bulk install 93 variants (8 categories) | `src/app/blocks/**` | Batch per category; run bake:build; commit per category where practical |
| **C** | Update catalog-registry + catalog.routes lazy loadComponents | `catalog-registry.ts`, `catalog.routes.ts` | Flip 8 entries to 'shipped' and wire loadComponent paths |
| **D1–D8** | 8 per-category `.page.ts` files (+ demo wrappers) | `catalog/blocks/<cat>.page.ts` | Tables / filterbar may need `*-demos/` folders for demoInputs |
| **E1** | MockUsersApi + fixtures | `core/mock-api/mock-users.{ts,spec.ts}`, `assets/mock-data/users.json` | |
| **E2** | MockNotificationsApi + fixtures | `core/mock-api/mock-notifications.{ts,spec.ts}`, `assets/mock-data/notifications.json` | |
| **E3** | MockTeamsApi + fixtures | `core/mock-api/mock-teams.{ts,spec.ts}`, `assets/mock-data/teams.json` | |
| **E4** | ConfirmDestructiveDialog service | `core/dialogs/confirm-destructive-dialog.{ts,spec.ts}` | |
| **F1** | `/app/users` list | `app-shell/users/users.{ts,html,css,spec.ts}` | |
| **F2** | `/app/users/:id` detail | `app-shell/users/user-detail.{ts,html,css}` | |
| **F3** | `/app/users/new` stepper | `app-shell/users/user-new.{ts,html,css}` | |
| **F4** | `/app/teams` | `app-shell/teams/**` | |
| **F5** | `/app/notifications` | `app-shell/notifications/**` | |
| **F6** | Wire admin sidenav: flip users + notifications to live | `layouts/admin-layout/admin-layout.ts` | Keep billing/reports/settings soon |
| **G** | Expand zh-TW.json (users/teams/notifications/common) | `assets/i18n/zh-TW.json` | |
| **H** | Bulk variant screenshots (M2 tooling extended) verify 374 variants all render | `scripts/m3-bulk-variant-screenshots.mjs`, `docs/verification/m3-visual-check/` | |
| **I** | CHANGELOG + tag `m3-users-forms` + final commit | `docs/CHANGELOG.md` | |

---

## Definition of Done

- `npm run lint` green
- `npm run format:check` green
- `npm run build -- --configuration development` green
- `npm run bake:test` green
- `npm test -- --watch=false --browsers=ChromeHeadless` green (113 M2 baseline + ~30 new M3 tests)
- All 36 shipped catalog pages render their variant selector, source code, API, and best practices
- `/app/users` list renders with filter + table + bulk actions, filters work, navigation to detail works
- `/app/users/:id` renders summary card + 3 tabs
- `/app/users/new` stepper completes all 4 steps and creates a user
- `/app/teams` renders member list with role badges
- `/app/notifications` renders feed with filter chips
- Admin sidenav shows 4 live + 3 soon items; clicking users / teams / notifications navigates successfully
- Bulk variant screenshots (`node scripts/m3-bulk-variant-screenshots.mjs`) succeed for all 93 new M3 variants
- M3 entry appended to `docs/CHANGELOG.md`
- Annotated tag `m3-users-forms` on the final commit

---

## Risks & Mitigations

| # | Risk | Mitigation |
| --- | --- | --- |
| M3.R1 | Bulk install of 93 variants triggers rate limits or 401 paid block errors | Batch per category with exponential backoff between categories; resume on failure; treat partial failures as recoverable |
| M3.R2 | `tables/*` vendor variants have `input.required<TableData>()` causing NG0950 in the catalog preview | Apply M2's demoInputs pattern with a shared `TABLE_DEMO_DATA` constant; add per-variant wrappers in `catalog/blocks/tables-demos/` where content projection is needed |
| M3.R3 | `filterbar/*` variants maintain internal form state that cannot be driven from outside | Wrap in thin `FilterbarDemo` components that provide static options; document in Best Practices that consumers must fork the variant to bind real state |
| M3.R4 | MockUsersApi pagination + filter signals cause infinite effects in the users list view | Use `computed()` for the visible slice; keep filter inputs as signals but apply them synchronously in the list derivation |
| M3.R5 | ConfirmDestructiveDialog ships in catalog as a new component but the destructive flow needs to be demoable in the Dialogs catalog | Keep the service under `core/dialogs/` and add a demo button in the dialogs catalog that opens it — reuses the shipped M1 dialogs page without churn |
| M3.R6 | Signal Forms blocker — spec requires it but v20.3 does not support it | Use ReactiveForms with an explicit TODO comment tagged `m5-signal-forms-migration`; document the decision in `docs/CHANGELOG.md` M3 entry |
| M3.R7 | WSL `/mnt/c/` file watcher misses vendor block source changes after bulk install | Restart `ng serve` after each bulk install batch; already mitigated by M2 troubleshooting notes |
| M3.R8 | User detail page uses `resource()` which may not cleanly handle navigation-time re-triggering | Use `input()` + `toObservable()` or a simple `OnInit` + `paramMap` subscription; keep it pragmatic |
