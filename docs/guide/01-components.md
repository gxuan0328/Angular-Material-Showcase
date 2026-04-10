# 第一章：元件 (Components)

> **目標讀者**：熟悉 .NET/C# 的後端工程師，首次接觸 Angular 19+ 前端框架。
> 本章涵蓋元件宣告、生命週期、Signal API、模板語法、元件通訊、架構模式與完整範例。

---

## 目錄

1. [元件宣告與裝飾器](#1-元件宣告與裝飾器)
2. [生命週期鉤子](#2-生命週期鉤子)
3. [Signal 元件 API](#3-signal-元件-api)
4. [模板語法](#4-模板語法)
5. [元件通訊模式](#5-元件通訊模式)
6. [Smart vs Presentational 模式](#6-smart-vs-presentational-模式)
7. [Standalone 遷移路徑](#7-standalone-遷移路徑)
8. [完整範例：UserProfileCard](#8-完整範例userprofilecard)
9. [常見陷阱](#9-常見陷阱)

---

## 1. 元件宣告與裝飾器

### 1.1 什麼是元件？

在 Angular 中，**元件 (Component)** 是 UI 的基本建構單元，概念上類似於 .NET Blazor 的 `@code` 區塊加上 Razor 模板。每個元件由三部分組成：

- **TypeScript 類別**：處理邏輯（類似 C# 的 ViewModel）
- **HTML 模板**：定義視圖（類似 Razor / XAML）
- **CSS 樣式**：元件範圍的樣式封裝

### 1.2 @Component 裝飾器

`@Component` 裝飾器是 Angular 元件的核心宣告方式，類似 C# 的 `[Attribute]`。以下逐一說明所有屬性。

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  // --- 必要屬性 ---
  selector: 'app-user-card',
  template: `<h1>Hello, {{ name() }}</h1>`,

  // --- 選用屬性 ---
  imports: [CommonModule, MatButtonModule],
  styles: `h1 { color: blue; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  host: {
    '[class.active]': 'isActive()',
    '(click)': 'handleClick()',
    'role': 'article',
  },
  providers: [UserService],
  animations: [fadeInAnimation],
})
export class UserCard {
  // component logic...
}
```

### 1.3 裝飾器屬性完整參考

#### `selector`

| 屬性 | 說明 |
|------|------|
| **型別** | `string` |
| **預設值** | 無（必填） |
| **描述** | CSS 選擇器，定義元件在 HTML 模板中的標籤名稱 |

```typescript
// Element selector (most common)
selector: 'app-user-card'
// Usage: <app-user-card></app-user-card>

// Attribute selector
selector: '[appTooltip]'
// Usage: <div appTooltip></div>

// Class selector (rarely used)
selector: '.app-widget'
// Usage: <div class="app-widget"></div>
```

> **C# 對照**：類似 Blazor 的 `@page "/user-card"` 路由標籤，但 `selector` 是 CSS 選擇器而非 URL。

**命名慣例**：
- 使用應用程式前綴（如 `app-`、`ngm-`）避免與原生 HTML 或第三方元件衝突
- 使用 kebab-case（短橫線命名）：`app-user-card`，不是 `appUserCard`

---

#### `imports`

| 屬性 | 說明 |
|------|------|
| **型別** | `Array<Type \| ModuleWithProviders>` |
| **預設值** | `[]` |
| **描述** | 宣告此元件需要使用的其他元件、指令、管線 (Pipes) |

```typescript
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserAvatar } from './user-avatar';

@Component({
  selector: 'app-user-card',
  imports: [
    // Angular built-in pipes
    DatePipe,

    // Angular Material modules
    MatButtonModule,
    MatIconModule,

    // Custom components
    UserAvatar,
  ],
  template: `
    <app-user-avatar [src]="avatarUrl()" />
    <span>{{ createdAt() | date:'yyyy-MM-dd' }}</span>
    <button mat-raised-button>
      <mat-icon>edit</mat-icon>
      Edit
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCard {}
```

> **C# 對照**：類似 C# 的 `using` 語句，但作用範圍限於此元件的模板。

---

#### `template` / `templateUrl`

| 屬性 | 說明 |
|------|------|
| **型別** | `string` |
| **預設值** | 無（二選一必填） |
| **描述** | 元件的 HTML 模板內容，或外部模板檔案路徑 |

```typescript
// Inline template — suitable for small components (< 20 lines)
@Component({
  selector: 'app-greeting',
  template: `
    <h1>Hello, {{ name() }}</h1>
    <p>Welcome to Angular!</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Greeting {}

// External template — suitable for complex components
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {}
```

**選擇指引**：

| 場景 | 建議 |
|------|------|
| 模板 < 20 行 | 使用 `template`（行內） |
| 模板 ≥ 20 行 | 使用 `templateUrl`（外部檔案） |
| 需要 IDE HTML 語法高亮 | 使用 `templateUrl` |

---

#### `styles` / `styleUrl` / `styleUrls`

| 屬性 | 說明 |
|------|------|
| **型別** | `string` / `string` / `string[]` |
| **預設值** | `[]` |
| **描述** | 元件範圍的 CSS 樣式 |

```typescript
// Inline styles
@Component({
  selector: 'app-badge',
  template: `<span class="badge">{{ label() }}</span>`,
  styles: `
    .badge {
      padding: 4px 8px;
      border-radius: 12px;
      background: #e0e0e0;
      font-size: 12px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {}

// External stylesheet (singular — Angular 19+ preferred)
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {}

// Multiple external stylesheets
@Component({
  selector: 'app-theme-page',
  templateUrl: './theme-page.html',
  styleUrls: ['./theme-page.css', './theme-page-overrides.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePage {}
```

> **C# 對照**：類似 Blazor 的 `::deep` CSS 隔離，但 Angular 預設就提供元件級樣式封裝。

---

#### `changeDetection`

| 屬性 | 說明 |
|------|------|
| **型別** | `ChangeDetectionStrategy` |
| **預設值** | `ChangeDetectionStrategy.Default` |
| **描述** | 變更偵測策略 |

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';

// ✅ Always use OnPush — mandatory in modern Angular
@Component({
  selector: 'app-user-list',
  template: `
    @for (user of users(); track user.id) {
      <app-user-card [user]="user" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {}
```

**兩種策略的比較**：

| 策略 | 觸發條件 | 效能 | 建議 |
|------|---------|------|------|
| `Default` | 任何事件都觸發整棵元件樹的變更偵測 | 較差 | 不建議使用 |
| `OnPush` | 僅在 Input 參考改變、Signal 更新、事件發生時觸發 | 優秀 | **永遠使用** |

> **C# 對照**：`OnPush` 類似 WPF 的 `INotifyPropertyChanged` — 只有當資料真正改變時才更新 UI。`Default` 則像是每次都重新渲染整個頁面。

---

#### `encapsulation`

| 屬性 | 說明 |
|------|------|
| **型別** | `ViewEncapsulation` |
| **預設值** | `ViewEncapsulation.Emulated` |
| **描述** | 控制 CSS 樣式的封裝方式 |

```typescript
import { ViewEncapsulation, Component, ChangeDetectionStrategy } from '@angular/core';

// Emulated (default) — Angular generates unique attributes to scope styles
@Component({
  selector: 'app-card',
  template: `<div class="card">Content</div>`,
  styles: `.card { border: 1px solid #ccc; }`,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardEmulated {}

// ShadowDom — uses native Shadow DOM (true encapsulation)
@Component({
  selector: 'app-card-shadow',
  template: `<div class="card">Content</div>`,
  styles: `.card { border: 1px solid #ccc; }`,
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardShadow {}

// None — no encapsulation, styles are global
@Component({
  selector: 'app-card-global',
  template: `<div class="card">Content</div>`,
  styles: `.card { border: 1px solid #ccc; }`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardGlobal {}
```

| 模式 | 實作方式 | 優點 | 缺點 |
|------|---------|------|------|
| `Emulated` | Angular 產生 `_ngcontent-xxx` 屬性 | 跨瀏覽器相容 | 不是真正的隔離 |
| `ShadowDom` | 原生 Shadow DOM | 真正的樣式隔離 | 舊瀏覽器不支援 |
| `None` | 無封裝，樣式全域化 | 方便全域覆蓋 | 容易造成樣式衝突 |

---

#### `host`

| 屬性 | 說明 |
|------|------|
| **型別** | `{ [key: string]: string }` |
| **預設值** | `{}` |
| **描述** | 在宿主元素上繫結屬性、事件、CSS 類別 |

```typescript
@Component({
  selector: 'app-expandable-panel',
  template: `
    <div class="header" (click)="toggle()">
      <ng-content select="[panel-title]" />
    </div>
    @if (isExpanded()) {
      <div class="body">
        <ng-content />
      </div>
    }
  `,
  host: {
    // Static attribute
    'role': 'region',

    // Dynamic attribute binding
    '[attr.aria-expanded]': 'isExpanded()',

    // CSS class binding
    '[class.expanded]': 'isExpanded()',
    '[class.collapsed]': '!isExpanded()',

    // Style binding
    '[style.border-color]': 'isExpanded() ? "blue" : "gray"',

    // Event binding
    '(keydown.enter)': 'toggle()',
    '(keydown.space)': 'toggle()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandablePanel {
  protected readonly isExpanded = signal(false);

  protected toggle(): void {
    this.isExpanded.update(v => !v);
  }
}
```

> **重要**：Angular 19+ 中，永遠使用 `host` 物件。`@HostBinding` 和 `@HostListener` 裝飾器已棄用。

> **C# 對照**：類似 WPF 的 `Style.Triggers`，根據狀態動態改變宿主元素的外觀與行為。

---

#### `providers`

| 屬性 | 說明 |
|------|------|
| **型別** | `Provider[]` |
| **預設值** | `[]` |
| **描述** | 為此元件及其子元件建立專屬的服務實例 |

```typescript
// Service definition
@Injectable()
export class FormState {
  private readonly fields = signal<Record<string, string>>({});

  setValue(key: string, value: string): void {
    this.fields.update(f => ({ ...f, [key]: value }));
  }

  getValue(key: string): string {
    return this.fields()[key] ?? '';
  }
}

// Component with scoped provider
@Component({
  selector: 'app-user-form',
  template: `<!-- form fields -->`,
  providers: [FormState], // Each <app-user-form> gets its own FormState instance
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserForm {
  private readonly formState = inject(FormState);
}
```

> **C# 對照**：類似 .NET DI 的 `AddScoped<T>()`，每個元件實例獲得獨立的服務實例。全域的 `providedIn: 'root'` 則類似 `AddSingleton<T>()`。

---

#### `animations`

| 屬性 | 說明 |
|------|------|
| **型別** | `AnimationTriggerMetadata[]` |
| **預設值** | `[]` |
| **描述** | 定義元件的動畫觸發器 |

```typescript
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

const fadeAnimation = trigger('fade', [
  state('void', style({ opacity: 0 })),
  transition(':enter', [animate('300ms ease-in')]),
  transition(':leave', [animate('300ms ease-out')]),
]);

@Component({
  selector: 'app-notification',
  template: `
    @if (visible()) {
      <div @fade class="notification">
        {{ message() }}
      </div>
    }
  `,
  animations: [fadeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notification {
  readonly visible = input(false);
  readonly message = input('');
}
```

---

### 1.4 最小元件範例

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: `<p>Hello, Angular!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hello {}
```

> **注意**：Angular 19+ 中，`standalone: true` 是預設值，不需要也不應該明確設定。

---

## 2. 生命週期鉤子

### 2.1 概觀

Angular 元件有明確定義的生命週期，框架會在特定時間點呼叫對應的鉤子方法。

> **C# 對照**：類似 ASP.NET Core Middleware 的管線（Request → Middleware 1 → Middleware 2 → Response），但這裡是元件的建立 → 更新 → 銷毀流程。

### 2.2 執行順序圖

```
元件建立
  │
  ├── constructor()              ← 依賴注入發生在此
  │
  ├── ngOnChanges()              ← 首次 + 每次 Input 變更
  │     ↓
  ├── ngOnInit()                 ← 僅執行一次
  │     ↓
  ├── ngDoCheck()                ← 每次變更偵測週期
  │     ↓
  ├── ngAfterContentInit()       ← 僅執行一次（<ng-content> 投射完成）
  │     ↓
  ├── ngAfterContentChecked()    ← 每次變更偵測週期
  │     ↓
  ├── ngAfterViewInit()          ← 僅執行一次（子視圖初始化完成）
  │     ↓
  ├── ngAfterViewChecked()       ← 每次變更偵測週期
  │
  │   ... 元件持續運作 ...
  │   （ngOnChanges → ngDoCheck → ngAfterContentChecked → ngAfterViewChecked 重複）
  │
  └── ngOnDestroy()              ← 元件即將被銷毀
```

### 2.3 各鉤子詳解

#### `ngOnChanges(changes: SimpleChanges)`

**觸發時機**：當任何以 `@Input` 裝飾器或 `input()` 信號函式宣告的輸入屬性值改變時呼叫。在 `ngOnInit()` 之前首次呼叫。

**使用場景**：需要根據多個 Input 的變化做出反應。

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  input,
} from '@angular/core';

@Component({
  selector: 'app-price-display',
  template: `<span>{{ formattedPrice }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceDisplay implements OnChanges {
  readonly amount = input.required<number>();
  readonly currency = input<string>('USD');

  protected formattedPrice = '';

  ngOnChanges(changes: SimpleChanges): void {
    // SimpleChanges contains entries for each changed input
    if (changes['amount'] || changes['currency']) {
      this.formattedPrice = new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: this.currency(),
      }).format(this.amount());
    }

    // Access previous and current values
    if (changes['amount']) {
      const prev = changes['amount'].previousValue as number;
      const curr = changes['amount'].currentValue as number;
      console.log(`Price changed: ${prev} → ${curr}`);
    }
  }
}
```

> **建議**：在 Angular 19+ 中，多數 `ngOnChanges` 的使用場景可以用 `computed()` 或 `effect()` 取代。上述範例可改寫為：

```typescript
@Component({
  selector: 'app-price-display',
  template: `<span>{{ formattedPrice() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceDisplay {
  readonly amount = input.required<number>();
  readonly currency = input<string>('USD');

  // computed() automatically reacts to input signal changes
  protected readonly formattedPrice = computed(() =>
    new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: this.currency(),
    }).format(this.amount())
  );
}
```

---

#### `ngOnInit()`

**觸發時機**：在第一次 `ngOnChanges()` 之後執行一次。

**使用場景**：初始化邏輯、取得初始資料、設定 subscription。

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-user-list',
  template: `
    @if (loading()) {
      <p>Loading...</p>
    } @else {
      @for (user of users(); track user.id) {
        <div>{{ user.name }}</div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList implements OnInit {
  private readonly userService = inject(UserService);

  protected readonly users = signal<User[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    // Fetch data on initialization
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
```

> **C# 對照**：類似 ASP.NET Core Controller 的建構函式，但 `ngOnInit` 保證 Input 已經繫結完成。建構函式中 Input 的值尚未設定。

> **Angular 19+ 替代方案**：使用 `resource()` 或 `rxResource()` 可完全取代 `ngOnInit` + 手動 subscribe 的模式：

```typescript
@Component({
  selector: 'app-user-list',
  template: `
    @if (usersResource.isLoading()) {
      <p>Loading...</p>
    } @else {
      @for (user of usersResource.value() ?? []; track user.id) {
        <div>{{ user.name }}</div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  private readonly userService = inject(UserService);

  protected readonly usersResource = rxResource({
    loader: () => this.userService.getAll(),
  });
}
```

---

#### `ngDoCheck()`

**觸發時機**：每次變更偵測週期。

**使用場景**：自訂變更偵測邏輯（極少使用）。

```typescript
@Component({
  selector: 'app-deep-check',
  template: `<p>{{ displayValue }}</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeepCheck implements DoCheck {
  readonly data = input<Record<string, unknown>>({});

  protected displayValue = '';
  private previousJson = '';

  ngDoCheck(): void {
    // Deep comparison (expensive — use sparingly)
    const currentJson = JSON.stringify(this.data());
    if (currentJson !== this.previousJson) {
      this.previousJson = currentJson;
      this.displayValue = `Updated at ${new Date().toISOString()}`;
    }
  }
}
```

> **警告**：`ngDoCheck` 在每次變更偵測週期都會被呼叫，務必保持內部邏輯輕量。在 OnPush 元件中通常不需要使用。

---

#### `ngAfterContentInit()` / `ngAfterContentChecked()`

**觸發時機**：
- `ngAfterContentInit`：`<ng-content>` 投射內容初始化完成後（僅一次）
- `ngAfterContentChecked`：每次投射內容檢查後

**使用場景**：存取透過 `<ng-content>` 投射進來的子元件。

```typescript
@Component({
  selector: 'app-tab-group',
  template: `
    <div class="tab-headers">
      @for (tab of tabs(); track tab; let i = $index) {
        <button
          [class.active]="activeIndex() === i"
          (click)="activeIndex.set(i)">
          Tab {{ i + 1 }}
        </button>
      }
    </div>
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabGroup implements AfterContentInit {
  // Query projected <app-tab> children
  readonly tabs = contentChildren(Tab);
  protected readonly activeIndex = signal(0);

  ngAfterContentInit(): void {
    // tabs() is now available
    console.log(`Found ${this.tabs().length} tabs`);
  }
}
```

> **Angular 19+ 建議**：使用 `contentChildren()` 信號查詢取代 `@ContentChildren`，其值在 `ngAfterContentInit` 之後才可用。

---

#### `ngAfterViewInit()` / `ngAfterViewChecked()`

**觸發時機**：
- `ngAfterViewInit`：元件的視圖和子視圖初始化完成後（僅一次）
- `ngAfterViewChecked`：每次視圖檢查後

**使用場景**：存取子元件實例、操作 DOM。

```typescript
@Component({
  selector: 'app-chart-container',
  template: `<canvas #chartCanvas></canvas>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartContainer implements AfterViewInit, OnDestroy {
  readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    // DOM element is now available
    const ctx = this.canvasRef().nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: { /* ... */ },
      });
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
```

> **Angular 19+ 替代方案**：對於 DOM 操作，建議使用 `afterRenderEffect()` 取代 `ngAfterViewInit`：

```typescript
@Component({
  selector: 'app-chart-container',
  template: `<canvas #chartCanvas></canvas>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartContainer {
  readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart: Chart | null = null;

  constructor() {
    // afterRenderEffect runs after each render when dependencies change
    afterRenderEffect(() => {
      const ctx = this.canvasRef().nativeElement.getContext('2d');
      if (ctx && !this.chart) {
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: { /* ... */ },
        });
      }
    });
  }
}
```

---

#### `ngOnDestroy()`

**觸發時機**：元件即將被銷毀時。

**使用場景**：清理 subscription、timer、事件監聽器。

```typescript
@Component({
  selector: 'app-live-clock',
  template: `<span>{{ time() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveClock implements OnDestroy {
  protected readonly time = signal(new Date().toLocaleTimeString());
  private readonly intervalId: ReturnType<typeof setInterval>;

  constructor() {
    this.intervalId = setInterval(() => {
      this.time.set(new Date().toLocaleTimeString());
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
```

> **Angular 19+ 替代方案**：使用 `DestroyRef` 進行清理更為優雅：

```typescript
@Component({
  selector: 'app-live-clock',
  template: `<span>{{ time() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveClock {
  protected readonly time = signal(new Date().toLocaleTimeString());

  constructor() {
    const destroyRef = inject(DestroyRef);

    const intervalId = setInterval(() => {
      this.time.set(new Date().toLocaleTimeString());
    }, 1000);

    // Automatically clean up when component is destroyed
    destroyRef.onDestroy(() => clearInterval(intervalId));
  }
}
```

### 2.4 生命週期鉤子決策表

| 需求 | 傳統鉤子 | Angular 19+ 替代方案 |
|------|---------|-------------------|
| 初始資料載入 | `ngOnInit` | `resource()` / `rxResource()` |
| 回應 Input 變更 | `ngOnChanges` | `computed()` / `effect()` |
| 自訂變更偵測 | `ngDoCheck` | Signal 自動追蹤 |
| 投射內容就緒 | `ngAfterContentInit` | `contentChildren()` signal 查詢 |
| 視圖 DOM 就緒 | `ngAfterViewInit` | `afterRenderEffect()` |
| 資源清理 | `ngOnDestroy` | `DestroyRef.onDestroy()` |

---

## 3. Signal 元件 API

### 3.1 概觀

Angular 19+ 引入了基於 Signal 的元件 API，取代傳統的裝飾器寫法。Signal 是一種反應式原語，類似 .NET MAUI 的 `ObservableProperty` 或 WPF 的 `DependencyProperty`。

### 3.2 `input()` — 接收父元件資料

```typescript
import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-greeting',
  template: `<h1>Hello, {{ name() }}!</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Greeting {
  // Optional input with default value
  readonly name = input<string>('World');
}
```

**函式簽名**：
```typescript
// Optional input
function input<T>(initialValue: T, opts?: InputOptions<T>): InputSignal<T>;

// Optional input (no initial value)
function input<T>(opts?: InputOptions<T>): InputSignal<T | undefined>;
```

**使用方式**：
```html
<!-- Parent template -->
<app-greeting name="Alice" />
<app-greeting [name]="userName()" />
<app-greeting /> <!-- uses default "World" -->
```

**與裝飾器比較**：
```typescript
// ❌ Legacy decorator-based (Angular 18 and before)
@Input() name: string = 'World';
// Template access: {{ name }}

// ✅ Signal-based (Angular 19+)
readonly name = input<string>('World');
// Template access: {{ name() }}  ← note the parentheses
```

**InputOptions**：
```typescript
interface InputOptions<T> {
  alias?: string;       // Alternative binding name in parent template
  transform?: (v: unknown) => T; // Transform the input value
}

// Example with transform
readonly count = input(0, {
  transform: numberAttribute, // Converts string attribute to number
});

// Example with alias
readonly label = input('', {
  alias: 'buttonLabel', // <app-button buttonLabel="Click me" />
});
```

---

### 3.3 `input.required()` — 必填輸入

```typescript
@Component({
  selector: 'app-user-badge',
  template: `
    <div class="badge" [class]="variant()">
      {{ username() }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBadge {
  // Required — parent MUST provide this value
  readonly username = input.required<string>();

  // Required with transform
  readonly variant = input.required<'primary' | 'secondary'>({
    alias: 'badgeVariant',
  });
}
```

```html
<!-- ✅ Valid -->
<app-user-badge username="alice" badgeVariant="primary" />

<!-- ❌ Compile error — missing required input -->
<app-user-badge />
```

> **C# 對照**：`input.required()` 類似 C# 的 `required` 屬性修飾詞（C# 11），編譯時強制要求提供值。

---

### 3.4 `output()` — 發送事件到父元件

```typescript
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <button (click)="decrement()">-</button>
    <span>{{ value() }}</span>
    <button (click)="increment()">+</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Counter {
  readonly value = input(0);
  readonly valueChange = output<number>();

  protected increment(): void {
    this.valueChange.emit(this.value() + 1);
  }

  protected decrement(): void {
    this.valueChange.emit(this.value() - 1);
  }
}
```

**函式簽名**：
```typescript
function output<T>(opts?: OutputOptions): OutputEmitterRef<T>;

interface OutputOptions {
  alias?: string;
}
```

**與裝飾器比較**：
```typescript
// ❌ Legacy
@Output() valueChange = new EventEmitter<number>();

// ✅ Signal-based
readonly valueChange = output<number>();
```

> **C# 對照**：`output()` 類似 C# 的 `event EventHandler<T>`，父元件訂閱子元件發出的事件。

---

### 3.5 `model()` — 雙向繫結

```typescript
import { Component, ChangeDetectionStrategy, model } from '@angular/core';

@Component({
  selector: 'app-rating',
  template: `
    @for (star of stars; track star) {
      <button
        (click)="value.set(star)"
        [class.filled]="star <= value()">
        ★
      </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Rating {
  // Two-way bindable signal
  readonly value = model(0);

  protected readonly stars = [1, 2, 3, 4, 5];
}
```

**父元件使用方式**：
```html
<!-- Two-way binding with banana-in-a-box syntax -->
<app-rating [(value)]="userRating" />

<!-- Equivalent to: -->
<app-rating [value]="userRating()" (valueChange)="userRating.set($event)" />
```

**函式簽名**：
```typescript
function model<T>(initialValue: T): ModelSignal<T>;
function model.required<T>(): ModelSignal<T>;
```

> **C# 對照**：`model()` 類似 WPF/MAUI 的 `TwoWay` 繫結模式，子元件和父元件共享同一個值的讀寫權。

---

### 3.6 `computed()` — 衍生狀態

```typescript
import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-cart-summary',
  template: `
    <div>Items: {{ itemCount() }}</div>
    <div>Subtotal: {{ subtotal() | currency:'TWD' }}</div>
    <div>Tax (5%): {{ tax() | currency:'TWD' }}</div>
    <div>Total: {{ total() | currency:'TWD' }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummary {
  readonly items = input<CartItem[]>([]);

  // Derived values — automatically recalculate when items() changes
  protected readonly itemCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  protected readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  protected readonly tax = computed(() => this.subtotal() * 0.05);

  protected readonly total = computed(() => this.subtotal() + this.tax());
}
```

**特性**：
- **惰性求值**：只有在被讀取時才計算
- **快取**：結果被快取，只有依賴的 signal 改變時才重新計算
- **唯讀**：無法直接 `.set()` 或 `.update()`

> **C# 對照**：`computed()` 類似 C# LINQ 的延遲執行加上自動記憶化。就像 `Lazy<T>` 但會在依賴改變時自動重新計算。

---

### 3.7 `effect()` — 副作用

```typescript
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  effect,
} from '@angular/core';

@Component({
  selector: 'app-theme-switcher',
  template: `
    <button (click)="toggleTheme()">
      {{ isDark() ? 'Light Mode' : 'Dark Mode' }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcher {
  protected readonly isDark = signal(false);

  constructor() {
    // Restore theme from localStorage
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.isDark.set(true);
    }

    // Persist theme changes to localStorage
    effect(() => {
      const theme = this.isDark() ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    });
  }

  protected toggleTheme(): void {
    this.isDark.update(v => !v);
  }
}
```

**何時使用 `effect()`**：
- 同步 localStorage / sessionStorage
- 更新第三方 DOM 函式庫（如圖表）
- 日誌記錄 / 遙測
- 觸發瀏覽器 API（如 `document.title`）

**何時不該使用 `effect()`**：
- 衍生狀態 → 用 `computed()`
- 可寫的衍生狀態 → 用 `linkedSignal()`
- 非同步資料抓取 → 用 `resource()`
- 同步兩個 signal → 用 `computed()` 或 `linkedSignal()`

---

### 3.8 `viewChild()` / `viewChildren()` — 視圖查詢

```typescript
import {
  Component,
  ChangeDetectionStrategy,
  viewChild,
  viewChildren,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-form-layout',
  template: `
    <input #firstInput type="text" placeholder="First Name" />
    <input #lastInput type="text" placeholder="Last Name" />
    <input type="email" placeholder="Email" />
    <button (click)="focusFirst()">Focus First</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormLayout {
  // Query a single element by template reference variable
  readonly firstInput = viewChild.required<ElementRef<HTMLInputElement>>('firstInput');

  // Query a single element (optional — may not exist)
  readonly lastInput = viewChild<ElementRef<HTMLInputElement>>('lastInput');

  // Query all elements of a type
  readonly allInputs = viewChildren<ElementRef<HTMLInputElement>>('firstInput', 'lastInput');

  protected focusFirst(): void {
    this.firstInput().nativeElement.focus();
  }
}
```

**與裝飾器比較**：
```typescript
// ❌ Legacy
@ViewChild('firstInput') firstInput!: ElementRef<HTMLInputElement>;
@ViewChildren(MatInput) allInputs!: QueryList<MatInput>;

// ✅ Signal-based
readonly firstInput = viewChild.required<ElementRef<HTMLInputElement>>('firstInput');
readonly allInputs = viewChildren(MatInput);
```

---

### 3.9 `contentChild()` / `contentChildren()` — 內容查詢

```typescript
@Component({
  selector: 'app-card',
  template: `
    <div class="card-header">
      <ng-content select="[card-header]" />
    </div>
    <div class="card-body">
      <ng-content />
    </div>
    @if (hasFooter()) {
      <div class="card-footer">
        <ng-content select="[card-footer]" />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  // Query projected content
  readonly footerContent = contentChild<ElementRef>('card-footer');

  protected readonly hasFooter = computed(() => !!this.footerContent());
}
```

---

### 3.10 Signal API 快速對照表

| Signal API | 用途 | 可寫入 | C# 類比 |
|-----------|------|--------|---------|
| `signal(v)` | 可寫狀態 | ✅ | `ObservableProperty` |
| `computed(() => ...)` | 衍生狀態 | ❌ | LINQ 延遲執行 |
| `effect(() => ...)` | 副作用 | — | `PropertyChanged` handler |
| `input()` | 父→子資料 | ❌ | Constructor parameter |
| `input.required()` | 必填父→子 | ❌ | `required` parameter |
| `output()` | 子→父事件 | — | `event EventHandler<T>` |
| `model()` | 雙向繫結 | ✅ | `TwoWay` binding |
| `viewChild()` | 查詢視圖中的元素 | ❌ | `FindName()` |
| `viewChildren()` | 查詢視圖中的所有元素 | ❌ | `FindVisualChildren<T>()` |
| `contentChild()` | 查詢投射內容 | ❌ | Slot query |
| `contentChildren()` | 查詢所有投射內容 | ❌ | Slot query list |

---

## 4. 模板語法

### 4.1 `@if` / `@else if` / `@else` — 條件渲染

Angular 19 使用新的控制流語法取代舊的 `*ngIf` 結構指令。

```html
<!-- Basic @if -->
@if (isLoggedIn()) {
  <app-dashboard />
}

<!-- @if / @else -->
@if (user(); as u) {
  <h1>Welcome, {{ u.name }}</h1>
} @else {
  <h1>Please log in</h1>
}

<!-- @if / @else if / @else -->
@if (status() === 'loading') {
  <app-spinner />
} @else if (status() === 'error') {
  <app-error-message [error]="error()" />
} @else if (status() === 'empty') {
  <p>No data found.</p>
} @else {
  <app-data-table [data]="data()" />
}
```

**`as` 別名語法**：
```html
<!-- Save the resolved value into a local variable -->
@if (currentUser(); as user) {
  <div class="profile">
    <img [src]="user.avatarUrl" [alt]="user.name" />
    <span>{{ user.name }}</span>
    <span>{{ user.email }}</span>
  </div>
}
```

**從 `*ngIf` 遷移**：
```html
<!-- ❌ Legacy *ngIf -->
<div *ngIf="isVisible; else hiddenTemplate">
  Visible content
</div>
<ng-template #hiddenTemplate>
  Hidden content
</ng-template>

<!-- ✅ New @if -->
@if (isVisible()) {
  <div>Visible content</div>
} @else {
  <div>Hidden content</div>
}
```

> **C# 對照**：`@if` 類似 Razor 的 `@if (condition) { ... } else { ... }`，語法幾乎相同。

---

### 4.2 `@for` — 迴圈渲染

```html
<!-- Basic @for with required track expression -->
@for (user of users(); track user.id) {
  <app-user-card [user]="user" />
}

<!-- @for with implicit variables -->
@for (item of items(); track item.id; let idx = $index, cnt = $count) {
  <div class="item"
       [class.first]="$first"
       [class.last]="$last"
       [class.even]="$even"
       [class.odd]="$odd">
    {{ idx + 1 }} / {{ cnt }}: {{ item.name }}
  </div>
}

<!-- @for with @empty fallback -->
@for (product of products(); track product.sku) {
  <app-product-card [product]="product" />
} @empty {
  <div class="empty-state">
    <p>No products found.</p>
    <button (click)="resetFilters()">Reset Filters</button>
  </div>
}
```

**隱式變數一覽**：

| 變數 | 型別 | 說明 |
|------|------|------|
| `$index` | `number` | 當前元素的索引（從 0 開始） |
| `$count` | `number` | 集合的總數量 |
| `$first` | `boolean` | 是否為第一個元素 |
| `$last` | `boolean` | 是否為最後一個元素 |
| `$even` | `boolean` | 索引是否為偶數 |
| `$odd` | `boolean` | 索引是否為奇數 |

**`track` 表達式**：

`track` 是 **必填** 的，告訴 Angular 如何追蹤集合中的元素，以便在資料變更時最小化 DOM 操作。

```html
<!-- Track by object property (recommended) -->
@for (user of users(); track user.id) { ... }

<!-- Track by index (when no unique ID available) -->
@for (item of items(); track $index) { ... }

<!-- Track by the item itself (for primitives) -->
@for (name of names(); track name) { ... }
```

> **C# 對照**：`track` 類似 WPF VirtualizingStackPanel 的 Item recycling 機制，確保只更新變更的項目而非重新建立所有項目。

**從 `*ngFor` 遷移**：
```html
<!-- ❌ Legacy *ngFor -->
<div *ngFor="let user of users; let i = index; trackBy: trackByUserId">
  {{ i }}: {{ user.name }}
</div>

<!-- ✅ New @for -->
@for (user of users(); track user.id; let i = $index) {
  <div>{{ i }}: {{ user.name }}</div>
}
```

---

### 4.3 `@switch` / `@case` / `@default` — 多條件分支

```html
@switch (order.status()) {
  @case ('pending') {
    <app-status-badge color="yellow">Pending</app-status-badge>
  }
  @case ('processing') {
    <app-status-badge color="blue">Processing</app-status-badge>
  }
  @case ('shipped') {
    <app-status-badge color="green">Shipped</app-status-badge>
  }
  @case ('cancelled') {
    <app-status-badge color="red">Cancelled</app-status-badge>
  }
  @default {
    <app-status-badge color="gray">Unknown</app-status-badge>
  }
}
```

> **C# 對照**：直接對應 C# 的 `switch` 表達式。Angular 的 `@switch` 使用 `===` 嚴格相等比較。

---

### 4.4 `@defer` — 延遲載入

`@defer` 是 Angular 的延遲載入語法，允許將部分模板的 JavaScript 延遲到特定條件滿足時才載入。

```html
<!-- Basic @defer with viewport trigger (default: idle) -->
@defer (on viewport) {
  <app-heavy-chart [data]="chartData()" />
} @placeholder {
  <div class="chart-placeholder">
    <p>Chart will load when scrolled into view</p>
  </div>
} @loading (minimum 500ms) {
  <app-spinner />
} @error {
  <p>Failed to load chart component.</p>
}
```

**所有觸發器**：

| 觸發器 | 語法 | 說明 |
|--------|------|------|
| `idle` | `@defer (on idle)` | 瀏覽器閒置時（預設） |
| `viewport` | `@defer (on viewport)` | 元素進入可視範圍時 |
| `interaction` | `@defer (on interaction)` | 使用者與 placeholder 互動時 |
| `hover` | `@defer (on hover)` | 滑鼠懸停在 placeholder 上時 |
| `timer` | `@defer (on timer(2s))` | 指定時間後 |
| `immediate` | `@defer (on immediate)` | 頁面載入後立即 |
| `when` | `@defer (when condition())` | 條件為 true 時 |

**組合觸發器**：
```html
<!-- Multiple triggers — loads when EITHER condition is met -->
@defer (on viewport; on timer(5s)) {
  <app-recommendations />
} @placeholder {
  <div>Recommendations loading...</div>
}
```

**預取 (Prefetch)**：
```html
<!-- Prefetch on idle, but render on viewport -->
@defer (on viewport; prefetch on idle) {
  <app-comments [postId]="postId()" />
} @placeholder {
  <p>Scroll down to see comments</p>
}
```

**`@placeholder`、`@loading`、`@error` 區塊**：

```html
@defer (on interaction) {
  <app-rich-editor />
} @placeholder (minimum 200ms) {
  <!-- minimum: placeholder 至少顯示 200ms，避免閃爍 -->
  <textarea placeholder="Click to load rich editor..."></textarea>
} @loading (after 100ms; minimum 500ms) {
  <!-- after: 延遲 100ms 後才顯示 loading -->
  <!-- minimum: loading 至少顯示 500ms -->
  <app-spinner />
} @error {
  <p>Failed to load editor. <button (click)="retry()">Retry</button></p>
}
```

> **C# 對照**：`@defer` 類似 .NET 的 `Lazy<T>` 搭配觸發條件，確保元件只在需要時才載入，減少初始 bundle 大小。

---

### 4.5 `@let` — 模板區域變數

Angular 19 中 `@let` 已正式穩定，用於在模板中宣告區域變數。

```html
<!-- Simple variable declaration -->
@let greeting = 'Hello, ' + name();

<h1>{{ greeting }}</h1>
<p>{{ greeting }} — welcome back!</p>

<!-- Complex expression reuse -->
@let total = items().reduce((sum, i) => sum + i.price * i.quantity, 0);
@let tax = total * 0.05;
@let grandTotal = total + tax;

<div class="summary">
  <p>Subtotal: {{ total | currency }}</p>
  <p>Tax: {{ tax | currency }}</p>
  <p>Grand Total: {{ grandTotal | currency }}</p>
</div>

<!-- Use with async data -->
@let userData = userResource.value();

@if (userData) {
  <h1>{{ userData.name }}</h1>
  <p>{{ userData.email }}</p>
  <p>Member since: {{ userData.createdAt | date }}</p>
}
```

> **C# 對照**：類似 C# 的 `var` 區域變數宣告，減少重複表達式。

---

### 4.6 模板繫結語法總覽

```html
<!-- Interpolation (one-way: component → template) -->
<h1>{{ title() }}</h1>

<!-- Property binding (one-way: component → template) -->
<img [src]="imageUrl()" [alt]="imageAlt()" />

<!-- Event binding (one-way: template → component) -->
<button (click)="handleClick()">Click me</button>

<!-- Two-way binding -->
<app-rating [(value)]="rating" />

<!-- Attribute binding -->
<td [attr.colspan]="colSpan()">Content</td>

<!-- Class binding -->
<div [class.active]="isActive()">Single class</div>
<div [class]="classMap()">Multiple classes</div>

<!-- Style binding -->
<div [style.color]="textColor()">Styled</div>
<div [style.font-size.px]="fontSize()">Sized</div>
<div [style]="styleMap()">Multiple styles</div>
```

> **重要**：永遠不要使用 `ngClass` 或 `ngStyle` 指令。在 Angular 19+ 中，使用 `[class]` 和 `[style]` 繫結。

---

## 5. 元件通訊模式

### 5.1 模式概覽

Angular 提供多種元件間通訊的方式，每種適用於不同場景。

### 5.2 Input / Output（父子通訊）

最基本的通訊模式，適用於直接的父子關係。

```typescript
// child.ts
@Component({
  selector: 'app-search-box',
  template: `
    <input
      type="text"
      [value]="query()"
      (input)="onInput($event)" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBox {
  readonly query = input('');
  readonly queryChange = output<string>();

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.queryChange.emit(value);
  }
}

// parent.ts
@Component({
  selector: 'app-product-page',
  imports: [SearchBox],
  template: `
    <app-search-box
      [query]="searchQuery()"
      (queryChange)="searchQuery.set($event)" />
    <p>Searching for: {{ searchQuery() }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPage {
  protected readonly searchQuery = signal('');
}
```

---

### 5.3 ViewChild（父→子存取）

父元件直接存取子元件的公開方法或屬性。

```typescript
// child.ts
@Component({
  selector: 'app-video-player',
  template: `<video #videoEl [src]="src()"></video>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayer {
  readonly src = input.required<string>();
  private readonly videoEl = viewChild.required<ElementRef<HTMLVideoElement>>('videoEl');

  play(): void {
    this.videoEl().nativeElement.play();
  }

  pause(): void {
    this.videoEl().nativeElement.pause();
  }
}

// parent.ts
@Component({
  selector: 'app-media-page',
  imports: [VideoPlayer],
  template: `
    <app-video-player #player src="/assets/demo.mp4" />
    <button (click)="player.play()">Play</button>
    <button (click)="player.pause()">Pause</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaPage {}
```

---

### 5.4 ContentChild（投射內容通訊）

透過 `<ng-content>` 投射內容，父元件控制子元件的顯示。

```typescript
// tab.ts
@Component({
  selector: 'app-tab',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tab {
  readonly label = input.required<string>();
  readonly icon = input<string>();
}

// tab-group.ts
@Component({
  selector: 'app-tab-group',
  imports: [Tab],
  template: `
    <nav>
      @for (tab of tabs(); track tab; let i = $index) {
        <button
          [class.active]="selectedIndex() === i"
          (click)="selectedIndex.set(i)">
          @if (tab.icon()) {
            <mat-icon>{{ tab.icon() }}</mat-icon>
          }
          {{ tab.label() }}
        </button>
      }
    </nav>
    <div class="tab-content">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabGroup {
  readonly tabs = contentChildren(Tab);
  protected readonly selectedIndex = signal(0);
}

// usage
@Component({
  selector: 'app-settings',
  imports: [TabGroup, Tab],
  template: `
    <app-tab-group>
      <app-tab label="Profile" icon="person">
        <app-profile-settings />
      </app-tab>
      <app-tab label="Security" icon="lock">
        <app-security-settings />
      </app-tab>
    </app-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {}
```

---

### 5.5 Service-based（服務中介通訊）

適用於非父子關係或跨層級的元件通訊。

```typescript
// notification.service.ts
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  show(message: string, type: Notification['type'] = 'info'): void {
    const notification: Notification = {
      id: crypto.randomUUID(),
      message,
      type,
    };
    this._notifications.update(list => [...list, notification]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => this.dismiss(notification.id), 5000);
  }

  dismiss(id: string): void {
    this._notifications.update(list => list.filter(n => n.id !== id));
  }
}

// notification-toaster.ts (anywhere in the app)
@Component({
  selector: 'app-notification-toaster',
  template: `
    @for (n of notificationService.notifications(); track n.id) {
      <div class="toast" [class]="n.type" (click)="notificationService.dismiss(n.id)">
        {{ n.message }}
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationToaster {
  protected readonly notificationService = inject(NotificationService);
}

// any-component.ts (anywhere else in the app)
@Component({ /* ... */ })
export class OrderForm {
  private readonly notifications = inject(NotificationService);

  submitOrder(): void {
    // ... submit logic
    this.notifications.show('Order placed successfully!', 'success');
  }
}
```

---

### 5.6 通訊模式決策表

| 模式 | 關係 | 方向 | 耦合度 | 適用場景 |
|------|------|------|--------|---------|
| `input()` / `output()` | 父 → 子 / 子 → 父 | 單向 | 低 | 直接父子通訊 |
| `model()` | 父 ↔ 子 | 雙向 | 低 | 表單元件、toggle |
| `viewChild()` | 父 → 子 | 單向 | 中 | 父元件呼叫子元件方法 |
| `contentChild()` | 容器 → 投射內容 | 單向 | 中 | 動態組合 UI |
| Service signal | 任意 | 多向 | 低 | 跨元件狀態共享 |
| Service + RxJS | 任意 | 多向 | 中 | 複雜事件流 |

---

## 6. Smart vs Presentational 模式

### 6.1 定義

| 類型 | 別名 | 職責 |
|------|------|------|
| **Smart (Container)** | 容器元件 | 管理狀態、呼叫服務、處理業務邏輯 |
| **Presentational (Dumb)** | 展示元件 | 接收 Input、顯示資料、發出 Output |

> **C# 對照**：這就是 MVC/MVVM 的分層概念。Smart 元件 = Controller/ViewModel，Presentational 元件 = View。

### 6.2 何時使用

**Presentational 元件**（大多數情況）：
- 不注入服務（除了純工具類）
- 所有資料透過 `input()` 接收
- 所有事件透過 `output()` 發送
- 可重用、易測試

**Smart 元件**（少數情況）：
- 注入 Service 進行資料存取
- 管理路由導航
- 協調多個 Presentational 元件
- 處理錯誤和載入狀態

### 6.3 資料夾結構

```
src/app/products/
├── product-list.page.ts          ← Smart (route component)
├── product-list.page.html
├── product-list.page.css
├── shared/
│   ├── product-card.ts           ← Presentational
│   ├── product-card.html
│   ├── product-card.css
│   ├── product-filter.ts         ← Presentational
│   ├── product-filter.html
│   ├── price-badge.ts            ← Presentational
│   └── product.service.ts        ← Service (used by Smart)
```

### 6.4 完整範例

```typescript
// --- Presentational: product-card.ts ---
@Component({
  selector: 'app-product-card',
  template: `
    <div class="card">
      <img [src]="product().imageUrl" [alt]="product().name" />
      <h3>{{ product().name }}</h3>
      <p class="price">{{ product().price | currency:'TWD' }}</p>
      <button mat-raised-button (click)="addToCart.emit(product())">
        Add to Cart
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();
}

// --- Presentational: product-filter.ts ---
@Component({
  selector: 'app-product-filter',
  template: `
    <mat-form-field>
      <mat-label>Category</mat-label>
      <mat-select [value]="category()" (selectionChange)="categoryChange.emit($event.value)">
        <mat-option value="">All</mat-option>
        @for (cat of categories(); track cat) {
          <mat-option [value]="cat">{{ cat }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFilter {
  readonly category = input('');
  readonly categories = input<string[]>([]);
  readonly categoryChange = output<string>();
}

// --- Smart: product-list.page.ts ---
@Component({
  selector: 'app-product-list-page',
  imports: [ProductCard, ProductFilter],
  template: `
    <h1>Products</h1>

    <app-product-filter
      [category]="selectedCategory()"
      [categories]="categories()"
      (categoryChange)="selectedCategory.set($event)" />

    @if (productsResource.isLoading()) {
      <app-spinner />
    } @else if (productsResource.error()) {
      <p>Error loading products.</p>
    } @else {
      @for (product of filteredProducts(); track product.id) {
        <app-product-card
          [product]="product"
          (addToCart)="onAddToCart($event)" />
      } @empty {
        <p>No products match your filter.</p>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPage {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  protected readonly selectedCategory = signal('');

  protected readonly productsResource = rxResource({
    loader: () => this.productService.getAll(),
  });

  protected readonly categories = computed(() => {
    const products = this.productsResource.value() ?? [];
    return [...new Set(products.map(p => p.category))];
  });

  protected readonly filteredProducts = computed(() => {
    const products = this.productsResource.value() ?? [];
    const category = this.selectedCategory();
    return category
      ? products.filter(p => p.category === category)
      : products;
  });

  protected onAddToCart(product: Product): void {
    this.cartService.add(product);
  }
}
```

---

## 7. Standalone 遷移路徑

### 7.1 NgModule vs Standalone 比較

| 特性 | NgModule（舊） | Standalone（Angular 19+） |
|------|--------------|-------------------------|
| 宣告方式 | `@NgModule({ declarations: [...] })` | 直接在 `@Component` 的 `imports` 中 |
| 預設值 | `standalone: false` | `standalone: true`（Angular 19+ 預設） |
| 依賴管理 | 透過 Module 的 imports/exports | 每個元件自行聲明依賴 |
| 延遲載入 | `loadChildren` 載入 Module | `loadComponent` 載入元件 |
| Tree-shaking | Module 層級 | 元件層級（更細粒度） |
| 樣板簡潔度 | 需要 Module 中間層 | 直接、扁平 |

### 7.2 NgModule 時代（Angular 17 之前）

```typescript
// ❌ Legacy NgModule approach
// user.module.ts
@NgModule({
  declarations: [
    UserListComponent,
    UserCardComponent,
    UserDetailComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild([
      { path: '', component: UserListComponent },
      { path: ':id', component: UserDetailComponent },
    ]),
  ],
  exports: [UserCardComponent],
})
export class UserModule {}
```

### 7.3 Standalone 時代（Angular 19+）

```typescript
// ✅ Modern standalone approach
// user-card.ts
@Component({
  selector: 'app-user-card',
  imports: [MatButtonModule, MatIconModule],
  template: `<!-- ... -->`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCard {
  readonly user = input.required<User>();
}

// user-list.ts
@Component({
  selector: 'app-user-list',
  imports: [UserCard],
  template: `
    @for (user of users(); track user.id) {
      <app-user-card [user]="user" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  readonly users = input<User[]>([]);
}

// user.routes.ts
export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-list').then(m => m.UserList),
  },
  {
    path: ':id',
    loadComponent: () => import('./user-detail').then(m => m.UserDetail),
  },
];
```

### 7.4 遷移步驟

1. **更新 Angular CLI**：升級到 Angular 19+
2. **執行自動遷移**：
   ```bash
   ng generate @angular/core:standalone
   ```
3. **移除 `standalone: true`**：Angular 19+ 預設為 true，不需要明確設定
4. **將 Module 的 imports 移到元件**：每個元件自行聲明依賴
5. **更新路由設定**：使用 `loadComponent` 取代 `loadChildren` + Module
6. **刪除空的 NgModule**：不再需要純粹用於組織的 Module
7. **執行 `ng build` 驗證**：確保編譯通過

### 7.5 bootstrapping 差異

```typescript
// ❌ Legacy: NgModule-based bootstrapping
// main.ts
platformBrowserDynamic().bootstrapModule(AppModule);

// ✅ Modern: Standalone bootstrapping
// main.ts
bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
  ],
});
```

---

## 8. 完整範例：UserProfileCard

以下是一個完整的 `UserProfileCard` 元件，綜合運用本章所有概念。

### 8.1 型別定義

```typescript
// user.model.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'admin' | 'editor' | 'viewer';
  bio: string;
  joinedAt: Date;
  isOnline: boolean;
  stats: UserStats;
}

export interface UserStats {
  posts: number;
  followers: number;
  following: number;
}
```

### 8.2 Presentational: UserAvatar

```typescript
// user-avatar.ts
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-user-avatar',
  imports: [NgOptimizedImage],
  template: `
    <div class="avatar-wrapper" [class]="sizeClass()">
      <img
        [ngSrc]="src()"
        [alt]="alt()"
        [width]="dimension()"
        [height]="dimension()"
        priority />
      @if (showStatus()) {
        <span
          class="status-indicator"
          [class.online]="isOnline()"
          [attr.aria-label]="isOnline() ? 'Online' : 'Offline'">
        </span>
      }
    </div>
  `,
  styles: `
    .avatar-wrapper {
      position: relative;
      display: inline-block;
      border-radius: 50%;
      overflow: hidden;
    }
    .avatar-wrapper.sm { width: 32px; height: 32px; }
    .avatar-wrapper.md { width: 48px; height: 48px; }
    .avatar-wrapper.lg { width: 80px; height: 80px; }
    img { object-fit: cover; border-radius: 50%; }
    .status-indicator {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      background: #9e9e9e;
    }
    .status-indicator.online { background: #4caf50; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatar {
  readonly src = input.required<string>();
  readonly alt = input('User avatar');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly isOnline = input(false);
  readonly showStatus = input(false);

  protected readonly sizeClass = computed(() => this.size());
  protected readonly dimension = computed(() => {
    const sizes = { sm: 32, md: 48, lg: 80 } as const;
    return sizes[this.size()];
  });
}
```

### 8.3 Presentational: StatItem

```typescript
// stat-item.ts
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-stat-item',
  imports: [DecimalPipe],
  template: `
    <div class="stat" role="group" [attr.aria-label]="label()">
      <span class="value">{{ value() | number }}</span>
      <span class="label">{{ label() }}</span>
    </div>
  `,
  styles: `
    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 16px;
    }
    .value {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--mat-sys-primary);
    }
    .label {
      font-size: 0.75rem;
      color: var(--mat-sys-on-surface-variant);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatItem {
  readonly value = input.required<number>();
  readonly label = input.required<string>();
}
```

### 8.4 Presentational: RoleBadge

```typescript
// role-badge.ts
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-role-badge',
  template: `
    <span
      class="badge"
      [style.background]="bgColor()"
      [style.color]="textColor()"
      role="status">
      {{ displayText() }}
    </span>
  `,
  styles: `
    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleBadge {
  readonly role = input.required<'admin' | 'editor' | 'viewer'>();

  protected readonly displayText = computed(() => {
    const labels: Record<string, string> = {
      admin: 'Admin',
      editor: 'Editor',
      viewer: 'Viewer',
    };
    return labels[this.role()] ?? this.role();
  });

  protected readonly bgColor = computed(() => {
    const colors: Record<string, string> = {
      admin: '#ffebee',
      editor: '#e3f2fd',
      viewer: '#f1f8e9',
    };
    return colors[this.role()] ?? '#eeeeee';
  });

  protected readonly textColor = computed(() => {
    const colors: Record<string, string> = {
      admin: '#c62828',
      editor: '#1565c0',
      viewer: '#33691e',
    };
    return colors[this.role()] ?? '#616161';
  });
}
```

### 8.5 Presentational: UserProfileCard

```typescript
// user-profile-card.ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UserAvatar } from './user-avatar';
import { StatItem } from './stat-item';
import { RoleBadge } from './role-badge';
import type { User } from './user.model';

@Component({
  selector: 'app-user-profile-card',
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    UserAvatar,
    StatItem,
    RoleBadge,
  ],
  host: {
    'role': 'article',
    '[attr.aria-label]': '"User profile: " + user().name',
    '[class.elevated]': 'elevated()',
  },
  template: `
    <mat-card [class.compact]="compact()">
      <!-- Header: Avatar + Name + Role -->
      <mat-card-header>
        <app-user-avatar
          mat-card-avatar
          [src]="user().avatarUrl"
          [alt]="user().name + ' avatar'"
          [size]="compact() ? 'sm' : 'lg'"
          [isOnline]="user().isOnline"
          [showStatus]="true" />

        <mat-card-title>
          {{ user().name }}
          <app-role-badge [role]="user().role" />
        </mat-card-title>

        <mat-card-subtitle>
          {{ user().email }}
        </mat-card-subtitle>
      </mat-card-header>

      <!-- Bio -->
      @if (!compact() && user().bio) {
        <mat-card-content>
          <p class="bio">{{ user().bio }}</p>
          <p class="joined">
            <mat-icon>calendar_today</mat-icon>
            Joined {{ user().joinedAt | date:'mediumDate' }}
          </p>
        </mat-card-content>
      }

      <!-- Stats -->
      @if (showStats()) {
        <div class="stats-row">
          <app-stat-item [value]="user().stats.posts" label="Posts" />
          <app-stat-item [value]="user().stats.followers" label="Followers" />
          <app-stat-item [value]="user().stats.following" label="Following" />
        </div>
      }

      <!-- Actions -->
      <mat-card-actions align="end">
        @if (canEdit()) {
          <button mat-button (click)="edit.emit(user())">
            <mat-icon>edit</mat-icon>
            Edit
          </button>
        }
        @if (canFollow()) {
          <button
            mat-raised-button
            color="primary"
            (click)="follow.emit(user())">
            <mat-icon>person_add</mat-icon>
            Follow
          </button>
        }
        <button mat-icon-button (click)="moreActions.emit(user())"
                aria-label="More actions">
          <mat-icon>more_vert</mat-icon>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    :host {
      display: block;
      max-width: 400px;
    }
    :host.elevated mat-card {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    .stats-row {
      display: flex;
      justify-content: space-around;
      padding: 16px 0;
      border-top: 1px solid var(--mat-sys-outline-variant);
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }
    .bio {
      color: var(--mat-sys-on-surface-variant);
      line-height: 1.6;
    }
    .joined {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.875rem;
    }
    .joined mat-icon { font-size: 16px; width: 16px; height: 16px; }
    mat-card.compact { padding: 8px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileCard {
  // --- Inputs ---
  readonly user = input.required<User>();
  readonly compact = input(false);
  readonly elevated = input(false);
  readonly showStats = input(true);

  // --- Outputs ---
  readonly edit = output<User>();
  readonly follow = output<User>();
  readonly moreActions = output<User>();

  // --- Derived State ---
  protected readonly canEdit = computed(() =>
    this.user().role === 'admin' || this.user().role === 'editor'
  );

  protected readonly canFollow = computed(() =>
    this.user().role !== 'admin'
  );
}
```

### 8.6 Smart: UserProfilePage

```typescript
// user-profile.page.ts
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { UserProfileCard } from './user-profile-card';
import { UserService } from './user.service';
import type { User } from './user.model';

@Component({
  selector: 'app-user-profile-page',
  imports: [UserProfileCard],
  template: `
    @if (userResource.isLoading()) {
      <p>Loading user profile...</p>
    } @else if (userResource.error(); as err) {
      <p>Error: {{ err }}</p>
    } @else if (userResource.value(); as user) {
      <app-user-profile-card
        [user]="user"
        [elevated]="true"
        (edit)="onEdit($event)"
        (follow)="onFollow($event)"
        (moreActions)="onMoreActions($event)" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfilePage {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);

  // Reactive resource that fetches user when route param changes
  protected readonly userResource = rxResource({
    request: () => this.route.params,
    loader: ({ request: params }) =>
      params.pipe(
        switchMap((p) => this.userService.getById(p['id']))
      ),
  });

  protected onEdit(user: User): void {
    console.log('Edit user:', user.name);
  }

  protected onFollow(user: User): void {
    console.log('Follow user:', user.name);
  }

  protected onMoreActions(user: User): void {
    console.log('More actions for:', user.name);
  }
}
```

---

## 9. 常見陷阱

### 陷阱 1：忘記在模板中呼叫 Signal

```typescript
// ❌ Bug: signal value is never read — displays function reference
<p>{{ userName }}</p>

// ✅ Fix: call the signal to read its value
<p>{{ userName() }}</p>
```

**說明**：Signal 是函式，必須加上 `()` 才能取得值。不加括號只會顯示 `[Function]` 或空白。

---

### 陷阱 2：在 Signal 中直接修改物件/陣列

```typescript
// ❌ Bug: mutating in place — OnPush won't detect the change
this.items().push(newItem);

// ✅ Fix: return a new reference
this.items.update(list => [...list, newItem]);
```

**說明**：`OnPush` 變更偵測依賴引用比較。必須回傳新的物件/陣列引用。

---

### 陷阱 3：缺少 `changeDetection: ChangeDetectionStrategy.OnPush`

```typescript
// ❌ Forgetting OnPush — uses Default change detection
@Component({
  selector: 'app-my-component',
  template: `...`,
})
export class MyComponent {}

// ✅ Always set OnPush
@Component({
  selector: 'app-my-component',
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {}
```

**說明**：`Default` 策略會在每次事件觸發時檢查整棵元件樹，嚴重影響效能。

---

### 陷阱 4：在 `@for` 中遺漏 `track`

```html
<!-- ❌ Compile error: track is required -->
@for (item of items()) {
  <div>{{ item.name }}</div>
}

<!-- ✅ Always provide track expression -->
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}
```

**說明**：`track` 是必填的。沒有 `track`，Angular 編譯器會報錯。

---

### 陷阱 5：明確設定 `standalone: true`

```typescript
// ❌ Unnecessary in Angular 19+
@Component({
  standalone: true, // This is already the default!
  selector: 'app-my-component',
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// ✅ Omit standalone — it's true by default
@Component({
  selector: 'app-my-component',
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

**說明**：Angular 19+ 預設 `standalone: true`，明確設定是多餘的雜訊。

---

### 陷阱 6：使用建構函式注入

```typescript
// ❌ Legacy constructor injection
export class UserList {
  constructor(private userService: UserService) {}
}

// ✅ Modern inject() function
export class UserList {
  private readonly userService = inject(UserService);
}
```

**說明**：`inject()` 函式更簡潔、支援更多注入情境，且可在函式守衛中使用。

---

### 陷阱 7：使用 `@HostBinding` / `@HostListener`

```typescript
// ❌ Legacy host decorators
@HostBinding('class.active') isActive = false;
@HostListener('click') onClick() { /* ... */ }

// ✅ Use host metadata object
@Component({
  host: {
    '[class.active]': 'isActive()',
    '(click)': 'onClick()',
  },
})
```

**說明**：`host` 物件更集中、更易閱讀，且是 Angular 19+ 的推薦做法。

---

### 陷阱 8：使用 `*ngIf` / `*ngFor` / `*ngSwitch`

```html
<!-- ❌ Legacy structural directives -->
<div *ngIf="condition">Content</div>
<div *ngFor="let item of items; trackBy: trackByFn">{{ item }}</div>

<!-- ✅ New control flow -->
@if (condition()) {
  <div>Content</div>
}
@for (item of items(); track item.id) {
  <div>{{ item }}</div>
}
```

**說明**：新的控制流語法是 Angular 17+ 的標準，性能更好且不需要匯入 `CommonModule`。

---

### 陷阱 9：在 `ngOnInit` 中存取 `viewChild`

```typescript
// ❌ Bug: viewChild is not available in ngOnInit
ngOnInit(): void {
  this.myChild(); // undefined!
}

// ✅ Fix: access in ngAfterViewInit or use afterRenderEffect
ngAfterViewInit(): void {
  this.myChild(); // now available
}

// Or better yet:
constructor() {
  afterRenderEffect(() => {
    const child = this.myChild();
    // Safe to use here
  });
}
```

**說明**：`viewChild()` 的值在 `ngAfterViewInit` 之後才可用。

---

### 陷阱 10：在 `effect()` 中設定其他 Signal

```typescript
// ❌ Anti-pattern: using effect to sync signals
effect(() => {
  const name = this.firstName() + ' ' + this.lastName();
  this.fullName.set(name); // This triggers more change detection
});

// ✅ Fix: use computed for derived values
readonly fullName = computed(() =>
  this.firstName() + ' ' + this.lastName()
);
```

**說明**：`effect()` 不應用於同步 signal。使用 `computed()` 產生衍生狀態，使用 `linkedSignal()` 產生可寫入的衍生狀態。

---

## 本章小結

| 概念 | 要點 |
|------|------|
| 元件宣告 | `@Component` + OnPush + Signal API |
| 生命週期 | 優先使用 `computed` / `effect` / `resource` 取代傳統鉤子 |
| Signal API | `input()` / `output()` / `model()` / `computed()` / `effect()` |
| 模板語法 | `@if` / `@for` / `@switch` / `@defer` / `@let` |
| 元件通訊 | Input/Output 為主，Service signal 為輔 |
| 架構模式 | Smart (Container) + Presentational (Dumb) |
| Standalone | 預設啟用，不需要 NgModule |

> **下一章**：[第二章：依賴注入 (Dependency Injection)](./02-dependency-injection.md)
