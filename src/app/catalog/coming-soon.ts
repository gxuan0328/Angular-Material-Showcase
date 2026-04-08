import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { findCatalogEntry } from './shared/catalog-registry';

@Component({
  selector: 'app-coming-soon',
  imports: [RouterLink],
  template: `
    @let entry = registryEntry();
    <article class="coming-soon">
      <p class="coming-soon__breadcrumb">
        <a routerLink="/catalog">Catalog</a>
        @if (entry) {
          · <span>{{ entry.subcategory }}</span>
        }
      </p>
      <h1 class="coming-soon__title">{{ entry?.title ?? '即將推出' }}</h1>
      @if (entry) {
        <p class="coming-soon__summary">{{ entry.summary }}</p>
      }
      <div class="coming-soon__badge">即將推出</div>
      <p class="coming-soon__hint">
        此元件目錄頁面將在後續 milestone 補上完整內容。先前往
        <a routerLink="/catalog">目錄首頁</a> 看其他已上線的元件。
      </p>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }
    .coming-soon {
      max-width: 720px;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .coming-soon__breadcrumb {
      font-size: 0.875rem;
      color: var(--mat-sys-on-surface-variant, #6b7280);
    }
    .coming-soon__breadcrumb a {
      color: inherit;
    }
    .coming-soon__title {
      font-size: 2rem;
      font-weight: 600;
      margin: 0;
    }
    .coming-soon__summary {
      color: var(--mat-sys-on-surface-variant, #4b5563);
      margin: 0;
    }
    .coming-soon__badge {
      align-self: flex-start;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: var(--mat-sys-tertiary-container, #fef3c7);
      color: var(--mat-sys-on-tertiary-container, #92400e);
      font-size: 0.75rem;
      font-weight: 600;
    }
    .coming-soon__hint {
      font-size: 0.9375rem;
      color: var(--mat-sys-on-surface-variant, #4b5563);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComingSoon {
  private readonly route = inject(ActivatedRoute);

  private readonly params = toSignal(this.route.paramMap, { requireSync: true });

  protected readonly registryEntry = computed(() => {
    const id = this.params().get('id') ?? '';
    return findCatalogEntry(id);
  });
}
