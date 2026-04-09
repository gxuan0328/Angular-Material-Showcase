/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-tooltips/chart-tooltip-8`
*/

import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import {
  ChartConfiguration,
  ChartData,
  TooltipItem,
  TooltipModel,
} from 'chart.js';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-chart-tooltip-8',
  templateUrl: './chart-tooltip-8.component.html',
  imports: [BaseChartDirective, MatDivider, MatButton],
})
export class ChartTooltip8Component {
  private readonly cdr = inject(ChangeDetectorRef);
  tooltip: TooltipModel<'bar'> | undefined;
  chartType = 'bar' as const;
  showDemo = signal(false);

  private readonly labels: string[] = [
    'Oct 1',
    'Oct 2',
    'Oct 3',
    'Oct 4',
    'Oct 5',
    'Oct 6',
    'Oct 7',
    'Oct 8',
    'Oct 9',
  ];

  private rand(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max - min));
  }

  chartData: ChartData<'bar', number[], string> = {
    labels: this.labels,
    datasets: [
      {
        data: this.labels.map(() => this.rand(20, 100)),
        label: 'completed',
        backgroundColor: 'rgba(59, 130, 246)',
        borderColor: 'rgb(59, 130, 246)',
        stack: 's0',
      },
      {
        data: this.labels.map(() => this.rand(20, 100)),
        label: 'in progress',
        backgroundColor: 'rgba(234, 179, 8)',
        borderColor: 'rgb(234, 179, 8)',
        stack: 's0',
      },
      {
        data: this.labels.map(() => this.rand(20, 100)),
        label: 'on hold',
        backgroundColor: 'rgba(107, 114, 128)',
        borderColor: 'rgb(107, 114, 128)',
        stack: 's0',
      },
    ],
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
        position: 'nearest',
        external: ({ tooltip }: { tooltip: TooltipModel<'bar'> }) => {
          this.tooltip = tooltip;
          this.cdr.markForCheck();
        },
      },
    },
    interaction: { intersect: false, mode: 'index' as const },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { display: true, color: '#66666650' },
        border: { display: false },
        ticks: { maxTicksLimit: 4 },
      },
    },
  } as const;

  getTooltipTransform(
    caretX: number,
    tooltipWidth: number,
    chartWidth: number,
  ): string {
    if (caretX + tooltipWidth + TOOLTIP_SPACE >= chartWidth)
      return `translateX(${caretX - tooltipWidth - TOOLTIP_SPACE}px)`;
    return `translateX(${caretX + TOOLTIP_SPACE}px)`;
  }

  getPercentage(
    value: number | unknown,
    dataPoints: TooltipItem<'bar'>[] | undefined,
  ): string {
    if (typeof value !== 'number' || !dataPoints) return '';
    const total = dataPoints.reduce(
      (acc, point) => acc + (point.raw as number),
      0,
    );
    return ((value / total) * 100).toFixed(2);
  }

  toggleDemo(): void {
    this.showDemo.update((value) => !value);
  }
}
