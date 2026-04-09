import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface ReportKpi {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly delta: number;
  readonly unit: string;
}

export interface ReportSeriesPoint {
  readonly date: string;
  readonly dimension: string;
  readonly value: number;
}

export interface TopItem {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly unit: string;
}

interface ReportsDocument {
  readonly kpis: readonly ReportKpi[];
  readonly series: readonly ReportSeriesPoint[];
  readonly topItems: readonly TopItem[];
}

/**
 * In-memory reports API backed by `assets/mock-data/reports-metrics.json`.
 */
@Injectable({ providedIn: 'root' })
export class MockReportsApi {
  private readonly http = inject(HttpClient);

  private readonly _kpis = signal<readonly ReportKpi[]>([]);
  private readonly _series = signal<readonly ReportSeriesPoint[]>([]);
  private readonly _topItems = signal<readonly TopItem[]>([]);
  private readonly _loaded = signal<boolean>(false);

  readonly kpis: Signal<readonly ReportKpi[]> = this._kpis.asReadonly();
  readonly series: Signal<readonly ReportSeriesPoint[]> = this._series.asReadonly();
  readonly topItems: Signal<readonly TopItem[]> = this._topItems.asReadonly();
  readonly loaded: Signal<boolean> = this._loaded.asReadonly();

  async load(): Promise<void> {
    if (this._loaded()) return;
    const doc = await firstValueFrom(
      this.http.get<ReportsDocument>('assets/mock-data/reports-metrics.json'),
    );
    this._kpis.set(doc.kpis);
    this._series.set(doc.series);
    this._topItems.set(doc.topItems);
    this._loaded.set(true);
  }
}
