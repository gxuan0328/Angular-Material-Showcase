import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GuidePage } from '../shared/guide-page';
import { GuideChapter } from '../models/guide-chapter';

const CHAPTER: GuideChapter = {
  id: 'view-hierarchy',
  number: 11,
  title: '視圖階層與動態元件',
  subtitle: 'LView/TView、ElementRef、ViewContainerRef、ng-content、Renderer2',
  icon: 'account_tree',
  category: 'framework-core',
  tags: ['LView', 'TView', 'ElementRef', 'ViewContainerRef', 'TemplateRef', 'ng-content', 'Renderer2', 'Dynamic Components'],
  estimatedMinutes: 55,
  sections: [
    // ─── Section 1: Angular 視圖樹 ───
    {
      id: 'view-tree',
      title: 'Angular 視圖樹',
      content: `
<p>Angular 應用程式的 UI 並非直接以 DOM 樹來管理，而是透過一套<strong>視圖樹（View Tree）</strong>抽象來組織。
每個視圖都是一組 DOM 節點的邏輯容器，Angular 對視圖進行建立、更新、銷毀等操作，
再將結果反映到實際 DOM 上。理解視圖樹的結構是掌握動態元件、內容投射、變更偵測等進階主題的基礎。</p>

<p>Angular 定義了三種主要的視圖類型：</p>
<ul>
  <li><strong>Host View（宿主視圖）</strong>：當 Angular 動態建立一個元件時，
  會為該元件建立一個 Host View。它是元件的「入口容器」，
  包含元件的宿主元素（host element）以及對應的元件實例。
  呼叫 <code>ViewContainerRef.createComponent()</code> 時產生的就是 Host View。</li>
  <li><strong>Component View（元件視圖）</strong>：每個元件的模板被編譯後會產生一個 Component View。
  它包含模板中所有的 DOM 節點、綁定表達式、子元件引用。
  Angular 在變更偵測時走訪的就是這些 Component View。</li>
  <li><strong>Embedded View（嵌入視圖）</strong>：由 <code>&lt;ng-template&gt;</code> 定義的模板片段，
  透過 <code>TemplateRef.createEmbeddedView()</code> 或結構型指令（如 <code>@if</code>、<code>@for</code>）實例化。
  每次實例化都會產生一個新的 Embedded View，擁有獨立的上下文（context）。</li>
</ul>

<p>在框架內部，視圖的資料結構由兩個核心陣列表示：</p>
<ul>
  <li><strong>LView（Logical View）</strong>：一個固定長度的陣列，儲存特定視圖實例的執行時期資料——
  包括 DOM 元素參考、綁定值、子視圖參考、元件實例、注入器等。
  每個元件實例都有自己的 LView。LView 的前幾個索引是框架保留的 header 欄位
  （如 parent LView、TView 引用、flags、context 等），之後才是模板相關的資料。</li>
  <li><strong>TView（Template View）</strong>：模板的藍圖（blueprint），
  在編譯時期產生，同一個元件的所有實例<strong>共享</strong>同一個 TView。
  TView 儲存靜態資訊：節點類型、綁定索引映射、指令定義、查詢定義等。
  它類似於 class 與 instance 的關係——TView 是 class，LView 是 instance。</li>
</ul>

<p>當 Angular 實例化一個元件時，流程如下：</p>
<ol>
  <li>從 TView 的 blueprint 陣列複製一份新的 LView</li>
  <li>在 LView 中建立 DOM 元素並存入對應索引</li>
  <li>建立元件實例並存入 LView 的 context slot</li>
  <li>將新 LView 插入父 LView 的子視圖列表</li>
  <li>執行元件的初始化邏輯（建構子、input 綁定、生命週期鉤子）</li>
</ol>

<p>視圖樹的結構直接影響變更偵測的走訪順序：Angular 從根視圖開始，
深度優先走訪每個子視圖，對每個視圖執行綁定更新和髒值檢查。
OnPush 策略的效果就是在走訪時跳過未標記為 dirty 的子樹。</p>

<p>理解 LView/TView 的分離設計有助於解釋 Angular 的記憶體效率——
10,000 個相同元件的列表只需要一份 TView，但需要 10,000 份 LView。
TView 中的靜態資訊被重複利用，大幅減少記憶體開銷。</p>`,
      codeExamples: [
        {
          filename: 'lview-structure.ts',
          language: 'typescript',
          code: `// Simplified representation of LView internal structure
// (Real LView is a flat array for performance)

// LView Header Slots (framework reserved):
// [0]  HOST        - host element reference
// [1]  TVIEW       - reference to shared TView blueprint
// [2]  FLAGS       - bit flags (attached, dirty, firstCheck, etc.)
// [3]  PARENT      - parent LView reference
// [4]  NEXT        - next sibling LView
// [5]  T_HOST      - TNode for the host element
// [6]  CLEANUP     - cleanup functions for this view
// [7]  CONTEXT     - component instance (or template context)
// [8]  INJECTOR    - node injector for this view
// [9]  RENDERER    - renderer instance
// ...

// After header, template data slots:
// [20] <div> DOM element reference
// [21] binding value for {{ title }}
// [22] child component LView reference
// [23] binding value for [class.active]
// ...

// TView is the SHARED blueprint:
interface TViewSimplified {
  readonly type: number;            // Root | Component | Embedded
  readonly blueprint: unknown[];    // Template for cloning new LViews
  readonly data: TNode[];           // Static node definitions
  readonly bindingStartIndex: number;
  readonly expandoStartIndex: number;
  readonly queries: TQuery[] | null;
}`,
          annotation: 'LView 是扁平陣列，header 區存框架元資料，後續存 DOM 參考和綁定值。TView 是共享藍圖，同元件所有實例共用。',
        },
      ],
      tips: [
        {
          type: 'tip',
          content: 'LView 使用扁平陣列而非物件結構是 Angular Ivy 的效能設計——陣列存取比物件屬性查找更快，且更利於 V8 引擎的 hidden class 優化和 GC 回收。這也是為什麼 Angular DevTools 的元件檢視器和實際內部資料結構看起來差異很大。',
        },
        {
          type: 'dotnet-comparison',
          content: '.NET Blazor 使用 RenderTree 和 RenderTreeFrame 結構來追蹤 UI 狀態，概念上類似於 Angular 的 LView/TView。RenderTreeFrame 是一個結構陣列（struct array），同樣採用扁平結構以優化記憶體配置和 GC 壓力。兩者都將靜態模板資訊與動態實例資料分離。',
        },
      ],
      diagrams: [
        {
          id: 'view-tree-hierarchy',
          caption: 'Angular 視圖樹：元件實例化產生的視圖巢狀結構',
          content: `Root LView (AppComponent)
│
├── TView (shared blueprint for AppComponent)
├── context: AppComponent instance
│
├── [20] <app-root> host element
├── [21] <h1> "Welcome"
├── [22] ─── Child LView (HeaderComponent) ──┐
│         ├── TView (shared blueprint)       │
│         ├── context: Header instance        │
│         ├── [20] <app-header> host element  │
│         └── [21] <nav> element              │
│                                             │
├── [23] ─── Child LView (MainComponent) ────┐
│         ├── TView (shared blueprint)       │
│         ├── context: Main instance          │
│         │                                   │
│         ├── [22] ── Embedded View ────────┐ │
│         │    (from @if block)             │ │
│         │    ├── context: { $implicit }   │ │
│         │    └── [20] <div> conditional   │ │
│         │                                 │ │
│         └── [23] ── Embedded View ────────┐ │
│              (from @for block)            │ │
│              ├── context: { $implicit,    │ │
│              │    $index, $count }        │ │
│              └── [20] <li> list item      │ │
│                                           │ │
└── [24] ─── Child LView (FooterComponent)──┘
          ├── TView (shared blueprint)
          └── context: Footer instance`,
        },
      ],
    },

    // ─── Section 2: ElementRef 與原生 DOM ───
    {
      id: 'element-ref',
      title: 'ElementRef 與原生 DOM',
      content: `
<p><code>ElementRef&lt;T&gt;</code> 是 Angular 提供的最底層 DOM 存取機制，
它是對原生 DOM 元素的薄封裝（thin wrapper）。
<code>ElementRef&lt;HTMLElement&gt;</code> 的 <code>nativeElement</code> 屬性直接指向實際的 DOM 元素，
讓你可以執行任何原生 DOM 操作。</p>

<p>取得 ElementRef 的常見方式：</p>
<ul>
  <li><strong>viewChild() 查詢</strong>：透過模板引用變數取得子元素的 ElementRef。
  這是最常用的方式，支援型別安全。</li>
  <li><strong>inject(ElementRef)</strong>：在元件或指令中注入，取得的是宿主元素（host element）本身。
  指令經常使用這種方式來操作它所附加的元素。</li>
  <li><strong>contentChild() 查詢</strong>：取得投射（projected）內容中的元素。</li>
</ul>

<p><strong>安全存取時機</strong>是使用 ElementRef 最重要的考量。
在元件建構子或 <code>ngOnInit</code> 中存取 <code>nativeElement</code> 是不安全的——
此時 DOM 可能尚未完全渲染。Angular 提供了兩個安全的存取點：</p>
<ul>
  <li><code>afterNextRender(() => { ... })</code>：在下一次渲染完成後執行一次。
  適合初始化第三方 DOM 函式庫（如 D3.js、Chart.js）。</li>
  <li><code>afterRenderEffect(() => { ... })</code>：在每次渲染後執行，
  會追蹤內部讀取的 Signal 並在 Signal 變更後重新執行。
  適合需要根據響應式狀態持續更新 DOM 的場景。</li>
</ul>

<p><strong>nativeElement 的存取模式</strong>：</p>
<ul>
  <li><strong>讀取屬性</strong>：取得元素尺寸（<code>getBoundingClientRect()</code>）、
  滾動位置、焦點狀態等。這些操作是安全的，不會影響 SSR。</li>
  <li><strong>呼叫方法</strong>：<code>focus()</code>、<code>scrollIntoView()</code>、
  <code>animate()</code> 等。需要確保在瀏覽器環境中。</li>
  <li><strong>直接修改 DOM</strong>：<code>innerHTML</code>、<code>style.xxx</code>、
  <code>classList.add()</code> 等。這是最危險的模式，會繞過 Angular 的變更偵測，
  且在 SSR 環境下會崩潰。</li>
</ul>

<p><strong>SSR 相容性警告</strong>：在伺服器端渲染（SSR）環境中，<code>nativeElement</code>
可能不是真正的 DOM 元素——它可能是一個模擬物件或 null。
直接操作 DOM 會導致 SSR 失敗或 hydration mismatch。
所有 DOM 操作都應該包在 <code>afterNextRender()</code> 中，
因為這個 callback 只在瀏覽器端執行，在 SSR 時會被跳過。</p>

<p>對於大多數 UI 需求，你應該優先使用 Angular 的模板綁定（<code>[class]</code>、
<code>[style]</code>、<code>[attr]</code>）而非直接操作 DOM。
只有在 Angular 綁定無法滿足需求時（如整合第三方 DOM 函式庫、精確的滾動控制、
Canvas 操作等），才考慮使用 ElementRef。</p>`,
      codeExamples: [
        {
          filename: 'chart-host.ts',
          language: 'typescript',
          code: `import {
  ChangeDetectionStrategy, Component, ElementRef,
  afterNextRender, afterRenderEffect, inject, input, viewChild,
} from '@angular/core';

@Component({
  selector: 'app-chart-host',
  template: \`
    <h3>{{ title() }}</h3>
    <div #chartContainer class="chart-container"></div>
    <button (click)="focusContainer()">Focus Chart</button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartHost {
  // Inject host element's ElementRef
  private readonly hostEl = inject(ElementRef<HTMLElement>);

  // Query a child element via template reference variable
  readonly chartContainer = viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');

  readonly title = input('Revenue Chart');
  readonly data = input<number[]>([]);

  constructor() {
    // ✅ Safe: runs only in the browser, after first render
    afterNextRender(() => {
      const container = this.chartContainer().nativeElement;
      this.initChart(container);
    });

    // ✅ Reactive: re-runs when data() signal changes after each render
    afterRenderEffect(() => {
      const currentData = this.data();
      const container = this.chartContainer().nativeElement;
      this.updateChart(container, currentData);
    });
  }

  protected focusContainer(): void {
    // Direct DOM method call — safe in event handlers (always in browser)
    this.chartContainer().nativeElement.focus();
  }

  private initChart(container: HTMLDivElement): void {
    // Initialize third-party chart library (e.g., D3.js)
    console.log('Chart initialized in', container.getBoundingClientRect());
  }

  private updateChart(container: HTMLDivElement, data: number[]): void {
    // Update chart with new data
    console.log('Chart updated with', data.length, 'data points');
  }
}`,
          annotation: 'afterNextRender 用於一次性初始化，afterRenderEffect 用於響應式 DOM 更新。兩者都只在瀏覽器執行，SSR 安全。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: '直接修改 nativeElement 的 DOM 屬性（如 innerHTML、style）會繞過 Angular 的變更偵測和安全機制（如 DomSanitizer）。在 SSR 環境下更可能造成 hydration mismatch。除非整合第三方函式庫，否則永遠優先使用模板綁定。',
        },
        {
          type: 'dotnet-comparison',
          content: 'Angular 的 ElementRef + afterNextRender 模式類似 Blazor 的 IJSRuntime.InvokeAsync()——兩者都解決「框架管理 DOM，但偶爾需要直接存取」的問題。Blazor 必須透過 JS Interop 橋接 C# 和 DOM，Angular 則因為本身執行在瀏覽器中，可以直接存取，但仍需注意 SSR 場景。',
        },
        {
          type: 'best-practice',
          content: '使用 viewChild() Signal 取得 ElementRef 時，Angular 會在視圖初始化後自動填入值。在 afterNextRender 或 afterRenderEffect 中存取 viewChild 是安全的——此時 Signal 已經有值。避免在 ngOnInit 中讀取 viewChild，因為子視圖可能尚未初始化。',
        },
      ],
    },

    // ─── Section 3: ViewContainerRef 詳解 ───
    {
      id: 'view-container-ref',
      title: 'ViewContainerRef 詳解',
      content: `
<p><code>ViewContainerRef</code> 是 Angular 中動態管理視圖的核心 API。
它代表一個可以附加（attach）視圖的容器——你可以在這個容器中動態建立、插入、
移動、移除視圖。每個 <code>ViewContainerRef</code> 在 DOM 中對應一個錨點（anchor），
動態建立的視圖會被插入到這個錨點之後。</p>

<p>取得 ViewContainerRef 的方式：</p>
<ul>
  <li><strong>viewChild() 查詢</strong>：將模板引用變數指定為 <code>ViewContainerRef</code> 型別。
  這是最常用的方式，讓你精確控制視圖插入的位置。</li>
  <li><strong>inject(ViewContainerRef)</strong>：在指令中注入，取得指令所附加元素的容器。
  結構型指令（structural directives）就是透過這種方式操作視圖的。</li>
</ul>

<p><strong>核心操作</strong>：</p>
<ul>
  <li><code>createComponent&lt;C&gt;(componentType)</code>：動態建立一個元件，
  回傳 <code>ComponentRef&lt;C&gt;</code>。這會建立一個 Host View 並插入容器。
  你可以透過 ComponentRef 存取元件實例、設定 input、監聽 output。</li>
  <li><code>createEmbeddedView&lt;C&gt;(templateRef, context?)</code>：從 TemplateRef 建立一個 Embedded View。
  context 參數提供模板中可用的變數。</li>
  <li><code>insert(viewRef, index?)</code>：將已存在的視圖插入容器的指定位置。</li>
  <li><code>move(viewRef, newIndex)</code>：將容器中的視圖移動到新的索引位置。
  這是一個高效操作——只移動 DOM 節點，不重建。</li>
  <li><code>remove(index?)</code>：從容器中移除並銷毀指定索引的視圖。</li>
  <li><code>detach(index?)</code>：從容器中分離視圖，但不銷毀它。
  分離後的視圖可以透過 <code>insert()</code> 重新附加到任何容器。</li>
  <li><code>get(index)</code>：取得指定索引位置的 ViewRef。</li>
  <li><code>length</code>：容器中目前的視圖數量。</li>
  <li><code>clear()</code>：移除並銷毀容器中所有視圖。</li>
</ul>

<p><strong>索引排序</strong>：ViewContainerRef 中的視圖按索引排列，索引從 0 開始。
新建立的視圖預設插入到末尾。你可以透過 <code>index</code> 參數控制插入位置，
也可以用 <code>move()</code> 重新排列。索引順序直接對應 DOM 中的呈現順序。</p>

<p>以下是一個完整的動態分頁（Tab）元件實作，展示 ViewContainerRef 的主要操作：
建立、切換、銷毀分頁。每個分頁是一個動態載入的元件，
透過 <code>createComponent()</code> 建立並透過 ComponentRef 管理。</p>`,
      codeExamples: [
        {
          filename: 'dynamic-tabs.ts',
          language: 'typescript',
          code: `import {
  ChangeDetectionStrategy, Component, ComponentRef, Type,
  ViewContainerRef, inject, signal, viewChild,
} from '@angular/core';

interface TabDefinition {
  readonly label: string;
  readonly component: Type<unknown>;
}

@Component({
  selector: 'app-dynamic-tabs',
  template: \`
    <div class="tab-bar" role="tablist">
      @for (tab of tabs(); track tab.label; let i = $index) {
        <button
          role="tab"
          [attr.aria-selected]="i === activeIndex()"
          [class.active]="i === activeIndex()"
          (click)="selectTab(i)">
          {{ tab.label }}
        </button>
      }
      <button (click)="closeActiveTab()" [disabled]="tabs().length === 0">
        Close Tab
      </button>
    </div>
    <div class="tab-content" role="tabpanel">
      <ng-container #tabHost />
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTabs {
  private readonly tabHost = viewChild.required('tabHost', { read: ViewContainerRef });

  protected readonly tabs = signal<readonly TabDefinition[]>([]);
  protected readonly activeIndex = signal(0);

  // Track ComponentRefs for cleanup
  private readonly componentRefs: ComponentRef<unknown>[] = [];

  addTab(label: string, component: Type<unknown>): void {
    // Update tab definitions
    this.tabs.update(list => [...list, { label, component }]);

    // Create the component dynamically
    const vcr = this.tabHost();
    const ref = vcr.createComponent(component);
    this.componentRefs.push(ref);

    // Select the newly created tab
    this.selectTab(this.tabs().length - 1);
  }

  selectTab(index: number): void {
    if (index < 0 || index >= this.tabs().length) return;
    this.activeIndex.set(index);

    // Detach all views, then insert the selected one
    const vcr = this.tabHost();
    for (let i = vcr.length - 1; i >= 0; i--) {
      vcr.detach(i);
    }
    const viewRef = this.componentRefs[index].hostView;
    vcr.insert(viewRef);
  }

  closeActiveTab(): void {
    const idx = this.activeIndex();
    if (idx < 0 || idx >= this.tabs().length) return;

    // Remove and destroy the ComponentRef
    const ref = this.componentRefs.splice(idx, 1)[0];
    ref.destroy();

    // Update tabs list
    this.tabs.update(list => list.filter((_, i) => i !== idx));

    // Adjust active index
    const newIdx = Math.min(idx, this.tabs().length - 1);
    if (this.tabs().length > 0) {
      this.selectTab(newIdx);
    } else {
      this.activeIndex.set(0);
    }
  }
}`,
          annotation: 'createComponent 動態建立元件，detach/insert 實現分頁切換（不銷毀），destroy 銷毀並釋放資源。',
        },
      ],
      tips: [
        {
          type: 'best-practice',
          content: '動態建立的 ComponentRef 必須在不再需要時呼叫 destroy() 銷毀。否則元件的生命週期鉤子（ngOnDestroy）不會被呼叫，訂閱不會被清除，造成記憶體洩漏。建議在宿主元件的 ngOnDestroy 中清除所有 ComponentRef。',
        },
        {
          type: 'tip',
          content: 'detach() 和 remove() 的區別：detach 只是將視圖從容器中分離，視圖仍然存在於記憶體中可以重新 insert；remove 則會銷毀視圖並釋放資源。當你需要在分頁間切換時用 detach + insert，當你需要永久移除時用 remove 或 ComponentRef.destroy()。',
        },
      ],
    },

    // ─── Section 4: TemplateRef 與 ng-template ───
    {
      id: 'template-ref',
      title: 'TemplateRef 與 ng-template',
      content: `
<p><code>&lt;ng-template&gt;</code> 是 Angular 的模板片段定義語法。
它本身不會渲染任何 DOM 節點——它只是一個<strong>藍圖（blueprint）</strong>，
定義了一段可重複使用的模板。要讓 ng-template 的內容出現在畫面上，
需要透過 <code>TemplateRef</code> 將它實例化為 Embedded View。</p>

<p><code>TemplateRef&lt;C&gt;</code> 是 ng-template 的程式化表示。
泛型參數 <code>C</code> 定義了模板上下文（context）的型別。
當你透過 <code>createEmbeddedView(templateRef, context)</code> 建立 Embedded View 時，
context 物件中的屬性可以在模板中透過 <code>let-</code> 語法存取。</p>

<p><strong>上下文型別</strong>：TemplateRef 的泛型參數提供了型別安全。
<code>$implicit</code> 是特殊的上下文屬性——它對應 <code>let-item</code>（不指定屬性名）的值。
其他屬性則需要明確指定：<code>let-idx="index"</code>。</p>

<p><strong>結構型指令的內部機制</strong>：在 Angular 早期版本中，
<code>*ngIf</code>、<code>*ngFor</code> 等結構型指令的 <code>*</code> 語法其實是語法糖——
編譯器會將 <code>*ngIf="condition"</code> 展開為：</p>
<pre><code>&lt;ng-template [ngIf]="condition"&gt;
  &lt;!-- original content --&gt;
&lt;/ng-template&gt;</code></pre>

<p>NgIf 指令內部就是使用 <code>ViewContainerRef.createEmbeddedView()</code>
和 <code>ViewContainerRef.clear()</code> 來控制模板的顯示和隱藏。</p>

<p><strong>新版 @if 的內部機制</strong>：Angular 17+ 的 <code>@if</code> 語法不再使用指令，
而是編譯為框架內部的 <code>ɵɵconditional()</code> 指令碼（instruction）。
這個指令碼直接操作 LView 中的 Embedded View slot——
當條件為 true 時建立 Embedded View 並插入，為 false 時銷毀。
相比舊版的 NgIf 指令，新版省去了指令實例化的開銷，效能更好。</p>

<p><code>@for</code> 同理，編譯為 <code>ɵɵrepeaterCreate()</code> 和 <code>ɵɵrepeater()</code>，
內部使用高效的 diff 演算法（基於最長遞增子序列）來最小化 DOM 操作。
每個迭代項目都是一個獨立的 Embedded View，擁有自己的上下文
（<code>$implicit</code>、<code>$index</code>、<code>$count</code>、<code>$first</code>、<code>$last</code> 等）。</p>

<p>理解 TemplateRef 和 Embedded View 的關係，有助於你在以下場景中做出正確的設計選擇：
自訂結構型指令、動態表單欄位、可插拔的列表項目模板、Modal/Dialog 的內容注入等。</p>`,
      codeExamples: [
        {
          filename: 'typed-template-outlet.ts',
          language: 'typescript',
          code: `import {
  ChangeDetectionStrategy, Component, TemplateRef,
  ViewContainerRef, contentChild, effect, input,
} from '@angular/core';

// Define strongly-typed template context
interface CardContext {
  $implicit: string;  // accessible via let-title
  index: number;      // accessible via let-i="index"
  total: number;      // accessible via let-t="total"
}

@Component({
  selector: 'app-card-list',
  template: \`
    <!-- Host renders projected template for each card -->
    <div class="card-grid">
      <ng-container #outlet />
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardList {
  // Accept a typed TemplateRef from parent via content projection
  readonly cardTemplate = contentChild.required<TemplateRef<CardContext>>('cardTpl');
  readonly items = input.required<readonly string[]>();

  private readonly outlet = contentChild.required('outlet', { read: ViewContainerRef });

  constructor() {
    effect(() => {
      const tpl = this.cardTemplate();
      const vcr = this.outlet();
      const items = this.items();

      vcr.clear();
      items.forEach((item, index) => {
        // Create embedded view with typed context
        vcr.createEmbeddedView<CardContext>(tpl, {
          $implicit: item,
          index,
          total: items.length,
        });
      });
    });
  }
}

// Usage in parent:
// <app-card-list [items]="titles()">
//   <ng-template #cardTpl let-title let-i="index" let-t="total">
//     <div class="card">
//       <h3>{{ i + 1 }} / {{ t }}: {{ title }}</h3>
//     </div>
//   </ng-template>
// </app-card-list>`,
          annotation: 'TemplateRef<CardContext> 提供型別安全的上下文。$implicit 對應 let-title，具名屬性對應 let-i="index"。',
        },
        {
          filename: 'custom-if-directive.ts',
          language: 'typescript',
          code: `import {
  Directive, EmbeddedViewRef, TemplateRef,
  ViewContainerRef, effect, inject, input,
} from '@angular/core';

@Directive({ selector: '[appIf]' })
export class AppIf {
  private readonly templateRef = inject(TemplateRef<{ $implicit: boolean }>);
  private readonly vcr = inject(ViewContainerRef);

  readonly appIf = input.required<boolean>();

  private viewRef: EmbeddedViewRef<unknown> | null = null;

  constructor() {
    effect(() => {
      const condition = this.appIf();
      if (condition && !this.viewRef) {
        // Condition became true — create the embedded view
        this.viewRef = this.vcr.createEmbeddedView(this.templateRef);
      } else if (!condition && this.viewRef) {
        // Condition became false — destroy the embedded view
        this.vcr.clear();
        this.viewRef = null;
      }
    });
  }
}

// Usage: <div *appIf="isVisible()">Conditionally rendered</div>
// The * syntax is sugar for:
// <ng-template [appIf]="isVisible()"><div>...</div></ng-template>`,
          annotation: '自訂結構型指令：inject TemplateRef 和 ViewContainerRef，根據條件建立或銷毀 Embedded View。',
        },
      ],
      tips: [
        {
          type: 'tip',
          content: 'ng-template 的編譯結果是一個獨立的 TView。當你建立 Embedded View 時，Angular 從 TView 的 blueprint 複製一份新的 LView，填入 context 資料。這就是為什麼每次 createEmbeddedView 都能產生獨立的視圖實例。',
        },
        {
          type: 'best-practice',
          content: '在 Angular 20+ 中，優先使用 @if/@for/@switch 原生控制流語法，而非自訂結構型指令。原生語法編譯為更高效的框架指令碼，且享有 Angular Language Service 的完整支援（型別檢查、自動完成）。只有在原生語法無法滿足需求時（如自訂快取策略），才考慮自訂指令。',
        },
      ],
    },

    // ─── Section 5: 內容投射 (ng-content) ───
    {
      id: 'content-projection',
      title: '內容投射 (ng-content)',
      content: `
<p>內容投射（Content Projection）是 Angular 允許父元件將任意模板內容傳遞給子元件的機制，
類似於 Web Components 的 Slot 概念。子元件在模板中使用 <code>&lt;ng-content&gt;</code>
標記投射位置，父元件提供的內容會被「投射」到這些位置。</p>

<p><strong>單一插槽投射</strong>：最簡單的形式，子元件只有一個 <code>&lt;ng-content&gt;</code>，
父元件的所有子內容都會被投射到這裡。</p>

<p><strong>多插槽投射</strong>：子元件使用 <code>select</code> 屬性定義多個投射插槽，
根據 CSS 選擇器將不同的內容路由到不同的位置。
<code>select</code> 支援元素選擇器、屬性選擇器、CSS class 選擇器。
沒有匹配到任何 <code>select</code> 的內容會被投射到沒有 <code>select</code> 的預設
<code>&lt;ng-content&gt;</code>（如果有的話）。</p>

<p><strong>條件式投射</strong>：<code>&lt;ng-content&gt;</code> 有一個重要的特性——
它的內容在建立時就已經被投射，而不是在渲染時。這意味著即使你用
<code>@if</code> 包裹 <code>&lt;ng-content&gt;</code>，被投射的元件仍然會被實例化。
<code>@if</code> 只是控制 DOM 中的可見性，不影響元件的生命週期。</p>

<p>這個行為有時會造成困惑。例如，你可能期望 <code>@if (showContent()) { &lt;ng-content /&gt; }</code>
在條件為 false 時不建立投射內容的元件——但實際上元件仍然會被建立，
只是不出現在 DOM 中。如果你需要真正的「條件式建立」，
應該使用 <code>&lt;ng-template&gt;</code> + <code>ngTemplateOutlet</code> 模式。</p>

<p><strong>投射限制</strong>：<code>&lt;ng-content&gt;</code> 的一個重要限制是<strong>相同內容不能被投射兩次</strong>。
如果子元件有兩個 <code>&lt;ng-content&gt;</code> 但沒有 <code>select</code> 區分，
第二個會是空的。這是因為 Angular 的投射是「移動」操作而非「複製」操作——
DOM 節點只能存在於一個位置。</p>

<p><strong>ng-template + ngTemplateOutlet 替代方案</strong>：
當你需要條件式渲染投射內容、或需要在多處渲染相同模板時，
應該使用 <code>&lt;ng-template&gt;</code> 搭配 <code>ngTemplateOutlet</code>。
父元件傳入 <code>TemplateRef</code>（透過 input 或 content query），
子元件使用 <code>*ngTemplateOutlet</code> 或程式化方式 <code>createEmbeddedView()</code>
來渲染模板。每次 createEmbeddedView 都會建立新的 Embedded View，
所以可以在多處渲染相同模板。</p>

<p>在設計可重用元件的 API 時，建議遵循以下原則：
簡單的內容插入使用 <code>&lt;ng-content&gt;</code>（如卡片的 header/body/footer），
需要條件渲染或模板複製時使用 TemplateRef input。</p>`,
      codeExamples: [
        {
          filename: 'card-layout.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card',
  template: \`
    <div class="card">
      <!-- Named slot: only content matching [card-header] -->
      <header class="card-header">
        <ng-content select="[card-header]" />
      </header>

      <!-- Default slot: all remaining unmatched content -->
      <div class="card-body">
        <ng-content />
      </div>

      <!-- Named slot: only content matching [card-footer] -->
      <footer class="card-footer">
        <ng-content select="[card-footer]" />
      </footer>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {}

// Usage:
// <app-card>
//   <h2 card-header>Card Title</h2>
//   <p>This goes to the default body slot</p>
//   <span>This also goes to body</span>
//   <button card-footer>Submit</button>
// </app-card>`,
          annotation: '多插槽投射：select 屬性路由內容到不同位置。未匹配的內容進入無 select 的預設插槽。',
        },
        {
          filename: 'conditional-content.ts',
          language: 'typescript',
          code: `import {
  ChangeDetectionStrategy, Component, TemplateRef,
  contentChild, input, signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-expandable-panel',
  imports: [NgTemplateOutlet],
  template: \`
    <div class="panel">
      <button (click)="toggle()" [attr.aria-expanded]="isOpen()">
        {{ title() }}
      </button>

      <!-- ❌ ng-content: component is ALWAYS created even when hidden -->
      <!-- @if (isOpen()) { <ng-content /> } -->

      <!-- ✅ ng-template: component created only when condition is true -->
      @if (isOpen()) {
        <div class="panel-body">
          <ng-container *ngTemplateOutlet="bodyTemplate()" />
        </div>
      }
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandablePanel {
  readonly title = input('Panel');
  readonly bodyTemplate = contentChild.required<TemplateRef<void>>('panelBody');
  protected readonly isOpen = signal(false);

  protected toggle(): void {
    this.isOpen.update(v => !v);
  }
}

// Usage:
// <app-expandable-panel title="Details">
//   <ng-template #panelBody>
//     <app-heavy-component />  <!-- Only created when panel is open -->
//   </ng-template>
// </app-expandable-panel>`,
          annotation: 'ng-template + ngTemplateOutlet 實現真正的條件式渲染——panel 關閉時不建立子元件，避免不必要的初始化開銷。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: 'ng-content 的內容在父元件建立時就被實例化——不管 ng-content 是否在 @if 中。如果投射的元件很重（如圖表、地圖），在面板關閉時也會被建立並佔用記憶體。需要真正的延遲建立時，必須改用 ng-template + ngTemplateOutlet。',
        },
        {
          type: 'tip',
          content: 'ng-content 的 select 屬性支援多種 CSS 選擇器：元素名稱（select="h2"）、屬性（select="[slot=header]"）、CSS class（select=".card-action"）。避免使用過於複雜的選擇器——保持投射 API 簡單明瞭。',
        },
        {
          type: 'dotnet-comparison',
          content: 'Angular 的 ng-content 對應 Blazor 的 ChildContent（RenderFragment）。Blazor 的 RenderFragment 更靈活——它本質上是一個委派，可以條件式執行、多次渲染、傳遞參數。Angular 要達到同等靈活度需要 ng-template + TemplateRef。',
        },
      ],
    },

    // ─── Section 6: Renderer2 抽象 ───
    {
      id: 'renderer2',
      title: 'Renderer2 抽象',
      content: `
<p><code>Renderer2</code> 是 Angular 提供的 DOM 操作抽象層。
它不直接使用瀏覽器 DOM API（如 <code>document.createElement</code>、
<code>element.setAttribute</code>），而是透過一個可替換的介面來執行所有 DOM 操作。
這個設計的核心目的是讓 Angular 可以在不同的渲染平台上執行——
不只是瀏覽器，還包括伺服器端（SSR）、Web Worker、NativeScript 等。</p>

<p><strong>為什麼需要 Renderer2</strong>：</p>
<ul>
  <li><strong>SSR 相容</strong>：在 Node.js 環境中沒有真正的 DOM。
  Angular Universal 提供了 <code>ServerRenderer</code>，
  模擬 DOM 操作並產生 HTML 字串。如果直接使用 <code>document.createElement</code>，
  SSR 會崩潰。</li>
  <li><strong>Web Worker</strong>：Web Worker 沒有 DOM 存取權限。
  透過 Renderer2，DOM 操作可以被序列化並傳送到主執行緒執行。</li>
  <li><strong>測試</strong>：在單元測試中可以替換為 mock Renderer，
  驗證 DOM 操作而不需要真正的 DOM 環境。</li>
  <li><strong>安全性</strong>：Renderer2 內建了 XSS 防護——
  <code>setProperty</code> 和 <code>setAttribute</code> 會經過 Angular 的安全化處理。</li>
</ul>

<p><strong>核心 API</strong>：</p>
<ul>
  <li><code>createElement(name, namespace?)</code>：建立元素。namespace 用於 SVG 元素。</li>
  <li><code>createText(value)</code>：建立文字節點。</li>
  <li><code>appendChild(parent, newChild)</code>：將節點附加為子節點。</li>
  <li><code>insertBefore(parent, newChild, refChild)</code>：在參考節點前插入。</li>
  <li><code>removeChild(parent, oldChild)</code>：移除子節點。</li>
  <li><code>setAttribute(el, name, value, namespace?)</code>：設定屬性。</li>
  <li><code>removeAttribute(el, name)</code>：移除屬性。</li>
  <li><code>setStyle(el, style, value, flags?)</code>：設定行內樣式。</li>
  <li><code>removeStyle(el, style)</code>：移除行內樣式。</li>
  <li><code>addClass(el, name)</code> / <code>removeClass(el, name)</code>：CSS class 操作。</li>
  <li><code>setProperty(el, name, value)</code>：設定 DOM property（如 <code>checked</code>、<code>value</code>）。</li>
  <li><code>listen(target, eventName, callback)</code>：監聽事件，回傳取消監聽的函式。</li>
  <li><code>selectRootElement(selector, preserveContent?)</code>：選取根元素。</li>
</ul>

<p><strong>平台特定實作</strong>：Angular 在不同環境提供不同的 Renderer2 實作：</p>
<ul>
  <li><code>DefaultDomRenderer2</code>：瀏覽器環境，直接操作真實 DOM。</li>
  <li><code>ServerRenderer</code>：SSR 環境，將操作轉換為 HTML 字串。</li>
  <li><code>AnimationRenderer</code>：處理 Angular Animation 的特殊 Renderer，代理 DOM 操作並注入動畫。</li>
</ul>

<p><strong>何時使用 Renderer2 vs 直接 DOM 操作</strong>：</p>
<ul>
  <li>如果你在寫<strong>函式庫或共享元件</strong>，且需要支援 SSR → 使用 Renderer2。</li>
  <li>如果你在 <code>afterNextRender()</code> 中操作 DOM → 直接使用 nativeElement 是安全的，
  因為 afterNextRender 只在瀏覽器執行。</li>
  <li>如果操作很簡單（設定 focus、讀取尺寸）→ ElementRef.nativeElement 加上
  <code>afterNextRender</code> 保護即可。</li>
  <li>如果需要大量的 DOM 建立和操作 → Renderer2 提供更好的抽象和安全性。</li>
</ul>`,
      codeExamples: [
        {
          filename: 'tooltip.directive.ts',
          language: 'typescript',
          code: `import {
  Directive, ElementRef, Renderer2, inject, input,
  OnDestroy, afterNextRender,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focus)': 'show()',
    '(blur)': 'hide()',
  },
})
export class Tooltip implements OnDestroy {
  private readonly renderer = inject(Renderer2);
  private readonly hostEl = inject(ElementRef<HTMLElement>);

  readonly appTooltip = input.required<string>();

  private tooltipEl: HTMLElement | null = null;
  private removeListenerFn: (() => void) | null = null;

  constructor() {
    afterNextRender(() => {
      // Ensure host has relative positioning for tooltip placement
      this.renderer.setStyle(this.hostEl.nativeElement, 'position', 'relative');
    });
  }

  protected show(): void {
    if (this.tooltipEl) return;

    // Create tooltip element via Renderer2 (SSR-safe)
    this.tooltipEl = this.renderer.createElement('div');
    const text = this.renderer.createText(this.appTooltip());

    this.renderer.appendChild(this.tooltipEl, text);
    this.renderer.addClass(this.tooltipEl, 'tooltip-popup');
    this.renderer.setAttribute(this.tooltipEl, 'role', 'tooltip');
    this.renderer.setStyle(this.tooltipEl, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipEl, 'top', '-2rem');
    this.renderer.setStyle(this.tooltipEl, 'left', '50%');
    this.renderer.setStyle(this.tooltipEl, 'transform', 'translateX(-50%)');

    // Append to host element
    this.renderer.appendChild(this.hostEl.nativeElement, this.tooltipEl);

    // Listen for Escape key to dismiss
    this.removeListenerFn = this.renderer.listen(
      this.tooltipEl, 'keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape') this.hide();
      },
    );
  }

  protected hide(): void {
    if (!this.tooltipEl) return;

    this.renderer.removeChild(this.hostEl.nativeElement, this.tooltipEl);
    this.removeListenerFn?.();
    this.removeListenerFn = null;
    this.tooltipEl = null;
  }

  ngOnDestroy(): void {
    this.hide();
  }
}`,
          annotation: 'Renderer2 建立 tooltip：createElement、appendChild、setStyle、listen 都是平台無關的 DOM 操作。listen 回傳 cleanup 函式。',
        },
      ],
      tips: [
        {
          type: 'tip',
          content: 'Renderer2.listen() 回傳一個函式用於取消監聽——必須在元件銷毀時呼叫，否則會造成記憶體洩漏。這與 addEventListener 需要搭配 removeEventListener 是一樣的概念，但 Renderer2 的 API 更簡潔。',
        },
        {
          type: 'dotnet-comparison',
          content: 'Angular 的 Renderer2 概念類似 Blazor 的 RenderTreeBuilder。兩者都是 DOM 操作的抽象層，讓框架能在不同環境（瀏覽器、伺服器、測試）中運行。Blazor 更進一步——開發者幾乎不需要直接操作 DOM，所有 UI 都是聲明式的。Angular 的 Renderer2 是給框架內部和進階場景（自訂指令、第三方整合）使用的。',
        },
        {
          type: 'warning',
          content: '在 Angular Ivy 架構中，大多數情況下框架直接使用 DOM API 操作（繞過 Renderer2 以提升效能）。Renderer2 主要用於自訂指令和需要平台抽象的場景。如果你不需要 SSR 相容，直接在 afterNextRender 中操作 DOM 通常更直觀。',
        },
      ],
    },

    // ─── Section 7: 動態元件實戰 ───
    {
      id: 'dynamic-components',
      title: '動態元件實戰',
      content: `
<p>動態元件是指在執行時期才決定要建立哪個元件的模式。
不同於模板中靜態宣告的元件（編譯時就確定），動態元件讓你能根據使用者操作、
伺服器設定、或業務邏輯來動態載入和顯示不同的 UI。</p>

<p>Angular 中主要有三種動態元件模式：</p>

<p><strong>模式一：Portal 模式（CDK Overlay）</strong>——
Angular CDK 的 <code>Portal</code> 和 <code>Overlay</code> 提供了將元件「投射」到 DOM 樹
其他位置的能力。典型應用是 Dialog、Tooltip、Dropdown 等浮動 UI。
<code>ComponentPortal</code> 封裝了 ViewContainerRef 的操作，
<code>Overlay</code> 管理定位和 z-index。Material Dialog、Snackbar、Menu 都基於此機制。</p>

<p><strong>模式二：動態表單欄位</strong>——
根據 JSON schema 或伺服器設定動態生成表單。
每個欄位類型（文字輸入、下拉選單、日期選擇器）對應一個元件，
透過 ViewContainerRef.createComponent() 根據設定動態建立。
這是企業級應用中最常見的動態元件需求。</p>

<p><strong>模式三：外掛（Plugin）架構</strong>——
允許第三方開發者註冊自訂元件，在宿主應用中動態載入和渲染。
透過 <code>import()</code> 動態載入外掛模組，再用 <code>createComponent()</code> 實例化。
這種模式需要定義明確的 interface 契約，讓外掛元件和宿主應用能正確通訊。</p>

<p>以下實作一個完整的<strong>動態對話框系統</strong>，展示動態元件的核心流程：
建立元件、傳遞輸入、監聽輸出、管理生命週期。</p>

<p>這個系統的設計要點：</p>
<ul>
  <li>Service 持有 ViewContainerRef 的引用（透過 directive 設定）</li>
  <li>開啟對話框時動態建立元件，關閉時銷毀</li>
  <li>透過 ComponentRef 設定 input 和監聽 output</li>
  <li>回傳 Observable/Promise 讓呼叫端等待結果</li>
</ul>`,
      codeExamples: [
        {
          filename: 'dialog.service.ts',
          language: 'typescript',
          code: `import {
  ComponentRef, Injectable, Type, ViewContainerRef, signal,
} from '@angular/core';
import { Subject } from 'rxjs';

export interface DialogConfig<T = unknown> {
  readonly component: Type<unknown>;
  readonly inputs?: Record<string, unknown>;
  readonly panelClass?: string;
}

export interface DialogRef<R = unknown> {
  readonly componentRef: ComponentRef<unknown>;
  readonly afterClosed: Subject<R | undefined>;
  close(result?: R): void;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private vcr: ViewContainerRef | null = null;
  readonly isOpen = signal(false);

  /** Called by the DialogOutlet directive to register the container */
  registerOutlet(vcr: ViewContainerRef): void {
    this.vcr = vcr;
  }

  open<R = unknown>(config: DialogConfig): DialogRef<R> {
    if (!this.vcr) {
      throw new Error('DialogService: No outlet registered. Add <ng-container appDialogOutlet /> to your root template.');
    }

    // Create the component dynamically
    const componentRef = this.vcr.createComponent(config.component);

    // Set inputs via ComponentRef.setInput()
    if (config.inputs) {
      for (const [key, value] of Object.entries(config.inputs)) {
        componentRef.setInput(key, value);
      }
    }

    // Create the dialog reference
    const afterClosed = new Subject<R | undefined>();
    const dialogRef: DialogRef<R> = {
      componentRef,
      afterClosed,
      close: (result?: R) => {
        componentRef.destroy();
        this.isOpen.set(false);
        afterClosed.next(result);
        afterClosed.complete();
      },
    };

    this.isOpen.set(true);
    return dialogRef;
  }
}`,
          annotation: 'DialogService 持有 ViewContainerRef 引用，open() 動態建立元件並回傳 DialogRef。close() 銷毀元件並發送結果。',
        },
        {
          filename: 'dialog-outlet.directive.ts',
          language: 'typescript',
          code: `import { Directive, ViewContainerRef, inject, OnInit } from '@angular/core';
import { DialogService } from './dialog.service';

@Directive({ selector: '[appDialogOutlet]' })
export class DialogOutlet implements OnInit {
  private readonly vcr = inject(ViewContainerRef);
  private readonly dialogService = inject(DialogService);

  ngOnInit(): void {
    this.dialogService.registerOutlet(this.vcr);
  }
}

// In root component template:
// <div class="app-layout">
//   <router-outlet />
// </div>
// <div class="dialog-overlay" [class.open]="dialogService.isOpen()">
//   <ng-container appDialogOutlet />
// </div>`,
          annotation: 'DialogOutlet 指令將 ViewContainerRef 註冊到 DialogService，作為動態元件的渲染容器。',
        },
        {
          filename: 'confirm-dialog.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: \`
    <div class="dialog-content" role="alertdialog" aria-labelledby="dialog-title">
      <h2 id="dialog-title">{{ title() }}</h2>
      <p>{{ message() }}</p>
      <div class="dialog-actions">
        <button (click)="confirmed.emit(false)">取消</button>
        <button (click)="confirmed.emit(true)" cdkFocusInitial>確認</button>
      </div>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  readonly title = input('確認');
  readonly message = input('確定要執行此操作嗎？');
  readonly confirmed = output<boolean>();
}

// Usage from any component:
// const ref = this.dialogService.open<boolean>({
//   component: ConfirmDialog,
//   inputs: { title: '刪除確認', message: '此操作無法復原。' },
// });
// ref.componentRef.instance.confirmed.subscribe(result => {
//   if (result) { /* perform deletion */ }
//   ref.close(result);
// });`,
          annotation: '動態載入的對話框元件：透過 input() 接收設定，output() 回傳結果。呼叫端透過 ComponentRef.instance 監聽。',
        },
      ],
      tips: [
        {
          type: 'best-practice',
          content: '在生產環境中，建議使用 Angular CDK 的 Dialog 或 Overlay 而非自行實作。CDK 已經處理了焦點陷阱（focus trap）、鍵盤導覽、無障礙標籤、backdrop 點擊、動畫等複雜細節。自行實作主要用於學習目的或有 CDK 無法滿足的特殊需求。',
        },
        {
          type: 'tip',
          content: 'ComponentRef.setInput() 是 Angular 14+ 新增的 API，可以在動態元件建立後設定 input 值。它會觸發 OnPush 元件的變更偵測，行為與模板中的 property binding 一致。在此之前，開發者需要直接存取 instance 屬性並手動呼叫 detectChanges()。',
        },
      ],
      exercises: [
        {
          id: 'dynamic-tab-exercise',
          title: '實作動態分頁容器',
          statement: `
<p>實作一個 <code>TabContainer</code> 元件，支援以下功能：</p>
<ol>
  <li>透過 <code>addTab(label, componentType)</code> 方法動態新增分頁</li>
  <li>點擊分頁標籤切換顯示對應的元件（使用 detach/insert，不銷毀）</li>
  <li>支援關閉分頁（銷毀 ComponentRef）</li>
  <li>當所有分頁關閉後顯示空狀態提示</li>
</ol>
<p>提示：使用 ViewContainerRef 管理動態元件，維護一個 ComponentRef 陣列追蹤分頁狀態。</p>`,
          initialCode: `import {
  ChangeDetectionStrategy, Component, ComponentRef, Type,
  ViewContainerRef, signal, viewChild,
} from '@angular/core';

@Component({
  selector: 'app-tab-container',
  template: \`
    <div class="tab-bar" role="tablist">
      <!-- TODO: render tab buttons -->
    </div>
    <div class="tab-panel" role="tabpanel">
      <ng-container #tabOutlet />
      <!-- TODO: show empty state when no tabs -->
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabContainer {
  private readonly tabOutlet = viewChild.required('tabOutlet', { read: ViewContainerRef });

  // TODO: implement tab management
  addTab(label: string, component: Type<unknown>): void { }
  selectTab(index: number): void { }
  closeTab(index: number): void { }
}`,
          hints: [
            '使用 signal<{ label: string; ref: ComponentRef<unknown> }[]>([]) 追蹤分頁狀態',
            'selectTab 中先用 for loop + detach 清空容器，再 insert 目標視圖',
            'closeTab 中用 splice 移除陣列元素，呼叫 ref.destroy() 銷毀元件',
            '記得在關閉分頁後調整 activeIndex，避免超出範圍',
          ],
          solution: `import {
  ChangeDetectionStrategy, Component, ComponentRef, Type,
  ViewContainerRef, signal, viewChild, computed,
} from '@angular/core';

interface TabEntry {
  readonly label: string;
  readonly ref: ComponentRef<unknown>;
}

@Component({
  selector: 'app-tab-container',
  template: \`
    <div class="tab-bar" role="tablist">
      @for (tab of tabs(); track tab.label; let i = $index) {
        <button
          role="tab"
          [attr.aria-selected]="i === activeIndex()"
          [class.active]="i === activeIndex()"
          (click)="selectTab(i)">
          {{ tab.label }}
          <span (click)="closeTab(i); $event.stopPropagation()" aria-label="Close tab">&times;</span>
        </button>
      }
    </div>
    <div class="tab-panel" role="tabpanel">
      <ng-container #tabOutlet />
      @if (tabs().length === 0) {
        <p class="empty-state">沒有開啟的分頁</p>
      }
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabContainer {
  private readonly tabOutlet = viewChild.required('tabOutlet', { read: ViewContainerRef });

  protected readonly tabs = signal<readonly TabEntry[]>([]);
  protected readonly activeIndex = signal(0);

  addTab(label: string, component: Type<unknown>): void {
    const ref = this.tabOutlet().createComponent(component);
    this.tabs.update(list => [...list, { label, ref }]);
    this.selectTab(this.tabs().length - 1);
  }

  selectTab(index: number): void {
    const vcr = this.tabOutlet();
    for (let i = vcr.length - 1; i >= 0; i--) { vcr.detach(i); }
    if (index >= 0 && index < this.tabs().length) {
      vcr.insert(this.tabs()[index].ref.hostView);
      this.activeIndex.set(index);
    }
  }

  closeTab(index: number): void {
    const tab = this.tabs()[index];
    tab.ref.destroy();
    this.tabs.update(list => list.filter((_, i) => i !== index));
    const newIdx = Math.min(this.activeIndex(), this.tabs().length - 1);
    if (this.tabs().length > 0) { this.selectTab(newIdx); }
    else { this.activeIndex.set(0); }
  }
}`,
        },
      ],
    },

    // ─── Section 8: 常見陷阱 ───
    {
      id: 'view-pitfalls',
      title: '常見陷阱',
      content: `
<p>在處理視圖階層和動態元件時，有幾個常見的陷阱會導致難以除錯的問題。
本節深入分析這些陷阱的根本原因和解決方案。</p>

<p><strong>1. ExpressionChangedAfterItHasBeenCheckedError</strong></p>
<p>這是 Angular 開發中最常遇到的錯誤之一。它只在<strong>開發模式</strong>下出現——
Angular 在每次變更偵測後會執行第二輪檢查（double-check），
如果發現綁定值在兩輪之間改變了，就會拋出此錯誤。</p>
<p>根本原因：某些邏輯在變更偵測過程中修改了已經被檢查過的綁定值。常見場景：</p>
<ul>
  <li>在 <code>ngAfterViewInit</code> 中修改模板綁定的值（此時父元件的綁定已檢查完畢）</li>
  <li>在子元件的生命週期鉤子中修改父元件傳入的共享服務狀態</li>
  <li>在 getter 中回傳新的物件參考（每次呼叫都是不同的參考）</li>
</ul>
<p>解決方案：將狀態更新移到 <code>afterNextRender()</code> 中（在 CD 週期之外），
或使用 Signal 讓框架正確追蹤依賴。在 Signal 架構中，
由於值的變更會觸發新的 CD 週期而非在當前週期中修改，此錯誤出現的頻率大幅降低。</p>

<p><strong>2. ViewChild 時機問題</strong></p>
<p><code>viewChild()</code> Signal 在視圖初始化完成前可能是 <code>undefined</code>
（對於非 required 的查詢）。常見錯誤是在 <code>ngOnInit</code> 中存取 viewChild，
此時子視圖可能尚未建立。安全的存取時機：</p>
<ul>
  <li><code>afterNextRender()</code>：保證在首次渲染完成後執行</li>
  <li><code>effect()</code>：當 viewChild Signal 有值時自動執行</li>
  <li>在事件處理器中：使用者互動時視圖一定已經建立</li>
</ul>
<p>注意：<code>viewChild.required()</code> 確保在視圖初始化後一定有值，
但在初始化前存取仍會拋出錯誤。</p>

<p><strong>3. 動態視圖的記憶體洩漏</strong></p>
<p>透過 <code>ViewContainerRef.createComponent()</code> 或 <code>createEmbeddedView()</code>
建立的視圖，如果在不再需要時沒有正確銷毀，會造成記憶體洩漏。
被洩漏的視圖包含 DOM 節點、元件實例、訂閱、事件監聽器等資源。</p>
<p>常見洩漏場景：</p>
<ul>
  <li>動態建立元件後只用 <code>detach()</code> 從容器分離，
  但忘記在最終不需要時呼叫 <code>destroy()</code></li>
  <li>宿主元件被銷毀時，沒有清除動態建立的子視圖</li>
  <li>在 <code>@for</code> 迴圈中動態建立元件但沒有追蹤 ComponentRef</li>
</ul>

<p><strong>4. ComponentRef 的生命週期管理</strong></p>
<p>動態建立的元件不會自動綁定到宿主元件的生命週期。
宿主元件被銷毀時，動態子元件<strong>不會</strong>自動銷毀——
你必須在宿主元件的 <code>ngOnDestroy</code> 中手動銷毀所有 ComponentRef。</p>
<p>最佳實踐是維護一個 <code>ComponentRef[]</code> 陣列，
在 <code>ngOnDestroy</code> 中遍歷並銷毀。
或者使用 <code>DestroyRef</code> 搭配 <code>takeUntilDestroyed()</code>：</p>

<p><strong>5. 在 @if 內使用 ng-content 的陷阱</strong></p>
<p>如前所述，ng-content 的內容在建立時就被實例化。
但更微妙的陷阱是：如果父元件的 <code>@if</code> 條件為 false，
子元件根本不會被建立，ng-content 也不會被處理——
但如果是子元件內部的 <code>@if</code> 包裹 ng-content，
投射的內容仍然會被建立。這種不對稱行為經常造成混淆。</p>`,
      codeExamples: [
        {
          filename: 'expression-changed-error.ts',
          language: 'typescript',
          code: `import {
  ChangeDetectionStrategy, Component, afterNextRender,
  computed, inject, signal,
} from '@angular/core';

// ❌ Bad: causes ExpressionChangedAfterItHasBeenCheckedError
@Component({
  selector: 'app-broken-example',
  template: '<p>{{ label() }}</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrokenExample {
  // This getter returns a new object reference every time
  // Angular's dev-mode double-check sees a different value → ERROR
  protected label(): string {
    return 'Time: ' + Date.now(); // Different value on each CD check!
  }
}

// ✅ Good: use signal to manage state changes correctly
@Component({
  selector: 'app-fixed-example',
  template: '<p>{{ label() }}</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FixedExample {
  protected readonly timestamp = signal(Date.now());
  protected readonly label = computed(() => 'Time: ' + this.timestamp());

  constructor() {
    // Update state outside of CD cycle
    afterNextRender(() => {
      this.timestamp.set(Date.now());
    });
  }
}`,
          annotation: 'ExpressionChangedAfterItHasBeenCheckedError：模板中的方法每次回傳不同值觸發錯誤。用 Signal + afterNextRender 解決。',
        },
        {
          filename: 'component-ref-cleanup.ts',
          language: 'typescript',
          code: `import {
  ChangeDetectionStrategy, Component, ComponentRef, DestroyRef,
  OnDestroy, Type, ViewContainerRef, inject, viewChild,
} from '@angular/core';

@Component({
  selector: 'app-plugin-host',
  template: \`
    <div class="plugin-container">
      <ng-container #pluginOutlet />
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PluginHost implements OnDestroy {
  private readonly pluginOutlet = viewChild.required('pluginOutlet', {
    read: ViewContainerRef,
  });

  // Track all dynamic ComponentRefs for cleanup
  private readonly activeRefs: ComponentRef<unknown>[] = [];

  loadPlugin(pluginComponent: Type<unknown>): ComponentRef<unknown> {
    const ref = this.pluginOutlet().createComponent(pluginComponent);
    this.activeRefs.push(ref);
    return ref;
  }

  unloadPlugin(ref: ComponentRef<unknown>): void {
    const idx = this.activeRefs.indexOf(ref);
    if (idx >= 0) {
      this.activeRefs.splice(idx, 1);
      ref.destroy(); // Triggers ngOnDestroy on the plugin component
    }
  }

  // ✅ Critical: destroy all dynamic components when host is destroyed
  ngOnDestroy(): void {
    for (const ref of this.activeRefs) {
      ref.destroy();
    }
    this.activeRefs.length = 0;
  }
}`,
          annotation: 'ComponentRef 生命週期管理：維護 activeRefs 陣列，在 ngOnDestroy 中逐一銷毀，防止記憶體洩漏。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: 'ExpressionChangedAfterItHasBeenCheckedError 只在開發模式出現。有些開發者用 setTimeout 或 Promise.resolve().then() 「修復」這個錯誤——這只是把更新推遲到下一輪 CD，掩蓋了真正的問題。正確的做法是重構資料流，確保綁定值在 CD 過程中不會被修改。',
        },
        {
          type: 'best-practice',
          content: '在 Signal 架構中，ExpressionChangedAfterItHasBeenCheckedError 幾乎不會出現。因為 Signal 的變更會排程新的 CD 週期，而不是在當前週期中修改值。這是遷移到 Signal 的又一個好理由——更少的框架陷阱，更直覺的資料流。',
        },
        {
          type: 'tip',
          content: '在 Angular DevTools 中可以觀察視圖樹結構和變更偵測頻率。Profiler 標籤頁可以錄製 CD 週期，顯示每個元件的檢查時間。如果某個元件被頻繁檢查但沒有任何變更，說明它的 OnPush 配置或 Signal 使用有問題。',
        },
      ],
      diagrams: [
        {
          id: 'expression-changed-flow',
          caption: 'ExpressionChangedAfterItHasBeenCheckedError 觸發流程',
          content: `CD Cycle (Development Mode)
│
├── 1st Pass: Check all bindings
│   ├── ParentComponent: title = "Hello"  ──→ record value
│   └── ChildComponent ngAfterViewInit()
│       └── modifies shared service state
│           └── ParentComponent.title now = "World"
│
├── 2nd Pass: Verify bindings unchanged (dev only)
│   ├── ParentComponent: title = "World"
│   └── Previous value = "Hello"
│       └── MISMATCH! ──→ throw ExpressionChangedAfterItHasBeenCheckedError
│
│ Fix: Move state update to afterNextRender()
│ which runs AFTER the CD cycle completes
│
├── CD Cycle ends
└── afterNextRender() callback executes
    └── Updates signal → schedules NEW CD cycle`,
        },
      ],
    },
  ],
};

@Component({
  selector: 'app-ch11',
  imports: [GuidePage],
  template: '<app-guide-page [chapter]="chapter" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ch11ViewHierarchy {
  protected readonly chapter = CHAPTER;
}
