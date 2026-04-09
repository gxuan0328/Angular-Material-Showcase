/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update badges/badge-7`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipSet, MatChip, MatChipRemove } from '@angular/material/chips';

@Component({
  selector: 'ngm-dev-block-badge-7',
  templateUrl: './badge-7.component.html',
  styleUrls: ['./badge-7.component.scss'],
  imports: [MatIconModule, MatChipSet, MatChip, MatChipRemove],
})
export class Badge7Component {
  badges = [
    {
      label: 'Status',
      value: 'Active',
    },
    {
      label: 'Region',
      value: 'United States',
    },
    {
      label: 'Sales volume',
      value: '$100K-5M',
    },
  ];
}
