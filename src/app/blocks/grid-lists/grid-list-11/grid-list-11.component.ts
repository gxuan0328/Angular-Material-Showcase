/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-11`
*/

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { reports } from './grid-list-11.model';

@Component({
  selector: 'ngm-dev-block-grid-list-11',
  templateUrl: './grid-list-11.component.html',
  imports: [MatCardModule, MatDividerModule, MatIconModule],
})
export class GridList11Component {
  reports = reports;
}
