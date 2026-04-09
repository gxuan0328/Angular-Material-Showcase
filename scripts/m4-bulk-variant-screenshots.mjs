/**
 * M4 bulk variant screenshot runner.
 *
 * Iterates the 7 M4 catalog categories, auto-detects variant lists from
 * selector options, switches through every variant, and captures a viewport
 * screenshot of the preview zone to
 * docs/verification/m4-visual-check/variants/
 *
 * Also screenshots 10 Live Showcase pages under
 * docs/verification/m4-visual-check/pages/
 *
 * Pre-req: dev server running on http://localhost:4200 (or BASE_URL env var)
 * Run: node scripts/m4-bulk-variant-screenshots.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VARIANT_DIR = path.resolve(__dirname, '../docs/verification/m4-visual-check/variants');
const PAGES_DIR = path.resolve(__dirname, '../docs/verification/m4-visual-check/pages');
const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4200';

const CATEGORIES = [
  'bar-charts',
  'line-charts',
  'chart-compositions',
  'chart-tooltips',
  'bar-lists',
  'billing-usage',
  'status-monitoring',
];

const SHOWCASE_PAGES = [
  { name: 'billing-overview', path: '/app/billing/overview' },
  { name: 'billing-invoices', path: '/app/billing/invoices' },
  { name: 'billing-usage', path: '/app/billing/usage' },
  { name: 'billing-plans', path: '/app/billing/plans' },
  { name: 'reports', path: '/app/reports' },
  { name: 'settings-profile', path: '/app/settings/profile' },
  { name: 'settings-security', path: '/app/settings/security' },
  { name: 'settings-api-keys', path: '/app/settings/api-keys' },
  { name: 'settings-integrations', path: '/app/settings/integrations' },
  { name: 'settings-preferences', path: '/app/settings/preferences' },
];

async function main() {
  await mkdir(VARIANT_DIR, { recursive: true });
  await mkdir(PAGES_DIR, { recursive: true });

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
  const errors = [];
  page.on('pageerror', err => {
    errors.push({ kind: 'pageerror', message: String(err) });
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({ kind: 'console.error', message: msg.text() });
    }
  });

  // --- Catalog variant screenshots ---
  for (const cat of CATEGORIES) {
    const url = `${BASE_URL}/catalog/${cat}`;
    console.log(`\n[${cat}] navigating -> ${url}`);
    errors.length = 0;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
    } catch (err) {
      console.error(`[${cat}] navigate failed: ${String(err).split('\n')[0]}`);
      results.push({ category: cat, variant: '(nav)', status: 'nav-failed' });
      continue;
    }
    try {
      await page.waitForSelector('.variant-selector__select', { timeout: 10_000 });
    } catch {
      console.error(`[${cat}] variant selector missing`);
      results.push({ category: cat, variant: '(selector)', status: 'selector-missing' });
      continue;
    }

    const variants = await page.$$eval('.variant-selector__select option', opts =>
      opts.map(o => o.value),
    );
    console.log(`[${cat}] ${variants.length} variants`);

    for (const variantId of variants) {
      const label = `[${cat}] ${variantId}`;
      try {
        await page.selectOption('.variant-selector__select', variantId);
      } catch (err) {
        console.error(`${label}  FAILED to select: ${String(err).split('\n')[0]}`);
        results.push({ category: cat, variant: variantId, status: 'select-failed' });
        continue;
      }
      await page.waitForTimeout(300);

      const zone = await page.$('.catalog-page__zone');
      if (!zone) {
        console.error(`${label}  FAILED: preview zone not found`);
        results.push({ category: cat, variant: variantId, status: 'zone-missing' });
        continue;
      }

      const outFile = path.join(VARIANT_DIR, `${cat}__${variantId}.png`);
      try {
        await zone.screenshot({ path: outFile });
      } catch (err) {
        console.error(`${label}  FAILED screenshot: ${String(err).split('\n')[0]}`);
        results.push({ category: cat, variant: variantId, status: 'screenshot-failed' });
        continue;
      }

      const box = await zone.boundingBox();
      const size = (await import('node:fs')).statSync(outFile).size;
      const status = errors.length > 0 ? 'error-console' : 'ok';
      console.log(`${label}  ${status === 'ok' ? '✓' : '✗'} ${Math.round(size / 1024)} KB`);
      results.push({
        category: cat,
        variant: variantId,
        status,
        file: path.relative(process.cwd(), outFile),
        bytes: size,
        height: box?.height ?? null,
        consoleErrors: errors.length > 0 ? [...errors] : [],
      });
      errors.length = 0;
    }
  }

  // --- Live Showcase page screenshots ---
  console.log('\n=== Live Showcase Pages ===');
  const pageResults = [];
  for (const sp of SHOWCASE_PAGES) {
    const url = `${BASE_URL}${sp.path}`;
    console.log(`[page] ${sp.name} -> ${url}`);
    errors.length = 0;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
      await page.waitForTimeout(500);
    } catch (err) {
      console.error(`[page] ${sp.name} navigate failed: ${String(err).split('\n')[0]}`);
      pageResults.push({ name: sp.name, path: sp.path, status: 'nav-failed' });
      continue;
    }
    const outFile = path.join(PAGES_DIR, `${sp.name}.png`);
    try {
      await page.screenshot({ path: outFile, fullPage: true });
    } catch (err) {
      console.error(`[page] ${sp.name} screenshot failed: ${String(err).split('\n')[0]}`);
      pageResults.push({ name: sp.name, path: sp.path, status: 'screenshot-failed' });
      continue;
    }
    const size = (await import('node:fs')).statSync(outFile).size;
    const status = errors.length > 0 ? 'error-console' : 'ok';
    console.log(`[page] ${sp.name}  ${status === 'ok' ? '✓' : '✗'} ${Math.round(size / 1024)} KB`);
    pageResults.push({
      name: sp.name,
      path: sp.path,
      status,
      file: path.relative(process.cwd(), outFile),
      bytes: size,
      consoleErrors: errors.length > 0 ? [...errors] : [],
    });
    errors.length = 0;
  }

  await browser.close();

  const manifest = {
    capturedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    variants: {
      total: results.length,
      ok: results.filter(r => r.status === 'ok').length,
      failed: results.filter(r => r.status !== 'ok').length,
      results,
    },
    pages: {
      total: pageResults.length,
      ok: pageResults.filter(r => r.status === 'ok').length,
      failed: pageResults.filter(r => r.status !== 'ok').length,
      results: pageResults,
    },
  };
  const manifestPath = path.join(VARIANT_DIR, '_manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\nSaved manifest: ${path.relative(process.cwd(), manifestPath)}`);
  console.log(`Variants: ${manifest.variants.total}  OK: ${manifest.variants.ok}  FAIL: ${manifest.variants.failed}`);
  console.log(`Pages: ${manifest.pages.total}  OK: ${manifest.pages.ok}  FAIL: ${manifest.pages.failed}`);

  if (manifest.variants.failed > 0 || manifest.pages.failed > 0) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
