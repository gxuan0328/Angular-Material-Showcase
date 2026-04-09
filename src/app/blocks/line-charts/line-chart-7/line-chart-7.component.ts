/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update line-charts/line-chart-7`
*/

import {
  Component,
  inject,
  ChangeDetectorRef,
  LOCALE_ID,
  DEFAULT_CURRENCY_CODE,
  signal,
  computed,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, TooltipModel } from 'chart.js';
import { MatIcon } from '@angular/material/icon';
import { CustomChartConfiguration } from '../../utils/types/custom-chart-configuration';
import { verticalHoverLinePlugin } from '../../utils/constants/chart-plugins';
import { MatDivider } from '@angular/material/divider';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatSuffix } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatCard } from '@angular/material/card';
import { MatCardHeader } from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';

type DataPoint = {
  date: Date;
  'ETF Shares Vital': number;
  'Vitainvest Core': number;
  'iShares Tech Growth': number;
};

const TOOLTIP_SPACE = 8;

@Component({
  selector: 'ngm-dev-block-line-chart-7',
  templateUrl: './line-chart-7.component.html',
  imports: [
    BaseChartDirective,
    MatIcon,
    MatDivider,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatCardContent,
    MatCard,
    MatCardHeader,
    MatCardSubtitle,
    MatIconButton,
    MatSuffix,
    MatTooltip,
  ],
})
export class LineChart7Component {
  private _cdr = inject(ChangeDetectorRef);
  private _locale = inject(LOCALE_ID);
  private _defaultCurrencyCode = inject(DEFAULT_CURRENCY_CODE);
  tooltip: TooltipModel<'line'> | undefined;
  chartType = 'line' as const;

  // Date range filter controls
  dateRangeForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  // Computed properties for filtering
  private startDate = signal<Date | null>(null);
  private endDate = signal<Date | null>(null);

  // Min and max dates from data
  minDate = computed(() => {
    const dates = this.allData.map((d) => d.date);
    return new Date(Math.min(...dates.map((d) => d.getTime())));
  });

  maxDate = computed(() => {
    const dates = this.allData.map((d) => d.date);
    return new Date(Math.max(...dates.map((d) => d.getTime())));
  });

  // Filtered data based on date range
  private filteredData = computed(() => {
    const start = this.startDate();
    const end = this.endDate();

    // Only apply filter when both dates are selected, otherwise show all data
    if (!start || !end) {
      return this.allData;
    }

    return this.allData.filter((item) => {
      const itemDate = new Date(
        item.date.getFullYear(),
        item.date.getMonth(),
        item.date.getDate(),
      );

      const startFilter = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
      );
      const endFilter = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate(),
      );

      return itemDate >= startFilter && itemDate <= endFilter;
    });
  });

  private allData: DataPoint[] = [
    {
      date: new Date(2023, 7, 1), // Aug 01, 2023
      'ETF Shares Vital': 2100.2,
      'Vitainvest Core': 4434.1,
      'iShares Tech Growth': 7943.2,
    },
    {
      date: new Date(2023, 7, 2), // Aug 02, 2023
      'ETF Shares Vital': 2943.0,
      'Vitainvest Core': 4954.1,
      'iShares Tech Growth': 8954.1,
    },
    {
      date: new Date(2023, 7, 3), // Aug 03, 2023
      'ETF Shares Vital': 4889.5,
      'Vitainvest Core': 6100.2,
      'iShares Tech Growth': 9123.7,
    },
    {
      date: new Date(2023, 7, 4), // Aug 04, 2023
      'ETF Shares Vital': 3909.8,
      'Vitainvest Core': 4909.7,
      'iShares Tech Growth': 7478.4,
    },
    {
      date: new Date(2023, 7, 5), // Aug 05, 2023
      'ETF Shares Vital': 5778.7,
      'Vitainvest Core': 7103.1,
      'iShares Tech Growth': 9504.3,
    },
    {
      date: new Date(2023, 7, 6), // Aug 06, 2023
      'ETF Shares Vital': 5900.9,
      'Vitainvest Core': 7534.3,
      'iShares Tech Growth': 9943.4,
    },
    {
      date: new Date(2023, 7, 7), // Aug 07, 2023
      'ETF Shares Vital': 4129.4,
      'Vitainvest Core': 7412.1,
      'iShares Tech Growth': 10112.2,
    },
    {
      date: new Date(2023, 7, 8), // Aug 08, 2023
      'ETF Shares Vital': 6021.2,
      'Vitainvest Core': 7834.4,
      'iShares Tech Growth': 10290.2,
    },
    {
      date: new Date(2023, 7, 9), // Aug 09, 2023
      'ETF Shares Vital': 6279.8,
      'Vitainvest Core': 8159.1,
      'iShares Tech Growth': 10349.6,
    },
    {
      date: new Date(2023, 7, 10), // Aug 10, 2023
      'ETF Shares Vital': 6224.5,
      'Vitainvest Core': 8260.6,
      'iShares Tech Growth': 10415.4,
    },
    {
      date: new Date(2023, 7, 11), // Aug 11, 2023
      'ETF Shares Vital': 6380.6,
      'Vitainvest Core': 8965.3,
      'iShares Tech Growth': 10636.3,
    },
    {
      date: new Date(2023, 7, 12), // Aug 12, 2023
      'ETF Shares Vital': 6414.4,
      'Vitainvest Core': 7989.3,
      'iShares Tech Growth': 10900.5,
    },
    {
      date: new Date(2023, 7, 13), // Aug 13, 2023
      'ETF Shares Vital': 6540.1,
      'Vitainvest Core': 7839.6,
      'iShares Tech Growth': 11040.4,
    },
    {
      date: new Date(2023, 7, 14), // Aug 14, 2023
      'ETF Shares Vital': 6634.4,
      'Vitainvest Core': 7343.8,
      'iShares Tech Growth': 11390.5,
    },
    {
      date: new Date(2023, 7, 15), // Aug 15, 2023
      'ETF Shares Vital': 7124.6,
      'Vitainvest Core': 6903.7,
      'iShares Tech Growth': 11423.1,
    },
    {
      date: new Date(2023, 7, 16), // Aug 16, 2023
      'ETF Shares Vital': 7934.5,
      'Vitainvest Core': 6273.6,
      'iShares Tech Growth': 12134.4,
    },
    {
      date: new Date(2023, 7, 17), // Aug 17, 2023
      'ETF Shares Vital': 10287.8,
      'Vitainvest Core': 5900.3,
      'iShares Tech Growth': 12034.4,
    },
    {
      date: new Date(2023, 7, 18), // Aug 18, 2023
      'ETF Shares Vital': 10323.2,
      'Vitainvest Core': 5732.1,
      'iShares Tech Growth': 11011.7,
    },
    {
      date: new Date(2023, 7, 19), // Aug 19, 2023
      'ETF Shares Vital': 10511.4,
      'Vitainvest Core': 5523.1,
      'iShares Tech Growth': 11834.8,
    },
    {
      date: new Date(2023, 7, 20), // Aug 20, 2023
      'ETF Shares Vital': 11043.9,
      'Vitainvest Core': 5422.3,
      'iShares Tech Growth': 12387.1,
    },
    {
      date: new Date(2023, 7, 21), // Aug 21, 2023
      'ETF Shares Vital': 6700.7,
      'Vitainvest Core': 5334.2,
      'iShares Tech Growth': 11032.2,
    },
    {
      date: new Date(2023, 7, 22), // Aug 22, 2023
      'ETF Shares Vital': 6900.8,
      'Vitainvest Core': 4943.4,
      'iShares Tech Growth': 10134.2,
    },
    {
      date: new Date(2023, 7, 23), // Aug 23, 2023
      'ETF Shares Vital': 7934.5,
      'Vitainvest Core': 4812.1,
      'iShares Tech Growth': 9921.2,
    },
    {
      date: new Date(2023, 7, 24), // Aug 24, 2023
      'ETF Shares Vital': 9021.0,
      'Vitainvest Core': 2729.1,
      'iShares Tech Growth': 10549.8,
    },
    {
      date: new Date(2023, 7, 25), // Aug 25, 2023
      'ETF Shares Vital': 9198.2,
      'Vitainvest Core': 2178.0,
      'iShares Tech Growth': 10968.4,
    },
    {
      date: new Date(2023, 7, 26), // Aug 26, 2023
      'ETF Shares Vital': 9557.1,
      'Vitainvest Core': 2158.3,
      'iShares Tech Growth': 11059.1,
    },
    {
      date: new Date(2023, 7, 27), // Aug 27, 2023
      'ETF Shares Vital': 9959.8,
      'Vitainvest Core': 2100.8,
      'iShares Tech Growth': 11903.6,
    },
    {
      date: new Date(2023, 7, 28), // Aug 28, 2023
      'ETF Shares Vital': 10034.6,
      'Vitainvest Core': 2934.4,
      'iShares Tech Growth': 12143.3,
    },
    {
      date: new Date(2023, 7, 29), // Aug 29, 2023
      'ETF Shares Vital': 10243.8,
      'Vitainvest Core': 3223.4,
      'iShares Tech Growth': 12930.1,
    },
    {
      date: new Date(2023, 7, 30), // Aug 30, 2023
      'ETF Shares Vital': 10078.5,
      'Vitainvest Core': 3779.1,
      'iShares Tech Growth': 13420.5,
    },
    {
      date: new Date(2023, 7, 31), // Aug 31, 2023
      'ETF Shares Vital': 11134.6,
      'Vitainvest Core': 4190.3,
      'iShares Tech Growth': 14443.2,
    },
    {
      date: new Date(2023, 8, 1), // Sep 01, 2023
      'ETF Shares Vital': 12347.2,
      'Vitainvest Core': 4839.1,
      'iShares Tech Growth': 14532.1,
    },
    {
      date: new Date(2023, 8, 2), // Sep 02, 2023
      'ETF Shares Vital': 12593.8,
      'Vitainvest Core': 5153.3,
      'iShares Tech Growth': 14283.5,
    },
    {
      date: new Date(2023, 8, 3), // Sep 03, 2023
      'ETF Shares Vital': 12043.4,
      'Vitainvest Core': 5234.8,
      'iShares Tech Growth': 14078.9,
    },
    {
      date: new Date(2023, 8, 4), // Sep 04, 2023
      'ETF Shares Vital': 12144.9,
      'Vitainvest Core': 5478.4,
      'iShares Tech Growth': 13859.7,
    },
    {
      date: new Date(2023, 8, 5), // Sep 05, 2023
      'ETF Shares Vital': 12489.5,
      'Vitainvest Core': 5741.1,
      'iShares Tech Growth': 13539.2,
    },
    {
      date: new Date(2023, 8, 6), // Sep 06, 2023
      'ETF Shares Vital': 12748.7,
      'Vitainvest Core': 6743.9,
      'iShares Tech Growth': 13643.2,
    },
    {
      date: new Date(2023, 8, 7), // Sep 07, 2023
      'ETF Shares Vital': 12933.2,
      'Vitainvest Core': 7832.8,
      'iShares Tech Growth': 14629.2,
    },
    {
      date: new Date(2023, 8, 8), // Sep 08, 2023
      'ETF Shares Vital': 13028.8,
      'Vitainvest Core': 8943.2,
      'iShares Tech Growth': 13611.2,
    },
    {
      date: new Date(2023, 8, 9), // Sep 09, 2023
      'ETF Shares Vital': 13412.4,
      'Vitainvest Core': 9932.2,
      'iShares Tech Growth': 12515.2,
    },
    {
      date: new Date(2023, 8, 10), // Sep 10, 2023
      'ETF Shares Vital': 13649.0,
      'Vitainvest Core': 10139.2,
      'iShares Tech Growth': 11143.8,
    },
    {
      date: new Date(2023, 8, 11), // Sep 11, 2023
      'ETF Shares Vital': 13748.5,
      'Vitainvest Core': 10441.2,
      'iShares Tech Growth': 8929.2,
    },
    {
      date: new Date(2023, 8, 12), // Sep 12, 2023
      'ETF Shares Vital': 13148.1,
      'Vitainvest Core': 10933.8,
      'iShares Tech Growth': 8943.2,
    },
    {
      date: new Date(2023, 8, 13), // Sep 13, 2023
      'ETF Shares Vital': 12839.6,
      'Vitainvest Core': 11073.4,
      'iShares Tech Growth': 7938.3,
    },
    {
      date: new Date(2023, 8, 14), // Sep 14, 2023
      'ETF Shares Vital': 12428.2,
      'Vitainvest Core': 11128.3,
      'iShares Tech Growth': 7533.4,
    },
    {
      date: new Date(2023, 8, 15), // Sep 15, 2023
      'ETF Shares Vital': 12012.8,
      'Vitainvest Core': 11412.3,
      'iShares Tech Growth': 7100.4,
    },
    {
      date: new Date(2023, 8, 16), // Sep 16, 2023
      'ETF Shares Vital': 11801.3,
      'Vitainvest Core': 10501.1,
      'iShares Tech Growth': 6532.1,
    },
    {
      date: new Date(2023, 8, 17), // Sep 17, 2023
      'ETF Shares Vital': 10102.9,
      'Vitainvest Core': 8923.3,
      'iShares Tech Growth': 4332.8,
    },
    {
      date: new Date(2023, 8, 18), // Sep 18, 2023
      'ETF Shares Vital': 12132.5,
      'Vitainvest Core': 10212.1,
      'iShares Tech Growth': 7847.4,
    },
    {
      date: new Date(2023, 8, 19), // Sep 19, 2023
      'ETF Shares Vital': 12901.1,
      'Vitainvest Core': 10101.7,
      'iShares Tech Growth': 7223.3,
    },
    {
      date: new Date(2023, 8, 20), // Sep 20, 2023
      'ETF Shares Vital': 13132.6,
      'Vitainvest Core': 12132.3,
      'iShares Tech Growth': 6900.2,
    },
    {
      date: new Date(2023, 8, 21), // Sep 21, 2023
      'ETF Shares Vital': 14132.2,
      'Vitainvest Core': 13212.5,
      'iShares Tech Growth': 5932.2,
    },
    {
      date: new Date(2023, 8, 22), // Sep 22, 2023
      'ETF Shares Vital': 14245.8,
      'Vitainvest Core': 12163.4,
      'iShares Tech Growth': 5577.1,
    },
    {
      date: new Date(2023, 8, 23), // Sep 23, 2023
      'ETF Shares Vital': 14328.3,
      'Vitainvest Core': 10036.1,
      'iShares Tech Growth': 5439.2,
    },
    {
      date: new Date(2023, 8, 24), // Sep 24, 2023
      'ETF Shares Vital': 14949.9,
      'Vitainvest Core': 8985.1,
      'iShares Tech Growth': 4463.1,
    },
    {
      date: new Date(2023, 8, 25), // Sep 25, 2023
      'ETF Shares Vital': 15967.5,
      'Vitainvest Core': 9700.1,
      'iShares Tech Growth': 4123.2,
    },
    {
      date: new Date(2023, 8, 26), // Sep 26, 2023
      'ETF Shares Vital': 17349.3,
      'Vitainvest Core': 10943.4,
      'iShares Tech Growth': 3935.1,
    },
  ];

  chartPlugins = [verticalHoverLinePlugin];

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
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          display: true,
          maxRotation: 0,
          maxTicksLimit: 10,
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
          maxTicksLimit: 5,
          callback: (value) => {
            return this.formatCurrency({
              value: value as number,
              maximumFractionDigits: 0,
            });
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
      intersect: false,
      mode: 'index',
    },
  };

  chartData = computed<ChartData<'line', number[], string>>(() => {
    const data = this.filteredData();
    return {
      labels: data.map((d) =>
        d.date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      ),
      datasets: [
        {
          data: data.map((d) => d['ETF Shares Vital']),
          label: 'ETF Shares Vital',
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgb(59, 130, 246)',
          pointHoverBackgroundColor: 'rgb(59, 130, 246)',
          pointHoverBorderColor: 'rgb(59, 130, 246)',
          fill: false,
        },
        {
          data: data.map((d) => d['Vitainvest Core']),
          label: 'Vitainvest Core',
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgb(139, 92, 246)',
          pointHoverBackgroundColor: 'rgb(139, 92, 246)',
          pointHoverBorderColor: 'rgb(139, 92, 246)',
          fill: false,
        },
        {
          data: data.map((d) => d['iShares Tech Growth']),
          label: 'iShares Tech Growth',
          borderColor: 'rgb(217, 70, 239)',
          backgroundColor: 'rgb(217, 70, 239)',
          pointHoverBackgroundColor: 'rgb(217, 70, 239)',
          pointHoverBorderColor: 'rgb(217, 70, 239)',
          fill: false,
        },
      ],
    };
  });

  // Mobile chart data (same as desktop)
  mobileChartData = this.chartData;

  constructor() {
    // Initialize with full date range
    this.dateRangeForm.setValue({
      start: this.minDate(),
      end: this.maxDate(),
    });
    // Subscribe to form control changes
    this.dateRangeForm.valueChanges.subscribe((value) => {
      this.startDate.set(value.start ?? null);
      this.endDate.set(value.end ?? null);
    });
  }

  resetDateFilter(): void {
    this.dateRangeForm.setValue({
      start: this.minDate(),
      end: this.maxDate(),
    });
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
