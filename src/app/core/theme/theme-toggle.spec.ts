import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { ThemeStore } from './theme-store';

import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ThemeStore],
      imports: [ThemeToggle],
    });
  });

  it('renders 3 radio buttons for light / dark / system', async () => {
    const fixture = TestBed.createComponent(ThemeToggle);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const buttons = el.querySelectorAll<HTMLButtonElement>('.theme-toggle__button');
    expect(buttons.length).toBe(3);
    expect(Array.from(buttons).map(b => b.getAttribute('title'))).toEqual([
      '亮色',
      '暗色',
      '跟隨系統',
    ]);
  });

  it('marks the currently active mode', async () => {
    const store = TestBed.inject(ThemeStore);
    store.setMode('dark');
    TestBed.tick();

    const fixture = TestBed.createComponent(ThemeToggle);
    await fixture.whenStable();
    const active = fixture.nativeElement.querySelector('.theme-toggle__button--active');
    expect(active?.getAttribute('title')).toBe('暗色');
  });

  it('changes ThemeStore.mode when a button is clicked', async () => {
    const store = TestBed.inject(ThemeStore);
    const fixture = TestBed.createComponent(ThemeToggle);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    const buttons = el.querySelectorAll<HTMLButtonElement>('.theme-toggle__button');
    // Second button is 'dark'
    buttons[1].click();
    TestBed.tick();
    expect(store.mode()).toBe('dark');
  });
});
