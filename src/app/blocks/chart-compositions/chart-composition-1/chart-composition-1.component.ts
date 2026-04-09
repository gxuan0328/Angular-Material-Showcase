/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-compositions/chart-composition-1`
*/

import {
  ChangeDetectorRef,
  Component,
  DEFAULT_CURRENCY_CODE,
  inject,
  LOCALE_ID,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import { ChartData, TooltipModel } from 'chart.js';
import { MatTableModule } from '@angular/material/table';

import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';
import { MatDivider } from '@angular/material/divider';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';

const TOOLTIP_SPACE = 8;

type DataPoint = {
  date: string;
  'Mutual Fund Alpha': number;
  'Growth Portfolio': number;
  'Tech Innovation ETF': number;
};

type SummaryItem = {
  name: string;
  value: string;
  invested: string;
  cashflow: string;
  gain: string;
  realized: string;
  dividends: string;
  bgColor: string;
  changeType: 'positive' | 'negative';
};

type HeaderData = {
  title: string;
  totalValue: string;
  change: string;
  changePercentage: string;
  changeType: 'positive' | 'negative';
  period: string;
};

@Component({
  selector: 'ngm-dev-block-chart-composition-1',
  templateUrl: './chart-composition-1.component.html',
  imports: [BaseChartDirective, MatTableModule, MatDivider],
})
export class ChartComposition1Component {
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _locale = inject(LOCALE_ID);
  private readonly _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  chartType = 'line' as const;
  tooltip: TooltipModel<'line'> | undefined;
  chartPlugins = [verticalHoverLinePlugin];

  data: DataPoint[] = [
    {
      date: 'Sept 01',
      'Mutual Fund Alpha': 2543.2,
      'Growth Portfolio': 4823.1,
      'Tech Innovation ETF': 8234.2,
    },
    {
      date: 'Sept 02',
      'Mutual Fund Alpha': 3142.0,
      'Growth Portfolio': 5321.1,
      'Tech Innovation ETF': 9123.1,
    },
    {
      date: 'Sept 03',
      'Mutual Fund Alpha': 5234.5,
      'Growth Portfolio': 6543.2,
      'Tech Innovation ETF': 9823.7,
    },
    {
      date: 'Sept 04',
      'Mutual Fund Alpha': 4123.8,
      'Growth Portfolio': 5432.7,
      'Tech Innovation ETF': 8234.4,
    },
    {
      date: 'Sept 05',
      'Mutual Fund Alpha': 6234.7,
      'Growth Portfolio': 7654.1,
      'Tech Innovation ETF': 10234.3,
    },
    {
      date: 'Sept 06',
      'Mutual Fund Alpha': 6432.9,
      'Growth Portfolio': 8123.3,
      'Tech Innovation ETF': 10823.4,
    },
    {
      date: 'Sept 07',
      'Mutual Fund Alpha': 4567.4,
      'Growth Portfolio': 7954.1,
      'Tech Innovation ETF': 11234.2,
    },
    {
      date: 'Sept 08',
      'Mutual Fund Alpha': 6543.2,
      'Growth Portfolio': 8432.4,
      'Tech Innovation ETF': 11623.2,
    },
    {
      date: 'Sept 09',
      'Mutual Fund Alpha': 6823.8,
      'Growth Portfolio': 8765.1,
      'Tech Innovation ETF': 11934.6,
    },
    {
      date: 'Sept 10',
      'Mutual Fund Alpha': 6765.5,
      'Growth Portfolio': 8654.6,
      'Tech Innovation ETF': 12123.4,
    },
    {
      date: 'Sept 11',
      'Mutual Fund Alpha': 6923.6,
      'Growth Portfolio': 9234.3,
      'Tech Innovation ETF': 12543.3,
    },
    {
      date: 'Sept 12',
      'Mutual Fund Alpha': 6954.4,
      'Growth Portfolio': 8765.3,
      'Tech Innovation ETF': 12834.5,
    },
    {
      date: 'Sept 13',
      'Mutual Fund Alpha': 7123.1,
      'Growth Portfolio': 8432.6,
      'Tech Innovation ETF': 13123.4,
    },
    {
      date: 'Sept 14',
      'Mutual Fund Alpha': 7234.4,
      'Growth Portfolio': 8123.8,
      'Tech Innovation ETF': 13543.5,
    },
    {
      date: 'Sept 15',
      'Mutual Fund Alpha': 7654.6,
      'Growth Portfolio': 7654.7,
      'Tech Innovation ETF': 13823.1,
    },
    {
      date: 'Sept 16',
      'Mutual Fund Alpha': 8432.5,
      'Growth Portfolio': 7123.6,
      'Tech Innovation ETF': 14234.4,
    },
    {
      date: 'Sept 17',
      'Mutual Fund Alpha': 10923.8,
      'Growth Portfolio': 6543.3,
      'Tech Innovation ETF': 14123.4,
    },
    {
      date: 'Sept 18',
      'Mutual Fund Alpha': 11234.2,
      'Growth Portfolio': 6234.1,
      'Tech Innovation ETF': 12543.7,
    },
    {
      date: 'Sept 19',
      'Mutual Fund Alpha': 11543.4,
      'Growth Portfolio': 5823.1,
      'Tech Innovation ETF': 13234.8,
    },
    {
      date: 'Sept 20',
      'Mutual Fund Alpha': 12234.9,
      'Growth Portfolio': 5623.3,
      'Tech Innovation ETF': 14123.1,
    },
    {
      date: 'Sept 21',
      'Mutual Fund Alpha': 7432.7,
      'Growth Portfolio': 5432.2,
      'Tech Innovation ETF': 12543.2,
    },
    {
      date: 'Sept 22',
      'Mutual Fund Alpha': 7654.8,
      'Growth Portfolio': 5123.4,
      'Tech Innovation ETF': 11234.2,
    },
    {
      date: 'Sept 23',
      'Mutual Fund Alpha': 8432.5,
      'Growth Portfolio': 4954.1,
      'Tech Innovation ETF': 10923.2,
    },
    {
      date: 'Sept 24',
      'Mutual Fund Alpha': 9543.0,
      'Growth Portfolio': 2954.1,
      'Tech Innovation ETF': 11654.8,
    },
    {
      date: 'Sept 25',
      'Mutual Fund Alpha': 9723.2,
      'Growth Portfolio': 2432.0,
      'Tech Innovation ETF': 12123.4,
    },
    {
      date: 'Sept 26',
      'Mutual Fund Alpha': 10123.1,
      'Growth Portfolio': 2234.3,
      'Tech Innovation ETF': 12654.1,
    },
    {
      date: 'Sept 27',
      'Mutual Fund Alpha': 10432.8,
      'Growth Portfolio': 2123.8,
      'Tech Innovation ETF': 13234.6,
    },
    {
      date: 'Sept 28',
      'Mutual Fund Alpha': 10654.6,
      'Growth Portfolio': 3123.4,
      'Tech Innovation ETF': 13543.3,
    },
    {
      date: 'Sept 29',
      'Mutual Fund Alpha': 10823.8,
      'Growth Portfolio': 3432.4,
      'Tech Innovation ETF': 14234.1,
    },
    {
      date: 'Sept 30',
      'Mutual Fund Alpha': 10654.5,
      'Growth Portfolio': 3923.1,
      'Tech Innovation ETF': 14823.5,
    },
  ];

  chartData: ChartData<'line', number[], string> = {
    labels: this.data.map((d) => d.date),
    datasets: [
      {
        data: this.data.map((d) => d['Mutual Fund Alpha']),
        label: 'Mutual Fund Alpha',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgb(59, 130, 246)',
        fill: false,
      },
      {
        data: this.data.map((d) => d['Growth Portfolio']),
        label: 'Growth Portfolio',
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgb(139, 92, 246)',
        fill: false,
      },
      {
        data: this.data.map((d) => d['Tech Innovation ETF']),
        label: 'Tech Innovation ETF',
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgb(236, 72, 153)',
        fill: false,
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
          callback: (value) => {
            return this.formatCurrency({ value, maximumFractionDigits: 0 });
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

  summary: SummaryItem[] = this.generateSummaryFromData();
  headerData: HeaderData = this.generateHeaderFromData();

  displayedColumns: string[] = [
    'name',
    'value',
    'invested',
    'cashflow',
    'gain',
    'realized',
    'dividends',
  ];

  get mobileChartOptions(): CustomChartConfiguration<'line'>['options'] {
    return {
      ...this.chartOptions,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          display: true,
          border: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
        x: {
          display: true,
          grid: {
            display: false,
          },
          ticks: {
            align: 'inner',
            callback: (value, index, values) => {
              if (index === 0 || index === values.length - 1) {
                return this.data[index]?.date;
              }
              return undefined;
            },
          },
        },
      },
    };
  }

  getTooltipTransform(
    caretX: number,
    tooltipWidth: number,
    chartWidth: number,
  ): string {
    // If tooltip would extend beyond the right half of the chart
    if (caretX + tooltipWidth + TOOLTIP_SPACE >= chartWidth) {
      // Position tooltip to the left of the caret point
      return `translateX(${caretX - tooltipWidth - TOOLTIP_SPACE}px)`;
    } else {
      // Position tooltip to the right of the caret point (default behavior)
      return `translateX(${caretX + TOOLTIP_SPACE}px)`;
    }
  }

  generateSummaryFromData(): SummaryItem[] {
    const funds = [
      'Mutual Fund Alpha',
      'Growth Portfolio',
      'Tech Innovation ETF',
    ] as const;
    const colors = ['bg-blue-500', 'bg-violet-500', 'bg-fuchsia-500'];

    return funds.map((fund, index) => {
      const values = this.data.map((d) => d[fund]);
      const stats = this.calculateStatistics(values);

      return {
        name: fund,
        value: this.formatCurrency({ value: stats.current }),
        invested: this.formatCurrency({ value: stats.average }),
        cashflow: this.formatCurrency({ value: stats.total }),
        gain: this.formatCurrency({ value: stats.change, includeSign: true }),
        realized: this.formatCurrency({
          value: stats.volatility,
          includeSign: true,
        }),
        dividends: this.formatCurrency({
          value: stats.peak - stats.current,
          includeSign: true,
        }),
        bgColor: colors[index],
        changeType: stats.change >= 0 ? 'positive' : 'negative',
      };
    });
  }

  generateHeaderFromData(): HeaderData {
    // Calculate total portfolio value (current values of all funds)
    const currentValues = this.data[this.data.length - 1];
    const initialValues = this.data[0];

    const totalCurrentValue =
      currentValues['Mutual Fund Alpha'] +
      currentValues['Growth Portfolio'] +
      currentValues['Tech Innovation ETF'];

    const totalInitialValue =
      initialValues['Mutual Fund Alpha'] +
      initialValues['Growth Portfolio'] +
      initialValues['Tech Innovation ETF'];

    const totalChange = totalCurrentValue - totalInitialValue;
    const changePercentage = (totalChange / totalInitialValue) * 100;

    // Calculate change from yesterday (second to last day)
    const yesterdayValues = this.data[this.data.length - 2];
    const totalYesterdayValue =
      yesterdayValues['Mutual Fund Alpha'] +
      yesterdayValues['Growth Portfolio'] +
      yesterdayValues['Tech Innovation ETF'];

    const dailyChange = totalCurrentValue - totalYesterdayValue;
    const dailyChangePercentage = (dailyChange / totalYesterdayValue) * 100;

    return {
      title: 'Investment Portfolio',
      totalValue: this.formatCurrency({ value: totalCurrentValue }),
      change: this.formatCurrency({ value: dailyChange, includeSign: true }),
      changePercentage: `${dailyChangePercentage >= 0 ? '+' : ''}${dailyChangePercentage.toFixed(1)}%`,
      changeType: dailyChange >= 0 ? 'positive' : 'negative',
      period: 'Past 24 hours',
    };
  }

  private calculateStatistics(values: number[]) {
    const current = values[values.length - 1];
    const initial = values[0];
    const change = current - initial;
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const peak = max;

    // Calculate volatility as standard deviation
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) /
      values.length;
    const volatility = Math.sqrt(variance);

    return {
      current,
      initial,
      change,
      total,
      average,
      max,
      min,
      peak,
      volatility,
    };
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
}
