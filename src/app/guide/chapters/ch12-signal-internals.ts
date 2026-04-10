import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GuidePage } from '../shared/guide-page';
import { GuideChapter } from '../models/guide-chapter';

const CHAPTER: GuideChapter = {
  id: 'signal-internals',
  number: 12,
  title: 'Signal 響應式核心機制',
  subtitle: 'ReactiveNode、依賴追蹤圖、computed 快取、effect 排程',
  icon: 'bolt',
  category: 'framework-core',
  tags: ['Signal', 'ReactiveNode', 'Dependency Graph', 'computed', 'effect', 'linkedSignal', 'resource', 'Change Detection'],
  estimatedMinutes: 55,
  sections: [
    // ─── Section 1: Signal 內部資料結構 ───
    {
      id: 'reactive-node',
      title: 'Signal 內部資料結構',
      content: `
<p>Angular Signal 系統的核心是一個基於<strong>圖（graph）</strong>的響應式追蹤機制。
每個 Signal、computed、effect 在框架內部都被表示為一個 <code>ReactiveNode</code>。
理解 ReactiveNode 的結構和行為是深入掌握 Signal 系統的基礎。</p>

<p><code>ReactiveNode</code> 是所有響應式節點的基底介面，定義了節點在依賴圖中的角色和狀態。
根據角色不同，ReactiveNode 分為兩類：</p>
<ul>
  <li><strong>Producer（生產者）</strong>：提供值的節點。<code>WritableSignal</code>（由 <code>signal()</code> 建立）
  和 <code>computed()</code> 都是 Producer。Producer 維護一個<strong>版本計數器（version）</strong>，
  每次值改變時遞增。這個版本號是髒值追蹤的核心。</li>
  <li><strong>Consumer（消費者）</strong>：讀取值的節點。<code>computed()</code> 和 <code>effect()</code>
  都是 Consumer。Consumer 維護一個<strong>依賴列表（producers 陣列）</strong>，
  記錄它讀取了哪些 Producer，以及讀取時每個 Producer 的版本號。</li>
</ul>

<p>注意 <code>computed()</code> 同時扮演 Producer 和 Consumer 角色——
它消費上游 Signal 的值，並生產派生值給下游。
這種雙重角色使得 computed 可以形成鏈式依賴。</p>

<p><strong>ReactiveNode 的關鍵欄位</strong>：</p>
<ul>
  <li><code>version</code>（Producer 專用）：目前值的版本號。每次 <code>.set()</code> 或 <code>.update()</code>
  被呼叫時遞增。Consumer 在讀取時記錄此版本號。</li>
  <li><code>dirty</code>（Consumer 專用）：標記此 Consumer 是否可能需要重新計算。
  當任一上游 Producer 的版本號改變時，此 flag 被設為 true。</li>
  <li><code>producerNode[]</code>（Consumer 專用）：此 Consumer 依賴的所有 Producer 節點陣列。</li>
  <li><code>producerLastReadVersion[]</code>（Consumer 專用）：與 producerNode 平行的陣列，
  記錄上次讀取時每個 Producer 的版本號。用於判斷是否真正需要重算。</li>
  <li><code>consumerNode[]</code>（Producer 專用）：依賴此 Producer 的所有 Consumer 節點陣列。
  當 Producer 值改變時，遍歷此陣列通知所有 Consumer。</li>
</ul>

<p>這種雙向引用結構讓依賴圖的建立和更新非常高效：
Producer 改變時能精確通知相關 Consumer（push），
Consumer 讀取時能精確檢查依賴是否真正改變（pull）。
這就是 Signal 系統的「push-pull」混合模型。</p>

<p>版本計數器的設計避免了對值本身的深度比較——
只需要比較兩個整數就能知道依賴是否改變。
這使得髒值檢查的時間複雜度是 O(1)，與值的大小無關。</p>`,
      codeExamples: [
        {
          filename: 'reactive-node-simplified.ts',
          language: 'typescript',
          code: `// Simplified representation of Angular's internal ReactiveNode
// Source: @angular/core/primitives/signals

interface ReactiveNode {
  /** Version counter — incremented on every value change (Producer role) */
  version: number;

  /** Dirty flag — true when any dependency may have changed (Consumer role) */
  dirty: boolean;

  /** Producer dependencies of this consumer */
  producerNode: ReactiveNode[] | undefined;

  /** Version of each producer at the time this consumer last read it */
  producerLastReadVersion: number[] | undefined;

  /** Consumers that depend on this producer */
  consumerNode: ReactiveNode[] | undefined;

  /** Index of this node in each consumer's producerNode array (for fast removal) */
  producerIndexOfThis: number[] | undefined;

  /** Called when a producer's value changes — sets dirty flag on consumers */
  consumerMarkedDirty(node: ReactiveNode): void;

  /** Called to check if the producer's value has actually changed */
  producerMustRecompute(node: ReactiveNode): boolean;
}

// WritableSignal (pure Producer):
//   - version increments on .set() / .update()
//   - consumerNode[] tracks who reads this signal
//   - producerNode[] is empty (no dependencies)

// computed() (Producer + Consumer):
//   - version increments when computed value changes
//   - consumerNode[] tracks who reads the computed value
//   - producerNode[] tracks which signals it reads

// effect() (pure Consumer):
//   - dirty flag triggers re-execution
//   - producerNode[] tracks which signals it reads
//   - consumerNode[] is empty (no one reads an effect)`,
          annotation: 'ReactiveNode 是 Signal 圖的節點。version 用於髒值追蹤，producerNode/consumerNode 形成雙向依賴圖。',
        },
      ],
      tips: [
        {
          type: 'tip',
          content: 'ReactiveNode 的 version 欄位使用單調遞增的整數。Angular 使用全域的 epoch 計數器來追蹤「全域版本」，避免不同 Signal 的版本號需要協調。這個設計借鑑了資料庫的 MVCC（Multi-Version Concurrency Control）概念。',
        },
        {
          type: 'dotnet-comparison',
          content: '.NET 的響應式系統（如 System.Reactive / Rx.NET）採用純推送模型（push-only）——Observable 每次產生值就通知所有訂閱者。Angular Signal 的 push-pull 混合模型更高效：push 只傳遞「可能改變了」的通知（dirty flag），實際值在需要時才 pull。這避免了中間節點的不必要計算。',
        },
      ],
      diagrams: [
        {
          id: 'reactive-node-graph',
          caption: 'ReactiveNode 依賴圖：Producer 和 Consumer 的關係',
          content: `WritableSignal (firstName)          WritableSignal (lastName)
  ├── version: 3                       ├── version: 5
  ├── producerNode: []                 ├── producerNode: []
  └── consumerNode: [computed_A]       └── consumerNode: [computed_A]
         │                                       │
         ▼                                       ▼
    computed (fullName)  ←── Consumer reads both producers
      ├── version: 7
      ├── dirty: false
      ├── producerNode: [firstName, lastName]
      ├── producerLastReadVersion: [3, 5]     ← matches current versions
      └── consumerNode: [effect_X, computed_B]
               │                │
               ▼                ▼
         effect (logger)   computed (greeting)
           ├── dirty: false    ├── version: 7
           ├── producerNode:   ├── producerNode: [fullName]
           │   [fullName]      └── producerLastReadVersion: [7]
           └── producerLast
               ReadVersion: [7]

When firstName.set("New") →
  1. firstName.version becomes 4
  2. Push dirty to computed_A (dirty = true)
  3. Push dirty from computed_A to effect_X and computed_B
  4. On next read of fullName: pull — recompute, version becomes 8
  5. On next read of greeting: pull — check fullName.version changed → recompute`,
        },
      ],
    },

    // ─── Section 2: 依賴追蹤圖 ───
    {
      id: 'dependency-graph',
      title: '依賴追蹤圖',
      content: `
<p>Signal 系統的依賴追蹤是<strong>自動且動態</strong>的——
你不需要手動聲明依賴關係（不像 React 的 useEffect 依賴陣列），
Angular 會在 computed/effect 的執行過程中自動追蹤 Signal 讀取。
這個過程稱為<strong>追蹤上下文（Tracking Context）</strong>。</p>

<p><strong>追蹤上下文的運作機制</strong>：</p>
<ol>
  <li>當 <code>computed()</code> 或 <code>effect()</code> 開始執行時，
  框架設定一個全域的「目前 Consumer」（activeConsumer）指標。</li>
  <li>在執行過程中，每次呼叫 <code>signal.read()</code>（即 <code>signal()</code>）時，
  Signal 的 getter 會檢查是否有 activeConsumer。</li>
  <li>如果有，Signal（Producer）將自己加入 Consumer 的 <code>producerNode[]</code>，
  並將 Consumer 加入自己的 <code>consumerNode[]</code>。
  同時記錄目前 Producer 的 version 到 Consumer 的 <code>producerLastReadVersion[]</code>。</li>
  <li>執行結束後，框架清除 activeConsumer 指標。</li>
  <li><strong>關鍵步驟</strong>：框架比較新的依賴列表和舊的依賴列表，
  移除不再被讀取的 Producer 依賴（邊裁剪，edge pruning）。
  這確保了條件式讀取的正確性。</li>
</ol>

<p><strong>邊裁剪（Edge Pruning）</strong>為什麼重要？考慮以下場景：</p>
<pre><code>const showName = signal(true);
const name = signal('Alice');
const age = signal(25);
const display = computed(() => showName() ? name() : String(age()));</code></pre>

<p>當 <code>showName</code> 為 true 時，<code>display</code> 依賴 <code>showName</code> 和 <code>name</code>。
當 <code>showName</code> 變為 false 時，<code>display</code> 重新計算，
現在依賴 <code>showName</code> 和 <code>age</code>——<code>name</code> 的依賴被裁剪。
之後 <code>name</code> 改變不會讓 <code>display</code> 被標記為 dirty。
如果沒有邊裁剪，<code>name</code> 的改變會觸發不必要的重算。</p>

<p><strong>Push-Pull 混合模型</strong>：Signal 系統結合了推送和拉取兩種策略：</p>
<ul>
  <li><strong>Push 階段</strong>：當 WritableSignal 的值改變時，
  沿著 <code>consumerNode[]</code> 鏈向下傳播 dirty flag。
  這是一個「通知」操作——只設定 flag，不執行任何計算。
  傳播是 O(邊數) 的操作，非常快。</li>
  <li><strong>Pull 階段</strong>：當 Consumer 被讀取時（computed 被存取、effect 被排程執行），
  它檢查自己的 dirty flag。如果為 true，逐一比較每個 Producer 的
  <code>version</code> 和 <code>producerLastReadVersion</code>：
  <ul>
    <li>如果所有版本都匹配——值沒有真正改變（false positive），清除 dirty flag，回傳快取值</li>
    <li>如果有不匹配——重新執行 computation function，更新快取值和版本號</li>
  </ul></li>
</ul>

<p>這種設計的優勢在於<strong>避免了不必要的中間計算</strong>。
在純推送模型中，每個中間節點改變都會觸發下游的重算。
在 push-pull 模型中，dirty flag 的傳播幾乎是零成本，
實際計算只在值被讀取時才發生（lazy evaluation）。
這對於深層的 computed 鏈特別有效——
如果最終消費者（如模板）沒有讀取某個 computed，它永遠不會被計算。</p>`,
      codeExamples: [
        {
          filename: 'tracking-context-demo.ts',
          language: 'typescript',
          code: `import { signal, computed, effect } from '@angular/core';

const showName = signal(true);
const name = signal('Alice');
const age = signal(25);

// computed enters tracking context when first read
const display = computed(() => {
  // Reading showName() → registers showName as dependency
  if (showName()) {
    // Reading name() → registers name as dependency
    return name();
  } else {
    // Reading age() → registers age as dependency
    return String(age());
  }
});

// First read: showName=true → dependencies = [showName, name]
console.log(display()); // "Alice"

// Change name → display dirty → next read recomputes
name.set('Bob');
console.log(display()); // "Bob"

// Change age → display NOT dirty (age is not a dependency when showName=true)
age.set(30);
console.log(display()); // "Bob" (no recomputation!)

// Switch branch → display recomputes with new dependencies [showName, age]
showName.set(false);
console.log(display()); // "30"

// Now name changes have no effect (edge pruned)
name.set('Charlie');
console.log(display()); // "30" (no recomputation — name is pruned)

// age changes now trigger recomputation
age.set(35);
console.log(display()); // "35"`,
          annotation: '邊裁剪的效果：切換條件後，未被讀取的 Signal 的依賴被移除，不再觸發不必要的重算。',
        },
      ],
      tips: [
        {
          type: 'best-practice',
          content: '依賴追蹤是同步的——在 computed 或 effect 的函式內，所有同步讀取的 Signal 會被追蹤，但 await 之後的讀取不會被追蹤（因為追蹤上下文已在 await 時結束）。如果 effect 中有非同步邏輯，務必在 await 之前讀取所有需要追蹤的 Signal。',
        },
        {
          type: 'tip',
          content: '邊裁剪機制意味著你不需要擔心在 computed 中使用條件邏輯——不管條件怎麼變化，依賴圖始終反映實際的讀取關係。這比 React 的 useMemo 依賴陣列更安全，因為你不可能忘記列出依賴。',
        },
      ],
      diagrams: [
        {
          id: 'push-pull-model',
          caption: 'Push-Pull 混合模型：dirty 傳播（push）與值計算（pull）',
          content: `Phase 1: PUSH (dirty propagation)
═══════════════════════════════════
signal_A.set(newValue)
  │  version: 3 → 4
  │
  ├──push dirty──→ computed_X (dirty = true)
  │                    │
  │                    ├──push dirty──→ computed_Y (dirty = true)
  │                    │                    │
  │                    │                    └──push dirty──→ effect_Z (dirty = true)
  │                    │
  │                    └──push dirty──→ template binding (dirty = true)
  │
  └──push dirty──→ effect_W (dirty = true)

  Cost: O(edges) — just setting boolean flags, no computation


Phase 2: PULL (lazy evaluation on read)
════════════════════════════════════════
template reads computed_Y()
  │
  ├── computed_Y.dirty === true
  │   ├── Check producer: computed_X
  │   │   ├── computed_X.dirty === true
  │   │   │   ├── Check producer: signal_A
  │   │   │   │   └── version 4 ≠ lastRead 3 → STALE
  │   │   │   └── Recompute computed_X → new value, version 8
  │   │   └── version 8 ≠ lastRead 7 → STALE
  │   └── Recompute computed_Y → new value, version 5
  └── Return computed_Y cached value

  Note: effect_W and effect_Z are scheduled separately
        computed_Y only pulls what it needs`,
        },
      ],
    },

    // ─── Section 3: computed 快取與失效 ───
    {
      id: 'computed-cache',
      title: 'computed 快取與失效',
      content: `
<p><code>computed()</code> 是 Angular Signal 系統中最精妙的原語。
它同時是 Consumer（讀取上游 Signal）和 Producer（向下游提供值），
並且內建了高效的<strong>快取（caching）</strong>和<strong>失效（invalidation）</strong>機制。
理解 computed 的內部運作對於寫出高效能的響應式程式碼至關重要。</p>

<p><strong>惰性求值（Lazy Evaluation）</strong>：computed 只在被讀取時才計算——
如果沒有任何地方讀取 computed 的值，它的 computation function 永遠不會執行。
這與 RxJS 的 Observable（cold Observable 也是惰性的）類似，
但 computed 還有一層快取：計算結果會被儲存，直到依賴改變前不會重算。</p>

<p><strong>失效機制（Dirty Propagation）</strong>：當 computed 的任一 Producer 的值改變時，
computed 被標記為 dirty。但這並不會立即觸發重算——
dirty 只是一個「可能需要重算」的提示，實際重算延遲到下次讀取。</p>

<p><strong>Pull 階段的精確檢查</strong>：當 dirty 的 computed 被讀取時，
它不會立即重新執行 computation function。它會先執行一個更輕量的檢查：</p>
<ol>
  <li>遍歷 <code>producerNode[]</code> 陣列中的每個 Producer</li>
  <li>比較 Producer 目前的 <code>version</code> 和記錄的 <code>producerLastReadVersion</code></li>
  <li>如果某個 Producer 本身也是 computed，先遞迴觸發它的 pull 檢查</li>
  <li>如果所有 Producer 的版本號都匹配——清除 dirty flag，回傳快取值（false positive case）</li>
  <li>如果有任一版本號不匹配——重新執行 computation function</li>
</ol>

<p><strong>Glitch-Free 保證</strong>：Signal 系統確保你永遠不會觀察到不一致的中間狀態。
考慮以下場景：</p>
<pre><code>const a = signal(1);
const b = signal(2);
const sum = computed(() => a() + b());
const doubled = computed(() => sum() * 2);</code></pre>

<p>當同步執行 <code>a.set(10); b.set(20);</code> 時，<code>doubled</code> 的值保證是
<code>(10 + 20) * 2 = 60</code>。你永遠看不到中間狀態 <code>(10 + 2) * 2 = 24</code>。
這是因為 push 階段只傳播 dirty flag 而不計算值，
pull 階段在讀取 doubled 時會先遞迴更新 sum。</p>

<p><strong>等值比較（Equality Check）</strong>：computed 重算後，
會將新值與舊快取值進行比較（預設使用 <code>Object.is()</code>）。
如果新值等於舊值，computed 的 version 不會遞增——
這意味著下游 Consumer 不會被標記為 dirty。
你可以透過 <code>equal</code> 選項自訂比較邏輯。</p>

<p>這個等值檢查提供了一個重要的優化：即使上游 Signal 改變了，
如果 computed 的計算結果沒有改變，dirty 傳播就會在此停止。
例如，<code>computed(() =&gt; Math.floor(price() / 100))</code>——
price 從 150 變為 180 時，computed 的值仍然是 1，
下游的 UI 不會被更新。</p>`,
      codeExamples: [
        {
          filename: 'computed-caching.ts',
          language: 'typescript',
          code: `import { signal, computed } from '@angular/core';

// Track computation count for demonstration
let computeCount = 0;

const price = signal(150);
const taxRate = signal(0.05);

const total = computed(() => {
  computeCount++;
  console.log('total recomputed:', computeCount);
  return price() * (1 + taxRate());
});

const bucket = computed(() => {
  // Rounds to nearest hundred — absorbs small price changes
  return Math.floor(total() / 100) * 100;
});

// First read: computes total = 157.5, bucket = 100
console.log(bucket()); // 100 (computeCount: 1)

// Read again without changes: returns cached value, NO recomputation
console.log(bucket()); // 100 (computeCount: 1 — still 1!)

// Price change 150→180: total = 189, bucket = 100 (same!)
price.set(180);
// bucket is dirty, but on pull: total recomputes to 189,
// bucket recomputes to 100, which equals old value
// → bucket's version does NOT increment
// → downstream consumers are NOT notified
console.log(bucket()); // 100 (computeCount: 2 — total recomputed, but bucket unchanged)

// Price change 180→300: total = 315, bucket = 300 (changed!)
price.set(300);
console.log(bucket()); // 300 (computeCount: 3)`,
          annotation: 'computed 的快取和等值檢查：相同結果不遞增 version，阻斷下游的 dirty 傳播。',
        },
        {
          filename: 'custom-equality.ts',
          language: 'typescript',
          code: `import { signal, computed } from '@angular/core';

interface User {
  readonly id: string;
  readonly name: string;
  readonly lastSeen: Date;  // Changes frequently but often irrelevant
}

const user = signal<User>({
  id: '1',
  name: 'Alice',
  lastSeen: new Date(),
});

// Default equality (Object.is) — new object reference → always "changed"
const defaultComputed = computed(() => ({
  id: user().id,
  name: user().name,
}));

// Custom equality — compare by meaningful fields only
const optimizedComputed = computed(
  () => ({ id: user().id, name: user().name }),
  { equal: (a, b) => a.id === b.id && a.name === b.name },
);

// Update user with same id/name but different lastSeen
user.set({ id: '1', name: 'Alice', lastSeen: new Date() });

// defaultComputed: version increments (new object reference)
// optimizedComputed: version stays same (id and name unchanged)
// → downstream of optimizedComputed is NOT marked dirty`,
          annotation: '自訂 equal 函式避免因物件參考改變但實際值未變而觸發不必要的下游更新。',
        },
      ],
      tips: [
        {
          type: 'best-practice',
          content: 'computed 的 computation function 應該是純函式——沒有副作用、不修改外部狀態。Angular 不保證 computation function 的執行次數和時機（可能因為 pull 檢查而跳過執行）。如果你需要副作用，使用 effect()。',
        },
        {
          type: 'warning',
          content: '避免在 computed 中建立大型物件或陣列——每次重算都會建立新的參考，導致 Object.is() 判定為不同值，version 遞增並觸發下游更新。解決方案：使用自訂 equal 函式進行深度比較，或使用 structuredClone 等方式確保相同輸入產生相同參考。',
        },
        {
          type: 'dotnet-comparison',
          content: 'computed 的惰性求值和快取類似 C# 的 Lazy<T>，但 computed 還會自動失效和重算。在 .NET 世界中，最接近的概念是 Excel 的計算引擎——儲存格公式只在依賴改變時重算，且計算是惰性的（螢幕外的儲存格不會被計算）。',
        },
      ],
    },

    // ─── Section 4: effect 排程機制 ───
    {
      id: 'effect-scheduling',
      title: 'effect 排程機制',
      content: `
<p><code>effect()</code> 是 Signal 系統中唯一負責<strong>副作用（side effects）</strong>的原語。
與 computed 不同，effect 不產生值——它的目的是在依賴改變時執行某些動作，
如寫入 localStorage、發送分析事件、同步第三方 DOM 函式庫等。</p>

<p><strong>排程策略</strong>：effect 不會在 Signal 改變的瞬間同步執行。
Angular 使用<strong>微任務（microtask）排程</strong>來批次處理 effect 的執行：</p>
<ol>
  <li>Signal 值改變 → effect 被標記為 dirty</li>
  <li>Angular 透過 <code>queueMicrotask()</code> 排程一次 effect 執行</li>
  <li>如果在同一個同步區塊中有多個 Signal 改變，dirty flag 被多次設定，
  但 microtask 只排程一次</li>
  <li>當前同步程式碼執行完畢後，microtask 佇列開始處理</li>
  <li>effect 被執行，讀取所有依賴的最新值</li>
</ol>

<p>這個排程機制帶來一個重要的優化：<strong>批次合併（batching）</strong>。
在同一個同步區塊中改變多個 Signal，只會觸發 effect 執行一次。</p>

<p><strong>清理函式（Cleanup Function）</strong>：effect 支援回傳一個清理函式，
在下一次 effect 執行前或 effect 被銷毀時呼叫。
這對於需要「撤銷上一次操作」的場景非常有用，
如取消事件監聽、清除計時器、中止 HTTP 請求等。</p>

<p><strong>effectRef.destroy()</strong>：effect 回傳一個 <code>EffectRef</code>，
呼叫 <code>destroy()</code> 可以停止 effect 並執行最後一次清理。
在元件中建立的 effect 會在元件銷毀時自動 destroy（如果在注入上下文中建立）。
在 service 或其他位置建立的 effect 需要手動管理。</p>

<p><strong>allowSignalWrites</strong>：預設情況下，effect 內部不允許寫入 Signal——
這是為了避免意外的循環依賴和無限迴圈。
如果你確實需要在 effect 中寫入 Signal（如同步到 localStorage 後更新狀態 flag），
需要設定 <code>{ allowSignalWrites: true }</code>。
即使啟用了此選項，Angular 仍然會偵測無限迴圈並拋出錯誤。</p>

<p><strong>effect 與元件生命週期</strong>：在元件的建構子或 field initializer 中建立的 effect
會自動綁定到元件的 <code>DestroyRef</code>。當元件被銷毀時，effect 也會被銷毀。
這避免了手動清理的需要，但也意味著 effect 的生命週期與元件綁定。
如果你需要獨立於元件的 effect，在 service 中建立並手動管理 EffectRef。</p>

<p><strong>執行時機的精確理解</strong>：effect 的排程分為兩個層級。
元件 effect 透過 <code>ChangeDetectionScheduler</code> 排程，在變更偵測之前執行。
Root effect（在 service 中建立的）透過 <code>queueMicrotask</code> 排程。
這個差異影響了 effect 看到的 DOM 狀態——
元件 effect 可能在 DOM 更新前執行，
如果需要在 DOM 更新後操作，使用 <code>afterRenderEffect()</code>。</p>`,
      codeExamples: [
        {
          filename: 'effect-batching.ts',
          language: 'typescript',
          code: `import { signal, effect } from '@angular/core';

const firstName = signal('Alice');
const lastName = signal('Chen');
const age = signal(25);

let effectRunCount = 0;

// Effect reads all three signals
const effectRef = effect(() => {
  effectRunCount++;
  console.log(
    \`Effect #\${effectRunCount}: \${firstName()} \${lastName()}, age \${age()}\`
  );
});

// Output after microtask: "Effect #1: Alice Chen, age 25"

// Synchronous block: change all three signals
firstName.set('Bob');
lastName.set('Wang');
age.set(30);

// Effect does NOT run three times!
// After microtask: "Effect #2: Bob Wang, age 30"
// Only ONE execution with all final values — batching in action`,
          annotation: '同步區塊中的多次 Signal 變更只觸發 effect 執行一次。microtask 排程確保批次合併。',
        },
        {
          filename: 'effect-cleanup.ts',
          language: 'typescript',
          code: `import { signal, effect, ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-websocket-monitor',
  template: '<p>Status: {{ connectionStatus() }}</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebSocketMonitor {
  protected readonly endpoint = signal('wss://api.example.com/events');
  protected readonly connectionStatus = signal<'connecting' | 'open' | 'closed'>('closed');

  constructor() {
    effect((onCleanup) => {
      const url = this.endpoint();
      this.connectionStatus.set('connecting');

      const ws = new WebSocket(url);

      ws.onopen = () => this.connectionStatus.set('open');
      ws.onclose = () => this.connectionStatus.set('closed');
      ws.onerror = () => this.connectionStatus.set('closed');

      // Cleanup: close previous WebSocket when endpoint changes or effect is destroyed
      onCleanup(() => {
        ws.close();
        this.connectionStatus.set('closed');
      });
    }, { allowSignalWrites: true });
  }

  switchEndpoint(newUrl: string): void {
    // Changing endpoint signal triggers effect re-run:
    // 1. onCleanup from previous run → closes old WebSocket
    // 2. New effect run → opens new WebSocket
    this.endpoint.set(newUrl);
  }
}`,
          annotation: 'onCleanup 在 effect 重新執行前或銷毀時呼叫。此處用於關閉前一個 WebSocket 連線，避免資源洩漏。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: 'effect 內部預設禁止寫入 Signal。如果你發現需要 allowSignalWrites，先思考是否能用 computed() 或 linkedSignal() 替代。大多數「在 effect 中寫入 Signal」的需求其實是在同步兩個 Signal——這正是 computed 或 linkedSignal 的用途。effect 應該保留給真正的外部副作用。',
        },
        {
          type: 'best-practice',
          content: 'onCleanup 函式是 effect 參數傳入的回呼——effect((onCleanup) => { ... onCleanup(() => { /* cleanup */ }); })。它類似 React 的 useEffect return cleanup pattern，但更明確。每次 effect 重新執行前，上一次的 cleanup 會先被呼叫，確保資源正確釋放。',
        },
        {
          type: 'dotnet-comparison',
          content: 'Angular 的 effect 排程類似 .NET 的 SynchronizationContext.Post() 或 Dispatcher.InvokeAsync()——都是將操作排程到適當的時機執行，而非立即執行。批次合併的概念類似 WPF 的 InvalidateVisual()——多次呼叫只觸發一次重繪。',
        },
      ],
    },

    // ─── Section 5: linkedSignal 運作機制 ───
    {
      id: 'linked-signal',
      title: 'linkedSignal 運作機制',
      content: `
<p><code>linkedSignal()</code> 是 Angular 引入的一個獨特原語，
它結合了 <code>computed()</code> 的自動追蹤和 <code>signal()</code> 的可寫入性。
它的核心用途是：<strong>有一個從源 Signal 派生的預設值，但使用者可以覆寫它</strong>。
當源 Signal 改變時，覆寫被重置為新的計算值。</p>

<p><strong>典型場景</strong>：選擇列表中的預設選項。
當商品列表改變時（源 Signal），選中項目應該重置為第一個商品（計算值）。
但使用者可以手動選擇其他商品（覆寫值）。</p>

<p><strong>內部運作機制</strong>：linkedSignal 內部維護兩個版本追蹤：</p>
<ul>
  <li><strong>源版本（Source Version）</strong>：追蹤源 Signal 的版本號。
  類似 computed，linkedSignal 的 computation function 在追蹤上下文中執行，
  自動建立對源 Signal 的依賴。</li>
  <li><strong>本地版本（Local Version）</strong>：追蹤手動寫入的次數。
  當使用者呼叫 <code>.set()</code> 或 <code>.update()</code> 時，本地版本遞增。</li>
</ul>

<p><strong>決策邏輯</strong>：</p>
<ol>
  <li>當 linkedSignal 被讀取時，檢查源 Signal 的版本是否改變</li>
  <li>如果源版本改變了 → 重新執行 computation function，
  用計算結果覆蓋本地值，重置本地狀態</li>
  <li>如果源版本沒有改變 → 回傳目前的本地值（可能是使用者覆寫的值）</li>
  <li>當使用者呼叫 <code>.set()</code> → 更新本地值，
  但不影響源版本追蹤。下次源 Signal 改變時，本地值會被重置</li>
</ol>

<p><strong>與 computed + signal 組合的比較</strong>：
在 linkedSignal 出現之前，開發者通常用 <code>effect</code> 來實現類似行為：</p>
<pre><code>// Before linkedSignal (problematic):
const selected = signal(items()[0]);
effect(() => { selected.set(items()[0]); }); // Sync source → local</code></pre>
<p>這種模式有幾個問題：effect 的排程是非同步的（microtask），
在源改變和 effect 執行之間存在一個時間窗口，selected 的值是過時的。
而且這違反了「不要在 effect 中寫入 Signal」的最佳實踐。
linkedSignal 解決了這些問題——它的重置是同步的，發生在讀取時（pull 階段）。</p>

<p><strong>進階用法</strong>：linkedSignal 支援兩種建立方式：</p>
<ul>
  <li><strong>簡化形式</strong>：<code>linkedSignal(() =&gt; items()[0])</code>——
  computation function 回傳預設值。任何在函式中讀取的 Signal 都是源。</li>
  <li><strong>完整形式</strong>：<code>linkedSignal({ source: items, computation: list =&gt; list[0] })</code>——
  明確指定源和計算邏輯。source 可以是 Signal 或 computed。</li>
</ul>

<p>linkedSignal 在表單場景中特別有用：表單欄位的預設值來自資料庫，
使用者可以編輯，但當資料重新載入時，欄位重置為新的資料庫值。</p>`,
      codeExamples: [
        {
          filename: 'linked-signal-product-selector.ts',
          language: 'typescript',
          code: `import {
  ChangeDetectionStrategy, Component, computed,
  linkedSignal, signal,
} from '@angular/core';

interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

@Component({
  selector: 'app-product-selector',
  template: \`
    <div>
      <label for="category">Category:</label>
      <select id="category" (change)="switchCategory($event)">
        @for (cat of categories; track cat) {
          <option [value]="cat">{{ cat }}</option>
        }
      </select>
    </div>

    <div>
      <label for="product">Product:</label>
      <select id="product" (change)="selectProduct($event)">
        @for (p of products(); track p.id) {
          <option [value]="p.id" [selected]="p.id === selectedProduct().id">
            {{ p.name }} - {{ p.price | currency:'TWD' }}
          </option>
        }
      </select>
    </div>

    <p>Selected: {{ selectedProduct().name }}</p>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSelector {
  protected readonly categories = ['Electronics', 'Books', 'Clothing'];

  private readonly activeCategory = signal('Electronics');

  // Simulated product list that changes when category changes
  protected readonly products = computed<readonly Product[]>(() => {
    const cat = this.activeCategory();
    return MOCK_DATA[cat] ?? [];
  });

  // linkedSignal: defaults to first product, user can override, resets on category change
  protected readonly selectedProduct = linkedSignal<readonly Product[], Product>({
    source: this.products,
    computation: (products) => products[0],
  });

  protected switchCategory(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.activeCategory.set(value);
    // selectedProduct automatically resets to first product of new category
  }

  protected selectProduct(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    const product = this.products().find(p => p.id === id);
    if (product) {
      this.selectedProduct.set(product); // User override
    }
  }
}

const MOCK_DATA: Record<string, readonly Product[]> = {
  Electronics: [
    { id: 'e1', name: 'Keyboard', price: 2500 },
    { id: 'e2', name: 'Mouse', price: 1200 },
  ],
  Books: [
    { id: 'b1', name: 'TypeScript Handbook', price: 650 },
    { id: 'b2', name: 'Angular in Depth', price: 890 },
  ],
  Clothing: [
    { id: 'c1', name: 'T-Shirt', price: 390 },
    { id: 'c2', name: 'Jacket', price: 2800 },
  ],
};`,
          annotation: 'linkedSignal 自動在 category 切換時重置為第一個商品，使用者手動選擇時覆寫，下次 category 切換時再重置。',
        },
      ],
      tips: [
        {
          type: 'tip',
          content: 'linkedSignal 的重置是同步的（在 pull 階段），不像 effect 是非同步的（microtask）。這意味著在源 Signal 改變的同一個同步區塊中讀取 linkedSignal，就能立即得到重置後的值。這是 linkedSignal 優於 effect + signal 組合的關鍵優勢。',
        },
        {
          type: 'best-practice',
          content: '使用 linkedSignal 的時機：狀態有「預設值來自上游」且「使用者可覆寫」且「上游改變時重置」的三重特性。如果只需要派生值（不可覆寫），用 computed。如果需要獨立的可寫入狀態（不需要重置），用 signal。',
        },
      ],
    },

    // ─── Section 6: resource() 非同步狀態機 ───
    {
      id: 'resource-state-machine',
      title: 'resource() 非同步狀態機',
      content: `
<p><code>resource()</code> 是 Angular 提供的非同步資料載入原語，
它將非同步操作（如 HTTP 請求）的結果物質化（materialize）為 Signal 狀態。
在 resource 出現之前，開發者需要組合 effect + signal + loading state 來管理非同步資料——
resource 將這些模式封裝為一個統一的 API。</p>

<p><strong>狀態機</strong>：resource 內部維護一個狀態機，
透過 <code>status()</code> Signal 暴露目前狀態：</p>
<ul>
  <li><code>ResourceStatus.Idle</code>：初始狀態，尚未發起請求</li>
  <li><code>ResourceStatus.Loading</code>：請求進行中</li>
  <li><code>ResourceStatus.Resolved</code>：請求成功完成，值可用</li>
  <li><code>ResourceStatus.Error</code>：請求失敗，錯誤可用</li>
  <li><code>ResourceStatus.Reloading</code>：有快取值，正在重新載入</li>
  <li><code>ResourceStatus.Local</code>：值被手動設定（透過 <code>.set()</code>）</li>
</ul>

<p><strong>request Signal 追蹤</strong>：resource 的 <code>request</code> 參數是一個函式，
在追蹤上下文中執行。它讀取的 Signal 會被追蹤——
當這些 Signal 改變時，resource 會自動重新發起請求。
這類似 computed 的依賴追蹤，但觸發的是非同步操作而非同步計算。</p>

<p><strong>請求取消（AbortController）</strong>：當 request Signal 改變觸發新請求時，
resource 會自動取消前一個進行中的請求。內部機制：</p>
<ol>
  <li>request Signal 改變 → resource 偵測到依賴改變</li>
  <li>如果有進行中的請求，呼叫 AbortController.abort()</li>
  <li>loader 函式接收到新的 <code>abortSignal</code>，可以傳遞給 fetch() 或其他 API</li>
  <li>發起新請求，建立新的 AbortController</li>
</ol>

<p><strong>輸出 Signal</strong>：resource 暴露多個 Signal 供模板綁定：</p>
<ul>
  <li><code>value()</code>：成功時的值，載入中或錯誤時為 undefined</li>
  <li><code>status()</code>：目前的 ResourceStatus</li>
  <li><code>error()</code>：錯誤時的錯誤物件</li>
  <li><code>isLoading()</code>：布林值，Loading 或 Reloading 時為 true</li>
</ul>

<p><strong>與變更偵測的整合</strong>：resource 的 Signal 輸出與一般 Signal 完全相同——
在模板中讀取時，元件被標記為 dirty，在下一次 CD 中更新。
在 OnPush 元件中，resource 的狀態改變會自動觸發元件更新。
在 Zoneless 模式中，Signal 的變更通知 ChangeDetectionScheduler 排程 CD。</p>

<p><strong>resource 與 RxJS 的互操作</strong>：
如果你的資料來源是 Observable（如 HttpClient），
使用 <code>rxResource()</code> 替代 <code>resource()</code>——
它接受回傳 Observable 的 loader 函式，內部處理訂閱和取消訂閱。</p>`,
      codeExamples: [
        {
          filename: 'user-profile-resource.ts',
          language: 'typescript',
          code: `import {
  ChangeDetectionStrategy, Component, ResourceStatus,
  inject, resource, signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface UserProfile {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatar: string;
}

@Component({
  selector: 'app-user-profile',
  template: \`
    @switch (userResource.status()) {
      @case (ResourceStatus.Loading) {
        <div class="skeleton" aria-busy="true">Loading profile...</div>
      }
      @case (ResourceStatus.Error) {
        <div class="error" role="alert">
          Failed to load profile: {{ userResource.error() }}
          <button (click)="userResource.reload()">Retry</button>
        </div>
      }
      @case (ResourceStatus.Resolved) {
        @if (userResource.value(); as user) {
          <div class="profile">
            <img [src]="user.avatar" [alt]="user.name" />
            <h2>{{ user.name }}</h2>
            <p>{{ user.email }}</p>
          </div>
        }
      }
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile {
  private readonly http = inject(HttpClient);

  protected readonly ResourceStatus = ResourceStatus;
  protected readonly userId = signal('user-1');

  // resource: tracks userId signal, auto-fetches when it changes
  protected readonly userResource = resource<UserProfile, string>({
    request: () => this.userId(),
    loader: async ({ request: id, abortSignal }) => {
      // abortSignal cancels this request if userId changes again
      const response = await firstValueFrom(
        this.http.get<UserProfile>(\`/api/users/\${id}\`),
      );
      return response;
    },
  });

  switchUser(newId: string): void {
    // Changing userId triggers:
    // 1. Abort current in-flight request (if any)
    // 2. Set status to Loading
    // 3. Call loader with new userId
    this.userId.set(newId);
  }
}`,
          annotation: 'resource 追蹤 userId Signal，自動發起/取消請求。status() 驅動模板的 Loading/Error/Resolved 狀態切換。',
        },
      ],
      tips: [
        {
          type: 'tip',
          content: 'resource 的 request 函式可以回傳 undefined 來表示「不需要發起請求」。例如 request: () => this.userId() || undefined——當 userId 為空字串時，resource 停留在 Idle 狀態，不發起請求。這避免了載入頁面時的無效請求。',
        },
        {
          type: 'best-practice',
          content: '將 AbortSignal 傳遞給 fetch() 或其他支援的 API，讓請求在被取消時立即中止，而不是繼續在背景運行。對於 RxJS Observable，使用 rxResource() 代替手動組合 resource + firstValueFrom，因為 rxResource 會自動 unsubscribe。',
        },
        {
          type: 'dotnet-comparison',
          content: 'resource() 的設計類似 .NET 的 CancellationToken 模式——loader 接收 abortSignal 就像 async 方法接收 CancellationToken。當上游條件改變時，舊的操作被取消，新的操作被啟動。Blazor 中沒有直接等同的 API，開發者需要手動組合 CancellationTokenSource + StateHasChanged。',
        },
      ],
      diagrams: [
        {
          id: 'resource-state-machine',
          caption: 'resource() 內部狀態機轉換圖',
          content: `                ┌──────────────────────────────────────┐
                │                                      │
                ▼                                      │
          ┌──────────┐    request signal     ┌─────────┴──┐
          │   Idle   │ ──── changes ───────→ │  Loading   │
          └──────────┘                       └─────┬──┬───┘
                                                   │  │
                                    ┌──────────────┘  └──────────────┐
                                    │ loader resolves                │ loader rejects
                                    ▼                                ▼
                             ┌────────────┐                   ┌──────────┐
                             │  Resolved  │                   │  Error   │
                             └──────┬─────┘                   └────┬─────┘
                                    │                              │
              request signal changes│   request signal changes     │
                                    │   or .reload()               │
                                    ▼                              ▼
                             ┌────────────┐                 ┌──────────┐
                             │ Reloading  │                 │ Loading  │
                             │(has cached │                 │(no cache)│
                             │   value)   │                 └──────────┘
                             └──────┬──┬──┘
                                    │  │
                     loader resolves│  │loader rejects
                                    ▼  ▼
                              Resolved / Error

         Manual .set(value):
           Any state ──→ Local (value set directly, no loader call)

         .reload():
           Resolved/Error ──→ Loading/Reloading (re-invoke loader)`,
        },
      ],
    },

    // ─── Section 7: Signal 與變更偵測整合 ───
    {
      id: 'signal-cd-integration',
      title: 'Signal 與變更偵測整合',
      content: `
<p>Signal 系統不是獨立運作的——它必須與 Angular 的變更偵測（Change Detection, CD）機制整合，
才能將 Signal 的值變更反映到 DOM 上。這個整合層是理解 Signal 在 Angular 中如何工作的關鍵。</p>

<p><strong>Zoneless 模式的整合流程</strong>（推薦的現代模式）：</p>
<ol>
  <li>Signal 值改變（<code>.set()</code> / <code>.update()</code>）</li>
  <li>框架呼叫 <code>markSignalDirty()</code>——這是 Signal 到 CD 的橋接點</li>
  <li><code>markSignalDirty()</code> 呼叫 <code>ChangeDetectionScheduler.notify()</code></li>
  <li>Scheduler 透過 <code>requestAnimationFrame</code>（或 microtask，取決於配置）排程一次 CD</li>
  <li>在排程的時機，<code>ApplicationRef.tick()</code> 被呼叫</li>
  <li>tick() 遍歷元件樹，對每個 dirty 元件執行 CD</li>
  <li>CD 過程中讀取模板中使用的 Signal，取得最新值</li>
  <li>將新值與 DOM 中的舊值比較，更新有差異的部分</li>
</ol>

<p><strong>Zone 模式的整合流程</strong>（傳統模式）：</p>
<ol>
  <li>Zone.js 攔截非同步操作（setTimeout、click event、HTTP 回應等）</li>
  <li>非同步操作完成後，Zone.js 通知 Angular</li>
  <li>Angular 呼叫 <code>ApplicationRef.tick()</code></li>
  <li>tick() 遍歷<strong>整個</strong>元件樹，執行 CD（不管哪些元件 dirty）</li>
  <li>在 OnPush 模式下，只有 dirty 的子樹才會被深入檢查</li>
</ol>

<p>在 Zone 模式中，Signal 仍然可以工作——
當模板讀取 Signal 時，Angular 會建立一個特殊的 Consumer 節點（template Consumer）。
Signal 變更時，template Consumer 被標記 dirty，
進而透過 <code>markForCheck()</code> 將元件標記為需要 CD。
但 CD 的觸發仍然依賴 Zone.js。</p>

<p><strong>模板中的 Signal 讀取</strong>：Angular 的模板編譯器在偵測到模板表達式中包含
Signal 讀取（<code>mySignal()</code>）時，會產生特殊的綁定指令碼。
這些指令碼在 CD 過程中執行，讀取 Signal 值並與上一次的值比較。
由於 Signal 的值只在 <code>.set()</code> / <code>.update()</code> 時改變，
不像 method call 每次呼叫可能回傳不同值，
所以 Angular 可以信任 Signal 的版本號來決定是否需要更新 DOM。</p>

<p><strong>markSignalDirty 的精確行為</strong>：不是每次 <code>.set()</code> 都會觸發 CD。
Angular 使用 <code>Object.is()</code> 比較新值和舊值——
如果相同，不會遞增 version，不會觸發 markSignalDirty，不會排程 CD。
這是一個重要的效能優化，避免了不必要的渲染週期。</p>

<p><strong>Zoneless 的優勢</strong>：在 Zoneless 模式中，CD 只在 Signal 改變時觸發——
沒有 Signal 改變就沒有 CD。而在 Zone 模式中，任何非同步操作（甚至與 UI 無關的 setInterval）
都會觸發全域 CD。這就是為什麼 Zoneless + Signal 是效能最佳的組合。</p>`,
      codeExamples: [
        {
          filename: 'signal-cd-bridge.ts',
          language: 'typescript',
          code: `// Simplified illustration of how Angular bridges Signal → Change Detection
// (Based on @angular/core internal implementation)

// Step 1: Template compiler generates binding code
// For template: <p>{{ count() }}</p>
// Compiler generates (simplified):
function updateComponent(lView: LView): void {
  // Read signal in reactive context — establishes tracking
  const newValue = lView[CONTEXT].count();  // count is a Signal

  // Compare with previously rendered value
  if (lView[BINDING_INDEX] !== newValue) {
    lView[BINDING_INDEX] = newValue;
    // Update the DOM text node
    setTextContent(lView[TEXT_NODE_INDEX], String(newValue));
  }
}

// Step 2: Signal mutation triggers notification
// When count.set(newValue) is called:
function signalSetFn(node: SignalNode, newValue: unknown): void {
  if (!Object.is(node.value, newValue)) {
    node.value = newValue;
    node.version++;
    // Notify all consumers (including template bindings)
    producerNotifyConsumers(node);
  }
}

// Step 3: Template consumer receives dirty notification
function templateConsumerMarkDirty(consumer: ReactiveNode): void {
  // Mark the component's LView as dirty
  markViewDirty(consumer.lView);
  // Notify the change detection scheduler
  changeDetectionScheduler.notify();
}

// Step 4: Scheduler batches and triggers CD
// ChangeDetectionScheduler (zoneless):
//   Uses requestAnimationFrame or microtask to call ApplicationRef.tick()
// NgZone (zone mode):
//   Zone.js onMicrotaskEmpty triggers ApplicationRef.tick()`,
          annotation: '模板綁定產生 reactive context，Signal 變更通知 template consumer，進而觸發 CD 排程。Object.is 避免重複觸發。',
        },
      ],
      tips: [
        {
          type: 'best-practice',
          content: '遷移到 Zoneless 的最佳路徑：(1) 所有元件設為 OnPush (2) 所有狀態改為 Signal (3) 移除所有 setTimeout/setInterval 中的直接屬性賦值 (4) 將 provideZoneChangeDetection() 改為 provideZonelessChangeDetection() (5) 從 polyfills 移除 zone.js。逐步遷移，每步都可以獨立驗證。',
        },
        {
          type: 'warning',
          content: '在 Zone 模式中混用 Signal 和傳統屬性綁定是完全可以的——Signal 不需要 Zoneless 才能工作。但在 Zoneless 模式中，所有 UI 狀態必須使用 Signal——傳統屬性賦值（如 this.count = 5）不會觸發 CD，UI 不會更新。這是 Zoneless 遷移中最常見的問題。',
        },
        {
          type: 'tip',
          content: 'Angular DevTools 的 Profiler 可以視覺化 CD 週期的觸發頻率。在 Zone 模式下，你會看到大量由 setTimeout、setInterval、mousemove 等觸發的 CD 週期。切換到 Zoneless 後，CD 週期數量會大幅減少——只在 Signal 值真正改變時才觸發。',
        },
      ],
      diagrams: [
        {
          id: 'zoneless-cd-flow',
          caption: 'Zoneless 模式：Signal 驅動的變更偵測流程',
          content: `User clicks button
│
▼
Event handler: count.set(count() + 1)
│
├── Object.is(oldValue, newValue) → different
├── Signal version incremented: 3 → 4
├── producerNotifyConsumers()
│   ├── Template consumer marked dirty
│   └── effect consumer marked dirty
│
▼
markSignalDirty()
│
▼
ChangeDetectionScheduler.notify()
│
├── Already scheduled? → skip (coalescing)
└── Not scheduled → requestAnimationFrame(tick)
    │
    ▼
    ApplicationRef.tick()
    │
    ├── Walk component tree (depth-first)
    │   ├── AppComponent: not dirty → skip subtree? (OnPush check)
    │   ├── CounterComponent: DIRTY
    │   │   ├── Execute template bindings
    │   │   │   ├── count() → read signal → value = 4
    │   │   │   └── Compare with last rendered value (3)
    │   │   │       └── Different → update DOM text node
    │   │   └── Clear dirty flag
    │   └── SiblingComponent: not dirty → skip
    │
    └── Run scheduled effects (microtask)
        └── effect: count signal dirty → execute callback`,
        },
      ],
    },

    // ─── Section 8: 常見陷阱 ───
    {
      id: 'signal-pitfalls',
      title: '常見陷阱',
      content: `
<p>Signal 系統雖然設計簡潔，但在實際使用中有幾個常見陷阱需要注意。
本節涵蓋最容易犯的錯誤、其根本原因、以及正確的解決方案。</p>

<p><strong>1. 在非響應式上下文中讀取 Signal</strong></p>
<p>Signal 的依賴追蹤只在<strong>響應式上下文（Reactive Context）</strong>中生效——
即在 computed、effect、template 綁定中。在普通函式、事件處理器、
setTimeout 回呼中讀取 Signal，只會取得當前值，不會建立追蹤關係。</p>
<p>這本身不是錯誤，但經常導致困惑：為什麼我在 ngOnInit 中讀取了 Signal，
它改變後卻沒有任何反應？因為 ngOnInit 不是響應式上下文——
Signal 的 getter 被呼叫了，但沒有 activeConsumer，所以不建立依賴。</p>

<p><strong>2. 無限迴圈：effect 寫入自己讀取的 Signal</strong></p>
<p>最危險的陷阱之一。如果 effect 讀取一個 Signal 並寫入同一個 Signal
（即使是間接地），會造成無限迴圈：</p>
<pre><code>const count = signal(0);
// ❌ Infinite loop: reads count, writes count, triggers re-run
effect(() => { count.set(count() + 1); }, { allowSignalWrites: true });</code></pre>
<p>Angular 會偵測到這種情況並在一定次數後拋出錯誤，
但最好的做法是在設計時就避免這種模式。
如果需要基於 Signal 值計算新值，使用 <code>computed()</code> 或 <code>linkedSignal()</code>。</p>

<p><strong>3. computed 中的副作用</strong></p>
<p>computed 應該是純函式——只進行計算，不產生副作用。
在 computed 中執行副作用（如修改外部變數、發送 HTTP 請求、操作 DOM）
會導致不可預測的行為，因為 Angular 不保證 computed 的執行時機和次數。
computed 可能因為惰性求值而不被執行，
也可能因為多次讀取而被多次執行（雖然目前實作是快取的，但這不是 API 契約）。</p>

<p><strong>4. 非同步 Signal 讀取失去追蹤</strong></p>
<p>在 computed 或 effect 中使用 async/await 時，
<code>await</code> 之後的 Signal 讀取<strong>不會被追蹤</strong>。
這是因為追蹤上下文（activeConsumer）在 await 時被清除——
JavaScript 的 microtask 排程會恢復執行，但不會恢復 Angular 的追蹤上下文。</p>

<p><strong>5. 大型 Signal 依賴圖的記憶體問題</strong></p>
<p>每個 Signal 到 Consumer 的邊都需要記憶體（兩個陣列條目 + 版本號）。
在大型應用中，如果建立了大量的 computed/effect 但沒有正確銷毀，
依賴圖會持續增長。特別注意在 <code>@for</code> 迴圈中建立的 effect——
每次列表項目建立都會建立新的 effect，列表項目銷毀時必須正確清理。</p>

<p><strong>6. Signal 值的不可變性</strong></p>
<p>Signal 使用 <code>Object.is()</code> 比較新舊值來決定是否通知 Consumer。
如果你修改了一個物件或陣列的內部屬性後再 <code>.set()</code> 回去，
<code>Object.is()</code> 會判定為相同的參考——Signal 不會觸發更新。
必須建立新的物件或陣列參考。</p>`,
      codeExamples: [
        {
          filename: 'signal-pitfalls.ts',
          language: 'typescript',
          code: `import { signal, computed, effect } from '@angular/core';

// ❌ Pitfall 1: Reading signals outside reactive context
const name = signal('Alice');

function logName(): void {
  console.log(name()); // Gets current value but NO tracking
  // name changing later will NOT re-invoke this function
}

// ❌ Pitfall 2: Async signal reads lose tracking
const userId = signal('u1');
const theme = signal('dark');

effect(async () => {
  const id = userId();    // ✅ Tracked (before await)
  const data = await fetch(\`/api/users/\${id}\`);
  console.log(theme());   // ❌ NOT tracked (after await)
  // Changing theme() will NOT re-trigger this effect
});

// ✅ Fix: Capture all signals before await
effect(async () => {
  const id = userId();       // ✅ Tracked
  const currentTheme = theme(); // ✅ Tracked (captured before await)
  const data = await fetch(\`/api/users/\${id}\`);
  console.log(currentTheme);   // Uses captured value
});

// ❌ Pitfall 3: Mutating object in place
const user = signal({ name: 'Alice', age: 25 });
// This does NOTHING — same object reference, Object.is returns true
user().age = 26;
user.set(user()); // Object.is(old, new) === true → no notification!

// ✅ Fix: Create new reference
user.update(u => ({ ...u, age: 26 }));

// ❌ Pitfall 4: Side effects in computed
const items = signal<string[]>([]);
const count = computed(() => {
  console.log('Computing count'); // ❌ Side effect! May or may not execute
  localStorage.setItem('count', String(items().length)); // ❌ Side effect!
  return items().length;
});

// ✅ Fix: Move side effects to effect()
const countPure = computed(() => items().length);
effect(() => {
  const c = countPure();
  localStorage.setItem('count', String(c));
});`,
          annotation: '四種常見陷阱：非響應式上下文讀取、非同步失去追蹤、物件原地修改、computed 副作用。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: 'signal.update(fn) 的函式參數接收目前值——你必須回傳一個新物件。不要在函式中修改傳入的物件後回傳它（in-place mutation），因為 Object.is 會判定為相同參考。使用展開運算子 { ...obj, key: newValue } 或陣列的 [...arr, newItem] 建立新參考。',
        },
        {
          type: 'best-practice',
          content: '在 effect 中使用非同步操作時，考慮改用 resource() 或 rxResource()。它們專門為非同步 Signal 操作設計，正確處理了追蹤上下文、請求取消、狀態管理等問題。手動在 effect 中組合 async/await + Signal 通常是 anti-pattern。',
        },
        {
          type: 'tip',
          content: '使用 untracked(() => signal()) 可以在響應式上下文中讀取 Signal 但不建立依賴。這在你需要「讀取值但不想因為它改變而重新計算」的場景中很有用。例如在 computed 中讀取 config Signal 但只想追蹤 data Signal 的變更。',
        },
      ],
      exercises: [
        {
          id: 'trace-dependency-graph',
          title: '追蹤依賴圖',
          statement: `
<p>給定以下 Signal 定義，追蹤依賴圖並回答問題：</p>
<ol>
  <li>畫出初始狀態的依賴圖（哪些節點依賴哪些節點）</li>
  <li>當 <code>quantity.set(5)</code> 被呼叫後，哪些節點被標記為 dirty？</li>
  <li>讀取 <code>summary()</code> 時，哪些 computed 會被重算？</li>
  <li>如果 <code>price.set(100)</code>（與目前值相同），會發生什麼？</li>
</ol>`,
          initialCode: `import { signal, computed, effect } from '@angular/core';

const price = signal(100);
const quantity = signal(3);
const taxRate = signal(0.05);

const subtotal = computed(() => price() * quantity());
const tax = computed(() => subtotal() * taxRate());
const total = computed(() => subtotal() + tax());
const summary = computed(() =>
  \`\${quantity()} items, subtotal: \${subtotal()}, tax: \${tax()}, total: \${total()}\`
);

effect(() => {
  console.log('Order updated:', total());
});

// Question: What happens when quantity.set(5) is called?`,
          hints: [
            'subtotal 依賴 price 和 quantity',
            'tax 依賴 subtotal 和 taxRate',
            'total 依賴 subtotal 和 tax',
            'summary 依賴 quantity、subtotal、tax、total',
            'effect 依賴 total',
            'Push 階段：dirty flag 從 quantity 向下傳播到所有直接和間接 consumer',
            'Pull 階段：讀取 summary 時，遞迴檢查每個 dependency 的 version',
          ],
          solution: `// Dependency graph:
//
// price ──→ subtotal ──→ tax ───→ total ──→ effect
//              ↑           ↑        ↑
// quantity ───┘            │        │
//                          │        │
// taxRate ─────────────────┘        │
//                                   │
// summary ← quantity + subtotal + tax + total
//
// When quantity.set(5):
//
// 1. PUSH phase:
//    quantity.version: 1 → 2
//    → subtotal marked dirty
//    → tax marked dirty (via subtotal)
//    → total marked dirty (via subtotal and tax)
//    → summary marked dirty (via quantity, subtotal, tax, total)
//    → effect marked dirty (via total)
//
// 2. PULL phase (reading summary()):
//    summary is dirty → check dependencies:
//      quantity: version changed → YES, need recompute
//      But first, check subtotal (also dirty):
//        subtotal: check price (version same), quantity (version changed)
//        → subtotal recomputes: 100 * 5 = 500 (was 300)
//        → subtotal.version increments
//      Check tax (dirty):
//        tax: check subtotal (version changed), taxRate (version same)
//        → tax recomputes: 500 * 0.05 = 25 (was 15)
//        → tax.version increments
//      Check total (dirty):
//        total: check subtotal (changed), tax (changed)
//        → total recomputes: 500 + 25 = 525 (was 315)
//        → total.version increments
//    → summary recomputes with all new values
//
// 3. Effect scheduled via microtask:
//    → Reads total() → pulls latest value (525)
//    → Logs "Order updated: 525"
//
// 4. If price.set(100) (same value):
//    Object.is(100, 100) === true
//    → version does NOT increment
//    → NO consumers marked dirty
//    → NO recomputation
//    → NO effect execution
//    → Zero cost!`,
        },
      ],
    },
  ],
};

@Component({
  selector: 'app-ch12',
  imports: [GuidePage],
  template: '<app-guide-page [chapter]="chapter" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ch12SignalInternals {
  protected readonly chapter = CHAPTER;
}
