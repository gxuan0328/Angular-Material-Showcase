import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { MockBillingApi, UsageMetric } from '../../core/mock-api/mock-billing';

@Component({
  selector: 'app-billing-usage',
  imports: [
    DecimalPipe,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './billing-usage.html',
  styleUrl: './billing-usage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'billing-usage-host' },
})
export class BillingUsage {
  protected readonly api = inject(MockBillingApi);

  /** True if any metric reaches 80% or above */
  protected readonly showUpgradeBanner = computed(() =>
    this.api.usageMetrics().some(m => this.percentage(m) >= 80),
  );

  /** Calculate usage percentage for a given metric */
  protected percentage(metric: UsageMetric): number {
    if (metric.limit === 0) return 0;
    return Math.round((metric.value / metric.limit) * 100);
  }

  /** Return a severity class based on usage level */
  protected severityClass(metric: UsageMetric): string {
    const pct = this.percentage(metric);
    if (pct >= 90) return 'billing-usage__bar--critical';
    if (pct >= 80) return 'billing-usage__bar--warning';
    return 'billing-usage__bar--normal';
  }
}
