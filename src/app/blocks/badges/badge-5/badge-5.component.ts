/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update badges/badge-5`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipSet, MatChip } from '@angular/material/chips';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ngm-dev-block-badge-5',
  templateUrl: './badge-5.component.html',
  styleUrls: ['./badge-5.component.scss'],
  imports: [MatIconModule, MatChipSet, MatChip, NgClass],
})
export class Badge5Component {
  badges = [
    {
      label: 'In progress',
      classes: 'text-emerald-700 dark:text-emerald-400',
      value: '+5.1%',
    },
    {
      label: 'Obsolete',
      classes: 'text-red-700 dark:text-red-400',
      value: '-0.6%',
    },
    {
      label: 'Open',
      classes: 'text-emerald-700 dark:text-emerald-400',
      value: '+2.7%',
    },
    {
      label: 'Closed',
      classes: 'text-red-700 dark:text-red-400',
      value: '-2.7%',
    },
  ];
}
