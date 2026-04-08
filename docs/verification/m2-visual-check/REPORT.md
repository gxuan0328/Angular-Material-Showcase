# M2 Visual Check Report

**Date:** 2026-04-09
**Branch:** main
**Scope:** Landing · Dashboard · Auth · Admin layout · 28 catalog pages · M3 palette switcher

## Summary

| Layer | Status | Variants / Screens | Notes |
| --- | --- | --- | --- |
| Landing page | ✅ | 13 composed sections | Hero + stats + features + bento + pricing + testimonial + blog + cta + fancy + newsletter + contact |
| Admin layout | ✅ | Sidenav + topbar + user menu | Six nav items (1 live · 5 coming-soon) |
| Dashboard | ✅ | KPI row + 2 charts + 2 lists + onboarding | chart.js via ng2-charts, palette-aware |
| Auth flows | ✅ | 6 screens | sign-in / sign-up / forgot / reset / 2fa / check-email |
| Catalog pages (M1) | ✅ | 10 categories | carried over from M1 visual check |
| Catalog pages (M2) | ✅ | 18 categories · 196 variants | Bulk screenshot 196/196 OK |
| Palette switcher | ✅ | 12 M3 palettes · light + dark | Charts, buttons, active states track correctly |

## M2 Catalog Variant Bulk Screenshot

```
Total: 196  OK: 196  FAIL: 0  SHORT: 0
```

Manifest: `docs/verification/m2-visual-check/variants/_manifest.json`
Captured via `scripts/m2-bulk-variant-screenshots.mjs`

All 196 M2 variants rendered correctly in their preview zones. No variant returned a blank or malformed preview (all screenshots well above the small-height threshold).

### Categories captured

| Category | Variants | Observation |
| --- | --- | --- |
| authentication | 8 | All 8 login-form variants render with their vendor form state intact. |
| hero-sections | 9 | Pre-designed hero blocks render cleanly. |
| feature-sections | 20 | Feature grids and testimonial strips all render. |
| pricing-sections | 16 | 3-tier, single-plan, and feature-compare layouts render. |
| cta-sections | 16 | Full CTA blocks with call-to-action buttons render. |
| header-sections | 6 | Page-header / announcement blocks render. |
| stats-sections | 9 | Metric row and card layouts render. |
| bento-grids | 6 | Asymmetric grid layouts render with all inner cards. |
| testimonial-sections | 8 | Quote + avatar layouts render. |
| newsletter-sections | 6 | Subscription forms render with proper field layouts. |
| contact-sections | 10 | Multi-field contact forms render. |
| fancy | 2 | memory-album (absolute-positioned h1) and words-album render. |
| blog-sections | 10 | Article card grids render. |
| kpi-cards | 29 | Single-metric cards including sparkline / progress bar variants. |
| spark-area-charts | 6 | Stock-ticker style mini charts render. |
| area-charts | 15 | Single-series, multi-series, 100%-stacked variants render. |
| donut-charts | 7 | Basic donut, center-label, multi-ring variants render. |
| lists | 13 | Onboarding feeds, stacked lists, comment lists render. |

## Feature Screens

| Screen | Screenshot |
| --- | --- |
| Landing (top) | `pages/landing-top-v2.png` |
| Landing (full) | `pages/landing-full-v3.png` |
| Dashboard (light · azure) | `pages/dashboard-full-v2.png` |
| Dashboard (dark · rose) | `pages/dashboard-rose-dark.png` |
| Palette popover open | `pages/dashboard-palette-open.png` |
| Sign in | `pages/auth-sign-in.png` |
| Sign up | `pages/auth-sign-up.png` |
| Forgot password | `pages/auth-forgot.png` |
| Reset password | `pages/auth-reset.png` |
| Two factor | `pages/auth-tfa.png` |
| Check email | `pages/auth-check-email.png` |

## Fixes Applied During Verification

### 1. Landing page composition
- **Symptom**: `header-section-1` duplicated the hero concept and the `memory-album` block's absolute-positioned `h1` overflowed neighbouring sections.
- **Root cause**: vendor `header-section-1` is a page header, not a nav bar; `memory-album` has no intrinsic height.
- **Fix** (`src/app/landing/landing-page.ts`):
  - Removed `header-section-1` (LandingLayout already provides a nav bar).
  - Added a second hero (`hero-section-5`) as a mid-page visual break.
  - Wrapped `memory-album` in a `.landing-page__fancy-frame` container with an explicit 420px height and `overflow: hidden`, so its absolute positioning is bounded.

### 2. Charts did not update on palette swap
- **Symptom**: after selecting a new palette, the dashboard's area + donut charts kept the old colors.
- **Root cause**: `ChartPaletteService`'s internal `effect()` tracked only `theme.effectiveMode()`, so the signal never re-fired when the palette changed.
- **Fix** (`src/app/core/charts/chart-palette.ts`): add `this.theme.palette()` as an additional dependency inside the effect, and defer the CSS variable re-read one microtask so the new attribute is applied before `getComputedStyle()` runs.

### 3. Catalog registry tests out of sync with M2 flips
- **Symptom**: `catalog-registry` and `catalog-nav` specs hardcoded the M1 shipped / coming-soon counts and failed after M2 flipped 18 categories to `shipped`.
- **Fix**: updated both specs to assert 28 shipped / 15 coming-soon.

## Build / Test / Lint

```
npm run lint            ✅ All files pass linting.
npm run format:check    ✅ All matched files use Prettier code style!
ng build --configuration development   ✅ Bundle generation complete.
ng test --watch=false --browsers=ChromeHeadless   ✅ 113 / 113 SUCCESS
```

## Known Warnings (non-blocking)

- `NG0956 "track by identity"` fires on one vendor area-chart variant. This is emitted by a vendor block's internal `@for` loop and cannot be fixed without forking the vendor source. It does not affect rendering.

## Palette Switcher End-to-End

Verified via interactive palette picker on `/app/dashboard`:

1. Click palette trigger → overlay grid of 12 M3 swatches opens.
2. Click `rose` swatch → `data-palette="rose"` written to `<html>`, localStorage persisted.
3. Material tokens regenerate from `src/styles/themes.scss` (via mat.theme SCSS loop).
4. `ChartPaletteService` effect fires → re-reads `--mat-sys-*` tokens → chart config signals update → ng2-charts redraws with rose primary.
5. Theme toggle → `dark` → `.dark` class added → second theme block wins via specificity → dark rose tokens apply.

Screenshots confirm: sidenav active item tint, progress bar, KPI deltas, buttons, chart line color, and donut segments all reflect the active palette in both light and dark modes.
