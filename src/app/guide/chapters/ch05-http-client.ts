import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GuidePage } from '../shared/guide-page';
import { GuideChapter } from '../models/guide-chapter';

const CHAPTER: GuideChapter = {
  id: 'http-client',
  number: 5,
  title: 'HTTP 與 API 整合',
  subtitle: 'HttpClient、攔截器、錯誤處理、重試策略',
  icon: 'cloud',
  category: 'intermediate',
  tags: ['HttpClient', 'Interceptor', 'REST', 'Error Handling', 'File Upload'],
  estimatedMinutes: 35,
  sections: [
    // ─── Section 1: HttpClient 設定 ───
    {
      id: 'http-setup',
      title: 'HttpClient 設定',
      content: `
        <p>Angular 的 <code>HttpClient</code> 是框架內建的 HTTP 通訊層，提供型別安全的 REST API 呼叫能力。
        在 Angular 20+ 中，我們透過 <code>provideHttpClient()</code> 函式在應用程式啟動時設定 HTTP 功能，
        取代了過去的 <code>HttpClientModule</code>。</p>

        <p>設定 <code>HttpClient</code> 的標準做法是在 <code>app.config.ts</code> 中呼叫
        <code>provideHttpClient()</code>，並搭配多種功能函式來擴展行為。最常見的搭配包括：</p>

        <ul>
          <li><code>withInterceptors([...])</code>：註冊函式攔截器陣列，處理認證、快取、日誌等橫切關注點</li>
          <li><code>withFetch()</code>：使用瀏覽器原生 <code>fetch()</code> API 取代 <code>XMLHttpRequest</code>，提升 SSR 相容性並支援串流回應</li>
          <li><code>withRequestsMadeViaParent()</code>：讓子注入器繼承父層的攔截器鏈，適用於微前端架構</li>
        </ul>

        <p>這種函式組合模式（Functional Composition）是 Angular 現代化設計的核心理念：
        取代大型模組匯入，改用精確的功能組合，讓 Tree-shaking 能移除未使用的程式碼。
        每個 <code>with*</code> 函式只會將需要的邏輯加入打包結果。</p>

        <p><code>withFetch()</code> 在 SSR 環境中特別重要，因為 <code>XMLHttpRequest</code>
        在 Node.js 中需要 polyfill，而 <code>fetch()</code> 自 Node.js 18 起已原生支援。
        在 CSR 應用中兩者行為幾乎一致，但建議統一使用 <code>withFetch()</code> 以確保一致性。</p>
      `,
      codeExamples: [
        {
          filename: 'app.config.ts',
          language: 'typescript',
          code: `import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        loggingInterceptor,
        authInterceptor,
        errorInterceptor,
      ]),
    ),
  ],
};`,
          annotation: 'provideHttpClient() 搭配 withFetch() 及攔截器鏈的標準設定。攔截器按陣列順序執行。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: 'Angular 的 provideHttpClient() + withInterceptors() 類似 .NET 的 builder.Services.AddHttpClient() + AddTransientHttpMessageHandler<T>()。兩者都使用管線模式（Pipeline）處理橫切關注點。',
        },
        {
          type: 'best-practice',
          content: '攔截器陣列的順序很重要：日誌攔截器放在最外層可以記錄最原始的請求與最終的回應；錯誤攔截器放在最內層確保能攔截所有錯誤。',
        },
      ],
    },

    // ─── Section 2: HTTP 方法 ───
    {
      id: 'http-methods',
      title: 'HTTP 方法',
      content: `
        <p><code>HttpClient</code> 提供與 HTTP 動詞一一對應的方法：<code>get()</code>、<code>post()</code>、
        <code>put()</code>、<code>patch()</code>、<code>delete()</code>。每個方法都支援泛型參數，
        讓回傳的 <code>Observable</code> 能攜帶正確的型別資訊。</p>

        <p>型別安全是 <code>HttpClient</code> 最強大的特性之一。透過泛型 <code>get&lt;T&gt;(url)</code>，
        TypeScript 編譯器能在開發時期就驗證你對 API 回應的存取是否正確。
        搭配介面定義，可以建立從 API 到 UI 的完整型別鏈。</p>

        <p>常見的設定選項包括：</p>
        <ul>
          <li><code>params</code>：使用 <code>HttpParams</code> 建構查詢參數，自動編碼特殊字元</li>
          <li><code>headers</code>：使用 <code>HttpHeaders</code> 設定自訂標頭（如 Content-Type）</li>
          <li><code>observe</code>：設為 <code>'response'</code> 可取得完整 HTTP 回應（含 status、headers）</li>
          <li><code>responseType</code>：設為 <code>'blob'</code> 處理檔案下載，<code>'text'</code> 處理純文字</li>
        </ul>

        <p>所有 <code>HttpClient</code> 方法都回傳 Cold Observable，意味著只有在 <code>subscribe()</code>
        後才會實際發出 HTTP 請求。每次訂閱都會產生獨立的請求，
        這與 <code>fetch()</code> 的 Promise 行為不同。若需要共享回應，應使用 <code>shareReplay()</code>。</p>

        <p>在 Angular 20+ 中，推薦搭配 <code>resource()</code> API 將 Observable 轉為 Signal，
        讓模板能直接使用反應式資料而不需手動管理訂閱。</p>
      `,
      codeExamples: [
        {
          filename: 'product.service.ts',
          language: 'typescript',
          code: `import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly category: string;
}

export interface PagedResult<T> {
  readonly items: readonly T[];
  readonly total: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/products';

  /** GET — typed response with query params */
  getProducts(page: number, size: number, category?: string): Observable<PagedResult<Product>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<PagedResult<Product>>(this.baseUrl, { params });
  }

  /** GET — single resource */
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(\`\${this.baseUrl}/\${id}\`);
  }

  /** POST — create with typed body and response */
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  /** PUT — full update */
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(\`\${this.baseUrl}/\${id}\`, product);
  }

  /** DELETE — observe full response for status code */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(\`\${this.baseUrl}/\${id}\`);
  }
}`,
          annotation: '標準 CRUD 服務，每個方法都標註泛型確保型別安全。HttpParams 使用不可變鏈式 API。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: 'Angular 的 HttpClient.get<T>() 類似 .NET 的 HttpClient.GetFromJsonAsync<T>()，都提供泛型反序列化。差別在於 Angular 回傳 Observable（惰性、可取消），.NET 回傳 Task（立即執行）。',
        },
        {
          type: 'warning',
          content: 'HttpParams 是不可變物件。params.set() 不會修改原物件，而是回傳新實例。忘記重新賦值是最常見的 bug：必須寫 params = params.set(...)。',
        },
      ],
    },

    // ─── Section 3: 函式攔截器 ───
    {
      id: 'interceptors',
      title: '函式攔截器',
      content: `
        <p>攔截器（Interceptor）是 Angular HTTP 管線的核心擴展機制，允許你在請求送出前和回應收到後
        注入自訂邏輯。Angular 20+ 推薦使用函式攔截器（<code>HttpInterceptorFn</code>），
        取代了過去類別式的 <code>HttpInterceptor</code> 介面。</p>

        <p>函式攔截器是一個接收 <code>HttpRequest</code> 和 <code>HttpHandlerFn</code>
        兩個參數的純函式。透過呼叫 <code>next(req)</code> 將請求傳遞給下一個攔截器或實際的 HTTP 後端。
        你可以在呼叫 <code>next()</code> 前修改請求，在回傳的 <code>Observable</code> 上處理回應。</p>

        <p>常見的攔截器應用場景：</p>
        <ul>
          <li><strong>認證攔截器</strong>：自動在每個請求的 Header 中附加 Bearer Token</li>
          <li><strong>錯誤攔截器</strong>：統一處理 HTTP 錯誤，例如 401 時自動跳轉登入頁</li>
          <li><strong>日誌攔截器</strong>：記錄請求/回應的時間與內容，便於除錯</li>
          <li><strong>快取攔截器</strong>：對 GET 請求實作快取策略，減少重複的網路請求</li>
        </ul>

        <p>函式攔截器可以使用 <code>inject()</code> 取得服務，因為它們在注入上下文中執行。
        請求物件是不可變的，必須使用 <code>req.clone({ ... })</code> 來修改。
        攔截器的執行順序由 <code>withInterceptors([...])</code> 陣列的順序決定：
        請求階段從左到右，回應階段從右到左（洋蔥模型）。</p>
      `,
      codeExamples: [
        {
          filename: 'auth.interceptor.ts',
          language: 'typescript',
          code: `import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.accessToken();

  if (token && !req.url.includes('/auth/login')) {
    const cloned = req.clone({
      setHeaders: { Authorization: \`Bearer \${token}\` },
    });
    return next(cloned);
  }

  return next(req);
};`,
          annotation: '認證攔截器：自動附加 JWT Token，排除登入端點。',
        },
        {
          filename: 'error.interceptor.ts',
          language: 'typescript',
          code: `import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        router.navigate(['/login']);
      } else if (error.status === 403) {
        router.navigate(['/forbidden']);
      } else if (error.status >= 500) {
        console.error('[HTTP 500+]', error.url, error.message);
      }
      return throwError(() => error);
    }),
  );
};`,
          annotation: '錯誤攔截器：401 重導登入、403 跳轉禁止頁、500+ 記錄伺服器錯誤。',
        },
        {
          filename: 'logging.interceptor.ts',
          language: 'typescript',
          code: `import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = performance.now();

  return next(req).pipe(
    tap({
      next: () => {
        const elapsed = Math.round(performance.now() - startTime);
        console.log(\`[HTTP] \${req.method} \${req.urlWithParams} — \${elapsed}ms\`);
      },
      error: (err) => {
        const elapsed = Math.round(performance.now() - startTime);
        console.error(\`[HTTP ERROR] \${req.method} \${req.urlWithParams} — \${elapsed}ms\`, err.status);
      },
    }),
  );
};`,
          annotation: '日誌攔截器：記錄每個請求的方法、URL 和耗時。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: 'Angular 的 HttpInterceptorFn 等同於 .NET 的 DelegatingHandler。兩者都實作洋蔥模型（Onion Model）：請求從外到內，回應從內到外。.NET 透過 HttpMessageHandler 管線實現，Angular 透過 RxJS Observable 鏈實現。',
        },
        {
          type: 'best-practice',
          content: '攔截器中修改請求時務必使用 req.clone()，因為 HttpRequest 是不可變物件。直接修改原始請求會導致難以追蹤的 bug。',
        },
      ],
    },

    // ─── Section 4: 錯誤處理 ───
    {
      id: 'error-handling',
      title: '錯誤處理',
      content: `
        <p>HTTP 請求的錯誤處理是前端應用中最關鍵的基礎建設之一。Angular 的 <code>HttpClient</code>
        在發生錯誤時會發出 <code>HttpErrorResponse</code> 物件，包含完整的錯誤資訊。</p>

        <p><code>HttpErrorResponse</code> 的錯誤分為兩類：</p>
        <ul>
          <li><strong>伺服器端錯誤</strong>（<code>status</code> >= 400）：API 回傳的錯誤狀態碼，
          <code>error</code> 屬性包含回應主體（通常是 JSON 錯誤訊息）</li>
          <li><strong>客戶端錯誤</strong>（<code>status</code> === 0）：網路中斷、DNS 失敗、CORS 阻擋等，
          <code>error</code> 屬性是 <code>ProgressEvent</code> 或 <code>ErrorEvent</code></li>
        </ul>

        <p>在服務層中，使用 RxJS 的 <code>catchError</code> 運算子攔截錯誤並轉換為應用程式能理解的格式。
        搭配 <code>retry()</code> 或 <code>retryWhen()</code> 可以實作自動重試策略，
        適合處理暫時性的網路波動。</p>

        <p>對於全域錯誤處理，Angular 提供 <code>ErrorHandler</code> 抽象類別。
        你可以提供自訂實作來統一收集未處理的錯誤，並將它們送到日誌服務（如 Sentry、Application Insights）。
        全域 <code>ErrorHandler</code> 能捕捉所有 JavaScript 錯誤，包括 Observable 中未處理的錯誤。</p>

        <p>最佳實踐是分層處理：攔截器處理通用的 HTTP 錯誤（401/403/5xx），
        服務層處理業務特定的錯誤（如 409 衝突），元件層處理 UI 狀態（載入中/錯誤/空狀態）。</p>
      `,
      codeExamples: [
        {
          filename: 'product.service.ts',
          language: 'typescript',
          code: `import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, retry, timer, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products').pipe(
      // Retry up to 3 times with exponential backoff
      retry({
        count: 3,
        delay: (error, retryCount) => {
          if (error.status >= 400 && error.status < 500) {
            // Do not retry client errors
            return throwError(() => error);
          }
          const delayMs = Math.pow(2, retryCount) * 1000;
          return timer(delayMs);
        },
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message: string;

    if (error.status === 0) {
      // Client-side / network error
      message = '無法連線到伺服器，請檢查網路連線。';
    } else if (error.status === 404) {
      message = '找不到請求的資源。';
    } else if (error.status === 409) {
      message = '資料衝突，請重新整理後再試。';
    } else {
      message = \`伺服器錯誤 (\${error.status}): \${error.error?.message ?? '未知錯誤'}\`;
    }

    console.error('[ProductService]', message, error);
    return throwError(() => new Error(message));
  }
}`,
          annotation: '服務層錯誤處理：指數退避重試 + 分類錯誤訊息。客戶端錯誤不重試。',
        },
        {
          filename: 'global-error-handler.ts',
          language: 'typescript',
          code: `import { ErrorHandler, Injectable, inject } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    // Extract the original error from Angular wrapper
    const unwrapped = (error as { rejection?: unknown })?.rejection ?? error;

    console.error('[GlobalErrorHandler]', unwrapped);

    // Send to external logging service (Sentry, Application Insights, etc.)
    // inject(LoggingService).captureException(unwrapped);
  }
}

// Register in app.config.ts:
// providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]`,
          annotation: '全域錯誤處理器：捕捉所有未處理的錯誤並統一記錄。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: '.NET 中使用 Polly 套件實作 Retry + Circuit Breaker 策略。Angular 使用 RxJS 的 retry() 運算子配合 delay 函式可達到類似效果，但沒有內建的熔斷器（Circuit Breaker），需要自行實作或使用第三方套件。',
        },
        {
          type: 'warning',
          content: '不要在 catchError 中忘記回傳 throwError()。如果回傳 EMPTY 或 of([])，下游訂閱者會認為請求成功，導致 UI 顯示錯誤的空狀態。',
        },
      ],
    },

    // ─── Section 5: 檔案上傳 ───
    {
      id: 'file-upload',
      title: '檔案上傳',
      content: `
        <p>檔案上傳是 Web 應用中常見的需求。Angular 的 <code>HttpClient</code> 透過
        <code>FormData</code> 搭配 <code>reportProgress</code> 選項，
        提供了完整的檔案上傳與進度追蹤功能。</p>

        <p>實作檔案上傳的關鍵步驟：</p>
        <ol>
          <li>使用 <code>FormData</code> 將檔案包裝為 multipart/form-data 格式</li>
          <li>設定 <code>reportProgress: true</code> 啟用進度事件</li>
          <li>設定 <code>observe: 'events'</code> 接收所有 HTTP 事件（包括上傳進度）</li>
          <li>在 Observable 管線中過濾 <code>HttpEventType.UploadProgress</code> 事件，計算百分比</li>
        </ol>

        <p><code>HttpClient</code> 發出的事件類型包括：<code>Sent</code>（請求已送出）、
        <code>UploadProgress</code>（上傳進度）、<code>ResponseHeader</code>（收到回應標頭）、
        <code>DownloadProgress</code>（下載進度）、<code>Response</code>（完整回應）。</p>

        <p>注意不要手動設定 <code>Content-Type</code> 標頭，因為瀏覽器會自動在 <code>FormData</code>
        請求中加上正確的 <code>multipart/form-data</code> 與 boundary 值。
        手動設定反而會破壞請求格式。</p>

        <p>在攔截器中也需要注意：如果你的認證攔截器會設定 <code>Content-Type: application/json</code>，
        應該排除檔案上傳的請求，讓瀏覽器自行處理。</p>
      `,
      codeExamples: [
        {
          filename: 'file-upload.service.ts',
          language: 'typescript',
          code: `import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEventType, HttpEvent } from '@angular/common/http';
import { Observable, map, filter } from 'rxjs';

export interface UploadProgress {
  readonly status: 'progress' | 'complete';
  readonly percentage: number;
  readonly url?: string;
}

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  private readonly http = inject(HttpClient);

  upload(file: File, endpoint: string): Observable<UploadProgress> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<{ url: string }>(endpoint, formData, {
      reportProgress: true,
      observe: 'events',
    }).pipe(
      filter((event): event is HttpEvent<{ url: string }> =>
        event.type === HttpEventType.UploadProgress ||
        event.type === HttpEventType.Response
      ),
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentage = event.total
            ? Math.round((100 * event.loaded) / event.total)
            : 0;
          return { status: 'progress' as const, percentage };
        }
        // HttpEventType.Response
        return {
          status: 'complete' as const,
          percentage: 100,
          url: (event as { body?: { url: string } | null }).body?.url,
        };
      }),
    );
  }
}`,
          annotation: 'FormData 上傳搭配進度追蹤。filter + map 將 HTTP 事件轉換為統一的 UploadProgress 模型。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: '.NET 的 IFormFile 對應到瀏覽器的 FormData。Angular 的 reportProgress + observe: "events" 類似 .NET SignalR 的串流回報機制。兩者都需要後端對應支援 multipart/form-data 解析。',
        },
        {
          type: 'warning',
          content: '使用 FormData 時不要手動設定 Content-Type 標頭。瀏覽器會自動設定正確的 multipart/form-data 以及 boundary 參數。手動設定會導致後端無法解析檔案。',
        },
      ],
    },

    // ─── Section 6: 完整範例 ───
    {
      id: 'complete-example',
      title: '完整範例',
      content: `
        <p>以下展示一個完整的 API 服務架構，包含攔截器鏈、型別安全的 CRUD 操作、
        以及與 Signal 整合的元件層呼叫方式。這個範例模擬了一個真實的產品管理模組。</p>

        <p>架構分為三層：</p>
        <ol>
          <li><strong>攔截器層</strong>：透過 <code>provideHttpClient(withInterceptors([...]))</code>
          設定全域橫切關注點，包括認證 Token 注入、請求日誌、錯誤統一處理</li>
          <li><strong>服務層</strong>：封裝所有 API 呼叫，提供型別安全的介面。
          每個方法回傳 <code>Observable&lt;T&gt;</code>，讓元件可以靈活選擇訂閱方式</li>
          <li><strong>元件層</strong>：使用 <code>resource()</code> 將 Observable 轉為 Signal，
          讓模板直接消費反應式資料。<code>resource()</code> 自動管理載入狀態與錯誤狀態</li>
        </ol>

        <p>這種分層設計的好處在於：攔截器處理與業務無關的橫切關注點，
        服務層只關心 API 端點與資料轉換，元件層只處理 UI 狀態呈現。
        任何一層的修改都不會影響其他層。</p>

        <p>在實際專案中，你可能還需要加入快取攔截器（減少重複請求）、
        重試攔截器（處理暫時性網路問題）、以及 API 版本管理（在 URL 或 Header 中附加版本號）。
        這些都可以透過新增攔截器函式來擴展，而不需要修改現有程式碼。</p>
      `,
      codeExamples: [
        {
          filename: 'api.service.ts',
          language: 'typescript',
          code: `import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, retry, timer, throwError } from 'rxjs';

export interface ApiResponse<T> {
  readonly data: T;
  readonly message: string;
  readonly timestamp: string;
}

export interface PaginationParams {
  readonly page: number;
  readonly size: number;
  readonly sort?: string;
  readonly direction?: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1';

  get<T>(path: string, params?: Record<string, string | number>): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.set(key, String(value));
      });
    }

    return this.http.get<ApiResponse<T>>(\`\${this.baseUrl}\${path}\`, { params: httpParams }).pipe(
      retry({ count: 2, delay: (_err, attempt) => timer(attempt * 1000) }),
      catchError(this.handleApiError),
    );
  }

  post<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(\`\${this.baseUrl}\${path}\`, body).pipe(
      catchError(this.handleApiError),
    );
  }

  put<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(\`\${this.baseUrl}\${path}\`, body).pipe(
      catchError(this.handleApiError),
    );
  }

  delete<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(\`\${this.baseUrl}\${path}\`).pipe(
      catchError(this.handleApiError),
    );
  }

  private handleApiError(error: HttpErrorResponse): Observable<never> {
    const message = error.status === 0
      ? '網路連線失敗'
      : \`API 錯誤 \${error.status}: \${error.error?.message ?? error.statusText}\`;
    return throwError(() => new Error(message));
  }
}`,
          annotation: '通用 API 服務：統一包裝回應格式、自動重試、錯誤轉換。適合中大型專案作為所有 API 呼叫的基礎層。',
        },
        {
          filename: 'product-list.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, inject, signal, resource } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ApiService, ApiResponse } from '../shared/api.service';

interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}

@Component({
  selector: 'app-product-list',
  template: \`
    @if (products.isLoading()) {
      <p>載入中...</p>
    } @else if (products.error()) {
      <p class="error">{{ products.error() }}</p>
    } @else {
      @for (p of products.value()?.data ?? []; track p.id) {
        <div class="product-card">
          <h3>{{ p.name }}</h3>
          <span>\{{ p.price | currency:'TWD' }}</span>
        </div>
      }
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  private readonly api = inject(ApiService);

  protected readonly page = signal(1);

  protected readonly products = rxResource({
    request: this.page,
    loader: ({ request: page }) =>
      this.api.get<Product[]>('/products', { page, size: 20 }),
  });
}`,
          annotation: '元件使用 rxResource 將 Observable API 呼叫轉為 Signal，自動管理載入/錯誤狀態。',
        },
      ],
      tips: [
        {
          type: 'best-practice',
          content: '建議建立一個通用的 ApiService 作為所有 HTTP 呼叫的基礎層，統一處理錯誤格式、重試策略、請求參數序列化。各功能服務再注入 ApiService 來呼叫特定端點。',
        },
        {
          type: 'tip',
          content: 'rxResource() 是 resource() 的 RxJS 變體，接受回傳 Observable 的 loader。適合與既有的 HttpClient 服務整合。resource() 的 loader 則回傳 Promise。',
        },
      ],
    },

    // ─── Section 7: 常見陷阱 ───
    {
      id: 'http-pitfalls',
      title: '常見陷阱',
      content: `
        <p>以下列出使用 <code>HttpClient</code> 時最常見的 8 個錯誤，
        以及如何避免它們。這些陷阱幾乎每個 Angular 開發者都曾經歷過：</p>

        <ol>
          <li><strong>忘記訂閱 Observable</strong>：<code>HttpClient</code> 回傳的是 Cold Observable，
          如果沒有 <code>subscribe()</code> 或在模板中使用 <code>async</code> pipe，
          HTTP 請求根本不會發出。這是從 Promise 背景轉來的開發者最常犯的錯誤。</li>

          <li><strong>重複訂閱造成多次請求</strong>：在模板中多次使用 <code>async</code> pipe
          訂閱同一個 Observable 會發出多個相同的 HTTP 請求。解法是使用 <code>shareReplay(1)</code>
          或將資料存入 Signal。</li>

          <li><strong>HttpParams 不可變性</strong>：<code>params.set()</code> 回傳新物件而非修改原物件。
          忘記 <code>params = params.set(...)</code> 會導致參數遺失。</li>

          <li><strong>未處理的錯誤</strong>：沒有 <code>catchError</code> 的 Observable 在發生錯誤時
          會讓錯誤冒泡到全域 ErrorHandler，可能導致未預期的 UI 凍結。</li>

          <li><strong>記憶體洩漏</strong>：在元件中訂閱長時間存活的 Observable 卻未在銷毀時取消訂閱。
          使用 <code>takeUntilDestroyed()</code> 或 <code>resource()</code> 來自動管理生命週期。</li>

          <li><strong>手動設定 FormData 的 Content-Type</strong>：瀏覽器會自動處理 multipart boundary，
          手動設定 <code>Content-Type</code> 會覆蓋正確的 boundary 值。</li>

          <li><strong>攔截器順序錯誤</strong>：攔截器按陣列順序執行。如果錯誤攔截器在認證攔截器之前，
          可能會在 Token 刷新完成前就跳轉到登入頁。</li>

          <li><strong>在攔截器中忘記回傳 next()</strong>：攔截器必須呼叫 <code>next(req)</code>
          將請求傳遞下去，否則請求會永遠不會完成，導致無限等待。</li>
        </ol>
      `,
      codeExamples: [
        {
          filename: 'pitfall-examples.ts',
          language: 'typescript',
          code: `// ❌ Pitfall 1: Forgot to subscribe — request never fires
this.http.get('/api/data');

// ✅ Fix: subscribe or use resource()
this.http.get('/api/data').subscribe(data => console.log(data));

// ❌ Pitfall 2: Multiple subscriptions = multiple requests
// template: {{ data$ | async }} and {{ data$ | async }}
readonly data$ = this.http.get<Data[]>('/api/data');

// ✅ Fix: share the Observable
readonly data$ = this.http.get<Data[]>('/api/data').pipe(shareReplay(1));

// ❌ Pitfall 3: HttpParams immutability ignored
let params = new HttpParams();
params.set('page', '1');   // Returns a NEW object, original unchanged!
params.set('size', '20');

// ✅ Fix: chain or reassign
const params = new HttpParams()
  .set('page', '1')
  .set('size', '20');

// ❌ Pitfall 5: Memory leak — no cleanup
ngOnInit() {
  this.http.get('/api/data').subscribe(d => this.data = d);
}

// ✅ Fix: automatic cleanup with takeUntilDestroyed
private readonly destroyRef = inject(DestroyRef);
ngOnInit() {
  this.http.get('/api/data').pipe(
    takeUntilDestroyed(this.destroyRef),
  ).subscribe(d => this.data = d);
}`,
          annotation: '常見陷阱的錯誤寫法與修正對照。每個陷阱都有對應的解決方案。',
        },
      ],
      tips: [
        {
          type: 'best-practice',
          content: '優先使用 resource() / rxResource() 取代手動 subscribe()。resource 自動管理訂閱生命週期，不需要 takeUntilDestroyed()，並且直接提供 Signal 讓模板消費。',
        },
        {
          type: 'dotnet-comparison',
          content: '在 .NET 中 HttpClient 是透過 IHttpClientFactory 管理生命週期以避免 Socket 耗盡。Angular 的 HttpClient 則透過 Observable 的惰性特性來管理——只有在訂閱時才建立連線，取消訂閱時自動關閉。',
        },
      ],
    },
  ],
};

@Component({
  selector: 'app-ch05',
  imports: [GuidePage],
  template: '<app-guide-page [chapter]="chapter" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ch05HttpClient {
  protected readonly chapter = CHAPTER;
}
