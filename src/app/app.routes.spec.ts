import { TestBed } from '@angular/core/testing';
import { inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { Location } from '@angular/common';

import { routes } from './app.routes';
import { AuthStore } from './core/auth/auth-store';

describe('Top-level routing', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes, withComponentInputBinding()),
      ],
    });
  });

  it('navigates to /catalog without auth', async () => {
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    await router.navigateByUrl('/catalog');
    expect(location.path()).toBe('/catalog');
  });

  it('navigates to /auth/sign-in without auth', async () => {
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    await router.navigateByUrl('/auth/sign-in');
    expect(location.path()).toBe('/auth/sign-in');
  });

  it('redirects /app/dashboard to /auth/sign-in when unauthenticated', async () => {
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    await router.navigateByUrl('/app/dashboard');
    expect(location.path()).toBe('/auth/sign-in');
  });

  it('allows /app/dashboard when authenticated', async () => {
    const store = TestBed.inject(AuthStore);
    await store.signIn('tester@example.com', 'secret-password');

    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    await router.navigateByUrl('/app/dashboard');
    expect(location.path()).toBe('/app/dashboard');
  });

  it('restores authenticated session from localStorage on app boot', async () => {
    // Arrange: persist a valid session in localStorage BEFORE TestBed bootstraps
    const session = {
      user: { id: 'u_test', email: 'restore@example.com', displayName: 'restore' },
      token: 'mock.token.signature',
      expiresAt: Date.now() + 1000 * 60 * 60 * 8, // 8 hours from now
    };
    localStorage.setItem('auth', JSON.stringify(session));

    // Re-configure TestBed with provideAppInitializer so restore() fires on bootstrap
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes, withComponentInputBinding()),
        provideAppInitializer(() => {
          inject(AuthStore).restore();
        }),
      ],
    });

    // Trigger the APP_INITIALIZER by injecting any token (Router forces init)
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);

    await router.navigateByUrl('/app/dashboard');
    expect(location.path()).toBe('/app/dashboard');
  });
});
