/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update area-charts/area-chart-10`
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
import { ChartData, TooltipModel } from 'chart.js';
import { MatDivider } from '@angular/material/divider';
import { MatChipSet, MatChip } from '@angular/material/chips';
import { DecimalPipe } from '@angular/common';
import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';

type SummaryItem = {
  name: string;
  value: number;
  color: string;
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-area-chart-10',
  templateUrl: './area-chart-10.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatDivider,
    MatChipSet,
    MatChip,
    DecimalPipe,
  ],
})
export class AreaChart10Component {
  private _cdr = inject(ChangeDetectorRef);
  tooltip: TooltipModel<'line'> | undefined;
  chartType = 'line' as const;
  chartPlugins = [verticalHoverLinePlugin];

  chartData: ChartData<'line', number[], string> = {
    labels: [
      'Aug 01',
      'Aug 02',
      'Aug 03',
      'Aug 04',
      'Aug 05',
      'Aug 06',
      'Aug 07',
      'Aug 08',
      'Aug 09',
      'Aug 10',
      'Aug 11',
      'Aug 12',
      'Aug 13',
      'Aug 14',
      'Aug 15',
    ],
    datasets: [
      {
        data: [
          1040, 1200, 1130, 1050, 920, 870, 790, 910, 951, 1232, 1230, 1289,
          1002, 1034, 1140,
        ],
        label: 'Successful requests',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
      },
      {
        data: [50, 60, 55, 48, 42, 38, 35, 41, 44, 56, 58, 62, 47, 49, 53],
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
          display: false,
        },
        ticks: {
          display: true,
          align: 'inner',
        },
      },
      y: {
        display: true,
        position: 'left',
        grid: {
          display: true,
          color: '#66666650',
        },
        border: {
          display: false,
        },
        ticks: {
          display: true,
          maxTicksLimit: 6,
          align: 'inner',
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
  };

  get summary(): SummaryItem[] {
    return this.chartData.datasets.map((dataset) => ({
      name: dataset.label ?? '',
      value: dataset.data.reduce((acc, curr) => acc + curr, 0),
      color: dataset.borderColor?.toString() ?? '',
    }));
  }

  get successRate(): number {
    const successful =
      this.chartData.datasets
        .find((d) => d.label?.toLowerCase().includes('successful'))
        ?.data.reduce((acc, curr) => acc + curr, 0) || 0;
    const errors =
      this.chartData.datasets
        .find((d) => d.label?.toLowerCase().includes('error'))
        ?.data.reduce((acc, curr) => acc + curr, 0) || 0;
    const total = successful + errors;
    return total > 0 ? (successful / total) * 100 : 0;
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
