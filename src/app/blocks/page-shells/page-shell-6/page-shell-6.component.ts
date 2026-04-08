/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update page-shells/page-shell-6`
*/

import { Component, Input, signal } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';

type ReportItem = {
  id: number;
  name: string;
  description: string;
  href: string;
};

type SortOption = {
  value: string;
  viewValue: string;
};

@Component({
  selector: 'ngm-dev-block-page-shell-6',
  templateUrl: './page-shell-6.component.html',
  imports: [
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    FormsModule,
  ],
})
export class PageShell6Component {
  selectedSort = signal<string>('');

  sortOptions: SortOption[] = [
    { value: '1', viewValue: 'Name' },
    { value: '2', viewValue: 'Last edited' },
    { value: '3', viewValue: 'Size' },
  ];

  reportData: ReportItem[] = [
    {
      id: 1,
      name: 'Report name',
      description: 'Description',
      href: '#',
    },
    {
      id: 2,
      name: 'Report name',
      description: 'Description',
      href: '#',
    },
    {
      id: 3,
      name: 'Report name',
      description: 'Description',
      href: '#',
    },
    {
      id: 4,
      name: 'Report name',
      description: 'Description',
      href: '#',
    },
    {
      id: 5,
      name: 'Report name',
      description: 'Description',
      href: '#',
    },
    {
      id: 6,
      name: 'Report name',
      description: 'Description',
      href: '#',
    },
  ];
}
