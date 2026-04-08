import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CATALOG_REGISTRY, CatalogRegistryEntry } from '../catalog-registry';

interface NavSection {
  readonly category: 'application' | 'marketing';
  readonly title: string;
  readonly groups: readonly NavGroup[];
}

interface NavGroup {
  readonly subcategory: string;
  readonly entries: readonly CatalogRegistryEntry[];
}

@Component({
  selector: 'app-catalog-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './catalog-nav.html',
  styleUrl: './catalog-nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'catalog-nav' },
})
export class CatalogNav {
  readonly currentId = input<string>('');

  protected readonly sections = computed<readonly NavSection[]>(() => {
    return [
      {
        category: 'application',
        title: 'Application',
        groups: this.groupBySubcategory(CATALOG_REGISTRY.filter(e => e.category === 'application')),
      },
      {
        category: 'marketing',
        title: 'Marketing',
        groups: this.groupBySubcategory(CATALOG_REGISTRY.filter(e => e.category === 'marketing')),
      },
    ];
  });

  private groupBySubcategory(entries: readonly CatalogRegistryEntry[]): readonly NavGroup[] {
    const map = new Map<string, CatalogRegistryEntry[]>();
    for (const entry of entries) {
      const list = map.get(entry.subcategory) ?? [];
      list.push(entry);
      map.set(entry.subcategory, list);
    }
    return Array.from(map.entries()).map(([subcategory, list]) => ({
      subcategory,
      entries: list,
    }));
  }
}
