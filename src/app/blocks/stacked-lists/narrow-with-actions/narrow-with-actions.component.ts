/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stacked-lists/narrow-with-actions`
*/

import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { narrowWithActionsContacts } from './narrow-with-actions.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ngm-dev-block-narrow-with-actions',
  templateUrl: './narrow-with-actions.component.html',
  styleUrls: ['./narrow-with-actions.component.scss'],
  imports: [MatListModule, MatDividerModule, MatButtonModule],
})
export class NarrowWithActionsComponent {
  contacts = narrowWithActionsContacts;
}
