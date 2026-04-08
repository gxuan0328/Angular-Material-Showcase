/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update spark-area-charts/spark-area-chart-2`
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
import { MatList, MatListItem } from '@angular/material/list';
import { ChartData, ChartConfiguration } from 'chart.js';

type StockData = {
  date: string;
  TSLA: number;
  AMZN: number;
  MSFT: number;
  INTC: number;
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
  selector: 'ngm-dev-block-spark-area-chart-2',
  templateUrl: './spark-area-chart-2.component.html',
  styleUrls: ['./spark-area-chart-2.component.scss'],
  imports: [
    BaseChartDirective,
    MatCard,
    MatCardContent,
    MatList,
    MatListItem,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
  ],
})
export class SparkAreaChart2Component {
  chartType = 'line' as const;

  data: StockData[] = [
    {
      date: 'Oct 15, 2024',
      TSLA: 241.8,
      AMZN: 128.3,
      MSFT: 412.7,
      INTC: 22.1,
    },
    {
      date: 'Oct 16, 2024',
      TSLA: 238.5,
      AMZN: 131.9,
      MSFT: 408.4,
      INTC: 21.8,
    },
    {
      date: 'Oct 17, 2024',
      TSLA: 235.2,
      AMZN: 129.6,
      MSFT: 405.1,
      INTC: 21.5,
    },
    {
      date: 'Oct 18, 2024',
      TSLA: 242.7,
      AMZN: 133.2,
      MSFT: 411.8,
      INTC: 22.3,
    },
    {
      date: 'Oct 19, 2024',
      TSLA: 246.1,
      AMZN: 135.7,
      MSFT: 415.5,
      INTC: 22.7,
    },
    {
      date: 'Oct 22, 2024',
      TSLA: 250.8,
      AMZN: 139.4,
      MSFT: 420.2,
      INTC: 23.2,
    },
    {
      date: 'Oct 23, 2024',
      TSLA: 254.3,
      AMZN: 142.1,
      MSFT: 424.8,
      INTC: 23.6,
    },
    {
      date: 'Oct 24, 2024',
      TSLA: 251.7,
      AMZN: 140.5,
      MSFT: 422.1,
      INTC: 23.3,
    },
    {
      date: 'Oct 25, 2024',
      TSLA: 248.9,
      AMZN: 138.8,
      MSFT: 419.6,
      INTC: 23.0,
    },
    {
      date: 'Oct 26, 2024',
      TSLA: 245.4,
      AMZN: 136.2,
      MSFT: 416.9,
      INTC: 22.6,
    },
    {
      date: 'Oct 29, 2024',
      TSLA: 242.1,
      AMZN: 133.7,
      MSFT: 414.3,
      INTC: 22.2,
    },
    {
      date: 'Oct 30, 2024',
      TSLA: 239.6,
      AMZN: 131.4,
      MSFT: 411.7,
      INTC: 21.9,
    },
    {
      date: 'Oct 31, 2024',
      TSLA: 237.8,
      AMZN: 129.9,
      MSFT: 409.5,
      INTC: 21.6,
    },
    {
      date: 'Nov 01, 2024',
      TSLA: 241.2,
      AMZN: 132.6,
      MSFT: 412.8,
      INTC: 22.1,
    },
    {
      date: 'Nov 04, 2024',
      TSLA: 244.7,
      AMZN: 135.3,
      MSFT: 416.4,
      INTC: 22.5,
    },
    {
      date: 'Nov 05, 2024',
      TSLA: 247.9,
      AMZN: 137.8,
      MSFT: 419.7,
      INTC: 22.8,
    },
    {
      date: 'Nov 06, 2024',
      TSLA: 245.3,
      AMZN: 136.1,
      MSFT: 417.2,
      INTC: 22.4,
    },
    {
      date: 'Nov 07, 2024',
      TSLA: 220.5,
      AMZN: 133.9,
      MSFT: 414.6,
      INTC: 22.0,
    },
    {
      date: 'Nov 08, 2024',
      TSLA: 218.2,
      AMZN: 131.7,
      MSFT: 412.1,
      INTC: 21.7,
    },
    {
      date: 'Nov 11, 2024',
      TSLA: 215.8,
      AMZN: 129.4,
      MSFT: 409.7,
      INTC: 21.4,
    },
    {
      date: 'Nov 12, 2024',
      TSLA: 213.9,
      AMZN: 127.8,
      MSFT: 407.8,
      INTC: 21.1,
    },
    {
      date: 'Nov 13, 2024',
      TSLA: 211.4,
      AMZN: 125.6,
      MSFT: 405.3,
      INTC: 20.8,
    },
    {
      date: 'Nov 14, 2024',
      TSLA: 209.1,
      AMZN: 128.2,
      MSFT: 407.9,
      INTC: 21.2,
    },
  ];

  summary: SummaryItem[] = [
    {
      ticker: 'AMZN',
      description: 'Amazon',
      value: '$128.2',
      change: '+1.15%',
      changeType: 'positive',
      chartData: this.getChartDataForStock('AMZN', 'positive'),
    },
    {
      ticker: 'TSLA',
      description: 'Tesla Inc',
      value: '$209.1',
      change: '-0.74%',
      changeType: 'negative',
      chartData: this.getChartDataForStock('TSLA', 'negative'),
    },
    {
      ticker: 'INTC',
      description: 'Intel Corp',
      value: '$21.2',
      change: '+2.34%',
      changeType: 'positive',
      chartData: this.getChartDataForStock('INTC', 'positive'),
    },
    {
      ticker: 'MSFT',
      description: 'Microsoft',
      value: '$407.9',
      change: '-0.47%',
      changeType: 'negative',
      chartData: this.getChartDataForStock('MSFT', 'negative'),
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
