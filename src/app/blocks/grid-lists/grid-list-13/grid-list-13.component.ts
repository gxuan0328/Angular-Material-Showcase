/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-13`
*/

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { orderCategories, getStatusColor } from './grid-list-13.model';

@Component({
  selector: 'ngm-dev-block-grid-list-13',
  templateUrl: './grid-list-13.component.html',
  styleUrls: ['./grid-list-13.component.scss'],
  imports: [
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
})
export class GridList13Component {
  orderCategories = orderCategories;
  getStatusColor = getStatusColor;

  getProgressValue(actual: number, total: number): number {
    return (actual / total) * 100;
  }
}
