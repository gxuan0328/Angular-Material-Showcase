/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-tooltips/chart-tooltip-7`
*/

import {
  ChangeDetectorRef,
  Component,
  DEFAULT_CURRENCY_CODE,
  inject,
  LOCALE_ID,
  signal,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatButton } from '@angular/material/button';

import { ChartConfiguration, ChartData, TooltipModel } from 'chart.js';

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-chart-tooltip-7',
  templateUrl: './chart-tooltip-7.component.html',
  imports: [BaseChartDirective, MatButton],
})
export class ChartTooltip7Component {
  private readonly cdr = inject(ChangeDetectorRef);
  private _locale = inject(LOCALE_ID);
  private readonly _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  tooltip: TooltipModel<'bar'> | undefined;
  chartType = 'bar' as const;
  showDemo = signal(false);

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

  private generateSeries(length: number, min: number, max: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < length; i++)
      out.push(Math.floor(min + Math.random() * (max - min)));
    return out;
  }

  chartData: ChartData<'bar', number[], string> = {
    labels: this.labels,
    datasets: [
      {
        data: this.generateSeries(this.labels.length, 1500, 6000),
        label: 'sales',
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246)',
        borderWidth: 1,
      },
    ],
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        position: 'nearest',
        external: ({ tooltip }: { tooltip: TooltipModel<'bar'> }) => {
          this.tooltip = tooltip;
          this.cdr.markForCheck();
        },
      },
    },
    interaction: { intersect: false, mode: 'index' as const },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { display: true, color: '#66666650' },
        border: { display: false },
        ticks: {
          maxTicksLimit: 4,
          callback: (value: number | string) =>
            this.getCurrency(value as number),
        },
      },
    },
  } as const;

  getTooltipTransform(
    caretX: number,
    tooltipWidth: number,
    chartWidth: number,
  ): string {
    if (caretX + tooltipWidth + TOOLTIP_SPACE >= chartWidth)
      return `translateX(${caretX - tooltipWidth - TOOLTIP_SPACE}px)`;
    return `translateX(${caretX + TOOLTIP_SPACE}px)`;
  }

  getPercentage(label: string) {
    if (label === this.labels[0]) return 0;
    const currentIndex = this.labels.findIndex((l) => l === label);
    const previousValue = this.chartData.datasets[0].data[currentIndex - 1];
    const currentValue = this.chartData.datasets[0].data[currentIndex];
    return ((currentValue - previousValue) / previousValue) * 100;
  }

  getCurrency(value: number | unknown): string {
    if (isNaN(value as number)) {
      return '';
    }
    return new Intl.NumberFormat(this._locale, {
      style: 'currency',
      currency: this._defaultCurrencyCode,
      maximumFractionDigits: 0,
    }).format(value as number);
  }

  toggleDemo(): void {
    this.showDemo.update((value) => !value);
  }
}
