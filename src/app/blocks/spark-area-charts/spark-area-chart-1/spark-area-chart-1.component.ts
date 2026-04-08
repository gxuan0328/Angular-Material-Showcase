/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update spark-area-charts/spark-area-chart-1`
*/

import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ChartData, ChartConfiguration } from 'chart.js';

type StockData = {
  date: string;
  NVDA: number;
  META: number;
  NFLX: number;
  AAPL: number;
  GOOGL: number;
};

type SummaryItem = {
  ticker: string;
  description: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  chartData: ChartData<'line', number[], string>;
};

@Component({
  selector: 'ngm-dev-block-spark-area-chart-1',
  templateUrl: './spark-area-chart-1.component.html',
  imports: [BaseChartDirective, MatCard, MatCardContent],
})
export class SparkAreaChart1Component {
  chartType = 'line' as const;

  data: StockData[] = [
    {
      date: 'Oct 15, 2024',
      NVDA: 142.3,
      META: 89.5,
      NFLX: 78.2,
      AAPL: 188.4,
      GOOGL: 165.7,
    },
    {
      date: 'Oct 16, 2024',
      NVDA: 138.9,
      META: 91.2,
      NFLX: 74.8,
      AAPL: 192.1,
      GOOGL: 162.3,
    },
    {
      date: 'Oct 17, 2024',
      NVDA: 144.1,
      META: 87.9,
      NFLX: 72.5,
      AAPL: 195.8,
      GOOGL: 159.6,
    },
    {
      date: 'Oct 18, 2024',
      NVDA: 151.7,
      META: 93.4,
      NFLX: 69.1,
      AAPL: 198.2,
      GOOGL: 167.4,
    },
    {
      date: 'Oct 19, 2024',
      NVDA: 156.3,
      META: 95.8,
      NFLX: 71.7,
      AAPL: 201.9,
      GOOGL: 172.5,
    },
    {
      date: 'Oct 22, 2024',
      NVDA: 163.2,
      META: 102.1,
      NFLX: 68.9,
      AAPL: 205.3,
      GOOGL: 175.8,
    },
    {
      date: 'Oct 23, 2024',
      NVDA: 168.5,
      META: 105.6,
      NFLX: 72.4,
      AAPL: 208.7,
      GOOGL: 178.9,
    },
    {
      date: 'Oct 24, 2024',
      NVDA: 173.8,
      META: 108.3,
      NFLX: 75.8,
      AAPL: 212.1,
      GOOGL: 182.4,
    },
    {
      date: 'Oct 25, 2024',
      NVDA: 170.2,
      META: 106.7,
      NFLX: 73.6,
      AAPL: 209.5,
      GOOGL: 179.8,
    },
    {
      date: 'Oct 26, 2024',
      NVDA: 168.9,
      META: 104.2,
      NFLX: 71.3,
      AAPL: 207.2,
      GOOGL: 177.1,
    },
    {
      date: 'Oct 29, 2024',
      NVDA: 166.4,
      META: 101.8,
      NFLX: 69.7,
      AAPL: 204.9,
      GOOGL: 174.6,
    },
    {
      date: 'Oct 30, 2024',
      NVDA: 164.1,
      META: 99.5,
      NFLX: 67.2,
      AAPL: 202.3,
      GOOGL: 172.8,
    },
    {
      date: 'Oct 31, 2024',
      NVDA: 162.7,
      META: 97.8,
      NFLX: 65.8,
      AAPL: 200.1,
      GOOGL: 170.9,
    },
    {
      date: 'Nov 01, 2024',
      NVDA: 165.3,
      META: 100.4,
      NFLX: 68.1,
      AAPL: 203.7,
      GOOGL: 173.2,
    },
    {
      date: 'Nov 04, 2024',
      NVDA: 168.8,
      META: 103.9,
      NFLX: 70.5,
      AAPL: 206.8,
      GOOGL: 176.1,
    },
    {
      date: 'Nov 05, 2024',
      NVDA: 171.2,
      META: 106.3,
      NFLX: 72.9,
      AAPL: 209.4,
      GOOGL: 178.7,
    },
    {
      date: 'Nov 06, 2024',
      NVDA: 168.5,
      META: 104.1,
      NFLX: 71.6,
      AAPL: 207.1,
      GOOGL: 176.5,
    },
    {
      date: 'Nov 07, 2024',
      NVDA: 143.6,
      META: 101.8,
      NFLX: 68.9,
      AAPL: 204.2,
      GOOGL: 174.8,
    },
    {
      date: 'Nov 08, 2024',
      NVDA: 141.1,
      META: 99.2,
      NFLX: 66.7,
      AAPL: 201.9,
      GOOGL: 172.4,
    },
    {
      date: 'Nov 11, 2024',
      NVDA: 138.7,
      META: 96.8,
      NFLX: 64.3,
      AAPL: 199.5,
      GOOGL: 170.1,
    },
    {
      date: 'Nov 12, 2024',
      NVDA: 137.2,
      META: 94.5,
      NFLX: 62.8,
      AAPL: 197.3,
      GOOGL: 168.6,
    },
    {
      date: 'Nov 13, 2024',
      NVDA: 134.8,
      META: 92.1,
      NFLX: 60.9,
      AAPL: 195.1,
      GOOGL: 166.9,
    },
    {
      date: 'Nov 14, 2024',
      NVDA: 131.5,
      META: 96.8,
      NFLX: 63.2,
      AAPL: 197.8,
      GOOGL: 169.4,
    },
    {
      date: 'Nov 15, 2024',
      NVDA: 134.2,
      META: 94.4,
      NFLX: 61.7,
      AAPL: 195.6,
      GOOGL: 167.2,
    },
    {
      date: 'Nov 18, 2024',
      NVDA: 147.8,
      META: 99.7,
      NFLX: 64.5,
      AAPL: 200.3,
      GOOGL: 171.8,
    },
  ];

  summary: SummaryItem[] = [
    {
      ticker: 'META',
      description: 'Meta Platforms',
      value: '$99.7',
      change: '+1.24%',
      changeType: 'positive',
      chartData: this.getChartDataForStock('META', 'positive'),
    },
    {
      ticker: 'NFLX',
      description: 'Netflix Inc.',
      value: '$64.5',
      change: '-1.89%',
      changeType: 'negative',
      chartData: this.getChartDataForStock('NFLX', 'negative'),
    },
    {
      ticker: 'NVDA',
      description: 'NVIDIA Corp',
      value: '$147.8',
      change: '+0.61%',
      changeType: 'positive',
      chartData: this.getChartDataForStock('NVDA', 'positive'),
    },
    {
      ticker: 'AAPL',
      description: 'Apple Inc.',
      value: '$200.3',
      change: '-0.18%',
      changeType: 'negative',
      chartData: this.getChartDataForStock('AAPL', 'negative'),
    },
    {
      ticker: 'GOOGL',
      description: 'Alphabet Inc',
      value: '$171.8',
      change: '+2.07%',
      changeType: 'positive',
      chartData: this.getChartDataForStock('GOOGL', 'positive'),
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

  getStockColorClasses(changeType: 'positive' | 'negative'): string {
    return changeType === 'positive'
      ? 'text-emerald-700 dark:text-emerald-500'
      : 'text-red-700 dark:text-red-500';
  }

  getChangeColorClasses(changeType: 'positive' | 'negative'): string {
    return changeType === 'positive'
      ? 'bg-emerald-100 dark:bg-emerald-400/10'
      : 'bg-red-100 dark:bg-red-400/10';
  }
}
