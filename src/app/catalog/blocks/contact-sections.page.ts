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

import { ContactSection1Component } from '../../blocks/free-contact-sections/contact-section-1/contact-section-1.component';
import { ContactSection2Component } from '../../blocks/contact-sections/contact-section-2/contact-section-2.component';
import { ContactSection3Component } from '../../blocks/contact-sections/contact-section-3/contact-section-3.component';
import { ContactSection4Component } from '../../blocks/contact-sections/contact-section-4/contact-section-4.component';
import { ContactSection5Component } from '../../blocks/contact-sections/contact-section-5/contact-section-5.component';
import { ContactSection6Component } from '../../blocks/contact-sections/contact-section-6/contact-section-6.component';
import { ContactSection7Component } from '../../blocks/contact-sections/contact-section-7/contact-section-7.component';
import { ContactSection8Component } from '../../blocks/contact-sections/contact-section-8/contact-section-8.component';
import { ContactSection9Component } from '../../blocks/contact-sections/contact-section-9/contact-section-9.component';
import { ContactSection10Component } from '../../blocks/contact-sections/contact-section-10/contact-section-10.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'contact-section-1',
    label: 'Contact Section 1 — 基礎聯絡表單',
    registryCategory: 'free-contact-sections',
    component: ContactSection1Component,
    isFree: true,
  },
  {
    id: 'contact-section-2',
    label: 'Contact Section 2 — 圖文左右並排',
    registryCategory: 'contact-sections',
    component: ContactSection2Component,
    isFree: false,
  },
  {
    id: 'contact-section-3',
    label: 'Contact Section 3 — 含地圖嵌入',
    registryCategory: 'contact-sections',
    component: ContactSection3Component,
    isFree: false,
  },
  {
    id: 'contact-section-4',
    label: 'Contact Section 4 — 多分店資訊卡',
    registryCategory: 'contact-sections',
    component: ContactSection4Component,
    isFree: false,
  },
  {
    id: 'contact-section-5',
    label: 'Contact Section 5 — 客服管道列表',
    registryCategory: 'contact-sections',
    component: ContactSection5Component,
    isFree: false,
  },
  {
    id: 'contact-section-6',
    label: 'Contact Section 6 — 部門分類聯絡',
    registryCategory: 'contact-sections',
    component: ContactSection6Component,
    isFree: false,
  },
  {
    id: 'contact-section-7',
    label: 'Contact Section 7 — 全幅背景表單',
    registryCategory: 'contact-sections',
    component: ContactSection7Component,
    isFree: false,
  },
  {
    id: 'contact-section-8',
    label: 'Contact Section 8 — 預約諮詢式表單',
    registryCategory: 'contact-sections',
    component: ContactSection8Component,
    isFree: false,
  },
  {
    id: 'contact-section-9',
    label: 'Contact Section 9 — FAQ + 表單',
    registryCategory: 'contact-sections',
    component: ContactSection9Component,
    isFree: false,
  },
  {
    id: 'contact-section-10',
    label: 'Contact Section 10 — 卡片化聯絡資訊',
    registryCategory: 'contact-sections',
    component: ContactSection10Component,
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
      description: '聯絡區塊內容（聯絡表單、地址、電話、Email、地圖、社群連結）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '企業官網需呈現完整聯絡資訊，建立可信任的品牌形象',
    '產品落地頁提供諮詢入口，引導潛在客戶提出需求',
    '多分店業態（餐飲、零售）需要清楚呈現各據點的聯絡方式',
    '需要透過表單分流客戶問題（業務、技術、客服）',
    'B2B 企業希望透過預約諮詢表單篩選有效詢問',
  ],
  whenNotToUse: [
    '即時客服場景 — 應改用 Live Chat 或聊天機器人提升回應速度',
    '大量訂單需求 — 應使用完整的訂單管理系統而非聯絡表單',
    '純展示形象網站且無實際聯絡需求 — 過度的表單反而干擾',
    '已有完整工單系統的 SaaS 產品 — 應導向 Help Center 而非額外表單',
  ],
  pitfalls: [
    '必填欄位過多（要求公司、職稱、電話）造成放棄率上升',
    '提交後沒有明確的回應時間承諾，使用者陷入等待焦慮',
    '地圖元件未做延遲載入，嚴重影響首屏載入效能',
    '聯絡資訊未做結構化標記，搜尋引擎無法擷取為知識面板',
    '缺少防垃圾訊息機制（reCAPTCHA、honeypot），造成 spam 氾濫',
  ],
  accessibility: [
    '所有表單欄位必須有對應的 <label> 元素，避免僅靠 placeholder',
    '電話與 Email 使用 tel: 與 mailto: 連結，方便輔助技術直接撥打或寄信',
    '地圖嵌入須提供 title 屬性說明用途，並提供文字版地址作為 fallback',
    '錯誤訊息使用 aria-invalid 與 aria-describedby 連結至錯誤說明',
    '提交按鈕的處理中狀態使用 aria-busy 並關閉重複點擊',
  ],
};

const META: CatalogBlockMeta = {
  id: 'contact-sections',
  title: 'Contact Sections',
  category: 'marketing',
  subcategory: 'Marketing Page Sections',
  summary:
    '聯絡我們區塊集合，提供聯絡表單、地址資訊、地圖嵌入、客服管道與多分店展示，協助訪客快速取得聯繫管道。',
  tags: ['contact', 'form', 'lead-generation', 'marketing'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['newsletter-sections', 'footer-sections', 'cta-sections'],
};

@Component({
  selector: 'app-contact-sections-catalog-page',
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
export class ContactSectionsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
