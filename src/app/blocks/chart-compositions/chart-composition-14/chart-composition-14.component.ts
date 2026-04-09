/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-compositions/chart-composition-14`
*/

import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  MatCard,
  MatCardHeader,
  MatCardSubtitle,
  MatCardContent,
} from '@angular/material/card';
import { ChartData, ChartConfiguration, TooltipModel } from 'chart.js';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';

import { CategoryBarComponent } from '../../components/category-bar/category-bar.component';
import { MatIconButton } from '@angular/material/button';
import { AvailableChartColorsKeys } from '../../utils/functions/chart-utils';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { NgTemplateOutlet } from '@angular/common';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';

const TOOLTIP_SPACE = 8;

type DataPoint = {
  date: string;
  'Uptime monitoring': number;
  'Performance metrics': number;
  'Security alerts': number;
  'System health': number;
};

type StatItem = {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
};

@Component({
  selector: 'ngm-dev-block-chart-composition-14',
  templateUrl: './chart-composition-14.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatDivider,
    MatIcon,
    CategoryBarComponent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardContent,
    MatIconButton,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    NgTemplateOutlet,
  ],
})
export class ChartComposition14Component {
  private _cdr = inject(ChangeDetectorRef);
  chartType = 'line' as const;
  tooltip: TooltipModel<'line'> | undefined;
  chartplugins = [verticalHoverLinePlugin];
  data: DataPoint[] = [
    {
      date: 'Oct 08, 2024',
      'Uptime monitoring': 99.8,
      'Performance metrics': 95.2,
      'Security alerts': 4,
      'System health': 98.5,
    },
    {
      date: 'Oct 09, 2024',
      'Uptime monitoring': 99.9,
      'Performance metrics': 96.1,
      'Security alerts': 2,
      'System health': 99.1,
    },
    {
      date: 'Oct 10, 2024',
      'Uptime monitoring': 99.7,
      'Performance metrics': 94.8,
      'Security alerts': 5,
      'System health': 97.9,
    },
    {
      date: 'Oct 11, 2024',
      'Uptime monitoring': 99.95,
      'Performance metrics': 97.2,
      'Security alerts': 1,
      'System health': 99.5,
    },
    {
      date: 'Oct 12, 2024',
      'Uptime monitoring': 99.85,
      'Performance metrics': 96.8,
      'Security alerts': 3,
      'System health': 98.8,
    },
    {
      date: 'Oct 13, 2024',
      'Uptime monitoring': 99.92,
      'Performance metrics': 95.9,
      'Security alerts': 2,
      'System health': 99.2,
    },
    {
      date: 'Oct 14, 2024',
      'Uptime monitoring': 99.88,
      'Performance metrics': 96.5,
      'Security alerts': 4,
      'System health': 98.9,
    },
    {
      date: 'Oct 15, 2024',
      'Uptime monitoring': 99.93,
      'Performance metrics': 97.1,
      'Security alerts': 1,
      'System health': 99.4,
    },
    {
      date: 'Oct 16, 2024',
      'Uptime monitoring': 99.91,
      'Performance metrics': 96.7,
      'Security alerts': 2,
      'System health': 99.1,
    },
    {
      date: 'Oct 17, 2024',
      'Uptime monitoring': 99.89,
      'Performance metrics': 95.8,
      'Security alerts': 3,
      'System health': 98.7,
    },
    {
      date: 'Oct 18, 2024',
      'Uptime monitoring': 99.94,
      'Performance metrics': 96.9,
      'Security alerts': 1,
      'System health': 99.3,
    },
    {
      date: 'Oct 19, 2024',
      'Uptime monitoring': 99.87,
      'Performance metrics': 96.2,
      'Security alerts': 3,
      'System health': 98.9,
    },
    {
      date: 'Oct 20, 2024',
      'Uptime monitoring': 99.96,
      'Performance metrics': 97.4,
      'Security alerts': 0,
      'System health': 99.6,
    },
    {
      date: 'Oct 21, 2024',
      'Uptime monitoring': 99.93,
      'Performance metrics': 96.8,
      'Security alerts': 2,
      'System health': 99.2,
    },
    {
      date: 'Oct 22, 2024',
      'Uptime monitoring': 99.97,
      'Performance metrics': 97.1,
      'Security alerts': 1,
      'System health': 99.5,
    },
  ];

  stats: StatItem[] = [
    {
      name: 'Uptime monitoring',
      value: '99.97%',
      change: '+0.12%',
      changeType: 'positive',
    },
    {
      name: 'Performance metrics',
      value: '97.1%',
      change: '+2.3%',
      changeType: 'positive',
    },
    {
      name: 'Security alerts',
      value: '1',
      change: '-67%',
      changeType: 'positive',
    },
    {
      name: 'System health',
      value: '99.5%',
      change: '+0.8%',
      changeType: 'positive',
    },
    {
      name: 'Response time',
      value: '4.2ms',
      change: '-12%',
      changeType: 'positive',
    },
    {
      name: 'Error rate',
      value: '0.03%',
      change: '-45%',
      changeType: 'positive',
    },
  ];

  // Category bars for uptime summary
  uptimeValues = [90.1, 8, 1.9];
  uptimeColors: AvailableChartColorsKeys[] = ['blue', 'red', 'gray'];

  incidentValues = [91.2, 8.8];
  incidentColors: AvailableChartColorsKeys[] = ['blue', 'gray'];

  chartData: ChartData<'line', number[], string> = {
    labels: this.data.map((d) => d.date),
    datasets: [
      {
        data: this.data.map((d) => d['System health'] as number),
        label: 'System health',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
        fill: true,
        pointRadius: 0,
      },
      {
        data: this.data.map((d) => d['Performance metrics'] as number),
        label: 'Performance metrics',
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        pointHoverBackgroundColor: 'rgb(139, 92, 246)',
        pointHoverBorderColor: 'rgb(139, 92, 246)',
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
        ticks: {
          maxRotation: 0,
          maxTicksLimit: 10,
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
}
