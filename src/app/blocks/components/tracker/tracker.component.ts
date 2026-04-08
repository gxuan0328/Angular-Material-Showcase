/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update components/tracker`
*/

import {
  ChangeDetectionStrategy,
  Component,
  input,
  TemplateRef,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { cx } from '../../utils/functions/cx';
import { TrackerBlockProps } from './tracker.model';
import { MatTooltip } from '@angular/material/tooltip';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedPosition,
} from '@angular/cdk/overlay';

@Component({
  selector: 'ngm-dev-block-ui-tracker',
  templateUrl: './tracker.component.html',
  imports: [
    MatTooltip,
    NgTemplateOutlet,
    CdkOverlayOrigin,
    CdkConnectedOverlay,
  ],
  providers: [
    { provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackerComponent {
  data = input.required<TrackerBlockProps[]>();
  defaultBackgroundColor = input<string>('bg-gray-400 dark:bg-gray-400');
  hoverEffect = input<boolean>(false);
  tooltipTemplate = input<TemplateRef<any>>();
  tooltipOpen: Map<string | number, boolean> = new Map();

  readonly positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: -10,
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: 10,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: -10,
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: 10,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -10,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -10,
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 10,
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 10,
    },
  ];

  private readonly cdr = inject(ChangeDetectorRef);

  readonly cx = cx;
  readonly containerClass = cx('group flex h-8 w-full items-center');
  readonly blockWrapperClass = cx(
    'size-full overflow-hidden px-[0.5px] transition first:rounded-l-[4px] first:pl-0 last:rounded-r-[4px] last:pr-0 sm:px-px',
  );

  hideTooltip(key: string | number) {
    this.tooltipOpen.set(key, false);
    this.cdr.markForCheck();
  }

  showTooltip(key: string | number) {
    this.tooltipOpen.set(key, true);
    this.cdr.markForCheck();
  }
}
