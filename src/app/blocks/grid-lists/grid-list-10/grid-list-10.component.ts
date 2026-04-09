/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-10`
*/

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { reports } from './grid-list-10.model';

@Component({
  selector: 'ngm-dev-block-grid-list-10',
  templateUrl: './grid-list-10.component.html',
  imports: [MatCardModule, MatDividerModule],
})
export class GridList10Component {
  reports = reports;
}
