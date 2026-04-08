import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { BlockVariant } from '../../models/block-variant';

@Component({
  selector: 'app-variant-selector',
  imports: [],
  templateUrl: './variant-selector.html',
  styleUrl: './variant-selector.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'variant-selector' },
})
export class VariantSelector {
  readonly variants = input.required<readonly BlockVariant[]>();
  readonly selectedId = input.required<string>();
  readonly selectionChange = output<string>();

  protected readonly freeVariants = computed(() => this.variants().filter(v => v.isFree));
  protected readonly paidVariants = computed(() => this.variants().filter(v => !v.isFree));

  protected onChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectionChange.emit(value);
  }
}
