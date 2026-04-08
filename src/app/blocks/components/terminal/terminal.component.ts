/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update components/terminal`
*/

import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  input,
  numberAttribute,
  inject,
  afterNextRender,
  viewChild,
  ElementRef,
  Directive,
} from '@angular/core';

@Component({
  selector: 'ngm-dev-block-ui-terminal',
  templateUrl: './terminal.component.html',
})
export class TerminalComponent {
  className = input('');
  preClassName = input('');

  preElement = viewChild<ElementRef<HTMLPreElement>>('pre');
}

@Component({
  selector: 'ngm-dev-block-ui-animated-span',

  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="
        'grid text-sm font-normal tracking-tight animate-fadeIn ' + className()
      "
      [style.--animation-delay.ms]="delay()"
    >
      <ng-content />
    </div>
  `,
})
export class AnimatedSpanComponent {
  readonly delay = input(0, { transform: numberAttribute });
  readonly className = input('');
}

@Component({
  selector: 'ngm-dev-block-ui-typing-animation',

  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="'animate-fadeIn ' + className()"
      [style.--animation-delay.ms]="delay()"
    >
      {{ displayedText }}
      <ng-content select="[ngm-dev-block-ui-typing-cursor]" />
    </span>
  `,
})
export class TypingAnimationComponent {
  text = input.required<string>();
  className = input('');
  duration = input(60, { transform: numberAttribute });
  delay = input(0, { transform: numberAttribute });

  displayedText = '';
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.displayedText = '';

    afterNextRender(() => {
      setTimeout(() => {
        this.startTyping();
      }, this.delay());
    });
  }

  startTyping() {
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < this.text().length) {
        this.displayedText = this.text().substring(0, i + 1);
        this.cdr.markForCheck();
        i++;
      } else {
        clearInterval(intervalId);
        this.cdr.markForCheck();
      }
    }, this.duration());
  }
}
