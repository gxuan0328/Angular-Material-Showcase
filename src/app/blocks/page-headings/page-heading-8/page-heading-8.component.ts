/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update page-headings/page-heading-8`
*/

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DeviceService } from '../../utils/services/device.service';

type ActionButton = {
  label: string;
  icon: string;
  action: () => void;
};

@Component({
  selector: 'ngm-dev-block-page-heading-8',
  templateUrl: './page-heading-8.component.html',
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class PageHeading8Component {
  private readonly deviceService = inject(DeviceService);

  readonly isHandset$ = this.deviceService.isHandset$;
  readonly isLessThanMD$ = this.deviceService.isLessThanMD$;

  readonly userName = 'Ricardo Cooper';
  readonly userRole = 'Applied for Front End Developer on August 25, 2020';
  readonly userAvatarUrl =
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  readonly actionButtons: ActionButton[] = [
    {
      label: 'Disqualify',
      icon: '',
      action: () => this.onDisqualify(),
    },
    {
      label: 'Advance to offer',
      icon: '',
      action: () => this.onAdvanceToOffer(),
    },
  ];

  onDisqualify(): void {
    console.log('Disqualify clicked');
  }

  onAdvanceToOffer(): void {
    console.log('Advance to offer clicked');
  }
}
