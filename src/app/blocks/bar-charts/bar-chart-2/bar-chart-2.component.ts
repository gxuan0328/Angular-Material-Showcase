/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bar-charts/bar-chart-2`
*/

import {
  ChangeDetectorRef,
  Component,
  DEFAULT_CURRENCY_CODE,
  inject,
  LOCALE_ID,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
} from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { ChartData, ChartOptions, TooltipModel } from 'chart.js';

type SummaryItem = {
  name: string;
  value: number;
  color: string;
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-bar-chart-2',

  imports: [
    BaseChartDirective,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatDivider,
    MatCardSubtitle,
  ],
  templateUrl: './bar-chart-2.component.html',
})
export class BarChart2Component {
  readonly Number = Number;
  private readonly cdr = inject(ChangeDetectorRef);
  private _locale = inject(LOCALE_ID);
  private readonly _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
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
    const series: number[] = [];
    for (let i = 0; i < length; i++) {
      series.push(Math.floor(min + Math.random() * (max - min)));
    }
    return series;
  }

  chartData: ChartData<'bar', number[], string> = {
    labels: this.labels,
    datasets: [
      {
        data: this.generateSeries(this.labels.length, 26000, 90000),
        label: 'Europe',
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246)',
        borderWidth: 1,
        stack: 'stack-0',
      },
      {
        data: this.generateSeries(this.labels.length, 22000, 76000),
        label: 'Asia',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246)',
        borderWidth: 1,
        stack: 'stack-0',
      },
      {
        data: this.generateSeries(this.labels.length, 24000, 98000),
        label: 'North America',
        borderColor: 'rgb(6, 182, 212)',
        backgroundColor: 'rgba(6, 182, 212)',
        borderWidth: 1,
        stack: 'stack-0',
      },
    ],
  };

  chartOptions: ChartOptions<'bar'> = {
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
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: true },
      },
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

  get summary(): SummaryItem[] {
    return this.chartData.datasets.map((dataset) => ({
      name: dataset.label ?? '',
      value: dataset.data.reduce(
        (acc, v) => acc + (typeof v === 'number' ? v : 0),
        0,
      ),
      color: (dataset.backgroundColor as string) ?? '',
    }));
  }

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
    return (
      new Intl.NumberFormat(this._locale, {
        style: 'currency',
        currency: this._defaultCurrencyCode,
        maximumFractionDigits: 0,
      }).format((value as number) / 1000) + (value === 0 ? '' : 'K')
    );
  }
}
