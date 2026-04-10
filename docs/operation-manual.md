# Angular Material Block Showcase — 系統維運手冊

> **文件版本**：1.4.0  
> **最後更新**：2026-04-11  
> **適用版本**：Angular 21.2.8 / Angular Material 21.2.6 / Tailwind CSS v4.1.12

---

## 目錄

1. [快速開始](#1-快速開始)
2. [專案目錄結構](#2-專案目錄結構)
3. [開發指南](#3-開發指南)
4. [建置與部署](#4-建置與部署)
5. [組態說明](#5-組態說明)
6. [維護作業](#6-維護作業)
7. [疑難排解](#7-疑難排解)
8. [API 參考](#8-api-參考)

---

## 1. 快速開始

### 1.1 系統需求

| 項目 | 最低版本 | 建議版本 |
|---|---|---|
| Node.js | 20.x | 22.x (LTS) |
| npm | 9.x | 10.x+ |
| Angular CLI | 21.2.x | 21.2.7 |
| Docker (選配) | 20.10+ | 27.x |
| Docker Compose (選配) | 2.x | 2.30+ |
| 作業系統 | Windows 10 / macOS 12 / Ubuntu 22.04 | Windows 11 (WSL2) / macOS 14 |

### 1.2 環境準備

#### 安裝 Node.js

```bash
# 使用 nvm 安裝 (建議)
nvm install 22
nvm use 22
node -v  # v22.x.x
npm -v   # 10.x.x
```

#### 安裝 Angular CLI (全域)

```bash
npm install -g @angular/cli@21
ng version
```

### 1.3 專案初始化

```bash
# 1. Clone 專案
git clone <repository-url>
cd angular-material-block

# 2. 安裝依賴
npm install

# 如遇 peer dependency 衝突，使用：
npm install --legacy-peer-deps

# 3. Bake 原始碼 (產生 CodeViewer 所需的 JSON)
npm run bake

# 4. 啟動開發伺服器
npm start
# 或等效指令
ng serve
```

### 1.4 驗證安裝

開發伺服器啟動後（預設 `http://localhost:4200`），逐一確認：

| 路由 | 預期結果 |
|---|---|
| `http://localhost:4200/` | Landing Page（13 個 Vendor Block 正確渲染） |
| `http://localhost:4200/catalog` | Catalog Index（45 個分類卡片） |
| `http://localhost:4200/catalog/hero-sections` | Hero Sections 頁面（9 個 Variant） |
| `http://localhost:4200/auth/sign-in` | 登入頁面 |
| 登入後 `http://localhost:4200/app/dashboard` | Dashboard（KPI + 圖表） |

#### 快速登入測試帳號

在登入頁面輸入任意格式正確的 email 與長度 >= 6 的密碼即可登入：

```
Email:    test@example.com
Password: password
```

### 1.5 常用 npm 指令

| 指令 | 說明 |
|---|---|
| `npm start` | 啟動開發伺服器 (`ng serve`) |
| `npm run build` | Production build (`ng build`) |
| `npm test` | 執行單元測試 (Karma + Jasmine) |
| `npm run lint` | ESLint 檢查 |
| `npm run format` | Prettier 格式化 |
| `npm run format:check` | Prettier 格式檢查 (CI 用) |
| `npm run bake` | Bake Vendor Block 原始碼為 JSON |
| `npm run bake:test` | 測試 Bake 腳本 |

---

## 2. 專案目錄結構

### 2.1 頂層目錄

```
angular-material-block/
├── .claude/                     # Claude Code 規則文件
│   └── rules/
│       ├── angular-framework.md
│       ├── components.md
│       ├── forms.md
│       ├── project-structure.md
│       ├── routing.md
│       ├── signals-reactivity.md
│       ├── testing.md
│       └── ui-blocks-workflow.md
├── deploy/                      # Docker 部署設定
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
├── docs/                        # 文件
│   ├── plans/                   # 里程碑計畫
│   ├── verification/            # 驗證報告
│   └── CHANGELOG.md
├── public/                      # 靜態公開資源
│   └── favicon.ico
├── scripts/                     # 建置與測試腳本
│   ├── bake-block-sources.ts    # Bake 原始碼主腳本
│   ├── bake-block-sources.spec.ts
│   ├── e2e-baseline.ts          # E2E 基線測試
│   ├── responsive-test.ts       # 響應式測試
│   ├── responsive-visual-test.ts
│   ├── visual-check.mjs         # 視覺檢查
│   └── m4-bulk-variant-screenshots.mjs
├── src/                         # 應用程式原始碼
├── angular.json                 # Angular CLI 工作區設定
├── CLAUDE.md                    # Claude Code 專案指引
├── eslint.config.js             # ESLint 設定
├── ngm-dev-cli.json             # ngm-dev-blocks MCP CLI 設定
├── package.json
├── package-lock.json
├── tsconfig.json                # TypeScript 基礎設定
├── tsconfig.app.json            # Application TypeScript 設定
└── tsconfig.spec.json           # Test TypeScript 設定
```

### 2.2 src/ 目錄

```
src/
├── app/
│   ├── app.ts                   # 根元件
│   ├── app.html                 # 根模板 (router-outlet + showcase-switcher)
│   ├── app.css                  # 根樣式
│   ├── app.config.ts            # 應用設定 (providers)
│   ├── app.routes.ts            # 頂層路由
│   ├── app.spec.ts              # 根元件測試
│   ├── app.routes.spec.ts       # 路由測試
│   │
│   ├── core/                    # 核心共用服務
│   │   ├── auth/
│   │   │   ├── auth-store.ts            # 認證狀態管理
│   │   │   ├── auth-store.spec.ts
│   │   │   ├── auth-match.guard.ts      # CanMatch guard
│   │   │   └── auth-match.guard.spec.ts
│   │   ├── charts/
│   │   │   ├── chart-defaults.ts        # Chart.js 全域預設
│   │   │   ├── chart-palette.ts         # Material 3 ↔ Chart.js 色彩同步
│   │   │   └── chart-palette.spec.ts
│   │   ├── dialogs/
│   │   │   └── confirm-destructive-dialog.ts  # 全域確認對話框
│   │   ├── i18n/
│   │   │   ├── i18n-store.ts            # 國際化 store
│   │   │   └── i18n-store.spec.ts
│   │   ├── layout/
│   │   │   ├── models.ts               # NavItem, Breadcrumb, ShellLink 型別
│   │   │   └── models.spec.ts
│   │   ├── mock-api/                    # Mock API 層 (7 services)
│   │   │   ├── mock-auth-api.ts
│   │   │   ├── mock-dashboard.ts
│   │   │   ├── mock-users.ts
│   │   │   ├── mock-teams.ts
│   │   │   ├── mock-notifications.ts
│   │   │   ├── mock-billing.ts
│   │   │   ├── mock-reports.ts
│   │   │   ├── mock-settings.ts
│   │   │   └── *.spec.ts               # 對應測試
│   │   ├── showcase-switcher/
│   │   │   └── showcase-switcher.ts     # FAB 展示切換器
│   │   └── theme/
│   │       ├── theme-store.ts           # 主題模式 + 色板管理
│   │       ├── theme-store.spec.ts
│   │       ├── theme-toggle.ts          # Light/Dark/System 切換 UI
│   │       ├── theme-toggle.spec.ts
│   │       └── theme-palette-selector.ts # 12 色板選擇 UI
│   │
│   ├── guide/                   # Angular 深度教學指南 (v1.3.0)
│   │   ├── guide.routes.ts      # 教學路由定義
│   │   ├── guide-index.ts       # 首頁章節卡片列表
│   │   ├── models/
│   │   │   └── guide-chapter.ts # 章節資料模型
│   │   ├── shared/
│   │   │   ├── guide-registry.ts # 8 章註冊資料 + 導覽輔助函式
│   │   │   ├── guide-nav.ts      # 側邊欄章節導覽元件
│   │   │   ├── guide-page.ts     # 章節頁面外殼元件
│   │   │   ├── guide-page.html
│   │   │   └── guide-page.css
│   │   └── chapters/            # 12 章教學內容
│   │       ├── ch01-components.ts
│   │       ├── ch02-dependency-injection.ts
│   │       ├── ch03-routing.ts
│   │       ├── ch04-state-management.ts
│   │       ├── ch05-http-client.ts
│   │       ├── ch06-forms.ts
│   │       ├── ch07-testing.ts
│   │       ├── ch08-performance.ts
│   │       ├── ch09-rendering-engine.ts   # v1.4.0 框架核心
│   │       ├── ch10-ivy-compiler.ts
│   │       ├── ch11-view-hierarchy.ts
│   │       └── ch12-signal-internals.ts
│   │
│   ├── layouts/                 # 五大 Layout
│   │   ├── landing-layout/
│   │   │   ├── landing-layout.ts
│   │   │   ├── landing-layout.html
│   │   │   ├── landing-layout.css
│   │   │   └── landing-layout.spec.ts
│   │   ├── catalog-layout/
│   │   │   ├── catalog-layout.ts
│   │   │   ├── catalog-layout.html
│   │   │   ├── catalog-layout.css
│   │   │   └── catalog-layout.spec.ts
│   │   ├── admin-layout/
│   │   │   ├── admin-layout.ts
│   │   │   ├── admin-layout.html
│   │   │   ├── admin-layout.css
│   │   │   └── admin-layout.spec.ts
│   │   ├── guide-layout/        # v1.3.0 新增
│   │   │   ├── guide-layout.ts
│   │   │   ├── guide-layout.html
│   │   │   └── guide-layout.css
│   │   └── auth-layout/
│   │       ├── auth-layout.ts
│   │       ├── auth-layout.html
│   │       ├── auth-layout.css
│   │       └── auth-layout.spec.ts
│   │
│   ├── landing/                 # Landing Page 功能區
│   │   ├── landing-page.ts
│   │   └── landing.routes.ts
│   │
│   ├── catalog/                 # Catalog 系統
│   │   ├── catalog-index.ts            # 目錄首頁
│   │   ├── catalog.routes.ts           # 45 條分類路由
│   │   ├── coming-soon.ts              # 即將推出占位元件
│   │   ├── models/                     # Catalog 資料模型
│   │   │   ├── api-documentation.ts
│   │   │   ├── best-practice-notes.ts
│   │   │   ├── block-variant.ts
│   │   │   ├── catalog-block-meta.ts
│   │   │   └── models.spec.ts
│   │   ├── shared/                     # Catalog 共用元件
│   │   │   ├── catalog-registry.ts         # 單一事實來源 (45 entries)
│   │   │   ├── catalog-registry.spec.ts
│   │   │   ├── api-table/
│   │   │   ├── best-practices-panel/
│   │   │   ├── block-preview/
│   │   │   ├── catalog-nav/
│   │   │   ├── catalog-page/
│   │   │   ├── code-viewer/
│   │   │   ├── live-style-editor/
│   │   │   └── variant-selector/
│   │   └── blocks/                     # 45 個 .page.ts 分類頁面
│   │       ├── hero-sections.page.ts
│   │       ├── feature-sections.page.ts
│   │       ├── ... (45 files)
│   │       └── sidebars.page.ts
│   │
│   ├── app-shell/               # SaaS 管理後台
│   │   ├── app-shell.routes.ts
│   │   ├── dashboard/
│   │   │   ├── dashboard.ts
│   │   │   ├── dashboard.html
│   │   │   ├── dashboard.css
│   │   │   ├── onboarding-store.ts
│   │   │   └── onboarding-store.spec.ts
│   │   ├── users/
│   │   │   ├── users.ts
│   │   │   ├── user-detail.ts
│   │   │   └── user-new.ts
│   │   ├── teams/
│   │   │   └── teams.ts
│   │   ├── notifications/
│   │   │   └── notifications.ts
│   │   ├── billing/
│   │   │   ├── billing.routes.ts
│   │   │   ├── billing-shell.ts
│   │   │   ├── billing-overview.ts
│   │   │   ├── billing-invoices.ts
│   │   │   ├── billing-usage.ts
│   │   │   └── billing-plans.ts
│   │   ├── reports/
│   │   │   └── reports.ts
│   │   └── settings/
│   │       ├── settings.routes.ts
│   │       ├── settings-shell.ts
│   │       ├── settings-profile.ts
│   │       ├── settings-security.ts
│   │       ├── settings-api-keys.ts
│   │       ├── settings-integrations.ts
│   │       └── settings-preferences.ts
│   │
│   ├── auth/                    # 認證流程
│   │   ├── auth.routes.ts
│   │   ├── sign-in/sign-in.ts
│   │   ├── sign-up/sign-up.ts
│   │   ├── forgot-password/forgot-password.ts
│   │   ├── reset-password/reset-password.ts
│   │   ├── two-factor/two-factor.ts
│   │   ├── check-email/check-email.ts
│   │   └── shared/
│   │       └── auth-error-messages.ts
│   │
│   └── blocks/                  # Vendor Block 原始碼 (68 categories)
│       ├── hero-sections/
│       │   ├── hero-section-1/
│       │   │   └── hero-section-1.component.ts
│       │   ├── hero-section-2/
│       │   └── ...
│       ├── feature-sections/
│       ├── custom-steppers/     # Custom Block (非 Vendor)
│       ├── custom-sidebars/     # Custom Block (非 Vendor)
│       ├── wrappers/            # Demo wrapper 元件
│       ├── device-mocks/        # 裝置外框模擬
│       ├── utils/               # Block 共用工具
│       └── free-*/              # 免費版 Vendor Block
│
├── assets/
│   ├── block-sources/           # Bake 產生的 JSON (CodeViewer 用)
│   ├── i18n/                    # 國際化翻譯檔
│   │   └── zh-TW.json
│   └── mock-data/               # Mock API JSON fixtures (14 files)
│       ├── dashboard-kpis.json
│       ├── dashboard-plans.json
│       ├── dashboard-top-pages.json
│       ├── dashboard-feeds.json
│       ├── users.json
│       ├── teams.json
│       ├── notifications.json
│       ├── plans.json
│       ├── invoices.json
│       ├── payment-methods.json
│       ├── usage-metrics.json
│       ├── reports-metrics.json
│       ├── api-keys.json
│       └── integrations.json
│
├── styles/
│   └── themes.scss              # Material 3 palette 主題產生器
│
├── styles.css                   # 全域樣式 (fonts, resets, vendor fixes)
├── main.ts                      # Bootstrap 進入點
└── index.html
```

### 2.3 Vendor Block 目錄結構

```
src/app/blocks/
├── {category}/                  # Premium 版 (如 hero-sections/)
│   ├── {variant}/               # 如 hero-section-1/
│   │   └── {variant}.component.ts
│   └── ...
├── free-{category}/             # Free 版 (如 free-hero-sections/)
│   └── ...
├── custom-{name}/               # 自建 Block (如 custom-steppers/)
│   └── ...
├── wrappers/                    # Demo wrapper (為 required input blocks)
├── device-mocks/                # 裝置外框模擬元件
└── utils/                       # Block 共用工具函式
```

---

## 3. 開發指南

### 3.1 新增 Catalog Block (Vendor Block)

以新增 **Tooltip** 分類為例，完整步驟如下：

#### Step 1: 使用 MCP 產生 Block

```bash
# 1. 先查詢可用的 Block 名稱
# (透過 ngm-dev-blocks MCP 的 get-all-block-names)

# 2. 產生 Block 原始碼
# (透過 ngm-dev-blocks MCP 的 generate-angular-material-block)
```

產生的檔案放置於 `src/app/blocks/tooltips/tooltip-{N}/tooltip-{N}.component.ts`

#### Step 2: 建立 Catalog Page

建立 `src/app/catalog/blocks/tooltips.page.ts`：

```typescript
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ApiTable } from '../shared/api-table/api-table';
import { BestPracticesPanel } from '../shared/best-practices-panel/best-practices-panel';
import { BlockPreview } from '../shared/block-preview/block-preview';
import { CatalogPage } from '../shared/catalog-page/catalog-page';
import { CodeViewer } from '../shared/code-viewer/code-viewer';
import { VariantSelector } from '../shared/variant-selector/variant-selector';
import { ApiDocumentation } from '../models/api-documentation';
import { BestPracticeNotes } from '../models/best-practice-notes';
import { BlockVariant } from '../models/block-variant';
import { CatalogBlockMeta } from '../models/catalog-block-meta';

// Import vendor components
import { Tooltip1Component } from '../../blocks/tooltips/tooltip-1/tooltip-1.component';
import { Tooltip2Component } from '../../blocks/tooltips/tooltip-2/tooltip-2.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'tooltip-1',
    label: 'Tooltip 1 — 基礎提示',
    registryCategory: 'tooltips',
    component: Tooltip1Component,
    isFree: false,
  },
  {
    id: 'tooltip-2',
    label: 'Tooltip 2 — 進階提示',
    registryCategory: 'tooltips',
    component: Tooltip2Component,
    isFree: false,
  },
];

const API: ApiDocumentation = {
  inputs: [],
  outputs: [],
  slots: [],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: ['滑鼠懸停時提供額外說明資訊'],
  whenNotToUse: ['不應用於行動裝置上的主要資訊呈現'],
  pitfalls: ['避免在 tooltip 中放置可互動元素'],
  accessibility: ['使用 aria-describedby 關聯 tooltip 與觸發元素'],
};

const META: CatalogBlockMeta = {
  id: 'tooltips',
  title: 'Tooltips',
  category: 'application',
  subcategory: 'Overlays',
  summary: '懸停提示元件',
  tags: ['tooltip', 'overlay', 'hint'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['flyout-menus', 'dialogs'],
};

@Component({
  selector: 'app-tooltips-catalog-page',
  imports: [CatalogPage, BlockPreview, VariantSelector, CodeViewer, ApiTable, BestPracticesPanel],
  template: `
    <app-catalog-page [meta]="meta">
      <div slot="preview">
        <app-variant-selector
          [variants]="meta.variants"
          [selectedId]="selectedId()"
          (selectionChange)="onVariantChange($event)"
        />
        <app-block-preview [variant]="currentVariant()" />
      </div>
      <app-code-viewer
        slot="code"
        [category]="currentVariant().registryCategory"
        [variant]="currentVariant().id"
      />
      <app-api-table slot="api" [api]="meta.api" />
      <app-best-practices-panel slot="best-practices" [notes]="meta.bestPractices" />
    </app-catalog-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
```

#### Step 3: 註冊到 CatalogRegistry

編輯 `src/app/catalog/shared/catalog-registry.ts`，在適當位置新增 entry：

```typescript
{
  id: 'tooltips',
  title: 'Tooltips',
  category: 'application',
  subcategory: 'Overlays',
  summary: '懸停提示元件',
  status: 'shipped',
},
```

#### Step 4: 新增路由

編輯 `src/app/catalog/catalog.routes.ts`：

```typescript
{
  path: 'tooltips',
  title: 'Tooltips · Catalog',
  loadComponent: () => import('./blocks/tooltips.page').then(m => m.TooltipsCatalogPage),
},
```

#### Step 5: Bake 原始碼

```bash
npm run bake
```

#### Step 6: 驗證

```bash
ng build
# 確認無編譯錯誤

npm start
# 瀏覽 http://localhost:4200/catalog/tooltips
```

### 3.2 新增 App Shell 功能頁面

以新增 **Audit Log** 頁面為例：

#### Step 1: 建立 Mock API (如需要)

建立 `src/app/core/mock-api/mock-audit-log.ts`：

```typescript
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface AuditLogEntry {
  readonly id: string;
  readonly action: string;
  readonly actor: string;
  readonly timestamp: string;
  readonly details: string;
}

@Injectable({ providedIn: 'root' })
export class MockAuditLogApi {
  private readonly http = inject(HttpClient);
  private readonly _entries = signal<readonly AuditLogEntry[]>([]);
  private readonly _loaded = signal<boolean>(false);

  readonly entries: Signal<readonly AuditLogEntry[]> = this._entries.asReadonly();
  readonly loaded: Signal<boolean> = this._loaded.asReadonly();

  async load(): Promise<void> {
    if (this._loaded()) return;
    const doc = await firstValueFrom(
      this.http.get<{ entries: readonly AuditLogEntry[] }>('assets/mock-data/audit-log.json'),
    );
    this._entries.set(doc.entries);
    this._loaded.set(true);
  }
}
```

#### Step 2: 建立 JSON Fixture

建立 `src/assets/mock-data/audit-log.json`：

```json
{
  "entries": [
    {
      "id": "al-001",
      "action": "user.created",
      "actor": "alice@glacier.io",
      "timestamp": "2026-04-09T10:30:00Z",
      "details": "Created user bob@glacier.io"
    }
  ]
}
```

#### Step 3: 建立頁面元件

建立 `src/app/app-shell/audit-log/audit-log.ts`

#### Step 4: 註冊路由

編輯 `src/app/app-shell/app-shell.routes.ts`：

```typescript
{
  path: 'audit-log',
  title: '稽核日誌',
  loadComponent: () => import('./audit-log/audit-log').then(m => m.AuditLog),
},
```

#### Step 5: 新增導覽項目

編輯 `src/app/layouts/admin-layout/admin-layout.ts` 的 `NAV_ITEMS`：

```typescript
{ id: 'audit-log', label: '稽核日誌', icon: 'history', path: '/app/audit-log' },
```

### 3.3 建立 Custom Block (Stepper / Sidebar 模式)

自建 Block 與 Vendor Block 的差異：

| 項目 | Vendor Block | Custom Block |
|---|---|---|
| 來源 | ngm-dev-blocks MCP | 團隊自行開發 |
| 目錄 | `src/app/blocks/{category}/` | `src/app/blocks/custom-{name}/` |
| ESLint | 排除 (`ignores: ["src/app/blocks/**"]`) | 排除 (同上) |
| Catalog Registry | category + subcategory | 同上，status: `'shipped'` |
| 命名 | `{name}-{N}.component.ts` | 自由命名 |

#### 開發步驟

1. 在 `src/app/blocks/custom-{name}/` 下建立 variant 子目錄
2. 每個 variant 建立 standalone component (OnPush + inline template or separate files)
3. 在 `src/app/catalog/blocks/{name}.page.ts` 建立 catalog page
4. 在 `catalog-registry.ts` 新增 entry
5. 在 `catalog.routes.ts` 新增 route
6. 執行 `npm run bake` 產生 CodeViewer JSON
7. 執行 `ng build` 驗證

### 3.4 修改主題

#### 新增色板

1. 編輯 `src/styles/themes.scss`，在 `$palettes` map 新增 entry：

```scss
$palettes: (
  // ... existing palettes
  'teal': mat.$teal-palette,
);
```

2. 編輯 `src/app/core/theme/theme-store.ts`：

```typescript
// 在 ThemePalette union type 新增
export type ThemePalette = /* existing */ | 'teal';

// 在 THEME_PALETTES array 新增
{ id: 'teal', label: '藍綠', swatch: '#008080' },
```

3. Rebuild：

```bash
ng build
```

#### 自訂密度 (Density)

在 `themes.scss` 中，`density` 參數可設定 `-1` (compact)、`0` (normal)、`1` (comfortable)：

```scss
@include mat.theme((
  color: (theme-type: light, primary: $palette),
  typography: Nunito,
  density: -1,    // Compact mode
));
```

#### 自訂 Typography

將 `typography` 參數從 `Nunito` 改為其他字體：

```scss
@include mat.theme((
  color: (theme-type: light, primary: $palette),
  typography: 'Inter',
  density: 0,
));
```

同時需在 `styles.css` 中 import 對應的 `@fontsource/*` 套件。

---

## 4. 建置與部署

### 4.1 本地開發

```bash
# 啟動開發伺服器
ng serve
# 或指定 port
ng serve --port 4300

# 開啟瀏覽器
# http://localhost:4200 (預設)
```

**Hot Reload**：修改 `.ts`、`.html`、`.css` 檔案後自動重新編譯。

**WSL 注意事項**：參考 [7.2 節](#72-wsl-hot-reload-問題)。

### 4.2 Production Build

```bash
# 標準 production build
ng build --configuration production

# 輸出目錄
dist/angular-material-block-showcase/browser/
```

**Build 產出內容**：

```
dist/angular-material-block-showcase/browser/
├── index.html
├── main-[hash].js          # 主要 bundle
├── polyfills-[hash].js     # Polyfills (minimal, no zone.js)
├── chunk-[hash].js         # Lazy loaded chunks (多個)
├── styles-[hash].css       # 全域樣式
├── assets/                 # 靜態資源
│   ├── block-sources/      # Baked JSON
│   ├── mock-data/          # Mock API JSON
│   └── i18n/               # 翻譯檔
├── favicon.ico
└── media/                  # 字體檔案 (woff2)
```

### 4.3 Docker 部署

#### 單次 Build & Run

```bash
# 從專案根目錄
docker build -f deploy/Dockerfile -t angular-material-block .

# 執行
docker run -p 8080:80 angular-material-block

# 瀏覽 http://localhost:8080
```

#### Docker Compose (含 ngrok)

```bash
# 設定 ngrok token
export NGROK_AUTHTOKEN=your_token_here

# 啟動
cd deploy
docker compose up -d

# 檢視狀態
docker compose ps

# 檢視 logs
docker compose logs -f app
docker compose logs -f ngrok

# 停止
docker compose down

# 重建 (程式碼變更後)
docker compose up -d --build
```

**存取端點**：

| 端點 | URL |
|---|---|
| 本機直連 | `http://localhost:8080` |
| ngrok Tunnel | 查看 `http://localhost:4040` 取得動態 URL |
| ngrok Inspector | `http://localhost:4040` |

### 4.4 ngrok Tunnel 設定

1. 註冊 [ngrok 帳號](https://ngrok.com/)
2. 取得 Auth Token
3. 設定環境變數：

```bash
# .env 檔案 (不要 commit)
NGROK_AUTHTOKEN=2abc...xyz

# 或直接 export
export NGROK_AUTHTOKEN=2abc...xyz
```

4. 啟動 Docker Compose：

```bash
cd deploy
docker compose up -d
```

5. 開啟 Inspector 取得公開 URL：

```
http://localhost:4040
```

### 4.5 Production Deployment Checklist

| 項目 | 指令 / 動作 | 預期結果 |
|---|---|---|
| Lint 通過 | `npm run lint` | 0 errors |
| 格式檢查通過 | `npm run format:check` | All files formatted |
| 單元測試通過 | `npm test` | All specs pass |
| Bake 最新原始碼 | `npm run bake` | JSON files updated |
| Production build | `ng build` | 無 error、initial bundle < 3MB |
| Docker build | `docker build -f deploy/Dockerfile -t app .` | Build success |
| 基本功能驗證 | 手動測試 4 個 Layout | 所有頁面正常渲染 |

---

## 5. 組態說明

### 5.1 angular.json 重要設定

```json
{
  "projects": {
    "angular-material-block-showcase": {
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "browser": "src/main.ts",
            "styles": [
              "src/styles/themes.scss",
              "src/styles.css"
            ],
            "assets": [
              { "glob": "**/*", "input": "public" },
              { "glob": "**/*", "input": "src/assets", "output": "assets" }
            ]
          },
          "configurations": {
            "production": {
              "budgets": [
                { "type": "initial", "maximumWarning": "1.5MB", "maximumError": "3MB" },
                { "type": "anyComponentStyle", "maximumWarning": "8kB", "maximumError": "16kB" }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          }
        }
      }
    }
  }
}
```

**重要設定說明**：

| 設定 | 值 | 說明 |
|---|---|---|
| `builder` | `@angular/build:application` | esbuild-based builder (非 webpack) |
| `browser` | `src/main.ts` | 單一進入點 (CSR) |
| `styles` | `[themes.scss, styles.css]` | 全域樣式載入順序 |
| `outputHashing` | `all` | Production 的 cache-busting |
| Initial budget warning | 1.5MB | 超出會發出警告 |
| Initial budget error | 3MB | 超出會中止 build |
| Component style budget | 8kB warning / 16kB error | 避免單一元件樣式過大 |

### 5.2 tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "experimentalDecorators": true,
    "target": "ES2022",
    "module": "preserve",
    "baseUrl": "./",
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@layouts/*": ["src/app/layouts/*"]
    }
  },
  "angularCompilerOptions": {
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "typeCheckHostBindings": true,
    "strictTemplates": true
  }
}
```

**重要設定說明**：

| 設定 | 說明 |
|---|---|
| `strict: true` | 啟用所有 TypeScript strict checks |
| `noImplicitOverride` | override method 必須加 `override` 關鍵字 |
| `noPropertyAccessFromIndexSignature` | 禁止透過 dot notation 存取 index signature |
| `noImplicitReturns` | 所有分支必須有明確 return |
| `strictTemplates` | Angular template 嚴格型別檢查 |
| `strictInputAccessModifiers` | 禁止從 template 存取 private inputs |
| `typeCheckHostBindings` | Host binding 型別檢查 |
| `@core/*` path alias | `import { ThemeStore } from '@core/theme/theme-store'` |
| `@layouts/*` path alias | `import { AdminLayout } from '@layouts/admin-layout/admin-layout'` |

### 5.3 Tailwind v4 + PostCSS

#### Tailwind v4 整合

在 `styles.css` 中直接 import：

```css
@import 'tailwindcss';
```

Tailwind v4 使用 **CSS-first configuration** — 無需 `tailwind.config.js`。Content detection 由 `@tailwindcss/postcss` PostCSS plugin 自動處理。

#### PostCSS 設定

PostCSS 透過 `@tailwindcss/postcss` 整合，在 `package.json` 的 dependencies 中：

```json
{
  "@tailwindcss/postcss": "^4.1.12",
  "postcss": "^8.5.6",
  "tailwindcss": "^4.1.12"
}
```

Angular CLI 會自動偵測 PostCSS 設定。

### 5.4 ESLint 設定

```javascript
// eslint.config.js
module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    ignores: ["src/app/blocks/**"],    // Vendor blocks 排除
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettier,                         // Prettier 整合 (disable conflicting rules)
    ],
    rules: {
      "@angular-eslint/component-selector": ["error", {
        type: "element", prefix: "app", style: "kebab-case"
      }],
      "@angular-eslint/directive-selector": ["error", {
        type: "attribute", prefix: "app", style: "camelCase"
      }],
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_", varsIgnorePattern: "^_"
      }],
    },
  },
  {
    files: ["**/*.html"],
    ignores: ["src/app/blocks/**"],    // Vendor block templates 排除
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
  },
);
```

**注意事項**：

- `src/app/blocks/**` 目錄完全排除 — Vendor Block 有自己的程式碼風格
- 使用 `eslint-config-prettier` 確保 ESLint 與 Prettier 不衝突
- 啟用 `angular.configs.templateAccessibility` 做 template 層級的無障礙檢查

### 5.5 Prettier 設定

Prettier 設定遵循 `package.json` 的預設行為，格式化範圍：

```json
{
  "format": "prettier --write \"src/**/*.{ts,html,css,json}\" \"scripts/**/*.ts\"",
  "format:check": "prettier --check \"src/**/*.{ts,html,css,json}\" \"scripts/**/*.ts\""
}
```

---

## 6. 維護作業

### 6.1 升級 Angular / Material 版本

#### 標準升級流程

```bash
# 1. 使用 Angular Update Guide 確認遷移步驟
# https://angular.dev/update-guide

# 2. 更新 Angular CLI
npm install -g @angular/cli@latest

# 3. 執行 ng update
ng update @angular/core @angular/cli
ng update @angular/material @angular/cdk

# 4. 更新其他依賴
npm update

# 5. 驗證
npm run lint
npm test
ng build
```

#### 常見升級問題

| 問題 | 解法 |
|---|---|
| Breaking API changes | 依循官方 Migration Guide |
| Material 主題 API 變更 | 更新 `themes.scss` 中的 `@include mat.theme()` 參數 |
| Peer dependency 衝突 | 使用 `--legacy-peer-deps` 或更新相依套件 |
| 新 eslint 規則報錯 | 更新 `angular-eslint` 並修復或停用新規則 |

### 6.2 重新產生 Vendor Block 原始碼

當新增或更新 Vendor Block 後，需重新執行 bake 腳本：

```bash
# 產生 CodeViewer 需要的 JSON 檔案
npm run bake
```

**原理**：`scripts/bake-block-sources.ts` 遍歷 `src/app/blocks/` 下所有目錄，將每個 variant 的檔案內容讀出並 JSON 化，輸出至 `src/assets/block-sources/{category}__{variant}.json`。

**執行時機**：

- 新增 Vendor Block 後
- 修改 Vendor Block 原始碼後
- 刪除 Vendor Block 後

### 6.3 Cache 清理

#### Angular Cache

```bash
# 刪除 Angular build cache
rm -rf .angular/cache

# 或指定清理
npx ng cache clean
```

#### Vite / esbuild Cache

```bash
rm -rf node_modules/.vite
```

#### 完整清理

```bash
# 刪除所有快取與依賴
rm -rf node_modules .angular dist

# 重新安裝
npm install
npm run bake
ng build
```

### 6.4 Budget 調整

當 initial bundle size 超出限制時：

#### 診斷

```bash
# 分析 bundle size
ng build --stats-json
# 使用 webpack-bundle-analyzer 或 esbuild 的 metafile 分析

# 查看 build 輸出中的 size 報告
ng build 2>&1 | grep -i "budget"
```

#### 調整

編輯 `angular.json`：

```json
{
  "budgets": [
    { "type": "initial", "maximumWarning": "2MB", "maximumError": "4MB" },
    { "type": "anyComponentStyle", "maximumWarning": "12kB", "maximumError": "20kB" }
  ]
}
```

#### 優化手段

| 手段 | 說明 |
|---|---|
| Lazy loading | 確保所有 feature routes 使用 `loadComponent` / `loadChildren` |
| Tree shaking | 避免 barrel exports 引入不需要的模組 |
| 圖片優化 | 使用 `NgOptimizedImage` + WebP 格式 |
| 字體子集 | 僅 import 需要的字重 |
| Chart.js tree shaking | 只 register 使用到的 controllers/scales/plugins |

### 6.5 Mock Data 維護

#### 新增 Mock Data 檔案

1. 建立 JSON 檔案於 `src/assets/mock-data/`
2. 在 `angular.json` 的 `assets` 設定中已有通配規則，無需額外設定
3. 建立對應的 Mock API Service 讀取該 JSON

#### 修改現有 Mock Data

直接編輯 `src/assets/mock-data/*.json` 檔案，資料格式需符合對應 TypeScript interface。

#### Mock Data 格式驗證

Mock Data 沒有獨立的 schema 驗證，但 TypeScript strict mode 會在 `firstValueFrom(this.http.get<T>(...))` 時進行型別推斷，確保結構一致性。

---

## 7. 疑難排解

### 7.1 常見 Build 錯誤

#### NG0950: Required input was not provided

**症狀**：Vendor Block 在 BlockPreview 中渲染時拋出 `NG0950`。

**原因**：Block 宣告了 `input.required<T>()` 但 BlockPreview 未傳入對應值。

**解法**：在 `.page.ts` 的 `VARIANTS` 陣列中加入 `demoInputs`：

```typescript
{
  id: 'some-block-1',
  label: 'Some Block 1',
  registryCategory: 'some-blocks',
  component: SomeBlock1Component,
  isFree: false,
  demoInputs: {
    title: 'Demo Title',
    items: [],
  },
},
```

#### Budget exceeded

**症狀**：`ERROR Budget "initial" exceeded ...`

**解法**：

1. 確認是否有不必要的 eager import
2. 檢查是否有 Vendor Block 被意外 eager loaded
3. 必要時調整 `angular.json` 中的 budget 上限
4. 使用 `ng build --stats-json` 分析 bundle 組成

#### SCSS Compilation Error

**症狀**：`themes.scss` 編譯失敗

**解法**：

1. 確認 `@angular/material` 版本正確
2. 確認使用的 palette 名稱在 `@angular/material` 中存在
3. 清理 cache：`rm -rf .angular/cache`

#### TypeScript Path Alias 找不到模組

**症狀**：`Cannot find module '@core/...'`

**解法**：

1. 確認 `tsconfig.json` 的 `paths` 設定正確
2. 確認 `baseUrl` 設定為 `"./"`
3. 重啟 TypeScript Language Server (IDE 中)

#### Peer Dependency Conflicts

**症狀**：`npm install` 報告 peer dependency 衝突

**解法**：

```bash
# 使用 legacy peer deps 安裝
npm install --legacy-peer-deps

# 或在 .npmrc 中設定
echo "legacy-peer-deps=true" >> .npmrc
```

### 7.2 WSL Hot Reload 問題

#### 症狀

在 WSL2 環境下修改檔案後，`ng serve` 不會自動重新編譯。

#### 原因

WSL2 的 Windows 檔案系統 (NTFS) 不支援 inotify 檔案監控。

#### 解法

**方案 A：使用 polling (簡單但較耗 CPU)**

```bash
ng serve --poll 1000
```

**方案 B：將專案移至 Linux 檔案系統 (推薦)**

```bash
# 將專案移至 WSL 原生檔案系統
cp -r /mnt/c/Users/username/Project/angular-material-block ~/workspace/
cd ~/workspace/angular-material-block
npm install
ng serve
```

**方案 C：使用 VS Code Remote WSL**

在 VS Code 中安裝 WSL extension，直接在 WSL 中開啟專案。

### 7.3 Docker Port 衝突

#### 症狀

```
Error: Bind for 0.0.0.0:8080 failed: port is already allocated
```

#### 解法

```bash
# 查找佔用 port 的 process
lsof -i :8080
# 或
netstat -tlnp | grep 8080

# 停止佔用的 process
kill <PID>

# 或修改 docker-compose.yml 使用不同 port
ports:
  - "8888:80"
```

### 7.4 Vendor Block Peer Dependency 衝突

#### 症狀

ngm-dev-blocks vendor block 使用的 `@angular/material` 或 `chart.js` 版本與專案不同。

#### 解法

1. **確認 Vendor Block 相容版本範圍**：查閱 ngm-dev-blocks 文件
2. **使用 `--legacy-peer-deps`**：
   ```bash
   npm install --legacy-peer-deps
   ```
3. **升級 Vendor Block**：透過 MCP `generate-angular-material-block` 重新產生
4. **Pin 版本**：在 `package.json` 中固定相容版本

### 7.5 Material Icons 不顯示

#### 症狀

`<mat-icon>dashboard</mat-icon>` 顯示文字而非圖示。

#### 原因

Material Symbols Outlined 字體未載入或 font-set class 不正確。

#### 解法

1. 確認 `index.html` 中有 Google Fonts link（或本地字體已載入）：

```html
<link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
```

2. 確認 `app.config.ts` 中有設定 font-set：

```typescript
inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined');
```

3. 確認 `styles.css` 中有定義 `.material-symbols-outlined` 的 font-family

### 7.6 Chart.js 圖表不渲染

#### 症狀

Dashboard 圖表區域空白。

#### 解法

1. 確認 `Chart.register(...registerables)` 在 `app.config.ts` 的 `provideAppInitializer` 中執行
2. 確認 `ng2-charts` 的 `BaseChartDirective` 已在元件 `imports` 中宣告
3. 確認圖表的 canvas container 有明確的高度（Chart.js 需要 parent height）
4. 檢查 console 是否有 Chart.js 錯誤

### 7.7 Catalog CodeViewer 顯示「找不到原始碼」

#### 症狀

CodeViewer 顯示 error 而非原始碼。

#### 原因

Bake 腳本未執行或 bake 結果未包含該 variant。

#### 解法

```bash
# 重新 bake
npm run bake

# 驗證 JSON 存在
ls src/assets/block-sources/ | grep {category}__{variant}
```

---

## 8. API 參考

### 8.1 Mock API Endpoints

所有 Mock API 皆為 **in-memory service**，不發送真實 HTTP 請求（除了讀取 JSON fixture）。以下列出每個 service 的 public API。

#### 8.1.1 MockAuthApi

**位置**：`src/app/core/mock-api/mock-auth-api.ts`

| Method | Signature | 說明 |
|---|---|---|
| `signIn` | `(email: string, password: string) => Promise<AuthResult<MockAuthUser>>` | 模擬登入 |
| `signUp` | `(input: SignUpInput) => Promise<AuthResult<MockAuthUser>>` | 模擬註冊 |
| `forgotPassword` | `(email: string) => Promise<AuthResult<{ sentTo: string }>>` | 模擬忘記密碼 |
| `resetPassword` | `(input: ResetPasswordInput) => Promise<AuthResult<{ reset: boolean }>>` | 模擬重設密碼 |
| `verifyTwoFactor` | `(code: string) => Promise<AuthResult<{ verified: boolean }>>` | 模擬 2FA 驗證 |

**錯誤觸發規則**：

```
signIn:
  locked@...     → AccountLocked
  network@...    → Unknown
  password < 6   → InvalidCredentials

signUp:
  network@...    → Unknown
  exists@...     → EmailAlreadyInUse
  password < 8   → WeakPassword

forgotPassword:
  network@...    → Unknown
  unknown@...    → UserNotFound

resetPassword:
  token < 8 chars → InvalidToken
  password < 8    → WeakPassword

verifyTwoFactor:
  code == '000000' → TooManyAttempts
  code != '123456' → InvalidCode
```

#### 8.1.2 MockDashboardApi

**位置**：`src/app/core/mock-api/mock-dashboard.ts`

| Property / Method | Type | 說明 |
|---|---|---|
| `kpis` | `Signal<readonly KpiCardData[]>` | KPI 卡片資料 |
| `plans` | `Signal<PlansDocument>` | 方案分佈 |
| `topPages` | `Signal<TopPagesDocument>` | 熱門頁面 |
| `feeds` | `Signal<readonly FeedEntry[]>` | 活動動態 |
| `revenue` | `Signal<readonly RevenuePoint[]>` | 90 天營收序列 |
| `loaded` | `Signal<boolean>` | 資料載入狀態 |
| `totalRevenue` | `computed<number>` | 近 30 天營收加總 |
| `load()` | `() => Promise<void>` | 載入 JSON fixtures |

**Revenue 序列產生邏輯**：

- 90 天指數成長曲線
- 基礎值 $2,100/day，每日成長 $14.8
- 週末 dip 係數 0.82
- 正弦/餘弦噪聲
- 終值約 $3,100/day (對應 $84,900 MRR)

#### 8.1.3 MockUsersApi

**位置**：`src/app/core/mock-api/mock-users.ts`

| Property / Method | Type | 說明 |
|---|---|---|
| `users` | `Signal<readonly MockUser[]>` | 完整使用者清單 |
| `loaded` | `Signal<boolean>` | 載入狀態 |
| `filters` | `Signal<UserFilters>` | 當前篩選條件 |
| `filteredUsers` | `computed<readonly MockUser[]>` | 篩選後清單 |
| `stats` | `computed` | 統計 (total/active/invited/suspended) |
| `load()` | `() => Promise<void>` | 載入 JSON |
| `setFilters(partial)` | `(next: Partial<UserFilters>) => void` | 更新篩選條件 |
| `resetFilters()` | `() => void` | 重設篩選條件 |
| `getById(id)` | `(id: string) => MockUser \| undefined` | 依 ID 查詢 |
| `create(input)` | `(input: CreateUserInput) => Promise<AuthResult<MockUser>>` | 新增使用者 |
| `update(id, patch)` | `(id, patch) => Promise<AuthResult<MockUser>>` | 更新使用者 |
| `remove(id)` | `(id: string) => Promise<AuthResult<{ id: string }>>` | 刪除使用者 |
| `bulkRemove(ids)` | `(ids: readonly string[]) => Promise<AuthResult<{ removed: number }>>` | 批量刪除 |

#### 8.1.4 MockTeamsApi

**位置**：`src/app/core/mock-api/mock-teams.ts`

| Property / Method | Type | 說明 |
|---|---|---|
| `teams` | `Signal<readonly MockTeam[]>` | 團隊清單 |
| `loaded` | `Signal<boolean>` | 載入狀態 |
| `load()` | `() => Promise<void>` | 載入 JSON |
| `getById(id)` | `(id: string) => MockTeam \| undefined` | 依 ID 查詢 |

#### 8.1.5 MockNotificationsApi

**位置**：`src/app/core/mock-api/mock-notifications.ts`

| Property / Method | Type | 說明 |
|---|---|---|
| `notifications` | `Signal<readonly MockNotification[]>` | 完整通知清單 |
| `loaded` | `Signal<boolean>` | 載入狀態 |
| `filter` | `Signal<NotificationFilter>` | 當前篩選 ('all'/'unread'/'system'/'billing') |
| `unreadCount` | `computed<number>` | 未讀計數 |
| `filtered` | `computed<readonly MockNotification[]>` | 篩選後清單 |
| `load()` | `() => Promise<void>` | 載入 JSON |
| `setFilter(next)` | `(next: NotificationFilter) => void` | 設定篩選 |
| `markAsRead(id)` | `(id: string) => void` | 標記已讀 |
| `markAllAsRead()` | `() => void` | 全部標記已讀 |

#### 8.1.6 MockBillingApi

**位置**：`src/app/core/mock-api/mock-billing.ts`

| Property / Method | Type | 說明 |
|---|---|---|
| `plans` | `Signal<readonly Plan[]>` | 可用方案 |
| `invoices` | `Signal<readonly Invoice[]>` | 帳單清單 |
| `paymentMethods` | `Signal<readonly PaymentMethod[]>` | 付款方式 |
| `usageMetrics` | `Signal<readonly UsageMetric[]>` | 用量指標 |
| `loaded` | `Signal<boolean>` | 載入狀態 |
| `currentPlan` | `computed<Plan \| undefined>` | 當前方案 |
| `upcomingInvoice` | `computed<Invoice \| undefined>` | 下次帳單 |
| `load()` | `() => Promise<void>` | 載入 JSON |
| `upgradePlan(planId)` | `(planId: string) => Promise<AuthResult<Plan>>` | 升級方案 |
| `setDefaultPaymentMethod(id)` | `(id: string) => Promise<AuthResult<PaymentMethod>>` | 設定預設付款方式 |

#### 8.1.7 MockReportsApi

**位置**：`src/app/core/mock-api/mock-reports.ts`

| Property / Method | Type | 說明 |
|---|---|---|
| `kpis` | `Signal<readonly ReportKpi[]>` | 報表 KPI |
| `series` | `Signal<readonly ReportSeriesPoint[]>` | 時間序列 |
| `topItems` | `Signal<readonly TopItem[]>` | 排行榜 |
| `loaded` | `Signal<boolean>` | 載入狀態 |
| `load()` | `() => Promise<void>` | 載入 JSON |

#### 8.1.8 MockSettingsApi

**位置**：`src/app/core/mock-api/mock-settings.ts`

| Property / Method | Type | 說明 |
|---|---|---|
| `profile` | `Signal<UserProfile>` | 個人檔案 |
| `twoFactor` | `Signal<TwoFactorState>` | 2FA 狀態 |
| `apiKeys` | `Signal<readonly ApiKey[]>` | API 金鑰清單 |
| `integrations` | `Signal<readonly Integration[]>` | 第三方整合 |
| `preferences` | `Signal<readonly PreferenceGroup[]>` | 偏好設定 |
| `loaded` | `Signal<boolean>` | 載入狀態 |
| `load()` | `() => Promise<void>` | 載入 JSON |
| `updateProfile(patch)` | `(patch) => Promise<AuthResult<UserProfile>>` | 更新個人檔案 |
| `enableTwoFactor(method)` | `(method: 'totp' \| 'sms') => Promise<AuthResult<TwoFactorState>>` | 啟用 2FA |
| `disableTwoFactor()` | `() => Promise<AuthResult<TwoFactorState>>` | 停用 2FA |
| `createApiKey(label, scopes)` | `(label, scopes) => Promise<AuthResult<ApiKey>>` | 建立 API Key |
| `deleteApiKey(id)` | `(id: string) => Promise<AuthResult<void>>` | 刪除 API Key |
| `toggleIntegration(id)` | `(id: string) => Promise<AuthResult<Integration>>` | 切換整合 |
| `updatePreference(groupId, optionId, enabled)` | `(...) => Promise<AuthResult<void>>` | 更新偏好 |

### 8.2 AuthStore API

**位置**：`src/app/core/auth/auth-store.ts`

#### Properties (Signal)

| Property | Type | 說明 |
|---|---|---|
| `state` | `Signal<AuthState>` | 完整認證狀態 (readonly) |
| `user` | `computed<AuthUser \| null>` | 當前使用者 |
| `isAuthenticated` | `computed<boolean>` | 是否已認證 (含 token 過期檢查) |

#### Methods

| Method | Signature | 說明 |
|---|---|---|
| `signIn` | `(email: string, password: string) => Promise<AuthResult<AuthUser>>` | 登入並持久化 Session |
| `signUp` | `(input: SignUpInput) => Promise<AuthResult<AuthUser>>` | 註冊並持久化 Session |
| `forgotPassword` | `(email: string) => Promise<AuthResult<{ sentTo: string }>>` | 忘記密碼 |
| `resetPassword` | `(input: ResetPasswordInput) => Promise<AuthResult<{ reset: boolean }>>` | 重設密碼 |
| `verifyTwoFactor` | `(code: string) => Promise<AuthResult<{ verified: boolean }>>` | 2FA 驗證 |
| `signOut` | `() => void` | 登出 (清除 state + localStorage) |
| `restore` | `() => void` | 從 localStorage 還原 Session |

#### AuthState 結構

```typescript
export interface AuthState {
  readonly user: AuthUser | null;
  readonly token: string | null;      // mock JWT
  readonly expiresAt: number | null;   // Unix timestamp
}

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
}
```

#### Session 持久化

- **Storage Key**: `'auth'`
- **有效期**: 8 小時 (28,800,000 ms)
- **格式**: `JSON.stringify(AuthState)`
- **還原邏輯**: 讀取 → 解析 → 檢查 token 存在 + expiresAt > Date.now()

### 8.3 ThemeStore API

**位置**：`src/app/core/theme/theme-store.ts`

#### Types

```typescript
export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';
export type ThemePalette =
  | 'azure' | 'blue' | 'violet' | 'magenta' | 'rose' | 'red'
  | 'orange' | 'yellow' | 'chartreuse' | 'green' | 'spring-green' | 'cyan';
```

#### Properties (Signal)

| Property | Type | 說明 |
|---|---|---|
| `mode` | `Signal<ThemeMode>` | 當前模式 (light/dark/system) |
| `palette` | `Signal<ThemePalette>` | 當前色板 ID |
| `effectiveMode` | `computed<EffectiveTheme>` | 實際生效的 light/dark |
| `isDark` | `computed<boolean>` | 是否 dark mode |

#### Methods

| Method | Signature | 說明 |
|---|---|---|
| `setMode` | `(mode: ThemeMode) => void` | 設定主題模式 (含 localStorage 持久化) |
| `setPalette` | `(palette: ThemePalette) => void` | 設定色板 (含 localStorage 持久化 + 驗證) |

#### 持久化

| Storage Key | 預設值 | 有效值 |
|---|---|---|
| `'theme-mode'` | `'system'` | `'light' \| 'dark' \| 'system'` |
| `'theme-palette'` | `'azure'` | 12 palette IDs |

#### Side Effects (Constructor)

1. **`.dark` class toggle** — `effect` 監聽 `isDark()`，套用/移除 `document.documentElement.classList`
2. **`data-palette` attribute** — `effect` 監聯 `_palette()`，設定 `document.documentElement.setAttribute`
3. **System preference watch** — `matchMedia('(prefers-color-scheme: dark)')` 監聽器

#### 可用色板清單

```typescript
export const THEME_PALETTES: readonly ThemePaletteInfo[] = [
  { id: 'azure',        label: '天藍',   swatch: '#005cbb' },
  { id: 'blue',         label: '藍',     swatch: '#1450a6' },
  { id: 'violet',       label: '紫羅蘭', swatch: '#6439ba' },
  { id: 'magenta',      label: '洋紅',   swatch: '#9b2c6f' },
  { id: 'rose',         label: '玫瑰',   swatch: '#a8264a' },
  { id: 'red',          label: '紅',     swatch: '#ba1a1a' },
  { id: 'orange',       label: '橙',     swatch: '#8c4a00' },
  { id: 'yellow',       label: '黃',     swatch: '#6c5d00' },
  { id: 'chartreuse',   label: '嫩綠',   swatch: '#4d6600' },
  { id: 'green',        label: '綠',     swatch: '#1a6c2b' },
  { id: 'spring-green', label: '春綠',   swatch: '#006b4f' },
  { id: 'cyan',         label: '青',     swatch: '#006874' },
];
```

### 8.4 OnboardingStore API

**位置**：`src/app/app-shell/dashboard/onboarding-store.ts`

#### Properties (Signal)

| Property | Type | 說明 |
|---|---|---|
| `dismissed` | `Signal<boolean>` | Checklist 是否已被使用者 dismiss |
| `steps` | `Signal<readonly OnboardingStep[]>` | 步驟清單 |

#### Methods

| Method | Signature | 說明 |
|---|---|---|
| `dismiss` | `() => void` | 收起 Checklist (持久化至 localStorage) |
| `reset` | `() => void` | 重設所有步驟 + 展開 Checklist |
| `toggleStep` | `(id: string) => void` | 切換步驟完成狀態 |
| `nextIncompleteStep` | `() => OnboardingStep \| undefined` | 取得下一個未完成步驟 |

#### 持久化

- **Storage Key**: `'onboarding.dismissed'`
- **格式**: `'true'` 字串

### 8.5 ChartPaletteService API

**位置**：`src/app/core/charts/chart-palette.ts`

#### Properties (Signal)

| Property | Type | 說明 |
|---|---|---|
| `palette` | `Signal<ChartPalette>` | 完整色彩物件 |
| `primary` | `computed<string>` | Primary color |
| `categorical` | `computed<readonly string[]>` | 分類色序列 |

#### Methods

| Method | Signature | 說明 |
|---|---|---|
| `recompute` | `() => void` | 重新從 CSS Variables 讀取色彩值 |
| `lineDataset` | `(overrides?) => Record<string, unknown>` | 產生 Chart.js line dataset config |
| `donutDataset` | `(length: number) => Record<string, unknown>` | 產生 Chart.js donut dataset config |

#### 工具函式

```typescript
// 為色彩加入 alpha channel
export function withAlpha(color: string, alpha: number): string;
// 支援 #rgb, #rrggbb, rgb(), rgba() 格式
```

### 8.6 I18nStore API

**位置**：`src/app/core/i18n/i18n-store.ts`

| Property / Method | Type | 說明 |
|---|---|---|
| `locale` | `Signal<Locale>` | 當前語系 (`'zh-TW'`) |
| `loaded` | `Signal<boolean>` | 字典載入狀態 |
| `entryCount` | `computed<number>` | 已載入翻譯條目數 |
| `load()` | `() => Promise<void>` | 從 `assets/i18n/{locale}.json` 載入字典 |
| `t(key, params?)` | `(key: string, params?) => string` | 翻譯函式 (支援 `{param}` 插值) |

### 8.7 ConfirmDestructiveDialog API

**位置**：`src/app/core/dialogs/confirm-destructive-dialog.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class ConfirmDestructiveDialog {
  async confirm(options: ConfirmDestructiveOptions): Promise<boolean>;
}

export interface ConfirmDestructiveOptions {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;    // default: '確認' or '確認刪除'
  readonly cancelLabel?: string;     // default: '取消'
  readonly destructive?: boolean;    // default: false
  readonly icon?: string;            // default: 'warning' (destructive) or 'help'
}
```

**使用範例**：

```typescript
const dialog = inject(ConfirmDestructiveDialog);

// 破壞性操作
const confirmed = await dialog.confirm({
  title: '刪除使用者',
  message: '此操作無法復原，確定要繼續嗎？',
  destructive: true,
});
if (confirmed) {
  await this.usersApi.remove(userId);
}

// 一般確認
const proceed = await dialog.confirm({
  title: '變更方案',
  message: '升級至 Growth 方案，下次帳單將反映新費用。',
  confirmLabel: '確認升級',
  icon: 'upgrade',
});
```

---

## 附錄 A：完整 npm scripts

```json
{
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test",
  "lint": "ng lint",
  "format": "prettier --write \"src/**/*.{ts,html,css,json}\" \"scripts/**/*.ts\"",
  "format:check": "prettier --check \"src/**/*.{ts,html,css,json}\" \"scripts/**/*.ts\"",
  "bake": "tsx scripts/bake-block-sources.ts",
  "bake:test": "tsx --test scripts/bake-block-sources.spec.ts"
}
```

## 附錄 B：環境變數

| 變數 | 用途 | 預設值 | 說明 |
|---|---|---|---|
| `NGROK_AUTHTOKEN` | ngrok 認證 | (空) | Docker Compose ngrok service 使用 |

## 附錄 C：Git Hooks (建議)

此專案未內建 git hooks，但建議搭配以下檢查：

| Hook | 執行 | 說明 |
|---|---|---|
| `pre-commit` | `npm run lint && npm run format:check` | 確保程式碼品質 |
| `pre-push` | `npm test && ng build` | 確保建置成功 |

可透過 `husky` + `lint-staged` 實現：

```bash
npm install -D husky lint-staged
npx husky init
```

---

*本手冊由開發團隊維護。操作步驟以實際執行結果為準，如有疑問請回溯原始碼。*
