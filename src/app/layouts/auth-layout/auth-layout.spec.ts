import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AuthLayout } from './auth-layout';

describe('AuthLayout', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
      imports: [AuthLayout],
    });
  });

  it('renders a centered card with router-outlet', async () => {
    const fixture = TestBed.createComponent(AuthLayout);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.auth-layout__card')).toBeTruthy();
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });
});
