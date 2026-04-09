/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update billing-usage/billing-usage-2`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgClass } from '@angular/common';

interface UsageMetric {
  id: string;
  name: string;
  value: number;
  limit: number;
  unit: string;
}

interface Receipt {
  id: string;
  month: string;
  href: string;
}

@Component({
  selector: 'ngm-dev-block-billing-usage-2',
  templateUrl: './billing-usage-2.component.html',
  styleUrls: ['./billing-usage-2.component.scss'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressBarModule,
    NgClass,
  ],
})
export class BillingUsage2Component {
  usageMetrics: UsageMetric[] = [
    {
      id: 'storage',
      name: 'Storage',
      value: 6.25,
      limit: 10,
      unit: 'GB',
    },
    {
      id: 'bandwidth',
      name: 'Bandwidth',
      value: 80,
      limit: 100,
      unit: 'GB',
    },
    {
      id: 'requests',
      name: 'Requests',
      value: 750000,
      limit: 1000000,
      unit: '',
    },
  ];

  receipts: Receipt[] = [
    { id: '1', month: 'March 2024', href: '#' },
    { id: '2', month: 'February 2024', href: '#' },
    { id: '3', month: 'January 2024', href: '#' },
  ];

  getUsagePercentage(metric: UsageMetric): number {
    return (metric.value / metric.limit) * 100;
  }

  formatValue(value: number): string {
    return value >= 1000000
      ? `${(value / 1000000).toFixed(1)}M`
      : value.toLocaleString();
  }

  getProgressBarColor(percentage: number): string {
    if (percentage >= 90) return 'warn';
    if (percentage >= 75) return 'accent';
    return 'primary';
  }
}
