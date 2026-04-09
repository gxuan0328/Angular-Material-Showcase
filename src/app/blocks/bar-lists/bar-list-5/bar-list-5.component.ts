/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bar-lists/bar-list-5`
*/

import { Component, inject, signal, computed } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider, MatListItem, MatNavList } from '@angular/material/list';
import { FormsModule } from '@angular/forms';

type OrderItem = { name: string; date: string };

@Component({
  selector: 'ngm-dev-block-bar-list-5',
  imports: [
    MatCard,
    MatCardContent,
    MatButton,
    MatProgressBar,
    MatNavList,
    MatListItem,
    MatDivider,
  ],
  templateUrl: './bar-list-5.component.html',
  styleUrls: ['./bar-list-5.component.scss'],
})
export class BarList5Component {
  private readonly dialog = inject(MatDialog);

  readonly title = 'Order overview';
  readonly progress = 78.2;

  readonly orders = signal<OrderItem[]>([
    { name: 'ID-2340', date: '31/08/2023 13:45' },
    { name: 'ID-2344', date: '30/08/2023 10:41' },
    { name: 'ID-1385', date: '29/08/2023 09:01' },
    { name: 'ID-1393', date: '29/08/2023 09:23' },
    { name: 'ID-1264', date: '28/08/2023 15:12' },
  ]);

  openDialog(): void {
    this.dialog.open(BarList5DialogComponent, {
      width: '400px',
      data: {
        items: this.orders(),
      } satisfies BarList5DialogData,
    });
  }
}

type BarList5DialogData = { items: OrderItem[] };

@Component({
  selector: 'ngm-dev-block-bar-list-5-dialog',

  imports: [
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatListItem,
    MatNavList,
    MatDivider,
  ],
  templateUrl: './bar-list-5.dialog.html',
})
export class BarList5DialogComponent {
  private readonly data = inject<BarList5DialogData>(MAT_DIALOG_DATA);
  readonly items = signal<OrderItem[]>(this.data.items);

  readonly search = signal<string>('');
  readonly filteredItems = computed(() => {
    const term = this.search().toLowerCase();
    if (!term) return this.items();
    return this.items().filter((i: OrderItem) =>
      i.name.toLowerCase().includes(term),
    );
  });
}
