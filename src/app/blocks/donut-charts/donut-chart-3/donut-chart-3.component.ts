/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update donut-charts/donut-chart-3`
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
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { MatDivider } from '@angular/material/divider';

type ExpenseItem = {
  name: string;
  amount: number;
  share: string;
  color: string;
};

type CategoryData = {
  name: string;
  data: ExpenseItem[];
};

type ChartDataset = {
  name: string;
  chartData: ChartData<'doughnut', number[], string>;
};

@Component({
  selector: 'ngm-dev-block-donut-chart-3',
  templateUrl: './donut-chart-3.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatTabGroup,
    MatTab,
    MatDivider,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
  ],
})
export class DonutChart3Component {
  private _locale = inject(LOCALE_ID);
  private _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  chartType = 'doughnut' as const;

  chartDatasets: ChartDataset[] = [
    {
      name: 'Department',
      chartData: {
        labels: ['Engineering', 'Sales', 'Marketing', 'Support', 'Operations'],
        datasets: [
          {
            data: [8920, 6840, 5670, 3120, 1580],
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
    {
      name: 'Project',
      chartData: {
        labels: [
          'Product Alpha',
          'Platform Beta',
          'Service Gamma',
          'Tool Delta',
          'Infrastructure',
        ],
        datasets: [
          {
            data: [7340, 6920, 5480, 4160, 2230],
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
  ): ExpenseItem[] {
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
