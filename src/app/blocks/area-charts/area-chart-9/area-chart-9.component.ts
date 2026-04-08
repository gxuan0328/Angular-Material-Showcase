/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update area-charts/area-chart-9`
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
import {
  MatList,
  MatListItem,
  MatListItemIcon,
  MatListItemMeta,
  MatListItemTitle,
  MatListItemLine,
} from '@angular/material/list';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';

type SummaryItem = {
  location: string;
  rank: string;
  color: string;
  type: string;
  total: string;
  share: string;
  changeType: 'positive' | 'negative';
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-area-chart-9',
  templateUrl: './area-chart-9.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatDivider,
    MatList,
    MatListItem,
    MatListItemIcon,
    DecimalPipe,
    CurrencyPipe,
    MatListItemMeta,
    MatIcon,
    MatListItemTitle,
    MatListItemLine,
  ],
})
export class AreaChart9Component {
  private _cdr = inject(ChangeDetectorRef);
  readonly Number = Number;
  tooltip: TooltipModel<'line'> | undefined;
  chartType = 'line' as const;

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
        data: [
          42340, 50120, 45190, 56420, 40420, 47010, 47490, 39610, 45860, 50910,
          49190, 55190,
        ],
        label: 'Revenue',
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointHoverBackgroundColor: 'rgb(139, 92, 246)',
        pointHoverBorderColor: 'rgb(139, 92, 246)',
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
          callback: (_tickValue, index, ticks) => {
            if (index === 0 || index === ticks.length - 1) {
              return this.chartData.labels?.[index] ?? '';
            }
            return;
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

  get summary() {
    return this.chartData.datasets.map((dataset) => ({
      name: dataset.label ?? '',
      value: dataset.data.reduce((acc, curr) => acc + curr, 0),
      color: dataset.borderColor?.toString() ?? '',
    }));
  }

  get total(): number {
    return this.chartData.datasets.reduce(
      (acc, dataset) =>
        acc + dataset.data.reduce((sum, value) => sum + value, 0),
      0,
    );
  }

  currentTabData: SummaryItem[] = [
    {
      location: 'Direct Online-Shops',
      rank: 'Prev. rank: #2',
      color: 'bg-blue-500',
      type: 'Flagship',
      total: '460200',
      share: '37.1%',
      changeType: 'positive',
    },
    {
      location: 'Wholesale',
      rank: 'Prev. rank: #1',
      color: 'bg-cyan-500',
      type: 'In-Store',
      total: '237300',
      share: '31.2%',
      changeType: 'negative',
    },
    {
      location: 'Offline Stores',
      rank: 'Prev. rank: #4',
      color: 'bg-sky-500',
      type: 'In-Store',
      total: '118200',
      share: '12.7%',
      changeType: 'positive',
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
