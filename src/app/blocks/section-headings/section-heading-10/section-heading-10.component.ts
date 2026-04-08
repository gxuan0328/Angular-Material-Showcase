/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update section-headings/section-heading-10`
*/

import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'ngm-dev-block-section-heading-10',
  templateUrl: './section-heading-10.component.html',
  styleUrls: ['./section-heading-10.component.scss'],
  imports: [MatChipsModule, MatIconModule, MatButtonModule, MatMenuModule],
})
export class SectionHeading10Component {
  readonly title = 'Full-Stack Developer';
}
