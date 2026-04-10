import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GuidePage } from '../shared/guide-page';
import { GuideChapter } from '../models/guide-chapter';

const CHAPTER: GuideChapter = {
  id: 'state-management',
  number: 4,
  title: '狀態管理',
  subtitle: 'Signals、computed、effect、RxJS 互操作',
  icon: 'data_object',
  category: 'intermediate',
  tags: ['signals', 'state', 'computed', 'effect', 'rxjs', 'toSignal', 'resource', 'linkedSignal'],
  estimatedMinutes: 50,
  sections: [
    // ─── Section 1: Signals Basics ───
    {
      id: 'signals-basics',
      title: 'Signals 基礎',
      content: `
<p>
  <strong>Signal</strong> 是 Angular 的核心反應式原語（reactive primitive），
  用於表示一個會隨時間改變的值。當 signal 的值改變時，所有依賴它的消費者（模板、computed、effect）
  都會被自動通知並更新。這是 Angular 從 Zone.js 邁向<strong>細粒度反應式</strong>架構的基礎。
</p>
<p><strong>三個核心 API：</strong></p>
<ul>
  <li>
    <code>signal(initialValue)</code>——建立一個可寫入的 signal。
    使用 <code>.set(value)</code> 直接設值，<code>.update(fn)</code> 基於前一個值計算新值。
    讀取方式是呼叫函式：<code>count()</code>。
  </li>
  <li>
    <code>computed(() =&gt; expression)</code>——建立一個衍生 signal。
    它的值是根據其他 signal 自動計算出來的，具有<strong>惰性（lazy）</strong>和
    <strong>記憶化（memoized）</strong>特性——只在依賴改變且有人讀取時才重新計算。
  </li>
  <li>
    <code>effect(() =&gt; sideEffect)</code>——建立一個副作用。
    每次依賴的 signal 改變時自動重新執行。用於 logging、localStorage、DOM 操作等副作用。
    <strong>不應用於</strong>同步 signal 之間的資料流。
  </li>
</ul>
<p><strong>Signal 的核心設計原則：</strong></p>
<ul>
  <li><strong>同步追蹤</strong>——signal 的讀取在同步執行上下文中被追蹤，<code>await</code> 之後的讀取不會被追蹤</li>
  <li><strong>不可變更新</strong>——永遠回傳新的值參考，不要原地修改（mutate）</li>
  <li><strong>單一職責</strong>——每個 signal 代表一個語義明確的狀態片段</li>
  <li><strong>衍生優於同步</strong>——需要從其他 signal 計算得到的值，用 <code>computed()</code> 而非 <code>effect()</code> + <code>.set()</code></li>
</ul>
      `,
      codeExamples: [
        {
          filename: 'signals-basics.ts',
          language: 'typescript',
          code: `import { signal, computed, effect } from '@angular/core';

// ── Writable signal ──
const count = signal(0);

console.log(count()); // 0 — read by calling as function

count.set(5);         // Direct set
count.update(c => c + 1); // Update based on previous value
console.log(count()); // 6

// ── Computed (derived, memoized) ──
const double = computed(() => count() * 2);
const isEven = computed(() => count() % 2 === 0);

console.log(double()); // 12
console.log(isEven()); // true

// ── Effect (side effect) ──
effect(() => {
  // Runs whenever count() changes
  console.log(\`Count changed to \${count()}, double is \${double()}\`);
});

// ── Immutable array updates ──
interface Todo {
  readonly id: number;
  readonly text: string;
  readonly done: boolean;
}

const todos = signal<readonly Todo[]>([]);

// Add item — new array reference
todos.update(list => [...list, { id: 1, text: 'Learn Signals', done: false }]);

// Toggle item — map produces new array
todos.update(list =>
  list.map(t => t.id === 1 ? { ...t, done: !t.done } : t)
);

// Remove item — filter produces new array
todos.update(list => list.filter(t => t.id !== 1));`,
          annotation: 'Core signal operations: create, read, set, update, computed, effect, and immutable collection updates.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '每個 signal 應該代表一個<strong>原子性的狀態片段</strong>。不要把整個應用狀態塞進一個大 signal——拆分為多個小 signal，再用 <code>computed()</code> 組合。' },
        { type: 'dotnet-comparison', content: '<code>signal()</code> 類似 .NET MAUI 的 <code>ObservableProperty</code> 或 WPF 的 <code>DependencyProperty</code>——都是觀察者模式的實作。<code>computed()</code> 則像 Excel 公式：當儲存格 A1 改變時，參考 A1 的公式會自動重算。' },
        { type: 'warning', content: '永遠不要直接修改 signal 包裝的物件或陣列（如 <code>items().push()</code>）。Signal 使用參考比較（reference equality）來偵測變更——原地修改不會改變參考，因此不會觸發更新。' },
      ],
    },

    // ─── Section 2: Advanced Signal APIs ───
    {
      id: 'advanced-signals',
      title: '進階 Signal API',
      content: `
<p>
  除了基礎的 <code>signal()</code>、<code>computed()</code>、<code>effect()</code> 之外，
  Angular 提供了數個進階 API 來處理更複雜的反應式場景：
</p>
<table>
  <thead>
    <tr><th>API</th><th>用途</th><th>特性</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><code>linkedSignal()</code></td>
      <td>依賴來源 signal 的可寫入衍生狀態</td>
      <td>來源改變時自動重算，但可被手動 set/update</td>
    </tr>
    <tr>
      <td><code>resource()</code></td>
      <td>非同步資料載入</td>
      <td>自動追蹤請求 signal，暴露 value/status/error/isLoading</td>
    </tr>
    <tr>
      <td><code>untracked()</code></td>
      <td>讀取 signal 而不建立追蹤依賴</td>
      <td>在 computed/effect 中讀取不想追蹤的 signal</td>
    </tr>
  </tbody>
</table>
<p><strong>linkedSignal：</strong></p>
<p>
  <code>linkedSignal</code> 解決的問題是：當一個衍生狀態大部分時間跟隨來源 signal，
  但偶爾需要被使用者<strong>手動覆寫</strong>。例如，選擇清單的預設選項隨資料源改變而重設，
  但使用者選擇了其他選項後，不應被重設回預設值——直到資料源再次改變。
  這在 <code>computed()</code>（唯讀）無法實現，用 <code>effect()</code> + <code>signal()</code> 則違反最佳實踐。
</p>
<p><strong>resource：</strong></p>
<p>
  <code>resource()</code> 將非同步操作（如 HTTP 請求）的結果轉為 signal。
  它自動追蹤 <code>request</code> signal 的變更並重新發送請求，暴露
  <code>value()</code>、<code>status()</code>、<code>error()</code>、<code>isLoading()</code>
  等 signal 供模板使用。這比手動組合 <code>effect()</code> + <code>fetch()</code> + <code>signal.set()</code>
  更安全且更易於管理。
</p>
<p><strong>反應式上下文規則：</strong></p>
<p>
  <code>computed()</code> 和 <code>effect()</code> 的追蹤只在<strong>同步執行</strong>期間有效。
  在 <code>await</code> 之後讀取的 signal 不會被追蹤。如果需要在非同步程式碼中讀取 signal，
  務必在 <code>await</code> 前先將值存入區域變數。
</p>
      `,
      codeExamples: [
        {
          filename: 'linked-signal-example.ts',
          language: 'typescript',
          code: `import { signal, linkedSignal, computed } from '@angular/core';

interface Product {
  readonly id: string;
  readonly name: string;
  readonly sizes: readonly string[];
}

const selectedProduct = signal<Product>({
  id: '1',
  name: 'T-Shirt',
  sizes: ['S', 'M', 'L', 'XL'],
});

// linkedSignal: resets to first available size when product changes,
// but user can manually select a different size
const selectedSize = linkedSignal({
  source: selectedProduct,
  computation: (product) => product.sizes[0] ?? '',
});

console.log(selectedSize()); // 'S'

// User manually selects a size — this is allowed because linkedSignal is writable
selectedSize.set('L');
console.log(selectedSize()); // 'L'

// Product changes — selectedSize auto-resets to the first size of new product
selectedProduct.set({
  id: '2',
  name: 'Hoodie',
  sizes: ['M', 'L', 'XXL'],
});
console.log(selectedSize()); // 'M' — auto-reset by linkedSignal`,
          annotation: 'linkedSignal resets when the source changes, but remains writable for user overrides.',
        },
        {
          filename: 'resource-example.ts',
          language: 'typescript',
          code: `import { Component, ChangeDetectionStrategy, inject, input, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface Article {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

@Component({
  selector: 'app-article-detail',
  template: \`
    @switch (articleResource.status()) {
      @case ('loading') {
        <div class="skeleton">Loading article...</div>
      }
      @case ('resolved') {
        @if (articleResource.value(); as article) {
          <h1>{{ article.title }}</h1>
          <div [innerHTML]="article.body"></div>
        }
      }
      @case ('error') {
        <p class="error">Failed to load article: {{ articleResource.error() }}</p>
        <button (click)="articleResource.reload()">Retry</button>
      }
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetail {
  private readonly http = inject(HttpClient);

  // Route param bound via withComponentInputBinding()
  readonly id = input.required<string>();

  // resource() auto-refetches when id() changes
  protected readonly articleResource = resource({
    request: () => this.id(),
    loader: ({ request: id }) =>
      firstValueFrom(this.http.get<Article>(\`/api/articles/\${id}\`)),
  });
}`,
          annotation: 'resource() for async data fetching — auto-tracks input signal and exposes status/value/error.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '需要可寫入的衍生狀態？用 <code>linkedSignal()</code>。需要唯讀的衍生值？用 <code>computed()</code>。需要非同步載入資料？用 <code>resource()</code>。這三個 API 覆蓋了 99% 的反應式場景，幾乎不需要 <code>effect()</code>。' },
        { type: 'warning', content: '在 <code>computed()</code> 或 <code>effect()</code> 中使用 <code>await</code> 後的 signal 讀取不會被追蹤。務必在 <code>await</code> 前捕獲所有需要追蹤的 signal 值。' },
        { type: 'dotnet-comparison', content: '<code>resource()</code> 類似 .NET Blazor 中 <code>OnInitializedAsync</code> + 狀態管理的組合——但 <code>resource()</code> 自動處理載入狀態、錯誤狀態和重試，且會在依賴 signal 改變時自動重新載入，比手動管理更安全。' },
      ],
    },

    // ─── Section 3: Readonly Pattern ───
    {
      id: 'readonly-pattern',
      title: '唯讀暴露模式',
      content: `
<p>
  在 Angular 的狀態管理中，<strong>唯讀暴露（Readonly Exposure）</strong>是最重要的封裝模式之一。
  它確保服務內部的可寫入狀態只能透過明確的公開方法來修改，
  防止外部消費者（元件或其他服務）直接呼叫 <code>.set()</code> 或 <code>.update()</code>。
</p>
<p><strong>WritableSignal vs Signal：</strong></p>
<table>
  <thead>
    <tr><th>型別</th><th>可讀</th><th>可寫</th><th>用途</th></tr>
  </thead>
  <tbody>
    <tr><td><code>WritableSignal&lt;T&gt;</code></td><td>是</td><td>是（set/update）</td><td>服務內部狀態</td></tr>
    <tr><td><code>Signal&lt;T&gt;</code>（readonly）</td><td>是</td><td>否</td><td>對外暴露的唯讀視圖</td></tr>
  </tbody>
</table>
<p>
  使用 <code>.asReadonly()</code> 方法可以將 <code>WritableSignal</code> 轉為 <code>Signal</code>——
  消費者只能讀取值，不能修改。這是單向資料流的基礎。
</p>
<p><strong>為什麼重要：</strong></p>
<ul>
  <li><strong>可預測性</strong>——狀態變更只發生在定義好的方法中，容易追蹤和除錯</li>
  <li><strong>可測試性</strong>——你可以測試每個修改方法的行為，確保狀態轉換正確</li>
  <li><strong>重構安全</strong>——內部實作可以自由變更，只要公開介面不變</li>
  <li><strong>團隊協作</strong>——新成員透過看公開 API 就知道如何與服務互動</li>
</ul>
<p>
  這個模式的核心原則是：<strong>狀態是 private 的，讀取是 public readonly 的，修改是透過命名方法的。</strong>
  這與 .NET 中將欄位設為 private 並透過 public property 暴露的慣例完全一致。
</p>
      `,
      codeExamples: [
        {
          filename: 'cart.store.ts',
          language: 'typescript',
          code: `import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  readonly productId: string;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartStore {
  // Private writable state — only this service can modify
  private readonly _items = signal<readonly CartItem[]>([]);

  // Public readonly view — consumers can only read
  readonly items = this._items.asReadonly();

  // Derived state — automatically updates when items change
  readonly totalPrice = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  readonly itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly isEmpty = computed(() => this._items().length === 0);

  // Named mutation methods — the ONLY way to modify state
  addItem(product: Omit<CartItem, 'quantity'>): void {
    this._items.update(items => {
      const existing = items.find(i => i.productId === product.productId);
      if (existing) {
        return items.map(i =>
          i.productId === product.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
  }

  removeItem(productId: string): void {
    this._items.update(items => items.filter(i => i.productId !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this._items.update(items =>
      items.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  }

  clear(): void {
    this._items.set([]);
  }
}`,
          annotation: 'Complete store service with private writable state, readonly exposure, and named mutation methods.',
        },
        {
          filename: 'cart-summary.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartStore } from './cart.store';

@Component({
  selector: 'app-cart-summary',
  template: \`
    @if (cart.isEmpty()) {
      <p>Your cart is empty.</p>
    } @else {
      <p>{{ cart.itemCount() }} items, total: \${{ cart.totalPrice() }}</p>
      <button (click)="cart.clear()">Clear Cart</button>
    }

    <!-- ❌ This would be a compile error: -->
    <!-- cart.items.set([]) -->
    <!-- cart.items is Signal<T>, not WritableSignal<T> -->
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummary {
  protected readonly cart = inject(CartStore);
}`,
          annotation: 'Consumer component: reads signals and calls named methods — cannot directly mutate state.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '服務中的每個 signal 都應遵循三層結構：<code>private readonly _state = signal(...)</code>（可寫）、<code>readonly state = this._state.asReadonly()</code>（唯讀暴露）、命名方法（修改入口）。' },
        { type: 'dotnet-comparison', content: '這完全等同於 .NET 的封裝慣例：<code>private readonly _items = new List&lt;T&gt;()</code>（private field）搭配 <code>public IReadOnlyList&lt;T&gt; Items =&gt; _items.AsReadOnly()</code>（readonly property）。概念一模一樣，只是語法不同。' },
        { type: 'tip', content: '使用 <code>computed()</code> 建立衍生狀態（如 <code>totalPrice</code>、<code>isEmpty</code>）可以消除重複計算，且保證值永遠與來源狀態一致——不會出現「忘記更新」的問題。' },
      ],
    },

    // ─── Section 4: RxJS in Angular ───
    {
      id: 'rxjs-in-angular',
      title: 'RxJS 在 Angular 中的角色',
      content: `
<p>
  <strong>RxJS（Reactive Extensions for JavaScript）</strong>是 Angular 歷史上的核心反應式工具。
  然而，隨著 Signals 的引入，RxJS 在 Angular 中的角色正在轉變：
  從「所有反應式場景的首選」變為「特定場景的專用工具」。
</p>
<p><strong>Signals 優先的時代：</strong></p>
<ul>
  <li>元件狀態、UI 資料綁定——優先使用 Signals</li>
  <li>衍生計算——用 <code>computed()</code></li>
  <li>非同步資料載入——用 <code>resource()</code></li>
  <li>副作用——用 <code>effect()</code></li>
</ul>
<p><strong>RxJS 仍然不可或缺的場景：</strong></p>
<ul>
  <li><strong>事件流處理</strong>——需要 <code>debounceTime</code>、<code>switchMap</code>、<code>distinctUntilChanged</code> 等操作符的場景（如搜尋自動完成）</li>
  <li><strong>HTTP 請求</strong>——<code>HttpClient</code> 回傳 Observable（雖然可用 <code>firstValueFrom</code> 轉 Promise）</li>
  <li><strong>WebSocket / SSE</strong>——持續推送的資料流</li>
  <li><strong>複雜的非同步協調</strong>——<code>forkJoin</code>、<code>combineLatest</code>、<code>race</code>、<code>retry</code></li>
  <li><strong>Router events</strong>——路由事件是 Observable</li>
  <li><strong>Form valueChanges</strong>——Reactive Forms 的值變更是 Observable</li>
</ul>
<p><strong>核心 RxJS 概念快速回顧：</strong></p>
<ul>
  <li><code>Observable</code>——資料流的核心抽象，冷（cold）的：只有訂閱時才開始產生值</li>
  <li><code>Subject</code>——可手動推送值的 Observable（多播）</li>
  <li><code>BehaviorSubject</code>——有初始值的 Subject，新訂閱者立即收到最新值</li>
  <li><code>pipe()</code>——串接操作符進行流轉換</li>
</ul>
      `,
      codeExamples: [
        {
          filename: 'search-autocomplete.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, filter, catchError } from 'rxjs';
import { of } from 'rxjs';

interface SearchResult {
  readonly id: string;
  readonly title: string;
}

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  template: \`
    <input [formControl]="searchControl" placeholder="Search..." />
    @for (result of results(); track result.id) {
      <div class="result">{{ result.title }}</div>
    } @empty {
      <p>No results</p>
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search {
  private readonly http = inject(HttpClient);

  protected readonly searchControl = new FormControl('', { nonNullable: true });

  // RxJS excels here: debounce → deduplicate → cancel previous → handle errors
  protected readonly results = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(query => query.length >= 2),
      switchMap(query =>
        this.http.get<readonly SearchResult[]>(\`/api/search?q=\${query}\`).pipe(
          catchError(() => of([] as readonly SearchResult[])),
        )
      ),
    ),
    { initialValue: [] as readonly SearchResult[] },
  );
}`,
          annotation: 'RxJS shines for event stream processing: debounce, deduplicate, cancel-previous, error recovery.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '新程式碼的決策流程：先考慮 Signal（<code>signal</code>/<code>computed</code>/<code>resource</code>），只在需要串流操作符（debounce、switchMap 等）時才使用 RxJS。不要為了「已經會 RxJS」而在所有場景都使用它。' },
        { type: 'dotnet-comparison', content: 'RxJS 的 Observable 等同於 .NET 的 <code>IObservable&lt;T&gt;</code>（System.Reactive）。<code>BehaviorSubject</code> 對應 <code>BehaviorSubject&lt;T&gt;</code>。操作符如 <code>switchMap</code> 對應 <code>SelectMany</code> + 取消前一個訂閱。' },
        { type: 'warning', content: '不要在新程式碼中使用 <code>async</code> pipe 搭配 Observable 做為主要的模板資料綁定方式——改用 <code>toSignal()</code> 轉為 signal，或直接使用 <code>resource()</code>。' },
      ],
    },

    // ─── Section 5: Signals-RxJS Interop ───
    {
      id: 'signals-rxjs-interop',
      title: 'Signal-RxJS 互操作',
      content: `
<p>
  Angular 提供了 <code>@angular/core/rxjs-interop</code> 模組中的橋接函式，
  讓 Signals 和 RxJS Observable 可以無縫互相轉換。
  這對於在漸進式遷移中同時使用兩種反應式模型至關重要。
</p>
<p><strong>互操作 API：</strong></p>
<table>
  <thead>
    <tr><th>函式</th><th>方向</th><th>說明</th><th>使用場景</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><code>toSignal(obs$)</code></td>
      <td>Observable → Signal</td>
      <td>訂閱 Observable 並將最新值暴露為 signal</td>
      <td>將 RxJS 流轉為 signal 供模板使用</td>
    </tr>
    <tr>
      <td><code>toObservable(sig)</code></td>
      <td>Signal → Observable</td>
      <td>每次 signal 值改變時發送新值</td>
      <td>將 signal 接入需要 Observable 的 API（如 RxJS 操作符鏈）</td>
    </tr>
    <tr>
      <td><code>takeUntilDestroyed()</code></td>
      <td>訂閱清理</td>
      <td>在元件/服務銷毀時自動取消訂閱</td>
      <td>取代手動 <code>ngOnDestroy</code> + <code>unsubscribe</code></td>
    </tr>
  </tbody>
</table>
<p><strong>toSignal() 選項：</strong></p>
<ul>
  <li><code>initialValue</code>——Observable 發出第一個值之前的預設值。如果不提供，signal 型別是 <code>T | undefined</code></li>
  <li><code>requireSync</code>——斷言 Observable 會同步發出值（如 <code>BehaviorSubject</code>），避免 undefined</li>
  <li><code>manualCleanup</code>——禁用自動取消訂閱（極少使用）</li>
</ul>
<p><strong>選擇決策矩陣：</strong></p>
<table>
  <thead>
    <tr><th>場景</th><th>建議</th></tr>
  </thead>
  <tbody>
    <tr><td>模板綁定一個 Observable 的最新值</td><td><code>toSignal(obs$)</code></td></tr>
    <tr><td>將 signal 接入 RxJS 操作符鏈</td><td><code>toObservable(sig).pipe(...)</code></td></tr>
    <tr><td>新建的元件狀態</td><td>直接用 <code>signal()</code>，不需轉換</td></tr>
    <tr><td>HTTP 單次請求</td><td><code>resource()</code> 或 <code>firstValueFrom()</code></td></tr>
    <tr><td>持續的事件流（WebSocket、valueChanges）</td><td>保持 Observable，用 <code>toSignal()</code> 給模板</td></tr>
  </tbody>
</table>
      `,
      codeExamples: [
        {
          filename: 'interop-examples.ts',
          language: 'typescript',
          code: `import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { toSignal, toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, switchMap, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-interop-demo',
  template: \`
    <p>Server time: {{ serverTime() }}</p>
    <p>Selected user: {{ userName() }}</p>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteropDemo {
  private readonly http = inject(HttpClient);

  // ── Observable → Signal ──
  // Poll server time every 5 seconds, expose as signal
  protected readonly serverTime = toSignal(
    interval(5000).pipe(
      switchMap(() => this.http.get<{ time: string }>('/api/time')),
      map(res => res.time),
    ),
    { initialValue: 'Loading...' },
  );

  // ── Signal → Observable ──
  // Convert a signal to Observable for use in RxJS pipelines
  readonly selectedUserId = signal<string | null>(null);

  protected readonly userName = toSignal(
    toObservable(this.selectedUserId).pipe(
      switchMap(id =>
        id
          ? this.http.get<{ name: string }>(\`/api/users/\${id}\`).pipe(map(u => u.name))
          : ['No user selected']
      ),
    ),
    { initialValue: 'No user selected' },
  );
}`,
          annotation: 'toSignal() converts Observable to Signal, toObservable() converts Signal to Observable.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '<code>toSignal()</code> 預設會在元件銷毀時自動取消訂閱。但如果在 root 級服務的 constructor 中使用（沒有 <code>DestroyRef</code>），訂閱會永遠存在——確保這是你想要的行為。' },
        { type: 'warning', content: '<code>toSignal()</code> 立即訂閱 Observable。如果 Observable 是冷的且觸發副作用（如 HTTP 請求），確保這是你期望的時機。對於需要延遲觸發的場景，考慮使用 <code>resource()</code>。' },
        { type: 'dotnet-comparison', content: '<code>toSignal()</code> / <code>toObservable()</code> 類似 .NET 中 <code>IObservable&lt;T&gt;</code> 與 <code>Task&lt;T&gt;</code> 之間的轉換：<code>observable.ToTask()</code> 和 <code>TaskObservableExtensions.ToObservable(task)</code>。都是在兩種非同步模型之間架橋。' },
      ],
    },

    // ─── Section 6: Service-Level State ───
    {
      id: 'service-state',
      title: '服務級狀態管理',
      content: `
<p>
  對於中小型 Angular 應用，<strong>服務級狀態管理（Service-based State Management）</strong>
  使用 Signal 是最實用且最容易維護的模式。它不需要引入額外的狀態管理函式庫
  （如 NgRx、Akita），就能實現清晰的狀態流和可預測的狀態變更。
</p>
<p><strong>Store Service 設計原則：</strong></p>
<ol>
  <li><strong>單一職責</strong>——每個 Store Service 管理一個業務領域的狀態（如 CartStore、AuthStore）</li>
  <li><strong>私有可寫</strong>——所有 <code>WritableSignal</code> 都是 <code>private</code></li>
  <li><strong>唯讀暴露</strong>——對外只暴露 <code>Signal</code>（透過 <code>asReadonly()</code>）和 <code>computed()</code></li>
  <li><strong>命名方法</strong>——狀態修改只透過語義明確的公開方法進行</li>
  <li><strong>不可變更新</strong>——所有更新都回傳新物件/陣列參考</li>
</ol>
<p><strong>Store Service vs 全域狀態管理函式庫：</strong></p>
<ul>
  <li><strong>Store Service（Signal-based）</strong>——零額外依賴、學習曲線低、適合大部分應用。推薦作為預設選擇。</li>
  <li><strong>NgRx Signal Store</strong>——基於 Signal 的 NgRx 變體，提供 feature store、entity management 等進階功能。適合大型團隊或需要嚴格 Redux 模式的場景。</li>
  <li><strong>NgRx Store（Redux）</strong>——完整的 Redux 模式（actions、reducers、effects、selectors）。適合超大型應用且團隊對 Redux 有經驗。</li>
</ul>
<p>
  <strong>實務建議：</strong>先用 Signal-based Store Service 開始。當應用規模增長到
  多個團隊同時開發、需要嚴格的狀態變更追蹤（如 Redux DevTools），或有複雜的非同步協調需求時，
  再考慮遷移到 NgRx Signal Store。從簡單的 Store Service 遷移到 NgRx 的成本很低——
  因為核心概念（signal、computed、命名方法）是共通的。
</p>
      `,
      codeExamples: [
        {
          filename: 'auth.store.ts',
          language: 'typescript',
          code: `import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export interface AuthUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly roles: readonly string[];
}

interface AuthState {
  readonly user: AuthUser | null;
  readonly token: string | null;
  readonly loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Single source of truth — private and writable
  private readonly _state = signal<AuthState>({
    user: null,
    token: localStorage.getItem('auth_token'),
    loading: false,
  });

  // Public readonly selectors
  readonly user = computed(() => this._state().user);
  readonly token = computed(() => this._state().token);
  readonly loading = computed(() => this._state().loading);
  readonly isAuthenticated = computed(() => this._state().token !== null);
  readonly isAdmin = computed(() =>
    this._state().user?.roles.includes('admin') ?? false
  );

  constructor() {
    // Persist token to localStorage whenever it changes
    effect(() => {
      const token = this.token();
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    });
  }

  async login(email: string, password: string): Promise<void> {
    this._state.update(s => ({ ...s, loading: true }));

    try {
      const response = await firstValueFrom(
        this.http.post<{ user: AuthUser; token: string }>('/api/auth/login', {
          email,
          password,
        })
      );
      this._state.set({
        user: response.user,
        token: response.token,
        loading: false,
      });
    } catch {
      this._state.update(s => ({ ...s, loading: false }));
      throw new Error('Login failed');
    }
  }

  logout(): void {
    this._state.set({ user: null, token: null, loading: false });
    this.router.navigate(['/login']);
  }
}`,
          annotation: 'Complete auth store service: single state signal, computed selectors, named mutations, persistence via effect.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '將相關的多個 signal 合併為一個 state 物件 signal（如 <code>AuthState</code>），再用 <code>computed()</code> 建立各個 selector。這避免了多個 signal 之間的一致性問題——一次 <code>.set()</code> 就更新所有相關狀態。' },
        { type: 'tip', content: '<code>effect()</code> 用於 localStorage 持久化是完美的用例——每次 token 改變時自動同步到 localStorage，不需要在每個修改方法中手動呼叫。' },
        { type: 'dotnet-comparison', content: 'Store Service 模式類似 .NET Blazor 中的 <code>StateContainer</code> 模式——一個 scoped service 持有狀態，透過事件通知消費者。Angular 的 Signal 讓這個模式更自動化：不需要手動觸發 <code>NotifyStateChanged()</code>，signal 改變時模板自動更新。' },
      ],
    },

    // ─── Section 7: State Decision Matrix ───
    {
      id: 'state-decision-matrix',
      title: '狀態管理決策矩陣',
      content: `
<p>
  選擇正確的狀態管理策略取決於多個因素：應用規模、團隊大小、狀態複雜度、
  以及是否需要進階功能（如時間旅行除錯、狀態快照）。以下決策矩陣可以幫助你做出選擇。
</p>
<table>
  <thead>
    <tr>
      <th>維度</th>
      <th>Signal Store Service</th>
      <th>NgRx Signal Store</th>
      <th>NgRx Store (Redux)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><strong>學習曲線</strong></td><td>低</td><td>中</td><td>高</td></tr>
    <tr><td><strong>額外依賴</strong></td><td>無</td><td>@ngrx/signals</td><td>@ngrx/store + effects + entity</td></tr>
    <tr><td><strong>樣板程式碼</strong></td><td>極少</td><td>少</td><td>多（actions, reducers, selectors）</td></tr>
    <tr><td><strong>DevTools 支援</strong></td><td>Angular DevTools</td><td>Angular DevTools</td><td>Redux DevTools（時間旅行）</td></tr>
    <tr><td><strong>適合規模</strong></td><td>小到中型</td><td>中到大型</td><td>大型到超大型</td></tr>
    <tr><td><strong>團隊協作</strong></td><td>2-5 人</td><td>3-10 人</td><td>5+ 人（需共同規範）</td></tr>
    <tr><td><strong>Entity CRUD</strong></td><td>手動實作</td><td>withEntities()</td><td>@ngrx/entity</td></tr>
    <tr><td><strong>非同步協調</strong></td><td>effect() + resource()</td><td>rxMethod()</td><td>@ngrx/effects</td></tr>
    <tr><td><strong>測試策略</strong></td><td>直接測試 service 方法</td><td>同左 + store 測試工具</td><td>分別測試 action/reducer/effect</td></tr>
  </tbody>
</table>
<p><strong>建議決策流程：</strong></p>
<ol>
  <li>先問：「我是否需要跨元件共享狀態？」——如果不需要，元件內部的 <code>signal()</code> 就夠了。</li>
  <li>再問：「幾個元件需要共享這個狀態？」——2-5 個元件 → Signal Store Service。</li>
  <li>再問：「狀態是否有複雜的非同步流或需要嚴格的變更追蹤？」——是 → NgRx Signal Store。</li>
  <li>最後問：「團隊是否已有 Redux 經驗且應用超過 20+ 個 feature store？」——是 → NgRx Store。</li>
</ol>
<p>
  <strong>實務原則：</strong>YAGNI（You Ain't Gonna Need It）。從最簡單的方案開始，
  在真正遇到瓶頸時再升級。大多數 Angular 應用（包括相當大型的）都可以用
  Signal Store Service 成功管理。
</p>
      `,
      codeExamples: [
        {
          filename: 'state-at-each-level.ts',
          language: 'typescript',
          code: `// ── Level 1: Component-local state (no sharing needed) ──
@Component({ /* ... */ })
export class SearchBox {
  protected readonly query = signal('');
  protected readonly results = resource({
    request: () => this.query(),
    loader: ({ request }) => this.searchService.search(request),
  });
}

// ── Level 2: Signal Store Service (shared across a few components) ──
@Injectable({ providedIn: 'root' })
export class ThemeStore {
  private readonly _mode = signal<'light' | 'dark'>('light');
  readonly mode = this._mode.asReadonly();
  readonly isDark = computed(() => this._mode() === 'dark');

  toggle(): void {
    this._mode.update(m => m === 'light' ? 'dark' : 'light');
  }
}

// ── Level 3: NgRx Signal Store (complex entity management) ──
// import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
// import { withEntities, setAllEntities } from '@ngrx/signals/entities';
//
// export const ProductStore = signalStore(
//   { providedIn: 'root' },
//   withState({ loading: false }),
//   withEntities<Product>(),
//   withMethods((store, productService = inject(ProductService)) => ({
//     async loadAll() {
//       patchState(store, { loading: true });
//       const products = await firstValueFrom(productService.getAll());
//       patchState(store, setAllEntities(products), { loading: false });
//     },
//   })),
// );`,
          annotation: 'Three levels of state management — choose the simplest that meets your needs.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '從 Signal Store Service 開始是最安全的選擇。當你確實需要 entity adapter、Redux DevTools 時間旅行、或團隊規模超過 5 人需要嚴格的狀態規範時，再考慮升級到 NgRx Signal Store。' },
        { type: 'dotnet-comparison', content: '這個決策類似 .NET 中選擇狀態管理策略：簡單的 <code>Scoped Service</code>（對應 Signal Store Service）vs <code>MediatR</code>（對應 NgRx Signal Store）vs 完整的 CQRS + Event Sourcing（對應 NgRx Store）。原則一樣：從簡單開始。' },
      ],
    },

    // ─── Section 8: State Pitfalls ───
    {
      id: 'state-pitfalls',
      title: '常見陷阱',
      content: `
<p>
  以下是 Angular 狀態管理中最常見的 8 個錯誤，
  涵蓋 Signals、RxJS 互操作和 Store 設計三個層面。
</p>
<ol>
  <li>
    <strong>原地修改 signal 值：</strong>
    <code>items().push(newItem)</code> 不會觸發更新——signal 使用參考比較。
    修正：<code>items.update(list =&gt; [...list, newItem])</code>。
  </li>
  <li>
    <strong>用 effect() 同步 signal：</strong>
    <code>effect(() =&gt; { targetSignal.set(sourceSignal()) })</code> 是反模式。
    修正：使用 <code>computed()</code>（唯讀）或 <code>linkedSignal()</code>（可寫）。
  </li>
  <li>
    <strong>effect() 中使用 async/await 導致追蹤遺漏：</strong>
    <code>await</code> 之後讀取的 signal 不會被追蹤。
    修正：在 <code>await</code> 前將所有需要追蹤的 signal 值存入區域變數。
  </li>
  <li>
    <strong>toSignal() 遺漏 initialValue：</strong>
    不提供 <code>initialValue</code> 會導致 signal 型別為 <code>T | undefined</code>，需要在模板中處理 undefined。
    修正：提供合理的 <code>initialValue</code> 或在模板中用 <code>@if</code> 守衛。
  </li>
  <li>
    <strong>忘記取消 Observable 訂閱：</strong>
    在 <code>ngOnInit</code> 中 <code>.subscribe()</code> 卻不清理，導致記憶體洩漏。
    修正：使用 <code>takeUntilDestroyed()</code> 或直接用 <code>toSignal()</code>。
  </li>
  <li>
    <strong>Store Service 缺少唯讀暴露：</strong>
    直接將 <code>WritableSignal</code> 設為 public，任何元件都能呼叫 <code>.set()</code>。
    修正：使用 <code>.asReadonly()</code> 暴露，提供命名修改方法。
  </li>
  <li>
    <strong>過度使用全域狀態：</strong>
    將所有東西都放進 root-level Store，導致 Store 臃腫且難以測試。
    修正：只有真正需要跨元件共享的狀態才放進 Store。元件內部狀態用 local <code>signal()</code>。
  </li>
  <li>
    <strong>computed 中有副作用：</strong>
    在 <code>computed()</code> 中呼叫 API、寫 localStorage、修改 DOM。
    <code>computed()</code> 是純函式，可能被惰性求值——副作用可能不會執行。
    修正：副作用放在 <code>effect()</code> 中。
  </li>
</ol>
      `,
      codeExamples: [
        {
          filename: 'state-pitfall-async-tracking.ts',
          language: 'typescript',
          code: `import { signal, effect } from '@angular/core';

const userId = signal('user-1');
const theme = signal('dark');

// ❌ Wrong — theme() is read after await, NOT tracked
effect(async () => {
  const data = await fetch(\`/api/users/\${userId()}\`);
  const user = await data.json();
  // theme() read here is NOT tracked by the effect!
  console.log(\`User: \${user.name}, Theme: \${theme()}\`);
});

// ✅ Correct — capture all signal values before await
effect(async () => {
  const id = userId();       // tracked
  const currentTheme = theme(); // tracked

  const data = await fetch(\`/api/users/\${id}\`);
  const user = await data.json();
  console.log(\`User: \${user.name}, Theme: \${currentTheme}\`);
});`,
          annotation: 'Always read signals BEFORE any await — reactive tracking is synchronous only.',
        },
        {
          filename: 'state-pitfall-computed-side-effect.ts',
          language: 'typescript',
          code: `import { signal, computed, effect } from '@angular/core';

const items = signal<readonly string[]>(['a', 'b', 'c']);

// ❌ Wrong — computed with side effects
const itemCount = computed(() => {
  const count = items().length;
  // Side effects in computed are UNRELIABLE — it's lazily evaluated!
  localStorage.setItem('item_count', String(count));
  console.log('Count updated:', count); // May not run when you expect
  return count;
});

// ✅ Correct — computed is pure, effect handles side effects
const itemCountPure = computed(() => items().length);

effect(() => {
  const count = itemCountPure();
  localStorage.setItem('item_count', String(count));
  console.log('Count updated:', count);
});`,
          annotation: 'computed() must be pure — move side effects to effect().',
        },
      ],
      tips: [
        { type: 'warning', content: '<code>computed()</code> 的核心契約是<strong>純函式</strong>——相同的 signal 輸入永遠產生相同的輸出，沒有副作用。Angular 可能在任何時間點（或不在你預期的時間點）重新計算它。將副作用放在 <code>effect()</code> 中。' },
        { type: 'best-practice', content: '記住「最小權限」原則：<strong>元件局部狀態 → signal()</strong>，<strong>功能內共享 → 元件級 Service</strong>，<strong>跨功能共享 → root-level Store Service</strong>。不要讓所有狀態都跑到全域。' },
        { type: 'dotnet-comparison', content: '這些陷阱在 .NET 中也有對應：原地修改類似 WPF 中修改 ObservableCollection 的元素但忘記觸發 PropertyChanged；computed 有副作用類似在 C# property getter 中執行寫入操作——看起來能跑但行為不可預測。' },
      ],
    },
  ],
};

@Component({
  selector: 'app-ch04',
  imports: [GuidePage],
  template: '<app-guide-page [chapter]="chapter" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ch04StateManagement {
  protected readonly chapter = CHAPTER;
}
