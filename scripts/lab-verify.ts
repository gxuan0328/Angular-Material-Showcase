import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE = 'http://localhost:4200';
const DIR = path.resolve(__dirname, '../docs/verification/lab-integration');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
];

const ROUTES = [
  { path: '/lab/dashboard', label: 'Lab Dashboard' },
  { path: '/lab/tasks', label: 'Lab Tasks' },
  { path: '/lab/projects', label: 'Lab Projects' },
  { path: '/lab/settings', label: 'Lab Settings' },
];

async function main(): Promise<void> {
  fs.mkdirSync(DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let pass = 0;
  let fail = 0;

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const route of ROUTES) {
      const testName = `[${vp.name}] ${route.label}`;
      try {
        await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(800);

        // Check overflow
        const dims = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        const overflow = dims.scrollWidth > dims.clientWidth + 2;

        // Check font
        const font = await page.evaluate(() => window.getComputedStyle(document.body).fontFamily);
        const hasNunito = font.toLowerCase().includes('nunito');

        // Screenshot
        const filename = `${vp.name}-${route.label.toLowerCase().replace(/\s+/g, '-')}.png`;
        await page.screenshot({ path: path.join(DIR, filename) });

        if (overflow) {
          console.log(`  ❌ ${testName} — overflow (${dims.scrollWidth}>${dims.clientWidth})`);
          fail++;
        } else if (!hasNunito) {
          console.log(`  ❌ ${testName} — font missing Nunito`);
          fail++;
        } else {
          console.log(`  ✅ ${testName} — OK`);
          pass++;
        }
      } catch (e: unknown) {
        console.log(`  ❌ ${testName} — ${e instanceof Error ? e.message.substring(0, 60) : e}`);
        fail++;
      }
    }
  }

  // Also verify showcase switcher has Lab entry
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/catalog`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(500);

    const fab = page.locator('.switcher__fab');
    if ((await fab.count()) > 0) {
      await fab.click();
      await page.waitForTimeout(300);
      const labItem = page.locator('.switcher__item', { hasText: 'Lab' });
      if ((await labItem.count()) > 0) {
        console.log(`  ✅ Showcase Switcher has Lab entry`);
        pass++;
      } else {
        console.log(`  ❌ Showcase Switcher missing Lab entry`);
        fail++;
      }
    }
    await page.screenshot({ path: path.join(DIR, 'switcher-lab.png') });
  } catch (e: unknown) {
    console.log(`  ❌ Switcher test — ${e instanceof Error ? e.message.substring(0, 60) : e}`);
    fail++;
  }

  await browser.close();

  console.log(`\n========================================`);
  console.log(`  TOTAL: ${pass + fail} | PASS: ${pass} | FAIL: ${fail}`);
  console.log(`  Screenshots: ${DIR}`);
  console.log(`========================================`);

  process.exit(fail > 0 ? 1 : 0);
}

main();
