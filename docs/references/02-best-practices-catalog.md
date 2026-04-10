# Angular 社群最佳實踐彙整

> **目標讀者**：具備 .NET/C# 後端開發經驗，正在轉型至 Angular 前端開發的工程師。
> **Angular 版本**：19+ (Standalone、Signals、OnPush、Zoneless)
> **最後更新**：2026-04-09

---

## 目錄

- [Standalone 元件遷移策略](#1-standalone-元件遷移策略)
- [Signal-first 開發模式](#2-signal-first-開發模式)
- [智慧/展示元件模式 (Smart/Dumb)](#3-智慧展示元件模式-smartdumb)
- [Facade 服務模式](#4-facade-服務模式)
- [狀態管理選擇矩陣](#5-狀態管理選擇矩陣)
- [OnPush 變更偵測最佳實踐](#6-onpush-變更偵測最佳實踐)
- [Zoneless 變更偵測遷移](#7-zoneless-變更偵測遷移)
- [延遲載入策略](#8-延遲載入策略)
- [錯誤處理模式](#9-錯誤處理模式)
- [安全性防護 (XSS, CSRF, CSP)](#10-安全性防護-xss-csrf-csp)
- [RxJS 與 Signals 互操作](#11-rxjs-與-signals-互操作)
- [自訂指令與 Pipe 設計](#12-自訂指令與-pipe-設計)
- [國際化 (i18n) 策略](#13-國際化-i18n-策略)
- [效能預算與監控](#14-效能預算與監控)
- [可存取性 (Accessibility) 實踐](#15-可存取性-accessibility-實踐)

---

## 1. Standalone 元件遷移策略

### 問題描述

Angular v19 之前的專案使用 NgModule 組織元件，導致模組之間的耦合度高、延遲載入粒度受限、且新開發者需要理解複雜的模組依賴關係。對於 .NET 開發者而言，這類似於從 ASP.NET Web Forms 的 `Global.asax` 遷移到 ASP.NET Core 的 Minimal API。

### 推薦作法

**逐步遷移，從葉節點元件開始**：

```typescript
// Step 1: Convert leaf components first (no children)
// Before (NgModule-based)
@NgModule({
  declarations: [UserCardComponent],
  imports: [CommonModule, MatCardModule],
  exports: [UserCardComponent],
})
export class UserCardModule {}

// After (Standalone)
@Component({
  selector: 'app-user-card',
  imports: [MatCardModule],
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCard {}
// No module needed. Component imports its own dependencies.
```

**遷移步驟**：

1. 使用 `ng generate @angular/core:standalone` 自動遷移 schematics
2. 從沒有子元件的葉節點開始
3. 將 `CommonModule` 的功能替換為原生控制流（`@if`/`@for`/`@switch`）
4. 移除空的 NgModule 檔案
5. 更新路由配置使用 `loadComponent` 取代 `loadChildren`
6. 啟用 `strictStandalone` 編譯器選項防止回退

### 常見陷阱

- **不要一次遷移所有檔案**：大規模變更難以 Review 且容易引入 Bug
- **不要忘記移除 `standalone: true`**：v19+ 這是預設值，顯式宣告是多餘的
- **不要忽略 `imports` 陣列**：Standalone 元件必須自行宣告所有依賴

---

## 2. Signal-first 開發模式

### 問題描述

傳統 Angular 開發大量依賴 RxJS Observable，學習曲線陡峭（尤其對後端開發者），且容易因忘記取消訂閱而造成記憶體洩漏。對於 .NET 開發者，RxJS 的學習障礙類似於初次接觸 Rx.NET 的 `IObservable<T>` 管線。

### 推薦作法

**以 Signal 為預設，RxJS 為補充**：

```typescript
@Injectable({ providedIn: 'root' })
export class TodoStore {
  // Private writable state
  private readonly _todos = signal<Todo[]>([]);
  private readonly _filter = signal<TodoFilter>('all');

  // Public read-only signals
  readonly todos = this._todos.asReadonly();
  readonly filter = this._filter.asReadonly();

  // Computed (derived) state — auto-memoized
  readonly filteredTodos = computed(() => {
    const todos = this._todos();
    const filter = this._filter();
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default: return todos;
    }
  });

  readonly activeCount = computed(() =>
    this._todos().filter(t => !t.completed).length
  );

  // Actions
  addTodo(title: string): void {
    this._todos.update(todos => [
      ...todos,
      { id: crypto.randomUUID(), title, completed: false },
    ]);
  }

  toggleTodo(id: string): void {
    this._todos.update(todos =>
      todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }

  setFilter(filter: TodoFilter): void {
    this._filter.set(filter);
  }
}
```

**元件消費**：

```typescript
@Component({
  selector: 'app-todo-list',
  template: `
    <h2>Todos ({{ store.activeCount() }} active)</h2>
    @for (todo of store.filteredTodos(); track todo.id) {
      <app-todo-item
        [todo]="todo"
        (toggle)="store.toggleTodo(todo.id)" />
    } @empty {
      <p>No todos found.</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoList {
  protected readonly store = inject(TodoStore);
}
```

### Signal 使用決策表

| 場景 | 使用 | 原因 |
|------|------|------|
| 元件內部狀態 | `signal()` | 簡單直覺，自動追蹤 |
| 衍生計算值 | `computed()` | 惰性求值，自動記憶化 |
| 跨元件共享狀態 | Service + `signal()` | 單一資料來源，自動傳播 |
| API 資料載入 | `resource()` | 內建 loading/error 狀態管理 |
| 副作用（localStorage、日誌） | `effect()` | 自動追蹤依賴，避免手動訂閱 |
| 使用者可覆寫的衍生狀態 | `linkedSignal()` | 來源變更時重算，但允許手動覆寫 |
| 複雜事件流（WebSocket） | RxJS `Observable` | 需要 `switchMap`、`debounceTime` 等運算子 |

### 常見陷阱

- **不要用 `effect()` 同步 Signal**：用 `computed()` 或 `linkedSignal()` 取代
- **不要在 `effect()` 中寫入 Signal**：這會造成循環依賴
- **不要就地修改陣列/物件**：必須回傳新參考（`[...array, newItem]`）

---

## 3. 智慧/展示元件模式 (Smart/Dumb)

### 問題描述

當元件同時負責資料載入、業務邏輯與 UI 渲染時，會造成程式碼重用困難、測試複雜度高、關注點混淆。這在 .NET 世界中等同於 Controller 同時處理資料庫查詢、業務規則與 View 渲染。

### 推薦作法

**分離關注點**：

```typescript
// Smart Component (Container) — handles data and logic
@Component({
  selector: 'app-order-page',
  imports: [OrderList, OrderSummary],
  template: `
    @if (orders.isLoading()) {
      <app-loading-spinner />
    } @else if (orders.error()) {
      <app-error-message [error]="orders.error()!" />
    } @else {
      <app-order-list
        [orders]="orders.value() ?? []"
        (orderSelected)="onOrderSelected($event)" />
      <app-order-summary
        [selectedOrder]="selectedOrder()" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPage {
  private readonly orderService = inject(OrderService);

  // Data loading
  protected readonly orders = resource({
    loader: async () => this.orderService.getOrders(),
  });

  protected readonly selectedOrder = signal<Order | null>(null);

  protected onOrderSelected(order: Order): void {
    this.selectedOrder.set(order);
  }
}

// Dumb Component (Presentational) — pure UI rendering
@Component({
  selector: 'app-order-list',
  template: `
    <ul role="list">
      @for (order of orders(); track order.id) {
        <li>
          <button (click)="orderSelected.emit(order)">
            #{{ order.id }} - {{ order.total | currency }}
          </button>
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderList {
  readonly orders = input.required<Order[]>();
  readonly orderSelected = output<Order>();
}
```

### 辨別規則

| 特徵 | Smart Component | Dumb Component |
|------|----------------|----------------|
| 注入服務 | 是 | 否 |
| 管理狀態 | 是 | 否 |
| 使用 `input()`/`output()` | 少 | 多 |
| 路由綁定 | 通常是 | 通常否 |
| 可重用性 | 低（業務專用） | 高（通用 UI） |
| 測試方式 | 整合測試 | 單元測試（純輸入/輸出） |

### 常見陷阱

- **不要在 Dumb Component 中注入服務**：如果需要服務，它可能應該是 Smart Component
- **不要過度拆分**：簡單的頁面不需要拆成 Smart/Dumb
- **不要讓 Dumb Component 持有狀態**：所有資料都應透過 `input()` 傳入

---

## 4. Facade 服務模式

### 問題描述

當元件直接依賴多個服務（API 服務、狀態服務、通知服務等）時，元件變得臃腫且難以測試。這類似 .NET 中 Controller 直接依賴多個 Repository 的問題。

### 推薦作法

```typescript
// API layer — only handles HTTP communication
@Injectable({ providedIn: 'root' })
export class ProductApi {
  private readonly http = inject(HttpClient);

  getProducts(params: ProductQueryParams): Observable<Page<Product>> {
    return this.http.get<Page<Product>>('/api/products', { params: { ...params } });
  }

  createProduct(dto: CreateProductDto): Observable<Product> {
    return this.http.post<Product>('/api/products', dto);
  }
}

// State layer — manages reactive state
@Injectable({ providedIn: 'root' })
export class ProductState {
  private readonly _products = signal<Product[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly products = this._products.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  setProducts(products: Product[]): void { this._products.set(products); }
  setLoading(loading: boolean): void { this._loading.set(loading); }
  setError(error: string | null): void { this._error.set(error); }
}

// Facade — orchestrates API and state (equivalent to .NET Application Service)
@Injectable({ providedIn: 'root' })
export class ProductFacade {
  private readonly api = inject(ProductApi);
  private readonly state = inject(ProductState);
  private readonly snackBar = inject(MatSnackBar);

  // Expose state as read-only signals
  readonly products = this.state.products;
  readonly loading = this.state.loading;
  readonly error = this.state.error;

  loadProducts(params: ProductQueryParams): void {
    this.state.setLoading(true);
    this.state.setError(null);

    this.api.getProducts(params).pipe(
      finalize(() => this.state.setLoading(false)),
    ).subscribe({
      next: (page) => this.state.setProducts(page.items),
      error: (err) => {
        this.state.setError('Failed to load products');
        this.snackBar.open('Failed to load products', 'Retry', {
          duration: 5000,
        });
      },
    });
  }

  async createProduct(dto: CreateProductDto): Promise<void> {
    this.state.setLoading(true);
    try {
      const product = await firstValueFrom(this.api.createProduct(dto));
      this.state.setProducts([...this.state.products(), product]);
      this.snackBar.open('Product created', 'Close');
    } catch (err) {
      this.state.setError('Failed to create product');
    } finally {
      this.state.setLoading(false);
    }
  }
}

// Component — only depends on facade
@Component({ ... })
export class ProductList {
  protected readonly facade = inject(ProductFacade);
}
```

### 常見陷阱

- **不要讓 Facade 變成 God Class**：每個功能區域一個 Facade
- **不要在 API 層加入業務邏輯**：API 層只負責 HTTP 通訊
- **不要跳過 Facade 直接存取 State**：維持單向資料流

---

## 5. 狀態管理選擇矩陣

### 問題描述

Angular 生態系有多種狀態管理方案，從輕量的 Signals 到重量級的 NgRx Store。選擇不當會導致過度工程化（小專案用 NgRx）或架構不足（大專案只用 Service）。

### 選擇矩陣

| 維度 | Service + Signals | NgRx Signal State | NgRx Signal Store | NgRx Store (Redux) |
|------|------------------|-------------------|-------------------|-------------------|
| **專案規模** | 小型/中型 | 中型 | 中型/大型 | 大型/企業級 |
| **團隊規模** | 1-3 人 | 2-5 人 | 3-10 人 | 5+ 人 |
| **學習曲線** | 低 | 低-中 | 中 | 高 |
| **樣板程式碼** | 最少 | 少 | 中 | 多（Actions/Reducers/Effects） |
| **可預測性** | 中 | 高 | 高 | 最高 |
| **DevTools 支援** | 無 | 有限 | 完整 | 完整（Redux DevTools） |
| **時間旅行除錯** | 否 | 否 | 否 | 是 |
| **外部依賴** | 無 | @ngrx/signals | @ngrx/signals | @ngrx/store + effects |
| **.NET 類比** | Simple DI Service | Mediator Pattern | CQRS (simplified) | Full CQRS + Event Sourcing |

### 推薦決策流程

```
新專案？
├── 元件級狀態 → signal() + computed()
├── 跨元件共享（< 5 個 signal） → Service + signal()
├── 複雜領域（多個 entity） → NgRx Signal Store
└── 企業級（時間旅行除錯、嚴格規範） → NgRx Store
```

### 程式碼範例：NgRx Signal Store

```typescript
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';

interface ProductState {
  products: Product[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedId: null,
  loading: false,
  error: null,
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    selectedProduct: computed(() =>
      store.products().find(p => p.id === store.selectedId())
    ),
    productCount: computed(() => store.products().length),
  })),
  withMethods((store, productApi = inject(ProductApi)) => ({
    async loadProducts(): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const products = await firstValueFrom(productApi.getProducts());
        patchState(store, { products, loading: false });
      } catch {
        patchState(store, { error: 'Load failed', loading: false });
      }
    },
    selectProduct(id: string): void {
      patchState(store, { selectedId: id });
    },
  }))
);
```

### 常見陷阱

- **不要為小專案引入 NgRx Store**：Signal + Service 就夠了
- **不要混用多種狀態管理方案**：在同一個功能區域中只用一種
- **不要忽略 DevTools**：複雜狀態需要可視化除錯工具

---

## 6. OnPush 變更偵測最佳實踐

### 問題描述

Angular 預設的變更偵測策略（Default）會在每個非同步事件後檢查整個元件樹，這在大型應用中會造成嚴重的效能問題。等同於 .NET 中每次 HTTP 請求都重新渲染整個頁面。

### 推薦作法

**所有元件都應使用 OnPush**：

```typescript
@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush, // MANDATORY
  template: `
    <h1>{{ title() }}</h1>
    @for (widget of widgets(); track widget.id) {
      <app-widget [data]="widget" />
    }
  `,
})
export class Dashboard {
  protected readonly title = signal('Dashboard');
  protected readonly widgets = signal<Widget[]>([]);
}
```

### OnPush 觸發條件

OnPush 元件只在以下情況被檢查：

1. **Input 參考變更**：`input()` 接收到新的物件參考
2. **Signal 值變更**：模板中讀取的 Signal 發出新值
3. **事件觸發**：該元件或其子元件觸發 DOM 事件
4. **手動標記**：呼叫 `ChangeDetectorRef.markForCheck()`
5. **Async pipe**：Observable 發出新值（透過 async pipe）

### 常見陷阱與修正

```typescript
// WRONG: Mutating an array in-place — OnPush won't detect
this.items.push(newItem); // Same reference, no change detection

// CORRECT: Create new reference
this.items = [...this.items, newItem];

// BETTER: Use signals (automatic with OnPush)
this.items.update(list => [...list, newItem]);

// WRONG: Mutating object property
this.user.name = 'New Name'; // Same reference

// CORRECT: Create new object
this.user = { ...this.user, name: 'New Name' };

// BETTER: Use signals
this.user.update(u => ({ ...u, name: 'New Name' }));
```

---

## 7. Zoneless 變更偵測遷移

### 問題描述

Zone.js 是 Angular 傳統的變更偵測觸發機制，它 Monkey-patch 所有瀏覽器非同步 API（setTimeout、Promise、addEventListener 等）。這帶來約 33KB 的 Bundle 大小開銷，以及不必要的變更偵測觸發。Angular v21 起，新專案預設不再包含 Zone.js。

### 推薦作法

```typescript
// app.config.ts — Enable zoneless change detection
import { provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), // Replaces zone.js
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
```

### 遷移檢查清單

| 步驟 | 操作 | 說明 |
|------|------|------|
| 1 | 全部元件設為 OnPush | Zoneless 要求所有元件使用 OnPush |
| 2 | 將可變屬性轉為 Signals | `count: number` → `count = signal(0)` |
| 3 | 移除 `zone.js` import | 從 `polyfills` 中移除 |
| 4 | 替換 `provideZoneChangeDetection()` | 改用 `provideZonelessChangeDetection()` |
| 5 | 審查 `setTimeout`/`setInterval` | 改用 `afterRenderEffect()` 或 Signal |
| 6 | 測試所有非同步操作 | 確認 UI 正確更新 |

### 效能影響

根據社群基準測試：

- **Bundle 大小**：減少約 33KB（gzip 後約 11KB）
- **渲染效能**：提升 30-40%
- **記憶體使用**：減少 15-20%
- **初始載入**：減少 Zone.js 初始化時間

### 常見陷阱

- **不要在未轉為 OnPush 前切換 Zoneless**：會造成 UI 不更新
- **不要依賴 setTimeout 觸發變更偵測**：Zoneless 模式下 setTimeout 不再觸發偵測
- **不要忘記第三方庫的相容性**：某些庫可能依賴 Zone.js

---

## 8. 延遲載入策略

### 問題描述

單頁應用的初始載入效能直接影響使用者體驗。將所有程式碼打包在一起會導致巨大的初始 Bundle。這等同於 .NET 中將所有 DLL 在啟動時全部載入 AppDomain。

### 推薦作法

**多層級延遲載入**：

```typescript
// Level 1: Route-level lazy loading (most common)
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [authGuard, adminGuard],
  },
];

// Level 2: Template-level deferred loading (@defer)
@Component({
  template: `
    <h1>Dashboard</h1>

    @defer (on viewport) {
      <app-heavy-chart [data]="chartData()" />
    } @placeholder {
      <div class="skeleton-chart"></div>
    } @loading (minimum 300ms) {
      <app-loading-spinner />
    } @error {
      <p>Failed to load chart</p>
    }
  `,
})
export class Dashboard {}

// Level 3: Programmatic lazy loading
export class ReportPage {
  private readonly injector = inject(Injector);

  async loadPdfViewer(): Promise<void> {
    const { PdfViewer } = await import('./pdf-viewer/pdf-viewer');
    const viewContainerRef = this.container();
    viewContainerRef.clear();
    viewContainerRef.createComponent(PdfViewer, { injector: this.injector });
  }
}
```

### `@defer` 觸發條件

| 觸發器 | 語法 | 說明 |
|--------|------|------|
| Viewport | `@defer (on viewport)` | 元素進入可視區域時載入 |
| Idle | `@defer (on idle)` | 瀏覽器閒置時載入 |
| Interaction | `@defer (on interaction)` | 使用者互動時載入（點擊、焦點） |
| Hover | `@defer (on hover)` | 滑鼠懸停時載入 |
| Timer | `@defer (on timer(3s))` | 指定時間後載入 |
| Immediate | `@defer (on immediate)` | 父元件渲染後立即載入 |
| Condition | `@defer (when condition())` | Signal/表達式為 true 時載入 |

### 常見陷阱

- **不要延遲載入首屏內容**：Above-the-fold 內容應該在初始 Bundle 中
- **不要忘記 `@placeholder`**：提供載入中的骨架畫面，避免版面跳動
- **不要過度拆分**：每個延遲載入都有網路請求開銷，太細粒度反而降低效能

---

## 9. 錯誤處理模式

### 問題描述

前端錯誤處理常被忽視，導致使用者看到空白頁面或未預期的行為。後端開發者習慣的 try-catch + 日誌模式在前端需要適應不同的架構。

### 推薦作法

**分層錯誤處理**：

```typescript
// Layer 1: Global error handler (equivalent to .NET ExceptionHandler middleware)
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(LoggingService);
  private readonly snackBar = inject(MatSnackBar);

  handleError(error: unknown): void {
    // Log to monitoring service
    this.logger.error('Unhandled error', error);

    // Show user-friendly message
    if (error instanceof HttpErrorResponse) {
      this.snackBar.open('Network error, please try again', 'Close');
    } else {
      this.snackBar.open('An unexpected error occurred', 'Close');
    }

    // Re-throw in development for debugging
    if (!environment.production) {
      console.error(error);
    }
  }
}

// Register in app.config.ts
providers: [
  { provide: ErrorHandler, useClass: GlobalErrorHandler },
]

// Layer 2: HTTP interceptor (equivalent to .NET DelegatingHandler)
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: 2,
      delay: (error, retryCount) => {
        // Only retry on server errors and network errors
        if (error.status >= 500 || error.status === 0) {
          return timer(1000 * retryCount); // Exponential backoff
        }
        return throwError(() => error);
      },
    }),
    catchError((error: HttpErrorResponse) => {
      // Transform to application-specific error
      const appError: AppError = {
        code: error.status,
        message: getErrorMessage(error),
        timestamp: new Date(),
        url: req.url,
      };
      return throwError(() => appError);
    })
  );
};

// Layer 3: Component-level (using resource())
export class ProductDetail {
  readonly product = resource({
    request: () => ({ id: this.productId() }),
    loader: async ({ request }) => {
      const response = await fetch(`/api/products/${request.id}`);
      if (!response.ok) {
        throw new Error(`Product not found: ${request.id}`);
      }
      return response.json() as Promise<Product>;
    },
  });
}

// In template:
// @if (product.error()) {
//   <app-error-panel [error]="product.error()!" (retry)="product.reload()" />
// }
```

### 常見陷阱

- **不要吞掉錯誤**：始終記錄錯誤到監控服務
- **不要向使用者顯示技術細節**：轉換為使用者友善的訊息
- **不要忘記 retry 策略**：網路錯誤應該自動重試（有上限）

---

## 10. 安全性防護 (XSS, CSRF, CSP)

### 問題描述

前端應用面臨多種安全威脅，最常見的是 XSS（跨站腳本攻擊）、CSRF（跨站請求偽造）與不當的 CSP 配置。對於 .NET 開發者，這些概念相同，但防護機制在前端框架中有不同的實作方式。

### XSS 防護

```typescript
// Angular's default protection: All template bindings are sanitized
// This is SAFE — Angular escapes the HTML
template: `<div>{{ userInput() }}</div>`
// Input: <script>alert('XSS')</script>
// Output: &lt;script&gt;alert('XSS')&lt;/script&gt;

// DANGEROUS: Bypassing sanitization
// Only use when you have verified the content is safe
@Component({
  template: `<div [innerHTML]="trustedHtml()"></div>`,
})
export class RichContent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly rawHtml = input.required<string>();

  // Angular sanitizes innerHTML by default,
  // but using bypassSecurityTrust* skips this protection
  protected readonly trustedHtml = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.rawHtml())
  );
  // WARNING: Only bypass when content comes from a trusted source (e.g., your CMS)
}
```

### CSP 配置

```typescript
// angular.json — Enable automatic CSP nonce injection
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "options": {
            "security": {
              "autoCsp": true  // Angular 17+ automatic CSP
            }
          }
        }
      }
    }
  }
}
```

推薦的 HTTP 回應標頭（由後端設定）：

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM}';
  style-src 'self' 'nonce-{RANDOM}';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

### CSRF/XSRF 保護

```typescript
// HttpClient automatically handles XSRF
// Backend sets cookie: XSRF-TOKEN
// HttpClient reads cookie and sets header: X-XSRF-TOKEN

// Custom configuration:
provideHttpClient(
  withXsrfConfiguration({
    cookieName: 'CSRF-TOKEN',       // Cookie name to read
    headerName: 'X-CSRF-TOKEN',     // Header name to set
  })
)
```

### Trusted Types

```typescript
// Enable Trusted Types via HTTP header:
// Content-Security-Policy: trusted-types angular angular#unsafe-bypass;
//                          require-trusted-types-for 'script';

// Angular's built-in policies:
// - 'angular': Core framework operations
// - 'angular#unsafe-bypass': bypassSecurityTrust* methods
// - 'angular#bundler': Lazy-loaded chunks
```

### 安全性檢查清單

| 項目 | 檢查 | 對應 .NET |
|------|------|----------|
| XSS | 使用模板繫結而非直接 DOM 操作 | Output Encoding |
| CSRF | 確認 HttpClient XSRF 配置正確 | Antiforgery Token |
| CSP | 設定 `autoCsp: true` 並配置標頭 | CSP Middleware |
| Trusted Types | 啟用並限制允許的策略 | — |
| 依賴審計 | 定期執行 `npm audit` | `dotnet list package --vulnerable` |
| AOT 編譯 | 生產環境使用 AOT（預設） | Ahead-of-time compilation |
| 路由守衛 | 敏感路由設定 `canActivate` | `[Authorize]` |

### 常見陷阱

- **不要使用 `bypassSecurityTrust*` 處理使用者輸入**：只用於已驗證的可信內容
- **不要在 CSP 中使用 `'unsafe-inline'` 或 `'unsafe-eval'`**：這會使 CSP 失效
- **不要忽略第三方套件的安全漏洞**：定期執行 `npm audit fix`

---

## 11. RxJS 與 Signals 互操作

### 問題描述

既有程式碼大量使用 RxJS Observable，但新開發應以 Signal 為主。需要在兩個響應式系統之間平滑轉換。

### 推薦作法

```typescript
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

// Observable → Signal (most common direction)
export class SearchResult {
  private readonly route = inject(ActivatedRoute);
  private readonly searchService = inject(SearchService);

  // Route params as signal
  readonly query = toSignal(
    this.route.queryParamMap.pipe(
      map(params => params.get('q') ?? '')
    ),
    { initialValue: '' }
  );

  // API results as signal via resource()
  readonly results = resource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) =>
      firstValueFrom(this.searchService.search(request.query)),
  });
}

// Signal → Observable (for complex async pipelines)
export class AutoComplete {
  readonly searchTerm = signal('');

  readonly suggestions = toSignal(
    toObservable(this.searchTerm).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      switchMap(term => this.api.getSuggestions(term)),
    ),
    { initialValue: [] }
  );
}
```

### 常見陷阱

- **`toSignal()` 必須在注入上下文中呼叫**：通常在類別欄位初始化時使用
- **`toSignal()` 會自動訂閱並取消訂閱**：不需要手動管理生命週期
- **提供 `initialValue`**：避免 Signal 值為 `undefined`

---

## 12. 自訂指令與 Pipe 設計

### 推薦作法

```typescript
// Custom directive: Intersection Observer for lazy loading
@Directive({
  selector: '[appInView]',
  host: {
    '(intersection)': 'onIntersection($event)',
  },
})
export class InView {
  private readonly elementRef = inject(ElementRef);
  readonly inView = output<boolean>();

  private readonly observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => this.inView.emit(entry.isIntersecting));
    },
    { threshold: 0.1 }
  );

  constructor() {
    this.observer.observe(this.elementRef.nativeElement);
    inject(DestroyRef).onDestroy(() => this.observer.disconnect());
  }
}

// Custom pipe: Relative time (e.g., "3 minutes ago")
@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date | string): string {
    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hr ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  }
}
```

---

## 13. 國際化 (i18n) 策略

### 推薦作法

Angular 內建 i18n 使用編譯時期翻譯，每個語言產生獨立的 Bundle：

```html
<!-- Mark text for translation -->
<h1 i18n="site header|Main welcome message">Welcome to our app</h1>

<!-- ICU expressions for pluralization -->
<span i18n>
  {count, plural,
    =0 {No items}
    =1 {One item}
    other {{{count}} items}
  }
</span>
```

### 常見陷阱

- **不要在執行時期切換語言**：Angular i18n 是編譯時期方案，切換語言需要重新載入應用
- **需要執行時期切換**：考慮使用 `@ngx-translate/core` 或 Transloco

---

## 14. 效能預算與監控

### 推薦作法

```json
// angular.json — Set performance budgets
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kB",
      "maximumError": "1MB"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "4kB",
      "maximumError": "8kB"
    }
  ]
}
```

### 效能監控指標

| 指標 | 目標值 | 量測方式 |
|------|--------|---------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse / Web Vitals |
| FID (First Input Delay) | < 100ms | Web Vitals |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| Initial Bundle | < 500KB | `ng build --stats-json` |
| TTI (Time to Interactive) | < 3.5s | Lighthouse |

### 常見陷阱

- **不要忽略 Bundle 分析**：使用 `source-map-explorer` 或 `webpack-bundle-analyzer`
- **不要在全域引入大型第三方庫**：使用 tree-shakable imports
- **不要跳過圖片優化**：使用 `NgOptimizedImage` 指令

---

## 15. 可存取性 (Accessibility) 實踐

### 推薦作法

```typescript
// Use semantic HTML and ARIA attributes
@Component({
  selector: 'app-nav-menu',
  template: `
    <nav aria-label="Main navigation">
      <ul role="menubar">
        @for (item of menuItems(); track item.path) {
          <li role="none">
            <a
              [routerLink]="item.path"
              routerLinkActive="active"
              role="menuitem"
              [attr.aria-current]="isActive(item) ? 'page' : null">
              {{ item.label }}
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
  host: {
    '(keydown)': 'onKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenu {
  readonly menuItems = input.required<MenuItem[]>();

  protected onKeydown(event: KeyboardEvent): void {
    // Arrow key navigation between menu items
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      // Move focus to next/previous item
    }
  }
}
```

### 檢查清單

| 項目 | 要求 |
|------|------|
| 焦點管理 | 路由切換後將焦點移至主要內容區 |
| 色彩對比 | 符合 WCAG AA 標準（4.5:1 文字、3:1 大文字） |
| 鍵盤導覽 | 所有互動元素可透過鍵盤操作 |
| ARIA 標籤 | 非文字元素必須有 `aria-label` 或 `aria-labelledby` |
| 替代文字 | 使用 `NgOptimizedImage` 並提供 `alt` 屬性 |
| 動態內容 | 使用 `aria-live` 通知螢幕閱讀器 |
| 表單 | 每個輸入欄位關聯 `<label>` 或 `aria-label` |

### 常見陷阱

- **不要移除框架生成的 ARIA 屬性**：Angular Material 元件自帶 a11y 支援
- **不要只依賴顏色傳達資訊**：同時使用圖示或文字
- **不要忘記測試**：使用 axe-core 或 Lighthouse 的 a11y 審計

---

> **下一步**：閱讀 [03-enterprise-patterns.md](./03-enterprise-patterns.md) 了解企業級 Angular 架構模式。
