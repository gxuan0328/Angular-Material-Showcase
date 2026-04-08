import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';

import { AuthStore } from './auth-store';

export const authMatchGuard: CanMatchFn = (): boolean | UrlTree => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.createUrlTree(['/auth/sign-in']);
};
