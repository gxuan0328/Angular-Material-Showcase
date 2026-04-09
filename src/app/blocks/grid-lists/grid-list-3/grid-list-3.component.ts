/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-3`
*/

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { members } from './grid-list-3.model';
import { cx } from '../../utils/functions/cx';

@Component({
  selector: 'ngm-dev-block-grid-list-3',
  templateUrl: './grid-list-3.component.html',
  imports: [
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatButtonToggleModule,
    MatButtonModule,
  ],
})
export class GridList3Component {
  members = members;
  readonly cx = cx;
  displayedColumns: string[] = [
    'name',
    'email',
    'role',
    'lastActive',
    'actions',
  ];
  viewMode = 'grid';
}
