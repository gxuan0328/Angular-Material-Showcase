import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { ThemeStore } from './theme-store';

describe('ThemeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-palette');

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

  it('defaults the palette to azure when localStorage is empty', () => {
    const store = create();
    expect(store.palette()).toBe('azure');
  });

  it('restores a previously saved palette from localStorage', () => {
    localStorage.setItem('theme-palette', 'violet');
    const store = create();
    expect(store.palette()).toBe('violet');
  });

  it('setPalette writes to localStorage and updates the data-palette attribute', () => {
    const store = create();
    store.setPalette('rose');
    TestBed.tick();
    expect(store.palette()).toBe('rose');
    expect(localStorage.getItem('theme-palette')).toBe('rose');
    expect(document.documentElement.getAttribute('data-palette')).toBe('rose');
  });

  it('ignores unknown palette identifiers', () => {
    const store = create();
    store.setPalette('neon' as unknown as 'azure');
    expect(store.palette()).toBe('azure');
  });

  it('falls back to azure when stored palette is corrupt', () => {
    localStorage.setItem('theme-palette', 'neon');
    const store = create();
    expect(store.palette()).toBe('azure');
  });
});
