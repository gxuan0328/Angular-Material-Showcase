/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-12`
*/

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { reports } from './grid-list-12.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ngm-dev-block-grid-list-12',
  templateUrl: './grid-list-12.component.html',
  imports: [MatCardModule, MatDividerModule, MatButtonModule],
})
export class GridList12Component {
  reports = reports;
}
