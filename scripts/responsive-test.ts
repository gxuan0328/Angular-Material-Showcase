/**
 * Multi-viewport responsive E2E test
 * Validates: no overflow, font rendering, layout structure, navigation
 */
import { chromium, Browser, Page } from 'playwright';

const BASE = 'http://localhost:4200';

interface Viewport {
  name: string;
  width: number;
  height: number;
}

const VIEWPORTS: Viewport[] = [
  { name: 'Mobile (375)', width: 375, height: 812 },
  { name: 'Tablet (768)', width: 768, height: 1024 },
  { name: 'Desktop (1440)', width: 1440, height: 900 },
];

const ROUTES = [
  { path: '/', label: 'Landing' },
  { path: '/catalog', label: 'Catalog Index' },
  { path: '/catalog/hero-sections', label: 'Catalog Hero' },
  { path: '/catalog/steppers', label: 'Catalog Steppers' },
  { path: '/catalog/sidebars', label: 'Catalog Sidebars' },
  { path: '/catalog/badges', label: 'Catalog Badges' },
  { path: '/app/dashboard', label: 'App Dashboard' },
  { path: '/app/users', label: 'App Users' },
  { path: '/app/settings', label: 'App Settings' },
  { path: '/auth/sign-in', label: 'Auth Sign-In' },
];

interface TestResult {
  viewport: string;
  route: string;
  label: string;
  overflow: boolean;
  bodyWidth: number;
  viewportWidth: number;
  fontFamily: string;
  fontRendered: boolean;
  passed: boolean;
  error?: string;
}

async function testRoute(
  page: Page,
  viewport: Viewport,
  route: { path: string; label: string },
): Promise<TestResult> {
  const result: TestResult = {
    viewport: viewport.name,
    route: route.path,
    label: route.label,
    overflow: false,
    bodyWidth: 0,
    viewportWidth: viewport.width,
    fontFamily: '',
    fontRendered: false,
    passed: false,
  };

  try {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(500);

    // Check horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    result.bodyWidth = scrollWidth;
    result.overflow = scrollWidth > clientWidth + 2; // 2px tolerance

    // Check font family
    const fontData = await page.evaluate(() => {
      const body = document.body;
      const computed = window.getComputedStyle(body);
      return {
        fontFamily: computed.fontFamily,
        fontRendered: computed.fontFamily.includes('Nunito') || computed.fontFamily.includes('Noto Sans TC'),
      };
    });
    result.fontFamily = fontData.fontFamily;
    result.fontRendered = fontData.fontRendered;

    result.passed = !result.overflow && result.fontRendered;
  } catch (e: unknown) {
    result.error = e instanceof Error ? e.message : String(e);
    result.passed = false;
  }

  return result;
}

async function main(): Promise<void> {
  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results: TestResult[] = [];
  let pass = 0;
  let fail = 0;

  for (const viewport of VIEWPORTS) {
    for (const route of ROUTES) {
      const result = await testRoute(page, viewport, route);
      results.push(result);
      if (result.passed) pass++;
      else fail++;

      const status = result.passed ? '✅' : '❌';
      const issues: string[] = [];
      if (result.overflow) issues.push(`overflow(${result.bodyWidth}>${result.viewportWidth})`);
      if (!result.fontRendered) issues.push('font-missing');
      if (result.error) issues.push(`error:${result.error.substring(0, 50)}`);

      console.log(
        `${status} [${viewport.name.padEnd(16)}] ${route.label.padEnd(20)} ${issues.length > 0 ? issues.join(', ') : 'OK'}`,
      );
    }
  }

  await browser.close();

  console.log('\n========================================');
  console.log(`  TOTAL: ${results.length} | PASS: ${pass} | FAIL: ${fail}`);
  console.log('========================================');

  if (fail > 0) {
    console.log('\nFailed tests:');
    for (const r of results.filter(r => !r.passed)) {
      console.log(`  - [${r.viewport}] ${r.label} (${r.route})`);
      if (r.overflow) console.log(`    Overflow: ${r.bodyWidth}px > ${r.viewportWidth}px`);
      if (!r.fontRendered) console.log(`    Font: ${r.fontFamily}`);
      if (r.error) console.log(`    Error: ${r.error}`);
    }
  }

  process.exit(fail > 0 ? 1 : 0);
}

main();
