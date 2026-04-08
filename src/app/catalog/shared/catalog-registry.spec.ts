import {
  CATALOG_REGISTRY,
  buildCatalogStub,
  findCatalogEntry,
  getNextEntry,
  getPreviousEntry,
} from './catalog-registry';

describe('catalog-registry', () => {
  it('contains exactly 43 display categories', () => {
    expect(CATALOG_REGISTRY.length).toBe(43);
  });

  it('splits into 29 application + 14 marketing entries', () => {
    const application = CATALOG_REGISTRY.filter(e => e.category === 'application');
    const marketing = CATALOG_REGISTRY.filter(e => e.category === 'marketing');
    expect(application.length).toBe(29);
    expect(marketing.length).toBe(14);
  });

  it('has unique ids', () => {
    const ids = CATALOG_REGISTRY.map(e => e.id);
    const uniques = new Set(ids);
    expect(uniques.size).toBe(43);
  });

  it('marks the 28 M1+M2-shipped categories as shipped', () => {
    const shipped = CATALOG_REGISTRY.filter(e => e.status === 'shipped').map(e => e.id);
    expect(shipped.sort()).toEqual(
      [
        // M1
        'banners',
        'components',
        'dialogs',
        'empty-states',
        'flyout-menus',
        'multi-column',
        'page-headings',
        'page-shells',
        'section-headings',
        'stacked-layouts',
        // M2
        'area-charts',
        'authentication',
        'bento-grids',
        'blog-sections',
        'contact-sections',
        'cta-sections',
        'donut-charts',
        'fancy',
        'feature-sections',
        'header-sections',
        'hero-sections',
        'kpi-cards',
        'lists',
        'newsletter-sections',
        'pricing-sections',
        'spark-area-charts',
        'stats-sections',
        'testimonial-sections',
      ].sort(),
    );
  });

  it('marks the remaining 15 categories as coming-soon', () => {
    const comingSoon = CATALOG_REGISTRY.filter(e => e.status === 'coming-soon');
    expect(comingSoon.length).toBe(15);
  });

  it('findCatalogEntry returns the matching entry', () => {
    expect(findCatalogEntry('page-shells')?.title).toBe('Page Shells');
    expect(findCatalogEntry('does-not-exist')).toBeUndefined();
  });

  it('getNextEntry / getPreviousEntry walk the registry', () => {
    const first = CATALOG_REGISTRY[0];
    const second = CATALOG_REGISTRY[1];
    const last = CATALOG_REGISTRY[CATALOG_REGISTRY.length - 1];

    expect(getPreviousEntry(first.id)).toBeUndefined();
    expect(getNextEntry(first.id)?.id).toBe(second.id);
    expect(getNextEntry(last.id)).toBeUndefined();
    expect(getPreviousEntry(last.id)?.id).toBe(CATALOG_REGISTRY[CATALOG_REGISTRY.length - 2].id);
  });

  it('buildCatalogStub returns an empty CatalogBlockMeta from a registry entry', () => {
    const entry = findCatalogEntry('page-shells');
    expect(entry).toBeDefined();
    const meta = buildCatalogStub(entry!);
    expect(meta.id).toBe('page-shells');
    expect(meta.title).toBe('Page Shells');
    expect(meta.variants).toEqual([]);
    expect(meta.api.inputs).toEqual([]);
    expect(meta.bestPractices.whenToUse).toEqual([]);
  });
});
