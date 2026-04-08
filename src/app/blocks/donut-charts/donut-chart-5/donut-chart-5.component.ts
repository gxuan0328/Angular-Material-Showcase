/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update donut-charts/donut-chart-5`
*/

import {
  Component,
  inject,
  DEFAULT_CURRENCY_CODE,
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
import { ChartConfiguration, ChartData } from 'chart.js';
import {
  MatList,
  MatListItem,
  MatListItemIcon,
  MatNavList,
  MatListItemMeta,
} from '@angular/material/list';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';

type InvestmentItem = {
  name: string;
  amount: number;
  share: string;
  color: string;
};

type CategoryData = {
  name: string;
  data: InvestmentItem[];
};

type ChartDataset = {
  name: string;
  chartData: ChartData<'doughnut', number[], string>;
};

@Component({
  selector: 'ngm-dev-block-donut-chart-5',
  templateUrl: './donut-chart-5.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    MatTabGroup,
    MatTab,
    MatDivider,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatListItemMeta,
    MatIcon,
  ],
})
export class DonutChart5Component {
  private _locale = inject(LOCALE_ID);
  private _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  chartType = 'doughnut' as const;

  chartDatasets: ChartDataset[] = [
    {
      name: 'Asset Class',
      chartData: {
        labels: [
          'Public Equity',
          'Private Equity',
          'Fixed Income',
          'Real Estate',
        ],
        datasets: [
          {
            data: [2890450, 356780, 198340, 89620],
            backgroundColor: ['#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6'],
            borderWidth: 0,
          },
        ],
      },
    },
    {
      name: 'Industry Sector',
      chartData: {
        labels: [
          'Technology',
          'Healthcare',
          'Financial Services',
          'Consumer Goods',
          'Energy & Utilities',
        ],
        datasets: [
          {
            data: [1245670, 987340, 734920, 312450, 254810],
            backgroundColor: [
              '#06b6d4',
              '#3b82f6',
              '#6366f1',
              '#8b5cf6',
              '#d946ef',
            ],
            borderWidth: 0,
          },
        ],
      },
    },
  ];

  get summary(): CategoryData[] {
    return this.chartDatasets.map((dataset) => ({
      name: dataset.name,
      data: this.calculateSummaryData(dataset.chartData),
    }));
  }

  private calculateSummaryData(
    chartData: ChartData<'doughnut', number[], string>,
  ): InvestmentItem[] {
    const data = chartData.datasets[0].data;
    const labels = chartData.labels as string[];
    const colors = chartData.datasets[0].backgroundColor as string[];
    const total = data.reduce((sum, value) => sum + value, 0);

    return data.map((amount, index) => ({
      name: labels[index],
      amount,
      color: colors[index],
      share: `${((amount / total) * 100).toFixed(1)}%`,
    }));
  }

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    cutout: '60%',
  };

  currencyFormatter(value: number): string {
    return new Intl.NumberFormat(this._locale, {
      style: 'currency',
      currency: this._defaultCurrencyCode,
      maximumFractionDigits: 0,
    }).format(value);
  }

  getTotal(data: number[]): number {
    return data.reduce((acc, curr) => acc + curr, 0);
  }
}
