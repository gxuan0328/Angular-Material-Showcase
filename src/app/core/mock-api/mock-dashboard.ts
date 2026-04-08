import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

/** KPI row card shown at the top of the dashboard. */
export interface KpiCardData {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly unit: string;
  readonly delta: number;
  readonly trend: 'up' | 'down' | 'flat';
  readonly sparkline: readonly number[];
}

/** One slice of the plan distribution donut chart. */
export interface PlanSlice {
  readonly id: string;
  readonly label: string;
  readonly count: number;
  readonly mrr: number;
  readonly color: string;
}

/** A single row of the top-pages bar list. */
export interface TopPage {
  readonly path: string;
  readonly label: string;
  readonly views: number;
  readonly percent: number;
}

/** One activity-feed entry. */
export interface FeedEntry {
  readonly id: string;
  readonly type: 'signup' | 'upgrade' | 'alert' | 'invoice' | 'comment';
  readonly user: {
    readonly name: string;
    readonly email: string;
    readonly avatar: string;
  };
  readonly message: string;
  /** ISO-8601 string. */
  readonly timestamp: string;
}

export interface RevenuePoint {
  readonly label: string;
  readonly value: number;
}

interface KpisDocument {
  readonly kpis: readonly KpiCardData[];
}
interface PlansDocument {
  readonly plans: readonly PlanSlice[];
  readonly totalCustomers: number;
  readonly totalMrr: number;
}
interface TopPagesDocument {
  readonly pages: readonly TopPage[];
  readonly totalViews: number;
}
interface FeedsDocument {
  readonly feeds: readonly FeedEntry[];
}

/**
 * In-memory dashboard API backed by static JSON fixtures under
 * `src/assets/mock-data/`. Exposes signals so the dashboard can read values
 * synchronously once `load()` resolves.
 *
 * The 90-day revenue series is computed deterministically from a seeded
 * growth curve so we do not have to ship 90 JSON entries.
 */
@Injectable({ providedIn: 'root' })
export class MockDashboardApi {
  private readonly http = inject(HttpClient);

  private readonly _kpis = signal<readonly KpiCardData[]>([]);
  private readonly _plans = signal<PlansDocument>({
    plans: [],
    totalCustomers: 0,
    totalMrr: 0,
  });
  private readonly _topPages = signal<TopPagesDocument>({ pages: [], totalViews: 0 });
  private readonly _feeds = signal<readonly FeedEntry[]>([]);
  private readonly _revenue = signal<readonly RevenuePoint[]>(buildRevenueSeries());
  private readonly _loaded = signal<boolean>(false);

  readonly kpis: Signal<readonly KpiCardData[]> = this._kpis.asReadonly();
  readonly plans: Signal<PlansDocument> = this._plans.asReadonly();
  readonly topPages: Signal<TopPagesDocument> = this._topPages.asReadonly();
  readonly feeds: Signal<readonly FeedEntry[]> = this._feeds.asReadonly();
  readonly revenue: Signal<readonly RevenuePoint[]> = this._revenue.asReadonly();
  readonly loaded: Signal<boolean> = this._loaded.asReadonly();

  readonly totalRevenue = computed<number>(() => {
    const last30 = this._revenue().slice(-30);
    return last30.reduce((sum, p) => sum + p.value, 0);
  });

  async load(): Promise<void> {
    if (this._loaded()) return;
    const [kpis, plans, pages, feeds] = await Promise.all([
      firstValueFrom(this.http.get<KpisDocument>('assets/mock-data/dashboard-kpis.json')),
      firstValueFrom(this.http.get<PlansDocument>('assets/mock-data/dashboard-plans.json')),
      firstValueFrom(this.http.get<TopPagesDocument>('assets/mock-data/dashboard-top-pages.json')),
      firstValueFrom(this.http.get<FeedsDocument>('assets/mock-data/dashboard-feeds.json')),
    ]);
    this._kpis.set(kpis.kpis);
    this._plans.set(plans);
    this._topPages.set(pages);
    this._feeds.set(feeds.feeds);
    this._loaded.set(true);
  }
}

/**
 * Deterministic 90-day revenue seed: exponential-ish growth curve with mild
 * weekend dips. Ends around today-minus-1 at ~$3,100/day to match the
 * $84,900 MRR figure in dashboard-kpis.json.
 */
function buildRevenueSeries(): readonly RevenuePoint[] {
  const days = 90;
  const base = 2100;
  const growth = 14.8; // per-day drift
  const now = new Date();
  const points: RevenuePoint[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? 0.82 : 1;
    const noise = Math.sin(i * 0.7) * 60 + Math.cos(i * 1.3) * 35;
    const value = Math.round((base + (days - 1 - i) * growth) * weekendDip + noise);
    points.push({
      label: formatDate(date),
      value,
    });
  }
  return points;
}

function formatDate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}/${d}`;
}
