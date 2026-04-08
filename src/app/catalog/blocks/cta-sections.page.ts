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

import { CtaSection1Component } from '../../blocks/cta-sections/cta-section-1/cta-section-1.component';
import { CtaSection2Component } from '../../blocks/cta-sections/cta-section-2/cta-section-2.component';
import { CtaSection3Component } from '../../blocks/cta-sections/cta-section-3/cta-section-3.component';
import { CtaSection4Component } from '../../blocks/cta-sections/cta-section-4/cta-section-4.component';
import { CtaSection5Component } from '../../blocks/cta-sections/cta-section-5/cta-section-5.component';
import { CtaSection6Component } from '../../blocks/cta-sections/cta-section-6/cta-section-6.component';
import { CtaSection7Component } from '../../blocks/cta-sections/cta-section-7/cta-section-7.component';
import { CtaSection8Component } from '../../blocks/cta-sections/cta-section-8/cta-section-8.component';
import { CtaSection9Component } from '../../blocks/cta-sections/cta-section-9/cta-section-9.component';
import { CtaSection10Component } from '../../blocks/cta-sections/cta-section-10/cta-section-10.component';
import { CtaSection11Component } from '../../blocks/cta-sections/cta-section-11/cta-section-11.component';
import { CtaSection12Component } from '../../blocks/cta-sections/cta-section-12/cta-section-12.component';
import { CtaSection13Component } from '../../blocks/cta-sections/cta-section-13/cta-section-13.component';
import { CtaSection14Component } from '../../blocks/cta-sections/cta-section-14/cta-section-14.component';
import { CtaSection15Component } from '../../blocks/cta-sections/cta-section-15/cta-section-15.component';
import { CtaSection16Component } from '../../blocks/cta-sections/cta-section-16/cta-section-16.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'cta-section-1',
    label: 'CTA Section 1 — 置中標題雙按鈕',
    registryCategory: 'cta-sections',
    component: CtaSection1Component,
    isFree: false,
  },
  {
    id: 'cta-section-2',
    label: 'CTA Section 2 — 深色強調行動區',
    registryCategory: 'cta-sections',
    component: CtaSection2Component,
    isFree: false,
  },
  {
    id: 'cta-section-3',
    label: 'CTA Section 3 — 左文右按鈕',
    registryCategory: 'cta-sections',
    component: CtaSection3Component,
    isFree: false,
  },
  {
    id: 'cta-section-4',
    label: 'CTA Section 4 — 漸層背景強調',
    registryCategory: 'cta-sections',
    component: CtaSection4Component,
    isFree: false,
  },
  {
    id: 'cta-section-5',
    label: 'CTA Section 5 — 訂閱表單嵌入',
    registryCategory: 'cta-sections',
    component: CtaSection5Component,
    isFree: false,
  },
  {
    id: 'cta-section-6',
    label: 'CTA Section 6 — 雙欄圖文行動',
    registryCategory: 'cta-sections',
    component: CtaSection6Component,
    isFree: false,
  },
  {
    id: 'cta-section-7',
    label: 'CTA Section 7 — 大型按鈕強調',
    registryCategory: 'cta-sections',
    component: CtaSection7Component,
    isFree: false,
  },
  {
    id: 'cta-section-8',
    label: 'CTA Section 8 — 含使用者見證',
    registryCategory: 'cta-sections',
    component: CtaSection8Component,
    isFree: false,
  },
  {
    id: 'cta-section-9',
    label: 'CTA Section 9 — 應用商店下載按鈕',
    registryCategory: 'cta-sections',
    component: CtaSection9Component,
    isFree: false,
  },
  {
    id: 'cta-section-10',
    label: 'CTA Section 10 — 倒數計時促銷',
    registryCategory: 'cta-sections',
    component: CtaSection10Component,
    isFree: false,
  },
  {
    id: 'cta-section-11',
    label: 'CTA Section 11 — 整合圖示亮點',
    registryCategory: 'cta-sections',
    component: CtaSection11Component,
    isFree: false,
  },
  {
    id: 'cta-section-12',
    label: 'CTA Section 12 — 卡片式行動區',
    registryCategory: 'cta-sections',
    component: CtaSection12Component,
    isFree: false,
  },
  {
    id: 'cta-section-13',
    label: 'CTA Section 13 — 全幅圖像背景',
    registryCategory: 'cta-sections',
    component: CtaSection13Component,
    isFree: false,
  },
  {
    id: 'cta-section-14',
    label: 'CTA Section 14 — 多步驟引導入口',
    registryCategory: 'cta-sections',
    component: CtaSection14Component,
    isFree: false,
  },
  {
    id: 'cta-section-15',
    label: 'CTA Section 15 — 試用與聯繫雙路徑',
    registryCategory: 'cta-sections',
    component: CtaSection15Component,
    isFree: false,
  },
  {
    id: 'cta-section-16',
    label: 'CTA Section 16 — 緊湊型轉換橫條',
    registryCategory: 'cta-sections',
    component: CtaSection16Component,
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
      description: '行動呼籲內容（標題、說明、主要與次要按鈕、表單欄位）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '行銷頁面結尾：在使用者完成內容閱讀後，提供明確的下一步行動',
    '功能介紹後：將特色閱讀流量轉換為註冊或試用',
    '價格頁底部：再次強調試用或聯繫銷售的入口',
    '電子報訂閱：以簡潔表單收集潛在客戶聯絡資訊',
    '產品發佈頁：突顯限時優惠或早鳥折扣的轉換機會',
  ],
  whenNotToUse: [
    '應用程式內部頁面 — 應使用 Inline Action 或 Toolbar 按鈕',
    '法務或政策頁面 — 干擾使用者閱讀的關鍵資訊',
    '結帳流程中的頁面 — 不應在結帳途中分散使用者注意力',
    '錯誤頁面或維護頁面 — 應使用 Empty State 而非行銷 CTA',
  ],
  pitfalls: [
    '同時放置過多 CTA 按鈕，使用者無法判斷主要行動為何',
    '按鈕文字過於空泛（「點擊這裡」、「了解更多」），缺乏價值承諾',
    '主按鈕與次按鈕視覺強度相同，未建立明確的優先層級',
    '表單欄位過多，提高使用者填寫門檻並降低轉換率',
    '缺乏信任元素（評價、認證標誌、隱私聲明），影響使用者決策',
  ],
  accessibility: [
    'CTA 按鈕使用 button 或 a 元素，並提供明確的可見文字',
    '主要按鈕需有足夠的色彩對比（WCAG AA 4.5:1），不可僅以顏色傳達語意',
    '訂閱表單欄位需有對應的 label，並提供 required 與 aria-describedby 錯誤訊息',
    '若包含倒數計時器，需提供 aria-live 或文字提示，避免突兀變化',
    '按鈕載入或處理中狀態需以 aria-busy 與文字提示同步告知',
  ],
};

const META: CatalogBlockMeta = {
  id: 'cta-sections',
  title: 'CTA Sections',
  category: 'marketing',
  subcategory: 'Marketing Page Sections',
  summary:
    '行銷頁面行動呼籲區塊，以強烈視覺對比與明確按鈕引導使用者完成註冊、試用、訂閱或購買，是頁面轉換率的關鍵版位。',
  tags: ['cta', 'conversion', 'marketing', 'action'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['hero-sections', 'feature-sections', 'newsletter-sections'],
};

@Component({
  selector: 'app-cta-sections-catalog-page',
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
export class CtaSectionsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
