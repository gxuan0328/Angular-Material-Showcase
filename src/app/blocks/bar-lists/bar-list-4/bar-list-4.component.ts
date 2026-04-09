/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bar-lists/bar-list-4`
*/

import { Component, inject, signal, computed } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider, MatListItem, MatNavList } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatProgressBar } from '@angular/material/progress-bar';

type OrderItem = { name: string; date: string };

@Component({
  selector: 'ngm-dev-block-bar-list-4',

  imports: [
    MatCard,
    MatCardContent,
    MatButton,
    MatProgressBar,
    MatNavList,
    MatListItem,
    MatDivider,
  ],
  templateUrl: './bar-list-4.component.html',
  styleUrls: ['./bar-list-4.component.scss'],
})
export class BarList4Component {
  private readonly dialog = inject(MatDialog);

  readonly title = 'Order overview';
  readonly progress = 78.2;

  readonly orders = signal<OrderItem[]>([
    { name: 'ID-2340', date: '31/08/2023 13:45' },
    { name: 'ID-2344', date: '30/08/2023 10:41' },
    { name: 'ID-1385', date: '29/08/2023 09:01' },
    { name: 'ID-1393', date: '29/08/2023 09:23' },
    { name: 'ID-1264', date: '28/08/2023 15:12' },
    { name: 'ID-434', date: '27/08/2023 14:27' },
    { name: 'ID-1234', date: '26/08/2023 11:34' },
    { name: 'ID-1235', date: '25/08/2023 18:50' },
    { name: 'ID-1236', date: '24/08/2023 16:22' },
    { name: 'ID-1237', date: '23/08/2023 12:15' },
  ]);

  openDialog(): void {
    this.dialog.open(BarList4DialogComponent, {
      width: '400px',
      data: {
        items: this.orders(),
      } satisfies BarList4DialogData,
    });
  }
}

type BarList4DialogData = { items: OrderItem[] };

@Component({
  selector: 'ngm-dev-block-bar-list-4-dialog',

  imports: [
    MatDialogContent,
    FormsModule,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatListItem,
    MatNavList,
    MatDivider,
  ],
  templateUrl: './bar-list-4.dialog.html',
})
export class BarList4DialogComponent {
  private readonly data = inject<BarList4DialogData>(MAT_DIALOG_DATA);
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
