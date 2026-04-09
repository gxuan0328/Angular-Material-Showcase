/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bar-lists/bar-list-3`
*/

import { Component, inject, signal, computed, LOCALE_ID } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardSubtitle,
  MatCardTitle,
  MatCardHeader,
} from '@angular/material/card';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import {
  BarListComponent,
  BarListItem,
} from '../../components/bar-list/bar-list.component';
import { FormsModule } from '@angular/forms';
import { formatNumber } from '@angular/common';

type PageItem = BarListItem;

@Component({
  selector: 'ngm-dev-block-bar-list-3',

  imports: [
    MatCard,
    MatCardContent,
    MatButton,
    BarListComponent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
  ],
  templateUrl: './bar-list-3.component.html',
})
export class BarList3Component {
  private readonly dialog = inject(MatDialog);

  readonly metricLabel = 'Website visitors';
  readonly metricValue = '113,061';

  readonly pages = signal<PageItem[]>([
    { name: '/home', value: 2019 },
    { name: '/blocks', value: 1053 },
    { name: '/components', value: 997 },
    { name: '/docs/getting-started/installation', value: 982 },
    { name: '/docs/components/button', value: 782 },
    { name: '/docs/components/table', value: 752 },
    { name: '/docs/components/area-chart', value: 741 },
    { name: '/docs/components/badge', value: 750 },
    { name: '/docs/components/bar-chart', value: 750 },
    { name: '/docs/components/tabs', value: 720 },
  ]);

  private readonly _locale = inject(LOCALE_ID);
  readonly valueFormatter = (v: number) => formatNumber(v, this._locale);

  openDialog(): void {
    this.dialog.open(BarList3DialogComponent, {
      width: '400px',
      data: {
        items: this.pages(),
        valueFormatter: this.valueFormatter,
      } satisfies BarList3DialogData,
    });
  }
}

type BarList3DialogData = {
  items: PageItem[];
  valueFormatter: (v: number) => string;
};

@Component({
  selector: 'ngm-dev-block-bar-list-3-dialog',

  imports: [
    MatDialogContent,
    MatDialogModule,
    MatFormField,
    MatInput,
    BarListComponent,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './bar-list-3.dialog.html',
})
export class BarList3DialogComponent {
  private readonly data = inject<BarList3DialogData>(MAT_DIALOG_DATA);
  readonly items = signal<PageItem[]>(this.data.items);
  readonly valueFormatter = signal<(v: number) => string>(
    this.data.valueFormatter,
  );

  readonly search = signal<string>('');
  readonly filteredItems = computed(() => {
    const term = this.search().toLowerCase();
    if (!term) return this.items();
    return this.items().filter((i: PageItem) =>
      i.name.toLowerCase().includes(term),
    );
  });
}
