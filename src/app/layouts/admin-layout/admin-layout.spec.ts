import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AdminLayout } from './admin-layout';

describe('AdminLayout', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [AdminLayout],
    });
  });

  it('renders topbar, sidenav, and main outlet', async () => {
    const fixture = TestBed.createComponent(AdminLayout);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('header')).toBeTruthy();
    expect(el.querySelector('nav')).toBeTruthy();
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });
});
