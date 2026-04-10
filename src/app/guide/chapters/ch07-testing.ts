import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GuidePage } from '../shared/guide-page';
import { GuideChapter } from '../models/guide-chapter';

const CHAPTER: GuideChapter = {
  id: 'testing',
  number: 7,
  title: '測試策略',
  subtitle: '單元測試、元件測試、HTTP Mock、覆蓋率',
  icon: 'science',
  category: 'advanced',
  tags: ['Jasmine', 'Karma', 'TestBed', 'HttpTesting', 'Coverage'],
  estimatedMinutes: 50,
  sections: [
    // ─── Section 1: 測試框架 ───
    {
      id: 'test-framework',
      title: '測試框架',
      content: `
        <p>Angular 預設使用 <strong>Jasmine</strong> 作為測試撰寫框架，
        搭配 <strong>Karma</strong> 作為測試執行器。Jasmine 提供了
        <code>describe()</code>、<code>it()</code>、<code>expect()</code> 等 API
        來組織和撰寫測試案例。</p>

        <p>Angular 特有的測試工具是 <code>TestBed</code>——一個強大的測試用依賴注入容器。
        它模擬了一個迷你的 Angular 模組環境，讓你可以：</p>
        <ul>
          <li>建立元件實例並取得 <code>ComponentFixture</code> 來操作 DOM</li>
          <li>提供 mock 服務取代真實依賴</li>
          <li>設定測試專用的路由、HTTP mock 等基礎建設</li>
        </ul>

        <p><code>TestBed.configureTestingModule()</code> 是每個測試的起點。
        它接受類似 <code>@Component</code> 裝飾器的 metadata 物件，
        讓你宣告要測試的元件和提供的依賴。在 Angular 20+ 的獨立元件時代，
        設定變得更簡單——不需要宣告 NgModule，直接設定 providers 即可。</p>

        <p>測試的基本結構遵循 <strong>AAA 模式</strong>：Arrange（準備）、Act（執行）、Assert（斷言）。
        <code>beforeEach()</code> 用於 Arrange 階段的共用設定，
        <code>it()</code> 區塊中執行 Act 和 Assert。</p>

        <p>Angular CLI 使用 <code>ng test</code> 指令啟動 Karma，
        它會開啟瀏覽器視窗執行測試並即時回報結果。
        加上 <code>--watch=false</code> 參數可在 CI 環境中執行一次性測試。</p>

        <p>近年來也有團隊遷移到 <strong>Jest</strong> 或 <strong>Vitest</strong> 等替代方案，
        但 Jasmine + Karma 仍是官方預設且文件最完整的選擇。</p>
      `,
      codeExamples: [
        {
          filename: 'calculator.service.spec.ts',
          language: 'typescript',
          code: `import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add two numbers', () => {
    // Arrange — done in beforeEach
    // Act
    const result = service.add(2, 3);
    // Assert
    expect(result).toBe(5);
  });

  it('should throw on division by zero', () => {
    expect(() => service.divide(10, 0)).toThrowError('Division by zero');
  });
});`,
          annotation: '基本的服務測試結構：TestBed 設定、AAA 模式、正向與異常測試。',
        },
        {
          filename: 'terminal',
          language: 'bash',
          code: `# Run all tests in watch mode (default)
ng test

# Run once for CI (no browser window)
ng test --watch=false --browsers=ChromeHeadless

# Run tests for a specific file
ng test --include='**/calculator*.spec.ts'`,
          annotation: '常用的 ng test 指令：開發模式、CI 模式、指定檔案。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: 'Angular 的 TestBed 類似 .NET 的 WebApplicationFactory<T> 或 ServiceCollection + BuildServiceProvider()。兩者都建立一個測試用的 DI 容器。Jasmine 的 describe/it 對應 xUnit 的 [Fact]/[Theory]，expect() 對應 Assert.Equal()。',
        },
        {
          type: 'tip',
          content: 'Angular 20+ 的獨立元件讓 TestBed 設定大幅簡化。不需要宣告 imports: [Module]，只需提供必要的 mock providers。元件會自動匯入自身的依賴。',
        },
      ],
    },

    // ─── Section 2: 元件測試 ───
    {
      id: 'component-testing',
      title: '元件測試',
      content: `
        <p>元件測試是 Angular 測試中最常見也最重要的類型。
        透過 <code>TestBed.createComponent()</code> 建立元件實例，
        取得 <code>ComponentFixture</code> 物件來操作 DOM 和驗證渲染結果。</p>

        <p><code>ComponentFixture</code> 提供的關鍵 API：</p>
        <ul>
          <li><code>fixture.componentInstance</code>：存取元件類別實例，可直接操作 Signal、呼叫方法</li>
          <li><code>fixture.nativeElement</code>：存取原生 DOM 元素，使用 <code>querySelector()</code> 查詢</li>
          <li><code>fixture.debugElement</code>：Angular 包裝的 DOM 元素，提供 <code>query()</code> 和 <code>triggerEventHandler()</code></li>
          <li><code>fixture.whenStable()</code>：等待所有非同步操作完成（取代 <code>detectChanges()</code>）</li>
        </ul>

        <p>在 Angular 20+ 中，推薦使用 <code>await fixture.whenStable()</code>
        取代 <code>fixture.detectChanges()</code> 來觸發變更偵測。
        <code>whenStable()</code> 不僅觸發變更偵測，還會等待所有非同步操作完成，
        提供更可靠的測試結果。</p>

        <p>測試 Signal 輸入（<code>input()</code>）時，使用
        <code>fixture.componentRef.setInput('name', value)</code>
        來設定輸入值，而非直接存取 Signal。這確保了 Angular 的變更偵測機制能正確追蹤輸入變更。</p>

        <p>對於元件中注入的服務，使用 <code>TestBed.inject()</code> 取得實例後
        透過 Jasmine 的 <code>spyOn()</code> 來模擬方法行為。
        或者提供完整的 mock 物件透過 <code>{ provide: Service, useValue: mockService }</code>。</p>

        <p>DOM 查詢建議使用 <code>data-testid</code> 屬性或 ARIA 角色來選取元素，
        而非 CSS 類名或標籤名，這讓測試對樣式重構更具韌性。</p>
      `,
      codeExamples: [
        {
          filename: 'greeting.spec.ts',
          language: 'typescript',
          code: `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Greeting } from './greeting';

describe('Greeting', () => {
  let fixture: ComponentFixture<Greeting>;
  let component: Greeting;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Greeting],
    }).compileComponents();

    fixture = TestBed.createComponent(Greeting);
    component = fixture.componentInstance;
  });

  it('should render the user name', async () => {
    // Set signal input via ComponentRef
    fixture.componentRef.setInput('userName', 'Alice');
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Hello, Alice');
  });

  it('should emit saved event on button click', async () => {
    fixture.componentRef.setInput('userName', 'Bob');
    await fixture.whenStable();

    // Subscribe to output before triggering
    const emitted: string[] = [];
    component.saved.subscribe((name: string) => emitted.push(name));

    // Click the save button
    const btn = fixture.nativeElement.querySelector('[data-testid="save-btn"]') as HTMLButtonElement;
    btn.click();
    await fixture.whenStable();

    expect(emitted).toEqual(['Bob']);
  });

  it('should show error message when name is empty', async () => {
    fixture.componentRef.setInput('userName', '');
    await fixture.whenStable();

    const error = fixture.nativeElement.querySelector('.error');
    expect(error?.textContent).toContain('名稱不可為空');
  });
});`,
          annotation: '元件測試：setInput 設定 Signal 輸入、whenStable 觸發變更偵測、data-testid 選取 DOM 元素。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: 'Angular 的 ComponentFixture 類似 .NET Blazor 的 bUnit TestContext。兩者都能渲染元件、設定參數、查詢 DOM、觸發事件。bUnit 的 component.Find() 對應 fixture.nativeElement.querySelector()。',
        },
        {
          type: 'warning',
          content: '在 Angular 20+ 中不要使用 fixture.detectChanges()，改用 await fixture.whenStable()。detectChanges() 是同步的且不會等待非同步操作完成，容易導致測試間歇性失敗。',
        },
      ],
    },

    // ─── Section 3: 服務測試 ───
    {
      id: 'service-testing',
      title: '服務測試',
      content: `
        <p>服務是 Angular 應用中商業邏輯的主要載體，也是最容易測試的部分。
        根據服務是否有依賴注入，測試策略分為兩種。</p>

        <p><strong>無依賴的服務</strong>可以直接實例化：</p>
        <ul>
          <li>使用 <code>new Service()</code> 或 <code>TestBed.inject(Service)</code> 建立實例</li>
          <li>直接呼叫方法、驗證回傳值</li>
          <li>這是最簡單、最快速的測試方式</li>
        </ul>

        <p><strong>有依賴的服務</strong>需要透過 TestBed 提供 mock：</p>
        <ul>
          <li>使用 <code>{ provide: DependencyService, useValue: mockDep }</code> 提供 mock</li>
          <li>使用 <code>jasmine.createSpyObj()</code> 建立完整的 mock 物件</li>
          <li>驗證服務是否正確呼叫依賴的方法，以及是否正確處理回傳值</li>
        </ul>

        <p><strong>測試 Signal 狀態</strong>：對於使用 Signal 管理狀態的服務，
        直接讀取 Signal 的值來驗證狀態變更。注意 <code>computed()</code> Signal 是惰性的，
        只有在讀取時才會重新計算。</p>

        <p>測試 Observable 回傳值時，可以使用 Jasmine 的 <code>done</code> callback
        或 <code>async/await</code> 搭配 <code>firstValueFrom()</code> 來處理非同步。
        對於複雜的 Observable 管線，RxJS 的 <code>TestScheduler</code> 提供了 marble testing 功能。</p>

        <p>服務測試應該覆蓋：正常路徑、錯誤路徑、邊界條件。
        特別注意測試 Signal 狀態在連續操作後是否正確（例如：新增→刪除→重新新增）。</p>
      `,
      codeExamples: [
        {
          filename: 'todo.service.spec.ts',
          language: 'typescript',
          code: `import { TestBed } from '@angular/core/testing';
import { TodoService, Todo } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should start with empty todos', () => {
    expect(service.todos()).toEqual([]);
    expect(service.count()).toBe(0);
  });

  it('should add a todo', () => {
    service.add('Write tests');

    expect(service.todos().length).toBe(1);
    expect(service.todos()[0].title).toBe('Write tests');
    expect(service.todos()[0].completed).toBe(false);
  });

  it('should toggle todo completion', () => {
    service.add('Write tests');
    const id = service.todos()[0].id;

    service.toggle(id);
    expect(service.todos()[0].completed).toBe(true);

    service.toggle(id);
    expect(service.todos()[0].completed).toBe(false);
  });

  it('should compute completed count correctly', () => {
    service.add('Task 1');
    service.add('Task 2');
    service.add('Task 3');

    service.toggle(service.todos()[0].id);
    service.toggle(service.todos()[2].id);

    expect(service.completedCount()).toBe(2);
    expect(service.remainingCount()).toBe(1);
  });

  it('should remove a todo', () => {
    service.add('To remove');
    const id = service.todos()[0].id;

    service.remove(id);
    expect(service.todos()).toEqual([]);
  });
});`,
          annotation: '服務 Signal 測試：直接讀取 Signal 驗證狀態變更。computed() 值會自動更新。',
        },
        {
          filename: 'auth.service.spec.ts',
          language: 'typescript',
          code: `import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

describe('AuthService (with mock dependency)', () => {
  let service: AuthService;
  let mockApi: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    // Create a spy object with typed methods
    mockApi = jasmine.createSpyObj<ApiService>('ApiService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: mockApi },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should set user signal on successful login', async () => {
    const mockUser = { id: 1, name: 'Alice', token: 'abc123' };
    mockApi.post.and.returnValue(of({ data: mockUser, message: 'OK', timestamp: '' }));

    await service.login('alice', 'password');

    expect(service.currentUser()).toEqual(mockUser);
    expect(service.isAuthenticated()).toBe(true);
    expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
      username: 'alice',
      password: 'password',
    });
  });

  it('should clear user signal on logout', () => {
    service.logout();

    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});

// Need this import for the of() operator
import { of } from 'rxjs';`,
          annotation: 'Mock 依賴服務：jasmine.createSpyObj 建立型別安全的 mock，驗證方法呼叫和 Signal 狀態。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: 'jasmine.createSpyObj() 類似 .NET Moq 的 Mock<T>()。Angular 的 { provide: X, useValue: mock } 等同於 .NET 的 services.AddSingleton<IX>(mockInstance)。兩者都是在 DI 容器中用 mock 取代真實依賴。',
        },
        {
          type: 'best-practice',
          content: '測試 Signal 時直接讀取 signal() 值即可——不需要特殊的非同步處理。Signal 是同步的，update/set 後立即生效。computed() 雖然是惰性的，但讀取時會自動計算。',
        },
      ],
    },

    // ─── Section 4: HTTP 測試 ───
    {
      id: 'http-testing',
      title: 'HTTP 測試',
      content: `
        <p>Angular 提供了專用的 HTTP 測試工具 <code>provideHttpClientTesting()</code>
        和 <code>HttpTestingController</code>，讓你可以攔截 HTTP 請求並回傳模擬回應，
        完全不需要真實的後端伺服器。</p>

        <p>HTTP 測試的核心流程：</p>
        <ol>
          <li><strong>設定</strong>：在 <code>TestBed</code> 中提供 <code>provideHttpClient()</code>
          和 <code>provideHttpClientTesting()</code></li>
          <li><strong>觸發</strong>：呼叫服務方法發出 HTTP 請求</li>
          <li><strong>攔截</strong>：使用 <code>HttpTestingController.expectOne(url)</code>
          攔截預期的請求</li>
          <li><strong>回應</strong>：使用 <code>req.flush(mockData)</code> 回傳模擬資料</li>
          <li><strong>驗證</strong>：在 <code>afterEach()</code> 中呼叫 <code>httpMock.verify()</code>
          確保沒有未處理的請求</li>
        </ol>

        <p><code>HttpTestingController</code> 提供的方法：</p>
        <ul>
          <li><code>expectOne(urlOrPredicate)</code>：預期恰好一個匹配的請求，否則測試失敗</li>
          <li><code>expectNone(url)</code>：預期沒有匹配的請求</li>
          <li><code>match(predicate)</code>：回傳所有匹配的請求陣列</li>
          <li><code>verify()</code>：驗證所有預期的請求都已處理</li>
        </ul>

        <p>攔截到的 <code>TestRequest</code> 物件可以驗證請求的方法、URL、標頭、請求體等。
        <code>flush()</code> 回傳成功回應，<code>error()</code> 模擬錯誤回應，
        讓你可以完整測試成功和失敗的路徑。</p>

        <p>HTTP 測試的重點不只是驗證「API 有被呼叫」，更要驗證：
        正確的 HTTP 方法、完整的 URL（含查詢參數）、正確的請求標頭、正確的請求體。</p>
      `,
      codeExamples: [
        {
          filename: 'product.service.spec.ts',
          language: 'typescript',
          code: `import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProductService, Product } from './product.service';

describe('ProductService (HTTP)', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify no outstanding requests
    httpMock.verify();
  });

  it('should fetch products with pagination params', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Widget', price: 100, category: 'tools' },
    ];

    service.getProducts(1, 20, 'tools').subscribe(result => {
      expect(result.items).toEqual(mockProducts);
      expect(result.total).toBe(1);
    });

    // Intercept the request and verify
    const req = httpMock.expectOne(
      r => r.url === '/api/products' && r.params.get('page') === '1',
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('size')).toBe('20');
    expect(req.request.params.get('category')).toBe('tools');

    // Respond with mock data
    req.flush({ items: mockProducts, total: 1 });
  });

  it('should create a product via POST', () => {
    const newProduct = { name: 'Gadget', price: 250, category: 'electronics' };
    const created: Product = { id: 42, ...newProduct };

    service.createProduct(newProduct).subscribe(result => {
      expect(result).toEqual(created);
    });

    const req = httpMock.expectOne('/api/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);

    req.flush(created);
  });

  it('should handle 404 error', () => {
    service.getProduct(999).subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err.status).toBe(404);
      },
    });

    const req = httpMock.expectOne('/api/products/999');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});`,
          annotation: 'HTTP 測試：provideHttpClientTesting 攔截請求、驗證方法/參數/請求體、flush 模擬回應。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: 'Angular 的 HttpTestingController 類似 .NET 的 MockHttpMessageHandler 或 WireMock。兩者都攔截 HTTP 請求並回傳預設回應。Angular 的 expectOne + flush 模式比 .NET 的 setup 更具聲明式風格。',
        },
        {
          type: 'warning',
          content: '一定要在 afterEach() 中呼叫 httpMock.verify()。它會檢查所有預期的請求是否都已被處理，以及是否有意外的多餘請求。忘記呼叫會讓未處理的請求悄悄通過。',
        },
      ],
    },

    // ─── Section 5: 路由測試 ───
    {
      id: 'router-testing',
      title: '路由測試',
      content: `
        <p>路由測試驗證應用的導覽行為：URL 是否正確解析、Guard 是否正確攔截、
        Resolver 是否正確載入資料、以及元件是否在正確的 URL 下渲染。</p>

        <p>Angular 提供了 <code>RouterModule.forRoot()</code> 的測試替代方案：
        <code>provideRouter(routes)</code> 搭配測試用路由設定。
        對於簡單的路由測試，也可以使用 <code>RouterTestingHarness</code>
        來導航到特定路由並驗證渲染結果。</p>

        <p>測試 Guard 有兩種策略：</p>
        <ul>
          <li><strong>獨立測試</strong>：直接呼叫 Guard 函式，傳入 mock 的 <code>ActivatedRouteSnapshot</code>
          和 <code>RouterStateSnapshot</code>，驗證回傳值</li>
          <li><strong>整合測試</strong>：透過 <code>RouterTestingHarness</code> 導航到受保護的路由，
          驗證是否被正確重導向</li>
        </ul>

        <p>測試 Resolver 時，同樣可以獨立呼叫函式或透過整合測試驗證。
        獨立測試更快速、更聚焦，整合測試更接近真實行為。</p>

        <p>在測試中使用 <code>fakeAsync()</code> 和 <code>tick()</code>
        來控制非同步操作的時序，特別是在處理延遲載入路由時非常有用。
        <code>RouterTestingHarness</code> 會自動處理路由解析的非同步性。</p>

        <p>路由測試的重點是驗證「使用者能到達正確的頁面」和「未授權使用者被正確攔截」，
        而非測試 Angular Router 本身的實作。保持測試簡潔，聚焦在商業邏輯上。</p>
      `,
      codeExamples: [
        {
          filename: 'auth-guard.spec.ts',
          language: 'typescript',
          code: `import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let mockAuth: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    mockAuth = jasmine.createSpyObj<AuthService>('AuthService', ['isAuthenticated']);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuth },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should allow access when authenticated', () => {
    mockAuth.isAuthenticated.and.returnValue(true);

    // Run guard in injection context
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url: '/dashboard' } as RouterStateSnapshot),
    );

    expect(result).toBe(true);
  });

  it('should redirect to login when not authenticated', () => {
    mockAuth.isAuthenticated.and.returnValue(false);
    const navigateSpy = spyOn(router, 'createUrlTree').and.callThrough();

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url: '/dashboard' } as RouterStateSnapshot),
    );

    expect(navigateSpy).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/dashboard' },
    });
  });
});`,
          annotation: 'Guard 獨立測試：runInInjectionContext 提供 DI 上下文，驗證認證和重導向邏輯。',
        },
        {
          filename: 'navigation.spec.ts',
          language: 'typescript',
          code: `import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

describe('App Navigation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', loadComponent: () => import('./home').then(m => m.Home) },
          { path: 'about', loadComponent: () => import('./about').then(m => m.About) },
        ]),
      ],
    });
  });

  it('should navigate to home', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/');

    expect(harness.routeNativeElement?.textContent).toContain('Welcome');
  });

  it('should navigate to about page', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/about');

    expect(harness.routeNativeElement?.textContent).toContain('About');
  });
});`,
          annotation: 'RouterTestingHarness 整合測試：驗證路由導航和元件渲染。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: '.NET 的路由測試通常透過 WebApplicationFactory<T> 的 HttpClient 發送請求來驗證。Angular 的 RouterTestingHarness 提供了更高層級的 API，直接在記憶體中模擬導航而不需要 HTTP 層。',
        },
        {
          type: 'best-practice',
          content: '優先使用 Guard 的獨立單元測試（直接呼叫函式），只在需要驗證完整導航流程時使用 RouterTestingHarness 整合測試。獨立測試更快速、更容易除錯。',
        },
      ],
    },

    // ─── Section 6: 覆蓋率 ───
    {
      id: 'coverage',
      title: '覆蓋率',
      content: `
        <p>程式碼覆蓋率（Code Coverage）是衡量測試品質的重要指標之一。
        Angular CLI 內建了 Istanbul 覆蓋率工具，只需在 <code>ng test</code> 指令
        加上 <code>--code-coverage</code> 參數即可產生覆蓋率報告。</p>

        <p>覆蓋率報告分為四個維度：</p>
        <ul>
          <li><strong>Statements（語句覆蓋率）</strong>：多少百分比的程式語句被執行過</li>
          <li><strong>Branches（分支覆蓋率）</strong>：多少百分比的 if/else、switch case 路徑被測試</li>
          <li><strong>Functions（函式覆蓋率）</strong>：多少百分比的函式/方法被呼叫過</li>
          <li><strong>Lines（行覆蓋率）</strong>：多少百分比的程式碼行被執行過</li>
        </ul>

        <p>建議的覆蓋率目標是 <strong>80%</strong>，這是一個務實的平衡點——
        足夠高以確保核心邏輯被測試，又不會為了追求 100% 而浪費時間在無意義的測試上。</p>

        <p>覆蓋率門檻可以在 <code>karma.conf.js</code> 中設定，
        當覆蓋率低於門檻時，CI 建置會自動失敗。這確保了覆蓋率不會隨時間下降。</p>

        <p>產生的報告存放在 <code>coverage/</code> 目錄下，HTML 格式的報告
        可以直接在瀏覽器中開啟，視覺化地檢視哪些程式碼被測試覆蓋、哪些沒有。
        在 CI/CD 管線中，通常會將覆蓋率報告上傳到 Codecov 或 Coveralls 等平台追蹤趨勢。</p>

        <p>注意：高覆蓋率不等於高品質測試。覆蓋率只表示程式碼被「執行」過，
        不代表所有邊界條件都被正確驗證。撰寫有意義的斷言比追求數字更重要。</p>
      `,
      codeExamples: [
        {
          filename: 'angular.json (coverage config)',
          language: 'typescript',
          code: `// In angular.json → projects → <name> → architect → test → options
{
  "codeCoverage": true,
  "codeCoverageExclude": [
    "src/test-setup.ts",
    "src/**/*.spec.ts",
    "src/**/*.mock.ts",
    "src/environments/**"
  ]
}`,
          annotation: 'angular.json 中設定預設啟用覆蓋率及排除不需要覆蓋的檔案。',
        },
        {
          filename: 'karma.conf.js',
          language: 'typescript',
          code: `// karma.conf.js — coverage threshold configuration
module.exports = function (config) {
  config.set({
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },     // Visual report for developers
        { type: 'text-summary' },  // Terminal summary
        { type: 'lcovonly' },  // For CI tools (Codecov, Coveralls)
      ],
      check: {
        global: {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80,
        },
      },
    },
  });
};`,
          annotation: 'Karma 覆蓋率門檻設定：80% 語句/函式/行覆蓋率，75% 分支覆蓋率。低於門檻 CI 失敗。',
        },
        {
          filename: 'terminal',
          language: 'bash',
          code: `# Generate coverage report
ng test --code-coverage --watch=false

# Open HTML report in browser
open coverage/index.html

# CI pipeline example
ng test --code-coverage --watch=false --browsers=ChromeHeadless
# Upload to Codecov (in GitHub Actions)
# - uses: codecov/codecov-action@v4`,
          annotation: '覆蓋率相關指令：產生報告、檢視報告、CI 整合。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: '.NET 使用 coverlet 或 dotCover 收集覆蓋率，搭配 ReportGenerator 產生 HTML 報告。Angular 內建了 Istanbul 覆蓋率工具，不需額外安裝。兩者都建議 80% 作為團隊覆蓋率目標。',
        },
        {
          type: 'best-practice',
          content: '覆蓋率目標設在 80%，但不要追求 100%。將測試時間花在核心業務邏輯、錯誤處理路徑、邊界條件上，而非 getter/setter 或簡單的委派方法。品質 > 數量。',
        },
      ],
    },

    // ─── Section 7: 完整範例 ───
    {
      id: 'complete-test',
      title: '完整範例',
      content: `
        <p>以下展示一個完整的測試套件，涵蓋 Todo 功能模組的服務測試和元件測試。
        這個範例展示了真實專案中常見的測試模式，包括 Signal 狀態驗證、
        Mock 依賴注入、DOM 互動測試、以及非同步操作處理。</p>

        <p>測試套件的結構：</p>
        <ol>
          <li><strong>TodoStore（服務）</strong>：使用 Signal 管理 Todo 清單的 CRUD 操作。
          測試覆蓋新增、切換、移除、以及 computed 計數器</li>
          <li><strong>TodoList（元件）</strong>：消費 TodoStore 的資料並渲染 UI。
          測試覆蓋資料顯示、使用者互動、空狀態處理</li>
        </ol>

        <p>這個範例遵循的測試原則：</p>
        <ul>
          <li><strong>獨立性</strong>：每個 <code>it()</code> 區塊之間沒有共用狀態，
          <code>beforeEach()</code> 重新建立乾淨的環境</li>
          <li><strong>可讀性</strong>：測試描述使用「should + 行為」格式，
          讓測試報告讀起來像需求文件</li>
          <li><strong>聚焦</strong>：每個測試只驗證一個行為，失敗時立即知道問題所在</li>
          <li><strong>務實</strong>：Mock 只替換外部依賴（如 API 呼叫），
          內部邏輯使用真實實作</li>
        </ul>

        <p>在實際專案中，你會為每個功能模組建立類似的測試結構：
        服務測試確保邏輯正確，元件測試確保 UI 渲染和互動正確。
        兩者搭配能提供高信心度的功能保障。</p>
      `,
      codeExamples: [
        {
          filename: 'todo.store.ts',
          language: 'typescript',
          code: `import { Injectable, signal, computed } from '@angular/core';

export interface Todo {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoStore {
  private readonly _todos = signal<readonly Todo[]>([]);

  readonly todos = this._todos.asReadonly();
  readonly count = computed(() => this._todos().length);
  readonly completedCount = computed(() => this._todos().filter(t => t.completed).length);
  readonly remainingCount = computed(() => this.count() - this.completedCount());

  add(title: string): void {
    const todo: Todo = { id: crypto.randomUUID(), title, completed: false };
    this._todos.update(list => [...list, todo]);
  }

  toggle(id: string): void {
    this._todos.update(list =>
      list.map(t => t.id === id ? { ...t, completed: !t.completed } : t),
    );
  }

  remove(id: string): void {
    this._todos.update(list => list.filter(t => t.id !== id));
  }

  clear(): void {
    this._todos.set([]);
  }
}`,
          annotation: 'TodoStore 服務：Signal 管理狀態、computed 衍生計數、不可變更新。',
        },
        {
          filename: 'todo.store.spec.ts',
          language: 'typescript',
          code: `import { TestBed } from '@angular/core/testing';
import { TodoStore } from './todo.store';

describe('TodoStore', () => {
  let store: TodoStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(TodoStore);
  });

  describe('add()', () => {
    it('should add a todo with correct defaults', () => {
      store.add('Learn Angular');

      expect(store.count()).toBe(1);
      expect(store.todos()[0].title).toBe('Learn Angular');
      expect(store.todos()[0].completed).toBe(false);
      expect(store.todos()[0].id).toBeTruthy();
    });

    it('should append multiple todos', () => {
      store.add('Task 1');
      store.add('Task 2');

      expect(store.count()).toBe(2);
    });
  });

  describe('toggle()', () => {
    it('should toggle completion status', () => {
      store.add('Task');
      const id = store.todos()[0].id;

      store.toggle(id);
      expect(store.todos()[0].completed).toBe(true);
      expect(store.completedCount()).toBe(1);

      store.toggle(id);
      expect(store.todos()[0].completed).toBe(false);
      expect(store.completedCount()).toBe(0);
    });
  });

  describe('remove()', () => {
    it('should remove the specified todo', () => {
      store.add('To keep');
      store.add('To remove');
      const removeId = store.todos()[1].id;

      store.remove(removeId);

      expect(store.count()).toBe(1);
      expect(store.todos()[0].title).toBe('To keep');
    });
  });

  describe('computed signals', () => {
    it('should compute remaining count correctly', () => {
      store.add('A');
      store.add('B');
      store.add('C');
      store.toggle(store.todos()[0].id);

      expect(store.completedCount()).toBe(1);
      expect(store.remainingCount()).toBe(2);
    });
  });
});`,
          annotation: '完整的服務測試套件：分組描述、正向測試、狀態連續驗證、computed 驗證。',
        },
        {
          filename: 'todo-list.spec.ts',
          language: 'typescript',
          code: `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoList } from './todo-list';
import { TodoStore } from './todo.store';

describe('TodoList', () => {
  let fixture: ComponentFixture<TodoList>;
  let store: TodoStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoList],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoList);
    store = TestBed.inject(TodoStore);
  });

  it('should show empty state when no todos', async () => {
    await fixture.whenStable();

    const empty = fixture.nativeElement.querySelector('[data-testid="empty-state"]');
    expect(empty?.textContent).toContain('沒有待辦事項');
  });

  it('should render todo items', async () => {
    store.add('Buy milk');
    store.add('Read book');
    await fixture.whenStable();

    const items = fixture.nativeElement.querySelectorAll('[data-testid="todo-item"]');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Buy milk');
  });

  it('should toggle todo on checkbox click', async () => {
    store.add('Test todo');
    await fixture.whenStable();

    const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    checkbox.click();
    await fixture.whenStable();

    expect(store.todos()[0].completed).toBe(true);
  });

  it('should show correct remaining count', async () => {
    store.add('A');
    store.add('B');
    store.toggle(store.todos()[0].id);
    await fixture.whenStable();

    const count = fixture.nativeElement.querySelector('[data-testid="remaining-count"]');
    expect(count?.textContent).toContain('1');
  });
});`,
          annotation: '元件整合測試：注入真實 TodoStore、驗證 DOM 渲染和使用者互動。',
        },
      ],
      tips: [
        {
          type: 'best-practice',
          content: '使用 describe() 按方法分組測試案例，讓測試報告結構清晰。每個 describe 內的測試應該是獨立的，不依賴執行順序。',
        },
        {
          type: 'dotnet-comparison',
          content: '這個測試結構對應 .NET 的 xUnit 測試組織：describe → [Trait("Category", "...")]、beforeEach → constructor/IClassFixture、it → [Fact]。Angular 的 TestBed 類似 .NET 的 ServiceProvider builder。',
        },
      ],
    },

    // ─── Section 8: 常見陷阱 ───
    {
      id: 'testing-pitfalls',
      title: '常見陷阱',
      content: `
        <p>以下是 Angular 測試中最常見的 8 個錯誤。
        這些陷阱會導致測試不穩定、難以維護、或給出錯誤的信心：</p>

        <ol>
          <li><strong>使用 detectChanges() 而非 whenStable()</strong>：
          <code>detectChanges()</code> 是同步的，不會等待非同步操作完成。
          在 Angular 20+ 中應使用 <code>await fixture.whenStable()</code>，
          它會觸發變更偵測並等待所有非同步操作完成。</li>

          <li><strong>忘記 compileComponents()</strong>：使用外部模板（templateUrl）的元件
          需要在 <code>beforeEach</code> 中呼叫 <code>compileComponents()</code>
          並使用 <code>async</code> 修飾。內聯模板（template）則不需要。</li>

          <li><strong>測試之間共用狀態</strong>：服務如果是 <code>providedIn: 'root'</code>，
          在 TestBed 不重置的情況下會在測試之間保留狀態。
          確保 <code>beforeEach()</code> 重新設定 TestBed 或清除服務狀態。</li>

          <li><strong>過度 mock</strong>：Mock 了太多內部實作細節，
          導致測試變成「確認實作步驟」而非「驗證行為」。
          只 mock 外部依賴（HTTP、第三方服務），保留內部邏輯。</li>

          <li><strong>使用 CSS 選擇器查詢 DOM</strong>：
          依賴 CSS 類名（如 <code>.btn-primary</code>）選取元素會讓測試對樣式重構很脆弱。
          使用 <code>data-testid</code> 屬性或 ARIA 角色。</li>

          <li><strong>忽略錯誤路徑測試</strong>：只測試快樂路徑（happy path），
          忽略了錯誤處理、邊界條件、空狀態。
          這些往往是正式環境中最容易出問題的地方。</li>

          <li><strong>httpMock.verify() 遺漏</strong>：沒有在 <code>afterEach</code>
          呼叫 <code>httpMock.verify()</code>，導致多餘的 HTTP 請求沒有被偵測到，
          測試通過但實際上有 bug。</li>

          <li><strong>非同步測試未正確等待</strong>：
          測試在非同步操作完成前就執行斷言，導致間歇性失敗（flaky tests）。
          使用 <code>fakeAsync() + tick()</code> 或 <code>async/await</code> 確保時序正確。</li>
        </ol>
      `,
      codeExamples: [
        {
          filename: 'testing-pitfall-examples.spec.ts',
          language: 'typescript',
          code: `// ❌ Pitfall 1: detectChanges is synchronous
it('bad — does not wait for async', () => {
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('data'); // May fail
});

// ✅ Fix: use whenStable
it('good — waits for async', async () => {
  await fixture.whenStable();
  expect(fixture.nativeElement.textContent).toContain('data');
});

// ❌ Pitfall 4: over-mocking internals
it('bad — testing implementation details', () => {
  spyOn(service, 'privateHelper' as any);  // Don't mock internals
  service.doWork();
  expect((service as any).privateHelper).toHaveBeenCalled();
});

// ✅ Fix: test behavior, not implementation
it('good — testing behavior', () => {
  const result = service.doWork();
  expect(result).toBe(expectedOutput);
});

// ❌ Pitfall 5: fragile CSS selectors
const btn = fixture.nativeElement.querySelector('.btn.btn-primary.mt-2');

// ✅ Fix: stable test selectors
const btn = fixture.nativeElement.querySelector('[data-testid="submit-btn"]');

// ❌ Pitfall 8: not waiting for async
it('bad — assertion runs before async completes', () => {
  service.loadData();  // Fires HTTP request
  expect(service.data()).toBeTruthy();  // Data not loaded yet!
});

// ✅ Fix: flush the HTTP mock first
it('good — flush then assert', () => {
  service.loadData();
  httpMock.expectOne('/api/data').flush(mockData);
  expect(service.data()).toEqual(mockData);
});`,
          annotation: '常見測試陷阱的錯誤寫法與修正對照。重點：行為測試 > 實作測試。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: 'Flaky tests（不穩定的測試）是測試套件最大的敵人。如果一個測試「有時候過、有時候不過」，十之八九是非同步時序問題。使用 await fixture.whenStable() 和 fakeAsync/tick 來消除時序依賴。',
        },
        {
          type: 'dotnet-comparison',
          content: '.NET 的 xUnit 測試也有類似的陷阱：忘記 Dispose mock、過度使用 Verify()、忽略 async/await。兩個生態系的最佳實踐高度一致——測試行為而非實作、確保非同步正確等待、保持測試獨立。',
        },
      ],
    },
  ],
};

@Component({
  selector: 'app-ch07',
  imports: [GuidePage],
  template: '<app-guide-page [chapter]="chapter" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ch07Testing {
  protected readonly chapter = CHAPTER;
}
