/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update empty-states/empty-state-4`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface CapacityItem {
  name: string;
  capacity: string;
  value: number;
}

@Component({
  selector: 'ngm-dev-block-empty-state-4',
  templateUrl: './empty-state-4.component.html',
  styleUrls: ['./empty-state-4.component.scss'],
  imports: [MatIconModule, MatCardModule, MatProgressSpinnerModule],
})
export class EmptyState4Component {
  data: CapacityItem[] = [
    {
      name: 'Storage used',
      capacity: '0/10GB',
      value: 0,
    },
    {
      name: 'Members',
      capacity: '0/50',
      value: 0,
    },
    {
      name: 'API requests',
      capacity: '0/100K',
      value: 0,
    },
  ];
}
