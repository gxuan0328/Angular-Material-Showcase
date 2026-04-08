/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update components/animated-copy-button`
*/

import {
  Component,
  input,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from '@angular/cdk/clipboard';
@Component({
  selector: 'ngm-dev-block-ui-animated-copy-button',
  templateUrl: './animated-copy-button.component.html',
  imports: [MatButtonModule, ClipboardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedCopyButtonComponent {
  contentToCopy = input.required<string>();
  iconClass = input<string>('');
  iconContainerClass = input<string>('');
  isCopied = signal(false);
  onCopyToClipboardCopied(isCopied: boolean) {
    this.isCopied.set(isCopied);

    if (isCopied) {
      setTimeout(() => {
        this.isCopied.set(false);
      }, 3000);
    }
  }
}
