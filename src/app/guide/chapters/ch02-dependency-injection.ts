import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GuidePage } from '../shared/guide-page';
import { GuideChapter } from '../models/guide-chapter';

const CHAPTER: GuideChapter = {
  id: 'dependency-injection',
  number: 2,
  title: '服務與依賴注入',
  subtitle: 'Provider 類型、注入器階層、InjectionToken、inject()',
  icon: 'hub',
  category: 'fundamentals',
  tags: ['di', 'inject', 'service', 'provider', 'InjectionToken', 'hierarchy'],
  estimatedMinutes: 40,
  sections: [
    // ─── Section 1: @Injectable Decorator ───
    {
      id: 'injectable-decorator',
      title: '@Injectable 裝飾器',
      content: `
<p>
  在 Angular 中，<strong>服務（Service）</strong>是封裝業務邏輯、資料存取或跨元件共享狀態的類別。
  透過 <code>@Injectable</code> 裝飾器，我們告訴 Angular 的 DI 系統如何建立和提供這個服務的實例。
</p>
<p>
  <code>@Injectable</code> 最重要的屬性是 <code>providedIn</code>，它決定服務在哪個注入器層級被提供。
  常用選項如下：
</p>
<table>
  <thead>
    <tr><th><code>providedIn</code> 值</th><th>作用域</th><th>說明</th></tr>
  </thead>
  <tbody>
    <tr><td><code>'root'</code></td><td>應用級單例</td><td>整個應用共享同一實例。<strong>最常用</strong>，也是預設推薦值。</td></tr>
    <tr><td><code>'platform'</code></td><td>平台級單例</td><td>跨多個 Angular 應用（如 micro-frontend）共享實例。極少使用。</td></tr>
    <tr><td><code>'any'</code></td><td>每個延遲載入模組一個實例</td><td>已不推薦使用，建議明確控制作用域。</td></tr>
    <tr><td>不設定</td><td>需手動在 providers 中提供</td><td>適用於元件級 DI 或需要動態設定的場景。</td></tr>
  </tbody>
</table>
<p>
  <strong>Tree-shakable providers：</strong>當使用 <code>providedIn: 'root'</code> 時，
  如果整個應用中沒有任何元件或服務注入該服務，build 工具會自動移除它（tree-shaking）。
  這是效能最佳化的關鍵——不使用的服務不會出現在最終的 bundle 中。
</p>
<p>
  相較於在 <code>NgModule.providers</code> 中註冊（非 tree-shakable），
  <code>providedIn: 'root'</code> 模式讓服務的存在與否完全由消費端決定。
</p>
      `,
      codeExamples: [
        {
          filename: 'user.service.ts',
          language: 'typescript',
          code: `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/users';

  getAll(): Observable<readonly User[]> {
    return this.http.get<readonly User[]>(this.baseUrl);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(\`\${this.baseUrl}/\${id}\`);
  }

  create(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }
}`,
          annotation: 'A standard tree-shakable service using providedIn: root and inject() for HttpClient.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '除非有明確理由需要限制作用域，否則一律使用 <code>providedIn: \'root\'</code>。它提供 tree-shaking、全域單例、且不需要額外的 providers 設定。' },
        { type: 'dotnet-comparison', content: '<code>@Injectable({ providedIn: \'root\' })</code> 等同於 .NET 的 <code>builder.Services.AddSingleton&lt;T&gt;()</code>——在應用啟動時註冊一個全域單例。差別在於 Angular 的 tree-shakable 版本只有在被 inject 時才會真正建立。' },
      ],
    },

    // ─── Section 2: Injector Hierarchy ───
    {
      id: 'injector-hierarchy',
      title: '注入器階層',
      content: `
<p>
  Angular 的 DI 系統採用<strong>分層注入器架構（Hierarchical Injector）</strong>。
  當一個元件或服務要求注入某個依賴時，Angular 會從當前注入器開始向上搜尋，
  直到找到對應的 provider 或抵達最頂層的注入器。
</p>
<p><strong>注入器層級（由上到下）：</strong></p>
<ul>
  <li>
    <strong>Platform Injector（平台注入器）</strong>——最頂層，由 <code>platformBrowserDynamic()</code> 建立。
    包含平台級服務（如 <code>DOCUMENT</code>）。極少直接使用。
  </li>
  <li>
    <strong>Root Injector（根注入器）</strong>——由 <code>bootstrapApplication()</code> 建立。
    <code>providedIn: 'root'</code> 的服務都在這裡。這是最常用的層級。
  </li>
  <li>
    <strong>Element Injector（元素注入器）</strong>——每個元件自動擁有。
    在元件 <code>@Component({ providers: [...] })</code> 中提供的服務屬於這個層級。
    實例的生命週期與元件綁定。
  </li>
</ul>
<p><strong>解析演算法：</strong></p>
<ol>
  <li>查詢當前元件的 Element Injector</li>
  <li>向上遍歷父元件的 Element Injector</li>
  <li>查詢 Root Injector</li>
  <li>查詢 Platform Injector</li>
  <li>如果都沒找到，拋出 <code>NullInjectorError</code></li>
</ol>
<p>
  這個分層架構的關鍵價值在於：你可以在不同層級提供同一個 token 的不同實例。
  例如，在元件的 <code>providers</code> 中提供 <code>LoggerService</code>，
  該元件及其所有子元件會使用這個新實例，而不影響應用其他部分。
</p>
      `,
      codeExamples: [
        {
          filename: 'component-level-di.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormStateService } from './form-state.service';

@Component({
  selector: 'app-checkout-form',
  providers: [FormStateService], // New instance per component
  template: \`
    <h2>Checkout</h2>
    <p>Form dirty: {{ formState.isDirty() }}</p>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutForm {
  protected readonly formState = inject(FormStateService);
}

// FormStateService does NOT have providedIn: 'root'
// Each CheckoutForm gets its own isolated instance
// When the component is destroyed, the service instance is also garbage collected`,
          annotation: 'Component-level provider: each component instance gets its own service instance.',
        },
      ],
      tips: [
        { type: 'tip', content: '用 <code>@Optional()</code> 修飾注入可以避免 <code>NullInjectorError</code>。但在 signal-based DI 中，更推薦直接在 <code>inject()</code> 中設定 <code>{ optional: true }</code>。' },
        { type: 'dotnet-comparison', content: 'Angular 的分層注入器類似 .NET 的 <code>IServiceScope</code>。Root Injector 對應 <code>Singleton</code> 生命週期，Element Injector 對應 <code>Scoped</code>——作用域隨元件的建立和銷毀而開始和結束。' },
        { type: 'warning', content: '理解注入器搜尋順序至關重要：如果不小心在子元件的 <code>providers</code> 中重新提供了一個原本應該是單例的服務，你會得到多個不同的實例，導致狀態不一致。' },
      ],
    },

    // ─── Section 3: Provider Types ───
    {
      id: 'provider-types',
      title: 'Provider 類型',
      content: `
<p>
  Angular 的 DI 系統支援四種 provider 類型，讓你可以靈活控制如何建立和提供依賴實例。
  每種類型適用於不同的場景：
</p>
<table>
  <thead>
    <tr><th>Provider 類型</th><th>語法</th><th>說明</th><th>使用場景</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><code>useClass</code></td>
      <td><code>{ provide: A, useClass: B }</code></td>
      <td>請求 A 時，建立並注入 B 的實例</td>
      <td>替換實作（如測試用 Mock）、策略模式</td>
    </tr>
    <tr>
      <td><code>useValue</code></td>
      <td><code>{ provide: TOKEN, useValue: val }</code></td>
      <td>直接提供一個靜態值</td>
      <td>設定物件、常數、環境變數</td>
    </tr>
    <tr>
      <td><code>useFactory</code></td>
      <td><code>{ provide: TOKEN, useFactory: fn, deps: [...] }</code></td>
      <td>執行工廠函式來建立實例</td>
      <td>需要複雜初始化邏輯、條件建立</td>
    </tr>
    <tr>
      <td><code>useExisting</code></td>
      <td><code>{ provide: A, useExisting: B }</code></td>
      <td>建立一個 token 的別名，指向已存在的 provider</td>
      <td>介面別名、向後相容</td>
    </tr>
  </tbody>
</table>
<p>
  <strong>useClass</strong> 是最常見的 provider 類型——當你在 <code>providers</code> 陣列中只寫一個類別名稱
  （如 <code>providers: [MyService]</code>）時，它實際上是 <code>{ provide: MyService, useClass: MyService }</code> 的簡寫。
</p>
<p>
  <strong>useFactory</strong> 適合需要存取其他依賴或執行條件邏輯才能建立實例的場景。
  在 standalone 架構下，工廠函式可以搭配 <code>inject()</code> 在注入上下文中直接取得依賴。
</p>
      `,
      codeExamples: [
        {
          filename: 'provider-types.ts',
          language: 'typescript',
          code: `import { InjectionToken, inject } from '@angular/core';

// ── useValue ──
export interface AppConfig {
  readonly apiUrl: string;
  readonly debug: boolean;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

// In bootstrapApplication providers:
// { provide: APP_CONFIG, useValue: { apiUrl: '/api', debug: false } }

// ── useClass ──
export abstract class Logger {
  abstract log(message: string): void;
}

export class ConsoleLogger extends Logger {
  log(message: string): void {
    console.log(\`[LOG] \${message}\`);
  }
}

// { provide: Logger, useClass: ConsoleLogger }

// ── useFactory ──
export const API_CLIENT = new InjectionToken<ApiClient>('api.client');

// {
//   provide: API_CLIENT,
//   useFactory: () => {
//     const config = inject(APP_CONFIG);
//     const http = inject(HttpClient);
//     return new ApiClient(http, config.apiUrl);
//   },
// }

// ── useExisting ──
// { provide: AbstractLogger, useExisting: ConsoleLogger }
// Both tokens resolve to the SAME instance`,
          annotation: 'All four provider types with practical examples.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '在 standalone 架構中，<code>useFactory</code> 的工廠函式可以直接使用 <code>inject()</code> 取得依賴，不需要再用 <code>deps</code> 陣列。這讓程式碼更簡潔且型別安全。' },
        { type: 'dotnet-comparison', content: '這四種 provider 直接對應 .NET DI：<code>useClass</code> → <code>AddSingleton&lt;IService, Implementation&gt;()</code>，<code>useValue</code> → <code>AddSingleton(instance)</code>，<code>useFactory</code> → <code>AddSingleton(sp =&gt; ...)</code>，<code>useExisting</code> → 無直接對應，但可透過工廠轉發。' },
      ],
    },

    // ─── Section 4: InjectionToken<T> ───
    {
      id: 'injection-token',
      title: 'InjectionToken<T>',
      content: `
<p>
  當我們需要注入的不是一個類別（class），而是一個<strong>設定物件、字串、數值、函式</strong>等非類別型態時，
  就需要使用 <code>InjectionToken&lt;T&gt;</code> 來建立一個唯一的 DI token。
</p>
<p>
  <code>InjectionToken</code> 接受一個描述字串和可選的選項物件。描述字串用於除錯和錯誤訊息，
  而選項物件可以包含 <code>providedIn</code> 和 <code>factory</code>，讓 token 自帶預設值。
</p>
<p><strong>常見使用場景：</strong></p>
<ul>
  <li><strong>應用設定（Config）</strong>——API base URL、feature flags、環境參數</li>
  <li><strong>第三方函式庫整合</strong>——需要注入非 Angular 的物件（如 window、document）</li>
  <li><strong>策略模式</strong>——注入不同的演算法或行為實作</li>
  <li><strong>APP_INITIALIZER</strong>——應用啟動前需要執行的初始化邏輯</li>
</ul>
<p>
  <strong>APP_INITIALIZER 模式：</strong>Angular 提供內建的 <code>APP_INITIALIZER</code> token，
  它是一個 multi-provider token。任何提供給它的工廠函式都會在應用啟動前執行。
  如果工廠回傳 Promise 或 Observable，Angular 會等待其完成後才渲染第一個元件。
  這適用於載入設定檔、初始化認證狀態等場景。
</p>
<p>
  自帶 factory 的 <code>InjectionToken</code> 也具有 tree-shakable 特性——
  如果沒有人注入它，對應的工廠函式不會被包含在 bundle 中。
</p>
      `,
      codeExamples: [
        {
          filename: 'injection-token-examples.ts',
          language: 'typescript',
          code: `import { InjectionToken, inject, APP_INITIALIZER } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// ── Token with default factory (tree-shakable) ──
export interface FeatureFlags {
  readonly darkMode: boolean;
  readonly experimentalNav: boolean;
}

export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('feature.flags', {
  providedIn: 'root',
  factory: () => ({ darkMode: false, experimentalNav: false }),
});

// ── Token provided in bootstrapApplication ──
export const API_BASE_URL = new InjectionToken<string>('api.base.url');

// In providers array:
// { provide: API_BASE_URL, useValue: 'https://api.example.com' }

// ── APP_INITIALIZER pattern ──
function initializeApp(): () => Promise<void> {
  const http = inject(HttpClient);
  const featureFlags = inject(FEATURE_FLAGS);

  return async () => {
    const config = await firstValueFrom(
      http.get<FeatureFlags>('/api/feature-flags')
    );
    // In a real app you would update a writable signal in a config service
    console.log('App initialized with flags:', config);
  };
}

// In bootstrapApplication providers:
// {
//   provide: APP_INITIALIZER,
//   useFactory: initializeApp,
//   multi: true,
// }`,
          annotation: 'InjectionToken with default factory and APP_INITIALIZER for pre-bootstrap logic.',
        },
      ],
      tips: [
        { type: 'tip', content: '使用自帶 <code>factory</code> 的 <code>InjectionToken</code> 可以省去在 providers 中手動註冊的步驟，同時保有 tree-shaking 優勢。消費端只需 <code>inject(TOKEN)</code> 即可使用。' },
        { type: 'dotnet-comparison', content: '<code>InjectionToken</code> 類似 .NET 的 <code>IOptions&lt;T&gt;</code> 模式——都是透過型別化的 token 注入設定物件。<code>APP_INITIALIZER</code> 則對應 .NET 的 <code>IHostedService</code> 或 <code>IStartupFilter</code>——在應用啟動前執行初始化邏輯。' },
        { type: 'warning', content: '<code>APP_INITIALIZER</code> 中的同步錯誤會阻止整個應用啟動。務必加上錯誤處理（try/catch），並在無法恢復時提供使用者友善的錯誤頁面。' },
      ],
    },

    // ─── Section 5: inject() vs Constructor Injection ───
    {
      id: 'inject-function',
      title: 'inject() vs 建構函式注入',
      content: `
<p>
  Angular v14 引入了 <code>inject()</code> 函式，作為傳統建構函式參數注入的替代方案。
  在 v20+ 的現代 Angular 中，<code>inject()</code> 是<strong>唯一推薦的注入方式</strong>。
</p>
<p><strong>inject() 的優勢：</strong></p>
<ul>
  <li><strong>型別安全</strong>——回傳值自動推斷為正確的型別，不需要額外的型別標註</li>
  <li><strong>更簡潔</strong>——不需要宣告 constructor 參數和對應的欄位</li>
  <li><strong>組合友善</strong>——可以在工廠函式、functional guard/resolver 中直接使用</li>
  <li><strong>可搭配 readonly</strong>——搭配 <code>readonly</code> 修飾符確保注入的服務不被重新賦值</li>
  <li><strong>繼承友善</strong>——子類別不需要透過 <code>super()</code> 傳遞所有父類別的依賴</li>
</ul>
<p><strong>注入上下文（Injection Context）規則：</strong></p>
<p>
  <code>inject()</code> 只能在以下地方呼叫：
</p>
<ul>
  <li>類別欄位初始化器（field initializer）</li>
  <li>建構函式（constructor body）</li>
  <li>工廠函式（useFactory 或 InjectionToken factory）</li>
  <li>functional guard、resolver、interceptor</li>
  <li><code>runInInjectionContext()</code> 包裝的區塊</li>
</ul>
<p>
  在 <code>ngOnInit</code> 或其他生命週期方法、事件處理器、setTimeout callback 中
  呼叫 <code>inject()</code> 會拋出 <code>NG0203: inject() must be called from an injection context</code> 錯誤。
</p>
      `,
      codeExamples: [
        {
          filename: 'inject-migration.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';
import { NotificationService } from './notification.service';

// ❌ Old pattern — constructor injection
@Component({ /* ... */ changeDetection: ChangeDetectionStrategy.OnPush })
export class OldUserDetail {
  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly notifications: NotificationService,
  ) {}
}

// ✅ New pattern — inject() field initializers
@Component({
  selector: 'app-user-detail',
  template: \`<p>User detail works</p>\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetail {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationService);
}`,
          annotation: 'Side-by-side comparison of constructor injection vs inject() field initializers.',
        },
        {
          filename: 'functional-guard.ts',
          language: 'typescript',
          code: `import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// inject() works directly in functional guards — no class needed
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};`,
          annotation: 'inject() in a functional guard — runs within injection context automatically.',
        },
      ],
      tips: [
        { type: 'warning', content: '永遠不要在 <code>ngOnInit()</code>、事件處理器或 <code>setTimeout</code> 中呼叫 <code>inject()</code>——這些不在注入上下文中。如果需要動態注入，請在 constructor 或欄位初始化時先儲存 <code>Injector</code> 實例。' },
        { type: 'dotnet-comparison', content: '<code>inject()</code> 類似 .NET Minimal API 中直接在 handler 中解析服務：<code>app.MapGet("/users", (UserService svc) =&gt; ...)</code>。兩者都不需要明確的建構函式，讓程式碼更簡潔。' },
        { type: 'best-practice', content: '注入的服務一律加上 <code>private readonly</code> 修飾符。<code>private</code> 防止模板直接存取，<code>readonly</code> 防止重新賦值。' },
      ],
    },

    // ─── Section 6: Multi-providers ───
    {
      id: 'multi-providers',
      title: 'Multi-providers',
      content: `
<p>
  Angular 的 DI 系統支援 <strong>multi-provider</strong> 機制——
  允許多個 provider 使用同一個 token，最終注入的是所有 provider 值組成的<strong>陣列</strong>。
  這是一種強大的擴展機制，Angular 自身在多處使用它。
</p>
<p><strong>設定方式：</strong>在 provider 設定中加上 <code>multi: true</code>。</p>
<p><strong>Angular 內建的 Multi-provider Token：</strong></p>
<ul>
  <li><code>APP_INITIALIZER</code>——應用啟動前執行的初始化函式</li>
  <li><code>HTTP_INTERCEPTORS</code>——HTTP 攔截器（class-based，新專案推薦用 <code>withInterceptors()</code> 取代）</li>
  <li><code>ENVIRONMENT_INITIALIZER</code>——環境初始化器</li>
  <li><code>NG_VALIDATORS</code> / <code>NG_ASYNC_VALIDATORS</code>——表單驗證器</li>
</ul>
<p>
  Multi-provider 的<strong>執行順序</strong>取決於 providers 陣列中的宣告順序。
  Angular 會按照陣列順序建立實例並呼叫。對於 HTTP 攔截器等對順序敏感的場景，
  宣告順序就是執行順序。
</p>
<p>
  在 Angular v15+ 的 standalone 架構中，建議使用 <code>provideHttpClient(withInterceptors([...]))</code>
  來註冊 functional interceptor，而非 class-based 的 <code>HTTP_INTERCEPTORS</code> multi-provider。
  Functional interceptor 更簡潔、更容易測試，且不需要 <code>multi: true</code> 的樣板程式碼。
</p>
      `,
      codeExamples: [
        {
          filename: 'multi-provider-example.ts',
          language: 'typescript',
          code: `import {
  InjectionToken,
  inject,
  APP_INITIALIZER,
  ENVIRONMENT_INITIALIZER,
} from '@angular/core';

// ── Custom multi-provider token ──
export interface Plugin {
  readonly name: string;
  init(): void;
}

export const APP_PLUGIN = new InjectionToken<Plugin>('app.plugin');

const analyticsPlugin: Plugin = {
  name: 'analytics',
  init: () => console.log('Analytics initialized'),
};

const loggingPlugin: Plugin = {
  name: 'logging',
  init: () => console.log('Logging initialized'),
};

// In providers array:
// { provide: APP_PLUGIN, useValue: analyticsPlugin, multi: true },
// { provide: APP_PLUGIN, useValue: loggingPlugin, multi: true },

// Inject all plugins as an array:
// const plugins = inject(APP_PLUGIN); // Plugin[]
// plugins.forEach(p => p.init());

// ── APP_INITIALIZER multi-provider ──
function loadConfig() {
  return async () => {
    const response = await fetch('/api/config');
    console.log('Config loaded:', await response.json());
  };
}

function loadTranslations() {
  return async () => {
    const response = await fetch('/api/i18n/zh-TW');
    console.log('Translations loaded:', await response.json());
  };
}

// Both run before the app renders:
// { provide: APP_INITIALIZER, useFactory: loadConfig, multi: true },
// { provide: APP_INITIALIZER, useFactory: loadTranslations, multi: true },`,
          annotation: 'Custom and built-in multi-providers for plugin systems and app initialization.',
        },
      ],
      tips: [
        { type: 'warning', content: '如果忘記加 <code>multi: true</code>，後面的 provider 會覆蓋前面的，你只會得到最後一個值而非陣列。這是一個非常常見的 DI 錯誤。' },
        { type: 'tip', content: '新專案建議使用 <code>provideHttpClient(withInterceptors([authInterceptor, loggingInterceptor]))</code> 取代 class-based 的 <code>HTTP_INTERCEPTORS</code> multi-provider。Functional interceptor 更簡潔且易於測試。' },
        { type: 'dotnet-comparison', content: 'Multi-provider 類似 .NET 的 <code>IEnumerable&lt;T&gt;</code> 注入——當你向 DI 容器註冊多個同型別的服務時，注入 <code>IEnumerable&lt;T&gt;</code> 可以取得所有實例。Angular 的 <code>multi: true</code> 達到相同效果。' },
      ],
    },

    // ─── Section 7: DI Scope Patterns ───
    {
      id: 'di-scope-patterns',
      title: 'DI 作用域模式',
      content: `
<p>
  Angular DI 的作用域（scope）決定了服務實例的<strong>生命週期和共享範圍</strong>。
  正確選擇作用域對於記憶體管理、狀態隔離和應用效能至關重要。
</p>
<table>
  <thead>
    <tr><th>模式</th><th>Angular 實作</th><th>.NET 對應</th><th>使用場景</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Singleton</strong></td>
      <td><code>providedIn: 'root'</code></td>
      <td><code>AddSingleton&lt;T&gt;()</code></td>
      <td>全域共享狀態、API 用戶端、認證服務</td>
    </tr>
    <tr>
      <td><strong>Scoped</strong></td>
      <td><code>@Component({ providers: [S] })</code></td>
      <td><code>AddScoped&lt;T&gt;()</code></td>
      <td>表單狀態、嚮導步驟狀態、對話框狀態</td>
    </tr>
    <tr>
      <td><strong>Transient</strong></td>
      <td>useFactory 每次回傳新實例</td>
      <td><code>AddTransient&lt;T&gt;()</code></td>
      <td>無狀態工具、每次使用需要新實例的場景</td>
    </tr>
  </tbody>
</table>
<p><strong>決策流程：</strong></p>
<ol>
  <li><strong>預設用 Singleton</strong>（<code>providedIn: 'root'</code>）——大部分服務只需要一個全域實例</li>
  <li><strong>狀態需隔離時用 Scoped</strong>（元件 providers）——如表單編輯器、每個實例需要獨立狀態</li>
  <li><strong>極少用 Transient</strong>——Angular 中很少需要真正的 transient 服務。如果需要，通常表示該邏輯應該是一個純函式而非服務</li>
</ol>
<p>
  <strong>Scoped 的陷阱：</strong>當一個元件提供了 Scoped 服務，該元件的所有子元件都會共享同一個實例。
  如果子元件也在自己的 providers 中提供了同一個服務，它會建立一個新實例並「遮蔽」父元件的版本。
  這可能導致意外的狀態不一致，必須仔細設計。
</p>
      `,
      codeExamples: [
        {
          filename: 'scoped-form-state.ts',
          language: 'typescript',
          code: `import { Injectable, signal, computed } from '@angular/core';

// No providedIn — must be provided at component level
@Injectable()
export class FormState {
  private readonly _dirty = signal(false);
  private readonly _errors = signal<readonly string[]>([]);

  readonly dirty = this._dirty.asReadonly();
  readonly errors = this._errors.asReadonly();
  readonly valid = computed(() => this._errors().length === 0);

  markDirty(): void {
    this._dirty.set(true);
  }

  setErrors(errors: readonly string[]): void {
    this._errors.set(errors);
  }

  reset(): void {
    this._dirty.set(false);
    this._errors.set([]);
  }
}

// Usage: each form component provides its own FormState
// @Component({
//   selector: 'app-edit-user',
//   providers: [FormState],  // Scoped instance
//   ...
// })
// export class EditUser {
//   protected readonly formState = inject(FormState);
// }`,
          annotation: 'Scoped service pattern: each component instance gets an isolated FormState.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '作用域的選擇原則：大多數服務用 Singleton（<code>providedIn: \'root\'</code>）。只有當元件需要獨立隔離的狀態時，才使用 Scoped（元件 <code>providers</code>）。Transient 模式在 Angular 中極為罕見。' },
        { type: 'dotnet-comparison', content: '三種作用域直接對應 .NET DI 的三種生命週期：<code>AddSingleton</code>、<code>AddScoped</code>、<code>AddTransient</code>。在 Angular 中，Scoped 的「範圍」是元件實例（而非 HTTP 請求如 .NET）。' },
      ],
    },

    // ─── Section 8b: Injector Resolution Algorithm (Deep-dive) ───
    {
      id: 'injector-resolution-algorithm',
      title: 'Injector 解析演算法（框架內部）',
      content: `
<p>當 Angular 遇到 <code>inject(MyService)</code> 呼叫時，解析器會按照以下<strong>由內而外</strong>的順序搜尋 Provider：</p>
<ol>
<li><strong>Node Injector</strong> — 當前元件的 <code>providers</code> 或 <code>viewProviders</code> 陣列</li>
<li><strong>Element Injector 鏈</strong> — 沿 DOM 樹向上走訪父元件的 Element Injector</li>
<li><strong>Environment Injector</strong> (Module Injector) — <code>providedIn: 'root'</code> 或 Route 的 <code>providers</code></li>
<li><strong>Platform Injector</strong> — 由 <code>bootstrapApplication()</code> 提供的平台級服務</li>
<li><strong>Null Injector</strong> — 若仍找不到，拋出 <code>NullInjectorError</code>（除非標記為 <code>optional</code>）</li>
</ol>
<p><strong>Resolution Modifiers</strong> 會改變查找路徑：</p>
<table>
<tr><th>修飾符</th><th>行為</th></tr>
<tr><td><code>@Self()</code></td><td>只查找當前 Node Injector，不向上走訪</td></tr>
<tr><td><code>@SkipSelf()</code></td><td>跳過當前 Node，從父元件開始查找</td></tr>
<tr><td><code>@Host()</code></td><td>查找到 Host Element 為止（不穿越 ng-content 邊界）</td></tr>
<tr><td><code>@Optional()</code></td><td>找不到時回傳 <code>null</code>，不拋出錯誤</td></tr>
</table>
<p>在 <strong>Standalone 模式</strong>下，Node Injector 和 Environment Injector 是兩條獨立的查找鏈。Route 的 <code>providers</code> 建立 child EnvironmentInjector，為 lazy-loaded feature 提供隔離的注入作用域。</p>`,
      diagrams: [
        {
          id: 'injector-chain',
          caption: 'Injector 查找鏈 — 由 Node 到 Platform',
          content: `inject(MyService) called in ChildComponent
│
├─ 1. Node Injector (ChildComponent.providers)  → NOT FOUND
│
├─ 2. Element Injector (ParentComponent.providers) → NOT FOUND
│
├─ 3. Element Injector (AppComponent.providers) → NOT FOUND
│
├─ 4. Environment Injector (Root)
│     └─ @Injectable({providedIn:'root'})        → FOUND ✓
│
├─ 5. Platform Injector
│
└─ 6. Null Injector → throw NullInjectorError`
        },
      ],
      tips: [
        { type: 'dotnet-comparison', content: '.NET DI 使用 <code>IServiceCollection</code> 加入服務，解析時由 <code>IServiceProvider</code> 依 Scope 查找。Angular 的 Injector 階層類似 .NET 的 Scoped lifetime，但更細粒度——每個元件都可以是一個 scope 邊界。' },
        { type: 'best-practice', content: '絕大多數服務應使用 <code>providedIn: \'root\'</code>（等同 .NET Singleton）。僅在需要元件級隔離時才使用 <code>providers: [MyService]</code>（等同 .NET Transient/Scoped）。' },
      ],
    },

    // ─── Section 9: DI Pitfalls ───
    {
      id: 'di-pitfalls',
      title: '常見陷阱',
      content: `
<p>
  依賴注入是 Angular 最強大也最容易出錯的機制之一。
  以下是 8 個最常見的 DI 陷阱及其解決方案：
</p>
<ol>
  <li>
    <strong>忘記 <code>@Injectable()</code>：</strong>服務類別沒有加上裝飾器，導致 DI 無法解析其依賴。
    Angular 編譯器會報 <code>NG0203</code> 或建構函式參數無法解析的錯誤。
    修正：所有服務都加上 <code>@Injectable({ providedIn: 'root' })</code>。
  </li>
  <li>
    <strong>循環依賴（Circular Dependency）：</strong>Service A 注入 B，B 又注入 A。
    修正：引入中間 Service C 打破循環，或使用事件機制解耦。
  </li>
  <li>
    <strong>在注入上下文外呼叫 inject()：</strong>在 <code>ngOnInit</code> 或 <code>setTimeout</code> 中使用 <code>inject()</code>。
    修正：在欄位初始化器或 constructor 中呼叫，將結果存為屬性。
  </li>
  <li>
    <strong>Multi-provider 忘記 <code>multi: true</code>：</strong>後面的 provider 覆蓋前面的。
    修正：確保所有同 token 的 provider 都加上 <code>multi: true</code>。
  </li>
  <li>
    <strong>意外建立多個 Singleton 實例：</strong>在元件 providers 中重新提供了 <code>providedIn: 'root'</code> 的服務。
    修正：root 級服務不要在元件 providers 中重複提供。
  </li>
  <li>
    <strong>混用 class-based 和 functional DI：</strong>在同一個攔截器 / guard 中混合兩種風格。
    修正：新程式碼統一使用 functional 風格。
  </li>
  <li>
    <strong>InjectionToken 缺乏泛型參數：</strong>使用 <code>new InjectionToken('name')</code> 而非 <code>new InjectionToken&lt;Type&gt;('name')</code>。
    修正：永遠為 InjectionToken 提供泛型參數以確保型別安全。
  </li>
  <li>
    <strong>元件級 Service 的記憶體洩漏：</strong>在元件 providers 中提供的 Service 訂閱了 root 級 Observable 卻未取消訂閱。
    修正：在 Service 中使用 <code>DestroyRef</code> + <code>takeUntilDestroyed()</code>。
  </li>
</ol>
      `,
      codeExamples: [
        {
          filename: 'di-pitfall-circular.ts',
          language: 'typescript',
          code: `import { Injectable, inject } from '@angular/core';

// ❌ Circular dependency — A injects B, B injects A
// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private readonly userService = inject(UserService); // needs UserService
// }
//
// @Injectable({ providedIn: 'root' })
// export class UserService {
//   private readonly authService = inject(AuthService); // needs AuthService
// }

// ✅ Solution — introduce a mediator or use events
@Injectable({ providedIn: 'root' })
export class AuthState {
  // Shared state that both services can read
  private readonly _token = signal<string | null>(null);
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);

  setToken(token: string | null): void {
    this._token.set(token);
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authState = inject(AuthState);
  // No dependency on UserService
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly authState = inject(AuthState);
  // No dependency on AuthService — reads shared state instead
}`,
          annotation: 'Breaking circular DI dependencies by introducing shared state.',
        },
        {
          filename: 'di-pitfall-context.ts',
          language: 'typescript',
          code: `import { Component, inject, Injector, runInInjectionContext } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-lazy-loader',
  template: \`<button (click)="loadLazy()">Load</button>\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyLoader {
  // ✅ Save the injector for later use outside injection context
  private readonly injector = inject(Injector);

  loadLazy(): void {
    // ❌ This would throw NG0203:
    // const svc = inject(UserService);

    // ✅ Use runInInjectionContext for dynamic injection
    runInInjectionContext(this.injector, () => {
      const svc = inject(UserService);
      console.log('Dynamically injected:', svc);
    });
  }
}`,
          annotation: 'Using runInInjectionContext for dynamic injection outside the standard injection context.',
        },
      ],
      tips: [
        { type: 'warning', content: '循環依賴是 DI 中最難除錯的問題。如果你看到 <code>NG0200: Circular dependency</code>，立即重新審視架構——通常需要抽離共享狀態或引入中介者模式。' },
        { type: 'best-practice', content: '建立一個 DI 架構圖（即使是簡單的依賴關係清單），在 Code Review 時確認沒有循環依賴或意外的作用域問題。' },
        { type: 'tip', content: '善用 Angular DevTools 的 Injector Tree 面板——它可以視覺化顯示注入器層級和每個注入器提供的服務，幫助快速定位 DI 問題。' },
      ],
    },
  ],
};

@Component({
  selector: 'app-ch02',
  imports: [GuidePage],
  template: '<app-guide-page [chapter]="chapter" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ch02DependencyInjection {
  protected readonly chapter = CHAPTER;
}
