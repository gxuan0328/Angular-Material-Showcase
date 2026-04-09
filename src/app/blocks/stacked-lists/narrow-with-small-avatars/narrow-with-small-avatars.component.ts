/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update stacked-lists/narrow-with-small-avatars`
*/

import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { NarrowWithSmallAvatarsService } from './narrow-with-small-avatars.service';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'ngm-dev-block-narrow-with-small-avatars',
  templateUrl: './narrow-with-small-avatars.component.html',
  styleUrls: ['./narrow-with-small-avatars.component.scss'],
  imports: [
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    AsyncPipe,
    DatePipe,
  ],
  providers: [NarrowWithSmallAvatarsService],
})
export class NarrowWithSmallAvatarsComponent {
  private _narrowWithSmallAvatarsService = inject(
    NarrowWithSmallAvatarsService,
  );
  issues = this._narrowWithSmallAvatarsService.getIssues();
}
