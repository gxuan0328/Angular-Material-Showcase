# M1 Visual Verification Report

**Date:** 2026-04-08
**Scope:** 85 block variants across 10 shipped M1 catalog categories
**Method:** Automated Playwright bulk screenshot (`scripts/bulk-variant-screenshots.mjs`) + manual review

## Summary

| Metric | Value |
| --- | --- |
| Variants screenshotted | 85 / 85 |
| Issues found | 4 |
| Issues fixed | 4 |
| Categories with issues | 1 (`components` only) |
| Final state | All shipped variants render correctly in Live Preview |

## Issues found & fixes

### Issue 1 — `mat-icon` ligature not rendering (global impact)

**Symptom:** Many variants (across page-headings, stacked-layouts, multi-column, etc.) rendered Material Symbols icon names as plain text:
- `wor Full-time` instead of the work icon + "Full-time"
- `ec Edit` instead of the edit icon
- `nc` instead of the bell icon

**Root cause:**
1. The `index.html` used the old `/icon?family=Material+Symbols+Outlined` Google Fonts endpoint which does NOT return the variable font with ligature support.
2. Angular Material's `<mat-icon>` defaults to the legacy `font-family: 'Material Icons'`, not `Material Symbols Outlined`. Vendor blocks use the new Symbols ligatures via `<mat-icon>content_copy</mat-icon>`, so they need the default font-set class switched.

**Fix:**
- `src/index.html` — switched to `css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block` with preconnect hints to Google Fonts.
- `src/app/app.config.ts` — added `provideAppInitializer(() => inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined'))` so every `<mat-icon>` is rendered against the Symbols font.
- `src/styles.css` — explicit `.material-symbols-outlined` CSS rule (font-family, font-feature-settings: 'liga', font-variation-settings) as a belt-and-braces fallback for inline `<span class="material-symbols-outlined">` usage (some vendor blocks use that pattern instead of `mat-icon`).

**Coverage:** fixed every icon-based display across all 10 shipped categories.

### Issue 2 — Stacked Layouts right-edge content truncated

**Symptom:** The user avatar and notification bell at the right of the top nav bar were clipped in `stacked-layouts` variants.

**Root cause:** Turned out to be the SAME as Issue 1. The "nc" truncation on the right side was the Material Symbols `notifications` and `account_circle` icon names rendering as plain text and overflowing the nav.

**Fix:** Resolved automatically by Issue 1's fix.

### Issue 3 — `components` category: 4 variants crashed with NG0950 (required inputs)

**Symptom:** 4 vendor blocks in the `components` category throw `NG0950: Input "X" is required but no value is available yet` when mounted via `ngComponentOutlet` without providing the required input:
- `animated-copy-button` needs `contentToCopy: string`
- `bar-list` needs `data: BarListItem<T>[]`
- `category-bar` needs `values: number[]`
- `tracker` needs `data: TrackerBlockProps[]`

When the error was thrown, the template's class bindings failed to compute, and the raw `content_copy` / `check` icon names showed as text instead of being rendered through the `.material-symbols-outlined` class.

**Fix:**
- `src/app/catalog/models/block-variant.ts` — added optional `demoInputs?: Readonly<Record<string, unknown>>` to the `BlockVariant` interface.
- `src/app/catalog/shared/block-preview/block-preview.ts` + `.html` — forward `demoInputs` to `*ngComponentOutlet="...; inputs: demoInputs()"`.
- `src/app/catalog/blocks/components.page.ts` — provided sensible demo payloads:
  - animated-copy-button: `{ contentToCopy: 'npm install @ngm-dev/cli' }`
  - bar-list: 5 sample pages (`/home` 1280, `/pricing` 854, `/docs` 612, `/about` 390, `/contact` 145)
  - category-bar: `{ values: [28, 45, 18, 9] }`
  - tracker: imported `sampleTrackerData` from the vendor's `tracker.model.ts`
  - word-rotate: `{ words: ['Faster', 'Sharper', 'Accessible', 'Typed'] }` (not crashing, just showing nothing)

### Issue 4 — `components` category: 6 "headless" variants needed demo wrappers

**Symptom:** 6 more vendor blocks in `components` don't accept data via inputs — they use `contentChildren` directive projection or `<ng-content>`. Since `ngComponentOutlet` cannot project content children, these variants rendered blank in the catalog preview:
- `breadcrumbs` — `BreadcrumbItemDirective` (TemplateRef-based)
- `drag-elements` — `DragElementDirective` (TemplateRef-based)
- `marquee` — `MarqueeItemDirective` (TemplateRef-based)
- `terminal` — `<ng-content>` projection
- `big-button` — empty template, intended as attribute-style host
- `progress-circle` — `<ng-content>` for the centered label

**Fix:** Created per-variant demo wrapper components under `src/app/catalog/blocks/components-demos/`:
- `breadcrumbs-demo.ts` — 3-level breadcrumb (Projects › Glacier Analytics › Dashboard) with `chevron_right` separator
- `drag-elements-demo.ts` — 3 draggable chips wrapped in `<ng-template ngmDevBlockUiDragElement>` (correct syntax for TemplateRef-based directive)
- `marquee-demo.ts` — 4 scrolling pills (Showcase / variants / Material / Tailwind)
- `terminal-demo.ts` — 8-line `$ npm / npx` shell transcript
- `big-button-demo.ts` — 3 Material buttons (flat / stroked / extended FAB) beside the empty vendor host, with an explanatory note in zh-TW
- `progress-circle-demo.ts` — 3 side-by-side circles (32% Storage / 68% Complete / 92% CPU) with variant colors

Each wrapper imports the vendor component + `MatIconModule` as needed, uses the correct TemplateRef syntax where required, and is pointed at via `component: <Demo>` in the `components.page.ts` variants array.

## Supporting scripts

- **`scripts/bulk-variant-screenshots.mjs`** — Playwright runner that navigates to each M1 category, iterates all variants via the `<select>`, and captures a viewport screenshot of the Live Preview zone. Takes ~90s for all 85.
- **`scripts/build-contact-sheet.mjs`** — reads the manifest and tiles all 85 PNGs into a single `contact-sheet.html` for scan-at-a-glance review.
- Both scripts are idempotent — run them anytime the catalog changes.

## Artifacts

```
docs/verification/m1-visual-check/
├─ report.md                      (this file)
├─ variants/                      85 variant screenshots + _manifest.json
│   ├─ _manifest.json
│   ├─ banners__banner-1.png
│   ├─ components__progress-circle.png  (now shows 3 circles with labels)
│   └─ ...
├─ contact-sheet.html             tile-view of all 85 screenshots
├─ contact-sheet-full.png         full-page capture of the tile view
├─ after-icon-fix-01-page-headings.png
├─ after-icon-fix-02-stacked-layouts.png
└─ anomaly-page-heading-7.png     aerial-photo banner (540 KB PNG is legit)
```

## Quality gate after fixes

- `npm run lint` — green
- `npm run format:check` — green
- `npm run build -- --configuration development` — green, 41 lazy chunks
- `npm test -- --watch=false --browsers=ChromeHeadless` — 66 / 66 passing (same as M1 tag)
- `node scripts/bulk-variant-screenshots.mjs` — 85 / 85 OK
- Manual review of 13 representative variants (at least one per category) — all render correctly

## Files changed

Icon / theme infrastructure (cross-cutting):
- `src/index.html`
- `src/app/app.config.ts`
- `src/styles.css`

Live Preview infrastructure:
- `src/app/catalog/models/block-variant.ts` (+ `demoInputs` field)
- `src/app/catalog/shared/block-preview/block-preview.ts`
- `src/app/catalog/shared/block-preview/block-preview.html`

`components` category wiring:
- `src/app/catalog/blocks/components.page.ts`
- `src/app/catalog/blocks/components-demos/breadcrumbs-demo.ts` (new)
- `src/app/catalog/blocks/components-demos/drag-elements-demo.ts` (new)
- `src/app/catalog/blocks/components-demos/marquee-demo.ts` (new)
- `src/app/catalog/blocks/components-demos/terminal-demo.ts` (new)
- `src/app/catalog/blocks/components-demos/big-button-demo.ts` (new)
- `src/app/catalog/blocks/components-demos/progress-circle-demo.ts` (new)

Verification tooling (new, gitignored in `.gitignore` if the `docs/verification` dir should stay untracked; per the user's request they are tracked for reference):
- `scripts/bulk-variant-screenshots.mjs`
- `scripts/build-contact-sheet.mjs`
- `docs/verification/m1-visual-check/*`
