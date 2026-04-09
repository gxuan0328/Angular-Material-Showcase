/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update line-charts/line-chart-8`
*/

import {
  Component,
  inject,
  ChangeDetectorRef,
  LOCALE_ID,
  DEFAULT_CURRENCY_CODE,
} from '@angular/core';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';

type MetricCard = {
  name: string;
  value: number;
  valueFormatter?: (value: number) => string;
  chartData: ChartData<'line', number[], string>;
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-line-chart-8',
  templateUrl: './line-chart-8.component.html',
  imports: [
    BaseChartDirective,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatDivider,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIcon,
    MatCardSubtitle,
  ],
})
export class LineChart8Component {
  private _cdr = inject(ChangeDetectorRef);
  private _locale = inject(LOCALE_ID);
  private _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  tooltips: { [key: string]: TooltipModel<'line'> | undefined } = {};
  chartType = 'line' as const;
  datasets: { [key: string]: number[] } = {
    'Monthly Recurring Revenue': [
      2387, 3341, 5548, 4439, 6559, 6693, 4692, 6832, 7123, 7066, 7242, 7279,
      7423, 7537, 8090, 9009, 8266, 8313, 8525, 7995, 7608, 7833, 9009, 10243,
    ],
    'Active Subscribers': [
      493, 516, 693, 557, 806, 855, 841, 890, 926, 937, 1016, 906, 889, 833,
      783, 711, 669, 650, 627, 615, 605, 560, 546, 308,
    ],
    'Net Volume': [
      9012, 10166, 10359, 8483, 10793, 11289, 11467, 11658, 11741, 11831, 12082,
      12369, 12534, 12924, 12955, 13752, 13639, 12500, 13432, 14056, 12524,
      11522, 11258, 11975,
    ],
    'Churned Revenue': [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 136, 272, 136, 0, 0, 0, 2624, 2748,
      3302, 1464, 1122, 884,
    ],
  };
  chartData: ChartData<'line', number[], string> = {
    labels: [
      'Jan 22',
      'Feb 22',
      'Mar 22',
      'Apr 22',
      'May 22',
      'Jun 22',
      'Jul 22',
      'Aug 22',
      'Sep 22',
      'Oct 22',
      'Nov 22',
      'Dec 22',
      'Jan 23',
      'Feb 23',
      'Mar 23',
      'Apr 23',
      'May 23',
      'Jun 23',
      'Jul 23',
      'Aug 23',
      'Sep 23',
      'Oct 23',
      'Nov 23',
      'Dec 23',
    ],
    datasets: [
      {
        data: [
          2387, 3341, 5548, 4439, 6559, 6693, 4692, 6832, 7123, 7066, 7242,
          7279, 7423, 7537, 8090, 9009, 8266, 8313, 8525, 7995, 7608, 7833,
          9009, 10243,
        ],
        label: 'MRR',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgb(59, 130, 246)',
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
        fill: false,
      },
    ],
  };

  chartPlugins = [verticalHoverLinePlugin];

  // Base chart options without tooltip configuration
  private baseChartOptions: Omit<
    CustomChartConfiguration<'line'>['options'],
    'plugins'
  > = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
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

  // Generate chart options for each metric with its own tooltip handler
  getChartOptions(
    metricName: string,
  ): CustomChartConfiguration<'line'>['options'] {
    return {
      ...this.baseChartOptions,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          external: (context) => {
            this.tooltips[metricName] = context.tooltip;
            this._cdr.markForCheck();
          },
        },
      },
    };
  }

  metrics: MetricCard[] = [
    {
      name: 'Monthly Recurring Revenue',
      value: 10200,
      chartData: this.getMetricChartData('Monthly Recurring Revenue'),
    },
    {
      name: 'Active Subscribers',
      value: 308,
      valueFormatter: (value: number) => value.toLocaleString(),
      chartData: this.getMetricChartData('Active Subscribers'),
    },
    {
      name: 'Net Volume',
      value: 11900,
      chartData: this.getMetricChartData('Net Volume'),
    },
    {
      name: 'Churned Revenue',
      value: 900,
      chartData: this.getMetricChartData('Churned Revenue'),
    },
  ];

  // Individual chart data for each metric
  getMetricChartData(metricName: string): ChartData<'line', number[], string> {
    return {
      labels: this.chartData.labels,
      datasets: [
        {
          data: this.datasets[metricName] || [],
          label: metricName,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgb(59, 130, 246)',
          pointHoverBackgroundColor: 'rgb(59, 130, 246)',
          pointHoverBorderColor: 'rgb(59, 130, 246)',
          fill: false,
        },
      ],
    };
  }

  formatCurrencyInThousands(value: number | unknown): string {
    if (isNaN(value as number)) {
      return '';
    }
    const formatter = new Intl.NumberFormat(this._locale, {
      style: 'currency',
      currency: this._defaultCurrencyCode,
      maximumFractionDigits: 2,
    });

    const formatted = formatter.format(Math.abs(value as number) / 1000);

    return formatted + 'K';
  }

  formatCurrency({
    value,
    includeSign = false,
    maximumFractionDigits = 2,
  }: {
    value: number | unknown;
    includeSign?: boolean;
    maximumFractionDigits?: number;
  }): string {
    if (isNaN(value as number)) {
      return '';
    }
    const formatter = new Intl.NumberFormat(this._locale, {
      style: 'currency',
      currency: this._defaultCurrencyCode,
      maximumFractionDigits: maximumFractionDigits,
    });

    const formatted = formatter.format(Math.abs(value as number));

    if (includeSign) {
      return (value as number) >= 0 ? `+${formatted}` : `-${formatted}`;
    }

    return formatted;
  }

  formatMetricValue(metricName: string, value: number | unknown): string {
    if (isNaN(value as number)) {
      return '';
    }

    // Find the metric and use its valueFormatter
    const metric = this.metrics.find((m) => m.name === metricName);
    if (metric?.valueFormatter) {
      return metric.valueFormatter(value as number);
    }

    // Fallback to currency formatting
    return this.formatCurrency({ value, maximumFractionDigits: 0 });
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
