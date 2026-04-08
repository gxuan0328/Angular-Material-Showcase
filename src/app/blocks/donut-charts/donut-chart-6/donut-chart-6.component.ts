/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update donut-charts/donut-chart-6`
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
  MatListItemTitle,
  MatListItemLine,
} from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import { CurrencyPipe } from '@angular/common';

type AssetItem = {
  name: string;
  amount: number;
  share: string;
  href: string;
  borderColor: string;
  color: string;
};

@Component({
  selector: 'ngm-dev-block-donut-chart-6',
  templateUrl: './donut-chart-6.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatListItemTitle,
    MatListItemLine,
  ],
})
export class DonutChart6Component {
  private _locale = inject(LOCALE_ID);
  private _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  chartType = 'doughnut' as const;

  data: AssetItem[] = [
    {
      name: 'Growth Stocks',
      amount: 2845920,
      share: '86.2%',
      href: '#',
      borderColor: 'bg-blue-500',
      color: '#3b82f6',
    },
    {
      name: 'Value Stocks',
      amount: 342180,
      share: '10.4%',
      href: '#',
      borderColor: 'bg-violet-500',
      color: '#8b5cf6',
    },
    {
      name: 'Cash Reserves',
      amount: 112450,
      share: '3.4%',
      href: '#',
      borderColor: 'bg-fuchsia-500',
      color: '#d946ef',
    },
  ];

  chartData: ChartData<'doughnut', number[], string> = {
    labels: this.data.map((item) => item.name),
    datasets: [
      {
        data: this.data.map((item) => item.amount),
        backgroundColor: ['#3b82f6', '#8b5cf6', '#d946ef'],
        borderWidth: 0,
      },
    ],
  };

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
