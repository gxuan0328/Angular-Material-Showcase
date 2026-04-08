/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update page-headings/page-heading-10`
*/

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DeviceService } from '../../utils/services/device.service';
import {
  BreadcrumbItemDirective,
  BreadcrumbsComponent,
} from '../../components/breadcrumbs/breadcrumbs.component';

type MetaItem = {
  icon: string;
  text: string;
};

type ActionButton = {
  label: string;
  icon: string;
  variant: 'outlined' | 'filled';
  action: () => void;
};

@Component({
  selector: 'ngm-dev-block-page-heading-10',
  templateUrl: './page-heading-10.component.html',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    BreadcrumbsComponent,
    BreadcrumbItemDirective,
  ],
})
export class PageHeading10Component {
  private readonly deviceService = inject(DeviceService);

  readonly isHandset$ = this.deviceService.isHandset$;

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

  readonly metaItems: MetaItem[] = [
    { icon: 'work', text: 'Full-time' },
    { icon: 'location_on', text: 'Remote' },
    { icon: 'attach_money', text: '$120k – $140k' },
    { icon: 'event', text: 'Closing on January 9, 2020' },
  ];

  readonly actionButtons: ActionButton[] = [
    {
      label: 'Edit',
      icon: 'edit',
      variant: 'outlined',
      action: () => this.onEdit(),
    },
    {
      label: 'View',
      icon: 'visibility',
      variant: 'outlined',
      action: () => this.onView(),
    },
    {
      label: 'Publish',
      icon: 'check',
      variant: 'filled',
      action: () => this.onPublish(),
    },
  ];

  onEdit(): void {
    console.log('Edit clicked');
  }

  onView(): void {
    console.log('View clicked');
  }

  onPublish(): void {
    console.log('Publish clicked');
  }

  onMenuAction(action: string): void {
    switch (action) {
      case 'edit':
        this.onEdit();
        break;
      case 'view':
        this.onView();
        break;
    }
  }
}
