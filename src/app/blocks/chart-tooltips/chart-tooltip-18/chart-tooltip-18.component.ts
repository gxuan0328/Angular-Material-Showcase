/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-tooltips/chart-tooltip-18`
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
import { CategoryBarComponent } from '../../components/category-bar/category-bar.component';
import {
  AvailableChartColors,
  getColorClassName,
} from '../../utils/functions/chart-utils';

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-chart-tooltip-18',
  templateUrl: './chart-tooltip-18.component.html',
  imports: [
    BaseChartDirective,
    MatList,
    MatListItem,
    MatListItemTitle,
    MatListItemIcon,
    MatDivider,
    CategoryBarComponent,
    MatButton,
  ],
})
export class ChartTooltip18Component {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly _locale = inject(LOCALE_ID);
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
        backgroundColor: getColorClassName(AvailableChartColors[0], 'hex'),
        borderColor: getColorClassName(AvailableChartColors[0], 'hex'),
      },
      {
        data: this.gen(600, 1200),
        label: 'Asia',
        backgroundColor: getColorClassName(AvailableChartColors[1], 'hex'),
        borderColor: getColorClassName(AvailableChartColors[1], 'hex'),
      },
      {
        data: this.gen(1000, 2000),
        label: 'North America',
        backgroundColor: getColorClassName(AvailableChartColors[2], 'hex'),
        borderColor: getColorClassName(AvailableChartColors[2], 'hex'),
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

  getValues(dataPoints: TooltipItem<'bar'>[] | undefined): number[] {
    if (!dataPoints) return [];
    return dataPoints.map((point) => point.raw as number);
  }

  toggleDemo(): void {
    this.showDemo.update((value) => !value);
  }
}
