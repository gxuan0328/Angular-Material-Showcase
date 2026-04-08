/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-19`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

type KpiData = {
  name: string;
  currentValue: string;
  change: string;
  isPositive: boolean;
  date: string;
  chartData: ChartData<'line', number[], string>;
};

@Component({
  selector: 'ngm-dev-block-kpi-card-19',
  imports: [MatCard, MatCardContent, BaseChartDirective],
  templateUrl: './kpi-card-19.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard19Component {
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: {
          callback: function (value, index, ticks) {
            if (index === 0 || index === ticks.length - 1) {
              return this.getLabelForValue(value as number);
            }
            return undefined;
          },
        },
      },
      y: { display: false },
    },
    elements: {
      line: {
        borderWidth: 2,
        tension: 0.4,
      },
      point: {
        radius: 0,
        hoverRadius: 4,
      },
    },
  };

  data: KpiData[] = [
    {
      name: 'Active users',
      currentValue: '842',
      change: '+12.3% (+$2,450)',
      isPositive: true,
      date: 'Dec 23',
      chartData: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            data: [345, 498, 620, 556, 465, 685, 580, 462, 625, 520, 410, 842],
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
          },
        ],
      },
    },
    {
      name: 'Total sessions',
      currentValue: '1,248',
      change: '-8.5% (-$1,820)',
      isPositive: false,
      date: 'Dec 23',
      chartData: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            data: [
              1542, 1248, 1302, 1125, 768, 945, 810, 920, 955, 650, 820, 1248,
            ],
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
          },
        ],
      },
    },
    {
      name: 'Monthly revenue',
      currentValue: '$5,950',
      change: '+18.7% (+$3,420)',
      isPositive: true,
      date: 'Dec 23',
      chartData: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            data: [
              2800, 2400, 2650, 2100, 3000, 2700, 3600, 3400, 2550, 2500, 2900,
              5950,
            ],
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
          },
        ],
      },
    },
  ];
}
