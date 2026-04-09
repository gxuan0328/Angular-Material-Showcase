/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-15`
*/

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { data, capacityIcons } from './grid-list-15.model';

@Component({
  selector: 'ngm-dev-block-grid-list-15',
  templateUrl: './grid-list-15.component.html',
  styleUrls: ['./grid-list-15.component.scss'],
  imports: [
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatChipsModule,
    FormsModule,
  ],
})
export class GridList15Component {
  data = data;
  capacityIcons = capacityIcons;
  showActiveSpaces = false;
  searchTerm = '';

  getIconForCapacity(label: string): string {
    return this.capacityIcons[label] || 'info';
  }
}
