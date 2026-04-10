import { chromium } from 'playwright';

async function main(): Promise<void> {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage();
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto('http://localhost:4200/guide', { waitUntil: 'networkidle', timeout: 15000 });
  await p.waitForTimeout(2000);
  console.log('URL:', p.url());
  console.log('Title:', await p.title());
  const h1 = await p.locator('h1').first().textContent().catch(() => 'none');
  console.log('H1:', h1);
  const nav = await p.locator('.guide-nav').count();
  console.log('GuideNav found:', nav > 0);
  await p.screenshot({ path: 'docs/verification/guide-module/guide-check.png' });

  // Check chapter page
  await p.goto('http://localhost:4200/guide/components', { waitUntil: 'networkidle', timeout: 15000 });
  await p.waitForTimeout(2000);
  const chTitle = await p.locator('.guide-page__title').first().textContent().catch(() => 'none');
  console.log('Ch01 title:', chTitle);
  await p.screenshot({ path: 'docs/verification/guide-module/guide-ch01-check.png' });

  await b.close();
}
main();
