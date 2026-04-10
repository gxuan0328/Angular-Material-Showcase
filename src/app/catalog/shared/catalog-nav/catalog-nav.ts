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
    // Collapse all groups except the one containing the active route on navigation
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.focusActiveGroup());

    // Also run once on init
    this.focusActiveGroup();
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
        next.add(subcategory);
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
      // Only keep the active entry's subcategory expanded
      this.expandedGroups.set(new Set([entry.subcategory]));
    }
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
