import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { MockBillingApi, Plan } from '../../core/mock-api/mock-billing';

interface PlanCard {
  readonly plan: Plan;
  readonly isCurrent: boolean;
}

@Component({
  selector: 'app-billing-plans',
  imports: [
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './billing-plans.html',
  styleUrl: './billing-plans.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'billing-plans-host' },
})
export class BillingPlans {
  protected readonly api = inject(MockBillingApi);

  /** Enrich each plan with whether it's the current one */
  protected readonly planCards = computed<readonly PlanCard[]>(() => {
    const currentId = this.api.currentPlan()?.id;
    return this.api.plans().map(plan => ({
      plan,
      isCurrent: plan.id === currentId,
    }));
  });

  /** Switch the current plan via the mock API */
  protected async selectPlan(planId: string): Promise<void> {
    await this.api.upgradePlan(planId);
  }
}
