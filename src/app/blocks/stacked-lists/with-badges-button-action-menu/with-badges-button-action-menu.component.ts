/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stacked-lists/with-badges-button-action-menu`
*/

import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { withBadgesButtonActionMenuItems } from './with-badges-button-action-menu.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { cx } from '../../utils/functions/cx';

@Component({
  selector: 'ngm-dev-block-stacked-list-with-badges-button-action-menu',
  templateUrl: './with-badges-button-action-menu.component.html',
  styleUrls: ['./with-badges-button-action-menu.component.scss'],
  imports: [
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatChipsModule,
    DatePipe,
  ],
})
export class StackedListWithBadgesButtonActionMenuComponent {
  items = withBadgesButtonActionMenuItems;
  readonly cx = cx;
}
