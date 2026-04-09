import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

/** Navigation item definition for the basic fixed sidebar. */
interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { id: 'dashboard', label: '儀表板', icon: 'dashboard' },
  { id: 'analytics', label: '數據分析', icon: 'insights' },
  { id: 'users', label: '使用者管理', icon: 'group' },
  { id: 'settings', label: '設定', icon: 'settings' },
  { id: 'help', label: '說明中心', icon: 'help' },
] as const;

/**
 * Sidebar 1 — Basic Fixed Sidebar
 *
 * Fixed left sidebar (240px) with 5 nav items using MatListModule.
 * Active item highlighted with primary color background.
 */
@Component({
  selector: 'app-sidebar-1',
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
            <a
              mat-list-item
              [class.active]="activeId() === item.id"
              (click)="setActive(item.id)"
            >
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
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
export class Sidebar1Component {
  protected readonly navItems = NAV_ITEMS;
  protected readonly activeId = signal<string>('dashboard');

  /** Computed label for the currently active item. */
  protected activeLabel(): string {
    const current = NAV_ITEMS.find(i => i.id === this.activeId());
    return current?.label ?? '';
  }

  protected setActive(id: string): void {
    this.activeId.set(id);
  }
}
