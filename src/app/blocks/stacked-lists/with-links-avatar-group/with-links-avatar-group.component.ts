/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stacked-lists/with-links-avatar-group`
*/

import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { withLinksAvatarGroupContacts } from './with-links-avatar-group.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-stacked-list-with-links-avatar-group',
  templateUrl: './with-links-avatar-group.component.html',
  styleUrls: ['./with-links-avatar-group.component.scss'],
  imports: [MatListModule, MatDividerModule, MatIconModule],
})
export class StackedListWithLinksAvatarGroupComponent {
  contacts = withLinksAvatarGroupContacts;
}
