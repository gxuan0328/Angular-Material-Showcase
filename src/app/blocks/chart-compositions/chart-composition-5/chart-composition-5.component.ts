/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-compositions/chart-composition-5`
*/

import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatCard } from '@angular/material/card';
import { ChartData, TooltipModel } from 'chart.js';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { MatDivider } from '@angular/material/divider';
import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';
import {
  MatFormField,
  MatLabel,
  MatOption,
  MatSelect,
} from '@angular/material/select';

type DataPoint = {
  date: string;
  'Page views': number;
  'Unique visitors': number;
};

type SummaryTab = {
  name: string;
  value: string;
  chartData: ChartData<'line', number[], string>;
};

@Component({
  selector: 'ngm-dev-block-chart-composition-5',
  templateUrl: './chart-composition-5.component.html',
  styleUrls: ['./chart-composition-5.component.scss'],
  imports: [
    BaseChartDirective,
    MatCard,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    MatDivider,
    MatSelect,
    MatOption,
    MatFormField,
    MatLabel,
  ],
})
export class ChartComposition5Component {
  private _cdr = inject(ChangeDetectorRef);
  tooltip: TooltipModel<'line'> | undefined;
  chartType = 'line' as const;

  data: DataPoint[] = [
    {
      date: 'Sept 01',
      'Page views': 7543,
      'Unique visitors': 4823,
    },
    {
      date: 'Sept 02',
      'Page views': 11234,
      'Unique visitors': 7234,
    },
    {
      date: 'Sept 03',
      'Page views': 11123,
      'Unique visitors': 7432,
    },
    {
      date: 'Sept 04',
      'Page views': 11234,
      'Unique visitors': 8123,
    },
    {
      date: 'Sept 05',
      'Page views': 11023,
      'Unique visitors': 7432,
    },
    {
      date: 'Sept 06',
      'Page views': 11234,
      'Unique visitors': 7823,
    },
    {
      date: 'Sept 07',
      'Page views': 10432,
      'Unique visitors': 7654,
    },
    {
      date: 'Sept 08',
      'Page views': 10234,
      'Unique visitors': 8123,
    },
    {
      date: 'Sept 09',
      'Page views': 10543,
      'Unique visitors': 7432,
    },
    {
      date: 'Sept 10',
      'Page views': 10432,
      'Unique visitors': 8543,
    },
    {
      date: 'Sept 11',
      'Page views': 10654,
      'Unique visitors': 5234,
    },
    {
      date: 'Sept 12',
      'Page views': 10723,
      'Unique visitors': 5432,
    },
    {
      date: 'Sept 13',
      'Page views': 6823,
      'Unique visitors': 5123,
    },
    {
      date: 'Sept 14',
      'Page views': 6934,
      'Unique visitors': 4632,
    },
    {
      date: 'Sept 15',
      'Page views': 7432,
      'Unique visitors': 5234,
    },
    {
      date: 'Sept 16',
      'Page views': 8234,
      'Unique visitors': 5623,
    },
    {
      date: 'Sept 17',
      'Page views': 10543,
      'Unique visitors': 7234,
    },
    {
      date: 'Sept 18',
      'Page views': 10634,
      'Unique visitors': 7123,
    },
    {
      date: 'Sept 19',
      'Page views': 10823,
      'Unique visitors': 6934,
    },
    {
      date: 'Sept 20',
      'Page views': 11354,
      'Unique visitors': 7823,
    },
    {
      date: 'Sept 21',
      'Page views': 6932,
      'Unique visitors': 4623,
    },
    {
      date: 'Sept 22',
      'Page views': 7123,
      'Unique visitors': 5234,
    },
    {
      date: 'Sept 23',
      'Page views': 8234,
      'Unique visitors': 8123,
    },
    {
      date: 'Sept 24',
      'Page views': 9343,
      'Unique visitors': 8023,
    },
    {
      date: 'Sept 25',
      'Page views': 9523,
      'Unique visitors': 7432,
    },
    {
      date: 'Sept 26',
      'Page views': 9823,
      'Unique visitors': 7432,
    },
    {
      date: 'Sept 27',
      'Page views': 10234,
      'Unique visitors': 7332,
    },
    {
      date: 'Sept 28',
      'Page views': 10354,
      'Unique visitors': 8234,
    },
    {
      date: 'Sept 29',
      'Page views': 10543,
      'Unique visitors': 7543,
    },
    {
      date: 'Sept 30',
      'Page views': 10432,
      'Unique visitors': 9123,
    },
  ];

  summary: SummaryTab[] = [
    {
      name: 'Unique visitors',
      value: '234.5K',
      chartData: this.getChartData('Unique visitors'),
    },
    {
      name: 'Page views',
      value: '298K',
      chartData: this.getChartData('Page views'),
    },
  ];

  selectedTab = 0;
  chartPlugins = [verticalHoverLinePlugin];

  getChartData(metric: string): ChartData<'line', number[], string> {
    return {
      labels: this.data.map((d) => d.date),
      datasets: [
        {
          data: this.data.map((d) => d[metric as keyof DataPoint] as number),
          label: metric,
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          pointHoverBackgroundColor: 'rgb(139, 92, 246)',
          pointHoverBorderColor: 'rgb(139, 92, 246)',
          fill: true,
        },
      ],
    };
  }

  chartOptions: CustomChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        external: (context) => {
          this.tooltip = context.tooltip;
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
          align: 'inner',
          maxRotation: 0,
        },
      },
      y: {
        display: true,
        border: {
          display: false,
        },
        grid: {
          display: true,
          color: '#66666650',
        },
        ticks: {
          stepSize: 1000,
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
      mode: 'index',
      intersect: false,
    },
  };

  get mobileChartOptions(): CustomChartConfiguration<'line'>['options'] {
    return {
      ...this.chartOptions,
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
          },
          ticks: {
            callback: function (value, index, ticks) {
              if (index === 0 || index === ticks.length - 1) {
                return this.getLabelForValue(value as number);
              }
              return undefined;
            },
          },
        },
        y: {
          display: false,
        },
      },
    };
  }

  getTooltipTransform(
    caretX: number,
    tooltipWidth: number,
    chartWidth: number,
  ): string {
    const TOOLTIP_SPACE = 8;
    if (caretX + tooltipWidth + TOOLTIP_SPACE >= chartWidth) {
      return `translateX(${caretX - tooltipWidth - TOOLTIP_SPACE}px)`;
    } else {
      return `translateX(${caretX + TOOLTIP_SPACE}px)`;
    }
  }

  getFormattedValue(value: number | unknown): string {
    if (isNaN(value as number)) {
      return '';
    }
    const numValue = value as number;
    return new Intl.NumberFormat('en-US').format(numValue);
  }
}
