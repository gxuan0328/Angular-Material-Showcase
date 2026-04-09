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

import { AccountUserManagement1Component } from '../../blocks/account-user-management/account-user-management-1/account-user-management-1.component';
import { AccountUserManagement2Component } from '../../blocks/account-user-management/account-user-management-2/account-user-management-2.component';
import { AccountUserManagement3Component } from '../../blocks/account-user-management/account-user-management-3/account-user-management-3.component';
import { AccountUserManagement4Component } from '../../blocks/account-user-management/account-user-management-4/account-user-management-4.component';
import { AccountUserManagement5Component } from '../../blocks/account-user-management/account-user-management-5/account-user-management-5.component';
import { AccountUserManagement6Component } from '../../blocks/account-user-management/account-user-management-6/account-user-management-6.component';
import { AccountUserManagement7Component } from '../../blocks/account-user-management/account-user-management-7/account-user-management-7.component';
import { AccountUserManagement8Component } from '../../blocks/account-user-management/account-user-management-8/account-user-management-8.component';
import { AccountUserManagement9Component } from '../../blocks/account-user-management/account-user-management-9/account-user-management-9.component';
import { AccountUserManagement10Component } from '../../blocks/account-user-management/account-user-management-10/account-user-management-10.component';

const VARIANTS: readonly BlockVariant[] = [
  { id: 'account-user-management-1', label: 'Account Management 01 — 個人資料設定', registryCategory: 'account-user-management', component: AccountUserManagement1Component, isFree: false },
  { id: 'account-user-management-2', label: 'Account Management 02 — 密碼變更', registryCategory: 'account-user-management', component: AccountUserManagement2Component, isFree: false },
  { id: 'account-user-management-3', label: 'Account Management 03 — 雙因子驗證設定', registryCategory: 'account-user-management', component: AccountUserManagement3Component, isFree: false },
  { id: 'account-user-management-4', label: 'Account Management 04 — 登入裝置管理', registryCategory: 'account-user-management', component: AccountUserManagement4Component, isFree: false },
  { id: 'account-user-management-5', label: 'Account Management 05 — 團隊成員邀請', registryCategory: 'account-user-management', component: AccountUserManagement5Component, isFree: false },
  { id: 'account-user-management-6', label: 'Account Management 06 — 權限角色設定', registryCategory: 'account-user-management', component: AccountUserManagement6Component, isFree: false },
  { id: 'account-user-management-7', label: 'Account Management 07 — 通知偏好設定', registryCategory: 'account-user-management', component: AccountUserManagement7Component, isFree: false },
  { id: 'account-user-management-8', label: 'Account Management 08 — API Token 管理', registryCategory: 'account-user-management', component: AccountUserManagement8Component, isFree: false },
  { id: 'account-user-management-9', label: 'Account Management 09 — 資料下載與刪除', registryCategory: 'account-user-management', component: AccountUserManagement9Component, isFree: false },
  { id: 'account-user-management-10', label: 'Account Management 10 — 組織層級設定', registryCategory: 'account-user-management', component: AccountUserManagement10Component, isFree: false },
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
      description: '帳戶管理表單區塊',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '`/app/settings/profile`、`/app/settings/security` 等使用者設定頁面',
    '團隊成員邀請與權限管理後台',
    'API token 與整合設定介面',
    '符合 GDPR 的資料匯出與刪除入口',
  ],
  whenNotToUse: [
    '首次註冊流程 — 應使用 Authentication 類別的 onboarding 變體',
    '單純的個人偏好切換 — 直接使用 Form Layouts',
  ],
  pitfalls: [
    '密碼變更沒有舊密碼確認，造成帳號劫持風險',
    '雙因子驗證設定沒有備用碼機制',
    '組織層級設定缺少多重確認，造成誤操作影響全體使用者',
    '缺少操作審計紀錄（audit log）— 重要設定變更應可追溯',
  ],
  accessibility: [
    '敏感操作（刪除帳號）需要二次確認對話框並使用 `role="alertdialog"`',
    '密碼欄位使用 `autocomplete="current-password"` / `new-password"`',
    '雙因子驗證代碼輸入使用 `inputmode="numeric"` 與 `autocomplete="one-time-code"`',
    '表單錯誤訊息明確描述問題（「密碼至少 8 字元」）而非僅「無效」',
  ],
};

const META: CatalogBlockMeta = {
  id: 'account-user-management',
  title: 'Account & User Management',
  category: 'application',
  subcategory: 'Forms',
  summary:
    '帳戶與使用者管理表單集合，涵蓋個人資料、密碼變更、2FA、裝置管理、團隊邀請、API token、資料下載等設定頁面情境。',
  tags: ['account', 'settings', 'user-management', 'security'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['authentication', 'form-layouts', 'file-upload'],
};

@Component({
  selector: 'app-account-user-management-catalog-page',
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
export class AccountUserManagementCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
