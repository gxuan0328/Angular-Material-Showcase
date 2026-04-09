/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update line-charts/line-chart-4`
*/

import {
  Component,
  inject,
  ChangeDetectorRef,
  LOCALE_ID,
  DEFAULT_CURRENCY_CODE,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  MatCard,
  MatCardHeader,
  MatCardContent,
  MatCardTitle,
  MatCardSubtitle,
} from '@angular/material/card';
import { ChartData, TooltipModel } from 'chart.js';

import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';
import { MatDivider } from '@angular/material/divider';

type SummaryItem = {
  name: string;
  value: string;
  changeType: 'positive' | 'negative' | null;
};

type DataPoint = {
  date: string;
  'Market Index': number;
  Portfolio: number;
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-line-chart-4',
  templateUrl: './line-chart-4.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatDivider,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
  ],
})
export class LineChart4Component {
  private _cdr = inject(ChangeDetectorRef);
  private _locale = inject(LOCALE_ID);
  private _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  tooltip: TooltipModel<'line'> | undefined;
  chartType = 'line' as const;

  private data: DataPoint[] = [
    { date: 'Aug 01', 'Market Index': 44.1, Portfolio: 79.2 },
    { date: 'Aug 02', 'Market Index': 49.1, Portfolio: 89.1 },
    { date: 'Aug 03', 'Market Index': 61.2, Portfolio: 91.7 },
    { date: 'Aug 04', 'Market Index': 49.7, Portfolio: 74.4 },
    { date: 'Aug 05', 'Market Index': 71.1, Portfolio: 95.3 },
    { date: 'Aug 06', 'Market Index': 75.3, Portfolio: 99.4 },
    { date: 'Aug 07', 'Market Index': 74.1, Portfolio: 101.2 },
    { date: 'Aug 08', 'Market Index': 78.4, Portfolio: 102.2 },
    { date: 'Aug 09', 'Market Index': 81.1, Portfolio: 103.6 },
    { date: 'Aug 10', 'Market Index': 82.6, Portfolio: 104.4 },
    { date: 'Aug 11', 'Market Index': 89.3, Portfolio: 106.3 },
    { date: 'Aug 12', 'Market Index': 79.3, Portfolio: 109.5 },
    { date: 'Aug 13', 'Market Index': 78.6, Portfolio: 110.4 },
    { date: 'Aug 14', 'Market Index': 73.8, Portfolio: 113.5 },
    { date: 'Aug 15', 'Market Index': 69.7, Portfolio: 114.1 },
    { date: 'Aug 16', 'Market Index': 62.6, Portfolio: 121.4 },
    { date: 'Aug 17', 'Market Index': 59.3, Portfolio: 120.4 },
    { date: 'Aug 18', 'Market Index': 57.1, Portfolio: 110.7 },
    { date: 'Aug 19', 'Market Index': 55.1, Portfolio: 118.8 },
    { date: 'Aug 20', 'Market Index': 54.3, Portfolio: 123.1 },
    { date: 'Aug 21', 'Market Index': 53.2, Portfolio: 110.2 },
    { date: 'Aug 22', 'Market Index': 49.4, Portfolio: 101.2 },
    { date: 'Aug 23', 'Market Index': 48.1, Portfolio: 99.2 },
    { date: 'Aug 24', 'Market Index': 27.1, Portfolio: 105.8 },
    { date: 'Aug 25', 'Market Index': 21.0, Portfolio: 109.4 },
    { date: 'Aug 26', 'Market Index': 21.3, Portfolio: 110.1 },
    { date: 'Aug 27', 'Market Index': 21.8, Portfolio: 119.6 },
    { date: 'Aug 28', 'Market Index': 29.4, Portfolio: 121.3 },
    { date: 'Aug 29', 'Market Index': 32.4, Portfolio: 129.1 },
    { date: 'Aug 30', 'Market Index': 37.1, Portfolio: 134.5 },
    { date: 'Aug 31', 'Market Index': 41.3, Portfolio: 144.2 },
    { date: 'Sep 01', 'Market Index': 48.1, Portfolio: 145.1 },
    { date: 'Sep 02', 'Market Index': 51.3, Portfolio: 142.5 },
    { date: 'Sep 03', 'Market Index': 52.8, Portfolio: 140.9 },
    { date: 'Sep 04', 'Market Index': 54.4, Portfolio: 138.7 },
    { date: 'Sep 05', 'Market Index': 57.1, Portfolio: 135.2 },
    { date: 'Sep 06', 'Market Index': 67.9, Portfolio: 136.2 },
    { date: 'Sep 07', 'Market Index': 78.8, Portfolio: 136.2 },
    { date: 'Sep 08', 'Market Index': 89.2, Portfolio: 146.2 },
    { date: 'Sep 09', 'Market Index': 99.2, Portfolio: 145.2 },
    { date: 'Sep 10', 'Market Index': 101.2, Portfolio: 141.8 },
    { date: 'Sep 11', 'Market Index': 104.2, Portfolio: 132.2 },
    { date: 'Sep 12', 'Market Index': 109.8, Portfolio: 129.2 },
    { date: 'Sep 13', 'Market Index': 110.4, Portfolio: 120.3 },
    { date: 'Sep 14', 'Market Index': 111.3, Portfolio: 123.4 },
    { date: 'Sep 15', 'Market Index': 114.3, Portfolio: 137.4 },
    { date: 'Sep 16', 'Market Index': 105.1, Portfolio: 130.1 },
    { date: 'Sep 17', 'Market Index': 89.3, Portfolio: 131.8 },
    { date: 'Sep 18', 'Market Index': 102.1, Portfolio: 149.4 },
    { date: 'Sep 19', 'Market Index': 101.7, Portfolio: 149.3 },
    { date: 'Sep 20', 'Market Index': 121.3, Portfolio: 153.2 },
    { date: 'Sep 21', 'Market Index': 132.5, Portfolio: 157.2 },
    { date: 'Sep 22', 'Market Index': 121.4, Portfolio: 139.1 },
    { date: 'Sep 23', 'Market Index': 100.1, Portfolio: 120.2 },
    { date: 'Sep 24', 'Market Index': 89.1, Portfolio: 119.1 },
    { date: 'Sep 25', 'Market Index': 97.1, Portfolio: 112.2 },
    { date: 'Sep 26', 'Market Index': 109.4, Portfolio: 129.1 },
  ];

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
          maxTicksLimit: 10,
        },
      },
      y: {
        display: true,
        border: {
          display: false,
        },
        grid: {
          display: true,
          color: '#66666650',
        },
        ticks: {
          maxTicksLimit: 5,
          callback: (value) => {
            return (
              this.formatCurrency({
                value: value as number,
                maximumFractionDigits: 0,
              }) + 'K'
            );
          },
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
    const latestData = this.data[this.data.length - 1];
    const firstData = this.data[0];
    const previousData = this.data[this.data.length - 2];

    const currentPortfolioValue = latestData.Portfolio * 1000; // Convert to actual dollar value
    const investedAmount = firstData.Portfolio * 0.5 * 1000; // Simulated invested amount
    const priceGain = currentPortfolioValue - investedAmount;

    return [
      {
        name: 'Portfolio value',
        value: this.formatCurrency({ value: currentPortfolioValue }),
        changeType: null,
      },
      {
        name: 'Invested',
        value: this.formatCurrency({ value: investedAmount }),
        changeType: null,
      },
      {
        name: 'Cashflow',
        value: this.formatCurrency({ value: currentPortfolioValue * 0.55 }),
        changeType: null,
      },
      {
        name: 'Price gain',
        value: this.formatCurrency({ value: priceGain, includeSign: true }),
        changeType: priceGain > 0 ? 'positive' : 'negative',
      },
      {
        name: 'Realized',
        value: this.formatCurrency({
          value: currentPortfolioValue * 0.0015,
          includeSign: true,
        }),
        changeType: 'positive',
      },
      {
        name: 'Dividends (gross)',
        value: this.formatCurrency({
          value: currentPortfolioValue * 0.004,
          includeSign: true,
        }),
        changeType: 'positive',
      },
    ];
  }

  get portfolioValue(): string {
    const latestData = this.data[this.data.length - 1];
    return this.formatCurrency({ value: latestData.Portfolio * 1000 });
  }

  get dailyChange(): { value: string; percent: string } {
    const latestData = this.data[this.data.length - 1];
    const previousData = this.data[this.data.length - 2];
    const change = (latestData.Portfolio - previousData.Portfolio) * 1000;
    const changePercent =
      ((latestData.Portfolio - previousData.Portfolio) /
        previousData.Portfolio) *
      100;

    return {
      value: this.formatCurrency({ value: change, includeSign: true }),
      percent: `${changePercent.toFixed(1)}%`,
    };
  }

  chartData: ChartData<'line', number[], string> = {
    labels: this.data.map((d) => d.date),
    datasets: [
      {
        data: this.data.map((d) => d.Portfolio),
        label: 'Portfolio',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgb(59, 130, 246)',
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
        fill: false,
      },
      {
        data: this.data.map((d) => d['Market Index']),
        label: 'Market Index',
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgb(139, 92, 246)',
        pointHoverBackgroundColor: 'rgb(139, 92, 246)',
        pointHoverBorderColor: 'rgb(139, 92, 246)',
        fill: false,
      },
    ],
  };

  formatCurrency({
    value,
    includeSign = false,
    maximumFractionDigits = 2,
  }: {
    value: number | unknown;
    includeSign?: boolean;
    maximumFractionDigits?: number;
  }): string {
    if (isNaN(value as number)) {
      return '';
    }
    const formatter = new Intl.NumberFormat(this._locale, {
      style: 'currency',
      currency: this._defaultCurrencyCode,
      maximumFractionDigits: maximumFractionDigits,
    });

    const formatted = formatter.format(Math.abs(value as number));

    if (includeSign) {
      return (value as number) >= 0 ? `+${formatted}` : `-${formatted}`;
    }

    return formatted;
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
