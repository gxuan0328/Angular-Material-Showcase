/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update line-charts/line-chart-3`
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
import { MatList, MatListItem } from '@angular/material/list';

import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';
import { MatDivider } from '@angular/material/divider';

type LocationSummary = {
  location: string;
  address: string;
  color: string;
  type: string;
  total: number;
  change: string;
  changeType: 'positive' | 'negative';
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-line-chart-3',
  templateUrl: './line-chart-3.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatList,
    MatListItem,
    MatDivider,
    MatCardSubtitle,
  ],
})
export class LineChart3Component {
  private _cdr = inject(ChangeDetectorRef);
  private _locale = inject(LOCALE_ID);
  private _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  tooltip: TooltipModel<'line'> | undefined;
  chartType = 'line' as const;

  chartData: ChartData<'line', number[], string> = {
    labels: [
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
    ],
    datasets: [
      {
        data: [
          48230, 56890, 51340, 64120, 45980, 53460, 53940, 45020, 52110, 57820,
          5591, 6272,
        ],
        label: 'Berlin',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgb(59, 130, 246)',
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
        fill: false,
      },
      {
        data: [
          25360, 36740, 26610, 15240, 18630, 20850, 22670, 12400, 28090, 17890,
          3263, 2584,
        ],
        label: 'Hamburg',
        borderColor: 'rgb(6, 182, 212)',
        backgroundColor: 'rgb(6, 182, 212)',
        pointHoverBackgroundColor: 'rgb(6, 182, 212)',
        pointHoverBorderColor: 'rgb(6, 182, 212)',
        fill: false,
      },
      {
        data: [
          14110, 11710, 12380, 8970, 13980, 11630, 14370, 5280, 14370, 11860,
          2365, 1679,
        ],
        label: 'Frankfurt',
        borderColor: 'rgb(125, 211, 252)',
        backgroundColor: 'rgb(125, 211, 252)',
        pointHoverBackgroundColor: 'rgb(125, 211, 252)',
        pointHoverBorderColor: 'rgb(125, 211, 252)',
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
          maxTicksLimit: 6,
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

  summary: LocationSummary[] = [
    {
      location: 'Berlin',
      address: 'Unter den Linden',
      color: 'rgb(59, 130, 246)',
      type: 'Flagship',
      total: 523400,
      change: '+0.9%',
      changeType: 'positive',
    },
    {
      location: 'Hamburg',
      address: 'Mönckebergstraße',
      color: 'rgb(6, 182, 212)',
      type: 'In-Store',
      total: 269500,
      change: '-1.4%',
      changeType: 'negative',
    },
    {
      location: 'Frankfurt',
      address: 'Zeil',
      color: 'rgb(125, 211, 252)',
      type: 'In-Store',
      total: 134200,
      change: '+5.2%',
      changeType: 'positive',
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

  getFormattedValue({
    value,
    skipPostfix,
  }: {
    value: number | unknown;
    skipPostfix: boolean;
  }): string {
    if (isNaN(value as number)) {
      return '';
    }
    const numValue = value as number;
    const dividedValue = numValue > 1000 ? numValue / 1000 : numValue;
    const formatted = new Intl.NumberFormat(this._locale, {
      style: 'currency',
      currency: this._defaultCurrencyCode,
      maximumFractionDigits: 0,
    }).format(skipPostfix ? numValue : dividedValue);
    return (
      formatted +
      (dividedValue === 0 || skipPostfix ? '' : numValue > 1000 ? 'K' : '')
    );
  }
}
