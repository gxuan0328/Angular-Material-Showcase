/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update badges/badge-11`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipSet, MatChip, MatChipAvatar } from '@angular/material/chips';

interface Badge {
  classes: string;
  label: {
    text: string;
    icon: string;
    isIconFilled?: boolean;
  };
}

@Component({
  selector: 'ngm-dev-block-badge-11',
  templateUrl: './badge-11.component.html',
  styleUrls: ['./badge-11.component.scss'],
  imports: [MatIconModule, MatChipSet, MatChip, MatChipAvatar],
})
export class Badge11Component {
  badges: Badge[] = [
    {
      classes: 'bg-blue-50! text-blue-600',
      label: {
        text: 'March 09-16',
        icon: 'calendar_month',
        isIconFilled: true,
      },
    },
    {
      classes: 'bg-orange-50! text-orange-600',
      label: {
        text: 'Weekly',
        icon: 'repeat',
      },
    },
    {
      classes: 'bg-green-50! text-green-600',
      label: {
        text: 'Zoom',
        icon: 'video_call',
        isIconFilled: true,
      },
    },
    {
      classes: 'bg-sky-50! text-sky-600',
      label: {
        text: 'Herengracht 133, Amsterdam',
        icon: 'location_on',
        isIconFilled: true,
      },
    },
    {
      classes: 'bg-red-50! text-red-600',
      label: {
        text: 'Participants',
        icon: 'people',
        isIconFilled: true,
      },
    },
    {
      classes: 'bg-purple-50! text-purple-600',
      label: {
        text: '12:00-13:00',
        icon: 'access_time',
        isIconFilled: true,
      },
    },
  ];
}
