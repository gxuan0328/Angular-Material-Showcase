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

import { LoginEmailPasswordComponent } from '../../blocks/free-authentication/login-email-password/login-email-password.component';
import { LoginEmailPasswordGoogleComponent } from '../../blocks/authentication/login-email-password-google/login-email-password-google.component';
import { LoginEmailProviderComponent } from '../../blocks/authentication/login-email-provider/login-email-provider.component';
import { LoginWithEmail01Component } from '../../blocks/authentication/login-with-email-01/login-with-email-01.component';
import { LoginWithEmail02Component } from '../../blocks/authentication/login-with-email-02/login-with-email-02.component';
import { LoginWithEmail03Component } from '../../blocks/authentication/login-with-email-03/login-with-email-03.component';
import { LoginWithEmail04Component } from '../../blocks/authentication/login-with-email-04/login-with-email-04.component';
import { WorkspaceLogin01Component } from '../../blocks/authentication/workspace-login-01/workspace-login-01.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'login-email-password',
    label: 'Login Email Password — 基本電子郵件登入表單',
    registryCategory: 'free-authentication',
    component: LoginEmailPasswordComponent,
    isFree: true,
  },
  {
    id: 'login-email-password-google',
    label: 'Login Email Password Google — 電子郵件加 Google 登入',
    registryCategory: 'authentication',
    component: LoginEmailPasswordGoogleComponent,
    isFree: false,
  },
  {
    id: 'login-email-provider',
    label: 'Login Email Provider — 多識別提供者登入',
    registryCategory: 'authentication',
    component: LoginEmailProviderComponent,
    isFree: false,
  },
  {
    id: 'login-with-email-01',
    label: 'Login With Email 01 — 品牌化登入頁面',
    registryCategory: 'authentication',
    component: LoginWithEmail01Component,
    isFree: false,
  },
  {
    id: 'login-with-email-02',
    label: 'Login With Email 02 — 左右分割登入佈局',
    registryCategory: 'authentication',
    component: LoginWithEmail02Component,
    isFree: false,
  },
  {
    id: 'login-with-email-03',
    label: 'Login With Email 03 — 帶插圖的登入頁',
    registryCategory: 'authentication',
    component: LoginWithEmail03Component,
    isFree: false,
  },
  {
    id: 'login-with-email-04',
    label: 'Login With Email 04 — 極簡置中登入表單',
    registryCategory: 'authentication',
    component: LoginWithEmail04Component,
    isFree: false,
  },
  {
    id: 'workspace-login-01',
    label: 'Workspace Login 01 — 工作區身份切換登入',
    registryCategory: 'authentication',
    component: WorkspaceLogin01Component,
    isFree: false,
  },
];

const API: ApiDocumentation = {
  inputs: [],
  outputs: [],
  slots: [
    {
      name: 'default',
      type: 'ng-content',
      default: null,
      required: false,
      description: '登入表單內容區塊（品牌 Logo、欄位、送出按鈕、社群登入、法律聲明）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    'SaaS 產品首頁登入：以電子郵件加密碼作為預設的身份驗證入口',
    '多身份提供者整合：同時支援 Email、Google、GitHub、SSO 等多種登入方式',
    '品牌化登入頁面：需要左側品牌插圖、右側表單的行銷導向登入流程',
    '多工作區應用：允許使用者在登入階段挑選所屬組織或工作區',
    '企業內部系統：與 OIDC / SAML 身份提供者整合的集中登入頁',
  ],
  whenNotToUse: [
    '匿名瀏覽為主的內容站台，不需要強制登入即可使用',
    '純手機原生應用已使用系統級認證（如 Face ID、指紋）',
    '一次性驗證流程（例如僅需 Email Magic Link，應使用獨立的 Passwordless 頁面）',
    '需要多步驟註冊（含電子郵件驗證、手機 OTP）時，應使用 Stepper 配合獨立頁面',
  ],
  pitfalls: [
    '未在客戶端對密碼做最小長度與強度驗證就送出請求，造成不必要的來回延遲',
    '錯誤訊息過於籠統（例如「帳號或密碼錯誤」但位置不明顯），使用者不易排錯',
    '忘記處理 Caps Lock、自動填入（autocomplete）與瀏覽器密碼管理器的相容性',
    '忽略防刷與暴力破解保護，沒有整合 Rate Limiting 或 CAPTCHA',
    '社群登入按鈕未使用官方品牌規範的顏色與 Logo，造成品牌誤導或被拒絕上架',
    '第三方登入失敗時缺乏降級機制，使用者無法切回 Email 方式',
  ],
  accessibility: [
    '每個欄位都有關聯的 <label>，並使用 for / id 或包裹方式連結，避免僅靠 placeholder',
    '密碼欄位提供顯示/隱藏切換時，按鈕需有 aria-label 與 aria-pressed 狀態',
    '表單驗證錯誤使用 aria-invalid 並將錯誤訊息以 aria-describedby 連結到欄位',
    '提交按鈕在送出中應標示 aria-busy 或透過 aria-live 播報「登入中」狀態',
    '社群登入按鈕須具備可辨識文字（aria-label="使用 Google 登入"），不可僅以 Logo 呈現',
    '鍵盤可操作：Tab 順序需符合視覺順序，Enter 可送出表單，Escape 可關閉彈窗',
  ],
};

const META: CatalogBlockMeta = {
  id: 'authentication',
  title: 'Authentication',
  category: 'application',
  subcategory: 'Forms',
  summary:
    '身份驗證與登入表單集合，涵蓋 Email 密碼、Google / 多提供者社群登入、品牌化登入頁及工作區切換等常見驗證場景。',
  tags: ['authentication', 'login', 'form', 'sign-in', 'sso'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['banners', 'page-headings'],
};

@Component({
  selector: 'app-authentication-catalog-page',
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
export class AuthenticationCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
