import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GuidePage } from '../shared/guide-page';
import { GuideChapter } from '../models/guide-chapter';

const CHAPTER: GuideChapter = {
  id: 'ivy-compiler',
  number: 10,
  title: 'Ivy 編譯器與模板解析',
  subtitle: 'Ivy 架構、模板編譯流程、裝飾器產物、控制流與 DI 編譯、增量編譯',
  icon: 'build_circle',
  category: 'framework-core',
  tags: ['Ivy', 'AOT', 'JIT', 'ngtsc', 'Compiler', 'Tree-shaking', 'Standalone', 'NgModule'],
  estimatedMinutes: 55,
  sections: [
    // ─── Section 1: Ivy Overview ───
    {
      id: 'ivy-overview',
      title: 'Ivy 架構概觀',
      content: `
        <p>Ivy 是 Angular 從 v9 開始使用的<strong>第三代渲染引擎</strong>，
        取代了先前的 View Engine。這次架構重寫從根本上改變了 Angular 的編譯模型、
        渲染策略和 tree-shaking 能力，是框架歷史上最重要的技術轉折之一。</p>

        <h4>從 View Engine 到 Ivy 的演進</h4>
        <p>View Engine（Angular v2-v8）使用一個集中式的解釋器（interpreter）來渲染模板。
        它會將模板編譯成一個中間表示（intermediate representation），
        然後由一個通用的執行引擎在執行時期解讀。
        這種設計的問題在於：即使某些功能沒有被使用，
        執行引擎的程式碼仍然會被包含在 bundle 中，無法被 tree-shake。</p>

        <p>Ivy 的核心創新是 <strong>Locality Principle（局部性原則）</strong>：
        每個元件被獨立編譯成一組自包含的指令（instructions），
        不需要全域上下文。這意味著：</p>
        <ul>
          <li>每個元件可以獨立編譯——不需要知道整個應用的結構</li>
          <li>未使用的功能可以被 tree-shake——bundle 只包含實際使用的指令</li>
          <li>增量編譯成為可能——只重新編譯改變的檔案</li>
          <li>函式庫可以預先編譯（partial compilation）——發布到 npm 後不需要再次編譯</li>
        </ul>

        <h4>AOT vs JIT 編譯</h4>
        <p>Angular 支援兩種編譯模式：</p>
        <ul>
          <li><strong>AOT（Ahead-of-Time）</strong>：在建置階段將模板和裝飾器編譯成 JavaScript。
          這是生產環境的唯一選擇。所有模板語法錯誤在建置時就會被發現。</li>
          <li><strong>JIT（Just-in-Time）</strong>：在瀏覽器中執行時才編譯。
          需要將 Angular 編譯器打包到 bundle 中（增加約 1MB），
          僅用於開發時的 hot reload 或極少數動態模板場景。</li>
        </ul>

        <h4>Ivy 指令集</h4>
        <p>Ivy 將模板編譯成一系列低階指令（instructions），以 <code>ɵɵ</code> 前綴標記。
        這些指令是 Angular 的「虛擬 DOM 操作」——直接對應到具體的 DOM 操作，
        沒有中間的 diff 步驟。主要指令類別包括：</p>
        <ul>
          <li><strong>元素建立</strong>：<code>ɵɵelementStart</code>、<code>ɵɵelementEnd</code>、<code>ɵɵelement</code></li>
          <li><strong>文字</strong>：<code>ɵɵtext</code>、<code>ɵɵtextInterpolate</code></li>
          <li><strong>屬性綁定</strong>：<code>ɵɵproperty</code>、<code>ɵɵattribute</code>、<code>ɵɵstyleProp</code></li>
          <li><strong>事件監聽</strong>：<code>ɵɵlistener</code></li>
          <li><strong>元件/指令</strong>：<code>ɵɵdefineComponent</code>、<code>ɵɵdefineDirective</code></li>
          <li><strong>控制流</strong>：<code>ɵɵconditional</code>、<code>ɵɵrepeaterCreate</code>、<code>ɵɵrepeater</code></li>
          <li><strong>DI</strong>：<code>ɵɵdefineInjectable</code>、<code>ɵɵinject</code></li>
        </ul>
        <p>每個指令都是一個獨立函式——如果你的模板沒有使用 <code>@for</code>，
        <code>ɵɵrepeaterCreate</code> 就不會出現在 bundle 中。
        這就是 Ivy 能 tree-shake 的根本原因。</p>
      `,
      codeExamples: [
        {
          filename: 'view-engine-vs-ivy.ts',
          language: 'typescript',
          code: `// ── View Engine (Angular v2-v8) ──
// Compiled to an intermediate "NgFactory" interpreted at runtime:
// - One monolithic interpreter handles ALL template features
// - Cannot tree-shake unused features
// - Entire NgModule scope needed for compilation
//
// ── Ivy (Angular v9+) ──
// Compiled to direct DOM instruction calls:
// - Each instruction is an independent, tree-shakable function
// - Component compiles in isolation (locality principle)
// - Static fields on the component class hold the definition

// Example: How Ivy attaches the compiled definition
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: '<h1>Hello, {{ name() }}!</h1>',
})
export class Hello {
  readonly name = input('World');
}

// After AOT compilation, the class gains a static field:
// Hello.ɵcmp = ɵɵdefineComponent({
//   type: Hello,
//   selectors: [['app-hello']],
//   inputs: { name: 'name' },
//   decls: 2,     // number of DOM nodes to allocate
//   vars: 1,      // number of bindings to track
//   template: function Hello_Template(rf, ctx) {
//     if (rf & RenderFlags.Create) {
//       ɵɵelementStart(0, 'h1');
//       ɵɵtext(1);
//       ɵɵelementEnd();
//     }
//     if (rf & RenderFlags.Update) {
//       ɵɵadvance();
//       ɵɵtextInterpolate1('Hello, ', ctx.name(), '!');
//     }
//   },
// });`,
          annotation: 'Ivy 編譯產物概覽：模板被轉換成 template function，分為 Create（建立 DOM）和 Update（更新綁定）兩個階段。',
        },
      ],
      tips: [
        {
          type: 'tip',
          content: 'Ivy 的 <code>ɵɵ</code> 前綴表示這些是 Angular 的「私有 API」——不應該在應用程式碼中直接呼叫。它們的簽名可能在任何次要版本中改變。了解它們的存在是為了理解框架內部運作，而非直接使用。',
        },
        {
          type: 'dotnet-comparison',
          content: 'Ivy 的指令集類似 .NET IL（Intermediate Language）：高階語法（C# / Angular 模板）被編譯成低階指令（IL / Ivy instructions），再由運行時（CLR / 瀏覽器）執行。兩者都將「語言特性」編譯成「運行時操作」。',
        },
        {
          type: 'best-practice',
          content: '永遠使用 AOT 編譯（<code>ng build</code> 預設即 AOT）。JIT 只在極少數動態模板場景中使用，且會顯著增加 bundle size。如果在生產環境中不小心啟用了 JIT，bundle 會增加約 1MB。',
        },
      ],
      diagrams: [
        {
          id: 'aot-jit-comparison',
          caption: 'AOT vs JIT 編譯對比',
          content: `
┌────────────────────┬──────────────────────┬──────────────────────┐
│                    │       AOT            │       JIT            │
├────────────────────┼──────────────────────┼──────────────────────┤
│ 編譯時機            │ Build time           │ Runtime (browser)    │
│ 模板錯誤偵測        │ Build time (fail CI) │ Runtime (crash)      │
│ Bundle 包含編譯器   │ ❌ No               │ ✅ Yes (~1MB)        │
│ Tree-shaking       │ ✅ Full              │ ⚠️ Limited          │
│ 首次渲染速度        │ ✅ Fast              │ ❌ Slow (compile)    │
│ 適用環境            │ Production           │ Dev / rare dynamic   │
│ ng build 預設       │ ✅ Yes              │ ❌ No               │
│ 增量編譯            │ ✅ Yes (ngtsc)      │ ❌ N/A              │
└────────────────────┴──────────────────────┴──────────────────────┘
          `,
        },
      ],
    },

    // ─── Section 2: Template Compilation ───
    {
      id: 'template-compilation',
      title: '模板編譯流程',
      content: `
        <p>Angular 的模板編譯是一個多階段的轉換管線（pipeline），
        將人類可讀的 HTML 模板語法轉換成高效的 JavaScript 指令碼。
        理解這個流程有助於診斷編譯錯誤和理解效能特性。</p>

        <h4>編譯管線四階段</h4>
        <ol>
          <li><strong>Tokenization</strong>：將模板字串分解成 token（標籤、屬性、文字、插值表達式等）</li>
          <li><strong>HTML AST</strong>：將 token 組織成 HTML 抽象語法樹——純粹的 HTML 結構，
          不含 Angular 特有的語義</li>
          <li><strong>Template AST（t-AST）</strong>：將 HTML AST 轉換成 Angular 專屬的模板 AST。
          此階段解析 Angular 語法：<code>@if</code> 控制流、<code>{{ }}</code> 插值、
          <code>[property]</code> 綁定、<code>(event)</code> 監聽、<code>#ref</code> 模板變數等</li>
          <li><strong>Ivy Instructions</strong>：將 Template AST 轉換成 Ivy 指令——
          即編譯後的 <code>template</code> 函式。每個 AST 節點對應到一組 Ivy 指令呼叫</li>
        </ol>

        <h4>Template 函式的結構</h4>
        <p>編譯後的 <code>template</code> 函式接收兩個參數：</p>
        <ul>
          <li><code>rf</code>（RenderFlags）：位元旗標，指示當前是 <strong>Create</strong>（首次渲染）
          還是 <strong>Update</strong>（後續更新）階段</li>
          <li><code>ctx</code>：元件實例——模板中的 <code>this</code></li>
        </ul>
        <p><strong>Create 階段</strong>只在元件首次渲染時執行一次，負責建立所有 DOM 節點。
        <strong>Update 階段</strong>在每次 CD 時執行，只更新有綁定的部分。
        這種分離確保了靜態內容不會被重複處理。</p>

        <h4>綁定的增量更新</h4>
        <p>在 Update 階段，每個綁定指令（如 <code>ɵɵproperty</code>）
        都會先比較新值與舊值。只有在值不同時才呼叫 DOM API。
        舊值儲存在 Angular 內部的 <code>LView</code>（Logical View）資料結構中，
        使用陣列索引來快速存取——這比 Virtual DOM 的通用 diff 更高效。</p>

        <h4>常數池（Constant Pool）</h4>
        <p>編譯器會將模板中的靜態字串（如固定的 CSS 類別、ARIA 屬性等）
        提取到一個常數池中，多個指令共享同一個字串參考。
        這減少了編譯後程式碼的大小，也減少了記憶體佔用。</p>

        <h4>型別檢查</h4>
        <p>在 AOT 模式下，Angular 編譯器會為模板生成一個<strong>型別檢查區塊</strong>（Type Check Block, TCB）。
        TCB 是一段 TypeScript 程式碼，將模板中的所有表達式映射到 TypeScript 的型別系統。
        如果模板中存取了不存在的屬性，或傳入了錯誤型別的 input，
        TypeScript 編譯器會報錯——這就是 AOT 模板型別檢查的原理。</p>
      `,
      codeExamples: [
        {
          filename: 'source-template.html',
          language: 'html',
          code: `<!-- Source template -->
<div class="card">
  <h2>{{ title() }}</h2>
  <p [class.highlight]="isActive()">{{ description() }}</p>
  <button (click)="save()">Save</button>
</div>`,
          annotation: '原始模板：包含插值、屬性綁定、事件監聽。',
        },
        {
          filename: 'compiled-output.ts',
          language: 'typescript',
          code: `// Compiled Ivy output (simplified from actual ngtsc output)
// This is what Angular's AOT compiler generates from the template above

import { ɵɵdefineComponent, ɵɵelementStart, ɵɵelementEnd,
         ɵɵtext, ɵɵtextInterpolate, ɵɵproperty,
         ɵɵlistener, ɵɵadvance, ɵɵclassProp } from '@angular/core';

static ɵcmp = ɵɵdefineComponent({
  type: CardComponent,
  selectors: [['app-card']],
  decls: 7,   // Total DOM slots: div, h2, text, p, text, button, text
  vars: 3,    // Bindings to track: title interpolation, class, description
  template: function Card_Template(rf: number, ctx: Card) {
    // ── CREATE phase: build DOM structure (runs ONCE) ──
    if (rf & 1) {
      ɵɵelementStart(0, 'div', 0);  // <div class="card">  (attr idx 0)
        ɵɵelementStart(1, 'h2');     // <h2>
          ɵɵtext(2);                 //   text node for interpolation
        ɵɵelementEnd();              // </h2>
        ɵɵelementStart(3, 'p');      // <p>
          ɵɵtext(4);                 //   text node for interpolation
        ɵɵelementEnd();              // </p>
        ɵɵelementStart(5, 'button'); // <button>
          ɵɵlistener('click',        //   (click)="save()"
            function () { return ctx.save(); });
          ɵɵtext(6, 'Save');         //   static text
        ɵɵelementEnd();              // </button>
      ɵɵelementEnd();                // </div>
    }
    // ── UPDATE phase: refresh bindings (runs on every CD) ──
    if (rf & 2) {
      ɵɵadvance(2);                             // Move cursor to slot 2
      ɵɵtextInterpolate(ctx.title());           // Update {{ title() }}
      ɵɵadvance();                              // Move to slot 3 (the <p>)
      ɵɵclassProp('highlight', ctx.isActive()); // Update [class.highlight]
      ɵɵadvance();                              // Move to slot 4
      ɵɵtextInterpolate(ctx.description());     // Update {{ description() }}
    }
  },
  consts: [['class', 'card']],  // Constant pool: static attributes
});`,
          annotation: '編譯產物：模板被分成 Create（建立 DOM）和 Update（更新綁定）兩階段。ɵɵadvance 移動遊標到下一個需要更新的 slot。',
        },
      ],
      tips: [
        {
          type: 'tip',
          content: '<code>decls</code> 和 <code>vars</code> 數值決定了 <code>LView</code> 陣列的大小。<code>decls</code> 是 DOM 節點的 slot 數，<code>vars</code> 是綁定值的 slot 數。Angular 預先配置這個陣列，避免動態增長，這是效能優化的關鍵之一。',
        },
        {
          type: 'warning',
          content: '模板中的型別錯誤在 JIT 模式下不會被檢查——只有 AOT 模式才會生成 TCB 進行型別驗證。這是另一個必須使用 AOT 的原因。設定 <code>strictTemplates: true</code>（Angular v20+ 預設開啟）以啟用最嚴格的模板型別檢查。',
        },
      ],
      diagrams: [
        {
          id: 'template-pipeline',
          caption: '模板編譯管線：從 HTML 到 Ivy 指令',
          content: `
Template String
    │
    ▼
┌───────────────┐
│ Tokenizer     │  "Split into tokens"
│ (Lexer)       │  <div>, class=, {{ }}, (click)=, ...
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ HTML Parser   │  "Build HTML tree"
│ → HTML AST    │  Element, Attribute, Text nodes
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Template       │  "Angular semantics"
│ Parser         │  @if → IfBlock, [prop] → BoundAttribute,
│ → Template AST │  (event) → BoundEvent, {{ }} → Interpolation
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Template       │  "Generate Ivy instructions"
│ Compiler       │  ɵɵelementStart, ɵɵtext, ɵɵproperty,
│ → Ivy Code     │  ɵɵlistener, ɵɵconditional, ...
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ TypeScript     │  "Emit JavaScript"
│ Emitter        │  Final .js file with template function
└───────────────┘
          `,
        },
      ],
    },

    // ─── Section 3: Decorator Compilation ───
    {
      id: 'decorator-compilation',
      title: '裝飾器編譯產物',
      content: `
        <p>Angular 的裝飾器（<code>@Component</code>、<code>@Injectable</code>、<code>@NgModule</code> 等）
        在 AOT 編譯時會被轉換成<strong>靜態欄位</strong>（static fields），附加到裝飾的類別上。
        這些靜態欄位包含了框架執行時需要的所有 metadata，
        取代了 View Engine 時代的 <code>.metadata.json</code> 和 <code>.ngfactory.js</code> 檔案。</p>

        <h4>@Component → ɵcmp</h4>
        <p><code>@Component</code> 裝飾器會被編譯成一個 <code>ɵcmp</code> 靜態欄位，
        透過 <code>ɵɵdefineComponent()</code> 定義。它包含：</p>
        <ul>
          <li><code>type</code>：元件類別本身</li>
          <li><code>selectors</code>：CSS 選擇器（已解析成陣列格式）</li>
          <li><code>inputs</code> / <code>outputs</code>：input 和 output 的映射</li>
          <li><code>decls</code> / <code>vars</code>：DOM slot 和綁定 slot 的數量</li>
          <li><code>template</code>：編譯後的 template 函式</li>
          <li><code>styles</code>：已處理的 CSS（含 View Encapsulation 的 scope 標記）</li>
          <li><code>dependencies</code>：該元件 imports 的其他元件/指令/pipe 定義</li>
          <li><code>changeDetection</code>：CD 策略的數值常數</li>
          <li><code>encapsulation</code>：View Encapsulation 策略</li>
        </ul>

        <h4>@Injectable → ɵprov</h4>
        <p><code>@Injectable</code> 裝飾器會被編譯成 <code>ɵprov</code> 靜態欄位，
        透過 <code>ɵɵdefineInjectable()</code> 定義。核心內容是一個 <strong>factory function</strong>——
        這個函式知道如何建立服務的實例，包含所有依賴的解析邏輯。</p>
        <p>當 <code>providedIn: 'root'</code> 時，factory 被附在類別上而不是 NgModule 上。
        這使得 tree-shaker 能夠判斷：如果沒有任何程式碼引用這個服務，
        整個服務（包含 factory）都可以被移除。</p>

        <h4>@NgModule → ɵmod + ɵinj</h4>
        <p><code>@NgModule</code> 裝飾器會被編譯成兩個靜態欄位：</p>
        <ul>
          <li><code>ɵmod</code>（Module Definition）：記錄 declarations、imports、exports 的元件/指令/pipe 列表</li>
          <li><code>ɵinj</code>（Injector Definition）：記錄 providers 和 imports 的模組列表，
          用於建立模組級別的 injector</li>
        </ul>
        <p>在 Standalone 架構中，<code>@NgModule</code> 的角色被大幅弱化——
        元件直接在 <code>imports</code> 陣列中宣告依賴，不需要 NgModule 的中介。</p>

        <h4>Factory Function 的角色</h4>
        <p>每個編譯產物的核心都是一個 factory function。
        當 DI 系統需要建立一個實例時，它呼叫對應的 factory，
        factory 內部使用 <code>ɵɵinject()</code> 指令來解析依賴。
        這個過程完全在編譯時確定——不需要像 View Engine 那樣在執行時反射 metadata。</p>

        <h4>Decorator 移除</h4>
        <p>在編譯後的 JavaScript 中，原始的裝飾器呼叫被完全移除。
        所有 metadata 已經被「烘焙」（baked）到靜態欄位中。
        這意味著執行時不需要 metadata 反射（<code>Reflect.getMetadata</code>），
        也不需要 <code>emitDecoratorMetadata</code> TypeScript 編譯選項。</p>
      `,
      codeExamples: [
        {
          filename: 'source-component.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-greeting',
  template: \`<h1>Hello, {{ name() }}!</h1>\`,
  styles: [\`:host { display: block; padding: 16px; }\`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Greeting {
  private readonly userService = inject(UserService);
  readonly name = input('World');
}`,
          annotation: '原始元件原始碼——裝飾器、Signal input、inject()。',
        },
        {
          filename: 'compiled-component.js',
          language: 'typescript',
          code: `// Compiled output (simplified) — decorator is REMOVED, replaced by static fields

import { ɵɵdefineComponent, ɵɵelementStart, ɵɵelementEnd,
         ɵɵtext, ɵɵtextInterpolate, ɵɵadvance,
         ɵɵInputTransformsFeature } from '@angular/core';

export class Greeting {
  // inject() is compiled to a factory call — resolved at instantiation
  // userService = ɵɵinject(UserService);
  // name input becomes a signal with default value

  // ── Static field: Component Definition ──
  static ɵcmp = ɵɵdefineComponent({
    type: Greeting,
    selectors: [['app-greeting']],
    inputs: { name: [1, 'name'] },  // [flags, publicName]
    decls: 2,
    vars: 1,
    template: function Greeting_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementStart(0, 'h1');
        ɵɵtext(1);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵadvance();
        ɵɵtextInterpolate1('Hello, ', ctx.name(), '!');
      }
    },
    styles: ['[_nghost-%COMP%] { display: block; padding: 16px; }'],
    encapsulation: 0,        // Emulated
    changeDetection: 0,      // OnPush
  });

  // ── Static field: Factory ──
  static ɵfac = function Greeting_Factory(t) {
    return new (t || Greeting)();
  };
}`,
          annotation: '編譯產物：@Component 消失，取而代之的是 ɵcmp（定義）和 ɵfac（工廠）兩個靜態欄位。',
        },
        {
          filename: 'compiled-injectable.js',
          language: 'typescript',
          code: `// @Injectable({ providedIn: 'root' }) compiled output
import { ɵɵdefineInjectable, ɵɵinject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class UserService {
  // http = inject(HttpClient) compiles to:
  // this.http = ɵɵinject(HttpClient);

  static ɵprov = ɵɵdefineInjectable({
    token: UserService,
    factory: () => {
      // Factory knows exactly how to construct this service
      const instance = new UserService();
      instance.http = ɵɵinject(HttpClient);
      return instance;
    },
    providedIn: 'root',  // Tree-shakable: if nobody imports UserService,
                         // the entire class + factory is removed from bundle
  });
}`,
          annotation: '@Injectable 編譯產物：ɵprov 包含 tree-shakable 的 factory function，providedIn: root 使其自動註冊到根 injector。',
        },
      ],
      tips: [
        {
          type: 'tip',
          content: '在 <code>ng build</code> 後檢查 <code>dist/</code> 目錄中的 <code>.js</code> 檔案（使用 source map 或 <code>--optimization=false</code>），可以看到實際的編譯產物。這是理解 Ivy 最好的方式——看真實的輸出。',
        },
        {
          type: 'warning',
          content: '編譯產物中的 <code>ɵ</code> 和 <code>ɵɵ</code> 前綴表示私有 API。<code>ɵ</code> 是類別層級的私有欄位，<code>ɵɵ</code> 是框架層級的指令函式。不要在應用程式碼中直接引用它們——它們的簽名可能在任何版本中改變。',
        },
        {
          type: 'dotnet-comparison',
          content: '裝飾器編譯類似 .NET 的 Source Generator：在編譯時根據 attribute 生成額外的程式碼（如 <code>[JsonSerializable]</code> 生成序列化邏輯）。兩者都避免了執行時反射的開銷。',
        },
      ],
    },

    // ─── Section 4: Control Flow Compilation ───
    {
      id: 'control-flow-compilation',
      title: '控制流編譯',
      content: `
        <p>Angular 的 native control flow（<code>@if</code>、<code>@for</code>、
        <code>@switch</code>、<code>@defer</code>）在編譯時會被轉換成特定的 Ivy 指令。
        理解這些指令的結構有助於理解控制流的效能特性和限制。</p>

        <h4>@if → ɵɵconditional</h4>
        <p><code>@if</code> 被編譯成 <code>ɵɵtemplate</code>（在 Create 階段建立一個嵌入式 view 的 slot）
        和 <code>ɵɵconditional</code>（在 Update 階段根據條件決定顯示哪個 view）。
        每個 <code>@if</code> / <code>@else if</code> / <code>@else</code> 分支
        都有自己的 template 函式，只有被選中的分支的 DOM 會被建立。</p>

        <h4>@for → ɵɵrepeaterCreate + ɵɵrepeater</h4>
        <p><code>@for</code> 被編譯成兩個指令：</p>
        <ul>
          <li><code>ɵɵrepeaterCreate</code>（Create 階段）：註冊 repeater 的 template 函式和 track 函式</li>
          <li><code>ɵɵrepeater</code>（Update 階段）：根據集合的當前狀態，
          使用 <strong>reconciliation 演算法</strong>比較 track key，
          決定哪些 view 需要建立、移動、或刪除</li>
        </ul>
        <p><code>track</code> 表達式被編譯成一個函式，用於為每個項目生成穩定的 key。
        reconciliation 演算法使用這些 key 來最小化 DOM 操作——
        如果 key 相同且位置改變，只移動 DOM 節點；如果 key 不存在，才建立新的。</p>

        <h4>@switch → ɵɵconditional chain</h4>
        <p><code>@switch</code> 的編譯方式與 <code>@if</code> / <code>@else if</code> 鏈相似——
        每個 <code>@case</code> 對應一個 template slot，
        <code>ɵɵconditional</code> 根據 switch 表達式的值選擇對應的 slot。
        從編譯器的角度看，<code>@switch</code> 就是語法糖——
        底層使用與 <code>@if</code> 相同的 <code>ɵɵconditional</code> 指令。</p>

        <h4>@defer → Lazy Boundary</h4>
        <p><code>@defer</code> 是最複雜的控制流結構。它被編譯成：</p>
        <ul>
          <li>一個<strong>惰性載入邊界</strong>：<code>@defer</code> 區塊中的元件被拆分到獨立的 JavaScript chunk</li>
          <li><strong>觸發條件</strong>的監聽器：<code>on viewport</code> 使用 IntersectionObserver、
          <code>on idle</code> 使用 requestIdleCallback、<code>on interaction</code> / <code>on hover</code>
          使用 DOM 事件監聽</li>
          <li><code>@placeholder</code>、<code>@loading</code>、<code>@error</code> 三個附屬 template slot，
          根據載入狀態機切換</li>
          <li><strong>Prefetch 條件</strong>：<code>prefetch on</code> / <code>prefetch when</code>
          允許在顯示前就開始下載——提前載入 chunk 但延遲渲染</li>
        </ul>

        <h4>效能影響</h4>
        <p>控制流指令的效能關鍵在於 <strong>view 的建立和銷毀成本</strong>。
        <code>@if</code> 在條件切換時會銷毀舊 view 並建立新 view——
        如果分支中包含大量 DOM 節點，切換成本較高。
        <code>@for</code> 的效能取決於 <code>track</code> 表達式的品質——
        好的 track 讓 reconciliation 只做最小量的 DOM 操作。</p>
      `,
      codeExamples: [
        {
          filename: 'if-compiled.ts',
          language: 'typescript',
          code: `// Source template:
// @if (isLoggedIn()) {
//   <app-dashboard />
// } @else {
//   <app-login />
// }

// Compiled output (simplified):
function Parent_Template(rf, ctx) {
  if (rf & 1) {
    // Create phase: reserve a conditional slot at index 0
    ɵɵtemplate(0, Dashboard_Template, 1, 0, 'app-dashboard');
    ɵɵtemplate(1, Login_Template, 1, 0, 'app-login');
  }
  if (rf & 2) {
    // Update phase: evaluate condition and switch views
    ɵɵconditional(ctx.isLoggedIn() ? 0 : 1);
    // If condition changes: destroy current view, create the other
    // If condition is same: just update bindings in current view
  }
}

// Each branch has its own template function
function Dashboard_Template(rf, ctx) {
  if (rf & 1) { ɵɵelement(0, 'app-dashboard'); }
}
function Login_Template(rf, ctx) {
  if (rf & 1) { ɵɵelement(0, 'app-login'); }
}`,
          annotation: '@if 編譯：每個分支是獨立的 template function，ɵɵconditional 在 Update 階段根據條件切換。',
        },
        {
          filename: 'for-compiled.ts',
          language: 'typescript',
          code: `// Source template:
// @for (user of users(); track user.id) {
//   <div>{{ user.name }}</div>
// } @empty {
//   <p>No users found.</p>
// }

// Compiled output (simplified):
function UserList_Template(rf, ctx) {
  if (rf & 1) {
    // Create phase: register the repeater
    ɵɵrepeaterCreate(
      0,                              // slot index
      UserItem_Template,              // template for each item
      1,                              // decls per item
      1,                              // vars per item
      UserItem_TrackByFn,             // track function
      EmptyBlock_Template,            // @empty template
    );
  }
  if (rf & 2) {
    // Update phase: reconcile the list
    ɵɵrepeater(ctx.users());
    // Reconciliation algorithm:
    // 1. Get track keys for new list items
    // 2. Compare with previous track keys
    // 3. For matching keys in same position: update bindings
    // 4. For matching keys in different position: move DOM node
    // 5. For new keys: create new view from template
    // 6. For removed keys: destroy view
  }
}

// Track function — compiled from "track user.id"
function UserItem_TrackByFn(index: number, user: User): string {
  return user.id;
}

// Template for each item
function UserItem_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, 'div');
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const user = ctx.$implicit; // The current item
    ɵɵadvance();
    ɵɵtextInterpolate(user.name);
  }
}`,
          annotation: '@for 編譯：ɵɵrepeaterCreate 註冊 template 和 track 函式，ɵɵrepeater 在 Update 階段執行 reconciliation。',
        },
      ],
      tips: [
        {
          type: 'tip',
          content: '<code>@for</code> 的 reconciliation 演算法基於 <code>track</code> key 的比較。它比 React 的 key-based diff 更高效，因為它直接操作真實 DOM 節點而非 Virtual DOM。但如果 <code>track</code> 使用 <code>$index</code>，在列表排序時效能會退化到最差情況。',
        },
        {
          type: 'warning',
          content: '<code>@defer</code> 的 chunk 分割是在編譯時決定的——你不能在執行時動態改變 chunk 的邊界。如果 <code>@defer</code> 區塊中的元件又 import 了大量模組，整個依賴圖都會被放到同一個 chunk 中。設計 <code>@defer</code> 邊界時需要考慮依賴的大小。',
        },
        {
          type: 'best-practice',
          content: '使用 <code>@if</code> 而非 <code>[hidden]</code> 或 <code>[style.display]</code> 來控制元件的顯示。<code>@if</code> 會完全銷毀和重建 DOM——節省記憶體但有建立成本。<code>[hidden]</code> 保留 DOM 但佔用記憶體。根據切換頻率選擇：頻繁切換用 <code>[hidden]</code>，偶爾切換用 <code>@if</code>。',
        },
      ],
    },

    // ─── Section 5: DI Compilation ───
    {
      id: 'di-compilation',
      title: '依賴注入編譯',
      content: `
        <p>Angular 的依賴注入（DI）系統在 Ivy 編譯器下經歷了根本性的改變。
        從 View Engine 時代的「基於 metadata 反射的執行時解析」
        變成了「基於 factory function 的編譯時確定」。
        這個轉變使得 DI 能夠支援 tree-shaking——未被引用的服務可以被完全移除。</p>

        <h4>Tree-Shakable Providers 的原理</h4>
        <p>在 Ivy 之前，服務通常在 NgModule 的 <code>providers</code> 陣列中註冊：</p>
        <p><code>@NgModule({ providers: [UserService] })</code></p>
        <p>這種方式有一個根本問題：即使 <code>UserService</code> 從未被任何元件使用，
        它仍然會被包含在 bundle 中——因為 NgModule 明確引用了它。</p>

        <p>Ivy 的解法是反轉依賴方向：</p>
        <ul>
          <li>不再由 NgModule 引用 Service</li>
          <li>改由 Service 自己宣告它屬於哪個 injector：<code>@Injectable({ providedIn: 'root' })</code></li>
          <li>編譯後，factory 作為靜態欄位附在 Service 類別上</li>
          <li>如果沒有任何程式碼 import 這個 Service，tree-shaker 可以移除整個類別</li>
        </ul>

        <h4>ɵprov 的內部結構</h4>
        <p>編譯後的 <code>ɵprov</code> 包含以下關鍵資訊：</p>
        <ul>
          <li><code>token</code>：DI token（通常是類別本身）</li>
          <li><code>factory</code>：建立實例的函式，內含依賴解析邏輯</li>
          <li><code>providedIn</code>：目標 injector scope
          （<code>'root'</code>、<code>'platform'</code>、<code>'any'</code>、或特定 NgModule）</li>
        </ul>

        <h4>inject() 的編譯</h4>
        <p><code>inject(SomeService)</code> 在編譯時被轉換成 <code>ɵɵinject(SomeService)</code>。
        這個指令在執行時會：</p>
        <ol>
          <li>取得當前的 injection context（元件建立時、factory 執行時等）</li>
          <li>沿著 injector 層級向上搜尋 <code>SomeService</code> 的 provider</li>
          <li>如果找到，執行 provider 的 factory function 建立實例（或回傳已快取的單例）</li>
          <li>如果找不到，根據 <code>inject()</code> 的 options 決定拋出錯誤或回傳 null</li>
        </ol>

        <h4>Multi Providers 的編譯</h4>
        <p><code>{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }</code>
        在編譯時，multi provider 的 factory 會被收集到一個陣列中。
        當 <code>inject(HTTP_INTERCEPTORS)</code> 被呼叫時，
        所有 factory 都會被執行，結果合併成一個陣列返回。</p>

        <h4>InjectionToken 的 factory</h4>
        <p><code>InjectionToken</code> 可以自帶 factory：</p>
        <p><code>new InjectionToken('config', { factory: () => defaultConfig })</code></p>
        <p>這讓 token 不需要在 providers 中註冊也能有預設值——
        又一個 tree-shaking 友善的設計。
        如果應用提供了自訂的 provider，自訂值會覆蓋 factory 的預設值。</p>

        <h4>環境注入器 vs 元素注入器</h4>
        <p>Ivy 維護兩種 injector 層級：</p>
        <ul>
          <li><strong>環境注入器（Environment Injector）</strong>：由 NgModule、Route、Application 提供。
          形成一棵與元件樹獨立的 injector 樹。</li>
          <li><strong>元素注入器（Element Injector）</strong>：由元件的 <code>providers</code> / <code>viewProviders</code> 提供。
          跟隨 DOM 結構。</li>
        </ul>
        <p>DI 解析時，先搜尋元素注入器鏈，找不到再搜尋環境注入器鏈。</p>
      `,
      codeExamples: [
        {
          filename: 'tree-shakable-service.ts',
          language: 'typescript',
          code: `// ── Source code ──
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);

  trackEvent(name: string, data: Record<string, unknown>): void {
    this.http.post('/api/analytics', { name, data }).subscribe();
  }
}

// ── Compiled output (simplified) ──
// export class AnalyticsService {
//   static ɵprov = ɵɵdefineInjectable({
//     token: AnalyticsService,
//     factory: () => {
//       const svc = new AnalyticsService();
//       svc.http = ɵɵinject(HttpClient);
//       return svc;
//     },
//     providedIn: 'root',
//   });
// }
//
// If NO component/service ever calls inject(AnalyticsService),
// the tree-shaker removes the ENTIRE class from the bundle.
// This is impossible with NgModule providers: [AnalyticsService]`,
          annotation: 'Tree-shakable DI：providedIn: root 讓 factory 附在類別上。未被引用的服務會被 tree-shaker 移除。',
        },
        {
          filename: 'injection-token.ts',
          language: 'typescript',
          code: `import { InjectionToken, inject } from '@angular/core';

interface AppConfig {
  readonly apiUrl: string;
  readonly features: readonly string[];
}

// Token with a default factory — tree-shakable and self-contained
export const APP_CONFIG = new InjectionToken<AppConfig>('AppConfig', {
  factory: () => ({
    apiUrl: '/api',
    features: ['dashboard', 'reports'],
  }),
});

// Compiled: the factory is embedded in the token definition
// No need to register in providers unless overriding the default

// Usage in a component:
// private readonly config = inject(APP_CONFIG);
// config.apiUrl → '/api' (default), or custom value if provided`,
          annotation: 'InjectionToken 自帶 factory：不需要在 providers 註冊即可使用，且支援 tree-shaking。',
        },
      ],
      tips: [
        {
          type: 'best-practice',
          content: '所有新服務都應使用 <code>@Injectable({ providedIn: \'root\' })</code>。只有在需要元件級別的作用域時（如每個元件實例需要獨立的服務實例），才使用元件的 <code>providers</code> 陣列。',
        },
        {
          type: 'tip',
          content: '使用 <code>webpack-bundle-analyzer</code> 或 <code>source-map-explorer</code> 檢查 bundle，確認未使用的服務是否真的被 tree-shake 了。如果發現未使用的服務仍在 bundle 中，檢查是否有間接引用（如 barrel file 的 re-export）。',
        },
        {
          type: 'dotnet-comparison',
          content: 'Angular 的 <code>providedIn: \'root\'</code> 類似 .NET 的 <code>services.AddSingleton&lt;T&gt;()</code>，但反轉了註冊方向——服務自己宣告作用域，而非由啟動配置集中註冊。這使得 tree-shaking 成為可能，而 .NET 因為不需要 tree-shaking（伺服器端不關心 bundle 大小），所以保持集中註冊模式。',
        },
      ],
    },

    // ─── Section 6: Module vs Standalone Compilation ───
    {
      id: 'module-vs-standalone',
      title: '模組 vs Standalone 編譯差異',
      content: `
        <p>Angular 從 v14 引入 Standalone 架構，到 v19+ 預設所有元件為 standalone。
        兩種架構在編譯層面有根本性的差異——
        理解這些差異有助於理解 tree-shaking 的效能和遷移時的注意事項。</p>

        <h4>NgModule 的作用域解析</h4>
        <p>在 NgModule 架構中，元件的可見範圍由模組決定：</p>
        <ul>
          <li><code>declarations</code>：宣告屬於這個模組的元件/指令/pipe</li>
          <li><code>imports</code>：匯入其他模組的 <code>exports</code></li>
          <li><code>exports</code>：將自己的元件暴露給匯入者</li>
        </ul>
        <p>編譯器需要<strong>全域知識</strong>來解析模板中的標籤：
        看到 <code>&lt;app-card&gt;</code> 時，必須查詢整個 NgModule 的 declarations 和 imports 鏈
        才能找到 <code>CardComponent</code>。這違反了 Ivy 的局部性原則。</p>

        <h4>Standalone 的直接 imports</h4>
        <p>Standalone 元件直接在 <code>@Component({ imports: [...] })</code> 中宣告依賴：</p>
        <ul>
          <li>編譯器只需要看元件自己的 <code>imports</code> 就能解析所有模板引用</li>
          <li>不需要 NgModule 的中介——完全符合局部性原則</li>
          <li>每個元件精確宣告自己的依賴——未使用的元件不會被引入</li>
        </ul>

        <h4>編譯產物的差異</h4>
        <p><strong>NgModule 編譯</strong>：</p>
        <ul>
          <li>每個元件的 <code>ɵcmp.dependencies</code> 包含<strong>整個模組作用域</strong>中的所有元件/指令/pipe</li>
          <li>即使模板只用了 1 個元件，但模組中有 50 個 declarations，
          所有 50 個都會出現在 dependencies 中</li>
          <li>Tree-shaker 無法移除同一模組中未使用的元件——它們都被引用了</li>
        </ul>
        <p><strong>Standalone 編譯</strong>：</p>
        <ul>
          <li>每個元件的 <code>ɵcmp.dependencies</code> 只包含<strong>直接 import 的</strong>元件/指令/pipe</li>
          <li>模板中沒用到但被 import 的，在嚴格模式下會被標記為 warning</li>
          <li>Tree-shaker 可以精確移除未被任何模板引用的元件</li>
        </ul>

        <h4>Bundle Size 影響</h4>
        <p>在大型應用中，從 NgModule 遷移到 Standalone 通常能帶來 5-15% 的 bundle 縮減。
        實際數字取決於原本的 NgModule 結構：</p>
        <ul>
          <li>如果原本使用「超大共用模組」（如 <code>SharedModule</code> 匯出 100+ 元件），
          改善會非常顯著</li>
          <li>如果原本已經按功能拆分了模組（每個模組 5-10 個元件），改善較小</li>
          <li>Lazy-loaded 路由搭配 Standalone 的 <code>loadComponent</code>
          比 <code>loadChildren</code> 更精確——chunk 只包含路由元件及其直接依賴</li>
        </ul>

        <h4>遷移策略</h4>
        <p>Angular CLI 提供了 <code>ng generate @angular/core:standalone</code> schematics
        來自動化遷移。遷移是漸進式的——standalone 元件可以 import NgModule，
        NgModule 也可以 import standalone 元件。不需要一次性全部遷移。</p>
      `,
      codeExamples: [
        {
          filename: 'ngmodule-scope.ts',
          language: 'typescript',
          code: `// ── NgModule approach: Shared scope ──
// SharedModule declares 50 components/directives/pipes
@NgModule({
  declarations: [Card, Button, Badge, Tooltip, /* ...47 more */],
  exports: [Card, Button, Badge, Tooltip, /* ...47 more */],
})
export class SharedModule {}

// ProductList only uses Card and Button, but...
@NgModule({
  imports: [SharedModule],  // ALL 50 components are in scope
  declarations: [ProductList],
})
export class ProductModule {}

// Compiled: ProductList.ɵcmp.dependencies = [Card, Button, Badge, Tooltip, ...]
// All 50 components from SharedModule are referenced → NONE can be tree-shaken`,
          annotation: 'NgModule 的問題：ProductList 只用 2 個元件，但 dependencies 包含整個 SharedModule 的 50 個。',
        },
        {
          filename: 'standalone-imports.ts',
          language: 'typescript',
          code: `// ── Standalone approach: Precise imports ──
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from '../shared/card';
import { Button } from '../shared/button';

@Component({
  selector: 'app-product-list',
  imports: [Card, Button],  // ONLY what this template uses
  template: \`
    @for (product of products(); track product.id) {
      <app-card>
        <h3>{{ product.name }}</h3>
        <app-button (clicked)="addToCart(product)">Add</app-button>
      </app-card>
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  // ...
}

// Compiled: ProductList.ɵcmp.dependencies = [Card, Button]
// ONLY 2 components referenced → Badge, Tooltip, etc. can be tree-shaken
// if no other component imports them`,
          annotation: 'Standalone 精確引入：dependencies 只包含 Card 和 Button，其他 48 個元件可被 tree-shake。',
        },
        {
          filename: 'lazy-standalone.ts',
          language: 'typescript',
          code: `// ── Lazy loading comparison ──

// NgModule approach: loads entire module + all its declarations
// app.routes.ts
export const routes = [
  {
    path: 'products',
    loadChildren: () => import('./products/products.module')
      .then(m => m.ProductsModule),
    // Chunk includes: ProductsModule + ALL declarations + ALL shared imports
  },
];

// Standalone approach: loads only the component and its imports
export const routes = [
  {
    path: 'products',
    loadComponent: () => import('./products/product-list')
      .then(m => m.ProductList),
    // Chunk includes: ProductList + Card + Button (only direct imports)
  },
];`,
          annotation: 'Lazy loading 對比：loadComponent 的 chunk 只包含元件的直接依賴，比 loadChildren 更精確。',
        },
      ],
      tips: [
        {
          type: 'best-practice',
          content: '新專案應該完全使用 Standalone 架構。對於既有專案，優先遷移 leaf component（沒有子模組的底層元件），然後逐步向上遷移。使用 <code>ng generate @angular/core:standalone</code> 自動化遷移。',
        },
        {
          type: 'warning',
          content: '遷移時注意：如果一個 Standalone 元件 import 了一個 NgModule，它會把整個 NgModule 的 scope 帶入 dependencies。要獲得 tree-shaking 的好處，應該 import 單獨的 standalone 元件而非整個 NgModule。',
        },
        {
          type: 'tip',
          content: '使用 <code>source-map-explorer</code> 比較遷移前後的 bundle 內容，確認 tree-shaking 真的生效了。重點檢查 <code>SharedModule</code> 中原本被全部引入的元件是否已經被正確分離。',
        },
      ],
    },

    // ─── Section 7: Incremental Compilation ───
    {
      id: 'incremental-compilation',
      title: '增量編譯',
      content: `
        <p>Angular 的編譯速度直接影響開發體驗。
        Ivy 的增量編譯機制讓 <code>ng build --watch</code> 和 <code>ng serve</code>
        在檔案變更後能夠在數秒內完成重新編譯，
        即使在包含數百個元件的大型專案中也是如此。</p>

        <h4>ngtsc — Angular 的 TypeScript 編譯器包裝</h4>
        <p><code>ngtsc</code>（Angular TypeScript Compiler）是 Angular 對 TypeScript 編譯器（<code>tsc</code>）
        的擴充。它在 TypeScript 的編譯管線中插入額外的轉換階段：</p>
        <ol>
          <li><strong>Analysis</strong>：掃描所有 TypeScript 檔案，找到帶有 Angular 裝飾器的類別</li>
          <li><strong>Resolve</strong>：解析模板、樣式、依賴關係</li>
          <li><strong>Type Check</strong>：為模板生成 Type Check Block 並通過 TypeScript 型別檢查</li>
          <li><strong>Transform</strong>：將裝飾器轉換成 Ivy 指令和靜態欄位</li>
          <li><strong>Emit</strong>：輸出 JavaScript 和 source map 檔案</li>
        </ol>
        <p>關鍵在於：ngtsc 是 TypeScript 編譯器的<strong>插件</strong>，
        不是獨立的編譯器。這意味著它能直接利用 TypeScript 的增量編譯基礎設施。</p>

        <h4>FileEmitter 策略</h4>
        <p>在增量編譯模式下，ngtsc 使用 <code>FileEmitter</code> 策略來判斷哪些檔案需要重新編譯：</p>
        <ul>
          <li><strong>直接變更</strong>：被修改的 TypeScript 檔案必定重新編譯</li>
          <li><strong>型別依賴</strong>：如果一個檔案的型別簽名改變，依賴它的檔案也需要重新編譯</li>
          <li><strong>模板依賴</strong>：如果 Component A 的 selector 或 input 改變，
          所有在模板中使用 Component A 的元件需要重新檢查</li>
          <li><strong>不變的檔案</strong>：如果一個檔案的內容和依賴都沒變，直接跳過</li>
        </ul>
        <p>Ivy 的局部性原則讓模板依賴的追蹤更簡單——
        每個元件只依賴自己 <code>imports</code> 中的元件，不依賴全域模組結構。</p>

        <h4>Partial Compilation（函式庫用）</h4>
        <p>發布到 npm 的 Angular 函式庫使用 <strong>partial compilation</strong>（部分編譯）：</p>
        <ul>
          <li>函式庫不會完全編譯成 Ivy 指令——而是保留一個中間格式</li>
          <li>當應用引用函式庫時，Angular 的 <strong>linker</strong>
          在應用的建置過程中完成最後的轉換</li>
          <li>這樣函式庫就不需要針對特定的 Angular 版本編譯——
          同一個 npm 包可以在不同版本的 Angular 中使用</li>
          <li>Partial compilation 使用 <code>ɵɵngDeclareComponent</code>、
          <code>ɵɵngDeclareDirective</code> 等宣告式 API</li>
        </ul>

        <h4>為什麼 ng build --watch 很快</h4>
        <p>當你修改一個元件的模板時：</p>
        <ol>
          <li>esbuild（Angular v17+ 的預設 bundler）偵測到檔案變更</li>
          <li>ngtsc 只重新編譯被修改的檔案及其直接依賴</li>
          <li>esbuild 只重新打包受影響的 chunk</li>
          <li>HMR（Hot Module Replacement）只替換瀏覽器中的受影響模組</li>
        </ol>
        <p>整個流程通常在 100-500ms 內完成——
        這是 Ivy 局部性原則 + TypeScript 增量編譯 + esbuild 速度的協同效果。</p>

        <h4>效能建議</h4>
        <p>為了最大化增量編譯效能：</p>
        <ul>
          <li>避免使用 barrel file（<code>index.ts</code>）re-export 大量模組——
          改變一個元件可能觸發整個 barrel 重新編譯</li>
          <li>保持元件的 <code>imports</code> 精確——只引入需要的元件</li>
          <li>使用 <code>strictTemplates: true</code> 讓型別檢查在編譯時發現更多問題，
          減少執行時除錯</li>
          <li>大型 monorepo 考慮使用 Nx 或 Turborepo 的快取機制</li>
        </ul>
      `,
      codeExamples: [
        {
          filename: 'partial-compilation.ts',
          language: 'typescript',
          code: `// ── Library: Partial compilation output ──
// Published to npm as-is (not fully compiled)

import { ɵɵngDeclareComponent } from '@angular/core';

export class LibCard {
  static ɵcmp = ɵɵngDeclareComponent({
    // Declarative format — NOT executable Ivy instructions
    version: '20.0.0',
    type: LibCard,
    selector: 'lib-card',
    ngImport: '@angular/core',
    template: '<div class="card"><ng-content /></div>',
    styles: ['.card { border: 1px solid #ccc; padding: 16px; }'],
    changeDetection: 0, // OnPush
  });
}

// ── Application build: Linker converts to executable Ivy ──
// During the app's ng build, the Angular linker transforms the above into:
//
// LibCard.ɵcmp = ɵɵdefineComponent({
//   type: LibCard,
//   selectors: [['lib-card']],
//   ngContentSelectors: ['*'],
//   decls: 2,
//   template: function LibCard_Template(rf, ctx) {
//     if (rf & 1) {
//       ɵɵprojectionDef();
//       ɵɵelementStart(0, 'div', 0);
//       ɵɵprojection(1);
//       ɵɵelementEnd();
//     }
//   },
//   consts: [['class', 'card']],
//   styles: ['.card { border: 1px solid #ccc; padding: 16px; }'],
// });`,
          annotation: 'Partial compilation：函式庫發布宣告式格式，應用建置時 linker 轉換成可執行的 Ivy 指令。',
        },
        {
          filename: 'tsconfig.json',
          language: 'typescript',
          code: `// tsconfig.json — settings that affect compilation performance
{
  "compilerOptions": {
    "strict": true,
    "incremental": true,           // Enable TypeScript incremental compilation
    "tsBuildInfoFile": ".tsbuildinfo"  // Cache file for incremental builds
  },
  "angularCompilerOptions": {
    "strictTemplates": true,       // Full template type checking
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    // compilationMode: "partial" — ONLY for libraries (ng-packagr sets this)
    // For applications, always use "full" (default)
  }
}`,
          annotation: 'tsconfig 中影響編譯效能的關鍵設定：incremental 啟用增量編譯，strictTemplates 啟用模板型別檢查。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: 'Barrel file（<code>index.ts</code>）是增量編譯的隱形殺手。如果 <code>shared/index.ts</code> re-export 了 100 個元件，修改任何一個都會導致所有引用 <code>shared/index.ts</code> 的檔案重新型別檢查。建議直接引用具體的檔案路徑而非 barrel file。',
        },
        {
          type: 'tip',
          content: '使用 <code>NG_BUILD_PROFILING=1 ng build</code> 可以輸出建置的效能分析資訊，包括每個階段的耗時。如果發現 Type Check 階段特別慢，通常是模板中有大量複雜的型別推導——考慮簡化模板表達式或使用 <code>computed()</code>。',
        },
        {
          type: 'best-practice',
          content: '開發函式庫時，務必使用 <code>ng-packagr</code>（Angular CLI 的函式庫建置工具）。它會自動設定 partial compilation 模式，確保函式庫的相容性。不要手動配置 <code>compilationMode: "partial"</code>——那是 ng-packagr 的工作。',
        },
      ],
    },

    // ─── Section 8: Compiler Pitfalls ───
    {
      id: 'compiler-pitfalls',
      title: '常見陷阱',
      content: `
        <p>Angular 編譯器的錯誤訊息有時難以理解，
        某些設計決策的後果也不直觀。
        以下列出 8 個最常見的編譯相關陷阱及其解法。</p>

        <h4>陷阱 1：AOT 模板表達式限制</h4>
        <p>AOT 編譯器不支援模板中的某些 JavaScript 表達式：
        <code>new</code> 運算子、<code>typeof</code>、位元運算子、
        賦值運算子（<code>=</code>、<code>+=</code>）。
        這是因為模板表達式被編譯成 Angular 的 AST，而非直接轉譯為 JavaScript。
        <strong>修復</strong>：將複雜表達式移到 <code>computed()</code> 或方法中。</p>

        <h4>陷阱 2：Private members in templates</h4>
        <p>AOT 編譯後的模板是獨立的函式，無法存取元件的 <code>private</code> 成員。
        在 JIT 模式下不會報錯（因為模板和類別在同一個閉包中），
        但 AOT 會報 <code>TS2341: Property is private and only accessible within class</code>。
        <strong>修復</strong>：模板中使用的成員設為 <code>protected</code>。</p>

        <h4>陷阱 3：動態元件載入的 tree-shaking</h4>
        <p>使用 <code>ViewContainerRef.createComponent()</code> 動態載入的元件，
        如果沒有在任何模板或路由中被靜態引用，tree-shaker 可能會移除它。
        <strong>修復</strong>：透過動態 <code>import()</code> 載入，
        或在 <code>providers</code> 中使用 <code>InjectionToken</code> 持有元件類別的引用。</p>

        <h4>陷阱 4：Barrel file 污染 bundle</h4>
        <p>從 barrel file（<code>index.ts</code>）匯入一個元件，
        可能導致整個 barrel file 中匯出的所有元件都被包含在 bundle 中——
        即使只用了其中一個。這是因為某些 bundler 無法確定
        barrel file 的其他 export 是否有副作用（side effects）。
        <strong>修復</strong>：直接引用具體的檔案路徑；
        在 <code>package.json</code> 中設定 <code>"sideEffects": false</code>。</p>

        <h4>陷阱 5：循環依賴導致編譯失敗</h4>
        <p>兩個元件互相引用（A imports B, B imports A）會導致 TypeScript 編譯錯誤
        或執行時 <code>undefined</code> 錯誤。
        <strong>修復</strong>：使用 <code>forwardRef()</code>、
        重構為單向依賴、或透過 DI 解耦。</p>

        <h4>陷阱 6：styleUrl 路徑錯誤</h4>
        <p><code>styleUrl</code> 的路徑是相對於 TypeScript 檔案的位置，不是相對於專案根目錄。
        AOT 編譯器在解析時使用檔案系統路徑，路徑錯誤會導致建置失敗。
        JIT 模式下可能不會報錯（因為 Webpack 的 loader 有不同的解析策略）。
        <strong>修復</strong>：使用 <code>'./component.css'</code> 的相對路徑格式。</p>

        <h4>陷阱 7：函式庫未使用 Partial Compilation</h4>
        <p>如果一個函式庫直接使用 <code>ng build</code>（full compilation）發布到 npm，
        它可能在不同版本的 Angular 中無法使用——
        因為 full compilation 輸出的 Ivy 指令格式可能在版本間不相容。
        <strong>修復</strong>：使用 <code>ng-packagr</code> 建置函式庫，
        它會自動使用 partial compilation。</p>

        <h4>陷阱 8：strictTemplates 的 $event 型別推導</h4>
        <p>在 <code>strictTemplates: true</code> 下，
        <code>(click)="handler($event)"</code> 中的 <code>$event</code>
        會被推導為精確的 DOM 事件型別（如 <code>MouseEvent</code>）。
        如果 handler 的參數型別是 <code>Event</code>（基礎型別），
        TypeScript 會報型別不相容錯誤。
        <strong>修復</strong>：使用精確的事件型別，
        或使用 <code>$any($event)</code> 作為暫時的解決方案。</p>
      `,
      codeExamples: [
        {
          filename: 'pitfall-private-in-template.ts',
          language: 'typescript',
          code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <!-- ❌ AOT ERROR: Property 'count' is private -->
    <!-- <p>{{ count() }}</p> -->

    <!-- ✅ CORRECT: protected members are accessible in template -->
    <p>{{ count() }}</p>
    <button (click)="increment()">+1</button>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Counter {
  // ❌ BAD: private — AOT template cannot access this
  // private readonly count = signal(0);

  // ✅ GOOD: protected — accessible in template but not externally
  protected readonly count = signal(0);

  // ✅ GOOD: protected for template-only methods
  protected increment(): void {
    this.count.update(c => c + 1);
  }
}`,
          annotation: '陷阱 2 修復：模板使用的成員必須是 protected 或 public。private 在 AOT 模式下無法存取。',
        },
        {
          filename: 'pitfall-circular-dependency.ts',
          language: 'typescript',
          code: `// ── Circular dependency example ──

// ❌ BAD: A imports B, B imports A → circular dependency
// tab-group.ts
// import { Tab } from './tab'; // Tab also imports TabGroup

// ✅ FIX Option 1: forwardRef
import { forwardRef, ChangeDetectionStrategy, Component, contentChildren } from '@angular/core';

@Component({
  selector: 'app-tab-group',
  imports: [forwardRef(() => Tab)],
  template: \`
    @for (tab of tabs(); track tab) {
      <div [class.active]="tab === activeTab()">
        <ng-content />
      </div>
    }
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabGroup {
  readonly tabs = contentChildren(forwardRef(() => Tab));
  protected readonly activeTab = signal<unknown>(null);
}

// ✅ FIX Option 2: Break cycle with DI (preferred)
// tab.ts injects TabGroup via DI instead of importing it directly
// const tabGroup = inject(TabGroup);`,
          annotation: '陷阱 5 修復：使用 forwardRef() 打破循環引用，或透過 DI 注入取代直接 import。',
        },
        {
          filename: 'pitfall-barrel-file.ts',
          language: 'typescript',
          code: `// ── Barrel file pollution ──

// shared/index.ts (barrel file)
export { Card } from './card';
export { Button } from './button';
export { DataTable } from './data-table';    // 50KB component
export { RichEditor } from './rich-editor';  // 200KB component

// ❌ BAD: Importing from barrel may pull in ALL exports
// import { Card } from '../shared';
// Bundler may include DataTable and RichEditor even though unused

// ✅ GOOD: Import directly from the specific file
import { Card } from '../shared/card';
import { Button } from '../shared/button';
// DataTable and RichEditor are NOT referenced → tree-shaker removes them

// ✅ ALSO GOOD: Ensure package.json has sideEffects: false
// {
//   "sideEffects": false  // Tells bundler it's safe to tree-shake
// }`,
          annotation: '陷阱 4 修復：直接引用具體檔案路徑而非 barrel file，確保 tree-shaking 正確運作。',
        },
      ],
      tips: [
        {
          type: 'warning',
          content: 'JIT 模式下通過但 AOT 模式下失敗是最常見的「驚喜」。永遠以 AOT（<code>ng build</code>）的結果為準。在 CI/CD 中始終使用 <code>ng build</code> 驗證——不要只跑 <code>ng serve</code>。',
        },
        {
          type: 'best-practice',
          content: '在 <code>tsconfig.json</code> 中啟用所有 strict 選項：<code>strictTemplates</code>、<code>strictInjectionParameters</code>、<code>strictInputAccessModifiers</code>。前期多花幾分鐘修復型別錯誤，能避免後期花幾小時除錯執行時錯誤。',
        },
        {
          type: 'tip',
          content: '遇到難以理解的 AOT 錯誤時，使用 <code>ng build --source-map</code> 產生 source map，然後在錯誤的行號對照原始的 TypeScript 程式碼。如果錯誤在模板中，Angular v20+ 的 extended diagnostics 會提供更清楚的錯誤訊息和修復建議。',
        },
      ],
    },
  ],
};

@Component({
  selector: 'app-ch10',
  imports: [GuidePage],
  template: '<app-guide-page [chapter]="chapter" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ch10IvyCompiler {
  protected readonly chapter = CHAPTER;
}
