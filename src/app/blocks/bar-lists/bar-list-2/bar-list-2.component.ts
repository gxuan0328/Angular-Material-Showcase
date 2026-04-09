/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bar-lists/bar-list-2`
*/

import { Component, computed, inject, LOCALE_ID, signal } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  BarListComponent,
  BarListItem,
} from '../../components/bar-list/bar-list.component';
import { FormsModule } from '@angular/forms';
import { formatNumber } from '@angular/common';
import { MatDialogTitle, MatDialogContent } from '@angular/material/dialog';

type PageItem = BarListItem;

@Component({
  selector: 'ngm-dev-block-bar-list-2',

  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatButton,
    BarListComponent,
    MatCardTitle,
  ],
  templateUrl: './bar-list-2.component.html',
})
export class BarList2Component {
  private readonly dialog = inject(MatDialog);
  private readonly _locale = inject(LOCALE_ID);
  readonly title = 'Top pages';
  readonly subtitle = 'Visitors';

  readonly pages = signal<PageItem[]>([
    { name: '/home', value: 2135 },
    { name: '/blocks', value: 1127 },
    { name: '/components', value: 1014 },
    { name: '/docs/getting-started/installation', value: 987 },
    { name: '/docs/components/button', value: 804 },
    { name: '/docs/components/table', value: 768 },
    { name: '/docs/components/area-chart', value: 755 },
    { name: '/docs/components/badge', value: 752 },
    { name: '/docs/components/bar-chart', value: 742 },
    { name: '/docs/components/tabs', value: 726 },
    { name: '/docs/components/tracker', value: 723 },
    { name: '/docs/components/icons', value: 679 },
    { name: '/docs/components/list', value: 651 },
    { name: '/journal', value: 709 },
    { name: '/spotlight', value: 654 },
    { name: '/resources', value: 603 },
    { name: '/imprint', value: 352 },
    { name: '/about', value: 309 },
  ]);

  readonly valueFormatter = (v: number) => formatNumber(v, this._locale);

  openDialog(): void {
    this.dialog.open(BarList2DialogComponent, {
      width: '400px',
      panelClass: 'dialog-outlined',
      data: {
        items: this.pages(),
        valueFormatter: this.valueFormatter,
      } satisfies BarList2DialogData,
    });
  }
}

type BarList2DialogData = {
  items: PageItem[];
  valueFormatter: (v: number) => string;
};

@Component({
  selector: 'ngm-dev-block-bar-list-2-dialog',

  imports: [
    MatFormField,
    MatInput,
    BarListComponent,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './bar-list-2.dialog.html',
})
export class BarList2DialogComponent {
  // data passed in via MatDialog
  private readonly data = inject<BarList2DialogData>(MAT_DIALOG_DATA);
  readonly items = signal<PageItem[]>(this.data.items);
  readonly valueFormatter = signal<(v: number) => string>(
    this.data.valueFormatter,
  );

  // Local search control state
  readonly search = signal<string>('');

  // Filter items by search
  readonly filteredItems = computed(() => {
    const term = this.search().toLowerCase();
    if (!term) return this.items();
    return this.items().filter((i: PageItem) =>
      i.name.toLowerCase().includes(term),
    );
  });
}
