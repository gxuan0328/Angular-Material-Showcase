/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update billing-usage/billing-usage-4`
*/

import { Component, inject } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { DomSanitizer } from '@angular/platform-browser';

const MC_SYMBOL = `<svg xmlns="http://www.w3.org/2000/svg" width="2.11676in" height="1.5in" viewBox="0 0 152.407 108">
  <g>
    <rect width="152.407" height="108" style="fill: none"/>
    <g>
      <rect x="60.4117" y="25.6968" width="31.5" height="56.6064" style="fill: #ff5f00"/>
      <path d="M382.20839,306a35.9375,35.9375,0,0,1,13.7499-28.3032,36,36,0,1,0,0,56.6064A35.938,35.938,0,0,1,382.20839,306Z" transform="translate(-319.79649 -252)" style="fill: #eb001b"/>
      <path d="M454.20349,306a35.99867,35.99867,0,0,1-58.2452,28.3032,36.00518,36.00518,0,0,0,0-56.6064A35.99867,35.99867,0,0,1,454.20349,306Z" transform="translate(-319.79649 -252)" style="fill: #f79e1b"/>
      <path d="M450.76889,328.3077v-1.1589h.4673v-.2361h-1.1901v.2361h.4675v1.1589Zm2.3105,0v-1.3973h-.3648l-.41959.9611-.41971-.9611h-.365v1.3973h.2576v-1.054l.3935.9087h.2671l.39351-.911v1.0563Z" transform="translate(-319.79649 -252)" style="fill: #f79e1b"/>
    </g>
  </g>
</svg>
`;

interface BillingItem {
  name: string;
  quantity: number;
  unit: string;
  price: string;
}

interface PaymentMethod {
  provider: string;
  status: {
    value: string;
    classes: string;
  };
  type: string;
  lastFourDigits: string;
  expiryDate: string;
  icon: string;
}

@Component({
  selector: 'ngm-dev-block-billing-usage-4',
  templateUrl: './billing-usage-4.component.html',
  styleUrls: ['./billing-usage-4.component.scss'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatDividerModule,
    MatChipsModule,
  ],
})
export class BillingUsage4Component {
  billingItems: BillingItem[] = [
    {
      name: 'Team Seats',
      quantity: 2,
      unit: '$20',
      price: '$40',
    },
    {
      name: 'Query Caching (4 GB)',
      quantity: 1,
      unit: '$25',
      price: '$25',
    },
  ];

  paymentMethod: PaymentMethod = {
    provider: 'MasterCard',
    status: {
      value: 'Active',
      classes:
        '!bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-600/10 dark:!bg-emerald-400/20 dark:text-emerald-500 dark:ring-emerald-400/20',
    },
    type: 'Credit',
    lastFourDigits: '1234',
    expiryDate: '1/2028',
    icon: 'mc',
  };

  displayedBillingColumns: string[] = ['item', 'quantity', 'unit', 'price'];
  displayedPaymentColumns: string[] = [
    'provider',
    'status',
    'type',
    'number',
    'expiry',
    'actions',
  ];

  private matIconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    this.matIconRegistry.addSvgIconLiteral(
      'mc',
      this.sanitizer.bypassSecurityTrustHtml(MC_SYMBOL),
    );
  }
}
