/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update filterbar/filterbar-10`
*/

import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

// Define date range options
type DateRangeOption = {
  value: string;
  label: string;
};

@Component({
  selector: 'ngm-dev-block-filterbar-10',
  templateUrl: './filterbar-10.component.html',
  imports: [FormsModule, MatButtonModule, MatIconModule, MatMenuModule],
})
export class Filterbar10Component {
  // Date range options
  dateRangeOptions: DateRangeOption[] = [
    { value: 'last-day', label: 'Last day' },
    { value: 'last-15-days', label: 'Last 15 days' },
    { value: 'last-30-days', label: 'Last 30 days' },
    { value: 'last-60-days', label: 'Last 60 days' },
    { value: 'last-quarter', label: 'Last quarter' },
  ];

  // Selected date range
  selectedDateRange = 'last-30-days'; // Default to 'Last 30 days'

  // Get the label for the selected date range
  getSelectedDateRangeLabel(): string {
    const option = this.dateRangeOptions.find(
      (option) => option.value === this.selectedDateRange,
    );
    return option ? option.label : '';
  }

  // Select date range
  selectDateRange(value: string): void {
    this.selectedDateRange = value;
  }
}
