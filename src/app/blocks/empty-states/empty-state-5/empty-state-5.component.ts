/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update empty-states/empty-state-5`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

type BudgetItem = {
  name: string;
  progress: number;
  budget: string;
  current: string;
  href: string;
};

@Component({
  selector: 'ngm-dev-block-empty-state-5',
  templateUrl: './empty-state-5.component.html',
  styleUrls: ['./empty-state-5.component.scss'],
  imports: [
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class EmptyState5Component {
  data: BudgetItem[] = [
    {
      name: 'Storage',
      progress: 0,
      budget: '$0',
      current: '$0',
      href: '#',
    },
    {
      name: 'API requests',
      progress: 0,
      budget: '$0',
      current: '$0',
      href: '#',
    },
    {
      name: 'Web analytics',
      progress: 0,
      budget: '$0',
      current: '$0',
      href: '#',
    },
  ];
}
