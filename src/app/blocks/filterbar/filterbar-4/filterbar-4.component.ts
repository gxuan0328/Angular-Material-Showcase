/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update filterbar/filterbar-4`
*/

import { Component } from '@angular/core';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

interface DateOption {
  label: string;
  date: string;
}

@Component({
  selector: 'ngm-dev-block-filterbar-4',
  templateUrl: './filterbar-4.component.html',
  imports: [MatButtonToggleModule, MatTooltipModule],
})
export class Filterbar4Component {
  selectedOption = 'today';

  dateOptions: DateOption[] = [
    {
      label: 'Today',
      date: this.formatDate(new Date()),
    },
    {
      label: '7D',
      date: `${this.formatDate(this.getDateBefore(7))} - ${this.formatDate(
        new Date(),
      )}`,
    },
    {
      label: '30D',
      date: `${this.formatDate(this.getDateBefore(30))} - ${this.formatDate(
        new Date(),
      )}`,
    },
    {
      label: '3M',
      date: `${this.formatDate(this.getMonthsBefore(3))} - ${this.formatDate(
        new Date(),
      )}`,
    },
    {
      label: '6M',
      date: `${this.formatDate(this.getMonthsBefore(6))} - ${this.formatDate(
        new Date(),
      )}`,
    },
  ];

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
