/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update tables/condensed-content-table`
*/

import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

export interface CondensedContentTableUser {
  transactionId: string;
  company: string;
  share: string;
  commission: number;
  price: number;
  quantity: number;
  netAmount: number;
}

const TRANSACTIONS: CondensedContentTableUser[] = [
  {
    transactionId: 'TXN001-EQT',
    company: 'Tech Solutions Inc.',
    share: 'TSI',
    commission: 12.5,
    price: 150.75,
    quantity: 100,
    netAmount: 150.75 * 100 + 12.5, // Buy transaction
  },
  {
    transactionId: 'TXN002-MF',
    company: 'Global Investments Ltd.',
    share: 'GILMF',
    commission: 5.0,
    price: 25.1,
    quantity: 500,
    netAmount: 25.1 * 500 + 5.0,
  },
  {
    transactionId: 'TXN003-EQT',
    company: 'Health Innovations Corp.',
    share: 'HIC',
    commission: 15.0,
    price: 320.5,
    quantity: 50,
    netAmount: 320.5 * 50 - 15.0, // Sell transaction
  },
  {
    transactionId: 'TXN004-BON',
    company: 'Government Bonds Agency',
    share: 'GBA2030',
    commission: 2.0,
    price: 1000.0,
    quantity: 5,
    netAmount: 1000.0 * 5 + 2.0,
  },
  {
    transactionId: 'TXN005-EQT',
    company: 'Energy Dynamics LLC',
    share: 'EDL',
    commission: 10.0,
    price: 88.2,
    quantity: 250,
    netAmount: 88.2 * 250 + 10.0,
  },
  {
    transactionId: 'TXN006-MF',
    company: 'Sustainable Future Fund',
    share: 'SFFUND',
    commission: 3.5,
    price: 45.75,
    quantity: 1000,
    netAmount: 45.75 * 1000 + 3.5,
  },
  {
    transactionId: 'TXN007-EQT',
    company: 'E-Commerce Giants Inc.',
    share: 'ECGI',
    commission: 20.0,
    price: 980.25,
    quantity: 20,
    netAmount: 980.25 * 20 - 20.0, // Sell transaction
  },
  {
    transactionId: 'TXN008-COMM',
    company: 'Agricultural Futures Exchange',
    share: 'WHEAT', // Commodity future
    commission: 7.5,
    price: 650.0,
    quantity: 10, // Assuming 10 contracts
    netAmount: 650.0 * 10 + 7.5,
  },
  {
    transactionId: 'TXN009-EQT',
    company: 'Biotech Innovations Ltd.',
    share: 'BIL',
    commission: 8.0,
    price: 75.6,
    quantity: 300,
    netAmount: 75.6 * 300 + 8.0,
  },
  {
    transactionId: 'TXN010-MF',
    company: 'Emerging Markets Fund',
    share: 'EMMF',
    commission: 4.0,
    price: 30.2,
    quantity: 750,
    netAmount: 30.2 * 750 + 4.0,
  },
];

@Component({
  selector: 'ngm-dev-block-condensed-content-table',
  templateUrl: './condensed-content-table.component.html',
  imports: [MatTableModule, MatButton, MatIcon, CurrencyPipe, DecimalPipe],
})
export class CondensedContentTableComponent {
  displayedColumns: string[] = [
    'transactionId',
    'company',
    'share',
    'commission',
    'price',
    'quantity',
    'netAmount',
    'actions',
  ];
  dataSource = TRANSACTIONS;
}
