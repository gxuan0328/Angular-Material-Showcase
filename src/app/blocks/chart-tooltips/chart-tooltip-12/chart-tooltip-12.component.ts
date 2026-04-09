/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-tooltips/chart-tooltip-12`
*/

import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatButton } from '@angular/material/button';

import { ChartData, TooltipModel } from 'chart.js';

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-chart-tooltip-12',
  templateUrl: './chart-tooltip-12.component.html',
  imports: [BaseChartDirective, MatButton],
})
export class ChartTooltip12Component {
  private readonly cdr = inject(ChangeDetectorRef);
  tooltip: TooltipModel<'bar'> | undefined;
  chartType = 'bar' as const;
  showDemo = signal(false);

  private readonly labels: string[] = [
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

  private gen(min: number, max: number): number[] {
    return this.labels.map(() => Math.floor(min + Math.random() * (max - min)));
  }

  chartData: ChartData<'bar', number[], string> = {
    labels: this.labels,
    datasets: [
      {
        data: this.gen(100, 180),
        label: 'Running',
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246)',
        borderWidth: 1,
      },
    ],
  };

  chartOptions = {
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

  getPercentage(label: string): number {
    if (label === this.labels[0]) return 0;
    const currentIndex = this.labels.findIndex((l) => l === label);
    const previousValue = this.chartData.datasets[0].data[currentIndex - 1];
    const currentValue = this.chartData.datasets[0].data[currentIndex];
    return ((currentValue - previousValue) / previousValue) * 100;
  }

  toggleDemo(): void {
    this.showDemo.update((value) => !value);
  }
}
