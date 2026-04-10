/**
 * Multi-viewport visual regression + responsive test
 * Captures screenshots + validates layout, fonts, overflow, animations
 */
import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE = 'http://localhost:4200';
const SCREENSHOT_DIR = path.resolve(__dirname, '../docs/verification/responsive-test');

interface Viewport {
  name: string;
  slug: string;
  width: number;
  height: number;
}

const VIEWPORTS: Viewport[] = [
  { name: 'Mobile (375)', slug: 'mobile', width: 375, height: 812 },
  { name: 'Tablet (768)', slug: 'tablet', width: 768, height: 1024 },
  { name: 'Desktop (1440)', slug: 'desktop', width: 1440, height: 900 },
];

const ROUTES = [
  { path: '/', label: 'Landing', slug: 'landing' },
  { path: '/catalog', label: 'Catalog Index', slug: 'catalog-index' },
  { path: '/catalog/hero-sections', label: 'Catalog Hero', slug: 'catalog-hero' },
  { path: '/catalog/steppers', label: 'Catalog Steppers', slug: 'catalog-steppers' },
  { path: '/catalog/sidebars', label: 'Catalog Sidebars', slug: 'catalog-sidebars' },
  { path: '/catalog/feature-sections', label: 'Catalog Features', slug: 'catalog-features' },
  { path: '/catalog/badges', label: 'Catalog Badges', slug: 'catalog-badges' },
  { path: '/catalog/fancy', label: 'Catalog Fancy', slug: 'catalog-fancy' },
  { path: '/app/dashboard', label: 'App Dashboard', slug: 'app-dashboard' },
  { path: '/app/users', label: 'App Users', slug: 'app-users' },
  { path: '/app/billing', label: 'App Billing', slug: 'app-billing' },
  { path: '/app/settings', label: 'App Settings', slug: 'app-settings' },
  { path: '/auth/sign-in', label: 'Auth Sign-In', slug: 'auth-signin' },
];

interface CheckResult {
  viewport: string;
  route: string;
  label: string;
  overflowX: boolean;
  scrollWidth: number;
  viewportWidth: number;
  fontFamily: string;
  hasNunito: boolean;
  hasNotoSansTC: boolean;
  sidebarVisible: boolean | null;
  sidebarMode: string | null;
  screenshot: string;
  passed: boolean;
  issues: string[];
}

async function checkRoute(
  page: Page,
  viewport: Viewport,
  route: { path: string; label: string; slug: string },
): Promise<CheckResult> {
  const result: CheckResult = {
    viewport: viewport.name,
    route: route.path,
    label: route.label,
    overflowX: false,
    scrollWidth: 0,
    viewportWidth: viewport.width,
    fontFamily: '',
    hasNunito: false,
    hasNotoSansTC: false,
    sidebarVisible: null,
    sidebarMode: null,
    screenshot: '',
    passed: true,
    issues: [],
  };

  try {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(800);

    // 1. Overflow check
    const dims = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    result.scrollWidth = dims.scrollWidth;
    result.overflowX = dims.scrollWidth > dims.clientWidth + 2;
    if (result.overflowX) {
      result.issues.push(`overflow-x: ${dims.scrollWidth}px > ${dims.clientWidth}px`);
      result.passed = false;
    }

    // 2. Font check
    const fontData = await page.evaluate(() => {
      const cs = window.getComputedStyle(document.body);
      return { fontFamily: cs.fontFamily };
    });
    result.fontFamily = fontData.fontFamily;
    result.hasNunito = fontData.fontFamily.toLowerCase().includes('nunito');
    result.hasNotoSansTC = fontData.fontFamily.toLowerCase().includes('noto sans tc');
    if (!result.hasNunito) {
      result.issues.push('missing-nunito');
      result.passed = false;
    }

    // 3. Sidebar state (for catalog/admin)
    if (route.path.startsWith('/catalog')) {
      const sidebarInfo = await page.evaluate(() => {
        const nav = document.querySelector('.catalog-layout__nav') as HTMLElement | null;
        if (!nav) return { visible: false, mode: 'none' };
        const rect = nav.getBoundingClientRect();
        const transform = window.getComputedStyle(nav).transform;
        const isOff = transform.includes('-280') || transform.includes('-260') || rect.right <= 0;
        return {
          visible: !isOff && rect.width > 0,
          mode: window.getComputedStyle(nav).position === 'fixed' ? 'overlay' : 'inline',
        };
      });
      result.sidebarVisible = sidebarInfo.visible;
      result.sidebarMode = sidebarInfo.mode;

      // On mobile, sidebar should be hidden (overlay mode, not visible)
      if (viewport.width < 960 && sidebarInfo.visible && sidebarInfo.mode === 'inline') {
        result.issues.push('sidebar-inline-on-mobile');
        result.passed = false;
      }
    }

    if (route.path.startsWith('/app/')) {
      const adminNav = await page.evaluate(() => {
        const sidenav = document.querySelector('.admin-layout__sidenav') as HTMLElement | null;
        if (!sidenav) return { visible: false, mode: 'none' };
        const rect = sidenav.getBoundingClientRect();
        return {
          visible: rect.width > 0 && rect.right > 0,
          mode: 'side',
        };
      });
      result.sidebarVisible = adminNav.visible;
      result.sidebarMode = adminNav.mode;
    }

    // 4. Screenshot
    const screenshotPath = path.join(SCREENSHOT_DIR, `${viewport.slug}-${route.slug}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    result.screenshot = screenshotPath;

  } catch (e: unknown) {
    result.issues.push(`error: ${e instanceof Error ? e.message.substring(0, 80) : String(e)}`);
    result.passed = false;
  }

  return result;
}

async function main(): Promise<void> {
  // Ensure screenshot directory
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const allResults: CheckResult[] = [];
  let pass = 0;
  let fail = 0;

  for (const viewport of VIEWPORTS) {
    console.log(`\n--- ${viewport.name} (${viewport.width}x${viewport.height}) ---`);
    for (const route of ROUTES) {
      const r = await checkRoute(page, viewport, route);
      allResults.push(r);
      if (r.passed) pass++;
      else fail++;

      const icon = r.passed ? '✅' : '❌';
      const extra = r.issues.length > 0 ? ` [${r.issues.join(', ')}]` : '';
      const sidebar = r.sidebarVisible !== null
        ? ` sidebar=${r.sidebarVisible ? 'visible' : 'hidden'}(${r.sidebarMode})`
        : '';
      console.log(`  ${icon} ${r.label.padEnd(22)}${sidebar}${extra}`);
    }
  }

  await browser.close();

  // Generate markdown report
  const report = generateReport(allResults, pass, fail);
  const reportPath = path.join(SCREENSHOT_DIR, 'REPORT.md');
  fs.writeFileSync(reportPath, report, 'utf-8');

  console.log('\n========================================');
  console.log(`  TOTAL: ${allResults.length} | PASS: ${pass} | FAIL: ${fail}`);
  console.log(`  Screenshots: ${SCREENSHOT_DIR}`);
  console.log(`  Report: ${reportPath}`);
  console.log('========================================');

  process.exit(fail > 0 ? 1 : 0);
}

function generateReport(results: CheckResult[], pass: number, fail: number): string {
  const lines: string[] = [
    '# Responsive Design Verification Report',
    '',
    `**Date:** ${new Date().toISOString().split('T')[0]}`,
    `**Viewports:** Mobile (375px) | Tablet (768px) | Desktop (1440px)`,
    `**Routes tested:** ${ROUTES.length}`,
    `**Total checks:** ${results.length}`,
    `**Pass:** ${pass} | **Fail:** ${fail}`,
    '',
    '## Results by Viewport',
    '',
  ];

  for (const vp of VIEWPORTS) {
    lines.push(`### ${vp.name}`);
    lines.push('');
    lines.push('| Route | Status | Overflow | Font | Sidebar | Issues |');
    lines.push('|-------|--------|----------|------|---------|--------|');

    for (const r of results.filter(r => r.viewport === vp.name)) {
      const status = r.passed ? '✅ Pass' : '❌ Fail';
      const overflow = r.overflowX ? `${r.scrollWidth}px` : 'OK';
      const font = r.hasNunito ? 'Nunito ✓' : 'Missing';
      const sidebar = r.sidebarVisible !== null
        ? `${r.sidebarVisible ? '👁' : '—'} ${r.sidebarMode}`
        : 'N/A';
      const issues = r.issues.length > 0 ? r.issues.join('; ') : '—';
      lines.push(`| ${r.label} | ${status} | ${overflow} | ${font} | ${sidebar} | ${issues} |`);
    }
    lines.push('');
  }

  lines.push('## Font Configuration');
  lines.push('');
  lines.push('- **English:** Nunito (400, 500, 600, 700) — rounded, full-bodied');
  lines.push('- **Traditional Chinese:** Noto Sans TC (400, 500, 700) — Google CJK standard');
  lines.push('- **Monospace:** JetBrains Mono (code blocks only)');
  lines.push('- **Material Icons:** Material Symbols Outlined (CDN)');
  lines.push('');
  lines.push('## Responsive Breakpoints');
  lines.push('');
  lines.push('| Breakpoint | Width | Layout Behavior |');
  lines.push('|------------|-------|-----------------|');
  lines.push('| Mobile | < 640px | Single column, overlay nav, compact padding |');
  lines.push('| Tablet | < 960px | Single column, overlay catalog nav, side admin nav |');
  lines.push('| Desktop | >= 960px | Dual column with inline sidebar |');
  lines.push('| Wide | >= 1440px | Max-width constrained content |');

  return lines.join('\n');
}

main();
