/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update bar-lists/bar-list-6`
*/

import { Component, inject, LOCALE_ID, signal } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import {
  BarListComponent,
  BarListItem,
} from '../../components/bar-list/bar-list.component';
import { formatNumber } from '@angular/common';

type Item = BarListItem;

@Component({
  selector: 'ngm-dev-block-bar-list-6',
  imports: [
    MatCard,
    MatCardContent,
    MatTabGroup,
    BarListComponent,
    MatCardHeader,
    MatCardTitle,
    MatTab,
  ],
  templateUrl: './bar-list-6.component.html',
})
export class BarList6Component {
  private readonly _locale = inject(LOCALE_ID);
  readonly tabs = signal<
    {
      name: string;
      data: Item[];
    }[]
  >([
    {
      name: 'Country',
      data: [
        { name: 'United States of America', value: 2422 },
        { name: 'India', value: 1560 },
        { name: 'Germany', value: 680 },
        { name: 'Brazil', value: 580 },
        { name: 'United Kingdom', value: 510 },
      ],
    },
    {
      name: 'City',
      data: [
        { name: 'London', value: 1393 },
        { name: 'New York', value: 1219 },
        { name: 'Mumbai', value: 921 },
        { name: 'Berlin', value: 580 },
        { name: 'San Francisco', value: 492 },
      ],
    },
  ]);

  readonly valueFormatter = (v: number) => formatNumber(v, this._locale);
}
