/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update donut-charts/donut-chart-2`
*/

import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { ChartData, ChartConfiguration } from 'chart.js';
import {
  MatList,
  MatListItem,
  MatListSubheaderCssMatStyler,
} from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';

type RegionItem = {
  region: string;
  value: number;
  color: string;
  href: string;
  subregions: {
    name: string;
    value: string;
  }[];
};

@Component({
  selector: 'ngm-dev-block-donut-chart-2',
  templateUrl: './donut-chart-2.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatList,
    MatListItem,
    MatDivider,
    MatListSubheaderCssMatStyler,
  ],
})
export class DonutChart2Component {
  chartType = 'doughnut' as const;

  data: RegionItem[] = [
    {
      region: 'North America',
      value: 78.3,
      color: '#3b82f6',
      href: '#',
      subregions: [
        {
          name: 'United States',
          value: '6.2/8M',
        },
        {
          name: 'Canada',
          value: '1.9/2.4M',
        },
      ],
    },
    {
      region: 'Asia Pacific',
      value: 69.7,
      color: '#8b5cf6',
      href: '#',
      subregions: [
        {
          name: 'Japan',
          value: '3.4/4.8M',
        },
        {
          name: 'Australia',
          value: '2.1/3.2M',
        },
      ],
    },
    {
      region: 'Europe',
      value: 61.2,
      color: '#d946ef',
      href: '#',
      subregions: [
        {
          name: 'Germany',
          value: '1.8/2.9M',
        },
        {
          name: 'United Kingdom',
          value: '2.3/3.7M',
        },
      ],
    },
  ];

  chartData: ChartData<'doughnut', number[], string> = {
    labels: this.data.map((item) => item.region),
    datasets: [
      {
        data: this.data.map((item) => item.value),
        backgroundColor: this.data.map((item) => item.color),
        borderWidth: 0,
      },
    ],
  };

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
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
    cutout: '60%',
  };

  get average(): string {
    return (
      this.data.reduce((a, b) => a + b.value, 0) / this.data.length
    ).toFixed(2);
  }
}
