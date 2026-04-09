import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { Invoice, MockBillingApi } from '../../core/mock-api/mock-billing';

@Component({
  selector: 'app-billing-invoices',
  imports: [
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './billing-invoices.html',
  styleUrl: './billing-invoices.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'billing-invoices-host' },
})
export class BillingInvoices {
  protected readonly api = inject(MockBillingApi);

  protected statusLabel(status: Invoice['status']): string {
    switch (status) {
      case 'paid':
        return '已付款';
      case 'due':
        return '待付款';
      case 'overdue':
        return '逾期';
      case 'refunded':
        return '已退款';
    }
  }

  /** Create a mock Blob download for the invoice */
  protected download(invoice: Invoice): void {
    const content = [
      `帳單編號: ${invoice.number}`,
      `金額: ${invoice.currency} ${invoice.amount}`,
      `開立日期: ${invoice.issuedAt}`,
      `付款日期: ${invoice.paidAt ?? '—'}`,
      `狀態: ${this.statusLabel(invoice.status)}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${invoice.number}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
