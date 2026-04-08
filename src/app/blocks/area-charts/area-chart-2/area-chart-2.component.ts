/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update area-charts/area-chart-2`
*/

import { Component, signal, inject, ChangeDetectorRef } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { ChartData, TooltipModel } from 'chart.js';
import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem, MatListItemIcon } from '@angular/material/list';
import { DecimalPipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

type SummaryItem = {
  name: string;
  value: number;
  color: string;
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-area-chart-2',
  templateUrl: './area-chart-2.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatDivider,
    MatList,
    MatListItem,
    MatListItemIcon,
    DecimalPipe,
    MatIconButton,
    MatIcon,
  ],
})
export class AreaChart2Component {
  private _cdr = inject(ChangeDetectorRef);

  tooltip: TooltipModel<'line'> | undefined;
  chartType = 'line' as const;

  isOpen = signal(true);

  chartData: ChartData<'line', number[], string> = {
    labels: [
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
    ],
    datasets: [
      {
        data: [232, 241, 291, 101, 318, 205, 372, 341, 387, 220, 372, 321],
        label: 'Organic',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
        fill: true,
        tension: 0.4,
      },
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 120, 0, 0, 0],
        label: 'Sponsored',
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        pointHoverBackgroundColor: 'rgb(139, 92, 246)',
        pointHoverBorderColor: 'rgb(139, 92, 246)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  chartPlugins = [verticalHoverLinePlugin];

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
        external: ({ tooltip }: { tooltip: TooltipModel<'line'> }) => {
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
          display: false,
        },
        ticks: {
          display: true,
          align: 'inner',
          callback: (_tickValue, index, ticks) => {
            if (index === 0 || index === ticks.length - 1) {
              return this.chartData.labels?.[index] ?? '';
            }
            return undefined;
          },
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: '#66666650',
        },
        border: {
          display: false,
        },
        ticks: {
          display: false,
          maxTicksLimit: 4,
        },
        title: {
          display: false,
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
    layout: {
      padding: {
        left: -8,
      },
    },
  };

  get summary(): SummaryItem[] {
    return this.chartData.datasets.map((dataset) => ({
      name: dataset.label ?? '',
      value: dataset.data.reduce((acc, curr) => {
        const numAcc = typeof acc === 'number' ? acc : 0;
        const numCurr = typeof curr === 'number' ? curr : 0;
        return numAcc + numCurr;
      }, 0),
      color: dataset.borderColor?.toString() ?? '',
    }));
  }

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
