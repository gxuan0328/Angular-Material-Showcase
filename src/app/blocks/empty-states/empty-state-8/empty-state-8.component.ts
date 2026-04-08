/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update empty-states/empty-state-8`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

interface SummaryItem {
  category: string;
  total: string;
  color: string;
}

@Component({
  selector: 'ngm-dev-block-empty-state-8',
  templateUrl: './empty-state-8.component.html',
  imports: [MatIconModule, MatCardModule, BaseChartDirective],
})
export class EmptyState8Component {
  summary: SummaryItem[] = [
    {
      category: 'Revenue',
      total: '$0',
      color: 'rgb(59, 130, 246)', // blue-500
    },
    {
      category: 'Profit',
      total: '$0',
      color: 'rgb(6, 182, 212)', // cyan-500
    },
  ];

  chartData: ChartConfiguration<'line'>['data'] = {
    labels: ['12:00 AM', '12:00 PM'],
    datasets: [
      {
        data: [0, 0],
        label: 'Revenue',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        data: [0, 0],
        label: 'Profit',
        borderColor: 'rgb(6, 182, 212)',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };
}
