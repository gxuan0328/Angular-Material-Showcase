import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { I18nStore } from './i18n-store';

const MOCK_DICT: Record<string, string> = {
  'app.brand': 'Glacier Analytics',
  'app.tagline': '範例網站，收錄 Angular Material Block 全部元件目錄',
  'catalog.variant.count': '共 {count} 種變體',
  'nav.home': '首頁',
};

describe('I18nStore', () => {
  let store: I18nStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        I18nStore,
      ],
    });

    store = TestBed.inject(I18nStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('returns the key as fallback when not loaded', () => {
    // No load() called — dict is empty, so every key falls back to itself
    expect(store.t('nav.home')).toBe('nav.home');
    expect(store.t('missing.key')).toBe('missing.key');
    expect(store.loaded()).toBe(false);
  });

  it('loads the dictionary from assets/i18n/zh-TW.json and exposes entry count', async () => {
    const loadPromise = store.load();

    // Flush the pending HTTP request with mock data
    const req = httpMock.expectOne('assets/i18n/zh-TW.json');
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_DICT);

    await loadPromise;

    expect(store.loaded()).toBe(true);
    expect(store.entryCount()).toBe(Object.keys(MOCK_DICT).length);
  });

  it('resolves keys to translations after load', async () => {
    const loadPromise = store.load();

    const req = httpMock.expectOne('assets/i18n/zh-TW.json');
    req.flush(MOCK_DICT);

    await loadPromise;

    expect(store.t('app.brand')).toBe('Glacier Analytics');
    expect(store.t('nav.home')).toBe('首頁');
    // Key not in dict still falls back to key itself
    expect(store.t('not.in.dict')).toBe('not.in.dict');
  });

  it('interpolates {count} and similar placeholders via the params argument', async () => {
    const loadPromise = store.load();

    const req = httpMock.expectOne('assets/i18n/zh-TW.json');
    req.flush(MOCK_DICT);

    await loadPromise;

    // Single placeholder
    expect(store.t('catalog.variant.count', { count: 3 })).toBe('共 3 種變體');

    // Params with no matching key — falls back to key, still replaces in it
    expect(store.t('greet.{name}', { name: 'Alice' })).toBe('greet.Alice');

    // Params on a raw-key fallback (key not in dict)
    expect(store.t('hello.{user}', { user: 'Bob' })).toBe('hello.Bob');
  });
});
