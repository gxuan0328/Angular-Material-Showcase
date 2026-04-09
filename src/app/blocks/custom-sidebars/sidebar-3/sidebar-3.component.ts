import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

/** Navigation item within a section. */
interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
}

/** A named section containing multiple navigation items. */
interface NavSection {
  readonly heading: string;
  readonly items: readonly NavItem[];
}

const NAV_SECTIONS: readonly NavSection[] = [
  {
    heading: '主功能',
    items: [
      { id: 'dashboard', label: '儀表板', icon: 'dashboard' },
      { id: 'projects', label: '專案管理', icon: 'folder' },
      { id: 'tasks', label: '任務列表', icon: 'task_alt' },
      { id: 'calendar', label: '行事曆', icon: 'calendar_today' },
    ],
  },
  {
    heading: '分析',
    items: [
      { id: 'analytics', label: '數據總覽', icon: 'insights' },
      { id: 'reports', label: '報表中心', icon: 'bar_chart' },
      { id: 'trends', label: '趨勢分析', icon: 'trending_up' },
    ],
  },
  {
    heading: '設定',
    items: [
      { id: 'general', label: '一般設定', icon: 'settings' },
      { id: 'security', label: '安全性', icon: 'security' },
    ],
  },
] as const;

/**
 * Sidebar 3 — Sidebar with Sections / Groups
 *
 * Sidebar divided into 3 sections with headings: "主功能", "分析", "設定".
 * mat-divider between sections. Section headings are uppercase, smaller font, muted.
 */
@Component({
  selector: 'app-sidebar-3',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [MatIconModule, MatListModule, MatDividerModule],
  template: `
    <div class="layout">
      <nav class="sidebar" aria-label="主功能導覽">
        <div class="brand">
          <mat-icon class="brand-icon">ac_unit</mat-icon>
          <span class="brand-label">應用程式</span>
        </div>

        @for (section of sections; track section.heading; let isLast = $last) {
          <div class="section-heading">{{ section.heading }}</div>
          <mat-nav-list>
            @for (item of section.items; track item.id) {
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
          @if (!isLast) {
            <mat-divider />
          }
        }
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

    .section-heading {
      padding: 0.75rem 1.25rem 0.25rem;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--mat-sys-on-surface-variant, #44474e);
    }

    mat-nav-list {
      padding: 0 0.5rem 0.5rem;
    }

    .active {
      background: var(--mat-sys-primary-container, #d6e3ff) !important;
      color: var(--mat-sys-on-primary-container, #001b3e) !important;
    }

    .active mat-icon {
      color: var(--mat-sys-primary, #005cbb);
    }

    mat-divider {
      margin: 0.25rem 1rem;
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
export class Sidebar3Component {
  protected readonly sections = NAV_SECTIONS;
  protected readonly activeId = signal<string>('dashboard');

  /** Resolve the label for the currently active item across all sections. */
  protected activeLabel(): string {
    for (const section of NAV_SECTIONS) {
      const match = section.items.find(i => i.id === this.activeId());
      if (match) return match.label;
    }
    return '';
  }

  protected setActive(id: string): void {
    this.activeId.set(id);
  }
}
