# Angular 深度學習參考資源索引

> **目標讀者**：具備 .NET/C# 後端開發經驗，正在轉型至 Angular 前端開發的工程師。
> **Angular 版本**：19+ (Standalone、Signals、OnPush、Zoneless)
> **最後更新**：2026-04-09

---

## 目錄

- [官方文件](#官方文件)
- [社群最佳實踐](#社群最佳實踐)
- [企業架構模式](#企業架構模式)
- [效能優化](#效能優化)
- [安全性](#安全性)
- [延伸閱讀](#延伸閱讀)
- [學習路線圖](#學習路線圖)
- [工具鏈參考](#工具鏈參考)
- [Angular 版本演進摘要](#angular-版本演進摘要)
- [常見問題 (FAQ)](#常見問題-faq)
- [本系列文件導覽](#本系列文件導覽)
- [關鍵術語對照表](#關鍵術語對照表)
- [社群與支援管道](#社群與支援管道)

---

## 官方文件

Angular 團隊維護的核心文件，涵蓋框架基礎到進階主題。對於從 .NET 轉型的開發者而言，Angular 的官方文件結構類似 Microsoft Docs，以概念導向搭配 API 參考。

| # | 主題 | 連結 | 摘要 |
|---|------|------|------|
| 1 | **Angular 總覽** | [angular.dev/overview](https://angular.dev/overview) | Angular 框架的核心架構介紹，包含元件模型、Signals 響應式系統、依賴注入、路由與表單。類比 .NET：Angular 元件如同 Razor Component，DI 系統與 .NET DI 容器概念一致。 |
| 2 | **元件指南** | [angular.dev/guide/components](https://angular.dev/guide/components) | 元件生命週期、模板語法、資料繫結、內容投影。v19+ 預設為 Standalone，不再需要 NgModule 註冊。類比 .NET：如同 Blazor 元件的 `@code` 區塊與 Razor 模板分離。 |
| 3 | **Signals 指南** | [angular.dev/guide/signals](https://angular.dev/guide/signals) | Angular 的核心響應式原語：`signal()`、`computed()`、`effect()`、`resource()`。取代傳統 RxJS 的大部分場景。類比 .NET：類似 `INotifyPropertyChanged` 但更精細，接近 .NET MAUI 的 `ObservableProperty`。 |
| 4 | **依賴注入** | [angular.dev/guide/di](https://angular.dev/guide/di) | 分層注入器、Provider 配置、`inject()` 函式。Angular DI 與 .NET DI 最為相似：都有 Singleton/Scoped/Transient 概念，但 Angular 的注入器樹狀結構更細緻。 |
| 5 | **路由與導覽** | [angular.dev/guide/routing](https://angular.dev/guide/routing) | 宣告式路由、Guards、Resolvers、延遲載入。類比 .NET：類似 ASP.NET Core 的端點路由，Guards 等同於 Middleware/Authorization Filter。 |
| 6 | **表單處理** | [angular.dev/guide/forms](https://angular.dev/guide/forms) | Reactive Forms、Template-driven Forms、驗證器。v21+ 新增 Signal Forms。類比 .NET：Reactive Forms 類似 FluentValidation 的宣告式驗證模式。 |
| 7 | **HttpClient** | [angular.dev/guide/http](https://angular.dev/guide/http) | HTTP 通訊、攔截器鏈、錯誤處理、XSRF 保護。類比 .NET：幾乎等同於 `HttpClient` + `DelegatingHandler`，攔截器就是 Middleware 的前端版本。 |
| 8 | **測試指南** | [angular.dev/guide/testing](https://angular.dev/guide/testing) | TestBed 設定、元件測試、服務測試、HTTP Mock。類比 .NET：TestBed 類似 `WebApplicationFactory`，提供測試用的 DI 容器。 |
| 9 | **安全性最佳實踐** | [angular.dev/best-practices/security](https://angular.dev/best-practices/security) | XSS 防護、CSP 配置、Trusted Types、CSRF/XSRF 保護、SSRF 防護。Angular 預設對所有模板繫結值進行消毒處理。 |

---

## 社群最佳實踐

來自 Angular 社群的實戰經驗與教學資源，涵蓋從基礎到進階的開發模式。

### Standalone 元件與現代 Angular

| # | 資源 | 連結 | 摘要 |
|---|------|------|------|
| 1 | **Angular Standalone Components: Complete Guide** | [blog.angular-university.io](https://blog.angular-university.io/angular-standalone-components/) | 完整的 Standalone 元件教學，從 NgModule 遷移到純 Standalone 架構。涵蓋 `imports` 陣列管理、延遲載入、樹搖優化。 |
| 2 | **The Future is Standalone (Angular Blog)** | [blog.angular.dev](https://blog.angular.dev/the-future-is-standalone-475d7edbc706) | Angular 核心團隊的官方聲明：v19 起 `standalone: true` 成為預設值。說明遷移策略與 `strictStandalone` 編譯器選項。 |
| 3 | **Angular 19 Standalone Components (Syncfusion)** | [syncfusion.com/blogs](https://www.syncfusion.com/blogs/post/angular19-standalone-components) | 實務導向的 Standalone 元件開發指南，包含效能優化、Bundle 分析、CLI 工具使用。 |
| 4 | **Standalone Components: Clean Architecture in 2025** | [metadesignsolutions.com](https://metadesignsolutions.com/standalone-components-in-angular-clean-architecture-in-2025/) | 將 Clean Architecture 原則應用於 Standalone Angular 專案，特別適合有後端架構經驗的開發者。 |

### Signal-first 開發與狀態管理

| # | 資源 | 連結 | 摘要 |
|---|------|------|------|
| 5 | **Angular State Management for 2025 (Nx Blog)** | [nx.dev/blog](https://nx.dev/blog/angular-state-management-2025) | 三種狀態管理方案的完整比較：Raw Signals、NgRx Signal State、NgRx Signal Store。包含規模選擇矩陣與程式碼範例。 |
| 6 | **NgRx vs Signal Store: Which One in 2025?** | [blog.stackademic.com](https://blog.stackademic.com/ngrx-vs-signal-store-which-one-should-you-use-in-2025-d7c9c774b09d) | 從 Redux 模式遷移到 Signal Store 的決策指南，適合曾用過 Redux/NgRx 的團隊。 |
| 7 | **Angular Signals vs NgRx Store (2026 Guide)** | [prodevaihub.com](https://prodevaihub.com/angular-signals-vs-ngrx-store/) | 2026 年最新的 Signals vs NgRx 比較，包含效能基準測試與企業級應用建議。 |
| 8 | **State Management: NgRx vs Services vs Signals** | [kitemetric.com/blogs](https://kitemetric.com/blogs/state-management-showdown-ngrx-vs-services-vs-signals-in-angular) | 三種方案的實務比較，特別關注學習曲線與團隊協作效率。 |

### 變更偵測與效能

| # | 資源 | 連結 | 摘要 |
|---|------|------|------|
| 9 | **Angular 21 Zoneless: Dropping zone.js** | [pkgpulse.com/blog](https://www.pkgpulse.com/blog/angular-21-zoneless-zone-js-performance-2026) | Angular 21 正式移除 zone.js 的完整分析，包含效能數據：30-40% 渲染提升、約 33KB Bundle 節省。 |
| 10 | **Change Detection Strategies: Zones and Signals** | [blog.lunatech.com](https://blog.lunatech.com/posts/2025-11-05-change-detection-strategies-in-angular-zones-and-signals) | 深入解析 Angular 變更偵測機制，從 Zone.js 到 Signals 的演進。適合理解框架內部運作的開發者。 |
| 11 | **10 Angular Performance Hacks (Syncfusion)** | [syncfusion.com/blogs](https://www.syncfusion.com/blogs/post/angular-performance-optimization) | 實用的效能優化技巧集合，涵蓋延遲載入、虛擬捲動、OnPush 策略等。 |

### 程式碼品質與模式

| # | 資源 | 連結 | 摘要 |
|---|------|------|------|
| 12 | **Angular Best Practices 2026: Clean & Scalable Code** | [ideas2it.com/blogs](https://www.ideas2it.com/blogs/angular-development-best-practices) | 2026 年的 Angular 編碼慣例與最佳實踐總整理，涵蓋命名規範、檔案結構、程式碼組織。 |
| 13 | **Angular Architecture Patterns (Dev Academy)** | [dev-academy.com](https://dev-academy.com/angular-architecture-best-practices/) | 三層架構（展示層/抽象層/核心層）的完整實作指南，包含 Facade 模式與狀態管理。 |
| 14 | **Design Patterns in Angular Development** | [angular-enterprise.com](https://angular-enterprise.com/en/ngpost/courses/design-patterns/) | 適用於 Angular 的設計模式課程，涵蓋 Observer、Strategy、Decorator 等模式的前端應用。 |
| 15 | **Angular Security Best Practices Guide** | [dev.to/kristiyanvelkov](https://dev.to/kristiyanvelkov/angular-security-best-practices-guide-in3) | 社群維護的安全性指南，涵蓋 XSS、CSRF、CSP、Trusted Types 的實務配置。 |

---

## 企業架構模式

針對大型團隊與複雜業務場景的架構設計資源。

| # | 資源 | 連結 | 摘要 |
|---|------|------|------|
| 1 | **Architecting Angular Applications (Nx Blog)** | [nx.dev/blog/architecting-angular-applications](https://nx.dev/blog/architecting-angular-applications) | Nx 官方的 Angular 架構指南：從單一應用到 Monorepo 的演進路徑、Domain-driven 資料夾結構、Library 分類（feat-/ui-/data-access）、模組邊界強制。 |
| 2 | **Enterprise Angular Monorepo Patterns (Nx)** | [nx.dev/blog/enterprise-angular-book](https://nx.dev/blog/enterprise-angular-book) | 企業級 Monorepo 模式手冊，涵蓋多團隊協作、CI/CD 優化、程式碼共享策略。 |
| 3 | **Modern Angular Enterprise Architecture 2026** | [khizaruddins.medium.com](https://khizaruddins.medium.com/modern-angular-enterprise-architecture-2026-beff3d0b928f) | 2026 年企業級 Angular 架構概覽，整合 Standalone、Signals、Zoneless 等現代特性。 |
| 4 | **Enterprise Angular Architecture (eBook)** | [angularexperts.io](https://angularexperts.io/products/ebook-angular-enterprise-architecture/) | Tomas Trajan 撰寫的企業 Angular 架構電子書，涵蓋漸進式架構、程式碼組織、自動化驗證。 |
| 5 | **Angular Architecture: Scalable Best Practices** | [dev-academy.com](https://dev-academy.com/angular-architecture-best-practices/) | 可擴展的 Angular 架構最佳實踐，包含三層架構、Smart/Dumb 元件、Facade 模式。 |

---

## 效能優化

涵蓋編譯時期、執行時期與網路傳輸的效能最佳化資源。

| # | 資源 | 連結 | 摘要 |
|---|------|------|------|
| 1 | **Angular Roadmap** | [angular.dev/roadmap](https://angular.dev/roadmap) | Angular 官方開發路線圖，追蹤 Zoneless 穩定化、Signal Forms、SSR 強化等即將到來的效能改進。 |
| 2 | **Fixing Performance with Zoneless Change Detection** | [medium.com/codetodeploy](https://medium.com/codetodeploy/fixing-angular-performance-with-zoneless-change-detection-d12a541bcd9f) | Zoneless 變更偵測的實務遷移指南，包含效能對比數據與逐步遷移策略。 |
| 3 | **Angular 20 Going Zoneless** | [dev.to/cristiansifuentes](https://dev.to/cristiansifuentes/angular-20-going-zoneless-the-future-without-zonejs-3m38) | Angular 20 Zoneless 模式的深入分析，說明 `provideZonelessChangeDetection()` 的使用方式。 |
| 4 | **Angular 21: Signal Forms, Zoneless Migration** | [infoq.com/news](https://www.infoq.com/news/2025/11/angular-21-released/) | Angular 21 正式發布報導，Signal Forms 與 Zoneless 預設化是兩大亮點。 |
| 5 | **Angular 2025: Signals, Standalone, Performance** | [blog.madrigan.com](https://blog.madrigan.com/en/blog/202602161006/) | 結合 Signals 與 Standalone 的效能優化綜合指南。 |

---

## 安全性

Angular 應用的安全性資源，涵蓋 OWASP Top 10 中與前端相關的攻擊向量。

| # | 資源 | 連結 | 摘要 |
|---|------|------|------|
| 1 | **Angular Security (Official)** | [angular.dev/best-practices/security](https://angular.dev/best-practices/security) | 官方安全指南：XSS 防護（DomSanitizer、Trusted Types）、CSP 配置（autoCsp）、CSRF/XSRF 保護（HttpClient 自動處理）、SSRF 防護。 |
| 2 | **How to Build Secure Angular Applications 2025** | [nanobytetechnologies.com](https://nanobytetechnologies.com/Blog/How-to-Build-Secure-Angular-Applications-Key-Security-Practices-for-2025) | 2025 年安全開發實踐，涵蓋輸入驗證、認證流程、HTTP 安全標頭。 |
| 3 | **Angular Security Best Practices (Security Compass)** | [securitycompass.com/blog](https://www.securitycompass.com/blog/angular-security-best-practices/) | 從企業安全角度分析 Angular 應用的防護策略，對應 CWE/CVE 標準。 |
| 4 | **CSP with Angular: Best Practices 2026** | [copyprogramming.com](https://copyprogramming.com/howto/what-is-the-best-practice-to-use-content-security-policy-with-an-angular-site) | 專注於 CSP 配置的實務指南，包含 nonce 管理、政策設計、與 Angular autoCsp 整合。 |
| 5 | **Angular Security Vulnerabilities (Security Compass)** | [securitycompass.com/blog](https://www.securitycompass.com/blog/angular-security-vulnerabilities-and-how-to-fix-them/) | Angular 常見安全漏洞清單與修復方案，包含第三方套件安全審計。 |

---

## 延伸閱讀

### 適合 .NET 開發者的過渡資源

- **TypeScript 官方手冊**：[typescriptlang.org/docs](https://www.typescriptlang.org/docs/) — TypeScript 與 C# 共享相同的設計者（Anders Hejlsberg），語法與型別系統高度相似。
- **Angular CLI 參考**：[angular.dev/cli](https://angular.dev/cli) — 類比 `dotnet` CLI，Angular CLI 管理專案腳手架、建置、測試與部署。
- **RxJS 指南**：[rxjs.dev](https://rxjs.dev/) — 雖然 Signals 取代了多數 RxJS 使用場景，但理解 Observable 模式在 HTTP 與事件處理上仍然重要。類比 .NET 的 `System.Reactive` (Rx.NET)。
- **Angular Material**：[material.angular.io](https://material.angular.io/) — 官方 UI 元件庫，類比 .NET 的 Telerik/DevExpress，但完全開源。
- **Angular Animations**：[angular.dev/guide/animations](https://angular.dev/guide/animations) — 宣告式動畫 API，基於 Web Animations API。在 .NET 世界中沒有直接類比，但概念類似 WPF 的 Storyboard 動畫。
- **Angular CDK**：[material.angular.io/cdk](https://material.angular.io/cdk/categories) — Component Dev Kit，提供不帶樣式的低階 UI 原語（拖放、虛擬捲動、覆蓋層等）。適合需要自訂設計系統的專案。

### TypeScript vs C# 語法速查

以下是 .NET 開發者最常混淆的 TypeScript 語法對照：

| C# | TypeScript | 說明 |
|----|-----------|------|
| `string name = "John";` | `const name: string = 'John';` | 偏好 `const`，型別可推導時省略 |
| `int[] numbers = {1, 2, 3};` | `const numbers: number[] = [1, 2, 3];` | 陣列使用 `[]` 而非 `{}` |
| `Dictionary<string, int>` | `Record<string, number>` 或 `Map<string, number>` | 字典/映射 |
| `List<T>.Where(x => ...)` | `array.filter(x => ...)` | LINQ → Array methods |
| `List<T>.Select(x => ...)` | `array.map(x => ...)` | LINQ → Array methods |
| `List<T>.Any(x => ...)` | `array.some(x => ...)` | LINQ → Array methods |
| `List<T>.All(x => ...)` | `array.every(x => ...)` | LINQ → Array methods |
| `List<T>.First(x => ...)` | `array.find(x => ...)` | LINQ → Array methods |
| `async Task<T>` | `async (): Promise<T>` | 非同步方法回傳型別 |
| `await Task.WhenAll(...)` | `await Promise.all(...)` | 並行非同步 |
| `nameof(User)` | — (無直接等價) | TypeScript 無 `nameof` |
| `string?` | `string \| null` | Nullable 用 union type |
| `object` | `unknown` | 未知型別（不用 `any`） |
| `var (a, b) = tuple;` | `const { a, b } = obj;` | 解構賦值 |
| `switch expression` | — (用 `@switch` in template) | 模式匹配 |
| `record User(string Name);` | `interface User { name: string; }` | 不可變資料型別 |
| `enum Color { Red, Green }` | `enum Color { Red = 'red', Green = 'green' }` | 偏好字串列舉 |
| `using System.Linq;` | `import { map } from 'rxjs';` | 選擇性匯入 |

### ASP.NET Core vs Angular 架構對照

以下是完整的後端（ASP.NET Core Web API）與前端（Angular SPA）架構對照，幫助理解兩端如何協作：

```
ASP.NET Core Web API          ←→          Angular SPA
─────────────────────                     ─────────────────────
Program.cs                    ←→          main.ts + app.config.ts
  builder.Services.AddXxx()   ←→            providers: [provideXxx()]
  app.UseMiddleware()         ←→            withInterceptors([...])

Controllers/                  ←→          features/
  UsersController.cs          ←→            users/
    [HttpGet]                 ←→              user-list.ts (component)
    [HttpGet("{id}")]         ←→              user-detail.ts (component)

Services/                     ←→          services/
  UserService.cs              ←→            user.service.ts (facade)
  IUserRepository.cs          ←→            user.api.ts (HTTP client)

Models/                       ←→          models/
  User.cs                     ←→            user.model.ts
  CreateUserDto.cs            ←→            create-user.dto.ts

Middleware/                   ←→          interceptors/
  ExceptionMiddleware.cs      ←→            error.interceptor.ts
  AuthMiddleware.cs           ←→            auth.interceptor.ts

Filters/                      ←→          guards/
  AuthorizationFilter.cs      ←→            auth.guard.ts

appsettings.json              ←→          environment.ts
Startup validation            ←→          APP_INITIALIZER / provideAppInitializer()
```

### 概念對照表（.NET vs Angular）

| .NET 概念 | Angular 對應 | 說明 |
|-----------|-------------|------|
| Razor Component | Angular Component | UI 元件的基本單位 |
| `IServiceCollection` / DI Container | `inject()` / Injector Tree | 依賴注入系統 |
| Middleware | Interceptor / Guard | 請求管線 |
| `INotifyPropertyChanged` | `signal()` / `computed()` | 響應式狀態管理 |
| FluentValidation | Reactive Forms + Validators | 表單驗證 |
| `HttpClient` + `DelegatingHandler` | `HttpClient` + `HttpInterceptorFn` | HTTP 通訊 |
| EF Core DbContext | Service + `resource()` | 資料存取層 |
| xUnit / NUnit | Jasmine / Karma / Jest | 測試框架 |
| `WebApplicationFactory` | `TestBed` | 測試用 DI 容器 |
| ASP.NET Core Routing | Angular Router | 路由系統 |
| Razor Pages Layout | Angular Router Outlet / Layout | 版面配置 |
| NuGet | npm | 套件管理 |
| `dotnet` CLI | `ng` CLI | 專案工具鏈 |

---

## 學習路線圖

### 第一階段：基礎建立（第 1-2 週）

目標：理解 Angular 的核心概念，能夠建立簡單的 CRUD 頁面。

| 天數 | 主題 | 學習資源 | 實作練習 |
|------|------|---------|---------|
| 1-2 | TypeScript 基礎 | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) | 利用 C# 經驗快速掌握：interface、generics、decorators、union types |
| 3-4 | 元件與模板 | [01-official-docs-summary.md #元件系統](./01-official-docs-summary.md#元件系統) | 建立第一個 Standalone 元件，使用 `@if`/`@for` 控制流 |
| 5-6 | Signals 響應式 | [01-official-docs-summary.md #信號響應式](./01-official-docs-summary.md#信號響應式) | 實作 Todo List：使用 `signal()`、`computed()`、`effect()` |
| 7-8 | 依賴注入 | [01-official-docs-summary.md #相依注入](./01-official-docs-summary.md#相依注入) | 建立 Service 並透過 `inject()` 注入元件 |
| 9-10 | 路由與表單 | [01-official-docs-summary.md #路由導覽](./01-official-docs-summary.md#路由導覽) | 建立多頁面應用，含 Reactive Form 表單驗證 |

### 第二階段：進階實踐（第 3-4 週）

目標：掌握企業級開發模式，能夠設計中型應用架構。

| 天數 | 主題 | 學習資源 | 實作練習 |
|------|------|---------|---------|
| 11-12 | HttpClient 與攔截器 | [01-official-docs-summary.md #http-通訊](./01-official-docs-summary.md#http-通訊) | 實作 Auth Interceptor + Error Interceptor |
| 13-14 | Smart/Dumb 元件 | [02-best-practices-catalog.md #3](./02-best-practices-catalog.md#3-智慧展示元件模式-smartdumb) | 重構既有元件為 Smart/Dumb 分離 |
| 15-16 | Facade 模式 | [02-best-practices-catalog.md #4](./02-best-practices-catalog.md#4-facade-服務模式) | 實作 API → State → Facade 三層結構 |
| 17-18 | 狀態管理 | [02-best-practices-catalog.md #5](./02-best-practices-catalog.md#5-狀態管理選擇矩陣) | 使用 Service + Signals 管理跨元件狀態 |
| 19-20 | 測試策略 | [01-official-docs-summary.md #測試策略](./01-official-docs-summary.md#測試策略) | 為元件與服務撰寫單元測試 |

### 第三階段：架構設計（第 5-6 週）

目標：能夠獨立設計企業級 Angular 應用架構。

| 天數 | 主題 | 學習資源 | 實作練習 |
|------|------|---------|---------|
| 21-22 | 專案結構設計 | [03-enterprise-patterns.md #1](./03-enterprise-patterns.md#1-專案結構模式) | 設計 Domain-driven 資料夾結構 |
| 23-24 | 效能優化 | [02-best-practices-catalog.md #6-#7](./02-best-practices-catalog.md#6-onpush-變更偵測最佳實踐) | 實作 OnPush + 延遲載入 + `@defer` |
| 25-26 | 安全性實踐 | [02-best-practices-catalog.md #10](./02-best-practices-catalog.md#10-安全性防護-xss-csrf-csp) | 配置 CSP + XSRF + Trusted Types |
| 27-28 | 錯誤處理與日誌 | [03-enterprise-patterns.md #7](./03-enterprise-patterns.md#7-錯誤處理與日誌策略) | 實作分層錯誤處理 + 日誌收集 |
| 29-30 | 綜合專案 | 全部文件 | 建立完整的企業級 CRUD 應用 |

---

## 工具鏈參考

### 開發工具

| 工具 | 用途 | .NET 類比 | 安裝/設定 |
|------|------|----------|----------|
| **Node.js** (v20+) | JavaScript 執行環境 | .NET Runtime | [nodejs.org](https://nodejs.org/) |
| **npm** | 套件管理 | NuGet | 隨 Node.js 安裝 |
| **Angular CLI** (`ng`) | 專案腳手架與建置 | `dotnet` CLI | `npm install -g @angular/cli` |
| **VS Code** | IDE | Visual Studio | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Angular Language Service** | IDE 智慧提示 | C# Extension (OmniSharp) | VS Code Extension |
| **Angular DevTools** | 瀏覽器除錯 | Visual Studio Debugger | Chrome Extension |

### CLI 常用指令對照

| Angular CLI | .NET CLI | 說明 |
|-------------|----------|------|
| `ng new my-app` | `dotnet new webapi -n MyApp` | 建立新專案 |
| `ng serve` | `dotnet run` / `dotnet watch` | 啟動開發伺服器 |
| `ng build` | `dotnet build` / `dotnet publish` | 建置專案 |
| `ng test` | `dotnet test` | 執行測試 |
| `ng generate component user-list` | — (手動建立) | 產生元件腳手架 |
| `ng add @angular/material` | `dotnet add package` | 新增套件並自動設定 |
| `ng update` | `dotnet tool update` | 更新框架版本 |
| `ng lint` | `dotnet format` | 程式碼品質檢查 |
| `ng e2e` | — (使用 Playwright) | 端對端測試 |

### 推薦 VS Code 擴充套件

| 擴充套件 | 用途 |
|---------|------|
| **Angular Language Service** | 模板智慧提示、型別檢查、重構 |
| **ESLint** | 程式碼品質與風格檢查 |
| **Prettier** | 程式碼格式化 |
| **Angular Snippets** | 常用程式碼片段 |
| **Material Icon Theme** | 檔案圖示（辨識 .ts/.html/.css） |
| **GitLens** | Git 歷史與 Blame 資訊 |
| **Error Lens** | 行內顯示錯誤訊息 |

### 建置與部署工具

| 工具 | 用途 | 說明 |
|------|------|------|
| **Vite** + **ESBuild** | 建置引擎 | Angular 17+ 的預設建置工具，取代 Webpack |
| **Lighthouse** | 效能審計 | 量測 Core Web Vitals、SEO、可存取性 |
| **Source Map Explorer** | Bundle 分析 | 視覺化每個檔案在 Bundle 中的大小 |
| **Nx** | Monorepo 工具 | 多專案管理、受影響分析、快取 |
| **Compodoc** | 文件產生 | 從程式碼自動產生 API 文件 |

---

## Angular 版本演進摘要

對於 .NET 開發者理解 Angular 當前狀態的脈絡，以下是近期版本的重大變更：

| 版本 | 發布日期 | 重大特性 | .NET 類比 |
|------|---------|---------|----------|
| **v16** | 2023-05 | Signals 引入（Developer Preview）、Standalone APIs 穩定 | .NET 7 引入 Minimal API |
| **v17** | 2023-11 | 原生控制流（`@if`/`@for`/`@switch`）、`@defer`、Vite 建置 | .NET 8 引入 AOT 編譯 |
| **v18** | 2024-05 | Zoneless 實驗性支援、`resource()` 引入 | — |
| **v19** | 2024-11 | `standalone: true` 成為預設值、`linkedSignal()` | — |
| **v20** | 2025-05 | Zoneless 穩定、Signal-based inputs/outputs 成為標準 | .NET 9 效能優化 |
| **v21** | 2025-11 | Signal Forms、Zoneless 預設、zone.js 不再包含 | .NET 10（預計） |

### 關鍵轉折點

- **v17 是分水嶺**：原生控制流取代結構指令，`@defer` 引入延遲載入新範式
- **v19 是 Standalone 元年**：不再需要 NgModule，大幅降低入門門檻
- **v21 是 Zoneless 元年**：zone.js 退場，Signals 成為唯一的變更偵測驅動

---

## 常見問題 (FAQ)

### Q1: 我有豐富的 C# 經驗，學 Angular 最快的路徑是什麼？

**A**: 你的 C# 經驗會大幅加速學習。TypeScript 與 C# 由同一位設計者（Anders Hejlsberg）創造，語法高度相似。Angular 的 DI 系統幾乎等同於 .NET Core DI。建議先花 1-2 天掌握 TypeScript 的差異（union types、type narrowing、decorators），然後直接進入 Angular 元件開發。參考上方的學習路線圖。

### Q2: 我應該先學 RxJS 還是 Signals？

**A**: **先學 Signals**。在 v19+ 的 Angular 中，Signals 已取代了 80% 以上需要 RxJS 的場景。只有在處理複雜的事件流（WebSocket、debounce、switchMap）時才需要 RxJS。相較之下，Signals 的概念更接近你熟悉的 `INotifyPropertyChanged`。

### Q3: Angular Material 的定位是什麼？

**A**: Angular Material 是 Angular 的官方 UI 元件庫，基於 Google Material Design 規範。它提供現成的表單元件、導覽、資料表格、對話框等。在 .NET 生態系中，它的定位類似 Telerik UI 或 DevExpress，但完全免費且開源。

### Q4: NgModule 還需要學嗎？

**A**: **不需要深入學習**。v19+ 的 Angular 已全面轉向 Standalone 架構。NgModule 只在維護舊專案時才會遇到。如果你是新學習者，直接學 Standalone 元件即可。

### Q5: 前端需要像後端一樣嚴格的分層架構嗎？

**A**: **視專案規模而定**。小型專案（< 10 頁面）使用簡單的 Feature-based 結構就夠了。中型以上專案建議採用 Facade 模式與三層架構。參考 [03-enterprise-patterns.md](./03-enterprise-patterns.md) 的決策指南。

### Q6: Angular 的測試方案選擇？

**A**: Angular CLI 預設整合 Karma + Jasmine，但社群正逐步遷移至 Jest（更快的執行速度）與 Vitest（與 Vite 建置工具整合）。端對端測試推薦 Playwright 或 Cypress。測試策略與 .NET 相同：單元測試為主、整合測試為輔、E2E 測試覆蓋關鍵路徑。

---

## 本系列文件導覽

本參考系列包含四份文件，由淺入深涵蓋 Angular 開發所需的核心知識：

| 文件 | 內容 | 適合閱讀時機 |
|------|------|-------------|
| **[00-reference-index.md](./00-reference-index.md)** (本文件) | 資源索引與導覽 | 隨時查閱，作為入口點 |
| **[01-official-docs-summary.md](./01-official-docs-summary.md)** | 官方文件濃縮摘要 | 初期學習，快速掌握框架全貌 |
| **[02-best-practices-catalog.md](./02-best-practices-catalog.md)** | 社群最佳實踐彙整 | 開始實作時，查閱特定主題的推薦作法 |
| **[03-enterprise-patterns.md](./03-enterprise-patterns.md)** | 企業架構模式 | 設計大型專案架構時的決策參考 |

### 建議閱讀順序

1. 先閱讀本索引，建立 Angular 生態系的全貌認知
2. 閱讀 `01-official-docs-summary.md` 掌握框架核心 API
3. 在實作過程中查閱 `02-best-practices-catalog.md` 的特定主題
4. 設計專案架構時參考 `03-enterprise-patterns.md`

---

## 關鍵術語對照表

對於從 .NET 轉型的開發者，以下術語對照表有助於快速理解 Angular 生態系中的專有名詞：

### 框架核心術語

| Angular 術語 | 英文全稱 | 定義 | .NET 類比 |
|-------------|---------|------|----------|
| Component | Component | 可重用的 UI 建構單元，由 TS + HTML + CSS 組成 | Razor Component / User Control |
| Template | Template | 元件的 HTML 視圖部分 | Razor View (.cshtml) |
| Directive | Directive | 修改 DOM 元素行為的指令 | TagHelper / HtmlHelper |
| Pipe | Pipe | 模板中的資料轉換函式 | Display Format / ValueConverter |
| Service | Service | 可注入的業務邏輯或資料存取類別 | Service class registered in DI |
| Guard | Guard | 路由導覽的存取控制 | Authorization Filter |
| Interceptor | Interceptor | HTTP 請求/回應的管線處理器 | DelegatingHandler / Middleware |
| Resolver | Resolver | 路由啟動前的資料預載 | IAsyncActionFilter (data) |
| Module | NgModule | 舊版元件組織容器（v19+ 已棄用） | Assembly / Namespace grouping |

### 響應式術語

| Angular 術語 | 英文全稱 | 定義 | .NET 類比 |
|-------------|---------|------|----------|
| Signal | Signal | 可追蹤的響應式值容器 | `ObservableProperty` / `INotifyPropertyChanged` |
| Computed | Computed Signal | 從其他 Signal 衍生的唯讀值 | Computed property with caching |
| Effect | Effect | 當 Signal 變更時自動執行的副作用 | Property change event handler |
| Observable | Observable | RxJS 的非同步資料流 | `IObservable<T>` (Rx.NET) |
| Subject | Subject | 可主動推送值的 Observable | `Subject<T>` (Rx.NET) |
| Resource | Resource | 將非同步資料載入物質化為 Signal 狀態 | `IAsyncEnumerable<T>` + caching |

### 建置與部署術語

| Angular 術語 | 英文全稱 | 定義 | .NET 類比 |
|-------------|---------|------|----------|
| AOT | Ahead-of-Time Compilation | 建置時編譯模板，提升效能與安全性 | .NET AOT / NativeAOT |
| Tree Shaking | Tree Shaking | 移除未使用的程式碼以減少 Bundle 大小 | Trimming in .NET |
| Lazy Loading | Lazy Loading | 按需載入程式碼區塊 | Assembly lazy loading |
| SSR | Server-Side Rendering | 伺服器端渲染，改善 SEO 與首次載入 | Razor Server-side rendering |
| SSG | Static Site Generation | 建置時產生靜態 HTML | — |
| Hydration | Hydration | 伺服器渲染的 HTML 在客戶端「活化」 | Blazor Server reconnection |
| Bundle | Bundle | 打包後的 JavaScript/CSS 檔案 | Published DLL |
| Chunk | Chunk | 延遲載入產生的獨立 Bundle 片段 | Lazy-loaded assembly |

### 測試術語

| Angular 術語 | 英文全稱 | 定義 | .NET 類比 |
|-------------|---------|------|----------|
| TestBed | TestBed | 測試用的 DI 容器與元件工廠 | `WebApplicationFactory<T>` |
| ComponentFixture | Component Fixture | 測試中的元件實例包裝器 | `HttpClient` from test server |
| SpyObj | Spy Object | Jasmine 的 Mock 物件 | `Mock<T>` (Moq) / `Substitute.For<T>` |
| HttpTestingController | HTTP Testing Controller | HTTP 請求的攔截與模擬工具 | `MockHttpMessageHandler` |
| Karma | Karma | 測試執行器（正被 Jest/Vitest 取代） | Test runner (xUnit/NUnit runner) |
| Jasmine | Jasmine | 測試斷言框架 | xUnit / NUnit assertions |

---

## 社群與支援管道

### 官方管道

| 管道 | 連結 | 用途 |
|------|------|------|
| **Angular Blog** | [blog.angular.dev](https://blog.angular.dev/) | 版本發布公告、重大特性介紹 |
| **Angular GitHub** | [github.com/angular/angular](https://github.com/angular/angular) | Issue 追蹤、RFC 討論、源碼 |
| **Angular Discord** | [discord.gg/angular](https://discord.gg/angular) | 即時社群討論、問題求助 |
| **Stack Overflow** | [stackoverflow.com/questions/tagged/angular](https://stackoverflow.com/questions/tagged/angular) | 技術問答（最大的 Angular Q&A 庫） |

### 知名社群資源

| 資源 | 類型 | 說明 |
|------|------|------|
| **Angular University** | 課程/部落格 | 深入的 Angular 教學，特別適合進階開發者 |
| **Nx Blog** | 部落格 | 企業架構、Monorepo、效能優化 |
| **Angular Experts** | 諮詢/培訓 | Tomas Trajan 的企業 Angular 培訓服務 |
| **ng-conf** | 年會 | Angular 最大的年度開發者大會 |
| **Angular Love** | 部落格 | 涵蓋 Angular 生態系的多元文章 |
| **Decoded Frontend** | YouTube | Angular 進階概念的影片教學 |

### 台灣 Angular 社群

| 資源 | 連結 | 說明 |
|------|------|------|
| **Angular Taiwan** | [Facebook Group](https://www.facebook.com/groups/augularjs.tw/) | 台灣 Angular 開發者社群 |
| **Angular Taiwan Meetup** | [meetup.com](https://www.meetup.com/) | 不定期技術聚會 |

---

> **維護說明**：本文件應隨 Angular 版本更新而同步修訂。當前內容基於 Angular v19-v21 撰寫。
