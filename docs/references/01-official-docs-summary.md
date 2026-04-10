# Angular 官方文件濃縮摘要

> **目標讀者**：具備 .NET/C# 後端開發經驗，正在轉型至 Angular 前端開發的工程師。
> **Angular 版本**：19+ (Standalone、Signals、OnPush、Zoneless)
> **最後更新**：2026-04-09

---

## 目錄

- [元件系統 (Components, Templates, Directives, Pipes)](#元件系統)
- [相依注入 (DI System, Providers, Injectors)](#相依注入)
- [路由導覽 (Router, Guards, Lazy Loading)](#路由導覽)
- [信號響應式 (Signals, Computed, Effect, Resource)](#信號響應式)
- [表單處理 (Reactive Forms, Template Forms, Validators)](#表單處理)
- [HTTP 通訊 (HttpClient, Interceptors, Error Handling)](#http-通訊)
- [測試策略 (TestBed, Component Testing, Service Testing)](#測試策略)
- [風格指南 (Naming, File Structure, Coding Conventions)](#風格指南)

---

## 元件系統

### 概述

Angular 的元件（Component）是 UI 的基本建構單元，等同於 .NET Blazor 的 Razor Component。每個元件由三部分組成：TypeScript 類別（邏輯）、HTML 模板（視圖）、CSS 樣式（外觀）。自 v19 起，所有元件預設為 Standalone，無需透過 NgModule 註冊。

### 元件定義

```typescript
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="card">
      <h2>{{ name() }}</h2>
      @if (isActive()) {
        <span class="badge">Active</span>
      }
    </div>
  `,
  styles: `.card { padding: 16px; border: 1px solid #ccc; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCard {
  // Signal-based state (replaces traditional class properties)
  protected readonly name = signal('John Doe');
  protected readonly isActive = signal(true);
}
```

**關鍵要點**：
- `standalone: true` 是 v19+ 的預設值，不需要顯式宣告
- `changeDetection: ChangeDetectionStrategy.OnPush` 必須設定，確保精細的變更偵測
- 模板使用原生控制流語法（`@if`/`@for`/`@switch`），取代舊版的 `*ngIf`/`*ngFor`
- 類別成員若僅在模板中使用，宣告為 `protected`

### 模板語法

Angular 模板語法與 Razor 語法概念相似，但使用不同的繫結標記：

| 功能 | Angular 語法 | .NET Razor 類比 |
|------|-------------|----------------|
| 文字插值 | `{{ expression }}` | `@expression` |
| 屬性繫結 | `[property]="value"` | `@bind-Property="value"` |
| 事件繫結 | `(event)="handler()"` | `@onclick="Handler"` |
| 雙向繫結 | `[(model)]="value"` | `@bind-Value="value"` |
| 條件渲染 | `@if (condition) { }` | `@if (condition) { }` |
| 迴圈渲染 | `@for (item of items; track item.id) { }` | `@foreach (var item in Items) { }` |

### 指令 (Directives)

指令是不帶模板的行為擴充，類似 .NET 的 Attribute 但作用於 DOM：

- **屬性指令**：修改現有元素的行為或外觀（如 `[ngClass]` 已棄用，改用 `[class]`）
- **結構指令**：改變 DOM 結構（v19+ 已被原生控制流取代）
- **自訂指令**：使用 `@Directive` 裝飾器建立

### Pipes

Pipes 用於模板中的資料轉換，類似 .NET 的 `ToString()` 格式化或 Display Attribute：

```typescript
// Built-in pipes
{{ price | currency:'TWD' }}          // CurrencyPipe
{{ createdAt | date:'yyyy-MM-dd' }}   // DatePipe
{{ user | json }}                      // JsonPipe (for debugging)

// Custom pipe
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength: number = 50): string {
    return value.length > maxLength
      ? value.substring(0, maxLength) + '...'
      : value;
  }
}
```

### 內容投影 (Content Projection)

類似 Blazor 的 `RenderFragment`，Angular 使用 `<ng-content>` 進行內容投影：

```typescript
// Parent usage
<app-card>
  <h2 header>Card Title</h2>
  <p>Card body content</p>
</app-card>

// Card component template
<div class="card">
  <div class="card-header">
    <ng-content select="[header]" />
  </div>
  <div class="card-body">
    <ng-content />
  </div>
</div>
```

### Signal-based Input/Output

v19+ 使用 Signal 函式取代裝飾器：

```typescript
import { Component, input, output, model } from '@angular/core';

export class ProductCard {
  // Inputs (read-only signals)
  readonly product = input.required<Product>();
  readonly showActions = input(true);                    // with default value
  readonly count = input(0, { transform: numberAttribute }); // with transform

  // Output (event emitter)
  readonly addToCart = output<Product>();

  // Two-way binding (model signal)
  readonly quantity = model(1);
}
```

---

## 相依注入

### 概述

Angular 的 DI 系統是框架的核心基礎設施，與 .NET Core 的 `IServiceCollection` / `IServiceProvider` 概念高度一致。主要差異在於 Angular 採用樹狀注入器架構，而非 .NET 的扁平容器。

### 基本使用

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Service registration (equivalent to .NET's AddSingleton)
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient); // Field injection (preferred in v19+)

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
}

// Component consumption
export class UserList {
  private readonly userService = inject(UserService);
}
```

### Provider 層級

| Angular Provider | .NET DI 類比 | 說明 |
|-----------------|-------------|------|
| `providedIn: 'root'` | `AddSingleton` | 全域單例，應用程式生命週期 |
| `providedIn: 'platform'` | — | 跨應用程式共享（多應用場景） |
| Component-level `providers` | `AddScoped` (per-request) | 元件實例級別，隨元件銷毀 |
| `@Optional()` / `inject(token, { optional: true })` | 無直接等價 | 可選依賴，未註冊時返回 `null` |

### Injection Token

用於非類別型別的注入，類似 .NET 的 `IOptions<T>` 模式：

```typescript
import { InjectionToken, inject } from '@angular/core';

// Define token (equivalent to IOptions<AppConfig>)
export interface AppConfig {
  apiUrl: string;
  enableLogging: boolean;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

// Provide value
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_CONFIG, useValue: { apiUrl: '/api', enableLogging: true } },
  ],
};

// Consume
export class ApiService {
  private readonly config = inject(APP_CONFIG);
}
```

### 進階模式

- **`useFactory`**：動態建立服務實例，等同 .NET 的 `AddSingleton<T>(sp => ...)`
- **`useExisting`**：服務別名，讓多個 Token 指向同一實例
- **`runInInjectionContext()`**：在注入上下文外部使用 `inject()`，類似 .NET 的 `IServiceProvider.GetRequiredService<T>()`
- **環境注入器 (Environment Injector)**：透過 `createEnvironmentInjector()` 動態建立注入器

---

## 路由導覽

### 概述

Angular Router 提供宣告式路由配置，類似 ASP.NET Core 的端點路由（Endpoint Routing）。支援路由參數、查詢字串、路由守衛、資料解析與延遲載入。

### 基本路由配置

```typescript
// app.routes.ts (equivalent to ASP.NET Core's endpoint configuration)
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () =>
    import('./dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'users', loadComponent: () =>
    import('./users/user-list').then(m => m.UserList) },
  { path: 'users/:id', loadComponent: () =>
    import('./users/user-detail').then(m => m.UserDetail) },
  { path: '**', loadComponent: () =>
    import('./not-found/not-found').then(m => m.NotFound) },
];
```

### 路由守衛 (Guards)

守衛等同於 ASP.NET Core 的 Authorization Filter / Middleware：

```typescript
// Functional guard (preferred in v19+)
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

// Usage in route config
{ path: 'admin', canActivate: [authGuard], loadComponent: () => ... }
```

### 守衛類型

| Angular Guard | .NET 類比 | 用途 |
|--------------|----------|------|
| `canActivate` | `[Authorize]` / `IAuthorizationFilter` | 控制路由是否可進入 |
| `canDeactivate` | — | 控制是否可離開路由（如未儲存表單警告） |
| `canActivateChild` | Policy-based authorization | 保護子路由 |
| `canMatch` | Route constraint | 條件式路由匹配 |
| `resolve` | `IAsyncActionFilter` (data pre-loading) | 路由啟動前預載資料 |

### 延遲載入

```typescript
// Route-level lazy loading (preferred)
{ path: 'reports', loadComponent: () =>
  import('./reports/report-dashboard').then(m => m.ReportDashboard) }

// Child routes lazy loading
{ path: 'admin', loadChildren: () =>
  import('./admin/admin.routes').then(m => m.adminRoutes) }
```

### 路由參數存取

```typescript
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

export class UserDetail {
  private readonly route = inject(ActivatedRoute);

  // Convert route params to signal
  readonly userId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id')!))
  );
}
```

---

## 信號響應式

### 概述

Signals 是 Angular v16 引入、v19+ 全面推薦的響應式原語。它們替代了多數需要 RxJS 的場景，提供更直覺的狀態管理方式。對於 .NET 開發者，Signals 概念最接近 `INotifyPropertyChanged` + 計算屬性（computed property），但具備自動依賴追蹤與精細更新能力。

### 核心原語

```typescript
import { signal, computed, effect, linkedSignal, resource } from '@angular/core';

// 1. signal() — Writable reactive state
const count = signal(0);
count.set(5);                    // Direct replacement
count.update(prev => prev + 1); // Transformation

// 2. computed() — Derived, memoized, lazy (equivalent to C# computed property)
const doubleCount = computed(() => count() * 2);
// Auto-tracks dependencies: re-evaluates only when count changes

// 3. effect() — Side effects (equivalent to property change event handler)
effect(() => {
  console.log(`Count changed to: ${count()}`);
  // Automatically re-runs when count changes
});

// 4. linkedSignal() — Writable state linked to a source
const selectedItem = linkedSignal({
  source: items,
  computation: (items) => items[0] ?? null, // Resets when items change
});
selectedItem.set(items()[2]); // Can be manually overwritten

// 5. resource() — Async data as signal state
const userResource = resource({
  request: () => ({ id: userId() }),
  loader: async ({ request }) => {
    const response = await fetch(`/api/users/${request.id}`);
    return response.json();
  },
});
// Access: userResource.value(), userResource.status(), userResource.isLoading()
```

### Signal vs RxJS Observable 選擇指南

| 場景 | 推薦方案 | 原因 |
|------|---------|------|
| 元件狀態 | `signal()` | 同步、直覺、自動追蹤 |
| 衍生計算 | `computed()` | 自動記憶化，惰性求值 |
| HTTP 請求 | `resource()` 或 RxJS | `resource()` 適合簡單場景；複雜的競態處理用 RxJS |
| 事件流（WebSocket、滑鼠移動） | RxJS `Observable` | 需要運算子組合（debounce、merge、switchMap） |
| 跨元件共享狀態 | Service + `signal()` | 簡單直接，Signal 天然支援 OnPush |
| 複雜非同步管線 | RxJS | 需要 retry、combineLatest、switchMap 等進階操作 |

### RxJS 互操作

```typescript
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

// Observable → Signal
const users = toSignal(this.userService.getUsers$(), { initialValue: [] });

// Signal → Observable
const count$ = toObservable(this.count);
```

### Signal 陷阱

```typescript
// WRONG: In-place mutation — breaks change detection
items().push(newItem);

// CORRECT: Return new reference
items.update(list => [...list, newItem]);

// WRONG: Async read inside reactive context is not tracked
effect(async () => {
  const data = await fetchUser();
  console.log(theme()); // NOT tracked!
});

// CORRECT: Capture signal value before await
effect(async () => {
  const currentTheme = theme(); // Tracked
  const data = await fetchUser();
  console.log(currentTheme);
});
```

---

## 表單處理

### 概述

Angular 提供三種表單方案，類似 .NET 世界中 DataAnnotation、FluentValidation 與簡單 Model Binding 的區分：

| 方案 | 適用場景 | .NET 類比 |
|------|---------|----------|
| **Signal Forms** (v21+) | 新表單，首選方案 | 類似 FluentValidation + 響應式繫結 |
| **Reactive Forms** | 複雜既有表單 | FluentValidation + `ModelState` |
| **Template-driven Forms** | 簡單既有表單 | `DataAnnotation` + Model Binding |

### Reactive Forms

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="name" />
      @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
        <span class="error">Name is required</span>
      }
      <input formControlName="email" type="email" />
      <button type="submit" [disabled]="form.invalid">Submit</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm {
  private readonly fb = inject(FormBuilder);

  // Equivalent to building a ViewModel with validation rules
  protected readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  protected onSubmit(): void {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      // Submit to API
    }
  }
}
```

### 自訂驗證器

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Synchronous validator (equivalent to FluentValidation rule)
export function taiwanPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^09\d{8}$/;
    return pattern.test(control.value) ? null : { taiwanPhone: true };
  };
}

// Async validator (equivalent to remote validation)
export function uniqueEmailValidator(
  userService: UserService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return userService.checkEmail(control.value).pipe(
      map(exists => exists ? { emailTaken: true } : null),
      catchError(() => of(null))
    );
  };
}
```

---

## HTTP 通訊

### 概述

Angular 的 `HttpClient` 與 .NET 的 `HttpClient` 幾乎是同一概念的前端實作。攔截器（Interceptor）等同於 .NET 的 `DelegatingHandler`，提供請求/回應管線處理。

### 基本使用

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/products';

  getAll(page: number, size: number): Observable<Page<Product>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<Product>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(product: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  update(id: string, product: UpdateProductDto): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

### 攔截器 (Interceptors)

v19+ 推薦使用函式式攔截器，等同於 .NET 的 `DelegatingHandler`：

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

// Authentication interceptor (equivalent to DelegatingHandler for Bearer token)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(cloned);
  }

  return next(req);
};

// Error handling interceptor
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          router.navigate(['/login']);
          break;
        case 403:
          snackBar.open('Permission denied', 'Close');
          break;
        case 500:
          snackBar.open('Server error, please try again', 'Close');
          break;
      }
      return throwError(() => error);
    })
  );
};

// Registration (in app.config.ts)
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    ),
  ],
};
```

### 搭配 Signals 使用

```typescript
// Using resource() for reactive data fetching
export class ProductDetail {
  readonly productId = input.required<string>();

  readonly product = resource({
    request: () => ({ id: this.productId() }),
    loader: async ({ request, abortSignal }) => {
      const response = await fetch(`/api/products/${request.id}`, {
        signal: abortSignal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json() as Promise<Product>;
    },
  });
}
```

---

## 測試策略

### 概述

Angular 的測試基礎設施以 `TestBed` 為核心，功能類似 .NET 的 `WebApplicationFactory`。它建立一個測試用的 DI 容器，允許注入真實或 Mock 的依賴。

### 元件測試

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UserCard', () => {
  let fixture: ComponentFixture<UserCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCard],
      providers: [
        provideHttpClientTesting(),
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCard);
    // Set inputs
    fixture.componentRef.setInput('user', mockUser);
    // IMPORTANT: Use whenStable(), never detectChanges()
    await fixture.whenStable();
  });

  it('should display user name', () => {
    const nameElement = fixture.nativeElement.querySelector('h2');
    expect(nameElement.textContent).toContain('John Doe');
  });

  it('should emit event when clicked', () => {
    const spy = spyOn(fixture.componentInstance.selected, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(spy).toHaveBeenCalledWith(mockUser);
  });
});
```

### 服務測試

```typescript
describe('ProductService', () => {
  let service: ProductService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ProductService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify(); // Ensure no outstanding requests
  });

  it('should fetch products', () => {
    const mockProducts: Product[] = [{ id: '1', name: 'Widget' }];

    service.getAll(1, 10).subscribe(result => {
      expect(result.items).toEqual(mockProducts);
    });

    const req = httpTesting.expectOne('/api/products?page=1&size=10');
    expect(req.request.method).toBe('GET');
    req.flush({ items: mockProducts, total: 1 });
  });
});
```

### 測試方針

| 原則 | 說明 | .NET 類比 |
|------|------|----------|
| 使用 `await fixture.whenStable()` | 等待非同步作業完成，取代 `detectChanges()` | `await client.GetAsync(...)` |
| Mock 外部依賴 | 使用 `jasmine.createSpyObj` 或手動 Mock | Moq / NSubstitute |
| HTTP 測試用 `HttpTestingController` | 攔截並模擬 HTTP 請求 | `MockHttpMessageHandler` |
| 測試行為而非實作 | 關注 UI 呈現與使用者互動 | 整合測試原則 |
| 使用 `TestBed.inject()` 取得服務 | 類似 DI 容器的 Resolve | `IServiceProvider.GetService<T>()` |

---

## 風格指南

### 命名慣例

| 項目 | 慣例 | 範例 |
|------|------|------|
| 檔案名稱 | kebab-case | `user-profile.ts`, `auth-guard.ts` |
| 類別名稱 | PascalCase（不加後綴） | `UserProfile`, `AuthGuard` |
| 元件選擇器 | kebab-case + prefix | `app-user-profile`, `ngm-data-table` |
| 服務 | PascalCase + `providedIn: 'root'` | `UserService`, `AuthService` |
| Pipe | camelCase (名稱) | `truncate`, `localCurrency` |
| 常數 | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| 成員變數 | camelCase | `userName`, `isActive` |
| 私有成員 | camelCase (不加底線前綴) | `private readonly http` |

### 檔案結構

```
src/app/
├── app.config.ts          # Application configuration (providers)
├── app.routes.ts          # Root route definitions
├── app.ts                 # Root component
│
├── auth/                  # Feature: Authentication
│   ├── login.ts
│   ├── login.html
│   ├── login.css
│   ├── login.spec.ts
│   ├── register.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts
│   └── auth.routes.ts
│
├── dashboard/             # Feature: Dashboard
│   ├── dashboard.ts
│   ├── dashboard.html
│   └── widgets/
│       ├── revenue-chart.ts
│       └── recent-orders.ts
│
└── shared/                # Shared utilities
    ├── pipes/
    │   └── truncate.pipe.ts
    ├── directives/
    │   └── tooltip.directive.ts
    └── models/
        └── api-response.model.ts
```

### 編碼慣例

```typescript
// 1. Imports: Angular core → Angular modules → Third-party → App modules
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../shared/services/user.service';

// 2. Component metadata: selector → imports → template/templateUrl → styles → changeDetection
@Component({
  selector: 'app-user-list',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  // 3. Member order: injections → inputs/outputs → signals → computed → methods
  private readonly userService = inject(UserService);

  readonly searchTerm = input('');
  readonly userSelected = output<User>();

  protected readonly users = signal<User[]>([]);
  protected readonly filteredUsers = computed(() =>
    this.users().filter(u =>
      u.name.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );

  protected selectUser(user: User): void {
    this.userSelected.emit(user);
  }
}
```

### 關鍵原則

1. **一個概念一個檔案**：每個檔案只匯出一個元件/服務/指令/Pipe
2. **按功能組織**：以業務功能而非技術類型分組（`auth/`、`dashboard/` 而非 `components/`、`services/`）
3. **明確的存取修飾詞**：`private` 用於服務注入，`protected` 用於模板繫結成員，`public` 用於 API
4. **嚴格型別**：永遠不使用 `any`，使用 `unknown` 表達不確定的型別
5. **一致性優先**：當規則與既有檔案風格衝突時，優先維持該檔案的一致性

---

> **下一步**：閱讀 [02-best-practices-catalog.md](./02-best-practices-catalog.md) 了解社群最佳實踐與實戰模式。
