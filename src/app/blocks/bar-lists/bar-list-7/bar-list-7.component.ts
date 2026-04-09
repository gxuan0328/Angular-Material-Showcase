/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bar-lists/bar-list-7`
*/

import { Component, signal, computed } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import {
  BarListComponent,
  BarListItem,
} from '../../components/bar-list/bar-list.component';
import { MatChip, MatChipRemove, MatChipSet } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';

type Item = BarListItem;

@Component({
  selector: 'ngm-dev-block-bar-list-7',

  imports: [
    MatCard,
    MatCardContent,
    BarListComponent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatChipSet,
    MatChip,
    MatChipRemove,
    MatIcon,
  ],
  templateUrl: './bar-list-7.component.html',
})
export class BarList7Component {
  readonly label = 'Visitors';

  readonly country = signal<Item[]>([
    { name: 'United States of America', value: 5422 },
    { name: 'India', value: 3560 },
    { name: 'Germany', value: 680 },
    { name: 'Brazil', value: 580 },
    { name: 'United Kingdom', value: 510 },
  ]);

  readonly initialSum = this.country().reduce(
    (sum: number, d: Item) => sum + (d.value || 0),
    0,
  );

  readonly values = signal<{ start: number; end: number }>({
    start: this.initialSum,
    end: this.initialSum,
  });

  readonly selectedItem = signal<string | undefined>(undefined);

  readonly valueFormatter = (v: number) =>
    new Intl.NumberFormat('en-US').format(v);

  readonly filteredData = computed(() => {
    const selected = this.selectedItem();
    const items = this.country();
    if (!selected) return items;
    return items.filter((i: Item) => i.name === selected);
  });

  handleBarClick(item: Item): void {
    this.selectedItem.set(item.name);
    this.values.set({ start: this.initialSum, end: item.value });
  }

  clearSelectedItem(): void {
    const end = this.values().end;
    this.selectedItem.set(undefined);
    this.values.set({ start: end, end: this.initialSum });
  }
}
