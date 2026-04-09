/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-9`
*/

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { workspaces } from './grid-list-9.model';

@Component({
  selector: 'ngm-dev-block-grid-list-9',
  templateUrl: './grid-list-9.component.html',
  styleUrls: ['./grid-list-9.component.scss'],
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
  ],
})
export class GridList9Component {
  workspaces = workspaces;
  viewMode = 'grid';

  displayedColumns: string[] = [
    'name',
    'storage',
    'users',
    'requests',
    'status',
    'actions',
  ];
}
