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

import { NewsletterSection1Component } from '../../blocks/newsletter-sections/newsletter-section-1/newsletter-section-1.component';
import { NewsletterSection2Component } from '../../blocks/newsletter-sections/newsletter-section-2/newsletter-section-2.component';
import { NewsletterSection3Component } from '../../blocks/newsletter-sections/newsletter-section-3/newsletter-section-3.component';
import { NewsletterSection4Component } from '../../blocks/newsletter-sections/newsletter-section-4/newsletter-section-4.component';
import { NewsletterSection5Component } from '../../blocks/newsletter-sections/newsletter-section-5/newsletter-section-5.component';
import { NewsletterSection6Component } from '../../blocks/newsletter-sections/newsletter-section-6/newsletter-section-6.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'newsletter-section-1',
    label: 'Newsletter Section 1 — 簡約訂閱橫幅',
    registryCategory: 'newsletter-sections',
    component: NewsletterSection1Component,
    isFree: false,
  },
  {
    id: 'newsletter-section-2',
    label: 'Newsletter Section 2 — 雙欄訂閱表單',
    registryCategory: 'newsletter-sections',
    component: NewsletterSection2Component,
    isFree: false,
  },
  {
    id: 'newsletter-section-3',
    label: 'Newsletter Section 3 — 圖文並排訂閱',
    registryCategory: 'newsletter-sections',
    component: NewsletterSection3Component,
    isFree: false,
  },
  {
    id: 'newsletter-section-4',
    label: 'Newsletter Section 4 — 卡片式訂閱區',
    registryCategory: 'newsletter-sections',
    component: NewsletterSection4Component,
    isFree: false,
  },
  {
    id: 'newsletter-section-5',
    label: 'Newsletter Section 5 — 全幅背景訂閱',
    registryCategory: 'newsletter-sections',
    component: NewsletterSection5Component,
    isFree: false,
  },
  {
    id: 'newsletter-section-6',
    label: 'Newsletter Section 6 — 緊湊型嵌入訂閱',
    registryCategory: 'newsletter-sections',
    component: NewsletterSection6Component,
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
      description: '電子報訂閱區塊（標題、說明、Email 輸入框、訂閱按鈕、隱私聲明）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '建立訂閱用戶名單，透過電子報持續經營潛在客戶關係',
    '部落格或內容網站希望訪客持續回訪並接收最新文章',
    '電商網站收集 Email 用於發送優惠資訊、新品上架通知',
    'SaaS 產品希望追蹤潛在客戶並推送產品更新與教學內容',
    '活動或產品發表前蒐集 Lead 名單供日後行銷使用',
  ],
  whenNotToUse: [
    '尚無持續發送電子報的營運能量 — 訂閱後沒有後續會傷害品牌',
    '使用者剛抵達落地頁就強迫訂閱 — 應在閱讀內容後再呈現',
    '違反當地反垃圾郵件法規（CAN-SPAM、GDPR）— 必須有雙重確認流程',
    '已有強制註冊機制的產品 — 無需重複收集 Email',
  ],
  pitfalls: [
    '欄位過多（要求姓名、公司、電話）造成轉換率大幅下降',
    '缺少價值主張說明，訪客不知道訂閱後能獲得什麼',
    '沒有顯示隱私權政策連結，違反 GDPR 與台灣個資法',
    '送出後沒有明確成功或失敗回饋，使用者無所適從',
    '使用模糊的按鈕文案如「送出」，未強調訂閱動作',
  ],
  accessibility: [
    'Email 輸入框使用 type="email" 並搭配明確的 <label> 元素',
    '訂閱表單設定 aria-describedby 連結至隱私聲明與錯誤訊息',
    '錯誤訊息使用 role="alert" 與 aria-live="polite" 即時通知螢幕閱讀器',
    '提交按鈕的可點擊區域至少 44x44 px 以符合行動裝置可及性',
    '訂閱成功狀態透過 aria-live 區域宣告，避免僅依視覺變化',
  ],
};

const META: CatalogBlockMeta = {
  id: 'newsletter-sections',
  title: 'Newsletter Sections',
  category: 'marketing',
  subcategory: 'Marketing Page Sections',
  summary:
    '電子報訂閱區塊集合，用於落地頁、部落格、電商網站收集訪客 Email，建立持續經營的訂閱用戶名單。',
  tags: ['newsletter', 'subscription', 'lead-generation', 'marketing'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['contact-sections', 'cta-sections', 'footer-sections'],
};

@Component({
  selector: 'app-newsletter-sections-catalog-page',
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
export class NewsletterSectionsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
