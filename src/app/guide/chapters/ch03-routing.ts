import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GuidePage } from '../shared/guide-page';
import { GuideChapter } from '../models/guide-chapter';

const CHAPTER: GuideChapter = {
  id: 'routing',
  number: 3,
  title: '路由與導覽',
  subtitle: '延遲載入、守衛、巢狀路由、參數傳遞',
  icon: 'route',
  category: 'fundamentals',
  tags: ['routing', 'lazy-loading', 'guards', 'resolver', 'navigation', 'preloading'],
  estimatedMinutes: 40,
  sections: [
    // ─── Section 1: Route Configuration ───
    {
      id: 'route-config',
      title: '路由設定',
      content: `
<p>
  Angular 的路由系統負責將 URL 路徑對應到元件，實現<strong>單頁應用（SPA）</strong>的頁面導覽。
  在 standalone 架構下，路由設定透過 <code>provideRouter()</code> 在 <code>bootstrapApplication</code>
  中提供，不再需要 <code>RouterModule.forRoot()</code>。
</p>
<p><strong>Route 物件的主要屬性：</strong></p>
<table>
  <thead>
    <tr><th>屬性</th><th>說明</th><th>範例</th></tr>
  </thead>
  <tbody>
    <tr><td><code>path</code></td><td>URL 路徑片段</td><td><code>'users'</code>, <code>'users/:id'</code></td></tr>
    <tr><td><code>loadComponent</code></td><td>延遲載入單一元件</td><td><code>() =&gt; import('./user').then(m =&gt; m.User)</code></td></tr>
    <tr><td><code>loadChildren</code></td><td>延遲載入子路由設定</td><td><code>() =&gt; import('./admin/admin.routes').then(m =&gt; m.ADMIN_ROUTES)</code></td></tr>
    <tr><td><code>component</code></td><td>直接引用元件（non-lazy）</td><td><code>component: Dashboard</code></td></tr>
    <tr><td><code>redirectTo</code></td><td>重導向到另一個路徑</td><td><code>redirectTo: '/dashboard'</code></td></tr>
    <tr><td><code>pathMatch</code></td><td>路徑匹配策略</td><td><code>'full'</code> 或 <code>'prefix'</code></td></tr>
    <tr><td><code>title</code></td><td>頁面標題（自動設定 document.title）</td><td><code>'User Profile'</code></td></tr>
    <tr><td><code>canActivate</code></td><td>路由守衛陣列</td><td><code>[authGuard]</code></td></tr>
    <tr><td><code>resolve</code></td><td>路由解析器</td><td><code>{ user: userResolver }</code></td></tr>
    <tr><td><code>children</code></td><td>巢狀子路由</td><td><code>[{ path: 'edit', ... }]</code></td></tr>
    <tr><td><code>data</code></td><td>靜態路由資料</td><td><code>{ role: 'admin' }</code></td></tr>
  </tbody>
</table>
<p>
  <strong>路由設定最佳實踐：</strong>路由定義放在獨立的 <code>.routes.ts</code> 檔案中，
  與 feature 目錄放在一起。根路由檔 <code>app.routes.ts</code> 負責頂層路由，
  各 feature 路由檔（如 <code>admin.routes.ts</code>）負責該功能區塊的子路由。
  這種組織方式讓每個功能區塊可以獨立延遲載入。
</p>
      `,
      codeExamples: [
        {
          filename: 'app.routes.ts',
          language: 'typescript',
          code: `import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: 'users',
    title: 'Users',
    canActivate: [authGuard],
    loadChildren: () => import('./users/user.routes').then(m => m.USER_ROUTES),
  },
  {
    path: 'admin',
    canMatch: [adminGuard], // Prevents even matching if not admin
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () => import('./not-found/not-found').then(m => m.NotFound),
  },
];`,
          annotation: 'Root route configuration with lazy loading, guards, and wildcard fallback.',
        },
        {
          filename: 'main.ts',
          language: 'typescript',
          code: `import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { App } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(), // Enables route params as component inputs
    ),
  ],
});`,
          annotation: 'Bootstrap with provideRouter and withComponentInputBinding for signal-based param access.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '永遠在空路徑重導向中加上 <code>pathMatch: \'full\'</code>。否則空字串會作為前綴匹配所有路徑，導致無限重導向。' },
        { type: 'tip', content: '啟用 <code>withComponentInputBinding()</code> 後，路由參數可以直接透過 <code>input()</code> 接收，不需要注入 <code>ActivatedRoute</code>。' },
        { type: 'dotnet-comparison', content: '<code>provideRouter(routes)</code> 等同於 .NET 的 <code>app.MapControllerRoute()</code> 或 <code>app.MapGet()</code>。<code>loadComponent</code> 的延遲載入類似 .NET Blazor 的 <code>@page</code> 路由自動 code-splitting。' },
      ],
    },

    // ─── Section 2: Lazy Loading ───
    {
      id: 'lazy-loading',
      title: '延遲載入',
      content: `
<p>
  延遲載入（Lazy Loading）是 Angular 路由最重要的效能最佳化技術之一。
  它將應用程式拆分為多個<strong>按需載入的 JavaScript chunk</strong>，
  只在使用者導覽到對應路由時才下載和執行該功能區塊的程式碼。
</p>
<p><strong>兩種延遲載入 API：</strong></p>
<ul>
  <li>
    <code>loadComponent</code>——延遲載入單一 standalone 元件。適合只有一個頁面的簡單功能。
    語法：<code>loadComponent: () =&gt; import('./feature').then(m =&gt; m.Feature)</code>
  </li>
  <li>
    <code>loadChildren</code>——延遲載入一整組子路由。適合有多個頁面的功能區塊。
    語法：<code>loadChildren: () =&gt; import('./feature/feature.routes').then(m =&gt; m.FEATURE_ROUTES)</code>
  </li>
</ul>
<p><strong>Chunk 命名：</strong></p>
<p>
  Angular CLI 的 build 工具會自動為每個延遲載入的路由產生獨立的 chunk 檔案。
  你可以透過 <code>webpackChunkName</code> magic comment（webpack）或讓 esbuild 自動命名來控制 chunk 名稱。
  良好的 chunk 命名有助於在瀏覽器 DevTools 的 Network 面板中識別各模組。
</p>
<p><strong>效能影響：</strong></p>
<ul>
  <li>首頁只載入核心 bundle + 首頁路由的 chunk，大幅降低<strong>初始載入時間（LCP）</strong></li>
  <li>後續頁面在導覽時按需載入，使用者幾乎感覺不到延遲（尤其搭配預載策略）</li>
  <li>每個 feature 的程式碼獨立快取——更新某個功能不會使其他 chunk 的快取失效</li>
</ul>
<p>
  <strong>注意：</strong>在 standalone 架構下，<code>loadChildren</code> 載入的是路由陣列（<code>Routes</code>），
  不是 NgModule。這比舊式 module-based lazy loading 更直觀且更少樣板程式碼。
</p>
      `,
      codeExamples: [
        {
          filename: 'user.routes.ts',
          language: 'typescript',
          code: `import { Routes } from '@angular/router';
import { authGuard } from '../auth/auth.guard';
import { userResolver } from './user.resolver';

export const USER_ROUTES: Routes = [
  {
    path: '',
    title: 'User List',
    loadComponent: () => import('./user-list').then(m => m.UserList),
  },
  {
    path: ':id',
    title: 'User Detail',
    resolve: { user: userResolver },
    loadComponent: () => import('./user-detail').then(m => m.UserDetail),
  },
  {
    path: ':id/edit',
    title: 'Edit User',
    canActivate: [authGuard],
    loadComponent: () => import('./user-edit').then(m => m.UserEdit),
  },
];`,
          annotation: 'Feature routes file: each route lazily loads its own component.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '除了根 shell 元件之外，所有路由元件都應使用延遲載入。這是 Angular 應用效能最佳化的基礎。' },
        { type: 'warning', content: '避免在延遲載入的路由元件中 eagerly import 其他大型元件——這會抵消延遲載入的效益。確保元件的 <code>imports</code> 陣列中的依賴也是輕量的，或使用 <code>@defer</code> 進一步拆分。' },
        { type: 'dotnet-comparison', content: '延遲載入類似 .NET Blazor WebAssembly 的 <code>LazyAssemblyLoader</code>——按需下載 DLL。但 Angular 的實作更自動化：只需使用 <code>loadComponent</code> / <code>loadChildren</code>，build 工具會自動產生獨立的 chunk。' },
      ],
    },

    // ─── Section 3: Guards ───
    {
      id: 'guards',
      title: '路由守衛',
      content: `
<p>
  路由守衛（Route Guards）是控制路由存取權限的機制。在 Angular v15+ 中，
  推薦使用<strong>函式型守衛（Functional Guards）</strong>，取代舊有的 class-based guards。
  函式型守衛更簡潔、更容易測試，且自動運行在注入上下文中，可以直接使用 <code>inject()</code>。
</p>
<p><strong>守衛類型：</strong></p>
<table>
  <thead>
    <tr><th>守衛</th><th>時機</th><th>常見用途</th></tr>
  </thead>
  <tbody>
    <tr><td><code>CanActivateFn</code></td><td>導覽到路由前</td><td>身份驗證、權限檢查</td></tr>
    <tr><td><code>CanDeactivateFn</code></td><td>離開路由前</td><td>表單未儲存警告</td></tr>
    <tr><td><code>CanMatchFn</code></td><td>路由匹配前</td><td>基於角色的路由分流（推薦用於認證）</td></tr>
    <tr><td><code>ResolveFn</code></td><td>路由啟動前</td><td>預取關鍵資料</td></tr>
  </tbody>
</table>
<p>
  <strong>CanMatch vs CanActivate：</strong><code>CanMatch</code> 在路由匹配階段就執行，
  如果回傳 <code>false</code>，Angular 會跳過該路由繼續嘗試下一個匹配。
  這比 <code>CanActivate</code> 更安全——未授權的使用者甚至不知道該路由存在。
  而 <code>CanActivate</code> 在路由已匹配後執行，通常用於顯示「權限不足」提示或重導向。
</p>
<p>
  <strong>守衛回傳值：</strong>守衛可以回傳 <code>boolean</code>、<code>UrlTree</code>（重導向）、
  <code>Observable&lt;boolean | UrlTree&gt;</code> 或 <code>Promise&lt;boolean | UrlTree&gt;</code>。
  回傳 <code>UrlTree</code> 會觸發重導向，這是比手動呼叫 <code>router.navigate()</code> 更安全的做法，
  因為它能正確處理同時進行的多個導覽。
</p>
      `,
      codeExamples: [
        {
          filename: 'auth.guard.ts',
          language: 'typescript',
          code: `import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// CanActivateFn — redirects to login if not authenticated
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

// CanMatchFn — prevents route matching for non-admin users
export const adminGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  return auth.hasRole('admin');
};`,
          annotation: 'Functional guards using inject() — no class boilerplate needed.',
        },
        {
          filename: 'unsaved-changes.guard.ts',
          language: 'typescript',
          code: `import { CanDeactivateFn } from '@angular/router';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (component.hasUnsavedChanges()) {
    return window.confirm(
      'You have unsaved changes. Are you sure you want to leave?'
    );
  }
  return true;
};`,
          annotation: 'CanDeactivateFn guard to warn users about unsaved form changes.',
        },
        {
          filename: 'user.resolver.ts',
          language: 'typescript',
          code: `import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService, User } from './user.service';

export const userResolver: ResolveFn<User> = (route) => {
  const id = route.paramMap.get('id');
  if (!id) {
    throw new Error('User ID is required');
  }
  return inject(UserService).getById(id);
};`,
          annotation: 'ResolveFn pre-fetches critical data before the route component is created.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '認證守衛優先使用 <code>CanMatchFn</code> 而非 <code>CanActivateFn</code>——它在路由匹配前執行，未授權使用者無法觸發延遲載入，既更安全也更省資源。' },
        { type: 'warning', content: '不要在守衛中使用 <code>router.navigate()</code> 來處理重導向——回傳 <code>UrlTree</code> 才是正確做法。<code>UrlTree</code> 能正確處理競態導覽（racing navigations），避免導覽衝突。' },
        { type: 'dotnet-comparison', content: 'Angular 路由守衛類似 .NET 的 <code>[Authorize]</code> attribute 和 <code>IAuthorizationHandler</code>。<code>CanActivateFn</code> 對應 <code>[Authorize(Policy = "...")]</code>；<code>ResolveFn</code> 對應 .NET 的 <code>IAsyncActionFilter</code> 中在 action 前載入資料的模式。' },
      ],
    },

    // ─── Section 4: Nested Routes ───
    {
      id: 'nested-routes',
      title: '巢狀路由',
      content: `
<p>
  巢狀路由（Nested Routes）讓你可以在父元件的 <code>&lt;router-outlet&gt;</code> 中渲染子路由元件，
  實現多層級的頁面佈局。這是構建複雜 UI 佈局（如儀表板、設定頁面）的關鍵技術。
</p>
<p><strong>巢狀路由的運作方式：</strong></p>
<ol>
  <li>父路由定義 <code>children</code> 陣列或使用 <code>loadChildren</code> 延遲載入子路由</li>
  <li>父元件模板中放置 <code>&lt;router-outlet /&gt;</code></li>
  <li>子路由的元件會渲染在該 outlet 中</li>
  <li>URL 結構自動反映巢狀關係：<code>/admin/users/123</code></li>
</ol>
<p><strong>佈局路由（Layout Route）模式：</strong></p>
<p>
  一個常見的模式是使用「空路徑」父路由作為佈局容器。例如，
  <code>/dashboard</code> 下的所有頁面共享一個側邊欄佈局，
  但 <code>/login</code> 使用全螢幕佈局。這可以透過巢狀路由輕鬆實現：
</p>
<ul>
  <li><code>path: ''</code> + <code>component: DashboardLayout</code> + <code>children: [...]</code> — 有側邊欄</li>
  <li><code>path: 'login'</code> + <code>loadComponent: LoginPage</code> — 無側邊欄</li>
</ul>
<p>
  <strong>注意：</strong>優先使用巢狀路由搭配 <code>&lt;router-outlet /&gt;</code>，
  避免使用命名 outlet（named outlet）。命名 outlet 會使 URL 結構複雜化且難以維護。
</p>
      `,
      codeExamples: [
        {
          filename: 'admin.routes.ts',
          language: 'typescript',
          code: `import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        title: 'Admin Overview',
        loadComponent: () => import('./overview').then(m => m.AdminOverview),
      },
      {
        path: 'users',
        title: 'Manage Users',
        loadComponent: () => import('./user-management').then(m => m.UserManagement),
      },
      {
        path: 'settings',
        title: 'System Settings',
        loadComponent: () => import('./settings').then(m => m.AdminSettings),
      },
    ],
  },
];`,
          annotation: 'Nested routes with a shared layout component and lazy-loaded child pages.',
        },
        {
          filename: 'admin-layout.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: \`
    <div class="admin-layout">
      <nav class="sidebar">
        <a routerLink="overview" routerLinkActive="active">Overview</a>
        <a routerLink="users" routerLinkActive="active">Users</a>
        <a routerLink="settings" routerLinkActive="active">Settings</a>
      </nav>
      <main class="content">
        <router-outlet />
      </main>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayout {}`,
          annotation: 'Layout component with sidebar navigation and router-outlet for child routes.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '使用佈局路由（空路徑父路由 + <code>children</code>）來共享導航欄、側邊欄等佈局元素。這避免了在每個子頁面中重複佈局程式碼。' },
        { type: 'warning', content: '避免使用命名 outlet（<code>&lt;router-outlet name="sidebar"&gt;</code>）。它會導致 URL 中出現 <code>(sidebar:panel)</code> 這樣的輔助路由語法，使 URL 難以閱讀和分享。優先使用巢狀路由。' },
        { type: 'dotnet-comparison', content: '巢狀路由類似 .NET Blazor 的 <code>@layout</code> 指令或 ASP.NET MVC 的 <code>_Layout.cshtml</code>——父佈局提供共用 UI，子頁面渲染在指定區域中。Angular 的 <code>&lt;router-outlet /&gt;</code> 就是 Blazor 的 <code>@Body</code>。' },
      ],
    },

    // ─── Section 5: Route Parameters ───
    {
      id: 'route-params',
      title: '路由參數',
      content: `
<p>
  Angular 路由支援多種參數傳遞方式，每種適用於不同的場景。
  理解它們的差異和最佳用法對於設計好的 URL 結構至關重要。
</p>
<table>
  <thead>
    <tr><th>參數類型</th><th>URL 範例</th><th>說明</th><th>使用場景</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Path Params</strong></td>
      <td><code>/users/123</code></td>
      <td>必要參數，嵌入路徑中</td>
      <td>資源識別（ID、slug）</td>
    </tr>
    <tr>
      <td><strong>Query Params</strong></td>
      <td><code>/users?page=2&amp;sort=name</code></td>
      <td>可選參數，附加在 URL 後</td>
      <td>篩選、排序、分頁</td>
    </tr>
    <tr>
      <td><strong>Matrix Params</strong></td>
      <td><code>/users;role=admin</code></td>
      <td>附加在路徑片段上的可選參數</td>
      <td>路徑特定的可選設定（較少使用）</td>
    </tr>
    <tr>
      <td><strong>Fragment</strong></td>
      <td><code>/docs#section-3</code></td>
      <td>頁面內錨點</td>
      <td>長頁面中的章節導覽</td>
    </tr>
  </tbody>
</table>
<p><strong>Signal-based 參數存取（推薦）：</strong></p>
<p>
  啟用 <code>withComponentInputBinding()</code> 後，路由參數可以直接透過 <code>input()</code> 接收。
  Angular 會自動將 path params、query params、route data 和 resolver 結果
  綁定到名稱匹配的 component input。這是最簡潔的存取方式。
</p>
<p><strong>傳統存取方式（ActivatedRoute）：</strong></p>
<p>
  注入 <code>ActivatedRoute</code> 並存取 <code>paramMap</code>、<code>queryParamMap</code> 等 Observable。
  在 signal-based 架構下較少使用，但在需要動態監聽參數變化的複雜場景中仍有價值。
</p>
      `,
      codeExamples: [
        {
          filename: 'user-detail.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, input, inject, resource } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-detail',
  template: \`
    @if (userResource.isLoading()) {
      <p>Loading...</p>
    } @else if (userResource.value(); as user) {
      <h1>{{ user.name }}</h1>
      <p>Email: {{ user.email }}</p>
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetail {
  private readonly userService = inject(UserService);

  // Route path param "id" bound via withComponentInputBinding()
  readonly id = input.required<string>();

  // Route query param "tab" — optional with default
  readonly tab = input('profile');

  // Resolver result "user" — if using resolve: { user: userResolver }
  // readonly user = input.required<User>();

  // Alternatively, fetch data based on the route param
  protected readonly userResource = resource({
    request: () => this.id(),
    loader: ({ request: id }) => this.userService.getById(id),
  });
}`,
          annotation: 'Accessing route params via signal-based input() with withComponentInputBinding().',
        },
        {
          filename: 'navigation-examples.ts',
          language: 'typescript',
          code: `import { inject } from '@angular/core';
import { Router } from '@angular/router';

// ── In a component method ──
export class UserActions {
  private readonly router = inject(Router);

  // Navigate with path params
  goToUser(id: string): void {
    this.router.navigate(['/users', id]);
  }

  // Navigate with query params
  goToFiltered(): void {
    this.router.navigate(['/users'], {
      queryParams: { page: 2, sort: 'name', order: 'asc' },
    });
  }

  // Preserve existing query params while adding new ones
  addFilter(role: string): void {
    this.router.navigate([], {
      queryParams: { role },
      queryParamsHandling: 'merge', // Keeps existing params
    });
  }
}

// ── In a template (declarative) ──
// <a [routerLink]="['/users', user.id]">{{ user.name }}</a>
// <a [routerLink]="['/users']" [queryParams]="{ page: 2 }">Page 2</a>`,
          annotation: 'Programmatic and declarative navigation with various parameter types.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '啟用 <code>withComponentInputBinding()</code> 後，優先使用 <code>input()</code> 接收路由參數——程式碼更簡潔，且與元件的其他 input 保持一致的 API。只在需要監聽 Observable 流的複雜場景才注入 <code>ActivatedRoute</code>。' },
        { type: 'tip', content: '使用 <code>queryParamsHandling: \'merge\'</code> 可以在導覽時保留現有的 query params，只更新指定的參數。這在篩選 UI 中非常有用。' },
        { type: 'dotnet-comparison', content: 'Path params 對應 .NET 的 <code>[FromRoute]</code>，query params 對應 <code>[FromQuery]</code>。Angular 的 <code>withComponentInputBinding()</code> 讓參數綁定像 .NET 的模型綁定一樣自動。' },
      ],
    },

    // ─── Section 6: Router Service ───
    {
      id: 'router-service',
      title: 'Router 服務',
      content: `
<p>
  <code>Router</code> 服務是 Angular 路由系統的核心，提供程式化導覽、事件監聽、URL 操作等功能。
  而 <code>ActivatedRoute</code> 則代表當前啟動的路由，提供路由參數、資料等資訊。
</p>
<p><strong>Router 常用方法：</strong></p>
<ul>
  <li><code>navigate(commands, extras?)</code>——程式化導覽到指定路由</li>
  <li><code>navigateByUrl(url, extras?)</code>——使用完整 URL 字串導覽</li>
  <li><code>createUrlTree(commands, extras?)</code>——建立 UrlTree（常用於守衛回傳）</li>
  <li><code>events</code>——路由事件 Observable（NavigationStart、NavigationEnd 等）</li>
</ul>
<p><strong>Router Events（路由事件）：</strong></p>
<p>
  Router 的 <code>events</code> Observable 發送多種事件類型，讓你可以追蹤導覽的完整生命週期：
</p>
<ul>
  <li><code>NavigationStart</code>——導覽開始（常用於顯示載入指示器）</li>
  <li><code>GuardsCheckStart</code> / <code>GuardsCheckEnd</code>——守衛檢查</li>
  <li><code>ResolveStart</code> / <code>ResolveEnd</code>——解析器執行</li>
  <li><code>NavigationEnd</code>——導覽完成（常用於頁面追蹤、隱藏載入指示器）</li>
  <li><code>NavigationCancel</code>——導覽取消（守衛拒絕或重導向）</li>
  <li><code>NavigationError</code>——導覽錯誤（延遲載入失敗等）</li>
</ul>
<p>
  <strong>ActivatedRoute</strong> 在 signal-based 架構下的使用較少——
  大部分場景可以透過 <code>input()</code> + <code>withComponentInputBinding()</code> 取代。
  但它在需要存取完整路由樹、或需要 Observable 流式參數變更的場景中仍然重要。
</p>
      `,
      codeExamples: [
        {
          filename: 'navigation-tracker.ts',
          language: 'typescript',
          code: `import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationTracker {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _isNavigating = signal(false);
  readonly isNavigating = this._isNavigating.asReadonly();

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this._isNavigating.set(true);
        }
        if (event instanceof NavigationEnd || event instanceof NavigationError) {
          this._isNavigating.set(false);
        }
      });
  }
}

// Usage in a component:
// protected readonly tracker = inject(NavigationTracker);
// Template: @if (tracker.isNavigating()) { <mat-progress-bar mode="indeterminate" /> }`,
          annotation: 'Service that tracks navigation state via Router events — exposes signal for template binding.',
        },
      ],
      tips: [
        { type: 'tip', content: '使用 <code>Router.events</code> 搭配 <code>filter()</code> 和 <code>instanceof</code> 來監聽特定事件類型。這對於全域載入指示器、頁面追蹤（Google Analytics）非常有用。' },
        { type: 'best-practice', content: '程式化導覽時，優先使用 <code>router.navigate([...])</code>（陣列形式）而非 <code>router.navigateByUrl(string)</code>。陣列形式提供型別安全且更容易組合路徑片段。' },
        { type: 'dotnet-comparison', content: '<code>Router</code> 服務類似 .NET Blazor 的 <code>NavigationManager</code>。<code>NavigationManager.NavigateTo()</code> 對應 <code>router.navigate()</code>，<code>NavigationManager.LocationChanged</code> 事件對應 <code>Router.events</code>。' },
      ],
    },

    // ─── Section 7: Preloading Strategies ───
    {
      id: 'preloading',
      title: '預載策略',
      content: `
<p>
  預載（Preloading）是介於「全部預先載入」和「完全延遲載入」之間的最佳化策略。
  它在首頁渲染完成後，利用瀏覽器閒置時間<strong>背景預先下載</strong>其他路由的 chunk，
  讓使用者在實際導覽時幾乎零等待。
</p>
<p><strong>Angular 內建預載策略：</strong></p>
<ul>
  <li>
    <code>NoPreloading</code>（預設）——不預載任何路由。適合 chunk 數量多但使用者通常只訪問少數幾頁的應用。
  </li>
  <li>
    <code>PreloadAllModules</code>——首頁載入後，背景預載所有延遲路由。
    適合中小型應用或大部分功能都會被使用的場景。
  </li>
</ul>
<p><strong>自訂預載策略：</strong></p>
<p>
  Angular 允許實作自訂的 <code>PreloadingStrategy</code>，讓你根據業務邏輯決定哪些路由要預載。
  常見的策略包括：
</p>
<ul>
  <li><strong>基於角色</strong>——只預載當前使用者有權限存取的路由</li>
  <li><strong>基於 data flag</strong>——在路由 <code>data</code> 中標記 <code>preload: true</code></li>
  <li><strong>基於網路條件</strong>——在 Wi-Fi 下預載全部，行動網路下不預載</li>
  <li><strong>QuickLink 策略</strong>——只預載目前頁面中可見連結的路由（基於 Intersection Observer）</li>
</ul>
<p>
  <strong>設定方式：</strong>在 <code>provideRouter()</code> 中使用 <code>withPreloading(strategy)</code>。
</p>
      `,
      codeExamples: [
        {
          filename: 'preloading-setup.ts',
          language: 'typescript',
          code: `import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  withPreloading,
  PreloadAllModules,
  withComponentInputBinding,
} from '@angular/router';

import { App } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding(),
    ),
  ],
});`,
          annotation: 'Enabling PreloadAllModules — all lazy routes are downloaded in the background after initial load.',
        },
        {
          filename: 'selective-preloading.ts',
          language: 'typescript',
          code: `import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectivePreloading implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    // Only preload routes that have data.preload = true
    if (route.data?.['preload'] === true) {
      console.log(\`Preloading: \${route.path}\`);
      return load();
    }
    return EMPTY;
  }
}

// Route config:
// {
//   path: 'dashboard',
//   data: { preload: true },
//   loadComponent: () => import('./dashboard').then(m => m.Dashboard),
// },
// {
//   path: 'admin',
//   data: { preload: false }, // Will NOT be preloaded
//   loadComponent: () => import('./admin').then(m => m.Admin),
// },

// In provideRouter:
// withPreloading(SelectivePreloading)`,
          annotation: 'Custom preloading strategy that only preloads routes flagged with data.preload: true.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '中小型應用直接使用 <code>PreloadAllModules</code> 即可。它的實作成本為零，效果顯著。只有在 chunk 數量很多且使用者通常只訪問少數頁面時才需要自訂策略。' },
        { type: 'tip', content: '可以在 Chrome DevTools 的 Network 面板中觀察預載行為——搜尋帶有 <code>chunk</code> 字樣的請求，它們應該在首頁載入完成後逐漸出現。' },
        { type: 'dotnet-comparison', content: 'Angular 的預載策略在 .NET 生態中沒有直接對應。最接近的是 .NET Blazor WebAssembly 的 <code>&lt;link rel="prefetch"&gt;</code> 策略或 ASP.NET 的 Response Caching——都是提前準備資源以加速後續請求。' },
      ],
    },

    // ─── Section 8b: Route Matching Algorithm (Deep-dive) ───
    {
      id: 'route-matching-algorithm',
      title: '路由匹配演算法（框架內部）',
      content: `
<p>Angular Router 使用 <strong>first-match wins</strong> 策略。當 URL 變化時，Router 會從 <code>Routes</code> 陣列的第一筆開始，依序嘗試匹配：</p>
<ol>
<li><strong>消耗 URL 段落</strong> — 路由的 <code>path</code> 嘗試消耗 URL 中對應的段落數量。<code>path: ''</code> 消耗 0 個段落（空路徑）。</li>
<li><strong>pathMatch 判斷</strong> — <code>'prefix'</code>（預設）：只要前綴匹配即可。<code>'full'</code>：必須消耗剩餘的所有段落。</li>
<li><strong>CanMatch 守衛</strong> — 若配置了 <code>canMatch</code>，在確認路徑匹配後、載入元件前執行。若回傳 <code>false</code>，視為不匹配，繼續嘗試下一筆路由。</li>
<li><strong>子路由遞迴</strong> — 若路由有 <code>children</code> 或 <code>loadChildren</code>，剩餘的 URL 段落交給子路由繼續匹配。若子路由全部不匹配，整條路徑視為失敗，回溯至父層繼續嘗試。</li>
<li><strong>Wildcard</strong> — <code>path: '**'</code> 匹配任何剩餘段落，通常放在陣列最後作為 404 兜底。</li>
</ol>
<p><strong>關鍵陷阱</strong>：<code>path: ''</code> 配合 <code>loadChildren</code> 時，空路徑會匹配所有 URL 作為前綴，然後將完整 URL 交給子路由。若子路由也沒有匹配，Router 才會回溯。這就是為什麼路由順序至關重要——更具體的路由必須放在更通用的路由之前。</p>`,
      codeExamples: [
        {
          filename: 'route-matching-example.ts',
          language: 'typescript',
          code: `// URL: /admin/users/42
// Step 1: Try path: '' → consumes 0 segments → remaining: /admin/users/42
//         children have no 'admin' route → BACKTRACK
// Step 2: Try path: 'admin' → consumes 1 segment → remaining: /users/42
//         loadChildren → admin.routes
//         Step 2a: Try path: 'users' → consumes 1 → remaining: /42
//                  children: path: ':id' → consumes 1 → remaining: (empty)
//                  MATCH ✓ → render AdminLayout > UsersPage > UserDetail(42)`,
          annotation: '路由匹配是遞迴的深度優先搜尋，first-match wins。',
        },
      ],
      diagrams: [
        {
          id: 'route-matching-flow',
          caption: '路由匹配演算法流程',
          content: `URL: /catalog/badges
│
├─ Route[0] path: '' (LandingLayout)
│  └─ Children: path: '' only → remaining 'catalog/badges' unmatched → BACKTRACK
│
├─ Route[1] path: 'catalog' (CatalogLayout) → consumes 'catalog'
│  └─ Children: path: 'badges' → consumes 'badges' → remaining: (empty)
│     └─ MATCH ✓ → CatalogLayout > BadgesCatalogPage
│
├─ Route[2] path: 'app' → NOT TRIED (already matched)
└─ Route[**] path: '**' → NOT TRIED`
        },
      ],
      tips: [
        { type: 'warning', content: '永遠將 <code>path: \'**\'</code> 放在路由陣列的<strong>最後一筆</strong>。放在中間會攔截所有後續路由。' },
        { type: 'best-practice', content: '使用 <code>canMatch</code> 取代 <code>canActivate</code> 做認證守衛。<code>canMatch</code> 在匹配階段即判斷，讓未授權的 URL 可以 fall through 到其他路由（例如公開頁面），而非硬性重定向。' },
      ],
    },

    // ─── Section 9: Routing Pitfalls ───
    {
      id: 'routing-pitfalls',
      title: '常見陷阱',
      content: `
<p>
  以下是 Angular 路由開發中最常見的 8 個陷阱。
  理解並避免這些問題可以節省大量除錯時間。
</p>
<ol>
  <li>
    <strong>空路徑缺少 <code>pathMatch: 'full'</code>：</strong>
    <code>{ path: '', redirectTo: '/home' }</code> 沒有 <code>pathMatch: 'full'</code> 會匹配所有路徑
    （空字串是所有路徑的前綴），導致無限重導向或錯誤匹配。
    修正：空路徑重導向一律加 <code>pathMatch: 'full'</code>。
  </li>
  <li>
    <strong>路由順序錯誤：</strong>Angular 路由使用<strong>先匹配先生效</strong>策略。
    將萬用路由 <code>path: '**'</code> 放在其他路由之前會攔截所有請求。
    修正：具體路由放前面，萬用路由放最後。
  </li>
  <li>
    <strong>守衛中使用 <code>router.navigate()</code> 而非 <code>UrlTree</code>：</strong>
    手動導覽可能導致競態條件。
    修正：守衛中回傳 <code>router.createUrlTree(['/login'])</code>。
  </li>
  <li>
    <strong>延遲載入但忘記匯出 Routes：</strong>
    <code>loadChildren</code> 指向的檔案沒有匯出 <code>Routes</code> 常數。
    修正：確保目標檔案有 <code>export const FEATURE_ROUTES: Routes = [...]</code>。
  </li>
  <li>
    <strong>忘記在佈局元件中放 <code>&lt;router-outlet /&gt;</code>：</strong>
    定義了子路由但父元件沒有 outlet。子元件不會渲染，也不會報錯。
    修正：所有有 <code>children</code> 的路由，對應元件必須包含 <code>&lt;router-outlet /&gt;</code>。
  </li>
  <li>
    <strong>元件 imports 中漏掉 <code>RouterOutlet</code>：</strong>
    standalone 元件使用 <code>&lt;router-outlet /&gt;</code> 但沒有在 <code>imports</code> 中加入 <code>RouterOutlet</code>。
    修正：在 imports 中明確加入 <code>RouterOutlet</code>。
  </li>
  <li>
    <strong>Resolver 阻塞導覽太久：</strong>
    Resolver 中呼叫慢速 API 導致頁面長時間白屏。
    修正：只在 Resolver 中載入關鍵資料，非關鍵資料在元件中用 <code>resource()</code> 載入。
  </li>
  <li>
    <strong>未處理延遲載入失敗：</strong>
    網路不穩定時 <code>loadComponent</code> 可能失敗，導致導覽中斷。
    修正：在全域 <code>ErrorHandler</code> 中處理，或監聽 <code>NavigationError</code> 事件提供重試機制。
  </li>
</ol>
      `,
      codeExamples: [
        {
          filename: 'route-order-example.ts',
          language: 'typescript',
          code: `import { Routes } from '@angular/router';

// ❌ Wrong — wildcard catches everything before specific routes
const badRoutes: Routes = [
  { path: '**', loadComponent: () => import('./not-found').then(m => m.NotFound) },
  { path: 'users', loadComponent: () => import('./users').then(m => m.Users) },
  // Users route will NEVER be reached!
];

// ✅ Correct — specific routes first, wildcard last
const goodRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./dashboard').then(m => m.Dashboard) },
  { path: 'users', loadComponent: () => import('./users').then(m => m.Users) },
  { path: 'users/:id', loadComponent: () => import('./user-detail').then(m => m.UserDetail) },
  { path: '**', loadComponent: () => import('./not-found').then(m => m.NotFound) },
];`,
          annotation: 'Route order matters: specific routes before wildcards, always add pathMatch on empty redirects.',
        },
        {
          filename: 'lazy-load-error-handling.ts',
          language: 'typescript',
          code: `import { Injectable, inject, ErrorHandler } from '@angular/core';
import { Router, NavigationError } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LazyLoadErrorHandler {
  private readonly router = inject(Router);

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationError => e instanceof NavigationError),
        takeUntilDestroyed(),
      )
      .subscribe(event => {
        console.error('Lazy load failed for:', event.url, event.error);

        // Offer reload — chunk may have been updated by a new deployment
        if (confirm('Failed to load page. Reload the application?')) {
          window.location.href = event.url;
        }
      });
  }
}`,
          annotation: 'Handling lazy load failures gracefully with a reload prompt.',
        },
      ],
      tips: [
        { type: 'warning', content: '路由順序是最常見的路由錯誤來源。Angular 使用先匹配先生效策略——確保路由從最具體到最通用排列。在路由設定變更後務必手動測試所有路徑。' },
        { type: 'best-practice', content: 'Resolver 只用於載入<strong>渲染頁面骨架所必需</strong>的資料。次要資料（如評論、推薦項目）應在元件內部用 <code>resource()</code> 非同步載入，搭配 <code>@defer</code> 或載入指示器。' },
        { type: 'tip', content: '在開發環境中啟用 <code>provideRouter(routes, withDebugTracing())</code> 可以在 console 中看到完整的路由解析過程，幫助快速定位匹配問題。' },
      ],
    },
  ],
};

@Component({
  selector: 'app-ch03',
  imports: [GuidePage],
  template: '<app-guide-page [chapter]="chapter" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ch03Routing {
  protected readonly chapter = CHAPTER;
}
