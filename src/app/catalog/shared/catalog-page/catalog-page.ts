import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CatalogBlockMeta } from '../../models/catalog-block-meta';
import { getNextEntry, getPreviousEntry } from '../catalog-registry';

@Component({
  selector: 'app-catalog-page',
  imports: [RouterLink],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'catalog-page' },
})
export class CatalogPage {
  readonly meta = input.required<CatalogBlockMeta>();

  protected readonly previousEntry = computed(() => getPreviousEntry(this.meta().id));
  protected readonly nextEntry = computed(() => getNextEntry(this.meta().id));
  protected readonly hasVariants = computed(() => this.meta().variants.length > 0);
}
