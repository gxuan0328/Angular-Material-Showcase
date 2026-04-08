/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update area-charts/area-chart-13`
*/

import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, TooltipModel } from 'chart.js';
import { MatDivider } from '@angular/material/divider';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
  MatCardSubtitle,
} from '@angular/material/card';
import { MatChipSet, MatChip, MatChipAvatar } from '@angular/material/chips';
import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';

type SummaryItem = {
  name: string;
  total: string;
  color: string;
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-area-chart-13',
  templateUrl: './area-chart-13.component.html',
  imports: [
    BaseChartDirective,
    MatDivider,
    MatChipSet,
    MatChip,
    MatChipAvatar,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle,
  ],
})
export class AreaChart13Component {
  private _cdr = inject(ChangeDetectorRef);
  tooltip: TooltipModel<'line'> | undefined;
  chartType = 'line' as const;

  chartData: ChartData<'line', number[], string> = {
    labels: ['Aug 01', 'Aug 08', 'Aug 15', 'Aug 22', 'Aug 31'],
    datasets: [
      {
        data: [1040, 910, 1140, 1040, 500],
        label: 'Successful requests',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
      },
      {
        data: [0, 0, 0, 0, 56],
        label: 'Errors',
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointHoverBackgroundColor: 'rgb(239, 68, 68)',
        pointHoverBorderColor: 'rgb(239, 68, 68)',
      },
    ],
  };

  chartOptions: CustomChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        position: 'nearest',
        external: ({ tooltip }) => {
          this.tooltip = tooltip;
          this._cdr.markForCheck();
        },
      },
      verticalHoverLine: {
        color: '#66666650',
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: '#66666650',
        },
        ticks: {
          display: true,
        },
      },
      y: {
        display: true,
        position: 'left',
        grid: {
          display: true,
          color: '#66666650',
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 4,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  summary: SummaryItem[] = [
    {
      name: 'Mean time to resolve',
      total: '47min 44s',
      color: 'bg-blue-500',
    },
    {
      name: 'Mean time to detect',
      total: '31min 8s',
      color: 'bg-red-500',
    },
  ];

  getTooltipTransform(
    caretX: number,
    tooltipWidth: number,
    chartWidth: number,
  ): string {
    // If tooltip would extend beyond the right half of the chart
    if (caretX >= chartWidth / 2) {
      // Position tooltip to the left of the caret point
      return `translateX(${caretX - tooltipWidth - TOOLTIP_SPACE}px)`;
    } else {
      // Position tooltip to the right of the caret point (default behavior)
      return `translateX(${caretX + TOOLTIP_SPACE}px)`;
    }
  }
}
