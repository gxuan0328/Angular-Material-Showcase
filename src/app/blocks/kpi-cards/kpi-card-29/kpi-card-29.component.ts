/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-29`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';

type Metric = {
  label: string;
  value: number;
  percentage: string;
  fraction: string;
};

const CATEGORY_THRESHOLDS = {
  red: 0.3,
  orange: 0.7,
} as const;

const THEME_COLORS = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  emerald: 'bg-emerald-500',
  gray: 'bg-gray-300 dark:bg-gray-800',
} as const;

@Component({
  selector: 'ngm-dev-block-kpi-card-29',
  imports: [MatCard, MatCardContent, MatCardHeader, MatCardTitle],
  templateUrl: './kpi-card-29.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard29Component {
  metrics: Metric[] = [
    {
      label: 'Conversion Ratio',
      value: 0.72,
      percentage: '68.4%',
      fraction: '685/1K',
    },
    {
      label: 'Capacity Load',
      value: 0.18,
      percentage: '15.2%',
      fraction: '152/1K',
    },
    {
      label: 'Success Rate',
      value: 0.92,
      percentage: '92.8%',
      fraction: '465/501',
    },
  ];

  getBars(value: number): string[] {
    const bars = [];
    const activeBars = this.getActiveBars(value);
    const inactiveClass = THEME_COLORS.gray;

    for (let i = 0; i < 3; i++) {
      if (i < activeBars) {
        bars.push(this.getActiveColor(value));
      } else {
        bars.push(inactiveClass);
      }
    }
    return bars;
  }

  private getActiveBars(value: number): number {
    if (value < 0) return 0;
    if (value < CATEGORY_THRESHOLDS.red) return 1;
    if (value < CATEGORY_THRESHOLDS.orange) return 2;
    return 3;
  }

  private getActiveColor(value: number): string {
    if (value < 0) return THEME_COLORS.gray;
    if (value < CATEGORY_THRESHOLDS.red) return THEME_COLORS.red;
    if (value < CATEGORY_THRESHOLDS.orange) return THEME_COLORS.orange;
    return THEME_COLORS.emerald;
  }
}
