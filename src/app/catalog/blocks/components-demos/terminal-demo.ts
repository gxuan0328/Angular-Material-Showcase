import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TerminalComponent } from '../../../blocks/components/terminal/terminal.component';

/**
 * Demo wrapper for the `terminal` vendor block.
 * The vendor component uses `<ng-content>` for the body; this wrapper
 * projects a short shell transcript so the Live Preview shows real output.
 */
@Component({
  selector: 'app-terminal-demo',
  imports: [TerminalComponent],
  template: `
    <div class="p-6">
      <ngm-dev-block-ui-terminal>
        <span class="text-emerald-500">$ npm install @ngm-dev/cli</span>
        <span class="text-on-surface-variant">added 512 packages in 23s</span>
        <span class="text-emerald-500">$ npx @ngm-dev/cli init --angular-version 20</span>
        <span class="text-on-surface-variant"
          >Wrote Tailwind postcss config to .postcssrc.json</span
        >
        <span class="text-on-surface-variant">Wrote config to ngm-dev-cli.json</span>
        <span class="text-emerald-500">$ npx @ngm-dev/cli add page-shells/page-shell-1</span>
        <span class="text-on-surface">Added blocks page-shells/page-shell-1</span>
        <span class="text-emerald-500">$ _</span>
      </ngm-dev-block-ui-terminal>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerminalDemo {}
