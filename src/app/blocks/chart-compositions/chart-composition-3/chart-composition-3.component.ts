/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update chart-compositions/chart-composition-3`
*/

import { Component } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardSubtitle,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatAnchor } from '@angular/material/button';
import { CategoryBarComponent } from '../../components/category-bar/category-bar.component';

type TransactionItem = {
  date: string;
  description: string;
  account: string;
  amount: string;
  changeType: 'positive' | 'negative';
};

type CapitalMilestoneItem = {
  milestone: string;
  targetDate: string;
  status: 'completed' | 'in-progress' | 'pending';
  statusText: string;
  capitalRequired: string;
};

@Component({
  selector: 'ngm-dev-block-chart-composition-3',
  templateUrl: './chart-composition-3.component.html',
  imports: [
    MatCard,
    MatCardContent,
    MatTableModule,
    MatTab,
    MatTabGroup,
    MatDivider,
    MatIcon,
    MatButton,
    MatAnchor,
    CategoryBarComponent,
    MatCardSubtitle,
    MatCardHeader,
    MatCardTitle,
  ],
})
export class ChartComposition3Component {
  // Outstanding balance breakdown: $4.2M outstanding, $1.4M available, $0.35M unavailable
  balanceValues = [4.2, 1.4, 0.35];
  balanceColors: Array<'blue' | 'cyan' | 'fuchsia'> = [
    'blue',
    'cyan',
    'fuchsia',
  ];

  // Capital allocation breakdown: $7.5M operating, $3.2M growth, $1.8M emergency
  capitalAllocationValues = [7.5, 3.2, 1.8];
  capitalAllocationColors: Array<'emerald' | 'blue' | 'amber'> = [
    'emerald',
    'blue',
    'amber',
  ];

  transactions: TransactionItem[] = [
    {
      date: 'Jan 24',
      description: 'Venture debt loan repayment',
      account: 'Calantis business account',
      amount: '-$1,500',
      changeType: 'negative',
    },
    {
      date: 'Dec 23',
      description: 'Venture debt loan repayment',
      account: 'Calantis business account',
      amount: '-$2,800',
      changeType: 'negative',
    },
    {
      date: 'Nov 23',
      description: 'Venture debt loan repayment',
      account: 'Calantis business account',
      amount: '-$1,500',
      changeType: 'negative',
    },
    {
      date: 'Oct 23',
      description: 'Venture debt loan funding',
      account: 'Calantis business account',
      amount: '+$6,200,000',
      changeType: 'positive',
    },
  ];

  capitalMilestones: CapitalMilestoneItem[] = [
    {
      milestone: 'Series A Funding',
      targetDate: 'Oct 2023',
      status: 'completed',
      statusText: 'Completed',
      capitalRequired: '$6.2M',
    },
    {
      milestone: 'Product Launch',
      targetDate: 'Dec 2023',
      status: 'completed',
      statusText: 'Completed',
      capitalRequired: '$1.2M',
    },
    {
      milestone: 'Market Expansion',
      targetDate: 'Mar 2024',
      status: 'in-progress',
      statusText: 'In Progress',
      capitalRequired: '$2.5M',
    },
    {
      milestone: 'Series B Funding',
      targetDate: 'Q3 2024',
      status: 'pending',
      statusText: 'Pending',
      capitalRequired: '$25M',
    },
    {
      milestone: 'International Expansion',
      targetDate: 'Q4 2024',
      status: 'pending',
      statusText: 'Pending',
      capitalRequired: '$8M',
    },
  ];

  displayedColumns: string[] = ['date', 'description', 'account', 'amount'];
  capitalMilestoneColumns: string[] = [
    'milestone',
    'targetDate',
    'status',
    'capitalRequired',
  ];
}
