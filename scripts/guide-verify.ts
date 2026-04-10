import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE = 'http://localhost:4200';
const DIR = path.resolve(__dirname, '../docs/verification/guide-module');

const ROUTES = [
  { path: '/guide', label: 'Guide Index' },
  { path: '/guide/components', label: 'Ch01 Components' },
  { path: '/guide/dependency-injection', label: 'Ch02 DI' },
  { path: '/guide/routing', label: 'Ch03 Routing' },
  { path: '/guide/state-management', label: 'Ch04 State' },
  { path: '/guide/http-client', label: 'Ch05 HTTP' },
  { path: '/guide/forms', label: 'Ch06 Forms' },
  { path: '/guide/testing', label: 'Ch07 Testing' },
  { path: '/guide/performance', label: 'Ch08 Performance' },
];

async function main(): Promise<void> {
  fs.mkdirSync(DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let pass = 0;
  let fail = 0;

  for (const vp of [{ name: 'desktop', w: 1440, h: 900 }, { name: 'mobile', w: 375, h: 812 }]) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    for (const route of ROUTES) {
      try {
        await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(600);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
        const font = await page.evaluate(() => window.getComputedStyle(document.body).fontFamily);
        await page.screenshot({ path: path.join(DIR, `${vp.name}-${route.label.toLowerCase().replace(/\s+/g, '-')}.png`) });
        if (overflow) { console.log(`  ❌ [${vp.name}] ${route.label} — overflow`); fail++; }
        else if (!font.toLowerCase().includes('nunito')) { console.log(`  ❌ [${vp.name}] ${route.label} — font`); fail++; }
        else { console.log(`  ✅ [${vp.name}] ${route.label}`); pass++; }
      } catch (e: unknown) { console.log(`  ❌ [${vp.name}] ${route.label} — ${e instanceof Error ? e.message.substring(0, 50) : e}`); fail++; }
    }
  }

  // Switcher has Guide
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/catalog`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(300);
  const fab = page.locator('.switcher__fab');
  if ((await fab.count()) > 0) {
    await fab.click();
    await page.waitForTimeout(300);
    const guideItem = page.locator('.switcher__item', { hasText: 'Guide' });
    if ((await guideItem.count()) > 0) { console.log('  ✅ Switcher has Guide'); pass++; }
    else { console.log('  ❌ Switcher missing Guide'); fail++; }
  }

  await browser.close();
  console.log(`\n  TOTAL: ${pass + fail} | PASS: ${pass} | FAIL: ${fail}`);
  process.exit(fail > 0 ? 1 : 0);
}
main();
