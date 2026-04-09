/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-tooltips/chart-tooltip-6`
*/

import {
  ChangeDetectorRef,
  Component,
  inject,
  LOCALE_ID,
  DEFAULT_CURRENCY_CODE,
  signal,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatButton } from '@angular/material/button';

import { ChartData, TooltipItem, TooltipModel } from 'chart.js';

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-chart-tooltip-6',
  templateUrl: './chart-tooltip-6.component.html',
  imports: [BaseChartDirective, MatButton],
})
export class ChartTooltip6Component {
  private readonly cdr = inject(ChangeDetectorRef);
  private _locale = inject(LOCALE_ID);
  private readonly _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  showDemo = signal(false);

  tooltip: TooltipModel<'bar'> | undefined;
  chartType = 'bar' as const;

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
    for (let i = 0; i < length; i++) {
      out.push(Math.floor(min + Math.random() * (max - min)));
    }
    return out;
  }

  chartData: ChartData<'bar', number[], string> = {
    labels: this.labels,
    datasets: [
      {
        data: this.generateSeries(this.labels.length, 1200, 6200),
        label: 'Sales',
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246)',
        borderWidth: 1,
      },
    ],
  };

  chartOptions = {
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
        ticks: {
          display: true,
          maxTicksLimit: 4,
          callback: (value: number | string) =>
            this.getFormattedValue(value as number),
        },
        border: { display: false },
      },
    },
  } as const;

  getTooltipTransform(
    caretX: number,
    tooltipWidth: number,
    chartWidth: number,
  ): string {
    if (caretX >= chartWidth / 2) {
      return `translateX(${caretX - tooltipWidth - TOOLTIP_SPACE}px)`;
    }
    return `translateX(${caretX + TOOLTIP_SPACE}px)`;
  }

  getFormattedValue(value: number | unknown): string {
    if (isNaN(value as number)) {
      return '';
    }
    return new Intl.NumberFormat(this._locale, {
      style: 'currency',
      currency: this._defaultCurrencyCode,
      maximumFractionDigits: 0,
    }).format(value as number);
  }

  getPercentage(label: string) {
    if (label === this.labels[0]) return 0;
    const currentIndex = this.labels.findIndex((l) => l === label);
    const previousValue = this.chartData.datasets[0].data[currentIndex - 1];
    const currentValue = this.chartData.datasets[0].data[currentIndex];
    return ((currentValue - previousValue) / previousValue) * 100;
  }

  toggleDemo(): void {
    this.showDemo.update((value) => !value);
  }
}
