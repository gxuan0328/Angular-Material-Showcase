# 第四章：狀態管理 (State Management)

> **目標讀者**：熟悉 .NET/C# 的後端工程師，首次接觸 Angular 19+ 前端框架。
> 本章涵蓋 Angular Signals、RxJS 互操作、元件與服務級狀態、NgRx Store 與 SignalStore。

---

## 目錄

1. [Angular Signals 基礎](#1-angular-signals-基礎)
2. [進階 Signal API](#2-進階-signal-api)
3. [WritableSignal vs Signal](#3-writablesignal-vs-signal)
4. [RxJS 在 Angular 中](#4-rxjs-在-angular-中)
5. [Signals vs RxJS 互操作](#5-signals-vs-rxjs-互操作)
6. [元件級狀態](#6-元件級狀態)
7. [服務級狀態](#7-服務級狀態)
8. [NgRx Store 概覽](#8-ngrx-store-概覽)
9. [NgRx SignalStore](#9-ngrx-signalstore)
10. [狀態管理決策矩陣](#10-狀態管理決策矩陣)
11. [不可變性與變更偵測](#11-不可變性與變更偵測)
12. [完整範例：TodoStore](#12-完整範例todostore)
13. [常見陷阱](#13-常見陷阱)

---

## 1. Angular Signals 基礎

### 1.1 什麼是 Signal？

Signal 是 Angular 19+ 的核心反應式原語 (reactive primitive)。一個 Signal 包裝了一個值，當值改變時，所有讀取這個 Signal 的消費者（模板、computed、effect）都會自動收到通知。

> **C# 對照**：
> - `signal()` ≈ WPF 的 `DependencyProperty` + `INotifyPropertyChanged`
> - `computed()` ≈ LINQ 的延遲執行 + 自動快取
> - `effect()` ≈ `PropertyChanged` 事件處理器
> - 整體概念 ≈ .NET MAUI 的 `ObservableProperty` + `RelayCommand`

### 1.2 `signal()` — 建立可寫信號

```typescript
import { signal } from '@angular/core';

// Create a writable signal with an initial value
const count = signal(0);
const username = signal('');
const items = signal<string[]>([]);
const user = signal<User | null>(null);

// Read the value (call the signal as a function)
console.log(count());      // 0
console.log(username());   // ''

// Set a new value
count.set(5);
console.log(count());      // 5

// Update based on previous value
count.update(prev => prev + 1);
console.log(count());      // 6

// ❌ WRONG — never mutate in place
items().push('new item');  // OnPush won't detect this!

// ✅ CORRECT — always return a new reference
items.update(list => [...list, 'new item']);
```

**API 摘要**：

| 方法 | 簽名 | 說明 |
|------|------|------|
| `signal(v)` | `signal<T>(initialValue: T): WritableSignal<T>` | 建立可寫信號 |
| `.set(v)` | `set(value: T): void` | 直接設定新值 |
| `.update(fn)` | `update(fn: (prev: T) => T): void` | 基於前值計算新值 |
| `()` | 呼叫信號 | 讀取當前值 |
| `.asReadonly()` | `asReadonly(): Signal<T>` | 回傳唯讀信號 |

### 1.3 `computed()` — 衍生信號

`computed()` 建立一個唯讀信號，其值由其他信號衍生而來。

```typescript
import { signal, computed } from '@angular/core';

const firstName = signal('Jason');
const lastName = signal('Chao');

// Derived signal — automatically tracks dependencies
const fullName = computed(() => `${firstName()} ${lastName()}`);

console.log(fullName()); // 'Jason Chao'

firstName.set('Alex');
console.log(fullName()); // 'Alex Chao' — automatically updated
```

**特性**：
- **惰性求值**：第一次被讀取時才計算
- **快取**：值被快取，只在依賴改變時重新計算
- **自動追蹤**：在計算函式中讀取的所有 signal 都自動成為依賴
- **唯讀**：不能呼叫 `.set()` 或 `.update()`

```typescript
// Complex derived state example
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const cartItems = signal<CartItem[]>([]);
const taxRate = signal(0.05);
const discountCode = signal<string | null>(null);

const subtotal = computed(() =>
  cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const discount = computed(() => {
  const code = discountCode();
  if (code === 'SAVE10') return subtotal() * 0.10;
  if (code === 'SAVE20') return subtotal() * 0.20;
  return 0;
});

const tax = computed(() => (subtotal() - discount()) * taxRate());

const total = computed(() => subtotal() - discount() + tax());

// Dependency graph:
// cartItems ──┬──→ subtotal ──┬──→ discount ──┬──→ tax ──→ total
// taxRate     │               │               │
// discountCode └──────────────┘               └──────────→ total
```

> **C# 對照**：`computed()` 類似 Excel 的公式儲存格 — 當引用的儲存格改變時，公式自動重新計算。

### 1.4 `effect()` — 副作用

`effect()` 在其讀取的信號值改變時自動執行。

```typescript
import { signal, effect } from '@angular/core';

const theme = signal<'light' | 'dark'>('light');
const fontSize = signal(16);

// Effect runs when theme() or fontSize() changes
effect(() => {
  document.documentElement.setAttribute('data-theme', theme());
  document.documentElement.style.fontSize = `${fontSize()}px`;
});

// Effect with cleanup
effect((onCleanup) => {
  const interval = setInterval(() => {
    console.log(`Current theme: ${theme()}`);
  }, 1000);

  // Cleanup function runs before re-execution and on destroy
  onCleanup(() => clearInterval(interval));
});
```

**`effect()` 使用守則**：

| 使用 `effect()` | 不使用 `effect()`（用替代方案） |
|-----------------|-------------------------------|
| 同步 localStorage | 衍生狀態 → `computed()` |
| 更新 DOM / 第三方函式庫 | 可寫衍生狀態 → `linkedSignal()` |
| 日誌記錄 / 遙測 | 非同步資料抓取 → `resource()` |
| 更新 `document.title` | 同步兩個 signal → `computed()` |

---

## 2. 進階 Signal API

### 2.1 `linkedSignal()` — 連結的可寫信號

`linkedSignal()` 建立一個可寫信號，當來源信號改變時自動重置。

```typescript
import { signal, linkedSignal } from '@angular/core';

interface Product {
  id: string;
  name: string;
  variants: string[];
}

const products = signal<Product[]>([
  { id: '1', name: 'T-Shirt', variants: ['S', 'M', 'L', 'XL'] },
  { id: '2', name: 'Hoodie', variants: ['M', 'L', 'XL'] },
]);

const selectedProductIndex = signal(0);

const selectedProduct = computed(() => products()[selectedProductIndex()]);

// linkedSignal: resets to first variant when product changes,
// but user can manually select a different variant
const selectedVariant = linkedSignal({
  source: selectedProduct,
  computation: (product) => product.variants[0],
});

console.log(selectedVariant()); // 'S' (first variant of T-Shirt)

// User manually selects a variant
selectedVariant.set('L');
console.log(selectedVariant()); // 'L'

// Product changes → selectedVariant resets
selectedProductIndex.set(1);
console.log(selectedVariant()); // 'M' (first variant of Hoodie)
```

**簡化形式**：

```typescript
// Shorthand — when computation is just the source value itself
const selectedCategory = signal('electronics');
const searchQuery = linkedSignal(() => ''); // Resets when... nothing (just initial)

// With source dependency
const currentPage = linkedSignal({
  source: selectedCategory,
  computation: () => 1, // Reset to page 1 when category changes
});
```

**進階形式（存取前值）**：

```typescript
const selectedVariant = linkedSignal({
  source: selectedProduct,
  computation: (product, previous) => {
    // If the new product has the same variant the user chose, keep it
    if (previous && product.variants.includes(previous.value)) {
      return previous.value;
    }
    // Otherwise, default to the first variant
    return product.variants[0];
  },
});
```

> **C# 對照**：`linkedSignal()` 類似 WPF 中當 SelectedItem 改變時自動重置 SelectedChild 的模式，但保留使用者手動修改的能力。

### 2.2 `resource()` — 非同步信號

`resource()` 將非同步操作（如 API 呼叫）整合進信號圖。

```typescript
import { signal, resource } from '@angular/core';

const userId = signal<string>('1');

// Resource automatically fetches when userId() changes
const userResource = resource({
  request: () => ({ id: userId() }),
  loader: async ({ request, abortSignal }) => {
    const response = await fetch(`/api/users/${request.id}`, {
      signal: abortSignal,
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json() as Promise<User>;
  },
});

// Access resource state in templates
// userResource.value()     → User | undefined
// userResource.status()    → 'idle' | 'loading' | 'reloading' | 'resolved' | 'error' | 'local'
// userResource.error()     → unknown
// userResource.isLoading() → boolean
```

**在元件中使用**：

```typescript
@Component({
  selector: 'app-user-profile',
  template: `
    @if (userResource.isLoading()) {
      <app-skeleton />
    } @else if (userResource.error(); as err) {
      <app-error [message]="err" (retry)="userResource.reload()" />
    } @else if (userResource.value(); as user) {
      <h1>{{ user.name }}</h1>
      <p>{{ user.email }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile {
  readonly userId = input.required<string>();

  protected readonly userResource = resource({
    request: () => ({ id: this.userId() }),
    loader: async ({ request, abortSignal }) => {
      const response = await fetch(`/api/users/${request.id}`, {
        signal: abortSignal,
      });
      return response.json() as Promise<User>;
    },
  });
}
```

**`rxResource()`** — RxJS 版本：

```typescript
import { rxResource } from '@angular/core/rxjs-interop';

@Component({ /* ... */ })
export class UserProfile {
  private readonly http = inject(HttpClient);
  readonly userId = input.required<string>();

  protected readonly userResource = rxResource({
    request: () => ({ id: this.userId() }),
    loader: ({ request }) =>
      this.http.get<User>(`/api/users/${request.id}`),
  });
}
```

**`httpResource()`** — 實驗性 HTTP 專用版本：

```typescript
import { httpResource } from '@angular/common/http';

@Component({ /* ... */ })
export class UserProfile {
  readonly userId = input.required<string>();

  // Simplest form — just a URL signal
  protected readonly userResource = httpResource<User>(() =>
    `/api/users/${this.userId()}`
  );
}
```

**Resource API 一覽**：

| 屬性/方法 | 型別 | 說明 |
|-----------|------|------|
| `value()` | `Signal<T \| undefined>` | 當前值 |
| `status()` | `Signal<ResourceStatus>` | 狀態 |
| `error()` | `Signal<unknown>` | 錯誤 |
| `isLoading()` | `Signal<boolean>` | 是否載入中 |
| `hasValue()` | `Signal<boolean>` | 是否有值 |
| `reload()` | `() => void` | 手動重新載入 |
| `set(value)` | `(T) => void` | 手動設定值（樂觀更新） |
| `update(fn)` | `(fn) => void` | 手動更新值 |

### 2.3 `untracked()` — 不追蹤的讀取

在反應式上下文中讀取信號但不建立依賴。

```typescript
import { signal, computed, effect, untracked } from '@angular/core';

const count = signal(0);
const logEnabled = signal(true);

// Without untracked: effect re-runs when EITHER count or logEnabled changes
effect(() => {
  if (logEnabled()) {
    console.log(`Count is: ${count()}`);
  }
});

// With untracked: effect only re-runs when count changes
effect(() => {
  const currentCount = count(); // tracked
  const shouldLog = untracked(() => logEnabled()); // NOT tracked
  if (shouldLog) {
    console.log(`Count is: ${currentCount}`);
  }
});
```

> **使用場景**：在 `effect()` 或 `computed()` 中讀取「配置型」信號（如 feature flag）而不想讓它們觸發重新執行。

### 2.4 反應式上下文規則

**重要**：反應式上下文（`computed`、`effect`、`linkedSignal`、模板）只能 **同步追蹤** 信號讀取。`await` 之後的讀取不會被追蹤。

```typescript
// ❌ WRONG: theme() after await is NOT tracked
effect(async () => {
  const data = await fetchData();
  console.log(theme()); // This read is invisible to the reactive graph
});

// ✅ CORRECT: capture signals BEFORE the await
effect(async () => {
  const currentTheme = theme(); // Tracked
  const data = await fetchData();
  console.log(currentTheme); // Use captured value
});
```

---

## 3. WritableSignal vs Signal

### 3.1 型別關係

```typescript
import { signal, computed, Signal, WritableSignal } from '@angular/core';

// WritableSignal<T> extends Signal<T>
const writable: WritableSignal<number> = signal(0);  // Has .set() and .update()
const readonly: Signal<number> = computed(() => writable() * 2); // Only readable

// WritableSignal can be assigned to Signal (covariant)
const asReadonly: Signal<number> = writable; // ✅ OK — loses .set()/.update()
```

### 3.2 唯讀暴露模式

這是 Angular 服務中管理狀態的核心模式。

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeStore {
  // Private writable signal — only this service can modify
  private readonly _theme = signal<'light' | 'dark'>('light');
  private readonly _accentColor = signal('#1976d2');

  // Public readonly signals — consumers can only read
  readonly theme = this._theme.asReadonly();
  readonly accentColor = this._accentColor.asReadonly();

  // Derived state — automatically computed
  readonly isDark = computed(() => this._theme() === 'dark');
  readonly cssVariables = computed(() => ({
    '--theme': this._theme(),
    '--accent': this._accentColor(),
    '--bg': this.isDark() ? '#121212' : '#ffffff',
    '--fg': this.isDark() ? '#ffffff' : '#000000',
  }));

  // Public mutation methods — controlled entry points
  toggleTheme(): void {
    this._theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  setAccentColor(color: string): void {
    this._accentColor.set(color);
  }
}
```

> **C# 對照**：這個模式完全對應 .NET 的封裝原則 — `private set` + `public get`。`asReadonly()` 就像 C# 的 `IReadOnlyList<T>` 暴露 `List<T>`。

### 3.3 為什麼要用唯讀暴露？

```typescript
// ❌ Without readonly: any component can corrupt the state
@Injectable({ providedIn: 'root' })
export class UserStore {
  readonly users = signal<User[]>([]);
  // Any component can do: userStore.users.set([]) — state corruption!
}

// ✅ With readonly: mutations go through controlled methods
@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly _users = signal<User[]>([]);
  readonly users = this._users.asReadonly();

  addUser(user: User): void {
    this._users.update(list => [...list, user]);
  }

  removeUser(id: string): void {
    this._users.update(list => list.filter(u => u.id !== id));
  }
}
```

---

## 4. RxJS 在 Angular 中

### 4.1 何時仍然需要 RxJS？

Angular 19+ 的 Signal 涵蓋了大多數反應式需求，但 RxJS 在以下場景仍然不可取代：

| 場景 | 為什麼需要 RxJS |
|------|----------------|
| HTTP 請求 | `HttpClient` 回傳 Observable |
| 事件串流 | debounce、throttle、distinctUntilChanged |
| 複雜組合 | merge、combineLatest、switchMap |
| WebSocket | 持續串流 |
| 路由事件 | `Router.events` 是 Observable |
| 表單值變化 | `valueChanges` 是 Observable |

### 4.2 核心 Observable 型別

#### `Observable<T>` — 冷流

```typescript
import { Observable } from 'rxjs';

// Observable is lazy — doesn't execute until subscribed
const numbers$ = new Observable<number>(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
});

// Each subscription creates a new execution
numbers$.subscribe(n => console.log('A:', n)); // A: 1, A: 2, A: 3
numbers$.subscribe(n => console.log('B:', n)); // B: 1, B: 2, B: 3
```

> **C# 對照**：類似 `IEnumerable<T>` — 惰性、每次列舉都重新執行。

#### `Subject<T>` — 熱流（多播）

```typescript
import { Subject } from 'rxjs';

const events$ = new Subject<string>();

// Multiple subscribers share the same stream
events$.subscribe(e => console.log('A:', e));
events$.subscribe(e => console.log('B:', e));

events$.next('click');  // A: click, B: click
events$.next('hover');  // A: hover, B: hover
```

> **C# 對照**：類似 C# 的 `event EventHandler<T>` — 多個訂閱者、即時推送。

#### `BehaviorSubject<T>` — 有初始值的熱流

```typescript
import { BehaviorSubject } from 'rxjs';

const currentUser$ = new BehaviorSubject<User | null>(null);

// New subscribers immediately receive the current value
currentUser$.subscribe(u => console.log('A:', u)); // A: null (immediately)

currentUser$.next({ id: '1', name: 'Alice' });
// A: { id: '1', name: 'Alice' }

currentUser$.subscribe(u => console.log('B:', u));
// B: { id: '1', name: 'Alice' } (immediately receives current value)
```

> **C# 對照**：類似 Reactive Extensions (.NET) 的 `BehaviorSubject<T>` — 總是有值、新訂閱者立即收到最新值。

#### `ReplaySubject<T>` — 重播歷史值的熱流

```typescript
import { ReplaySubject } from 'rxjs';

// Replay last 3 values to new subscribers
const log$ = new ReplaySubject<string>(3);

log$.next('Event 1');
log$.next('Event 2');
log$.next('Event 3');
log$.next('Event 4');

log$.subscribe(e => console.log(e));
// Immediately: 'Event 2', 'Event 3', 'Event 4' (last 3)
```

### 4.3 常用操作符

```typescript
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  filter,
  catchError,
  tap,
  takeUntil,
  take,
  retry,
  combineLatest,
  merge,
  startWith,
} from 'rxjs';

// Search with debounce
const searchResults$ = searchInput$.pipe(
  debounceTime(300),           // Wait 300ms after last keystroke
  distinctUntilChanged(),      // Ignore if same value
  filter(query => query.length >= 2), // Minimum 2 characters
  switchMap(query =>           // Cancel previous request, start new one
    this.http.get<Result[]>(`/api/search?q=${query}`).pipe(
      catchError(() => of([])) // Handle error gracefully
    )
  ),
);

// Combine multiple streams
const viewModel$ = combineLatest([
  this.users$,
  this.selectedUserId$,
  this.permissions$,
]).pipe(
  map(([users, selectedId, permissions]) => ({
    users,
    selectedUser: users.find(u => u.id === selectedId),
    canEdit: permissions.includes('edit'),
  })),
);
```

---

## 5. Signals vs RxJS 互操作

### 5.1 `toSignal()` — Observable → Signal

```typescript
import { toSignal } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({
  selector: 'app-timer',
  template: `<p>Seconds: {{ seconds() }}</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timer {
  // Convert Observable to Signal
  protected readonly seconds = toSignal(interval(1000), { initialValue: 0 });
}
```

**選項**：

```typescript
// With initial value (type is Signal<T>)
const data = toSignal(data$, { initialValue: [] });

// Without initial value (type is Signal<T | undefined>)
const data = toSignal(data$); // undefined until first emission

// With requireSync (for BehaviorSubject or startWith)
const data = toSignal(behaviorSubject$, { requireSync: true });

// With manual cleanup
const data = toSignal(data$, { manualCleanup: true });
```

**常見用法**：

```typescript
@Component({ /* ... */ })
export class SearchPage {
  private readonly route = inject(ActivatedRoute);

  // Convert route params Observable to Signal
  protected readonly searchQuery = toSignal(
    this.route.queryParamMap.pipe(
      map(params => params.get('q') ?? '')
    ),
    { initialValue: '' }
  );

  // Convert form value changes to Signal
  protected readonly formControl = new FormControl('');
  protected readonly formValue = toSignal(
    this.formControl.valueChanges.pipe(startWith('')),
    { requireSync: true }
  );
}
```

### 5.2 `toObservable()` — Signal → Observable

```typescript
import { toObservable } from '@angular/core/rxjs-interop';

@Component({ /* ... */ })
export class AutoSave {
  protected readonly content = signal('');

  constructor() {
    // Convert Signal to Observable for RxJS operators
    toObservable(this.content).pipe(
      debounceTime(2000),
      distinctUntilChanged(),
      switchMap(content =>
        this.http.put('/api/drafts', { content })
      ),
    ).subscribe();
  }
}
```

### 5.3 決策矩陣：Signal vs RxJS

| 需求 | 使用 Signal | 使用 RxJS | 使用 toSignal/toObservable |
|------|------------|----------|---------------------------|
| 元件狀態 | ✅ `signal()` | — | — |
| 衍生狀態 | ✅ `computed()` | — | — |
| DOM 事件回應 | ✅ 模板繫結 | — | — |
| HTTP 請求 | ✅ `resource()` | ✅ `HttpClient` | `toSignal(http.get(...))` |
| 防抖搜尋 | — | ✅ `debounceTime` | `toSignal()` 包裝 |
| WebSocket 串流 | — | ✅ Subject | `toSignal()` 包裝 |
| 表單值追蹤 | — | ✅ `valueChanges` | `toSignal()` 包裝 |
| 路由參數 | ✅ `input()` | ✅ `paramMap` | `toSignal()` 包裝 |
| 全域狀態 | ✅ Service signal | — | — |
| 複雜事件組合 | — | ✅ combineLatest, merge | 最終用 `toSignal()` |

**經驗法則**：
1. **能用 Signal 就用 Signal**（元件狀態、衍生狀態、服務狀態）
2. **RxJS 用於串流和操作符**（debounce、switchMap、merge）
3. **`toSignal()` 作為橋接**（將 Observable 的最終結果轉為模板友好的 Signal）

---

## 6. 元件級狀態

### 6.1 簡單計數器

```typescript
@Component({
  selector: 'app-counter',
  template: `
    <button (click)="decrement()" [disabled]="isMin()">-</button>
    <span>{{ count() }}</span>
    <button (click)="increment()" [disabled]="isMax()">+</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Counter {
  readonly min = input(0);
  readonly max = input(100);

  protected readonly count = signal(0);

  protected readonly isMin = computed(() => this.count() <= this.min());
  protected readonly isMax = computed(() => this.count() >= this.max());

  protected increment(): void {
    if (!this.isMax()) {
      this.count.update(c => c + 1);
    }
  }

  protected decrement(): void {
    if (!this.isMin()) {
      this.count.update(c => c - 1);
    }
  }
}
```

### 6.2 表單與驗證

```typescript
@Component({
  selector: 'app-registration-form',
  template: `
    <form (ngSubmit)="onSubmit()">
      <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput
               type="email"
               [value]="email()"
               (input)="email.set(getInputValue($event))" />
        @if (emailError()) {
          <mat-error>{{ emailError() }}</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>Password</mat-label>
        <input matInput
               type="password"
               [value]="password()"
               (input)="password.set(getInputValue($event))" />
        @if (passwordError()) {
          <mat-error>{{ passwordError() }}</mat-error>
        }
      </mat-form-field>

      <div class="strength">
        Password strength: {{ passwordStrength() }}
      </div>

      <button mat-raised-button
              type="submit"
              [disabled]="!isFormValid() || isSubmitting()">
        @if (isSubmitting()) {
          Registering...
        } @else {
          Register
        }
      </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationForm {
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly isSubmitting = signal(false);

  // Derived validation state
  protected readonly emailError = computed(() => {
    const email = this.email();
    if (!email) return 'Email is required';
    if (!email.includes('@')) return 'Invalid email address';
    return null;
  });

  protected readonly passwordError = computed(() => {
    const pwd = this.password();
    if (!pwd) return 'Password is required';
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain an uppercase letter';
    if (!/[0-9]/.test(pwd)) return 'Password must contain a number';
    return null;
  });

  protected readonly passwordStrength = computed(() => {
    const pwd = this.password();
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return 'Weak';
    if (score <= 3) return 'Medium';
    return 'Strong';
  });

  protected readonly isFormValid = computed(() =>
    !this.emailError() && !this.passwordError()
  );

  protected getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected onSubmit(): void {
    if (!this.isFormValid()) return;
    this.isSubmitting.set(true);
    // ... submit logic
  }
}
```

### 6.3 用 `linkedSignal` 管理分頁

```typescript
@Component({
  selector: 'app-paginated-list',
  template: `
    <mat-form-field>
      <mat-label>Category</mat-label>
      <mat-select [value]="selectedCategory()" (selectionChange)="selectedCategory.set($event.value)">
        @for (cat of categories; track cat) {
          <mat-option [value]="cat">{{ cat }}</mat-option>
        }
      </mat-select>
    </mat-form-field>

    <p>Page {{ currentPage() }} of {{ totalPages() }}</p>

    @for (item of pagedItems(); track item.id) {
      <div>{{ item.name }}</div>
    }

    <button (click)="previousPage()" [disabled]="currentPage() <= 1">Previous</button>
    <button (click)="nextPage()" [disabled]="currentPage() >= totalPages()">Next</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatedList {
  readonly items = input<Item[]>([]);
  protected readonly pageSize = 10;
  protected readonly categories = ['All', 'Books', 'Electronics', 'Clothing'];

  protected readonly selectedCategory = signal('All');

  // Page resets to 1 whenever category changes
  protected readonly currentPage = linkedSignal({
    source: this.selectedCategory,
    computation: () => 1,
  });

  protected readonly filteredItems = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'All') return this.items();
    return this.items().filter(i => i.category === cat);
  });

  protected readonly totalPages = computed(() =>
    Math.ceil(this.filteredItems().length / this.pageSize)
  );

  protected readonly pagedItems = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredItems().slice(start, start + this.pageSize);
  });

  protected nextPage(): void {
    this.currentPage.update(p => Math.min(p + 1, this.totalPages()));
  }

  protected previousPage(): void {
    this.currentPage.update(p => Math.max(p - 1, 1));
  }
}
```

---

## 7. 服務級狀態

### 7.1 基本模式

```typescript
@Injectable({ providedIn: 'root' })
export class NotificationStore {
  // Private writable state
  private readonly _notifications = signal<Notification[]>([]);
  private readonly _unreadCount = signal(0);

  // Public readonly signals
  readonly notifications = this._notifications.asReadonly();
  readonly unreadCount = this._unreadCount.asReadonly();

  // Derived state
  readonly hasUnread = computed(() => this._unreadCount() > 0);
  readonly latestNotification = computed(() => this._notifications()[0] ?? null);

  // Mutation methods
  add(notification: Notification): void {
    this._notifications.update(list => [notification, ...list]);
    this._unreadCount.update(c => c + 1);
  }

  markAsRead(id: string): void {
    this._notifications.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
    this._unreadCount.update(c => Math.max(0, c - 1));
  }

  markAllAsRead(): void {
    this._notifications.update(list =>
      list.map(n => ({ ...n, read: true }))
    );
    this._unreadCount.set(0);
  }

  clear(): void {
    this._notifications.set([]);
    this._unreadCount.set(0);
  }
}
```

### 7.2 帶有 API 互動的服務

```typescript
@Injectable({ providedIn: 'root' })
export class ProductStore {
  private readonly http = inject(HttpClient);

  // State
  private readonly _products = signal<Product[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Public API
  readonly products = this._products.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly productCount = computed(() => this._products().length);

  loadAll(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Product[]>('/api/products').subscribe({
      next: (products) => {
        this._products.set(products);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message ?? 'Failed to load products');
        this._loading.set(false);
      },
    });
  }

  add(product: Omit<Product, 'id'>): void {
    // Optimistic update
    const tempId = `temp-${crypto.randomUUID()}`;
    const tempProduct: Product = { ...product, id: tempId };
    this._products.update(list => [...list, tempProduct]);

    this.http.post<Product>('/api/products', product).subscribe({
      next: (created) => {
        // Replace temp with real product
        this._products.update(list =>
          list.map(p => p.id === tempId ? created : p)
        );
      },
      error: () => {
        // Rollback optimistic update
        this._products.update(list => list.filter(p => p.id !== tempId));
        this._error.set('Failed to add product');
      },
    });
  }

  remove(id: string): void {
    // Store for rollback
    const removed = this._products().find(p => p.id === id);
    this._products.update(list => list.filter(p => p.id !== id));

    this.http.delete(`/api/products/${id}`).subscribe({
      error: () => {
        // Rollback
        if (removed) {
          this._products.update(list => [...list, removed]);
        }
        this._error.set('Failed to remove product');
      },
    });
  }
}
```

---

## 8. NgRx Store 概覽

### 8.1 何時需要 NgRx Store？

NgRx Store 是基於 Redux 模式的狀態管理函式庫，適用於大型、複雜的應用程式。

**適用場景**：
- 大型團隊（5+ 開發者）
- 狀態結構複雜（多個功能模組共享狀態）
- 需要嚴格的狀態變更可預測性
- 需要時間旅行除錯 (time-travel debugging)
- 企業級應用

**不適用場景**：
- 中小型應用
- 團隊不熟悉 Redux 模式
- 狀態結構簡單

### 8.2 核心概念

```
使用者動作 → Action → Reducer → Store(State) → Selector → 元件
                 ↓
              Effect → API 呼叫 → 新的 Action
```

| 概念 | 說明 | C# 對照 |
|------|------|---------|
| **Store** | 狀態容器（單一來源） | 類似集中化的 DbContext |
| **Action** | 描述「發生了什麼事」的事件物件 | 類似 MediatR 的 IRequest |
| **Reducer** | 純函式，接收 state + action，回傳新 state | 類似 Aggregate 的 Apply 方法 |
| **Effect** | 處理副作用（API 呼叫、導航等） | 類似 MediatR 的 IRequestHandler |
| **Selector** | 從 Store 中提取資料的純函式 | 類似 LINQ 查詢 |

### 8.3 基本範例

```typescript
// --- Actions ---
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const BooksActions = createActionGroup({
  source: 'Books',
  events: {
    'Load Books': emptyProps(),
    'Load Books Success': props<{ books: Book[] }>(),
    'Load Books Failure': props<{ error: string }>(),
    'Add Book': props<{ book: Book }>(),
    'Remove Book': props<{ bookId: string }>(),
  },
});

// --- State & Reducer ---
import { createReducer, on } from '@ngrx/store';

export interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
};

export const booksReducer = createReducer(
  initialState,
  on(BooksActions.loadBooks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(BooksActions.loadBooksSuccess, (state, { books }) => ({
    ...state,
    books,
    loading: false,
  })),
  on(BooksActions.loadBooksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(BooksActions.addBook, (state, { book }) => ({
    ...state,
    books: [...state.books, book],
  })),
  on(BooksActions.removeBook, (state, { bookId }) => ({
    ...state,
    books: state.books.filter(b => b.id !== bookId),
  })),
);

// --- Selectors ---
import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectBooksState = createFeatureSelector<BooksState>('books');

export const selectAllBooks = createSelector(
  selectBooksState,
  (state) => state.books,
);

export const selectBooksLoading = createSelector(
  selectBooksState,
  (state) => state.loading,
);

export const selectBooksError = createSelector(
  selectBooksState,
  (state) => state.error,
);

export const selectBookCount = createSelector(
  selectAllBooks,
  (books) => books.length,
);

// --- Effects ---
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { switchMap, map, catchError, of } from 'rxjs';

export const loadBooks$ = createEffect(
  (actions$ = inject(Actions), bookService = inject(BookService)) =>
    actions$.pipe(
      ofType(BooksActions.loadBooks),
      switchMap(() =>
        bookService.getAll().pipe(
          map(books => BooksActions.loadBooksSuccess({ books })),
          catchError(error =>
            of(BooksActions.loadBooksFailure({ error: error.message }))
          ),
        )
      ),
    ),
  { functional: true },
);

// --- Usage in Component ---
@Component({
  selector: 'app-book-list',
  template: `
    @if (loading()) {
      <app-spinner />
    } @else {
      @for (book of books(); track book.id) {
        <app-book-card [book]="book" />
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookList {
  private readonly store = inject(Store);

  protected readonly books = this.store.selectSignal(selectAllBooks);
  protected readonly loading = this.store.selectSignal(selectBooksLoading);

  constructor() {
    this.store.dispatch(BooksActions.loadBooks());
  }
}
```

---

## 9. NgRx SignalStore

### 9.1 概觀

NgRx SignalStore 是一個輕量級、基於 Signal 的狀態管理方案。它比傳統 NgRx Store 更簡潔，且完全基於 Angular Signals。

> **C# 對照**：如果 NgRx Store 是完整的 CQRS + Event Sourcing，那 SignalStore 就是輕量的 Repository Pattern + DTO。

### 9.2 基本結構

```typescript
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';

interface CounterState {
  count: number;
  incrementAmount: number;
}

const initialState: CounterState = {
  count: 0,
  incrementAmount: 1,
};

export const CounterStore = signalStore(
  // Define state shape
  withState(initialState),

  // Derived state
  withComputed((store) => ({
    doubleCount: computed(() => store.count() * 2),
    isPositive: computed(() => store.count() > 0),
  })),

  // Methods
  withMethods((store) => ({
    increment(): void {
      patchState(store, { count: store.count() + store.incrementAmount() });
    },
    decrement(): void {
      patchState(store, { count: store.count() - store.incrementAmount() });
    },
    reset(): void {
      patchState(store, { count: 0 });
    },
    setIncrementAmount(amount: number): void {
      patchState(store, { incrementAmount: amount });
    },
  })),

  // Lifecycle hooks
  withHooks({
    onInit(store) {
      console.log('CounterStore initialized, count:', store.count());
    },
    onDestroy(store) {
      console.log('CounterStore destroyed, final count:', store.count());
    },
  }),
);
```

### 9.3 `withState()` — 狀態定義

```typescript
interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  filter: 'all',
  loading: false,
  error: null,
};

export const TodoStore = signalStore(
  { providedIn: 'root' }, // Optional: scope declaration
  withState(initialState),
  // ...
);
```

**`patchState()` 更新狀態**：

```typescript
withMethods((store) => ({
  setFilter(filter: TodoState['filter']): void {
    patchState(store, { filter });
  },
  setLoading(loading: boolean): void {
    patchState(store, { loading });
  },
  // patchState with updater function
  addTodo(todo: Todo): void {
    patchState(store, (state) => ({
      todos: [...state.todos, todo],
    }));
  },
})),
```

### 9.4 `withComputed()` — 衍生狀態

```typescript
withComputed((store) => ({
  activeTodos: computed(() =>
    store.todos().filter(t => !t.completed)
  ),
  completedTodos: computed(() =>
    store.todos().filter(t => t.completed)
  ),
  filteredTodos: computed(() => {
    const filter = store.filter();
    const todos = store.todos();
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default: return todos;
    }
  }),
  stats: computed(() => {
    const todos = store.todos();
    return {
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length,
    };
  }),
})),
```

### 9.5 `withMethods()` — 行為定義

```typescript
withMethods((store, todoService = inject(TodoService)) => ({
  // Synchronous methods
  addTodo(text: string): void {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    patchState(store, (state) => ({
      todos: [...state.todos, newTodo],
    }));
  },

  toggleTodo(id: string): void {
    patchState(store, (state) => ({
      todos: state.todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    }));
  },

  removeTodo(id: string): void {
    patchState(store, (state) => ({
      todos: state.todos.filter(t => t.id !== id),
    }));
  },

  clearCompleted(): void {
    patchState(store, (state) => ({
      todos: state.todos.filter(t => !t.completed),
    }));
  },

  // Async method with API call
  async loadAll(): Promise<void> {
    patchState(store, { loading: true, error: null });
    try {
      const todos = await firstValueFrom(todoService.getAll());
      patchState(store, { todos, loading: false });
    } catch (err) {
      patchState(store, {
        loading: false,
        error: (err as Error).message,
      });
    }
  },

  // Async method with optimistic update
  async saveTodo(todo: Todo): Promise<void> {
    // Optimistic: add immediately
    patchState(store, (state) => ({
      todos: [...state.todos, todo],
    }));

    try {
      const saved = await firstValueFrom(todoService.create(todo));
      // Replace temp with server version
      patchState(store, (state) => ({
        todos: state.todos.map(t => t.id === todo.id ? saved : t),
      }));
    } catch {
      // Rollback
      patchState(store, (state) => ({
        todos: state.todos.filter(t => t.id !== todo.id),
        error: 'Failed to save todo',
      }));
    }
  },
})),
```

### 9.6 `withHooks()` — 生命週期

```typescript
withHooks({
  onInit(store) {
    // Called when the store is first used
    // Great for loading initial data
    store.loadAll();

    // Persist state changes to localStorage
    effect(() => {
      const todos = store.todos();
      localStorage.setItem('todos', JSON.stringify(todos));
    });
  },
  onDestroy(store) {
    // Called when the store is destroyed
    console.log('Store destroyed');
  },
}),
```

### 9.7 `withEntities()` — 實體管理

NgRx Signals 提供 `withEntities()` 用於管理實體集合（CRUD 操作）。

```typescript
import { signalStore, withMethods, withHooks } from '@ngrx/signals';
import {
  withEntities,
  addEntity,
  updateEntity,
  removeEntity,
  setAllEntities,
  setEntities,
} from '@ngrx/signals/entities';
import { computed, inject } from '@angular/core';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export const TodoStore = signalStore(
  { providedIn: 'root' },

  // Provides: entities(), ids(), entityMap()
  withEntities<Todo>(),

  withComputed((store) => ({
    activeTodos: computed(() =>
      store.entities().filter(t => !t.completed)
    ),
    completedTodos: computed(() =>
      store.entities().filter(t => t.completed)
    ),
    todoCount: computed(() => store.ids().length),
  })),

  withMethods((store, todoService = inject(TodoService)) => ({
    add(text: string): void {
      const todo: Todo = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: new Date(),
      };
      patchState(store, addEntity(todo));
    },

    toggle(id: string): void {
      const entity = store.entityMap()[id];
      if (entity) {
        patchState(store, updateEntity({
          id,
          changes: { completed: !entity.completed },
        }));
      }
    },

    remove(id: string): void {
      patchState(store, removeEntity(id));
    },

    async loadAll(): Promise<void> {
      const todos = await firstValueFrom(todoService.getAll());
      patchState(store, setAllEntities(todos));
    },
  })),

  withHooks({
    onInit(store) {
      store.loadAll();
    },
  }),
);
```

**Entity 工具函式**：

| 函式 | 說明 |
|------|------|
| `addEntity(entity)` | 新增一個實體 |
| `addEntities(entities)` | 新增多個實體 |
| `setEntity(entity)` | 設定（upsert）一個實體 |
| `setEntities(entities)` | 設定一部份的實體 |
| `setAllEntities(entities)` | 替換所有實體 |
| `updateEntity({ id, changes })` | 更新一個實體的部分屬性 |
| `updateAllEntities(changes)` | 更新所有實體 |
| `removeEntity(id)` | 移除一個實體 |
| `removeEntities(ids)` | 移除多個實體 |
| `removeAllEntities()` | 移除所有實體 |

### 9.8 在元件中使用 SignalStore

```typescript
@Component({
  selector: 'app-todo-page',
  // If store is providedIn: 'root', no need to add to providers
  // If scoped, add: providers: [TodoStore]
  template: `
    <h1>Todos ({{ store.todoCount() }})</h1>

    <form (ngSubmit)="addTodo()">
      <input [(ngModel)]="newTodoText" name="text" placeholder="What needs to be done?" />
      <button type="submit" [disabled]="!newTodoText.trim()">Add</button>
    </form>

    <nav>
      <button (click)="store.setFilter('all')" [class.active]="store.filter() === 'all'">
        All
      </button>
      <button (click)="store.setFilter('active')" [class.active]="store.filter() === 'active'">
        Active ({{ store.stats().active }})
      </button>
      <button (click)="store.setFilter('completed')" [class.active]="store.filter() === 'completed'">
        Completed ({{ store.stats().completed }})
      </button>
    </nav>

    @if (store.loading()) {
      <app-spinner />
    } @else if (store.error(); as err) {
      <app-error [message]="err" />
    } @else {
      @for (todo of store.filteredTodos(); track todo.id) {
        <div class="todo-item" [class.completed]="todo.completed">
          <input type="checkbox"
                 [checked]="todo.completed"
                 (change)="store.toggleTodo(todo.id)" />
          <span>{{ todo.text }}</span>
          <button (click)="store.removeTodo(todo.id)">Delete</button>
        </div>
      } @empty {
        <p>No todos to display.</p>
      }
    }

    @if (store.stats().completed > 0) {
      <button (click)="store.clearCompleted()">
        Clear completed ({{ store.stats().completed }})
      </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoPage {
  protected readonly store = inject(TodoStore);
  protected newTodoText = '';

  protected addTodo(): void {
    if (this.newTodoText.trim()) {
      this.store.addTodo(this.newTodoText.trim());
      this.newTodoText = '';
    }
  }
}
```

---

## 10. 狀態管理決策矩陣

### 10.1 方案比較表

| 方案 | 複雜度 | 學習曲線 | 樣板程式碼 | 適用規模 | DevTools |
|------|--------|---------|----------|---------|---------|
| Component signals | 低 | 低 | 無 | 單元件 | — |
| Service signals | 低-中 | 低 | 少 | 中小型 | — |
| NgRx SignalStore | 中 | 中 | 中 | 中大型 | ✅ |
| NgRx Store (Redux) | 高 | 高 | 多 | 大型企業 | ✅ |

### 10.2 決策流程

```
你的狀態需要...

1. 只在一個元件中使用？
   → Component signal (signal, computed, linkedSignal)

2. 在幾個相關元件之間共享？
   → Service with signals (Injectable + signal + asReadonly)

3. 在多個不相關的功能之間共享，需要結構化？
   → NgRx SignalStore (signalStore + withState/withMethods/withEntities)

4. 大型團隊 (5+)、複雜領域、需要嚴格的資料流可預測性？
   → NgRx Store (Actions + Reducers + Effects + Selectors)
```

### 10.3 按團隊規模推薦

| 團隊規模 | 推薦方案 | 原因 |
|---------|---------|------|
| 1-2 人 | Service signals | 簡單、快速、夠用 |
| 3-5 人 | NgRx SignalStore | 結構化但不過度工程 |
| 5-10 人 | NgRx SignalStore 或 NgRx Store | 取決於狀態複雜度 |
| 10+ 人 | NgRx Store | 嚴格的架構保證一致性 |

### 10.4 按狀態特性推薦

| 狀態特性 | 推薦方案 |
|---------|---------|
| UI 狀態（開/關、選擇） | Component signal |
| 表單狀態 | Component signal + linkedSignal |
| 快取的 API 回應 | Service signal 或 resource() |
| 全域使用者/認證狀態 | Service signal |
| CRUD 實體管理 | NgRx SignalStore + withEntities |
| 多步驟 wizard 狀態 | Scoped service signal |
| 複雜的跨功能狀態 | NgRx Store |

---

## 11. 不可變性與變更偵測

### 11.1 為什麼不可變性重要？

Angular 的 `OnPush` 變更偵測策略依賴 **引用比較** (reference equality) 來判斷輸入是否改變。如果你原地修改物件，引用不變，Angular 不會重新渲染。

```typescript
// ❌ MUTABLE — reference doesn't change, OnPush won't detect
const users = this.users();
users.push(newUser);
this.users.set(users); // Same reference! OnPush ignores this.

// ✅ IMMUTABLE — new reference triggers change detection
this.users.update(list => [...list, newUser]); // New array reference
```

> **C# 對照**：這類似 .NET 的 `ImmutableList<T>` vs `List<T>`。在前端，不可變性不僅是好習慣，而是 OnPush 正常運作的必要條件。

### 11.2 不可變操作速查表

#### 陣列操作

```typescript
const items = signal<Item[]>([]);

// Add item
items.update(list => [...list, newItem]);

// Remove item
items.update(list => list.filter(item => item.id !== targetId));

// Update item
items.update(list =>
  list.map(item => item.id === targetId ? { ...item, name: 'New Name' } : item)
);

// Insert at position
items.update(list => [
  ...list.slice(0, index),
  newItem,
  ...list.slice(index),
]);

// Sort (return new array)
items.update(list => [...list].sort((a, b) => a.name.localeCompare(b.name)));

// Move item
items.update(list => {
  const result = [...list];
  const [moved] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, moved);
  return result;
});
```

#### 物件操作

```typescript
const user = signal<User>({
  id: '1',
  name: 'Alice',
  settings: {
    theme: 'light',
    notifications: true,
  },
});

// Update top-level property
user.update(u => ({ ...u, name: 'Bob' }));

// Update nested property
user.update(u => ({
  ...u,
  settings: {
    ...u.settings,
    theme: 'dark',
  },
}));

// Delete a property (using destructuring)
user.update(({ settings, ...rest }) => rest as User);
```

#### Map/Set 操作

```typescript
const cache = signal(new Map<string, User>());

// Add entry
cache.update(map => {
  const next = new Map(map);
  next.set(key, value);
  return next;
});

// Delete entry
cache.update(map => {
  const next = new Map(map);
  next.delete(key);
  return next;
});

const tags = signal(new Set<string>());

// Add to set
tags.update(set => new Set([...set, 'new-tag']));

// Remove from set
tags.update(set => {
  const next = new Set(set);
  next.delete('old-tag');
  return next;
});
```

### 11.3 OnPush 變更偵測流程

```
OnPush 元件何時重新渲染？

1. Input 引用改變
   signal input: input() 的新值 (reference changed)
   decorator: @Input() 的新值 (reference changed)

2. Signal 值改變
   computed() 依賴的 signal 改變
   template 中讀取的 signal 改變

3. 事件觸發
   (click)、(input) 等 DOM 事件
   output().emit()

4. 手動觸發
   markForCheck()  ← 很少需要
   async pipe 觸發

不會觸發重新渲染：
  - 物件/陣列的屬性原地修改（引用未變）
  - setTimeout/setInterval 中的改變（除非改變 signal）
  - 第三方函式庫的 DOM 修改
```

---

## 12. 完整範例：TodoStore

以下是一個完整的 NgRx SignalStore Todo 應用，包含 CRUD 操作和樂觀更新。

### 12.1 型別定義

```typescript
// todo.model.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string;
}

export type CreateTodoDto = Pick<Todo, 'text'>;
export type UpdateTodoDto = Partial<Pick<Todo, 'text' | 'completed'>>;

export type TodoFilter = 'all' | 'active' | 'completed';
```

### 12.2 Todo API Service

```typescript
// todo-api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Todo, CreateTodoDto, UpdateTodoDto } from './todo.model';

@Injectable({ providedIn: 'root' })
export class TodoApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/todos';

  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl);
  }

  getById(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateTodoDto): Observable<Todo> {
    return this.http.post<Todo>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateTodoDto): Observable<Todo> {
    return this.http.patch<Todo>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

### 12.3 NgRx SignalStore — TodoStore

```typescript
// todo.store.ts
import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import {
  withEntities,
  addEntity,
  updateEntity,
  removeEntity,
  setAllEntities,
} from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { TodoApiService } from './todo-api.service';
import type { Todo, TodoFilter, CreateTodoDto, UpdateTodoDto } from './todo.model';

interface TodoStoreState {
  filter: TodoFilter;
  loading: boolean;
  error: string | null;
  saving: Set<string>; // Track IDs being saved
}

const initialState: TodoStoreState = {
  filter: 'all',
  loading: false,
  error: null,
  saving: new Set<string>(),
};

export const TodoStore = signalStore(
  { providedIn: 'root' },

  withEntities<Todo>(),
  withState(initialState),

  // --- Derived State ---
  withComputed((store) => {
    const activeTodos = computed(() =>
      store.entities().filter(t => !t.completed)
    );

    const completedTodos = computed(() =>
      store.entities().filter(t => t.completed)
    );

    const filteredTodos = computed(() => {
      switch (store.filter()) {
        case 'active': return activeTodos();
        case 'completed': return completedTodos();
        default: return store.entities();
      }
    });

    const stats = computed(() => ({
      total: store.entities().length,
      active: activeTodos().length,
      completed: completedTodos().length,
    }));

    const allCompleted = computed(() =>
      store.entities().length > 0 && activeTodos().length === 0
    );

    return {
      activeTodos,
      completedTodos,
      filteredTodos,
      stats,
      allCompleted,
    };
  }),

  // --- Methods ---
  withMethods((store, api = inject(TodoApiService)) => {
    // Helper: mark an ID as saving/not-saving
    function setSaving(id: string, isSaving: boolean): void {
      patchState(store, (state) => {
        const next = new Set(state.saving);
        if (isSaving) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return { saving: next };
      });
    }

    return {
      // --- Synchronous ---
      setFilter(filter: TodoFilter): void {
        patchState(store, { filter });
      },

      clearError(): void {
        patchState(store, { error: null });
      },

      isSaving(id: string): boolean {
        return store.saving().has(id);
      },

      // --- Async: Load ---
      async loadAll(): Promise<void> {
        patchState(store, { loading: true, error: null });
        try {
          const todos = await firstValueFrom(api.getAll());
          patchState(store, setAllEntities(todos));
          patchState(store, { loading: false });
        } catch (err) {
          patchState(store, {
            loading: false,
            error: `Failed to load todos: ${(err as Error).message}`,
          });
        }
      },

      // --- Async: Create (optimistic) ---
      async addTodo(text: string): Promise<void> {
        const tempId = `temp-${crypto.randomUUID()}`;
        const now = new Date().toISOString();

        // Optimistic: add immediately
        const optimistic: Todo = {
          id: tempId,
          text,
          completed: false,
          createdAt: now,
          updatedAt: now,
        };
        patchState(store, addEntity(optimistic));
        setSaving(tempId, true);

        try {
          const created = await firstValueFrom(api.create({ text }));
          // Replace temp with server version
          patchState(store, removeEntity(tempId));
          patchState(store, addEntity(created));
        } catch {
          // Rollback
          patchState(store, removeEntity(tempId));
          patchState(store, { error: 'Failed to add todo' });
        } finally {
          setSaving(tempId, false);
        }
      },

      // --- Async: Toggle (optimistic) ---
      async toggleTodo(id: string): Promise<void> {
        const todo = store.entityMap()[id];
        if (!todo) return;

        const newCompleted = !todo.completed;

        // Optimistic update
        patchState(store, updateEntity({
          id,
          changes: { completed: newCompleted },
        }));
        setSaving(id, true);

        try {
          await firstValueFrom(api.update(id, { completed: newCompleted }));
        } catch {
          // Rollback
          patchState(store, updateEntity({
            id,
            changes: { completed: todo.completed },
          }));
          patchState(store, { error: 'Failed to update todo' });
        } finally {
          setSaving(id, false);
        }
      },

      // --- Async: Update text ---
      async updateTodo(id: string, dto: UpdateTodoDto): Promise<void> {
        const original = store.entityMap()[id];
        if (!original) return;

        // Optimistic update
        patchState(store, updateEntity({ id, changes: dto }));
        setSaving(id, true);

        try {
          const updated = await firstValueFrom(api.update(id, dto));
          patchState(store, updateEntity({ id, changes: updated }));
        } catch {
          // Rollback to original
          patchState(store, updateEntity({ id, changes: original }));
          patchState(store, { error: 'Failed to update todo' });
        } finally {
          setSaving(id, false);
        }
      },

      // --- Async: Delete (optimistic) ---
      async removeTodo(id: string): Promise<void> {
        const original = store.entityMap()[id];
        if (!original) return;

        // Optimistic remove
        patchState(store, removeEntity(id));

        try {
          await firstValueFrom(api.delete(id));
        } catch {
          // Rollback: re-add the entity
          patchState(store, addEntity(original));
          patchState(store, { error: 'Failed to delete todo' });
        }
      },

      // --- Async: Toggle all ---
      async toggleAll(): Promise<void> {
        const allCompleted = store.allCompleted();
        const targetState = !allCompleted;

        // Optimistic: toggle all
        const original = store.entities();
        for (const todo of original) {
          patchState(store, updateEntity({
            id: todo.id,
            changes: { completed: targetState },
          }));
        }

        try {
          await Promise.all(
            original
              .filter(t => t.completed !== targetState)
              .map(t => firstValueFrom(api.update(t.id, { completed: targetState })))
          );
        } catch {
          // Rollback
          patchState(store, setAllEntities(original));
          patchState(store, { error: 'Failed to toggle all todos' });
        }
      },

      // --- Async: Clear completed ---
      async clearCompleted(): Promise<void> {
        const completed = store.completedTodos();

        // Optimistic remove
        for (const todo of completed) {
          patchState(store, removeEntity(todo.id));
        }

        try {
          await Promise.all(
            completed.map(t => firstValueFrom(api.delete(t.id)))
          );
        } catch {
          // Rollback
          for (const todo of completed) {
            patchState(store, addEntity(todo));
          }
          patchState(store, { error: 'Failed to clear completed todos' });
        }
      },
    };
  }),

  // --- Lifecycle ---
  withHooks({
    onInit(store) {
      // Load todos when store initializes
      store.loadAll();
    },
  }),
);
```

### 12.4 Todo Page Component

```typescript
// todo.page.ts
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TodoStore } from './todo.store';
import type { TodoFilter } from './todo.model';

@Component({
  selector: 'app-todo-page',
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="todo-app">
      <h1>Todos</h1>

      <!-- Error Banner -->
      @if (store.error(); as error) {
        <div class="error-banner" role="alert">
          <span>{{ error }}</span>
          <button mat-icon-button (click)="store.clearError()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      }

      <!-- Loading Bar -->
      @if (store.loading()) {
        <mat-progress-bar mode="indeterminate" />
      }

      <!-- New Todo Form -->
      <form class="new-todo-form" (ngSubmit)="addTodo()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>What needs to be done?</mat-label>
          <input matInput
                 [(ngModel)]="newTodoText"
                 name="todoText"
                 (keyup.enter)="addTodo()" />
        </mat-form-field>
        <button mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!newTodoText.trim()">
          Add
        </button>
      </form>

      <!-- Toggle All + Filter -->
      @if (store.stats().total > 0) {
        <div class="toolbar">
          <mat-checkbox
            [checked]="store.allCompleted()"
            [indeterminate]="store.stats().completed > 0 && !store.allCompleted()"
            (change)="store.toggleAll()">
            Toggle All
          </mat-checkbox>

          <mat-chip-listbox
            [value]="store.filter()"
            (change)="store.setFilter($event.value)">
            <mat-chip-option value="all">
              All ({{ store.stats().total }})
            </mat-chip-option>
            <mat-chip-option value="active">
              Active ({{ store.stats().active }})
            </mat-chip-option>
            <mat-chip-option value="completed">
              Completed ({{ store.stats().completed }})
            </mat-chip-option>
          </mat-chip-listbox>
        </div>
      }

      <!-- Todo List -->
      @for (todo of store.filteredTodos(); track todo.id) {
        <div class="todo-item" [class.completed]="todo.completed">
          <mat-checkbox
            [checked]="todo.completed"
            (change)="store.toggleTodo(todo.id)"
            [disabled]="store.isSaving(todo.id)">
          </mat-checkbox>

          @if (editingId() === todo.id) {
            <input class="edit-input"
                   [value]="todo.text"
                   (keyup.enter)="finishEdit(todo.id, $event)"
                   (keyup.escape)="cancelEdit()"
                   (blur)="finishEdit(todo.id, $event)" />
          } @else {
            <span class="todo-text" (dblclick)="startEdit(todo.id)">
              {{ todo.text }}
            </span>
          }

          <button mat-icon-button
                  color="warn"
                  (click)="store.removeTodo(todo.id)"
                  [disabled]="store.isSaving(todo.id)"
                  aria-label="Delete todo">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      } @empty {
        @if (!store.loading()) {
          <p class="empty-message">
            @switch (store.filter()) {
              @case ('active') { No active todos. }
              @case ('completed') { No completed todos. }
              @default { No todos yet. Add one above! }
            }
          </p>
        }
      }

      <!-- Footer -->
      @if (store.stats().completed > 0) {
        <div class="footer">
          <button mat-button
                  color="warn"
                  (click)="store.clearCompleted()">
            Clear completed ({{ store.stats().completed }})
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .todo-app {
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
    }
    .error-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffebee;
      color: #c62828;
      padding: 8px 16px;
      border-radius: 4px;
      margin-bottom: 16px;
    }
    .new-todo-form {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }
    .full-width { flex: 1; }
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .todo-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid #f5f5f5;
    }
    .todo-item.completed .todo-text {
      text-decoration: line-through;
      color: #9e9e9e;
    }
    .todo-text {
      flex: 1;
      cursor: pointer;
    }
    .edit-input {
      flex: 1;
      padding: 4px 8px;
      border: 1px solid #1976d2;
      border-radius: 4px;
      font-size: inherit;
    }
    .empty-message {
      text-align: center;
      color: #9e9e9e;
      padding: 32px;
    }
    .footer {
      padding: 16px 0;
      text-align: right;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoPage {
  protected readonly store = inject(TodoStore);
  protected newTodoText = '';
  protected readonly editingId = signal<string | null>(null);

  protected addTodo(): void {
    const text = this.newTodoText.trim();
    if (text) {
      this.store.addTodo(text);
      this.newTodoText = '';
    }
  }

  protected startEdit(id: string): void {
    this.editingId.set(id);
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
  }

  protected finishEdit(id: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const text = input.value.trim();
    if (text) {
      this.store.updateTodo(id, { text });
    }
    this.editingId.set(null);
  }
}
```

---

## 13. 常見陷阱

### 陷阱 1：在 `computed()` 中執行副作用

```typescript
// ❌ Anti-pattern: side effects in computed
const filteredItems = computed(() => {
  const items = allItems();
  console.log('Filtering...'); // Side effect!
  localStorage.setItem('lastFilter', filter()); // Side effect!
  return items.filter(i => i.category === filter());
});

// ✅ Fix: computed for derivation, effect for side effects
const filteredItems = computed(() =>
  allItems().filter(i => i.category === filter())
);

effect(() => {
  localStorage.setItem('lastFilter', filter());
});
```

**說明**：`computed()` 應該是純函式。副作用會在非預期的時間被重複執行。

---

### 陷阱 2：在 `effect()` 中設定 Signal

```typescript
// ❌ Anti-pattern: signal ping-pong
const count = signal(0);
const doubled = signal(0);

effect(() => {
  doubled.set(count() * 2); // This is a signal-to-signal sync!
});

// ✅ Fix: use computed
const doubled = computed(() => count() * 2);

// If you need a writable derived signal:
const doubled = linkedSignal({
  source: count,
  computation: (c) => c * 2,
});
```

**說明**：`effect()` 中設定 Signal 可能導致無限迴圈或多餘的變更偵測週期。

---

### 陷阱 3：忘記不可變更新

```typescript
// ❌ Bug: mutating array in place — OnPush won't detect
const todos = signal<Todo[]>([]);
todos().push({ id: '1', text: 'Buy milk', completed: false });
// Template shows stale data!

// ✅ Fix: immutable update
todos.update(list => [...list, { id: '1', text: 'Buy milk', completed: false }]);
```

---

### 陷阱 4：Observable 未取消訂閱（記憶體洩漏）

```typescript
// ❌ Memory leak: subscription lives forever
@Component({ /* ... */ })
export class DataTable implements OnInit {
  ngOnInit(): void {
    this.dataService.getData().subscribe(data => {
      this.data.set(data);
    });
    // Subscription is never cleaned up!
  }
}

// ✅ Fix 1: Use takeUntilDestroyed
@Component({ /* ... */ })
export class DataTable {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dataService = inject(DataService);
  protected readonly data = signal<Data[]>([]);

  constructor() {
    this.dataService.getData().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(data => {
      this.data.set(data);
    });
  }
}

// ✅ Fix 2: Use toSignal (auto-unsubscribes)
@Component({ /* ... */ })
export class DataTable {
  private readonly dataService = inject(DataService);
  protected readonly data = toSignal(this.dataService.getData(), {
    initialValue: [],
  });
}

// ✅ Fix 3: Use resource (auto-manages lifecycle)
@Component({ /* ... */ })
export class DataTable {
  private readonly dataService = inject(DataService);
  protected readonly dataResource = rxResource({
    loader: () => this.dataService.getData(),
  });
}
```

---

### 陷阱 5：在 async 操作後讀取 Signal（反應式上下文丟失）

```typescript
// ❌ Bug: theme() after await is NOT tracked
effect(async () => {
  const data = await fetchData();
  applyTheme(theme()); // This signal read is invisible!
});

// ✅ Fix: capture signals before await
effect(async () => {
  const currentTheme = theme(); // Tracked!
  const data = await fetchData();
  applyTheme(currentTheme);
});
```

---

### 陷阱 6：過度使用 NgRx Store

```typescript
// ❌ Over-engineering: using NgRx Store for a simple toggle
// actions.ts
export const toggleSidebar = createAction('[Layout] Toggle Sidebar');
// reducer.ts
on(toggleSidebar, state => ({ ...state, sidebarOpen: !state.sidebarOpen }))
// selector.ts
export const selectSidebarOpen = createSelector(...)
// effect.ts (none needed)
// component.ts
this.store.dispatch(toggleSidebar());
this.sidebarOpen = this.store.selectSignal(selectSidebarOpen);

// ✅ Right-sized: a simple signal
protected readonly sidebarOpen = signal(false);
protected toggleSidebar(): void {
  this.sidebarOpen.update(v => !v);
}
```

**說明**：不是所有狀態都需要集中管理。UI 級別的簡單狀態用 `signal()` 就夠了。

---

### 陷阱 7：`toSignal()` 未提供 `initialValue`

```typescript
// ❌ Result type includes undefined
const data = toSignal(this.http.get<User[]>('/api/users'));
// Type: Signal<User[] | undefined>
// Template: {{ data()?.length }} — needs null check everywhere

// ✅ Provide initialValue to avoid undefined
const data = toSignal(this.http.get<User[]>('/api/users'), {
  initialValue: [],
});
// Type: Signal<User[]>
// Template: {{ data().length }} — no null check needed
```

---

### 陷阱 8：NgRx SignalStore 中忘記使用 `patchState`

```typescript
// ❌ Bug: directly modifying store state
withMethods((store) => ({
  addItem(item: Item): void {
    store.items().push(item); // Mutation! Not through patchState!
  },
})),

// ✅ Fix: always use patchState
withMethods((store) => ({
  addItem(item: Item): void {
    patchState(store, (state) => ({
      items: [...state.items, item],
    }));
  },
})),
```

---

## 本章小結

| 概念 | 要點 |
|------|------|
| Signal 基礎 | `signal()` + `computed()` + `effect()` — 覆蓋 80% 需求 |
| 進階 Signal | `linkedSignal()` 可寫衍生狀態、`resource()` 非同步資料 |
| 唯讀暴露 | `asReadonly()` 防止外部修改 — 服務狀態的核心模式 |
| RxJS 互操作 | `toSignal()` / `toObservable()` 橋接兩個世界 |
| 元件級狀態 | 用 `signal` + `computed` + `linkedSignal` |
| 服務級狀態 | 用 `Injectable` + `signal` + `asReadonly` |
| NgRx SignalStore | `signalStore()` + `withState` + `withEntities` — 結構化狀態管理 |
| NgRx Store | Actions + Reducers + Effects — 大型企業應用 |
| 不可變性 | 永遠回傳新引用 — OnPush 正確運作的前提 |

> **下一章**：第五章：表單 (Forms) — 探討 Reactive Forms、Template-driven Forms 與 Signal Forms。
