/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update page-headings/page-heading-9`
*/

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DeviceService } from '../../utils/services/device.service';

type StatItem = {
  value: number;
  label: string;
  type: string;
};

@Component({
  selector: 'ngm-dev-block-page-heading-9',
  templateUrl: './page-heading-9.component.html',
  imports: [CommonModule, MatButtonModule, MatCardModule],
})
export class PageHeading9Component {
  private readonly deviceService = inject(DeviceService);

  readonly isHandset$ = this.deviceService.isHandset$;
  readonly isLessThanMD$ = this.deviceService.isLessThanMD$;

  readonly userName = 'Rebecca Nicholas';
  readonly userRole = 'Product Designer';
  readonly welcomeMessage = 'Welcome back,';
  readonly userAvatarUrl =
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  readonly stats: StatItem[] = [
    {
      value: 12,
      label: 'Vacation days left',
      type: 'vacation',
    },
    {
      value: 4,
      label: 'Sick days left',
      type: 'sick',
    },
    {
      value: 2,
      label: 'Personal days left',
      type: 'personal',
    },
  ];

  onViewProfile(): void {
    console.log('View profile clicked');
  }
}
