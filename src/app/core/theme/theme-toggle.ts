import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemeMode, ThemeStore } from './theme-store';

interface ToggleOption {
  readonly mode: ThemeMode;
  readonly icon: string;
  readonly label: string;
}

const OPTIONS: readonly ToggleOption[] = [
  { mode: 'light', icon: 'light_mode', label: '亮色' },
  { mode: 'dark', icon: 'dark_mode', label: '暗色' },
  { mode: 'system', icon: 'computer', label: '跟隨系統' },
];

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  template: `
    <div class="theme-toggle" role="radiogroup" aria-label="主題模式">
      @for (option of options; track option.mode) {
        <button
          type="button"
          role="radio"
          class="theme-toggle__button"
          [class.theme-toggle__button--active]="theme.mode() === option.mode"
          [attr.aria-checked]="theme.mode() === option.mode"
          [attr.title]="option.label"
          (click)="select(option.mode)"
        >
          <span class="material-symbols-outlined theme-toggle__icon" aria-hidden="true">{{
            option.icon
          }}</span>
          <span class="theme-toggle__label">{{ option.label }}</span>
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
    }
    .theme-toggle {
      display: inline-flex;
      gap: 0.125rem;
      padding: 0.125rem;
      background: var(--mat-sys-surface-container, #f3f4f6);
      border-radius: 9999px;
    }
    .theme-toggle__button {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.375rem 0.75rem;
      border: none;
      background: transparent;
      color: var(--mat-sys-on-surface-variant, #6b7280);
      cursor: pointer;
      border-radius: 9999px;
      font-size: 0.8125rem;
    }
    .theme-toggle__button:hover {
      color: var(--mat-sys-on-surface, #1f2937);
    }
    .theme-toggle__button--active {
      background: var(--mat-sys-surface, #fff);
      color: var(--mat-sys-primary, #2563eb);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }
    .theme-toggle__icon {
      font-size: 1rem;
      line-height: 1;
    }
    @media (max-width: 480px) {
      .theme-toggle__label {
        display: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'theme-toggle-host' },
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeStore);
  protected readonly options = OPTIONS;

  protected select(mode: ThemeMode): void {
    this.theme.setMode(mode);
  }
}
