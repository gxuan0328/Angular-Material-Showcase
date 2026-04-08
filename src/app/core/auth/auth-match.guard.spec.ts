import { TestBed } from '@angular/core/testing';
import {
  provideZonelessChangeDetection,
  runInInjectionContext,
  EnvironmentInjector,
} from '@angular/core';
import { provideRouter, Router, UrlTree } from '@angular/router';

import { AuthStore } from './auth-store';
import { authMatchGuard } from './auth-match.guard';

describe('authMatchGuard', () => {
  let injector: EnvironmentInjector;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([]), AuthStore],
    });
    injector = TestBed.inject(EnvironmentInjector);
  });

  it('returns true when authenticated', async () => {
    const store = TestBed.inject(AuthStore);
    await store.signIn('user@example.com', 'secret-password');

    const result = runInInjectionContext(injector, () => authMatchGuard(null as never, []));

    expect(result).toBe(true);
  });

  it('redirects to /auth/sign-in when not authenticated', () => {
    const router = TestBed.inject(Router);
    const expected = router.createUrlTree(['/auth/sign-in']);

    const result = runInInjectionContext(injector, () => authMatchGuard(null as never, []));

    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe(expected.toString());
  });
});
