/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bar-charts/bar-chart-6`
*/

import {
  ChangeDetectorRef,
  Component,
  computed,
  DEFAULT_CURRENCY_CODE,
  inject,
  LOCALE_ID,
  signal,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartData,
  ChartDataset,
  TooltipModel,
} from 'chart.js';
import { MatRipple } from '@angular/material/core';
import { MatDivider } from '@angular/material/divider';

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-bar-chart-6',

  imports: [BaseChartDirective, MatRipple, MatDivider],
  templateUrl: './bar-chart-6.component.html',
})
export class BarChart6Component {
  private readonly cdr = inject(ChangeDetectorRef);
  private _locale = inject(LOCALE_ID);
  private readonly _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  tooltip: TooltipModel<'bar'> | undefined;
  readonly title = 'Sales breakdown by regions';
  readonly description = 'Check sales of top regions';

  private readonly labels: string[] = [
    'Jan 24',
    'Feb 24',
    'Mar 24',
    'Apr 24',
    'May 24',
    'Jun 24',
    'Jul 24',
    'Aug 24',
    'Sep 24',
    'Oct 24',
    'Nov 24',
    'Dec 24',
  ];

  private series(length: number, min: number, max: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < length; i++)
      out.push(Math.floor(min + Math.random() * (max - min)));
    return out;
  }

  readonly selectedRegion = signal<string>('Europe');

  readonly regionToSeries = new Map<string, number[]>([
    ['Europe', this.series(this.labels.length, 30000, 100000)],
    ['Asia', this.series(this.labels.length, 20000, 90000)],
    ['North America', this.series(this.labels.length, 25000, 95000)],
  ]);

  readonly chartData = computed<ChartData<'bar', number[], string>>(() => {
    const region = this.selectedRegion();
    const data = this.regionToSeries.get(region) ?? [];
    const dataset: ChartDataset<'bar', number[]> = {
      data,
      label: 'Sales',
      borderColor: 'rgb(139, 92, 246)',
      backgroundColor: 'rgba(139, 92, 246)',
      borderWidth: 1,
    };
    return { labels: this.labels, datasets: [dataset] };
  });

  readonly chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        position: 'nearest',
        external: ({ tooltip }) => {
          this.tooltip = tooltip as TooltipModel<'bar'>;
          this.cdr.markForCheck();
        },
      },
    },
    interaction: { intersect: false, mode: 'index' },
    scales: {
      x: { grid: { display: false }, ticks: { display: true } },
      y: {
        grid: { display: true, color: '#66666650' },
        ticks: {
          display: true,
          maxTicksLimit: 4,
          callback: (value) => this.getFormattedValue(value as number),
        },
        border: { display: false },
      },
    },
  };

  getFormattedValue(value: number | unknown): string {
    if (typeof value !== 'number') return '';
    return (
      new Intl.NumberFormat(this._locale, {
        style: 'currency',
        currency: this._defaultCurrencyCode,
        maximumFractionDigits: 0,
      }).format(value / 1000) + (value === 0 ? '' : 'K')
    );
  }

  getTotal(data: number[]): number {
    return data.reduce((acc, curr) => acc + curr, 0);
  }

  getTooltipTransform(
    caretX: number,
    tooltipWidth: number,
    chartWidth: number,
  ): string {
    if (caretX + tooltipWidth + TOOLTIP_SPACE >= chartWidth)
      return `translateX(${caretX - tooltipWidth - TOOLTIP_SPACE}px)`;
    return `translateX(${caretX + TOOLTIP_SPACE}px)`;
  }
}
