/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-tooltips/chart-tooltip-5`
*/

import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { ChartData, TooltipItem, TooltipModel } from 'chart.js';

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-chart-tooltip-5',
  templateUrl: './chart-tooltip-5.component.html',
  imports: [BaseChartDirective, MatDivider, MatButton],
})
export class ChartTooltip5Component {
  private readonly cdr = inject(ChangeDetectorRef);
  tooltip: TooltipModel<'bar'> | undefined;
  chartType = 'bar' as const;
  showDemo = signal(false);

  private readonly labels: string[] = [
    'Oct 1, 2024',
    'Oct 2, 2024',
    'Oct 3, 2024',
    'Oct 4, 2024',
    'Oct 5, 2024',
    'Oct 6, 2024',
    'Oct 7, 2024',
    'Oct 8, 2024',
    'Oct 9, 2024',
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
        stack: 'stack-0',
      },
      {
        data: this.labels.map(() => this.rand(20, 100)),
        label: 'in progress',
        backgroundColor: 'rgba(6, 182, 212)',
        borderColor: 'rgb(6, 182, 212)',
        stack: 'stack-0',
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
    if (caretX >= chartWidth / 2) {
      return `translateX(${caretX - tooltipWidth - TOOLTIP_SPACE}px)`;
    }
    return `translateX(${caretX + TOOLTIP_SPACE}px)`;
  }

  getPercentage(
    value: number | unknown,
    dataPoints: TooltipItem<'bar'>[] | undefined,
  ): string {
    if (typeof value !== 'number' || !dataPoints) return '';
    const total = dataPoints.reduce(
      (sum, point) => sum + ((point?.raw as number) ?? 0),
      0,
    );
    return `${((value / total) * 100).toFixed(0)}%`;
  }

  toggleDemo(): void {
    this.showDemo.update((value) => !value);
  }
}
