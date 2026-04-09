import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

/** Navigation item for the mini (icon-only) sidebar. */
interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { id: 'home', label: '首頁', icon: 'home' },
  { id: 'search', label: '搜尋', icon: 'search' },
  { id: 'inbox', label: '收件匣', icon: 'inbox' },
  { id: 'calendar', label: '行事曆', icon: 'calendar_today' },
  { id: 'analytics', label: '數據分析', icon: 'insights' },
  { id: 'people', label: '聯絡人', icon: 'people' },
  { id: 'settings', label: '設定', icon: 'settings' },
] as const;

/**
 * Sidebar 5 — Mini Sidebar (Icon-only with Flyout)
 *
 * Always shows as icon-only (56px width). On hover, shows a flyout label via
 * matTooltip. 7 icons arranged vertically. Active icon has filled background circle.
 */
@Component({
  selector: 'app-sidebar-5',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [MatIconModule, MatTooltipModule],
  template: `
    <div class="layout">
      <nav class="sidebar" aria-label="主功能導覽">
        <div class="brand-icon-wrapper">
          <mat-icon class="brand-icon">ac_unit</mat-icon>
        </div>

        <div class="nav-icons">
          @for (item of navItems; track item.id) {
            <button
              type="button"
              class="icon-btn"
              [class.active]="activeId() === item.id"
              [matTooltip]="item.label"
              matTooltipPosition="right"
              [attr.aria-label]="item.label"
              (click)="setActive(item.id)"
            >
              <mat-icon>{{ item.icon }}</mat-icon>
            </button>
          }
        </div>
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
      width: 56px;
      flex-shrink: 0;
      background: var(--mat-sys-surface-container-low, #f4f3f6);
      border-right: 1px solid var(--mat-sys-outline-variant, #c4c6d0);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.75rem 0;
      gap: 0.25rem;
    }

    .brand-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin-bottom: 0.75rem;
    }

    .brand-icon {
      color: var(--mat-sys-primary, #005cbb);
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
    }

    .nav-icons {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      width: 100%;
    }

    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--mat-sys-on-surface-variant, #44474e);
      cursor: pointer;
      transition: background 150ms ease, color 150ms ease;
    }

    .icon-btn:hover {
      background: var(--mat-sys-surface-container-high, #e9e7eb);
      color: var(--mat-sys-on-surface, #1a1b1f);
    }

    .icon-btn:focus-visible {
      outline: 2px solid var(--mat-sys-primary, #005cbb);
      outline-offset: 2px;
    }

    .icon-btn.active {
      background: var(--mat-sys-primary-container, #d6e3ff);
      color: var(--mat-sys-primary, #005cbb);
    }

    .icon-btn.active mat-icon {
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
export class Sidebar5Component {
  protected readonly navItems = NAV_ITEMS;
  protected readonly activeId = signal<string>('home');

  /** Resolve the label for the currently active item. */
  protected activeLabel(): string {
    const current = NAV_ITEMS.find(i => i.id === this.activeId());
    return current?.label ?? '';
  }

  protected setActive(id: string): void {
    this.activeId.set(id);
  }
}
