/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update components/terminal`
*/

import { Component } from '@angular/core';

import {
  TerminalComponent,
  AnimatedSpanComponent,
  TypingAnimationComponent,
} from './terminal.component';

@Component({
  selector: 'ngm-dev-block-ui-terminal-test',

  imports: [TerminalComponent, AnimatedSpanComponent, TypingAnimationComponent],
  template: `
    <div class="p-6">
      <h2 class="mb-6 text-xl font-bold">Terminal Component Test</h2>

      <div class="mb-8">
        <ngm-dev-block-ui-terminal className="shadow-md">
          <div class="font-mono">$ echo "Basic Terminal Test"</div>
          <div>Basic Terminal Test</div>
        </ngm-dev-block-ui-terminal>
      </div>

      <div class="mb-8">
        <p class="mb-2">With Animations:</p>
        <ngm-dev-block-ui-terminal className="border-primary">
          <ngm-dev-block-ui-animated-span [delay]="100" className="font-mono">
            $ echo "Hello World"
          </ngm-dev-block-ui-animated-span>

          <ngm-dev-block-ui-typing-animation
            text="Hello World"
            [delay]="500"
            [duration]="100"
            className="text-primary"
          />
        </ngm-dev-block-ui-terminal>
      </div>
    </div>
  `,
})
export class TerminalTestComponent {}
