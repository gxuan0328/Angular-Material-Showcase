import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { MockReportsApi } from './mock-reports';

describe('MockReportsApi', () => {
  let api: MockReportsApi;
  let httpCtrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(MockReportsApi);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  it('should load kpis, series, and topItems', async () => {
    const loadPromise = api.load();
    httpCtrl.expectOne('assets/mock-data/reports-metrics.json').flush({
      kpis: [{ id: 'test', label: 'Test', value: 100, delta: 5, unit: '%' }],
      series: [],
      topItems: [],
    });
    await loadPromise;
    expect(api.loaded()).toBe(true);
    expect(api.kpis().length).toBe(1);
  });

  it('should not reload on second call', async () => {
    const p1 = api.load();
    httpCtrl.expectOne('assets/mock-data/reports-metrics.json').flush({ kpis: [], series: [], topItems: [] });
    await p1;
    await api.load(); // should not trigger another HTTP request
    httpCtrl.verify();
  });
});
