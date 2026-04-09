/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/hidden-headings-table`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';

export interface HiddenHeadingsTableItem {
  date: string;
  amount: number;
  status: 'paid' | 'overdue' | 'withdrawn';
  tax?: number;
  title: string;
  subtitle: string;
  invoiceNumber: string;
  showDate?: boolean;
}

const ACTIVITIES: HiddenHeadingsTableItem[] = [
  {
    date: 'today',
    amount: 1250.0,
    status: 'paid',
    tax: 62.5,
    title: 'Software License Renewal',
    subtitle: 'Annual subscription for enterprise suite.',
    invoiceNumber: 'INV-2024-001A',
  },
  {
    date: 'today',
    amount: 350.75,
    status: 'overdue',
    title: 'Consulting Services',
    subtitle: 'Website optimization project, Phase 2.',
    invoiceNumber: 'INV-2024-002B',
  },
  {
    date: 'today',
    amount: 899.99,
    status: 'withdrawn',
    tax: 45.0,
    title: 'Marketing Campaign - Q2',
    subtitle: 'Social media advertising and content creation.',
    invoiceNumber: 'INV-2024-003C',
  },
  {
    date: 'yesterday',
    amount: 2100.0,
    status: 'paid',
    tax: 105.0,
    title: 'Hardware Upgrade',
    subtitle: 'New server components and installation.',
    invoiceNumber: 'INV-2024-005E',
  },
];

@Component({
  selector: 'ngm-dev-block-hidden-headings-table',
  templateUrl: './hidden-headings-table.component.html',
  styleUrls: ['./hidden-headings-table.component.scss'],
  imports: [
    MatTableModule,
    MatButton,
    MatIcon,
    MatChipSet,
    MatChip,
    CurrencyPipe,
    NgTemplateOutlet,
  ],
})
export class HiddenHeadingsTableComponent {
  displayedColumns: string[] = ['amount', 'title', 'invoiceNumber'];

  dataSource = ACTIVITIES.map((activity, index) => ({
    ...activity,
    showDate: index === this.firstDateIndex(activity.date),
  }));

  isDateVisible(index: number, row: HiddenHeadingsTableItem) {
    return row.showDate;
  }

  firstDateIndex(date: string) {
    return ACTIVITIES.findIndex((activity) => activity.date === date);
  }
}
