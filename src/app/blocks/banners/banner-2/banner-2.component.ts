/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update banners/banner-2`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardActions,
  MatCardAvatar,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';

@Component({
  selector: 'ngm-dev-block-banner-2',
  templateUrl: './banner-2.component.html',
  styleUrls: ['./banner-2.component.scss'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatCardHeader,
    MatCardTitle,
    MatCardAvatar,
  ],
})
export class Banner2Component {
  isOpen = true;

  close() {
    this.isOpen = false;
    // Demo purpose: reopen after 1 second
    setTimeout(() => {
      this.isOpen = true;
    }, 1000);
  }
}
