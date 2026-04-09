/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update badges/badge-12`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipSet, MatChip, MatChipAvatar } from '@angular/material/chips';

interface Badge {
  label: {
    text: string;
    icon: string;
    isIconFilled?: boolean;
  };
}

@Component({
  selector: 'ngm-dev-block-badge-12',
  templateUrl: './badge-12.component.html',
  styleUrls: ['./badge-12.component.scss'],
  imports: [MatIconModule, MatChipSet, MatChip, MatChipAvatar],
})
export class Badge12Component {
  badges: Badge[] = [
    {
      label: {
        text: 'March 09-16',
        icon: 'calendar_month',
        isIconFilled: true,
      },
    },
    {
      label: {
        text: 'Weekly',
        icon: 'repeat',
      },
    },
    {
      label: {
        text: 'Zoom',
        icon: 'video_call',
        isIconFilled: true,
      },
    },
    {
      label: {
        text: 'Herengracht 133, Amsterdam',
        icon: 'location_on',
        isIconFilled: true,
      },
    },
    {
      label: {
        text: 'Participants',
        icon: 'people',
        isIconFilled: true,
      },
    },
    {
      label: {
        text: '12:00-13:00',
        icon: 'access_time',
        isIconFilled: true,
      },
    },
  ];
}
