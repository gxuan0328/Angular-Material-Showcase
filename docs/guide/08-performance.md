# 第八章：Performance — 效能優化

> **目標讀者**：具備 .NET/C# 後端開發經驗，正在學習 Angular 19+ 的工程師。
> **Angular 版本**：19+（OnPush、Zoneless、@defer、SSR、Hydration）
> **先備知識**：第一至七章（元件、Signals、DI、路由、HttpClient、Forms、Testing）
> **最後更新**：2026-04-09

---

## 本章目標

完成本章後，你將能夠：

1. 理解 Angular 的變更偵測機制（Default vs OnPush）
2. 遷移至 Zoneless Angular 架構
3. 使用 `@defer` 區塊實現懶載入
4. 正確使用 `@for` 的 `track` 提升列表效能
5. 實作路由與元件層級的延遲載入
6. 優化 Bundle 大小與 Tree-shaking
7. 使用 `NgOptimizedImage` 最佳化圖片載入
8. 設定 SSR 與 Hydration
9. 使用 Web Workers 卸載重計算
10. 實作虛擬捲動處理大量資料
11. 使用 Angular DevTools 與 Chrome DevTools 分析效能瓶頸

---

## .NET 對照速查表

| .NET 概念 | Angular 19+ 對應 |
|---|---|
| Blazor 差異演算法（DOM diffing） | Angular 變更偵測（Change Detection） |
| `ShouldRender()` / `INotifyPropertyChanged` | `OnPush` + Signals |
| `Task.Run()` 背景工作 | Web Workers |
| Response Caching Middleware | `@defer` + HTTP cache interceptor |
| Blazor `Virtualize<T>` | CDK `CdkVirtualScrollViewport` |
| ASP.NET Core 靜態檔案壓縮 | Angular CLI build optimization + Brotli |
| Blazor 預渲染（Prerender） | Angular SSR + Hydration |
| `IMemoryCache` / `IDistributedCache` | Signal memoization / `computed()` |
| `Lazy<T>` | `@defer` / dynamic `import()` |

---

## 8.1 變更偵測

### 8.1.1 Default 策略

Angular 的預設變更偵測策略會在每次瀏覽器事件後檢查**所有**元件：

```
Browser Event (click, HTTP response, timer, ...)
        │
        ▼
   Zone.js 攔截
        │
        ▼
  ┌─────────────────────────────────┐
  │    Angular Change Detection     │
  │                                 │
  │  Root Component                 │
  │    ├── Header (checked ✓)       │
  │    ├── Sidebar (checked ✓)      │
  │    ├── MainContent (checked ✓)  │
  │    │   ├── ProductList (✓)      │
  │    │   ├── ProductCard (✓)      │  ← Every component is checked
  │    │   └── ProductCard (✓)      │     even if its data didn't change
  │    └── Footer (checked ✓)       │
  └─────────────────────────────────┘
```

**問題**：隨著元件樹增長，檢查所有元件的成本也線性增長。一個包含 500 個元件的頁面，每次滑鼠移動都會觸發 500 次檢查。

### 8.1.2 OnPush 策略

`OnPush` 告訴 Angular：只在以下情況檢查此元件：

1. **Input 參考改變**（immutable data pattern）
2. **元件或子元件觸發事件**（DOM events within the component template）
3. **手動標記** `markForCheck()` / `ChangeDetectorRef`
4. **Signal 值改變**（Angular 19+ 自動追蹤）
5. **Async pipe 發出新值**

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-product-card',
  template: `
    <div class="product-card">
      <h3>{{ product().name }}</h3>
      <p>{{ product().price | currency:'TWD' }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush, // REQUIRED for all components
})
export class ProductCard {
  readonly product = input.required<Product>();
}
```

### 8.1.3 OnPush + Signals = 精準更新

```
Signal 值變更
      │
      ▼
 Angular 只標記使用該 Signal 的元件
      │
      ▼
  ┌─────────────────────────────────┐
  │    Angular Change Detection     │
  │                                 │
  │  Root Component                 │
  │    ├── Header (skipped ○)       │
  │    ├── Sidebar (skipped ○)      │
  │    ├── MainContent              │
  │    │   ├── ProductList          │
  │    │   ├── ProductCard (✓)      │  ← Only this card's signal changed
  │    │   └── ProductCard (○)      │
  │    └── Footer (skipped ○)       │
  └─────────────────────────────────┘
```

### 8.1.4 為何 OnPush 是必要的

| 面向 | Default | OnPush |
|---|---|---|
| 檢查頻率 | 每次事件檢查所有元件 | 只檢查受影響的元件 |
| 效能影響 | O(n) — n 為元件數量 | O(1) — 只有變更的元件 |
| 搭配 Signals | 仍檢查所有元件 | 精準追蹤 Signal 依賴 |
| Zoneless 相容 | 不相容 | 完全相容 |
| 生產級建議 | 不建議 | **強制要求** |

> **規則**：本專案所有元件**必須**設定 `changeDetection: ChangeDetectionStrategy.OnPush`。

### 8.1.5 Zone.js 的角色

Zone.js 是 Angular 用來攔截瀏覽器非同步 API 的函式庫：

```
Zone.js 攔截的 API：
├── setTimeout / setInterval
├── Promise.then
├── addEventListener (click, keydown, etc.)
├── XMLHttpRequest / fetch
├── requestAnimationFrame
├── MutationObserver
└── ... (幾乎所有非同步 API)

攔截流程：
1. 使用者點擊按鈕
2. Zone.js 攔截 click event
3. 執行事件處理器
4. Zone.js 通知 Angular: "有東西改變了！"
5. Angular 執行變更偵測
```

**Zone.js 的問題**：

1. **過度觸發**：任何非同步操作都觸發完整的變更偵測
2. **Bundle 大小**：Zone.js 約增加 ~13KB（gzipped）
3. **除錯困難**：改變了原生 API 的行為，stack trace 不直觀
4. **第三方相容性**：某些函式庫與 Zone.js 衝突

---

## 8.2 Signal 變更偵測（Zoneless）

### 8.2.1 provideZonelessChangeDetection

Angular 19+ 提供無 Zone.js 的變更偵測：

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), // Replace provideZoneChangeDetection()
    // ... other providers
  ],
};
```

> **注意**：在 Angular v19 中 `provideZonelessChangeDetection()` 已脫離 experimental 階段。Angular v20.2+ 此功能為穩定版。

### 8.2.2 移除 Zone.js

```typescript
// angular.json — remove zone.js polyfill
{
  "build": {
    "options": {
      "polyfills": [
        // Remove "zone.js" from this array
      ]
    }
  },
  "test": {
    "options": {
      "polyfills": [
        // Remove "zone.js" and "zone.js/testing" from this array
      ]
    }
  }
}
```

### 8.2.3 Zoneless 的運作方式

```
Without Zone.js — Angular relies on Signals:

Signal.set() / Signal.update()
        │
        ▼
  Angular Scheduler
  "哪些元件讀取了這個 Signal？"
        │
        ▼
  Only mark those components for check
        │
        ▼
  Change Detection runs on those components ONLY
```

### 8.2.4 遷移至 Zoneless 的步驟

```
Step 1: 確保所有元件使用 OnPush
         └── 使用 Angular CLI: ng generate @angular/core:signal

Step 2: 將狀態管理從可變物件改為 Signals
         └── 替換 class 屬性為 signal()
         └── 替換 getter 為 computed()
         └── 替換手動 subscribe 為 effect() 或 resource()

Step 3: 替換 setTimeout/setInterval 通知
         └── 使用 afterRenderEffect() 處理 DOM 更新
         └── 使用 signal.set() 觸發更新（而非依賴 Zone.js 攔截 setTimeout）

Step 4: 更新第三方函式庫
         └── 確認 Angular Material 版本支援 Zoneless
         └── 檢查其他函式庫是否依賴 Zone.js

Step 5: 切換 Provider
         └── provideZoneChangeDetection() → provideZonelessChangeDetection()
         └── 移除 polyfills 中的 zone.js

Step 6: 測試
         └── ng test（移除 zone.js/testing polyfill）
         └── 手動測試所有互動流程
```

### 8.2.5 Zoneless 注意事項

```typescript
// ❌ Bad — won't trigger change detection without Zone.js
setTimeout(() => {
  this.data = newData;  // Plain property, no signal
}, 1000);

// ✅ Good — signal update triggers change detection automatically
setTimeout(() => {
  this.data.set(newData);  // Signal update
}, 1000);

// ❌ Bad — manual ChangeDetectorRef workaround
constructor(private cdr: ChangeDetectorRef) {}
ngOnInit(): void {
  someCallback(() => {
    this.value = 'updated';
    this.cdr.markForCheck();  // Fragile, easy to forget
  });
}

// ✅ Good — signal-based, no manual change detection needed
private readonly value = signal('');
ngOnInit(): void {
  someCallback(() => {
    this.value.set('updated');  // Automatically schedules change detection
  });
}
```

---

## 8.3 @defer 區塊

### 8.3.1 基本語法

`@defer` 讓你延遲載入元件的 JavaScript，直到滿足特定條件：

```typescript
@Component({
  selector: 'app-dashboard',
  template: `
    <!-- This chart component's JS is NOT included in the initial bundle -->
    @defer {
      <app-heavy-chart [data]="chartData()" />
    } @placeholder {
      <div class="chart-placeholder">圖表載入中...</div>
    } @loading (minimum 300ms) {
      <div class="loading-spinner">
        <mat-spinner diameter="32" />
      </div>
    } @error {
      <div class="error-message">圖表載入失敗。</div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard { }
```

> **對應 .NET**：`@defer` 類似 `Lazy<T>` 搭配 `Task`，但作用於整個元件的 JavaScript bundle。

### 8.3.2 觸發條件

| 觸發器 | 語法 | 說明 |
|---|---|---|
| **on viewport** | `@defer (on viewport)` | 元素進入可視區域時 |
| **on idle** | `@defer (on idle)` | 瀏覽器閒置時（`requestIdleCallback`） |
| **on interaction** | `@defer (on interaction)` | 使用者互動（click、focus） |
| **on hover** | `@defer (on hover)` | 滑鼠懸停時 |
| **on timer** | `@defer (on timer(5s))` | 指定時間後 |
| **on immediate** | `@defer (on immediate)` | 立即（但仍獨立 chunk） |
| **when** | `@defer (when condition)` | 條件為 true 時 |

### 8.3.3 觸發器詳細範例

```typescript
@Component({
  template: `
    <!-- 1. on viewport: Lazy load when scrolled into view -->
    <section class="reviews-section">
      @defer (on viewport) {
        <app-reviews [productId]="productId()" />
      } @placeholder {
        <div style="height: 400px;">
          <!-- Reserve space to prevent layout shift -->
          <p>滾動到此處以載入評論...</p>
        </div>
      }
    </section>

    <!-- 2. on idle: Load during browser idle time -->
    @defer (on idle) {
      <app-analytics-widget />
    } @placeholder {
      <div class="widget-skeleton"></div>
    }

    <!-- 3. on interaction: Load when user interacts -->
    @defer (on interaction) {
      <app-comment-form [postId]="postId()" />
    } @placeholder {
      <button>點擊以載入評論表單</button>
    }

    <!-- 4. on interaction with reference: Load when specific element is interacted with -->
    <button #loadBtn>載入詳情</button>
    @defer (on interaction(loadBtn)) {
      <app-product-details [id]="productId()" />
    } @placeholder {
      <p>點擊上方按鈕以載入產品詳情。</p>
    }

    <!-- 5. on hover: Prefetch on hover, useful for dropdown menus -->
    <div #menuTrigger>選單</div>
    @defer (on hover(menuTrigger)) {
      <app-mega-menu />
    } @placeholder {
      <div class="menu-placeholder"></div>
    }

    <!-- 6. on timer: Load after 3 seconds -->
    @defer (on timer(3s)) {
      <app-promotional-banner />
    } @placeholder {
      <div class="banner-skeleton"></div>
    }

    <!-- 7. when: Conditional loading based on signal/expression -->
    @defer (when showAdvanced()) {
      <app-advanced-settings />
    }

    <!-- 8. Combined triggers (OR logic): load on viewport OR after 10s -->
    @defer (on viewport; on timer(10s)) {
      <app-newsletter-signup />
    } @placeholder {
      <div class="signup-skeleton"></div>
    }
  `,
})
export class ProductPage {
  protected readonly showAdvanced = signal(false);
}
```

### 8.3.4 @placeholder, @loading, @error 詳細

```typescript
@Component({
  template: `
    @defer (on viewport) {
      <app-data-grid [data]="largeDataSet()" />
    }

    <!-- @placeholder: shown before defer trigger fires -->
    <!-- Optional 'minimum' parameter ensures placeholder shows for at least this duration -->
    @placeholder (minimum 500ms) {
      <div class="grid-skeleton" style="height: 600px;">
        <!-- Skeleton UI to prevent layout shift -->
        @for (i of skeletonRows; track i) {
          <div class="skeleton-row"></div>
        }
      </div>
    }

    <!-- @loading: shown after trigger fires but before JS is loaded -->
    <!-- 'after' delays showing loader (avoid flash for fast loads) -->
    <!-- 'minimum' keeps loader visible to prevent flash -->
    @loading (after 200ms; minimum 300ms) {
      <div class="loading-overlay">
        <mat-spinner />
        <p>載入資料表格...</p>
      </div>
    }

    <!-- @error: shown if the deferred chunk fails to load -->
    @error {
      <div class="error-state" role="alert">
        <p>無法載入資料表格元件。</p>
        <button (click)="reloadPage()">重新載入頁面</button>
      </div>
    }
  `,
})
export class DataPage {
  protected readonly skeletonRows = Array.from({ length: 10 }, (_, i) => i);
}
```

### 8.3.5 Prefetch 策略

```typescript
@Component({
  template: `
    <!-- Prefetch JS on idle, render on viewport -->
    @defer (on viewport; prefetch on idle) {
      <app-heavy-component />
    } @placeholder {
      <div>Placeholder content</div>
    }

    <!-- Prefetch on hover, render on interaction -->
    @defer (on interaction; prefetch on hover) {
      <app-settings-panel />
    } @placeholder {
      <button>開啟設定</button>
    }

    <!-- Prefetch when condition is true -->
    @defer (when showPanel(); prefetch when shouldPrefetch()) {
      <app-analysis-panel />
    }
  `,
})
export class SmartPage {
  protected readonly showPanel = signal(false);
  protected readonly shouldPrefetch = signal(false);
}
```

---

## 8.4 @for 的 track

### 8.4.1 track 的必要性

```typescript
// @for requires a track expression — Angular uses it to identify items
// across re-renders, similar to React's key prop

// ❌ Compile error — track is required
@for (item of items()) {
  <div>{{ item.name }}</div>
}

// ✅ Good — track by unique identifier
@for (item of items(); track item.id) {
  <app-item-card [item]="item" />
}

// ✅ Good — track by index (when items have no unique ID)
@for (item of items(); track $index) {
  <div>{{ item }}</div>
}
```

### 8.4.2 track 對效能的影響

```
Scenario: List of 1000 items, 1 item updated

With track item.id:
├── Angular compares item IDs
├── Finds 1 changed item
├── Updates 1 DOM element
└── Time: ~1ms

With track $index:
├── Angular compares by index
├── If items shift, many elements need updating
├── May recreate DOM elements unnecessarily
└── Time: ~10-50ms (depending on shift)

Without track (hypothetical):
├── Angular recreates ALL DOM elements
├── Destroys 1000 + Creates 1000 elements
└── Time: ~100-500ms
```

### 8.4.3 track 最佳實踐

```typescript
// Best: Track by unique, stable ID (database primary key)
@for (user of users(); track user.id) {
  <app-user-row [user]="user" />
}

// OK: Track by unique combination when no single ID exists
@for (item of items(); track item.category + '-' + item.name) {
  <div>{{ item.name }}</div>
}

// Last resort: Track by index (only for static lists that don't reorder)
@for (label of staticLabels; track $index) {
  <span class="tag">{{ label }}</span>
}

// ❌ Avoid: Track by mutable property
@for (item of items(); track item.timestamp) {
  <!-- timestamp changes on every update — causes full re-render! -->
}
```

---

## 8.5 延遲載入

### 8.5.1 路由層級延遲載入

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home-page').then(m => m.HomePage),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/product.routes').then(m => m.productRoutes),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [adminGuard],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings-page').then(m => m.SettingsPage),
  },
];
```

```typescript
// src/app/features/products/product.routes.ts
import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./product-list').then(m => m.ProductList),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./product-detail').then(m => m.ProductDetail),
  },
  {
    path: ':id/reviews',
    loadComponent: () =>
      import('./product-reviews').then(m => m.ProductReviews),
  },
];
```

### 8.5.2 元件層級延遲載入

使用 `@defer` 在元件模板中實現延遲載入（參見 8.3 節）。

### 8.5.3 Chunk 分析

```bash
# Build with stats-json to analyze bundle
ng build --stats-json

# Use source-map-explorer
npx source-map-explorer dist/my-app/browser/*.js

# Or use webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/my-app/browser/stats.json
```

分析結果中常見的問題：

```
Bundle Analysis:
├── main.js (250KB)        ← Should be < 200KB
├── polyfills.js (35KB)    ← Can remove zone.js (-13KB)
├── vendor.js (180KB)      ← Check for unnecessary imports
├── lazy-module-1.js (45KB)
└── lazy-module-2.js (30KB)

Common issues:
1. moment.js imported (300KB) → Use date-fns or native Intl
2. lodash imported entirely → Import specific functions
3. Unused Material modules → Import only needed components
4. Barrel file re-exports everything → Use direct imports
```

---

## 8.6 Bundle 優化

### 8.6.1 Tree-shaking

Angular CLI 的生產建置自動啟用 tree-shaking，但你的程式碼結構會影響效果：

```typescript
// ❌ Bad — imports everything from the barrel
import { ProductService, OrderService, UserService, AnalyticsService } from './services';
// If barrel re-exports 20 services, tree-shaking may struggle

// ✅ Good — direct imports
import { ProductService } from './services/product.service';
import { OrderService } from './services/order.service';

// ❌ Bad — side-effect imports prevent tree-shaking
import './polyfills';  // Everything in this file is included

// ✅ Good — conditional side effects
if (typeof window !== 'undefined') {
  import('./browser-polyfills');
}
```

### 8.6.2 Code Splitting 策略

```typescript
// Strategy 1: Route-based splitting (most common)
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
}

// Strategy 2: Feature-based splitting with @defer
@defer (on interaction) {
  <app-rich-text-editor />  // Editor JS loads only when needed
}

// Strategy 3: Conditional imports
async loadChart(): Promise<void> {
  const { Chart } = await import('chart.js');
  // Use Chart only when needed
}
```

### 8.6.3 Angular CLI 建置優化選項

```json
// angular.json
{
  "build": {
    "configurations": {
      "production": {
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
        ],
        "outputHashing": "all",
        "optimization": true,
        "sourceMap": false,
        "extractLicenses": true
      }
    }
  }
}
```

### 8.6.4 減少 Bundle 大小的實用技巧

```typescript
// 1. Use date-fns instead of moment.js
// moment.js: ~300KB → date-fns: ~3KB per function
import { format, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';

// 2. Use lodash-es with specific imports
// import _ from 'lodash';           // ❌ ~70KB
import { debounce } from 'lodash-es'; // ✅ ~1KB

// 3. Use native APIs when possible
// Instead of lodash cloneDeep:
const clone = structuredClone(original); // Native, zero bundle cost

// Instead of lodash groupBy:
const grouped = Object.groupBy(items, item => item.category); // Native ES2024

// 4. Dynamic imports for heavy libraries
async renderChart(data: number[]): Promise<void> {
  const { Chart, registerables } = await import('chart.js');
  Chart.register(...registerables);
  // Chart.js only loaded when this method is called
}
```

---

## 8.7 圖片優化

### 8.7.1 NgOptimizedImage

Angular 的 `NgOptimizedImage` 指令自動應用圖片最佳實踐：

```typescript
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [NgOptimizedImage],
  template: `
    <!-- Priority image (above the fold): eager loading with preload -->
    <img
      ngSrc="/assets/images/hero-banner.jpg"
      width="1200"
      height="400"
      priority
      alt="商品橫幅"
    />

    <!-- Standard image: lazy loaded by default -->
    <img
      [ngSrc]="product().imageUrl"
      width="300"
      height="300"
      [alt]="product().name"
    />

    <!-- With placeholder (blur-up effect) -->
    <img
      [ngSrc]="product().imageUrl"
      width="300"
      height="300"
      placeholder
      [alt]="product().name"
    />

    <!-- Fill mode (like CSS object-fit: cover) -->
    <div class="image-container" style="position: relative; width: 100%; height: 200px;">
      <img
        [ngSrc]="product().imageUrl"
        fill
        style="object-fit: cover;"
        [alt]="product().name"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<Product>();
}
```

### 8.7.2 NgOptimizedImage 功能

| 屬性 | 用途 | 說明 |
|---|---|---|
| `ngSrc` | 圖片來源 | 取代 `src`，啟用優化 |
| `width` + `height` | 尺寸 | **必填**，防止 Layout Shift |
| `priority` | 優先載入 | 設定 `fetchpriority="high"` + `loading="eager"`，SSR 時自動產生 `<link preload>` |
| `placeholder` | 模糊佔位圖 | 自動產生低解析度佔位圖 |
| `fill` | 填滿模式 | 使圖片填滿父容器，不需指定 width/height |
| `loader` | 圖片載入器 | 自訂 CDN URL 轉換（Cloudflare、Imgix、Cloudinary） |

### 8.7.3 自訂圖片載入器

```typescript
// src/app/core/image-loader.ts
import { ImageLoaderConfig } from '@angular/common';

// Cloudflare Image Resizing
export function cloudflareLoader(config: ImageLoaderConfig): string {
  const width = config.width ? `/w=${config.width}` : '';
  return `https://your-domain.com/cdn-cgi/image${width},quality=80,format=auto/${config.src}`;
}

// Cloudinary
export function cloudinaryLoader(config: ImageLoaderConfig): string {
  const width = config.width ? `w_${config.width},` : '';
  return `https://res.cloudinary.com/your-account/image/upload/${width}q_auto,f_auto/${config.src}`;
}

// Register in app.config.ts:
import { provideImageKitLoader } from '@angular/common';
// Or use the generic provider:
import { IMAGE_LOADER } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: IMAGE_LOADER, useValue: cloudflareLoader },
    // ... other providers
  ],
};
```

### 8.7.4 圖片最佳實踐清單

```
□ 使用 NgOptimizedImage（ngSrc）取代原生 <img src>
□ 首屏（above-the-fold）圖片加上 priority 屬性
□ 所有非 fill 模式的圖片都指定 width 和 height
□ 使用 CDN 提供的圖片最佳化（WebP/AVIF 自動轉換）
□ 設定 srcset（NgOptimizedImage 搭配 loader 自動產生）
□ 使用 placeholder 改善載入體驗
□ 不對 inline base64 圖片使用 NgOptimizedImage（不適用）
```

---

## 8.8 SSR

### 8.8.1 @angular/ssr 設定

```bash
# Add SSR to existing project
ng add @angular/ssr
```

這會產生以下結構：

```
src/
├── app/
│   └── app.config.server.ts    ← Server-specific providers
├── main.ts                      ← Browser bootstrap
└── main.server.ts               ← Server bootstrap
server.ts                        ← Express server entry point
```

### 8.8.2 Server Config

```typescript
// src/app/app.config.server.ts
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRoutesConfig } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRoutesConfig(serverRoutes),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
```

### 8.8.3 Server Routes Configuration

```typescript
// src/app/app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,         // Static HTML at build time
  },
  {
    path: 'products',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'products/:id',
    renderMode: RenderMode.Server,            // Dynamic HTML on each request
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Client,            // Client-only (no SSR)
  },
  {
    path: '**',
    renderMode: RenderMode.Server,            // Default: server-side render
  },
];
```

### 8.8.4 Hydration

Hydration 讓瀏覽器重新使用伺服器渲染的 DOM，而非重新建立：

```typescript
// src/app/app.config.ts
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(
      withEventReplay(),              // Replay user events during hydration
    ),
    // ... other providers
  ],
};
```

**Hydration 流程**：

```
1. Server renders HTML
   └── 瀏覽器收到完整 HTML → 使用者立即看到內容

2. Browser downloads JavaScript
   └── Angular 開始初始化

3. Hydration
   └── Angular 比對伺服器 DOM 與客戶端元件樹
   └── 找到相同結構 → 重新附加事件監聽器（不重建 DOM）
   └── 找到不同 → 重建不同的部分

4. Application is interactive
   └── 使用者可以與完全功能的 Angular 應用互動
```

### 8.8.5 Incremental Hydration

Angular 19+ 支援增量式 Hydration，搭配 `@defer`：

```typescript
// src/app/app.config.ts
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(
      withIncrementalHydration(), // Enable incremental hydration
    ),
  ],
};
```

```typescript
// In component template — @defer blocks hydrate incrementally
@Component({
  template: `
    <header>
      <h1>{{ title() }}</h1>
    </header>

    <!-- This section hydrates only when scrolled into view -->
    @defer (on viewport; hydrate on viewport) {
      <app-product-reviews [productId]="productId()" />
    } @placeholder {
      <div class="reviews-skeleton">載入評論中...</div>
    }

    <!-- This section hydrates on interaction -->
    @defer (on interaction; hydrate on interaction) {
      <app-comment-form />
    } @placeholder {
      <button>撰寫評論</button>
    }
  `,
})
export class ProductPage { }
```

### 8.8.6 Transfer State

SSR 自動透過 Transfer State 將伺服器端的 HTTP 回應傳遞給客戶端：

```typescript
// Angular's HttpClient automatically uses Transfer State when SSR is enabled:
// 1. Server makes HTTP request → response cached in Transfer State
// 2. Transfer State serialized into HTML
// 3. Client reads from Transfer State instead of making duplicate request

// No code changes needed! HttpClient + provideClientHydration() handle it automatically.

// For custom data, use TransferState directly:
import { TransferState, makeStateKey } from '@angular/core';

const DATA_KEY = makeStateKey<Product[]>('productList');

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);

  getProducts(): Observable<Product[]> {
    // Check Transfer State first (client-side only)
    if (isPlatformBrowser(this.platformId)) {
      const cached = this.transferState.get(DATA_KEY, null);
      if (cached) {
        this.transferState.remove(DATA_KEY); // Clean up after use
        return of(cached);
      }
    }

    return this.http.get<Product[]>('/api/products').pipe(
      tap(data => {
        // Save to Transfer State (server-side only)
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(DATA_KEY, data);
        }
      }),
    );
  }
}
```

---

## 8.9 Web Workers

### 8.9.1 何時使用 Web Workers

Web Workers 適用於不需要存取 DOM 的 CPU 密集計算：

```
適用場景：
├── 大資料集排序/篩選
├── 圖片/影像處理
├── CSV/Excel 檔案解析
├── 加密/雜湊計算
├── 複雜數學運算
└── 報表資料彙總

不適用場景：
├── DOM 操作（Workers 無法存取 DOM）
├── Angular 元件邏輯
├── 簡單的 CRUD 操作
└── 已經很快的操作（overhead > benefit）
```

### 8.9.2 建立 Web Worker

```bash
# Generate a web worker
ng generate web-worker core/workers/data-processor
```

```typescript
// src/app/core/workers/data-processor.worker.ts
/// <reference lib="webworker" />

interface ProcessRequest {
  type: 'sort' | 'filter' | 'aggregate';
  data: unknown[];
  options: Record<string, unknown>;
}

interface ProcessResponse {
  type: string;
  result: unknown;
  duration: number;
}

addEventListener('message', (event: MessageEvent<ProcessRequest>) => {
  const startTime = performance.now();
  const { type, data, options } = event.data;

  let result: unknown;

  switch (type) {
    case 'sort':
      result = sortData(data as Record<string, unknown>[], options['key'] as string, options['direction'] as string);
      break;
    case 'filter':
      result = filterData(data, options['predicate'] as string);
      break;
    case 'aggregate':
      result = aggregateData(data as Record<string, number>[], options['groupBy'] as string, options['sumField'] as string);
      break;
  }

  const response: ProcessResponse = {
    type,
    result,
    duration: performance.now() - startTime,
  };

  postMessage(response);
});

function sortData(data: Record<string, unknown>[], key: string, direction: string): Record<string, unknown>[] {
  return [...data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    const compare = String(aVal).localeCompare(String(bVal));
    return direction === 'asc' ? compare : -compare;
  });
}

function filterData(data: unknown[], predicate: string): unknown[] {
  // Simple property matching
  return data.filter(item => JSON.stringify(item).includes(predicate));
}

function aggregateData(
  data: Record<string, number>[],
  groupBy: string,
  sumField: string,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of data) {
    const key = String(item[groupBy]);
    result[key] = (result[key] ?? 0) + (item[sumField] ?? 0);
  }
  return result;
}
```

### 8.9.3 Worker Service Wrapper

```typescript
// src/app/core/services/worker.service.ts
import { Injectable, signal, computed, OnDestroy } from '@angular/core';

export interface WorkerTask<T> {
  result: ReturnType<typeof signal<T | null>>;
  loading: ReturnType<typeof signal<boolean>>;
  error: ReturnType<typeof signal<string | null>>;
}

@Injectable({ providedIn: 'root' })
export class WorkerService implements OnDestroy {
  private worker: Worker | null = null;

  ngOnDestroy(): void {
    this.worker?.terminate();
  }

  processData<TResult>(
    type: string,
    data: unknown[],
    options: Record<string, unknown> = {},
  ): WorkerTask<TResult> {
    const result = signal<TResult | null>(null);
    const loading = signal(true);
    const error = signal<string | null>(null);

    if (typeof Worker !== 'undefined') {
      // Web Workers are supported
      this.worker = new Worker(
        new URL('../workers/data-processor.worker', import.meta.url),
      );

      this.worker.onmessage = (event: MessageEvent) => {
        result.set(event.data.result as TResult);
        loading.set(false);
        console.log(`[Worker] ${type} completed in ${event.data.duration.toFixed(1)}ms`);
      };

      this.worker.onerror = (err: ErrorEvent) => {
        error.set(err.message);
        loading.set(false);
      };

      this.worker.postMessage({ type, data, options });
    } else {
      // Fallback: run on main thread
      error.set('Web Workers are not supported in this browser.');
      loading.set(false);
    }

    return { result, loading, error };
  }
}
```

### 8.9.4 使用 Worker Service

```typescript
@Component({
  selector: 'app-data-analysis',
  template: `
    @if (task.loading()) {
      <mat-spinner />
    }
    @if (task.error(); as err) {
      <div class="error" role="alert">{{ err }}</div>
    }
    @if (task.result(); as data) {
      <app-results-table [data]="data" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataAnalysis {
  private readonly workerService = inject(WorkerService);

  protected readonly task = this.workerService.processData<Record<string, number>>(
    'aggregate',
    this.rawData,
    { groupBy: 'category', sumField: 'amount' },
  );

  private readonly rawData = Array.from({ length: 100_000 }, (_, i) => ({
    category: `cat-${i % 50}`,
    amount: Math.random() * 1000,
  }));
}
```

---

## 8.10 虛擬捲動

### 8.10.1 CdkVirtualScrollViewport

Angular CDK 提供虛擬捲動，只渲染可見區域的元素：

```typescript
// src/app/features/logs/log-viewer.ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

@Component({
  selector: 'app-log-viewer',
  imports: [ScrollingModule],
  template: `
    <div class="log-viewer">
      <div class="toolbar">
        <span>{{ logs().length }} 筆記錄</span>
      </div>

      <!-- Virtual scroll viewport -->
      <cdk-virtual-scroll-viewport
        itemSize="48"
        class="log-viewport"
        [style.height.px]="600">

        <div
          *cdkVirtualFor="let log of logs(); trackBy: trackByLogId"
          class="log-entry"
          [class]="'level-' + log.level">
          <span class="timestamp">{{ log.timestamp }}</span>
          <span class="level-badge">{{ log.level }}</span>
          <span class="message">{{ log.message }}</span>
        </div>

      </cdk-virtual-scroll-viewport>
    </div>
  `,
  styles: `
    .log-viewport {
      height: 600px;
    }
    .log-entry {
      height: 48px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      border-bottom: 1px solid #e0e0e0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogViewer {
  protected readonly logs = signal<LogEntry[]>([]);

  protected trackByLogId(_index: number, log: LogEntry): number {
    return log.id;
  }

  constructor() {
    // Simulate loading 100,000 log entries
    const entries: LogEntry[] = Array.from({ length: 100_000 }, (_, i) => ({
      id: i,
      timestamp: new Date(Date.now() - i * 1000).toISOString(),
      level: (['info', 'warn', 'error'] as const)[i % 3],
      message: `Log message #${i}: Operation ${i % 100 === 0 ? 'failed' : 'succeeded'}`,
    }));
    this.logs.set(entries);
  }
}
```

### 8.10.2 自動調整大小的虛擬捲動

```typescript
@Component({
  selector: 'app-message-list',
  imports: [ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport
      autosize
      class="message-viewport"
      [style.height.vh]="80">

      <div
        *cdkVirtualFor="let msg of messages(); trackBy: trackByMsgId"
        class="message-bubble"
        [class.mine]="msg.fromMe">
        <p>{{ msg.text }}</p>
        <time>{{ msg.timestamp | date:'short' }}</time>
      </div>

    </cdk-virtual-scroll-viewport>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageList {
  protected readonly messages = signal<Message[]>([]);

  protected trackByMsgId(_index: number, msg: Message): string {
    return msg.id;
  }
}
```

### 8.10.3 虛擬捲動 vs 分頁 vs 無限捲動

| 策略 | 適用場景 | DOM 元素數量 | 記憶體使用 |
|---|---|---|---|
| **虛擬捲動** | 10,000+ 項目、固定高度列表 | ~20-50（可見的） | 低 |
| **分頁** | 一般列表、需要 URL 定位 | pageSize（10-50） | 低 |
| **無限捲動** | 社交媒體 feed | 持續增長 | 高（隨捲動增長） |
| **@defer + viewport** | 區塊式內容 | 按需載入 | 中 |

---

## 8.11 執行時效能分析

### 8.11.1 Angular DevTools

Angular DevTools 是 Chrome 擴充功能，提供：

```
Angular DevTools 功能：
├── Component Explorer
│   ├── 查看元件樹
│   ├── 檢視 Signal 值
│   ├── 即時編輯 Signal/Input 值
│   └── 查看 Dependency Injection 圖
│
├── Profiler
│   ├── 錄製變更偵測週期
│   ├── 查看每個元件的檢查時間
│   ├── 找出不必要的重新渲染
│   └── 分析元件樹深度
│
└── Directive Explorer
    ├── 查看元素上的指令
    └── 檢視指令屬性
```

**使用步驟**：
1. 安裝 Chrome 擴充功能「Angular DevTools」
2. 開啟 Chrome DevTools（F12）
3. 選擇「Angular」分頁
4. 使用 Profiler 錄製操作

### 8.11.2 Chrome DevTools Performance

```
Chrome DevTools Performance 分析步驟：
1. 開啟 DevTools → Performance 分頁
2. 點擊 Record（⏺）
3. 執行要分析的操作
4. 停止錄製
5. 分析結果：

關鍵指標：
├── FCP (First Contentful Paint) — 首次內容繪製
├── LCP (Largest Contentful Paint) — 最大內容繪製
├── TBT (Total Blocking Time) — 總阻塞時間
├── CLS (Cumulative Layout Shift) — 累積布局偏移
└── INP (Interaction to Next Paint) — 互動到下一次繪製

常見瓶頸：
├── Long Tasks (> 50ms)
│   └── 解決：拆分為更小的任務、使用 Web Worker
├── Excessive DOM nodes (> 1500)
│   └── 解決：虛擬捲動、@defer、分頁
├── Layout Shifts
│   └── 解決：設定 width/height、使用 NgOptimizedImage
└── JavaScript execution time
    └── 解決：延遲載入、tree-shaking、減少 bundle
```

### 8.11.3 程式化效能量測

```typescript
// Measure component rendering time
import { afterRenderEffect } from '@angular/core';

@Component({ ... })
export class PerformanceAwareComponent {
  constructor() {
    const startTime = performance.now();

    afterRenderEffect(() => {
      const renderTime = performance.now() - startTime;
      if (renderTime > 16) { // > 1 frame at 60fps
        console.warn(`[Performance] Slow render: ${renderTime.toFixed(1)}ms`);
      }
    });
  }
}

// Measure data processing time
function measurePerformance<T>(label: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  console.log(`[Perf] ${label}: ${duration.toFixed(1)}ms`);
  return result;
}

// Usage:
const sorted = measurePerformance('Sort products', () =>
  products.sort((a, b) => a.price - b.price),
);
```

### 8.11.4 Web Vitals 監控

```typescript
// src/app/core/services/web-vitals.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WebVitalsService {
  init(): void {
    // Largest Contentful Paint
    this.observeLCP();

    // Cumulative Layout Shift
    this.observeCLS();

    // Interaction to Next Paint
    this.observeINP();
  }

  private observeLCP(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log(`[LCP] ${lastEntry.startTime.toFixed(0)}ms`);
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }

  private observeCLS(): void {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as PerformanceEntry & { hadRecentInput: boolean }).hadRecentInput) {
          clsValue += (entry as PerformanceEntry & { value: number }).value;
        }
      }
      console.log(`[CLS] ${clsValue.toFixed(4)}`);
    });
    observer.observe({ type: 'layout-shift', buffered: true });
  }

  private observeINP(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`[INP] ${entry.name}: ${entry.duration.toFixed(0)}ms`);
      }
    });
    observer.observe({ type: 'event', buffered: true });
  }
}
```

---

## 8.12 完整範例：Dashboard 效能優化

### 8.12.1 優化前 — 效能問題

```typescript
// ❌ BEFORE: Performance-problematic dashboard
@Component({
  selector: 'app-dashboard',
  // Missing: changeDetection: ChangeDetectionStrategy.OnPush
  template: `
    <h1>Dashboard</h1>

    <!-- Problem 1: All chart components loaded immediately -->
    <app-revenue-chart [data]="revenueData" />
    <app-user-chart [data]="userData" />
    <app-order-chart [data]="orderData" />

    <!-- Problem 2: Rendering all 10,000 rows at once -->
    <table>
      <tr *ngFor="let row of tableData">
        <td>{{ row.name }}</td>
        <td>{{ row.value }}</td>
        <td>{{ formatCurrency(row.amount) }}</td>  <!-- Problem 3: Function call in template -->
      </tr>
    </table>

    <!-- Problem 4: Unoptimized images -->
    <img src="/assets/dashboard-hero.png" />

    <!-- Problem 5: Heavy analytics component always loaded -->
    <app-advanced-analytics [data]="analyticsData" />
  `,
})
export class DashboardPage {
  revenueData: any;
  userData: any;
  orderData: any;
  tableData: any[] = [];
  analyticsData: any;

  // Problem 6: Multiple subscribe calls without cleanup
  ngOnInit(): void {
    this.dataService.getRevenue().subscribe(data => this.revenueData = data);
    this.dataService.getUsers().subscribe(data => this.userData = data);
    this.dataService.getOrders().subscribe(data => this.orderData = data);
    this.dataService.getTableData().subscribe(data => this.tableData = data);
    this.dataService.getAnalytics().subscribe(data => this.analyticsData = data);
  }

  // Problem 3: Called on every change detection cycle
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' }).format(amount);
  }
}
```

**效能問題清單**：

```
問題          | 影響                  | 嚴重度
─────────────┼──────────────────────┼──────
無 OnPush    | 每次事件檢查整棵樹     | 高
無延遲載入    | 初始 bundle 過大       | 高
渲染全部列    | DOM 節點過多、記憶體高   | 高
模板函式呼叫  | 每次 CD 重新計算       | 中
未優化圖片    | LCP 延遲、layout shift | 中
未取消訂閱    | 記憶體洩漏             | 中
```

### 8.12.2 優化後 — 最佳實踐

```typescript
// ✅ AFTER: Optimized dashboard
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { forkJoin } from 'rxjs';
import { DashboardService } from './dashboard.service';

interface RevenueData {
  labels: string[];
  values: number[];
}

interface TableRow {
  id: number;
  name: string;
  value: string;
  amount: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, NgOptimizedImage, ScrollingModule],
  template: `
    <h1>Dashboard</h1>

    <!-- Optimization 1: Hero image with NgOptimizedImage -->
    <img
      ngSrc="/assets/dashboard-hero.png"
      width="1200"
      height="300"
      priority
      alt="Dashboard 總覽"
    />

    <!-- Optimization 2: Charts loaded on idle (not blocking initial render) -->
    @defer (on idle) {
      <app-revenue-chart [data]="revenueData()" />
    } @placeholder {
      <div class="chart-skeleton" style="height: 300px;"></div>
    } @loading (after 200ms; minimum 300ms) {
      <div class="chart-loading"><mat-spinner diameter="32" /></div>
    }

    @defer (on idle) {
      <app-user-chart [data]="userData()" />
    } @placeholder {
      <div class="chart-skeleton" style="height: 300px;"></div>
    }

    @defer (on viewport) {
      <app-order-chart [data]="orderData()" />
    } @placeholder (minimum 200ms) {
      <div class="chart-skeleton" style="height: 300px;">
        <p>捲動以載入訂單圖表...</p>
      </div>
    }

    <!-- Optimization 3: Virtual scrolling for large table -->
    <div class="data-table-container">
      <h2>交易記錄（{{ tableData().length }} 筆）</h2>

      <cdk-virtual-scroll-viewport
        itemSize="48"
        class="table-viewport"
        [style.height.px]="480">
        <table>
          <thead>
            <tr>
              <th>名稱</th>
              <th>值</th>
              <th>金額</th>
            </tr>
          </thead>
          <tbody>
            <tr *cdkVirtualFor="let row of tableData(); trackBy: trackByRowId">
              <td>{{ row.name }}</td>
              <td>{{ row.value }}</td>
              <!-- Optimization 4: Use CurrencyPipe instead of function call -->
              <td>{{ row.amount | currency:'TWD':'symbol':'1.0-0' }}</td>
            </tr>
          </tbody>
        </table>
      </cdk-virtual-scroll-viewport>
    </div>

    <!-- Optimization 5: Heavy analytics loaded only on user demand -->
    @defer (on interaction; prefetch on idle) {
      <app-advanced-analytics [data]="analyticsData()" />
    } @placeholder {
      <button class="load-analytics-btn">
        載入進階分析
      </button>
    } @loading (after 100ms; minimum 500ms) {
      <div class="analytics-loading">
        <mat-spinner diameter="24" />
        <p>正在載入進階分析模組...</p>
      </div>
    } @error {
      <div class="analytics-error" role="alert">
        分析模組載入失敗，請重試。
      </div>
    }
  `,
  styles: `
    .table-viewport {
      height: 480px;
    }
    .chart-skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 8px;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,  // Optimization 6: OnPush
})
export class DashboardPage {
  private readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);

  // Optimization 7: Signal-based state
  protected readonly revenueData = signal<RevenueData | null>(null);
  protected readonly userData = signal<unknown>(null);
  protected readonly orderData = signal<unknown>(null);
  protected readonly tableData = signal<TableRow[]>([]);
  protected readonly analyticsData = signal<unknown>(null);

  protected trackByRowId(_index: number, row: TableRow): number {
    return row.id;
  }

  constructor() {
    // Optimization 8: Parallel data loading with cleanup
    forkJoin({
      revenue: this.dashboardService.getRevenue(),
      users: this.dashboardService.getUsers(),
      orders: this.dashboardService.getOrders(),
      table: this.dashboardService.getTableData(),
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(({ revenue, users, orders, table }) => {
      this.revenueData.set(revenue);
      this.userData.set(users);
      this.orderData.set(orders);
      this.tableData.set(table);
    });

    // Analytics loaded separately (lazy, lower priority)
    this.dashboardService.getAnalytics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.analyticsData.set(data));
  }
}
```

### 8.12.3 優化成果對照

```
指標              | 優化前    | 優化後     | 改善
─────────────────┼──────────┼───────────┼──────
Initial Bundle   | 850 KB   | 320 KB    | -62%
FCP              | 2.8s     | 0.9s      | -68%
LCP              | 4.2s     | 1.4s      | -67%
TBT              | 1200ms   | 150ms     | -87%
CLS              | 0.25     | 0.02      | -92%
DOM Nodes        | 12,000+  | ~200      | -98%
Memory           | 180 MB   | 45 MB     | -75%
Change Detection | 500 元件  | 3-5 元件   | -99%
```

---

## 8.13 常見陷阱

### 陷阱 1：忘記 OnPush

```typescript
// ❌ Bad — Default change detection, checks everything on every event
@Component({
  selector: 'app-item',
  template: `<div>{{ name }}</div>`,
  // Missing changeDetection!
})
export class ItemComponent {
  @Input() name = '';
}

// ✅ Good — OnPush only checks when inputs change or signals update
@Component({
  selector: 'app-item',
  template: `<div>{{ name() }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Item {
  readonly name = input.required<string>();
}
```

### 陷阱 2：模板中呼叫函式

```typescript
// ❌ Bad — function called on every change detection cycle
template: `
  <p>{{ calculateTotal() }}</p>
  <p>{{ formatDate(item.date) }}</p>
  <div [class]="getClasses()"></div>
`

// ✅ Good — use computed() or pipes
template: `
  <p>{{ total() }}</p>
  <p>{{ item.date | date:'yyyy-MM-dd' }}</p>
  <div [class]="classes()"></div>
`

// In component:
protected readonly total = computed(() =>
  this.items().reduce((sum, i) => sum + i.price, 0),
);

protected readonly classes = computed(() => ({
  active: this.isActive(),
  highlighted: this.isHighlighted(),
}));
```

### 陷阱 3：@defer 用於首屏內容

```typescript
// ❌ Bad — hero content should NOT be deferred
@defer (on idle) {
  <h1>歡迎來到我們的網站</h1>  <!-- This is above-the-fold! -->
  <app-hero-banner />
}

// ✅ Good — defer only below-the-fold or secondary content
<h1>歡迎來到我們的網站</h1>
<app-hero-banner />

@defer (on viewport) {
  <app-testimonials />  <!-- Below the fold, ok to defer -->
}
```

### 陷阱 4：@for 使用不穩定的 track

```typescript
// ❌ Bad — Math.random() creates new value every time
@for (item of items(); track Math.random()) {
  <app-card [item]="item" />
}

// ❌ Bad — object creates new reference every update
@for (item of items(); track { id: item.id }) {
  <app-card [item]="item" />
}

// ✅ Good — stable unique identifier
@for (item of items(); track item.id) {
  <app-card [item]="item" />
}
```

### 陷阱 5：過度使用 @defer

```typescript
// ❌ Bad — deferring tiny components adds overhead without benefit
@defer (on viewport) {
  <span class="badge">{{ count() }}</span>  <!-- Too small to benefit from deferring -->
}

// ✅ Good — defer heavy components with significant JS bundles
@defer (on viewport) {
  <app-data-visualization [dataset]="largeDataset()" />  <!-- Chart.js + D3.js bundle -->
}
```

### 陷阱 6：SSR 中使用瀏覽器 API

```typescript
// ❌ Bad — window/document don't exist on the server
ngOnInit(): void {
  const width = window.innerWidth;  // ReferenceError on server!
  localStorage.setItem('key', 'value');
}

// ✅ Good — check platform before using browser APIs
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

private readonly platformId = inject(PLATFORM_ID);

ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    const width = window.innerWidth;
    localStorage.setItem('key', 'value');
  }
}

// ✅ Also good — use afterNextRender() for one-time browser-only init
import { afterNextRender } from '@angular/core';

constructor() {
  afterNextRender(() => {
    // This only runs in the browser, after the first render
    this.initChart();
  });
}
```

### 陷阱 7：NgOptimizedImage 未設定尺寸

```html
<!-- ❌ Bad — causes CLS (Cumulative Layout Shift) -->
<img ngSrc="/photo.jpg" alt="Photo" />
<!-- Error: NgOptimizedImage requires width and height or fill -->

<!-- ✅ Good — explicit dimensions prevent layout shift -->
<img ngSrc="/photo.jpg" width="600" height="400" alt="Photo" />

<!-- ✅ Also good — fill mode for responsive containers -->
<div style="position: relative; width: 100%; aspect-ratio: 16/9;">
  <img ngSrc="/photo.jpg" fill alt="Photo" />
</div>
```

### 陷阱 8：不分析 Bundle 就部署

```bash
# ❌ Bad — deploy without knowing bundle composition
ng build --configuration production
# Deploy immediately without checking sizes

# ✅ Good — analyze before deploying
ng build --configuration production --stats-json
npx source-map-explorer dist/my-app/browser/main*.js

# Check if bundle meets budget:
# - Initial bundle < 500KB
# - Any single lazy chunk < 300KB
# - Total < 2MB
```

---

## 本章重點回顧

| 概念 | .NET 對應 | Angular 19+ |
|---|---|---|
| 變更偵測 | Blazor diffing | Default / OnPush / Zoneless |
| 精準更新 | `INotifyPropertyChanged` | Signals + OnPush |
| 延遲載入 | `Lazy<T>` | `@defer` / `loadComponent` |
| 虛擬捲動 | `Virtualize<T>` | `CdkVirtualScrollViewport` |
| 圖片優化 | 無內建 | `NgOptimizedImage` |
| SSR | Blazor Prerendering | `@angular/ssr` + Hydration |
| 背景計算 | `Task.Run()` | Web Workers |
| Bundle 分析 | ILLinker / Trimming | source-map-explorer |
| 效能監控 | Application Insights | Angular DevTools + Web Vitals |

**效能優化檢查清單**：

```
□ 所有元件使用 ChangeDetectionStrategy.OnPush
□ 使用 Signals 管理狀態（非可變物件）
□ 首屏以下的重型元件使用 @defer
□ @for 使用穩定的 track 表達式
□ 路由層級使用 loadComponent / loadChildren
□ 圖片使用 NgOptimizedImage（首屏加 priority）
□ 大量列表使用 CdkVirtualScrollViewport
□ 模板中不直接呼叫函式（使用 computed / pipe）
□ 生產建置設定 Budget 門檻
□ 部署前執行 Bundle 分析
□ 評估是否適合啟用 Zoneless
□ 考慮啟用 SSR 改善首次載入效能
```

---

## 延伸資源

- [Angular Zoneless Guide](https://angular.dev/guide/zoneless)
- [Deferred Loading with @defer](https://angular.dev/guide/templates/defer)
- [NgOptimizedImage](https://angular.dev/guide/image-optimization)
- [Angular SSR Guide](https://angular.dev/guide/ssr)
- [Angular Hydration](https://angular.dev/guide/hydration)
- [CDK Scrolling](https://material.angular.dev/cdk/scrolling)
