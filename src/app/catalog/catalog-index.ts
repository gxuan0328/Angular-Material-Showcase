import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CATALOG_REGISTRY, CatalogRegistryEntry } from './shared/catalog-registry';

interface IndexSection {
  readonly title: string;
  readonly entries: readonly CatalogRegistryEntry[];
}

@Component({
  selector: 'app-catalog-index',
  imports: [RouterLink],
  template: `
    <header class="catalog-index__header">
      <h1>Catalog</h1>
      <p class="catalog-index__summary">
        共 {{ totalCount() }} 個元件分類，本期 milestone 上線 {{ shippedCount() }} 個。
      </p>
    </header>

    @for (section of sections(); track section.title) {
      <section class="catalog-index__section">
        <h2 class="catalog-index__section-title">{{ section.title }}</h2>
        <ul class="catalog-index__grid">
          @for (entry of section.entries; track entry.id) {
            <li class="catalog-index__card">
              <a class="catalog-index__link" [routerLink]="['/catalog', entry.id]">
                <div class="catalog-index__card-head">
                  <span class="catalog-index__card-title">{{ entry.title }}</span>
                  @if (entry.status === 'shipped') {
                    <span class="catalog-index__pill catalog-index__pill--shipped">已上線</span>
                  } @else {
                    <span class="catalog-index__pill catalog-index__pill--soon">即將推出</span>
                  }
                </div>
                <p class="catalog-index__card-summary">{{ entry.summary }}</p>
                <span class="catalog-index__card-meta">{{ entry.subcategory }}</span>
              </a>
            </li>
          }
        </ul>
      </section>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 1100px;
    }
    .catalog-index__header h1 {
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
    }
    .catalog-index__summary {
      color: var(--mat-sys-on-surface-variant, #6b7280);
      margin: 0;
    }
    .catalog-index__section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .catalog-index__section-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }
    .catalog-index__grid {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 0.875rem;
    }
    .catalog-index__card {
      display: flex;
    }
    .catalog-index__link {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
      width: 100%;
      border-radius: 8px;
      background: var(--mat-sys-surface-container, #f3f4f6);
      color: inherit;
      text-decoration: none;
      border: 1px solid transparent;
    }
    .catalog-index__link:hover {
      border-color: var(--mat-sys-outline, #d1d5db);
    }
    .catalog-index__card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }
    .catalog-index__card-title {
      font-size: 0.9375rem;
      font-weight: 600;
    }
    .catalog-index__card-summary {
      font-size: 0.8125rem;
      color: var(--mat-sys-on-surface-variant, #6b7280);
      margin: 0;
      flex: 1;
    }
    .catalog-index__card-meta {
      font-size: 0.6875rem;
      color: var(--mat-sys-on-surface-variant, #9ca3af);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .catalog-index__pill {
      font-size: 0.625rem;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      font-weight: 600;
    }
    .catalog-index__pill--shipped {
      background: #dcfce7;
      color: #166534;
    }
    .catalog-index__pill--soon {
      background: #fef3c7;
      color: #92400e;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogIndex {
  protected readonly totalCount = computed(() => CATALOG_REGISTRY.length);
  protected readonly shippedCount = computed(
    () => CATALOG_REGISTRY.filter(e => e.status === 'shipped').length,
  );
  protected readonly sections = computed<readonly IndexSection[]>(() => [
    {
      title: 'Application',
      entries: CATALOG_REGISTRY.filter(e => e.category === 'application'),
    },
    {
      title: 'Marketing',
      entries: CATALOG_REGISTRY.filter(e => e.category === 'marketing'),
    },
  ]);
}
