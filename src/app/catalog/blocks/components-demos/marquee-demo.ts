import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import {
  MarqueeComponent,
  MarqueeItemDirective,
} from '../../../blocks/components/marquee/marquee.component';

/**
 * Demo wrapper for the headless `marquee` vendor block.
 * MarqueeItemDirective requires `<ng-template>` host for its TemplateRef.
 */
@Component({
  selector: 'app-marquee-demo',
  imports: [MarqueeComponent, MarqueeItemDirective, MatIconModule],
  template: `
    <div class="p-6">
      <ngm-dev-block-ui-marquee [pauseOnHover]="true" [gap]="2">
        <ng-template ngmDevBlockUiMarqueeItem>
          <div
            class="flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-high px-4 py-2"
          >
            <mat-icon class="text-amber-500">star</mat-icon>
            <span>Angular Material Block Showcase</span>
          </div>
        </ng-template>
        <ng-template ngmDevBlockUiMarqueeItem>
          <div
            class="flex items-center gap-2 rounded-full border border-outline-variant bg-primary-container px-4 py-2"
          >
            <mat-icon>check_circle</mat-icon>
            <span>85 variants across 10 categories</span>
          </div>
        </ng-template>
        <ng-template ngmDevBlockUiMarqueeItem>
          <div
            class="flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container px-4 py-2"
          >
            <mat-icon class="text-emerald-500">bolt</mat-icon>
            <span>Zoneless Angular 20 + Material 3</span>
          </div>
        </ng-template>
        <ng-template ngmDevBlockUiMarqueeItem>
          <div
            class="flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-high px-4 py-2"
          >
            <mat-icon class="text-blue-500">palette</mat-icon>
            <span>Tailwind 4 + Material Symbols</span>
          </div>
        </ng-template>
      </ngm-dev-block-ui-marquee>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarqueeDemo {}
