/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update page-headings/page-heading-13`
*/

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DeviceService } from '../../utils/services/device.service';

type ActionButton = {
  label: string;
  icon?: string;
  action: () => void;
  isPrimary?: boolean;
};

@Component({
  selector: 'ngm-dev-block-page-heading-13',
  templateUrl: './page-heading-13.component.html',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
})
export class PageHeading13Component {
  private readonly deviceService = inject(DeviceService);

  readonly isHandset$ = this.deviceService.isHandset$;
  readonly isLessThanMD$ = this.deviceService.isLessThanMD$;

  readonly logoUrl = 'https://ui.angular-material.dev/app-ui/logo.svg';
  readonly invoiceNumber = 'Invoice #00011';
  readonly companyName = 'Tuple, Inc';

  readonly actionButtons: ActionButton[] = [
    {
      label: 'Copy URL',
      action: () => this.onCopyUrl(),
    },
    {
      label: 'Edit',
      action: () => this.onEdit(),
    },
    {
      label: 'Send',
      action: () => this.onSend(),
      isPrimary: true,
    },
  ];

  onCopyUrl(): void {
    console.log('Copy URL clicked');
  }

  onEdit(): void {
    console.log('Edit clicked');
  }

  onSend(): void {
    console.log('Send clicked');
  }
}
