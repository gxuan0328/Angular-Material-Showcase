import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

import { BlockVariant } from '../../models/block-variant';

@Component({
  selector: 'app-block-preview',
  imports: [NgComponentOutlet],
  templateUrl: './block-preview.html',
  styleUrl: './block-preview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block-preview' },
})
export class BlockPreview {
  readonly variant = input.required<BlockVariant>();

  protected readonly componentType = computed(() => this.variant().component);
  protected readonly demoInputs = computed<Record<string, unknown> | undefined>(
    () => this.variant().demoInputs as Record<string, unknown> | undefined,
  );
}
