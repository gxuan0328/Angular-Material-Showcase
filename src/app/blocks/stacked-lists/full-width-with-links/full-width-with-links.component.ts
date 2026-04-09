/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stacked-lists/full-width-with-links`
*/

import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { fullWidthWithLinksContacts } from './full-width-with-links.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-stacked-list-full-width-with-links',
  templateUrl: './full-width-with-links.component.html',
  styleUrls: ['./full-width-with-links.component.scss'],
  imports: [MatListModule, MatDividerModule, MatIconModule],
})
export class StackedListFullWidthWithLinksComponent {
  contacts = fullWidthWithLinksContacts;
}
