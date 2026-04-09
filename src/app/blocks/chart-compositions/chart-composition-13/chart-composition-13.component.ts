/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-compositions/chart-composition-13`
*/

import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatCard } from '@angular/material/card';
import { ChartData, ChartConfiguration, TooltipModel } from 'chart.js';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';
import { NgTemplateOutlet } from '@angular/common';
import { MatDivider } from '@angular/material/divider';

type DataPoint = {
  date: string;
  'Avg. response time': number;
  'Total incident length': number;
  MTTR: number;
  MTTA: number;
};

type StatTab = {
  name: string;
  value: string;
  active: boolean;
  chartData: ChartData<'line', number[], string>;
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-chart-composition-13',
  templateUrl: './chart-composition-13.component.html',
  styleUrls: ['./chart-composition-13.component.scss'],
  imports: [
    BaseChartDirective,
    MatCard,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    NgTemplateOutlet,
    MatDivider,
  ],
})
export class ChartComposition13Component {
  chartType = 'line' as const;
  chartplugins = [verticalHoverLinePlugin];
  tooltip: TooltipModel<'line'> | undefined;
  private _cdr = inject(ChangeDetectorRef);

  data: DataPoint[] = [
    {
      date: 'Day 1',
      'Avg. response time': 7.2,
      'Total incident length': 34,
      MTTR: 48,
      MTTA: 54,
    },
    {
      date: 'Day 2',
      'Avg. response time': 7.8,
      'Total incident length': 49,
      MTTR: 62,
      MTTA: 69,
    },
    {
      date: 'Day 3',
      'Avg. response time': 9.5,
      'Total incident length': 57,
      MTTR: 69,
      MTTA: 78,
    },
    {
      date: 'Day 4',
      'Avg. response time': 13.2,
      'Total incident length': 142,
      MTTR: 108,
      MTTA: 97,
    },
    {
      date: 'Day 5',
      'Avg. response time': 24.1,
      'Total incident length': 115,
      MTTR: 103,
      MTTA: 94,
    },
    {
      date: 'Day 6',
      'Avg. response time': 15.3,
      'Total incident length': 158,
      MTTR: 128,
      MTTA: 108,
    },
    {
      date: 'Day 7',
      'Avg. response time': 38.2,
      'Total incident length': 134,
      MTTR: 118,
      MTTA: 92,
    },
    {
      date: 'Day 8',
      'Avg. response time': 12.1,
      'Total incident length': 152,
      MTTR: 135,
      MTTA: 105,
    },
    {
      date: 'Day 9',
      'Avg. response time': 11.2,
      'Total incident length': 124,
      MTTR: 105,
      MTTA: 94,
    },
    {
      date: 'Day 10',
      'Avg. response time': 14.5,
      'Total incident length': 163,
      MTTR: 127,
      MTTA: 118,
    },
    {
      date: 'Day 11',
      'Avg. response time': 14.2,
      'Total incident length': 152,
      MTTR: 134,
      MTTA: 108,
    },
    {
      date: 'Day 12',
      'Avg. response time': 12.1,
      'Total incident length': 147,
      MTTR: 118,
      MTTA: 105,
    },
    {
      date: 'Day 13',
      'Avg. response time': 16.3,
      'Total incident length': 184,
      MTTR: 142,
      MTTA: 124,
    },
    {
      date: 'Day 14',
      'Avg. response time': 13.2,
      'Total incident length': 147,
      MTTR: 124,
      MTTA: 113,
    },
    {
      date: 'Day 15',
      'Avg. response time': 11.8,
      'Total incident length': 142,
      MTTR: 118,
      MTTA: 103,
    },
    {
      date: 'Day 16',
      'Avg. response time': 48.5,
      'Total incident length': 178,
      MTTR: 134,
      MTTA: 124,
    },
    {
      date: 'Day 17',
      'Avg. response time': 38.2,
      'Total incident length': 163,
      MTTR: 128,
      MTTA: 108,
    },
    {
      date: 'Day 18',
      'Avg. response time': 11.2,
      'Total incident length': 152,
      MTTR: 121,
      MTTA: 113,
    },
    {
      date: 'Day 19',
      'Avg. response time': 27.3,
      'Total incident length': 147,
      MTTR: 124,
      MTTA: 118,
    },
    {
      date: 'Day 20',
      'Avg. response time': 58.9,
      'Total incident length': 173,
      MTTR: 152,
      MTTA: 134,
    },
    {
      date: 'Day 21',
      'Avg. response time': 65.2,
      'Total incident length': 194,
      MTTR: 163,
      MTTA: 142,
    },
    {
      date: 'Day 22',
      'Avg. response time': 48.5,
      'Total incident length': 168,
      MTTR: 147,
      MTTA: 128,
    },
    {
      date: 'Day 23',
      'Avg. response time': 53.8,
      'Total incident length': 184,
      MTTR: 152,
      MTTA: 134,
    },
    {
      date: 'Day 24',
      'Avg. response time': 16.3,
      'Total incident length': 152,
      MTTR: 127,
      MTTA: 113,
    },
    {
      date: 'Day 25',
      'Avg. response time': 43.2,
      'Total incident length': 173,
      MTTR: 142,
      MTTA: 128,
    },
  ];

  stats: StatTab[] = [
    {
      name: 'Avg. response time',
      value: '37s',
      active: true,
      chartData: this.getChartData('Avg. response time'),
    },
    {
      name: 'Total incident length',
      value: '1min 42s',
      active: false,
      chartData: this.getChartData('Total incident length'),
    },
    {
      name: 'MTTA',
      value: '3min 45s',
      active: false,
      chartData: this.getChartData('MTTA'),
    },
    {
      name: 'MTTR',
      value: '5min 38s',
      active: false,
      chartData: this.getChartData('MTTR'),
    },
  ];

  selectedTab = 0;

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

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          pointStyle: 'rectRounded',
          pointStyleWidth: 20,
          boxHeight: 2,
        },
      },
      tooltip: {
        enabled: false,
        external: ({ tooltip }) => {
          this.tooltip = tooltip;
          this._cdr.markForCheck();
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: '#66666650',
        },
        ticks: {
          callback: (value) => {
            return this.valueFormatter(value);
          },
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

  get mobileChartOptions(): ChartConfiguration<'line'>['options'] {
    return {
      ...this.chartOptions,
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
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
    if (caretX + tooltipWidth + TOOLTIP_SPACE >= chartWidth) {
      return `translateX(${caretX - tooltipWidth - TOOLTIP_SPACE}px)`;
    } else {
      return `translateX(${caretX + TOOLTIP_SPACE}px)`;
    }
  }

  valueFormatter = (seconds: number | unknown) => {
    if (isNaN(seconds as number)) {
      return '';
    }
    const secondsValue = seconds as number;
    if (secondsValue < 60) {
      return `${secondsValue.toFixed(1)}s`;
    } else {
      const minutes = (secondsValue / 60).toFixed(1);
      return `${minutes}min`;
    }
  };
}
