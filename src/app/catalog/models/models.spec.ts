import { ApiDocumentation, ApiEntry, EMPTY_API } from './api-documentation';
import { BestPracticeNotes, EMPTY_BEST_PRACTICES } from './best-practice-notes';
import { CatalogBlockMeta, CatalogStatus } from './catalog-block-meta';

describe('catalog/models', () => {
  it('ApiEntry has the expected fields', () => {
    const entry: ApiEntry = {
      name: 'tone',
      type: "'info' | 'warn' | 'error'",
      default: "'info'",
      required: false,
      description: '橫幅語意色調',
    };
    expect(entry.name).toBe('tone');
    expect(entry.required).toBe(false);
  });

  it('EMPTY_API has empty arrays for all four sections', () => {
    const doc: ApiDocumentation = EMPTY_API;
    expect(doc.inputs).toEqual([]);
    expect(doc.outputs).toEqual([]);
    expect(doc.slots).toEqual([]);
    expect(doc.cssProperties).toEqual([]);
  });

  it('EMPTY_BEST_PRACTICES has empty arrays for all four sections', () => {
    const notes: BestPracticeNotes = EMPTY_BEST_PRACTICES;
    expect(notes.whenToUse).toEqual([]);
    expect(notes.whenNotToUse).toEqual([]);
    expect(notes.pitfalls).toEqual([]);
    expect(notes.accessibility).toEqual([]);
  });

  it('CatalogStatus enumerates shipped and coming-soon', () => {
    const a: CatalogStatus = 'shipped';
    const b: CatalogStatus = 'coming-soon';
    expect([a, b]).toEqual(['shipped', 'coming-soon']);
  });

  it('CatalogBlockMeta wires meta + variants + api + best practices', () => {
    const meta: CatalogBlockMeta = {
      id: 'page-shells',
      title: 'Page Shells',
      category: 'application',
      subcategory: 'Application Shells',
      summary: '頁面外殼',
      tags: ['layout'],
      status: 'shipped',
      variants: [],
      api: EMPTY_API,
      bestPractices: EMPTY_BEST_PRACTICES,
      relatedBlockIds: [],
    };
    expect(meta.id).toBe('page-shells');
    expect(meta.status).toBe('shipped');
  });
});
