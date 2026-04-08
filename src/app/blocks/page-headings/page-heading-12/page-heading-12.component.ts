/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update page-headings/page-heading-12`
*/

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { DeviceService } from '../../utils/services/device.service';

type FilterTab = {
  label: string;
  value: string;
};

@Component({
  selector: 'ngm-dev-block-page-heading-12',
  templateUrl: './page-heading-12.component.html',
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
  ],
})
export class PageHeading12Component {
  private readonly deviceService = inject(DeviceService);

  readonly isHandset$ = this.deviceService.isHandset$;
  readonly isLessThanMD$ = this.deviceService.isLessThanMD$;

  readonly pageTitle = 'Cashflow';
  readonly selectedFilter = '7days';

  readonly filterTabs: FilterTab[] = [
    {
      label: 'Last 7 days',
      value: '7days',
    },
    {
      label: 'Last 30 days',
      value: '30days',
    },
    {
      label: 'All-time',
      value: 'alltime',
    },
  ];

  onFilterChange(value: string): void {
    console.log('Filter changed to:', value);
  }

  onNewInvoice(): void {
    console.log('New invoice clicked');
  }
}
