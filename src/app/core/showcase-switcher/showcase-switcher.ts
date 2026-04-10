import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

interface ShowcaseRoute {
  readonly label: string;
  readonly icon: string;
  readonly path: string;
  readonly tooltip: string;
}

const ROUTES: readonly ShowcaseRoute[] = [
  { label: 'Landing', icon: 'language', path: '/', tooltip: '行銷 Landing Page' },
  { label: 'Catalog', icon: 'grid_view', path: '/catalog', tooltip: '元件目錄' },
  { label: 'App', icon: 'dashboard', path: '/app/dashboard', tooltip: 'SaaS 管理後台' },
  { label: 'Guide', icon: 'school', path: '/guide', tooltip: 'Angular 深度教學指南' },
];

/**
 * Floating showcase switcher — renders a FAB-like toggle that expands into
 * 3 navigation buttons for quick switching between Landing / Catalog / App.
 * Positioned fixed at bottom-right corner across all layouts.
 */
@Component({
  selector: 'app-showcase-switcher',
  imports: [RouterLink, MatIconModule, MatButtonModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'showcase-switcher' },
  template: `
    <div class="switcher" [class.switcher--open]="open()">
      @if (open()) {
        <div class="switcher__panel">
          <span class="switcher__title">展示切換</span>
          @for (route of routes; track route.path) {
            <a
              class="switcher__item"
              [routerLink]="route.path"
              [matTooltip]="route.tooltip"
              matTooltipPosition="left"
              (click)="close()"
            >
              <mat-icon class="switcher__item-icon">{{ route.icon }}</mat-icon>
              <span class="switcher__item-label">{{ route.label }}</span>
            </a>
          }
        </div>
      }
      <button
        mat-fab
        color="primary"
        class="switcher__fab"
        [attr.aria-label]="open() ? '關閉展示切換' : '開啟展示切換'"
        (click)="toggle()"
      >
        <mat-icon>{{ open() ? 'close' : 'swap_horiz' }}</mat-icon>
      </button>
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 1000;
    }

    .switcher {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.75rem;
    }

    .switcher__panel {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      background: var(--mat-sys-surface, #fff);
      border: 1px solid var(--mat-sys-outline-variant, #c4c6d0);
      border-radius: 12px;
      padding: 0.75rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      animation: slideUp 200ms ease;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .switcher__title {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--mat-sys-on-surface-variant, #6b7280);
      padding: 0 0.25rem;
    }

    .switcher__item {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      text-decoration: none;
      color: var(--mat-sys-on-surface, #1f2937);
      font-size: 0.875rem;
      font-weight: 500;
      transition: background 120ms ease;
      white-space: nowrap;
    }

    .switcher__item:hover {
      background: var(--mat-sys-surface-container, #f3f4f6);
    }

    .switcher__item-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--mat-sys-primary, #005cbb);
    }

    .switcher__fab {
      flex-shrink: 0;
    }

    /* Mobile adjustments */
    @media (max-width: 639.98px) {
      :host {
        bottom: 1rem;
        right: 1rem;
      }

      .switcher__panel {
        max-width: calc(100vw - 2rem);
      }

      .switcher__item {
        padding: 0.375rem 0.625rem;
        font-size: 0.8125rem;
      }
    }
  `,
})
export class ShowcaseSwitcher {
  protected readonly routes = ROUTES;
  protected readonly open = signal<boolean>(false);

  protected toggle(): void {
    this.open.update(v => !v);
  }

  protected close(): void {
    this.open.set(false);
  }
}
