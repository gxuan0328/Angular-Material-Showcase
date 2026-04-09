/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update filterbar/filterbar-7`
*/

import { Component } from '@angular/core';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

interface DateOption {
  buttonText: string;
  tooltipText: string;
  value: string;
}

interface ColumnOption {
  value: string;
  label: string;
}

@Component({
  selector: 'ngm-dev-block-filterbar-7',
  templateUrl: './filterbar-7.component.html',
  imports: [
    MatButtonToggleModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    FormsModule,
  ],
})
export class Filterbar7Component {
  // Selected date option
  selectedDateOption = '7d';

  // Column visibility states
  selectedColumns: string[] = ['product_id', 'name', 'description', 'amount'];

  // Column options
  columnOptions: ColumnOption[] = [
    { value: 'product_id', label: 'product_id' },
    { value: 'name', label: 'name' },
    { value: 'description', label: 'description' },
    { value: 'date_of_transaction', label: 'date_of_transaction' },
    { value: 'amount', label: 'amount' },
  ];

  // Date range options
  dateOptions: DateOption[] = [
    {
      buttonText: 'Today',
      tooltipText: this.formatDate(new Date()),
      value: 'today',
    },
    {
      buttonText: '7D',
      tooltipText: `${this.formatDate(
        this.getDateBefore(7),
      )} - ${this.formatDate(new Date())}`,
      value: '7d',
    },
    {
      buttonText: '30D',
      tooltipText: `${this.formatDate(
        this.getDateBefore(30),
      )} - ${this.formatDate(new Date())}`,
      value: '30d',
    },
    {
      buttonText: '3M',
      tooltipText: `${this.formatDate(
        this.getMonthsBefore(3),
      )} - ${this.formatDate(new Date())}`,
      value: '3m',
    },
    {
      buttonText: '6M',
      tooltipText: `${this.formatDate(
        this.getMonthsBefore(6),
      )} - ${this.formatDate(new Date())}`,
      value: '6m',
    },
  ];

  // Helper methods for date formatting
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  private getDateBefore(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  }

  private getMonthsBefore(months: number): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date;
  }
}
