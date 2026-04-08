/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update components/marquee`
*/

import {
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  Directive,
  inject,
  input,
  numberAttribute,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ngm-dev-block-ui-marquee',
  templateUrl: './marquee.component.html',
  imports: [NgTemplateOutlet],
})
export class MarqueeComponent {
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse = input(false, {
    transform: booleanAttribute,
  });

  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover = input(false, {
    transform: booleanAttribute,
  });

  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical = input(false, {
    transform: booleanAttribute,
  });

  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat = input(4, {
    transform: numberAttribute,
  });

  /**
   * Duration of the animation
   * @default 40s
   */
  duration = input(40, {
    transform: numberAttribute,
  });

  gap = input(1, {
    transform: numberAttribute,
  });

  /**
   * Generates an array of the specified length for repeating content
   */
  get repeatArray(): number[] {
    return Array(this.repeat())
      .fill(0)
      .map((_, i) => i);
  }

  /**
   * Returns classes for the container based on props
   */
  containerClasses = computed(() => {
    return `group flex overflow-hidden p-2 [gap:var(--gap)] ${
      this.vertical() ? 'flex-col' : 'flex-row'
    }`;
  });

  /**
   * Returns classes for each repeat item based on props
   */
  itemClasses = computed(() => {
    const baseClasses = 'flex shrink-0 justify-around [gap:var(--gap)]';
    const animationClasses = this.vertical()
      ? 'flex-col animate-marquee-vertical'
      : 'flex-row animate-marquee';
    const hoverClasses = this.pauseOnHover()
      ? 'group-hover:[animation-play-state:paused]'
      : '';
    const directionClasses = this.reverse()
      ? '[animation-direction:reverse]'
      : '';

    return `${baseClasses} ${animationClasses} ${hoverClasses} ${directionClasses}`;
  });

  marqueeItems = contentChildren(MarqueeItemDirective);
}

@Directive({
  selector: '[ngmDevBlockUiMarqueeItem]',
})
export class MarqueeItemDirective {
  templateRef = inject(TemplateRef);
}
