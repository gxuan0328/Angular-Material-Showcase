/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update empty-states/empty-state-6`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
interface Category {
  name: string;
  value: string;
}

interface Tab {
  name: string;
  categories: Category[];
}

@Component({
  selector: 'ngm-dev-block-empty-state-6',
  templateUrl: './empty-state-6.component.html',
  imports: [MatIconModule, MatCardModule, MatTabsModule, MatButtonToggleModule],
})
export class EmptyState6Component {
  tabs: Tab[] = [
    {
      name: 'Ratio',
      categories: [
        {
          name: 'Successful requests',
          value: '--',
        },
        {
          name: 'Errors',
          value: '--',
        },
      ],
    },
    {
      name: 'Projects',
      categories: [
        {
          name: 'Online shop',
          value: '--',
        },
        {
          name: 'Blog',
          value: '--',
        },
        {
          name: 'Test project',
          value: '--',
        },
      ],
    },
  ];
}
