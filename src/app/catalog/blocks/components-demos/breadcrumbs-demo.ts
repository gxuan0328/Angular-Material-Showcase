import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import {
  BreadcrumbItemDirective,
  BreadcrumbSeparatorDirective,
  BreadcrumbsComponent,
} from '../../../blocks/components/breadcrumbs/breadcrumbs.component';

/**
 * Demo wrapper for the headless `breadcrumbs` vendor block.
 * The vendor component uses `contentChildren` projection so it cannot be
 * rendered directly via `ngComponentOutlet` — this wrapper provides sample
 * breadcrumb items so the Live Preview shows something meaningful.
 */
@Component({
  selector: 'app-breadcrumbs-demo',
  imports: [
    BreadcrumbsComponent,
    BreadcrumbItemDirective,
    BreadcrumbSeparatorDirective,
    MatIconModule,
  ],
  template: `
    <div class="p-6">
      <ngm-dev-block-ui-breadcrumbs aria-label="demo breadcrumbs">
        <ng-template ngmDevBlockUiBreadcrumbItem>
          <a href="#" class="text-primary hover:underline">Projects</a>
        </ng-template>
        <ng-template ngmDevBlockUiBreadcrumbItem>
          <a href="#" class="text-primary hover:underline">Glacier Analytics</a>
        </ng-template>
        <ng-template ngmDevBlockUiBreadcrumbItem>
          <span class="text-on-surface-variant">Dashboard</span>
        </ng-template>
        <ng-template ngmDevBlockUiBreadcrumbSeparator>
          <mat-icon class="align-middle text-outline">chevron_right</mat-icon>
        </ng-template>
      </ngm-dev-block-ui-breadcrumbs>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsDemo {}
