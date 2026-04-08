/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update donut-charts/donut-chart-7`
*/

import {
  Component,
  inject,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, TooltipModel } from 'chart.js';

type AssetItem = {
  name: string;
  amount: number;
  share: string;
  href: string;
  borderColor: string;
};

@Component({
  selector: 'ngm-dev-block-donut-chart-7',
  templateUrl: './donut-chart-7.component.html',
  imports: [BaseChartDirective],
})
export class DonutChart7Component {
  private _locale = inject(LOCALE_ID);
  private _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  tooltip: TooltipModel<'doughnut'> | undefined;
  chartType = 'doughnut' as const;

  data: AssetItem[] = [
    {
      name: 'Technology Stocks',
      amount: 2789560,
      share: '85.4%',
      href: '#',
      borderColor: 'bg-blue-500',
    },
    {
      name: 'Healthcare Stocks',
      amount: 324780,
      share: '10.0%',
      href: '#',
      borderColor: 'bg-violet-500',
    },
    {
      name: 'Commodities',
      amount: 150890,
      share: '4.6%',
      href: '#',
      borderColor: 'bg-fuchsia-500',
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
    cutout: '70%',
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
