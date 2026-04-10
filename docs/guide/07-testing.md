# 第七章：Testing — 測試策略

> **目標讀者**：具備 .NET/C# 後端開發經驗，正在學習 Angular 19+ 的工程師。
> **Angular 版本**：19+（Standalone、Signals、OnPush、函式攔截器）
> **先備知識**：第一至六章（元件、Signals、DI、路由、HttpClient、Forms）
> **最後更新**：2026-04-09

---

## 本章目標

完成本章後，你將能夠：

1. 理解 Angular 測試框架與設定
2. 使用 TestBed 設定 Standalone 元件的測試環境
3. 測試元件的模板、輸入、輸出與互動
4. 測試 Service（含 Signals）
5. 模擬 HTTP 請求與驗證
6. 測試路由與導覽
7. 測試 Directive 與 Pipe
8. 撰寫多元件整合測試
9. 設定程式碼覆蓋率門檻
10. 測試 Signal-based 元件

---

## .NET 對照速查表

| .NET 概念 | Angular 19+ 對應 |
|---|---|
| xUnit / NUnit | Jasmine（語法）+ Karma（執行器） |
| `WebApplicationFactory<T>` | `TestBed.configureTestingModule()` |
| `IServiceCollection` mock | `TestBed.providers` |
| `Mock<IService>` (Moq) | `jasmine.createSpyObj()` / `jest.fn()` |
| `HttpMessageHandler` mock | `HttpTestingController` |
| `Assert.Equal()` | `expect().toBe()` / `toEqual()` |
| `[Fact]` / `[Theory]` | `it()` / `describe()` |
| `[InlineData]` | 迴圈內 `it()` 或多個 `it()` |
| `ITestOutputHelper` | `console.log` / Karma output |
| Code Coverage (Coverlet) | Istanbul / karma-coverage |

---

## 7.1 測試框架

### 7.1.1 Angular 預設測試堆疊

Angular CLI 預設配置：

| 工具 | 角色 | .NET 類比 |
|---|---|---|
| **Jasmine** | 測試框架（語法、斷言） | xUnit / NUnit |
| **Karma** | 測試執行器（瀏覽器中執行） | dotnet test runner |
| **Istanbul** | 程式碼覆蓋率 | Coverlet |

### 7.1.2 Jasmine 基本語法

```typescript
// Jasmine vs xUnit comparison:

// xUnit:                              // Jasmine:
// [Fact]                              // it('...')
// public void Should_Return_True()    // it('should return true', () => { ... })
// {
//   Assert.True(result);              //   expect(result).toBeTrue();
// }

describe('Calculator', () => {
  // Arrange (beforeEach = constructor or fixture setup)
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  afterEach(() => {
    // Cleanup (like IDisposable.Dispose)
  });

  // Act + Assert
  it('should add two numbers', () => {
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
  });

  it('should throw on division by zero', () => {
    expect(() => calculator.divide(10, 0)).toThrowError('Division by zero');
  });

  // Nested describe for grouping (like nested classes in xUnit)
  describe('subtract', () => {
    it('should subtract two numbers', () => {
      expect(calculator.subtract(5, 3)).toBe(2);
    });

    it('should handle negative results', () => {
      expect(calculator.subtract(3, 5)).toBe(-2);
    });
  });
});
```

### 7.1.3 常用匹配器（Matchers）

```typescript
// Equality
expect(value).toBe(expected);              // Strict equality (===)
expect(value).toEqual(expected);           // Deep equality (like Assert.Equivalent)
expect(value).toBeTruthy();                // Truthy check
expect(value).toBeFalsy();                 // Falsy check
expect(value).toBeNull();                  // Null check
expect(value).toBeDefined();               // Not undefined
expect(value).toBeUndefined();             // Undefined

// Comparison
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThanOrEqual(10);
expect(value).toBeCloseTo(3.14, 2);        // Float comparison with precision

// Strings
expect(str).toContain('hello');
expect(str).toMatch(/pattern/);

// Arrays
expect(array).toContain(item);
expect(array).toHaveSize(3);

// Objects
expect(obj).toEqual(jasmine.objectContaining({ key: 'value' }));

// Spies
expect(spy).toHaveBeenCalled();
expect(spy).toHaveBeenCalledWith('arg1', 'arg2');
expect(spy).toHaveBeenCalledTimes(3);

// Negation
expect(value).not.toBe(other);
expect(spy).not.toHaveBeenCalled();
```

### 7.1.4 angular.json 測試設定

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "polyfills": ["zone.js", "zone.js/testing"],
            "tsConfig": "tsconfig.spec.json",
            "assets": ["src/assets"],
            "styles": ["src/styles.css"],
            "codeCoverage": true,
            "browsers": "ChromeHeadless"
          }
        }
      }
    }
  }
}
```

### 7.1.5 Jest 遷移路徑

Angular 也支援使用 Jest 替代 Karma（實驗性支援）：

```json
// angular.json — Jest builder (experimental in Angular 19)
{
  "test": {
    "builder": "@angular-devkit/build-angular:jest",
    "options": {
      "tsConfig": "tsconfig.spec.json",
      "polyfills": ["zone.js", "zone.js/testing"]
    }
  }
}
```

Jest 與 Jasmine 的語法高度相似，主要差異：

| 面向 | Jasmine + Karma | Jest |
|---|---|---|
| 執行環境 | 真實瀏覽器 | jsdom（Node.js） |
| 速度 | 較慢（啟動瀏覽器） | 較快（純 Node.js） |
| Snapshot | 無內建 | `toMatchSnapshot()` |
| Mock | `jasmine.createSpyObj()` | `jest.fn()` / `jest.mock()` |
| 成熟度 | 穩定 | Angular 中仍在演進 |

---

## 7.2 TestBed 設定

### 7.2.1 Standalone 元件的 TestBed 設定

Angular 19+ 以 Standalone 為預設，TestBed 設定更加簡潔：

```typescript
import { TestBed, ComponentFixture } from '@angular/core/testing';

describe('UserProfile', () => {
  let fixture: ComponentFixture<UserProfile>;
  let component: UserProfile;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // For standalone components, use 'imports' instead of 'declarations'
      imports: [UserProfile],

      // Override providers for testing
      providers: [
        { provide: UserService, useValue: jasmine.createSpyObj('UserService', ['getUser']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfile);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

> **對應 .NET**：`TestBed.configureTestingModule()` 等同於 `WebApplicationFactory<T>` 的 `WithWebHostBuilder(builder => { builder.ConfigureServices(...) })`。

### 7.2.2 提供 Mock 服務

```typescript
// Method 1: jasmine.createSpyObj (Jasmine spy object)
const mockUserService = jasmine.createSpyObj('UserService', ['getUser', 'updateUser']);
mockUserService.getUser.and.returnValue(of({ id: 1, name: 'Test User' }));

// Method 2: Manual mock object
const mockUserService = {
  getUser: () => of({ id: 1, name: 'Test User' }),
  updateUser: jasmine.createSpy('updateUser').and.returnValue(of(true)),
};

// Method 3: Partial mock with spyOn
const realService = TestBed.inject(UserService);
spyOn(realService, 'getUser').and.returnValue(of({ id: 1, name: 'Test User' }));

// Register in TestBed:
providers: [
  { provide: UserService, useValue: mockUserService },
]
```

### 7.2.3 覆寫元件依賴

```typescript
// Override a child component to avoid testing its internals (shallow testing)
await TestBed.configureTestingModule({
  imports: [ParentComponent],
})
.overrideComponent(ParentComponent, {
  remove: { imports: [HeavyChartComponent] },
  add: { imports: [MockChartComponent] },
})
.compileComponents();
```

### 7.2.4 使用 fixture.whenStable()

Angular 19+ 建議使用 `await fixture.whenStable()` 取代 `fixture.detectChanges()`：

```typescript
it('should display user name after loading', async () => {
  // Arrange
  mockUserService.getUser.and.returnValue(of({ id: 1, name: 'John' }));

  // Act — wait for all async operations and change detection to settle
  await fixture.whenStable();

  // Assert
  const nameEl = fixture.nativeElement.querySelector('.user-name');
  expect(nameEl.textContent).toContain('John');
});
```

> **重要**：Angular 19+ 的 Standalone 元件搭配 OnPush 時，`fixture.detectChanges()` 可能無法正確觸發更新。`await fixture.whenStable()` 會等待所有非同步操作完成後自動進行變更偵測。

---

## 7.3 元件測試

### 7.3.1 ComponentFixture 與 DebugElement

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('ProductCard', () => {
  let fixture: ComponentFixture<ProductCard>;
  let component: ProductCard;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
  });

  it('should render product name', async () => {
    // Set input signal value
    fixture.componentRef.setInput('product', {
      id: 1,
      name: 'Angular Book',
      price: 599,
    });

    await fixture.whenStable();

    // Query by CSS selector
    const nameEl: HTMLElement = debugEl.query(By.css('.product-name')).nativeElement;
    expect(nameEl.textContent).toContain('Angular Book');
  });

  it('should emit addToCart when button is clicked', async () => {
    const product = { id: 1, name: 'Book', price: 599 };
    fixture.componentRef.setInput('product', product);
    await fixture.whenStable();

    // Subscribe to output
    let emittedProduct: unknown = null;
    component.addToCart.subscribe((p: unknown) => emittedProduct = p);

    // Click the add to cart button
    const button = debugEl.query(By.css('.add-to-cart-btn'));
    button.triggerEventHandler('click', null);

    expect(emittedProduct).toEqual(product);
  });

  it('should show discount badge when price is below 500', async () => {
    fixture.componentRef.setInput('product', { id: 1, name: 'Cheap Item', price: 199 });
    await fixture.whenStable();

    const badge = debugEl.query(By.css('.discount-badge'));
    expect(badge).toBeTruthy();
  });

  it('should NOT show discount badge when price is 500 or above', async () => {
    fixture.componentRef.setInput('product', { id: 1, name: 'Premium Item', price: 999 });
    await fixture.whenStable();

    const badge = debugEl.query(By.css('.discount-badge'));
    expect(badge).toBeNull();
  });
});
```

### 7.3.2 DOM 查詢方法

```typescript
// By.css — CSS selector (most common)
const el = debugEl.query(By.css('.my-class'));
const allEls = debugEl.queryAll(By.css('li'));

// By.directive — find elements with a specific directive
const tooltipEls = debugEl.queryAll(By.directive(TooltipDirective));

// nativeElement — access the raw DOM element
const native: HTMLElement = debugEl.query(By.css('button')).nativeElement;
expect(native.textContent).toBe('Click me');
expect(native.getAttribute('aria-label')).toBe('Submit form');
expect(native.classList.contains('active')).toBeTrue();

// Direct nativeElement access (simpler but less isolated)
const heading = fixture.nativeElement.querySelector('h1');
expect(heading.textContent).toContain('Title');
```

### 7.3.3 淺層測試 vs 深層測試

```typescript
// --- Shallow test: mock child components ---
// Useful when you only want to test the parent component's logic

@Component({
  selector: 'app-chart',
  template: '<div>Mock Chart</div>',
})
class MockChart {
  readonly data = input<number[]>();
}

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [DashboardPage],
  })
  .overrideComponent(DashboardPage, {
    remove: { imports: [RealChart] },
    add: { imports: [MockChart] },
  })
  .compileComponents();
});

// --- Deep test: use real child components ---
// Tests the full component tree interaction
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [DashboardPage], // RealChart is in DashboardPage's imports
  }).compileComponents();
});
```

### 7.3.4 測試使用者互動

```typescript
describe('SearchBar', () => {
  it('should emit search query on Enter key', async () => {
    fixture.componentRef.setInput('placeholder', '搜尋...');
    await fixture.whenStable();

    let emittedQuery = '';
    component.search.subscribe((q: string) => emittedQuery = q);

    // Type into input
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'Angular testing';
    input.dispatchEvent(new Event('input'));

    // Press Enter
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(emittedQuery).toBe('Angular testing');
  });

  it('should clear input when clear button is clicked', async () => {
    await fixture.whenStable();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'test query';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    const clearBtn = fixture.nativeElement.querySelector('.clear-btn');
    clearBtn.click();
    await fixture.whenStable();

    expect(input.value).toBe('');
  });
});
```

---

## 7.4 服務測試

### 7.4.1 不需 DI 的純服務測試

```typescript
// src/app/core/services/calculator.service.spec.ts

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    // No TestBed needed for pure services without dependencies
    service = new CalculatorService();
  });

  it('should add two numbers', () => {
    expect(service.add(2, 3)).toBe(5);
  });

  it('should calculate compound interest', () => {
    const result = service.compoundInterest(1000, 0.05, 10);
    expect(result).toBeCloseTo(1628.89, 2);
  });
});
```

### 7.4.2 使用 DI 的服務測試

```typescript
// src/app/features/products/product.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('ProductService', () => {
  let service: ProductService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),  // Must come AFTER provideHttpClient()
      ],
    });

    service = TestBed.inject(ProductService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify no unexpected HTTP requests were made
    httpTesting.verify();
  });

  it('should fetch products', () => {
    const mockProducts = [
      { id: 1, name: 'Product A', price: 100 },
      { id: 2, name: 'Product B', price: 200 },
    ];

    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
      expect(products.length).toBe(2);
    });

    // Assert that a single request was made and flush mock data
    const req = httpTesting.expectOne('/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should create a product', () => {
    const newProduct = { name: 'New Product', price: 300 };
    const savedProduct = { id: 3, ...newProduct };

    service.createProduct(newProduct).subscribe(product => {
      expect(product.id).toBe(3);
      expect(product.name).toBe('New Product');
    });

    const req = httpTesting.expectOne('/api/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(savedProduct);
  });
});
```

### 7.4.3 測試服務中的 Signals

```typescript
// src/app/core/services/counter.service.spec.ts

describe('CounterService', () => {
  let service: CounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CounterService],
    });
    service = TestBed.inject(CounterService);
  });

  it('should have initial count of 0', () => {
    expect(service.count()).toBe(0);
  });

  it('should increment count', () => {
    service.increment();
    expect(service.count()).toBe(1);

    service.increment();
    expect(service.count()).toBe(2);
  });

  it('should compute doubled value', () => {
    // Assuming: readonly doubled = computed(() => this.count() * 2);
    service.increment();
    service.increment();
    service.increment();

    expect(service.count()).toBe(3);
    expect(service.doubled()).toBe(6);
  });

  it('should reset count to 0', () => {
    service.increment();
    service.increment();
    service.reset();

    expect(service.count()).toBe(0);
    expect(service.doubled()).toBe(0);
  });
});
```

### 7.4.4 測試 Signal Store（狀態管理）

```typescript
// src/app/features/cart/cart.store.spec.ts
import { TestBed } from '@angular/core/testing';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

describe('CartStore', () => {
  let store: CartStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartStore],
    });
    store = TestBed.inject(CartStore);
  });

  it('should start with empty cart', () => {
    expect(store.items()).toEqual([]);
    expect(store.totalItems()).toBe(0);
    expect(store.totalPrice()).toBe(0);
  });

  it('should add item to cart', () => {
    store.addItem({ productId: 1, name: 'Book', price: 500, quantity: 1 });

    expect(store.items().length).toBe(1);
    expect(store.totalItems()).toBe(1);
    expect(store.totalPrice()).toBe(500);
  });

  it('should increase quantity for duplicate items', () => {
    store.addItem({ productId: 1, name: 'Book', price: 500, quantity: 1 });
    store.addItem({ productId: 1, name: 'Book', price: 500, quantity: 2 });

    expect(store.items().length).toBe(1);
    expect(store.items()[0].quantity).toBe(3);
    expect(store.totalPrice()).toBe(1500);
  });

  it('should remove item from cart', () => {
    store.addItem({ productId: 1, name: 'Book', price: 500, quantity: 1 });
    store.addItem({ productId: 2, name: 'Pen', price: 50, quantity: 3 });

    store.removeItem(1);

    expect(store.items().length).toBe(1);
    expect(store.items()[0].productId).toBe(2);
  });

  it('should clear all items', () => {
    store.addItem({ productId: 1, name: 'Book', price: 500, quantity: 1 });
    store.addItem({ productId: 2, name: 'Pen', price: 50, quantity: 3 });

    store.clearCart();

    expect(store.items()).toEqual([]);
    expect(store.totalPrice()).toBe(0);
  });
});
```

---

## 7.5 HTTP 測試

### 7.5.1 provideHttpClientTesting 設定

```typescript
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),           // Must come first
      provideHttpClientTesting(),    // Replaces real HTTP backend with mock
    ],
  });

  httpTesting = TestBed.inject(HttpTestingController);
});

// IMPORTANT: Always verify in afterEach
afterEach(() => {
  httpTesting.verify(); // Fails if there are outstanding (unflushed) requests
});
```

> **對應 .NET**：`provideHttpClientTesting()` 等同於使用 `MockHttpMessageHandler` 替換 `HttpClient` 的底層處理器。`httpTesting.verify()` 等同於 `Assert` 沒有未處理的請求。

### 7.5.2 expectOne() — 預期單一請求

```typescript
it('should fetch user by ID', () => {
  const mockUser = { id: 1, name: 'John', email: 'john@example.com' };

  service.getUser(1).subscribe(user => {
    expect(user).toEqual(mockUser);
  });

  // Match by URL string
  const req = httpTesting.expectOne('/api/users/1');
  expect(req.request.method).toBe('GET');

  // Flush the response
  req.flush(mockUser);
});

// Match by predicate function
it('should send correct query parameters', () => {
  service.searchUsers('john', 1, 20).subscribe();

  const req = httpTesting.expectOne(
    (request) =>
      request.url === '/api/users/search'
      && request.params.get('q') === 'john'
      && request.params.get('page') === '1'
      && request.params.get('size') === '20',
  );

  expect(req.request.method).toBe('GET');
  req.flush({ data: [], total: 0 });
});
```

### 7.5.3 模擬 HTTP 錯誤

```typescript
it('should handle 404 error', () => {
  service.getUser(999).subscribe({
    next: () => fail('Expected an error, not a success'),
    error: (error) => {
      expect(error.status).toBe(404);
      expect(error.statusText).toBe('Not Found');
    },
  });

  const req = httpTesting.expectOne('/api/users/999');
  req.flush('User not found', {
    status: 404,
    statusText: 'Not Found',
  });
});

it('should handle network error', () => {
  service.getUser(1).subscribe({
    next: () => fail('Expected an error'),
    error: (error) => {
      expect(error.status).toBe(0);
      expect(error.error instanceof ProgressEvent).toBeTrue();
    },
  });

  const req = httpTesting.expectOne('/api/users/1');
  req.error(new ProgressEvent('error'));
});

it('should handle server error with error body', () => {
  service.createUser({ name: 'Bad Data' }).subscribe({
    next: () => fail('Expected an error'),
    error: (error) => {
      expect(error.status).toBe(400);
      expect(error.error.message).toBe('Validation failed');
    },
  });

  const req = httpTesting.expectOne('/api/users');
  req.flush(
    { message: 'Validation failed', details: { name: ['Name is required'] } },
    { status: 400, statusText: 'Bad Request' },
  );
});
```

### 7.5.4 match() — 多重請求

```typescript
it('should handle batch requests', () => {
  // Service makes multiple parallel requests
  service.loadDashboard().subscribe(data => {
    expect(data.products.length).toBe(2);
    expect(data.orders.length).toBe(1);
  });

  // Match all requests to a specific URL pattern
  const productReqs = httpTesting.match(req => req.url.includes('/api/products'));
  expect(productReqs.length).toBe(1);
  productReqs[0].flush([{ id: 1 }, { id: 2 }]);

  const orderReqs = httpTesting.match(req => req.url.includes('/api/orders'));
  expect(orderReqs.length).toBe(1);
  orderReqs[0].flush([{ id: 1 }]);
});
```

### 7.5.5 驗證請求 Headers 與 Body

```typescript
it('should send Authorization header', () => {
  service.getProtectedData().subscribe();

  const req = httpTesting.expectOne('/api/protected');
  expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
  expect(req.request.headers.get('Content-Type')).toBe('application/json');
  req.flush({ data: 'secret' });
});

it('should send correct request body', () => {
  const newUser = { name: 'John', email: 'john@test.com' };
  service.createUser(newUser).subscribe();

  const req = httpTesting.expectOne('/api/users');
  expect(req.request.method).toBe('POST');
  expect(req.request.body).toEqual(newUser);
  req.flush({ id: 1, ...newUser });
});
```

### 7.5.6 expectNone() — 確認無請求

```typescript
it('should return cached data on second call', () => {
  // First call hits the API
  service.getProducts().subscribe();
  httpTesting.expectOne('/api/products').flush([]);

  // Second call should use cache — no HTTP request
  service.getProducts().subscribe();
  httpTesting.expectNone('/api/products'); // Passes if no request was made
});
```

---

## 7.6 路由測試

### 7.6.1 provideRouter() 搭配測試路由

```typescript
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

describe('ProductDetail route', () => {
  let harness: RouterTestingHarness;
  let mockProductService: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProduct']);

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'products/:id', component: ProductDetail },
          { path: '', component: ProductList },
        ]),
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compileComponents();

    harness = await RouterTestingHarness.create();
  });

  it('should display product details for given ID', async () => {
    mockProductService.getProduct.and.returnValue(
      of({ id: 42, name: 'Angular Book', price: 599 }),
    );

    // Navigate and get the routed component
    const component = await harness.navigateByUrl('/products/42', ProductDetail);

    expect(component).toBeTruthy();
    expect(mockProductService.getProduct).toHaveBeenCalledWith('42');

    // Check rendered content
    const title = harness.routeNativeElement?.querySelector('h1');
    expect(title?.textContent).toContain('Angular Book');
  });

  it('should navigate back to list on back button click', async () => {
    mockProductService.getProduct.and.returnValue(
      of({ id: 1, name: 'Test', price: 100 }),
    );

    await harness.navigateByUrl('/products/1', ProductDetail);

    // Simulate back button click
    const backBtn = harness.routeNativeElement?.querySelector('.back-btn') as HTMLElement;
    backBtn?.click();

    // Verify navigation
    const listComponent = await harness.navigateByUrl('/', ProductList);
    expect(listComponent).toBeTruthy();
  });
});
```

### 7.6.2 測試路由 Guard

```typescript
// src/app/core/guards/auth.guard.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

// Assuming a functional guard:
// export const authGuard: CanActivateFn = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);
//   return authService.isAuthenticated() ? true : router.createUrlTree(['/auth/login']);
// };

describe('authGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated: jasmine.createSpy().and.returnValue(false),
    });

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'dashboard',
            component: DashboardPage,
            canActivate: [authGuard],
          },
          { path: 'auth/login', component: LoginPage },
        ]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();
  });

  it('should redirect to login when not authenticated', async () => {
    (Object.getOwnPropertyDescriptor(mockAuthService, 'isAuthenticated')?.get as jasmine.Spy)
      .and.returnValue(false);

    const harness = await RouterTestingHarness.create();

    // Attempt to navigate to protected route
    await harness.navigateByUrl('/dashboard');

    // Should be redirected to login
    const router = TestBed.inject(Router);
    expect(router.url).toBe('/auth/login');
  });

  it('should allow access when authenticated', async () => {
    (Object.getOwnPropertyDescriptor(mockAuthService, 'isAuthenticated')?.get as jasmine.Spy)
      .and.returnValue(true);

    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/dashboard', DashboardPage);

    expect(component).toBeTruthy();
  });
});
```

### 7.6.3 測試路由 Resolver

```typescript
// Assuming: export const productResolver: ResolveFn<Product> = (route) => { ... }

describe('productResolver', () => {
  it('should resolve product data before navigation', async () => {
    const mockProduct = { id: 1, name: 'Test Product', price: 100 };
    const mockService = jasmine.createSpyObj('ProductService', ['getProduct']);
    mockService.getProduct.and.returnValue(of(mockProduct));

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'products/:id',
            component: ProductDetail,
            resolve: { product: productResolver },
          },
        ]),
        { provide: ProductService, useValue: mockService },
      ],
    }).compileComponents();

    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/products/1', ProductDetail);

    // The resolver should have been called
    expect(mockService.getProduct).toHaveBeenCalledWith('1');
  });
});
```

---

## 7.7 Directive 與 Pipe 測試

### 7.7.1 Directive 測試 — Host Component 模式

```typescript
// src/app/shared/directives/highlight.directive.spec.ts
import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HighlightDirective } from './highlight.directive';

// Create a test host component
@Component({
  imports: [HighlightDirective],
  template: `
    <p appHighlight="yellow">Highlighted text</p>
    <p appHighlight>Default highlight</p>
    <p>No highlight</p>
  `,
})
class TestHost {}

describe('HighlightDirective', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  it('should highlight with specified color', () => {
    const elements = fixture.debugElement.queryAll(By.directive(HighlightDirective));

    expect(elements.length).toBe(2);
    expect(elements[0].nativeElement.style.backgroundColor).toBe('yellow');
  });

  it('should use default color when no color specified', () => {
    const elements = fixture.debugElement.queryAll(By.directive(HighlightDirective));

    // Default highlight color (e.g., 'lightblue')
    expect(elements[1].nativeElement.style.backgroundColor).toBe('lightblue');
  });

  it('should not affect elements without the directive', () => {
    const allParagraphs = fixture.debugElement.queryAll(By.css('p'));
    const lastP = allParagraphs[2].nativeElement;

    expect(lastP.style.backgroundColor).toBe('');
  });
});
```

### 7.7.2 Attribute Directive 測試

```typescript
// Testing a tooltip directive
@Component({
  imports: [TooltipDirective],
  template: `<button [appTooltip]="'Hello tooltip'" [tooltipPosition]="'top'">Hover me</button>`,
})
class TooltipTestHost {}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<TooltipTestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipTestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipTestHost);
    await fixture.whenStable();
  });

  it('should show tooltip on mouseenter', () => {
    const button = fixture.debugElement.query(By.css('button'));

    button.triggerEventHandler('mouseenter', {});
    fixture.detectChanges();

    const tooltip = document.querySelector('.tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Hello tooltip');
  });

  it('should hide tooltip on mouseleave', () => {
    const button = fixture.debugElement.query(By.css('button'));

    button.triggerEventHandler('mouseenter', {});
    fixture.detectChanges();

    button.triggerEventHandler('mouseleave', {});
    fixture.detectChanges();

    const tooltip = document.querySelector('.tooltip');
    expect(tooltip).toBeNull();
  });
});
```

### 7.7.3 Pipe 測試

Pipe 測試通常不需要 TestBed，因為它們是純函式：

```typescript
// src/app/shared/pipes/file-size.pipe.spec.ts

describe('FileSizePipe', () => {
  let pipe: FileSizePipe;

  beforeEach(() => {
    pipe = new FileSizePipe();
  });

  it('should transform bytes to human-readable format', () => {
    expect(pipe.transform(0)).toBe('0 B');
    expect(pipe.transform(1023)).toBe('1023 B');
    expect(pipe.transform(1024)).toBe('1.00 KB');
    expect(pipe.transform(1048576)).toBe('1.00 MB');
    expect(pipe.transform(1073741824)).toBe('1.00 GB');
  });

  it('should handle custom decimal places', () => {
    expect(pipe.transform(1536, 1)).toBe('1.5 KB');
    expect(pipe.transform(1536, 0)).toBe('2 KB');
    expect(pipe.transform(1536, 3)).toBe('1.500 KB');
  });

  it('should handle negative values', () => {
    expect(pipe.transform(-1)).toBe('0 B');
  });

  it('should handle null and undefined', () => {
    expect(pipe.transform(null as unknown as number)).toBe('0 B');
    expect(pipe.transform(undefined as unknown as number)).toBe('0 B');
  });
});
```

### 7.7.4 使用 DI 的 Pipe 測試

```typescript
// If a pipe depends on a service:
describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['translate']);
    mockTranslateService.translate.and.callFake(
      (key: string) => key === 'HELLO' ? '你好' : key,
    );

    TestBed.configureTestingModule({
      providers: [
        TranslatePipe,
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    });

    pipe = TestBed.inject(TranslatePipe);
  });

  it('should translate known keys', () => {
    expect(pipe.transform('HELLO')).toBe('你好');
  });

  it('should return key for unknown translations', () => {
    expect(pipe.transform('UNKNOWN_KEY')).toBe('UNKNOWN_KEY');
  });
});
```

---

## 7.8 整合測試

### 7.8.1 多元件互動測試

```typescript
// Test the interaction between a parent form and child components
describe('CheckoutPage Integration', () => {
  let fixture: ComponentFixture<CheckoutPage>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockOrderService: jasmine.SpyObj<OrderService>;

  const mockCartItems = [
    { productId: 1, name: 'Book', price: 500, quantity: 2 },
    { productId: 2, name: 'Pen', price: 50, quantity: 5 },
  ];

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', [], {
      items: jasmine.createSpy().and.returnValue(mockCartItems),
      totalPrice: jasmine.createSpy().and.returnValue(1250),
    });

    mockOrderService = jasmine.createSpyObj('OrderService', ['placeOrder']);
    mockOrderService.placeOrder.and.returnValue(of({ orderId: 'ORD-001' }));

    await TestBed.configureTestingModule({
      imports: [CheckoutPage], // Includes CartSummary, AddressForm, PaymentForm
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CartService, useValue: mockCartService },
        { provide: OrderService, useValue: mockOrderService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutPage);
    await fixture.whenStable();
  });

  it('should display cart items from CartSummary component', () => {
    const items = fixture.nativeElement.querySelectorAll('.cart-item');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Book');
    expect(items[1].textContent).toContain('Pen');
  });

  it('should display total price', () => {
    const total = fixture.nativeElement.querySelector('.total-price');
    expect(total.textContent).toContain('1,250');
  });

  it('should enable submit button when all forms are valid', async () => {
    // Fill in address form
    const addressInputs = fixture.nativeElement.querySelectorAll('.address-form input');
    fillInput(addressInputs[0], '台北市信義區');
    fillInput(addressInputs[1], '110');

    // Fill in payment form
    const paymentInputs = fixture.nativeElement.querySelectorAll('.payment-form input');
    fillInput(paymentInputs[0], '4111111111111111');
    fillInput(paymentInputs[1], '12/26');

    await fixture.whenStable();

    const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.submit-order-btn');
    expect(submitBtn.disabled).toBeFalse();
  });

  it('should call OrderService.placeOrder on submit', async () => {
    // Fill forms... (abbreviated)
    await fillAllForms(fixture);

    const submitBtn = fixture.nativeElement.querySelector('.submit-order-btn');
    submitBtn.click();
    await fixture.whenStable();

    expect(mockOrderService.placeOrder).toHaveBeenCalledTimes(1);
  });
});

// Helper functions
function fillInput(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input'));
  input.dispatchEvent(new Event('blur'));
}
```

### 7.8.2 Parent-Child 通訊測試

```typescript
describe('TodoList + TodoItem interaction', () => {
  let fixture: ComponentFixture<TodoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoList, TodoItem], // Both real components
    }).compileComponents();

    fixture = TestBed.createComponent(TodoList);
    fixture.componentRef.setInput('todos', [
      { id: 1, text: 'Learn Angular', completed: false },
      { id: 2, text: 'Write Tests', completed: true },
    ]);
    await fixture.whenStable();
  });

  it('should render TodoItem for each todo', () => {
    const items = fixture.debugElement.queryAll(By.directive(TodoItem));
    expect(items.length).toBe(2);
  });

  it('should toggle todo when TodoItem emits toggle event', async () => {
    let toggledId: number | null = null;
    fixture.componentInstance.todoToggled.subscribe((id: number) => toggledId = id);

    const firstItem = fixture.debugElement.query(By.directive(TodoItem));
    const checkbox = firstItem.query(By.css('input[type="checkbox"]'));
    checkbox.nativeElement.click();
    await fixture.whenStable();

    expect(toggledId).toBe(1);
  });

  it('should remove todo when TodoItem emits delete event', async () => {
    const items = fixture.debugElement.queryAll(By.directive(TodoItem));
    const deleteBtn = items[0].query(By.css('.delete-btn'));
    deleteBtn.nativeElement.click();

    await fixture.whenStable();

    const remainingItems = fixture.debugElement.queryAll(By.directive(TodoItem));
    expect(remainingItems.length).toBe(1);
  });
});
```

---

## 7.9 覆蓋率

### 7.9.1 執行覆蓋率報告

```bash
# Run tests with coverage
ng test --code-coverage

# The report is generated in ./coverage/
# Open coverage/index.html in a browser to view the report
```

### 7.9.2 karma.conf.js 覆蓋率設定

```javascript
// karma.conf.js
module.exports = function (config) {
  config.set({
    // ...
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },      // HTML report for browser viewing
        { type: 'text-summary' }, // Console summary
        { type: 'lcovonly' },   // For CI/CD integration
        { type: 'cobertura' },  // For CI/CD tools like Jenkins
      ],
      check: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
        // Per-file thresholds (optional)
        each: {
          statements: 70,
          branches: 60,
          functions: 70,
          lines: 70,
        },
      },
    },
  });
};
```

### 7.9.3 在 angular.json 中設定覆蓋率門檻

```json
{
  "test": {
    "builder": "@angular-devkit/build-angular:karma",
    "options": {
      "codeCoverage": true,
      "codeCoverageExclude": [
        "src/test-setup.ts",
        "**/*.spec.ts",
        "**/*.mock.ts",
        "src/environments/**"
      ]
    }
  }
}
```

### 7.9.4 CI/CD 整合

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - run: npm ci
      - run: npx ng test --watch=false --code-coverage --browsers=ChromeHeadless

      - name: Check coverage thresholds
        run: |
          # Parse coverage summary and fail if below threshold
          npx istanbul check-coverage --statements 80 --branches 80 --functions 80 --lines 80
```

---

## 7.10 Signal 元件測試

### 7.10.1 測試 input() Signal

```typescript
// Component under test:
// @Component({...})
// export class UserCard {
//   readonly name = input.required<string>();
//   readonly email = input('');
//   readonly role = input<'admin' | 'user'>('user');
// }

describe('UserCard', () => {
  let fixture: ComponentFixture<UserCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCard],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCard);
  });

  it('should display the user name from input signal', async () => {
    // Use setInput() to set signal input values
    fixture.componentRef.setInput('name', 'John Doe');
    fixture.componentRef.setInput('email', 'john@example.com');
    await fixture.whenStable();

    const nameEl = fixture.nativeElement.querySelector('.user-name');
    expect(nameEl.textContent).toContain('John Doe');
  });

  it('should use default role value', async () => {
    fixture.componentRef.setInput('name', 'Test User');
    await fixture.whenStable();

    // role has default value 'user'
    const roleEl = fixture.nativeElement.querySelector('.user-role');
    expect(roleEl.textContent).toContain('user');
  });

  it('should update display when input changes', async () => {
    fixture.componentRef.setInput('name', 'Old Name');
    await fixture.whenStable();

    let nameEl = fixture.nativeElement.querySelector('.user-name');
    expect(nameEl.textContent).toContain('Old Name');

    // Update the input
    fixture.componentRef.setInput('name', 'New Name');
    await fixture.whenStable();

    nameEl = fixture.nativeElement.querySelector('.user-name');
    expect(nameEl.textContent).toContain('New Name');
  });
});
```

### 7.10.2 測試 output() Signal

```typescript
// Component under test:
// export class ConfirmDialog {
//   readonly title = input.required<string>();
//   readonly confirmed = output<void>();
//   readonly cancelled = output<void>();
// }

describe('ConfirmDialog', () => {
  let fixture: ComponentFixture<ConfirmDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialog);
    fixture.componentRef.setInput('title', '確認刪除？');
    await fixture.whenStable();
  });

  it('should emit confirmed when confirm button is clicked', () => {
    let wasConfirmed = false;
    fixture.componentInstance.confirmed.subscribe(() => wasConfirmed = true);

    const confirmBtn = fixture.nativeElement.querySelector('.confirm-btn');
    confirmBtn.click();

    expect(wasConfirmed).toBeTrue();
  });

  it('should emit cancelled when cancel button is clicked', () => {
    let wasCancelled = false;
    fixture.componentInstance.cancelled.subscribe(() => wasCancelled = true);

    const cancelBtn = fixture.nativeElement.querySelector('.cancel-btn');
    cancelBtn.click();

    expect(wasCancelled).toBeTrue();
  });
});
```

### 7.10.3 測試 computed() Signal

```typescript
// Component under test:
// export class PriceCalculator {
//   readonly price = input.required<number>();
//   readonly quantity = input(1);
//   readonly taxRate = input(0.05);
//
//   protected readonly subtotal = computed(() => this.price() * this.quantity());
//   protected readonly tax = computed(() => this.subtotal() * this.taxRate());
//   protected readonly total = computed(() => this.subtotal() + this.tax());
// }

describe('PriceCalculator', () => {
  let fixture: ComponentFixture<PriceCalculator>;
  let component: PriceCalculator;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceCalculator],
    }).compileComponents();

    fixture = TestBed.createComponent(PriceCalculator);
    component = fixture.componentInstance;
  });

  it('should calculate subtotal from price and quantity', async () => {
    fixture.componentRef.setInput('price', 100);
    fixture.componentRef.setInput('quantity', 3);
    await fixture.whenStable();

    const subtotal = fixture.nativeElement.querySelector('.subtotal');
    expect(subtotal.textContent).toContain('300');
  });

  it('should calculate tax with default rate', async () => {
    fixture.componentRef.setInput('price', 1000);
    fixture.componentRef.setInput('quantity', 1);
    await fixture.whenStable();

    const tax = fixture.nativeElement.querySelector('.tax');
    expect(tax.textContent).toContain('50'); // 1000 * 0.05
  });

  it('should recalculate when inputs change', async () => {
    fixture.componentRef.setInput('price', 100);
    fixture.componentRef.setInput('quantity', 2);
    await fixture.whenStable();

    let total = fixture.nativeElement.querySelector('.total');
    expect(total.textContent).toContain('210'); // (100*2) + (200*0.05)

    // Update quantity
    fixture.componentRef.setInput('quantity', 5);
    await fixture.whenStable();

    total = fixture.nativeElement.querySelector('.total');
    expect(total.textContent).toContain('525'); // (100*5) + (500*0.05)
  });
});
```

### 7.10.4 測試 model() 雙向繫結

```typescript
// Component under test:
// export class RatingStars {
//   readonly value = model(0);
//   readonly max = input(5);
// }

describe('RatingStars', () => {
  let fixture: ComponentFixture<RatingStars>;
  let component: RatingStars;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingStars],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingStars);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should display stars based on max input', async () => {
    fixture.componentRef.setInput('max', 5);
    await fixture.whenStable();

    const stars = fixture.nativeElement.querySelectorAll('.star');
    expect(stars.length).toBe(5);
  });

  it('should update model when star is clicked', async () => {
    fixture.componentRef.setInput('max', 5);
    await fixture.whenStable();

    // model() emits changes
    let emittedValue = 0;
    component.value.subscribe((v: number) => emittedValue = v);

    const stars = fixture.nativeElement.querySelectorAll('.star');
    stars[2].click(); // Click 3rd star
    await fixture.whenStable();

    expect(component.value()).toBe(3);
  });
});
```

---

## 7.11 完整範例：AuthService + UserProfileCard 測試

### 7.11.1 AuthService 測試

```typescript
// src/app/core/services/auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  const mockLoginResponse = {
    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...',
    refreshToken: 'refresh-token-xyz',
    expiresAt: Date.now() + 3600_000, // 1 hour from now
  };

  const mockUser = {
    id: 1,
    username: 'john',
    email: 'john@example.com',
    displayName: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  // --- Authentication state ---
  describe('initial state', () => {
    it('should not be authenticated initially', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should have null access token initially', () => {
      expect(service.accessToken()).toBeNull();
    });

    it('should have null current user initially', () => {
      expect(service.currentUser()).toBeNull();
    });
  });

  // --- Login ---
  describe('login', () => {
    it('should authenticate on successful login', () => {
      service.login('john', 'password123').subscribe(result => {
        expect(result).toBeTrue();
      });

      const loginReq = httpTesting.expectOne('/api/auth/login');
      expect(loginReq.request.method).toBe('POST');
      expect(loginReq.request.body).toEqual({ username: 'john', password: 'password123' });
      loginReq.flush(mockLoginResponse);

      expect(service.isAuthenticated()).toBeTrue();
      expect(service.accessToken()).toBe(mockLoginResponse.accessToken);
    });

    it('should persist tokens to localStorage', () => {
      service.login('john', 'password123').subscribe();

      httpTesting.expectOne('/api/auth/login').flush(mockLoginResponse);

      const stored = localStorage.getItem('auth_tokens');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.accessToken).toBe(mockLoginResponse.accessToken);
    });

    it('should handle login failure', () => {
      service.login('wrong', 'password').subscribe({
        next: () => fail('Expected error'),
        error: (err) => {
          expect(err.status).toBe(401);
        },
      });

      httpTesting.expectOne('/api/auth/login').flush(
        { message: 'Invalid credentials' },
        { status: 401, statusText: 'Unauthorized' },
      );

      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should fetch user profile after successful login', () => {
      service.login('john', 'password123').subscribe();

      // First: login request
      httpTesting.expectOne('/api/auth/login').flush(mockLoginResponse);

      // Then: profile request (triggered automatically after login)
      const profileReq = httpTesting.expectOne('/api/auth/me');
      expect(profileReq.request.headers.get('Authorization'))
        .toBe(`Bearer ${mockLoginResponse.accessToken}`);
      profileReq.flush(mockUser);

      expect(service.currentUser()).toEqual(mockUser);
    });
  });

  // --- Logout ---
  describe('logout', () => {
    it('should clear authentication state', () => {
      // Setup: login first
      service.login('john', 'password123').subscribe();
      httpTesting.expectOne('/api/auth/login').flush(mockLoginResponse);
      httpTesting.expectOne('/api/auth/me').flush(mockUser);

      // Act: logout
      service.logout();

      // Assert
      expect(service.isAuthenticated()).toBeFalse();
      expect(service.accessToken()).toBeNull();
      expect(service.currentUser()).toBeNull();
      expect(localStorage.getItem('auth_tokens')).toBeNull();
    });
  });

  // --- Session restore ---
  describe('restoreSession', () => {
    it('should restore session from valid localStorage data', () => {
      localStorage.setItem('auth_tokens', JSON.stringify(mockLoginResponse));

      service.restoreSession();

      expect(service.isAuthenticated()).toBeTrue();
      expect(service.accessToken()).toBe(mockLoginResponse.accessToken);
    });

    it('should not restore expired session', () => {
      const expiredTokens = {
        ...mockLoginResponse,
        expiresAt: Date.now() - 1000, // Already expired
      };
      localStorage.setItem('auth_tokens', JSON.stringify(expiredTokens));

      service.restoreSession();

      expect(service.isAuthenticated()).toBeFalse();
      expect(localStorage.getItem('auth_tokens')).toBeNull(); // Should be cleared
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('auth_tokens', 'not-valid-json');

      expect(() => service.restoreSession()).not.toThrow();
      expect(service.isAuthenticated()).toBeFalse();
    });
  });
});
```

### 7.11.2 UserProfileCard 測試

```typescript
// src/app/features/user/user-profile-card.spec.ts
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { UserProfileCard } from './user-profile-card';
import { AuthService } from '../../core/services/auth.service';

describe('UserProfileCard', () => {
  let fixture: ComponentFixture<UserProfileCard>;
  let component: UserProfileCard;

  // Create mock signals for AuthService
  const mockUser = signal<{ displayName: string; email: string; avatar: string } | null>(null);
  const mockIsAuthenticated = signal(false);

  const mockAuthService = {
    currentUser: mockUser.asReadonly(),
    isAuthenticated: mockIsAuthenticated.asReadonly(),
    logout: jasmine.createSpy('logout'),
  };

  beforeEach(async () => {
    // Reset signals before each test
    mockUser.set(null);
    mockIsAuthenticated.set(false);
    mockAuthService.logout.calls.reset();

    await TestBed.configureTestingModule({
      imports: [UserProfileCard],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileCard);
    component = fixture.componentInstance;
  });

  describe('when not authenticated', () => {
    it('should show login button', async () => {
      await fixture.whenStable();

      const loginBtn = fixture.nativeElement.querySelector('.login-btn');
      expect(loginBtn).toBeTruthy();

      const profileSection = fixture.nativeElement.querySelector('.profile-section');
      expect(profileSection).toBeNull();
    });
  });

  describe('when authenticated', () => {
    beforeEach(async () => {
      mockIsAuthenticated.set(true);
      mockUser.set({
        displayName: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg',
      });
      await fixture.whenStable();
    });

    it('should display user name', () => {
      const name = fixture.nativeElement.querySelector('.user-display-name');
      expect(name.textContent).toContain('John Doe');
    });

    it('should display user email', () => {
      const email = fixture.nativeElement.querySelector('.user-email');
      expect(email.textContent).toContain('john@example.com');
    });

    it('should display avatar image', () => {
      const avatar: HTMLImageElement = fixture.nativeElement.querySelector('.user-avatar');
      expect(avatar).toBeTruthy();
      expect(avatar.src).toContain('avatar.jpg');
      expect(avatar.alt).toContain('John Doe');
    });

    it('should show logout button', () => {
      const logoutBtn = fixture.nativeElement.querySelector('.logout-btn');
      expect(logoutBtn).toBeTruthy();
    });

    it('should call AuthService.logout on logout button click', async () => {
      const logoutBtn = fixture.nativeElement.querySelector('.logout-btn');
      logoutBtn.click();
      await fixture.whenStable();

      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });

    it('should update display when user data changes', async () => {
      // Initial state
      let name = fixture.nativeElement.querySelector('.user-display-name');
      expect(name.textContent).toContain('John Doe');

      // Update user data
      mockUser.set({
        displayName: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'https://example.com/jane.jpg',
      });
      await fixture.whenStable();

      name = fixture.nativeElement.querySelector('.user-display-name');
      expect(name.textContent).toContain('Jane Smith');
    });
  });

  describe('accessibility', () => {
    beforeEach(async () => {
      mockIsAuthenticated.set(true);
      mockUser.set({
        displayName: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg',
      });
      await fixture.whenStable();
    });

    it('should have proper ARIA attributes', () => {
      const card = fixture.nativeElement.querySelector('.profile-card');
      expect(card.getAttribute('role')).toBe('region');
      expect(card.getAttribute('aria-label')).toContain('使用者資料');
    });

    it('should have accessible logout button', () => {
      const logoutBtn = fixture.nativeElement.querySelector('.logout-btn');
      expect(logoutBtn.getAttribute('aria-label')).toBeTruthy();
    });

    it('should have alt text on avatar', () => {
      const avatar: HTMLImageElement = fixture.nativeElement.querySelector('.user-avatar');
      expect(avatar.alt).toBeTruthy();
      expect(avatar.alt.length).toBeGreaterThan(0);
    });
  });
});
```

---

## 7.12 常見陷阱

### 陷阱 1：使用 fixture.detectChanges() 而非 await fixture.whenStable()

```typescript
// ❌ Bad — may not trigger change detection for OnPush or async operations
it('should display data', () => {
  fixture.detectChanges();  // Synchronous, may miss async updates
  expect(...).toBe(...);
});

// ✅ Good — waits for all async operations and triggers change detection
it('should display data', async () => {
  await fixture.whenStable();  // Handles async + change detection
  expect(...).toBe(...);
});
```

### 陷阱 2：忘記 httpTesting.verify()

```typescript
// ❌ Bad — unverified HTTP requests may indicate bugs
afterEach(() => {
  // Missing httpTesting.verify()!
});

// ✅ Good — always verify no outstanding requests
afterEach(() => {
  httpTesting.verify(); // Fails if there are unflushed requests
});
```

### 陷阱 3：provideHttpClientTesting() 順序錯誤

```typescript
// ❌ Bad — testing module may not properly override the real HTTP backend
providers: [
  provideHttpClientTesting(),  // Wrong order!
  provideHttpClient(),
]

// ✅ Good — provideHttpClient() must come first
providers: [
  provideHttpClient(),           // First: setup real HTTP
  provideHttpClientTesting(),    // Then: override with test backend
]
```

### 陷阱 4：測試實作細節而非行為

```typescript
// ❌ Bad — testing implementation details (internal signals)
it('should set loading signal to true', () => {
  component.loadData();
  expect(component['loading']()).toBeTrue(); // Accessing private member!
});

// ✅ Good — test the observable behavior in the DOM
it('should show loading spinner while loading', async () => {
  // Trigger loading
  component.loadData();
  await fixture.whenStable();

  const spinner = fixture.nativeElement.querySelector('.loading-spinner');
  expect(spinner).toBeTruthy();
});
```

### 陷阱 5：共享可變狀態

```typescript
// ❌ Bad — shared mutable state between tests
const sharedData: string[] = [];

it('test 1', () => {
  sharedData.push('test1');
  expect(sharedData.length).toBe(1);
});

it('test 2', () => {
  // This depends on test 1's execution! Fails if run in isolation.
  expect(sharedData.length).toBe(0); // FAILS — actually 1!
});

// ✅ Good — fresh state for each test
let data: string[];

beforeEach(() => {
  data = []; // Reset before each test
});
```

### 陷阱 6：未清理 localStorage / sessionStorage

```typescript
// ❌ Bad — leftover data from previous tests
it('should persist data', () => {
  localStorage.setItem('key', 'value');
  // Test passes, but data leaks to next test
});

// ✅ Good — clean up in afterEach
afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
```

### 陷阱 7：忽略非同步測試的錯誤

```typescript
// ❌ Bad — async errors may go unnoticed
it('should handle error', async () => {
  service.doSomething().subscribe(); // Error not caught!
  // Test passes even if observable errors
});

// ✅ Good — explicitly test error path
it('should handle error', async () => {
  service.doSomething().subscribe({
    next: () => fail('Expected error, not success'),
    error: (err) => expect(err.message).toBe('Expected error'),
  });
});
```

### 陷阱 8：過度 Mock

```typescript
// ❌ Bad — mocking everything, test doesn't actually test anything useful
it('should process order', () => {
  const mockEverything = jasmine.createSpyObj('Service', ['a', 'b', 'c', 'd', 'e']);
  mockEverything.a.and.returnValue('expected result');
  // You're basically testing that your mock returns what you told it to return

  expect(mockEverything.a()).toBe('expected result'); // Useless assertion
});

// ✅ Good — mock only external dependencies, test real logic
it('should calculate order total with tax', () => {
  const mockTaxApi = jasmine.createSpyObj('TaxService', ['getRate']);
  mockTaxApi.getRate.and.returnValue(of(0.05)); // Only mock external dependency

  const orderService = new OrderService(mockTaxApi);  // Real service logic
  orderService.calculateTotal(1000).subscribe(total => {
    expect(total).toBe(1050); // Tests real calculation logic
  });
});
```

---

## 本章重點回顧

| 概念 | .NET 對應 | Angular 19+ |
|---|---|---|
| 測試框架 | xUnit / NUnit | Jasmine + Karma |
| 測試 DI 容器 | `WebApplicationFactory` | `TestBed.configureTestingModule()` |
| Mock 物件 | Moq `Mock<T>` | `jasmine.createSpyObj()` |
| HTTP Mock | `MockHttpMessageHandler` | `HttpTestingController` |
| 覆蓋率工具 | Coverlet | Istanbul |
| 覆蓋率門檻 | `.runsettings` | `karma.conf.js` thresholds |
| 斷言 | `Assert.Equal()` | `expect().toBe()` |
| 路由測試 | `TestServer.CreateClient()` | `RouterTestingHarness` |

**下一章**：[第八章：Performance — 效能優化](./08-performance.md)，我們將學習 OnPush、Zoneless、@defer、延遲載入、SSR 與效能分析工具。
