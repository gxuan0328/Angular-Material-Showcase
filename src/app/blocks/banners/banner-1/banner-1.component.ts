/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update banners/banner-1`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardActions,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';

@Component({
  selector: 'ngm-dev-block-banner-1',
  templateUrl: './banner-1.component.html',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatCardHeader,
    MatCardTitle,
  ],
})
export class Banner1Component {
  isOpen = true;

  close() {
    this.isOpen = false;
    // Demo purpose: reopen after 1 second
    setTimeout(() => {
      this.isOpen = true;
    }, 1000);
  }
}
