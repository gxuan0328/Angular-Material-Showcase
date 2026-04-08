/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update components/terminal`
*/

import { Component } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TerminalComponent,
  AnimatedSpanComponent,
  TypingAnimationComponent,
} from './terminal.component';

@Component({
  selector: 'ngm-dev-block-ui-terminal-demo',

  imports: [TerminalComponent, AnimatedSpanComponent, TypingAnimationComponent],
  template: `
    <div class="p-4">
      <h3 class="mb-4 text-title-large">Terminal Component Demo</h3>

      <ngm-dev-block-ui-terminal className="mb-8">
        <ngm-dev-block-ui-animated-span [delay]="100" className="font-mono">
          $ npm install &#64;angular/material
        </ngm-dev-block-ui-animated-span>

        <ngm-dev-block-ui-animated-span [delay]="500" className="text-primary">
          Installing packages...
        </ngm-dev-block-ui-animated-span>

        <ngm-dev-block-ui-typing-animation
          text="+ &#64;angular/material@17.2.0"
          [delay]="1000"
          [duration]="30"
        />

        <ngm-dev-block-ui-animated-span
          [delay]="2000"
          className="text-tertiary"
        >
          Installation complete! ✓
        </ngm-dev-block-ui-animated-span>
      </ngm-dev-block-ui-terminal>

      <!-- Another instance to verify proper rendering -->
      <p class="my-4">Simple Terminal:</p>
      <ngm-dev-block-ui-terminal>
        <div class="font-mono">$ echo "Hello World"</div>
        <div>Hello World</div>
      </ngm-dev-block-ui-terminal>
    </div>
  `,
})
export class TerminalDemoComponent {}
