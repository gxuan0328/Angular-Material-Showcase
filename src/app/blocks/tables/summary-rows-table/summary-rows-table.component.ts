/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/summary-rows-table`
*/

import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { DeviceService } from '../../utils/services/device.service';
import { toSignal } from '@angular/core/rxjs-interop';

export interface SummaryRowsTableInvoiceItem {
  project: string;
  description: string;
  hours: number;
  rate: number;
  price: number;
}

const INVOICE_ITEMS: SummaryRowsTableInvoiceItem[] = [
  {
    project: 'Website Redesign - Phase 1',
    description: 'Frontend development and UI/UX improvements.',
    hours: 45,
    rate: 75.0,
    price: 45 * 75.0,
  },
  {
    project: 'Mobile App Development - Android',
    description: 'Initial setup and core module implementation.',
    hours: 60,
    rate: 90.0,
    price: 60 * 90.0,
  },
  {
    project: 'SEO Optimization - Q3 Campaign',
    description: 'Keyword research, content optimization, and link building.',
    hours: 20,
    rate: 60.0,
    price: 20 * 60.0,
  },
  {
    project: 'Database Migration',
    description: 'Data schema design and migration from old to new system.',
    hours: 30,
    rate: 85.0,
    price: 30 * 85.0,
  },
];

@Component({
  selector: 'ngm-dev-block-summary-rows-table',
  templateUrl: './summary-rows-table.component.html',
  styleUrls: ['./summary-rows-table.component.scss'],
  imports: [MatTableModule, MatButton, MatIcon, CurrencyPipe, DecimalPipe],
})
export class SummaryRowsTableComponent {
  displayedColumns: string[] = ['project', 'hours', 'rate', 'price'];
  subTotalColumns: string[] = ['subTotal', 'subTotalValue'];
  taxColumns: string[] = ['tax', 'taxValue'];
  totalColumns: string[] = ['total', 'totalValue'];
  dataSource = INVOICE_ITEMS;
  tax = 1760;

  private deviceService = inject(DeviceService);
  isLessThanMD = toSignal(this.deviceService.isLessThanMD$);

  get subTotal() {
    return INVOICE_ITEMS.reduce((acc, item) => acc + item.price, 0);
  }

  get total() {
    return this.subTotal + this.tax;
  }
}
