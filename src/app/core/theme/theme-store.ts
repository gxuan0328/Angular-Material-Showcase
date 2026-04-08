import { computed, effect, Injectable, signal, Signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

const STORAGE_KEY = 'theme-mode';
const VALID_MODES: readonly ThemeMode[] = ['light', 'dark', 'system'];

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  private readonly _mode = signal<ThemeMode>(this.readFromStorage());
  private readonly _systemPrefers = signal<EffectiveTheme>(this.readSystemPreference());

  readonly mode: Signal<ThemeMode> = this._mode.asReadonly();

  readonly effectiveMode = computed<EffectiveTheme>(() =>
    this._mode() === 'system' ? this._systemPrefers() : (this._mode() as EffectiveTheme),
  );

  readonly isDark = computed<boolean>(() => this.effectiveMode() === 'dark');

  constructor() {
    this.watchSystemPreference();

    effect(() => {
      const dark = this.isDark();
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', dark);
      }
    });
  }

  setMode(mode: ThemeMode): void {
    this._mode.set(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // localStorage unavailable (private mode) — ignore
    }
  }

  private readFromStorage(): ThemeMode {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return VALID_MODES.includes(raw as ThemeMode) ? (raw as ThemeMode) : 'system';
    } catch {
      return 'system';
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
