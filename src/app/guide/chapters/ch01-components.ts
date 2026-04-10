import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GuidePage } from '../shared/guide-page';
import { GuideChapter } from '../models/guide-chapter';

const CHAPTER: GuideChapter = {
  id: 'components',
  number: 1,
  title: '元件宣告與生命週期',
  subtitle: '@Component 裝飾器、Signal API、模板語法、元件通訊',
  icon: 'widgets',
  category: 'fundamentals',
  tags: ['component', 'lifecycle', 'signals', 'template', 'standalone'],
  estimatedMinutes: 45,
  sections: [
    // ─── Section 1: @Component Decorator ───
    {
      id: 'component-decorator',
      title: '@Component 裝飾器',
      content: `
<p>
  在 Angular 中，元件是構成 UI 的最小單位。每個元件都透過 <code>@Component</code> 裝飾器（decorator）
  來定義其 metadata，告訴框架該如何編譯、渲染和連接這個元件。
  自 Angular v19 起，所有元件預設為 <strong>standalone</strong>，不需要也不應該手動設定 <code>standalone: true</code>。
</p>
<p>以下是 <code>@Component</code> 裝飾器所有重要的 metadata 屬性一覽：</p>
<table>
  <thead>
    <tr><th>屬性</th><th>說明</th><th>範例</th></tr>
  </thead>
  <tbody>
    <tr><td><code>selector</code></td><td>元件的 CSS 選擇器，用於在 HTML 模板中引用此元件</td><td><code>'app-user-profile'</code></td></tr>
    <tr><td><code>imports</code></td><td>此元件依賴的其他元件、指令、管線（standalone 架構下取代 NgModule 的 declarations/imports）</td><td><code>[MatIconModule, RouterLink]</code></td></tr>
    <tr><td><code>template</code></td><td>行內 HTML 模板字串（適合小型元件）</td><td><code>\`&lt;h1&gt;Hello&lt;/h1&gt;\`</code></td></tr>
    <tr><td><code>templateUrl</code></td><td>外部 HTML 模板檔案路徑（相對於 TS 檔案位置）</td><td><code>'./user-profile.html'</code></td></tr>
    <tr><td><code>styles</code></td><td>行內 CSS 樣式陣列</td><td><code>[\`:host { display: block }\`]</code></td></tr>
    <tr><td><code>styleUrl</code></td><td>外部 CSS 檔案路徑（Angular v17+ 支援單數形式）</td><td><code>'./user-profile.css'</code></td></tr>
    <tr><td><code>changeDetection</code></td><td>變更偵測策略，<strong>務必設定為 OnPush</strong></td><td><code>ChangeDetectionStrategy.OnPush</code></td></tr>
    <tr><td><code>encapsulation</code></td><td>視圖封裝策略（Emulated 為預設，ShadowDom / None 視需求選用）</td><td><code>ViewEncapsulation.Emulated</code></td></tr>
    <tr><td><code>host</code></td><td>宿主元素（host element）綁定——屬性、CSS 類別、事件監聽器</td><td><code>{ '[class.active]': 'isActive()', '(click)': 'onClick()' }</code></td></tr>
    <tr><td><code>providers</code></td><td>元件級 DI 提供者，生命週期與該元件綁定</td><td><code>[LocalStateService]</code></td></tr>
  </tbody>
</table>
<p>
  <strong>命名慣例：</strong>selector 使用小寫加連字號（kebab-case），並以專案前綴開頭（如 <code>app-</code>）。
  類別名稱使用 PascalCase，不附加 <code>Component</code> 後綴（除非專案明確規定）。
</p>
<p>
  <strong>關於 host：</strong>所有宿主元素上的屬性綁定與事件監聽都應在 <code>host</code> 物件中宣告，
  禁止使用已棄用的 <code>@HostBinding</code> 和 <code>@HostListener</code> 裝飾器。
  這種寫法讓 metadata 更集中且易於靜態分析。
</p>
      `,
      codeExamples: [
        {
          filename: 'user-profile.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-profile',
  imports: [MatIconModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'article',
    '[class.premium]': 'isPremium()',
    '[attr.aria-label]': '"User profile for " + name()',
  },
})
export class UserProfile {
  readonly name = input.required<string>();
  readonly isPremium = input(false);
}`,
          annotation: 'A complete component declaration showcasing all commonly used metadata properties.',
        },
      ],
      tips: [
        { type: 'warning', content: '在 Angular v19+ 中，不要手動設定 <code>standalone: true</code>——它已經是預設值。加上去反而可能在未來版本產生 linting 警告。' },
        { type: 'best-practice', content: '永遠設定 <code>changeDetection: ChangeDetectionStrategy.OnPush</code>。這是所有元件的強制規範，能大幅改善渲染效能。' },
        { type: 'dotnet-comparison', content: '可以把 <code>@Component</code> 裝飾器類比為 .NET 中的 <code>[ApiController]</code> 或 Blazor 的 <code>@page</code> 指令：它們都是宣告式 metadata，告訴框架如何處理這個類別。' },
      ],
    },

    // ─── Section 2: Lifecycle Hooks ───
    {
      id: 'lifecycle-hooks',
      title: '生命週期鉤子',
      content: `
<p>
  Angular 元件從建立到銷毀，會經歷一系列明確定義的<strong>生命週期階段</strong>。
  框架在每個階段會呼叫對應的鉤子方法（lifecycle hook），讓我們有機會在正確的時機執行初始化、
  偵測變更或清理資源等操作。
</p>
<p>以下是全部生命週期鉤子的<strong>執行順序</strong>：</p>
<ol>
  <li><code>constructor</code> — 類別實例化，DI 注入完成（但 input 值尚未可用）</li>
  <li><code>ngOnChanges(changes)</code> — 每次 input 綁定值改變時觸發（首次設定也會觸發）</li>
  <li><code>ngOnInit()</code> — 元件初始化完成，input 已可用。<strong>只呼叫一次</strong></li>
  <li><code>ngDoCheck()</code> — 每次變更偵測執行時觸發（用於自訂偵測邏輯，慎用）</li>
  <li><code>ngAfterContentInit()</code> — <code>&lt;ng-content&gt;</code> 投射內容初始化完成</li>
  <li><code>ngAfterContentChecked()</code> — 投射內容每次變更偵測後觸發</li>
  <li><code>ngAfterViewInit()</code> — 元件視圖（含子元件）初始化完成</li>
  <li><code>ngAfterViewChecked()</code> — 元件視圖每次變更偵測後觸發</li>
  <li><code>ngOnDestroy()</code> — 元件即將銷毀。用於清理訂閱、計時器等資源</li>
</ol>
<p>
  <strong>實務建議：</strong>在 Signal-based 的現代 Angular 中，大部分原本需要 <code>ngOnChanges</code> 的場景
  都可以用 <code>computed()</code> 或 <code>effect()</code> 取代。只有在必須存取 <code>SimpleChanges</code> 物件
  （如知道哪個 input 從什麼值變成什麼值）時才使用 <code>ngOnChanges</code>。
</p>
<p>
  <code>ngOnDestroy</code> 仍然重要，但搭配 <code>DestroyRef</code> 和 <code>takeUntilDestroyed()</code>
  之後，手動取消訂閱的程式碼可以大幅簡化。
</p>
      `,
      codeExamples: [
        {
          filename: 'lifecycle-demo.ts',
          language: 'typescript',
          code: `import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject,
  input,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({
  selector: 'app-lifecycle-demo',
  template: \`<p>Lifecycle demo running. Check the console.</p>\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LifecycleDemo implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  readonly refreshMs = input(5000);

  ngOnInit(): void {
    console.log('[ngOnInit] Component initialized, input ready:', this.refreshMs());

    // Auto-cleanup: subscription is torn down when the component is destroyed
    interval(this.refreshMs())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(tick => console.log('[interval] tick:', tick));
  }

  ngAfterViewInit(): void {
    console.log('[ngAfterViewInit] View is ready, DOM queries are safe now.');
  }

  ngOnDestroy(): void {
    console.log('[ngOnDestroy] Cleaning up...');
  }
}`,
          annotation: 'Demonstrates lifecycle hooks with takeUntilDestroyed for automatic subscription cleanup.',
        },
      ],
      tips: [
        { type: 'tip', content: '使用 <code>takeUntilDestroyed()</code> 搭配 <code>DestroyRef</code> 來自動清理 Observable 訂閱，不再需要手動在 <code>ngOnDestroy</code> 中逐一 unsubscribe。' },
        { type: 'dotnet-comparison', content: '生命週期鉤子類似 .NET 的 <code>IDisposable.Dispose()</code>（對應 <code>ngOnDestroy</code>）和 Blazor 的 <code>OnInitializedAsync</code>（對應 <code>ngOnInit</code>）、<code>OnAfterRenderAsync</code>（對應 <code>ngAfterViewInit</code>）。' },
        { type: 'warning', content: '避免在 <code>ngDoCheck</code> 和 <code>ngAfterViewChecked</code> 中執行複雜運算——它們在每次變更偵測都會觸發，可能嚴重影響效能。' },
      ],
    },

    // ─── Section 3: Signal API ───
    {
      id: 'signal-api',
      title: 'Signal 元件 API',
      content: `
<p>
  Angular 從 v16 開始引入 <strong>Signals</strong>，到 v21 已成為元件反應式程式設計的主要基礎。
  Signal 是一種包裝值的容器，當值改變時會自動通知所有依賴它的消費者（模板、computed、effect）。
  所有元件的 input、output、查詢（query）都應使用 signal-based API。
</p>
<p>以下是元件中常用的 Signal API 總覽：</p>
<table>
  <thead>
    <tr><th>API</th><th>用途</th><th>簽名範例</th></tr>
  </thead>
  <tbody>
    <tr><td><code>input()</code></td><td>可選輸入，提供預設值</td><td><code>input(0)</code>, <code>input&lt;string&gt;('')</code></td></tr>
    <tr><td><code>input.required()</code></td><td>必填輸入，父元件必須傳值</td><td><code>input.required&lt;string&gt;()</code></td></tr>
    <tr><td><code>output()</code></td><td>事件輸出，取代 <code>@Output</code> + <code>EventEmitter</code></td><td><code>output&lt;User&gt;()</code></td></tr>
    <tr><td><code>model()</code></td><td>雙向繫結（two-way binding）的 signal input</td><td><code>model(false)</code>, <code>model.required&lt;string&gt;()</code></td></tr>
    <tr><td><code>computed()</code></td><td>衍生值，自動追蹤相依 signal 並記憶化</td><td><code>computed(() =&gt; items().length)</code></td></tr>
    <tr><td><code>effect()</code></td><td>副作用，signal 值改變時自動重新執行</td><td><code>effect(() =&gt; console.log(count()))</code></td></tr>
    <tr><td><code>viewChild()</code></td><td>查詢視圖中的子元件或元素</td><td><code>viewChild(MyChart)</code></td></tr>
    <tr><td><code>contentChild()</code></td><td>查詢 ng-content 投射的子元件</td><td><code>contentChild(TabPanel)</code></td></tr>
  </tbody>
</table>
<p>
  <strong>讀取值：</strong>所有 signal 型別都透過呼叫函式取值——<code>name()</code> 而非 <code>name</code>。
  在模板中也是如此：<code>{{ name() }}</code>。這讓 Angular 能精確追蹤哪些模板區塊依賴哪些值，
  實現更細粒度的變更偵測。
</p>
<p>
  <strong>更新值：</strong><code>signal()</code> 建立的可寫入 signal 提供 <code>.set(value)</code> 和
  <code>.update(prev =&gt; next)</code> 方法。注意 <code>.mutate()</code> 已被移除——
  永遠回傳新的參考值（immutable update）。
</p>
      `,
      codeExamples: [
        {
          filename: 'counter.ts',
          language: 'typescript',
          code: `import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <p>Count: {{ count() }}</p>
    <p>Double: {{ double() }}</p>
    <button (click)="increment()">+1</button>
    <button (click)="reset()">Reset</button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Counter {
  // Signal-based input with default value
  readonly step = input(1);

  // Two-way binding signal input
  readonly count = model(0);

  // Output event
  readonly countChanged = output<number>();

  // Computed derived value — automatically recalculates when count() changes
  protected readonly double = computed(() => this.count() * 2);

  constructor() {
    // Side effect — runs whenever count() changes
    effect(() => {
      console.log('Count is now:', this.count());
    });
  }

  protected increment(): void {
    this.count.update(c => c + this.step());
    this.countChanged.emit(this.count());
  }

  protected reset(): void {
    this.count.set(0);
    this.countChanged.emit(0);
  }
}`,
          annotation: 'Demonstrates input(), model(), output(), computed(), effect(), and signal update patterns.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '所有 <code>input()</code>、<code>output()</code>、<code>viewChild()</code> 宣告都應加上 <code>readonly</code> 修飾符——它們是由框架管理的，不應被重新賦值。' },
        { type: 'dotnet-comparison', content: 'Signal 類似 .NET 的 <code>INotifyPropertyChanged</code>，但更自動化。<code>computed()</code> 等同於 Excel 公式或 Blazor 中依賴屬性變更的 getter——當相依值改變時自動重算，且具有記憶化（memoization）特性。' },
        { type: 'warning', content: '<code>.mutate()</code> API 已從 Angular 移除。如果你看到舊教學使用它，請改用 <code>.update(prev =&gt; newValue)</code> 並回傳新參考。' },
      ],
    },

    // ─── Section 4: Template Syntax ───
    {
      id: 'template-syntax',
      title: '模板控制流',
      content: `
<p>
  Angular v17 引入了全新的<strong>內建模板控制流語法</strong>（built-in control flow），
  使用 <code>@if</code>、<code>@for</code>、<code>@switch</code> 取代舊有的結構型指令
  <code>*ngIf</code>、<code>*ngFor</code>、<code>*ngSwitch</code>。
  新語法與 TypeScript / JavaScript 的控制流更一致，且效能更好（不需要建立額外的指令實例）。
</p>
<p><strong>控制流語法一覽：</strong></p>
<ul>
  <li><code>@if (condition) { ... } @else if (other) { ... } @else { ... }</code></li>
  <li><code>@for (item of items(); track item.id) { ... } @empty { ... }</code></li>
  <li><code>@switch (value()) { @case ('a') { ... } @default { ... } }</code></li>
  <li><code>@defer (on viewport) { ... } @loading { ... } @placeholder { ... } @error { ... }</code></li>
  <li><code>@let variable = expression();</code> — 在模板中宣告區域變數（v18+）</li>
</ul>
<p>
  <strong>@for 的 track 是必填的：</strong>Angular 使用 track 表達式來識別集合中每個項目的身份，
  以便在集合變更時最小化 DOM 操作。常用模式：<code>track item.id</code>（物件陣列）或
  <code>track $index</code>（基本型別陣列或無唯一 ID 的情況）。
</p>
<p>
  <strong>@for 隱含變數：</strong><code>$index</code>、<code>$count</code>、<code>$first</code>、
  <code>$last</code>、<code>$even</code>、<code>$odd</code>，可直接在 <code>@for</code> 區塊中使用。
</p>
<p>
  <strong>@defer 觸發器：</strong><code>on viewport</code>（進入可視區域）、<code>on idle</code>（瀏覽器閒置）、
  <code>on interaction</code>（使用者互動）、<code>on hover</code>（滑鼠懸停）、
  <code>on timer(ms)</code>（延時）、<code>on immediate</code>（立即）、
  <code>when condition</code>（條件為 true）。@defer 可大幅降低首次載入的 bundle 大小。
</p>
      `,
      codeExamples: [
        {
          filename: 'template-control-flow.html',
          language: 'html',
          code: `<!-- @if / @else -->
@if (user(); as u) {
  <h1>Welcome, {{ u.name }}</h1>
} @else {
  <p>Please log in.</p>
}

<!-- @for with track + implicit variables -->
@for (item of cartItems(); track item.id; let idx = $index, last = $last) {
  <div [class.last-item]="last">
    {{ idx + 1 }}. {{ item.name }} — \${{ item.price }}
  </div>
} @empty {
  <p>Your cart is empty.</p>
}

<!-- @switch -->
@switch (order().status) {
  @case ('pending') { <span class="badge warning">Pending</span> }
  @case ('shipped') { <span class="badge info">Shipped</span> }
  @case ('delivered') { <span class="badge success">Delivered</span> }
  @default { <span class="badge">Unknown</span> }
}

<!-- @defer — lazy load a heavy chart only when visible -->
@defer (on viewport) {
  <app-analytics-chart [data]="chartData()" />
} @placeholder {
  <div class="skeleton-chart"></div>
} @loading (minimum 300ms) {
  <p>Loading chart...</p>
} @error {
  <p>Failed to load chart.</p>
}

<!-- @let — template-local variable -->
@let total = cartItems().reduce((sum, i) => sum + i.price, 0);
<p>Total: \${{ total }}</p>`,
          annotation: 'Complete examples of @if, @for, @switch, @defer, and @let template control flow.',
        },
        {
          filename: 'migration-comparison.ts',
          language: 'typescript',
          code: `// ❌ Old — structural directive syntax (deprecated)
// <div *ngIf="user$ | async as user">{{ user.name }}</div>
// <li *ngFor="let item of items; trackBy: trackById">{{ item.name }}</li>

// ✅ New — built-in control flow (Angular v17+)
// @if (user(); as u) { <div>{{ u.name }}</div> }
// @for (item of items(); track item.id) { <li>{{ item.name }}</li> }

// Migration command:
// ng generate @angular/core:control-flow`,
          annotation: 'Migration path: use the Angular CLI schematic to auto-migrate from *ngIf/*ngFor to @if/@for.',
        },
      ],
      tips: [
        { type: 'warning', content: '永遠不要在新程式碼中使用 <code>*ngIf</code>、<code>*ngFor</code>、<code>*ngSwitch</code>——它們在 v17+ 已被內建控制流取代，未來版本可能完全移除。' },
        { type: 'best-practice', content: '<code>@for</code> 的 <code>track</code> 表達式務必選擇穩定的唯一識別值（如 <code>item.id</code>）。使用 <code>$index</code> 做為 track 只適合不會重新排序的簡單列表。' },
        { type: 'tip', content: '<code>@defer</code> 是提升首次載入效能的利器。將折疊面板、頁面下半段、或大型圖表包在 <code>@defer (on viewport)</code> 中，可以讓它們在進入可視區域時才載入對應的 JavaScript。' },
      ],
    },

    // ─── Section 5: Component Communication ───
    {
      id: 'component-communication',
      title: '元件通訊模式',
      content: `
<p>
  Angular 提供多種元件間通訊機制，適用於不同的場景。選擇正確的模式對於維護清晰的資料流
  和可測試的架構至關重要。以下是所有主要通訊方式的比較：
</p>
<table>
  <thead>
    <tr><th>模式</th><th>方向</th><th>使用場景</th><th>API</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Input / Output</strong></td>
      <td>父 → 子 / 子 → 父</td>
      <td>直接父子元件間的資料傳遞和事件通知</td>
      <td><code>input()</code>, <code>output()</code></td>
    </tr>
    <tr>
      <td><strong>Model (Two-way)</strong></td>
      <td>父 ↔ 子</td>
      <td>表單控制項等需要雙向同步的場景</td>
      <td><code>model()</code></td>
    </tr>
    <tr>
      <td><strong>ViewChild</strong></td>
      <td>父 → 子（命令式）</td>
      <td>父元件需要直接呼叫子元件方法或存取子元件實例</td>
      <td><code>viewChild()</code></td>
    </tr>
    <tr>
      <td><strong>ContentChild</strong></td>
      <td>投射者 → 被投射元件</td>
      <td>透過 <code>&lt;ng-content&gt;</code> 投射的子元件查詢</td>
      <td><code>contentChild()</code></td>
    </tr>
    <tr>
      <td><strong>Service (Shared Signal)</strong></td>
      <td>任意方向</td>
      <td>跨層級（非直接父子）元件共享狀態</td>
      <td><code>inject(SharedService)</code></td>
    </tr>
    <tr>
      <td><strong>Router Params</strong></td>
      <td>路由 → 元件</td>
      <td>透過 URL 參數傳遞識別資訊</td>
      <td><code>input()</code> with <code>withComponentInputBinding()</code></td>
    </tr>
  </tbody>
</table>
<p>
  <strong>選擇原則：</strong>優先使用最簡單的方式。父子通訊用 input/output；
  兄弟元件或跨層級通訊則提升到共享 Service。
  避免使用 ViewChild 來傳遞資料——它應僅用於需要命令式操作（如觸發動畫、焦點管理）的場景。
</p>
<p>
  在 Signal-based 架構下，推薦的服務通訊模式是在 Service 中暴露
  <code>readonly</code> signal（透過 <code>asReadonly()</code>），提供明確的修改方法，
  確保狀態變更可追蹤。
</p>
      `,
      codeExamples: [
        {
          filename: 'parent-child-communication.ts',
          language: 'typescript',
          code: `// ── Child component ──
@Component({
  selector: 'app-item-card',
  template: \`
    <div class="card">
      <h3>{{ title() }}</h3>
      <button (click)="remove()">Delete</button>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCard {
  readonly title = input.required<string>();
  readonly deleted = output<void>();

  protected remove(): void {
    this.deleted.emit();
  }
}

// ── Parent component template ──
// @for (item of items(); track item.id) {
//   <app-item-card [title]="item.name" (deleted)="onDelete(item.id)" />
// }`,
          annotation: 'Standard parent-child communication using signal-based input() and output().',
        },
        {
          filename: 'shared-state.service.ts',
          language: 'typescript',
          code: `import { Injectable, signal } from '@angular/core';

export interface Notification {
  readonly id: string;
  readonly message: string;
  readonly type: 'info' | 'error';
}

@Injectable({ providedIn: 'root' })
export class NotificationStore {
  private readonly _notifications = signal<readonly Notification[]>([]);

  // Expose as readonly — consumers cannot call .set() or .update()
  readonly notifications = this._notifications.asReadonly();

  add(notification: Notification): void {
    this._notifications.update(list => [...list, notification]);
  }

  dismiss(id: string): void {
    this._notifications.update(list => list.filter(n => n.id !== id));
  }
}`,
          annotation: 'Service-based communication using signals with readonly exposure.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '遵循「資料往下流、事件往上送」原則：父元件透過 <code>input()</code> 傳遞資料，子元件透過 <code>output()</code> 發送事件。不要讓子元件直接修改父元件的狀態。' },
        { type: 'dotnet-comparison', content: '這類似 Blazor 的 <code>[Parameter]</code>（對應 <code>input()</code>）和 <code>EventCallback</code>（對應 <code>output()</code>）。Blazor 也遵循相同的單向資料流模式。' },
      ],
    },

    // ─── Section 6: Smart vs Presentational ───
    {
      id: 'smart-presentational',
      title: 'Smart vs Presentational 元件',
      content: `
<p>
  將元件分為 <strong>Smart（智慧型）</strong>和 <strong>Presentational（展示型）</strong>
  兩類是 Angular 應用架構中最重要的設計模式之一。這個模式能有效分離關注點，
  讓程式碼更容易測試、重用和理解。
</p>
<p><strong>Smart 元件（Container）：</strong></p>
<ul>
  <li>負責<strong>業務邏輯和資料獲取</strong>——注入 Service、呼叫 API、管理狀態</li>
  <li>通常對應一個路由頁面或功能區塊的根元件</li>
  <li>不關心視覺呈現——透過 input 將資料傳給展示型子元件</li>
  <li>包含 <code>effect()</code>、<code>resource()</code> 等副作用相關邏輯</li>
</ul>
<p><strong>Presentational 元件（Dumb）：</strong></p>
<ul>
  <li>純粹負責<strong>視覺呈現</strong>——接收 input、發送 output，不直接存取 Service</li>
  <li>高度可重用——同一個元件可在不同 Smart 元件下使用</li>
  <li>容易測試——只需傳入固定的 input 值即可驗證渲染結果</li>
  <li>通常包含模板邏輯（<code>@if</code>、<code>@for</code>）和樣式，但不包含業務規則</li>
</ul>
<p><strong>目錄結構範例：</strong></p>
<ul>
  <li><code>src/app/orders/</code> — 功能目錄</li>
  <li><code>src/app/orders/order-list.ts</code> — Smart 元件（路由頁面）</li>
  <li><code>src/app/orders/order-card.ts</code> — Presentational（訂單卡片）</li>
  <li><code>src/app/orders/order-status-badge.ts</code> — Presentational（狀態標籤）</li>
  <li><code>src/app/orders/order.service.ts</code> — Service（資料存取）</li>
</ul>
      `,
      codeExamples: [
        {
          filename: 'order-list.ts',
          language: 'typescript',
          code: `// Smart component — handles data fetching and business logic
@Component({
  selector: 'app-order-list',
  imports: [OrderCard],
  template: \`
    @if (orders.isLoading()) {
      <p>Loading...</p>
    } @else {
      @for (order of orders.value() ?? []; track order.id) {
        <app-order-card
          [order]="order"
          (cancelled)="cancelOrder(order.id)"
        />
      } @empty {
        <p>No orders found.</p>
      }
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderList {
  private readonly orderService = inject(OrderService);

  protected readonly orders = resource({
    loader: () => this.orderService.getAll(),
  });

  protected cancelOrder(id: string): void {
    this.orderService.cancel(id);
  }
}`,
          annotation: 'Smart component: fetches data via service, delegates rendering to presentational children.',
        },
      ],
      tips: [
        { type: 'best-practice', content: '如果你發現一個元件同時注入了 Service（資料存取）又包含大量模板邏輯，請考慮將它拆分。Service 注入集中在 Smart 元件，模板邏輯放在 Presentational 元件。' },
        { type: 'dotnet-comparison', content: '這等同於 .NET MVC 中 Controller（Smart）與 Partial View（Presentational）的分離，或 Blazor 中 Page component（Smart）與 Shared component（Presentational）的區分。' },
      ],
    },

    // ─── Section 7: Standalone Migration ───
    {
      id: 'standalone-migration',
      title: 'Standalone 遷移',
      content: `
<p>
  Angular v19 起，所有新建元件、指令、管線預設都是 <strong>standalone</strong>——
  不需要 <code>NgModule</code> 來宣告或分組它們。
  這代表著 Angular 架構的重大轉變：從以模組為中心轉為以元件為中心。
</p>
<p><strong>NgModule vs Standalone 比較：</strong></p>
<table>
  <thead>
    <tr><th>面向</th><th>NgModule 模式</th><th>Standalone 模式</th></tr>
  </thead>
  <tbody>
    <tr><td>依賴宣告</td><td>在 module 的 <code>imports/declarations</code></td><td>在元件的 <code>imports</code> 陣列</td></tr>
    <tr><td>範圍</td><td>模組級——同一模組內所有元件共享</td><td>元件級——每個元件明確宣告自己的依賴</td></tr>
    <tr><td>Tree-shaking</td><td>較差——未使用的元件可能被打包</td><td>優秀——只有被 import 的元件才會被打包</td></tr>
    <tr><td>路由</td><td><code>loadChildren(() =&gt; Module)</code></td><td><code>loadComponent(() =&gt; Component)</code></td></tr>
    <tr><td>測試</td><td>需要設定完整 TestBed module</td><td>只需 import 被測元件及其直接依賴</td></tr>
    <tr><td>學習曲線</td><td>需理解模組、forRoot/forChild 等模式</td><td>更直覺——元件是自包含的單位</td></tr>
  </tbody>
</table>
<p><strong>遷移步驟：</strong></p>
<ol>
  <li>使用 Angular CLI schematic 自動遷移：<code>ng generate @angular/core:standalone</code></li>
  <li>將 <code>NgModule</code> 的 <code>declarations</code> 中的元件逐一轉為 standalone——在元件上加入 <code>imports</code> 陣列</li>
  <li>移除空的 NgModule 檔案</li>
  <li>更新 <code>bootstrapModule</code> 為 <code>bootstrapApplication</code></li>
  <li>更新路由設定，使用 <code>loadComponent</code> 取代 <code>loadChildren(() =&gt; Module)</code></li>
  <li>執行 <code>ng build</code> 確認無編譯錯誤</li>
</ol>
<p>
  在 Angular v19+，你不應該也不需要手動加入 <code>standalone: true</code>——它已是預設行為。
  如果在裝飾器中明確寫出，未來版本可能產生 lint 警告。
</p>
      `,
      codeExamples: [
        {
          filename: 'before-ngmodule.ts',
          language: 'typescript',
          code: `// ❌ Old pattern — NgModule-based
@NgModule({
  declarations: [UserList, UserCard, UserBadge],
  imports: [CommonModule, MatCardModule, MatIconModule],
  exports: [UserList],
})
export class UserModule {}

// ──────────────────────────────────────────

// ✅ New pattern — Standalone
@Component({
  selector: 'app-user-list',
  imports: [UserCard, UserBadge, MatCardModule, MatIconModule],
  templateUrl: './user-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  // Each component declares its own dependencies
}`,
          annotation: 'Before/after comparison: NgModule vs standalone component architecture.',
        },
        {
          filename: 'main.ts',
          language: 'typescript',
          code: `// ✅ Standalone bootstrap — no AppModule needed
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { App } from './app/app';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/auth/auth.interceptor';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
  ],
}).catch(err => console.error(err));`,
          annotation: 'Standalone bootstrap with provideRouter, provideHttpClient, and provideAnimationsAsync.',
        },
      ],
      tips: [
        { type: 'tip', content: '使用 <code>ng generate @angular/core:standalone</code> CLI schematic 可以自動完成大部分遷移工作——它會分析依賴關係並自動將元件轉為 standalone。' },
        { type: 'dotnet-comparison', content: 'Standalone 遷移類似 .NET 從 <code>Startup.cs</code> + <code>Program.cs</code> 分離模式遷移到 .NET 6+ 的 Minimal API 單一 <code>Program.cs</code> 模式——減少樣板程式碼，讓依賴更明確。' },
      ],
    },

    // ─── Section 8b: Lifecycle Trigger Mechanism (Deep-dive) ───
    {
      id: 'lifecycle-trigger-mechanism',
      title: '生命週期鉤子觸發機制（框架內部）',
      content: `
<p>生命週期鉤子的觸發與 Angular 的<strong>變更偵測循環（Change Detection Cycle）</strong>緊密耦合。每次 CD 走訪到一個元件時，框架會依照固定順序執行以下步驟：</p>
<ol>
<li><strong>更新 Input bindings</strong> — 如果父元件傳入的 Input 參考值有變化，觸發 <code>ngOnChanges()</code></li>
<li><strong>首次初始化</strong> — 僅在第一次 CD 時觸發 <code>ngOnInit()</code></li>
<li><strong>自訂髒檢查</strong> — 每次 CD 都觸發 <code>ngDoCheck()</code>（⚠️ 極高頻率）</li>
<li><strong>Content 投射完成</strong> — <code>ngAfterContentInit()</code>（首次）+ <code>ngAfterContentChecked()</code>（每次）</li>
<li><strong>更新 View bindings</strong> — 處理模板中的 property bindings 和 text interpolations</li>
<li><strong>遞迴子元件</strong> — 對子元件重複步驟 1-5</li>
<li><strong>View 初始化完成</strong> — <code>ngAfterViewInit()</code>（首次）+ <code>ngAfterViewChecked()</code>（每次）</li>
</ol>
<p>在 <strong>OnPush 模式</strong>下，步驟 1 只在 Input reference 改變、DOM 事件觸發、或手動 <code>markForCheck()</code> 時才會進入。這是效能優化的關鍵——跳過未標記為 dirty 的子樹。</p>
<p>在 <strong>Zoneless 模式</strong>下，Signal mutation 直接通知 <code>ChangeDetectionScheduler</code>，僅排程一次 microtask CD。生命週期鉤子的觸發順序不變，但觸發頻率大幅降低。</p>`,
      diagrams: [
        {
          id: 'cd-lifecycle-order',
          caption: '變更偵測循環中生命週期鉤子的執行順序',
          content: `CD Cycle enters ParentComponent
│
├─ 1. Update Input bindings → ngOnChanges()
├─ 2. First time? → ngOnInit()
├─ 3. ngDoCheck()
├─ 4. ngAfterContentInit() / ngAfterContentChecked()
├─ 5. Update template bindings
├─ 6. ┌─ CD enters ChildComponent
│     │  ├─ ngOnChanges() (if inputs changed)
│     │  ├─ ngOnInit() (first time)
│     │  ├─ ngDoCheck()
│     │  ├─ ngAfterContentInit/Checked()
│     │  ├─ Update template bindings
│     │  └─ ngAfterViewInit/Checked()
│     └─ Return to parent
└─ 7. ngAfterViewInit() / ngAfterViewChecked()`
        },
      ],
      tips: [
        { type: 'warning', content: '<code>ngDoCheck()</code> 在每次 CD 循環都會觸發，包括父元件或兄弟元件的事件。在此鉤子中執行昂貴運算會嚴重影響效能。優先使用 <code>computed()</code> 或 <code>effect()</code> 取代。' },
        { type: 'tip', content: '在 Zoneless + OnPush 組合下，CD 僅在 signal mutation 相關的元件路徑上執行，大幅減少不必要的鉤子呼叫。這是 Angular 21+ 推薦的效能最佳配置。' },
      ],
    },

    // ─── Section 9: Common Pitfalls ───
    {
      id: 'common-pitfalls',
      title: '常見陷阱',
      content: `
<p>
  以下是 Angular 元件開發中最常見的 10 個陷阱，以及對應的解決方案。
  無論是初學者還是有經驗的開發者，都應該了解這些問題以避免在專案中踩坑。
</p>
<ol>
  <li>
    <strong>忘記設定 OnPush：</strong>未設定 <code>ChangeDetectionStrategy.OnPush</code>，
    導致每次事件都觸發完整的變更偵測樹。修正：所有元件一律加上 OnPush。
  </li>
  <li>
    <strong>使用 *ngIf / *ngFor：</strong>在 v17+ 仍使用舊結構型指令。
    修正：全面改用 <code>@if</code> / <code>@for</code>。
  </li>
  <li>
    <strong>@for 缺少 track：</strong><code>@for</code> 未提供 track 表達式會導致編譯錯誤。
    修正：提供穩定唯一的識別值。
  </li>
  <li>
    <strong>直接 mutate signal 值：</strong>如 <code>items().push(newItem)</code>——
    不會觸發變更偵測。修正：使用 <code>items.update(list =&gt; [...list, newItem])</code>。
  </li>
  <li>
    <strong>使用 @Input/@Output 裝飾器：</strong>在新程式碼中使用已棄用的裝飾器。
    修正：使用 <code>input()</code> / <code>output()</code> signal 函式。
  </li>
  <li>
    <strong>建構函式注入：</strong>仍在 constructor 參數中注入服務。
    修正：使用 <code>inject()</code> 欄位初始化器。
  </li>
  <li>
    <strong>遺忘取消訂閱：</strong>在 <code>ngOnInit</code> 中訂閱 Observable 卻不清理。
    修正：使用 <code>takeUntilDestroyed()</code> 或轉為 signal。
  </li>
  <li>
    <strong>在 effect 中做資料同步：</strong>用 <code>effect()</code> 將一個 signal 的值寫入另一個。
    修正：改用 <code>computed()</code> 或 <code>linkedSignal()</code>。
  </li>
  <li>
    <strong>手動設定 standalone: true：</strong>v19+ 已是預設值，明確寫出是多餘的。
    修正：移除 <code>standalone: true</code>。
  </li>
  <li>
    <strong>元件中塞入業務邏輯：</strong>將 API 呼叫、資料轉換等邏輯直接寫在元件中。
    修正：抽離到 Service，元件只負責展示和協調。
  </li>
</ol>
      `,
      codeExamples: [
        {
          filename: 'pitfall-signal-mutation.ts',
          language: 'typescript',
          code: `import { signal } from '@angular/core';

interface Todo {
  readonly id: number;
  readonly text: string;
  readonly done: boolean;
}

const todos = signal<readonly Todo[]>([]);

// ❌ Wrong — in-place mutation, change detection will NOT fire
todos().push({ id: 1, text: 'Learn Angular', done: false });

// ❌ Wrong — mutate() was removed from the API
// todos.mutate(list => list.push({ id: 1, text: 'Learn Angular', done: false }));

// ✅ Correct — return a new array reference
todos.update(list => [...list, { id: 1, text: 'Learn Angular', done: false }]);

// ✅ Correct — toggle a todo's done state immutably
todos.update(list =>
  list.map(t => t.id === 1 ? { ...t, done: !t.done } : t)
);`,
          annotation: 'The most common signal pitfall: mutating in place vs returning a new reference.',
        },
        {
          filename: 'pitfall-effect-sync.ts',
          language: 'typescript',
          code: `import { signal, computed, effect, linkedSignal } from '@angular/core';

const selectedId = signal<string | null>(null);
const items = signal<readonly string[]>(['a', 'b', 'c']);

// ❌ Wrong — using effect() to sync derived state
const currentItem = signal<string | null>(null);
effect(() => {
  const id = selectedId();
  currentItem.set(items().find(i => i === id) ?? null);
});

// ✅ Correct — use computed() for derived state
const currentItemGood = computed(() => {
  const id = selectedId();
  return items().find(i => i === id) ?? null;
});

// ✅ Also correct — linkedSignal for writable derived state
const draft = linkedSignal({
  source: selectedId,
  computation: id => items().find(i => i === id) ?? null,
});`,
          annotation: 'Never use effect() for signal-to-signal sync. Use computed() or linkedSignal() instead.',
        },
      ],
      tips: [
        { type: 'warning', content: '第 4 點（直接 mutate signal）是最常見且最難除錯的問題——畫面不更新但沒有錯誤訊息。養成習慣：signal 更新永遠用 <code>.set()</code> 或 <code>.update()</code> 並回傳新參考。' },
        { type: 'best-practice', content: '建議在專案中設定 ESLint 規則（如 <code>@angular-eslint</code>）來自動偵測這些常見錯誤——例如強制 OnPush、禁止 <code>*ngIf</code>、禁止建構函式注入等。' },
        { type: 'tip', content: '將這份清單加入 Code Review checklist 中，讓團隊在 PR 審查時有一致的標準。' },
      ],
    },
  ],
};

@Component({
  selector: 'app-ch01',
  imports: [GuidePage],
  template: '<app-guide-page [chapter]="chapter" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ch01Components {
  protected readonly chapter = CHAPTER;
}
