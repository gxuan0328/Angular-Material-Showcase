import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BigButtonComponent } from '../../../blocks/components/big-button/big-button.component';

/**
 * Demo wrapper for `big-button`.
 * The vendor component's template is an empty placeholder (the block ships
 * as an attribute directive applied to a `<button>` host). This wrapper
 * provides a Material button next to the empty component host so reviewers
 * see something meaningful in the preview.
 */
@Component({
  selector: 'app-big-button-demo',
  imports: [BigButtonComponent, MatButtonModule, MatIconModule],
  template: `
    <div class="p-6 flex flex-col gap-4">
      <p class="text-sm text-on-surface-variant">
        此 block 出廠時為空容器（作為 selector 載體），需搭配 Material Button 使用。
      </p>
      <div class="flex flex-wrap gap-3">
        <button mat-flat-button color="primary">開始使用</button>
        <button mat-stroked-button>Learn more</button>
        <button mat-fab extended color="primary">
          <mat-icon>rocket_launch</mat-icon>
          Launch
        </button>
      </div>
      <ngm-dev-block-ui-big-button />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BigButtonDemo {}
