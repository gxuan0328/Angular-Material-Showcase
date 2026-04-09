/**
 * M3 bulk variant screenshot runner.
 *
 * Iterates every M3 catalog category, auto-detects its variant list from the
 * selector options, switches through every variant, and captures a viewport
 * screenshot of the preview zone only to
 * docs/verification/m3-visual-check/variants/
 *
 * Pre-req: dev server running on http://localhost:4200 (or BASE_URL env var)
 * Run: node scripts/m3-bulk-variant-screenshots.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../docs/verification/m3-visual-check/variants');
const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4200';

const CATEGORIES = [
  'tables',
  'stacked-lists',
  'grid-lists',
  'badges',
  'filterbar',
  'form-layouts',
  'account-user-management',
  'file-upload',
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
  const errors = [];
  page.on('pageerror', err => {
    errors.push({ kind: 'pageerror', message: String(err) });
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({ kind: 'console.error', message: msg.text() });
    }
  });

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

      const outFile = path.join(OUT_DIR, `${cat}__${variantId}.png`);
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

  await browser.close();

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
