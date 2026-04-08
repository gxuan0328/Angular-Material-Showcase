/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update page-headings/page-heading-7`
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
  selector: 'ngm-dev-block-page-heading-7',
  templateUrl: './page-heading-7.component.html',
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class PageHeading7Component {
  private readonly deviceService = inject(DeviceService);

  readonly isHandset$ = this.deviceService.isHandset$;
  readonly isLessThanMD$ = this.deviceService.isLessThanMD$;

  readonly userName = 'Ricardo Cooper';
  readonly userAvatarUrl =
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  readonly bannerImageUrl =
    'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80';

  readonly actionButtons: ActionButton[] = [
    {
      label: 'Message',
      icon: 'mail',
      action: () => this.onMessage(),
    },
    {
      label: 'Call',
      icon: 'phone',
      action: () => this.onCall(),
    },
  ];

  onMessage(): void {
    console.log('Message clicked');
  }

  onCall(): void {
    console.log('Call clicked');
  }
}
