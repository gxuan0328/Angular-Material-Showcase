import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

/** Navigation item with an optional badge. */
interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly badge?: string;
  readonly badgeColor?: 'red' | 'blue' | 'grey';
}

const NAV_ITEMS: readonly NavItem[] = [
  { id: 'inbox', label: '收件匣', icon: 'inbox', badge: '12', badgeColor: 'red' },
  { id: 'notifications', label: '通知', icon: 'notifications', badge: '3', badgeColor: 'blue' },
  { id: 'todos', label: '待辦事項', icon: 'checklist', badge: '7', badgeColor: 'grey' },
  { id: 'starred', label: '星號標記', icon: 'star' },
  { id: 'drafts', label: '草稿', icon: 'drafts' },
  { id: 'archive', label: '封存', icon: 'archive' },
] as const;

/**
 * Sidebar 4 — Sidebar with Badges / Counters
 *
 * 6 nav items, some with count badges on the right side.
 * Badge is a small rounded pill span. Active item has a left border indicator
 * (4px solid primary color).
 */
@Component({
  selector: 'app-sidebar-4',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [MatIconModule, MatListModule],
  template: `
    <div class="layout">
      <nav class="sidebar" aria-label="主功能導覽">
        <div class="brand">
          <mat-icon class="brand-icon">mail</mat-icon>
          <span class="brand-label">訊息中心</span>
        </div>

        <mat-nav-list>
          @for (item of navItems; track item.id) {
            <a
              mat-list-item
              class="nav-item"
              [class.active]="activeId() === item.id"
              (click)="setActive(item.id)"
            >
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
              @if (item.badge) {
                <span
                  matListItemMeta
                  class="badge"
                  [class.badge-red]="item.badgeColor === 'red'"
                  [class.badge-blue]="item.badgeColor === 'blue'"
                  [class.badge-grey]="item.badgeColor === 'grey'"
                >
                  {{ item.badge }}
                </span>
              }
            </a>
          }
        </mat-nav-list>
      </nav>

      <main class="content">
        <h2>主要內容區域</h2>
        <p>目前選取：{{ activeLabel() }}</p>
        <div class="placeholder-card"></div>
        <div class="placeholder-card short"></div>
      </main>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .layout {
      display: flex;
      min-height: 480px;
      border: 1px solid var(--mat-sys-outline-variant, #c4c6d0);
      border-radius: 12px;
      overflow: hidden;
      background: var(--mat-sys-surface, #fff);
    }

    .sidebar {
      width: 240px;
      flex-shrink: 0;
      background: var(--mat-sys-surface-container-low, #f4f3f6);
      border-right: 1px solid var(--mat-sys-outline-variant, #c4c6d0);
      display: flex;
      flex-direction: column;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      color: var(--mat-sys-on-surface, #1a1b1f);
    }

    .brand-icon {
      color: var(--mat-sys-primary, #005cbb);
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
    }

    .brand-label {
      font-size: 1rem;
      font-weight: 600;
    }

    mat-nav-list {
      padding: 0.5rem;
    }

    .nav-item {
      border-left: 4px solid transparent;
      margin-bottom: 0.125rem;
    }

    .nav-item.active {
      border-left-color: var(--mat-sys-primary, #005cbb);
      background: var(--mat-sys-primary-container, #d6e3ff) !important;
      color: var(--mat-sys-on-primary-container, #001b3e) !important;
    }

    .nav-item.active mat-icon {
      color: var(--mat-sys-primary, #005cbb);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 22px;
      height: 20px;
      padding: 0 6px;
      border-radius: 9999px;
      font-size: 0.6875rem;
      font-weight: 600;
      line-height: 1;
    }

    .badge-red {
      background: var(--mat-sys-error-container, #ffdad6);
      color: var(--mat-sys-on-error-container, #410002);
    }

    .badge-blue {
      background: var(--mat-sys-primary-container, #d6e3ff);
      color: var(--mat-sys-on-primary-container, #001b3e);
    }

    .badge-grey {
      background: var(--mat-sys-surface-container-high, #e9e7eb);
      color: var(--mat-sys-on-surface-variant, #44474e);
    }

    .content {
      flex: 1;
      padding: 1.5rem 2rem;
      background: var(--mat-sys-surface-container-lowest, #faf9fd);
    }

    .content h2 {
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--mat-sys-on-surface, #1a1b1f);
    }

    .content p {
      margin: 0 0 1.5rem;
      color: var(--mat-sys-on-surface-variant, #44474e);
      font-size: 0.875rem;
    }

    .placeholder-card {
      height: 120px;
      background: var(--mat-sys-surface-container, #efedf1);
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .placeholder-card.short {
      height: 64px;
    }
  `,
})
export class Sidebar4Component {
  protected readonly navItems = NAV_ITEMS;
  protected readonly activeId = signal<string>('inbox');

  /** Resolve the label for the currently active item. */
  protected activeLabel(): string {
    const current = NAV_ITEMS.find(i => i.id === this.activeId());
    return current?.label ?? '';
  }

  protected setActive(id: string): void {
    this.activeId.set(id);
  }
}
