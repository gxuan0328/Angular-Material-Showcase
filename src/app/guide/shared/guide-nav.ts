import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { getGuideCategories } from './guide-registry';

@Component({
  selector: 'app-guide-nav',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <nav class="guide-nav" aria-label="教學指南目錄">
      @for (cat of categories(); track cat.category) {
        <section class="guide-nav__section">
          <h2 class="guide-nav__section-title">{{ cat.label }}</h2>
          <ul class="guide-nav__list">
            @for (entry of cat.entries; track entry.id) {
              <li>
                <a
                  class="guide-nav__link"
                  [routerLink]="['/guide', entry.id]"
                  routerLinkActive="guide-nav__link--active"
                >
                  <mat-icon class="guide-nav__link-icon">{{ entry.icon }}</mat-icon>
                  <div class="guide-nav__link-text">
                    <span class="guide-nav__link-number">Chapter {{ entry.number }}</span>
                    <span class="guide-nav__link-title">{{ entry.title }}</span>
                  </div>
                  <span class="guide-nav__link-time">{{ entry.estimatedMinutes }}m</span>
                </a>
              </li>
            }
          </ul>
        </section>
      }
    </nav>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
      overflow-y: auto;
      padding: 1rem;
    }
    .guide-nav__section { margin-bottom: 1.5rem; }
    .guide-nav__section-title {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--mat-sys-on-surface-variant, #6b7280);
      margin: 0 0 0.5rem;
    }
    .guide-nav__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }
    .guide-nav__link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.625rem;
      border-radius: 8px;
      text-decoration: none;
      color: var(--mat-sys-on-surface, #1f2937);
      transition: background 120ms ease;
    }
    .guide-nav__link:hover {
      background: var(--mat-sys-surface-container, #f3f4f6);
    }
    .guide-nav__link--active {
      background: var(--mat-sys-secondary-container, #dbeafe);
      color: var(--mat-sys-on-secondary-container, #1e40af);
    }
    .guide-nav__link-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
      color: var(--mat-sys-primary, #005cbb);
      flex-shrink: 0;
    }
    .guide-nav__link-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .guide-nav__link-number {
      font-size: 0.625rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--mat-sys-on-surface-variant, #9ca3af);
    }
    .guide-nav__link-title {
      font-size: 0.8125rem;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .guide-nav__link-time {
      font-size: 0.625rem;
      color: var(--mat-sys-on-surface-variant, #9ca3af);
      flex-shrink: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideNav {
  protected readonly categories = computed(() => getGuideCategories());
}
