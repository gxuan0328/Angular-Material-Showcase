/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-tooltips/chart-tooltip-19`
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
import {
  MatList,
  MatListItem,
  MatListItemIcon,
  MatListItemTitle,
} from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import {
  ChartConfiguration,
  ChartData,
  TooltipItem,
  TooltipModel,
} from 'chart.js';

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-chart-tooltip-19',
  templateUrl: './chart-tooltip-19.component.html',
  imports: [
    BaseChartDirective,
    MatList,
    MatListItem,
    MatListItemTitle,
    MatListItemIcon,
    MatDivider,
    MatButton,
  ],
})
export class ChartTooltip19Component {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly _locale = inject(LOCALE_ID);
  private readonly _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  tooltip: TooltipModel<'bar'> | undefined;
  pieChartData: ChartData<'pie', number[], string> | null = null;
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
  ];

  private gen(min: number, max: number): number[] {
    return this.labels.map(() => Math.floor(min + Math.random() * (max - min)));
  }

  chartData: ChartData<'bar', number[], string> = {
    labels: this.labels,
    datasets: [
      {
        data: this.gen(800, 1800),
        label: 'Europe',
        backgroundColor: 'rgba(99, 102, 241)',
        borderColor: 'rgb(99, 102, 241)',
      },
      {
        data: this.gen(600, 1200),
        label: 'Asia',
        backgroundColor: 'rgba(139, 92, 246)',
        borderColor: 'rgb(139, 92, 246)',
      },
      {
        data: this.gen(1000, 2000),
        label: 'North America',
        backgroundColor: 'rgba(217, 70, 239)',
        borderColor: 'rgb(217, 70, 239)',
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
          this.updatePieChartData();
          this.cdr.markForCheck();
        },
      },
    },
    interaction: { intersect: false, mode: 'index' as const },
    scales: {
      x: {
        grid: { display: false },
        stacked: true,
      },
      y: {
        grid: { display: true, color: '#66666650' },
        border: { display: false },
        ticks: { maxTicksLimit: 4 },
        stacked: true,
      },
    },
  } as const;

  getTooltipTransform(
    caretX: number,
    tooltipWidth: number,
    chartWidth: number,
  ): string {
    if (caretX >= chartWidth / 2)
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

  getPercentage(
    value: number | unknown,
    dataPoints: TooltipItem<'bar'>[] | undefined,
  ): string {
    if (typeof value !== 'number' || !dataPoints) return '';
    const total = dataPoints.reduce(
      (acc, curr) => acc + (curr.raw as number),
      0,
    );
    return ((value / total) * 100).toFixed(1) + '%';
  }

  getTotal(dataPoints: TooltipItem<'bar'>[] | undefined): number {
    if (!dataPoints) return 0;
    return dataPoints.reduce((acc, curr) => acc + (curr.raw as number), 0);
  }

  private updatePieChartData(): void {
    if (!this.tooltip?.dataPoints) {
      this.pieChartData = null;
      return;
    }

    this.pieChartData = {
      labels: this.tooltip.dataPoints.map((dp) => dp.dataset.label || ''),
      datasets: [
        {
          data: this.tooltip.dataPoints.map((dp) => dp.raw as number),
          backgroundColor: this.tooltip.dataPoints.map(
            (dp) => dp.dataset.backgroundColor as string,
          ),
          borderWidth: 0,
        },
      ],
    };
  }

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    animation: { duration: 0 },
  };

  toggleDemo(): void {
    this.showDemo.update((value) => !value);
  }
}
