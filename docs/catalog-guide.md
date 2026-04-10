# Angular Material Block Catalog -- 開發者指南

> **版本**: Angular 21+ / Angular Material 21 / Signals / OnPush / Standalone  
> **區塊總數**: 45 項 (Application 31 + Marketing 14)  
> **變體總數**: 196+  
> **最後更新**: 2026-04-09

---

## 目錄

- [概觀](#概觀)
- [快速入門](#快速入門)
- [APPLICATION 類別 (31 項)](#application-類別-31-項)
  - [Forms](#forms)
  - [Charts](#charts)
  - [Elements](#elements)
  - [Components](#components-子類別)
  - [Overlays](#overlays)
  - [Feedbacks](#feedbacks)
  - [Lists](#lists)
  - [Application Shells](#application-shells)
  - [Headings](#headings)
- [MARKETING 類別 (14 項)](#marketing-類別-14-項)
  - [Elements](#marketing-elements)
  - [Page Sections](#page-sections)
- [共用元件架構](#共用元件架構)
- [自訂區塊開發流程](#自訂區塊開發流程)
- [響應式設計指南](#響應式設計指南)
- [無障礙設計規範](#無障礙設計規範)

---

## 概觀

Angular Material Block Catalog 是一套基於 Angular 21+、Angular Material 21 的生產級 UI 區塊展示系統。所有區塊均遵循以下核心約束：

- **Standalone Components**: Angular v20+ 預設值，不在 decorator 中設定 `standalone: true`
- **Signal-based Reactivity**: 使用 `signal()`、`computed()`、`input()`、`output()` 取代傳統 decorator
- **OnPush Change Detection**: 每個元件強制使用 `ChangeDetectionStrategy.OnPush`
- **Native Control Flow**: 使用 `@if` / `@for` / `@switch` 取代結構型指令
- **WCAG AA Compliance**: 所有區塊通過 AXE 檢查與無障礙基準

### 目錄結構

```
src/app/catalog/
  blocks/           # 45 個 .page.ts — 每個目錄頁面
  shared/           # 6 個共用元件 (CatalogPage, BlockPreview, CodeViewer, ...)
  models/           # TypeScript 介面定義
src/app/blocks/     # 實際 UI 區塊原始碼
```

### 類別劃分

| 類別 | 項目數 | 子類別 |
|------|--------|--------|
| **Application** | 31 | Forms (6), Charts (8), Elements (1), Components (3), Overlays (2), Feedbacks (1), Lists (4), Application Shells (4), Headings (2) |
| **Marketing** | 14 | Elements (1), Page Sections (13) |

---

## 快速入門

### 1. 探索目錄

透過 `ngm-dev-blocks` MCP Server 的 `get-all-block-names` 工具列出所有可用區塊。

### 2. 生成區塊

選定區塊後，呼叫 `generate-angular-material-block` 並傳入區塊名稱，取得完整的 TypeScript / HTML / CSS 原始碼與相依套件清單。

### 3. 整合至專案

將生成的元件放置於對應的 feature 目錄，在路由或父元件中透過 `imports` 陣列匯入即可使用。

### 4. 驗證建置

```bash
ng build
```

所有區塊皆以 lazy-loading 方式整合，確保 bundle size 最小化。

---

## APPLICATION 類別 (31 項)

### Forms

---

#### 1. account-user-management

**功能解析**

帳戶與使用者管理表單集合，涵蓋個人資料編輯、密碼變更、雙因子驗證設定、登入裝置管理、團隊邀請、權限角色、通知偏好、API Token 管理、資料下載/刪除以及組織層級設定。適用於 SaaS 產品的 `/settings` 路由群組。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `account-user-management-1` | 個人資料設定 — 姓名、Email、頭像上傳 |
| 2 | `account-user-management-2` | 密碼變更 — 舊密碼確認 + 新密碼強度驗證 |
| 3 | `account-user-management-3` | 雙因子驗證設定 — TOTP / SMS 配置 |
| 4 | `account-user-management-4` | 登入裝置管理 — 瀏覽器與裝置清單 + 遠端登出 |
| 5 | `account-user-management-5` | 團隊成員邀請 — Email 批量邀請 + 角色指定 |
| 6 | `account-user-management-6` | 權限角色設定 — RBAC 角色矩陣 |
| 7 | `account-user-management-7` | 通知偏好設定 — Email / Push / In-app 切換 |
| 8 | `account-user-management-8` | API Token 管理 — 建立、撤銷、到期日設定 |
| 9 | `account-user-management-9` | 資料下載與刪除 — GDPR 合規入口 |
| 10 | `account-user-management-10` | 組織層級設定 — 多租戶組織管理 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 帳戶管理表單區塊 |

**應用場景**
- `/app/settings/profile` — 使用者個人資料設定頁
- `/app/settings/security` — 密碼與 2FA 安全設定
- `/app/settings/team` — 團隊成員管理與邀請
- `/app/settings/integrations` — API Token 與第三方整合

**最佳實作**
- DO: 密碼變更必須要求舊密碼確認，防止帳號劫持
- DO: 2FA 設定提供備用恢復碼機制
- DO: 敏感操作（刪除帳號）使用 `role="alertdialog"` 的二次確認
- DONT: 密碼欄位未使用 `autocomplete="current-password"` / `"new-password"`

**Angular 21 整合建議**

使用 Signal Forms 建構表單狀態管理。密碼強度驗證可透過 `computed()` 即時計算。2FA 代碼輸入搭配 `inputmode="numeric"` 與 `autocomplete="one-time-code"`。各設定頁面以獨立路由 lazy-load，搭配 `CanDeactivate` guard 防止未儲存離開。

---

#### 2. authentication

**功能解析**

身份驗證與登入表單集合，涵蓋 Email 密碼登入、Google 社群登入、多識別提供者、品牌化登入頁面（左右分割、帶插圖、極簡置中）以及工作區身份切換。適用於 SaaS 產品的認證入口。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `login-email-password` | Yes | 基本電子郵件登入表單 |
| 2 | `login-email-password-google` | No | 電子郵件 + Google 登入 |
| 3 | `login-email-provider` | No | 多識別提供者登入 |
| 4 | `login-with-email-01` | No | 品牌化登入頁面 |
| 5 | `login-with-email-02` | No | 左右分割登入佈局 |
| 6 | `login-with-email-03` | No | 帶插圖的登入頁 |
| 7 | `login-with-email-04` | No | 極簡置中登入表單 |
| 8 | `workspace-login-01` | No | 工作區身份切換登入 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 登入表單內容區塊（品牌 Logo、欄位、送出按鈕、社群登入、法律聲明） |

**應用場景**
- SaaS 產品首頁登入入口
- 多身份提供者整合（Email、Google、GitHub、SSO）
- 品牌化登入頁面搭配左側插圖
- 多工作區應用的組織切換登入

**最佳實作**
- DO: 每個欄位都有關聯的 `<label>`，不依賴 placeholder
- DO: 密碼欄位提供顯示/隱藏切換，按鈕需有 `aria-pressed` 狀態
- DONT: 社群登入按鈕僅以 Logo 呈現，須具備 `aria-label`
- DONT: 忽略防暴力破解的 Rate Limiting 或 CAPTCHA

**Angular 21 整合建議**

使用 Reactive Forms 搭配 `Validators.required` 與 `Validators.email`。登入狀態透過 `signal()` 管理（loading / error / success）。社群登入按鈕事件透過 `output()` 向父層發送。配合 `CanMatch` guard 控制已登入使用者的路由存取。

---

#### 3. billing-usage

**功能解析**

訂閱方案、付款方式與用量顯示區塊，提供當前方案卡、使用量進度列、付款方式管理、多指標儀表、帳單明細表與用量歷史圖。適用於 SaaS 產品的帳務與用量管理頁面。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `billing-usage-1` | 當前方案卡 — 顯示目前訂閱方案與到期日 |
| 2 | `billing-usage-2` | 使用量進度列 — API 呼叫次數、儲存空間用量 |
| 3 | `billing-usage-3` | 付款方式管理 — 信用卡新增/移除/設為預設 |
| 4 | `billing-usage-4` | 多指標儀表 — 同時呈現多個用量維度 |
| 5 | `billing-usage-5` | 帳單明細表 — 歷史發票列表與下載 |
| 6 | `billing-usage-6` | 用量歷史圖 — 趨勢走勢搭配期間選擇 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 帳務內容區塊 |

**應用場景**
- `/app/billing` — 訂閱方案概覽與升級入口
- `/app/billing/usage` — API / 儲存 / 頻寬用量統計
- `/app/billing/payment` — 付款方式管理
- `/app/billing/invoices` — 發票歷史與下載

**最佳實作**
- DO: 用量達到閾值時以 Banner 提醒，避免突然中斷服務
- DO: 進度條使用 `role="progressbar"` 搭配 `aria-valuenow`
- DONT: 隱藏額外費用或用量上限，造成期待落差
- DONT: 付款資訊直接存在前端，須透過安全的 tokenization

**Angular 21 整合建議**

帳務資料透過 `resource()` 從 API 載入，自動管理 loading / error 狀態。用量進度以 `computed()` 計算百分比。付款方式管理表單使用 Reactive Forms 搭配自訂信用卡驗證器。用量歷史圖的期間選擇透過 `linkedSignal()` 同步更新。

---

#### 4. file-upload

**功能解析**

檔案上傳集合，涵蓋基本上傳按鈕、Dropzone 拖放區、多檔批次、含預覽、大尺寸拖放區、內嵌卡片與緊湊型等多種上傳互動模式。底層驅動使用 `@ngx-dropzone`。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `file-upload-1` | 基本上傳按鈕 |
| 2 | `file-upload-2` | Dropzone 拖放區 |
| 3 | `file-upload-3` | 多檔拖放上傳 |
| 4 | `file-upload-4` | 含預覽的拖放區 |
| 5 | `file-upload-5` | 大尺寸拖放區 |
| 6 | `file-upload-6` | 內嵌卡片拖放區 |
| 7 | `file-upload-7` | 緊湊型拖放區 |

**元件配置**

| 類型 | 名稱 | 型別 | 預設值 | 說明 |
|------|------|------|--------|------|
| Input | `multiple` | `boolean` | `true` | 允許多檔上傳 |
| Input | `accept` | `string` | `*` | 可接受的檔案類型 |
| Input | `maxSize` | `number` | `null` | 單檔大小上限（bytes） |
| Output | `filesAdded` | `EventEmitter<File[]>` | — | 使用者選擇或拖放新檔案時觸發 |

**應用場景**
- 大頭照上傳（個人資料設定）
- 文件附件（工單、合約、報告）
- CSV / Excel 匯入（資料批次匯入）
- 媒體庫管理（圖片、影片批量上傳）

**最佳實作**
- DO: 拖放區必須有對應的 `<input type="file">` 作為 fallback
- DO: 大檔案提供上傳進度條（`role="progressbar"`）
- DONT: 缺少檔案大小/類型前端驗證
- DONT: 拖放區無明確的視覺 drag-over 回饋

**Angular 21 整合建議**

上傳狀態使用 `signal<'idle' | 'uploading' | 'success' | 'error'>()` 管理。已選檔案清單以 `signal<File[]>()` 追蹤，搭配 `computed()` 計算總大小與類型驗證。使用 `effect()` 監聽上傳進度並更新 `aria-valuenow`。表單驗證可透過 Signal Forms 整合自訂 `fileRequired` 驗證器。

---

#### 5. form-layouts

**功能解析**

表單版面範本集合，提供單欄標準、含章節分組、雙欄並排、卡片式、含側邊說明以及含步驟指示器等六種常見表單佈局骨架。專注於版面結構，不含業務邏輯。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `form-layout-1` | 單欄標準表單 |
| 2 | `form-layout-2` | 含章節分組 |
| 3 | `form-layout-3` | 雙欄並排表單 |
| 4 | `form-layout-4` | 卡片式表單 |
| 5 | `form-layout-5` | 含側邊說明 |
| 6 | `form-layout-6` | 含步驟指示器 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 表單欄位與提交按鈕 |

**應用場景**
- 設定頁面（個人資料、偏好、帳務）
- 新增資源精靈（專案、工作區、頻道）
- 複雜表單的分組說明與邏輯章節
- 側邊輔助說明的表單填寫導引

**最佳實作**
- DO: 雙欄佈局在窄螢幕自動 fallback 為單欄
- DO: 統一提交按鈕位置（底部右側）
- DONT: 欄位間距不一致（應使用 8px grid）
- DONT: 缺少必填欄位視覺標示（星號或輔助文字）

**Angular 21 整合建議**

新專案優先使用 Signal Forms；複雜表單使用 Reactive Forms 搭配 typed `FormGroup`。章節分組透過 `<fieldset>` / `<legend>` 建構語意。步驟指示器變體可整合 `MatStepper`，搭配 `stepControl` 驗證每步驟表單。

---

#### 6. steppers

**功能解析**

分階段表單導引元件，支援水平/垂直方向、線性/非線性流程、自訂圖示與表單驗證。為本專案自行開發（非 ngm-dev-blocks vendor），基於 Angular Material `MatStepper` 封裝。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `stepper-1` | Yes | 水平基本型 |
| 2 | `stepper-2` | Yes | 垂直分階段 |
| 3 | `stepper-3` | Yes | 非線性含選填步驟 |
| 4 | `stepper-4` | Yes | 自訂圖示 |
| 5 | `stepper-5` | Yes | 含表單驗證 |
| 6 | `stepper-6` | Yes | 可編輯步驟（底部標頭） |

**元件配置**

| 類型 | 名稱 | 型別 | 預設值 | 說明 |
|------|------|------|--------|------|
| Input | `linear` | `boolean` | `false` | 是否強制線性流程 |
| Input | `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Stepper 佈局方向 |

**應用場景**
- 多步驟註冊流程（帳號 → 驗證 → 偏好設定）
- 建立專案精靈（基本資訊 → 配置 → 確認）
- 結帳流程（購物車 → 收件 → 付款 → 確認）
- 表單拆分（將過長表單分為可管理的步驟）

**最佳實作**
- DO: 線性流程的每個步驟搭配 `stepControl` 做表單驗證
- DO: 非線性流程使用 `completed` 狀態標記已完成步驟
- DONT: 步驟超過 7 個（應合併或拆分為子頁面）
- DONT: 跳過步驟後缺少返回編輯機制

**Angular 21 整合建議**

每個步驟的表單以獨立 `FormGroup` 管理，搭配 `linear` 模式確保使用者依序完成。步驟狀態以 `computed()` 衍生（完成/進行中/待完成）。透過 `viewChild(MatStepper)` 取得 stepper 實例，程式化控制步驟切換。垂直模式適合行動裝置的窄版面。

---

### Charts

---

#### 7. area-charts

**功能解析**

面積圖集合，涵蓋單系列趨勢、多系列堆疊、百分比堆疊、漸層填充、帶標記點、平滑曲線、帶參考線、時間範圍選擇、圖例切換、多軸對比、深色主題、多事件註解與進階互動等 15 種版型。適合儀表板與資料分析頁面。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `area-chart-1` | Yes | 月度營收趨勢面積圖 |
| 2 | `area-chart-2` | No | 多系列堆疊面積圖 |
| 3 | `area-chart-3` | No | 期間對比面積圖 |
| 4 | `area-chart-4` | No | 漸層填充面積圖 |
| 5 | `area-chart-5` | No | 百分比堆疊面積圖 |
| 6 | `area-chart-6` | No | 多群組比較面積圖 |
| 7 | `area-chart-7` | No | 帶標記點面積圖 |
| 8 | `area-chart-8` | No | 平滑曲線面積圖 |
| 9 | `area-chart-9` | No | 帶參考線面積圖 |
| 10 | `area-chart-10` | No | 時間範圍選擇面積圖 |
| 11 | `area-chart-11` | No | 帶圖例切換面積圖 |
| 12 | `area-chart-12` | No | 多軸對比面積圖 |
| 13 | `area-chart-13` | No | 深色主題面積圖 |
| 14 | `area-chart-14` | No | 多事件註解面積圖 |
| 15 | `area-chart-15` | No | 進階互動面積圖 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 面積圖內容區塊（標題、圖例、座標軸、資料序列與工具提示） |

**應用場景**
- 儀表板上的業務指標趨勢（每日營收、每週活躍使用者）
- 多系列堆疊顯示各分類的貢獻度
- 期間對比（本月 vs 上月、實際 vs 目標）
- 監控類應用的流量與資源使用趨勢

**最佳實作**
- DO: y 軸起點設為 0，避免面積比例失真
- DO: 提供 CSV 下載或資料表替代方案供螢幕閱讀器讀取
- DONT: 同時比較超過 5 條系列（堆疊會互相遮蔽）
- DONT: 忽略空值處理（直線連接缺漏點產生假趨勢）

**Angular 21 整合建議**

圖表資料透過 `resource()` 從 API 載入，利用 `value()` / `isLoading()` 信號控制 skeleton 與實際圖表的切換。期間篩選使用 `linkedSignal()` 在使用者切換時重新觸發資料載入。搭配 `afterRenderEffect()` 在 DOM 就緒後初始化圖表庫。

---

#### 8. bar-charts

**功能解析**

橫向與直向長條圖集合，提供基本直向、含摘要卡片、堆疊、百分比堆疊、群組對比、水平排列、帶數值標籤、帶參考線與深色主題等 9 種版型。適合類別型資料比較。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `bar-chart-1` | Yes | 基本直向長條圖 |
| 2 | `bar-chart-2` | No | 含摘要卡片 |
| 3 | `bar-chart-3` | No | 堆疊長條圖 |
| 4 | `bar-chart-4` | No | 百分比堆疊 |
| 5 | `bar-chart-5` | No | 群組對比 |
| 6 | `bar-chart-6` | No | 水平長條圖 |
| 7 | `bar-chart-7` | No | 帶數值標籤 |
| 8 | `bar-chart-8` | No | 帶參考線 |
| 9 | `bar-chart-9` | No | 深色主題 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 長條圖內容區塊 |

**應用場景**
- 各部門/產品的業績比較
- 月份營收橫向對比
- 堆疊比例顯示各分類在總量中的佔比
- 目標 vs 實際的差異對比

**最佳實作**
- DO: 類別數量控制在 3-12 個之間
- DO: 堆疊長條圖提供圖例說明各色塊含義
- DONT: y 軸不從 0 開始，造成長度比例誤導
- DONT: 行動裝置上水平滾動截斷長條圖

**Angular 21 整合建議**

資料透過 `resource()` 取得。類別篩選可用 `signal()` 追蹤已選類別，`computed()` 衍生圖表需要的資料格式。使用 `effect()` 將 signal 變化同步到第三方圖表庫（如 ngx-charts 或 ECharts）。

---

#### 9. bar-lists

**功能解析**

排行榜風格的條列指標區塊，以水平條形圖搭配文字標籤呈現分類排名。提供基本排行榜、含對話框詳情、含圖示標籤、含百分比差異、含頭像排名、含分類色塊與含數值對比等 7 種版型。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `bar-list-1` | 基本排行榜 |
| 2 | `bar-list-2` | 含對話框詳情 |
| 3 | `bar-list-3` | 含圖示標籤 |
| 4 | `bar-list-4` | 含百分比差異 |
| 5 | `bar-list-5` | 含頭像排名 |
| 6 | `bar-list-6` | 含分類色塊 |
| 7 | `bar-list-7` | 含數值對比 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 排行榜內容區塊 |

**應用場景**
- 網站流量來源排行（/home、/pricing、/docs）
- 銷售業績排名（團隊 / 個人 / 產品）
- 客戶服務指標（回應時間、解決率排名）
- 功能使用頻率排行

**最佳實作**
- DO: 條形長度以資料最大值為基準正規化
- DO: 同時顯示數值與條形，方便精確讀取
- DONT: 項目超過 10 個（應分頁或摺疊顯示次要項目）
- DONT: 色彩過多且無圖例說明

**Angular 21 整合建議**

排行榜資料以 `signal<BarListItem[]>()` 管理，使用 `computed()` 排序並計算各項目的百分比寬度。點擊詳情透過 `MatDialog.open()` 開啟，搭配 `afterClosed()` 處理回傳資料。

---

#### 10. chart-compositions

**功能解析**

組合多種圖表類型的複合版面區塊，將 KPI 卡片、折線圖、長條圖、環圈圖等在單一面板中組合呈現。適合儀表板的綜合分析檢視。提供 14 種組合版型。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `chart-composition-1` | KPI 卡 + 折線圖 |
| 2 | `chart-composition-2` | KPI 卡 + 長條圖 |
| 3 | `chart-composition-3` | 多面板摘要 |
| 4 | `chart-composition-4` | 雙圖表並排 |
| 5 | `chart-composition-5` | 表格 + 圖表 |
| 6 | `chart-composition-6` | 完整儀表板面板 |
| 8 | `chart-composition-8` | KPI + 環圈 + 列表 |
| 9 | `chart-composition-9` | 多 KPI + 趨勢面積 |
| 10 | `chart-composition-10` | 地圖 + 排行榜 |
| 11 | `chart-composition-11` | 漏斗 + 轉換率 |
| 12 | `chart-composition-12` | 多維度切換面板 |
| 13 | `chart-composition-13` | 即時監控組合 |
| 14 | `chart-composition-14` | 財務報表面板 |
| 15 | `chart-composition-15` | 行銷成效總覽 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 組合圖表面板內容 |

**應用場景**
- 管理後台首頁儀表板
- 營運指標日報/週報概覽
- 行銷活動成效追蹤
- 財務報表摘要檢視

**最佳實作**
- DO: 每個面板只強調一個核心指標，搭配輔助圖表
- DO: 使用一致的時間範圍跨所有圖表
- DONT: 在單一面板塞入超過 3 種圖表類型
- DONT: 圖表之間缺乏邏輯關聯

**Angular 21 整合建議**

組合面板的期間篩選以頂層 `signal()` 管理，透過 `input()` 傳遞至各子圖表元件。使用 `resource()` 批量載入多個 API endpoint 的資料。設定 `previewMinHeight` 確保高度足夠容納複雜組合版面。

---

#### 11. chart-tooltips

**功能解析**

圖表懸停提示集合，提供 21 種 tooltip 樣式，涵蓋基本懸停、含色塊圖例、含迷你圖表、含百分比變化、含多指標列表、含環圈預覽等豐富的資料呈現方式。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1-21 | `chart-tooltip-1` ~ `chart-tooltip-21` | 從基本懸停提示到含豐富圖表與指標的進階 tooltip |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 圖表 tooltip 區塊 |

**應用場景**
- 各類圖表的懸停資訊呈現
- 多指標 KPI 的 hover detail
- 時序圖表的時間點詳細資料
- 地圖熱點的區域統計

**最佳實作**
- DO: tooltip 觸發時以 `aria-live="polite"` 播報資料
- DO: 確保 tooltip 在圖表邊緣不會被裁切
- DONT: tooltip 內容過多造成閱讀負擔
- DONT: 僅在 hover 觸發，應支援 focus 與鍵盤

**Angular 21 整合建議**

Tooltip 位置與內容以 `signal()` 管理，滑鼠事件透過 `host` 物件中的事件綁定處理。tooltip 模板以 `@if` 條件渲染。支援鍵盤焦點時使用 `CDK Overlay` 定位。

---

#### 12. donut-charts

**功能解析**

環圈圖（甜甜圈圖）集合，涵蓋基本分類佔比、中心值顯示、多層分群、帶圖例列表、目標達成率、互動式分類與多指標組合等 7 種版型。適合呈現比例分佈資料。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `donut-chart-1` | Yes | 基本分類佔比環圈圖 |
| 2 | `donut-chart-2` | No | 中心值顯示環圈圖 |
| 3 | `donut-chart-3` | No | 多層分群環圈圖 |
| 4 | `donut-chart-4` | No | 帶圖例列表環圈圖 |
| 5 | `donut-chart-5` | No | 目標達成率環圈圖 |
| 6 | `donut-chart-6` | No | 互動式分類環圈圖 |
| 7 | `donut-chart-7` | No | 多指標組合環圈圖 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 環圈圖內容區塊 |

**應用場景**
- 預算分配比例（行銷 / 研發 / 營運）
- 流量來源組成（直接 / 搜尋 / 社群 / 推薦）
- 目標達成率（年度 KPI、儲存空間使用率）
- 使用者分群統計（免費 / 基本 / 專業 / 企業）

**最佳實作**
- DO: 分類數控制在 3-6 項，超過應合併為「其他」
- DO: 中心區域顯示總和或重點摘要數值
- DONT: 分類占比接近均等時使用（差異不明顯）
- DONT: 3D 效果或陰影扭曲實際比例

**Angular 21 整合建議**

分類資料以 `signal<DonutData[]>()` 管理。互動式 hover 高亮以 `signal<string | null>()` 追蹤當前 hover 的分類 ID。圖例切換以 `computed()` 動態過濾可見分類。

---

#### 13. line-charts

**功能解析**

折線圖集合，提供基本折線、多序列比較、含資料點標記、平滑曲線、帶參考線、雙軸對比、含時間範圍選擇與深色主題等 8 種版型。適合趨勢追蹤與精確數值讀取。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `line-chart-1` | Yes | 基本折線圖 |
| 2 | `line-chart-2` | No | 多序列比較 |
| 3 | `line-chart-3` | No | 含資料點標記 |
| 4 | `line-chart-4` | No | 平滑曲線 |
| 5 | `line-chart-5` | No | 帶參考線 |
| 6 | `line-chart-6` | No | 雙軸對比 |
| 7 | `line-chart-7` | No | 含時間範圍選擇 |
| 8 | `line-chart-8` | No | 深色主題 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 折線圖內容區塊 |

**應用場景**
- 股價或財務指標趨勢
- 伺服器 CPU / 記憶體使用率即時監控
- 多產品銷售趨勢比較
- A/B 測試結果對比

**最佳實作**
- DO: 資料點標記幫助精確讀取數值
- DO: 多序列使用可區分的線條樣式（實線/虛線/點線）
- DONT: 超過 5 條線同時顯示
- DONT: 時間軸標籤過密造成重疊

**Angular 21 整合建議**

資料載入使用 `resource()`。時間範圍選擇透過 `linkedSignal()` 在切換時重載資料。雙軸對比以 `computed()` 分離左右軸資料集。即時監控搭配 `rxjs interval` + `toSignal()` 定期更新。

---

#### 14. spark-area-charts

**功能解析**

迷你面積走勢圖集合，以極簡樣式在有限空間內呈現趨勢方向。適合嵌入 KPI 卡片、表格列與密集型儀表板。提供 6 種版型。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `spark-area-chart-1` | 迷你面積走勢圖 |
| 2 | `spark-area-chart-2` | 帶數值摘要走勢圖 |
| 3 | `spark-area-chart-3` | 漸層迷你走勢圖 |
| 4 | `spark-area-chart-4` | 多系列對比走勢圖 |
| 5 | `spark-area-chart-5` | 帶趨勢標記走勢圖 |
| 6 | `spark-area-chart-6` | 緊湊型指標走勢圖 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 迷你走勢圖內容區塊 |

**應用場景**
- KPI 卡片中嵌入趨勢走勢
- 表格列末端的近期走勢縮圖
- 密集儀表板多指標並排
- 監控頁面的即時健康指標

**最佳實作**
- DO: 搭配可見的摘要數值（如「上升 5.2%」），不單靠圖形
- DO: 設定固定 y 軸範圍，避免單一離群值壓扁曲線
- DONT: 極小尺寸下仍顯示座標軸與標籤
- DONT: 與主內容顏色過於相似形成視覺噪音

**Angular 21 整合建議**

走勢資料以 `input.required<number[]>()` 傳入。趨勢方向（上升/下降/持平）以 `computed()` 衍生。搭配 `afterRenderEffect()` 在 canvas 或 SVG 上繪製。

---

### Elements

---

#### 15. badges

**功能解析**

徽章與標籤集合，用於標示狀態、計數、分類與重要性提示。提供基本狀態、含點狀指示器、含圖示、圓形、邊框、大尺寸、含關閉按鈕、多色狀態組、漸層、軟色調、實色強調與含計數等 12 種變體。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `badge-1` | Yes | 基本狀態徽章 |
| 2 | `badge-2` | No | 含點狀指示器 |
| 3 | `badge-3` | No | 含圖示徽章 |
| 4 | `badge-4` | No | 圓形徽章 |
| 5 | `badge-5` | No | 邊框徽章 |
| 6 | `badge-6` | No | 大尺寸徽章 |
| 7 | `badge-7` | No | 含關閉按鈕 |
| 8 | `badge-8` | No | 多色狀態組 |
| 9 | `badge-9` | No | 漸層徽章 |
| 10 | `badge-10` | No | 軟色調徽章 |
| 11 | `badge-11` | No | 實色強調徽章 |
| 12 | `badge-12` | No | 含計數徽章 |

**元件配置**

| 類型 | 名稱 | 型別 | 預設值 | 說明 |
|------|------|------|--------|------|
| Slot | `default` | `ng-content` | — | 徽章文字內容與可選的前置圖示或計數 |
| CSS | `--mat-sys-primary-container` | `color` | `#d7e3ff` | 主要徽章背景色 |
| CSS | `--mat-sys-tertiary-container` | `color` | `#e0e0ff` | 次要徽章背景色 |
| CSS | `--mat-sys-error-container` | `color` | `#ffdad6` | 錯誤/刪除徽章背景色 |

**應用場景**
- 表格或清單中的資料狀態標示（Active / Pending / Suspended）
- 導覽列的未讀訊息計數
- 卡片的分類標籤
- 新功能或 Beta 標記

**最佳實作**
- DO: 語意狀態使用 `aria-label` 明確表達
- DO: 計數徽章使用 `aria-live="polite"` 通知更新
- DONT: 僅用顏色區分狀態（色盲使用者無法辨識）
- DONT: 徽章過大搶走主要內容焦點

**Angular 21 整合建議**

徽章樣式透過 Angular Material 的 CSS custom properties 客製化。動態計數以 `signal<number>()` 管理，搭配 `@if (count() > 0)` 條件顯示。關閉按鈕透過 `output()` 通知父層移除。

---

### Components 子類別

---

#### 16. components

**功能解析**

通用元件集合，包含動畫複製按鈕、條列指標（Bar List）、大型按鈕、麵包屑導覽、分類篩選列、可拖曳元素、跑馬燈、進度環、終端機模擬器、狀態追蹤器與文字輪播等 11 種可獨立重複使用的小型 UI 元件。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `animated-copy-button` | 動畫複製按鈕 |
| 2 | `bar-list` | 條列指標 |
| 3 | `big-button` | 大型按鈕 |
| 4 | `breadcrumbs` | 麵包屑導覽 |
| 5 | `category-bar` | 分類篩選列 |
| 6 | `drag-elements` | 可拖曳元素 |
| 7 | `marquee` | 跑馬燈 |
| 8 | `progress-circle` | 進度環 |
| 9 | `terminal` | 終端機模擬器 |
| 10 | `tracker` | 狀態追蹤器 |
| 11 | `word-rotate` | 文字輪播 |

**元件配置**

各元件公開介面不同，需參閱個別原始碼。部分元件需要 `demoInputs`：

| 元件 | 必要 Input | 型別 |
|------|-----------|------|
| `bar-list` | `data` | `{ name: string; value: number }[]` |
| `category-bar` | `values` | `number[]` |
| `word-rotate` | `words` | `string[]` |
| `tracker` | `data` | `TrackerData` |
| `animated-copy-button` | `contentToCopy` | `string` |

**應用場景**
- 快速組合 dashboard widgets（進度環、條列指標、追蹤器）
- 動畫互動效果（複製按鈕、文字輪播、跑馬燈）
- 頁面階層導覽（麵包屑、分類篩選列）
- CLI / 程式碼展示（終端機模擬器）

**最佳實作**
- DO: 動畫元件尊重 `prefers-reduced-motion` 媒體查詢
- DO: 複製按鈕宣告 `aria-live="polite"` 區域通知複製結果
- DONT: 可拖曳元素無鍵盤操作替代方案
- DONT: 動畫效果過多分散使用者注意力

**Angular 21 整合建議**

需要 `input.required<T>()` 的元件在 Live Preview 中透過 `demoInputs` 物件注入。使用 Demo Wrapper 模式為需要 `ng-content` 的 headless 元件提供展示內容。進度環搭配 `role="progressbar"` 與 `aria-valuenow`。

---

#### 17. filterbar

**功能解析**

篩選列集合，提供基本篩選、多條件搜尋、日期區間、Chip 標籤、側邊抽屜、進階搜尋、含快速操作、緊湊型、含儲存條件、多選下拉、含分類標籤與全能型等 12 種篩選元件組合。適合放置於列表或表格上方。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `filterbar-1` | 基本篩選列 |
| 2 | `filterbar-2` | 多條件搜尋篩選 |
| 3 | `filterbar-3` | 日期區間篩選 |
| 4 | `filterbar-4` | Chip 標籤篩選 |
| 5 | `filterbar-5` | 側邊抽屜篩選 |
| 6 | `filterbar-6` | 含進階搜尋 |
| 7 | `filterbar-7` | 含快速操作 |
| 8 | `filterbar-8` | 緊湊篩選列 |
| 9 | `filterbar-9` | 含儲存條件 |
| 10 | `filterbar-10` | 多選下拉篩選 |
| 11 | `filterbar-11` | 含分類標籤 |
| 12 | `filterbar-12` | 全能型篩選列 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Input | `filterOptions` | `FilterOption[]` | 篩選條件選項清單 |
| Output | `filterChange` | `EventEmitter<FilterValue>` | 篩選條件變更事件 |

**應用場景**
- 表格/清單上方的多維度篩選（狀態、角色、日期區間）
- 報表頁面的分析維度切換
- 搜尋結果頁的 facet 細化
- 管理後台的即時資料範圍縮小

**最佳實作**
- DO: 篩選變更提供即時回饋（結果計數更新）
- DO: 提供「清除所有」按鈕
- DONT: 篩選結果為空時缺少 Empty State 提示
- DONT: 篩選條件過多擠壓在一行造成水平捲動

**Angular 21 整合建議**

篩選狀態以 `signal<FilterValue>()` 管理，每次變更觸發 `resource()` 重新載入資料。Chip 標籤使用 `MatChipListbox` 搭配 signal-based 雙向繫結。儲存條件功能透過 `localStorage` 持久化，使用 `effect()` 同步。

---

#### 18. status-monitoring

**功能解析**

系統狀態與健康儀表區塊，提供整體狀態一覽、含 uptime tracker、區域服務健康卡、事件時間線、多環境狀態、含訊息橫幅、資料流狀態卡、含當前事件、含延遲指標與含訂閱通知等 10 種版型。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `status-monitoring-1` | 整體狀態一覽 |
| 2 | `status-monitoring-2` | 含 uptime tracker |
| 3 | `status-monitoring-3` | 區域服務健康卡 |
| 4 | `status-monitoring-4` | 事件時間線 |
| 5 | `status-monitoring-5` | 多環境狀態 |
| 6 | `status-monitoring-6` | 含訊息橫幅 |
| 7 | `status-monitoring-7` | 資料流狀態卡 |
| 8 | `status-monitoring-8` | 含當前事件 |
| 9 | `status-monitoring-9` | 含延遲指標 |
| 10 | `status-monitoring-10` | 含訂閱通知 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 狀態監控內容區塊 |

**應用場景**
- 公開 Status Page（如 status.example.com）
- 內部維運儀表板的服務健康總覽
- 多區域/多環境的即時狀態呈現
- 事件歷史與事故後檢討時間線

**最佳實作**
- DO: 狀態變更使用 `aria-live` 即時通知
- DO: 顏色編碼搭配文字標籤（Operational / Degraded / Down）
- DONT: 僅靠顏色傳達服務狀態
- DONT: 缺少事件歷史或時間線

**Angular 21 整合建議**

服務狀態以 `resource()` 輪詢 API（搭配 `rxjs timer` + `toSignal()`）。uptime tracker 以 `signal<UptimeEntry[]>()` 管理 90 天或更長的歷史資料。事件時間線使用 `@for` 渲染，搭配 `track event.id`。

---

### Overlays

---

#### 19. dialogs

**功能解析**

對話框與確認彈窗集合，透過 `MatDialog.open()` 觸發，提供基礎確認、刪除工作區確認、資源轉移、建立工作區、邀請成員與新增應用程式等 6 種常見場景的高品質範例。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `dialog-1` | Yes | 基礎確認對話框 |
| 2 | `dialog-2` | No | 刪除工作區確認 |
| 3 | `dialog-3` | No | 資源轉移對話框 |
| 4 | `dialog-4` | No | 建立工作區 |
| 5 | `dialog-5` | No | 邀請成員 |
| 6 | `dialog-6` | No | 新增應用程式 |

**元件配置**

各 variant 透過 `MatDialog` 開啟，dialog 狀態與結果透過 `MatDialogRef.afterClosed()` 通訊。

**應用場景**
- 危險操作前的使用者明確確認（刪除、清除資料）
- 表單填寫流程（建立工作區、邀請成員）
- 資源選擇與轉移的聚焦操作
- 任何需要中斷主流程取得使用者輸入的場景

**最佳實作**
- DO: 確保 `role="dialog"` 與 `aria-modal="true"` 正確設定
- DO: 焦點在開啟時移入 dialog，關閉後回到觸發按鈕
- DONT: `autofocus` 設在危險操作按鈕（如「刪除」）上
- DONT: 未等待 `afterClosed()` 就執行後續操作

**Angular 21 整合建議**

Dialog 元件以 `inject(MatDialogRef)` 與 `inject(MAT_DIALOG_DATA)` 接收資料。表單使用 Reactive Forms，透過 `afterClosed()` observable 以 `toSignal()` 轉換為 signal 處理結果。

---

#### 20. flyout-menus

**功能解析**

彈出式選單集合，從觸發按鈕展開的下拉式內容區，提供基礎分類下拉、圖示輔助、頭像清單、卡片式快捷、預覽面板、統計數據、Tab 切換、多欄佈局與寬幅面板等 9 種版型。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `simple-flyout-menu` | Yes | 基礎分類下拉 |
| 2 | `flyout-menu-with-icons` | No | 圖示輔助項目 |
| 3 | `flyout-with-avatars` | No | 頭像清單 |
| 4 | `flyout-with-cards` | No | 卡片式快捷選單 |
| 5 | `flyout-with-preview` | No | 預覽面板 |
| 6 | `flyout-with-stats` | No | 統計數據 |
| 7 | `flyout-with-tabs` | No | Tab 切換內容 |
| 8 | `multi-column-flyout` | No | 多欄佈局 |
| 9 | `wide-flyout-menu` | No | 寬幅下拉面板 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 觸發按鈕與下拉面板內建於元件中 |

**應用場景**
- 主導覽列的次選單展開
- 帶頭像的快速切換使用者/團隊面板
- 含統計與預覽的豐富導覽面板
- 電商網站的分類巨型選單

**最佳實作**
- DO: 觸發按鈕宣告 `aria-haspopup="true"` 與 `aria-expanded`
- DO: ESC 鍵與點擊外部都能關閉面板
- DONT: 面板開啟後焦點未移入第一個可互動元素
- DONT: 行動裝置與桌機共用同一套模板

**Angular 21 整合建議**

面板開關以 `signal<boolean>()` 管理，搭配 `host` 物件中的 `(click)` 事件切換。使用 `CDK Overlay` 定位面板位置。Tab 切換以 `signal<number>()` 追蹤當前 tab index，搭配 `@switch` 渲染對應內容。

---

### Feedbacks

---

#### 21. empty-states

**功能解析**

空狀態畫面集合，當清單、搜尋結果或儀表板無內容時呈現友善提示。提供簡潔置中、帶 CTA 按鈕、含圖示與說明、卡片式、含資料列表佔位、搜尋無結果、權限受限提示、錯誤回退、初次造訪引導與多動作選項等 10 種版型。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `empty-state-1` | 簡潔置中 |
| 2 | `empty-state-2` | 帶 CTA 按鈕 |
| 3 | `empty-state-3` | 含圖示與說明 |
| 4 | `empty-state-4` | 卡片式佈局 |
| 5 | `empty-state-5` | 含資料列表佔位 |
| 6 | `empty-state-6` | 搜尋無結果 |
| 7 | `empty-state-7` | 權限受限提示 |
| 8 | `empty-state-8` | 錯誤回退畫面 |
| 9 | `empty-state-9` | 初次造訪引導 |
| 10 | `empty-state-10` | 多動作選項 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 可選的 CTA 按鈕或連結 |

**應用場景**
- 首次造訪空白的任務清單或儀表板
- 搜尋或篩選條件無符合結果
- 使用者權限不足無法存取資源
- API 呼叫失敗的 fallback 友善提示

**最佳實作**
- DO: 提供可行的引導行動（CTA 按鈕），不讓使用者停在空畫面
- DO: 裝飾性圖片設 `aria-hidden="true"`
- DONT: 訊息過於技術性（如「404 No data found」）
- DONT: 將空狀態與載入中狀態混用

**Angular 21 整合建議**

資料載入狀態以 `resource()` 的 `status()` signal 判斷。使用 `@if (resource.value()?.length === 0)` 條件顯示 Empty State。搭配 `@else` 渲染實際內容。

---

### Lists

---

#### 22. grid-lists

**功能解析**

網格式列表集合，適合展示視覺優先內容。提供基本圖片網格、含標題描述、卡片式、人物頭像、作品集、產品目錄、含 overlay、含標籤、整合清單、檔案管理、媒體庫、含動作按鈕、緊湊、含狀態指示器與混合尺寸等 15 種版型。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `grid-list-1` | Yes | 基本圖片網格 |
| 2-15 | `grid-list-2` ~ `grid-list-15` | No | 含標題描述 → 混合尺寸網格（14 種） |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 網格列表項目 |

**應用場景**
- 作品集與媒體庫展示
- 電商產品目錄
- 團隊成員卡片
- 檔案管理器縮圖瀏覽

**最佳實作**
- DO: 設定固定寬高比維持視覺一致性
- DO: 使用 `NgOptimizedImage` 優化圖片載入
- DONT: 過多欄位導致行動裝置每欄過窄
- DONT: 缺少 hover / focus 視覺回饋

**Angular 21 整合建議**

網格項目以 `@for (item of items(); track item.id)` 渲染。圖片使用 `NgOptimizedImage` 的 `priority` 與 `placeholder` 屬性。可點擊的網格項目透過 `routerLink` 導覽至詳情頁。

---

#### 23. lists

**功能解析**

清單元件集合，涵蓋入門任務、步驟式、進度追蹤、帶插圖、分類任務、互動式、完成度標記、多階段入門、活動動態加留言、社群投票、含留言區域與多類型項目混合等 13 種版型。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `onboarding-feed-1` | Yes | 入門任務清單 |
| 2 | `simple-with-icons` | Yes | 帶圖示的簡潔清單 |
| 3-8 | `onboarding-feed-2` ~ `onboarding-feed-8` | No | 步驟式 → 多階段入門清單 |
| 9 | `feed-with-comments-01` | No | 活動動態加留言 |
| 10 | `feed-with-upvote-01` | No | 社群投票動態列表 |
| 11 | `with-comments` | No | 含留言區域的清單 |
| 12 | `with-multiple-item-types` | No | 多類型項目混合清單 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 清單內容區塊 |

**應用場景**
- 新使用者引導任務清單
- 活動動態流（通知、留言、系統事件）
- 社群互動列表（按讚、投票、討論串）
- 多類型資料混合展示

**最佳實作**
- DO: 以 `<ul>` / `<ol>` 或 `role="list"` 包裹清單
- DO: 大量資料使用 CDK Virtual Scroll
- DONT: 項目高度差異過大降低可掃描性
- DONT: 分頁邏輯錯誤造成重複載入

**Angular 21 整合建議**

清單資料以 `resource()` 分頁載入。項目狀態以 `signal()` 追蹤（已完成 / 進行中 / 待完成）。虛擬滾動搭配 `cdk-virtual-scroll-viewport` 維持 `aria-setsize` 與 `aria-posinset`。

---

#### 24. stacked-lists

**功能解析**

堆疊式列表集合，適合呈現多行內容的資料列表。提供基本堆疊、滿版限制寬度、滿版含連結、窄版、窄版含動作、窄版含標籤、窄版含小型頭像、分組固定標題、標籤與動作選單、行內連結與選單、可點擊、含群組頭像與卡片包裝等 13 種版型。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `simple` | Yes | 基本堆疊列表 |
| 2-13 | 見上方清單 | No | 滿版/窄版/含動作/含標籤等 12 種變體 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 使用者、團隊、訊息或任意可縱向堆疊的項目列表 |

**應用場景**
- 團隊成員名單與角色資訊
- 通知中心或活動動態
- 設定頁面的可點擊選項清單
- 行動裝置友善的資料列表

**最佳實作**
- DO: 可點擊整行時提供明確 hover / focus 視覺回饋
- DO: 行內動作按鈕至少 44px 寬高
- DONT: 每個列項資訊密度過高
- DONT: 固定標題在行動裝置縮放時計算錯誤

**Angular 21 整合建議**

列表項目透過 `@for` 渲染。行內動作透過 `output()` 通知父層處理。分組固定標題使用 CSS `position: sticky`。

---

#### 25. tables

**功能解析**

表格集合，涵蓋基本排版、含頭像多行、方案比較、緊湊內容、GitHub API 即時查詢、篩選加下拉、滿版頭像、滿版基本、分組列、可隱藏欄位、隱藏標題行、卡片式、堆疊欄位、固定表頭、斑馬紋、含小計列、表格加圖表與垂直分隔線等 18 種版型。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `simple-table` | Yes | 基本表格 |
| 2 | `avatars-multi-line-table` | No | 含頭像多行表格 |
| 3 | `comparision-table` | No | 方案比較表 |
| 4 | `condensed-content-table` | No | 緊湊內容表格 |
| 5 | `filter-http-data-source-table` | No | GitHub API 即時查詢 |
| 6 | `filter-select-table` | No | 篩選加下拉選擇 |
| 7 | `full-width-avatar-table` | No | 滿版頭像表格 |
| 8 | `full-width-table` | No | 滿版基本表格 |
| 9 | `grouped-rows-table` | No | 分組列表格 |
| 10 | `hidden-columns-table` | No | 可隱藏欄位表格 |
| 11 | `hidden-headings-table` | No | 隱藏標題行表格 |
| 12 | `simple-card-table` | No | 卡片式表格 |
| 13 | `stacked-columns-table` | No | 堆疊欄位表格 |
| 14 | `sticky-header-table` | No | 固定表頭表格 |
| 15 | `striped-rows-table` | No | 斑馬紋表格 |
| 16 | `summary-rows-table` | No | 含小計列表格 |
| 17 | `table-with-chart` | No | 表格加圖表 |
| 18 | `vertical-lines-table` | No | 垂直分隔線表格 |

**元件配置**

| 類型 | 名稱 | 型別 | 預設值 | 說明 |
|------|------|------|--------|------|
| Input | `dataSource` | `MatTableDataSource<T> \| T[]` | 內建示範資料 | 表格資料來源 |
| Input | `displayedColumns` | `string[]` | 對應示範資料的欄位 | 顯示欄位的 key 陣列 |

**應用場景**
- 使用者管理列表（篩選、排序、分頁）
- 訂單明細與交易紀錄
- 方案功能比較表
- 報表資料呈現

**最佳實作**
- DO: 表格提供 `<caption>` 或 `aria-labelledby` 描述內容
- DO: 可排序欄位使用 `mat-sort-header` 搭配 `aria-sort`
- DONT: 一次載入所有資料不分頁
- DONT: 欄位寬度未設定 `min-width`

**Angular 21 整合建議**

使用 `MatTableDataSource` 搭配 `MatSort` 與 `MatPaginator`。HTTP 資料源以 `resource()` 載入。篩選條件以 `signal()` 管理，透過 `effect()` 同步到 `dataSource.filter`。

---

### Application Shells

---

#### 26. multi-column

**功能解析**

多欄式應用殼，提供主內容區與側邊欄的彈性版型。包含全寬三欄、受限三欄、受限含黏性欄、全寬右側次要欄、全寬含窄側邊欄與全寬含窄側邊欄 Header 等 6 種版型。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `full-width-three-column` | Yes | 全寬三欄 |
| 2 | `constrained-three-column` | No | 受限三欄 |
| 3 | `constrained-with-sticky-columns` | No | 受限含黏性欄 |
| 4 | `full-width-secondary-right` | No | 全寬右側次要欄 |
| 5 | `full-width-with-narrow-sidebar` | No | 全寬含窄側邊欄 |
| 6 | `full-width-with-narrow-sidebar-header` | No | 全寬含窄側邊欄 Header |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 頁面主要內容區塊 |

**應用場景**
- Dashboard 主介面（主內容 + 側邊欄）
- 文件閱讀器（目錄側欄 + 內容 + 大綱）
- 複雜後台的多面板並排
- 設定頁面（選單側欄 + 設定內容）

**最佳實作**
- DO: 響應式折疊時確認側欄正確隱藏
- DO: 使用 `<aside>` / `role="complementary"` 標識側欄
- DONT: 黏性欄位的父容器設 `overflow: hidden`（會使 sticky 失效）
- DONT: Multi-column 內再嵌套另一個 Multi-column

**Angular 21 整合建議**

側欄收合狀態以 `signal<boolean>()` 管理，搭配 `host` 物件中的 `[class.collapsed]` 繫結。Skip Link 使用 `<a href="#main-content">` 讓鍵盤使用者跳過側欄。子路由透過 `<router-outlet>` 渲染於主內容區。

---

#### 27. page-shells

**功能解析**

基礎頁面外殼，提供標準的內容寬度與邊距，適合作為大部分頁面的最外層容器。包含基礎中央容器、含側邊欄、含浮動 Header、Tab 切換式、多欄式內容與 Sticky Footer 等 6 種版型。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `page-shell-1` | Yes | 基礎中央容器 |
| 2 | `page-shell-2` | No | 含側邊欄 |
| 3 | `page-shell-3` | No | 含浮動 Header |
| 4 | `page-shell-4` | No | Tab 切換式 |
| 5 | `page-shell-5` | No | 多欄式內容 |
| 6 | `page-shell-6` | No | Sticky Footer |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 頁面主要內容區塊 |

**應用場景**
- 大部分應用頁面的最外層容器
- 提供一致的最大寬度與水平邊距
- Tab 切換式適合多頁籤設定頁面
- Sticky Footer 適合需要固定底部操作列的頁面

**最佳實作**
- DO: Page Shell 內放置正確的 landmark（`<main>` / `<nav>` / `<footer>`）
- DO: Sticky Footer 確認頁面 `min-height: 100vh`
- DONT: Page Shell 內再嵌套另一個 Page Shell
- DONT: 需要多欄編輯器時（改用 Multi-column）

**Angular 21 整合建議**

Page Shell 作為路由的外層 wrapper，在 `app.routes.ts` 中作為 layout component 使用 `loadComponent`。Tab 切換以 `signal<number>()` 追蹤 active tab，搭配 `@switch` 渲染內容。

---

#### 28. stacked-layouts

**功能解析**

帶有頂部導覽列的堆疊式應用殼。提供基礎頂部導覽 + 頁首、品牌導覽 + 重疊內容區、品牌導覽 + 頁首、品牌導覽 + 緊湊頁首、緊湊頁首導覽、灰色背景導覽、底線導覽列、導覽列 + 重疊內容區與雙列導覽 + 重疊內容區等 9 種版型。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `nav-with-page-header` | Yes | 基礎頂部導覽 + 頁首 |
| 2-9 | 見上方清單 | No | 品牌/緊湊/灰底/底線/重疊等 8 種變體 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 頁面主要內容區塊 |

**應用場景**
- 後台 dashboard 主畫面（固定頂部導覽列）
- 品牌識別突出的單欄頁面
- 內容深度較淺的資料瀏覽頁面
- 重疊（overlap）變體製造視覺層次感

**最佳實作**
- DO: 導覽區塊使用 `<nav aria-label="主要導覽">`
- DO: 目前頁面連結設定 `aria-current="page"`
- DONT: 行動裝置未收合導覽列（需實作 hamburger menu）
- DONT: 未標示 active link

**Angular 21 整合建議**

導覽狀態以 `inject(Router)` 的 `events` observable 轉為 signal 追蹤當前路由。行動裝置的 hamburger menu 以 `signal<boolean>()` 控制開合。品牌標誌使用 `NgOptimizedImage`。

---

#### 29. sidebars

**功能解析**

側邊欄導覽列元件，為本專案自行開發（非 ngm-dev-blocks vendor），基於 Angular Material `MatSidenav` 封裝。提供基本固定、可收合、分組式、含徽章與計數、迷你模式（僅圖示）與巢狀可展開等 6 種變體。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `sidebar-1` | Yes | 基本固定側邊欄 |
| 2 | `sidebar-2` | Yes | 可收合側邊欄 |
| 3 | `sidebar-3` | Yes | 分組式導覽 |
| 4 | `sidebar-4` | Yes | 含徽章與計數 |
| 5 | `sidebar-5` | Yes | 迷你模式（僅圖示） |
| 6 | `sidebar-6` | Yes | 巢狀可展開 |

**元件配置**

| 類型 | 名稱 | 型別 | 預設值 | 說明 |
|------|------|------|--------|------|
| Input | `collapsed` | `boolean` | `false` | 是否收合側邊欄 |
| Input | `width` | `string` | `'240px'` | 展開時的側邊欄寬度 |

**應用場景**
- 管理後台的主要導覽結構
- 多層級選單的深層導覽
- 迷你模式節省水平空間
- 含未讀計數的通知入口

**最佳實作**
- DO: 收合時保留 tooltip 顯示選項名稱
- DO: 巢狀展開使用 `aria-expanded` 與 `aria-controls`
- DONT: 超過 3 層巢狀（應扁平化選單結構）
- DONT: 收合後未設 `aria-hidden` 移除不可見內容

**Angular 21 整合建議**

收合狀態以 `signal<boolean>()` 管理，透過 `model()` 實現雙向繫結。使用 `routerLinkActive` 搭配 `ariaCurrentWhenActive="page"` 標示目前頁面。徽章計數以 `signal<number>()` 追蹤未讀數量。

---

### Headings

---

#### 30. page-headings

**功能解析**

頁面頂部標題列，包含麵包屑、標題、副標題、Meta 圖示與動作按鈕。提供 13 種變體，涵蓋基礎標題、精簡版、帶背景色、麵包屑搭配、個人資料頁 Banner + 頭像、Filter Toggle、Logo + 公司名稱等多種情境。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `page-heading-1` | Yes | 標題 + Meta 圖示 + 動作按鈕，含行動版 Menu |
| 2 | `page-heading-2` | No | 標題 + 動作按鈕（精簡版） |
| 3 | `page-heading-3` | No | 標題 + 動作按鈕 + Primary Container 背景 |
| 4 | `page-heading-4` | No | 麵包屑 + 標題 + 動作按鈕 |
| 5 | `page-heading-5` | No | 麵包屑 + 標題 + 動作按鈕 + Primary Container 背景 |
| 6 | `page-heading-6` | No | 標題 + Meta 圖示 + 動作按鈕 + Primary Container 背景 |
| 7 | `page-heading-7` | No | Banner 圖片 + 頭像（個人資料頁） |
| 8 | `page-heading-8` | No | 頭像 + 使用者資訊 + 動作按鈕 |
| 9 | `page-heading-9` | No | 頭像 + 使用者資訊，Card 樣式 |
| 10 | `page-heading-10` | No | 麵包屑 + 標題 + Meta 圖示 + 動作按鈕 |
| 11 | `page-heading-11` | No | 麵包屑 + 標題 + Meta 圖示 + Primary Container 背景 |
| 12 | `page-heading-12` | No | 標題 + Filter Toggle 群組（Dashboard 式） |
| 13 | `page-heading-13` | No | Logo + 公司名稱 + Meta 資訊 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 純展示元件，資料以內部屬性呈現 |

**應用場景**
- 每個主要頁面頂端的身份識別
- 集中管理主要操作（新增、發佈、匯出）
- 深層路徑的麵包屑導覽（超過兩層）
- 個人資料頁的 Banner + 頭像呈現

**最佳實作**
- DO: 頁面標題使用 `<h1>`，保持唯一且連續的標題層級
- DO: 動作區最多 3 個主要按鈕，額外移至下拉 Menu
- DONT: Icon-only 按鈕未補上 `aria-label`
- DONT: 麵包屑的 `href` 與實際路由不同步

**Angular 21 整合建議**

麵包屑以 `inject(Router)` 動態生成，搭配 `computed()` 從 route data 衍生路徑。動作按鈕事件透過 `output()` 通知父層。Filter Toggle 以 `signal<string>()` 追蹤目前選中的篩選項。

---

#### 31. section-headings

**功能解析**

區段標題，用於將頁面內容分組為清楚可掃描的章節。提供基礎底線標題、含描述文字、含操作按鈕、含徽章標籤、含搜尋列、含圖示、含麵包屑導航、含頁籤切換、含統計數字與含頭像與操作等 10 種變體。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `section-heading-1` | 基礎底線標題 |
| 2 | `section-heading-2` | 含描述文字 |
| 3 | `section-heading-3` | 含操作按鈕 |
| 4 | `section-heading-4` | 含徽章標籤 |
| 5 | `section-heading-5` | 含搜尋列 |
| 6 | `section-heading-6` | 含圖示 |
| 7 | `section-heading-7` | 含麵包屑導航 |
| 8 | `section-heading-8` | 含頁籤切換 |
| 9 | `section-heading-9` | 含統計數字 |
| 10 | `section-heading-10` | 含頭像與操作 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `title` | `string (hardcoded)` | 區段標題文字 |
| Slot | `actions` | `ng-content[slot="actions"]` | 操作按鈕的具名內容插槽 |

**應用場景**
- 長頁面的內容分組（設定頁、表單分組）
- 儀表板區塊的清楚區隔
- 搭配操作按鈕的區段快速動作
- 含搜尋列的區段內搜尋

**最佳實作**
- DO: 使用真實的 `<h2>` / `<h3>` 語意 heading 元素
- DO: 搭配操作按鈕時設置 `flex-wrap` 防止小螢幕溢出
- DONT: heading 階層跳級（如從 h2 直接跳到 h4）
- DONT: 區段標題視覺權重過大蓋過內容

**Angular 21 整合建議**

標題文字以 `input<string>()` 傳入。操作按鈕透過 `ng-content` 的 `select` 投影。含搜尋列的變體以 `output<string>()` 發送搜尋關鍵字。

---

## MARKETING 類別 (14 項)

### Marketing Elements

---

#### 32. banners

**功能解析**

公告與通知橫幅，用於頁面頂部呈現重要訊息。提供公告橫幅、升級提示、入門導覽、Cookie 同意與系統通知等 5 種版型。適用於系統公告、付費升級提示、新功能上架與 GDPR Cookie 聲明。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `banner-1` | 公告橫幅 |
| 2 | `banner-2` | 升級提示 |
| 3 | `banner-3` | 入門導覽 |
| 4 | `banner-4` | Cookie 同意 |
| 5 | `banner-5` | 系統通知 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 橫幅內容區塊 |

**應用場景**
- 服務維護、版本更新公告
- 付費升級行銷橫幅
- Cookie 同意聲明（GDPR 合規）
- 低優先警告與系統通知

**最佳實作**
- DO: 非緊急公告使用 `role="region"` + `aria-label`；緊急通知使用 `role="alert"`
- DO: 提供 dismiss（關閉）機制
- DONT: 同時顯示多個橫幅（造成視覺噪音）
- DONT: 訊息文字過長壓縮頁面主要內容

**Angular 21 整合建議**

Banner 可見狀態以 `signal<boolean>(true)` 管理。關閉後透過 `effect()` 同步到 `localStorage` 避免重複顯示。Cookie 同意以 `output()` 通知父層使用者偏好。

---

### Page Sections

---

#### 33. bento-grids

**功能解析**

便當盒風格的不對稱網格區塊，以大小錯落的格子同時展示多個產品特色與視覺素材。提供經典便當盒、大小錯落特色格、產品截圖拼貼、中央主格周邊副格、深色玻璃擬態風與圖示加說明矩陣等 6 種版型。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `bento-grid-1` | 經典便當盒佈局 |
| 2 | `bento-grid-2` | 大小錯落特色格 |
| 3 | `bento-grid-3` | 產品截圖拼貼 |
| 4 | `bento-grid-4` | 中央主格周邊副格 |
| 5 | `bento-grid-5` | 深色玻璃擬態風 |
| 6 | `bento-grid-6` | 圖示加說明矩陣 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 便當盒網格內容 |

**應用場景**
- 產品著陸頁的多特色視覺化拼貼
- 品牌作品集的主次層級展示
- 功能總覽頁整合圖像、文字與互動元件
- 高識別度的行銷活動頁面

**最佳實作**
- DO: CSS Grid 視覺順序與 DOM 順序一致
- DO: 行動裝置重新排列為單欄
- DONT: 格子尺寸差異過大導致主次混亂
- DONT: 過度使用動畫或玻璃擬態犧牲效能

**Angular 21 整合建議**

使用 CSS Grid 搭配 `grid-template-areas` 定義便當盒佈局。每個格子以獨立元件封裝，透過 `@for` 動態渲染。使用 `@media` 斷點在行動裝置改為單欄。

---

#### 34. blog-sections

**功能解析**

部落格與文章列表區塊，用於內容行銷網站展示最新文章。提供三欄文章卡片、圖文左右並排、精選文章 Banner、雙欄縮圖列表、四欄精簡卡片、主圖加文章列表、分類標籤瀏覽、雜誌風瀑布流、作者導覽列表與時間軸文章流等 10 種版型。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `blog-section-1` | Yes | 三欄文章卡片 |
| 2-10 | `blog-section-2` ~ `blog-section-10` | No | 圖文並排 → 時間軸文章流（9 種） |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 部落格區塊內容 |

**應用場景**
- 內容行銷網站首頁展示最新文章
- 部落格首頁依分類或時間軸組織文章
- 產品頁底部展示相關技術文章
- 企業官網新聞區

**最佳實作**
- DO: 使用 `<article>` 與 `<time datetime="...">` 提供語意結構
- DO: 縮圖使用 `NgOptimizedImage` 避免版面位移
- DONT: 文章縮圖尺寸不一致
- DONT: 缺少分頁或載入更多機制

**Angular 21 整合建議**

文章資料以 `resource()` 分頁載入。分類篩選以 `signal<string>()` 追蹤。使用 `@for (article of articles(); track article.id)` 渲染文章卡片。搭配 SSG prerendering 提升 SEO。

---

#### 35. contact-sections

**功能解析**

聯絡我們區塊集合，提供基礎聯絡表單、圖文左右並排、含地圖嵌入、多分店資訊卡、客服管道列表、部門分類聯絡、全幅背景表單、預約諮詢式表單、FAQ + 表單與卡片化聯絡資訊等 10 種版型。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `contact-section-1` | Yes | 基礎聯絡表單 |
| 2-10 | `contact-section-2` ~ `contact-section-10` | No | 圖文並排 → 卡片化聯絡資訊（9 種） |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 聯絡區塊內容 |

**應用場景**
- 企業官網的完整聯絡資訊頁
- 產品落地頁的諮詢入口
- 多分店業態的各據點聯絡方式
- FAQ + 聯絡表單的問題分流

**最佳實作**
- DO: 電話與 Email 使用 `tel:` 與 `mailto:` 連結
- DO: 地圖嵌入提供 `title` 屬性與文字版地址 fallback
- DONT: 必填欄位過多造成放棄率上升
- DONT: 地圖未做延遲載入影響首屏效能

**Angular 21 整合建議**

聯絡表單使用 Reactive Forms。表單送出狀態以 `signal<'idle' | 'submitting' | 'success' | 'error'>()` 管理。地圖嵌入使用 `@defer (on viewport)` 延遲載入。防垃圾訊息整合 reCAPTCHA。

---

#### 36. cta-sections

**功能解析**

行銷頁面行動呼籲區塊，以強烈視覺對比與明確按鈕引導使用者完成轉換。提供置中標題雙按鈕、深色強調、左文右按鈕、漸層背景、訂閱表單嵌入、雙欄圖文、大型按鈕、含使用者見證、應用商店下載、倒數計時促銷、整合圖示亮點、卡片式、全幅圖像背景、多步驟引導入口、試用與聯繫雙路徑與緊湊型轉換橫條等 16 種版型。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1-16 | `cta-section-1` ~ `cta-section-16` | 置中雙按鈕 → 緊湊型轉換橫條（16 種） |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 行動呼籲內容 |

**應用場景**
- 行銷頁面結尾的轉換引導
- 功能介紹後的註冊/試用轉換
- 電子報訂閱的表單嵌入
- 限時優惠的倒數計時促銷

**最佳實作**
- DO: 主按鈕使用明確動詞（「開始免費試用」而非「了解更多」）
- DO: 主按鈕與次按鈕視覺強度有明確優先層級
- DONT: 同時放置過多 CTA 按鈕
- DONT: 表單欄位過多提高填寫門檻

**Angular 21 整合建議**

倒數計時以 `signal()` 管理剩餘秒數，搭配 `effect()` 的 `setInterval` 定時更新。訂閱表單使用 Signal Forms。按鈕載入狀態以 `signal<boolean>()` 控制 `aria-busy`。

---

#### 37. fancy

**功能解析**

富有視覺敘事與動畫效果的互動區塊集合。目前提供記憶相簿與文字相簿兩種版型，適用於品牌故事、作品集、紀念性網站與創意行銷落地頁。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `memory-album` | Yes | 記憶相簿 — 照片牆 + 動畫過場 |
| 2 | `words-album` | Yes | 文字相簿 — 文字視覺敘事 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 互動式視覺區塊內容 |

**應用場景**
- 個人作品集或品牌故事頁
- 紀念性網站（婚禮、活動回顧）
- 創意行銷活動落地頁
- 展覽介紹網站

**最佳實作**
- DO: 尊重 `@media (prefers-reduced-motion: reduce)` 提供靜態 fallback
- DO: 主要敘事內容以語意化文字呈現，確保螢幕閱讀器可讀
- DONT: 動畫過長或無法跳過
- DONT: 圖片未壓縮或未使用 WebP

**Angular 21 整合建議**

動畫狀態以 `signal()` 管理。使用 `afterRenderEffect()` 在 DOM 就緒後初始化動畫。圖片壓縮搭配 `NgOptimizedImage`。`prefers-reduced-motion` 偵測以 `matchMedia` + `toSignal()` 轉為 signal。

---

#### 38. feature-sections

**功能解析**

產品特色展示區塊，以多種版面呈現產品功能與差異化價值。提供三欄圖示、左圖右文交錯、卡片式清單、帶數字編號、圖示加說明網格、截圖功能展示、雙欄對比、階梯式、圖示橫向、大型截圖、圖文交錯多段、圓形圖示卡片、深色主題、邊框圖示列表、浮動資訊卡片、整合品牌標誌、互動式分頁、影片預覽嵌入、圖示加連結與大型網格矩陣等 20 種版型。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1-20 | `feature-section-1` ~ `feature-section-20` | 三欄圖示 → 大型網格特色矩陣（20 種） |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 產品特色內容區塊 |

**應用場景**
- 產品著陸頁條列展示核心特色
- 功能介紹頁搭配截圖說明
- 版本更新公告列出新功能
- B2B 解決方案的功能矩陣

**最佳實作**
- DO: 特色項目控制在 3-6 個，建立主次優先層級
- DO: 裝飾性圖示加上 `aria-hidden="true"`
- DONT: 圖示風格不一致（線性與填充混用）
- DONT: 每個特色文字長度差異過大

**Angular 21 整合建議**

特色資料以 `signal<Feature[]>()` 管理，透過 `@for` 渲染。互動式分頁以 `signal<number>()` 追蹤 active tab。影片預覽使用 `@defer (on viewport)` 延遲載入。

---

#### 39. header-sections

**功能解析**

行銷網站頁首導覽列，整合品牌識別、主選單、搜尋與 CTA 按鈕。提供經典導覽列、含搜尋、中央 Logo 雙側選單、透明覆蓋英雄區、含登入按鈕與多層下拉巨型選單等 6 種版型。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `header-section-1` | 經典導覽列 |
| 2 | `header-section-2` | 含搜尋的導覽 |
| 3 | `header-section-3` | 中央 LOGO 雙側選單 |
| 4 | `header-section-4` | 透明覆蓋英雄區 |
| 5 | `header-section-5` | 含登入按鈕導覽 |
| 6 | `header-section-6` | 多層下拉巨型選單 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 頁首導覽列內容 |

**應用場景**
- 行銷網站全站頁首
- 產品著陸頁搭配登入/註冊按鈕
- 複雜資訊架構的 Mega Menu
- 行動裝置的漢堡選單收合

**最佳實作**
- DO: 使用 `<nav aria-label="主要導覽">` 標識區域
- DO: 提供「跳至主要內容」的隱形快速連結
- DONT: 導覽項目超過 7 項
- DONT: 行動版未提供漢堡選單收合

**Angular 21 整合建議**

選單開合以 `signal<boolean>()` 管理。當前頁面以 `routerLinkActive` 搭配 `ariaCurrentWhenActive` 標示。下拉選單使用 `CDK Overlay` 定位。行動裝置偵測以 `BreakpointObserver` + `toSignal()` 切換呈現方式。

---

#### 40. hero-sections

**功能解析**

行銷頁面首屏英雄區，是傳達產品核心價值與引導轉換的關鍵版位。提供左文右圖、置中標題雙按鈕、漸層背景、全幅圖像背景、影片背景、訂閱表單嵌入、產品截圖展示、多欄特色預覽與大型行動呼籲等 9 種版型。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `hero-section-1` | 左文右圖英雄區 |
| 2 | `hero-section-2` | 置中標題與雙按鈕 |
| 3 | `hero-section-3` | 漸層背景強調 |
| 4 | `hero-section-4` | 全幅圖像背景 |
| 5 | `hero-section-5` | 影片背景沉浸式 |
| 6 | `hero-section-6` | 訂閱表單嵌入 |
| 7 | `hero-section-7` | 產品截圖展示 |
| 8 | `hero-section-8` | 多欄特色預覽 |
| 9 | `hero-section-9` | 大型行動呼籲 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 英雄區主要內容 |

**應用場景**
- 行銷網站首頁第一屏
- 產品著陸頁搭配主要 CTA
- 活動專屬頁面的強視覺記憶點
- 版本發佈頁突顯新功能

**最佳實作**
- DO: 主標題使用 `<h1>`，每頁僅一個
- DO: 背景圖使用 CSS background（裝飾性）；CTA 文字明確可見
- DONT: 使用過大的背景圖影響 LCP
- DONT: 同時放置過多 CTA 分散注意力

**Angular 21 整合建議**

影片背景使用 `@defer (on viewport)` 延遲載入。背景圖使用 `NgOptimizedImage` 的 `priority` 屬性優先載入。訂閱表單使用 Signal Forms。搭配 SSG prerendering 最佳化首屏 LCP。

---

#### 41. kpi-cards

**功能解析**

關鍵績效指標卡片集合，提供 29 種版型，是所有目錄項目中變體最多的類別。涵蓋單一指標、趨勢箭頭、比較差值、小型走勢圖、進度條、圖示強調、目標達成率、區段色塊、日期範圍、輔助資訊列、多指標對比、長條圖、面積走勢、環狀圖、分類標籤、多列概覽、操作按鈕、上下分區、背景漸層、迷你柱狀圖、前期比較、圖示分區、多維度標籤、說明註解、明暗對比、徽章標記、下鑽連結、多期切換與豐富資訊面板。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1-29 | `kpi-card-01` ~ `kpi-card-29` | 單一指標 → 豐富資訊面板（29 種） |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | KPI 卡片內容區塊 |

**應用場景**
- 儀表板概覽的業務關鍵指標
- 管理後台首頁的重要績效數字
- 行銷著陸頁的成效數據展示
- 即時監控面板的線上指標

**最佳實作**
- DO: 趨勢方向搭配文字（「上升 12.3%」），不僅靠顏色或箭頭
- DO: 每張卡片以 `role="group"` 包裝並提供 `aria-label`
- DONT: 超過 12 個指標同時呈現
- DONT: 百分比與絕對值混用未標示單位

**Angular 21 整合建議**

KPI 資料以 `resource()` 載入。趨勢方向以 `computed()` 從當期與前期值衍生。數值更新時使用 `aria-live="polite"` 播報。多期切換以 `linkedSignal()` 管理。

---

#### 42. newsletter-sections

**功能解析**

電子報訂閱區塊集合，用於收集訪客 Email 建立訂閱名單。提供簡約訂閱橫幅、雙欄訂閱表單、圖文並排、卡片式、全幅背景與緊湊型嵌入等 6 種版型。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `newsletter-section-1` | 簡約訂閱橫幅 |
| 2 | `newsletter-section-2` | 雙欄訂閱表單 |
| 3 | `newsletter-section-3` | 圖文並排訂閱 |
| 4 | `newsletter-section-4` | 卡片式訂閱區 |
| 5 | `newsletter-section-5` | 全幅背景訂閱 |
| 6 | `newsletter-section-6` | 緊湊型嵌入訂閱 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 電子報訂閱區塊內容 |

**應用場景**
- 部落格或內容網站的訂閱入口
- 電商發送優惠資訊的 Email 收集
- SaaS 產品的產品更新訂閱
- 活動前的 Lead 名單蒐集

**最佳實作**
- DO: Email 輸入框使用 `type="email"` 搭配 `<label>`
- DO: 顯示隱私權政策連結（GDPR 合規）
- DONT: 欄位過多（僅需 Email）
- DONT: 送出後無明確成功/失敗回饋

**Angular 21 整合建議**

訂閱表單使用 Signal Forms 或 Template-driven Forms（僅一個 Email 欄位）。送出狀態以 `signal<'idle' | 'submitting' | 'success' | 'error'>()` 管理。成功狀態透過 `aria-live` 宣告。

---

#### 43. pricing-sections

**功能解析**

價格方案區塊集合，提供 SaaS 訂閱方案比較、月年切換、功能矩陣表、推薦方案突顯、企業客製、卡片帶 FAQ、用量計費滑桿、簡潔水平排版、多維度比較表、漸層強調、緊湊摘要型、含試用條款、模組化加購、區域貨幣切換與高對比深色版等 16 種版型。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `pricing-section-1` | Yes | 三方案比較 |
| 2-16 | `pricing-section-2` ~ `pricing-section-16` | No | 雙方案對照 → 高對比深色版（15 種） |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 價格方案區塊內容 |

**應用場景**
- SaaS 產品的訂閱方案選擇頁
- 月付/年付切換引導高價值方案
- 功能矩陣比較表
- 企業 B2B 的客製方案入口

**最佳實作**
- DO: 推薦方案使用 `aria-label="推薦方案"` 而非僅靠顏色
- DO: 月年切換器使用 `role="switch"` 搭配 `aria-checked`
- DONT: 方案超過 4 個造成決策疲勞
- DONT: 隱藏關鍵限制（用量上限、額外費用）

**Angular 21 整合建議**

月年切換以 `signal<'monthly' | 'yearly'>()` 管理，價格以 `computed()` 動態計算。推薦方案以 `@if` 條件添加視覺標記。功能矩陣使用 `<table>` 搭配 `<th scope>`。

---

#### 44. stats-sections

**功能解析**

行銷數據展示區塊，以大型數字、百分比與圖示呈現產品成果。提供三欄基本數據、深色強調數字、圖示加數據卡片、大型主數字搭配說明、圖文混合成果展示、漸層背景、趨勢百分比強調、多欄關鍵指標與整合 CTA 數據區等 9 種版型。

**變體列表**

| # | Variant ID | Free | 說明 |
|---|-----------|------|------|
| 1 | `stats-section-1` | Yes | 三欄基本數據 |
| 2 | `stats-section-2` | Yes | 深色強調數字 |
| 3 | `stats-section-3` | Yes | 圖示加數據卡片 |
| 4-9 | `stats-section-4` ~ `stats-section-9` | No | 大型主數字 → 整合 CTA（6 種） |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 數據統計內容 |

**應用場景**
- 行銷頁面的成果數字展示
- 關於我們頁面的公司規模
- 案例研究的量化效益
- 招募頁面的團隊規模數字

**最佳實作**
- DO: 提供完整文字版本（「服務超過 10,000 名使用者」而非僅「10K+」）
- DO: 若使用動畫計數器，需提供 `prefers-reduced-motion` 替代
- DONT: 使用假數據或來源不明的統計
- DONT: 過度堆疊指標（超過 6 項）

**Angular 21 整合建議**

靜態數字直接硬編碼或以 `input<string>()` 傳入。動畫計數器使用 `afterRenderEffect()` 驅動。搭配 SSG prerendering 確保 SEO 可索引。

---

#### 45. testimonial-sections

**功能解析**

客戶見證區塊集合，用於強化社會證明與品牌信任度。提供三欄客戶見證、卡片瀑布流、焦點引言、評分總覽、影音見證輪播、品牌標誌牆、兩欄推薦組合與滑動式評論等 8 種版型。

**變體列表**

| # | Variant ID | 說明 |
|---|-----------|------|
| 1 | `testimonial-section-1` | 三欄客戶見證 |
| 2 | `testimonial-section-2` | 卡片瀑布流 |
| 3 | `testimonial-section-3` | 焦點引言 |
| 4 | `testimonial-section-4` | 評分總覽 |
| 5 | `testimonial-section-5` | 影音見證輪播 |
| 6 | `testimonial-section-6` | 品牌標誌牆 |
| 7 | `testimonial-section-7` | 兩欄推薦組合 |
| 8 | `testimonial-section-8` | 滑動式評論 |

**元件配置**

| 類型 | 名稱 | 型別 | 說明 |
|------|------|------|------|
| Slot | `default` | `ng-content` | 見證內容區塊 |

**應用場景**
- 產品落地頁的社會證明
- 價格頁附近降低成交阻力
- 品牌標誌牆展示企業客戶
- 影音見證引導深度了解

**最佳實作**
- DO: 評分星級使用 `aria-label`（「5 顆星，滿分 5 顆」）
- DO: 輪播提供暫停按鈕並支援鍵盤左右鍵
- DONT: 使用假評論或機器生成見證
- DONT: 輪播自動播放速度過快

**Angular 21 整合建議**

見證資料以 `signal<Testimonial[]>()` 管理。輪播以 `signal<number>()` 追蹤 active index，搭配 `setInterval` 自動播放。暫停按鈕以 `signal<boolean>()` 控制。影音見證使用 `@defer (on viewport)` 延遲載入。

---

## 共用元件架構

### CatalogPage

```
selector: app-catalog-page
```

目錄頁面的外層殼層元件，接收 `CatalogBlockMeta` 作為 `input.required()`。自動計算 prev/next 導覽按鈕，並透過 `ng-content` 的 `slot` 屬性分配 preview、code、api 與 best-practices 四個區域。

**關鍵 API:**
- `meta: input.required<CatalogBlockMeta>()` — 區塊元資料
- `previousEntry: computed()` — 前一個目錄項目
- `nextEntry: computed()` — 下一個目錄項目

### BlockPreview

```
selector: app-block-preview
```

區塊即時預覽元件，使用 `NgComponentOutlet` 動態渲染指定的 `BlockVariant`。支援 `demoInputs` 將必要的 input 值透過 `ngComponentOutletInputs` 注入。

**關鍵 API:**
- `variant: input.required<BlockVariant>()` — 當前變體
- `componentType: computed()` — 動態元件類型
- `demoInputs: computed()` — 傳入 `ngComponentOutlet` 的 inputs 物件

### CodeViewer

```
selector: app-code-viewer
```

原始碼檢視器，透過 HTTP 載入 baked block JSON 檔案（`assets/block-sources/{category}__{variant}.json`），支援多檔案切換與語法高亮。

**關鍵 API:**
- `category: input.required<string>()` — 區塊的 registry category
- `variant: input.required<string>()` — 區塊變體 ID
- `selectedFile: signal<string>()` — 當前選中的檔案
- `fileNames: computed()` — 可用檔案清單

### ApiTable

```
selector: app-api-table
```

API 文件表格，將 `ApiDocumentation` 分為 Inputs、Outputs、Slots 與 CSS Custom Properties 四個區段呈現。僅顯示非空區段。

**關鍵 API:**
- `api: input.required<ApiDocumentation>()` — API 文件資料
- `sections: computed()` — 過濾後的非空區段

### BestPracticesPanel

```
selector: app-best-practices-panel
```

最佳實作面板，將 `BestPracticeNotes` 分為「何時使用」、「何時不該使用」、「常見陷阱」與「無障礙重點」四個區段，使用不同圖示與色調呈現。

**關鍵 API:**
- `notes: input.required<BestPracticeNotes>()` — 最佳實作備註
- `sections: computed()` — 格式化的區段陣列

### VariantSelector

```
selector: app-variant-selector
```

變體選擇器，將變體分為 Free 與 Paid 兩組，透過下拉選單切換。

**關鍵 API:**
- `variants: input.required<readonly BlockVariant[]>()` — 所有變體
- `selectedId: input.required<string>()` — 當前選中的變體 ID
- `selectionChange: output<string>()` — 切換事件

---

## 自訂區塊開發流程

### 1. 建立區塊元件

```bash
# 在 src/app/blocks/custom-{feature}/ 下建立元件
ng generate component blocks/custom-{feature}/{variant-name} --flat
```

### 2. 遵循元件約束

- `changeDetection: ChangeDetectionStrategy.OnPush`
- 使用 `signal()`、`computed()`、`input()`、`output()`
- 使用 `@if` / `@for` / `@switch` 原生控制流
- 保留所有 ARIA 屬性與無障礙語意

### 3. 建立目錄頁面

在 `src/app/catalog/blocks/` 下建立 `{feature-name}.page.ts`，定義：

```typescript
const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'my-variant-1',
    label: 'My Variant 1 — 描述',
    registryCategory: 'custom-{feature}',
    component: MyVariant1Component,
    isFree: true,
  },
];

const API: ApiDocumentation = { inputs: [...], outputs: [...], slots: [...], cssProperties: [...] };
const BEST_PRACTICES: BestPracticeNotes = { whenToUse: [...], whenNotToUse: [...], pitfalls: [...], accessibility: [...] };
const META: CatalogBlockMeta = { id: '...', title: '...', category: '...', ... };
```

### 4. 註冊至目錄

1. 在 `catalog-registry.ts` 的 `CATALOG_REGISTRY` 陣列中新增 `CatalogRegistryEntry`
2. 在 `catalog.routes.ts` 中新增 lazy-load 路由

### 5. 烘焙原始碼

執行原始碼烘焙腳本，將區塊原始碼輸出為 JSON 供 CodeViewer 讀取：

```bash
npm run bake-sources
```

### 6. 驗證建置

```bash
ng build
```

---

## 響應式設計指南

### 斷點定義

| 斷點 | 寬度 | 用途 |
|------|------|------|
| `sm` | 640px | 手機（直式） |
| `md` | 960px | 平板（直式）/ 手機（橫式） |
| `lg` | 1280px | 小型桌面 / 平板（橫式） |
| `xl` | 1440px | 大型桌面 |

### 響應式策略

```css
/* Mobile first — 由小到大堆疊媒體查詢 */
.container { padding: 16px; }

@media (min-width: 640px) {
  .container { padding: 24px; }
}

@media (min-width: 960px) {
  .container { max-width: 960px; margin: 0 auto; }
}

@media (min-width: 1280px) {
  .container { max-width: 1200px; }
}

@media (min-width: 1440px) {
  .container { max-width: 1320px; }
}
```

### 常見響應式模式

| 模式 | sm | md | lg+ |
|------|----|----|-----|
| 表格 | 卡片堆疊或堆疊欄位 | 水平滾動 | 完整表格 |
| 多欄 | 單欄堆疊 | 雙欄 | 三欄 |
| 導覽列 | 漢堡選單 | 水平導覽（精簡） | 完整導覽 |
| 側邊欄 | 抽屜模式 | 迷你模式 | 完整展開 |
| 圖表 | 簡化（隱藏圖例） | 標準 | 含輔助面板 |
| KPI 卡片 | 單欄滿版 | 2x2 網格 | 4 欄並排 |

### Angular 整合

```typescript
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';

// In component
private readonly breakpointObserver = inject(BreakpointObserver);

protected readonly isMobile = toSignal(
  this.breakpointObserver.observe('(max-width: 639px)')
    .pipe(map(result => result.matches)),
  { initialValue: false },
);
```

---

## 無障礙設計規範

### WCAG AA 基準

| 規範 | 要求 | 驗證方式 |
|------|------|----------|
| **1.1.1 Non-text Content** | 所有非裝飾性圖片須有 alt 文字 | AXE audit |
| **1.3.1 Info and Relationships** | 使用語意化 HTML（heading、list、table） | 手動審查 |
| **1.4.3 Contrast** | 文字對比度 >= 4.5:1；大文字 >= 3:1 | Lighthouse |
| **2.1.1 Keyboard** | 所有互動元素可透過鍵盤操作 | Tab 測試 |
| **2.4.3 Focus Order** | Tab 順序與視覺順序一致 | 手動測試 |
| **2.4.7 Focus Visible** | 焦點指示器清晰可見 | 視覺檢查 |
| **4.1.2 Name, Role, Value** | 所有互動元素有正確的名稱、角色與值 | AXE audit |

### 元件無障礙清單

#### 表單

- 每個 `<input>` 必須有關聯的 `<label>`（`for` / `id` 或包裹方式）
- 必填欄位使用 `required` + `aria-required="true"`
- 驗證錯誤透過 `aria-describedby` 連結到錯誤訊息
- 錯誤訊息使用 `role="alert"` 或 `aria-live="polite"`
- 提交失敗時程式化聚焦第一個錯誤欄位

#### 導覽

- 導覽區塊使用 `<nav>` + `aria-label` 區分多個導覽
- 當前頁面以 `aria-current="page"` 標示
- 下拉選單使用 `aria-haspopup` + `aria-expanded`
- 提供 Skip Link 跳過重複導覽

#### 對話框

- 使用 `role="dialog"` + `aria-modal="true"`
- 以 `aria-labelledby` 指向標題
- 開啟時焦點移入，關閉時焦點回到觸發元素
- 實作 Focus Trap 防止 Tab 跳出

#### 圖表

- 容器加上 `role="img"` + `aria-label` 描述主題
- 提供資料表替代方案供螢幕閱讀器讀取
- 色彩編碼搭配圖案或標籤支援色盲
- 互動元素支援鍵盤操作與 `focus-visible`
- Tooltip 觸發時以 `aria-live` 播報

#### 動畫

- 尊重 `@media (prefers-reduced-motion: reduce)`
- 提供暫停/停止控制
- 避免閃爍頻率超過 3Hz

### 測試工具

| 工具 | 用途 | 整合方式 |
|------|------|----------|
| **axe-core** | 自動化無障礙掃描 | `npm install @axe-core/cli` |
| **Lighthouse** | 綜合性無障礙評分 | Chrome DevTools |
| **NVDA / VoiceOver** | 螢幕閱讀器實測 | 手動測試 |
| **Colour Contrast Analyser** | 對比度檢測 | 設計階段 |

---

> 本文件由 Angular Material Block Showcase 專案維護團隊編撰。  
> 區塊原始碼來源: [ui.angular-material.dev](https://ui.angular-material.dev/)  
> 框架版本: Angular 21+ / Angular Material 21
