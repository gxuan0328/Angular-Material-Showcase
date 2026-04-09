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

import { BillingUsage1Component } from '../../blocks/billing-usage/billing-usage-1/billing-usage-1.component';
import { BillingUsage2Component } from '../../blocks/billing-usage/billing-usage-2/billing-usage-2.component';
import { BillingUsage3Component } from '../../blocks/billing-usage/billing-usage-3/billing-usage-3.component';
import { BillingUsage4Component } from '../../blocks/billing-usage/billing-usage-4/billing-usage-4.component';
import { BillingUsage5Component } from '../../blocks/billing-usage/billing-usage-5/billing-usage-5.component';
import { BillingUsage6Component } from '../../blocks/billing-usage/billing-usage-6/billing-usage-6.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'billing-usage-1',
    label: 'Billing Usage 01 — 當前方案卡',
    registryCategory: 'billing-usage',
    component: BillingUsage1Component,
    isFree: false,
  },
  {
    id: 'billing-usage-2',
    label: 'Billing Usage 02 — 使用量進度列',
    registryCategory: 'billing-usage',
    component: BillingUsage2Component,
    isFree: false,
  },
  {
    id: 'billing-usage-3',
    label: 'Billing Usage 03 — 付款方式管理',
    registryCategory: 'billing-usage',
    component: BillingUsage3Component,
    isFree: false,
  },
  {
    id: 'billing-usage-4',
    label: 'Billing Usage 04 — 多指標儀表',
    registryCategory: 'billing-usage',
    component: BillingUsage4Component,
    isFree: false,
  },
  {
    id: 'billing-usage-5',
    label: 'Billing Usage 05 — 含每月扣款摘要',
    registryCategory: 'billing-usage',
    component: BillingUsage5Component,
    isFree: false,
  },
  {
    id: 'billing-usage-6',
    label: 'Billing Usage 06 — 升級引導組合',
    registryCategory: 'billing-usage',
    component: BillingUsage6Component,
    isFree: false,
  },
];

const API: ApiDocumentation = {
  inputs: [],
  outputs: [],
  slots: [],
  cssProperties: [
    {
      name: '--mat-sys-primary-container',
      type: 'color',
      default: '#d7e3ff',
      required: false,
      description: '使用量進度條填色',
    },
    {
      name: '--mat-sys-error-container',
      type: 'color',
      default: '#ffdad6',
      required: false,
      description: '超額或警示標示色',
    },
    {
      name: '--mat-sys-surface-container',
      type: 'color',
      default: '#f1eff4',
      required: false,
      description: '卡片背景色',
    },
  ],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '向使用者呈現目前方案、額度與實際用量',
    'SaaS 訂閱儀表板的計費分頁',
    '帳單週期即將到期時引導升級',
    '顯示付款方式與下期扣款資訊',
  ],
  whenNotToUse: [
    '單純行銷頁 — 使用 pricing-sections',
    '使用量分析 — 使用 Line Chart 顯示趨勢',
    '尚未付費使用者 — 改用 CTA Sections',
  ],
  pitfalls: [
    '進度接近上限卻未醒目提示',
    '幣別與金額格式不一致',
    '付款方式資訊過度曝光（只遮前 4 位）',
    '未提供升級或管理入口',
  ],
  accessibility: [
    '進度條使用 `role="progressbar"` 並提供 aria-valuemin/max/now',
    '金額文字提供 `aria-label` 包含幣別與完整數字',
    '升級與管理按鈕以 `mat-button` 提供鍵盤存取',
    '色彩警示需搭配文字敘述',
  ],
};

const META: CatalogBlockMeta = {
  id: 'billing-usage',
  title: 'Billing & Usage',
  category: 'application',
  subcategory: 'Forms',
  summary:
    '訂閱帳單與用量顯示集合，包含當前方案、進度列、付款方式、升級引導等 6 種組合，可直接作為帳務分頁。',
  tags: ['billing', 'usage', 'subscription', 'payment'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['pricing-sections', 'kpi-cards', 'banners', 'form-layouts'],
};

@Component({
  selector: 'app-billing-usage-catalog-page',
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
export class BillingUsageCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
