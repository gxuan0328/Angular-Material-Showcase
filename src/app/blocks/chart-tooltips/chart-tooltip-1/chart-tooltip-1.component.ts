/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-tooltips/chart-tooltip-1`
*/

import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatButton } from '@angular/material/button';

import { ChartData, TooltipModel } from 'chart.js';

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-chart-tooltip-1',
  templateUrl: './chart-tooltip-1.component.html',
  imports: [BaseChartDirective, MatButton],
})
export class ChartTooltip1Component {
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

  private generateSeries(length: number, min: number, max: number): number[] {
    const series: number[] = [];
    for (let i = 0; i < length; i++) {
      series.push(Math.floor(min + Math.random() * (max - min)));
    }
    return series;
  }

  chartData: ChartData<'bar', number[], string> = {
    labels: this.labels,
    datasets: [
      {
        data: this.generateSeries(this.labels.length, 90, 190),
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
      x: { grid: { display: false }, ticks: { display: true } },
      y: {
        grid: { display: true, color: '#66666650' },
        ticks: { display: true, maxTicksLimit: 4 },
        border: { display: false },
      },
    },
  } as const;

  getTooltipTransform(
    caretX: number,
    tooltipWidth: number,
    chartWidth: number,
  ): string {
    if (caretX >= chartWidth / 2) {
      return `translateX(${caretX - tooltipWidth - TOOLTIP_SPACE}px)`;
    }
    return `translateX(${caretX + TOOLTIP_SPACE}px)`;
  }

  toggleDemo(): void {
    this.showDemo.update((value) => !value);
  }
}
