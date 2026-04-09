/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stacked-lists/narrow-with-sticky-headings`
*/

import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { narrowWithStickyHeadingsContacts } from './narrow-with-sticky-headings.model';

@Component({
  selector: 'ngm-dev-block-narrow-with-sticky-headings',
  templateUrl: './narrow-with-sticky-headings.component.html',
  styleUrls: ['./narrow-with-sticky-headings.component.scss'],
  imports: [MatListModule, MatDividerModule],
})
export class NarrowWithStickyHeadingsComponent {
  contacts = narrowWithStickyHeadingsContacts;
}
