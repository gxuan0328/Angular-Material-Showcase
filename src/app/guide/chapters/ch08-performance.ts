import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GuidePage } from '../shared/guide-page';
import { GuideChapter } from '../models/guide-chapter';

const CHAPTER: GuideChapter = {
  id: 'performance',
  number: 8,
  title: '效能最佳化',
  subtitle: 'OnPush、Zoneless、@defer、虛擬捲動、Bundle 優化',
  icon: 'speed',
  category: 'advanced',
  tags: ['OnPush', 'Zoneless', '@defer', 'Lazy Loading', 'Virtual Scrolling', 'NgOptimizedImage'],
  estimatedMinutes: 45,
  sections: [
    // ─── Section 1: 變更偵測 ───
    {
      id: 'change-detection',
      title: '變更偵測',
      content: `
        <p>變更偵測（Change Detection）是 Angular 框架的核心機制，
        負責將元件的資料狀態同步到 DOM 上。理解它的運作原理是效能優化的基礎。</p>

        <p><strong>Default 策略</strong>：Angular 預設在每次非同步事件（點擊、HTTP 回應、計時器等）
        後，會從根元件開始，遍歷整個元件樹執行變更偵測。
        這意味著即使只有一個元件的資料改變，整個應用的所有元件都會被檢查。
        在元件樹深度和數量較大的應用中，這會造成明顯的效能瓶頸。</p>

        <p><strong>OnPush 策略</strong>：設定 <code>changeDetection: ChangeDetectionStrategy.OnPush</code>
        後，Angular 只在以下情況觸發該元件的變更偵測：</p>
        <ul>
          <li>元件的 <code>@Input()</code> 或 <code>input()</code> 參考改變（物件參考，非深度比較）</li>
          <li>元件或其子元件發出事件（如 DOM 事件、<code>output()</code>）</li>
          <li>手動呼叫 <code>markForCheck()</code> 或 <code>detectChanges()</code></li>
          <li>使用 <code>async</code> pipe 訂閱的 Observable 發出新值</li>
          <li>模板中讀取的 Signal 值改變</li>
        </ul>

        <p>OnPush 與 Signal 是天作之合：當 Signal 值改變時，
        Angular 只會標記讀取該 Signal 的元件需要更新，跳過其他元件。
        這比 Default 策略減少了大量不必要的 DOM 比對操作。</p>

        <p>在新專案中，所有元件都應該使用 <code>OnPush</code>。
        搭配 Signal 管理狀態，可以確保變更偵測的範圍最小化。
        這是 Angular 效能優化中投入產出比最高的策略。</p>
      `,
      codeExamples: [
        {
          filename: 'product-card.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';

interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly discount: number;
}

@Component({
  selector: 'app-product-card',
  template: \`
    <div class="product-card">
      <h3>{{ product().name }}</h3>
      <p class="price">
        @if (hasDiscount()) {
          <del>{{ product().price | currency:'TWD' }}</del>
          <strong>{{ finalPrice() | currency:'TWD' }}</strong>
        } @else {
          <span>{{ product().price | currency:'TWD' }}</span>
        }
      </p>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<Product>();

  // Move template computation into computed signal
  protected readonly hasDiscount = computed(() => this.product().discount > 0);
  protected readonly finalPrice = computed(
    () => this.product().price * (1 - this.product().discount),
  );
}`,
          annotation: 'OnPush 元件：Signal input + computed 確保只在資料真正改變時更新。複雜計算放在 computed 中避免重複執行。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: 'Angular 的變更偵測類似 .NET Blazor 的 StateHasChanged()。Blazor 預設只在事件回呼後重新渲染，類似 OnPush。Angular 的 Default 策略更積極——Zone.js 會捕捉所有非同步操作並觸發全域變更偵測。',
        },
        {
          type: 'best-practice',
          content: '所有新元件都必須設定 changeDetection: ChangeDetectionStrategy.OnPush。搭配 Signal 管理所有狀態，讓 Angular 精確知道哪些元件需要更新。避免在模板中呼叫方法——改用 computed() Signal。',
        },
      ],
    },

    // ─── Section 2: Zoneless Angular ───
    {
      id: 'zoneless',
      title: 'Zoneless Angular',
      content: `
        <p>Zone.js 是 Angular 傳統上用來自動觸發變更偵測的工具庫。
        它透過 monkey-patching 瀏覽器的非同步 API（setTimeout、Promise、addEventListener 等）
        來追蹤所有非同步操作，並在操作完成後自動觸發變更偵測。</p>

        <p>雖然 Zone.js 提供了便利的「自動」偵測機制，但它也帶來了明顯的成本：</p>
        <ul>
          <li><strong>Bundle 大小</strong>：Zone.js 約佔 13-15 KB（gzipped），對初始載入有影響</li>
          <li><strong>執行時期開銷</strong>：所有非同步操作都被攔截，即使與 UI 完全無關</li>
          <li><strong>第三方相容性</strong>：某些函式庫（如 Google Maps SDK）與 Zone.js 的 patching 衝突</li>
          <li><strong>除錯困難</strong>：Zone.js 修改了堆疊追蹤，讓錯誤訊息更難閱讀</li>
        </ul>

        <p>Angular 20+ 提供了 <code>provideZonelessChangeDetection()</code>，
        讓應用在不使用 Zone.js 的情況下運作。在 Zoneless 模式中，
        變更偵測完全由 Signal 驅動——當 Signal 值改變時，Angular 精確標記需要更新的元件。</p>

        <p>遷移到 Zoneless 的前提條件：</p>
        <ol>
          <li>所有元件使用 <code>OnPush</code> 變更偵測策略</li>
          <li>所有狀態使用 Signal 管理（不再依賴 Zone.js 的自動偵測）</li>
          <li>所有非同步操作（如 setTimeout 中的狀態更新）使用 Signal 或手動觸發偵測</li>
        </ol>

        <p>Zoneless 模式可以減少約 15% 的 JavaScript bundle 大小，
        並消除所有 Zone.js 的執行時期開銷。對於效能敏感的應用，這是一個值得投入的優化。</p>
      `,
      codeExamples: [
        {
          filename: 'app.config.ts',
          language: 'typescript',
          code: `import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Replace provideZoneChangeDetection() with:
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
  ],
};`,
          annotation: '啟用 Zoneless：將 provideZoneChangeDetection() 替換為 provideZonelessChangeDetection()。',
        },
        {
          filename: 'counter.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <p>Count: {{ count() }}</p>
    <button (click)="increment()">+1</button>
    <button (click)="delayedIncrement()">+1 (delayed)</button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Counter {
  protected readonly count = signal(0);

  protected increment(): void {
    // Signal update automatically triggers change detection in zoneless mode
    this.count.update(c => c + 1);
  }

  protected delayedIncrement(): void {
    setTimeout(() => {
      // In zoneless mode, this works because Signal notifies Angular
      // In zone mode, Zone.js would patch setTimeout to trigger CD
      this.count.update(c => c + 1);
    }, 1000);
  }
}`,
          annotation: 'Zoneless 元件：Signal 的 set/update 自動通知 Angular 排程變更偵測，不需要 Zone.js。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: 'Blazor 從來沒有 Zone.js 的概念——它只在事件回呼後才重新渲染，開發者必須在非同步操作後手動呼叫 StateHasChanged()。Angular 的 Zoneless 模式就是朝這個方向發展，但透過 Signal 自動化了通知機制。',
        },
        {
          type: 'warning',
          content: '遷移到 Zoneless 前，確保所有可變狀態都包在 Signal 中。直接修改 class 屬性（如 this.count = 5）在 Zoneless 模式下不會觸發 UI 更新。這是遷移中最常見的問題。',
        },
      ],
    },

    // ─── Section 3: @defer ───
    {
      id: 'defer-blocks',
      title: '@defer',
      content: `
        <p><code>@defer</code> 是 Angular 17+ 引入的模板語法，
        允許你將元件的載入延遲到滿足特定條件時才發生。
        被 <code>@defer</code> 包裝的元件會被自動拆分成獨立的 JavaScript chunk，
        只有在觸發條件滿足時才會下載和渲染。</p>

        <p><strong>觸發條件</strong>（可組合使用）：</p>
        <ul>
          <li><code>on viewport</code>：元素進入可視範圍時觸發（最常用）</li>
          <li><code>on idle</code>：瀏覽器空閒時觸發（requestIdleCallback）</li>
          <li><code>on interaction</code>：使用者與佔位元素互動時觸發（如點擊）</li>
          <li><code>on hover</code>：滑鼠懸停在佔位元素上時觸發</li>
          <li><code>on timer(duration)</code>：經過指定時間後觸發</li>
          <li><code>when condition</code>：當表達式為 truthy 時觸發</li>
        </ul>

        <p><strong>搭配區塊</strong>：</p>
        <ul>
          <li><code>@placeholder</code>：延遲載入前顯示的佔位內容（必須是輕量級的）</li>
          <li><code>@loading</code>：正在下載 JavaScript chunk 時顯示的載入指示器。
          可設定 <code>minimum</code> 防止閃爍、<code>after</code> 設定延遲顯示</li>
          <li><code>@error</code>：載入失敗時的備援內容</li>
        </ul>

        <p><code>@defer</code> 的效能優勢在於：它不只是延遲渲染（lazy rendering），
        而是延遲「下載」——元件的 JavaScript 程式碼直到觸發條件滿足後才會被下載。
        這對首頁載入速度（LCP）有直接的改善效果，特別是那些在折疊線以下的重量級元件。</p>

        <p>在大型應用中，合理使用 <code>@defer</code> 可以將初始 bundle 大小降低 30-50%，
        讓使用者更快看到首屏內容並開始互動。</p>
      `,
      codeExamples: [
        {
          filename: 'dashboard.html',
          language: 'html',
          code: `<!-- Viewport trigger: load chart when scrolled into view -->
@defer (on viewport) {
  <app-revenue-chart [data]="chartData()" />
} @placeholder {
  <div class="chart-placeholder" style="height: 400px;">
    <span>圖表載入中...</span>
  </div>
} @loading (after 200ms; minimum 500ms) {
  <div class="chart-loading">
    <mat-spinner diameter="40" />
  </div>
} @error {
  <div class="chart-error">
    <p>圖表載入失敗，請重新整理頁面。</p>
  </div>
}

<!-- Idle trigger: prefetch when browser is idle -->
@defer (on idle; prefetch on idle) {
  <app-notifications-panel />
} @placeholder {
  <div class="notifications-placeholder">通知</div>
}

<!-- Interaction trigger: load heavy editor on click -->
@defer (on interaction) {
  <app-rich-text-editor [content]="draftContent()" />
} @placeholder {
  <textarea placeholder="點擊以載入編輯器..." readonly></textarea>
}

<!-- Timer trigger: load ads after 3 seconds -->
@defer (on timer(3s)) {
  <app-ad-banner />
}

<!-- Conditional trigger: load when user is authenticated -->
@defer (when isLoggedIn()) {
  <app-user-dashboard />
} @placeholder {
  <app-login-prompt />
}

<!-- Hover trigger: prefetch on hover, load on interaction -->
@defer (on interaction; prefetch on hover) {
  <app-product-detail [id]="productId()" />
} @placeholder {
  <button>查看詳情</button>
}`,
          annotation: '六種 @defer 觸發條件的實際應用。每種搭配適當的 @placeholder、@loading、@error。',
        },
      ],
      tips: [
        {
          type: 'best-practice',
          content: '首頁折疊線以下的所有重量級元件都應該用 @defer (on viewport) 包裝。搭配 @placeholder 提供骨架屏（skeleton），讓使用者感知頁面已經載入。@loading 設定 minimum 防止載入指示器閃現。',
        },
        {
          type: 'dotnet-comparison',
          content: '.NET Blazor 沒有等同於 @defer 的自動代碼分割機制。最接近的是 Blazor 的延遲載入組件（DynamicComponent 搭配手動載入 DLL），但不如 Angular 的 @defer 簡潔。React 的 Suspense + lazy() 是最接近的對應。',
        },
      ],
    },

    // ─── Section 4: @for track ───
    {
      id: 'track-function',
      title: '@for track',
      content: `
        <p><code>@for</code> 迴圈的 <code>track</code> 表達式是 Angular 效能的關鍵設定之一。
        它告訴 Angular 如何識別列表中的每個項目，以便在資料更新時最小化 DOM 操作。</p>

        <p><strong>track 的運作原理</strong>：當列表資料更新時，Angular 使用 <code>track</code>
        表達式的回傳值來比對新舊列表中的項目。相同 track 值的項目會被視為「同一個」，
        Angular 會重用其 DOM 節點；不同 track 值的項目會被銷毀和重建。</p>

        <p><strong>選擇正確的 track 表達式</strong>：</p>
        <ul>
          <li><code>track item.id</code>：使用唯一 ID 追蹤（最佳選擇）。
          當列表重新排序或部分更新時，DOM 節點會被移動而非銷毀重建</li>
          <li><code>track item</code>：使用物件參考追蹤。
          適用於不可變物件（每次更新都建立新物件），但如果參考不變則不會更新</li>
          <li><code>track $index</code>：使用索引追蹤。
          這是效能最差的選擇——新增/移除項目會導致索引變動，造成大量 DOM 重建</li>
        </ul>

        <p><strong>效能影響對比</strong>（1000 個項目的列表，更新 10 個）：</p>
        <ul>
          <li><code>track item.id</code>：只更新 10 個 DOM 節點 → 最快</li>
          <li><code>track item</code>：若參考改變，銷毀舊節點並建立新節點</li>
          <li><code>track $index</code>：從變更位置開始所有節點都重建 → 最慢</li>
        </ul>

        <p>經驗法則：如果項目有唯一 ID，永遠使用 <code>track item.id</code>。
        如果沒有 ID（如字串陣列），使用 <code>track item</code>。
        只有在資料永遠不會變動（靜態列表）時才考慮 <code>track $index</code>。</p>

        <p><code>@for</code> 是 Angular 17+ 引入的新語法，取代了 <code>*ngFor</code>。
        除了效能提升外，它要求明確指定 <code>track</code> 表達式，
        避免了 <code>*ngFor</code> 時代忘記 <code>trackBy</code> 的常見效能問題。</p>
      `,
      codeExamples: [
        {
          filename: 'user-list.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
}

@Component({
  selector: 'app-user-list',
  template: \`
    <!-- ✅ Best: track by unique ID -->
    <h3>使用者清單</h3>
    @for (user of users(); track user.id) {
      <div class="user-row">
        <span>{{ user.name }}</span>
        <span>{{ user.email }}</span>
        <span>{{ user.role }}</span>
      </div>
    } @empty {
      <p>沒有使用者資料</p>
    }

    <!-- ✅ String array: track by value -->
    <h3>標籤</h3>
    @for (tag of tags(); track tag) {
      <span class="tag">{{ tag }}</span>
    }

    <!-- ❌ Avoid: track by index (poor performance on updates) -->
    <!-- @for (item of items(); track \$index) { ... } -->

    <!-- Using implicit variables -->
    @for (user of users(); track user.id; let i = \$index, last = \$last) {
      <div [class.last-row]="last">
        {{ i + 1 }}. {{ user.name }}
      </div>
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  protected readonly users = signal<readonly User[]>([]);
  protected readonly tags = signal<readonly string[]>(['Angular', 'TypeScript', 'Material']);
}`,
          annotation: '@for 的正確 track 用法：ID 追蹤、值追蹤、隱含變數。@empty 處理空列表。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: '@for 的 track 表達式是必填的——不像 *ngFor 的 trackBy 是可選的。這是一個有意的設計決策，強制開發者思考追蹤策略。永遠優先使用 track item.id，只在沒有唯一 ID 時才使用其他策略。',
        },
        {
          type: 'dotnet-comparison',
          content: 'Blazor 的 @foreach 沒有等同於 track 的機制——它依賴 Diff 演算法自動比對 DOM 變更。但 Blazor 提供了 @key 指令來提示框架如何識別列表項目，功能上等同於 Angular 的 track。',
        },
      ],
    },

    // ─── Section 5: 延遲載入 ───
    {
      id: 'lazy-loading',
      title: '延遲載入',
      content: `
        <p>延遲載入（Lazy Loading）是減少應用初始載入時間最有效的策略之一。
        它將應用的 JavaScript 程式碼拆分成多個 chunk，只在需要時才下載。
        Angular 支援路由級別和元件級別的延遲載入。</p>

        <p><strong>路由級延遲載入</strong>是最常用的方式。
        透過 <code>loadComponent()</code> 和 <code>loadChildren()</code>，
        每個路由頁面會被打包成獨立的 chunk，只在使用者導航到該路由時才下載：</p>
        <ul>
          <li><code>loadComponent</code>：延遲載入單一元件（適合獨立頁面）</li>
          <li><code>loadChildren</code>：延遲載入整個路由子樹（適合功能模組）</li>
        </ul>

        <p><strong>元件級延遲載入</strong>透過 <code>@defer</code> 實現（見上一節）。
        它不受路由限制，可以在同一個頁面內延遲載入特定區塊。</p>

        <p><strong>Bundle 分析</strong>是優化延遲載入的重要工具。
        使用 <code>ng build --stats-json</code> 搭配 <code>webpack-bundle-analyzer</code>
        可以視覺化地檢視每個 chunk 的大小和組成，找出過大的 chunk 並拆分。</p>

        <p>延遲載入的最佳實踐：</p>
        <ul>
          <li>除了首頁（或 Shell），所有路由都應該延遲載入</li>
          <li>共用的函式庫（如 Angular Material）會被自動提取到共用 chunk</li>
          <li>避免在主 bundle 中匯入只有特定頁面使用的大型函式庫</li>
          <li>使用 <code>preloadAllModules</code> 策略在背景預載入常用路由</li>
        </ul>

        <p>在典型的企業應用中，合理的延遲載入可以將初始 bundle 從 2-3 MB 降到 200-400 KB，
        讓首頁載入時間從 5-8 秒降到 1-2 秒。</p>
      `,
      codeExamples: [
        {
          filename: 'app.routes.ts',
          language: 'typescript',
          code: `import { Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';

export const routes: Routes = [
  // Eager: only the shell/layout component
  {
    path: '',
    loadComponent: () => import('./home/home').then(m => m.Home),
  },
  // Lazy: each feature route in its own chunk
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [() => inject(AuthService).isAuthenticated()],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports').then(m => m.Reports),
  },
];

// In app.config.ts: enable preloading strategy
// provideRouter(routes, withPreloading(PreloadAllModules))`,
          annotation: '路由延遲載入：每個功能路由獨立 chunk。PreloadAllModules 在空閒時預載入所有路由。',
        },
        {
          filename: 'terminal',
          language: 'bash',
          code: `# Build with stats output for bundle analysis
ng build --stats-json

# Install and run webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/my-app/stats.json

# Check bundle sizes in production build output
ng build --configuration production
# Look for "Lazy Chunk Files" in the output table`,
          annotation: 'Bundle 分析指令：產生 stats.json、視覺化分析、檢視 chunk 大小。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: '.NET Blazor WebAssembly 也有類似的延遲載入概念，透過 LazyLoadAssemblies 在路由變更時動態載入 DLL。Angular 的路由延遲載入更自動化——import() 語法讓打包工具自動拆分 chunk，不需要手動管理 assembly 列表。',
        },
        {
          type: 'best-practice',
          content: '使用 PreloadAllModules 策略讓常用路由在背景預載入。使用者看到首頁後，瀏覽器會在空閒時下載其他路由的 chunk。這樣後續導航幾乎是即時的，同時不影響首次載入速度。',
        },
      ],
    },

    // ─── Section 6: 圖片優化 ───
    {
      id: 'image-optimization',
      title: '圖片優化',
      content: `
        <p>圖片通常佔網頁下載量的 50% 以上，是影響效能的主要因素之一。
        Angular 提供了 <code>NgOptimizedImage</code> 指令，
        自動套用圖片最佳化的最佳實踐，大幅改善 LCP（Largest Contentful Paint）指標。</p>

        <p><code>NgOptimizedImage</code> 自動處理的優化：</p>
        <ul>
          <li><strong>延遲載入</strong>：預設為 <code>loading="lazy"</code>，
          只有在接近可視範圍時才下載圖片</li>
          <li><strong>fetchpriority</strong>：標記為 <code>priority</code> 的圖片
          會設定 <code>fetchpriority="high"</code>，告訴瀏覽器優先下載</li>
          <li><strong>寬高比防止 Layout Shift</strong>：要求指定 <code>width</code> 和 <code>height</code>，
          瀏覽器可以在圖片下載前預留空間，避免 CLS（Cumulative Layout Shift）</li>
          <li><strong>srcset 自動產生</strong>：搭配圖片 CDN loader 自動產生不同尺寸的 srcset</li>
          <li><strong>preconnect 警告</strong>：提醒開發者為圖片 CDN 加入 preconnect 提示</li>
        </ul>

        <p>使用方式是將 <code>&lt;img&gt;</code> 的 <code>src</code> 替換為 <code>ngSrc</code>。
        <code>NgOptimizedImage</code> 會在開發模式中檢查常見錯誤
        並在控制台輸出警告訊息，幫助你發現效能問題。</p>

        <p><code>priority</code> 屬性應該只用在折疊線以上（Above the Fold）的 LCP 圖片上——
        通常是頁面頂部的 Hero 圖片或主要產品圖片。不要過度使用 <code>priority</code>，
        否則瀏覽器會試圖同時下載太多「高優先」圖片，反而降低效能。</p>

        <p><code>placeholder</code> 屬性可以在圖片載入前顯示模糊的預覽圖，
        提升使用者體驗。它使用自動產生的低解析度版本，通常只有 1-2 KB。</p>
      `,
      codeExamples: [
        {
          filename: 'hero-section.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  imports: [NgOptimizedImage],
  template: \`
    <!-- LCP image: priority + fill mode for responsive layout -->
    <div class="hero-banner">
      <img
        ngSrc="/assets/hero-banner.webp"
        fill
        priority
        alt="Angular Material Blocks showcase"
      />
    </div>

    <!-- Standard image: lazy loaded by default -->
    <div class="feature-grid">
      <img
        ngSrc="/assets/feature-1.webp"
        width="400"
        height="300"
        placeholder
        alt="Signal-based reactivity"
      />
      <img
        ngSrc="/assets/feature-2.webp"
        width="400"
        height="300"
        placeholder
        alt="Material Design components"
      />
    </div>

    <!-- Image with CDN loader (auto srcset generation) -->
    <img
      ngSrc="products/widget-photo.jpg"
      width="600"
      height="400"
      sizes="(max-width: 768px) 100vw, 600px"
      alt="Product photo"
    />
  \`,
  styles: \`
    .hero-banner {
      position: relative;
      width: 100%;
      height: 400px;
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSection {}`,
          annotation: 'NgOptimizedImage 用法：priority 標記 LCP 圖片、fill 模式填滿容器、placeholder 模糊預覽。',
        },
        {
          filename: 'app.config.ts (CDN loader)',
          language: 'typescript',
          code: `import { ApplicationConfig } from '@angular/core';
import { provideImgixLoader } from '@angular/common';
// Also available: provideCloudflareLoader, provideCloudinaryLoader, provideNetlifyLoader

export const appConfig: ApplicationConfig = {
  providers: [
    // Configure CDN image loader for automatic srcset generation
    provideImgixLoader('https://my-app.imgix.net/'),
  ],
};`,
          annotation: '設定圖片 CDN loader，讓 NgOptimizedImage 自動產生不同尺寸的 srcset。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: 'NgOptimizedImage 不支援 inline base64 圖片（data: URL）。Base64 圖片應直接使用標準 <img> 的 src 屬性。NgOptimizedImage 專門針對需要從網路下載的圖片進行優化。',
        },
        {
          type: 'dotnet-comparison',
          content: '.NET 沒有內建的圖片優化指令。通常透過 CDN（如 Azure CDN + Image Transforms）或第三方套件（ImageSharp）在伺服器端處理。Angular 的 NgOptimizedImage 是在客戶端透過瀏覽器 API（loading、fetchpriority、srcset）實現優化。',
        },
      ],
    },

    // ─── Section 7: 虛擬捲動 ───
    {
      id: 'virtual-scrolling',
      title: '虛擬捲動',
      content: `
        <p>虛擬捲動（Virtual Scrolling）是處理大量列表資料的關鍵效能技術。
        與其一次渲染所有項目（可能數千個 DOM 節點），
        虛擬捲動只渲染可視範圍內的項目，大幅減少 DOM 節點數量和記憶體使用。</p>

        <p>Angular CDK 提供了 <code>CdkVirtualScrollViewport</code> 元件，
        實作了高效的虛擬捲動功能。核心概念：</p>
        <ul>
          <li><code>cdk-virtual-scroll-viewport</code>：捲動容器，必須設定固定高度</li>
          <li><code>*cdkVirtualFor</code>：類似 <code>*ngFor</code> 的指令，但只渲染可見項目</li>
          <li><code>itemSize</code>：每個項目的固定高度（像素），用於計算捲動位置</li>
        </ul>

        <p>效能數據對比（10,000 個列表項目）：</p>
        <ul>
          <li><strong>無虛擬捲動</strong>：10,000 個 DOM 節點、初始渲染 3-5 秒、記憶體 200+ MB</li>
          <li><strong>虛擬捲動</strong>：約 20-30 個 DOM 節點、即時渲染、記憶體 50 MB</li>
        </ul>

        <p>使用虛擬捲動時需要注意：</p>
        <ul>
          <li>項目高度必須一致或可預測（<code>itemSize</code> 只支援固定高度）</li>
          <li>如需動態高度，可使用 <code>autosize</code> 策略（實驗性功能）</li>
          <li>捲動容器需要明確的 CSS 高度，不能使用 auto</li>
          <li>每個項目應該是輕量級的——避免在列表項中使用重量級元件</li>
        </ul>

        <p>虛擬捲動特別適合以下場景：長列表（>100 項）、表格資料、
        無限捲動（Infinite Scroll）、日誌檢視器、聊天記錄等。
        若項目數量少於 50，通常不需要虛擬捲動——直接渲染即可。</p>
      `,
      codeExamples: [
        {
          filename: 'log-viewer.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

interface LogEntry {
  readonly id: number;
  readonly timestamp: string;
  readonly level: 'info' | 'warn' | 'error';
  readonly message: string;
}

@Component({
  selector: 'app-log-viewer',
  imports: [ScrollingModule],
  template: \`
    <h3>系統日誌 ({{ logs().length }} 筆)</h3>

    <cdk-virtual-scroll-viewport
      itemSize="48"
      class="log-viewport"
    >
      <div
        *cdkVirtualFor="let log of logs(); trackBy: trackById"
        class="log-entry"
        [class.log-warn]="log.level === 'warn'"
        [class.log-error]="log.level === 'error'"
      >
        <span class="log-time">{{ log.timestamp }}</span>
        <span class="log-level">{{ log.level | uppercase }}</span>
        <span class="log-msg">{{ log.message }}</span>
      </div>
    </cdk-virtual-scroll-viewport>
  \`,
  styles: \`
    .log-viewport {
      height: 600px;
      width: 100%;
      border: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
      border-radius: 8px;
    }
    .log-entry {
      display: flex;
      align-items: center;
      gap: 1rem;
      height: 48px;
      padding: 0 1rem;
      border-bottom: 1px solid var(--mat-sys-outline-variant, #f0f0f0);
      font-family: 'Cascadia Code', monospace;
      font-size: 0.8125rem;
    }
    .log-warn { background: #fff8e1; }
    .log-error { background: #fce4ec; }
    .log-time { color: #6b7280; white-space: nowrap; }
    .log-level { font-weight: 600; width: 48px; }
    .log-msg { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogViewer {
  protected readonly logs = signal<readonly LogEntry[]>([]);

  protected trackById(_index: number, item: LogEntry): number {
    return item.id;
  }
}`,
          annotation: '虛擬捲動日誌檢視器：固定 itemSize=48px、trackBy 提升效能、固定高度容器。',
        },
      ],
      tips: [
        {
          type: 'dotnet-comparison',
          content: '.NET Blazor 提供了 Virtualize<T> 元件，功能上與 Angular CDK 的 CdkVirtualScrollViewport 幾乎相同。兩者都需要指定項目高度（Blazor 的 ItemSize 對應 Angular 的 itemSize），都只渲染可見範圍的項目。',
        },
        {
          type: 'tip',
          content: '在虛擬捲動容器內使用 *cdkVirtualFor 而非 @for。CDK 的虛擬化指令需要自行管理 DOM 節點的回收和重用，這是 @for 無法做到的。未來 Angular 可能提供與 @for 整合的虛擬化方案。',
        },
      ],
    },

    // ─── Section 8: 常見陷阱 ───
    {
      id: 'perf-pitfalls',
      title: '常見陷阱',
      content: `
        <p>以下是 Angular 效能優化中最常見的 8 個錯誤。
        避免這些陷阱可以讓應用在不做任何「高級」優化的情況下就有良好的效能：</p>

        <ol>
          <li><strong>在模板中呼叫方法</strong>：模板中的 <code>{{ getTotal() }}</code>
          在每次變更偵測都會重新執行。改用 <code>computed()</code> Signal，
          只有在依賴改變時才重新計算，並且結果會被快取。</li>

          <li><strong>忘記 OnPush</strong>：使用 Default 變更偵測策略的元件會在每次非同步事件
          後被檢查，即使資料沒有改變。所有元件都應設定 <code>OnPush</code>。</li>

          <li><strong>@for 使用 track $index</strong>：追蹤索引會在列表修改時導致大量 DOM 重建。
          使用 <code>track item.id</code> 讓 Angular 精確追蹤每個項目。</li>

          <li><strong>超大初始 Bundle</strong>：所有路由都打包在主 bundle 中。
          使用 <code>loadComponent()</code> / <code>loadChildren()</code> 延遲載入非首頁路由。</li>

          <li><strong>未使用 NgOptimizedImage</strong>：直接使用 <code>&lt;img src&gt;</code>
          缺少 lazy loading、fetchpriority、srcset 等優化。
          所有靜態圖片都應改用 <code>ngSrc</code>。</li>

          <li><strong>渲染超長列表</strong>：一次渲染數千個項目會造成嚴重的效能問題。
          超過 100 個項目的列表應使用 <code>CdkVirtualScrollViewport</code>。</li>

          <li><strong>在 Zone 模式下執行大量非同步操作</strong>：Zone.js 會攔截所有非同步操作
          並觸發變更偵測。使用 <code>NgZone.runOutsideAngular()</code> 排除不影響 UI 的操作，
          或遷移到 Zoneless 模式。</li>

          <li><strong>@defer 濫用</strong>：不是所有元件都需要 <code>@defer</code>。
          輕量級元件直接渲染更快，因為 <code>@defer</code> 有額外的 chunk 請求開銷。
          只對重量級或折疊線以下的元件使用 <code>@defer</code>。</li>
        </ol>
      `,
      codeExamples: [
        {
          filename: 'performance-pitfall-examples.ts',
          language: 'typescript',
          code: `// ❌ Pitfall 1: method call in template — runs every change detection cycle
@Component({
  template: \`<span>Total: {{ calculateTotal() }}</span>\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Bad {
  calculateTotal(): number {
    console.log('Recalculating...'); // Fires repeatedly!
    return this.items().reduce((sum, i) => sum + i.price, 0);
  }
}

// ✅ Fix: use computed() — memoized, runs only when dependencies change
@Component({
  template: \`<span>Total: {{ total() }}</span>\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Good {
  private readonly items = signal<Item[]>([]);
  protected readonly total = computed(() =>
    this.items().reduce((sum, i) => sum + i.price, 0),
  );
}

// ❌ Pitfall 7: heavy async work inside Zone triggers unnecessary CD
export class HeavyWork {
  private readonly zone = inject(NgZone);

  pollSensor(): void {
    setInterval(() => {
      // This triggers change detection every 100ms!
      this.readSensorData();
    }, 100);
  }
}

// ✅ Fix: run outside Angular zone
export class HeavyWorkFixed {
  private readonly zone = inject(NgZone);
  private readonly sensorData = signal(0);

  pollSensor(): void {
    this.zone.runOutsideAngular(() => {
      setInterval(() => {
        const value = this.readSensorData();
        // Signal update will notify Angular when value changes
        this.sensorData.set(value);
      }, 100);
    });
  }
}`,
          annotation: '效能陷阱對照：模板方法呼叫 vs computed、Zone 內外的非同步操作差異。',
        },
      ],
      tips: [
        {
          type: 'best-practice',
          content: '效能優化的優先順序：1) OnPush + Signal 2) 正確的 @for track 3) 路由延遲載入 4) NgOptimizedImage 5) @defer 折疊線以下元件 6) 虛擬捲動。前三項是每個專案都應該做的基本功，後三項根據需求選擇性使用。',
        },
        {
          type: 'dotnet-comparison',
          content: '.NET Blazor 的效能優化也有類似的原則：避免在 Razor 模板中呼叫昂貴的方法、使用 ShouldRender() 控制重新渲染（類似 OnPush）、Virtualize 處理長列表。核心理念一致：減少不必要的計算和 DOM 操作。',
        },
      ],
    },
  ],
};

@Component({
  selector: 'app-ch08',
  imports: [GuidePage],
  template: '<app-guide-page [chapter]="chapter" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ch08Performance {
  protected readonly chapter = CHAPTER;
}
