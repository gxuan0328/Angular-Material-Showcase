/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bar-charts/bar-chart-7`
*/

import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, TooltipModel } from 'chart.js';
import { MatDivider } from '@angular/material/divider';

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-bar-chart-7',

  imports: [BaseChartDirective, MatDivider],
  templateUrl: './bar-chart-7.component.html',
})
export class BarChart7Component {
  readonly metricLabel = 'Average BPM';
  private readonly cdr = inject(ChangeDetectorRef);
  tooltip: TooltipModel<'bar'> | undefined;
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

  readonly categories = ['Running', 'Cycling'];

  readonly data: ChartData<'bar', number[], string> = {
    labels: this.labels,
    datasets: [
      {
        label: 'Running',
        data: this.series(this.labels.length, 110, 175),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246)',
        borderWidth: 1,
      },
      {
        label: 'Cycling',
        data: this.series(this.labels.length, 100, 160),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  readonly average = signal<number>(
    Math.round(
      (this.data.datasets.reduce(
        (sum, ds) => sum + (ds.data as number[]).reduce((a, v) => a + v, 0),
        0,
      ) /
        (this.labels.length * this.data.datasets.length)) *
        10,
    ) / 10,
  );

  readonly chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top', align: 'end' },
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
        ticks: {
          display: true,
          callback: (value) => this.getFormattedValue(value),
          stepSize: 40,
        },
        border: { display: false },
      },
    },
  };

  getFormattedValue(value: number | unknown): string {
    if (typeof value !== 'number') return '';
    return value + ' bpm';
  }

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
