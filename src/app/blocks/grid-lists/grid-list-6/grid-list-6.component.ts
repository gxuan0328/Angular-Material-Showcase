/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update grid-lists/grid-list-6`
*/

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipSet, MatChip, MatChipAvatar } from '@angular/material/chips';
import { pipelines } from './grid-list-6.model';
import { cx } from '../../utils/functions/cx';

@Component({
  selector: 'ngm-dev-block-grid-list-6',
  templateUrl: './grid-list-6.component.html',
  styleUrls: ['./grid-list-6.component.scss'],
  imports: [MatCardModule, MatIconModule, MatChipSet, MatChip, MatChipAvatar],
})
export class GridList6Component {
  pipelines = pipelines;
  readonly cx = cx;

  // Base chip class that's common to all chips
  baseChipClass = 'h-6! text-xs';

  // Status-specific classes
  liveStatusClass =
    'bg-emerald-100! text-emerald-800 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-400/20! dark:text-emerald-500 dark:ring-emerald-400/20';
  inactiveStatusClass =
    'bg-gray-100! text-gray-600 ring-1 ring-inset ring-gray-600/10 dark:bg-gray-500/20! dark:text-gray-500 dark:ring-gray-500/20';

  // Type-specific classes
  apiTypeClass =
    'bg-pink-100! text-pink-800 ring-1 ring-inset ring-pink-600/10 dark:bg-pink-500/10! dark:text-pink-500 dark:ring-pink-500/20';
  materializedTypeClass =
    'bg-sky-100! text-sky-800 ring-1 ring-inset ring-sky-600/10 dark:bg-sky-500/10! dark:text-sky-500 dark:ring-sky-500/20';

  getStatusClasses(status: string): string {
    const statusClass =
      status === 'live' ? this.liveStatusClass : this.inactiveStatusClass;
    return this.cx(this.baseChipClass, statusClass);
  }

  getTypeClasses(type: string): string {
    const typeClass =
      type === 'API' ? this.apiTypeClass : this.materializedTypeClass;
    return this.cx(this.baseChipClass, typeClass);
  }
}
