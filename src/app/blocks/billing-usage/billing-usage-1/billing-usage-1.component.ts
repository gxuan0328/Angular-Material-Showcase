/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update billing-usage/billing-usage-1`
*/

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

interface UsageItem {
  id: number;
  resource: string;
  usage: string;
  maximum: string;
  href: string;
}

@Component({
  selector: 'ngm-dev-block-billing-usage-1',
  templateUrl: './billing-usage-1.component.html',
  imports: [MatCardModule, MatTabsModule, MatIconModule],
})
export class BillingUsage1Component {
  selectedTabIndex = 1;

  usage: UsageItem[] = [
    {
      id: 1,
      resource: 'Requests per day',
      usage: '145',
      maximum: '1,000',
      href: '#',
    },
    {
      id: 2,
      resource: 'Storage per month',
      usage: '1.1',
      maximum: '10 GB',
      href: '#',
    },
    {
      id: 3,
      resource: 'Members',
      usage: '10',
      maximum: '25',
      href: '#',
    },
    {
      id: 4,
      resource: 'Availability',
      usage: '95.1',
      maximum: '99.9%',
      href: '#',
    },
  ];
}
