import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { AdminLayout } from './admin-layout';

describe('AdminLayout', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideNoopAnimations(), provideRouter([])],
      imports: [AdminLayout],
    });
  });

  it('renders topbar, sidenav, and main outlet', async () => {
    const fixture = TestBed.createComponent(AdminLayout);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('header')).toBeTruthy();
    expect(el.querySelector('mat-sidenav')).toBeTruthy();
    expect(el.querySelector('mat-nav-list')).toBeTruthy();
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });

  it('shows all seven nav items with expected labels', async () => {
    const fixture = TestBed.createComponent(AdminLayout);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const items = el.querySelectorAll('.admin-layout__nav-item');
    expect(items.length).toBe(7);
    const labels = Array.from(items).map(item => (item as HTMLElement).textContent?.trim() ?? '');
    expect(labels.some(l => l.includes('儀表板'))).toBe(true);
    expect(labels.some(l => l.includes('使用者管理'))).toBe(true);
    expect(labels.some(l => l.includes('團隊與成員'))).toBe(true);
    expect(labels.some(l => l.includes('通知中心'))).toBe(true);
    expect(labels.some(l => l.includes('設定'))).toBe(true);
  });

  it('has zero soon items after M4 (all live)', async () => {
    const fixture = TestBed.createComponent(AdminLayout);
    await fixture.whenStable();
    const soonItems = fixture.nativeElement.querySelectorAll('.admin-layout__nav-item--soon');
    // After M4: all 7 nav items are live
    expect(soonItems.length).toBe(0);
  });
});
