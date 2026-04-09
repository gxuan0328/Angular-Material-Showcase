import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { MockBillingApi } from '../../core/mock-api/mock-billing';

@Component({
  selector: 'app-billing-overview',
  imports: [
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './billing-overview.html',
  styleUrl: './billing-overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'billing-overview-host' },
})
export class BillingOverview {
  protected readonly api = inject(MockBillingApi);

  /** Default payment method (first with isDefault flag) */
  protected readonly defaultPayment = computed(() =>
    this.api.paymentMethods().find(pm => pm.isDefault),
  );

  protected brandIcon(brand: string): string {
    switch (brand) {
      case 'visa':
        return 'credit_card';
      case 'mastercard':
        return 'credit_card';
      case 'amex':
        return 'credit_card';
      case 'ach':
        return 'account_balance';
      default:
        return 'payment';
    }
  }

  protected brandLabel(brand: string): string {
    switch (brand) {
      case 'visa':
        return 'Visa';
      case 'mastercard':
        return 'Mastercard';
      case 'amex':
        return 'American Express';
      case 'ach':
        return 'ACH';
      default:
        return brand;
    }
  }

  protected statusLabel(status: string): string {
    switch (status) {
      case 'paid':
        return '已付款';
      case 'due':
        return '待付款';
      case 'overdue':
        return '逾期';
      case 'refunded':
        return '已退款';
      default:
        return status;
    }
  }
}
