/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stacked-lists/with-links-in-card`
*/

import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { withLinksInCardContacts } from './with-links-in-card.model';
import { MatIconModule } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'ngm-dev-block-stacked-list-with-links',
  templateUrl: './with-links-in-card.component.html',
  styleUrls: ['./with-links-in-card.component.scss'],
  imports: [
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatCard,
    MatCardContent,
  ],
})
export class StackedListWithLinksInCardComponent {
  contacts = withLinksInCardContacts;
}
