# M3 Visual Check Report

**Date:** 2026-04-09
**Branch:** main
**Scope:** Users list / detail / new · Teams · Notifications · 8 catalog pages · Admin sidenav flip

## Summary

| Layer | Status | Variants / Screens | Notes |
| --- | --- | --- | --- |
| Catalog pages (M3) | ✅ | 8 categories · 93 variants | Bulk screenshot 93/93 OK after fixes |
| /app/users list | ✅ | Filter + table + bulk actions + empty state | 35-user fixture |
| /app/users/:id | ✅ | Multi-column layout + 3 tabs | Activity · 權限 · 裝置 |
| /app/users/new | ✅ | 4-step MatStepper | ReactiveForms (Signal Forms deferred to M5) |
| /app/teams | ✅ | 6 team cards with lead + members | Cross-links to user detail |
| /app/notifications | ✅ | Feed + filter chips + mark-as-read | Fixed initial layout overlap |
| Admin sidenav | ✅ | 7 nav items (4 live / 3 M4 soon) | |

## M3 Catalog Variant Bulk Screenshot

```
First run:  93 total · 86 OK · 7 FAIL (console errors)
After fix:  93 total · 93 OK · 0 FAIL
```

Manifest: `docs/verification/m3-visual-check/variants/_manifest.json`
Captured via `scripts/m3-bulk-variant-screenshots.mjs`

### Fixes applied during M3 visual verification

1. **Datepicker missing provider** (`filterbar/filterbar-11`)
   - Error: `MatDatepicker: No provider found for DateAdapter`
   - Fix: added `provideNativeDateAdapter()` to `app.config.ts`
2. **Wrong component class for file-upload 2-7** (all `*DropzoneComponent` variants)
   - Error: ```The `ngx-dropzone` component requires a child of `<input type="file" fileInput />` ```
   - Root cause: vendor ships TWO components per file (inner `FileUpload{N}DropzoneComponent` + outer `FileUpload{N}Component` that projects `<input fileInput>`). The catalog page was importing the inner class, which is not a standalone renderable unit.
   - Fix: swap imports to the outer `FileUpload{N}Component` for variants 2–7.
3. **Notifications page layout overlap**
   - Symptom: item title, message, and meta text were stacked on top of each other due to Material List's strict slot layout (`matListItemTitle`/`matListItemLine`).
   - Fix: dropped `<mat-list>` / `<mat-list-item>` in favour of a native `<ul>`/`<button>` pair with custom CSS grid. Each row is now a button for keyboard accessibility (`focus-visible` outline, `:focus` trap), satisfying `@angular-eslint/template/click-events-have-key-events` and `interactive-supports-focus`.

### Categories captured

| Category | Variants | Observation |
| --- | --- | --- |
| tables | 18 | Full width, grouped rows, sticky header, table-with-chart, etc. All with internal demo data. |
| stacked-lists | 13 | Narrow / full-width / with badges / with avatar groups. |
| grid-lists | 15 | Image, cards, avatar, file manager, media library layouts. |
| badges | 12 | Dot, icon, counter, gradient, soft-color variants. |
| filterbar | 12 | Search, date-range, chip-based, drawer, saved filters. Datepicker now wired via provideNativeDateAdapter. |
| form-layouts | 6 | Single-column, sectioned, two-column, card, side-description, stepper-aware. |
| account-user-management | 10 | Profile, password, 2FA, devices, invitations, roles, notifications, API tokens, data export, org settings. |
| file-upload | 7 | Basic button + 6 dropzone variants. Now using the correct outer component class. |

## Live Showcase Screens

| Screen | Screenshot |
| --- | --- |
| Users list (35 users, filter, stats) | `pages/users-list.png` |
| User detail (Alice, 4-tab overview) | `pages/user-detail.png` |
| User new (4-step stepper) | `pages/user-new.png` |
| Teams (6 cards, lead callouts) | `pages/teams.png` |
| Notifications (initial — broken overlap) | `pages/notifications.png` |
| Notifications (fixed layout) | `pages/notifications-fixed.png` |

## Build / Test / Lint

```
npm run lint            ✅ All files pass linting.
npm run format:check    ✅ All matched files use Prettier code style.
ng build --configuration development   ✅ Bundle generation complete.
ng test --watch=false --browsers=ChromeHeadless   ✅ 131 / 131 SUCCESS
```

## Known Follow-ups

- **Production build not yet verified for M3** (same as M2 — open tech debt item). `ng build --configuration production` has never been run; `anyComponentStyle` 4kB budget may flag the new users/teams/notifications CSS files.
- **Signal Forms migration** — `/app/users/new` uses ReactiveForms with a `m5-signal-forms-migration` TODO. Blocked on Angular 21 upgrade.
- **Tables catalog preview zone width** — some full-width tables overflow the preview container. Vendor uses internal min-widths; to be revisited in a tables polish pass.
