/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bar-charts/bar-chart-8`
*/

import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
} from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { ChartConfiguration, ChartData, TooltipModel } from 'chart.js';
import { DecimalPipe } from '@angular/common';

type SummaryItem = { name: string; total: number; color: string };

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-bar-chart-8',

  imports: [
    BaseChartDirective,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatDivider,
    DecimalPipe,
    MatCardSubtitle,
  ],
  templateUrl: './bar-chart-8.component.html',
})
export class BarChart8Component {
  private readonly cdr = inject(ChangeDetectorRef);

  tooltip: TooltipModel<'bar'> | undefined;
  chartType = 'bar' as const;

  private readonly labels = Array.from(
    { length: 31 },
    (_, i) => `Aug ${String(i + 1).padStart(2, '0')}`,
  );

  private series(length: number, min: number, max: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < length; i++)
      out.push(Math.floor(min + Math.random() * (max - min)));
    return out;
  }

  readonly chartData: ChartData<'bar', number[], string> = {
    labels: this.labels,
    datasets: [
      {
        label: 'Successful requests',
        data: this.series(this.labels.length, 450, 1500),
        backgroundColor: 'rgb(59,130,246)',
        borderColor: 'rgb(59,130,246)',
        borderWidth: 1,
        stack: 's',
      },
      {
        label: 'Errors',
        data: this.series(this.labels.length, 0, 220),
        backgroundColor: 'rgb(239,68,68)',
        borderColor: 'rgb(239,68,68)',
        borderWidth: 1,
        stack: 's',
      },
    ],
  };

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
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { display: true, color: '#66666650' },
        ticks: { display: true },
        border: { display: false },
      },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  readonly summary: SummaryItem[] = [
    { name: 'Successful requests', total: 23450, color: 'bg-blue-500' },
    { name: 'Errors', total: 1397, color: 'bg-red-500' },
  ];

  getTooltipTransform(
    caretX: number,
    tooltipWidth: number,
    chartWidth: number,
  ): string {
    if (caretX + tooltipWidth + TOOLTIP_SPACE >= chartWidth)
      return `translateX(${caretX - tooltipWidth - TOOLTIP_SPACE}px)`;
    return `translateX(${caretX + TOOLTIP_SPACE}px)`;
  }
}
