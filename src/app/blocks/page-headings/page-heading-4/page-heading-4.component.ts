/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update page-headings/page-heading-4`
*/

import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  BreadcrumbItemDirective,
  BreadcrumbsComponent,
} from '../../components/breadcrumbs/breadcrumbs.component';
import { RouterLink } from '@angular/router';

type ActionButton = {
  label: string;
  variant: 'outlined' | 'filled';
  action: () => void;
};

@Component({
  selector: 'ngm-dev-block-page-heading-4',
  templateUrl: './page-heading-4.component.html',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    BreadcrumbsComponent,
    BreadcrumbItemDirective,
    RouterLink,
  ],
})
export class PageHeading4Component {
  readonly jobTitle = 'Back End Developer';

  readonly breadcrumbs = [
    {
      label: 'Jobs',
      link: '#',
    },
    {
      label: 'Engineering',
      link: '#',
    },
    {
      label: 'Back End Developer',
      link: '#',
    },
  ];

  readonly actionButtons: ActionButton[] = [
    {
      label: 'Edit',
      variant: 'outlined',
      action: () => this.onEdit(),
    },
    {
      label: 'Publish',
      variant: 'filled',
      action: () => this.onPublish(),
    },
  ];

  onEdit(): void {
    console.log('Edit clicked');
  }

  onPublish(): void {
    console.log('Publish clicked');
  }
}
