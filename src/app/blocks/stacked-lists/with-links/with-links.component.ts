/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stacked-lists/with-links`
*/

import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { withLinksContacts } from './with-links.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-stacked-list-with-links',
  templateUrl: './with-links.component.html',
  styleUrls: ['./with-links.component.scss'],
  imports: [MatListModule, MatDividerModule, MatIconModule],
})
export class StackedListWithLinksComponent {
  contacts = withLinksContacts;
}
