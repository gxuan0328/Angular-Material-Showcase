/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bar-charts/bar-chart-4`
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
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';

type RegionSummary = {
  name: string;
  total: number;
  change: string;
  changeType: 'positive' | 'negative';
  chartData: ChartData<'bar', number[], string>;
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-bar-chart-4',

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
    MatTabLabel,
  ],
  templateUrl: './bar-chart-4.component.html',
  styleUrls: ['./bar-chart-4.component.scss'],
})
export class BarChart4Component {
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

  readonly regions: RegionSummary[] = [
    {
      name: 'Europe',
      total: 350,
      change: '+2.1%',
      changeType: 'positive',
      chartData: {
        labels: this.labels,
        datasets: [
          {
            label: 'Successful',
            data: this.series(this.labels.length, 10, 60),
            borderWidth: 1,
            stack: 's',
          },
          {
            label: 'Refunded',
            data: this.series(this.labels.length, 0, 8),
            borderWidth: 1,
            stack: 's',
          },
          {
            label: 'Fraud alert',
            data: this.series(this.labels.length, 0, 6),
            borderWidth: 1,
            stack: 's',
          },
        ],
      },
    },
    {
      name: 'Asia',
      total: 720,
      change: '-0.4%',
      changeType: 'negative',
      chartData: {
        labels: this.labels,
        datasets: [
          {
            label: 'Successful',
            data: this.series(this.labels.length, 15, 70),
            borderWidth: 1,
            stack: 's',
          },
          {
            label: 'Refunded',
            data: this.series(this.labels.length, 0, 6),
            borderWidth: 1,
            stack: 's',
          },
          {
            label: 'Fraud alert',
            data: this.series(this.labels.length, 0, 5),
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
