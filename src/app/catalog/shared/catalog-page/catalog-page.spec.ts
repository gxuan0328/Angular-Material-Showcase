import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { EMPTY_API } from '../../models/api-documentation';
import { EMPTY_BEST_PRACTICES } from '../../models/best-practice-notes';
import { CatalogBlockMeta } from '../../models/catalog-block-meta';

import { CatalogPage } from './catalog-page';

const SAMPLE_META: CatalogBlockMeta = {
  id: 'page-shells',
  title: 'Page Shells',
  category: 'application',
  subcategory: 'Application Shells',
  summary: '基本頁面外殼',
  tags: ['layout', 'shell'],
  status: 'shipped',
  variants: [],
  api: EMPTY_API,
  bestPractices: EMPTY_BEST_PRACTICES,
  relatedBlockIds: [],
};

describe('CatalogPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [CatalogPage],
    });
  });

  async function render(meta: CatalogBlockMeta): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(CatalogPage);
    fixture.componentRef.setInput('meta', meta);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  function textContents(el: HTMLElement, selector: string): readonly string[] {
    const nodes = el.querySelectorAll<HTMLElement>(selector);
    return Array.from(nodes).map(n => n.textContent?.trim() ?? '');
  }

  it('renders the title, summary, and breadcrumb', async () => {
    const el = await render(SAMPLE_META);
    expect(el.querySelector('h1')?.textContent).toContain('Page Shells');
    expect(el.textContent).toContain('基本頁面外殼');
    expect(el.textContent).toContain('Application Shells');
  });

  it('renders all four content zones with the correct headings', async () => {
    const el = await render(SAMPLE_META);
    expect(textContents(el, 'h2.catalog-page__zone-title')).toEqual([
      '即時預覽',
      '原始碼',
      'API 與屬性',
      '最佳實務',
    ]);
  });

  it('renders the tags chip group', async () => {
    const el = await render(SAMPLE_META);
    expect(textContents(el, '.catalog-page__tag')).toEqual(['layout', 'shell']);
  });

  it('shows placeholder text when meta has no variants', async () => {
    const el = await render(SAMPLE_META);
    expect(el.textContent).toContain('即將推出');
  });

  it('renders prev/next pager when entry has neighbours in the registry', async () => {
    const el = await render(SAMPLE_META);
    const links = el.querySelectorAll('.catalog-page__pager-link');
    expect(links.length).toBeGreaterThan(0);
  });
});
