# Angular 企業架構模式

> **目標讀者**：具備 .NET/C# 後端開發經驗，正在轉型至 Angular 前端開發的工程師。
> **Angular 版本**：19+ (Standalone、Signals、OnPush、Zoneless)
> **最後更新**：2026-04-09

---

## 目錄

- [專案結構模式](#1-專案結構模式)
- [Core/Shared/Feature 三層架構](#2-coresharedfeature-三層架構)
- [Smart/Dumb 元件設計](#3-smartdumb-元件設計)
- [Facade 服務設計模式](#4-facade-服務設計模式)
- [狀態管理架構決策](#5-狀態管理架構決策)
- [API 層抽象設計](#6-api-層抽象設計)
- [錯誤處理與日誌策略](#7-錯誤處理與日誌策略)
- [微前端架構考量](#8-微前端架構考量)
- [效能預算與監控](#9-效能預算與監控)

---

## 1. 專案結構模式

### 概述

Angular 專案的目錄結構直接影響團隊協作效率與程式碼可維護性。就如同 .NET Solution 的 Project 組織方式，Angular 也有多種結構模式可選擇。

### 模式 A：Feature-based（功能導向）

**適用場景**：小型到中型專案，單一團隊，1-5 位開發者。

```
src/app/
├── app.config.ts                 # Application bootstrap config
├── app.routes.ts                 # Root route definitions
├── app.ts                        # Root component
│
├── auth/                         # Feature: Authentication
│   ├── login.ts
│   ├── login.html
│   ├── login.spec.ts
│   ├── register.ts
│   ├── forgot-password.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts
│   ├── auth.interceptor.ts
│   └── auth.routes.ts
│
├── dashboard/                    # Feature: Dashboard
│   ├── dashboard.ts
│   ├── dashboard.html
│   ├── widgets/
│   │   ├── revenue-chart.ts
│   │   ├── recent-orders.ts
│   │   └── activity-feed.ts
│   └── dashboard.routes.ts
│
├── products/                     # Feature: Products
│   ├── product-list.ts
│   ├── product-detail.ts
│   ├── product-form.ts
│   ├── product.service.ts
│   ├── product.model.ts
│   └── products.routes.ts
│
├── orders/                       # Feature: Orders
│   ├── order-list.ts
│   ├── order-detail.ts
│   ├── order.service.ts
│   └── orders.routes.ts
│
└── shared/                       # Shared utilities
    ├── components/
    │   ├── loading-spinner.ts
    │   ├── error-panel.ts
    │   └── confirm-dialog.ts
    ├── pipes/
    │   ├── truncate.pipe.ts
    │   └── relative-time.pipe.ts
    ├── directives/
    │   └── tooltip.directive.ts
    ├── models/
    │   ├── api-response.model.ts
    │   └── pagination.model.ts
    └── services/
        ├── notification.service.ts
        └── logging.service.ts
```

**優點**：
- 結構簡單，新人容易上手
- 每個功能區域自成一體，減少跨目錄修改
- 適合快速迭代的專案

**缺點**：
- 缺乏強制的模組邊界（只是資料夾分隔）
- 容易在功能之間建立不當的依賴
- 隨著專案成長，`shared/` 會變成垃圾桶

**.NET 類比**：等同於單一 ASP.NET Core Web 專案，使用 Features 資料夾組織 Controllers 和 Services。

---

### 模式 B：Domain-driven（領域驅動）

**適用場景**：中型到大型專案，多團隊協作，5-20 位開發者。

```
src/app/
├── app.config.ts
├── app.routes.ts
├── app.ts
│
├── domains/                         # Business domains
│   ├── catalog/                     # Domain: Product Catalog
│   │   ├── features/
│   │   │   ├── product-list/
│   │   │   │   ├── product-list.ts
│   │   │   │   └── product-list.html
│   │   │   ├── product-detail/
│   │   │   │   ├── product-detail.ts
│   │   │   │   └── product-detail.html
│   │   │   └── product-search/
│   │   │       └── product-search.ts
│   │   ├── ui/
│   │   │   ├── product-card.ts
│   │   │   └── product-carousel.ts
│   │   ├── data-access/
│   │   │   ├── product.api.ts
│   │   │   ├── product.store.ts
│   │   │   └── product.model.ts
│   │   └── catalog.routes.ts
│   │
│   ├── ordering/                    # Domain: Order Management
│   │   ├── features/
│   │   ├── ui/
│   │   ├── data-access/
│   │   └── ordering.routes.ts
│   │
│   └── identity/                    # Domain: Identity & Auth
│       ├── features/
│       ├── data-access/
│       └── identity.routes.ts
│
├── core/                            # Application-wide singletons
│   ├── auth/
│   │   ├── auth.interceptor.ts
│   │   └── auth.guard.ts
│   ├── error-handling/
│   │   └── global-error-handler.ts
│   └── layout/
│       ├── shell.ts
│       ├── header.ts
│       ├── sidebar.ts
│       └── footer.ts
│
└── shared/                          # Reusable utilities (no business logic)
    ├── ui/
    │   ├── loading-spinner.ts
    │   └── empty-state.ts
    ├── pipes/
    ├── directives/
    └── models/
```

**優點**：
- 明確的領域邊界，每個領域可獨立開發與部署
- 子目錄結構統一（features/ui/data-access），降低認知負擔
- 容易識別跨領域依賴

**缺點**：
- 初始設定成本較高
- 需要團隊共識來定義領域邊界
- 小型專案會過度工程化

**.NET 類比**：等同於使用 Clean Architecture 的 .NET Solution，每個 Domain 對應一個 Class Library，有明確的 Application Layer / Domain Layer / Infrastructure Layer 分離。

---

### 模式 C：Nx Monorepo（大型組織）

**適用場景**：大型企業，多產品線，20+ 位開發者，需要程式碼共享。

```
my-org/
├── apps/
│   ├── customer-portal/          # Deployable app: Customer-facing
│   │   └── src/
│   ├── admin-dashboard/          # Deployable app: Internal admin
│   │   └── src/
│   └── mobile-app/               # Deployable app: Mobile (Ionic/Capacitor)
│       └── src/
│
├── packages/                     # Reusable libraries
│   ├── catalog/
│   │   ├── feat-product-list/    # Feature library
│   │   ├── feat-product-detail/
│   │   ├── ui-product-card/      # UI library
│   │   ├── ui-product-carousel/
│   │   └── data-access/          # Data access library
│   │
│   ├── ordering/
│   │   ├── feat-order-list/
│   │   ├── feat-checkout/
│   │   └── data-access/
│   │
│   ├── shared/
│   │   ├── ui-design-system/     # Design system components
│   │   ├── util-formatting/      # Utility functions
│   │   ├── util-testing/         # Test helpers
│   │   └── data-access-auth/     # Shared auth
│   │
│   └── platform/
│       ├── core-http/            # HTTP client configuration
│       ├── core-logging/         # Logging infrastructure
│       └── core-config/          # App configuration
│
├── tools/
│   └── generators/               # Custom Nx generators
│
├── nx.json                       # Nx workspace configuration
├── tsconfig.base.json            # Shared TypeScript config
└── eslint.config.js              # Module boundary rules
```

**Nx 模組邊界規則**：

```json
// eslint.config.js — Enforce dependency rules
{
  "rules": {
    "@nx/enforce-module-boundaries": [
      "error",
      {
        "depConstraints": [
          { "sourceTag": "type:app",         "onlyDependOnLibsWithTags": ["type:feature", "type:ui", "type:data-access", "type:util"] },
          { "sourceTag": "type:feature",     "onlyDependOnLibsWithTags": ["type:ui", "type:data-access", "type:util"] },
          { "sourceTag": "type:ui",          "onlyDependOnLibsWithTags": ["type:ui", "type:util"] },
          { "sourceTag": "type:data-access", "onlyDependOnLibsWithTags": ["type:data-access", "type:util"] },
          { "sourceTag": "type:util",        "onlyDependOnLibsWithTags": ["type:util"] },
          { "sourceTag": "scope:catalog",    "onlyDependOnLibsWithTags": ["scope:catalog", "scope:shared"] },
          { "sourceTag": "scope:ordering",   "onlyDependOnLibsWithTags": ["scope:ordering", "scope:catalog", "scope:shared"] }
        ]
      }
    ]
  }
}
```

**優點**：
- ESLint 自動強制模組邊界，違反即編譯失敗
- 受影響的庫才需要重新建置/測試（Nx affected）
- 多個應用共享程式碼，避免重複
- 自訂 Generator 確保團隊遵循一致的架構

**缺點**：
- 最高的初始設定與學習成本
- 需要專門的 DevOps 支援
- Monorepo 工具鏈（Nx）本身需要維護

**.NET 類比**：等同於使用 Nx 的方式類似 .NET 的 Solution 配合多個 Class Library，ESLint 邊界規則類似 ArchUnit 或 NetArchTest 的架構測試。

---

### 選擇建議

```
團隊規模？
├── 1-5 人，單一產品 → Feature-based
├── 5-20 人，多模組 → Domain-driven
└── 20+ 人，多產品 → Nx Monorepo
```

**漸進式演進**：從 Feature-based 開始，隨著專案成長遷移到 Domain-driven，最終視需要引入 Nx。Nx 提供 `convert-to-monorepo` 命令支援漸進遷移。

---

## 2. Core/Shared/Feature 三層架構

### 概述

這是 Angular 社群最廣泛採用的架構分層模式，將應用程式碼分為三個職責明確的區域。對於 .NET 開發者，這類似於 Presentation / Application / Infrastructure 的分層。

### 架構定義

| 層級 | 職責 | 匯入規則 | .NET 類比 |
|------|------|---------|----------|
| **Core** | 全域單例服務、攔截器、守衛、版面配置 | 只被 AppConfig 匯入一次 | Startup.cs / Program.cs 的服務註冊 |
| **Shared** | 可重用元件、Pipe、指令（無業務邏輯） | 被任何 Feature 匯入 | 共用的 Class Library |
| **Feature** | 業務功能的完整實作 | 匯入 Shared，不匯入其他 Feature | 各個 Feature 的 Controller + Service |

### 程式碼範例

```typescript
// === CORE LAYER ===

// core/auth/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthTokenService).getToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};

// core/layout/shell.ts — Application shell
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Sidebar],
  template: `
    <app-header />
    <div class="layout">
      <app-sidebar />
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {}

// === SHARED LAYER ===

// shared/ui/data-table.ts — Reusable data table
@Component({
  selector: 'app-data-table',
  template: `
    <table>
      <thead>
        <tr>
          @for (col of columns(); track col.key) {
            <th (click)="sort(col.key)">{{ col.label }}</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of data(); track trackBy()(row)) {
          <tr>
            @for (col of columns(); track col.key) {
              <td>{{ row[col.key] }}</td>
            }
          </tr>
        } @empty {
          <tr><td [attr.colspan]="columns().length">No data</td></tr>
        }
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable<T extends Record<string, unknown>> {
  readonly columns = input.required<Column[]>();
  readonly data = input.required<T[]>();
  readonly trackBy = input<(item: T) => unknown>(() => (item: T) => item);
  readonly sortChange = output<SortEvent>();

  protected sort(key: string): void {
    this.sortChange.emit({ key, direction: 'asc' });
  }
}

// === FEATURE LAYER ===

// features/products/product-list.ts
@Component({
  selector: 'app-product-list',
  imports: [DataTable, CurrencyPipe],
  template: `
    @if (facade.loading()) {
      <app-loading-spinner />
    } @else {
      <app-data-table
        [columns]="columns"
        [data]="facade.products()"
        [trackBy]="trackById"
        (sortChange)="onSort($event)" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  protected readonly facade = inject(ProductFacade);

  protected readonly columns: Column[] = [
    { key: 'name', label: 'Product Name' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' },
  ];

  protected readonly trackById = (item: Product) => item.id;

  protected onSort(event: SortEvent): void {
    this.facade.sortProducts(event);
  }
}
```

### 依賴規則強制

```
  Feature → Shared  ✅
  Feature → Core    ❌ (Core services are provided at root, injected via DI)
  Feature → Feature ❌ (Cross-feature communication through shared state)
  Shared  → Core    ❌
  Shared  → Feature ❌
  Core    → Feature ❌
  Core    → Shared  ✅ (Core layout may use shared UI components)
```

### 反模式警告

- **Shared 變成垃圾桶**：Shared 只放真正可重用的東西，業務邏輯放在 Feature 中
- **Feature 之間直接引用**：使用 Facade 或 共享狀態服務進行跨 Feature 通訊
- **Core 被多次匯入**：Core 服務使用 `providedIn: 'root'` 確保單例

---

## 3. Smart/Dumb 元件設計

### 概述

Smart/Dumb（Container/Presentational）模式將元件分為兩類：Smart 元件負責資料與邏輯，Dumb 元件負責純 UI 渲染。這與 .NET 的 MVVM 模式中 ViewModel 與 View 的分離異曲同工。

### 設計原則

```typescript
// === SMART COMPONENT (Container) ===
// Responsibilities: inject services, manage state, orchestrate children

@Component({
  selector: 'app-employee-page',
  imports: [EmployeeFilter, EmployeeTable, EmployeeDetail, MatPaginatorModule],
  template: `
    <h1>Employee Management</h1>

    <app-employee-filter
      [departments]="departments()"
      (filterChange)="onFilterChange($event)" />

    @if (employees.isLoading()) {
      <mat-progress-bar mode="indeterminate" />
    } @else if (employees.error()) {
      <app-error-panel
        [message]="employees.error()!"
        (retry)="employees.reload()" />
    } @else {
      <app-employee-table
        [employees]="employees.value() ?? []"
        [selectedId]="selectedId()"
        (rowClick)="selectEmployee($event)"
        (delete)="deleteEmployee($event)" />

      <mat-paginator
        [length]="totalCount()"
        [pageSize]="pageSize()"
        (page)="onPageChange($event)" />
    }

    @if (selectedEmployee(); as emp) {
      <app-employee-detail
        [employee]="emp"
        (save)="saveEmployee($event)"
        (close)="clearSelection()" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeePage {
  private readonly facade = inject(EmployeeFacade);

  protected readonly departments = this.facade.departments;
  protected readonly selectedId = signal<string | null>(null);
  protected readonly pageSize = signal(20);

  protected readonly employees = resource({
    request: () => ({
      filter: this.facade.currentFilter(),
      page: this.facade.currentPage(),
      size: this.pageSize(),
    }),
    loader: ({ request }) => this.facade.loadEmployees(request),
  });

  protected readonly selectedEmployee = computed(() => {
    const id = this.selectedId();
    return id ? this.employees.value()?.find(e => e.id === id) ?? null : null;
  });

  protected readonly totalCount = computed(() =>
    this.facade.totalCount()
  );

  protected selectEmployee(id: string): void {
    this.selectedId.set(id);
  }

  protected clearSelection(): void {
    this.selectedId.set(null);
  }

  protected onFilterChange(filter: EmployeeFilter): void {
    this.facade.setFilter(filter);
  }

  protected onPageChange(event: PageEvent): void {
    this.facade.setPage(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected async deleteEmployee(id: string): Promise<void> {
    await this.facade.deleteEmployee(id);
    this.employees.reload();
  }

  protected async saveEmployee(employee: Employee): Promise<void> {
    await this.facade.saveEmployee(employee);
    this.employees.reload();
    this.clearSelection();
  }
}

// === DUMB COMPONENT (Presentational) ===
// Responsibilities: render UI, emit user actions, zero service dependencies

@Component({
  selector: 'app-employee-table',
  imports: [DatePipe, CurrencyPipe],
  template: `
    <table role="grid" aria-label="Employee list">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Department</th>
          <th scope="col">Hire Date</th>
          <th scope="col">Salary</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (emp of employees(); track emp.id) {
          <tr
            [class.selected]="emp.id === selectedId()"
            (click)="rowClick.emit(emp.id)"
            role="row"
            [attr.aria-selected]="emp.id === selectedId()">
            <td>{{ emp.firstName }} {{ emp.lastName }}</td>
            <td>{{ emp.department }}</td>
            <td>{{ emp.hireDate | date:'yyyy-MM-dd' }}</td>
            <td>{{ emp.salary | currency:'TWD':'symbol':'1.0-0' }}</td>
            <td>
              <button
                (click)="delete.emit(emp.id); $event.stopPropagation()"
                aria-label="Delete {{ emp.firstName }}">
                Delete
              </button>
            </td>
          </tr>
        } @empty {
          <tr>
            <td colspan="5">No employees found</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeTable {
  readonly employees = input.required<Employee[]>();
  readonly selectedId = input<string | null>(null);
  readonly rowClick = output<string>();
  readonly delete = output<string>();
}
```

### 適用場景

| 場景 | 使用 Smart/Dumb | 原因 |
|------|----------------|------|
| CRUD 頁面 | 是 | 分離資料載入與表格渲染 |
| 簡單的靜態頁面 | 否 | 過度設計 |
| 可重用的 UI 元件 | 只用 Dumb | 純展示，不依賴服務 |
| Dashboard Widget | 視複雜度 | 簡單 Widget 可以是 Dumb |

### 反模式警告

- **Prop Drilling**：不要為了避免 Smart Component 注入服務而將所有資料層層傳遞。如果超過 2 層，考慮使用 DI 或 Context
- **過度拆分**：不是每個元件都需要拆成 Smart + Dumb，只在有複用需求或複雜度夠高時才拆分
- **Dumb Component 持有狀態**：Dumb Component 不應該有 `signal()` 管理的持久狀態，臨時的 UI 狀態（如 hover）除外

---

## 4. Facade 服務設計模式

### 概述

Facade 模式在元件與底層服務之間建立一個抽象層，封裝複雜的業務邏輯與服務編排。這與 .NET 的 Application Service（或 Mediator 模式）概念相同。

### 完整實作

```typescript
// === API Layer — Only HTTP communication ===

@Injectable({ providedIn: 'root' })
export class EmployeeApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/employees';

  getAll(params: EmployeeQueryParams): Observable<Page<Employee>> {
    return this.http.get<Page<Employee>>(this.baseUrl, {
      params: toHttpParams(params),
    });
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateEmployeeDto): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateEmployeeDto): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

// === State Layer — Reactive state management ===

@Injectable({ providedIn: 'root' })
export class EmployeeState {
  private readonly _employees = signal<Employee[]>([]);
  private readonly _totalCount = signal(0);
  private readonly _filter = signal<EmployeeFilter>({});
  private readonly _currentPage = signal(0);
  private readonly _departments = signal<string[]>([]);

  // Public read-only signals
  readonly employees = this._employees.asReadonly();
  readonly totalCount = this._totalCount.asReadonly();
  readonly currentFilter = this._filter.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly departments = this._departments.asReadonly();

  // Mutations
  setEmployees(employees: Employee[], total: number): void {
    this._employees.set(employees);
    this._totalCount.set(total);
  }

  addEmployee(employee: Employee): void {
    this._employees.update(list => [...list, employee]);
    this._totalCount.update(n => n + 1);
  }

  updateEmployee(updated: Employee): void {
    this._employees.update(list =>
      list.map(e => e.id === updated.id ? updated : e)
    );
  }

  removeEmployee(id: string): void {
    this._employees.update(list => list.filter(e => e.id !== id));
    this._totalCount.update(n => n - 1);
  }

  setFilter(filter: EmployeeFilter): void {
    this._filter.set(filter);
    this._currentPage.set(0); // Reset page on filter change
  }

  setPage(page: number): void {
    this._currentPage.set(page);
  }

  setDepartments(departments: string[]): void {
    this._departments.set(departments);
  }
}

// === Facade Layer — Orchestration ===

@Injectable({ providedIn: 'root' })
export class EmployeeFacade {
  private readonly api = inject(EmployeeApi);
  private readonly state = inject(EmployeeState);
  private readonly notifications = inject(NotificationService);
  private readonly logger = inject(LoggingService);

  // Expose state as read-only signals (pass-through)
  readonly employees = this.state.employees;
  readonly totalCount = this.state.totalCount;
  readonly currentFilter = this.state.currentFilter;
  readonly currentPage = this.state.currentPage;
  readonly departments = this.state.departments;

  // Orchestrated operations
  async loadEmployees(params: EmployeeQueryParams): Promise<Employee[]> {
    try {
      const page = await firstValueFrom(this.api.getAll(params));
      this.state.setEmployees(page.items, page.total);
      return page.items;
    } catch (error) {
      this.logger.error('Failed to load employees', error);
      this.notifications.error('Unable to load employee list');
      throw error;
    }
  }

  async saveEmployee(employee: Employee): Promise<void> {
    try {
      if (employee.id) {
        // Update (optimistic)
        const original = this.state.employees().find(e => e.id === employee.id);
        this.state.updateEmployee(employee); // Optimistic update

        try {
          const updated = await firstValueFrom(
            this.api.update(employee.id, employee)
          );
          this.state.updateEmployee(updated); // Confirm with server data
          this.notifications.success('Employee updated');
        } catch (error) {
          // Rollback on failure
          if (original) this.state.updateEmployee(original);
          throw error;
        }
      } else {
        // Create (pessimistic)
        const created = await firstValueFrom(this.api.create(employee));
        this.state.addEmployee(created);
        this.notifications.success('Employee created');
      }
    } catch (error) {
      this.logger.error('Failed to save employee', error);
      this.notifications.error('Unable to save employee');
      throw error;
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    const original = this.state.employees().find(e => e.id === id);
    this.state.removeEmployee(id); // Optimistic delete

    try {
      await firstValueFrom(this.api.delete(id));
      this.notifications.success('Employee deleted');
    } catch (error) {
      // Rollback on failure
      if (original) this.state.addEmployee(original);
      this.logger.error('Failed to delete employee', error);
      this.notifications.error('Unable to delete employee');
      throw error;
    }
  }

  setFilter(filter: EmployeeFilter): void {
    this.state.setFilter(filter);
  }

  setPage(page: number): void {
    this.state.setPage(page);
  }
}
```

### 適用場景

| 場景 | 使用 Facade | 原因 |
|------|------------|------|
| CRUD 頁面需要多個服務 | 是 | 封裝 API + State + Notification |
| 簡單的資料展示頁 | 否 | 直接用 `resource()` 即可 |
| 跨 Feature 資料共享 | 是 | Facade 是跨界的抽象層 |
| 複雜的業務工作流 | 是 | 封裝多步驟操作與錯誤回滾 |

### 反模式警告

- **God Facade**：一個 Facade 不應超過 10-15 個公開方法；過大就拆分
- **Facade 直接存取 DOM**：Facade 是業務邏輯層，不應操作 UI
- **跳過 Facade 直接操作 State**：元件應只透過 Facade 修改狀態

---

## 5. 狀態管理架構決策

### 概述

狀態管理是前端架構的核心決策之一。Angular 生態系提供多種方案，從框架內建的 Signals 到功能完整的 NgRx Store。這類似 .NET 世界中從簡單的 In-Memory Cache 到 Redis + MediatR + Event Sourcing 的抉擇。

### 決策矩陣

```
應用複雜度評估：

1. 共享狀態的 entity 數量？
   ├── < 3 個 entity → Service + Signals
   ├── 3-10 個 entity → NgRx Signal Store
   └── > 10 個 entity → NgRx Store (考慮拆分 Feature Store)

2. 需要時間旅行除錯？
   ├── 是 → NgRx Store
   └── 否 → Signal-based 方案

3. 團隊 Redux 經驗？
   ├── 豐富 → NgRx Store (利用既有經驗)
   └── 有限 → Signal Store 或 Service + Signals

4. 是否需要嚴格的單向資料流？
   ├── 是 → NgRx Store (Actions → Reducers → Effects)
   └── 否 → Signal Store 或 Service + Signals
```

### 各方案程式碼範例

**方案 A：Service + Signals（推薦起點）**

```typescript
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();
  readonly itemCount = computed(() => this._items().length);
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  addItem(product: Product): void {
    this._items.update(items => {
      const existing = items.find(i => i.productId === product.id);
      if (existing) {
        return items.map(i =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...items, { productId: product.id, name: product.name,
                          price: product.price, quantity: 1 }];
    });
  }

  removeItem(productId: string): void {
    this._items.update(items => items.filter(i => i.productId !== productId));
  }

  clear(): void {
    this._items.set([]);
  }
}
```

**方案 B：NgRx Signal Store（中型專案）**

```typescript
import {
  signalStore, withState, withMethods, withComputed, patchState, withHooks,
} from '@ngrx/signals';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState<CartState>({ items: [], loading: false, error: null }),
  withComputed(({ items }) => ({
    itemCount: computed(() => items().length),
    total: computed(() =>
      items().reduce((sum, i) => sum + i.price * i.quantity, 0)
    ),
    isEmpty: computed(() => items().length === 0),
  })),
  withMethods((store) => ({
    addItem(product: Product): void {
      patchState(store, (state) => {
        const existing = state.items.find(i => i.productId === product.id);
        if (existing) {
          return {
            items: state.items.map(i =>
              i.productId === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          };
        }
        return {
          items: [...state.items, {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          }],
        };
      });
    },
    removeItem(productId: string): void {
      patchState(store, (state) => ({
        items: state.items.filter(i => i.productId !== productId),
      }));
    },
    clear(): void {
      patchState(store, { items: [], error: null });
    },
  })),
  withHooks({
    onInit(store) {
      // Load persisted cart on initialization
      const saved = localStorage.getItem('cart');
      if (saved) {
        patchState(store, { items: JSON.parse(saved) });
      }
    },
  })
);
```

### 反模式警告

- **為了用 NgRx 而用 NgRx**：如果 Service + Signals 就能解決問題，不要引入額外的複雜度
- **全域狀態放太多東西**：只有真正需要跨元件共享的資料才放在全域狀態
- **在元件中直接修改 Store 狀態**：永遠透過 Store 提供的方法修改狀態

---

## 6. API 層抽象設計

### 概述

API 層負責封裝所有與後端的 HTTP 通訊，提供型別安全的介面。這等同於 .NET 中的 Repository 模式或 Infrastructure Layer 的 External Service Client。

### 設計原則

```typescript
// === Base API service ===

@Injectable({ providedIn: 'root' })
export abstract class BaseApi {
  protected readonly http = inject(HttpClient);
  protected abstract readonly baseUrl: string;

  protected get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params });
  }

  protected post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }

  protected put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body);
  }

  protected delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`);
  }
}

// === Concrete API service ===

@Injectable({ providedIn: 'root' })
export class ProductApi extends BaseApi {
  protected readonly baseUrl = '/api/products';

  getProducts(params: ProductQueryParams): Observable<Page<Product>> {
    return this.get<Page<Product>>('', toHttpParams(params));
  }

  getProduct(id: string): Observable<Product> {
    return this.get<Product>(`/${id}`);
  }

  createProduct(dto: CreateProductDto): Observable<Product> {
    return this.post<Product>('', dto);
  }

  updateProduct(id: string, dto: UpdateProductDto): Observable<Product> {
    return this.put<Product>(`/${id}`, dto);
  }

  deleteProduct(id: string): Observable<void> {
    return this.delete<void>(`/${id}`);
  }
}

// === Type-safe response models ===

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// === HTTP params utility ===

function toHttpParams(obj: Record<string, unknown>): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      params = params.set(key, String(value));
    }
  }
  return params;
}
```

### 適用場景

| 場景 | 推薦 | 原因 |
|------|------|------|
| REST API | `BaseApi` 繼承 | 統一的 CRUD 操作模式 |
| GraphQL | 專用 `GraphQLClient` 服務 | 不同的通訊協議 |
| 第三方 API | 獨立的 Adapter 服務 | 隔離第三方的 API 變更 |
| WebSocket | 專用的 `WebSocketService` | 持久連線，不同的通訊模式 |

### 反模式警告

- **在 API 層加入業務邏輯**：API 只負責 HTTP，業務邏輯放在 Facade 或 Service
- **回傳未型別化的 `any`**：所有 API 方法都必須有明確的回傳型別
- **直接在元件中使用 `HttpClient`**：永遠透過 API 服務，確保可測試性與一致性

---

## 7. 錯誤處理與日誌策略

### 概述

企業級應用需要系統化的錯誤處理與日誌記錄。這與 .NET 中使用 Serilog + Application Insights + ExceptionHandler Middleware 的概念相同。

### 分層錯誤處理架構

```typescript
// === Layer 1: Logging Service ===

export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  data?: unknown;
  error?: unknown;
}

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private readonly http = inject(HttpClient);
  private readonly buffer: LogEntry[] = [];
  private readonly flushInterval = 30_000; // 30 seconds

  constructor() {
    // Periodically flush log buffer to server
    setInterval(() => this.flush(), this.flushInterval);
    // Flush on page unload
    window.addEventListener('beforeunload', () => this.flush());
  }

  debug(message: string, data?: unknown): void {
    this.log(LogLevel.Debug, message, data);
  }

  info(message: string, data?: unknown): void {
    this.log(LogLevel.Info, message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log(LogLevel.Warn, message, data);
  }

  error(message: string, error?: unknown): void {
    this.log(LogLevel.Error, message, undefined, error);
  }

  private log(level: LogLevel, message: string, data?: unknown, error?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
      error: error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error,
    };

    this.buffer.push(entry);

    // Console output in development
    if (!environment.production) {
      const consoleFn = level === LogLevel.Error ? console.error
        : level === LogLevel.Warn ? console.warn
        : console.log;
      consoleFn(`[${level.toUpperCase()}] ${message}`, data ?? error ?? '');
    }

    // Immediate flush for errors
    if (level === LogLevel.Error) {
      this.flush();
    }
  }

  private flush(): void {
    if (this.buffer.length === 0) return;
    const entries = [...this.buffer];
    this.buffer.length = 0;

    this.http.post('/api/logs', { entries }).subscribe({
      error: () => {
        // Failed to send logs — add back to buffer (with limit)
        if (this.buffer.length < 100) {
          this.buffer.unshift(...entries);
        }
      },
    });
  }
}

// === Layer 2: Global Error Handler ===

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(LoggingService);
  private readonly notifications = inject(NotificationService);

  handleError(error: unknown): void {
    this.logger.error('Unhandled error caught by GlobalErrorHandler', error);

    if (error instanceof HttpErrorResponse) {
      // HTTP errors are handled by interceptor — don't double-notify
      return;
    }

    this.notifications.error(
      'An unexpected error occurred. Our team has been notified.'
    );
  }
}

// === Layer 3: Error Interceptor with Retry ===

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggingService);
  const router = inject(Router);

  return next(req).pipe(
    retry({
      count: 2,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // Only retry server errors and network errors
        if (error.status === 0 || (error.status >= 500 && error.status < 600)) {
          logger.warn(`Retrying request (${retryCount}/2): ${req.url}`);
          return timer(1000 * Math.pow(2, retryCount - 1)); // Exponential backoff
        }
        return throwError(() => error);
      },
    }),
    catchError((error: HttpErrorResponse) => {
      logger.error(`HTTP ${error.status} on ${req.method} ${req.url}`, error);

      if (error.status === 401) {
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};

// === Registration ===

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
  ],
};
```

### .NET 類比對照

| Angular | .NET | 說明 |
|---------|------|------|
| `GlobalErrorHandler` | `ExceptionHandler Middleware` | 捕獲所有未處理的錯誤 |
| `errorInterceptor` | `DelegatingHandler` | HTTP 管線中的錯誤處理 |
| `LoggingService` | `ILogger<T>` + Serilog | 結構化日誌記錄 |
| `retry` operator | Polly retry policy | 重試策略 |
| Error boundary (planned) | `UseExceptionHandler()` | 元件級錯誤隔離 |

---

## 8. 微前端架構考量

### 概述

微前端將前端應用拆分為獨立部署的子應用，適合大型組織中多團隊並行開發。這與後端的微服務架構概念相同。

### 方案比較

| 方案 | 技術 | 適用場景 | 複雜度 |
|------|------|---------|--------|
| **Module Federation** | Webpack / Native Federation | 同一框架（全 Angular） | 中 |
| **Web Components** | Angular Elements | 跨框架整合 | 中-高 |
| **iframe** | HTML iframe | 完全隔離 | 低（但 UX 差） |
| **路由式整合** | Nginx reverse proxy | 頁面級獨立 | 低 |

### Native Federation 範例

```typescript
// Shell application — routes configuration
export const routes: Routes = [
  { path: '', component: Shell, children: [
    {
      path: 'catalog',
      loadChildren: () =>
        loadRemoteModule({
          remoteName: 'catalog',
          exposedModule: './routes',
        }).then(m => m.catalogRoutes),
    },
    {
      path: 'ordering',
      loadChildren: () =>
        loadRemoteModule({
          remoteName: 'ordering',
          exposedModule: './routes',
        }).then(m => m.orderingRoutes),
    },
  ]},
];

// Remote application (catalog) — federation.config.js
module.exports = {
  name: 'catalog',
  exposes: {
    './routes': './src/app/catalog.routes.ts',
  },
  shared: {
    '@angular/core': { singleton: true, requiredVersion: 'auto' },
    '@angular/router': { singleton: true, requiredVersion: 'auto' },
    'rxjs': { singleton: true, requiredVersion: 'auto' },
  },
};
```

### 何時使用微前端

| 條件 | 建議 |
|------|------|
| 單一團隊，單一產品 | 不使用微前端 |
| 多團隊，需要獨立部署 | 考慮微前端 |
| 需要漸進式遷移舊系統 | 適合微前端 |
| 需要混合不同框架 | 使用 Web Components |
| 首重使用者體驗一致性 | 慎用微前端（UX 整合成本高） |

### 反模式警告

- **為了微服務而微前端**：後端微服務不代表前端也要拆分
- **共享狀態過多**：微前端之間應最小化共享狀態，使用事件通訊
- **版本不一致**：確保共享的 Angular 版本一致，避免運行時衝突

---

## 9. 效能預算與監控

### 概述

效能預算定義了應用的效能底線，任何超過預算的建置都會失敗。這與 .NET 中設定 API 回應時間 SLA 和使用 Application Insights 監控的概念相似。

### 效能預算設定

```json
// angular.json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "400kB",
                  "maximumError": "800kB"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "4kB",
                  "maximumError": "8kB"
                },
                {
                  "type": "anyScript",
                  "maximumWarning": "100kB",
                  "maximumError": "200kB"
                }
              ],
              "outputHashing": "all",
              "sourceMap": false
            }
          }
        }
      }
    }
  }
}
```

### 效能優化檢查清單

| 類別 | 優化項目 | 效果 | 實施難度 |
|------|---------|------|---------|
| **Bundle** | 延遲載入路由 | 減少初始 Bundle 30-60% | 低 |
| **Bundle** | Tree-shakable imports | 減少未用程式碼 | 低 |
| **Bundle** | `@defer` 延遲區塊 | 減少初始渲染體積 | 低 |
| **渲染** | OnPush 變更偵測 | 減少不必要的檢查 | 中 |
| **渲染** | Zoneless mode | 30-40% 渲染提升 | 中-高 |
| **渲染** | `trackBy` in `@for` | 避免整列重新渲染 | 低 |
| **渲染** | Virtual scrolling | 大列表效能提升 | 中 |
| **網路** | HTTP 快取策略 | 減少重複請求 | 中 |
| **網路** | 圖片優化 (`NgOptimizedImage`) | 減少載入時間 | 低 |
| **網路** | SSR/SSG | 改善 FCP 與 SEO | 高 |
| **網路** | Service Worker | 離線支援與快取 | 中 |

### CI/CD 整合

```yaml
# GitHub Actions — Performance check
- name: Build with budget check
  run: ng build --configuration production
  # Fails if bundle exceeds budget

- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v11
  with:
    configPath: './.lighthouserc.json'
    uploadArtifacts: true
```

```json
// .lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

### 監控工具整合

```typescript
// Performance monitoring with Web Vitals
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

@Injectable({ providedIn: 'root' })
export class PerformanceMonitor {
  private readonly logger = inject(LoggingService);

  constructor() {
    if (environment.production) {
      onCLS(metric => this.report('CLS', metric));
      onFCP(metric => this.report('FCP', metric));
      onLCP(metric => this.report('LCP', metric));
      onTTFB(metric => this.report('TTFB', metric));
    }
  }

  private report(name: string, metric: { value: number }): void {
    this.logger.info(`Web Vital: ${name}`, {
      name,
      value: metric.value,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### .NET 類比

| Angular 效能工具 | .NET 類比 | 說明 |
|-----------------|----------|------|
| Lighthouse | Application Insights Performance | 效能分析 |
| Bundle Budget | — | 前端特有的建置時期檢查 |
| `@defer` | Lazy loading assemblies | 延遲載入 |
| Web Vitals | Custom Metrics | 實時效能指標 |
| Source Map Explorer | dotnet trace / PerfView | 效能瓶頸分析 |
| Service Worker | Response Caching Middleware | 快取策略 |

### 反模式警告

- **不設效能預算**：沒有預算等於沒有底線，Bundle 會無限膨脹
- **只關注初始載入**：運行時效能（渲染、記憶體）同樣重要
- **忽略 Core Web Vitals**：Google 將 CWV 納入搜尋排名因素
- **在開發環境測效能**：永遠使用 Production build 進行效能測試

---

## 附錄：架構決策記錄模板 (ADR)

在企業專案中，重大的架構決策應該被記錄下來。以下是 Angular 專案的 ADR 模板：

```markdown
# ADR-{NUMBER}: {TITLE}

## 狀態
[提議 | 接受 | 棄用 | 取代]

## 背景
[描述促成此決策的商業或技術背景]

## 決策
[描述被採納的架構決策]

## 考慮的替代方案
### 方案 A: [名稱]
- 優點: ...
- 缺點: ...

### 方案 B: [名稱]
- 優點: ...
- 缺點: ...

## 後果
### 正面
- ...

### 負面
- ...

## 參考
- [相關文件或連結]
```

### 範例 ADR

```markdown
# ADR-001: 使用 NgRx Signal Store 作為狀態管理方案

## 狀態
接受

## 背景
專案有 5 個主要業務領域，每個領域有 3-5 個共享狀態的 entity。
團隊有 8 位前端開發者，其中 3 位有 Redux 經驗。

## 決策
採用 NgRx Signal Store 作為跨元件的狀態管理方案。
元件級狀態繼續使用 Angular Signals。

## 考慮的替代方案
### 方案 A: Service + Signals
- 優點: 零外部依賴、學習曲線低
- 缺點: 缺乏結構化模式、DevTools 支援有限

### 方案 B: NgRx Store (Redux)
- 優點: 成熟的生態系、完整的 DevTools
- 缺點: 樣板程式碼多、學習曲線高

## 後果
### 正面
- 型別安全的狀態更新
- 比 Redux 少 60% 的樣板程式碼
- 與 Angular Signals 原生整合

### 負面
- 團隊需要學習 Signal Store API
- 無法使用 Redux DevTools 的時間旅行功能
```

---

> **回到索引**：[00-reference-index.md](./00-reference-index.md)
