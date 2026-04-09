/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-14`
*/

import { Component, HostBinding } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { orderCategories, getStatusColor } from './grid-list-14.model';

@Component({
  selector: 'ngm-dev-block-grid-list-14',
  templateUrl: './grid-list-14.component.html',
  styleUrls: ['./grid-list-14.component.scss'],
  imports: [
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
})
export class GridList14Component {
  orderCategories = orderCategories;
  getStatusColor = getStatusColor;
  activeCategory = orderCategories[0];

  getProgressValue(actual: number, total: number): number {
    return (actual / total) * 100;
  }

  onSelectedIndexChange(index: number) {
    this.activeCategory = this.orderCategories[index];
  }

  @HostBinding('style.--active-indicator-color')
  get activeIndicatorColor() {
    return this.activeCategory.indicatorColor;
  }
}
