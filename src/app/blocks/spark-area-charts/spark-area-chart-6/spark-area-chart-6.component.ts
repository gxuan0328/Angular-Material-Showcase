/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update spark-area-charts/spark-area-chart-6`
*/

import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ChartData, ChartConfiguration } from 'chart.js';

type IndexData = {
  date: string;
  'NASDAQ 100': number;
  'Russell 2000': number;
  'FTSE 100': number;
};

type SummaryItem = {
  name: string;
  description: string;
  category: string;
  change: string;
  changeType: 'positive' | 'negative';
  chartData: ChartData<'line', number[], string>;
};

@Component({
  selector: 'ngm-dev-block-spark-area-chart-6',
  templateUrl: './spark-area-chart-6.component.html',
  imports: [BaseChartDirective, MatCard, MatCardContent],
})
export class SparkAreaChart6Component {
  chartType = 'line' as const;

  data: IndexData[] = [
    {
      date: 'Oct 15, 2024',
      'NASDAQ 100': 19847.2,
      'Russell 2000': 2089.5,
      'FTSE 100': 8234.8,
    },
    {
      date: 'Oct 16, 2024',
      'NASDAQ 100': 19623.5,
      'Russell 2000': 2076.3,
      'FTSE 100': 8198.2,
    },
    {
      date: 'Oct 17, 2024',
      'NASDAQ 100': 19756.7,
      'Russell 2000': 2084.8,
      'FTSE 100': 8215.5,
    },
    {
      date: 'Oct 18, 2024',
      'NASDAQ 100': 19932.3,
      'Russell 2000': 2098.5,
      'FTSE 100': 8267.4,
    },
    {
      date: 'Oct 19, 2024',
      'NASDAQ 100': 20084.1,
      'Russell 2000': 2112.2,
      'FTSE 100': 8289.7,
    },
    {
      date: 'Oct 22, 2024',
      'NASDAQ 100': 20251.6,
      'Russell 2000': 2127.9,
      'FTSE 100': 8312.4,
    },
    {
      date: 'Oct 23, 2024',
      'NASDAQ 100': 20398.7,
      'Russell 2000': 2141.7,
      'FTSE 100': 8334.8,
    },
    {
      date: 'Oct 24, 2024',
      'NASDAQ 100': 20187.3,
      'Russell 2000': 2125.3,
      'FTSE 100': 8298.6,
    },
    {
      date: 'Oct 25, 2024',
      'NASDAQ 100': 19967.8,
      'Russell 2000': 2108.9,
      'FTSE 100': 8261.2,
    },
    {
      date: 'Oct 26, 2024',
      'NASDAQ 100': 19846.5,
      'Russell 2000': 2095.4,
      'FTSE 100': 8245.7,
    },
    {
      date: 'Oct 29, 2024',
      'NASDAQ 100': 19734.2,
      'Russell 2000': 2082.1,
      'FTSE 100': 8228.3,
    },
    {
      date: 'Oct 30, 2024',
      'NASDAQ 100': 19625.8,
      'Russell 2000': 2069.7,
      'FTSE 100': 8210.9,
    },
    {
      date: 'Oct 31, 2024',
      'NASDAQ 100': 19518.4,
      'Russell 2000': 2057.3,
      'FTSE 100': 8193.5,
    },
    {
      date: 'Nov 01, 2024',
      'NASDAQ 100': 19672.9,
      'Russell 2000': 2071.8,
      'FTSE 100': 8219.7,
    },
    {
      date: 'Nov 04, 2024',
      'NASDAQ 100': 19824.6,
      'Russell 2000': 2085.4,
      'FTSE 100': 8244.2,
    },
    {
      date: 'Nov 05, 2024',
      'NASDAQ 100': 19978.3,
      'Russell 2000': 2099.1,
      'FTSE 100': 8268.8,
    },
    {
      date: 'Nov 06, 2024',
      'NASDAQ 100': 19834.7,
      'Russell 2000': 2086.2,
      'FTSE 100': 8251.4,
    },
    {
      date: 'Nov 07, 2024',
      'NASDAQ 100': 18962.4,
      'Russell 2000': 2043.8,
      'FTSE 100': 8167.9,
    },
    {
      date: 'Nov 08, 2024',
      'NASDAQ 100': 18819.1,
      'Russell 2000': 2031.5,
      'FTSE 100': 8142.6,
    },
    {
      date: 'Nov 11, 2024',
      'NASDAQ 100': 18693.7,
      'Russell 2000': 2019.7,
      'FTSE 100': 8118.3,
    },
    {
      date: 'Nov 12, 2024',
      'NASDAQ 100': 18578.2,
      'Russell 2000': 2008.4,
      'FTSE 100': 8095.1,
    },
    {
      date: 'Nov 13, 2024',
      'NASDAQ 100': 18467.9,
      'Russell 2000': 1997.6,
      'FTSE 100': 8072.8,
    },
    {
      date: 'Nov 14, 2024',
      'NASDAQ 100': 18359.4,
      'Russell 2000': 1987.2,
      'FTSE 100': 8051.2,
    },
    {
      date: 'Nov 15, 2024',
      'NASDAQ 100': 18254.8,
      'Russell 2000': 1977.1,
      'FTSE 100': 8029.7,
    },
    {
      date: 'Nov 18, 2024',
      'NASDAQ 100': 18152.3,
      'Russell 2000': 1967.5,
      'FTSE 100': 8008.4,
    },
  ];

  summary: SummaryItem[] = [
    {
      name: 'NASDAQ 100',
      description: 'Technology Index',
      category: 'NASDAQ 100',
      change: '-4.1%',
      changeType: 'negative',
      chartData: this.getChartDataForIndex('NASDAQ 100', 'negative'),
    },
    {
      name: 'Russell 2000',
      description: 'Small Cap Index',
      category: 'Russell 2000',
      change: '+3.8%',
      changeType: 'positive',
      chartData: this.getChartDataForIndex('Russell 2000', 'positive'),
    },
    {
      name: 'FTSE 100',
      description: 'London Stock Exchange',
      category: 'FTSE 100',
      change: '-7.2%',
      changeType: 'negative',
      chartData: this.getChartDataForIndex('FTSE 100', 'negative'),
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
        borderWidth: 2,
        tension: 0.4,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  getChartDataForIndex(
    indexName: string,
    changeType: 'positive' | 'negative',
  ): ChartData<'line', number[], string> {
    const indexData = this.data.map(
      (item) => item[indexName as keyof IndexData] as number,
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
          data: indexData,
          borderColor: color,
          backgroundColor: backgroundColor,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }

  getBadgeColorClasses(changeType: 'positive' | 'negative'): string {
    return changeType === 'positive'
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-400'
      : 'bg-red-100 text-red-800 dark:bg-red-400/10 dark:text-red-400';
  }
}
