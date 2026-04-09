import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthResult } from './mock-auth-api';

export interface Plan {
  readonly id: string;
  readonly name: string;
  readonly priceMonthly: number;
  readonly priceYearly: number;
  readonly currency: string;
  readonly features: readonly string[];
  readonly seatLimit: number;
  readonly recommended?: boolean;
}

export interface Invoice {
  readonly id: string;
  readonly number: string;
  readonly amount: number;
  readonly currency: string;
  readonly issuedAt: string;
  readonly paidAt: string | null;
  readonly status: 'paid' | 'due' | 'overdue' | 'refunded';
  readonly downloadUrl: string;
}

export interface PaymentMethod {
  readonly id: string;
  readonly brand: 'visa' | 'mastercard' | 'amex' | 'ach';
  readonly last4: string;
  readonly expMonth: number;
  readonly expYear: number;
  readonly isDefault: boolean;
}

export interface UsageMetric {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly limit: number;
  readonly unit: string;
  readonly series: readonly { month: string; value: number }[];
}

function delay(ms = 120): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * In-memory billing API backed by `assets/mock-data/` JSON fixtures.
 * Exposes signal-based state for plan, invoices, payments, and usage metrics.
 */
@Injectable({ providedIn: 'root' })
export class MockBillingApi {
  private readonly http = inject(HttpClient);

  private readonly _plans = signal<readonly Plan[]>([]);
  private readonly _currentPlanId = signal<string>('growth');
  private readonly _invoices = signal<readonly Invoice[]>([]);
  private readonly _paymentMethods = signal<readonly PaymentMethod[]>([]);
  private readonly _usageMetrics = signal<readonly UsageMetric[]>([]);
  private readonly _loaded = signal<boolean>(false);

  readonly plans: Signal<readonly Plan[]> = this._plans.asReadonly();
  readonly invoices: Signal<readonly Invoice[]> = this._invoices.asReadonly();
  readonly paymentMethods: Signal<readonly PaymentMethod[]> = this._paymentMethods.asReadonly();
  readonly usageMetrics: Signal<readonly UsageMetric[]> = this._usageMetrics.asReadonly();
  readonly loaded: Signal<boolean> = this._loaded.asReadonly();

  readonly currentPlan = computed<Plan | undefined>(() =>
    this._plans().find(p => p.id === this._currentPlanId()),
  );

  readonly upcomingInvoice = computed<Invoice | undefined>(() =>
    this._invoices().find(inv => inv.status === 'due'),
  );

  async load(): Promise<void> {
    if (this._loaded()) return;
    const [plans, invoices, paymentMethods, usageMetrics] = await Promise.all([
      firstValueFrom(this.http.get<readonly Plan[]>('assets/mock-data/plans.json')),
      firstValueFrom(this.http.get<readonly Invoice[]>('assets/mock-data/invoices.json')),
      firstValueFrom(
        this.http.get<readonly PaymentMethod[]>('assets/mock-data/payment-methods.json'),
      ),
      firstValueFrom(
        this.http.get<readonly UsageMetric[]>('assets/mock-data/usage-metrics.json'),
      ),
    ]);
    this._plans.set(plans);
    this._invoices.set(invoices);
    this._paymentMethods.set(paymentMethods);
    this._usageMetrics.set(usageMetrics);
    this._loaded.set(true);
  }

  async upgradePlan(planId: string): Promise<AuthResult<Plan>> {
    await delay();
    const plan = this._plans().find(p => p.id === planId);
    if (!plan) return { ok: false, error: 'NotFound' };
    this._currentPlanId.set(planId);
    return { ok: true, value: plan };
  }

  async setDefaultPaymentMethod(id: string): Promise<AuthResult<PaymentMethod>> {
    await delay();
    const method = this._paymentMethods().find(m => m.id === id);
    if (!method) return { ok: false, error: 'NotFound' };
    this._paymentMethods.update(list =>
      list.map(m => ({ ...m, isDefault: m.id === id })),
    );
    return { ok: true, value: { ...method, isDefault: true } };
  }
}
