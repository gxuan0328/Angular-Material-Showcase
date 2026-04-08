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

import { PricingSection1Component } from '../../blocks/free-pricing-sections/pricing-section-1/pricing-section-1.component';
import { PricingSection2Component } from '../../blocks/pricing-sections/pricing-section-2/pricing-section-2.component';
import { PricingSection3Component } from '../../blocks/pricing-sections/pricing-section-3/pricing-section-3.component';
import { PricingSection4Component } from '../../blocks/pricing-sections/pricing-section-4/pricing-section-4.component';
import { PricingSection5Component } from '../../blocks/pricing-sections/pricing-section-5/pricing-section-5.component';
import { PricingSection6Component } from '../../blocks/pricing-sections/pricing-section-6/pricing-section-6.component';
import { PricingSection7Component } from '../../blocks/pricing-sections/pricing-section-7/pricing-section-7.component';
import { PricingSection8Component } from '../../blocks/pricing-sections/pricing-section-8/pricing-section-8.component';
import { PricingSection9Component } from '../../blocks/pricing-sections/pricing-section-9/pricing-section-9.component';
import { PricingSection10Component } from '../../blocks/pricing-sections/pricing-section-10/pricing-section-10.component';
import { PricingSection11Component } from '../../blocks/pricing-sections/pricing-section-11/pricing-section-11.component';
import { PricingSection12Component } from '../../blocks/pricing-sections/pricing-section-12/pricing-section-12.component';
import { PricingSection13Component } from '../../blocks/pricing-sections/pricing-section-13/pricing-section-13.component';
import { PricingSection14Component } from '../../blocks/pricing-sections/pricing-section-14/pricing-section-14.component';
import { PricingSection15Component } from '../../blocks/pricing-sections/pricing-section-15/pricing-section-15.component';
import { PricingSection16Component } from '../../blocks/pricing-sections/pricing-section-16/pricing-section-16.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'pricing-section-1',
    label: 'Pricing Section 1 — 三方案比較',
    registryCategory: 'free-pricing-sections',
    component: PricingSection1Component,
    isFree: true,
  },
  {
    id: 'pricing-section-2',
    label: 'Pricing Section 2 — 雙方案對照',
    registryCategory: 'pricing-sections',
    component: PricingSection2Component,
    isFree: false,
  },
  {
    id: 'pricing-section-3',
    label: 'Pricing Section 3 — 月年計費切換',
    registryCategory: 'pricing-sections',
    component: PricingSection3Component,
    isFree: false,
  },
  {
    id: 'pricing-section-4',
    label: 'Pricing Section 4 — 功能矩陣表',
    registryCategory: 'pricing-sections',
    component: PricingSection4Component,
    isFree: false,
  },
  {
    id: 'pricing-section-5',
    label: 'Pricing Section 5 — 推薦方案突顯',
    registryCategory: 'pricing-sections',
    component: PricingSection5Component,
    isFree: false,
  },
  {
    id: 'pricing-section-6',
    label: 'Pricing Section 6 — 企業客製方案',
    registryCategory: 'pricing-sections',
    component: PricingSection6Component,
    isFree: false,
  },
  {
    id: 'pricing-section-7',
    label: 'Pricing Section 7 — 卡片帶 FAQ',
    registryCategory: 'pricing-sections',
    component: PricingSection7Component,
    isFree: false,
  },
  {
    id: 'pricing-section-8',
    label: 'Pricing Section 8 — 用量計費滑桿',
    registryCategory: 'pricing-sections',
    component: PricingSection8Component,
    isFree: false,
  },
  {
    id: 'pricing-section-9',
    label: 'Pricing Section 9 — 簡潔水平排版',
    registryCategory: 'pricing-sections',
    component: PricingSection9Component,
    isFree: false,
  },
  {
    id: 'pricing-section-10',
    label: 'Pricing Section 10 — 多維度比較表',
    registryCategory: 'pricing-sections',
    component: PricingSection10Component,
    isFree: false,
  },
  {
    id: 'pricing-section-11',
    label: 'Pricing Section 11 — 漸層強調卡片',
    registryCategory: 'pricing-sections',
    component: PricingSection11Component,
    isFree: false,
  },
  {
    id: 'pricing-section-12',
    label: 'Pricing Section 12 — 緊湊摘要型方案',
    registryCategory: 'pricing-sections',
    component: PricingSection12Component,
    isFree: false,
  },
  {
    id: 'pricing-section-13',
    label: 'Pricing Section 13 — 含試用條款',
    registryCategory: 'pricing-sections',
    component: PricingSection13Component,
    isFree: false,
  },
  {
    id: 'pricing-section-14',
    label: 'Pricing Section 14 — 模組化加購',
    registryCategory: 'pricing-sections',
    component: PricingSection14Component,
    isFree: false,
  },
  {
    id: 'pricing-section-15',
    label: 'Pricing Section 15 — 區域貨幣切換',
    registryCategory: 'pricing-sections',
    component: PricingSection15Component,
    isFree: false,
  },
  {
    id: 'pricing-section-16',
    label: 'Pricing Section 16 — 高對比深色版',
    registryCategory: 'pricing-sections',
    component: PricingSection16Component,
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
      description: '價格方案區塊內容（方案名稱、價格、功能列表、行動按鈕、推薦標籤）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    'SaaS 產品需呈現多個訂閱方案供使用者比較選擇',
    '提供月付與年付切換，引導使用者選擇高價值年訂方案',
    '需要明確凸顯推薦方案，引導決策並提升轉換率',
    '企業 B2B 服務需呈現「聯絡業務」的客製化方案入口',
    '用量計費型服務（API、儲存）需要動態試算費用',
  ],
  whenNotToUse: [
    '價格策略尚未確定 — 不應急著公開錯誤價格資訊',
    '單一價格方案 — 應使用簡單的 CTA 區塊而非複雜表格',
    '需大量客製報價的服務 — 應引導至詢價表單而非展示固定價格',
    '價格差異需業務溝通的高單價方案 — 公開價格反而流失商機',
  ],
  pitfalls: [
    '方案數量超過 4 個，造成決策疲勞與選擇困難',
    '推薦方案不明顯，使用者無法快速判斷該選哪個',
    '功能矩陣表過於詳細，使用者難以快速比較核心差異',
    '缺少貨幣與稅金說明（含稅／未稅、美金／台幣），造成期待落差',
    '隱藏關鍵限制（用量上限、額外費用），事後引發客訴',
  ],
  accessibility: [
    '價格使用語意化標記（<data value="...">），輔助技術可讀取數值',
    '推薦方案使用 aria-label="推薦方案" 並非僅靠視覺色彩標示',
    '月年切換器使用 role="switch" 搭配 aria-checked 狀態',
    '功能比較表使用 <table> 與 <th scope> 提供正確語意結構',
    'CTA 按鈕的可點擊區域至少 44x44 px，並具備清晰焦點樣式',
  ],
};

const META: CatalogBlockMeta = {
  id: 'pricing-sections',
  title: 'Pricing Sections',
  category: 'marketing',
  subcategory: 'Marketing Page Sections',
  summary:
    '價格方案區塊集合，提供 SaaS 訂閱方案、功能比較表、月年切換、用量計費等多種樣式，協助使用者快速決策購買。',
  tags: ['pricing', 'plans', 'subscription', 'marketing'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['testimonial-sections', 'cta-sections', 'feature-sections'],
};

@Component({
  selector: 'app-pricing-sections-catalog-page',
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
export class PricingSectionsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
