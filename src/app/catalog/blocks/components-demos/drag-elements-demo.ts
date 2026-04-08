import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import {
  DragElementDirective,
  DragElementsComponent,
} from '../../../blocks/components/drag-elements/drag-elements.component';

/**
 * Demo wrapper for the headless `drag-elements` vendor block.
 * The directive requires `<ng-template>` host so it can inject `TemplateRef`.
 */
@Component({
  selector: 'app-drag-elements-demo',
  imports: [DragElementsComponent, DragElementDirective, MatIconModule],
  template: `
    <div class="p-6 h-[240px] relative">
      <ngm-dev-block-uidrag-elements>
        <ng-template ngmDevBlockUiDragElement>
          <div
            class="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container px-4 py-2 shadow-sm cursor-grab"
          >
            <mat-icon class="text-outline">drag_indicator</mat-icon>
            Drag me
          </div>
        </ng-template>
        <ng-template ngmDevBlockUiDragElement>
          <div
            class="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-high px-4 py-2 shadow-sm cursor-grab"
          >
            <mat-icon class="text-outline">apps</mat-icon>
            Widget A
          </div>
        </ng-template>
        <ng-template ngmDevBlockUiDragElement>
          <div
            class="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary-container px-4 py-2 shadow-sm cursor-grab text-on-primary-container"
          >
            <mat-icon>star</mat-icon>
            Highlighted
          </div>
        </ng-template>
      </ngm-dev-block-uidrag-elements>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragElementsDemo {}
