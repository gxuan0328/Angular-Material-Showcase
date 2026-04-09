/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bar-charts/bar-chart-5`
*/

import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { ChartConfiguration, ChartData, TooltipModel } from 'chart.js';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

type RegionTab = {
  name: string;
  chartData: ChartData<'bar', number[], string>;
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-bar-chart-5',

  imports: [
    BaseChartDirective,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatDivider,
    MatTabGroup,
    MatTab,
    MatList,
    MatListItem,
    MatListItemIcon,
  ],
  templateUrl: './bar-chart-5.component.html',
})
export class BarChart5Component {
  private readonly cdr = inject(ChangeDetectorRef);

  tooltip: TooltipModel<'bar'> | undefined;
  chartType = 'bar' as const;

  private readonly labels = [
    'Jan 24',
    'Feb 24',
    'Mar 24',
    'Apr 24',
    'May 24',
    'Jun 24',
    'Jul 24',
    'Aug 24',
    'Sep 24',
    'Oct 24',
    'Nov 24',
    'Dec 24',
  ];

  private series(length: number, min: number, max: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < length; i++)
      out.push(Math.floor(min + Math.random() * (max - min)));
    return out;
  }

  readonly tabs: RegionTab[] = [
    {
      name: 'Europe',
      chartData: {
        labels: this.labels,
        datasets: [
          {
            label: 'Successful',
            data: this.series(this.labels.length, 10, 60),
            backgroundColor: 'rgb(59,130,246)',
            borderColor: 'rgb(59,130,246)',
            borderWidth: 1,
            stack: 's',
          },
          {
            label: 'Refunded',
            data: this.series(this.labels.length, 0, 8),
            backgroundColor: 'rgb(139,92,246)',
            borderColor: 'rgb(139,92,246)',
            borderWidth: 1,
            stack: 's',
          },
          {
            label: 'Fraud alert',
            data: this.series(this.labels.length, 0, 6),
            backgroundColor: 'rgb(217,70,239)',
            borderColor: 'rgb(217,70,239)',
            borderWidth: 1,
            stack: 's',
          },
        ],
      },
    },
    {
      name: 'North America',
      chartData: {
        labels: this.labels,
        datasets: [
          {
            label: 'Successful',
            data: this.series(this.labels.length, 20, 80),
            backgroundColor: 'rgb(59,130,246)',
            borderColor: 'rgb(59,130,246)',
            borderWidth: 1,
            stack: 's',
          },
          {
            label: 'Refunded',
            data: this.series(this.labels.length, 0, 9),
            backgroundColor: 'rgb(139,92,246)',
            borderColor: 'rgb(139,92,246)',
            borderWidth: 1,
            stack: 's',
          },
          {
            label: 'Fraud alert',
            data: this.series(this.labels.length, 0, 7),
            backgroundColor: 'rgb(217,70,239)',
            borderColor: 'rgb(217,70,239)',
            borderWidth: 1,
            stack: 's',
          },
        ],
      },
    },
    {
      name: 'Asia',
      chartData: {
        labels: this.labels,
        datasets: [
          {
            label: 'Successful',
            data: this.series(this.labels.length, 12, 65),
            backgroundColor: 'rgb(59,130,246)',
            borderColor: 'rgb(59,130,246)',
            borderWidth: 1,
            stack: 's',
          },
          {
            label: 'Refunded',
            data: this.series(this.labels.length, 0, 8),
            backgroundColor: 'rgb(139,92,246)',
            borderColor: 'rgb(139,92,246)',
            borderWidth: 1,
            stack: 's',
          },
          {
            label: 'Fraud alert',
            data: this.series(this.labels.length, 0, 6),
            backgroundColor: 'rgb(217,70,239)',
            borderColor: 'rgb(217,70,239)',
            borderWidth: 1,
            stack: 's',
          },
        ],
      },
    },
  ];

  readonly chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        position: 'nearest',
        external: ({ tooltip }) => {
          this.tooltip = tooltip as TooltipModel<'bar'>;
          this.cdr.markForCheck();
        },
      },
    },
    interaction: { intersect: false, mode: 'index' },
    scales: {
      x: { grid: { display: false }, ticks: { display: true } },
      y: {
        grid: { display: true, color: '#66666650' },
        ticks: { display: false, maxTicksLimit: 4 },
        border: { display: false },
      },
    },
  };

  getTooltipTransform(
    caretX: number,
    tooltipWidth: number,
    chartWidth: number,
  ): string {
    if (caretX + tooltipWidth + TOOLTIP_SPACE >= chartWidth)
      return `translateX(${caretX - tooltipWidth - TOOLTIP_SPACE}px)`;
    return `translateX(${caretX + TOOLTIP_SPACE}px)`;
  }

  getTotal(data: number[]): string {
    return data.reduce((acc, curr) => acc + curr, 0).toString();
  }
}
