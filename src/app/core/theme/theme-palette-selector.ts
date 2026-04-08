import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { OverlayModule, CdkOverlayOrigin } from '@angular/cdk/overlay';

import { ThemePalette, ThemeStore, THEME_PALETTES } from './theme-store';

/**
 * Compact palette picker that opens an overlay grid of all Material 3
 * palettes. Clicking a swatch persists the choice via ThemeStore; the
 * selector is keyboard-accessible and closes on outside click / Escape.
 */
@Component({
  selector: 'app-theme-palette-selector',
  imports: [OverlayModule],
  template: `
    <button
      type="button"
      class="palette-trigger"
      [class.palette-trigger--open]="isOpen()"
      cdkOverlayOrigin
      #trigger="cdkOverlayOrigin"
      [attr.aria-expanded]="isOpen()"
      aria-haspopup="dialog"
      aria-label="切換主題色調"
      (click)="toggle()"
    >
      <span
        class="palette-trigger__swatch"
        aria-hidden="true"
        [style.background]="swatchColor()"
      ></span>
      <span class="material-symbols-outlined palette-trigger__icon" aria-hidden="true"
        >palette</span
      >
    </button>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayHasBackdrop]="true"
      cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
      [cdkConnectedOverlayPositions]="overlayPositions"
      (backdropClick)="close()"
      (detach)="close()"
    >
      <div
        class="palette-popover"
        role="dialog"
        aria-label="主題色調選擇"
        (keydown.escape)="close()"
      >
        <p class="palette-popover__title">主題色調</p>
        <p class="palette-popover__hint">Material 3 色板 · 全域生效</p>
        <div class="palette-popover__grid">
          @for (option of palettes; track option.id) {
            <button
              type="button"
              class="palette-swatch"
              [class.palette-swatch--active]="theme.palette() === option.id"
              [attr.aria-label]="option.label"
              [attr.aria-pressed]="theme.palette() === option.id"
              [attr.title]="option.label"
              (click)="select(option.id)"
            >
              <span class="palette-swatch__dot" [style.background]="option.swatch"></span>
              <span class="palette-swatch__label">{{ option.label }}</span>
            </button>
          }
        </div>
      </div>
    </ng-template>
  `,
  styles: `
    :host {
      display: inline-block;
    }
    .palette-trigger {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.625rem;
      background: var(--mat-sys-surface-container, #f3f4f6);
      color: var(--mat-sys-on-surface-variant, #44474e);
      border: 1px solid transparent;
      border-radius: 9999px;
      cursor: pointer;
      font-size: 0.8125rem;
      transition:
        background 160ms ease,
        border-color 160ms ease;
    }
    .palette-trigger:hover {
      background: var(--mat-sys-surface-container-high, #e9e7eb);
    }
    .palette-trigger:focus-visible {
      outline: 2px solid var(--mat-sys-primary, #005cbb);
      outline-offset: 2px;
    }
    .palette-trigger--open {
      border-color: var(--mat-sys-primary, #005cbb);
    }
    .palette-trigger__swatch {
      display: inline-block;
      width: 18px;
      height: 18px;
      border-radius: 9999px;
      border: 2px solid var(--mat-sys-surface, #fff);
      box-shadow: 0 0 0 1px var(--mat-sys-outline-variant, #c4c6d0);
    }
    .palette-trigger__icon {
      font-size: 1.125rem;
      line-height: 1;
    }

    .palette-popover {
      margin-top: 0.5rem;
      padding: 1rem;
      width: 280px;
      background: var(--mat-sys-surface-container-low, #f4f3f6);
      color: var(--mat-sys-on-surface, #1a1b1f);
      border: 1px solid var(--mat-sys-outline-variant, #c4c6d0);
      border-radius: 16px;
      box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.12),
        0 2px 6px rgba(0, 0, 0, 0.08);
    }
    .palette-popover__title {
      margin: 0;
      font-size: 0.9375rem;
      font-weight: 600;
    }
    .palette-popover__hint {
      margin: 0.125rem 0 0.75rem;
      font-size: 0.75rem;
      color: var(--mat-sys-on-surface-variant, #44474e);
    }
    .palette-popover__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
    }
    .palette-swatch {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      padding: 0.5rem 0.25rem;
      border: 1px solid transparent;
      background: var(--mat-sys-surface-container, #f3f4f6);
      border-radius: 10px;
      cursor: pointer;
      transition:
        transform 160ms ease,
        border-color 160ms ease;
    }
    .palette-swatch:hover {
      transform: translateY(-1px);
      border-color: var(--mat-sys-outline-variant, #c4c6d0);
    }
    .palette-swatch:focus-visible {
      outline: 2px solid var(--mat-sys-primary, #005cbb);
      outline-offset: 2px;
    }
    .palette-swatch--active {
      border-color: var(--mat-sys-primary, #005cbb);
      background: var(--mat-sys-primary-container, #d7e3ff);
    }
    .palette-swatch__dot {
      display: inline-block;
      width: 24px;
      height: 24px;
      border-radius: 9999px;
      border: 2px solid var(--mat-sys-surface, #fff);
      box-shadow: 0 0 0 1px var(--mat-sys-outline-variant, #c4c6d0);
    }
    .palette-swatch__label {
      font-size: 0.6875rem;
      font-weight: 500;
      color: var(--mat-sys-on-surface, #1a1b1f);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'theme-palette-selector-host' },
})
export class ThemePaletteSelector {
  protected readonly theme = inject(ThemeStore);
  protected readonly palettes = THEME_PALETTES;
  protected readonly isOpen = signal<boolean>(false);

  protected readonly overlayPositions = [
    {
      originX: 'end' as const,
      originY: 'bottom' as const,
      overlayX: 'end' as const,
      overlayY: 'top' as const,
      offsetY: 8,
    },
    {
      originX: 'end' as const,
      originY: 'top' as const,
      overlayX: 'end' as const,
      overlayY: 'bottom' as const,
      offsetY: -8,
    },
  ];

  protected swatchColor(): string {
    const active = this.theme.palette();
    const info = THEME_PALETTES.find(p => p.id === active);
    return info?.swatch ?? '#005cbb';
  }

  protected toggle(): void {
    this.isOpen.update(v => !v);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected select(id: ThemePalette): void {
    this.theme.setPalette(id);
  }

  protected readonly _origin = CdkOverlayOrigin;
}
