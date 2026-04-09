/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-compositions/chart-composition-12`
*/

import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ChartData, ChartConfiguration, TooltipModel } from 'chart.js';
import {
  MatFormField,
  MatSelect,
  MatOption,
  MatLabel,
} from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
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

type StatItem = {
  name: string;
  description: string;
  value: string;
};

type SelectOption = {
  id: string;
  label: string;
  defaultValue: string;
  width: string;
  options: {
    value: string;
    label: string;
  }[];
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-chart-composition-12',
  templateUrl: './chart-composition-12.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatFormField,
    MatSelect,
    MatOption,
    MatIcon,
    MatTooltip,
    MatLabel,
    MatCardContent,
    NgTemplateOutlet,
    MatDivider,
  ],
})
export class ChartComposition12Component {
  private _cdr = inject(ChangeDetectorRef);
  chartType = 'line' as const;
  chartPlugins = [verticalHoverLinePlugin];
  tooltip: TooltipModel<'line'> | undefined;
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

  stats: StatItem[] = [
    {
      name: 'Avg. response time',
      description: 'Speed at which the server can respond',
      value: '37s',
    },
    {
      name: 'Total incident length',
      description:
        'Total duration from when an incident starts to when it is fully resolved',
      value: '1min 42s',
    },
    {
      name: 'MTTA',
      description:
        "Avg. time it takes to acknowledge or respond to an incident after it's been detected",
      value: '3min 45s',
    },
    {
      name: 'MTTR',
      description:
        'Avg. time it takes to resolve an issue after it has been reported',
      value: '5min 38s',
    },
  ];

  selectOptions: SelectOption[] = [
    {
      id: 'region',
      label: 'Region',
      defaultValue: 'europe',
      width: '32',
      options: [
        { value: 'north-america', label: 'North America' },
        { value: 'europe', label: 'Europe' },
        { value: 'asia', label: 'Asia' },
        { value: 'australia', label: 'Australia' },
      ],
    },
    {
      id: 'integration',
      label: 'Integrations',
      defaultValue: 'all',
      width: '28',
      options: [
        { value: 'all', label: 'All' },
        { value: 'azure-monitor', label: 'Azure Monitor' },
        { value: 'splunk', label: 'Splunk' },
        { value: 'dynatrace', label: 'Dynatrace' },
      ],
    },
    {
      id: 'acknowledger',
      label: 'Acknowledged by',
      defaultValue: 'emily-smith',
      width: '40',
      options: [
        { value: 'all', label: 'All' },
        { value: 'emily-smith', label: 'Emily Smith' },
        { value: 'mike-kingstone', label: 'Mike Kingstone' },
        { value: 'simon-dumentis', label: 'Simon Dumentis' },
      ],
    },
    {
      id: 'escalator',
      label: 'Resolved by',
      defaultValue: 'michael-bridge',
      width: '40',
      options: [
        { value: 'michael-bridge', label: 'Michael Bridge' },
        { value: 'emma-stone', label: 'Emma Stone' },
        { value: 'max-mcbeccel', label: 'Max McBeccel' },
        { value: 'lena-goldriver', label: 'Lena Goldriver' },
      ],
    },
    {
      id: 'escalation-policy',
      label: 'Escalation policy',
      defaultValue: 'hierarchical',
      width: '32',
      options: [
        { value: 'all', label: 'All' },
        { value: 'hierarchical', label: 'Hierarchical Escalation' },
        { value: 'functional', label: 'Functional Escalation' },
        { value: 'time-based', label: 'Time-based Escalation' },
      ],
    },
    {
      id: 'cause',
      label: 'Cause',
      defaultValue: '404-not-found',
      width: '40',
      options: [
        { value: 'all', label: 'All' },
        { value: '502-bad-gateway', label: '502 Bad Gateway' },
        { value: '404-not-found', label: '404 Not Found' },
        { value: '400-bad-request', label: '400 Bad Request' },
      ],
    },
  ];

  chartData: ChartData<'line', number[], string> = {
    labels: this.data.map((d) => d.date),
    datasets: [
      {
        data: this.data.map((d) => d['Avg. response time']),
        label: 'Avg. response time',
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        pointHoverBackgroundColor: 'rgb(147, 51, 234)',
        pointHoverBorderColor: 'rgb(147, 51, 234)',
        fill: true,
      },
      {
        data: this.data.map((d) => d['Total incident length']),
        label: 'Total incident length',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
        fill: true,
      },
      {
        data: this.data.map((d) => d['MTTR']),
        label: 'MTTR',
        borderColor: 'rgb(6, 182, 212)',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        pointHoverBackgroundColor: 'rgb(6, 182, 212)',
        pointHoverBorderColor: 'rgb(6, 182, 212)',
        fill: true,
      },
      {
        data: this.data.map((d) => d['MTTA']),
        label: 'MTTA',
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        pointHoverBackgroundColor: 'rgb(16, 185, 129)',
        pointHoverBorderColor: 'rgb(16, 185, 129)',
        fill: true,
      },
    ],
  };

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
          maxTicksLimit: 8,
          callback: function (value) {
            const numValue = Number(value);
            if (numValue < 60) {
              return `${numValue.toFixed(1)}s`;
            } else {
              const minutes = (numValue / 60).toFixed(1);
              return `${minutes}min`;
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

  get mobileChartOptions(): ChartConfiguration<'line'>['options'] {
    return {
      ...this.chartOptions,
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
