/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stacked-lists/with-inline-link-action-menu`
*/

import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { withInlineLinkActionMenuContacts } from './with-inline-link-action-menu.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'ngm-dev-block-stacked-list-with-inline-link-action-menu',
  templateUrl: './with-inline-link-action-menu.component.html',
  styleUrls: ['./with-inline-link-action-menu.component.scss'],
  imports: [
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
})
export class StackedListWithInlineLinkActionMenuComponent {
  contacts = withInlineLinkActionMenuContacts;
}
