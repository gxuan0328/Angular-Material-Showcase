/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-tooltips/chart-tooltip-17`
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
import { DecimalPipe } from '@angular/common';
import { ProgressCircleComponent } from '../../components/progress-circle/progress-circle.component';

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-chart-tooltip-17',
  templateUrl: './chart-tooltip-17.component.html',
  imports: [
    BaseChartDirective,
    DecimalPipe,
    ProgressCircleComponent,
    MatButton,
  ],
})
export class ChartTooltip17Component {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly _locale = inject(LOCALE_ID);
  private readonly _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  readonly Number = Number;
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

  private gen(min: number, max: number): number[] {
    return this.labels.map(() => Math.floor(min + Math.random() * (max - min)));
  }

  chartData: ChartData<'bar', number[], string> = {
    labels: this.labels,
    datasets: [
      {
        data: this.gen(14000, 90000).sort(),
        label: 'Revenue',
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
          stepSize: 20000,
          callback: (v) => this.getFormattedValue(v),
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

  getFormattedValue(value: number | unknown): string {
    if (typeof value !== 'number') return '';
    return new Intl.NumberFormat(this._locale, {
      style: 'currency',
      currency: this._defaultCurrencyCode,
      maximumFractionDigits: 0,
    }).format(value);
  }

  toggleDemo(): void {
    this.showDemo.update((value) => !value);
  }
}
