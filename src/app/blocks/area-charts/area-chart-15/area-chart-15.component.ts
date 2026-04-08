/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update area-charts/area-chart-15`
*/

import {
  Component,
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
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';

type SummaryItem = {
  category: string;
  total: string | number;
  color: string | null;
  percentage?: boolean;
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-area-chart-15',
  templateUrl: './area-chart-15.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatDivider,
    DecimalPipe,
    CurrencyPipe,
  ],
})
export class AreaChart15Component {
  private _cdr = inject(ChangeDetectorRef);
  readonly Number = Number;
  private _locale = inject(LOCALE_ID);
  private readonly _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
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
          42340, 50120, 45190, 56420, 40420, 47010, 47490, 39610, 45860, 50910,
          49190, 55190,
        ],
        label: 'Actual costs',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
      },
      {
        data: [
          32330, 40100, 38240, 31200, 34900, 36800, 34560, 31260, 29240, 31220,
          33020, 36090,
        ],
        label: 'Potential costs',
        borderColor: 'rgb(6, 182, 212)',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4,
        pointHoverBackgroundColor: 'rgb(6, 182, 212)',
        pointHoverBorderColor: 'rgb(6, 182, 212)',
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
        position: 'nearest',
        external: ({ tooltip }) => {
          this.tooltip = tooltip;
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
        },
      },
      y: {
        display: true,
        position: 'left',
        grid: {
          display: true,
          color: '#66666650',
        },
        border: {
          display: false,
        },
        ticks: {
          display: true,
          maxTicksLimit: 4,
          callback: (value) => {
            return (
              new Intl.NumberFormat(this._locale, {
                style: 'currency',
                currency: this._defaultCurrencyCode,
                maximumFractionDigits: 0,
              }).format((value as number) / 1000) + 'K'
            );
          },
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
  };

  get summary(): SummaryItem[] {
    const actualCosts =
      this.chartData.datasets
        .find((d) => d.label === 'Actual costs')
        ?.data.reduce((acc, curr) => acc + curr, 0) || 0;
    const potentialCosts =
      this.chartData.datasets
        .find((d) => d.label === 'Potential costs')
        ?.data.reduce((acc, curr) => acc + curr, 0) || 0;
    const savingsPercent =
      actualCosts > 0
        ? ((actualCosts - potentialCosts) / actualCosts) * 100
        : 0;
    const savingsDollar = actualCosts - potentialCosts;

    return [
      {
        category: 'Actual costs',
        total: actualCosts,
        color: 'rgb(59, 130, 246)',
      },
      {
        category: 'Potential costs',
        total: potentialCosts,
        color: 'rgb(6, 182, 212)',
      },
      {
        category: 'Potential savings (%)',
        total: savingsPercent.toFixed(1),
        color: null,
        percentage: true,
      },
      {
        category: `Potential savings (${this._defaultCurrencyCode})`,
        total: savingsDollar,
        color: null,
      },
    ];
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
