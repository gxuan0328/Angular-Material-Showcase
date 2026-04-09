import {
  CATALOG_REGISTRY,
  buildCatalogStub,
  findCatalogEntry,
  getNextEntry,
  getPreviousEntry,
} from './catalog-registry';

describe('catalog-registry', () => {
  it('contains exactly 45 display categories', () => {
    expect(CATALOG_REGISTRY.length).toBe(45);
  });

  it('splits into 31 application + 14 marketing entries', () => {
    const application = CATALOG_REGISTRY.filter(e => e.category === 'application');
    const marketing = CATALOG_REGISTRY.filter(e => e.category === 'marketing');
    expect(application.length).toBe(31);
    expect(marketing.length).toBe(14);
  });

  it('has unique ids', () => {
    const ids = CATALOG_REGISTRY.map(e => e.id);
    const uniques = new Set(ids);
    expect(uniques.size).toBe(45);
  });

  it('marks all 45 categories as shipped (100% coverage)', () => {
    const shipped = CATALOG_REGISTRY.filter(e => e.status === 'shipped');
    expect(shipped.length).toBe(45);
  });

  it('has zero coming-soon entries after M4', () => {
    const comingSoon = CATALOG_REGISTRY.filter(e => e.status === 'coming-soon');
    expect(comingSoon.length).toBe(0);
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
