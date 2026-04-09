/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stacked-lists/narrow`
*/

import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { narrowContacts } from './narrow.model';

@Component({
  selector: 'ngm-dev-block-narrow-stacked-list',
  templateUrl: './narrow.component.html',
  styleUrls: ['./narrow.component.scss'],
  imports: [MatListModule, MatDividerModule],
})
export class NarrowStackedListComponent {
  contacts = narrowContacts;
}
