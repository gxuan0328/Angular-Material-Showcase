/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stacked-lists/full-width-with-constrained-content`
*/

import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { fullWidthWithConstrainedContentContacts } from './full-width-with-constrained-content.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ngm-dev-block-stacked-list-full-width-with-constrained-content',
  templateUrl: './full-width-with-constrained-content.component.html',
  styleUrls: ['./full-width-with-constrained-content.component.scss'],
  imports: [MatListModule, MatDividerModule, MatIconModule],
})
export class StackedListFullWidthWithConstrainedContentComponent {
  contacts = fullWidthWithConstrainedContentContacts;
}
