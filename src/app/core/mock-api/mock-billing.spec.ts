import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { MockBillingApi } from './mock-billing';

describe('MockBillingApi', () => {
  let api: MockBillingApi;
  let httpCtrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(MockBillingApi);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  it('should load plans, invoices, payment methods, and usage metrics', async () => {
    const loadPromise = api.load();
    httpCtrl.expectOne('assets/mock-data/plans.json').flush([{ id: 'starter', name: 'Starter', priceMonthly: 0, priceYearly: 0, currency: 'USD', features: [], seatLimit: 5 }]);
    httpCtrl.expectOne('assets/mock-data/invoices.json').flush([]);
    httpCtrl.expectOne('assets/mock-data/payment-methods.json').flush([]);
    httpCtrl.expectOne('assets/mock-data/usage-metrics.json').flush([]);
    await loadPromise;
    expect(api.loaded()).toBe(true);
    expect(api.plans().length).toBe(1);
  });

  it('should upgrade plan', async () => {
    const loadPromise = api.load();
    httpCtrl.expectOne('assets/mock-data/plans.json').flush([
      { id: 'starter', name: 'Starter', priceMonthly: 0, priceYearly: 0, currency: 'USD', features: [], seatLimit: 5 },
      { id: 'scale', name: 'Scale', priceMonthly: 199, priceYearly: 1910, currency: 'USD', features: [], seatLimit: 9999 },
    ]);
    httpCtrl.expectOne('assets/mock-data/invoices.json').flush([]);
    httpCtrl.expectOne('assets/mock-data/payment-methods.json').flush([]);
    httpCtrl.expectOne('assets/mock-data/usage-metrics.json').flush([]);
    await loadPromise;

    const result = await api.upgradePlan('scale');
    expect(result.ok).toBe(true);
    expect(api.currentPlan()?.id).toBe('scale');
  });

  it('should return error for unknown plan', async () => {
    const loadPromise = api.load();
    httpCtrl.expectOne('assets/mock-data/plans.json').flush([]);
    httpCtrl.expectOne('assets/mock-data/invoices.json').flush([]);
    httpCtrl.expectOne('assets/mock-data/payment-methods.json').flush([]);
    httpCtrl.expectOne('assets/mock-data/usage-metrics.json').flush([]);
    await loadPromise;

    const result = await api.upgradePlan('nonexistent');
    expect(result.ok).toBe(false);
  });
});
