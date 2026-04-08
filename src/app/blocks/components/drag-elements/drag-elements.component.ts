/*
	Installed from https://ui.angular-material.dev/
	Update this file using `npx @ngm-dev/cli update components/drag-elements`
*/

import {
  TemplateRef,
  Component,
  Directive,
  ElementRef,
  inject,
  input,
  viewChildren,
  contentChildren,
  linkedSignal,
  effect,
  booleanAttribute,
  signal,
  afterNextRender,
  Injector,
} from '@angular/core';
import { CdkDrag, CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { cx } from '../../utils/functions/cx';
import { NgTemplateOutlet } from '@angular/common';

@Directive({
  selector: '[ngmDevBlockUiDragElement]',
})
export class DragElementDirective {
  readonly templateRef = inject(TemplateRef<any>);
  readonly dragDisabled = input<boolean>(false, {
    alias: 'ngmDevBlockUiDragElementDragDisabled',
  });
}

@Component({
  selector: 'ngm-dev-block-uidrag-elements',
  templateUrl: './drag-elements.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [NgTemplateOutlet, CdkDrag],
})
export class DragElementsComponent {
  /**
   * Passed to cdkDrag for cdkDragBoundary
   */
  readonly dragBoundary = input<string | ElementRef<HTMLElement> | HTMLElement>(
    'body',
  );
  /**
   * If true, brings the dragged element to the front
   */
  readonly selectedOnTop = input<boolean>(true);
  /**
   * Additional CSS classes for the container
   */
  readonly containerClass = input<string>('');

  readonly cx = cx;

  readonly dragElements = contentChildren(DragElementDirective);

  private readonly cdkDrags = viewChildren(CdkDrag);
  private readonly _injector = inject(Injector);

  readonly isDraggingMap = new Map<number, boolean>();

  readonly setZIndices = linkedSignal(() => {
    return Array.from({ length: this.dragElements().length }, (_, i) => i);
  });

  readonly startResetPositions = signal(false);

  onDragStarted(event: CdkDragStart, index: number) {
    this.bringToFront(index);
    this.isDraggingMap.set(index, true);
  }

  onDragEnded(event: CdkDragEnd, index: number) {
    this.isDraggingMap.set(index, false);
  }

  private bringToFront(index: number) {
    if (this.selectedOnTop()) {
      this.setZIndices.update((prevIndices) => {
        const newIndices = [...prevIndices];
        const currentIndex = newIndices.indexOf(index);
        newIndices.splice(currentIndex, 1);
        newIndices.push(index);
        return newIndices;
      });
    }
  }

  resetPositions() {
    this.startResetPositions.set(true);
    this.onStable(() => {
      this.cdkDrags().forEach((cdkDrag) => {
        cdkDrag.reset();
      });
      setTimeout(() => {
        this.startResetPositions.set(false);
      }, 350);
    });
  }

  onStable(callback: () => void) {
    afterNextRender(
      () => {
        callback();
      },
      { injector: this._injector },
    );
  }
}
