import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { GUIDE_REGISTRY, getGuideCategories } from './shared/guide-registry';

@Component({
  selector: 'app-guide-index',
  imports: [RouterLink, MatIconModule, MatCardModule],
  template: `
    <div class="guide-index">
      <header class="guide-index__header">
        <h1 class="guide-index__title">Angular 深度教學指南</h1>
        <p class="guide-index__subtitle">
          從基礎概念到高階實踐，共 {{ totalChapters }} 章完整教學。
          專為後端開發者 (.NET/C#) 轉型前端設計，涵蓋 Angular 21+ 最新 API 與最佳實踐。
        </p>
      </header>

      @for (cat of categories; track cat.category) {
        <section class="guide-index__category">
          <h2 class="guide-index__category-title">{{ cat.label }}</h2>
          <div class="guide-index__grid">
            @for (entry of cat.entries; track entry.id) {
              <a
                class="guide-index__card"
                [routerLink]="['/guide', entry.id]"
              >
                <mat-icon class="guide-index__card-icon">{{ entry.icon }}</mat-icon>
                <div class="guide-index__card-body">
                  <span class="guide-index__card-chapter">Chapter {{ entry.number }}</span>
                  <strong class="guide-index__card-title">{{ entry.title }}</strong>
                  <p class="guide-index__card-desc">{{ entry.subtitle }}</p>
                </div>
                <span class="guide-index__card-time">{{ entry.estimatedMinutes }}m</span>
              </a>
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: `
    .guide-index {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 960px;
    }
    .guide-index__header {
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
    }
    .guide-index__title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }
    .guide-index__subtitle {
      font-size: 1rem;
      color: var(--mat-sys-on-surface-variant, #4b5563);
      margin: 0;
      line-height: 1.6;
    }
    .guide-index__category-title {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--mat-sys-primary, #005cbb);
      margin: 0 0 0.75rem;
    }
    .guide-index__grid {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .guide-index__card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      border: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
      border-radius: 12px;
      text-decoration: none;
      color: var(--mat-sys-on-surface, #1f2937);
      transition: background 150ms ease, border-color 150ms ease;
    }
    .guide-index__card:hover {
      background: var(--mat-sys-surface-container, #f3f4f6);
      border-color: var(--mat-sys-primary, #005cbb);
    }
    .guide-index__card-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      color: var(--mat-sys-primary, #005cbb);
      flex-shrink: 0;
    }
    .guide-index__card-body {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }
    .guide-index__card-chapter {
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--mat-sys-on-surface-variant, #9ca3af);
    }
    .guide-index__card-title {
      font-size: 1rem;
      font-weight: 600;
    }
    .guide-index__card-desc {
      font-size: 0.8125rem;
      color: var(--mat-sys-on-surface-variant, #6b7280);
      margin: 0.125rem 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .guide-index__card-time {
      font-size: 0.75rem;
      color: var(--mat-sys-on-surface-variant, #9ca3af);
      flex-shrink: 0;
    }
    @media (max-width: 639.98px) {
      .guide-index__title { font-size: 1.5rem; }
      .guide-index__card-desc { display: none; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideIndex {
  protected readonly categories = getGuideCategories();
  protected readonly totalChapters = GUIDE_REGISTRY.length;
}
