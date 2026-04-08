import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { ThemeStore } from './theme-store';

describe('ThemeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');

    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ThemeStore],
    });
  });

  function create(): ThemeStore {
    return TestBed.inject(ThemeStore);
  }

  it('defaults to system mode when localStorage is empty', () => {
    const store = create();
    expect(store.mode()).toBe('system');
  });

  it('restores previously saved mode from localStorage', () => {
    localStorage.setItem('theme-mode', 'dark');
    const store = create();
    expect(store.mode()).toBe('dark');
    expect(store.isDark()).toBe(true);
  });

  it('writes to localStorage when setMode is called', () => {
    const store = create();
    store.setMode('light');
    expect(localStorage.getItem('theme-mode')).toBe('light');
    expect(store.mode()).toBe('light');
    expect(store.isDark()).toBe(false);
  });

  it('toggles the document root `dark` class when effective mode is dark', () => {
    const store = create();
    store.setMode('dark');
    // Flush the constructor effect synchronously (Angular 20+ TestBed API)
    TestBed.tick();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('ignores corrupt localStorage values and falls back to system', () => {
    localStorage.setItem('theme-mode', 'neon');
    const store = create();
    expect(store.mode()).toBe('system');
  });
});
