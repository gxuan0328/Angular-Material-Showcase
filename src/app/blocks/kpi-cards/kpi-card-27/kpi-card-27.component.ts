/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-27`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

type Item = {
  label: string;
  value: string;
  color: string;
};

type CardData = {
  title: string;
  items: Item[];
  chartData: ChartData<'line', number[], string>;
};

@Component({
  selector: 'ngm-dev-block-kpi-card-27',
  imports: [MatCard, MatCardContent, BaseChartDirective],
  templateUrl: './kpi-card-27.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard27Component {
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: true, grid: { display: false } },
      y: {
        display: true,
        grid: { display: true, color: '#66666650' },
        ticks: { display: false },
        border: { display: false },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
        tension: 0.3,
      },
      point: {
        radius: 0,
      },
    },
  };

  cards: CardData[] = [
    {
      title: 'Request Volume Trends',
      items: [
        {
          label: 'Current',
          value: '842',
          color: 'bg-blue-500 dark:bg-blue-500',
        },
        {
          label: 'Previous',
          value: '680',
          color: 'bg-gray-400 dark:bg-gray-600',
        },
      ],
      chartData: {
        labels: Array(12).fill(''),
        datasets: [
          {
            data: [410, 315, 295, 365, 480, 310, 545, 505, 580, 330, 545, 485],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'transparent',
          },
          {
            data: [335, 270, 225, 280, 365, 240, 420, 385, 445, 250, 415, 360],
            borderColor: 'rgb(156, 163, 175)',
            backgroundColor: 'transparent',
          },
        ],
      },
    },
    {
      title: 'Processing Metrics',
      items: [
        {
          label: 'Active',
          value: '8,450',
          color: 'bg-blue-500 dark:bg-blue-500',
        },
        {
          label: 'Queued',
          value: '6,820',
          color: 'bg-gray-400 dark:bg-gray-600',
        },
      ],
      chartData: {
        labels: Array(12).fill(''),
        datasets: [
          {
            data: [
              3250, 2940, 3150, 2750, 3680, 3200, 4100, 3850, 4200, 2900, 3950,
              3600,
            ],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'transparent',
          },
          {
            data: [
              2750, 2250, 1850, 2100, 2750, 1900, 3150, 2900, 3300, 1900, 3100,
              2700,
            ],
            borderColor: 'rgb(156, 163, 175)',
            backgroundColor: 'transparent',
          },
        ],
      },
    },
    {
      title: 'Pipeline Analytics',
      items: [
        {
          label: 'Processing (ms)',
          value: '6,240',
          color: 'bg-purple-500 dark:bg-purple-500',
        },
        {
          label: 'Volume (MB)',
          value: '4,500',
          color: 'bg-indigo-400 dark:bg-indigo-600',
        },
      ],
      chartData: {
        labels: Array(12).fill(''),
        datasets: [
          {
            data: [
              1800, 1350, 1200, 1800, 3150, 2250, 3300, 4650, 5700, 6300, 5850,
              5250,
            ],
            borderColor: 'rgb(168, 85, 247)',
            backgroundColor: 'transparent',
          },
          {
            data: [
              1500, 900, 750, 1350, 2550, 1500, 2250, 3000, 3750, 4500, 4200,
              3600,
            ],
            borderColor: 'rgb(129, 140, 248)',
            backgroundColor: 'transparent',
          },
        ],
      },
    },
  ];
}
