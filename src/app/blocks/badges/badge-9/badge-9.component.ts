/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update badges/badge-9`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipSet, MatChip, MatChipAvatar } from '@angular/material/chips';

interface Badge {
  classes: string;
  label: {
    text: string;
    icon?: string;
    isIconFilled?: boolean;
  };
  action: {
    text: string;
    icon?: string;
    isIconFilled?: boolean;
  };
}

@Component({
  selector: 'ngm-dev-block-badge-9',
  templateUrl: './badge-9.component.html',
  styleUrls: ['./badge-9.component.scss'],
  imports: [MatIconModule, MatChipSet, MatChip, MatChipAvatar],
})
export class Badge9Component {
  badges: Badge[] = [
    {
      classes: 'bg-red-500! text-white',
      label: {
        text: 'Major incident',
      },
      action: {
        text: 'Updates',
        icon: 'arrow_outward',
      },
    },
    {
      classes: 'bg-emerald-500! text-white',
      label: {
        text: 'Connected',
        icon: 'wifi',
      },
      action: {
        text: 'Edit',
      },
    },
    {
      classes: 'bg-blue-500! text-white',
      label: {
        text: '1 Notification',
        icon: 'notifications',
        isIconFilled: true,
      },
      action: {
        text: 'Read',
        icon: 'arrow_outward',
      },
    },
  ];
}
