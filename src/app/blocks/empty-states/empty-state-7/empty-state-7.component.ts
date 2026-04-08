/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update empty-states/empty-state-7`
*/

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

interface DataItem {
  name: string;
  value: string;
}

@Component({
  selector: 'ngm-dev-block-empty-state-7',
  templateUrl: './empty-state-7.component.html',
  imports: [MatIconModule, MatCardModule, MatButtonModule],
})
export class EmptyState7Component {
  data: DataItem[] = [
    {
      name: 'Sales',
      value: '--',
    },
    {
      name: 'Profit',
      value: '--',
    },
  ];
}
