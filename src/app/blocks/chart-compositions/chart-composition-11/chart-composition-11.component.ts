/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-compositions/chart-composition-11`
*/

import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { ChartData, ChartConfiguration, TooltipModel } from 'chart.js';
import { MatFormField, MatSelect, MatOption } from '@angular/material/select';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import {
  MatButtonToggleGroup,
  MatButtonToggle,
} from '@angular/material/button-toggle';
import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';

const TOOLTIP_SPACE = 8;

type DataPoint = {
  date: string;
  'Name lookup': number;
  Connection: number;
  'TLS handshake': number;
  'Data transfer': number;
};

type SummaryItem = {
  name: string;
  value: string;
};

@Component({
  selector: 'ngm-dev-block-chart-composition-11',
  templateUrl: './chart-composition-11.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatCardContent,
    MatFormField,
    MatSelect,
    MatOption,
    MatDivider,
    MatIcon,
    MatButton,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatCardHeader,
    MatCardTitle,
  ],
})
export class ChartComposition11Component {
  private _cdr = inject(ChangeDetectorRef);
  tooltip: TooltipModel<'line'> | undefined;
  chartType = 'line' as const;
  chartPlugins = [verticalHoverLinePlugin];

  data: DataPoint[] = [
    {
      date: '01:29am',
      'Name lookup': 823,
      Connection: 634,
      'TLS handshake': 323,
      'Data transfer': 223,
    },
    {
      date: '01:42am',
      'Name lookup': 834,
      Connection: 623,
      'TLS handshake': 334,
      'Data transfer': 234,
    },
    {
      date: '02:22am',
      'Name lookup': 1123,
      Connection: 634,
      'TLS handshake': 312,
      'Data transfer': 223,
    },
    {
      date: '03:34am',
      'Name lookup': 1334,
      Connection: 567,
      'TLS handshake': 267,
      'Data transfer': 145,
    },
    {
      date: '03:51am',
      'Name lookup': 3834,
      Connection: 2234,
      'TLS handshake': 1634,
      'Data transfer': 1123,
    },
    {
      date: '04:01am',
      'Name lookup': 1223,
      Connection: 923,
      'TLS handshake': 323,
      'Data transfer': 198,
    },
    {
      date: '04:23am',
      'Name lookup': 145,
      Connection: 634,
      'TLS handshake': 345,
      'Data transfer': 223,
    },
    {
      date: '04:41am',
      'Name lookup': 123,
      Connection: 234,
      'TLS handshake': 198,
      'Data transfer': 98,
    },
    {
      date: '04:47am',
      'Name lookup': 123,
      Connection: 423,
      'TLS handshake': 167,
      'Data transfer': 123,
    },
    {
      date: '05:01am',
      'Name lookup': 123,
      Connection: 456,
      'TLS handshake': 178,
      'Data transfer': 112,
    },
    {
      date: '05:08am',
      'Name lookup': 123,
      Connection: 445,
      'TLS handshake': 167,
      'Data transfer': 118,
    },
    {
      date: '05:18am',
      'Name lookup': 123,
      Connection: 556,
      'TLS handshake': 198,
      'Data transfer': 156,
    },
    {
      date: '06:03am',
      'Name lookup': 378,
      Connection: 512,
      'TLS handshake': 289,
      'Data transfer': 167,
    },
    {
      date: '07:09am',
      'Name lookup': 489,
      Connection: 667,
      'TLS handshake': 334,
      'Data transfer': 234,
    },
    {
      date: '07:09am',
      'Name lookup': 434,
      Connection: 567,
      'TLS handshake': 312,
      'Data transfer': 223,
    },
    {
      date: '08:21am',
      'Name lookup': 723,
      Connection: 923,
      'TLS handshake': 423,
      'Data transfer': 323,
    },
    {
      date: '08:39am',
      'Name lookup': 212,
      Connection: 323,
      'TLS handshake': 178,
      'Data transfer': 98,
    },
    {
      date: '09:03am',
      'Name lookup': 323,
      Connection: 956,
      'TLS handshake': 367,
      'Data transfer': 267,
    },
    {
      date: '09:19am',
      'Name lookup': 123,
      Connection: 456,
      'TLS handshake': 189,
      'Data transfer': 134,
    },
    {
      date: '10:22am',
      'Name lookup': 123,
      Connection: 767,
      'TLS handshake': 301,
      'Data transfer': 212,
    },
    {
      date: '10:29am',
      'Name lookup': 701,
      Connection: 567,
      'TLS handshake': 312,
      'Data transfer': 223,
    },
    {
      date: '10:34am',
      'Name lookup': 723,
      Connection: 634,
      'TLS handshake': 323,
      'Data transfer': 234,
    },
    {
      date: '10:36am',
      'Name lookup': 823,
      Connection: 1078,
      'TLS handshake': 434,
      'Data transfer': 345,
    },
    {
      date: '11:46am',
      'Name lookup': 934,
      Connection: 634,
      'TLS handshake': 345,
      'Data transfer': 256,
    },
    {
      date: '11:49am',
      'Name lookup': 945,
      Connection: 423,
      'TLS handshake': 289,
      'Data transfer': 198,
    },
    {
      date: '11:50am',
      'Name lookup': 978,
      Connection: 567,
      'TLS handshake': 323,
      'Data transfer': 223,
    },
    {
      date: '11:55am',
      'Name lookup': 1023,
      Connection: 323,
      'TLS handshake': 178,
      'Data transfer': 134,
    },
    {
      date: '12:05pm',
      'Name lookup': 912,
      Connection: 545,
      'TLS handshake': 312,
      'Data transfer': 245,
    },
    {
      date: '12:19pm',
      'Name lookup': 123,
      Connection: 445,
      'TLS handshake': 212,
      'Data transfer': 178,
    },
    {
      date: '12:21pm',
      'Name lookup': 689,
      Connection: 956,
      'TLS handshake': 367,
      'Data transfer': 289,
    },
    {
      date: '12:31pm',
      'Name lookup': 767,
      Connection: 667,
      'TLS handshake': 323,
      'Data transfer': 223,
    },
    {
      date: '12:41pm',
      'Name lookup': 923,
      Connection: 534,
      'TLS handshake': 301,
      'Data transfer': 223,
    },
    {
      date: '01:13pm',
      'Name lookup': 1023,
      Connection: 734,
      'TLS handshake': 345,
      'Data transfer': 267,
    },
    {
      date: '01:34pm',
      'Name lookup': 1234,
      Connection: 789,
      'TLS handshake': 412,
      'Data transfer': 312,
    },
    {
      date: '01:56pm',
      'Name lookup': 1434,
      Connection: 867,
      'TLS handshake': 445,
      'Data transfer': 345,
    },
    {
      date: '02:12pm',
      'Name lookup': 1423,
      Connection: 745,
      'TLS handshake': 434,
      'Data transfer': 334,
    },
    {
      date: '02:33pm',
      'Name lookup': 989,
      Connection: 501,
      'TLS handshake': 289,
      'Data transfer': 245,
    },
    {
      date: '02:56pm',
      'Name lookup': 1156,
      Connection: 534,
      'TLS handshake': 312,
      'Data transfer': 256,
    },
    {
      date: '03:14pm',
      'Name lookup': 1245,
      Connection: 681,
      'TLS handshake': 378,
      'Data transfer': 278,
    },
    {
      date: '03:31pm',
      'Name lookup': 1223,
      Connection: 734,
      'TLS handshake': 389,
      'Data transfer': 301,
    },
    {
      date: '03:55pm',
      'Name lookup': 1334,
      Connection: 856,
      'TLS handshake': 423,
      'Data transfer': 323,
    },
  ];

  chartData: ChartData<'line', number[], string> = {
    labels: this.data.map((d) => d.date),
    datasets: [
      {
        data: this.data.map((d) => d['Name lookup']),
        label: 'Name lookup',
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        pointHoverBackgroundColor: 'rgb(147, 51, 234)',
        pointHoverBorderColor: 'rgb(147, 51, 234)',
        fill: true,
      },
      {
        data: this.data.map((d) => d['Connection']),
        label: 'Connection',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
        fill: true,
      },
      {
        data: this.data.map((d) => d['TLS handshake']),
        label: 'TLS handshake',
        borderColor: 'rgb(6, 182, 212)',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        pointHoverBackgroundColor: 'rgb(6, 182, 212)',
        pointHoverBorderColor: 'rgb(6, 182, 212)',
        fill: true,
      },
      {
        data: this.data.map((d) => d['Data transfer']),
        label: 'Data transfer',
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        pointHoverBackgroundColor: 'rgb(16, 185, 129)',
        pointHoverBorderColor: 'rgb(16, 185, 129)',
        fill: true,
      },
    ],
  };

  chartOptions: CustomChartConfiguration<'line'>['options'] = {
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
          maxRotation: 0,
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: '#66666650',
        },
        ticks: {
          callback: function (value) {
            const numValue = Number(value);
            if (numValue < 1000) {
              return `${numValue}ms`;
            } else {
              const seconds = (numValue / 1000).toFixed(1);
              return `${seconds}s`;
            }
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
            maxRotation: 0,
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

  getFormattedValue(value: number | unknown): string {
    if (isNaN(value as number)) {
      return '';
    }
    const numValue = value as number;
    if (numValue < 1000) {
      return `${numValue}ms`;
    } else {
      const seconds = (numValue / 1000).toFixed(1);
      return `${seconds}s`;
    }
  }

  summary: SummaryItem[] = [
    {
      name: 'Currently up for',
      value: '11 months 8 days',
    },
    {
      name: 'Last checked at',
      value: '3 minutes ago',
    },
    {
      name: 'Incidents',
      value: '0',
    },
  ];

  selectedPeriod = 'day';
}
