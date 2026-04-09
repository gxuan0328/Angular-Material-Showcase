import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

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
  private readonly router = inject(Router);
  readonly currentId = input<string>('');

  /** Tracks which subcategory groups are currently expanded. */
  protected readonly expandedGroups = signal<ReadonlySet<string>>(new Set());

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

  constructor() {
    // Auto-expand the group containing the active route entry
    effect(() => {
      const url = this.router.url;
      const match = url.match(/\/catalog\/([^/?#]+)/);
      if (!match) return;
      const activeId = match[1];
      const entry = CATALOG_REGISTRY.find(e => e.id === activeId);
      if (entry) {
        this.expandedGroups.set(new Set([entry.subcategory]));
      }
    });
  }

  protected isGroupExpanded(subcategory: string): boolean {
    return this.expandedGroups().has(subcategory);
  }

  protected toggleGroup(subcategory: string): void {
    this.expandedGroups.update(set => {
      const next = new Set(set);
      if (next.has(subcategory)) {
        next.delete(subcategory);
      } else {
        // Expand only this group, collapse all others
        next.clear();
        next.add(subcategory);
      }
      return next;
    });
  }

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
