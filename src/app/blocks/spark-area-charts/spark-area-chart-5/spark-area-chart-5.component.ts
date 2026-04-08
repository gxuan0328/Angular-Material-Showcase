/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update spark-area-charts/spark-area-chart-5`
*/

import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ChartData, ChartConfiguration } from 'chart.js';

type CompanyData = {
  date: string;
  'CloudSync Ltd.': number;
  'DataFlow Systems': number;
  'NextGen Analytics': number;
};

type SummaryItem = {
  name: string;
  change: string;
  changeType: 'positive' | 'negative';
  chartData: ChartData<'line', number[], string>;
};

@Component({
  selector: 'ngm-dev-block-spark-area-chart-5',
  templateUrl: './spark-area-chart-5.component.html',
  imports: [BaseChartDirective, MatCard, MatCardContent],
})
export class SparkAreaChart5Component {
  chartType = 'line' as const;

  data: CompanyData[] = [
    {
      date: 'Oct 15, 2024',
      'CloudSync Ltd.': 128.4,
      'DataFlow Systems': 89.7,
      'NextGen Analytics': 95.2,
    },
    {
      date: 'Oct 16, 2024',
      'CloudSync Ltd.': 132.1,
      'DataFlow Systems': 92.3,
      'NextGen Analytics': 91.8,
    },
    {
      date: 'Oct 17, 2024',
      'CloudSync Ltd.': 129.8,
      'DataFlow Systems': 89.1,
      'NextGen Analytics': 88.4,
    },
    {
      date: 'Oct 18, 2024',
      'CloudSync Ltd.': 135.7,
      'DataFlow Systems': 94.8,
      'NextGen Analytics': 86.1,
    },
    {
      date: 'Oct 19, 2024',
      'CloudSync Ltd.': 139.2,
      'DataFlow Systems': 97.5,
      'NextGen Analytics': 89.7,
    },
    {
      date: 'Oct 22, 2024',
      'CloudSync Ltd.': 143.8,
      'DataFlow Systems': 101.2,
      'NextGen Analytics': 92.8,
    },
    {
      date: 'Oct 23, 2024',
      'CloudSync Ltd.': 147.5,
      'DataFlow Systems': 104.6,
      'NextGen Analytics': 95.4,
    },
    {
      date: 'Oct 24, 2024',
      'CloudSync Ltd.': 151.3,
      'DataFlow Systems': 107.9,
      'NextGen Analytics': 98.1,
    },
    {
      date: 'Oct 25, 2024',
      'CloudSync Ltd.': 148.7,
      'DataFlow Systems': 105.8,
      'NextGen Analytics': 96.7,
    },
    {
      date: 'Oct 26, 2024',
      'CloudSync Ltd.': 145.9,
      'DataFlow Systems': 103.4,
      'NextGen Analytics': 94.2,
    },
    {
      date: 'Oct 29, 2024',
      'CloudSync Ltd.': 142.6,
      'DataFlow Systems': 100.9,
      'NextGen Analytics': 91.8,
    },
    {
      date: 'Oct 30, 2024',
      'CloudSync Ltd.': 139.8,
      'DataFlow Systems': 98.7,
      'NextGen Analytics': 89.5,
    },
    {
      date: 'Oct 31, 2024',
      'CloudSync Ltd.': 137.2,
      'DataFlow Systems': 96.3,
      'NextGen Analytics': 87.1,
    },
    {
      date: 'Nov 01, 2024',
      'CloudSync Ltd.': 140.9,
      'DataFlow Systems': 99.1,
      'NextGen Analytics': 90.3,
    },
    {
      date: 'Nov 04, 2024',
      'CloudSync Ltd.': 144.5,
      'DataFlow Systems': 102.5,
      'NextGen Analytics': 93.7,
    },
    {
      date: 'Nov 05, 2024',
      'CloudSync Ltd.': 147.8,
      'DataFlow Systems': 105.3,
      'NextGen Analytics': 96.9,
    },
    {
      date: 'Nov 06, 2024',
      'CloudSync Ltd.': 145.1,
      'DataFlow Systems': 103.7,
      'NextGen Analytics': 95.2,
    },
    {
      date: 'Nov 07, 2024',
      'CloudSync Ltd.': 152.4,
      'DataFlow Systems': 108.9,
      'NextGen Analytics': 99.8,
    },
    {
      date: 'Nov 08, 2024',
      'CloudSync Ltd.': 156.7,
      'DataFlow Systems': 112.4,
      'NextGen Analytics': 102.5,
    },
    {
      date: 'Nov 11, 2024',
      'CloudSync Ltd.': 160.2,
      'DataFlow Systems': 115.8,
      'NextGen Analytics': 105.1,
    },
    {
      date: 'Nov 12, 2024',
      'CloudSync Ltd.': 163.9,
      'DataFlow Systems': 118.7,
      'NextGen Analytics': 107.9,
    },
    {
      date: 'Nov 13, 2024',
      'CloudSync Ltd.': 167.3,
      'DataFlow Systems': 121.5,
      'NextGen Analytics': 110.4,
    },
    {
      date: 'Nov 14, 2024',
      'CloudSync Ltd.': 170.8,
      'DataFlow Systems': 124.1,
      'NextGen Analytics': 112.8,
    },
    {
      date: 'Nov 15, 2024',
      'CloudSync Ltd.': 174.2,
      'DataFlow Systems': 126.9,
      'NextGen Analytics': 115.3,
    },
    {
      date: 'Nov 18, 2024',
      'CloudSync Ltd.': 177.9,
      'DataFlow Systems': 129.8,
      'NextGen Analytics': 118.1,
    },
  ];

  summary: SummaryItem[] = [
    {
      name: 'CloudSync Ltd.',
      change: '+3.4%',
      changeType: 'positive',
      chartData: this.getChartDataForCompany('CloudSync Ltd.', 'positive'),
    },
    {
      name: 'NextGen Analytics',
      change: '-1.2%',
      changeType: 'negative',
      chartData: this.getChartDataForCompany('NextGen Analytics', 'negative'),
    },
    {
      name: 'DataFlow Systems',
      change: '+5.7%',
      changeType: 'positive',
      chartData: this.getChartDataForCompany('DataFlow Systems', 'positive'),
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

  getChartDataForCompany(
    companyName: string,
    changeType: 'positive' | 'negative',
  ): ChartData<'line', number[], string> {
    const companyData = this.data.map(
      (item) => item[companyName as keyof CompanyData] as number,
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
          data: companyData,
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
