/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update badges/badge-2`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipSet, MatChip, MatChipAvatar } from '@angular/material/chips';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ngm-dev-block-badge-2',
  templateUrl: './badge-2.component.html',
  styleUrls: ['./badge-2.component.scss'],
  imports: [MatIconModule, MatChipSet, MatChip, MatChipAvatar, NgClass],
})
export class Badge2Component {
  badges = [
    {
      value: '9.3%',
      trend: 'up',
      classes:
        'bg-emerald-100! text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-500',
    },
    {
      value: '1.9%',
      trend: 'down',
      classes: 'bg-red-100! text-red-800 dark:bg-red-400/20 dark:text-red-500',
    },
    {
      value: '0.6%',
      trend: 'right',
      classes:
        'bg-gray-200/50! text-gray-700 dark:bg-gray-500/30 dark:text-gray-300',
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
