import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

/** Navigation item definition for the collapsible sidebar. */
interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { id: 'dashboard', label: '儀表板', icon: 'dashboard' },
  { id: 'analytics', label: '數據分析', icon: 'insights' },
  { id: 'users', label: '使用者管理', icon: 'group' },
  { id: 'notifications', label: '通知中心', icon: 'notifications' },
  { id: 'settings', label: '設定', icon: 'settings' },
] as const;

/**
 * Sidebar 2 — Collapsible Sidebar
 *
 * Toggle between expanded (240px, icon + label) and collapsed (64px, icon only).
 * Collapsed state shows tooltip with the label. Uses signal() for collapsed state.
 * Smooth CSS transition (200ms) on width change.
 */
@Component({
  selector: 'app-sidebar-2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [MatIconModule, MatButtonModule, MatListModule, MatTooltipModule],
  template: `
    <div class="layout">
      <nav
        class="sidebar"
        [class.collapsed]="collapsed()"
        aria-label="主功能導覽"
      >
        <div class="brand" [class.brand--collapsed]="collapsed()">
          @if (!collapsed()) {
            <mat-icon class="brand-icon">ac_unit</mat-icon>
            <span class="brand-label">應用程式</span>
          }
          <button
            type="button"
            mat-icon-button
            class="toggle-btn"
            [attr.aria-label]="collapsed() ? '展開側邊欄' : '收合側邊欄'"
            [attr.aria-expanded]="!collapsed()"
            (click)="toggleCollapsed()"
          >
            <mat-icon>menu</mat-icon>
          </button>
        </div>

        <mat-nav-list>
          @for (item of navItems; track item.id) {
            <a
              mat-list-item
              [class.active]="activeId() === item.id"
              [matTooltip]="collapsed() ? item.label : ''"
              matTooltipPosition="right"
              (click)="setActive(item.id)"
            >
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              @if (!collapsed()) {
                <span matListItemTitle>{{ item.label }}</span>
              }
            </a>
          }
        </mat-nav-list>
      </nav>

      <main class="content">
        <h2>主要內容區域</h2>
        <p>側邊欄狀態：{{ stateLabel() }}</p>
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
      transition: width 200ms ease-in-out;
      overflow: hidden;
    }

    .sidebar.collapsed {
      width: 64px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 0.75rem 0.75rem 1.25rem;
      color: var(--mat-sys-on-surface, #1a1b1f);
      white-space: nowrap;
      overflow: hidden;
    }

    .brand--collapsed {
      justify-content: center;
      padding: 0.75rem;
    }

    .brand-icon {
      color: var(--mat-sys-primary, #005cbb);
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
      flex-shrink: 0;
    }

    .brand-label {
      font-size: 1rem;
      font-weight: 600;
      flex: 1;
    }

    .toggle-btn {
      flex-shrink: 0;
    }

    mat-nav-list {
      padding: 0.5rem;
    }

    .collapsed mat-nav-list {
      padding: 0.5rem 0.25rem;
    }

    .active {
      background: var(--mat-sys-primary-container, #d6e3ff) !important;
      color: var(--mat-sys-on-primary-container, #001b3e) !important;
    }

    .active mat-icon {
      color: var(--mat-sys-primary, #005cbb);
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
export class Sidebar2Component {
  protected readonly navItems = NAV_ITEMS;
  protected readonly collapsed = signal<boolean>(false);
  protected readonly activeId = signal<string>('dashboard');

  /** Label describing the current sidebar state. */
  protected readonly stateLabel = computed(() =>
    this.collapsed() ? '已收合' : '已展開',
  );

  protected toggleCollapsed(): void {
    this.collapsed.update(v => !v);
  }

  protected setActive(id: string): void {
    this.activeId.set(id);
  }
}
