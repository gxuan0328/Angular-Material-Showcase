/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update page-headings/page-heading-3`
*/

import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DeviceService } from '../../utils/services/device.service';

type ActionButton = {
  label: string;
  variant: 'outlined' | 'filled';
  action: () => void;
};

@Component({
  selector: 'ngm-dev-block-page-heading-3',
  templateUrl: './page-heading-3.component.html',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
})
export class PageHeading3Component {
  private readonly deviceService = inject(DeviceService);

  readonly isHandset$ = this.deviceService.isHandset$;

  readonly jobTitle = 'Back End Developer';

  readonly actionButtons: ActionButton[] = [
    {
      label: 'Edit',
      variant: 'outlined',
      action: () => this.onEdit(),
    },
    {
      label: 'Publish',
      variant: 'filled',
      action: () => this.onPublish(),
    },
  ];

  onEdit(): void {
    console.log('Edit clicked');
  }

  onPublish(): void {
    console.log('Publish clicked');
  }
}
