import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

/** A child navigation item (leaf node). */
interface NavChild {
  readonly id: string;
  readonly label: string;
}

/** A top-level navigation item, optionally with expandable children. */
interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly children?: readonly NavChild[];
}

const NAV_ITEMS: readonly NavItem[] = [
  { id: 'dashboard', label: '儀表板', icon: 'dashboard' },
  {
    id: 'users',
    label: '使用者管理',
    icon: 'group',
    children: [
      { id: 'user-list', label: '使用者列表' },
      { id: 'user-add', label: '新增使用者' },
      { id: 'user-roles', label: '角色設定' },
    ],
  },
  {
    id: 'reports',
    label: '報表',
    icon: 'bar_chart',
    children: [
      { id: 'revenue', label: '營收報表' },
      { id: 'traffic', label: '流量報表' },
    ],
  },
  { id: 'settings', label: '設定', icon: 'settings' },
] as const;

/**
 * Sidebar 6 — Nested / Tree Sidebar
 *
 * 4 top-level items, 2 with expandable children. Uses signal() per item for
 * expanded state. Children are indented by 1.5rem with expand/collapse icons.
 */
@Component({
  selector: 'app-sidebar-6',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [MatIconModule, MatListModule],
  template: `
    <div class="layout">
      <nav class="sidebar" aria-label="主功能導覽">
        <div class="brand">
          <mat-icon class="brand-icon">ac_unit</mat-icon>
          <span class="brand-label">應用程式</span>
        </div>

        <mat-nav-list>
          @for (item of navItems; track item.id) {
            <!-- Top-level item -->
            <a
              mat-list-item
              class="nav-item"
              [class.active]="activeId() === item.id && !item.children"
              (click)="onItemClick(item)"
            >
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
              @if (item.children) {
                <mat-icon
                  matListItemMeta
                  class="expand-icon"
                  [class.expand-icon--open]="isExpanded(item.id)"
                >
                  chevron_right
                </mat-icon>
              }
            </a>

            <!-- Children (shown when expanded) -->
            @if (item.children && isExpanded(item.id)) {
              @for (child of item.children; track child.id) {
                <a
                  mat-list-item
                  class="nav-child"
                  [class.active]="activeId() === child.id"
                  (click)="setActive(child.id)"
                >
                  <span matListItemTitle>{{ child.label }}</span>
                </a>
              }
            }
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
      overflow-y: auto;
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
      margin-bottom: 0.125rem;
    }

    .nav-child {
      padding-left: 1.5rem;
      margin-bottom: 0.125rem;
    }

    .active {
      background: var(--mat-sys-primary-container, #d6e3ff) !important;
      color: var(--mat-sys-on-primary-container, #001b3e) !important;
    }

    .active mat-icon {
      color: var(--mat-sys-primary, #005cbb);
    }

    .expand-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--mat-sys-on-surface-variant, #44474e);
      transition: transform 200ms ease;
    }

    .expand-icon--open {
      transform: rotate(90deg);
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
export class Sidebar6Component {
  protected readonly navItems = NAV_ITEMS;
  protected readonly activeId = signal<string>('dashboard');

  /** Track expanded state per top-level item id. */
  private readonly expandedMap = signal<Record<string, boolean>>({
    users: true,
    reports: true,
  });

  /** Check whether a top-level item is expanded. */
  protected isExpanded(id: string): boolean {
    return !!this.expandedMap()[id];
  }

  /** Toggle expanded state for a top-level item. */
  private toggleExpand(id: string): void {
    this.expandedMap.update(map => ({
      ...map,
      [id]: !map[id],
    }));
  }

  /** Handle click on a top-level item: toggle if it has children, else activate. */
  protected onItemClick(item: NavItem): void {
    if (item.children) {
      this.toggleExpand(item.id);
    } else {
      this.activeId.set(item.id);
    }
  }

  protected setActive(id: string): void {
    this.activeId.set(id);
  }

  /** Resolve the label for the currently active item across all levels. */
  protected activeLabel(): string {
    const id = this.activeId();
    for (const item of NAV_ITEMS) {
      if (item.id === id) return item.label;
      if (item.children) {
        const child = item.children.find(c => c.id === id);
        if (child) return child.label;
      }
    }
    return '';
  }
}
