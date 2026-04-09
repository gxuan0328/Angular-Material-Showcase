/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update filterbar/filterbar-8`
*/

import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';

interface RadioItem {
  value: string;
  label: string;
  hint?: string;
}

@Component({
  selector: 'ngm-dev-block-filterbar-8',
  templateUrl: './filterbar-8.component.html',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    FormsModule,
  ],
})
export class Filterbar8Component {
  // Sorting options
  sorting = 'reverse-alphabetical';
  sortingOptions: RadioItem[] = [
    { value: 'alphabetical', label: 'Alphabetical', hint: 'A-Z' },
    {
      value: 'reverse-alphabetical',
      label: 'Reverse alphabetical',
      hint: 'Z-A',
    },
    { value: 'created-at', label: 'Created at', hint: 'Jan-Dec' },
  ];

  // Date filter options
  dateFilter: string | null = 'last-30-days';
  dateFilterOptions: RadioItem[] = [
    { value: 'last-day', label: 'Last day' },
    { value: 'last-15-days', label: 'Last 15 days' },
    { value: 'last-30-days', label: 'Last 30 days' },
    { value: 'last-quarter', label: 'Last quarter' },
  ];

  // Get the selected option label for display
  get selectedSortingLabel(): string {
    return (
      this.sortingOptions.find((item) => item.value === this.sorting)?.label ||
      ''
    );
  }

  get selectedDateFilterLabel(): string {
    return (
      this.dateFilterOptions.find((item) => item.value === this.dateFilter)
        ?.label || ''
    );
  }

  // Handle option selection
  setSorting(value: string): void {
    this.sorting = value;
  }

  setDateFilter(value: string): void {
    this.dateFilter = value;
  }
}
