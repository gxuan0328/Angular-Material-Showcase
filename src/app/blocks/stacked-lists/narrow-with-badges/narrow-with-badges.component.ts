/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stacked-lists/narrow-with-badges`
*/

import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { NarrowWithBadgesService } from './narrow-with-badges.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'ngm-dev-block-narrow-with-badges',
  templateUrl: './narrow-with-badges.component.html',
  styleUrls: ['./narrow-with-badges.component.scss'],
  imports: [
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    AsyncPipe,
    MatChipsModule,
  ],
  providers: [NarrowWithBadgesService],
})
export class NarrowWithBadgesComponent {
  private _narrowWithBadgesService = inject(NarrowWithBadgesService);
  issues = this._narrowWithBadgesService.getIssues();

  area(title: string) {
    const splits = title.split(':');
    return (splits.length > 1 ? splits[0] : '').trim();
  }

  woArea(title: string) {
    const splits = title.split(':');
    return (splits.length > 1 ? splits[1] : title).trim();
  }
}
