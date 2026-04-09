/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update badges/badge-3`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipSet, MatChip, MatChipAvatar } from '@angular/material/chips';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ngm-dev-block-badge-3',
  templateUrl: './badge-3.component.html',
  styleUrls: ['./badge-3.component.scss'],
  imports: [MatIconModule, MatChipSet, MatChip, MatChipAvatar, NgClass],
})
export class Badge3Component {
  badges = [
    {
      value: '9.3%',
      trend: 'up',
      classes:
        '!bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-600/10 dark:!bg-emerald-400/20 dark:text-emerald-500 dark:ring-emerald-400/20',
    },
    {
      value: '1.9%',
      trend: 'down',
      classes:
        '!bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/10 dark:!bg-red-400/20 dark:text-red-500 dark:ring-red-400/20',
    },
    {
      value: '0.6%',
      trend: 'right',
      classes:
        '!bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-600/10 dark:!bg-gray-500/30 dark:text-gray-300 dark:ring-gray-400/20',
    },
  ];

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up':
        return 'arrow_upward';
      case 'down':
        return 'arrow_downward';
      default:
        return 'arrow_forward';
    }
  }
}
