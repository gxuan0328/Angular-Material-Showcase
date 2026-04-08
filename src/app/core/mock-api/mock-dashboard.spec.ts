import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { MockDashboardApi } from './mock-dashboard';

describe('MockDashboardApi', () => {
  let api: MockDashboardApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockDashboardApi,
      ],
    });
    api = TestBed.inject(MockDashboardApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('exposes a 90-day revenue series out of the box (no load required)', () => {
    const revenue = api.revenue();
    expect(revenue.length).toBe(90);
    expect(revenue.every(p => p.value > 0)).toBe(true);
    expect(revenue.every(p => /^\d{2}\/\d{2}$/.test(p.label))).toBe(true);
  });

  it('load() populates all four JSON endpoints', async () => {
    const loadPromise = api.load();

    httpMock.expectOne('assets/mock-data/dashboard-kpis.json').flush({
      kpis: [
        {
          id: 'mrr',
          label: 'MRR',
          value: 1000,
          unit: 'USD',
          delta: 1.2,
          trend: 'up',
          sparkline: [1, 2, 3],
        },
      ],
    });
    httpMock.expectOne('assets/mock-data/dashboard-plans.json').flush({
      plans: [{ id: 'free', label: 'Free', count: 10, mrr: 0, color: 'primary' }],
      totalCustomers: 10,
      totalMrr: 0,
    });
    httpMock.expectOne('assets/mock-data/dashboard-top-pages.json').flush({
      pages: [{ path: '/', label: '首頁', views: 100, percent: 50 }],
      totalViews: 200,
    });
    httpMock.expectOne('assets/mock-data/dashboard-feeds.json').flush({
      feeds: [
        {
          id: 'f1',
          type: 'signup',
          user: { name: 'A', email: 'a@example.com', avatar: 'A' },
          message: 'joined',
          timestamp: '2026-04-08T12:00:00+08:00',
        },
      ],
    });

    await loadPromise;

    expect(api.loaded()).toBe(true);
    expect(api.kpis().length).toBe(1);
    expect(api.plans().totalCustomers).toBe(10);
    expect(api.topPages().pages.length).toBe(1);
    expect(api.feeds().length).toBe(1);
  });

  it('load() is idempotent — second call makes no HTTP requests', async () => {
    const firstLoad = api.load();
    httpMock.expectOne('assets/mock-data/dashboard-kpis.json').flush({ kpis: [] });
    httpMock
      .expectOne('assets/mock-data/dashboard-plans.json')
      .flush({ plans: [], totalCustomers: 0, totalMrr: 0 });
    httpMock
      .expectOne('assets/mock-data/dashboard-top-pages.json')
      .flush({ pages: [], totalViews: 0 });
    httpMock.expectOne('assets/mock-data/dashboard-feeds.json').flush({ feeds: [] });
    await firstLoad;

    expect(api.loaded()).toBe(true);

    // Second call — must hit the early return (no extra HTTP traffic).
    await api.load();
    const remaining = httpMock.match(() => true);
    expect(remaining.length).toBe(0);
  });

  it('totalRevenue sums the last 30 days', () => {
    const points = api.revenue();
    const expected = points.slice(-30).reduce((s, p) => s + p.value, 0);
    expect(api.totalRevenue()).toBe(expected);
  });
});
