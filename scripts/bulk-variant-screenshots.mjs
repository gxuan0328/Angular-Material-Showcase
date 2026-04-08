/**
 * Bulk variant screenshot runner.
 *
 * Iterates every M1-shipped catalog category, switches through every
 * variant of that category via the <select> element, and captures a
 * viewport screenshot to docs/verification/m1-visual-check/variants/
 *
 * Pre-req: dev server running on http://localhost:4200
 * Run: npx tsx scripts/bulk-variant-screenshots.mjs
 *    or: node scripts/bulk-variant-screenshots.mjs (ESM)
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../docs/verification/m1-visual-check/variants');
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4200';

/**
 * M1-shipped categories with their variant ids (from each *.page.ts file).
 * Synchronised with src/app/catalog/blocks/*.page.ts — if those change,
 * update this list.
 */
const CATEGORIES = [
  {
    id: 'page-shells',
    variants: ['page-shell-1', 'page-shell-2', 'page-shell-3', 'page-shell-4', 'page-shell-5', 'page-shell-6'],
  },
  {
    id: 'stacked-layouts',
    variants: [
      'nav-with-page-header',
      'brand-nav-with-overlap',
      'brand-nav-with-page-header',
      'branded-nav-compact-header',
      'nav-compact-header',
      'nav-on-gray-background',
      'nav-with-bottom-border',
      'nav-with-overlap',
      'two-row-nav-overlap',
    ],
  },
  {
    id: 'multi-column',
    variants: [
      'full-width-three-column',
      'constrained-three-column',
      'constrained-with-sticky-columns',
      'full-width-secondary-right',
      'full-width-with-narrow-sidebar',
      'full-width-with-narrow-sidebar-header',
    ],
  },
  {
    id: 'page-headings',
    variants: [
      'page-heading-1',
      'page-heading-2',
      'page-heading-3',
      'page-heading-4',
      'page-heading-5',
      'page-heading-6',
      'page-heading-7',
      'page-heading-8',
      'page-heading-9',
      'page-heading-10',
      'page-heading-11',
      'page-heading-12',
      'page-heading-13',
    ],
  },
  {
    id: 'section-headings',
    variants: [
      'section-heading-1',
      'section-heading-2',
      'section-heading-3',
      'section-heading-4',
      'section-heading-5',
      'section-heading-6',
      'section-heading-7',
      'section-heading-8',
      'section-heading-9',
      'section-heading-10',
    ],
  },
  {
    id: 'components',
    variants: [
      'animated-copy-button',
      'bar-list',
      'big-button',
      'breadcrumbs',
      'category-bar',
      'drag-elements',
      'marquee',
      'progress-circle',
      'terminal',
      'tracker',
      'word-rotate',
    ],
  },
  {
    id: 'flyout-menus',
    variants: [
      'simple-flyout-menu',
      'flyout-menu-with-icons',
      'flyout-with-avatars',
      'flyout-with-cards',
      'flyout-with-preview',
      'flyout-with-stats',
      'flyout-with-tabs',
      'multi-column-flyout',
      'wide-flyout-menu',
    ],
  },
  {
    id: 'dialogs',
    variants: ['dialog-1', 'dialog-2', 'dialog-3', 'dialog-4', 'dialog-5', 'dialog-6'],
  },
  {
    id: 'empty-states',
    variants: [
      'empty-state-1',
      'empty-state-2',
      'empty-state-3',
      'empty-state-4',
      'empty-state-5',
      'empty-state-6',
      'empty-state-7',
      'empty-state-8',
      'empty-state-9',
      'empty-state-10',
    ],
  },
  {
    id: 'banners',
    variants: ['banner-1', 'banner-2', 'banner-3', 'banner-4', 'banner-5'],
  },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    executablePath: '/home/gxuan/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome',
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const results = [];
  let totalVariants = 0;
  for (const cat of CATEGORIES) totalVariants += cat.variants.length;

  let i = 0;
  for (const cat of CATEGORIES) {
    const url = `${BASE_URL}/catalog/${cat.id}`;
    console.log(`\n[${cat.id}] navigating -> ${url}`);
    const navStart = Date.now();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
    await page.waitForSelector('.variant-selector__select', { timeout: 10_000 });

    // Scroll the live-preview zone into view
    const previewHandle = await page.$('.catalog-page__zone');
    if (previewHandle) {
      await previewHandle.scrollIntoViewIfNeeded();
    }

    for (const variantId of cat.variants) {
      i++;
      const label = `[${i}/${totalVariants}] ${cat.id}/${variantId}`;

      // Change variant via the <select>
      try {
        await page.selectOption('.variant-selector__select', variantId);
      } catch (err) {
        console.error(`${label}  FAILED to select: ${String(err).split('\n')[0]}`);
        results.push({ category: cat.id, variant: variantId, status: 'select-failed' });
        continue;
      }

      // Give Angular a beat to swap the ngComponentOutlet
      await page.waitForTimeout(300);

      // Screenshot the preview zone (first .catalog-page__zone)
      const zone = await page.$('.catalog-page__zone');
      if (!zone) {
        console.error(`${label}  FAILED: preview zone not found`);
        results.push({ category: cat.id, variant: variantId, status: 'zone-missing' });
        continue;
      }

      const outFile = path.join(OUT_DIR, `${cat.id}__${variantId}.png`);
      await zone.screenshot({ path: outFile });
      const size = (await import('node:fs')).statSync(outFile).size;
      console.log(`${label}  ✓ ${Math.round(size / 1024)} KB`);
      results.push({
        category: cat.id,
        variant: variantId,
        status: 'ok',
        file: path.relative(process.cwd(), outFile),
        bytes: size,
      });
    }

    console.log(`[${cat.id}] done in ${Date.now() - navStart}ms`);
  }

  await browser.close();

  // Write a manifest of what got captured
  const manifest = {
    capturedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    total: results.length,
    ok: results.filter(r => r.status === 'ok').length,
    failed: results.filter(r => r.status !== 'ok').length,
    results,
  };
  const manifestPath = path.join(OUT_DIR, '_manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\nSaved manifest: ${path.relative(process.cwd(), manifestPath)}`);
  console.log(`Total: ${manifest.total}  OK: ${manifest.ok}  FAIL: ${manifest.failed}`);

  if (manifest.failed > 0) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
