import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProgressCircleComponent } from '../../../blocks/components/progress-circle/progress-circle.component';

/**
 * Demo wrapper for `progress-circle`. The vendor component uses
 * `<ng-content>` to project a centered label (usually the percentage),
 * so we embed it with a sample label here.
 */
@Component({
  selector: 'app-progress-circle-demo',
  imports: [ProgressCircleComponent],
  template: `
    <div class="p-6 flex items-center justify-center gap-8">
      <ngm-dev-block-ui-progress-circle
        [value]="32"
        [max]="100"
        [radius]="48"
        [strokeWidth]="8"
        variant="default"
      >
        <div class="text-center">
          <div class="text-2xl font-semibold">32%</div>
          <div class="text-xs text-on-surface-variant">Storage</div>
        </div>
      </ngm-dev-block-ui-progress-circle>

      <ngm-dev-block-ui-progress-circle
        [value]="68"
        [max]="100"
        [radius]="48"
        [strokeWidth]="8"
        variant="success"
      >
        <div class="text-center">
          <div class="text-2xl font-semibold">68%</div>
          <div class="text-xs text-on-surface-variant">Complete</div>
        </div>
      </ngm-dev-block-ui-progress-circle>

      <ngm-dev-block-ui-progress-circle
        [value]="92"
        [max]="100"
        [radius]="48"
        [strokeWidth]="8"
        variant="warning"
      >
        <div class="text-center">
          <div class="text-2xl font-semibold">92%</div>
          <div class="text-xs text-on-surface-variant">CPU</div>
        </div>
      </ngm-dev-block-ui-progress-circle>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressCircleDemo {}
