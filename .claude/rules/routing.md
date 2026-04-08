---
paths:
  - "**/*.routes.ts"
  - "**/app.routes.ts"
  - "**/*route*.ts"
  - "**/*guard*.ts"
  - "**/*resolver*.ts"
---

# Routing Rules

<!-- Loads when editing routing configuration, guards, or resolvers. -->
<!-- See angular-developer skill references: define-routes.md, loading-strategies.md, route-guards.md, data-resolvers.md, rendering-strategies.md -->

## Lazy Loading (Default)

Lazy load every feature route with dynamic `import()`:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout').then(m => m.Checkout),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
];
```

- Eager-load only the root-level shell component.
- Use `loadComponent` for single-route features.
- Use `loadChildren` for multi-route feature modules.

## Functional Guards (Required)

Use functional guards that run inside an injection context:

```ts
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
```

- Never use class-based guards (`CanActivate` class) in new code.
- Prefer `CanMatch` over `CanActivate` for auth, so unauthorized users cannot even match the route.

## Resolvers

Use `ResolveFn` for pre-fetching critical data before route activation:

```ts
export const userResolver: ResolveFn<User> = (route) => {
  const id = route.paramMap.get('id');
  if (!id) {
    throw new Error('Missing user id');
  }
  return inject(UserService).getUser(id);
};
```

- Resolvers should fail fast — let the router handle the error.
- Avoid resolvers for non-critical data; fetch inside the component with `resource()` instead.

## Router Outlets

- Place `<router-outlet />` where child routes should render.
- Prefer nested routes over named outlets.

## Rendering Strategy

| Strategy | When |
|---|---|
| **CSR** (default) | Dynamic apps with frequent client interaction |
| **SSG / Prerendering** | Marketing, content, documentation pages |
| **SSR with hydration** | SEO-critical dynamic apps, LCP-sensitive pages |

See `angular-developer` skill → `rendering-strategies.md` for configuration details.

## Navigation

- Declarative: `<a [routerLink]="['/users', id()]">`.
- Programmatic: `inject(Router).navigate(['/users', id])`.
- Always use typed path arrays, not string concatenation.
