/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bar-charts/bar-chart-3`
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
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { ChartConfiguration, ChartData, TooltipModel } from 'chart.js';
import { MatChipSet, MatChip } from '@angular/material/chips';

type SummaryItem = {
  name: string;
  value: number;
  color: string;
};

type GenerateSeriesOptions = {
  length: number;
  min: number;
  max: number;
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-bar-chart-3',

  imports: [
    BaseChartDirective,
    MatCard,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatCardContent,
    MatDivider,
    MatChipSet,
    MatChip,
  ],
  templateUrl: './bar-chart-3.component.html',
})
export class BarChart3Component {
  private readonly cdr = inject(ChangeDetectorRef);
  private _locale = inject(LOCALE_ID);
  private readonly _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  tooltip: TooltipModel<'bar'> | undefined;
  chartType = 'bar' as const;

  readonly title = 'Sales overview';
  readonly description = 'Quarterly comparison at a glance.';

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

  private generateSeries(options: GenerateSeriesOptions): number[] {
    const { length, min, max } = options;
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
        data: this.generateSeries({
          length: this.labels.length,
          min: 24000,
          max: 82000,
        }),
        label: 'Last Year',
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246)',
        borderWidth: 1,
      },
      {
        data: this.generateSeries({
          length: this.labels.length,
          min: 32000,
          max: 100000,
        }),
        label: 'This Year',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246)',
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

  get summary(): SummaryItem[] {
    return this.chartData.datasets.map((d) => ({
      name: d.label ?? '',
      value: d.data.reduce(
        (acc, v) => acc + (typeof v === 'number' ? v : 0),
        0,
      ),
      color: (d.backgroundColor as string) ?? '',
    }));
  }

  get summaryWithPercentage(): (SummaryItem & { percentageChange?: number })[] {
    const summaryData = this.summary;
    const thisYear = summaryData.find((item) => item.name === 'This Year');
    const lastYear = summaryData.find((item) => item.name === 'Last Year');

    let percentageChange: number | undefined;
    if (thisYear && lastYear && lastYear.value > 0) {
      percentageChange = Math.round(
        ((thisYear.value - lastYear.value) / lastYear.value) * 100,
      );
    }

    return summaryData.map((item) => ({
      ...item,
      percentageChange:
        item.name === 'This Year' ? percentageChange : undefined,
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
