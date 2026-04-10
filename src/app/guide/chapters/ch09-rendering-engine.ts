import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GuidePage } from '../shared/guide-page';
import { GuideChapter } from '../models/guide-chapter';

const CHAPTER: GuideChapter = {
  id: 'rendering-engine',
  number: 9,
  title: '渲染引擎與變更偵測',
  subtitle: 'Zone.js 內部機制、CD 演算法、OnPush 深度解析、Zoneless 架構、效能分析',
  icon: 'memory',
  category: 'framework-core',
  tags: ['Zone.js', 'Change Detection', 'OnPush', 'Zoneless', 'ChangeDetectorRef', 'ApplicationRef', 'Profiling'],
  estimatedMinutes: 60,
  sections: [
    // ─── Section 1: Zone.js Internals ───
    {
      id: 'zone-js-internals',
      title: 'Zone.js 運作原理',
      content: `
        <p>Zone.js 是 Angular 變更偵測的基石——它讓框架能夠「知道」何時有非同步操作完成，
        進而自動觸發 UI 更新。理解 Zone.js 的內部運作機制，是掌握 Angular 渲染引擎的第一步。</p>

        <h4>Monkey-Patching 機制</h4>
        <p>Zone.js 的核心策略是 <strong>monkey-patching</strong>：在應用啟動前，
        它會攔截並覆寫瀏覽器原生的非同步 API。被 patch 的 API 包括但不限於：</p>
        <ul>
          <li><code>setTimeout</code> / <code>setInterval</code> — 計時器類</li>
          <li><code>Promise.prototype.then</code> — 微任務（microtask）</li>
          <li><code>addEventListener</code> / <code>removeEventListener</code> — DOM 事件</li>
          <li><code>XMLHttpRequest.prototype.open/send</code> — XHR 請求</li>
          <li><code>fetch</code> — Fetch API（透過額外的 patch module）</li>
          <li><code>requestAnimationFrame</code> — 動畫幀排程</li>
          <li><code>MutationObserver</code> / <code>IntersectionObserver</code> — DOM 觀察器</li>
        </ul>
        <p>每個被 patch 的 API 在執行回呼時，都會通知當前的 Zone 實例，
        讓 Zone 能夠追蹤非同步操作的開始與結束。</p>

        <h4>Zone Fork Tree</h4>
        <p>Zone.js 使用 <strong>fork</strong>（分支）的概念建立層級結構。
        每個 Zone 都有一個 parent Zone，形成一棵 Zone 樹。
        Angular 在啟動時會從 <code>Zone.root</code> fork 出一個專屬的 <code>NgZone</code>，
        所有應用程式碼預設在這個 Zone 內執行。</p>

        <h4>NgZone 的角色</h4>
        <p><code>NgZone</code> 是 Angular 對 Zone.js 的封裝。它監聽 Zone 內的非同步活動，
        當所有微任務完成時（<code>onMicrotaskEmpty</code> 事件），自動呼叫 <code>ApplicationRef.tick()</code>
        觸發變更偵測。這就是為什麼你在 <code>setTimeout</code> 回呼中修改資料，UI 會自動更新的原因。</p>

        <h4>runOutsideAngular 的用途</h4>
        <p><code>NgZone.runOutsideAngular()</code> 讓程式碼在 Angular Zone 之外執行，
        避免觸發不必要的變更偵測。典型場景包括：高頻率的 <code>requestAnimationFrame</code> 動畫、
        <code>mousemove</code> 事件追蹤、第三方函式庫初始化（如地圖、圖表引擎）。
        當需要回到 Angular Zone 時，使用 <code>NgZone.run()</code>。</p>

        <h4>Zone.js 的代價</h4>
        <p>Monkey-patching 所有瀏覽器 API 帶來的代價不容忽視：
        bundle 大小增加約 13-15 KB（gzipped），所有非同步操作——即使與 UI 無關——都被攔截，
        堆疊追蹤被修改導致除錯困難，與某些第三方函式庫（如 Google Maps SDK）產生相容性衝突。
        這些問題促使 Angular 團隊推動 Zoneless 架構。</p>
      `,
      codeExamples: [
        {
          filename: 'zone-monkey-patch.ts',
          language: 'typescript',
          code: `// Simplified illustration of how Zone.js patches setTimeout
// (Actual Zone.js source is more complex with error handling and context propagation)
const originalSetTimeout = window.setTimeout;

window.setTimeout = function patchedSetTimeout(
  callback: (...args: unknown[]) => void,
  delay?: number,
  ...args: unknown[]
): number {
  const zone = Zone.current; // Capture the current zone

  return originalSetTimeout(function () {
    // Re-enter the captured zone before executing the callback
    zone.run(() => {
      callback(...args);
    });
    // After callback completes, zone hooks fire:
    // onInvoke → onHasTask → onMicrotaskEmpty → CD trigger
  }, delay);
};`,
          annotation: 'Zone.js monkey-patching 的簡化示意：攔截 setTimeout，在回呼執行時重新進入捕獲的 Zone，使 Angular 能偵測到非同步操作完成。',
        },
        {
          filename: 'ngzone-usage.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, inject, NgZone, signal } from '@angular/core';

@Component({
  selector: 'app-animation-demo',
  template: \`<canvas #canvas></canvas><p>FPS: {{ fps() }}</p>\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimationDemo {
  private readonly ngZone = inject(NgZone);
  protected readonly fps = signal(0);

  startAnimation(): void {
    // Run animation loop outside Angular zone to avoid triggering CD on every frame
    this.ngZone.runOutsideAngular(() => {
      let lastTime = performance.now();
      let frameCount = 0;

      const loop = (now: number): void => {
        frameCount++;
        if (now - lastTime >= 1000) {
          // Re-enter Angular zone only when updating UI state
          this.ngZone.run(() => this.fps.set(frameCount));
          frameCount = 0;
          lastTime = now;
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  }
}`,
          annotation: 'runOutsideAngular 避免高頻動畫觸發 CD；只在需要更新 Signal 時用 NgZone.run() 回到 Angular Zone。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: 'Zone.js 的 monkey-patching 是全域性的——它會影響所有 JavaScript 程式碼，包括第三方函式庫。如果某個函式庫也修改了同一個 API（如 <code>Promise</code>），可能產生衝突。這是 Zoneless 架構被推動的主要原因之一。',
        },
        {
          type: 'tip',
          content: '使用 <code>runOutsideAngular()</code> 時要特別注意：如果在外部 Zone 中修改了元件狀態但忘記回到 Angular Zone，UI 不會更新。除非你使用 Signal（在 Zoneless 模式下 Signal 自帶通知機制）。',
        },
        {
          type: 'dotnet-comparison',
          content: 'Zone.js 的 monkey-patching 類似 .NET 中的 AOP（Aspect-Oriented Programming）攔截器或 <code>AsyncLocal&lt;T&gt;</code> 在非同步上下文中傳遞狀態。兩者都是為了在非同步邊界維持執行上下文。',
        },
      ],
      diagrams: [
        {
          id: 'zone-fork-tree',
          caption: 'Zone Fork Tree — Angular 的 Zone 層級結構',
          content: `
┌─────────────────────────────────────────────────┐
│                  Zone.root                       │
│  (browser default zone, no hooks)               │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │           NgZone (Angular fork)           │  │
│  │  hooks: onMicrotaskEmpty → tick()         │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Inner Zone (app code runs here)    │  │  │
│  │  │  setTimeout, fetch, click events    │  │  │
│  │  │  all patched → notify NgZone        │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │                                           │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │  Outer Zone (runOutsideAngular)     │  │  │
│  │  │  animation loops, 3rd-party libs    │  │  │
│  │  │  NO CD trigger on completion        │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘

Flow: async op completes → Zone callback → onMicrotaskEmpty
      → ApplicationRef.tick() → root-to-leaf CD traversal
          `,
        },
      ],
    },

    // ─── Section 2: CD Algorithm ───
    {
      id: 'cd-algorithm',
      title: '變更偵測演算法',
      content: `
        <p>Angular 的變更偵測（Change Detection, CD）是一個<strong>同步的、自上而下的樹遍歷演算法</strong>。
        當 CD 被觸發時，框架會從根元件開始，沿著元件樹逐層往下，檢查每個元件的綁定是否需要更新 DOM。</p>

        <h4>觸發到執行的完整路徑</h4>
        <p>一次完整的 CD 週期經過以下步驟：</p>
        <ol>
          <li><strong>觸發</strong>：Zone.js 偵測到非同步操作完成（或 Signal 值改變），
          發出 <code>onMicrotaskEmpty</code> 事件</li>
          <li><strong>排程</strong>：<code>NgZone</code> 呼叫 <code>ApplicationRef.tick()</code></li>
          <li><strong>遍歷</strong>：<code>tick()</code> 遍歷所有 root view，
          對每個 root view 呼叫 <code>detectChanges()</code></li>
          <li><strong>檢查</strong>：對每個元件，比較模板綁定的當前值與上一次的值</li>
          <li><strong>更新</strong>：如果值不同，更新對應的 DOM 節點</li>
          <li><strong>遞迴</strong>：對該元件的所有子元件重複步驟 4-5</li>
        </ol>

        <h4>Default 模式的遍歷策略</h4>
        <p>在 Default 變更偵測模式下，<strong>每個元件都會被檢查</strong>，無論其資料是否真的改變。
        這是一個 <code>O(n)</code> 操作，其中 <code>n</code> 是元件樹中所有綁定的總數。
        對於包含數百個元件的大型應用，這可能意味著每次滑鼠點擊都要檢查數千個綁定。</p>

        <h4>髒標記機制</h4>
        <p>Angular 內部使用 <strong>dirty flag</strong>（髒標記）來追蹤哪些 view 需要檢查。
        在 Default 模式下，所有 view 的 dirty flag 在每次 CD 開始時都被設為 true。
        在 OnPush 模式下，只有被明確標記為 dirty 的 view 及其祖先才會被檢查。</p>

        <h4>單向資料流與 ExpressionChangedAfterItHasBeenChecked</h4>
        <p>Angular 強制執行<strong>單向資料流</strong>：父到子。在開發模式下，
        框架會在第一次 CD 完成後立即執行第二次 CD，驗證綁定值沒有改變。
        如果第二次檢查發現值不同，就會拋出著名的
        <code>ExpressionChangedAfterItHasBeenCheckedError</code>。
        這個設計確保了渲染結果的可預測性——UI 永遠反映單一一致的狀態快照。</p>

        <h4>CD 與 Ivy 指令集</h4>
        <p>在 Ivy 編譯器下，CD 的「檢查綁定」步驟被編譯成高效的 Ivy 指令。
        例如 <code>ɵɵproperty</code> 指令會比較新舊值，只在值改變時才呼叫 DOM API。
        這避免了使用通用 diff 演算法（如 React 的 Virtual DOM diff），讓 Angular 的 CD 在大量靜態內容的場景下更有效率。</p>
      `,
      codeExamples: [
        {
          filename: 'cd-walk-pseudocode.ts',
          language: 'typescript',
          code: `// Pseudo-code: Angular's change detection walk algorithm
function detectChangesForView(view: ViewRef): void {
  // 1. Check if this view needs checking
  if (view.cdMode === ChangeDetectionStrategy.OnPush && !view.dirty) {
    return; // Skip this subtree entirely
  }

  // 2. Update input bindings from parent to child
  updateInputBindings(view);

  // 3. Execute template update function — compiled Ivy instructions
  //    e.g., ɵɵproperty('title', ctx.title())
  //    Each instruction compares old vs new and patches DOM if different
  executeTemplateUpdateFn(view);

  // 4. Recursively check child views (depth-first, left-to-right)
  for (const child of view.childViews) {
    detectChangesForView(child);
  }

  // 5. Call lifecycle hooks
  callAfterViewCheckedHooks(view);

  // 6. Reset dirty flag (for OnPush views)
  view.dirty = false;
}

// Entry point: ApplicationRef.tick()
function tick(): void {
  for (const rootView of applicationRef.views) {
    detectChangesForView(rootView);
  }

  // DEV MODE ONLY: second pass to detect unstable bindings
  if (isDevMode()) {
    for (const rootView of applicationRef.views) {
      verifyNoChanges(rootView); // throws ExpressionChangedAfterItHasBeenCheckedError
    }
  }
}`,
          annotation: 'CD 演算法虛擬碼：從根到葉的深度優先遍歷。OnPush 元件可跳過整個子樹，大幅減少檢查量。',
        },
      ],
      tips: [
        {
          type: 'tip',
          content: '<code>ExpressionChangedAfterItHasBeenCheckedError</code> 只在開發模式拋出。它的根因通常是：在生命週期鉤子（如 <code>ngAfterViewInit</code>）中修改了父元件的綁定值，或在 <code>ngOnInit</code> 中觸發了影響模板的非同步操作。解法：使用 <code>computed()</code> 或將修改延遲到下一個微任務。',
        },
        {
          type: 'best-practice',
          content: '不要在模板中呼叫方法（如 <code>getTotal()</code>），因為每次 CD 都會重新執行。改用 <code>computed()</code> Signal——它有記憶化（memoization），只有在依賴的 Signal 改變時才重新計算。',
        },
      ],
      diagrams: [
        {
          id: 'cd-tree-traversal',
          caption: 'CD 遍歷順序 — 深度優先、自上而下',
          content: `
                    AppRoot [1]
                   /          \\
              Header [2]     Main [5]
              /     \\        /       \\
          Logo [3] Nav [4] Sidebar [6] Content [7]
                                       /        \\
                                  List [8]    Detail [9]

    Numbers = check order (depth-first, left-to-right)

    Default mode:  ALL 9 components checked every cycle
    OnPush mode:   Only dirty-marked paths checked

    Example: If only Detail [9] input changed (OnPush):
    Checked: AppRoot [1] → Main [5] → Content [7] → Detail [9]
    Skipped: Header [2], Logo [3], Nav [4], Sidebar [6], List [8]
          `,
        },
      ],
    },

    // ─── Section 3: OnPush Deep Dive ───
    {
      id: 'onpush-deep',
      title: 'OnPush 深度解析',
      content: `
        <p><code>ChangeDetectionStrategy.OnPush</code> 是 Angular 效能優化最重要的工具。
        它將元件從「每次都檢查」變成「只在需要時才檢查」。
        但要正確使用它，必須深入理解它的觸發規則和陷阱。</p>

        <h4>OnPush 的四個觸發條件</h4>
        <p>一個 OnPush 元件只有在以下四種情況下才會被標記為 dirty 並在下次 CD 時被檢查：</p>
        <ol>
          <li><strong>Input 參考改變</strong>：透過 <code>input()</code> 或 <code>@Input</code> 傳入的值
          的<strong>物件參考</strong>（reference）改變。注意：修改物件的屬性（mutation）不會觸發，
          必須傳入新的物件參考。</li>
          <li><strong>模板中的 DOM 事件</strong>：該元件模板中繫結的事件處理器被觸發
          （如 <code>(click)</code>、<code>(input)</code>）。注意：是該元件自己的模板事件，
          不是子元件的事件。</li>
          <li><strong>Async Pipe 發出新值</strong>：模板中使用的 <code>async</code> pipe
          所訂閱的 Observable 發出新值。<code>async</code> pipe 內部會自動呼叫 <code>markForCheck()</code>。</li>
          <li><strong>手動呼叫 markForCheck()</strong>：透過 <code>ChangeDetectorRef.markForCheck()</code>
          手動將元件標記為 dirty。這會沿著元件樹向上標記所有祖先。</li>
        </ol>

        <h4>什麼不會觸發 OnPush（Zone 模式下）</h4>
        <p>以下情況在 Zone 模式下的 OnPush 元件中<strong>不會</strong>自動觸發 CD：</p>
        <ul>
          <li><code>setTimeout</code> / <code>setInterval</code> 回呼中修改 class 屬性</li>
          <li>Observable 的 <code>subscribe()</code> 回呼中修改 class 屬性（未使用 async pipe）</li>
          <li>直接修改物件/陣列的屬性（mutation）而非替換參考</li>
          <li><code>signal.set()</code> / <code>signal.update()</code>（在純 Zone 模式下，
          Signal 的變更不會自動標記 OnPush 元件——除非模板中讀取了該 Signal，
          此時 Angular 的 Signal 整合會自動處理）</li>
        </ul>

        <h4>Signal 與 OnPush 的協作</h4>
        <p>在 Angular 20+ 中，當模板讀取 Signal 時，框架會建立 <strong>reactive consumer</strong>。
        Signal 值改變時，框架會精確標記該元件為 dirty，
        這比傳統的 OnPush 四條規則更精確、更自動化。
        這是 OnPush + Signal 被稱為「天作之合」的原因。</p>

        <h4>OnPush 的 dirty 標記傳播</h4>
        <p>當一個 OnPush 元件被標記為 dirty 時，它的<strong>所有祖先</strong>也會被標記。
        這是因為 CD 是自上而下的——要到達被標記的元件，必須先遍歷它的祖先鏈。
        但祖先的子樹中，未被標記的分支仍會被跳過。</p>
      `,
      codeExamples: [
        {
          filename: 'onpush-triggers.ts',
          language: 'typescript',
          code: `import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';

interface Item {
  readonly id: number;
  readonly name: string;
}

@Component({
  selector: 'app-onpush-demo',
  template: \`
    <h3>Items ({{ items().length }})</h3>
    <ul>
      @for (item of items(); track item.id) {
        <li>{{ item.name }}</li>
      }
    </ul>
    <button (click)="addItem()">Add Item (triggers CD)</button>
    <button (click)="addItemWrong()">Add Item Wrong (no CD)</button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnPushDemo {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly initialItems = input<readonly Item[]>([]);
  protected readonly items = signal<readonly Item[]>([]);

  // ✅ TRIGGERS CD — Signal.update() creates new reference + template reads signal
  protected addItem(): void {
    this.items.update(list => [
      ...list,
      { id: list.length + 1, name: \`Item \${list.length + 1}\` },
    ]);
  }

  // ❌ DOES NOT TRIGGER CD — mutating array in place, no new reference
  protected addItemWrong(): void {
    const currentItems = this.items() as Item[];
    currentItems.push({ id: 999, name: 'Ghost item' });
    // items() still returns the same array reference
    // OnPush will NOT detect this change
  }

  // Manual trigger when receiving data from non-reactive sources
  handleWebSocketMessage(item: Item): void {
    this.items.update(list => [...list, item]);
    // In pure Zone mode without Signal template binding,
    // you would need: this.cdr.markForCheck();
  }
}`,
          annotation: 'OnPush 觸發對比：Signal.update() 建立新參考會觸發 CD；直接 push 修改陣列不會觸發。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: '在 OnPush 元件中，<code>setTimeout(() => this.data = newValue)</code> 不會觸發 CD。Zone.js 會觸發全域 CD，但 OnPush 元件因為沒有 dirty 標記而被跳過。解法：使用 Signal 或手動呼叫 <code>markForCheck()</code>。',
        },
        {
          type: 'best-practice',
          content: '使用 OnPush 時，所有元件狀態都應該用 Signal 管理。這樣模板中的 Signal 讀取會自動建立 reactive binding，不需要手動呼叫 <code>markForCheck()</code>。這是最乾淨、最不容易出錯的模式。',
        },
        {
          type: 'dotnet-comparison',
          content: 'OnPush 的概念類似 Blazor 的 <code>ShouldRender()</code> 回傳 false——告訴框架「除非我說要更新，否則不要重新渲染」。Angular 的 OnPush 更細緻，它有四種自動觸發條件，不需要手動控制。',
        },
      ],
      diagrams: [
        {
          id: 'onpush-trigger-table',
          caption: 'OnPush 觸發條件對照表',
          content: `
┌────────────────────────────────────┬──────────────┬──────────────┐
│ 情境                                │ Default 模式  │ OnPush 模式   │
├────────────────────────────────────┼──────────────┼──────────────┤
│ Input 參考改變                      │     ✅        │     ✅        │
│ Input 物件屬性 mutation             │     ✅        │     ❌        │
│ 模板中的 DOM 事件                    │     ✅        │     ✅        │
│ setTimeout 修改 class 屬性          │     ✅        │     ❌        │
│ Observable subscribe 修改屬性        │     ✅        │     ❌        │
│ async pipe 新值                     │     ✅        │     ✅        │
│ Signal 在模板中被讀取且值改變         │     ✅        │     ✅        │
│ markForCheck()                     │     N/A       │     ✅        │
│ detectChanges()                    │     ✅        │     ✅        │
└────────────────────────────────────┴──────────────┴──────────────┘
          `,
        },
      ],
    },

    // ─── Section 4: Zoneless Internals ───
    {
      id: 'zoneless-internals',
      title: 'Zoneless 架構內部',
      content: `
        <p>Zoneless Angular 是框架演進的重要里程碑。它完全移除對 Zone.js 的依賴，
        改由 <strong>Signal 驅動的排程機制</strong>取代 monkey-patching 式的自動偵測。
        這不只是效能優化，更是架構層面的根本轉變。</p>

        <h4>provideZonelessChangeDetection() 做了什麼</h4>
        <p>呼叫 <code>provideZonelessChangeDetection()</code> 時，Angular 會：</p>
        <ol>
          <li>不載入 Zone.js polyfill（從 <code>polyfills</code> 配置中移除）</li>
          <li>替換內部的 <code>ChangeDetectionScheduler</code> 實作</li>
          <li>使用基於 <code>Promise.resolve()</code> 的微任務排程取代 Zone.js 的事件攔截</li>
          <li>所有 CD 觸發改由 Signal 通知機制驅動</li>
        </ol>

        <h4>ChangeDetectionScheduler 的運作</h4>
        <p>在 Zoneless 模式下，<code>ChangeDetectionScheduler</code> 負責協調 CD 的排程：</p>
        <ul>
          <li>當 Signal 值改變時，框架會標記該 Signal 的 consumer（通常是元件的模板）為 dirty</li>
          <li>Scheduler 會將一次 CD 排程到下一個<strong>微任務</strong>（microtask）</li>
          <li>在同一個事件迴圈中多次 Signal 更新會被<strong>批次處理</strong>（batched）——
          只觸發一次 CD</li>
          <li>CD 開始時，只有被標記為 dirty 的元件及其祖先會被檢查</li>
        </ul>

        <h4>批次處理的機制</h4>
        <p>批次處理是 Zoneless 的關鍵效能特性。假設一個事件處理器連續修改了 5 個 Signal：</p>
        <ol>
          <li>第一次 <code>signal.set()</code> 觸發排程：<code>Promise.resolve().then(() => tick())</code></li>
          <li>後續 4 次 <code>signal.set()</code> 發現已有排程，不重複排程</li>
          <li>當前同步程式碼全部執行完畢後，微任務佇列中的 <code>tick()</code> 才執行</li>
          <li>一次 CD 就能處理所有 5 個 Signal 的變更</li>
        </ol>

        <h4>Bundle Size 節省</h4>
        <p>移除 Zone.js 帶來顯著的 bundle size 減少。Zone.js 未壓縮約 100-120 KB，
        gzipped 約 13-15 KB。在 Zoneless 模式下，這部分完全被消除。
        此外，Zone.js 內部用於追蹤非同步任務的資料結構和邏輯也不再需要，
        整體 JavaScript 的解析和執行時間都會降低。
        對於效能敏感的行動裝置應用，這個改善尤其明顯。</p>

        <h4>遷移到 Zoneless 的檢查清單</h4>
        <p>遷移前必須確認以下所有項目：</p>
        <ol>
          <li>所有元件設定 <code>changeDetection: ChangeDetectionStrategy.OnPush</code></li>
          <li>所有可變狀態使用 Signal 管理——直接的 class 屬性賦值不會觸發 CD</li>
          <li>移除所有 <code>NgZone.run()</code> / <code>runOutsideAngular()</code> 呼叫（已無 Zone）</li>
          <li>確認第三方函式庫不依賴 Zone.js 的 monkey-patching</li>
          <li>將 <code>polyfills</code> 中的 <code>zone.js</code> 移除</li>
          <li>測試所有非同步互動：HTTP 回應後的 UI 更新、setTimeout 中的狀態更新</li>
        </ol>
      `,
      codeExamples: [
        {
          filename: 'app.config.ts',
          language: 'typescript',
          code: `import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // ❌ Before: provideZoneChangeDetection({ eventCoalescing: true }),
    // ✅ After: completely replaces Zone.js-based CD
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
  ],
};`,
          annotation: '啟用 Zoneless：一行替換即可。同時需從 angular.json 的 polyfills 中移除 zone.js。',
        },
        {
          filename: 'zoneless-service.ts',
          language: 'typescript',
          code: `import { Injectable, signal } from '@angular/core';

interface Notification {
  readonly id: number;
  readonly message: string;
  readonly read: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationStore {
  private readonly _notifications = signal<readonly Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  // In zoneless mode, Signal.update() is the ONLY way to trigger CD
  // There is no Zone.js to catch setTimeout or WebSocket callbacks
  addNotification(message: string): void {
    this._notifications.update(list => [
      ...list,
      { id: Date.now(), message, read: false },
    ]);
    // This Signal update automatically schedules CD via microtask
    // No NgZone.run() needed — there IS no NgZone
  }

  // ❌ This would NOT update UI in Zoneless mode:
  // addNotificationWrong(message: string): void {
  //   this.plainArray.push({ id: Date.now(), message, read: false });
  //   // No Signal involved → no CD scheduled → UI stale
  // }
}`,
          annotation: 'Zoneless 服務：所有狀態必須透過 Signal 管理。直接修改 class 屬性不會觸發任何 CD。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: '遷移到 Zoneless 後，<code>NgZone</code> 仍然可以注入但實際上是空操作（no-op）。<code>runOutsideAngular()</code> 的回呼仍會執行，但不再有任何效果——因為已經沒有 Angular Zone 了。務必在遷移時移除這些呼叫以避免混淆。',
        },
        {
          type: 'tip',
          content: '在 Zoneless 模式下，<code>HttpClient</code> 仍然正常運作。Angular 的 <code>HttpClient</code> 在收到回應後會透過 Signal 整合或內部排程機制觸發 CD。但如果你使用原生 <code>fetch()</code>，就必須手動用 Signal 更新狀態。',
        },
        {
          type: 'best-practice',
          content: '建議新專案直接採用 Zoneless + Signal 架構。對於既有專案，先確保所有元件都使用 OnPush 和 Signal，再移除 Zone.js。可以用 <code>provideExperimentalZonelessChangeDetection()</code>（v17-19 的 API 名稱）進行漸進式測試。',
        },
      ],
      diagrams: [
        {
          id: 'zoneless-cd-flow',
          caption: 'Zoneless CD 排程流程',
          content: `
Zone Mode:                          Zoneless Mode:
─────────────────                   ─────────────────
User click                          User click
  │                                   │
  ▼                                   ▼
Zone.js intercepts                  Event handler runs
addEventListener                      │
  │                                   ▼
  ▼                                 signal.set(newVal)
Event handler runs                    │
  │                                   ▼
  ▼                                 Mark consumer dirty
Zone detects                        Schedule microtask
onMicrotaskEmpty                    (if not already scheduled)
  │                                   │
  ▼                                   ▼
ApplicationRef.tick()               ApplicationRef.tick()
  │                                   │
  ▼                                   ▼
Check ALL components                Check ONLY dirty
(Default) or dirty                  components + ancestors
path (OnPush)
          `,
        },
      ],
    },

    // ─── Section 5: ChangeDetectorRef API ───
    {
      id: 'cdr-api',
      title: 'ChangeDetectorRef API 詳解',
      content: `
        <p><code>ChangeDetectorRef</code>（CDR）是 Angular 提供的底層 API，
        讓開發者能夠手動控制個別元件的變更偵測行為。
        雖然在 Signal 時代大部分場景不再需要手動操作 CDR，
        但理解每個方法的語義和適用場景仍然是深入理解框架的必備知識。</p>

        <h4>detectChanges()</h4>
        <p><strong>語義</strong>：立即、同步地對<strong>當前元件及其子元件</strong>執行一次 CD。
        它不會標記元件為 dirty——它直接執行 CD 邏輯。</p>
        <p><strong>特性</strong>：</p>
        <ul>
          <li>同步執行——呼叫後 DOM 立即更新</li>
          <li>只影響當前 view 及其子 view，不影響父元件或兄弟元件</li>
          <li>即使元件已被 <code>detach()</code> 分離，仍然可以手動觸發</li>
          <li>在被 detach 的元件上是唯一能觸發 CD 的方式</li>
        </ul>

        <h4>markForCheck()</h4>
        <p><strong>語義</strong>：將當前元件及其<strong>所有祖先</strong>標記為 dirty。
        不會立即執行 CD——只是標記，等下一次 CD 週期時才會檢查。</p>
        <p><strong>特性</strong>：</p>
        <ul>
          <li>非同步——只標記，不立即更新 DOM</li>
          <li>向上傳播——從當前元件到根元件的整條路徑都會被標記</li>
          <li>專為 OnPush 元件設計——Default 模式的元件不需要呼叫</li>
          <li><code>async</code> pipe 內部就是使用 <code>markForCheck()</code></li>
        </ul>

        <h4>detach() 與 reattach()</h4>
        <p><strong>detach()</strong> 將元件從 CD 樹中完全分離——全域 CD 不會檢查它。
        <strong>reattach()</strong> 重新將它加回 CD 樹。</p>
        <p><strong>適用場景</strong>：</p>
        <ul>
          <li>大量靜態內容的元件（如用戶協議、幫助文件）——渲染一次後 detach</li>
          <li>高頻更新的列表中，只有可見項目需要 reattach</li>
          <li>搭配 <code>detectChanges()</code> 實現完全手動的更新控制</li>
        </ul>

        <h4>checkNoChanges()（僅限開發模式）</h4>
        <p>手動執行 Angular 的穩定性驗證——檢查綁定值是否在 CD 後改變。
        這在自訂測試場景中有用，但不應出現在生產程式碼中。</p>

        <h4>何時使用哪個 API</h4>
        <p>在 Signal 時代，<strong>大多數情況不需要手動操作 CDR</strong>。
        Signal 的 reactive binding 會自動處理 dirty 標記和 CD 排程。
        只有在整合非 Angular 的外部事件源（如 WebSocket、第三方函式庫回呼）
        且無法使用 Signal 時，才需要考慮手動呼叫 <code>markForCheck()</code>。
        <code>detach()</code> / <code>reattach()</code> 則是極端效能優化的最後手段。</p>
      `,
      codeExamples: [
        {
          filename: 'cdr-demo.ts',
          language: 'typescript',
          code: `import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-cdr-demo',
  template: \`
    <h3>Stock Price: {{ price() }}</h3>
    <button (click)="toggleLiveUpdate()">
      {{ isLive() ? 'Pause' : 'Resume' }} Live Updates
    </button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdrDemo implements OnInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly price = signal(0);
  protected readonly isLive = signal(true);

  private ws: WebSocket | null = null;

  ngOnInit(): void {
    this.ws = new WebSocket('wss://stocks.example.com/stream');
    this.ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data as string) as { price: number };
      // Signal update in Zoneless mode: CD is auto-scheduled
      // In Zone mode with OnPush: Signal template binding handles it
      this.price.set(data.price);
    };
  }

  protected toggleLiveUpdate(): void {
    this.isLive.update(v => !v);
    if (this.isLive()) {
      // Reattach: this view will be checked in CD cycles again
      this.cdr.reattach();
    } else {
      // Detach: this view is completely removed from CD tree
      // Even Signal changes won't trigger CD for this view
      this.cdr.detach();
    }
  }

  ngOnDestroy(): void {
    this.ws?.close();
  }
}`,
          annotation: 'detach/reattach 搭配 WebSocket：暫停時 detach 避免不必要的 CD，恢復時 reattach。',
        },
        {
          filename: 'detach-static.ts',
          language: 'typescript',
          code: `import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
} from '@angular/core';

@Component({
  selector: 'app-terms-of-service',
  template: \`
    <article [innerHTML]="htmlContent()"></article>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsOfService implements AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);

  // Static content that never changes after initial render
  readonly htmlContent = input.required<string>();

  ngAfterViewInit(): void {
    // Content is rendered, no further CD needed for this component
    this.cdr.detach();
    // After detach, this component will NEVER be checked again
    // unless manually calling detectChanges() or reattach()
  }
}`,
          annotation: '靜態內容元件：渲染後立即 detach，從 CD 樹中移除，減少不必要的檢查。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: '不要在 <code>ngOnInit</code> 中呼叫 <code>detectChanges()</code>——此時元件的子 view 可能尚未完全初始化，可能導致 <code>ExpressionChangedAfterItHasBeenCheckedError</code> 或未預期的行為。如果需要在初始化後立即更新，使用 <code>afterNextRender()</code> 或 <code>AfterViewInit</code>。',
        },
        {
          type: 'tip',
          content: '<code>markForCheck()</code> 與 <code>detectChanges()</code> 的關鍵差異：前者是「標記」（非同步），後者是「執行」（同步）。大多數情況應該使用 <code>markForCheck()</code>，因為它讓 Angular 控制 CD 的時機和批次處理。<code>detectChanges()</code> 會繞過批次處理，可能導致重複 CD。',
        },
        {
          type: 'best-practice',
          content: '在 Signal 時代，優先使用 Signal 管理狀態而非手動操作 CDR。<code>signal.set()</code> 等同於自動呼叫 <code>markForCheck()</code> 且更精確。只有在整合無法使用 Signal 的第三方函式庫時，才考慮手動 CDR 操作。',
        },
      ],
    },

    // ─── Section 6: ApplicationRef ───
    {
      id: 'application-ref',
      title: 'ApplicationRef 與全域排程',
      content: `
        <p><code>ApplicationRef</code> 是 Angular 應用的頂層管理者，
        負責協調全域的變更偵測排程、應用穩定性追蹤，以及 SSR 渲染的時機控制。
        理解 <code>ApplicationRef</code> 的角色，
        是掌握 Angular 渲染引擎全貌的關鍵一環。</p>

        <h4>tick() 方法</h4>
        <p><code>ApplicationRef.tick()</code> 是觸發全域 CD 的入口。每次呼叫會：</p>
        <ol>
          <li>遍歷所有已註冊的 root view（通常只有一個 <code>AppComponent</code>）</li>
          <li>對每個 root view 呼叫 <code>detectChanges()</code>，觸發自上而下的 CD 遍歷</li>
          <li>在開發模式下，執行第二次遍歷以驗證綁定穩定性</li>
          <li>發出 CD 完成的通知</li>
        </ol>
        <p>在 Zone 模式下，<code>tick()</code> 由 NgZone 的 <code>onMicrotaskEmpty</code> 自動呼叫。
        在 Zoneless 模式下，由 <code>ChangeDetectionScheduler</code> 在微任務中呼叫。
        <strong>不建議手動呼叫 <code>tick()</code></strong>——它會觸發整個應用的 CD，
        繞過 OnPush 和 Signal 的精確更新機制。</p>

        <h4>isStable Observable</h4>
        <p><code>ApplicationRef.isStable</code> 是一個 <code>Observable&lt;boolean&gt;</code>，
        當應用沒有進行中的非同步任務（microtasks、macrotasks）時發出 <code>true</code>。</p>
        <p>「穩定」的定義：</p>
        <ul>
          <li>Zone 模式：Zone.js 追蹤的所有非同步任務都已完成</li>
          <li>Zoneless 模式：所有 scheduled CD 都已完成，沒有 pending 的 Signal 通知</li>
        </ul>
        <p><strong>關鍵用途：</strong></p>
        <ul>
          <li><strong>SSR 渲染時機</strong>：Angular Universal / SSR 會等到 <code>isStable</code>
          發出 <code>true</code> 後才序列化 HTML。如果應用永遠不穩定（如有 <code>setInterval</code>），
          SSR 會超時。</li>
          <li><strong>Service Worker</strong>：Angular Service Worker 使用 <code>isStable</code>
          來決定何時註冊 SW。</li>
          <li><strong>E2E 測試</strong>：Protractor / Playwright 可以利用 <code>isStable</code>
          確保所有非同步操作完成後再做斷言。</li>
        </ul>

        <h4>APP_INITIALIZER 與穩定性</h4>
        <p><code>APP_INITIALIZER</code> 提供的初始化函式如果回傳 <code>Promise</code> 或 <code>Observable</code>，
        Angular 會等待它們完成後才認為應用已啟動。
        在此期間，<code>isStable</code> 會持續為 <code>false</code>。
        如果某個 <code>APP_INITIALIZER</code> 永遠不 resolve，應用會卡在啟動階段。</p>

        <h4>attachView() 與 detachView()</h4>
        <p><code>ApplicationRef</code> 也管理動態建立的 view（如透過 <code>createComponent()</code>
        或 <code>ViewContainerRef</code> 動態插入的元件）。
        <code>attachView()</code> 將一個 view 加入全域 CD 範圍，
        <code>detachView()</code> 將它移除。
        這對於建立 portal、overlay、或動態內容渲染（如 CDK overlay）非常重要。</p>

        <h4>效能考量</h4>
        <p>每次 <code>tick()</code> 呼叫都是一次完整的 CD 週期。
        在大型應用中，不當地觸發 <code>tick()</code>（如在 <code>setInterval</code> 中）
        會導致嚴重的效能問題。始終依賴框架的自動排程——透過 Zone.js 或 Signal。
        如果必須手動觸發，優先使用 <code>ChangeDetectorRef.markForCheck()</code>
        只標記需要更新的元件。</p>
      `,
      codeExamples: [
        {
          filename: 'app-initializer.ts',
          language: 'typescript',
          code: `import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';

// APP_INITIALIZER delays app stability until config is loaded
function initializeApp(): () => Promise<void> {
  const http = inject(HttpClient);
  return async () => {
    const config = await firstValueFrom(
      http.get<Record<string, unknown>>('/api/config'),
    );
    // Store config for later use
    (window as Record<string, unknown>)['__APP_CONFIG__'] = config;
    // When this promise resolves, ApplicationRef.isStable can become true
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
    },
  ],
};`,
          annotation: 'APP_INITIALIZER 回傳 Promise——Angular 等待 resolve 後才認為應用穩定，SSR 才會序列化 HTML。',
        },
        {
          filename: 'stability-monitor.ts',
          language: 'typescript',
          code: `import { ApplicationRef, Component, inject, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { filter, first } from 'rxjs';

@Component({
  selector: 'app-stability-monitor',
  template: \`<p>Monitoring app stability...</p>\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StabilityMonitor implements OnInit {
  private readonly appRef = inject(ApplicationRef);

  ngOnInit(): void {
    // Wait for the app to become stable, then perform one-time operations
    this.appRef.isStable
      .pipe(
        filter((stable: boolean) => stable),
        first(),
      )
      .subscribe(() => {
        console.log('App is stable. Registering Service Worker...');
        // Safe to register SW, send analytics, preload resources
      });

    // WARNING: Do NOT do this — it prevents stability:
    // setInterval(() => this.pollServer(), 5000);
    // Instead, start polling AFTER isStable emits true
  }
}`,
          annotation: 'isStable 監聽：等待應用穩定後再執行 Service Worker 註冊等操作，避免阻塞 SSR。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: '在 SSR 場景中，如果應用永遠不穩定（例如有未清理的 <code>setInterval</code> 或永不完成的 <code>Observable</code>），Angular Universal 會等到超時才輸出 HTML。使用 <code>afterNextRender()</code> 確保這類操作只在瀏覽器中執行。',
        },
        {
          type: 'tip',
          content: '在 Zoneless 模式下，<code>isStable</code> 的語義略有不同——它不再追蹤 Zone.js 的任務佇列，而是追蹤 pending 的 CD 排程。這意味著 <code>setTimeout</code> 等原生非同步操作不會影響穩定性（除非它們觸發 Signal 更新）。',
        },
        {
          type: 'best-practice',
          content: '避免手動呼叫 <code>ApplicationRef.tick()</code>。如果你發現需要手動呼叫，通常意味著狀態管理有問題——應該改用 Signal 或 <code>markForCheck()</code>。手動 <code>tick()</code> 會觸發整個應用的 CD，完全違反 OnPush 的精確更新目標。',
        },
      ],
    },

    // ─── Section 7: Profiling ───
    {
      id: 'profiling',
      title: '效能分析實戰',
      content: `
        <p>理解變更偵測的理論之後，實戰中最重要的技能是<strong>找出效能瓶頸在哪裡</strong>。
        Angular 提供了專屬的 DevTools 分析工具，搭配 Chrome 內建的 Performance 工具，
        可以精準定位不必要的 CD 週期和昂貴的元件渲染。</p>

        <h4>Angular DevTools Profiler</h4>
        <p>Angular DevTools 是 Chrome 擴充功能，提供 Angular 專屬的分析功能：</p>
        <ul>
          <li><strong>Profiler Tab</strong>：錄製 CD 週期，顯示每次 CD 中被檢查的元件、
          渲染時間、觸發原因。火焰圖（flame chart）讓你一眼看出哪個元件最昂貴。</li>
          <li><strong>Component Explorer</strong>：即時查看元件樹、input 值、Signal 值。</li>
          <li><strong>CD 週期計數</strong>：每次 CD 都會被記錄。如果短時間內出現大量 CD 週期
          （如滑鼠移動時每幀都觸發），說明有效能問題。</li>
          <li><strong>元件渲染時間</strong>：顯示每個元件的 CD 耗時。
          如果某個元件的 CD 時間超過 1ms，值得調查。</li>
        </ul>

        <h4>Chrome Performance Tab</h4>
        <p>Chrome 內建的 Performance 工具提供更底層的分析：</p>
        <ul>
          <li><strong>Scripting</strong>：JavaScript 執行時間——包含 CD 邏輯、事件處理。</li>
          <li><strong>Rendering</strong>：瀏覽器計算版面配置（layout）和繪製順序（paint）的時間。</li>
          <li><strong>Painting</strong>：實際將像素繪製到畫面上的時間。</li>
          <li>在 Performance 錄製中搜尋 <code>detectChanges</code>、<code>tick</code>
          等關鍵字，可以找到 Angular 的 CD 呼叫及其堆疊追蹤。</li>
        </ul>

        <h4>使用 ngDoCheck 識別不必要的 CD</h4>
        <p><code>ngDoCheck</code> 在每次 CD 檢查該元件時都會被呼叫——
        無論元件的資料是否真的改變。在開發階段，可以在可疑的元件中加入 <code>console.log</code>
        來追蹤 CD 頻率：</p>
        <p>如果發現某個元件在沒有資料改變的情況下頻繁觸發 <code>ngDoCheck</code>，
        通常意味著它（或它的祖先）沒有使用 OnPush，
        或有一個不相關的事件源在不斷觸發全域 CD。</p>

        <h4>Signal 時代的分析策略</h4>
        <p>在 Signal + OnPush 的架構中，效能問題通常來自：</p>
        <ul>
          <li>模板中直接呼叫方法（每次 CD 都重新執行）——改用 <code>computed()</code></li>
          <li>大量 Signal 頻繁更新但 UI 只需要顯示最終值——使用 debounce 或批次更新</li>
          <li>大型列表沒有使用 <code>@defer</code> 或虛擬捲動——導致大量 DOM 節點</li>
          <li><code>@for</code> 的 <code>track</code> 表達式不正確——導致整個列表重建</li>
        </ul>

        <h4>量化指標</h4>
        <p>在進行效能優化時，務必建立基準（baseline）指標：</p>
        <ul>
          <li>每秒 CD 週期數（正常互動應 &lt; 10）</li>
          <li>單次 CD 週期耗時（應 &lt; 16ms 以維持 60fps）</li>
          <li>最慢元件的渲染時間</li>
          <li>Initial bundle size（移除 Zone.js 前後對比）</li>
        </ul>
      `,
      codeExamples: [
        {
          filename: 'cd-tracker.ts',
          language: 'typescript',
          code: `import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  input,
} from '@angular/core';

@Component({
  selector: 'app-expensive-list',
  template: \`
    <ul>
      @for (item of items(); track item.id) {
        <li>{{ item.name }}</li>
      }
    </ul>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensiveList implements DoCheck {
  readonly items = input.required<readonly { id: number; name: string }[]>();

  // DEV ONLY: track how often CD checks this component
  private cdCount = 0;

  ngDoCheck(): void {
    this.cdCount++;
    console.log(
      \`[ExpensiveList] CD check #\${this.cdCount} at \${performance.now().toFixed(1)}ms\`,
    );
    // If you see this firing on unrelated interactions (mouse move, typing
    // in a different component), this component is being unnecessarily checked.
    // Ensure OnPush is set on this component AND its ancestors.
  }
}`,
          annotation: 'DEV 模式追蹤：在 ngDoCheck 中加入 console.log 以觀察 CD 頻率。生產環境務必移除。',
        },
        {
          filename: 'perf-measure.ts',
          language: 'typescript',
          code: `import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-perf-monitor',
  template: \`<p>Performance monitoring active (check console)</p>\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfMonitor implements OnInit {
  private readonly appRef = inject(ApplicationRef);

  ngOnInit(): void {
    // Measure each CD cycle duration using Performance API
    let tickCount = 0;
    const originalTick = this.appRef.tick.bind(this.appRef);

    // DEV ONLY: Monkey-patch tick to measure CD duration
    this.appRef.tick = () => {
      tickCount++;
      const start = performance.now();
      originalTick();
      const duration = performance.now() - start;

      if (duration > 16) {
        console.warn(
          \`[CD #\${tickCount}] took \${duration.toFixed(2)}ms — exceeds 16ms frame budget!\`,
        );
      } else {
        console.log(\`[CD #\${tickCount}] took \${duration.toFixed(2)}ms\`);
      }
    };
  }
}`,
          annotation: 'DEV 模式 CD 計時器：monkey-patch ApplicationRef.tick() 以量測每次 CD 耗時。超過 16ms 則警告。',
        },
      ],
      tips: [
        {
          type: 'tip',
          content: '使用 Angular DevTools 的 Profiler 時，勾選「Record change detection cycles」然後執行可疑操作。火焰圖會清楚顯示哪些元件被檢查了。如果 OnPush 元件在不相關的操作中也出現在火焰圖中，檢查其祖先是否缺少 OnPush。',
        },
        {
          type: 'warning',
          content: '所有效能分析程式碼（<code>ngDoCheck console.log</code>、monkey-patch <code>tick()</code>）都必須在生產環境中移除。可以使用 <code>isDevMode()</code> 條件判斷，或透過 build 流程的 tree-shaking 自動移除。',
        },
        {
          type: 'best-practice',
          content: '效能優化的黃金法則：<strong>先量測，再優化</strong>。不要憑直覺猜測瓶頸——使用 DevTools 和 Performance tab 找到實際的 hot path，然後針對性地優化那 20% 造成 80% 問題的元件。',
        },
      ],
    },

    // ─── Section 8: CD Pitfalls ───
    {
      id: 'cd-pitfalls',
      title: '常見陷阱',
      content: `
        <p>變更偵測是 Angular 中最容易踩坑的領域之一。
        以下列出 8 個最常見的陷阱，每個都附帶程式碼範例和修復建議。</p>

        <h4>陷阱 1：模板中呼叫方法</h4>
        <p>模板中的方法呼叫（如 <code>{{ getTotal() }}</code>）在每次 CD 都會重新執行。
        如果方法包含複雜計算或陣列操作，效能影響巨大。
        <strong>修復</strong>：改用 <code>computed()</code> Signal。</p>

        <h4>陷阱 2：OnPush 中的物件 mutation</h4>
        <p>在 OnPush 元件中修改物件屬性（如 <code>this.user.name = 'new'</code>）
        不會觸發 CD，因為物件參考沒有改變。
        <strong>修復</strong>：使用 Signal 並建立新物件：
        <code>this.user.update(u => ({ ...u, name: 'new' }))</code>。</p>

        <h4>陷阱 3：在 ngAfterViewInit 中修改綁定</h4>
        <p>在 <code>ngAfterViewInit</code> 中修改模板綁定的值，
        會觸發 <code>ExpressionChangedAfterItHasBeenCheckedError</code>。
        <strong>修復</strong>：使用 <code>afterNextRender()</code> 延遲到下一個渲染週期。</p>

        <h4>陷阱 4：setInterval 阻塞穩定性</h4>
        <p><code>setInterval</code> 建立的永久性 macrotask 會讓 <code>ApplicationRef.isStable</code>
        永遠為 <code>false</code>，阻塞 SSR 渲染和 Service Worker 註冊。
        <strong>修復</strong>：使用 <code>afterNextRender()</code> 確保只在瀏覽器中執行，
        或在 <code>NgZone.runOutsideAngular()</code> 中執行。</p>

        <h4>陷阱 5：過度使用 detectChanges()</h4>
        <p>頻繁呼叫 <code>detectChanges()</code> 會繞過 Angular 的批次處理機制，
        導致同一個 CD 週期內多次重複渲染。
        <strong>修復</strong>：優先使用 <code>markForCheck()</code> 或 Signal。</p>

        <h4>陷阱 6：@for 的 track 使用 index</h4>
        <p>使用 <code>@for (item of items(); track $index)</code> 會在陣列排序或插入元素時
        導致所有 DOM 節點重建。
        <strong>修復</strong>：使用穩定的唯一識別碼：<code>track item.id</code>。</p>

        <h4>陷阱 7：在 Zone 外修改狀態忘記通知</h4>
        <p>使用 <code>runOutsideAngular()</code> 後修改了 class 屬性，但忘記回到 Angular Zone
        或呼叫 <code>markForCheck()</code>。
        <strong>修復</strong>：使用 Signal（自帶通知機制），或在修改後呼叫
        <code>NgZone.run()</code>。</p>

        <h4>陷阱 8：在 constructor 中存取 input Signal</h4>
        <p>在 constructor 中讀取 <code>input()</code> 會得到預設值，
        因為實際的 input 值尚未被 Angular 設定。
        <strong>修復</strong>：在 <code>ngOnInit</code> 中存取，或使用 <code>effect()</code>
        在值可用時自動反應。</p>
      `,
      codeExamples: [
        {
          filename: 'pitfall-method-in-template.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

interface CartItem {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
}

@Component({
  selector: 'app-cart-summary',
  imports: [CurrencyPipe],
  template: \`
    <!-- ❌ BAD: method called on every CD cycle -->
    <!-- <p>Total: {{ calculateTotal() | currency:'TWD' }}</p> -->

    <!-- ✅ GOOD: computed signal — recalculates only when items change -->
    <p>Total: {{ total() | currency:'TWD' }}</p>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummary {
  protected readonly items = signal<readonly CartItem[]>([]);

  // ❌ BAD: This runs on EVERY change detection cycle
  // calculateTotal(): number {
  //   console.log('calculateTotal called!'); // Would log every CD cycle
  //   return this.items().reduce((sum, i) => sum + i.price * i.quantity, 0);
  // }

  // ✅ GOOD: Memoized — only recalculates when items() signal changes
  protected readonly total = computed(() =>
    this.items().reduce((sum, i) => sum + i.price * i.quantity, 0),
  );
}`,
          annotation: '陷阱 1 修復：用 computed() 取代模板中的方法呼叫，利用記憶化避免每次 CD 重複計算。',
        },
        {
          filename: 'pitfall-track-expression.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

@Component({
  selector: 'app-user-list',
  template: \`
    <!-- ❌ BAD: track by index — all DOM nodes recreated on sort/insert -->
    <!--
    @for (user of users(); track $index) {
      <app-user-card [user]="user" />
    }
    -->

    <!-- ✅ GOOD: track by stable unique ID — only changed items re-render -->
    @for (user of users(); track user.id) {
      <div class="user-card">
        <strong>{{ user.name }}</strong>
        <span>{{ user.email }}</span>
      </div>
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  protected readonly users = signal<readonly User[]>([]);

  sortByName(): void {
    this.users.update(list =>
      [...list].sort((a, b) => a.name.localeCompare(b.name)),
    );
    // With track $index: ALL DOM nodes destroyed and recreated
    // With track user.id: DOM nodes just reordered (much faster)
  }
}`,
          annotation: '陷阱 6 修復：使用穩定的 user.id 作為 track 表達式，排序時只移動 DOM 節點而非重建。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: '這些陷阱中，「模板呼叫方法」和「OnPush 中的物件 mutation」是生產環境中最常見的效能問題根源。建議在 code review 中將這兩點作為必檢項目。',
        },
        {
          type: 'best-practice',
          content: '預防勝於治療：所有元件使用 OnPush、所有狀態使用 Signal、所有衍生值使用 computed()。遵循這三條規則，可以避免 80% 的 CD 相關陷阱。',
        },
      ],
      exercises: [
        {
          id: 'cd-prediction',
          title: '預測變更偵測行為',
          statement: `
<p>以下元件樹中，所有元件都使用 <code>OnPush</code> 策略：</p>
<pre>
        App (Default)
       /           \\
  Dashboard(OP)    Settings(OP)
   /       \\
Chart(OP)  Table(OP)
              \\
            Pagination(OP)
</pre>
<p>假設 <code>Table</code> 元件模板中的一個 <code>(click)</code> 事件被觸發。</p>
<p><strong>問題 1</strong>：哪些元件會在這次 CD 週期中被檢查？請列出順序。</p>
<p><strong>問題 2</strong>：如果 <code>Pagination</code> 的某個 Signal input 在同一次事件中因為 Table 的 click handler 被更新了，它會被檢查嗎？</p>
<p><strong>問題 3</strong>：如果 <code>Settings</code> 元件中有一個 <code>setInterval</code> 每秒更新一個 class 屬性（非 Signal），Settings 會在 Table 的 click 事件觸發的 CD 中被檢查嗎？</p>
          `,
          initialCode: `// Write your analysis here:
//
// Question 1 — Components checked (in order):
//
//
// Question 2 — Will Pagination be checked?
//
//
// Question 3 — Will Settings be checked?
//
`,
          hints: [
            'OnPush 元件在 DOM 事件觸發時會被標記為 dirty，dirty 標記會向上傳播到所有祖先。',
            'App 使用 Default 模式，所以它永遠會被檢查——但它的 OnPush 子元件只有在被標記為 dirty 時才會被檢查。',
            '如果 Table 的 click handler 更新了 Pagination 的 Signal input，Pagination 會被標記為 dirty。',
            'Settings 是 OnPush 且沒有被標記為 dirty（setInterval 修改的是普通屬性，不是 Signal），所以不會被檢查。',
          ],
          solution: `// Question 1 — Components checked (in order):
// 1. App (Default mode — always checked)
// 2. Dashboard (OnPush — marked dirty because child Table was marked dirty)
// 3. Chart (OnPush — NOT dirty, SKIPPED)
// 4. Table (OnPush — marked dirty by DOM event)
// 5. Pagination (depends on Q2)
//
// The check order is depth-first: App → Dashboard → Chart(skip) → Table → Pagination
// Settings branch is completely skipped.
//
// Question 2 — Will Pagination be checked?
// YES. If Table's click handler updates a Signal that is read in Pagination's
// template (via input binding), Pagination is marked dirty and will be checked
// as part of Table's subtree traversal.
//
// Question 3 — Will Settings be checked?
// NO. Settings is OnPush and was NOT marked dirty by any of the 4 triggers:
// - No Input reference change
// - No DOM event in its template
// - No async pipe emission
// - No markForCheck() call
// The setInterval modifies a plain class property, not a Signal,
// so it does NOT mark Settings as dirty.
// Note: The setInterval DOES cause Zone.js to trigger a global CD,
// but Settings is skipped because it is OnPush and not dirty.`,
        },
      ],
    },
  ],
};

@Component({
  selector: 'app-ch09',
  imports: [GuidePage],
  template: '<app-guide-page [chapter]="chapter" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ch09RenderingEngine {
  protected readonly chapter = CHAPTER;
}
