/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bar-lists/bar-list-1`
*/

import { Component, computed, inject, LOCALE_ID, signal } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {
  BarListComponent,
  BarListItem,
} from '../../components/bar-list/bar-list.component';
import { MatButton } from '@angular/material/button';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'ngm-dev-block-bar-list-1',

  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    BarListComponent,
    MatButton,
  ],
  templateUrl: './bar-list-1.component.html',
})
export class BarList1Component {
  readonly title = 'Top screens';
  readonly subtitle = 'Active users';
  private readonly _locale = inject(LOCALE_ID);
  readonly formatNumber = (v: number) => formatNumber(v, this._locale);

  readonly pages = signal<BarListItem[]>([
    { name: '/dashboard', value: 2150 },
    { name: '/analytics', value: 1285 },
    { name: '/customers', value: 1122 },
    { name: '/settings/profile', value: 990 },
    { name: '/settings/billing', value: 874 },
    { name: '/reports/monthly', value: 842 },
    { name: '/reports/weekly', value: 834 },
    { name: '/integrations/slack', value: 799 },
    { name: '/integrations/github', value: 788 },
    { name: '/help/getting-started', value: 760 },
    { name: '/help/faq', value: 742 },
  ]);

  readonly collapsed = signal(true);
  readonly listContainerClass = computed(() =>
    this.collapsed() ? 'max-h-[260px]' : '',
  );
  readonly ctaLabel = computed(() =>
    this.collapsed() ? 'Show more' : 'Show less',
  );
}
