# 第二章：依賴注入 (Dependency Injection)

> **目標讀者**：熟悉 .NET/C# 的後端工程師，首次接觸 Angular 19+ 前端框架。
> 本章涵蓋 Angular 的依賴注入系統，從基礎到進階的完整指南。

---

## 目錄

1. [@Injectable 裝飾器](#1-injectable-裝飾器)
2. [注入器階層](#2-注入器階層)
3. [Provider 類型](#3-provider-類型)
4. [InjectionToken\<T\>](#4-injectiontokent)
5. [inject() vs 建構函式注入](#5-inject-vs-建構函式注入)
6. [Multi-providers](#6-multi-providers)
7. [Tree-shakable providers](#7-tree-shakable-providers)
8. [Resolution modifiers](#8-resolution-modifiers)
9. [EnvironmentInjector](#9-environmentinjector)
10. [DI 作用域模式](#10-di-作用域模式)
11. [完整範例：AuthService 鏈](#11-完整範例authservice-鏈)
12. [常見陷阱](#12-常見陷阱)

---

## 1. @Injectable 裝飾器

### 1.1 概觀

`@Injectable` 裝飾器標記一個類別可以被 Angular 的 DI 系統注入。這是 Angular 的核心機制，類似 .NET 的 `IServiceCollection` 依賴注入容器。

> **C# 對照**：
> - Angular 的 `@Injectable()` ≈ .NET 的服務註冊（`services.AddSingleton<T>()`）
> - Angular 的 `inject()` ≈ .NET 的建構函式注入
> - Angular 的 `InjectionToken` ≈ .NET 的 `IOptions<T>` 或介面型別注入

### 1.2 `providedIn` 選項

`providedIn` 決定服務的註冊範圍和生命週期。

#### `providedIn: 'root'`（最常用）

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _users = signal<User[]>([]);
  readonly users = this._users.asReadonly();

  async loadUsers(): Promise<void> {
    const response = await fetch('/api/users');
    const data = await response.json();
    this._users.set(data);
  }
}
```

| 特性 | 說明 |
|------|------|
| **作用域** | 應用程式全域（整個應用共享一個實例） |
| **生命週期** | 應用程式啟動到結束 |
| **Tree-shakable** | ✅ 如果沒有任何元件注入，構建時會被移除 |
| **C# 對照** | `services.AddSingleton<UserService>()` |

---

#### `providedIn: 'platform'`

```typescript
@Injectable({ providedIn: 'platform' })
export class PlatformLogger {
  log(message: string): void {
    console.log(`[Platform] ${message}`);
  }
}
```

| 特性 | 說明 |
|------|------|
| **作用域** | 平台級別（跨多個 Angular 應用共享） |
| **使用場景** | 微前端 (Micro Frontend) 架構中多個 Angular app 共享同一服務 |
| **C# 對照** | 類似跨 AppDomain 共享的服務 |

---

#### `providedIn: 'any'`

```typescript
@Injectable({ providedIn: 'any' })
export class AnalyticsTracker {
  private readonly events = signal<string[]>([]);

  track(event: string): void {
    this.events.update(list => [...list, event]);
  }
}
```

| 特性 | 說明 |
|------|------|
| **作用域** | 每個延遲載入的模組各自獲得一個實例 |
| **使用場景** | 需要隔離的功能模組分析、狀態 |
| **注意** | Angular 19+ 中較少使用，standalone 架構偏好 `'root'` + 元件級 `providers` |

---

#### 不設定 `providedIn`（手動註冊）

```typescript
// Service without providedIn — must be manually provided
@Injectable()
export class FormValidator {
  validate(value: string): boolean {
    return value.length > 0;
  }
}

// Must register in component providers or route providers
@Component({
  selector: 'app-form',
  providers: [FormValidator], // Scoped to this component
  template: `<!-- ... -->`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyForm {
  private readonly validator = inject(FormValidator);
}
```

| 特性 | 說明 |
|------|------|
| **作用域** | 取決於在哪裡提供 |
| **Tree-shakable** | ❌ 必須手動確保只在需要的地方提供 |
| **使用場景** | 元件級作用域的服務（如表單狀態） |
| **C# 對照** | `services.AddScoped<FormValidator>()` 或 `services.AddTransient<FormValidator>()` |

### 1.3 providedIn 決策流程

```
需要此服務嗎？
├── 是：整個應用都需要
│   └── providedIn: 'root'     ← 90% 的情況
├── 是：只有特定元件樹需要
│   └── 不設 providedIn，在元件 providers 中註冊
├── 是：每個延遲載入區塊各自需要一份
│   └── providedIn: 'any'      ← 少見
└── 是：跨多個 Angular 應用共享
    └── providedIn: 'platform'  ← 微前端場景
```

---

## 2. 注入器階層

### 2.1 階層架構圖

Angular 的 DI 系統採用階層式注入器，當一個元件請求依賴時，Angular 會從當前注入器向上逐層查找。

```
┌─────────────────────────────────────────────────┐
│                Platform Injector                 │
│  (providedIn: 'platform')                       │
│  Services shared across multiple Angular apps   │
├─────────────────────────────────────────────────┤
│                  Root Injector                   │
│  (providedIn: 'root')                           │
│  Application-wide singletons                    │
│  bootstrapApplication(..., { providers: [...] })│
├─────────────────────────────────────────────────┤
│              Route-level Injector                │
│  (Route.providers)                              │
│  Services scoped to a route subtree             │
├─────────────────────┬───────────────────────────┤
│  Element Injector A │  Element Injector B       │
│  (Component.providers)│ (Component.providers)   │
│  Component-scoped   │  Component-scoped         │
├──────────┬──────────┼──────────┬────────────────┤
│ Child A1 │ Child A2 │ Child B1 │ Child B2       │
│ (inherits│ (inherits│ (inherits│ (inherits      │
│  from A) │  from A) │  from B) │  from B)       │
└──────────┴──────────┴──────────┴────────────────┘
```

### 2.2 解析演算法

當元件透過 `inject(ServiceX)` 請求依賴時：

```
1. 查找當前元件的 Element Injector
   ├── 找到 → 返回實例
   └── 沒找到 → 繼續
2. 查找父元件的 Element Injector
   ├── 找到 → 返回實例
   └── 沒找到 → 繼續向上
3. ... 持續向上直到根元件
4. 查找 Route-level Injector
   ├── 找到 → 返回實例
   └── 沒找到 → 繼續
5. 查找 Root Injector (Environment Injector)
   ├── 找到 → 返回實例
   └── 沒找到 → 繼續
6. 查找 Platform Injector
   ├── 找到 → 返回實例
   └── 沒找到 → 拋出 NullInjectorError
```

> **C# 對照**：這類似 .NET 的 scoped DI，但 Angular 的階層更細粒度。.NET 的 scoped 生命週期限於 HTTP 請求；Angular 的元件級注入器限於元件實例的生命週期。

### 2.3 Route-level Providers（路由級提供者）

Angular 19+ 支援在路由設定中提供服務，作用域限於該路由子樹。

```typescript
// admin.routes.ts
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    providers: [
      // This AdminStore instance is shared by ALL children of this route
      AdminStore,
      { provide: API_BASE_URL, useValue: '/api/admin' },
    ],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./admin-dashboard').then(m => m.AdminDashboard),
      },
      {
        path: 'users',
        loadComponent: () => import('./admin-users').then(m => m.AdminUsers),
      },
    ],
  },
];
```

這個模式非常適合「功能區域」級別的共享狀態，比 `providedIn: 'root'` 的全域單例更精確。

---

## 3. Provider 類型

### 3.1 概觀

Angular 提供四種 Provider 配置方式，控制 DI 容器如何建立實例。

| Provider 類型 | 用途 | C# 對照 |
|--------------|------|---------|
| `useClass` | 提供一個類別的實例 | `services.AddSingleton<IService, ConcreteService>()` |
| `useValue` | 提供一個現有的值 | `services.AddSingleton<IConfig>(configInstance)` |
| `useFactory` | 透過工廠函式建立實例 | `services.AddSingleton<IService>(sp => new Service(...))` |
| `useExisting` | 建立一個別名指向已有的 provider | 類似介面轉發 |

### 3.2 `useClass` — 類別替換

```typescript
// Abstract base / interface
export abstract class Logger {
  abstract log(message: string): void;
  abstract error(message: string, error?: unknown): void;
}

// Development implementation
@Injectable()
export class ConsoleLogger extends Logger {
  log(message: string): void {
    console.log(`[DEV] ${message}`);
  }

  error(message: string, error?: unknown): void {
    console.error(`[DEV ERROR] ${message}`, error);
  }
}

// Production implementation
@Injectable()
export class CloudLogger extends Logger {
  private readonly http = inject(HttpClient);

  log(message: string): void {
    this.http.post('/api/logs', { level: 'info', message }).subscribe();
  }

  error(message: string, error?: unknown): void {
    this.http.post('/api/logs', { level: 'error', message, error }).subscribe();
  }
}

// Registration in app config
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: Logger,
      useClass: environment.production ? CloudLogger : ConsoleLogger,
    },
  ],
};

// Usage — consumer doesn't know which implementation is used
@Component({ /* ... */ })
export class OrderService {
  private readonly logger = inject(Logger);

  processOrder(order: Order): void {
    this.logger.log(`Processing order: ${order.id}`);
  }
}
```

> **C# 對照**：完全對應 `services.AddSingleton<ILogger, CloudLogger>()`。

---

### 3.3 `useValue` — 常數值

```typescript
import { InjectionToken } from '@angular/core';

// Define a token for the configuration
export interface AppConfig {
  apiBaseUrl: string;
  maxRetries: number;
  featureFlags: Record<string, boolean>;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

// Provide a concrete value
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_CONFIG,
      useValue: {
        apiBaseUrl: 'https://api.example.com',
        maxRetries: 3,
        featureFlags: {
          darkMode: true,
          betaFeatures: false,
        },
      } satisfies AppConfig,
    },
  ],
};

// Usage
@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly config = inject(APP_CONFIG);
  private readonly http = inject(HttpClient);

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.config.apiBaseUrl}${path}`);
  }
}
```

> **C# 對照**：類似 `services.Configure<AppConfig>(configuration.GetSection("App"))` 或 `services.AddSingleton(Options.Create(config))`。

---

### 3.4 `useFactory` — 工廠函式

```typescript
import { InjectionToken, inject } from '@angular/core';

// Token for a dynamic value
export const BROWSER_LOCALE = new InjectionToken<string>('BROWSER_LOCALE', {
  providedIn: 'root',
  factory: () => navigator.language ?? 'en-US',
});

// Factory with dependencies
export const DATE_FORMATTER = new InjectionToken<Intl.DateTimeFormat>('DATE_FORMATTER', {
  providedIn: 'root',
  factory: () => {
    const locale = inject(BROWSER_LOCALE);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },
});

// Factory in providers array
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: 'API_CLIENT',
      useFactory: () => {
        const config = inject(APP_CONFIG);
        const http = inject(HttpClient);

        return {
          get: <T>(path: string) =>
            http.get<T>(`${config.apiBaseUrl}${path}`),
          post: <T>(path: string, body: unknown) =>
            http.get<T>(`${config.apiBaseUrl}${path}`, body),
        };
      },
    },
  ],
};

// Usage in a component
@Component({ /* ... */ })
export class EventDetail {
  private readonly formatter = inject(DATE_FORMATTER);

  protected formatDate(date: Date): string {
    return this.formatter.format(date);
  }
}
```

> **C# 對照**：完全對應 `services.AddSingleton<IApiClient>(sp => { var config = sp.GetRequiredService<IOptions<AppConfig>>(); ... })`。

---

### 3.5 `useExisting` — 別名

```typescript
// Original service
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isAuthenticated = signal(false);
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  login(credentials: Credentials): Observable<AuthResult> { /* ... */ }
  logout(): void { /* ... */ }
  getToken(): string | null { /* ... */ }
}

// Narrow interface for components that only need to check auth status
export abstract class AuthChecker {
  abstract readonly isAuthenticated: Signal<boolean>;
}

// Register alias — AuthChecker resolves to the same AuthService instance
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: AuthChecker,
      useExisting: AuthService,
    },
  ],
};

// Usage — component only sees the narrow interface
@Component({ /* ... */ })
export class NavBar {
  private readonly auth = inject(AuthChecker);

  protected readonly isLoggedIn = this.auth.isAuthenticated;
}
```

> **C# 對照**：類似 `services.AddSingleton<IAuthChecker>(sp => sp.GetRequiredService<AuthService>())`。注意兩者指向同一個實例。

---

## 4. InjectionToken\<T\>

### 4.1 為什麼需要 InjectionToken？

在 .NET 中，DI 系統使用介面或類別型別作為 key（如 `ILogger`、`IDbContext`）。JavaScript/TypeScript 的介面在執行時不存在（被擦除），因此 Angular 需要 `InjectionToken` 作為替代。

```typescript
// ❌ This doesn't work — interfaces don't exist at runtime
// inject(AppConfig) — Error: AppConfig is an interface, not a class

// ✅ Use InjectionToken for non-class dependencies
const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
```

### 4.2 基本用法

```typescript
import { InjectionToken, inject } from '@angular/core';

// 1. Define the token with type parameter
export const MAX_FILE_SIZE = new InjectionToken<number>('MAX_FILE_SIZE');

// 2. Provide the value
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: MAX_FILE_SIZE, useValue: 10 * 1024 * 1024 }, // 10 MB
  ],
};

// 3. Inject the value
@Injectable({ providedIn: 'root' })
export class FileUploadService {
  private readonly maxSize = inject(MAX_FILE_SIZE);

  validateSize(file: File): boolean {
    return file.size <= this.maxSize;
  }
}
```

### 4.3 帶工廠的 InjectionToken

```typescript
// Self-providing token with factory — no need for manual registration
export const WINDOW = new InjectionToken<Window>('WINDOW', {
  providedIn: 'root',
  factory: () => {
    if (typeof window !== 'undefined') {
      return window;
    }
    // SSR fallback
    return {} as Window;
  },
});

export const LOCAL_STORAGE = new InjectionToken<Storage>('LOCAL_STORAGE', {
  providedIn: 'root',
  factory: () => {
    const win = inject(WINDOW);
    return win.localStorage;
  },
});

export const SESSION_ID = new InjectionToken<string>('SESSION_ID', {
  providedIn: 'root',
  factory: () => crypto.randomUUID(),
});
```

### 4.4 APP_INITIALIZER 模式

`APP_INITIALIZER` 是 Angular 內建的 `InjectionToken`，用於在應用程式啟動前執行初始化邏輯。

```typescript
import { APP_INITIALIZER, inject } from '@angular/core';

// Function that returns a Promise — app waits for it to resolve
function initializeApp(): () => Promise<void> {
  const configService = inject(ConfigService);
  const authService = inject(AuthService);

  return async () => {
    // Load remote configuration
    await configService.load();

    // Attempt to restore session
    await authService.tryRestoreSession();

    console.log('Application initialized');
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true, // Allow multiple initializers
    },
  ],
};
```

> **C# 對照**：`APP_INITIALIZER` 類似 .NET 的 `IHostedService.StartAsync()` 或 `app.Use(async (context, next) => { ... })` 中間件的初始化階段。

---

## 5. inject() vs 建構函式注入

### 5.1 兩種注入方式比較

```typescript
// ❌ Legacy: Constructor injection
@Component({
  selector: 'app-user-list',
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    @Optional() private readonly logger?: Logger,
  ) {}
}

// ✅ Modern: inject() function
@Component({
  selector: 'app-user-list',
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly config = inject(APP_CONFIG);
  private readonly logger = inject(Logger, { optional: true });
}
```

### 5.2 詳細比較表

| 特性 | 建構函式注入 | `inject()` |
|------|------------|-----------|
| 語法 | `constructor(private svc: Service)` | `private readonly svc = inject(Service)` |
| InjectionToken | 需要 `@Inject(TOKEN)` 裝飾器 | 直接 `inject(TOKEN)` |
| Optional | 需要 `@Optional()` 裝飾器 | `inject(Service, { optional: true })` |
| Self | 需要 `@Self()` 裝飾器 | `inject(Service, { self: true })` |
| SkipSelf | 需要 `@SkipSelf()` 裝飾器 | `inject(Service, { skipSelf: true })` |
| Host | 需要 `@Host()` 裝飾器 | `inject(Service, { host: true })` |
| 函式守衛 | ❌ 不支援 | ✅ 支援 |
| 工廠函式 | ❌ 不支援 | ✅ 支援 |
| 繼承 | 需要 `super(...)` 傳遞 | 子類別自動繼承 |
| 可讀性 | 參數清單可能很長 | 每個依賴一行，清楚明瞭 |

### 5.3 注入上下文 (Injection Context)

`inject()` 只能在特定的「注入上下文」中使用：

```typescript
// ✅ 1. Class field initializers (most common)
export class MyComponent {
  private readonly service = inject(MyService);
}

// ✅ 2. Constructor body
export class MyComponent {
  constructor() {
    const service = inject(MyService);
  }
}

// ✅ 3. Factory functions
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: ApiClient,
      useFactory: () => {
        const http = inject(HttpClient);
        const config = inject(APP_CONFIG);
        return new ApiClient(http, config);
      },
    },
  ],
};

// ✅ 4. Functional guards and resolvers
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() || router.createUrlTree(['/login']);
};

// ✅ 5. InjectionToken factory
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => inject(APP_CONFIG).apiBaseUrl,
});

// ❌ NOT in injection context — will throw error
export class MyComponent {
  private readonly service = inject(MyService); // ✅ OK

  handleClick(): void {
    const other = inject(OtherService); // ❌ Error! Not in injection context
  }
}
```

### 5.4 `runInInjectionContext()` — 在注入上下文外使用 inject()

```typescript
import { EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';

@Component({ /* ... */ })
export class DynamicLoader {
  private readonly injector = inject(EnvironmentInjector);

  loadPlugin(pluginName: string): void {
    // Create an injection context manually
    runInInjectionContext(this.injector, () => {
      const http = inject(HttpClient);
      const config = inject(APP_CONFIG);

      http.get(`${config.apiBaseUrl}/plugins/${pluginName}`).subscribe(plugin => {
        console.log('Plugin loaded:', plugin);
      });
    });
  }
}
```

---

## 6. Multi-providers

### 6.1 概觀

`multi: true` 允許多個 provider 使用相同的 token，Angular 會收集所有值為陣列注入。

> **C# 對照**：類似 `services.AddSingleton<IValidator, EmailValidator>()` + `services.AddSingleton<IValidator, PhoneValidator>()`，然後注入 `IEnumerable<IValidator>`。

### 6.2 HTTP 攔截器（最常見的 multi-provider 用法）

```typescript
import { HttpInterceptorFn } from '@angular/common/http';

// Interceptor 1: Add auth token
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

// Interceptor 2: Add correlation ID for distributed tracing
export const correlationInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionId = inject(SESSION_ID);
  const cloned = req.clone({
    setHeaders: { 'X-Correlation-ID': `${sessionId}-${crypto.randomUUID()}` },
  });
  return next(cloned);
};

// Interceptor 3: Global error handling
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        notifications.show('Session expired. Please log in again.', 'error');
      } else if (error.status >= 500) {
        notifications.show('Server error. Please try again later.', 'error');
      }
      return throwError(() => error);
    })
  );
};

// Interceptor 4: Retry with exponential backoff
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(APP_CONFIG);

  return next(req).pipe(
    retry({
      count: config.maxRetries,
      delay: (error, retryCount) => {
        if (error.status < 500) {
          return throwError(() => error); // Don't retry client errors
        }
        const delay = Math.pow(2, retryCount) * 1000;
        return timer(delay);
      },
    })
  );
};

// Registration — order matters! Interceptors execute in array order
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        correlationInterceptor,  // 1st: add correlation ID
        authInterceptor,         // 2nd: add auth token
        retryInterceptor,        // 3rd: retry on failure
        errorInterceptor,        // 4th: handle final errors
      ])
    ),
  ],
};
```

### 6.3 自訂 Multi-provider

```typescript
// Define a token for form validators
export const FORM_VALIDATORS = new InjectionToken<FormValidatorFn[]>('FORM_VALIDATORS');

export type FormValidatorFn = (value: string) => string | null;

// Individual validators
export const requiredValidator: FormValidatorFn = (value) =>
  value.trim().length === 0 ? 'This field is required' : null;

export const emailValidator: FormValidatorFn = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Invalid email address';

export const minLengthValidator = (min: number): FormValidatorFn =>
  (value) => value.length < min ? `Minimum ${min} characters required` : null;

// Registration
@Component({
  selector: 'app-email-form',
  providers: [
    { provide: FORM_VALIDATORS, useValue: requiredValidator, multi: true },
    { provide: FORM_VALIDATORS, useValue: emailValidator, multi: true },
    {
      provide: FORM_VALIDATORS,
      useFactory: () => minLengthValidator(5),
      multi: true,
    },
  ],
  template: `<!-- ... -->`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailForm {
  // validators is FormValidatorFn[] (an array of all registered validators)
  private readonly validators = inject(FORM_VALIDATORS);

  validate(value: string): string[] {
    return this.validators
      .map(v => v(value))
      .filter((error): error is string => error !== null);
  }
}
```

---

## 7. Tree-shakable providers

### 7.1 概觀

Tree-shaking 是構建工具（如 esbuild）在打包時移除未使用程式碼的過程。Angular 的 `providedIn: 'root'` 天然支援 tree-shaking。

### 7.2 Tree-shakable vs 非 Tree-shakable

```typescript
// ✅ Tree-shakable: if no one injects ReportService, it's removed from bundle
@Injectable({ providedIn: 'root' })
export class ReportService {
  generateReport(): void { /* complex logic */ }
}

// ❌ NOT tree-shakable: registered in providers array, always included
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    ReportService, // Always in the bundle, even if unused
  ],
};
```

### 7.3 運作原理

```
                      構建時分析
                          │
                          ▼
  ┌───────────────────────────────────────────┐
  │ Angular Compiler 掃描所有 inject() 呼叫    │
  │                                            │
  │ 找到 inject(UserService) → 保留            │
  │ 找到 inject(ReportService) → 保留          │
  │ 沒找到 inject(LegacyService) → 移除 ✂️    │
  └───────────────────────────────────────────┘
```

### 7.4 InjectionToken 的 Tree-shaking

```typescript
// ✅ Tree-shakable: factory inside the token
export const ANALYTICS_ID = new InjectionToken<string>('ANALYTICS_ID', {
  providedIn: 'root',
  factory: () => 'UA-XXXXX-Y',
});

// ❌ NOT tree-shakable: provided in providers array
export const ANALYTICS_ID = new InjectionToken<string>('ANALYTICS_ID');
// providers: [{ provide: ANALYTICS_ID, useValue: 'UA-XXXXX-Y' }]
```

> **C# 對照**：Tree-shaking 在 .NET 世界中類似 Trimming（.NET 8+ 的 `<PublishTrimmed>true</PublishTrimmed>`），移除未使用的程式碼以減少發佈大小。

---

## 8. Resolution modifiers

### 8.1 概觀

Resolution modifiers 控制 Angular 的依賴解析行為，決定在哪些注入器中查找。

### 8.2 `@Optional` / `{ optional: true }`

當依賴可能不存在時，回傳 `null` 而非拋出錯誤。

```typescript
@Component({ /* ... */ })
export class FeatureToggle {
  // If no FeatureFlagService is provided, returns null
  private readonly featureFlags = inject(FeatureFlagService, { optional: true });

  isEnabled(feature: string): boolean {
    return this.featureFlags?.isEnabled(feature) ?? false;
  }
}
```

```
解析流程:
  Element Injector → Parent → ... → Root Injector → Platform Injector
  → 找不到 → 回傳 null (不拋出錯誤)
```

> **C# 對照**：類似 `sp.GetService<T>()` (回傳 null) vs `sp.GetRequiredService<T>()` (拋出例外)。

---

### 8.3 `@Self` / `{ self: true }`

只在當前元件的 Element Injector 中查找，不向上查找。

```typescript
@Component({
  selector: 'app-modal',
  providers: [ModalState], // Must be provided HERE
  template: `<!-- ... -->`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  // Only looks in this component's injector — won't find parent's ModalState
  private readonly state = inject(ModalState, { self: true });
}
```

```
解析流程:
  Element Injector (current component only)
  → 找到 → 返回
  → 找不到 → NullInjectorError
```

> **使用場景**：確保每個元件實例使用自己的服務實例，不會意外共享父元件的。

---

### 8.4 `@SkipSelf` / `{ skipSelf: true }`

跳過當前元件的 Element Injector，從父元件開始查找。

```typescript
@Component({
  selector: 'app-nested-accordion',
  providers: [AccordionState], // Provides its own state
  template: `<!-- ... -->`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NestedAccordion {
  // Own state for this level
  private readonly state = inject(AccordionState, { self: true });

  // Parent accordion's state (if nested)
  private readonly parentState = inject(AccordionState, {
    skipSelf: true,
    optional: true,
  });

  toggle(): void {
    this.state.toggle();
    // Optionally notify parent
    this.parentState?.childToggled();
  }
}
```

```
解析流程:
  跳過當前 Element Injector
  → Parent Element Injector → ... → Root Injector
```

---

### 8.5 `@Host` / `{ host: true }`

在當前元件的 Element Injector 和宿主元件的 Element Injector 中查找，但不繼續向上。

```typescript
// Form field needs its parent form's state
@Component({
  selector: 'app-form-field',
  template: `<input [formControlName]="controlName()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField {
  readonly controlName = input.required<string>();

  // Look in self and host — don't traverse further up
  private readonly form = inject(FormGroupDirective, { host: true });
}
```

```
解析流程:
  Element Injector (self) → Host Element Injector
  → 找到 → 返回
  → 找不到 → NullInjectorError
```

### 8.6 Resolution Modifiers 決策表

| Modifier | 查找範圍 | 常見場景 |
|----------|---------|---------|
| （預設） | 自己 → 父 → ... → Root → Platform | 大多數情況 |
| `optional` | 同上，但找不到回傳 null | 可選功能 |
| `self` | 僅自己 | 確保使用自己的實例 |
| `skipSelf` | 父 → ... → Root | 存取父層的實例 |
| `host` | 自己 → 宿主 | 指令存取宿主元件 |

---

## 9. EnvironmentInjector

### 9.1 概觀

`EnvironmentInjector` 是 Angular 的「環境注入器」，對應 Module-level 或 Application-level 的注入器。在 standalone 架構中取代了 NgModule 的注入器角色。

### 9.2 `runInInjectionContext()`

在非注入上下文中執行需要 `inject()` 的程式碼。

```typescript
import {
  Component,
  ChangeDetectionStrategy,
  EnvironmentInjector,
  inject,
  runInInjectionContext,
} from '@angular/core';

@Component({
  selector: 'app-plugin-host',
  template: `
    <button (click)="loadPlugin('analytics')">Load Analytics</button>
    <button (click)="loadPlugin('chat')">Load Chat</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PluginHost {
  private readonly injector = inject(EnvironmentInjector);

  loadPlugin(name: string): void {
    // This method is called from a click handler — NOT an injection context
    // We need runInInjectionContext to use inject()
    runInInjectionContext(this.injector, () => {
      const http = inject(HttpClient);
      const config = inject(APP_CONFIG);

      http.get<Plugin>(`${config.apiBaseUrl}/plugins/${name}`).subscribe({
        next: (plugin) => this.activatePlugin(plugin),
        error: (err) => console.error(`Failed to load plugin: ${name}`, err),
      });
    });
  }

  private activatePlugin(plugin: Plugin): void {
    // Plugin activation logic
  }
}
```

### 9.3 `createEnvironmentInjector()`

動態建立新的環境注入器，適用於動態元件載入。

```typescript
import {
  createEnvironmentInjector,
  EnvironmentInjector,
  inject,
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PluginManager {
  private readonly parentInjector = inject(EnvironmentInjector);
  private readonly pluginInjectors = new Map<string, EnvironmentInjector>();

  createPluginScope(pluginId: string, providers: Provider[]): EnvironmentInjector {
    // Each plugin gets its own injector with isolated services
    const pluginInjector = createEnvironmentInjector(
      providers,
      this.parentInjector,
      `Plugin: ${pluginId}`
    );

    this.pluginInjectors.set(pluginId, pluginInjector);
    return pluginInjector;
  }

  destroyPlugin(pluginId: string): void {
    const injector = this.pluginInjectors.get(pluginId);
    if (injector) {
      injector.destroy();
      this.pluginInjectors.delete(pluginId);
    }
  }
}
```

> **C# 對照**：`createEnvironmentInjector` 類似 .NET 的 `IServiceScopeFactory.CreateScope()`，建立一個新的 DI 作用域。

---

## 10. DI 作用域模式

### 10.1 三種作用域

| 模式 | Angular 實現 | C# 對照 | 生命週期 |
|------|------------|---------|---------|
| **Singleton** | `providedIn: 'root'` | `AddSingleton<T>()` | 應用程式生命週期 |
| **Scoped** | `Component.providers` 或 `Route.providers` | `AddScoped<T>()` | 元件/路由生命週期 |
| **Transient** | `useFactory` 每次回傳新實例 | `AddTransient<T>()` | 每次注入建立新實例 |

### 10.2 Singleton 模式

```typescript
// Singleton — one instance for the entire app
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  login(user: User): void {
    this._user.set(user);
  }

  logout(): void {
    this._user.set(null);
  }
}
```

### 10.3 Scoped 模式

```typescript
// Scoped — one instance per component tree
@Injectable()
export class WizardState {
  private readonly _currentStep = signal(0);
  private readonly _data = signal<Record<string, unknown>>({});

  readonly currentStep = this._currentStep.asReadonly();
  readonly data = this._data.asReadonly();

  nextStep(): void {
    this._currentStep.update(s => s + 1);
  }

  previousStep(): void {
    this._currentStep.update(s => Math.max(0, s - 1));
  }

  updateData(partial: Record<string, unknown>): void {
    this._data.update(d => ({ ...d, ...partial }));
  }
}

// Each <app-wizard> gets its own WizardState
@Component({
  selector: 'app-wizard',
  providers: [WizardState],
  template: `
    @switch (state.currentStep()) {
      @case (0) { <app-wizard-step1 /> }
      @case (1) { <app-wizard-step2 /> }
      @case (2) { <app-wizard-step3 /> }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Wizard {
  protected readonly state = inject(WizardState);
}

// Child component shares the same WizardState instance
@Component({
  selector: 'app-wizard-step1',
  template: `
    <h2>Step 1: Personal Info</h2>
    <input (input)="onNameChange($event)" />
    <button (click)="state.nextStep()">Next</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardStep1 {
  protected readonly state = inject(WizardState);

  protected onNameChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.state.updateData({ name: value });
  }
}
```

### 10.4 Transient 模式

```typescript
// Transient — new instance every time it's injected
export const UNIQUE_ID = new InjectionToken<string>('UNIQUE_ID', {
  providedIn: 'root',
  factory: () => crypto.randomUUID(), // New UUID every injection
});

// ⚠️ Note: InjectionToken with factory in 'root' is still singleton!
// For true transient, use component-level useFactory:

@Component({
  selector: 'app-item',
  providers: [
    {
      provide: UNIQUE_ID,
      useFactory: () => crypto.randomUUID(), // New value per component instance
    },
  ],
  template: `<span>ID: {{ id }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  protected readonly id = inject(UNIQUE_ID);
}
```

### 10.5 作用域決策表

| 需求 | 推薦模式 | 實現方式 |
|------|---------|---------|
| 全域共享狀態（Auth、Config） | Singleton | `providedIn: 'root'` |
| 功能區域共享（Admin section） | Route Scoped | `Route.providers` |
| 元件樹共享（Wizard steps） | Component Scoped | `Component.providers` |
| 每個實例獨立（Form state） | Component Scoped | `Component.providers` |
| 每次注入都是新的 | Transient | `useFactory` in `Component.providers` |

---

## 11. 完整範例：AuthService 鏈

以下範例展示一個完整的認證系統，涵蓋本章所有 DI 概念。

### 11.1 Token 與介面定義

```typescript
// auth.tokens.ts
import { InjectionToken } from '@angular/core';

export interface AuthConfig {
  loginUrl: string;
  tokenRefreshUrl: string;
  tokenKey: string;
  refreshTokenKey: string;
  tokenExpiryBuffer: number; // seconds before expiry to trigger refresh
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    loginUrl: '/api/auth/login',
    tokenRefreshUrl: '/api/auth/refresh',
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiryBuffer: 60,
  }),
});

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}
```

### 11.2 TokenService — Token 管理

```typescript
// token.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { AUTH_CONFIG, type AuthTokens } from './auth.tokens';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly config = inject(AUTH_CONFIG);
  private readonly _accessToken = signal<string | null>(null);
  private readonly _refreshToken = signal<string | null>(null);
  private readonly _expiresAt = signal<number>(0);

  readonly accessToken = this._accessToken.asReadonly();
  readonly refreshToken = this._refreshToken.asReadonly();

  readonly isExpired = computed(() => {
    const expiresAt = this._expiresAt();
    if (expiresAt === 0) return true;
    const bufferMs = this.config.tokenExpiryBuffer * 1000;
    return Date.now() >= expiresAt - bufferMs;
  });

  readonly hasTokens = computed(() =>
    this._accessToken() !== null && this._refreshToken() !== null
  );

  constructor() {
    // Restore tokens from localStorage on initialization
    this.restoreFromStorage();
  }

  setTokens(tokens: AuthTokens): void {
    this._accessToken.set(tokens.accessToken);
    this._refreshToken.set(tokens.refreshToken);
    this._expiresAt.set(Date.now() + tokens.expiresIn * 1000);

    // Persist to localStorage
    localStorage.setItem(this.config.tokenKey, tokens.accessToken);
    localStorage.setItem(this.config.refreshTokenKey, tokens.refreshToken);
    localStorage.setItem('token_expires_at', String(this._expiresAt()));
  }

  clearTokens(): void {
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._expiresAt.set(0);

    localStorage.removeItem(this.config.tokenKey);
    localStorage.removeItem(this.config.refreshTokenKey);
    localStorage.removeItem('token_expires_at');
  }

  private restoreFromStorage(): void {
    const accessToken = localStorage.getItem(this.config.tokenKey);
    const refreshToken = localStorage.getItem(this.config.refreshTokenKey);
    const expiresAt = Number(localStorage.getItem('token_expires_at') ?? '0');

    if (accessToken && refreshToken && expiresAt > Date.now()) {
      this._accessToken.set(accessToken);
      this._refreshToken.set(refreshToken);
      this._expiresAt.set(expiresAt);
    }
  }
}
```

### 11.3 AuthService — 認證核心

```typescript
// auth.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, switchMap } from 'rxjs';
import { TokenService } from './token.service';
import {
  AUTH_CONFIG,
  type AuthTokens,
  type LoginCredentials,
  type UserProfile,
} from './auth.tokens';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  private readonly config = inject(AUTH_CONFIG);

  private readonly _user = signal<UserProfile | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => this._user()?.role === 'admin');

  login(credentials: LoginCredentials): Observable<UserProfile> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<AuthTokens>(this.config.loginUrl, credentials).pipe(
      tap(tokens => this.tokenService.setTokens(tokens)),
      switchMap(() => this.fetchProfile()),
      tap(profile => {
        this._user.set(profile);
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        this._error.set(err.error?.message ?? 'Login failed');
        return of(null as unknown as UserProfile);
      })
    );
  }

  logout(): void {
    this.tokenService.clearTokens();
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<AuthTokens | null> {
    const refreshToken = this.tokenService.refreshToken();
    if (!refreshToken) {
      this.logout();
      return of(null);
    }

    return this.http.post<AuthTokens>(this.config.tokenRefreshUrl, { refreshToken }).pipe(
      tap(tokens => this.tokenService.setTokens(tokens)),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  tryRestoreSession(): Observable<UserProfile | null> {
    if (!this.tokenService.hasTokens()) {
      return of(null);
    }

    if (this.tokenService.isExpired()) {
      return this.refreshToken().pipe(
        switchMap(tokens => tokens ? this.fetchProfile() : of(null)),
        tap(profile => this._user.set(profile))
      );
    }

    return this.fetchProfile().pipe(
      tap(profile => this._user.set(profile)),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  private fetchProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>('/api/auth/profile');
  }
}
```

### 11.4 Auth Interceptor — 自動附加 Token

```typescript
// auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  // Skip auth for login/refresh endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const token = tokenService.accessToken();
  if (!token) {
    return next(req);
  }

  // Check if token is about to expire
  if (tokenService.isExpired()) {
    return authService.refreshToken().pipe(
      switchMap(() => {
        const newToken = tokenService.accessToken();
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` },
        });
        return next(cloned);
      })
    );
  }

  // Add token to request
  const cloned = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token might have been revoked server-side
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = tokenService.accessToken();
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
```

### 11.5 Auth Guard — 路由守衛

```typescript
// auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  // Redirect to login with return URL
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: router.url },
  });
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }

  if (auth.isAuthenticated()) {
    // Authenticated but not admin — show 403
    return router.createUrlTree(['/forbidden']);
  }

  return router.createUrlTree(['/login']);
};
```

### 11.6 App Config — 組裝所有元件

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './auth/auth.interceptor';
import { correlationInterceptor } from './shared/correlation.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        correlationInterceptor,
        authInterceptor,
      ])
    ),
    provideAnimationsAsync(),
  ],
};
```

### 11.7 Login Page — 使用認證服務

```typescript
// login.page.ts
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card class="login-card">
      <mat-card-header>
        <mat-card-title>Login</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        @if (authService.error(); as err) {
          <div class="error" role="alert">{{ err }}</div>
        }

        <form (ngSubmit)="onSubmit()">
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput
                   type="email"
                   [(ngModel)]="email"
                   name="email"
                   required />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Password</mat-label>
            <input matInput
                   type="password"
                   [(ngModel)]="password"
                   name="password"
                   required />
          </mat-form-field>

          <button mat-raised-button
                  color="primary"
                  type="submit"
                  [disabled]="authService.loading()">
            @if (authService.loading()) {
              Logging in...
            } @else {
              Login
            }
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .login-card { width: 400px; padding: 24px; }
    mat-form-field { width: 100%; margin-bottom: 16px; }
    .error {
      background: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected email = '';
  protected password = '';

  protected onSubmit(): void {
    this.authService.login({ email: this.email, password: this.password }).subscribe(user => {
      if (user) {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/';
        this.router.navigateByUrl(returnUrl);
      }
    });
  }
}
```

---

## 12. 常見陷阱

### 陷阱 1：忘記 `@Injectable()` 裝飾器

```typescript
// ❌ Missing @Injectable — DI won't work
export class DataService {
  private readonly http = inject(HttpClient); // Runtime error!
}

// ✅ Always add @Injectable
@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);
}
```

**說明**：`@Injectable()` 告訴 Angular 編譯器為此類別生成 DI 元資料。沒有它，`inject()` 無法運作。

---

### 陷阱 2：在非注入上下文中使用 `inject()`

```typescript
@Component({ /* ... */ })
export class MyComponent {
  private readonly service = inject(MyService); // ✅ OK — field initializer

  handleClick(): void {
    const other = inject(OtherService); // ❌ Error! Not in injection context
  }

  // ✅ Fix: inject in field initializer or use runInInjectionContext
  private readonly otherService = inject(OtherService);

  handleClickFixed(): void {
    this.otherService.doSomething(); // ✅ OK
  }
}
```

**說明**：`inject()` 只能在建構函式、欄位初始化器、工廠函式、守衛中呼叫。

---

### 陷阱 3：`providedIn: 'root'` 不是永遠正確

```typescript
// ❌ Form state as singleton — all forms share the same state!
@Injectable({ providedIn: 'root' })
export class FormState {
  private readonly data = signal<Record<string, string>>({});
  // Bug: opening a second form overwrites the first form's data
}

// ✅ Form state scoped to component
@Injectable() // No providedIn — will be provided per component
export class FormState {
  private readonly data = signal<Record<string, string>>({});
}

@Component({
  providers: [FormState], // Each form instance gets its own FormState
})
export class RegistrationForm {
  private readonly formState = inject(FormState);
}
```

**說明**：不是所有服務都應該是全域單例。表單狀態、wizard 狀態等應該是元件級作用域。

---

### 陷阱 4：循環依賴

```typescript
// ❌ Circular dependency: A → B → A
@Injectable({ providedIn: 'root' })
export class ServiceA {
  private readonly b = inject(ServiceB); // ServiceB depends on ServiceA too!
}

@Injectable({ providedIn: 'root' })
export class ServiceB {
  private readonly a = inject(ServiceA); // Circular!
}

// ✅ Fix: introduce a mediator service or use lazy injection
@Injectable({ providedIn: 'root' })
export class ServiceA {
  private readonly injector = inject(EnvironmentInjector);

  doSomethingWithB(): void {
    // Lazy resolution breaks the circular chain
    runInInjectionContext(this.injector, () => {
      const b = inject(ServiceB);
      b.process();
    });
  }
}
```

**說明**：循環依賴是設計問題。最好的解決方案是重新設計架構，引入中介者 (Mediator) 服務。

---

### 陷阱 5：多個 `InjectionToken` 實例

```typescript
// ❌ Creating token in multiple files — Angular sees them as DIFFERENT tokens
// file-a.ts
const API_URL = new InjectionToken<string>('API_URL');

// file-b.ts
const API_URL = new InjectionToken<string>('API_URL'); // Different instance!

// ✅ Export and import the SAME token instance
// tokens.ts
export const API_URL = new InjectionToken<string>('API_URL');

// file-a.ts
import { API_URL } from './tokens';
// file-b.ts
import { API_URL } from './tokens'; // Same instance ✅
```

**說明**：`InjectionToken` 是使用物件引用（identity）而非字串名稱來比較的。每次 `new InjectionToken()` 都會建立一個不同的 token。

---

### 陷阱 6：忘記 `multi: true`

```typescript
// ❌ Second provider REPLACES the first
providers: [
  { provide: VALIDATORS, useValue: requiredValidator },
  { provide: VALIDATORS, useValue: emailValidator }, // requiredValidator is gone!
]

// ✅ Use multi: true to collect all values
providers: [
  { provide: VALIDATORS, useValue: requiredValidator, multi: true },
  { provide: VALIDATORS, useValue: emailValidator, multi: true },
]
```

**說明**：沒有 `multi: true`，後面的 provider 會覆蓋前面的。

---

### 陷阱 7：在 Service 中直接暴露可寫 Signal

```typescript
// ❌ External code can mutate internal state
@Injectable({ providedIn: 'root' })
export class UserStore {
  readonly user = signal<User | null>(null); // Anyone can call .set()!
}

// ✅ Expose as readonly, provide explicit mutation methods
@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  setUser(user: User): void {
    this._user.set(user);
  }

  clearUser(): void {
    this._user.set(null);
  }
}
```

**說明**：使用 `asReadonly()` 防止外部程式碼意外修改服務的內部狀態。

---

### 陷阱 8：在 `effect()` 中注入服務

```typescript
// ❌ inject() inside effect — NOT an injection context
effect(() => {
  const logger = inject(Logger); // Runtime error!
  logger.log(this.data());
});

// ✅ Inject in field initializer, use inside effect
private readonly logger = inject(Logger);

constructor() {
  effect(() => {
    this.logger.log(`Data changed: ${this.data()}`);
  });
}
```

**說明**：`effect()` 的回呼函式不是注入上下文。所有依賴都必須在外部注入。

---

## 本章小結

| 概念 | 要點 |
|------|------|
| `@Injectable` | 大多數服務用 `providedIn: 'root'`，元件作用域用空的 `@Injectable()` |
| 注入器階層 | Platform → Root → Route → Element，逐層向上解析 |
| Provider 類型 | `useClass`、`useValue`、`useFactory`、`useExisting` |
| `InjectionToken` | 用於非類別型別的依賴（介面、常數、設定） |
| `inject()` | 取代建構函式注入，更簡潔、更靈活 |
| Multi-providers | `multi: true` 收集多個值為陣列（HTTP 攔截器常用） |
| Tree-shakable | `providedIn: 'root'` + `InjectionToken.factory` 支援 tree-shaking |
| Resolution modifiers | `optional`、`self`、`skipSelf`、`host` 控制解析範圍 |

> **下一章**：[第三章：路由 (Routing)](./03-routing.md)
