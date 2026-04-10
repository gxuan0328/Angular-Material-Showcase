# Angular Material Block Showcase — 系統規格文件

> **文件版本**：1.3.0  
> **最後更新**：2026-04-10  
> **適用版本**：Angular 21.2.8 / Angular Material 21.2.6 / Tailwind CSS v4.1.12

---

## 目錄

1. [專案概述](#1-專案概述)
2. [系統架構](#2-系統架構)
3. [功能規格](#3-功能規格)
4. [響應式設計規格](#4-響應式設計規格)
5. [字體與視覺設計](#5-字體與視覺設計)
6. [無障礙規格](#6-無障礙規格)
7. [部署架構](#7-部署架構)
8. [測試策略](#8-測試策略)

---

## 1. 專案概述

### 1.1 目的

**Angular Material Block Showcase** (代號 **Glacier Analytics**) 是一套全方位 Angular 21 展示應用程式，旨在：

- 展示 [ui.angular-material.dev](https://ui.angular-material.dev/) 提供的 UI Building Block 在真實場景中的整合效果
- 提供一個 **Live Catalog**，讓開發者可即時預覽、瀏覽原始碼、調整 CSS、查閱 API 文件與最佳實踐
- 示範 Angular 21 最新實務：Zoneless Change Detection、Signal-based State Management、Native Control Flow、OnPush、Standalone Components
- 提供一個 **完整 SaaS 後台原型** (Dashboard / Users / Teams / Billing / Reports / Settings)，展現 Application-grade 的 UI Block 應用

### 1.2 目標受眾

| 受眾 | 關注重點 |
|---|---|
| 前端開發者 | Block 原始碼、整合方式、API Reference |
| UI/UX 設計師 | 視覺風格、響應式佈局、主題切換 |
| 技術主管 | 架構設計、可維護性、技術選型 |
| 產品經理 | 功能範圍、使用者流程、可交付項目 |

### 1.3 技術堆疊

| 層級 | 技術 | 版本 |
|---|---|---|
| Framework | Angular | 21.2.8 |
| UI Library | Angular Material + CDK | 21.2.6 |
| CSS Framework | Tailwind CSS v4 + PostCSS | 4.1.12 |
| Charts | Chart.js + ng2-charts | 4.5.1 / 8.0.0 |
| Language | TypeScript (strict mode) | 5.9.2 |
| Package Manager | npm | - |
| Build Tool | @angular/build (esbuild) | 21.2.7 |
| Linting | ESLint + angular-eslint + Prettier | 9.39.1 / 21.3.1 / 3.8.1 |
| Testing | Karma + Jasmine + Playwright (E2E) | 6.4 / 5.9 / 1.59.1 |
| Container | Docker (node:22-alpine + nginx:alpine) | - |
| Tunnel | ngrok | latest |

### 1.4 第三方套件

| 套件 | 用途 |
|---|---|
| `@fontsource/nunito` | 英文字體 (Latin) |
| `@fontsource/noto-sans-tc` | 繁體中文字體 |
| `@fontsource/jetbrains-mono` | 程式碼等寬字體 |
| `@ngx-dropzone/cdk` + `@ngx-dropzone/material` | 檔案上傳 Dropzone |
| `@ngxpert/avvvatars` | 使用者頭像產生器 |
| `@octokit/core` | GitHub API 整合 |
| `cobe` | 3D Globe 視覺效果 (Fancy Block) |
| `clsx` + `tailwind-merge` | 條件式 CSS class 合併 |

---

## 2. 系統架構

### 2.1 應用程式結構 — 五大 Layout

本應用採用 **Layout-based Routing** 架構，由五個頂層 Layout 各自包覆獨立的功能路由群：

```
App (root)
├── LandingLayout    → /              行銷著陸頁
├── CatalogLayout    → /catalog/**    元件目錄系統
├── AdminLayout      → /app/**        SaaS 管理後台 (需驗證)
├── GuideLayout      → /guide/**      Angular 深度教學指南
└── AuthLayout       → /auth/**       認證流程
```

#### 路由載入策略

所有 Layout 與子頁面均採用 **Lazy Loading**：

```typescript
// app.routes.ts — 頂層路由
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/landing-layout/landing-layout').then(m => m.LandingLayout),
    loadChildren: () => import('./landing/landing.routes').then(m => m.LANDING_ROUTES),
  },
  {
    path: 'catalog',
    loadComponent: () => import('./layouts/catalog-layout/catalog-layout').then(m => m.CatalogLayout),
    loadChildren: () => import('./catalog/catalog.routes').then(m => m.CATALOG_ROUTES),
  },
  {
    path: 'app',
    canMatch: [authMatchGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    loadChildren: () => import('./app-shell/app-shell.routes').then(m => m.APP_SHELL_ROUTES),
  },
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout').then(m => m.AuthLayout),
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
```

#### Layout 元件一覽

| Layout | 選擇器 | 功能 |
|---|---|---|
| `LandingLayout` | `app-landing-layout` | 簡約頂部導覽 + ThemeToggle + ThemePaletteSelector |
| `CatalogLayout` | `app-catalog-layout` | 左側 CatalogNav 樹 + 頂部導覽 + 響應式收合 |
| `AdminLayout` | `app-admin-layout` | MatSidenav 側邊欄 + 頂部工具列 + 使用者選單 |
| `GuideLayout` | `app-guide-layout` | 左側教學章節導覽 + 頂部工具列 + 響應式收合 |
| `AuthLayout` | `app-auth-layout` | 置中卡片 + ThemeToggle + ThemePaletteSelector |

#### 全域元件

`App` 根元件掛載兩個全域元素：

```html
<router-outlet />
<app-showcase-switcher />
```

`ShowcaseSwitcher` 是固定在右下角的 FAB，點擊展開四個快速切換按鈕：

| 路由 | 圖示 | 說明 |
|---|---|---|
| `/` | `language` | 行銷 Landing Page |
| `/catalog` | `grid_view` | 元件目錄 |
| `/app/dashboard` | `dashboard` | SaaS 管理後台 |
| `/guide` | `school` | Angular 深度教學指南 |

### 2.2 狀態管理 — Signal-based Architecture

本專案 **完全不使用 NgRx / NGXS / Akita** 等狀態管理庫，而是以 Angular Signals 原生能力搭配 Service Store pattern 實現所有狀態管理。

#### 核心原則

1. **Service 持有 private writable signal**，對外僅暴露 `readonly` 版本
2. **computed()** 衍生所有計算狀態（如篩選後清單、統計數字）
3. **effect()** 僅用於 DOM side-effect（如 class toggle、localStorage 持久化）
4. **Immutable update** — 任何 mutation 皆產生新的 reference

#### Store 清單

| Store / API Service | 位置 | 職責 |
|---|---|---|
| `ThemeStore` | `core/theme/theme-store.ts` | 主題模式 (light/dark/system)、色板選擇、CSS 套用 |
| `AuthStore` | `core/auth/auth-store.ts` | 認證狀態、Session 持久化、登入/登出/註冊 |
| `OnboardingStore` | `app-shell/dashboard/onboarding-store.ts` | Onboarding Checklist 進度、dismiss 持久化 |
| `I18nStore` | `core/i18n/i18n-store.ts` | 國際化字典載入與翻譯函式 |
| `ChartPaletteService` | `core/charts/chart-palette.ts` | 從 CSS Variables 讀取 Material 3 color tokens，供 Chart.js 使用 |
| `MockDashboardApi` | `core/mock-api/mock-dashboard.ts` | Dashboard KPI、Revenue、Plans、TopPages、Feed |
| `MockUsersApi` | `core/mock-api/mock-users.ts` | 使用者 CRUD、篩選、批量操作 |
| `MockTeamsApi` | `core/mock-api/mock-teams.ts` | 團隊清單 |
| `MockNotificationsApi` | `core/mock-api/mock-notifications.ts` | 通知清單、篩選、已讀標記 |
| `MockBillingApi` | `core/mock-api/mock-billing.ts` | 方案、發票、付款方式、用量指標 |
| `MockReportsApi` | `core/mock-api/mock-reports.ts` | 報表 KPI、時間序列、排行榜 |
| `MockSettingsApi` | `core/mock-api/mock-settings.ts` | 個人檔案、2FA、API Keys、整合、偏好設定 |
| `MockAuthApi` | `core/mock-api/mock-auth-api.ts` | 登入、註冊、忘記密碼、重設密碼、2FA 驗證 |

### 2.3 主題系統

#### 2.3.1 Material 3 Palette 機制

系統支援 **12 組 Material 3 色板**，透過 SCSS `@each` 迴圈在 `themes.scss` 中產生完整的 light / dark 主題變體：

| ID | 中文名 | 色彩色碼 |
|---|---|---|
| `azure` | 天藍 | `#005cbb` |
| `blue` | 藍 | `#1450a6` |
| `violet` | 紫羅蘭 | `#6439ba` |
| `magenta` | 洋紅 | `#9b2c6f` |
| `rose` | 玫瑰 | `#a8264a` |
| `red` | 紅 | `#ba1a1a` |
| `orange` | 橙 | `#8c4a00` |
| `yellow` | 黃 | `#6c5d00` |
| `chartreuse` | 嫩綠 | `#4d6600` |
| `green` | 綠 | `#1a6c2b` |
| `spring-green` | 春綠 | `#006b4f` |
| `cyan` | 青 | `#006874` |

#### 2.3.2 主題切換機制

```
ThemeStore (root singleton)
├── _mode: signal<ThemeMode>          → 'light' | 'dark' | 'system'
├── _palette: signal<ThemePalette>    → 12 palette IDs
├── _systemPrefers: signal            → 監聽 prefers-color-scheme
├── effectiveMode: computed           → 計算實際生效的 light/dark
├── isDark: computed                  → boolean
│
├── effect → document.documentElement.classList.toggle('dark', isDark)
└── effect → document.documentElement.setAttribute('data-palette', palette)
```

**SCSS 實現**：

```scss
// themes.scss — 每個 palette × light/dark = 24 套主題
@each $name, $palette in $palettes {
  :root[data-palette='#{$name}'] {
    @include mat.theme((color: (theme-type: light, primary: $palette), typography: Nunito, density: 0));
  }
  :root[data-palette='#{$name}'].dark {
    @include mat.theme((color: (theme-type: dark, primary: $palette), typography: Nunito, density: 0));
  }
}
```

**持久化**：

- `localStorage('theme-mode')` → 儲存 ThemeMode
- `localStorage('theme-palette')` → 儲存 ThemePalette ID
- 預設值：mode = `'system'`、palette = `'azure'`

#### 2.3.3 Chart.js 色彩同步

`ChartPaletteService` 從 `getComputedStyle(document.documentElement)` 讀取 `--mat-sys-*` CSS custom properties，組成 `ChartPalette` 物件，確保：

- 色板切換時圖表色彩即時更新
- Dark mode 切換時圖表顏色適配
- 使用 `withAlpha()` 函式產生半透明背景色

### 2.4 Mock API 層設計

#### 2.4.1 設計原則

1. **Result Pattern** — 所有 API 回傳 `AuthResult<T>` discriminated union：

```typescript
export type AuthResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: AuthErrorCode };
```

2. **人造延遲** — 每個操作固定加入 120~220ms delay，確保 loading 狀態可見
3. **確定性錯誤觸發** — 透過 email prefix 觸發特定錯誤路徑：

| Email Prefix | 觸發錯誤 | 適用 API |
|---|---|---|
| `locked@...` | `AccountLocked` | signIn |
| `network@...` | `Unknown` | signIn, signUp, forgotPassword |
| `exists@...` | `EmailAlreadyInUse` | signUp |
| `unknown@...` | `UserNotFound` | forgotPassword |
| 密碼長度 < 6 | `InvalidCredentials` | signIn |
| 密碼長度 < 8 | `WeakPassword` | signUp, resetPassword |
| 2FA code != `123456` | `InvalidCode` | verifyTwoFactor |
| 2FA code == `000000` | `TooManyAttempts` | verifyTwoFactor |

4. **JSON Fixture 後端** — 多數 API 從 `assets/mock-data/*.json` 載入初始資料

#### 2.4.2 AuthErrorCode 完整列舉

```typescript
export type AuthErrorCode =
  | 'InvalidCredentials'
  | 'AccountLocked'
  | 'EmailAlreadyInUse'
  | 'UserNotFound'
  | 'NotFound'
  | 'InvalidToken'
  | 'InvalidCode'
  | 'WeakPassword'
  | 'TooManyAttempts'
  | 'Unknown';
```

#### 2.4.3 Mock Data 檔案清單

| 檔案 | 服務 | 內容 |
|---|---|---|
| `dashboard-kpis.json` | MockDashboardApi | KPI 卡片資料 (label, value, unit, delta, sparkline) |
| `dashboard-plans.json` | MockDashboardApi | 方案分佈 (Free/Starter/Growth/Enterprise) |
| `dashboard-top-pages.json` | MockDashboardApi | 熱門頁面排行 |
| `dashboard-feeds.json` | MockDashboardApi | 活動動態 (signup/upgrade/alert/invoice/comment) |
| `users.json` | MockUsersApi | 使用者清單 (含 role/status/avatar/tags) |
| `teams.json` | MockTeamsApi | 團隊清單 (含 member id references) |
| `notifications.json` | MockNotificationsApi | 通知清單 (system/billing/invite) |
| `plans.json` | MockBillingApi | 訂閱方案 (Free/Starter/Growth/Enterprise) |
| `invoices.json` | MockBillingApi | 帳單紀錄 |
| `payment-methods.json` | MockBillingApi | 付款方式 (visa/mastercard/amex/ach) |
| `usage-metrics.json` | MockBillingApi | 用量指標 (含歷史序列) |
| `reports-metrics.json` | MockReportsApi | 報表 KPI + 時間序列 + 排行榜 |
| `api-keys.json` | MockSettingsApi | API 金鑰清單 |
| `integrations.json` | MockSettingsApi | 第三方整合狀態 |

### 2.5 Zoneless Change Detection

應用程式在 `app.config.ts` 中啟用 **Zoneless Change Detection**：

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    // ...
  ],
};
```

這意味著：

- **不載入 `zone.js`**，減少 bundle size 約 13KB (gzipped)
- 所有元件必須設定 `changeDetection: ChangeDetectionStrategy.OnPush`
- 狀態變更完全依賴 Signal 的自動通知機制
- `async` pipe 或 `markForCheck()` 仍可使用但不建議

### 2.6 應用初始化流程

`app.config.ts` 中的 `provideAppInitializer` 按序執行：

1. **AuthStore.restore()** — 從 localStorage 還原 Session
2. **ThemeStore hydration** — 注入 ThemeStore 觸發 constructor effects (套用 `.dark` class 與 `data-palette` attribute)
3. **MatIconRegistry 設定** — 設定預設 font-set class 為 `material-symbols-outlined`
4. **Chart.js 全域設定** — 註冊所有 Chart.js 模組並套用 Material 3 風格的預設值

---

## 3. 功能規格

### 3.1 Landing Page (`/`)

#### 3.1.1 結構

Landing Page 由 `LandingPage` 元件組合 **13 個 Vendor Block** 而成：

| 順序 | Block | 說明 |
|---|---|---|
| 1 | `hero-section-1` | 左文右圖英雄區 — 產品定位與核心 CTA |
| 2 | `stats-section-1` | 公司實績統計 (客戶數、處理量等) |
| 3 | `feature-section-1` | 產品特色介紹 — 圖示 + 說明 |
| 4 | `bento-grid-1` | Bento 不規則格狀展示 |
| 5 | `feature-section-5` | 第二組特色介紹 |
| 6 | `pricing-section-1` | 方案訂價 (Free/Starter/Growth/Enterprise) |
| 7 | `testimonial-section-1` | 使用者見證 |
| 8 | `hero-section-5` | 影片背景沉浸式英雄區 |
| 9 | `blog-section-1` | 部落格摘要 |
| 10 | `cta-section-1` | 行動呼籲 |
| 11 | `memory-album` (Fancy) | 互動式記憶相簿 (3D 效果) |
| 12 | `newsletter-section-1` | 訂閱電子報 |
| 13 | `contact-section-1` | 聯絡資訊 |

#### 3.1.2 佈局

- 全寬單欄 vertical stack
- Section 間以 `border-top: 1px solid outline-variant` 分隔
- Fancy 區段帶有特殊背景色 `surface-container-low`
- 首屏 Hero Section 無頂部分隔線 (`--flush`)

### 3.2 Catalog 系統 (`/catalog/**`)

#### 3.2.1 概覽

Catalog 系統是本專案的核心功能，提供 **45 個元件分類** 的即時預覽與文件展示。

##### 分類統計

| 類別 | 數量 | Milestone |
|---|---|---|
| Application (Vendor) | 29 | M1 (10) + M2 (18) + M3 (8) + M4 (7) |
| Application (Custom) | 2 | Steppers + Sidebars |
| Marketing (Vendor) | 14 | M2 |
| **合計** | **45** | |

##### Application 分類清單

| ID | 標題 | 子分類 |
|---|---|---|
| `account-user-management` | Account & User Management | Forms |
| `area-charts` | Area Charts | Charts |
| `authentication` | Authentication | Forms |
| `badges` | Badges | Elements |
| `bar-charts` | Bar Charts | Charts |
| `bar-lists` | Bar Lists | Charts |
| `billing-usage` | Billing & Usage | Forms |
| `chart-compositions` | Chart Compositions | Charts |
| `chart-tooltips` | Chart Tooltips | Charts |
| `components` | Components | Components |
| `dialogs` | Dialogs | Overlays |
| `donut-charts` | Donut Charts | Charts |
| `empty-states` | Empty States | Feedbacks |
| `file-upload` | File Upload | Forms |
| `filterbar` | Filter Bar | Components |
| `flyout-menus` | Flyout Menus | Overlays |
| `form-layouts` | Form Layouts | Forms |
| `grid-lists` | Grid Lists | Lists |
| `line-charts` | Line Charts | Charts |
| `lists` | Lists | Lists |
| `multi-column` | Multi-column | Application Shells |
| `page-headings` | Page Headings | Headings |
| `page-shells` | Page Shells | Application Shells |
| `section-headings` | Section Headings | Headings |
| `spark-area-charts` | Spark Area Charts | Charts |
| `stacked-layouts` | Stacked Layouts | Application Shells |
| `stacked-lists` | Stacked Lists | Lists |
| `status-monitoring` | Status Monitoring | Components |
| `tables` | Tables | Lists |
| `steppers` | Steppers (Custom) | Forms |
| `sidebars` | Sidebars (Custom) | Application Shells |

##### Marketing 分類清單

| ID | 標題 | 子分類 |
|---|---|---|
| `banners` | Banners | Elements |
| `bento-grids` | Bento Grids | Page Sections |
| `blog-sections` | Blog Sections | Page Sections |
| `contact-sections` | Contact Sections | Page Sections |
| `cta-sections` | CTA Sections | Page Sections |
| `fancy` | Fancy | Page Sections |
| `feature-sections` | Feature Sections | Page Sections |
| `header-sections` | Header Sections | Page Sections |
| `hero-sections` | Hero Sections | Page Sections |
| `kpi-cards` | KPI Cards | Page Sections |
| `newsletter-sections` | Newsletter Sections | Page Sections |
| `pricing-sections` | Pricing Sections | Page Sections |
| `stats-sections` | Stats Sections | Page Sections |
| `testimonial-sections` | Testimonial Sections | Page Sections |

#### 3.2.2 CatalogIndex (`/catalog`)

首頁以 Grid 卡片形式展示所有分類：

- 分為 **Application** 和 **Marketing** 兩大區段
- 每張卡片顯示：標題、摘要、子分類、狀態 pill (已上線 / 即將推出)
- Grid 佈局：`repeat(auto-fill, minmax(260px, 1fr))`

#### 3.2.3 CatalogPage (每個分類頁)

每個分類頁由以下元件組合：

```
CatalogPage (Shell)
├── VariantSelector      — 切換同分類下的不同變體
├── BlockPreview         — 即時渲染選中的 Block Variant
├── CodeViewer           — 顯示 Block 原始碼 (TS/HTML/CSS)
├── ApiTable             — Input/Output/Slot/CSS Property 文件表格
├── BestPracticesPanel   — When to use / When not to use / Pitfalls / Accessibility
└── LiveStyleEditor      — 即時 CSS 編輯器
```

#### 3.2.4 核心元件詳細規格

##### CatalogPage

- **輸入**：`meta: CatalogBlockMeta` (required)
- **功能**：
  - 計算 prev/next 導覽連結
  - 管理 LiveStyleEditor 的 CSS 注入（動態建立 `<style>` tag 到 `<head>`）
  - 在 `ngOnDestroy` 時清理注入的 style element
- **Slots**：preview / code / api / best-practices

##### BlockPreview

- **輸入**：`variant: BlockVariant` (required)
- **實作**：使用 `NgComponentOutlet` 動態渲染元件
- **demoInputs**：支援傳入 `Record<string, unknown>` 給需要 required input 的 Vendor Block

##### CodeViewer

- **輸入**：`category: string`, `variant: string` (required)
- **功能**：
  - 從 `assets/block-sources/{category}__{variant}.json` 載入預先 bake 好的原始碼
  - 支援檔案標籤切換 (TS / HTML / CSS)
  - 錯誤狀態顯示

##### VariantSelector

- **輸入**：`variants: BlockVariant[]`, `selectedId: string`
- **輸出**：`selectionChange: string`
- **功能**：水平捲動的變體選擇器

##### ApiTable

- **輸入**：`api: ApiDocumentation`
- **功能**：分四個區塊顯示 Inputs / Outputs / Slots / CSS Properties

```typescript
export interface ApiEntry {
  readonly name: string;
  readonly type: string;
  readonly default: string | null;
  readonly required: boolean;
  readonly description: string;
}

export interface ApiDocumentation {
  readonly inputs: readonly ApiEntry[];
  readonly outputs: readonly ApiEntry[];
  readonly slots: readonly ApiEntry[];
  readonly cssProperties: readonly ApiEntry[];
}
```

##### BestPracticesPanel

- **輸入**：`notes: BestPracticeNotes`
- **功能**：分四個區塊顯示最佳實踐建議

```typescript
export interface BestPracticeNotes {
  readonly whenToUse: readonly string[];
  readonly whenNotToUse: readonly string[];
  readonly pitfalls: readonly string[];
  readonly accessibility: readonly string[];
}
```

##### LiveStyleEditor

- **輸入**：`defaultCss: string` (optional)
- **輸出**：`styleChange: string`
- **功能**：
  - 提供 textarea 讓使用者即時編輯 CSS
  - 透過 event 通知 parent CatalogPage 注入 CSS 到 `<head>`
  - 提供 Reset / Clear 按鈕
  - 顯示行號計數

#### 3.2.5 CatalogNav (左側導覽)

- 從 `CATALOG_REGISTRY` 建構二級樹狀結構
- 第一層：Application / Marketing
- 第二層：Subcategory (可展開/收合)
- 第三層：個別分類連結
- 自動展開包含當前路由的 subcategory group
- 使用 `RouterLinkActive` 標示作用中項目

#### 3.2.6 CatalogRegistry (資料來源)

`CATALOG_REGISTRY` 是 Catalog 系統的 **Single Source of Truth**：

```typescript
export interface CatalogRegistryEntry {
  readonly id: string;        // 對應 route path
  readonly title: string;     // 顯示名稱
  readonly category: BlockDisplayCategory;  // 'application' | 'marketing'
  readonly subcategory: string;  // 子分類群組
  readonly summary: string;      // 中文摘要
  readonly status: CatalogStatus; // 'shipped' | 'coming-soon'
}
```

### 3.3 App Shell — SaaS 管理後台 (`/app/**`)

#### 3.3.1 存取控制

`/app` 路由群受 `authMatchGuard` (CanMatchFn) 保護：

```typescript
export const authMatchGuard: CanMatchFn = (): boolean | UrlTree => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.createUrlTree(['/auth/sign-in']);
};
```

- 使用 `CanMatch` 而非 `CanActivate`，未驗證使用者完全無法匹配路由
- Session 有效期為 8 小時 (mock JWT)

#### 3.3.2 AdminLayout

- **側邊欄 (MatSidenav)**：7 個導覽項目
- **頂部工具列**：Hamburger menu + App logo + ThemeToggle + ThemePaletteSelector + 使用者選單
- **響應式行為**：768px 斷點切換 side / over 模式
- 路由切換時自動關閉 overlay 側邊欄 (mobile)

| 導覽項目 | 路由 | 圖示 |
|---|---|---|
| 儀表板 | `/app/dashboard` | `dashboard` |
| 使用者管理 | `/app/users` | `group` |
| 團隊與成員 | `/app/teams` | `groups` |
| 通知中心 | `/app/notifications` | `notifications` |
| 計費與用量 | `/app/billing` | `credit_card` |
| 報表分析 | `/app/reports` | `insights` |
| 設定 | `/app/settings` | `settings` |

#### 3.3.3 Dashboard (`/app/dashboard`)

Dashboard 組合以下六大區塊：

1. **KPI Row** — 4 張指標卡片 (MRR、Active Users、Churn Rate、Total Revenue)，每張含 sparkline 迷你面積圖與 delta 變化百分比
2. **90-day Revenue Area Chart** — Chart.js line chart，使用 `ChartPaletteService` 的 primary color，顯示日營收趨勢
3. **Plan Distribution Donut Chart** — Chart.js doughnut chart，顯示方案用戶分佈
4. **Top Pages Bar List** — 熱門頁面流量排行
5. **Activity Feed** — 最新活動動態（signup / upgrade / alert / invoice / comment），含時間戳與使用者頭像
6. **Onboarding Checklist** — 可收合/dismiss 的新手引導清單

**Onboarding Checklist 步驟**：

| 步驟 | 標題 | 說明 | 預設 | 連結 |
|---|---|---|---|---|
| `connect-source` | 連結資料來源 | 接上你的數據倉儲或 GA4 | 未完成 | `/app/settings` |
| `invite-team` | 邀請團隊成員 | 建立多使用者工作區 | 未完成 | `/app/users` |
| `create-dashboard` | 建立第一個看板 | 以預設範本組合 KPI | ✓ 已完成 | - |
| `set-alerts` | 設定指標警示 | 關鍵指標偏離閾值通知 | 未完成 | `/app/notifications` |

#### 3.3.4 Users (`/app/users`)

| 路由 | 元件 | 功能 |
|---|---|---|
| `/app/users` | `Users` | 使用者清單（篩選、搜尋、批量刪除） |
| `/app/users/new` | `UserNew` | 新增使用者表單 |
| `/app/users/:id` | `UserDetail` | 使用者詳情與編輯 |

**使用者資料模型**：

```typescript
export interface MockUser {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly role: UserRole;       // 'owner' | 'admin' | 'analyst' | 'viewer'
  readonly status: UserStatus;   // 'active' | 'invited' | 'suspended'
  readonly avatar: string;
  readonly lastLoginAt: string;
  readonly createdAt: string;
  readonly tags: readonly string[];
}
```

**篩選條件**：

```typescript
export interface UserFilters {
  readonly search: string;           // 模糊搜尋 (name, email, tags)
  readonly status: UserStatus | 'all';
  readonly role: UserRole | 'all';
}
```

#### 3.3.5 Teams (`/app/teams`)

- 顯示團隊清單，每個團隊含 name、description、memberCount、lead
- 成員 ID 與 `MockUsersApi.getById()` 關聯

#### 3.3.6 Notifications (`/app/notifications`)

**通知模型**：

```typescript
export interface MockNotification {
  readonly id: string;
  readonly type: NotificationType;       // 'system' | 'billing' | 'invite'
  readonly severity: NotificationSeverity; // 'info' | 'success' | 'warning' | 'error'
  readonly title: string;
  readonly message: string;
  readonly read: boolean;
  readonly timestamp: string;
  readonly href: string;
}
```

**功能**：

- 篩選器：all / unread / system / billing
- 已讀計數 badge
- markAsRead / markAllAsRead

#### 3.3.7 Billing (`/app/billing/**`)

Billing 使用 `BillingShell` 作為 sub-layout，包含四個子頁：

| 路由 | 元件 | 功能 |
|---|---|---|
| `/app/billing/overview` | `BillingOverview` | 當前方案、下次帳單、付款方式 |
| `/app/billing/invoices` | `BillingInvoices` | 歷史帳單清單 |
| `/app/billing/usage` | `BillingUsage` | 用量指標圖表 |
| `/app/billing/plans` | `BillingPlans` | 方案比較與升級 |

**方案模型**：

```typescript
export interface Plan {
  readonly id: string;
  readonly name: string;
  readonly priceMonthly: number;
  readonly priceYearly: number;
  readonly currency: string;
  readonly features: readonly string[];
  readonly seatLimit: number;
  readonly recommended?: boolean;
}
```

#### 3.3.8 Reports (`/app/reports`)

- KPI 指標列
- 時間序列折線圖（多維度）
- 排行榜 (Top Items)

#### 3.3.9 Settings (`/app/settings/**`)

Settings 使用 `SettingsShell` 作為 sub-layout，包含五個子頁：

| 路由 | 元件 | 功能 |
|---|---|---|
| `/app/settings/profile` | `SettingsProfile` | 編輯個人檔案 (displayName, locale, timezone) |
| `/app/settings/security` | `SettingsSecurity` | 變更密碼、2FA 啟用/停用 |
| `/app/settings/api-keys` | `SettingsApiKeys` | API 金鑰管理 (CRUD) |
| `/app/settings/integrations` | `SettingsIntegrations` | 第三方整合開關 (messaging/observability/storage/auth) |
| `/app/settings/preferences` | `SettingsPreferences` | 通知偏好、隱私設定、外觀設定 |

### 3.4 Auth 認證流程 (`/auth/**`)

| 路由 | 元件 | 標題 | 功能 |
|---|---|---|---|
| `/auth/sign-in` | `SignIn` | 登入 | Email + Password 登入表單 |
| `/auth/sign-up` | `SignUp` | 註冊 | Email + Password + DisplayName 註冊表單 |
| `/auth/forgot-password` | `ForgotPassword` | 忘記密碼 | 發送重設密碼郵件 |
| `/auth/reset-password` | `ResetPassword` | 重設密碼 | Token + 新密碼 |
| `/auth/two-factor` | `TwoFactor` | 雙因子驗證 | 6 位數驗證碼輸入 |
| `/auth/check-email` | `CheckEmail` | 請檢查信箱 | 提示使用者查看 email |

**AuthStore Session 管理**：

- 登入成功後產生 mock JWT (`mock.{base64-payload}.signature`)
- Session 有效期：8 小時
- 持久化至 `localStorage('auth')`
- 啟動時透過 `restore()` 還原（含過期檢查）
- `signOut()` 清除 signal state + localStorage

### 3.5 Showcase Switcher

**位置**：固定於所有頁面右下角 (`position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 1000`)

**行為**：

1. 預設顯示一個 FAB 按鈕 (Material primary color)
2. 點擊展開 panel，顯示三個快速切換連結
3. 動畫：`slideUp 200ms ease`
4. 再次點擊 FAB 或選擇連結後自動關閉
5. Mobile 端微調位置與尺寸

### 3.6 Angular 深度教學指南 (`/guide/**`)

**v1.3.0 新增**。完整的 Angular 核心概念教學模組，從入門到進階共 8 章。

#### 3.6.1 GuideLayout

- 側邊欄章節導覽（依 基礎/進階/高階 三層分類）
- 響應式行為同 CatalogLayout（`< 960px` 自動收合為 overlay）
- 頂部工具列含品牌標誌 "Angular 深度教學指南" + 主題控制元件

#### 3.6.2 教學章節

| 章 | 路由 | 標題 | 分類 | 預估時間 |
|---|---|---|---|---|
| 1 | `/guide/components` | 元件宣告與生命週期 | 基礎 | 45m |
| 2 | `/guide/dependency-injection` | 服務與依賴注入 | 基礎 | 40m |
| 3 | `/guide/routing` | 路由與導覽 | 基礎 | 40m |
| 4 | `/guide/state-management` | 狀態管理 | 進階 | 50m |
| 5 | `/guide/http-client` | HTTP 與 API 整合 | 進階 | 35m |
| 6 | `/guide/forms` | 表單與驗證 | 進階 | 45m |
| 7 | `/guide/testing` | 測試策略 | 高階 | 50m |
| 8 | `/guide/performance` | 效能最佳化 | 高階 | 45m |

#### 3.6.3 每章內容結構

- **章節目錄** — 可點擊錨點的 Table of Contents
- **多段式教學內容** — 詳細概念解說 + HTML 格式化
- **程式碼範例** — 帶檔名、語言標籤、行內註解的完整可編譯程式碼
- **提示方塊** — 四種類型：💡 提示、⚠️ 注意、✅ 最佳實踐、🔄 .NET 對照
- **前後頁導覽** — 連結上下章節

#### 3.6.4 共用元件

| 元件 | 用途 |
|---|---|
| `GuidePage` | 章節頁面外殼（目錄、內容、程式碼、提示、導覽） |
| `GuideNav` | 側邊欄章節導覽（依分類分組） |
| `GuideIndex` | 首頁章節卡片列表 |

#### 3.6.5 資料架構

- `GuideRegistryEntry` — 章節註冊資訊（id, title, category, icon）
- `GuideChapter` — 完整章節資料（sections, codeExamples, tips）
- `GUIDE_REGISTRY` — 8 筆註冊資料，驅動導覽和路由

### 3.7 共用對話框

**ConfirmDestructiveDialog** — 全域可注入的確認對話框服務：

```typescript
const confirmed = await this.confirmDialog.confirm({
  title: '刪除使用者',
  message: '此操作無法復原，確定要繼續嗎？',
  destructive: true,
  icon: 'warning',
});
```

- 使用 `MatDialog` 包裝
- 支援 destructive (紅色) / normal (primary) 兩種模式
- 回傳 `Promise<boolean>`
- 自動 focus 管理與 Escape 關閉

---

## 4. 響應式設計規格

### 4.1 斷點系統

| Token | 寬度 | 用途 |
|---|---|---|
| `--bp-sm` | 640px | 小螢幕手機 (≤ 375px 特別處理) |
| `--bp-md` | 960px | 平板 / 小筆電 |
| `--bp-lg` | 1280px | 標準桌面 |
| `--bp-xl` | 1440px | 大螢幕 |

### 4.2 各 Layout 響應式行為

#### Landing Layout

| Viewport | 行為 |
|---|---|
| ≤ 639px | 單欄堆疊、縮小 padding、Hero 文字置中 |
| 640–959px | 兩欄 Grid 開始生效 |
| ≥ 960px | 完整多欄佈局 |

#### Catalog Layout

| Viewport | CatalogNav | 主內容區 |
|---|---|---|
| ≤ 959px | 隱藏 (可透過 hamburger 開啟) | 全寬 |
| ≥ 960px | 固定顯示 (左側面板) | 扣除 nav 寬度 |

- 路由切換時自動關閉 mobile nav
- `BreakpointObserver('(max-width: 959.98px)')` 驅動

#### Admin Layout (MatSidenav)

| Viewport | Sidenav Mode | Sidenav State | 行為 |
|---|---|---|---|
| ≤ 768px | `over` (overlay) | 預設關閉 | Hamburger 開啟、路由切換自動關閉 |
| > 768px | `side` (push) | 預設開啟 | 常駐側邊欄 |

#### Auth Layout

| Viewport | 行為 |
|---|---|
| ≤ 639px | 全寬卡片、減少 padding |
| ≥ 640px | 置中卡片、固定最大寬度 |

### 4.3 全域響應式安全措施

定義在 `styles.css` 中，適用於所有 Layout：

```css
/* 防止水平溢出 */
html, body { overflow-x: hidden; }
img, video, svg, canvas { max-width: 100%; height: auto; }
table { max-width: 100%; }
pre, code { overflow-x: auto; max-width: 100%; }
p, li, td, th, span, a, label { overflow-wrap: break-word; word-break: break-word; }

/* Mobile dialog 限制 */
@media (max-width: 639.98px) {
  .cdk-overlay-pane { max-width: 95vw !important; }
  .mat-mdc-dialog-surface { max-height: 90vh; overflow-y: auto; }
}

/* Mobile 表格卡片水平捲動 */
@media (max-width: 768px) {
  .mat-mdc-card:has(.mat-mdc-table) { overflow-x: auto; -webkit-overflow-scrolling: touch; }
}
```

---

## 5. 字體與視覺設計

### 5.1 字體堆疊

```css
body {
  font-family:
    'Nunito',           /* 英文主字體 */
    'Noto Sans TC',     /* 繁體中文 */
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
}
```

| 字體 | 載入權重 | 用途 |
|---|---|---|
| Nunito | 400, 500, 600, 700 | 英文文字、UI 標籤 |
| Noto Sans TC | 400, 500, 700 | 繁體中文內容 |
| JetBrains Mono | 400 | CodeViewer 程式碼區塊 |
| Material Symbols Outlined | variable | Material 圖示 (ligature) |

### 5.2 字體載入方式

使用 `@fontsource/*` 套件進行 **本地 vendor** 載入（非 Google Fonts CDN），確保：

- 無外部 DNS 查詢延遲
- GDPR 合規（不向 Google 發送使用者資訊）
- 離線可用

### 5.3 圖示系統

**Material Symbols Outlined** — 透過 font ligature 方式使用：

```html
<mat-icon>dashboard</mat-icon>
```

配置方式：

1. `MatIconRegistry.setDefaultFontSetClass('material-symbols-outlined')` — 在 app init 時設定
2. `styles.css` 中定義 `.material-symbols-outlined` 與 `.material-icons` 的 font-family mapping

### 5.4 色彩 Token 系統

所有色彩使用 Material 3 **Design Tokens** (CSS custom properties)：

| Token | 用途 |
|---|---|
| `--mat-sys-primary` | 主色調 |
| `--mat-sys-secondary` | 次要色調 |
| `--mat-sys-tertiary` | 第三色調 |
| `--mat-sys-error` | 錯誤色 |
| `--mat-sys-surface` | 表面背景色 |
| `--mat-sys-on-surface` | 表面文字色 |
| `--mat-sys-on-surface-variant` | 次要表面文字色 |
| `--mat-sys-surface-container` | 容器背景色 |
| `--mat-sys-surface-container-low` | 低層容器背景色 |
| `--mat-sys-outline-variant` | 邊框色 |
| `--mat-sys-primary-container` | 主色容器 |
| `--mat-sys-on-primary-container` | 主色容器文字 |
| `--mat-sys-error-container` | 錯誤容器 |
| `--mat-sys-on-error-container` | 錯誤容器文字 |

### 5.5 Chart.js 全域預設

```typescript
// chart-defaults.ts
Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.font.weight = 500;
Chart.defaults.color = 'rgba(68, 71, 78, 0.92)';
Chart.defaults.borderColor = 'rgba(196, 198, 208, 0.4)';
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(26, 27, 31, 0.92)';
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.padding = 12;
```

---

## 6. 無障礙規格

### 6.1 WCAG AA 目標

本專案以 **WCAG 2.1 AA** 為最低標準，涵蓋以下面向：

#### 色彩對比

- 所有文字對比比例 ≥ 4.5:1 (normal text) 或 ≥ 3:1 (large text)
- Dark mode 下同等要求
- Material 3 theme 內建合規色彩對比

#### Focus Management

- 所有互動元素可透過 Tab 聚焦
- `focus-visible` 樣式明確（使用 `outline: 2px solid primary` + offset）
- Dialog 開啟時自動 focus 到 `first-tabbable`
- Dialog 關閉時 restore focus 至觸發元素
- 路由切換不破壞 focus 流

#### ARIA 模式

| UI 元素 | ARIA Pattern |
|---|---|
| ThemeToggle | `role="radiogroup"` + `role="radio"` + `aria-checked` |
| ThemePaletteSelector | `aria-expanded` + `aria-haspopup="dialog"` + `role="dialog"` |
| ShowcaseSwitcher FAB | `aria-label` 動態切換 (開啟/關閉) |
| ConfirmDestructiveDialog | `role="alertdialog"` + `aria-labelledby` |
| CatalogNav | 語義 `<nav>` + expandable groups |
| Sidebar NavList | `mat-nav-list` (內建 ARIA) |

### 6.2 鍵盤操作

| 操作 | 鍵盤 |
|---|---|
| 導覽切換 | Tab / Shift+Tab |
| 按鈕觸發 | Enter / Space |
| Dialog 關閉 | Escape |
| Overlay 關閉 | Escape / 點擊背景 |
| Radio group | Arrow keys |

### 6.3 DevDependencies

- `@axe-core/playwright` — 自動化 AXE 無障礙檢測（E2E 層級）

---

## 7. 部署架構

### 7.1 Docker Multi-Stage Build

#### Stage 1: Builder

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx ng build --configuration production || npx ng build --configuration development
```

- 使用 `node:22-alpine` 最小化 image size
- `--legacy-peer-deps` 處理 vendor block peer dependency 衝突
- Production build 失敗時 fallback 至 development build

#### Stage 2: Runtime

```dockerfile
FROM nginx:alpine
COPY --from=builder /app/dist/angular-material-block-showcase/browser /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 7.2 Nginx 設定

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip 壓縮
    gzip on;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1000;

    # 靜態資源快取 (1 year, immutable)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # SPA Fallback — 所有路由導向 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 7.3 Docker Compose + ngrok

```yaml
services:
  app:
    build:
      context: ..
      dockerfile: deploy/Dockerfile
    ports:
      - "8080:80"
    restart: unless-stopped

  ngrok:
    image: ngrok/ngrok:latest
    restart: unless-stopped
    environment:
      - NGROK_AUTHTOKEN=${NGROK_AUTHTOKEN:-}
    command: http app:80 --log stdout
    ports:
      - "4040:4040"   # ngrok Web Inspector
    depends_on:
      - app
```

**存取方式**：

| 端點 | URL | 用途 |
|---|---|---|
| 本機 | `http://localhost:8080` | Docker 直連 |
| ngrok Tunnel | 動態產生的 `*.ngrok.io` | 對外分享 |
| ngrok Inspector | `http://localhost:4040` | 流量監控 |

### 7.4 Build Budgets

```json
{
  "budgets": [
    { "type": "initial", "maximumWarning": "1.5MB", "maximumError": "3MB" },
    { "type": "anyComponentStyle", "maximumWarning": "8kB", "maximumError": "16kB" }
  ]
}
```

---

## 8. 測試策略

### 8.1 單元測試

**框架**：Karma + Jasmine

**測試檔案命名**：`{name}.spec.ts` 與被測檔案同目錄

**已覆蓋範圍**：

| 模組 | 測試檔案 | 測試重點 |
|---|---|---|
| AuthStore | `auth-store.spec.ts` | signIn/signOut/restore、Session 過期、狀態 signal |
| MockAuthApi | `mock-auth-api.spec.ts` | 錯誤觸發路徑、Result pattern |
| ThemeStore | `theme-store.spec.ts` | mode/palette 切換、localStorage 持久化 |
| ThemeToggle | `theme-toggle.spec.ts` | UI 狀態與 ThemeStore 同步 |
| OnboardingStore | `onboarding-store.spec.ts` | dismiss/reset/toggleStep |
| ChartPalette | `chart-palette.spec.ts` | withAlpha、parseHex |
| CatalogRegistry | `catalog-registry.spec.ts` | findEntry、getNext/getPrevious |
| Layout Models | `models.spec.ts` | NavItem/Breadcrumb/ShellLink 型別 |
| MockDashboardApi | `mock-dashboard.spec.ts` | load()、revenue series 產生 |
| MockUsersApi | `mock-users.spec.ts` | CRUD、filter、bulkRemove |
| MockBillingApi | `mock-billing.spec.ts` | load()、upgradePlan |
| MockNotificationsApi | `mock-notifications.spec.ts` | filter、markAsRead |
| MockReportsApi | `mock-reports.spec.ts` | load()、signal state |
| MockSettingsApi | `mock-settings.spec.ts` | updateProfile、API Key CRUD、integration toggle |
| CatalogBlockMeta | `models.spec.ts` | 型別驗證 |
| App Routes | `app.routes.spec.ts` | 路由設定完整性 |
| Layout Specs | `*-layout.spec.ts` | 各 Layout 渲染測試 |
| Catalog Shared | `*.spec.ts` (各 shared) | 元件渲染與 input/output |

### 8.2 E2E 測試

**框架**：Playwright

**腳本位置**：`scripts/e2e-baseline.ts`

**測試項目**：

- 基本路由載入
- 響應式斷點截圖
- AXE 無障礙掃描

### 8.3 Visual Regression

**腳本位置**：

- `scripts/visual-check.mjs` — 基礎視覺檢查
- `scripts/responsive-test.ts` — 響應式截圖比對
- `scripts/responsive-visual-test.ts` — 進階視覺回歸
- `scripts/m4-bulk-variant-screenshots.mjs` — M4 批量截圖

**驗證報告**：`docs/verification/` 目錄

### 8.4 Bake 原始碼測試

```bash
npm run bake:test  # tsx --test scripts/bake-block-sources.spec.ts
```

驗證 `bake-block-sources.ts` 正確讀取 `src/app/blocks/` 下的所有 Vendor Block 原始碼並輸出 JSON 到 `src/assets/block-sources/`。

### 8.5 測試執行指令

| 指令 | 說明 |
|---|---|
| `npm test` | 執行 Karma 單元測試 |
| `npm run bake:test` | 測試 bake 腳本 |
| `npm run lint` | ESLint + angular-eslint 檢查 |
| `npm run format:check` | Prettier 格式檢查 |

---

## 附錄 A：資料型別索引

### BlockVariant

```typescript
export interface BlockVariant {
  readonly id: string;
  readonly label: string;
  readonly registryCategory: string;
  readonly component: Type<unknown>;
  readonly isFree: boolean;
  readonly demoInputs?: Readonly<Record<string, unknown>>;
}
```

### CatalogBlockMeta

```typescript
export interface CatalogBlockMeta {
  readonly id: string;
  readonly title: string;
  readonly category: BlockDisplayCategory;
  readonly subcategory: string;
  readonly summary: string;
  readonly tags: readonly string[];
  readonly status: CatalogStatus;
  readonly variants: readonly BlockVariant[];
  readonly api: ApiDocumentation;
  readonly bestPractices: BestPracticeNotes;
  readonly relatedBlockIds: readonly string[];
  readonly previewMinHeight?: number;
}
```

### AuthState

```typescript
export interface AuthState {
  readonly user: AuthUser | null;
  readonly token: string | null;
  readonly expiresAt: number | null;
}
```

### KpiCardData

```typescript
export interface KpiCardData {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly unit: string;
  readonly delta: number;
  readonly trend: 'up' | 'down' | 'flat';
  readonly sparkline: readonly number[];
}
```

### ChartPalette

```typescript
export interface ChartPalette {
  readonly primary: string;
  readonly secondary: string;
  readonly tertiary: string;
  readonly error: string;
  readonly success: string;
  readonly warning: string;
  readonly surface: string;
  readonly onSurface: string;
  readonly onSurfaceVariant: string;
  readonly outlineVariant: string;
  readonly categorical: readonly string[];
}
```

## 附錄 B：路由完整表

### 頂層路由

| Path | Layout | Guard |
|---|---|---|
| `/` | LandingLayout | - |
| `/catalog` | CatalogLayout | - |
| `/app` | AdminLayout | `authMatchGuard` |
| `/auth` | AuthLayout | - |
| `**` | redirect → `/` | - |

### Catalog 路由 (45 entries)

見 [3.2.1 節分類清單](#321-概覽)

### App Shell 路由

| Path | Component | Lazy |
|---|---|---|
| `/app/dashboard` | `Dashboard` | eager (route) |
| `/app/users` | `Users` | lazy |
| `/app/users/new` | `UserNew` | lazy |
| `/app/users/:id` | `UserDetail` | lazy |
| `/app/teams` | `Teams` | lazy |
| `/app/notifications` | `Notifications` | lazy |
| `/app/billing/overview` | `BillingOverview` | lazy |
| `/app/billing/invoices` | `BillingInvoices` | lazy |
| `/app/billing/usage` | `BillingUsage` | lazy |
| `/app/billing/plans` | `BillingPlans` | lazy |
| `/app/reports` | `Reports` | lazy |
| `/app/settings/profile` | `SettingsProfile` | lazy |
| `/app/settings/security` | `SettingsSecurity` | lazy |
| `/app/settings/api-keys` | `SettingsApiKeys` | lazy |
| `/app/settings/integrations` | `SettingsIntegrations` | lazy |
| `/app/settings/preferences` | `SettingsPreferences` | lazy |

### Auth 路由

| Path | Component | Lazy |
|---|---|---|
| `/auth/sign-in` | `SignIn` | lazy |
| `/auth/sign-up` | `SignUp` | lazy |
| `/auth/forgot-password` | `ForgotPassword` | lazy |
| `/auth/reset-password` | `ResetPassword` | lazy |
| `/auth/two-factor` | `TwoFactor` | lazy |
| `/auth/check-email` | `CheckEmail` | lazy |

---

*本文件由開發團隊維護，內容以原始碼為準。如有差異，以原始碼為權威來源。*
