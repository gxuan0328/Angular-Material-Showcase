/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update badges/badge-10`
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
  selector: 'ngm-dev-block-badge-10',
  templateUrl: './badge-10.component.html',
  styleUrls: ['./badge-10.component.scss'],
  imports: [MatIconModule, MatChipSet, MatChip, MatChipAvatar],
})
export class Badge10Component {
  badges: Badge[] = [
    {
      classes: 'bg-blue-500! text-white',
      label: {
        text: 'March 09-16',
        icon: 'calendar_month',
        isIconFilled: true,
      },
    },
    {
      classes: 'bg-orange-500! text-white',
      label: {
        text: 'Weekly',
        icon: 'repeat',
      },
    },
    {
      classes: 'bg-green-500! text-white',
      label: {
        text: 'Zoom',
        icon: 'video_call',
        isIconFilled: true,
      },
    },
    {
      classes: 'bg-sky-500! text-white',
      label: {
        text: 'Herengracht 133, Amsterdam',
        icon: 'location_on',
        isIconFilled: true,
      },
    },
    {
      classes: 'bg-red-500! text-white',
      label: {
        text: 'Participants',
        icon: 'people',
        isIconFilled: true,
      },
    },
    {
      classes: 'bg-purple-500! text-white',
      label: {
        text: '12:00-13:00',
        icon: 'access_time',
        isIconFilled: true,
      },
    },
  ];
}
