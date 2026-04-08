/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update kpi-cards/kpi-card-28`
*/

import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {
  MatList,
  MatListItem,
  MatListItemIcon,
  MatListItemTitle,
} from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';

type Metric = {
  label: string;
  value: string;
  change: string;
};

type Issue = {
  category: string;
  totalCount: number;
  percentage: number;
};

@Component({
  selector: 'ngm-dev-block-kpi-card-28',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatListItemTitle,
    MatDivider,
  ],
  templateUrl: './kpi-card-28.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard28Component {
  metricsColumns: Metric[][] = [
    [
      {
        label: 'Active Members',
        value: '182,560',
        change: '+24%',
      },
      {
        label: 'Avg. Satisfaction',
        value: '4.2',
        change: '+8%',
      },
      {
        label: 'Avg. Wait Time',
        value: '12.8m',
        change: '+18%',
      },
    ],
    [
      {
        label: 'Total Interactions',
        value: '68,245',
        change: '+16%',
      },
      {
        label: 'Success Rate',
        value: '89.2%',
        change: '+4%',
      },
      {
        label: 'Total Groups',
        value: '38',
        change: '+9%',
      },
    ],
    [
      {
        label: 'Avg. Processing Time',
        value: '22.4m',
        change: '+28%',
      },
      {
        label: 'First Response Rate',
        value: '79.8%',
        change: '+5%',
      },
      {
        label: 'Engagement Rate',
        value: '91.5%',
        change: '+3%',
      },
    ],
  ];

  topIssues: Issue[] = [
    {
      category: 'Payment Processing',
      totalCount: 2845,
      percentage: 18,
    },
    {
      category: 'Order Fulfillment',
      totalCount: 2512,
      percentage: 16,
    },
    {
      category: 'Product Information',
      totalCount: 2183,
      percentage: 14,
    },
    {
      category: 'Shipping Inquiry',
      totalCount: 2180,
      percentage: 14,
    },
    {
      category: 'Return Request',
      totalCount: 2042,
      percentage: 13,
    },
    {
      category: 'Technical Support',
      totalCount: 2014,
      percentage: 13,
    },
  ];
}
