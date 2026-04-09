/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update filterbar/filterbar-9`
*/

import {
  ANIMATION_MODULE_TYPE,
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {
  MatChipsModule,
  MatChipSelectionChange,
} from '@angular/material/chips';
import {
  ConnectedOverlayPositionChange,
  OverlayModule,
  STANDARD_DROPDOWN_BELOW_POSITIONS,
} from '@angular/cdk/overlay';

// Define property keys type
type PropertyKey =
  | 'item_id'
  | 'created_at'
  | 'updated_at'
  | 'type'
  | 'tags'
  | 'status';

/** Name of the enter animation `@keyframes`. */
const ENTER_ANIMATIONS = [
  'display-properties-fade-in-up',
  'display-properties-fade-in-down',
];

/** Name of the exit animation `@keyframes`. */
const EXIT_ANIMATIONS = [
  'display-properties-fade-out-up',
  'display-properties-fade-out-down',
];

@Component({
  selector: 'ngm-dev-block-filterbar-9',
  templateUrl: './filterbar-9.component.html',
  styleUrls: ['./filterbar-9.component.scss'],
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    OverlayModule,
  ],
  // Disable view encapsulation so that animations are not scoped to the component
  encapsulation: ViewEncapsulation.None,
})
export class Filterbar9Component {
  // Display properties state
  displayProperties: Record<PropertyKey, boolean> = {
    item_id: true,
    created_at: true,
    updated_at: false,
    type: false,
    tags: true,
    status: true,
  };

  // Property keys for iteration in template
  propertyKeys: PropertyKey[] = [
    'item_id',
    'created_at',
    'updated_at',
    'type',
    'tags',
    'status',
  ];

  isAnimating = signal(false);
  isSoftOpen = signal(false);
  // Overlay state
  isOpen = false;

  animationDirection = signal<'up' | 'down'>('down');

  animationClass = computed(() => {
    const direction = this.animationDirection();
    const isOpen = this.isSoftOpen();
    return isOpen
      ? direction === 'up'
        ? 'animate-display-properties-fade-in-up'
        : 'animate-display-properties-fade-in-down'
      : direction === 'up'
        ? 'animate-display-properties-fade-out-down'
        : 'animate-display-properties-fade-out-up';
  });

  readonly _animationsDisabled =
    inject(ANIMATION_MODULE_TYPE, { optional: true }) === 'NoopAnimations';

  readonly STANDARD_DROPDOWN_BELOW_POSITIONS =
    STANDARD_DROPDOWN_BELOW_POSITIONS.map((item) => ({
      ...item,
      offsetY: item.overlayY === 'bottom' ? -8 : 8,
    }));

  constructor() {
    effect(() => {
      const isSoftOpen = this.isSoftOpen();
      if (isSoftOpen) {
        this.isOpen = true;
      } else {
        if (this._animationsDisabled) {
          this.isOpen = false;
        }
      }
    });
  }

  // Toggle overlay
  toggleOverlay(): void {
    this.isSoftOpen.update((value) => !value);
  }

  // Close overlay
  closeOverlay(): void {
    this.isSoftOpen.set(false);
  }

  onPositionChange(event: ConnectedOverlayPositionChange): void {
    this.animationDirection.set(
      event.connectionPair.overlayY === 'bottom' ? 'up' : 'down',
    );
  }

  /** Callback that is invoked when the panel animation completes. */
  onAnimationDone(state: string) {
    const isExit = EXIT_ANIMATIONS.includes(state);

    if (isExit) {
      this.isOpen = false;
    }

    this.isAnimating.set(false);
  }

  onAnimationStart(state: string) {
    this.isAnimating.set(
      ENTER_ANIMATIONS.includes(state) || EXIT_ANIMATIONS.includes(state),
    );
  }

  // Toggle display property
  toggleProperty(property: PropertyKey, event?: MatChipSelectionChange): void {
    if (event) {
      this.displayProperties[property] = event.selected;
    } else {
      this.displayProperties[property] = !this.displayProperties[property];
    }
  }
}
