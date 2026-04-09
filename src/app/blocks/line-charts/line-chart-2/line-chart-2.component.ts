/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update line-charts/line-chart-2`
*/

import { Component, inject, ChangeDetectorRef, LOCALE_ID } from '@angular/core';
import { DEFAULT_CURRENCY_CODE } from '@angular/core';
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
import { MatList, MatListItem } from '@angular/material/list';
import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';

type SummaryItem = {
  name: string;
  value: number;
};

const TOOLTIP_SPACE = 8;
const ONE_BILLION = 1000000000;
const ONE_MILLION = 1000000;
const ONE_THOUSAND = 1000;

@Component({
  selector: 'ngm-dev-block-line-chart-2',
  templateUrl: './line-chart-2.component.html',
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
  ],
})
export class LineChart2Component {
  private _cdr = inject(ChangeDetectorRef);
  private _locale = inject(LOCALE_ID);
  private _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  tooltip: TooltipModel<'line'> | undefined;
  chartType = 'line' as const;

  chartData: ChartData<'line', number[], string> = {
    labels: [
      'Aug 01',
      'Aug 02',
      'Aug 03',
      'Aug 04',
      'Aug 05',
      'Aug 06',
      'Aug 07',
      'Aug 08',
      'Aug 09',
      'Aug 10',
      'Aug 11',
      'Aug 12',
      'Aug 13',
      'Aug 14',
      'Aug 15',
      'Aug 16',
      'Aug 17',
      'Aug 18',
      'Aug 19',
      'Aug 20',
      'Aug 21',
      'Aug 22',
      'Aug 23',
      'Aug 24',
      'Aug 25',
      'Aug 26',
      'Aug 27',
      'Aug 28',
      'Aug 29',
      'Aug 30',
      'Aug 31',
      'Sep 01',
      'Sep 02',
      'Sep 03',
      'Sep 04',
      'Sep 05',
      'Sep 06',
      'Sep 07',
      'Sep 08',
      'Sep 09',
      'Sep 10',
      'Sep 11',
      'Sep 12',
      'Sep 13',
      'Sep 14',
      'Sep 15',
      'Sep 16',
      'Sep 17',
      'Sep 18',
      'Sep 19',
      'Sep 20',
      'Sep 21',
      'Sep 22',
      'Sep 23',
      'Sep 24',
      'Sep 25',
      'Sep 26',
    ],
    datasets: [
      {
        data: [
          28.4, 34.2, 52.8, 58.9, 63.1, 65.4, 45.2, 66.8, 68.5, 68.2, 69.5,
          70.3, 71.1, 72.6, 78.2, 87.1, 112.5, 113.0, 115.5, 121.4, 74.1, 76.4,
          87.1, 98.6, 99.8, 104.2, 109.1, 110.1, 112.5, 110.0, 122.1, 134.8,
          137.6, 131.8, 133.5, 136.2, 139.7, 141.4, 143.2, 147.1, 148.8, 150.6,
          143.5, 140.8, 136.0, 132.2, 129.5, 111.5, 133.0, 141.3, 144.1, 154.6,
          156.4, 157.0, 164.1, 174.7, 189.8,
        ],
        label: 'price',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgb(59, 130, 246)',
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
        fill: false,
      },
    ],
  };

  chartPlugins = [verticalHoverLinePlugin];

  chartOptions: CustomChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        external: (context) => {
          this.tooltip = context.tooltip;
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
          maxRotation: 0,
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: '#66666650',
        },
        ticks: {
          display: false,
          maxTicksLimit: 8,
        },
        border: {
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
  };

  summary: SummaryItem[] = [
    {
      name: 'Open',
      value: 168.42,
    },
    {
      name: 'High',
      value: 169.75,
    },
    {
      name: 'Volume',
      value: 528_000_000,
    },
    {
      name: 'Low',
      value: 196.28,
    },
    {
      name: 'Close',
      value: 189.81,
    },
    {
      name: 'Market Cap',
      value: 1_730_000_000_000,
    },
  ];

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

  getFormattedValue(value: number | unknown): string {
    if (isNaN(value as number)) {
      return '';
    }
    const numValue = value as number;
    const dividedValue =
      numValue > ONE_BILLION
        ? numValue / ONE_BILLION
        : numValue > ONE_MILLION
          ? numValue / ONE_MILLION
          : numValue > ONE_THOUSAND
            ? numValue / ONE_THOUSAND
            : numValue;
    const formatted = new Intl.NumberFormat(this._locale, {
      style: 'currency',
      currency: this._defaultCurrencyCode,
      maximumFractionDigits:
        numValue > ONE_BILLION ||
        numValue > ONE_MILLION ||
        numValue > ONE_THOUSAND
          ? 0
          : 2,
    }).format(dividedValue);
    return (
      formatted +
      (dividedValue === 0
        ? ''
        : numValue > ONE_BILLION
          ? 'B'
          : numValue > ONE_MILLION
            ? 'M'
            : numValue > ONE_THOUSAND
              ? 'K'
              : '')
    );
  }
}
