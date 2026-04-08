/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update components/progress-circle`
*/

import { Component, computed, input } from '@angular/core';
import { cx } from '../../utils/functions/cx';

type ProgressCircleVariant =
  | 'default'
  | 'neutral'
  | 'warning'
  | 'error'
  | 'success'
  | 'primary';

type ProgressCircleVariants = {
  background: string;
  circle: string;
};

@Component({
  selector: 'ngm-dev-block-ui-progress-circle',
  templateUrl: './progress-circle.component.html',
  imports: [],
})
export class ProgressCircleComponent {
  value = input<number>(0);
  max = input<number>(100);
  radius = input<number>(32);
  strokeWidth = input<number>(6);
  showAnimation = input<boolean>(true);
  variant = input<ProgressCircleVariant>('default');
  className = input<string>('');

  private readonly progressCircleVariants: Record<
    ProgressCircleVariant,
    ProgressCircleVariants
  > = {
    default: {
      background:
        'stroke-[color-mix(in_srgb,_var(--mat-sys-primary)_20%,_transparent)]',
      circle: 'stroke-primary',
    },
    neutral: {
      background: 'stroke-gray-200 dark:stroke-gray-500/40',
      circle: 'stroke-gray-500 dark:stroke-gray-500',
    },
    warning: {
      background: 'stroke-yellow-200 dark:stroke-yellow-500/30',
      circle: 'stroke-yellow-500 dark:stroke-yellow-500',
    },
    error: {
      background: 'stroke-red-200 dark:stroke-red-500/30',
      circle: 'stroke-red-500 dark:stroke-red-500',
    },
    success: {
      background: 'stroke-emerald-200 dark:stroke-emerald-500/30',
      circle: 'stroke-emerald-500 dark:stroke-emerald-500',
    },
    primary: {
      background: 'stroke-blue-200 dark:stroke-blue-500/30',
      circle: 'stroke-blue-500 dark:stroke-blue-500',
    },
  };

  protected readonly safeValue = computed(() => {
    const val = this.value();
    const maxVal = this.max();
    return Math.min(maxVal, Math.max(val, 0));
  });

  protected readonly normalizedRadius = computed(() => {
    return this.radius() - this.strokeWidth() / 2;
  });

  protected readonly circumference = computed(() => {
    return this.normalizedRadius() * 2 * Math.PI;
  });

  protected readonly offset = computed(() => {
    const safeVal = this.safeValue();
    const maxVal = this.max();
    const circumf = this.circumference();
    return circumf - (safeVal / maxVal) * circumf;
  });

  protected readonly variantClasses = computed(() => {
    return this.progressCircleVariants[this.variant()];
  });

  protected readonly svgClasses = computed(() => {
    return cx('-rotate-90 transform', this.className());
  });

  protected readonly backgroundClasses = computed(() => {
    return cx(
      'transition-colors ease-linear',
      this.variantClasses().background,
    );
  });

  protected readonly circleClasses = computed(() => {
    const baseClasses = this.showAnimation()
      ? 'transform-gpu transition-all duration-300 ease-in-out'
      : 'transition-colors ease-linear';
    const variantClass = this.variantClasses().circle;

    return cx(baseClasses, variantClass);
  });

  protected readonly viewBox = computed(() => {
    const size = this.radius() * 2;
    return `0 0 ${size} ${size}`;
  });

  protected readonly size = computed(() => {
    return this.radius() * 2;
  });
}
