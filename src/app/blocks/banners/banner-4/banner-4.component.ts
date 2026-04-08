/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update banners/banner-4`
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

@Component({
  selector: 'ngm-dev-block-banner-4',
  templateUrl: './banner-4.component.html',
  styleUrls: ['./banner-4.component.scss'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
  ],
})
export class Banner4Component {
  data = [
    {
      title: 'How it works',
      description: 'Learn how the platform works before getting started.',
      linkText: 'View tutorials',
      href: '#',
    },
    {
      title: 'Get started',
      description:
        'Learn how to install and configure this magic app into your project.',
      linkText: 'Start introduction',
      href: '#',
    },
    {
      title: 'Examples gallery',
      description:
        'Browse and take inspiration from our templates and demo apps.',
      linkText: 'View examples',
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
