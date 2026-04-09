import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { MockReportsApi, ReportSeriesPoint } from '../../core/mock-api/mock-reports';

/** Group series points by dimension for trend summary display. */
interface DimensionSummary {
  readonly dimension: string;
  readonly label: string;
  readonly points: readonly ReportSeriesPoint[];
  readonly min: number;
  readonly max: number;
  readonly latest: number;
}

@Component({
  selector: 'app-reports',
  imports: [
    DecimalPipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'reports' },
})
export class Reports implements OnInit {
  protected readonly reportsApi = inject(MockReportsApi);

  /** Aggregate series data grouped by dimension for the trend section. */
  protected readonly dimensionSummaries = computed<readonly DimensionSummary[]>(() => {
    const series = this.reportsApi.series();
    if (series.length === 0) return [];

    const grouped = new Map<string, ReportSeriesPoint[]>();
    for (const point of series) {
      const existing = grouped.get(point.dimension);
      if (existing) {
        existing.push(point);
      } else {
        grouped.set(point.dimension, [point]);
      }
    }

    const dimensionLabels: Record<string, string> = {
      revenue: '營收',
      users: '使用者',
    };

    const summaries: DimensionSummary[] = [];
    for (const [dimension, points] of grouped) {
      const values = points.map(p => p.value);
      summaries.push({
        dimension,
        label: dimensionLabels[dimension] ?? dimension,
        points,
        min: Math.min(...values),
        max: Math.max(...values),
        latest: values[values.length - 1],
      });
    }
    return summaries;
  });

  async ngOnInit(): Promise<void> {
    await this.reportsApi.load();
  }

  /** Generate a simple text-based sparkline representation of a series. */
  protected sparkline(points: readonly ReportSeriesPoint[]): string {
    if (points.length === 0) return '';
    const values = points.map(p => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const bars = ['\u2581', '\u2582', '\u2583', '\u2584', '\u2585', '\u2586', '\u2587', '\u2588'];
    return values
      .map(v => bars[Math.round(((v - min) / range) * (bars.length - 1))])
      .join('');
  }

  /** Format a date string to short month label. */
  protected formatMonth(date: string): string {
    const d = new Date(date);
    return `${d.getMonth() + 1} 月`;
  }

  /** Create and trigger a mock CSV Blob download. */
  protected exportCsv(): void {
    const kpis = this.reportsApi.kpis();
    const topItems = this.reportsApi.topItems();
    const series = this.reportsApi.series();

    const lines: string[] = [];

    // KPI section
    lines.push('=== KPI ===');
    lines.push('label,value,delta,unit');
    for (const kpi of kpis) {
      lines.push(`${kpi.label},${kpi.value},${kpi.delta},${kpi.unit}`);
    }

    lines.push('');

    // Series section
    lines.push('=== Series ===');
    lines.push('date,dimension,value');
    for (const point of series) {
      lines.push(`${point.date},${point.dimension},${point.value}`);
    }

    lines.push('');

    // Top items section
    lines.push('=== Top Items ===');
    lines.push('label,value,unit');
    for (const item of topItems) {
      lines.push(`${item.label},${item.value},${item.unit}`);
    }

    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'reports-export.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
