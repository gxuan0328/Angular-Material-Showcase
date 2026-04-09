/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update billing-usage/billing-usage-3`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';

interface Plan {
  name: string;
  type: string;
  price: string;
  billingPeriod: {
    type: string;
    renewalDate: string;
  };
}

@Component({
  selector: 'ngm-dev-block-billing-usage-3',
  templateUrl: './billing-usage-3.component.html',
  styleUrls: ['./billing-usage-3.component.scss'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressBarModule,
    MatDividerModule,
  ],
})
export class BillingUsage3Component {
  plan: Plan = {
    name: 'Team',
    type: 'Annual',
    price: '$100/month',
    billingPeriod: {
      type: 'Monthly',
      renewalDate: '20/08/23',
    },
  };

  seats = {
    used: 5,
    total: 25,
    percentage: 25,
  };
}
