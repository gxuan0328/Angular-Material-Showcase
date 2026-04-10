# 第五章：HttpClient — Angular 的 HTTP 通訊層

> **目標讀者**：具備 .NET/C# 後端開發經驗，正在學習 Angular 19+ 的工程師。
> **Angular 版本**：19+（Standalone、Signals、OnPush、函式攔截器）
> **先備知識**：第一至四章（元件、Signals、DI、路由）
> **最後更新**：2026-04-09

---

## 本章目標

完成本章後，你將能夠：

1. 使用 `provideHttpClient()` 在應用程式層級設定 HTTP 基礎設施
2. 使用 `HttpClient` 泛型方法執行 CRUD 操作
3. 撰寫函式攔截器（`HttpInterceptorFn`）處理認證、快取、日誌、錯誤
4. 實作完整的錯誤處理與重試策略
5. 處理檔案上傳與進度追蹤
6. 整合 Server-Sent Events（SSE）與 Angular Signals
7. 建構生產級的 `ApiService`

---

## .NET 對照速查表

在深入之前，先建立你熟悉的對應關係：

| .NET 概念 | Angular 19+ 對應 |
|---|---|
| `HttpClient` + `HttpClientFactory` | `HttpClient` + `provideHttpClient()` |
| `DelegatingHandler` | `HttpInterceptorFn` |
| `HttpMessageHandler` 鏈 | `withInterceptors([...])` 攔截器鏈 |
| `Polly` 重試策略 | `retry()` / `retryWhen()` 運算子 |
| `IHttpClientFactory.CreateClient("name")` | 以 `inject()` 取得共用 `HttpClient` 實例 |
| `HttpResponseMessage` | `HttpResponse<T>` |
| `HttpRequestException` | `HttpErrorResponse` |
| `Stream` 回應 | `reportProgress` + `HttpEventType` |

---

## 5.1 HttpClient 設定

### 5.1.1 基本設定

Angular 19+ 使用 `provideHttpClient()` 函式取代已棄用的 `HttpClientModule`。在 `app.config.ts` 中設定：

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withJsonpSupport,
} from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),                                    // Use Fetch API instead of XMLHttpRequest
      withInterceptors([
        authInterceptor,                              // Order matters: first registered, first executed
        loggingInterceptor,
        errorInterceptor,
      ]),
      withJsonpSupport(),                             // JSONP support (rare, for legacy APIs)
    ),
  ],
};
```

### 5.1.2 `provideHttpClient()` 功能旗標

| 功能函式 | 用途 | 建議 |
|---|---|---|
| `withFetch()` | 使用 Fetch API 取代 XMLHttpRequest | **SSR 必備**，建議所有新專案啟用 |
| `withInterceptors([...])` | 註冊函式攔截器鏈 | 優先使用，取代 DI-based 攔截器 |
| `withInterceptorsFromDi()` | 相容既有 class-based 攔截器 | 僅用於漸進遷移 |
| `withJsonpSupport()` | 啟用 JSONP 請求 | 極少需要，僅限舊 API |
| `withRequestsMadeViaParent()` | 請求經過父注入器的攔截器 | 進階 DI 場景 |
| `withXsrfConfiguration({...})` | 自訂 XSRF cookie/header 名稱 | 當後端使用非預設 XSRF 設定時 |

### 5.1.3 withFetch() 深入理解

```typescript
// .NET 類比：
// services.AddHttpClient().ConfigurePrimaryHttpMessageHandler(() => new SocketsHttpHandler());

// Angular: withFetch() 切換底層傳輸機制
provideHttpClient(
  withFetch(),  // Fetch API — modern, SSR-compatible, but no upload progress events
)
```

**注意事項**：`withFetch()` 不支援上傳進度事件（`reportProgress`），如需上傳進度，請移除此旗標。

### 5.1.4 XSRF 保護設定

```typescript
// 預設行為：Angular 自動讀取名為 XSRF-TOKEN 的 cookie，
// 並在非 GET 請求中加入 X-XSRF-TOKEN header。

// 自訂 XSRF 設定（配合後端命名慣例）：
provideHttpClient(
  withXsrfConfiguration({
    cookieName: 'MY-XSRF-TOKEN',   // 後端設定的 cookie 名稱
    headerName: 'X-MY-XSRF-TOKEN', // 後端期望的 header 名稱
  }),
)
```

> **對應 .NET**：等同於 ASP.NET Core 的 `services.AddAntiforgery(options => { options.Cookie.Name = "..."; options.HeaderName = "..."; })`。

---

## 5.2 HTTP 方法

### 5.2.1 注入 HttpClient

```typescript
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// In a service or component:
private readonly http = inject(HttpClient);
```

### 5.2.2 泛型 HTTP 方法

Angular 的 `HttpClient` 提供強型別的泛型方法，與 .NET 的 `HttpClient.GetFromJsonAsync<T>()` 概念相同：

```typescript
// --- Model definitions ---
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  createdAt: string;
}

interface CreateProductRequest {
  name: string;
  price: number;
  category: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

#### GET — 查詢資源

```typescript
// Simple GET — returns Observable<Product[]>
getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>('/api/products');
}

// GET with query parameters
getProductsByCategory(category: string, page: number): Observable<PaginatedResponse<Product>> {
  const params = new HttpParams()
    .set('category', category)
    .set('page', page.toString())
    .set('pageSize', '20');

  return this.http.get<PaginatedResponse<Product>>('/api/products', { params });
}

// GET with full response (access headers, status code)
getProductsWithHeaders(): Observable<HttpResponse<Product[]>> {
  return this.http.get<Product[]>('/api/products', { observe: 'response' });
}

// GET as text (e.g., CSV download)
downloadCsv(): Observable<string> {
  return this.http.get('/api/products/export', { responseType: 'text' });
}

// GET as blob (e.g., file download)
downloadFile(fileId: string): Observable<Blob> {
  return this.http.get(`/api/files/${fileId}`, { responseType: 'blob' });
}
```

#### POST — 建立資源

```typescript
// POST with typed request and response
createProduct(request: CreateProductRequest): Observable<Product> {
  return this.http.post<Product>('/api/products', request);
}

// POST with custom headers
createProductWithAuth(request: CreateProductRequest): Observable<Product> {
  const headers = new HttpHeaders()
    .set('X-Custom-Header', 'value')
    .set('Content-Type', 'application/json');

  return this.http.post<Product>('/api/products', request, { headers });
}
```

#### PUT — 完整更新

```typescript
// PUT — replace entire resource
updateProduct(id: number, product: Product): Observable<Product> {
  return this.http.put<Product>(`/api/products/${id}`, product);
}
```

#### PATCH — 部分更新

```typescript
// PATCH — partial update
patchProduct(id: number, changes: Partial<Product>): Observable<Product> {
  return this.http.patch<Product>(`/api/products/${id}`, changes);
}
```

#### DELETE — 刪除資源

```typescript
// DELETE — remove resource
deleteProduct(id: number): Observable<void> {
  return this.http.delete<void>(`/api/products/${id}`);
}

// DELETE with request body (some APIs require this)
deleteProducts(ids: number[]): Observable<void> {
  return this.http.delete<void>('/api/products/batch', {
    body: { ids },
  });
}
```

#### request() — 通用方法

```typescript
// Generic request method — useful for dynamic HTTP methods
executeRequest<T>(method: string, url: string, body?: unknown): Observable<T> {
  return this.http.request<T>(method, url, { body });
}
```

### 5.2.3 HttpParams 建構模式

```typescript
// Immutable builder pattern (each method returns a new instance)
const params = new HttpParams()
  .set('page', '1')
  .set('size', '20')
  .append('sort', 'name')     // append allows duplicate keys
  .append('sort', 'price');

// From object (convenience)
const paramsFromObj = new HttpParams({
  fromObject: {
    page: '1',
    size: '20',
    category: 'electronics',
  },
});

// From string (URL-encoded)
const paramsFromString = new HttpParams({
  fromString: 'page=1&size=20&category=electronics',
});
```

### 5.2.4 HttpHeaders 建構模式

```typescript
// Immutable builder pattern
const headers = new HttpHeaders()
  .set('Authorization', 'Bearer token123')
  .set('Accept', 'application/json')
  .set('X-Request-Id', crypto.randomUUID());

// From object
const headersFromObj = new HttpHeaders({
  'Authorization': 'Bearer token123',
  'Content-Type': 'application/json',
});
```

---

## 5.3 函式攔截器

### 5.3.1 HttpInterceptorFn 簽名

```typescript
// The function signature for Angular 19+ interceptors
import { HttpInterceptorFn } from '@angular/common/http';

// Signature:
// (req: HttpRequest<unknown>, next: HttpHandlerFn) => Observable<HttpEvent<unknown>>

export const myInterceptor: HttpInterceptorFn = (req, next) => {
  // Modify request or pass through
  return next(req);
};
```

> **對應 .NET**：`HttpInterceptorFn` 等同於 `DelegatingHandler.SendAsync()`，`next(req)` 等同於 `base.SendAsync(request, cancellationToken)`。

### 5.3.2 攔截器鏈執行順序

```
Request flow:  authInterceptor → loggingInterceptor → errorInterceptor → HttpBackend
Response flow: HttpBackend → errorInterceptor → loggingInterceptor → authInterceptor
```

這與 .NET 的 `DelegatingHandler` 鏈完全相同 — 請求從外到內，回應從內到外。

### 5.3.3 Auth Token 攔截器

```typescript
// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Interceptors run in injection context — inject() is available
  const authService = inject(AuthService);
  const token = authService.accessToken();

  // Skip auth header for public endpoints
  if (isPublicUrl(req.url)) {
    return next(req);
  }

  // Clone request and add Authorization header
  // HttpRequest is immutable — must clone to modify
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};

function isPublicUrl(url: string): boolean {
  const publicUrls = ['/api/auth/login', '/api/auth/register', '/api/health'];
  return publicUrls.some(publicUrl => url.includes(publicUrl));
}
```

**對應的 AuthService**：

```typescript
// src/app/core/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokens = signal<AuthTokens | null>(null);

  readonly accessToken = computed(() => this.tokens()?.accessToken ?? null);
  readonly isAuthenticated = computed(() => {
    const t = this.tokens();
    return t !== null && t.expiresAt > Date.now();
  });

  login(tokens: AuthTokens): void {
    this.tokens.set(tokens);
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  }

  logout(): void {
    this.tokens.set(null);
    localStorage.removeItem('auth_tokens');
  }

  restoreSession(): void {
    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      const parsed: AuthTokens = JSON.parse(stored);
      if (parsed.expiresAt > Date.now()) {
        this.tokens.set(parsed);
      } else {
        localStorage.removeItem('auth_tokens');
      }
    }
  }
}
```

### 5.3.4 Token 刷新攔截器（進階）

```typescript
// src/app/core/interceptors/token-refresh.interceptor.ts
import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject, filter, take, switchMap, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenRefreshService } from '../services/token-refresh.service';

// Shared state across interceptor invocations
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const tokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenRefresh = inject(TokenRefreshService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return handleTokenRefresh(req, next, authService, tokenRefresh);
      }
      return throwError(() => error);
    }),
  );
};

function handleTokenRefresh(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  tokenRefresh: TokenRefreshService,
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return tokenRefresh.refreshToken().pipe(
      switchMap((newToken: string) => {
        isRefreshing = false;
        refreshTokenSubject.next(newToken);
        return next(addToken(req, newToken));
      }),
      catchError((refreshError) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => refreshError);
      }),
    );
  }

  // Wait for the ongoing refresh to complete
  return refreshTokenSubject.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((token) => next(addToken(req, token))),
  );
}

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}
```

### 5.3.5 錯誤處理攔截器

```typescript
// src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 0:
          // Network error — server unreachable
          notifications.error('無法連線至伺服器，請檢查網路連線。');
          break;

        case 400: {
          // Bad request — show validation errors
          const apiError = error.error as ApiError | null;
          if (apiError?.details) {
            const messages = Object.values(apiError.details).flat();
            notifications.error(messages.join('\n'));
          } else {
            notifications.error(apiError?.message ?? '請求格式錯誤。');
          }
          break;
        }

        case 401:
          // Unauthorized — redirect to login
          notifications.warn('登入已過期，請重新登入。');
          router.navigate(['/auth/login']);
          break;

        case 403:
          // Forbidden
          notifications.error('權限不足，無法執行此操作。');
          break;

        case 404:
          // Not found
          notifications.error('找不到請求的資源。');
          break;

        case 409:
          // Conflict
          notifications.error('資料衝突，請重新整理後再試。');
          break;

        case 429:
          // Too Many Requests
          notifications.warn('請求過於頻繁，請稍後再試。');
          break;

        case 500:
        case 502:
        case 503:
          // Server error
          notifications.error('伺服器發生錯誤，請稍後再試。');
          break;

        default:
          notifications.error(`未知錯誤 (${error.status})：${error.message}`);
      }

      // Re-throw for component-level handling
      return throwError(() => error);
    }),
  );
};
```

### 5.3.6 日誌攔截器（請求/回應計時）

```typescript
// src/app/core/interceptors/logging.interceptor.ts
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap, finalize } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = performance.now();
  const requestId = crypto.randomUUID().slice(0, 8);

  console.log(
    `[HTTP ${requestId}] ${req.method} ${req.urlWithParams}`,
  );

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const duration = Math.round(performance.now() - startTime);
          console.log(
            `[HTTP ${requestId}] ${event.status} ${req.method} ${req.urlWithParams} — ${duration}ms`,
          );
        }
      },
      error: (error) => {
        const duration = Math.round(performance.now() - startTime);
        console.error(
          `[HTTP ${requestId}] ERROR ${req.method} ${req.urlWithParams} — ${duration}ms`,
          error,
        );
      },
    }),
  );
};
```

### 5.3.7 快取攔截器（GET 記憶化）

```typescript
// src/app/core/interceptors/cache.interceptor.ts
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

interface CacheEntry {
  response: HttpResponse<unknown>;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    // Invalidate cache for mutation operations on the same resource
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      invalidateRelatedCache(req.url);
    }
    return next(req);
  }

  // Skip caching if explicitly requested
  if (req.headers.has('X-Skip-Cache')) {
    const cleanReq = req.clone({
      headers: req.headers.delete('X-Skip-Cache'),
    });
    return next(cleanReq);
  }

  const cacheKey = buildCacheKey(req);
  const cached = cache.get(cacheKey);

  // Return cached response if still valid
  if (cached && !isExpired(cached)) {
    console.log(`[Cache HIT] ${req.urlWithParams}`);
    return of(cached.response.clone());
  }

  // Forward request and cache the response
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && event.status === 200) {
        console.log(`[Cache MISS] ${req.urlWithParams}`);
        cache.set(cacheKey, {
          response: event.clone(),
          timestamp: Date.now(),
        });
      }
    }),
  );
};

function buildCacheKey(req: { method: string; urlWithParams: string }): string {
  return `${req.method}:${req.urlWithParams}`;
}

function isExpired(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp > DEFAULT_TTL_MS;
}

function invalidateRelatedCache(url: string): void {
  // Remove all cached entries whose URL starts with the same base path
  const basePath = url.split('?')[0];
  for (const key of cache.keys()) {
    if (key.includes(basePath)) {
      cache.delete(key);
    }
  }
}
```

### 5.3.8 攔截器中使用 inject()

函式攔截器在注入上下文中執行，可以直接呼叫 `inject()`：

```typescript
export const metricsInterceptor: HttpInterceptorFn = (req, next) => {
  // inject() is available — interceptors run in an injection context
  const analytics = inject(AnalyticsService);
  const config = inject(AppConfigService);

  const startTime = performance.now();

  return next(req).pipe(
    finalize(() => {
      const duration = performance.now() - startTime;
      if (config.enableMetrics()) {
        analytics.trackHttpRequest({
          method: req.method,
          url: req.url,
          durationMs: Math.round(duration),
        });
      }
    }),
  );
};
```

---

## 5.4 錯誤處理

### 5.4.1 HttpErrorResponse 結構

```typescript
import { HttpErrorResponse } from '@angular/common/http';

// HttpErrorResponse extends Error and contains:
// - status: number       (HTTP status code, 0 for network errors)
// - statusText: string   (HTTP status text)
// - url: string | null   (Request URL)
// - error: any           (Response body — often a JSON error object)
// - headers: HttpHeaders (Response headers)
// - message: string      (Formatted error message)
```

### 5.4.2 元件層級錯誤處理

```typescript
// src/app/features/products/product-list.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from './product.service';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-product-list',
  template: `
    @if (error()) {
      <div class="error-banner" role="alert">
        <p>{{ error() }}</p>
        <button (click)="loadProducts()">重試</button>
      </div>
    }

    @if (loading()) {
      <div class="loading-spinner" aria-label="載入中">
        <mat-spinner diameter="40" />
      </div>
    }

    @for (product of products(); track product.id) {
      <div class="product-card">
        <h3>{{ product.name }}</h3>
        <p>{{ product.price | currency:'TWD' }}</p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  private readonly productService = inject(ProductService);

  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.loadProducts();
  }

  protected loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(this.mapError(err));
      },
    });
  }

  private mapError(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return '網路連線失敗，請檢查網路設定。';
    }
    if (err.status === 404) {
      return '找不到產品資料。';
    }
    if (err.status >= 500) {
      return '伺服器發生錯誤，請稍後重試。';
    }
    return `發生未預期的錯誤 (${err.status})。`;
  }
}
```

### 5.4.3 retry 與 retryWhen 策略

```typescript
import { retry, timer, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

// --- Strategy 1: Simple retry with delay ---
getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>('/api/products').pipe(
    retry({
      count: 3,           // Maximum 3 retries
      delay: 1000,        // Wait 1 second between retries
      resetOnSuccess: true,
    }),
  );
}

// --- Strategy 2: Exponential backoff ---
getProductsWithBackoff(): Observable<Product[]> {
  return this.http.get<Product[]>('/api/products').pipe(
    retry({
      count: 3,
      delay: (error, retryCount) => {
        // Only retry on server errors or network errors
        if (error instanceof HttpErrorResponse) {
          if (error.status >= 400 && error.status < 500 && error.status !== 429) {
            // Client errors (except 429) — don't retry
            return throwError(() => error);
          }
        }

        // Exponential backoff: 1s, 2s, 4s
        const delayMs = Math.pow(2, retryCount - 1) * 1000;
        console.warn(`Retry ${retryCount}/3 after ${delayMs}ms`);
        return timer(delayMs);
      },
    }),
  );
}

// --- Strategy 3: Reusable retry operator ---
import { MonoTypeOperatorFunction } from 'rxjs';

function retryWithBackoff<T>(maxRetries: number = 3): MonoTypeOperatorFunction<T> {
  return retry<T>({
    count: maxRetries,
    delay: (error: HttpErrorResponse, retryCount: number) => {
      // Don't retry client errors (except 429 Too Many Requests)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        return throwError(() => error);
      }

      const delayMs = Math.min(Math.pow(2, retryCount - 1) * 1000, 30_000);
      const jitter = Math.random() * 500; // Add jitter to prevent thundering herd
      return timer(delayMs + jitter);
    },
  });
}

// Usage:
getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>('/api/products').pipe(
    retryWithBackoff(3),
  );
}
```

> **對應 .NET**：`retryWithBackoff()` 等同於 Polly 的 `WaitAndRetryAsync` 策略搭配 jitter。

### 5.4.4 全域 ErrorHandler

```typescript
// src/app/core/error-handler.ts
import { ErrorHandler, Injectable, inject, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly notifications = inject(NotificationService);
  private readonly zone = inject(NgZone);

  handleError(error: unknown): void {
    // Unwrap promise rejection
    const resolvedError = error instanceof Error && 'rejection' in error
      ? (error as { rejection: unknown }).rejection
      : error;

    if (resolvedError instanceof HttpErrorResponse) {
      // HTTP errors are already handled by the error interceptor
      console.error('[GlobalErrorHandler] HTTP Error:', resolvedError.status, resolvedError.url);
      return;
    }

    // Client-side or runtime error
    console.error('[GlobalErrorHandler] Unhandled Error:', resolvedError);

    // Notifications must run inside NgZone for change detection
    this.zone.run(() => {
      this.notifications.error('應用程式發生未預期的錯誤。');
    });

    // TODO: Send to error tracking service (e.g., Sentry, Application Insights)
  }
}

// Register in app.config.ts:
// providers: [
//   { provide: ErrorHandler, useClass: GlobalErrorHandler },
// ]
```

---

## 5.5 檔案上傳

### 5.5.1 FormData 上傳

```typescript
// src/app/features/uploads/file-upload.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEventType, HttpEvent } from '@angular/common/http';
import { Observable, map, filter } from 'rxjs';

export interface UploadProgress {
  status: 'progress' | 'complete' | 'error';
  progress: number;         // 0–100
  fileName: string;
  fileUrl?: string;         // Available when status === 'complete'
}

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  private readonly http = inject(HttpClient);

  uploadFile(file: File): Observable<UploadProgress> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<{ url: string }>('/api/files/upload', formData, {
      reportProgress: true,
      observe: 'events',
    }).pipe(
      map((event: HttpEvent<{ url: string }>): UploadProgress => {
        switch (event.type) {
          case HttpEventType.UploadProgress: {
            const progress = event.total
              ? Math.round((event.loaded / event.total) * 100)
              : 0;
            return { status: 'progress', progress, fileName: file.name };
          }

          case HttpEventType.Response:
            return {
              status: 'complete',
              progress: 100,
              fileName: file.name,
              fileUrl: event.body?.url,
            };

          default:
            return { status: 'progress', progress: 0, fileName: file.name };
        }
      }),
    );
  }

  uploadMultipleFiles(files: File[]): Observable<UploadProgress> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file, file.name);
    });

    return this.http.post<{ urls: string[] }>('/api/files/upload-batch', formData, {
      reportProgress: true,
      observe: 'events',
    }).pipe(
      map((event: HttpEvent<{ urls: string[] }>): UploadProgress => {
        switch (event.type) {
          case HttpEventType.UploadProgress: {
            const progress = event.total
              ? Math.round((event.loaded / event.total) * 100)
              : 0;
            return { status: 'progress', progress, fileName: 'batch' };
          }
          case HttpEventType.Response:
            return { status: 'complete', progress: 100, fileName: 'batch' };
          default:
            return { status: 'progress', progress: 0, fileName: 'batch' };
        }
      }),
    );
  }
}
```

### 5.5.2 上傳元件（含進度條）

```typescript
// src/app/features/uploads/file-upload.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FileUploadService, UploadProgress } from './file-upload.service';

@Component({
  selector: 'app-file-upload',
  template: `
    <div class="upload-area"
         (dragover)="onDragOver($event)"
         (drop)="onDrop($event)">
      <input
        type="file"
        #fileInput
        (change)="onFileSelected($event)"
        [accept]="acceptedTypes"
        multiple
        hidden
      />

      <button (click)="fileInput.click()" [disabled]="uploading()">
        選擇檔案
      </button>

      @if (uploading()) {
        <div class="progress-bar" role="progressbar"
             [attr.aria-valuenow]="progress()"
             aria-valuemin="0"
             aria-valuemax="100">
          <div class="progress-fill"
               [style.width.%]="progress()">
          </div>
          <span>{{ progress() }}%</span>
        </div>
      }

      @if (uploadResult(); as result) {
        <div class="upload-result">
          <span class="success-icon" aria-hidden="true">✓</span>
          上傳完成：{{ result.fileName }}
        </div>
      }

      @if (errorMessage()) {
        <div class="upload-error" role="alert">
          {{ errorMessage() }}
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUpload {
  private readonly uploadService = inject(FileUploadService);

  protected readonly acceptedTypes = '.pdf,.jpg,.png,.docx';
  protected readonly uploading = signal(false);
  protected readonly progress = signal(0);
  protected readonly uploadResult = signal<UploadProgress | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadFile(input.files[0]);
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  private uploadFile(file: File): void {
    // Validate file size (max 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      this.errorMessage.set('檔案大小不得超過 10 MB。');
      return;
    }

    this.uploading.set(true);
    this.progress.set(0);
    this.errorMessage.set(null);
    this.uploadResult.set(null);

    this.uploadService.uploadFile(file).subscribe({
      next: (event) => {
        this.progress.set(event.progress);
        if (event.status === 'complete') {
          this.uploading.set(false);
          this.uploadResult.set(event);
        }
      },
      error: () => {
        this.uploading.set(false);
        this.errorMessage.set('上傳失敗，請重試。');
      },
    });
  }
}
```

> **注意**：`withFetch()` 不支援 `reportProgress` 的上傳進度事件。若需上傳進度追蹤，請在 `provideHttpClient()` 中移除 `withFetch()`，或僅在上傳 API 中使用 `XMLHttpRequest`。

---

## 5.6 SSE 整合

### 5.6.1 EventSource Wrapper with Angular Signals

Server-Sent Events (SSE) 不透過 `HttpClient` 處理，因為 SSE 是單向串流協議。我們建立一個 Signal-based wrapper：

```typescript
// src/app/core/services/sse.service.ts
import { Injectable, signal, computed, OnDestroy, NgZone, inject } from '@angular/core';

export interface SseMessage<T = unknown> {
  data: T;
  id?: string;
  type: string;
  timestamp: number;
}

export type SseStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

@Injectable({ providedIn: 'root' })
export class SseService implements OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly connections = new Map<string, EventSource>();

  ngOnDestroy(): void {
    // Close all connections on service destruction
    this.connections.forEach((source) => source.close());
    this.connections.clear();
  }

  /**
   * Create a reactive SSE connection.
   * Returns signals for messages, status, and a disconnect function.
   */
  connect<T>(url: string, options?: {
    eventTypes?: string[];
    withCredentials?: boolean;
  }): {
    messages: ReturnType<typeof signal<SseMessage<T>[]>>;
    latestMessage: ReturnType<typeof computed<SseMessage<T> | null>>;
    status: ReturnType<typeof signal<SseStatus>>;
    disconnect: () => void;
  } {
    const messages = signal<SseMessage<T>[]>([]);
    const status = signal<SseStatus>('connecting');
    const latestMessage = computed(() => {
      const all = messages();
      return all.length > 0 ? all[all.length - 1] : null;
    });

    // Run EventSource outside Angular zone to avoid unnecessary change detection
    this.zone.runOutsideAngular(() => {
      const eventSource = new EventSource(url, {
        withCredentials: options?.withCredentials ?? false,
      });

      this.connections.set(url, eventSource);

      eventSource.onopen = () => {
        this.zone.run(() => status.set('connected'));
      };

      eventSource.onerror = () => {
        this.zone.run(() => {
          if (eventSource.readyState === EventSource.CLOSED) {
            status.set('disconnected');
          } else {
            status.set('error');
          }
        });
      };

      // Listen for default 'message' events
      const handleMessage = (event: MessageEvent): void => {
        this.zone.run(() => {
          const parsed: T = JSON.parse(event.data);
          messages.update((prev) => [
            ...prev,
            {
              data: parsed,
              id: event.lastEventId,
              type: event.type,
              timestamp: Date.now(),
            },
          ]);
        });
      };

      eventSource.addEventListener('message', handleMessage);

      // Listen for custom event types
      if (options?.eventTypes) {
        for (const eventType of options.eventTypes) {
          eventSource.addEventListener(eventType, (event: MessageEvent) => {
            this.zone.run(() => {
              const parsed: T = JSON.parse(event.data);
              messages.update((prev) => [
                ...prev,
                {
                  data: parsed,
                  id: event.lastEventId,
                  type: eventType,
                  timestamp: Date.now(),
                },
              ]);
            });
          });
        }
      }
    });

    const disconnect = (): void => {
      const source = this.connections.get(url);
      if (source) {
        source.close();
        this.connections.delete(url);
        status.set('disconnected');
      }
    };

    return { messages, latestMessage, status, disconnect };
  }
}
```

### 5.6.2 SSE 使用範例 — 即時通知

```typescript
// src/app/features/notifications/live-notifications.ts
import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { SseService, SseMessage } from '../../core/services/sse.service';

interface Notification {
  id: string;
  title: string;
  body: string;
  severity: 'info' | 'warning' | 'error';
}

@Component({
  selector: 'app-live-notifications',
  template: `
    <div class="notification-panel">
      <div class="status-indicator"
           [class.connected]="sseStatus() === 'connected'"
           [class.error]="sseStatus() === 'error'">
        {{ sseStatus() === 'connected' ? '即時連線中' : '連線中斷' }}
      </div>

      @for (msg of notifications(); track msg.id) {
        <div class="notification"
             [class]="'severity-' + msg.data.severity"
             role="alert">
          <strong>{{ msg.data.title }}</strong>
          <p>{{ msg.data.body }}</p>
          <time>{{ msg.timestamp | date:'HH:mm:ss' }}</time>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveNotifications implements OnInit, OnDestroy {
  private readonly sseService = inject(SseService);
  private disconnectFn?: () => void;

  protected notifications!: ReturnType<SseService['connect']>['messages'];
  protected sseStatus!: ReturnType<SseService['connect']>['status'];

  ngOnInit(): void {
    const connection = this.sseService.connect<Notification>(
      '/api/notifications/stream',
      { eventTypes: ['notification', 'alert'] },
    );

    this.notifications = connection.messages;
    this.sseStatus = connection.status;
    this.disconnectFn = connection.disconnect;
  }

  ngOnDestroy(): void {
    this.disconnectFn?.();
  }
}
```

---

## 5.7 完整範例：ApiService

將以上所有概念整合為一個生產級的 `ApiService`：

```typescript
// src/app/core/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse,
  HttpContext,
  HttpContextToken,
} from '@angular/common/http';
import { Observable, throwError, timer, retry, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environment';

// --- Custom HTTP context tokens ---
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);
export const SKIP_CACHE = new HttpContextToken<boolean>(() => false);
export const CUSTOM_RETRY_COUNT = new HttpContextToken<number>(() => 3);

// --- Shared types ---
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  traceId?: string;
}

export interface RequestOptions {
  params?: HttpParams | Record<string, string | string[]>;
  headers?: HttpHeaders | Record<string, string>;
  skipAuth?: boolean;
  skipCache?: boolean;
  retryCount?: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // --- Public API ---

  get<T>(path: string, options?: RequestOptions): Observable<T> {
    return this.http
      .get<T>(this.url(path), this.buildHttpOptions(options))
      .pipe(this.handleRetry(options), this.handleError());
  }

  getPage<T>(path: string, page: number, pageSize: number, options?: RequestOptions): Observable<ApiResponse<T[]>> {
    const params = this.mergeParams(options?.params, {
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    return this.http
      .get<ApiResponse<T[]>>(this.url(path), this.buildHttpOptions({ ...options, params }))
      .pipe(this.handleRetry(options), this.handleError());
  }

  post<T>(path: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .post<T>(this.url(path), body, this.buildHttpOptions(options))
      .pipe(this.handleRetry(options), this.handleError());
  }

  put<T>(path: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .put<T>(this.url(path), body, this.buildHttpOptions(options))
      .pipe(this.handleRetry(options), this.handleError());
  }

  patch<T>(path: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .patch<T>(this.url(path), body, this.buildHttpOptions(options))
      .pipe(this.handleRetry(options), this.handleError());
  }

  delete<T>(path: string, options?: RequestOptions): Observable<T> {
    return this.http
      .delete<T>(this.url(path), this.buildHttpOptions(options))
      .pipe(this.handleRetry(options), this.handleError());
  }

  // --- Download / Upload ---

  download(path: string): Observable<Blob> {
    return this.http.get(this.url(path), {
      responseType: 'blob',
      context: new HttpContext().set(SKIP_CACHE, true),
    });
  }

  upload<T>(path: string, formData: FormData): Observable<T> {
    return this.http.post<T>(this.url(path), formData, {
      context: new HttpContext().set(SKIP_CACHE, true),
    });
  }

  // --- Internal helpers ---

  private url(path: string): string {
    // Avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${this.baseUrl}/${cleanPath}`;
  }

  private buildHttpOptions(options?: RequestOptions): {
    params?: HttpParams;
    headers?: HttpHeaders;
    context: HttpContext;
  } {
    const context = new HttpContext()
      .set(SKIP_AUTH, options?.skipAuth ?? false)
      .set(SKIP_CACHE, options?.skipCache ?? false)
      .set(CUSTOM_RETRY_COUNT, options?.retryCount ?? 3);

    return {
      params: this.normalizeParams(options?.params),
      headers: this.normalizeHeaders(options?.headers),
      context,
    };
  }

  private normalizeParams(
    params?: HttpParams | Record<string, string | string[]>,
  ): HttpParams | undefined {
    if (!params) return undefined;
    if (params instanceof HttpParams) return params;
    return new HttpParams({ fromObject: params });
  }

  private normalizeHeaders(
    headers?: HttpHeaders | Record<string, string>,
  ): HttpHeaders | undefined {
    if (!headers) return undefined;
    if (headers instanceof HttpHeaders) return headers;
    return new HttpHeaders(headers);
  }

  private mergeParams(
    existing?: HttpParams | Record<string, string | string[]>,
    additional?: Record<string, string>,
  ): HttpParams {
    let params = this.normalizeParams(existing) ?? new HttpParams();
    if (additional) {
      for (const [key, value] of Object.entries(additional)) {
        params = params.set(key, value);
      }
    }
    return params;
  }

  private handleRetry<T>(options?: RequestOptions) {
    const maxRetries = options?.retryCount ?? 3;
    return (source: Observable<T>): Observable<T> =>
      source.pipe(
        retry({
          count: maxRetries,
          delay: (error: HttpErrorResponse, retryCount: number) => {
            // Don't retry client errors (except 429 Too Many Requests)
            if (error.status >= 400 && error.status < 500 && error.status !== 429) {
              return throwError(() => error);
            }
            const delayMs = Math.min(Math.pow(2, retryCount - 1) * 1000, 30_000);
            const jitter = Math.random() * 500;
            return timer(delayMs + jitter);
          },
        }),
      );
  }

  private handleError<T>() {
    return (source: Observable<T>): Observable<T> =>
      source.pipe(
        catchError((error: HttpErrorResponse) => {
          const apiError: ApiError = {
            code: `HTTP_${error.status}`,
            message: error.error?.message ?? error.message,
            details: error.error?.details,
            traceId: error.headers?.get('X-Trace-Id') ?? undefined,
          };
          return throwError(() => apiError);
        }),
      );
  }
}
```

### 5.7.1 搭配 HttpContext 的攔截器

`HttpContextToken` 讓攔截器依據請求級別的設定決定行為：

```typescript
// Update auth interceptor to respect SKIP_AUTH context:
import { SKIP_AUTH } from '../services/api.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Check if this request should skip authentication
  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.accessToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(authReq);
  }

  return next(req);
};

// Update cache interceptor to respect SKIP_CACHE context:
import { SKIP_CACHE } from '../services/api.service';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET' || req.context.get(SKIP_CACHE)) {
    return next(req);
  }
  // ... rest of caching logic
};
```

### 5.7.2 使用 ApiService

```typescript
// src/app/features/products/product.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, ApiResponse } from '../../core/services/api.service';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface CreateProductRequest {
  name: string;
  price: number;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(ApiService);

  getProducts(page: number = 1): Observable<ApiResponse<Product[]>> {
    return this.api.getPage<Product>('/products', page, 20);
  }

  getProduct(id: number): Observable<Product> {
    return this.api.get<Product>(`/products/${id}`);
  }

  createProduct(req: CreateProductRequest): Observable<Product> {
    return this.api.post<Product>('/products', req);
  }

  updateProduct(id: number, req: CreateProductRequest): Observable<Product> {
    return this.api.put<Product>(`/products/${id}`, req);
  }

  deleteProduct(id: number): Observable<void> {
    return this.api.delete<void>(`/products/${id}`);
  }

  // Public endpoint — skip auth
  getPublicCatalog(): Observable<Product[]> {
    return this.api.get<Product[]>('/catalog', { skipAuth: true, skipCache: false });
  }
}
```

### 5.7.3 完整攔截器鏈設定

```typescript
// src/app/app.config.ts — final version
import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { tokenRefreshInterceptor } from './core/interceptors/token-refresh.interceptor';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';
import { cacheInterceptor } from './core/interceptors/cache.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { GlobalErrorHandler } from './core/error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        // Execution order (request): top → bottom
        // Execution order (response): bottom → top
        loggingInterceptor,        // 1. Log every request/response with timing
        cacheInterceptor,          // 2. Return cached GET responses if available
        authInterceptor,           // 3. Add Bearer token to requests
        tokenRefreshInterceptor,   // 4. Refresh expired tokens on 401
        errorInterceptor,          // 5. Catch and transform errors
      ]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
    ),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
```

---

## 5.8 常見陷阱

### 陷阱 1：忘記取消訂閱 Observable

```typescript
// ❌ Bad — memory leak, requests may complete after component is destroyed
ngOnInit(): void {
  this.http.get<Product[]>('/api/products').subscribe(data => {
    this.products = data;
  });
}

// ✅ Good — use takeUntilDestroyed() for automatic cleanup
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

private readonly destroyRef = inject(DestroyRef);

ngOnInit(): void {
  this.http.get<Product[]>('/api/products').pipe(
    takeUntilDestroyed(this.destroyRef),
  ).subscribe(data => {
    this.products.set(data);
  });
}

// ✅ Also good — use async pipe in template (auto-unsubscribes)
// template: `@for (p of products$ | async; track p.id) { ... }`

// ✅ Best — use resource() or httpResource() for signal-based approach
```

### 陷阱 2：直接修改 HttpRequest（不可變物件）

```typescript
// ❌ Bad — HttpRequest is immutable, this silently does nothing
export const badInterceptor: HttpInterceptorFn = (req, next) => {
  // This does NOT modify the request!
  req.headers.set('Authorization', 'Bearer token');
  return next(req);
};

// ✅ Good — use clone() to create a modified copy
export const goodInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    setHeaders: { Authorization: 'Bearer token' },
  });
  return next(authReq);
};
```

### 陷阱 3：使用已棄用的 HttpClientModule

```typescript
// ❌ Bad — HttpClientModule is deprecated in Angular 19+
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
})
export class AppModule {}

// ✅ Good — use provideHttpClient() in app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
  ],
};
```

### 陷阱 4：subscribe 巢狀地獄

```typescript
// ❌ Bad — nested subscribes, unreadable and error-prone
getOrderDetails(orderId: string): void {
  this.http.get<Order>(`/api/orders/${orderId}`).subscribe(order => {
    this.http.get<Customer>(`/api/customers/${order.customerId}`).subscribe(customer => {
      this.http.get<Product[]>(`/api/products?ids=${order.productIds}`).subscribe(products => {
        this.orderDetails = { order, customer, products };
      });
    });
  });
}

// ✅ Good — use RxJS operators for composition
import { switchMap, forkJoin } from 'rxjs';

getOrderDetails(orderId: string): Observable<OrderDetails> {
  return this.http.get<Order>(`/api/orders/${orderId}`).pipe(
    switchMap(order =>
      forkJoin({
        order: of(order),
        customer: this.http.get<Customer>(`/api/customers/${order.customerId}`),
        products: this.http.get<Product[]>(`/api/products?ids=${order.productIds.join(',')}`),
      }),
    ),
  );
}
```

### 陷阱 5：忽略錯誤處理

```typescript
// ❌ Bad — no error handling, UI hangs on failure
loadData(): void {
  this.http.get<Data[]>('/api/data').subscribe(data => {
    this.data.set(data);
  });
}

// ✅ Good — handle error state
loadData(): void {
  this.loading.set(true);
  this.error.set(null);

  this.http.get<Data[]>('/api/data').pipe(
    takeUntilDestroyed(this.destroyRef),
    finalize(() => this.loading.set(false)),
  ).subscribe({
    next: (data) => this.data.set(data),
    error: (err: HttpErrorResponse) => this.error.set(err.message),
  });
}
```

### 陷阱 6：硬編碼 API URL

```typescript
// ❌ Bad — hard-coded URL, different per environment
this.http.get('https://api.production.com/products');

// ✅ Good — use environment configuration
// src/environments/environment.ts
export const environment = {
  apiUrl: 'http://localhost:3000/api',
};

// src/environments/environment.prod.ts
export const environment = {
  apiUrl: 'https://api.production.com',
};

// In service:
private readonly baseUrl = environment.apiUrl;
```

### 陷阱 7：withFetch() 搭配上傳進度

```typescript
// ❌ Bad — withFetch() does not support upload progress events
provideHttpClient(
  withFetch(), // This disables upload progress tracking!
)

// ✅ Good — remove withFetch() if upload progress is needed,
// or use separate HttpClient instance without fetch
// For most apps: keep withFetch() and accept no upload progress,
// or remove it if progress tracking is critical
```

### 陷阱 8：攔截器順序錯誤

```typescript
// ❌ Bad — error interceptor runs BEFORE auth, so auth errors are transformed
// before token refresh can handle them
provideHttpClient(
  withInterceptors([
    errorInterceptor,          // Catches 401 before tokenRefresh can retry
    authInterceptor,
    tokenRefreshInterceptor,
  ]),
)

// ✅ Good — auth and token refresh run first, error interceptor is last
provideHttpClient(
  withInterceptors([
    loggingInterceptor,        // First: log everything
    cacheInterceptor,          // Second: serve from cache if possible
    authInterceptor,           // Third: add auth token
    tokenRefreshInterceptor,   // Fourth: handle token expiry
    errorInterceptor,          // Last: catch remaining errors
  ]),
)
```

---

## 本章重點回顧

| 概念 | .NET 對應 | Angular 19+ |
|---|---|---|
| HTTP 設定 | `services.AddHttpClient()` | `provideHttpClient()` |
| 攔截器 | `DelegatingHandler` | `HttpInterceptorFn` |
| Fetch 傳輸 | `SocketsHttpHandler` | `withFetch()` |
| 重試策略 | Polly `WaitAndRetryAsync` | `retry()` with backoff |
| XSRF 保護 | `AddAntiforgery()` | `withXsrfConfiguration()` |
| 泛型回應 | `GetFromJsonAsync<T>()` | `get<T>()` / `post<T>()` |
| 請求管線 | Middleware pipeline | Interceptor chain |
| 全域錯誤 | ExceptionHandler middleware | `ErrorHandler` class |

**下一章**：[第六章：Forms — 表單處理](./06-forms.md)，我們將學習 Reactive Forms、Template-driven Forms、Typed Forms 與驗證器。
