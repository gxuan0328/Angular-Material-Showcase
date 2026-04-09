/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-compositions/chart-composition-9`
*/

import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartConfiguration, TooltipModel } from 'chart.js';
import { MatChip } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';
import { hoverSegmentPlugin } from '../../utils/constants/chart-plugins';
import {
  MatButton,
  MatButtonModule,
  MatIconButton,
} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

type DataPoint = {
  date: string;
  'GPU cluster': number;
  'Workspace usage': number;
};

type SummaryItem = {
  name: string;
  value: string;
};

@Component({
  selector: 'ngm-dev-block-chart-composition-9',
  templateUrl: './chart-composition-9.component.html',
  imports: [BaseChartDirective, MatChip, MatDivider, MatIconButton, MatIcon],
})
export class ChartComposition9Component {
  private _cdr = inject(ChangeDetectorRef);
  chartPlugins = [hoverSegmentPlugin];
  chartType = 'bar' as const;
  tooltip: TooltipModel<'bar'> | undefined;

  data: DataPoint[] = [
    {
      date: 'Sept 01',
      'GPU cluster': 7432,
      'Workspace usage': 4623,
    },
    {
      date: 'Sept 02',
      'GPU cluster': 11234,
      'Workspace usage': 7234,
    },
    {
      date: 'Sept 03',
      'GPU cluster': 11123,
      'Workspace usage': 7432,
    },
    {
      date: 'Sept 04',
      'GPU cluster': 11234,
      'Workspace usage': 8234,
    },
    {
      date: 'Sept 05',
      'GPU cluster': 11032,
      'Workspace usage': 7432,
    },
    {
      date: 'Sept 06',
      'GPU cluster': 11234,
      'Workspace usage': 7823,
    },
    {
      date: 'Sept 07',
      'GPU cluster': 10432,
      'Workspace usage': 7654,
    },
    {
      date: 'Sept 08',
      'GPU cluster': 10234,
      'Workspace usage': 8123,
    },
    {
      date: 'Sept 09',
      'GPU cluster': 10543,
      'Workspace usage': 7432,
    },
    {
      date: 'Sept 10',
      'GPU cluster': 10432,
      'Workspace usage': 8654,
    },
    {
      date: 'Sept 11',
      'GPU cluster': 10654,
      'Workspace usage': 5234,
    },
    {
      date: 'Sept 12',
      'GPU cluster': 10723,
      'Workspace usage': 5432,
    },
    {
      date: 'Sept 13',
      'GPU cluster': 6823,
      'Workspace usage': 5123,
    },
    {
      date: 'Sept 14',
      'GPU cluster': 6934,
      'Workspace usage': 4632,
    },
    {
      date: 'Sept 15',
      'GPU cluster': 7432,
      'Workspace usage': 5234,
    },
    {
      date: 'Sept 16',
      'GPU cluster': 8234,
      'Workspace usage': 5623,
    },
    {
      date: 'Sept 17',
      'GPU cluster': 10543,
      'Workspace usage': 7234,
    },
    {
      date: 'Sept 18',
      'GPU cluster': 10634,
      'Workspace usage': 7123,
    },
    {
      date: 'Sept 19',
      'GPU cluster': 10823,
      'Workspace usage': 6934,
    },
    {
      date: 'Sept 20',
      'GPU cluster': 11354,
      'Workspace usage': 7823,
    },
    {
      date: 'Sept 21',
      'GPU cluster': 14432,
      'Workspace usage': 14234,
    },
    {
      date: 'Sept 22',
      'GPU cluster': 14523,
      'Workspace usage': 12823,
    },
    {
      date: 'Sept 23',
      'GPU cluster': 14632,
      'Workspace usage': 10432,
    },
    {
      date: 'Sept 24',
      'GPU cluster': 15234,
      'Workspace usage': 9234,
    },
    {
      date: 'Sept 25',
      'GPU cluster': 16432,
      'Workspace usage': 10123,
    },
    {
      date: 'Sept 26',
      'GPU cluster': 17823,
      'Workspace usage': 11234,
    },
  ];

  chartData: ChartData<'bar', number[], string> = {
    labels: this.data.map((d) => d.date),
    datasets: [
      {
        data: this.data.map((d) => d['GPU cluster']),
        label: 'GPU cluster',
        backgroundColor: 'rgb(59, 130, 246)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        stack: 'stack1',
      },
      {
        data: this.data.map((d) => d['Workspace usage']),
        label: 'Workspace usage',
        backgroundColor: 'rgb(16, 185, 129)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        stack: 'stack1',
      },
    ],
  };

  chartOptions: CustomChartConfiguration<'bar'>['options'] = {
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
      hoverSegment: {
        color: '#66666650',
        indexAxis: 'x',
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        stacked: true,
        ticks: {
          maxRotation: 0,
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: '#66666650',
        },
        stacked: true,
        ticks: {
          callback: function (value) {
            return '$' + (Number(value) / 1000).toFixed(0) + 'K';
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 2,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  get mobileChartOptions(): ChartConfiguration<'bar'>['options'] {
    return {
      ...this.chartOptions,
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
          },
          stacked: true,
          ticks: {
            maxRotation: 0,
          },
        },
        y: {
          display: false,
          stacked: true,
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
    return '$' + (numValue / 1000).toFixed(0) + 'K';
  }

  summary: SummaryItem[] = [
    {
      name: 'Actual',
      value: '$8,432.15',
    },
    {
      name: 'Forecasted',
      value: '$10,823.25',
    },
    {
      name: 'Last invoice',
      value: 'Oct 22, 2024',
    },
  ];
}
