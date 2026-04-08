/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update area-charts/area-chart-8`
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
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { ChartData, TooltipModel } from 'chart.js';
import { MatDivider } from '@angular/material/divider';
import {
  MatList,
  MatListItem,
  MatListItemIcon,
  MatNavList,
  MatListItemTitle,
  MatListItemLine,
} from '@angular/material/list';
import { DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';

type AlertText = {
  title: string;
  body: string;
  href: string;
};

type Region = {
  name: string;
  alerts: number;
  chartData: ChartData<'line', number[], string>;
  alertTexts: AlertText[];
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-area-chart-8',
  templateUrl: './area-chart-8.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatTabGroup,
    MatTab,
    MatDivider,
    MatList,
    MatListItem,
    MatListItemIcon,
    DecimalPipe,
    MatNavList,
    MatIcon,
    MatListItemTitle,
  ],
})
export class AreaChart8Component {
  private _cdr = inject(ChangeDetectorRef);
  tooltip: TooltipModel<'line'> | undefined;
  chartType = 'line' as const;
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
            // For regions data, we'll use the first region's labels as reference
            const labels = this.regions[0]?.chartData.labels;
            if (index === 0 || index === ticks.length - 1) {
              return labels?.[index] ?? '';
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

  regions: Region[] = [
    {
      name: 'Europe',
      alerts: 2,
      chartData: {
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
              68560, 70320, 80233, 55123, 56000, 100000, 85390, 80100, 75090,
              71080, 68041, 60143,
            ],
            label: 'Sales',
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointHoverBackgroundColor: 'rgb(139, 92, 246)',
            pointHoverBorderColor: 'rgb(139, 92, 246)',
          },
        ],
      },
      alertTexts: [
        {
          title: 'New customer closed',
          body: 'Stone Holding signed $0.5M deal after 6-month-long negotiation...',
          href: '#',
        },
        {
          title: 'Contract renewed',
          body: 'Eccel Mountain, Inc. renewed $1.2M annual contract...',
          href: '#',
        },
      ],
    },
    {
      name: 'Asia',
      alerts: 2,
      chartData: {
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
              28560, 30320, 70233, 45123, 56000, 80600, 85390, 40100, 35090,
              71080, 68041, 70143,
            ],
            label: 'Sales',
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointHoverBackgroundColor: 'rgb(139, 92, 246)',
            pointHoverBorderColor: 'rgb(139, 92, 246)',
          },
        ],
      },
      alertTexts: [
        {
          title: 'Diamond customer lost',
          body: 'Tech, Inc. has made the decision not to proceed with the renewal of $4M annual contract...',
          href: '#',
        },
        {
          title: 'Strong competition activity',
          body: 'Rose Holding faces heightened competition in the market, leading to the strategic decision...',
          href: '#',
        },
      ],
    },
    {
      name: 'North America',
      alerts: 3,
      chartData: {
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
              78560, 70320, 50233, 45123, 46000, 50600, 65390, 70100, 85090,
              81080, 98041, 90143,
            ],
            label: 'Sales',
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointHoverBackgroundColor: 'rgb(139, 92, 246)',
            pointHoverBorderColor: 'rgb(139, 92, 246)',
          },
        ],
      },
      alertTexts: [
        {
          title: 'Paid pilot won',
          body: 'Storm Company signs $0.3M deal to co-create B2B platform product...',
          href: '#',
        },
        {
          title: 'Diamond customer won',
          body: 'Neo Products LLC signs $3.4M deal...',
          href: '#',
        },
        {
          title: 'Government listing won',
          body: 'Won $3.4M government contract after a competitive bidding process...',
          href: '#',
        },
      ],
    },
  ];

  getSummaryForRegion(region: Region) {
    return region.chartData.datasets.map((dataset) => ({
      name: dataset.label ?? '',
      value: dataset.data.reduce((acc, curr) => acc + curr, 0),
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
