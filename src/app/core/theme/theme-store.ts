import { computed, effect, Injectable, signal, Signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

/**
 * Every Material 3 palette we surface in the palette selector. The identifier
 * must match the `data-palette` attribute consumed by `src/styles/themes.scss`.
 */
export type ThemePalette =
  | 'azure'
  | 'blue'
  | 'violet'
  | 'magenta'
  | 'rose'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'chartreuse'
  | 'green'
  | 'spring-green'
  | 'cyan';

export interface ThemePaletteInfo {
  readonly id: ThemePalette;
  readonly label: string;
  /** Representative swatch color (matches the Material $<name>-palette 50 key). */
  readonly swatch: string;
}

/** Ordered list used by the palette selector UI. */
export const THEME_PALETTES: readonly ThemePaletteInfo[] = [
  { id: 'azure', label: '天藍', swatch: '#005cbb' },
  { id: 'blue', label: '藍', swatch: '#1450a6' },
  { id: 'violet', label: '紫羅蘭', swatch: '#6439ba' },
  { id: 'magenta', label: '洋紅', swatch: '#9b2c6f' },
  { id: 'rose', label: '玫瑰', swatch: '#a8264a' },
  { id: 'red', label: '紅', swatch: '#ba1a1a' },
  { id: 'orange', label: '橙', swatch: '#8c4a00' },
  { id: 'yellow', label: '黃', swatch: '#6c5d00' },
  { id: 'chartreuse', label: '嫩綠', swatch: '#4d6600' },
  { id: 'green', label: '綠', swatch: '#1a6c2b' },
  { id: 'spring-green', label: '春綠', swatch: '#006b4f' },
  { id: 'cyan', label: '青', swatch: '#006874' },
] as const;

const MODE_KEY = 'theme-mode';
const PALETTE_KEY = 'theme-palette';
const DEFAULT_PALETTE: ThemePalette = 'azure';
const VALID_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];
const VALID_PALETTES: readonly ThemePalette[] = THEME_PALETTES.map(p => p.id);

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  private readonly _mode = signal<ThemeMode>(this.readModeFromStorage());
  private readonly _palette = signal<ThemePalette>(this.readPaletteFromStorage());
  private readonly _systemPrefers = signal<EffectiveTheme>(this.readSystemPreference());

  readonly mode: Signal<ThemeMode> = this._mode.asReadonly();
  readonly palette: Signal<ThemePalette> = this._palette.asReadonly();

  readonly effectiveMode = computed<EffectiveTheme>(() =>
    this._mode() === 'system' ? this._systemPrefers() : (this._mode() as EffectiveTheme),
  );

  readonly isDark = computed<boolean>(() => this.effectiveMode() === 'dark');

  constructor() {
    this.watchSystemPreference();

    // Apply `.dark` class whenever effective mode flips.
    effect(() => {
      const dark = this.isDark();
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', dark);
      }
    });

    // Apply `data-palette` attribute whenever the palette changes.
    effect(() => {
      const palette = this._palette();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-palette', palette);
      }
    });
  }

  setMode(mode: ThemeMode): void {
    this._mode.set(mode);
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      // localStorage unavailable (private mode) — ignore
    }
  }

  setPalette(palette: ThemePalette): void {
    if (!VALID_PALETTES.includes(palette)) return;
    this._palette.set(palette);
    try {
      localStorage.setItem(PALETTE_KEY, palette);
    } catch {
      // ignore
    }
  }

  private readModeFromStorage(): ThemeMode {
    try {
      const raw = localStorage.getItem(MODE_KEY);
      return VALID_MODES.includes(raw as ThemeMode) ? (raw as ThemeMode) : 'system';
    } catch {
      return 'system';
    }
  }

  private readPaletteFromStorage(): ThemePalette {
    try {
      const raw = localStorage.getItem(PALETTE_KEY);
      return VALID_PALETTES.includes(raw as ThemePalette) ? (raw as ThemePalette) : DEFAULT_PALETTE;
    } catch {
      return DEFAULT_PALETTE;
    }
  }

  private readSystemPreference(): EffectiveTheme {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private watchSystemPreference(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent): void => {
      this._systemPrefers.set(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
  }
}
