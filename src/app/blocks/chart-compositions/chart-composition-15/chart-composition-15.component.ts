/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-compositions/chart-composition-15`
*/

import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatCard } from '@angular/material/card';
import { ChartData, ChartConfiguration } from 'chart.js';
import { MatTableModule } from '@angular/material/table';
import { MatButton, MatAnchor } from '@angular/material/button';

type DataPoint = {
  date: string;
  'Overall costs': number;
  'Active workspaces': number;
  'Active users': number;
  Uptime: number;
  'Response time': number;
  MTTR: number;
};

type StatItem = {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  chartData: ChartData<'line', number[], string>;
};

type TableDataItem = {
  'Time period': string;
  'Overall costs': string;
  'Active workspaces': string;
  'Active users': string;
  Uptime: string;
  'Response time': string;
  MTTR: string;
};

@Component({
  selector: 'ngm-dev-block-chart-composition-15',
  templateUrl: './chart-composition-15.component.html',
  imports: [BaseChartDirective, MatCard, MatTableModule, MatButton, MatAnchor],
})
export class ChartComposition15Component {
  chartType = 'line' as const;

  data: DataPoint[] = [
    {
      date: 'Oct 08, 2024',
      'Overall costs': 14230,
      'Active workspaces': 194,
      'Active users': 16200,
      Uptime: 97.2,
      'Response time': 5.65,
      MTTR: 445,
    },
    {
      date: 'Oct 09, 2024',
      'Overall costs': 15340,
      'Active workspaces': 178,
      'Active users': 15400,
      Uptime: 98.1,
      'Response time': 5.42,
      MTTR: 395,
    },
    {
      date: 'Oct 10, 2024',
      'Overall costs': 14680,
      'Active workspaces': 223,
      'Active users': 13800,
      Uptime: 97.6,
      'Response time': 5.78,
      MTTR: 420,
    },
    {
      date: 'Oct 11, 2024',
      'Overall costs': 16120,
      'Active workspaces': 208,
      'Active users': 15100,
      Uptime: 99.1,
      'Response time': 4.98,
      MTTR: 308,
    },
    {
      date: 'Oct 12, 2024',
      'Overall costs': 14890,
      'Active workspaces': 298,
      'Active users': 12300,
      Uptime: 99.7,
      'Response time': 5.01,
      MTTR: 325,
    },
    {
      date: 'Oct 13, 2024',
      'Overall costs': 16520,
      'Active workspaces': 259,
      'Active users': 14100,
      Uptime: 97.9,
      'Response time': 6.1,
      MTTR: 465,
    },
    {
      date: 'Oct 14, 2024',
      'Overall costs': 16070,
      'Active workspaces': 412,
      'Active users': 12000,
      Uptime: 98.6,
      'Response time': 5.56,
      MTTR: 388,
    },
    {
      date: 'Oct 15, 2024',
      'Overall costs': 14610,
      'Active workspaces': 378,
      'Active users': 14500,
      Uptime: 99.8,
      'Response time': 4.89,
      MTTR: 300,
    },
    {
      date: 'Oct 16, 2024',
      'Overall costs': 14870,
      'Active workspaces': 445,
      'Active users': 12600,
      Uptime: 99.9,
      'Response time': 4.97,
      MTTR: 315,
    },
    {
      date: 'Oct 17, 2024',
      'Overall costs': 16310,
      'Active workspaces': 398,
      'Active users': 14800,
      Uptime: 98.5,
      'Response time': 5.63,
      MTTR: 440,
    },
    {
      date: 'Oct 18, 2024',
      'Overall costs': 15540,
      'Active workspaces': 468,
      'Active users': 12200,
      Uptime: 99.2,
      'Response time': 5.42,
      MTTR: 378,
    },
    {
      date: 'Oct 19, 2024',
      'Overall costs': 15100,
      'Active workspaces': 419,
      'Active users': 14000,
      Uptime: 99.5,
      'Response time': 5.44,
      MTTR: 350,
    },
    {
      date: 'Oct 20, 2024',
      'Overall costs': 15770,
      'Active workspaces': 482,
      'Active users': 12400,
      Uptime: 99.7,
      'Response time': 5.41,
      MTTR: 360,
    },
    {
      date: 'Oct 21, 2024',
      'Overall costs': 15530,
      'Active workspaces': 403,
      'Active users': 13000,
      Uptime: 99.8,
      'Response time': 5.35,
      MTTR: 345,
    },
    {
      date: 'Oct 22, 2024',
      'Overall costs': 15412,
      'Active workspaces': 334,
      'Active users': 12600,
      Uptime: 99.9,
      'Response time': 5.3,
      MTTR: 333,
    },
  ];

  stats: StatItem[] = [
    {
      name: 'Overall costs',
      value: '$15,412',
      change: '+1.45%',
      changeType: 'negative',
      chartData: this.getChartData('Overall costs'),
    },
    {
      name: 'Active workspaces',
      value: '334',
      change: '+4.32%',
      changeType: 'positive',
      chartData: this.getChartData('Active workspaces'),
    },
    {
      name: 'Active users',
      value: '12.6K',
      change: '-3.89%',
      changeType: 'negative',
      chartData: this.getChartData('Active users'),
    },
    {
      name: 'Uptime',
      value: '99.9%',
      change: '+1.34%',
      changeType: 'positive',
      chartData: this.getChartData('Uptime'),
    },
    {
      name: 'Response time',
      value: '5.3ms',
      change: '+0.18%',
      changeType: 'negative',
      chartData: this.getChartData('Response time'),
    },
    {
      name: 'MTTR',
      value: '5min 33s',
      change: '+5.23%',
      changeType: 'negative',
      chartData: this.getChartData('MTTR'),
    },
  ];

  tableData: TableDataItem[] = [
    {
      'Time period': 'Today',
      'Overall costs': '$15,412',
      'Active workspaces': '334',
      'Active users': '12.6K',
      Uptime: '99.9%',
      'Response time': '5.3ms',
      MTTR: '5min 33s',
    },
    {
      'Time period': 'Last 7 days',
      'Overall costs': '$13,654',
      'Active workspaces': '453',
      'Active users': '9.1K',
      Uptime: '98.6%',
      'Response time': '4.8ms',
      MTTR: '4min 41s',
    },
    {
      'Time period': 'Last 30 days',
      'Overall costs': '$11,543',
      'Active workspaces': '234',
      'Active users': '7.8K',
      Uptime: '94.5%',
      'Response time': '11.2ms',
      MTTR: '9min 23s',
    },
    {
      'Time period': 'Last 365 days',
      'Overall costs': '$23,654',
      'Active workspaces': '412',
      'Active users': '8.7K',
      Uptime: '95.8%',
      'Response time': '9.8ms',
      MTTR: '8min 12s',
    },
    {
      'Time period': 'All time',
      'Overall costs': '$10,123',
      'Active workspaces': '289',
      'Active users': '11.2K',
      Uptime: '98.6%',
      'Response time': '10.5ms',
      MTTR: '7min 18s',
    },
  ];

  displayedColumns: string[] = [
    'Time period',
    'Overall costs',
    'Active workspaces',
    'Active users',
    'Uptime',
    'Response time',
    'MTTR',
  ];

  getChartData(metric: string): ChartData<'line', number[], string> {
    return {
      labels: this.data.map((d) => d.date),
      datasets: [
        {
          data: this.data.map((d) => d[metric as keyof DataPoint] as number),
          label: metric,
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          pointHoverBackgroundColor: 'rgb(139, 92, 246)',
          pointHoverBorderColor: 'rgb(139, 92, 246)',
          fill: true,
          pointRadius: 0,
        },
      ],
    };
  }

  sparkChartOptions: ChartConfiguration<'line'>['options'] = {
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
      },
    },
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: '#f3f4f6',
        },
        ticks: {
          display: false,
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
      mode: 'index',
      intersect: false,
    },
  };
}
