/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-2`
*/

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { members } from './grid-list-2.model';
import { cx } from '../../utils/functions/cx';

@Component({
  selector: 'ngm-dev-block-grid-list-2',
  templateUrl: './grid-list-2.component.html',
  imports: [MatCardModule, MatIconModule, MatDividerModule],
})
export class GridList2Component {
  members = members;
  readonly cx = cx;
}
