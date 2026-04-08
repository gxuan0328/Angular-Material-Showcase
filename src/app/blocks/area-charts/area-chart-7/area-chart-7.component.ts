/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update area-charts/area-chart-7`
*/

import {
  Component,
  computed,
  signal,
  inject,
  LOCALE_ID,
  DEFAULT_CURRENCY_CODE,
  ChangeDetectorRef,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
} from '@angular/material/card';
import { ChartData, TooltipModel } from 'chart.js';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';
import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-area-chart-7',
  templateUrl: './area-chart-7.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatDivider,
    MatList,
    MatListItem,
    MatListItemIcon,
    DecimalPipe,
    CurrencyPipe,
  ],
})
export class AreaChart7Component {
  private _cdr = inject(ChangeDetectorRef);
  readonly Number = Number;
  private _locale = inject(LOCALE_ID);
  private readonly _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  tooltip: TooltipModel<'line'> | undefined;
  chartType = 'line' as const;
  chartPlugins = [verticalHoverLinePlugin];
  private data = [
    2340, 3110, 4643, 4650, 3980, 4702, 5990, 5700, 4250, 4182, 3812, 4900,
  ];
  private labels = [
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

  private _currentIndex = signal(0);

  formattedValue = computed(() =>
    this.currencyFormatter(this.data[this._currentIndex()]),
  );
  currentDate = computed(() => this.labels[this._currentIndex()]);
  changeText = computed(() => {
    const currentValue = this.data[this._currentIndex()];
    const previousValue = this.data[this._currentIndex() - 1];
    if (this._currentIndex() === 0 || !previousValue) return '--';

    const percentageChange =
      ((currentValue - previousValue) / previousValue) * 100;
    const absoluteChange = currentValue - previousValue;

    const formattedPercentage = `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`;
    const formattedAbsolute = `${absoluteChange >= 0 ? '+' : '-'}${this.currencyFormatter(Math.abs(absoluteChange))}`;

    return `${formattedPercentage} (${formattedAbsolute})`;
  });

  changeColorClass = computed(() => {
    if (this._currentIndex() === 0) return 'text-gray-600 dark:text-gray-400';

    const currentValue = this.data[this._currentIndex()];
    const previousValue = this.data[this._currentIndex() - 1];
    const percentageChange =
      ((currentValue - previousValue) / previousValue) * 100;

    return percentageChange > 0
      ? 'text-emerald-700 dark:text-emerald-500'
      : 'text-red-700 dark:text-red-500';
  });

  chartData: ChartData<'line', number[], string> = {
    labels: this.labels,
    datasets: [
      {
        data: this.data,
        label: 'Revenue',
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointHoverBackgroundColor: 'rgb(139, 92, 246)',
        pointHoverBorderColor: 'rgb(139, 92, 246)',
      },
    ],
  };

  chartOptions: CustomChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        position: 'nearest',
        external: ({ tooltip }) => {
          this.tooltip = tooltip;
          if (tooltip.dataPoints?.length) {
            this._currentIndex.set(tooltip.dataPoints[0].dataIndex);
          }
          this._cdr.markForCheck();
        },
      },
      verticalHoverLine: {
        color: '#66666650',
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          display: true,
          align: 'inner',
          callback: (_tickValue, index, ticks) => {
            if (index === 0 || index === ticks.length - 1) {
              return this.chartData.labels?.[index] ?? '';
            }
            return;
          },
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: '#66666650',
        },
        border: {
          display: false,
        },
        ticks: {
          display: false,
          maxTicksLimit: 4,
        },
        title: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 4,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    layout: {
      padding: {
        left: -8,
      },
    },
  };

  get summary() {
    return this.chartData.datasets.map((dataset) => ({
      name: dataset.label ?? '',
      value: dataset.data.reduce((acc, curr) => acc + curr, 0),
      color: dataset.borderColor?.toString() ?? '',
    }));
  }

  private currencyFormatter(value: number): string {
    return new Intl.NumberFormat(this._locale, {
      style: 'currency',
      currency: this._defaultCurrencyCode,
    }).format(value);
  }

  getTooltipTransform(
    caretX: number,
    tooltipWidth: number,
    chartWidth: number,
  ): string {
    // If tooltip would extend beyond the right half of the chart
    if (caretX >= chartWidth / 2) {
      // Position tooltip to the left of the caret point
      return `translateX(${caretX - tooltipWidth - TOOLTIP_SPACE}px)`;
    } else {
      // Position tooltip to the right of the caret point (default behavior)
      return `translateX(${caretX + TOOLTIP_SPACE}px)`;
    }
  }
}
