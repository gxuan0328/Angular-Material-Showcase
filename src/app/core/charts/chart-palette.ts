import { computed, effect, inject, Injectable, signal, Signal, untracked } from '@angular/core';

import { ThemeStore } from '../theme/theme-store';

/**
 * Strongly-typed palette slice consumed by chart.js datasets. Colors map to
 * Material 3 `--mat-sys-*` design tokens so charts stay in lockstep with the
 * rest of the UI — dark mode flip, palette swap, and density changes all
 * reflow automatically.
 */
export interface ChartPalette {
  readonly primary: string;
  readonly secondary: string;
  readonly tertiary: string;
  readonly error: string;
  readonly success: string;
  readonly warning: string;
  readonly surface: string;
  readonly onSurface: string;
  readonly onSurfaceVariant: string;
  readonly outlineVariant: string;
  /** Evenly-spaced categorical colors — good for donut + stacked series. */
  readonly categorical: readonly string[];
}

const DEFAULT_PALETTE: ChartPalette = {
  primary: '#005cbb',
  secondary: '#565e71',
  tertiary: '#343dff',
  error: '#ba1a1a',
  success: '#2e7d32',
  warning: '#ed6c02',
  surface: '#faf9fd',
  onSurface: '#1a1b1f',
  onSurfaceVariant: '#44474e',
  outlineVariant: '#c4c6d0',
  categorical: ['#005cbb', '#343dff', '#2e7d32', '#ed6c02', '#9c27b0', '#0288d1', '#d81b60'],
} as const;

/** CSS variables we read out of `:root` to build the active palette. */
const TOKEN_MAP: Readonly<Record<keyof Omit<ChartPalette, 'categorical'>, string>> = {
  primary: '--mat-sys-primary',
  secondary: '--mat-sys-secondary',
  tertiary: '--mat-sys-tertiary',
  error: '--mat-sys-error',
  success: '--mat-sys-tertiary', // Material 3 has no "success" token — reuse tertiary
  warning: '--mat-sys-error-container',
  surface: '--mat-sys-surface',
  onSurface: '--mat-sys-on-surface',
  onSurfaceVariant: '--mat-sys-on-surface-variant',
  outlineVariant: '--mat-sys-outline-variant',
} as const;

@Injectable({ providedIn: 'root' })
export class ChartPaletteService {
  private readonly theme = inject(ThemeStore);
  private readonly _palette = signal<ChartPalette>(DEFAULT_PALETTE);

  readonly palette: Signal<ChartPalette> = this._palette.asReadonly();

  /** Convenience accessors so callers can subscribe to single colors. */
  readonly primary = computed<string>(() => this.palette().primary);
  readonly categorical = computed<readonly string[]>(() => this.palette().categorical);

  constructor() {
    // Reactive context — re-reads token values whenever the effective theme
    // mode or active palette changes. Runs once on startup so dashboards can
    // pick up real values after first render.
    effect(() => {
      // Dependencies — make the effect track both signals.
      this.theme.effectiveMode();
      if (typeof document === 'undefined') {
        return;
      }
      untracked(() => this.recompute());
    });
  }

  /** Force re-read of CSS variables (e.g., after palette swap). */
  recompute(): void {
    if (typeof document === 'undefined' || typeof getComputedStyle === 'undefined') {
      this._palette.set(DEFAULT_PALETTE);
      return;
    }
    const style = getComputedStyle(document.documentElement);
    const read = (token: string, fallback: string): string => {
      const raw = style.getPropertyValue(token).trim();
      return raw.length > 0 ? raw : fallback;
    };

    const primary = read(TOKEN_MAP.primary, DEFAULT_PALETTE.primary);
    const secondary = read(TOKEN_MAP.secondary, DEFAULT_PALETTE.secondary);
    const tertiary = read(TOKEN_MAP.tertiary, DEFAULT_PALETTE.tertiary);
    const error = read(TOKEN_MAP.error, DEFAULT_PALETTE.error);

    this._palette.set({
      primary,
      secondary,
      tertiary,
      error,
      success: tertiary,
      warning: read(TOKEN_MAP.warning, DEFAULT_PALETTE.warning),
      surface: read(TOKEN_MAP.surface, DEFAULT_PALETTE.surface),
      onSurface: read(TOKEN_MAP.onSurface, DEFAULT_PALETTE.onSurface),
      onSurfaceVariant: read(TOKEN_MAP.onSurfaceVariant, DEFAULT_PALETTE.onSurfaceVariant),
      outlineVariant: read(TOKEN_MAP.outlineVariant, DEFAULT_PALETTE.outlineVariant),
      categorical: [
        primary,
        tertiary,
        secondary,
        error,
        read(TOKEN_MAP.warning, DEFAULT_PALETTE.warning),
        read('--mat-sys-primary-container', '#d7e3ff'),
        read('--mat-sys-tertiary-container', '#e0e0ff'),
      ],
    });
  }

  /**
   * Build a tinted line-chart dataset config using the active palette primary.
   * Returns chart.js-compatible dataset fragments — `data` and `label` remain
   * the caller's responsibility.
   */
  lineDataset(overrides?: {
    borderColor?: string;
    backgroundColor?: string;
  }): Record<string, unknown> {
    const p = this.palette();
    return {
      borderColor: overrides?.borderColor ?? p.primary,
      backgroundColor: overrides?.backgroundColor ?? withAlpha(p.primary, 0.12),
      pointBackgroundColor: p.primary,
      pointBorderColor: p.surface,
      fill: true,
      tension: 0.35,
      borderWidth: 2,
    };
  }

  /** Donut/pie dataset using the categorical palette. */
  donutDataset(length: number): Record<string, unknown> {
    const p = this.palette();
    const colors = extendToLength(p.categorical, length);
    return {
      backgroundColor: colors,
      borderColor: p.surface,
      borderWidth: 2,
      hoverOffset: 8,
    };
  }
}

/** Mix a hex or rgb() color with an alpha channel, producing rgba(...). */
export function withAlpha(color: string, alpha: number): string {
  const clamped = Math.max(0, Math.min(1, alpha));
  const hex = color.trim();
  // #rgb / #rrggbb
  if (hex.startsWith('#')) {
    const rgb = parseHex(hex);
    if (rgb) {
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clamped})`;
    }
  }
  // rgb(a, b, c) / rgba(a, b, c, d) — swap in our alpha
  const match = hex.match(/^rgba?\(([^)]+)\)$/);
  if (match) {
    const parts = match[1]!.split(',').map(s => s.trim());
    const [r, g, b] = parts;
    return `rgba(${r}, ${g}, ${b}, ${clamped})`;
  }
  return hex;
}

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h
      .split('')
      .map(c => c + c)
      .join('');
  }
  if (h.length !== 6) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some(n => Number.isNaN(n))) return null;
  return { r, g, b };
}

function extendToLength(source: readonly string[], length: number): string[] {
  if (length <= source.length) return source.slice(0, length);
  const result: string[] = [];
  for (let i = 0; i < length; i += 1) {
    result.push(source[i % source.length]!);
  }
  return result;
}
