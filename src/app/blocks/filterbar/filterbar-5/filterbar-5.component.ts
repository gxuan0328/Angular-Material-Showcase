/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update filterbar/filterbar-5`
*/

import { Component } from '@angular/core';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

interface DateOption {
  buttonText: string;
  tooltipText: string;
}

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'ngm-dev-block-filterbar-5',
  templateUrl: './filterbar-5.component.html',
  imports: [
    MatButtonToggleModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
})
export class Filterbar5Component {
  selectedDateOption = '7d';
  selectedSelectOption = '';
  selectedSelectLabel = 'XTD';

  dateOptions: DateOption[] = [
    {
      buttonText: '7D',
      tooltipText: `${this.formatDate(
        this.getDateBefore(7),
      )} - ${this.formatDate(new Date())}`,
    },
    {
      buttonText: '30D',
      tooltipText: `${this.formatDate(
        this.getDateBefore(30),
      )} - ${this.formatDate(new Date())}`,
    },
    {
      buttonText: '3M',
      tooltipText: `${this.formatDate(
        this.getMonthsBefore(3),
      )} - ${this.formatDate(new Date())}`,
    },
    {
      buttonText: '6M',
      tooltipText: `${this.formatDate(
        this.getMonthsBefore(6),
      )} - ${this.formatDate(new Date())}`,
    },
  ];

  selectOptions: SelectOption[] = [
    {
      value: 'week-to-date',
      label: 'Week to Date',
    },
    {
      value: 'month-to-date',
      label: 'Month to Date',
    },
    {
      value: 'year-to-date',
      label: 'Year to Date',
    },
  ];

  selectOption(option: SelectOption): void {
    this.selectedSelectOption = option.value;
    this.selectedSelectLabel = option.label;
  }

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
