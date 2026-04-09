/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update badges/badge-4`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatChipSet,
  MatChip,
  MatChipTrailingIcon,
} from '@angular/material/chips';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ngm-dev-block-badge-4',
  templateUrl: './badge-4.component.html',
  styleUrls: ['./badge-4.component.scss'],
  imports: [MatIconModule, MatChipSet, MatChip, NgClass, MatChipTrailingIcon],
})
export class Badge4Component {
  badges = [
    {
      value: '13.3%',
      trend: 'up',
      valueColor: 'text-emerald-700 dark:text-emerald-500',
      iconClasses: 'text-emerald-800 dark:text-emerald-600',
      bgClasses: 'bg-emerald-100! dark:bg-emerald-400/10!',
    },
    {
      value: '1.9%',
      trend: 'down',
      valueColor: 'text-red-700 dark:text-red-500',
      iconClasses: 'text-red-800 dark:text-red-600',
      bgClasses: 'bg-red-100! dark:bg-red-400/10!',
    },
    {
      value: '0.6%',
      trend: 'right',
      valueColor: 'text-slate-700 dark:text-slate-500',
      iconClasses: 'text-slate-700 dark:text-slate-500',
      bgClasses: 'bg-slate-100! dark:bg-slate-400/10!',
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
