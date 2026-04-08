/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-14`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

type KpiData = {
  name: string;
  symbol: string;
  value: string;
  change: string;
  percentageChange: string;
  changeType: 'positive' | 'negative';
  chartData: ChartData<'line', number[], string>;
};

@Component({
  selector: 'ngm-dev-block-kpi-card-14',
  imports: [MatCard, MatCardContent, BaseChartDirective],
  templateUrl: './kpi-card-14.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard14Component {
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
      line: {
        borderWidth: 1.5,
        tension: 0.4,
      },
      point: {
        radius: 0,
      },
    },
  };

  data: KpiData[] = [
    {
      name: 'Tech Holdings Inc',
      symbol: 'THI',
      value: '$84.20',
      change: '-6.10',
      percentageChange: '-1.4%',
      changeType: 'negative',
      chartData: {
        labels: Array(15).fill(''),
        datasets: [
          {
            data: [82, 78, 75, 80, 85, 88, 92, 89, 87, 90, 88, 85, 87, 84, 82],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
          },
        ],
      },
    },
    {
      name: 'DataFlow Systems',
      symbol: 'DFS',
      value: '$156.80',
      change: '+18.50',
      percentageChange: '+13.4%',
      changeType: 'positive',
      chartData: {
        labels: Array(15).fill(''),
        datasets: [
          {
            data: [
              95, 102, 98, 105, 110, 115, 120, 118, 125, 130, 135, 140, 145,
              150, 156,
            ],
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
          },
        ],
      },
    },
    {
      name: 'CloudVenture Ltd',
      symbol: 'CVL',
      value: '$124.60',
      change: '+12.30',
      percentageChange: '+2.8%',
      changeType: 'positive',
      chartData: {
        labels: Array(15).fill(''),
        datasets: [
          {
            data: [
              105, 108, 110, 107, 109, 112, 115, 113, 116, 118, 120, 122, 121,
              123, 125,
            ],
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
          },
        ],
      },
    },
  ];
}
