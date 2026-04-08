/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update wrappers/overlay-wrapper`
*/

import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  STANDARD_DROPDOWN_BELOW_POSITIONS,
  ConnectedOverlayPositionChange,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  signal,
} from '@angular/core';

@Component({
  selector: 'ngm-dev-block-ui-overlay-wrapper',
  templateUrl: './overlay-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkConnectedOverlay],
})
export class OverlayWrapperComponent {
  readonly trigger = input.required<CdkOverlayOrigin>();
  readonly positions = input<ConnectedPosition[]>([]);
  readonly panelClass = input<string>('');
  readonly enterAnimationClass = computed(() => {
    const direction = this.animationDirection();
    return direction === 'up' ? 'animate-fade-in-up' : 'animate-fade-in-down';
  });

  readonly leaveAnimationClass = computed(() => {
    const direction = this.animationDirection();
    return direction === 'up' ? 'animate-fade-out-down' : 'animate-fade-out-up';
  });

  readonly isOpen = signal(false);
  readonly animationDirection = signal<'up' | 'down'>('down');
  readonly overlayPositions = computed(() =>
    STANDARD_DROPDOWN_BELOW_POSITIONS.concat(this.positions()).map((item) => ({
      ...item,
      offsetY: item.overlayY === 'bottom' ? -8 : 8,
    })),
  );

  toggleOverlay(): void {
    this.isOpen.update((value) => !value);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onPositionChange(event: ConnectedOverlayPositionChange): void {
    this.animationDirection.set(
      event.connectionPair.overlayY === 'bottom' ? 'up' : 'down',
    );
  }
}
