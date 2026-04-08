/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update spark-area-charts/spark-area-chart-3`
*/

import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { ChartData, ChartConfiguration } from 'chart.js';

type StockData = {
  date: string;
  RIVN: number;
  PLTR: number;
  COIN: number;
  ROKU: number;
  SQ: number;
  SNAP: number;
};

type Stock = {
  ticker: string;
  description: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  chartData: ChartData<'line', number[], string>;
};

type Tab = {
  name: string;
  stocks: Stock[];
};

@Component({
  selector: 'ngm-dev-block-spark-area-chart-3',
  templateUrl: './spark-area-chart-3.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatCardContent,
    MatTabGroup,
    MatTab,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
  ],
})
export class SparkAreaChart3Component {
  chartType = 'line' as const;

  data: StockData[] = [
    {
      date: 'Oct 15, 2024',
      RIVN: 12.8,
      PLTR: 24.5,
      COIN: 158.7,
      ROKU: 61.2,
      SQ: 68.9,
      SNAP: 9.4,
    },
    {
      date: 'Oct 16, 2024',
      RIVN: 13.2,
      PLTR: 25.1,
      COIN: 162.3,
      ROKU: 63.8,
      SQ: 71.2,
      SNAP: 9.8,
    },
    {
      date: 'Oct 17, 2024',
      RIVN: 12.9,
      PLTR: 24.8,
      COIN: 159.6,
      ROKU: 62.4,
      SQ: 69.7,
      SNAP: 9.6,
    },
    {
      date: 'Oct 18, 2024',
      RIVN: 13.6,
      PLTR: 25.7,
      COIN: 165.2,
      ROKU: 64.9,
      SQ: 72.8,
      SNAP: 10.1,
    },
    {
      date: 'Oct 19, 2024',
      RIVN: 14.1,
      PLTR: 26.3,
      COIN: 168.5,
      ROKU: 66.2,
      SQ: 74.5,
      SNAP: 10.4,
    },
    {
      date: 'Oct 22, 2024',
      RIVN: 15.2,
      PLTR: 28.1,
      COIN: 174.8,
      ROKU: 69.7,
      SQ: 78.2,
      SNAP: 11.1,
    },
    {
      date: 'Oct 23, 2024',
      RIVN: 15.8,
      PLTR: 29.4,
      COIN: 179.3,
      ROKU: 71.5,
      SQ: 80.9,
      SNAP: 11.6,
    },
    {
      date: 'Oct 24, 2024',
      RIVN: 16.5,
      PLTR: 30.8,
      COIN: 183.7,
      ROKU: 73.8,
      SQ: 83.4,
      SNAP: 12.2,
    },
    {
      date: 'Oct 25, 2024',
      RIVN: 16.1,
      PLTR: 30.2,
      COIN: 181.5,
      ROKU: 72.9,
      SQ: 82.1,
      SNAP: 11.9,
    },
    {
      date: 'Oct 26, 2024',
      RIVN: 15.7,
      PLTR: 29.6,
      COIN: 178.9,
      ROKU: 71.3,
      SQ: 80.6,
      SNAP: 11.5,
    },
    {
      date: 'Oct 29, 2024',
      RIVN: 15.3,
      PLTR: 28.9,
      COIN: 176.2,
      ROKU: 69.8,
      SQ: 79.1,
      SNAP: 11.2,
    },
    {
      date: 'Oct 30, 2024',
      RIVN: 14.9,
      PLTR: 28.3,
      COIN: 173.6,
      ROKU: 68.4,
      SQ: 77.8,
      SNAP: 10.9,
    },
    {
      date: 'Oct 31, 2024',
      RIVN: 14.6,
      PLTR: 27.8,
      COIN: 171.4,
      ROKU: 67.1,
      SQ: 76.5,
      SNAP: 10.6,
    },
    {
      date: 'Nov 01, 2024',
      RIVN: 15.1,
      PLTR: 28.5,
      COIN: 174.7,
      ROKU: 68.9,
      SQ: 78.2,
      SNAP: 11.0,
    },
    {
      date: 'Nov 04, 2024',
      RIVN: 15.7,
      PLTR: 29.2,
      COIN: 178.3,
      ROKU: 70.6,
      SQ: 80.1,
      SNAP: 11.4,
    },
    {
      date: 'Nov 05, 2024',
      RIVN: 16.2,
      PLTR: 29.8,
      COIN: 181.9,
      ROKU: 72.1,
      SQ: 81.8,
      SNAP: 11.7,
    },
    {
      date: 'Nov 06, 2024',
      RIVN: 15.9,
      PLTR: 29.4,
      COIN: 179.6,
      ROKU: 71.3,
      SQ: 80.5,
      SNAP: 11.5,
    },
    {
      date: 'Nov 07, 2024',
      RIVN: 13.8,
      PLTR: 27.9,
      COIN: 172.4,
      ROKU: 68.7,
      SQ: 77.2,
      SNAP: 10.8,
    },
    {
      date: 'Nov 08, 2024',
      RIVN: 13.4,
      PLTR: 27.3,
      COIN: 169.8,
      ROKU: 67.2,
      SQ: 75.9,
      SNAP: 10.5,
    },
    {
      date: 'Nov 11, 2024',
      RIVN: 13.1,
      PLTR: 26.8,
      COIN: 167.3,
      ROKU: 65.9,
      SQ: 74.6,
      SNAP: 10.2,
    },
    {
      date: 'Nov 12, 2024',
      RIVN: 12.8,
      PLTR: 26.4,
      COIN: 165.1,
      ROKU: 64.7,
      SQ: 73.4,
      SNAP: 9.9,
    },
    {
      date: 'Nov 13, 2024',
      RIVN: 12.5,
      PLTR: 25.9,
      COIN: 162.8,
      ROKU: 63.4,
      SQ: 72.1,
      SNAP: 9.6,
    },
    {
      date: 'Nov 14, 2024',
      RIVN: 12.9,
      PLTR: 26.7,
      COIN: 165.9,
      ROKU: 65.1,
      SQ: 74.3,
      SNAP: 10.1,
    },
    {
      date: 'Nov 15, 2024',
      RIVN: 13.3,
      PLTR: 27.2,
      COIN: 168.4,
      ROKU: 66.5,
      SQ: 75.8,
      SNAP: 10.4,
    },
    {
      date: 'Nov 18, 2024',
      RIVN: 14.1,
      PLTR: 28.6,
      COIN: 173.2,
      ROKU: 69.3,
      SQ: 78.9,
      SNAP: 11.0,
    },
  ];

  tabs: Tab[] = [
    {
      name: 'Growth',
      stocks: [
        {
          ticker: 'RIVN',
          description: 'Rivian Automotive',
          value: '$14.1',
          change: '+1.24%',
          changeType: 'positive',
          chartData: this.getChartDataForStock('RIVN', 'positive'),
        },
        {
          ticker: 'PLTR',
          description: 'Palantir Technologies',
          value: '$28.6',
          change: '-0.67%',
          changeType: 'negative',
          chartData: this.getChartDataForStock('PLTR', 'negative'),
        },
        {
          ticker: 'COIN',
          description: 'Coinbase Global',
          value: '$173.2',
          change: '+2.89%',
          changeType: 'positive',
          chartData: this.getChartDataForStock('COIN', 'positive'),
        },
      ],
    },
    {
      name: 'Tech',
      stocks: [
        {
          ticker: 'ROKU',
          description: 'Roku Inc',
          value: '$69.3',
          change: '-0.45%',
          changeType: 'negative',
          chartData: this.getChartDataForStock('ROKU', 'negative'),
        },
        {
          ticker: 'SQ',
          description: 'Block Inc',
          value: '$78.9',
          change: '+1.78%',
          changeType: 'positive',
          chartData: this.getChartDataForStock('SQ', 'positive'),
        },
        {
          ticker: 'SNAP',
          description: 'Snap Inc',
          value: '$11.0',
          change: '-1.23%',
          changeType: 'negative',
          chartData: this.getChartDataForStock('SNAP', 'negative'),
        },
      ],
    },
  ];

  chartOptions: ChartConfiguration<'line'>['options'] = {
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
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 0,
      },
      line: {
        borderWidth: 1.5,
        tension: 0.4,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  getChartDataForStock(
    ticker: string,
    changeType: 'positive' | 'negative',
  ): ChartData<'line', number[], string> {
    const stockData = this.data.map(
      (item) => item[ticker as keyof StockData] as number,
    );
    const color =
      changeType === 'positive' ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)';
    const backgroundColor =
      changeType === 'positive'
        ? 'rgba(16, 185, 129, 0.1)'
        : 'rgba(239, 68, 68, 0.1)';

    return {
      labels: this.data.map((item) => item.date),
      datasets: [
        {
          data: stockData,
          borderColor: color,
          backgroundColor: backgroundColor,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }

  getChangeColorClasses(changeType: 'positive' | 'negative'): string {
    return changeType === 'positive'
      ? 'text-emerald-700 dark:text-emerald-500'
      : 'text-red-700 dark:text-red-500';
  }
}
