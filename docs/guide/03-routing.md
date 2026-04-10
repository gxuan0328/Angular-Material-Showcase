# 第三章：路由 (Routing)

> **目標讀者**：熟悉 .NET/C# 的後端工程師，首次接觸 Angular 19+ 前端框架。
> 本章涵蓋路由設定、延遲載入、守衛、巢狀路由、參數處理、預載策略與完整範例。

---

## 目錄

1. [路由設定](#1-路由設定)
2. [延遲載入](#2-延遲載入)
3. [路由守衛](#3-路由守衛)
4. [巢狀路由](#4-巢狀路由)
5. [路由參數](#5-路由參數)
6. [Router 服務](#6-router-服務)
7. [ActivatedRoute](#7-activatedroute)
8. [預載策略](#8-預載策略)
9. [Route Reuse Strategy](#9-route-reuse-strategy)
10. [完整範例：Admin Panel 路由](#10-完整範例admin-panel-路由)
11. [常見陷阱](#11-常見陷阱)

---

## 1. 路由設定

### 1.1 概觀

Angular 的路由系統負責將 URL 對應到元件，管理應用程式的頁面導航。

> **C# 對照**：
> - Angular 的 `Routes` ≈ ASP.NET Core 的 `app.MapGet()` / `app.MapControllerRoute()`
> - Angular 的 `Router` ≈ ASP.NET Core 的 `IUrlHelper` + Middleware pipeline
> - Angular 的 Route Guards ≈ ASP.NET Core 的 `[Authorize]` + Policy

### 1.2 `provideRouter()` vs `RouterModule`

```typescript
// ✅ Modern: provideRouter() — used with standalone bootstrapping
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),  // Enable route params → component inputs
    ),
  ],
};

// ❌ Legacy: RouterModule — used with NgModule bootstrapping
// app.module.ts
@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppModule {}
```

**`provideRouter()` 的 Feature Functions**：

| Feature Function | 說明 |
|-----------------|------|
| `withComponentInputBinding()` | 將路由參數自動繫結到元件 `input()` |
| `withPreloading(strategy)` | 設定預載策略 |
| `withHashLocation()` | 使用 Hash URL（`/#/path`） |
| `withInMemoryScrolling()` | 控制路由導航時的捲動行為 |
| `withRouterConfig()` | 全域路由設定 |
| `withViewTransitions()` | 啟用 View Transitions API 動畫 |
| `withNavigationErrorHandler()` | 全域導航錯誤處理 |

### 1.3 Route 設定屬性完整參考

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // --- Basic route ---
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage),
    title: 'Dashboard',
  },

  // --- Route with all properties ---
  {
    path: 'users/:id',                     // URL path with parameter
    loadComponent: () =>                    // Lazy-loaded component
      import('./users/user-detail.page').then(m => m.UserDetailPage),
    title: 'User Detail',                  // HTML <title> tag
    canActivate: [authGuard],              // Guards (array of functions)
    canDeactivate: [unsavedChangesGuard],
    canMatch: [featureFlagGuard],
    resolve: {                             // Data resolvers
      user: userResolver,
    },
    data: {                                // Static data
      breadcrumb: 'User Detail',
      requiredRole: 'admin',
    },
  },

  // --- Redirect ---
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',                     // 'full' or 'prefix'
  },

  // --- Children routes ---
  {
    path: 'admin',
    loadChildren: () =>                    // Lazy-loaded child routes
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [adminGuard],
  },

  // --- Wildcard (404) ---
  {
    path: '**',
    loadComponent: () => import('./not-found.page').then(m => m.NotFoundPage),
    title: 'Page Not Found',
  },
];
```

### 1.4 Route 屬性對照表

| 屬性 | 型別 | 說明 | C# 對照 |
|------|------|------|---------|
| `path` | `string` | URL 路徑片段 | `[Route("api/users/{id}")]` |
| `component` | `Type` | 立即載入的元件 | Controller action |
| `loadComponent` | `() => Promise<Type>` | 延遲載入的元件 | Lazy loading |
| `loadChildren` | `() => Promise<Routes>` | 延遲載入子路由 | Area routing |
| `redirectTo` | `string` | 重導向目標 | `Redirect()` |
| `pathMatch` | `'full' \| 'prefix'` | 路徑匹配策略 | Route constraint |
| `canActivate` | `CanActivateFn[]` | 進入守衛 | `[Authorize]` |
| `canDeactivate` | `CanDeactivateFn[]` | 離開守衛 | — |
| `canMatch` | `CanMatchFn[]` | 路由匹配守衛 | Feature flag middleware |
| `resolve` | `Record<string, ResolveFn>` | 資料預載解析器 | Action filter |
| `data` | `Record<string, unknown>` | 靜態資料 | Route metadata |
| `title` | `string \| ResolveFn<string>` | 頁面標題 | — |
| `providers` | `Provider[]` | 路由級 DI providers | Scoped services |
| `children` | `Routes` | 子路由 | Area routes |

---

## 2. 延遲載入

### 2.1 為什麼需要延遲載入？

延遲載入 (Lazy Loading) 將應用程式分割成多個 JavaScript bundle。使用者只在需要時才下載對應的程式碼，大幅減少初始載入時間。

> **C# 對照**：類似 .NET 的 Assembly Lazy Loading（`Assembly.LoadFrom()`），只在需要時才載入 DLL。

### 2.2 `loadComponent()` — 延遲載入元件

```typescript
export const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.page').then(m => m.ProfilePage),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.page').then(m => m.SettingsPage),
  },
];
```

**建構時的效果**：
```
dist/
├── main.js              ← Initial bundle (shared code + routes config)
├── chunk-PROFILE.js     ← Loaded only when user navigates to /profile
├── chunk-SETTINGS.js    ← Loaded only when user navigates to /settings
└── ...
```

### 2.3 `loadChildren()` — 延遲載入子路由

適用於功能模組有多個頁面的場景。

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
];

// admin/admin.routes.ts
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin-dashboard.page').then(m => m.AdminDashboardPage),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./admin-users.page').then(m => m.AdminUsersPage),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./admin-reports.page').then(m => m.AdminReportsPage),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
```

### 2.4 Chunk 命名

Angular CLI 預設使用 hash-based 檔名（如 `chunk-XYZABC.js`）。可透過 magic comments 自訂命名：

```typescript
// Named chunk for debugging (webpack — Angular CLI uses esbuild in v19+)
{
  path: 'reports',
  loadComponent: () =>
    import(/* webpackChunkName: "reports" */ './reports/reports.page')
      .then(m => m.ReportsPage),
}
```

> **注意**：Angular 19+ 預設使用 esbuild，chunk 命名策略由構建工具控制。在大多數情況下，預設命名已足夠。

### 2.5 延遲載入的效能影響

```
未使用延遲載入:
  main.js: 2.5 MB  ← 使用者首次載入需要下載所有程式碼
  首次載入時間: 3-5 秒

使用延遲載入:
  main.js: 800 KB   ← 只包含首頁需要的程式碼
  admin.js: 600 KB  ← 只有管理員需要
  reports.js: 400 KB ← 只有檢視報表時需要
  首次載入時間: 1-2 秒
```

---

## 3. 路由守衛

### 3.1 概觀

路由守衛是路由導航的「中間件」，在導航發生前或後執行檢查邏輯。Angular 19+ 推薦使用 **函式型守衛 (Functional Guards)**。

> **C# 對照**：
> - `CanActivateFn` ≈ `[Authorize(Policy = "AdminOnly")]`
> - `CanDeactivateFn` ≈ 離開頁面前的確認對話框
> - `CanMatchFn` ≈ Feature Flag Middleware
> - `ResolveFn` ≈ Action Filter 的 `OnActionExecuting`

### 3.2 `CanActivateFn` — 進入守衛

```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// Basic auth guard
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login with return URL
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

// Role-based guard using route data
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['requiredRole'] as string;

  const user = authService.user();
  if (user && user.role === requiredRole) {
    return true;
  }

  return router.createUrlTree(['/forbidden']);
};

// Usage in route config
export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin.page').then(m => m.AdminPage),
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'admin' },
  },
];
```

**返回值**：

| 返回值 | 效果 |
|--------|------|
| `true` | 允許導航 |
| `false` | 取消導航 |
| `UrlTree` | 取消當前導航，重導向到新的 URL |
| `Observable<boolean \| UrlTree>` | 非同步守衛 |
| `Promise<boolean \| UrlTree>` | 非同步守衛 |

### 3.3 `CanDeactivateFn` — 離開守衛

防止使用者在有未儲存變更時離開頁面。

```typescript
import { CanDeactivateFn } from '@angular/router';

// Define an interface for components with unsaved changes
export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (
  component,
  _currentRoute,
  _currentState,
  _nextState,
) => {
  if (component.hasUnsavedChanges()) {
    return window.confirm(
      'You have unsaved changes. Are you sure you want to leave?'
    );
  }
  return true;
};

// Usage in component
@Component({
  selector: 'app-edit-post',
  template: `
    <form>
      <textarea [(ngModel)]="content" name="content"></textarea>
      <button (click)="save()">Save</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPost implements HasUnsavedChanges {
  protected content = '';
  private savedContent = '';

  hasUnsavedChanges(): boolean {
    return this.content !== this.savedContent;
  }

  protected save(): void {
    this.savedContent = this.content;
    // ... save to server
  }
}

// Route config
{
  path: 'posts/:id/edit',
  loadComponent: () => import('./edit-post').then(m => m.EditPost),
  canDeactivate: [unsavedChangesGuard],
}
```

> **C# 對照**：類似在網頁上使用 `window.onbeforeunload` 或 Blazor 的 `NavigationLock`。

### 3.4 `CanMatchFn` — 路由匹配守衛

在路由匹配階段執行，決定此路由是否應該被考慮。適用於 A/B 測試和 Feature Flag。

```typescript
import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';

export const featureFlagGuard = (featureName: string): CanMatchFn => {
  return () => {
    const featureService = inject(FeatureFlagService);
    return featureService.isEnabled(featureName);
  };
};

// Usage: two routes with the same path but different guards
export const routes: Routes = [
  {
    path: 'checkout',
    canMatch: [featureFlagGuard('new-checkout')],
    loadComponent: () =>
      import('./checkout-v2/checkout-v2.page').then(m => m.CheckoutV2Page),
  },
  {
    path: 'checkout',
    // Fallback — no canMatch, always matches if v2 is disabled
    loadComponent: () =>
      import('./checkout/checkout.page').then(m => m.CheckoutPage),
  },
];
```

> **C# 對照**：類似 ASP.NET Core 的 `IEndpointFilter` 或 Feature Management 的 `[FeatureGate("new-checkout")]`。

### 3.5 `ResolveFn` — 資料解析器

在導航完成前預先載入資料。

```typescript
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

export const userResolver: ResolveFn<User> = (route) => {
  const userService = inject(UserService);
  const userId = route.paramMap.get('id')!;
  return userService.getById(userId);
};

export const userPostsResolver: ResolveFn<Post[]> = (route) => {
  const postService = inject(PostService);
  const userId = route.paramMap.get('id')!;
  return postService.getByUserId(userId);
};

// Route config
{
  path: 'users/:id',
  loadComponent: () => import('./user-detail.page').then(m => m.UserDetailPage),
  resolve: {
    user: userResolver,
    posts: userPostsResolver,
  },
}

// Accessing resolved data in the component
@Component({
  selector: 'app-user-detail-page',
  template: `
    <h1>{{ user().name }}</h1>
    @for (post of posts(); track post.id) {
      <app-post-card [post]="post" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailPage {
  // With withComponentInputBinding(), resolved data is auto-bound to inputs
  readonly user = input.required<User>();
  readonly posts = input.required<Post[]>();
}
```

> **C# 對照**：類似 ASP.NET Core 的 `[FromRoute]` 搭配 Action Filter 的 `OnActionExecutionAsync`，在進入 Controller Action 之前準備好資料。

### 3.6 組合守衛

```typescript
// Higher-order guard factory
export function composeGuards(...guards: CanActivateFn[]): CanActivateFn {
  return (route, state) => {
    for (const guard of guards) {
      const result = guard(route, state);
      if (result !== true) {
        return result;
      }
    }
    return true;
  };
}

// Usage
{
  path: 'admin/settings',
  canActivate: [composeGuards(authGuard, roleGuard)],
  data: { requiredRole: 'admin' },
}
```

---

## 4. 巢狀路由

### 4.1 概觀

巢狀路由讓你在父元件中嵌入 `<router-outlet>`，實現佈局共享。

> **C# 對照**：類似 ASP.NET Core Razor Pages 的 `_Layout.cshtml`，子頁面嵌入在 Layout 的 `@RenderBody()` 位置。

### 4.2 佈局元件

```typescript
// admin-layout.ts
@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <nav>
          <a routerLink="dashboard"
             routerLinkActive="active"
             [routerLinkActiveOptions]="{ exact: true }">
            Dashboard
          </a>
          <a routerLink="users" routerLinkActive="active">
            Users
          </a>
          <a routerLink="settings" routerLinkActive="active">
            Settings
          </a>
        </nav>
      </aside>

      <main class="content">
        <!-- Child routes render here -->
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    .admin-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      min-height: 100vh;
    }
    .sidebar { background: #f5f5f5; padding: 16px; }
    .sidebar a {
      display: block;
      padding: 8px 16px;
      text-decoration: none;
      color: inherit;
      border-radius: 4px;
    }
    .sidebar a.active {
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }
    .content { padding: 24px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayout {}
```

### 4.3 多層巢狀

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout').then(m => m.MainLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then(m => m.DashboardPage),
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./admin/admin-layout').then(m => m.AdminLayout),
        canActivate: [authGuard, adminGuard],
        children: [
          {
            path: 'users',
            loadComponent: () =>
              import('./admin/users/user-list.page').then(m => m.UserListPage),
            children: [
              {
                path: ':id',
                loadComponent: () =>
                  import('./admin/users/user-detail.page').then(m => m.UserDetailPage),
              },
            ],
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./admin/settings/settings.page').then(m => m.SettingsPage),
          },
          { path: '', redirectTo: 'users', pathMatch: 'full' },
        ],
      },
    ],
  },
];
```

**URL 結構**：
```
/                          → MainLayout > redirect to /dashboard
/dashboard                 → MainLayout > DashboardPage
/admin/users               → MainLayout > AdminLayout > UserListPage
/admin/users/123           → MainLayout > AdminLayout > UserListPage > UserDetailPage
/admin/settings            → MainLayout > AdminLayout > SettingsPage
```

### 4.4 Feature Routing（功能路由）

將路由按功能模組拆分，每個功能模組有自己的路由設定檔。

```
src/app/
├── app.routes.ts                  ← Top-level routes
├── auth/
│   └── auth.routes.ts             ← /login, /register, /forgot-password
├── dashboard/
│   └── dashboard.routes.ts        ← /dashboard
├── admin/
│   ├── admin.routes.ts            ← /admin/*
│   ├── users/
│   │   └── users.routes.ts        ← /admin/users/*
│   └── settings/
│       └── settings.routes.ts     ← /admin/settings/*
└── products/
    └── products.routes.ts         ← /products/*
```

```typescript
// app.routes.ts — top level only defines entry points
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.routes').then(m => m.PRODUCT_ROUTES),
  },
  {
    path: '**',
    loadComponent: () => import('./not-found.page').then(m => m.NotFoundPage),
  },
];
```

---

## 5. 路由參數

### 5.1 路徑參數 (Path Parameters)

```typescript
// Route config
{ path: 'users/:userId/posts/:postId', component: PostDetail }

// URL: /users/42/posts/101
```

**存取方式一：透過 `input()` 與 `withComponentInputBinding()`**：

```typescript
// ✅ Recommended in Angular 19+ — cleanest approach
@Component({
  selector: 'app-post-detail',
  template: `<h1>User {{ userId() }}, Post {{ postId() }}</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetail {
  // Route params are automatically bound to inputs with matching names
  readonly userId = input.required<string>();
  readonly postId = input.required<string>();
}
```

> **前提**：必須在 `provideRouter()` 中啟用 `withComponentInputBinding()`。

**存取方式二：透過 `ActivatedRoute`**：

```typescript
@Component({
  selector: 'app-post-detail',
  template: `<h1>User {{ userId() }}, Post {{ postId() }}</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetail {
  private readonly route = inject(ActivatedRoute);

  // Snapshot — one-time read (doesn't react to param changes)
  protected readonly userId = signal(this.route.snapshot.paramMap.get('userId')!);

  // Observable — reacts to param changes (when same component is reused)
  protected readonly postId = signal('');

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.postId.set(params.get('postId')!);
    });
  }
}
```

### 5.2 查詢參數 (Query Parameters)

```typescript
// URL: /products?category=electronics&sort=price&page=2

@Component({
  selector: 'app-product-list',
  template: `
    <p>Category: {{ category() }}</p>
    <p>Sort: {{ sort() }}</p>
    <p>Page: {{ page() }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  // With withComponentInputBinding(), query params bind to inputs too
  readonly category = input<string>('');
  readonly sort = input<string>('name');
  readonly page = input<string>('1');
}
```

**透過 Router 導航設定查詢參數**：

```typescript
@Component({ /* ... */ })
export class ProductFilter {
  private readonly router = inject(Router);

  applyFilter(category: string): void {
    this.router.navigate(['/products'], {
      queryParams: { category, page: 1 },
      queryParamsHandling: 'merge', // Preserve existing query params
    });
  }
}
```

**queryParamsHandling 選項**：

| 選項 | 說明 |
|------|------|
| `''`（預設） | 替換所有查詢參數 |
| `'merge'` | 合併新舊查詢參數 |
| `'preserve'` | 保留現有查詢參數，忽略新的 |

### 5.3 Matrix Parameters（矩陣參數）

```typescript
// URL: /users;role=admin;status=active/42
// Less common but useful for segment-specific parameters

// Route config
{ path: 'users/:id', component: UserDetail }

// Navigation
this.router.navigate(['/users', { role: 'admin', status: 'active' }, '42']);

// Accessing in component
const role = this.route.snapshot.paramMap.get('role'); // 'admin'
```

> **注意**：Matrix parameters 在實務中較少使用。大多數場景建議使用查詢參數。

### 5.4 Fragment（片段識別符）

```typescript
// URL: /docs/getting-started#installation

// Navigation
this.router.navigate(['/docs/getting-started'], {
  fragment: 'installation',
});

// Accessing fragment
const fragment = this.route.snapshot.fragment; // 'installation'

// Or reactively
this.route.fragment.subscribe(f => {
  if (f) {
    document.getElementById(f)?.scrollIntoView({ behavior: 'smooth' });
  }
});
```

### 5.5 `paramMap` vs `params`

| API | 型別 | 推薦 | 說明 |
|-----|------|------|------|
| `paramMap` | `ParamMap` | ✅ | 提供 `get()`、`has()`、`getAll()` 方法 |
| `params` | `Params` | ❌ | 簡單物件，取值不安全 |

```typescript
// ✅ Recommended: paramMap
const id = route.snapshot.paramMap.get('id');        // string | null
const has = route.snapshot.paramMap.has('id');        // boolean
const all = route.snapshot.paramMap.getAll('tag');    // string[]

// ❌ Legacy: params
const id = route.snapshot.params['id'];               // any — not type-safe
```

---

## 6. Router 服務

### 6.1 `navigate()` — 陣列導航

```typescript
@Component({ /* ... */ })
export class Navigation {
  private readonly router = inject(Router);

  goToUser(userId: string): void {
    // Absolute path
    this.router.navigate(['/users', userId]);
    // Result: /users/123

    // Relative path (needs ActivatedRoute)
    const route = inject(ActivatedRoute);
    this.router.navigate(['edit'], { relativeTo: route });
    // If current URL is /users/123, result: /users/123/edit

    // With query params
    this.router.navigate(['/search'], {
      queryParams: { q: 'angular', page: 1 },
    });
    // Result: /search?q=angular&page=1
  }
}
```

### 6.2 `navigateByUrl()` — 完整 URL 導航

```typescript
// Navigate using a full URL string
this.router.navigateByUrl('/admin/users/123?tab=posts#recent');

// UrlTree-based navigation
const urlTree = this.router.createUrlTree(['/admin/users', 123], {
  queryParams: { tab: 'posts' },
  fragment: 'recent',
});
this.router.navigateByUrl(urlTree);
```

### 6.3 Router Events — 導航事件

```typescript
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  GuardsCheckEnd,
  ResolveEnd,
} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    @if (isNavigating()) {
      <app-progress-bar />
    }
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly router = inject(Router);
  protected readonly isNavigating = signal(false);

  constructor() {
    // Show/hide loading indicator based on navigation events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating.set(true);
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isNavigating.set(false);
      }
    });

    // Track page views for analytics
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEnd = event as NavigationEnd;
        console.log('Page view:', navEnd.urlAfterRedirects);
        // analytics.trackPageView(navEnd.urlAfterRedirects);
      });
  }
}
```

**常用路由事件**：

| 事件 | 觸發時機 |
|------|---------|
| `NavigationStart` | 導航開始 |
| `RoutesRecognized` | 路由匹配完成 |
| `GuardsCheckStart` | 守衛開始執行 |
| `GuardsCheckEnd` | 守衛執行完畢 |
| `ResolveStart` | Resolver 開始執行 |
| `ResolveEnd` | Resolver 執行完畢 |
| `NavigationEnd` | 導航成功完成 |
| `NavigationCancel` | 導航被取消（守衛返回 false） |
| `NavigationError` | 導航出錯 |

---

## 7. ActivatedRoute

### 7.1 概觀

`ActivatedRoute` 提供當前路由的所有資訊，包括參數、查詢參數、資料等。

### 7.2 Snapshot vs Observable

| 存取方式 | 適用場景 | API |
|---------|---------|-----|
| Snapshot | 只需讀取一次（元件不會被重用） | `route.snapshot.paramMap` |
| Observable | 需要反應參數變化（元件被重用） | `route.paramMap` |

```typescript
@Component({ /* ... */ })
export class UserDetail {
  private readonly route = inject(ActivatedRoute);

  // --- Snapshot (one-time read) ---
  private readonly userId = this.route.snapshot.paramMap.get('id')!;

  // --- Observable (reactive to changes) ---
  protected readonly currentUserId = signal('');

  constructor() {
    // When navigating from /users/1 to /users/2, Angular reuses the same
    // component instance. Snapshot won't update, but observable will.
    this.route.paramMap.subscribe(params => {
      this.currentUserId.set(params.get('id')!);
    });
  }
}
```

### 7.3 ActivatedRoute 屬性一覽

```typescript
@Component({ /* ... */ })
export class RouteInspector {
  private readonly route = inject(ActivatedRoute);

  constructor() {
    // Path parameters: /users/:id → { id: '42' }
    this.route.paramMap.subscribe(params => {
      console.log('Path params:', params.get('id'));
    });

    // Query parameters: /users?sort=name → { sort: 'name' }
    this.route.queryParamMap.subscribe(params => {
      console.log('Query params:', params.get('sort'));
    });

    // Fragment: /users#section1 → 'section1'
    this.route.fragment.subscribe(fragment => {
      console.log('Fragment:', fragment);
    });

    // Static data from route config
    this.route.data.subscribe(data => {
      console.log('Route data:', data);
      // { breadcrumb: '...', requiredRole: '...' }
    });

    // Resolved data
    this.route.data.subscribe(data => {
      console.log('Resolved user:', data['user']);
    });

    // URL segments
    this.route.url.subscribe(segments => {
      console.log('URL segments:', segments.map(s => s.path));
    });

    // Route config
    console.log('Route config:', this.route.routeConfig);

    // Parent route
    console.log('Parent:', this.route.parent);

    // Children routes
    console.log('Children:', this.route.children);
  }
}
```

### 7.4 使用 `toSignal()` 轉換

```typescript
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({ /* ... */ })
export class UserDetail {
  private readonly route = inject(ActivatedRoute);

  // Convert route observables to signals for cleaner template usage
  protected readonly userId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id')!)),
    { initialValue: '' }
  );

  protected readonly sortBy = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('sort') ?? 'name')),
    { initialValue: 'name' }
  );
}
```

---

## 8. 預載策略

### 8.1 概觀

預載策略決定延遲載入的 chunk 何時被下載，影響使用者首次導航到延遲載入路由的速度。

### 8.2 `NoPreloading`（預設）

```typescript
import { provideRouter, NoPreloading, withPreloading } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(NoPreloading), // Default — only load on navigation
    ),
  ],
};
```

| 特性 | 說明 |
|------|------|
| **行為** | 只在使用者實際導航時才載入 |
| **首次載入** | 最快 |
| **後續導航** | 首次導航到該路由時會有載入延遲 |
| **適用** | 大型應用、行動裝置、頻寬受限 |

### 8.3 `PreloadAllModules`

```typescript
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
    ),
  ],
};
```

| 特性 | 說明 |
|------|------|
| **行為** | 初始頁面載入完成後，背景預載所有延遲路由 |
| **首次載入** | 與不預載相同 |
| **後續導航** | 即時（已預載） |
| **適用** | 中小型應用、桌面環境 |

### 8.4 自訂預載策略

```typescript
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

// Strategy: only preload routes marked with data.preload = true
@Injectable({ providedIn: 'root' })
export class SelectivePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (route.data?.['preload']) {
      // Optional delay to avoid competing with initial load
      const delay = route.data?.['preloadDelay'] ?? 2000;
      return timer(delay).pipe(mergeMap(() => load()));
    }
    return of(null);
  }
}

// Route config
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard.page').then(m => m.DashboardPage),
    data: { preload: true }, // Will be preloaded
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings.page').then(m => m.SettingsPage),
    data: { preload: true, preloadDelay: 5000 }, // Preload after 5 seconds
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
    // No preload flag — won't be preloaded
  },
];

// App config
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(SelectivePreloadStrategy),
    ),
  ],
};
```

### 8.5 Quicklink 策略（基於可視範圍）

類似 Google 的 Quicklink，只預載使用者可視範圍內連結的路由。

```typescript
// Concept: preload routes whose links are visible on screen
@Injectable({ providedIn: 'root' })
export class QuicklinkStrategy implements PreloadingStrategy {
  private readonly preloadQueue = new Set<string>();

  // Called by a directive that observes routerLink visibility
  addToQueue(path: string): void {
    this.preloadQueue.add(path);
  }

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (route.path && this.preloadQueue.has(route.path)) {
      return load();
    }
    return of(null);
  }
}
```

### 8.6 預載策略決策表

| 策略 | 首次載入 | 後續導航 | 頻寬消耗 | 適用場景 |
|------|---------|---------|---------|---------|
| `NoPreloading` | 最快 | 有延遲 | 最低 | 行動裝置、大型應用 |
| `PreloadAllModules` | 最快 | 即時 | 高 | 中小型桌面應用 |
| `SelectivePreload` | 最快 | 標記的即時 | 中 | 多數專案的最佳選擇 |
| `Quicklink` | 最快 | 可見的即時 | 低-中 | 使用者行為導向 |

---

## 9. Route Reuse Strategy

### 9.1 概觀

`RouteReuseStrategy` 控制 Angular 是否快取並重用已造訪的路由元件。預設行為是每次導航都建立新的元件實例。

> **使用場景**：Tab 式導航、使用者在清單和詳情頁面之間頻繁切換。

### 9.2 自訂 Route Reuse Strategy

```typescript
import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class TabRouteReuseStrategy implements RouteReuseStrategy {
  private readonly cache = new Map<string, DetachedRouteHandle>();

  // Should this route be detached and stored?
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data['reuse'] === true;
  }

  // Store the detached route
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    const key = this.getKey(route);
    if (handle) {
      this.cache.set(key, handle);
    } else {
      this.cache.delete(key);
    }
  }

  // Should we restore a stored route?
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.getKey(route);
    return this.cache.has(key);
  }

  // Retrieve the stored route
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.getKey(route);
    return this.cache.get(key) ?? null;
  }

  // Should the route be reused? (same route config, different params)
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  private getKey(route: ActivatedRouteSnapshot): string {
    return route.routeConfig?.path ?? '';
  }

  // Public method to clear cache (e.g., on logout)
  clearCache(): void {
    this.cache.clear();
  }
}

// Registration
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: RouteReuseStrategy, useClass: TabRouteReuseStrategy },
  ],
};

// Route config
export const routes: Routes = [
  {
    path: 'inbox',
    loadComponent: () => import('./inbox.page').then(m => m.InboxPage),
    data: { reuse: true }, // This route will be cached
  },
  {
    path: 'sent',
    loadComponent: () => import('./sent.page').then(m => m.SentPage),
    data: { reuse: true },
  },
  {
    path: 'compose',
    loadComponent: () => import('./compose.page').then(m => m.ComposePage),
    // No reuse — compose is always a fresh form
  },
];
```

> **注意**：`RouteReuseStrategy` 是進階功能，會增加記憶體使用。確保在使用者登出或切換環境時清除快取。

---

## 10. 完整範例：Admin Panel 路由

以下是一個完整的管理後台路由系統，涵蓋本章所有概念。

### 10.1 目錄結構

```
src/app/
├── app.config.ts
├── app.routes.ts
├── app.ts
├── auth/
│   ├── auth.guard.ts
│   ├── auth.routes.ts
│   ├── login.page.ts
│   └── auth.service.ts
├── admin/
│   ├── admin.routes.ts
│   ├── admin-layout.ts
│   ├── dashboard/
│   │   ├── admin-dashboard.page.ts
│   │   └── dashboard-stats.resolver.ts
│   ├── users/
│   │   ├── users.routes.ts
│   │   ├── user-list.page.ts
│   │   ├── user-detail.page.ts
│   │   └── user.resolver.ts
│   └── settings/
│       ├── settings.page.ts
│       └── unsaved-changes.guard.ts
└── shared/
    ├── breadcrumb.ts
    └── not-found.page.ts
```

### 10.2 App Routes

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found.page').then(m => m.NotFoundPage),
    title: 'Page Not Found',
  },
];
```

### 10.3 Auth Routes & Guard

```typescript
// auth/auth.routes.ts
import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login.page').then(m => m.LoginPage),
    title: 'Login',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

// auth/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }

  return router.createUrlTree(['/forbidden']);
};
```

### 10.4 Admin Routes with Layout

```typescript
// admin/admin.routes.ts
import { Routes } from '@angular/router';
import { adminGuard } from '../auth/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/admin-dashboard.page').then(m => m.AdminDashboardPage),
        title: 'Admin Dashboard',
        resolve: {
          stats: () => inject(DashboardService).getStats(),
        },
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.routes').then(m => m.USERS_ROUTES),
        data: { breadcrumb: 'Users' },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings.page').then(m => m.SettingsPage),
        canDeactivate: [unsavedChangesGuard],
        title: 'Admin Settings',
        data: { breadcrumb: 'Settings' },
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
```

### 10.5 User Routes with Resolvers

```typescript
// admin/users/users.routes.ts
import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './user.service';

const userResolver = (route: ActivatedRouteSnapshot) => {
  const userService = inject(UserService);
  return userService.getById(route.paramMap.get('id')!);
};

const userListResolver = () => {
  const userService = inject(UserService);
  return userService.getAll();
};

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-list.page').then(m => m.UserListPage),
    resolve: { users: userListResolver },
    data: { breadcrumb: 'All Users' },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./user-detail.page').then(m => m.UserDetailPage),
    resolve: { user: userResolver },
    data: { breadcrumb: 'User Detail' },
  },
];
```

### 10.6 Admin Layout with Breadcrumbs

```typescript
// admin/admin-layout.ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
  ],
  template: `
    <mat-sidenav-container>
      <mat-sidenav mode="side" opened>
        <mat-nav-list>
          <a mat-list-item routerLink="dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="users" routerLinkActive="active">
            <mat-icon matListItemIcon>people</mat-icon>
            <span matListItemTitle>Users</span>
          </a>
          <a mat-list-item routerLink="settings" routerLinkActive="active">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>Settings</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <nav aria-label="Breadcrumb">
            @for (crumb of breadcrumbs(); track crumb.url; let isLast = $last) {
              @if (isLast) {
                <span>{{ crumb.label }}</span>
              } @else {
                <a [routerLink]="crumb.url">{{ crumb.label }}</a>
                <span class="separator">/</span>
              }
            }
          </nav>
        </mat-toolbar>

        <main class="content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    mat-sidenav-container { height: 100vh; }
    mat-sidenav { width: 240px; }
    .content { padding: 24px; }
    .separator { margin: 0 8px; opacity: 0.5; }
    .active { background: rgba(0, 0, 0, 0.04); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayout {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly breadcrumbs = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.buildBreadcrumbs(this.route.root))
    ),
    { initialValue: [] as Breadcrumb[] }
  );

  private buildBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children = route.children;

    for (const child of children) {
      const routeURL = child.snapshot.url
        .map(segment => segment.path)
        .join('/');

      if (routeURL) {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'] as string | undefined;
      if (label) {
        breadcrumbs.push({ label, url });
      }

      this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
```

### 10.7 User List Page

```typescript
// admin/users/user-list.page.ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-list-page',
  imports: [MatTableModule, MatButtonModule, MatInputModule, MatIconModule],
  template: `
    <div class="header">
      <h1>Users</h1>
      <mat-form-field appearance="outline">
        <mat-label>Search</mat-label>
        <input matInput (input)="onSearch($event)" />
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
    </div>

    <table mat-table [dataSource]="filteredUsers()">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let user">{{ user.name }}</td>
      </ng-container>

      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let user">{{ user.email }}</td>
      </ng-container>

      <ng-container matColumnDef="role">
        <th mat-header-cell *matHeaderCellDef>Role</th>
        <td mat-cell *matCellDef="let user">{{ user.role }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let user">
          <button mat-icon-button (click)="viewUser(user.id)">
            <mat-icon>visibility</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: `
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListPage {
  private readonly router = inject(Router);

  // Resolved data bound via withComponentInputBinding()
  readonly users = input<User[]>([]);

  protected readonly searchQuery = signal('');
  protected readonly displayedColumns = ['name', 'email', 'role', 'actions'];

  protected readonly filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.users();
    return this.users().filter(u =>
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  });

  protected onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  protected viewUser(id: string): void {
    this.router.navigate(['/admin/users', id]);
  }
}
```

### 10.8 User Detail Page

```typescript
// admin/users/user-detail.page.ts
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-detail-page',
  imports: [MatCardModule, MatButtonModule, RouterLink, DatePipe],
  template: `
    <a mat-button routerLink="/admin/users">
      ← Back to Users
    </a>

    @if (user(); as u) {
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ u.name }}</mat-card-title>
          <mat-card-subtitle>{{ u.email }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <dl>
            <dt>Role</dt>
            <dd>{{ u.role }}</dd>

            <dt>Status</dt>
            <dd>{{ u.isActive ? 'Active' : 'Inactive' }}</dd>

            <dt>Joined</dt>
            <dd>{{ u.createdAt | date:'longDate' }}</dd>

            <dt>Last Login</dt>
            <dd>{{ u.lastLoginAt | date:'medium' }}</dd>
          </dl>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary">Edit</button>
          <button mat-button color="warn">Disable</button>
        </mat-card-actions>
      </mat-card>
    }
  `,
  styles: `
    dt { font-weight: 600; margin-top: 12px; }
    dd { margin-left: 0; color: var(--mat-sys-on-surface-variant); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailPage {
  // Resolved data auto-bound via withComponentInputBinding()
  readonly user = input.required<User>();
}
```

### 10.9 App Config — 完整組裝

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  withViewTransitions,
  withInMemoryScrolling,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { SelectivePreloadStrategy } from './shared/selective-preload.strategy';
import { authInterceptor } from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(SelectivePreloadStrategy),
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    provideHttpClient(
      withInterceptors([authInterceptor]),
    ),
    provideAnimationsAsync(),
  ],
};
```

---

## 11. 常見陷阱

### 陷阱 1：忘記 `pathMatch: 'full'` 導致無限重導向

```typescript
// ❌ Bug: infinite redirect — '' matches every URL as a prefix
{ path: '', redirectTo: 'dashboard' }

// ✅ Fix: use pathMatch: 'full'
{ path: '', redirectTo: 'dashboard', pathMatch: 'full' }
```

**說明**：`pathMatch: 'prefix'`（預設）表示空字串 `''` 可以匹配任何 URL 的前綴。必須用 `'full'` 表示只匹配完全空的路徑。

---

### 陷阱 2：萬用路由 `**` 放在其他路由之前

```typescript
// ❌ Bug: wildcard catches everything before specific routes
export const routes: Routes = [
  { path: '**', component: NotFoundPage }, // Catches ALL requests!
  { path: 'dashboard', component: DashboardPage }, // Never reached
];

// ✅ Fix: wildcard must be LAST
export const routes: Routes = [
  { path: 'dashboard', component: DashboardPage },
  { path: '**', component: NotFoundPage }, // Only unmatched URLs
];
```

**說明**：Angular 從上到下匹配路由，第一個匹配的路由會被使用。

---

### 陷阱 3：使用 Snapshot 但元件被重用

```typescript
// ❌ Bug: snapshot doesn't update when navigating from /users/1 to /users/2
ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id')!;
  this.loadUser(id); // Only loads user 1, never updates to user 2
}

// ✅ Fix: use observable or withComponentInputBinding() + input()
readonly id = input.required<string>();

// Or:
constructor() {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id')!;
    this.loadUser(id);
  });
}
```

**說明**：當 Angular 重用同一個元件（相同路由配置、不同參數），Snapshot 不會更新。

---

### 陷阱 4：延遲載入路由忘記匯出元件

```typescript
// ❌ Bug: loadComponent expects the component to be exported
// user-detail.page.ts
@Component({ /* ... */ })
class UserDetailPage {} // Not exported!

// loadComponent can't find it
{ loadComponent: () => import('./user-detail.page').then(m => m.UserDetailPage) }

// ✅ Fix: export the component
export class UserDetailPage {}
```

---

### 陷阱 5：Guard 中回傳 `false` 而非重導向

```typescript
// ❌ Bad UX: navigation silently fails, user sees nothing
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated(); // Returns false — user stuck on current page
};

// ✅ Better: redirect to login page
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });
};
```

**說明**：回傳 `false` 只會取消導航，使用者不知道發生了什麼。回傳 `UrlTree` 會重導向到適當的頁面。

---

### 陷阱 6：忘記啟用 `withComponentInputBinding()`

```typescript
// ❌ Component inputs never receive route params
@Component({ /* ... */ })
export class UserDetail {
  readonly id = input<string>(); // Always undefined!
}

// ✅ Must enable in app config
provideRouter(
  routes,
  withComponentInputBinding(), // Required!
)
```

---

### 陷阱 7：在子路由中使用錯誤的相對路徑

```typescript
// If current URL is /admin/users/123

// ❌ Wrong: navigates to /edit (absolute)
this.router.navigate(['edit']);

// ❌ Wrong: navigates to /admin/users/123/edit (but might not work without relativeTo)
this.router.navigate(['edit']);

// ✅ Correct: use relativeTo
this.router.navigate(['edit'], { relativeTo: this.route });
// Result: /admin/users/123/edit

// ✅ Also correct: use absolute path
this.router.navigate(['/admin/users', 123, 'edit']);
```

---

### 陷阱 8：Resolver 阻塞導航太久

```typescript
// ❌ Slow resolver blocks navigation — user sees no feedback
const heavyResolver: ResolveFn<Report[]> = () => {
  const reportService = inject(ReportService);
  return reportService.generateAllReports(); // Takes 10 seconds!
};

// ✅ Fix: use resource() in the component instead of resolver
@Component({ /* ... */ })
export class ReportsPage {
  private readonly reportService = inject(ReportService);

  protected readonly reportsResource = rxResource({
    loader: () => this.reportService.generateAllReports(),
  });
  // Shows loading state immediately, doesn't block navigation
}
```

**說明**：Resolver 在資料準備完成前不會顯示目標頁面。如果資料載入耗時超過幾百毫秒，建議改用 `resource()` 在元件中載入，同時顯示 loading 狀態。

---

## 本章小結

| 概念 | 要點 |
|------|------|
| 路由設定 | `provideRouter()` + `Routes` 陣列 + `withComponentInputBinding()` |
| 延遲載入 | `loadComponent()` 載入元件，`loadChildren()` 載入路由模組 |
| 守衛 | 函式型守衛：`CanActivateFn`、`CanDeactivateFn`、`CanMatchFn`、`ResolveFn` |
| 巢狀路由 | `<router-outlet>` + `children` 配置 |
| 參數存取 | 優先使用 `input()` + `withComponentInputBinding()` |
| Router 服務 | `navigate()`、`navigateByUrl()`、`events` Observable |
| 預載策略 | `SelectivePreload` 或 `PreloadAllModules` |

> **下一章**：[第四章：狀態管理 (State Management)](./04-state-management.md)
