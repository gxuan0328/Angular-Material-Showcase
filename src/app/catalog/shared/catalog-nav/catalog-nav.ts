import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

import { CATALOG_REGISTRY, CatalogRegistryEntry } from '../catalog-registry';

interface NavSection {
  readonly category: 'application' | 'marketing';
  readonly title: string;
  readonly groups: readonly NavGroup[];
}

interface NavGroup {
  /** Unique key: "category:subcategory" — prevents cross-category collisions */
  readonly groupKey: string;
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

  /** Tracks which groups are expanded by their unique groupKey. */
  protected readonly expandedGroups = signal<ReadonlySet<string>>(new Set());

  protected readonly sections = computed<readonly NavSection[]>(() => {
    return [
      {
        category: 'application',
        title: 'Application',
        groups: this.buildGroups('application', CATALOG_REGISTRY.filter(e => e.category === 'application')),
      },
      {
        category: 'marketing',
        title: 'Marketing',
        groups: this.buildGroups('marketing', CATALOG_REGISTRY.filter(e => e.category === 'marketing')),
      },
    ];
  });

  constructor() {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.focusActiveGroup());

    this.focusActiveGroup();
  }

  protected isGroupExpanded(groupKey: string): boolean {
    return this.expandedGroups().has(groupKey);
  }

  protected toggleGroup(groupKey: string): void {
    this.expandedGroups.update(set => {
      const next = new Set(set);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  }

  private focusActiveGroup(): void {
    const url = this.router.url;
    const match = url.match(/\/catalog\/([^/?#]+)/);
    if (!match) return;
    const activeId = match[1];
    const entry = CATALOG_REGISTRY.find(e => e.id === activeId);
    if (entry) {
      const key = `${entry.category}:${entry.subcategory}`;
      this.expandedGroups.set(new Set([key]));
    }
  }

  private buildGroups(category: string, entries: readonly CatalogRegistryEntry[]): readonly NavGroup[] {
    const map = new Map<string, CatalogRegistryEntry[]>();
    for (const entry of entries) {
      const list = map.get(entry.subcategory) ?? [];
      list.push(entry);
      map.set(entry.subcategory, list);
    }
    return Array.from(map.entries()).map(([subcategory, list]) => ({
      groupKey: `${category}:${subcategory}`,
      subcategory,
      entries: list,
    }));
  }
}
