/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update banners/banner-5`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
} from '@angular/material/card';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'ngm-dev-block-banner-5',
  templateUrl: './banner-5.component.html',
  styleUrls: ['./banner-5.component.scss'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatChip,
  ],
})
export class Banner5Component {
  currentStep = 0;
  data = [
    {
      title: 'Connect Data',
      description: 'Bring your existing data source or create a new one.',
      linkText: 'Add data',
      href: '#',
    },
    {
      title: 'Add Metrics',
      description:
        'Create metrics using custom SQL or with our aggregation mask.',
      linkText: 'Add metric',
      href: '#',
    },
    {
      title: 'Create Report',
      description:
        'Transform metrics into visualizations and add layout elements.',
      linkText: 'Create report',
      href: '#',
    },
  ];

  isOpen = true;

  close() {
    this.isOpen = false;
    // Demo purpose: reopen after 1 second
    setTimeout(() => {
      this.isOpen = true;
    }, 1000);
  }
}
