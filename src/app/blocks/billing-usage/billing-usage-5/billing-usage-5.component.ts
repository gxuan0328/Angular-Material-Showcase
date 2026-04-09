/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update billing-usage/billing-usage-5`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

interface BillingItem {
  id: number;
  name: string;
  description: string;
  value: string;
  capacity: string | null;
  current: number | null;
  percentageValue?: number;
}

@Component({
  selector: 'ngm-dev-block-billing-usage-5',
  templateUrl: './billing-usage-5.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressBarModule,
    MatCardModule,
    MatDividerModule,
  ],
})
export class BillingUsage5Component {
  billingItems: BillingItem[] = [
    {
      id: 1,
      name: 'Starter plan',
      description: 'Discounted plan for start-ups and growing companies',
      value: '$90.00',
      capacity: null,
      current: null,
    },
    {
      id: 2,
      name: 'Storage used',
      description: 'Used 1.1 GB',
      value: '$0.00',
      capacity: '10 GB included',
      current: null,
      percentageValue: 11,
    },
    {
      id: 3,
      name: 'Users',
      description: 'Used 9',
      value: '$0.00',
      capacity: '50 users included',
      current: 9,
      percentageValue: 18,
    },
    {
      id: 4,
      name: 'Query super caching (EU-Central 1)',
      description: '4 GB query cache, $120/mo',
      value: '$120.00',
      capacity: null,
      current: null,
    },
  ];
}
