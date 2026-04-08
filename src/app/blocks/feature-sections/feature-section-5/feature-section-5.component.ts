/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update feature-sections/feature-section-5`
*/

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'ngm-dev-block-feature-section-5',
  templateUrl: './feature-section-5.component.html',
  imports: [BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSection5Component {
  chartData: ChartData<'bar'> = {
    labels: [
      'Jan 23',
      'Feb 23',
      'Mar 23',
      'Apr 23',
      'May 23',
      'Jun 23',
      'Jul 23',
      'Aug 23',
      'Sep 23',
      'Oct 23',
      'Nov 23',
      'Dec 23',
    ],
    datasets: [
      {
        label: 'SolarPanels',
        data: [
          2890, 2756, 3322, 3470, 3475, 3129, 3490, 2903, 2643, 2837, 2954,
          3239,
        ],
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Inverters',
        data: [
          2338, 2103, 2194, 2108, 1812, 1726, 1982, 2012, 2342, 2473, 3848,
          3736,
        ],
        backgroundColor: 'rgba(153, 102, 255, 1)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  lineChartData: ChartData<'line', number[], string> = {
    labels: [
      'Jan 23',
      'Feb 23',
      'Mar 23',
      'Apr 23',
      'May 23',
      'Jun 23',
      'Jul 23',
      'Aug 23',
      'Sep 23',
      'Oct 23',
      'Nov 23',
      'Dec 23',
    ],
    datasets: [
      {
        label: 'SolarPanels',
        data: [
          750, 2756, 3322, 550, 3475, 412, 3490, 120, 2643, 349, 2954, 556,
        ],
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
      {
        label: 'Inverters',
        data: [
          375, 2103, 2194, 915, 1812, 213, 1982, 210, 2342, 943, 3848, 665,
        ],
        backgroundColor: 'rgba(153, 102, 255, 1)',
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: false,
      },
    ],
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: { beginAtZero: true, grid: { display: false } },
      y: { beginAtZero: true, grid: { display: false } },
    },
  };

  areaChartData: ChartData<'line', number[], string> = {
    labels: [
      'Jan 23',
      'Feb 23',
      'Mar 23',
      'Apr 23',
      'May 23',
      'Jun 23',
      'Jul 23',
      'Aug 23',
      'Sep 23',
      'Oct 23',
      'Nov 23',
      'Dec 23',
    ],
    datasets: [
      {
        label: 'SolarPanels',
        data: [
          2890, 2756, 3322, 3470, 3475, 3129, 3490, 2903, 2643, 2837, 2954,
          3239,
        ],
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: true,
      },
      {
        label: 'Inverters',
        data: [
          2338, 2103, 2194, 2108, 1812, 1726, 1982, 2012, 2342, 2473, 3848,
          3736,
        ],
        backgroundColor: 'rgba(153, 102, 255, 1)',
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: true,
      },
    ],
  };

  areaChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: { beginAtZero: true, grid: { display: false } },
      y: { beginAtZero: true, grid: { display: false } },
    },
  };
}
