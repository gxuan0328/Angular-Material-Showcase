/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-24`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { KeyValuePipe } from '@angular/common';

type KpiData = {
  name: string;
  stat: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
  top3: Record<string, number>;
};

@Component({
  selector: 'ngm-dev-block-kpi-card-24',
  imports: [MatCard, MatCardContent, MatIcon, KeyValuePipe],
  templateUrl: './kpi-card-24.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard24Component {
  data: KpiData[] = [
    {
      name: 'Income',
      stat: '18,750',
      change: '-9.8%',
      changeType: 'negative',
      icon: 'payments',
      top3: {
        'Subscription Fees': 8420,
        'Product Sales': 5680,
        'Service Revenue': 4650,
      },
    },
    {
      name: 'Spending',
      stat: '5,942',
      change: '+3.2%',
      changeType: 'positive',
      icon: 'account_balance',
      top3: {
        Infrastructure: 2970,
        Personnel: 1780,
        'Software Licenses': 1192,
      },
    },
    {
      name: 'Interaction',
      stat: '92.5%',
      change: '+22.4%',
      changeType: 'positive',
      icon: 'link',
      top3: {
        'Email Campaigns': 48.2,
        'Push Notifications': 28.5,
        'In-App Messages': 15.8,
      },
    },
  ];

  formatValue(value: number, categoryName: string): string {
    if (categoryName === 'Interaction') {
      return `${value}%`;
    }
    return `$${value.toLocaleString()}`;
  }
}
