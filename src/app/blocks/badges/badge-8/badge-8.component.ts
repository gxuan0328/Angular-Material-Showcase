/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update badges/badge-8`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipSet, MatChip, MatChipAvatar } from '@angular/material/chips';
import { NgClass } from '@angular/common';

interface Badge {
  label: {
    text: string;
    icon: string;
    iconClasses: string;
    isIconFilled?: boolean;
  };
  value: {
    text: string;
    icon: string;
    isIconFilled?: boolean;
  };
}

@Component({
  selector: 'ngm-dev-block-badge-8',
  templateUrl: './badge-8.component.html',
  styleUrls: ['./badge-8.component.scss'],
  imports: [MatIconModule, MatChipSet, MatChip, MatChipAvatar, NgClass],
})
export class Badge8Component {
  badges: Badge[] = [
    {
      label: {
        text: 'Protection',
        icon: 'security',
        iconClasses: '!text-emerald-700 dark:!text-emerald-500',
      },
      value: {
        text: 'SSO login',
        icon: 'cancel',
      },
    },
    {
      label: {
        text: 'Live',
        icon: 'check_circle',
        iconClasses: '!text-emerald-700 dark:!text-emerald-500',
        isIconFilled: true,
      },
      value: {
        text: 'Audit trails',
        icon: 'cancel',
      },
    },
    {
      label: {
        text: 'Safety checks',
        icon: 'cancel',
        iconClasses: '!text-emerald-700 dark:!text-emerald-500',
        isIconFilled: true,
      },
      value: {
        text: 'Production',
        icon: 'verified_user',
      },
    },
  ];
}
