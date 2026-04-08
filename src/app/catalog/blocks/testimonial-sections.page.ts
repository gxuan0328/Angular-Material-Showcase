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

import { TestimonialSection1Component } from '../../blocks/testimonial-sections/testimonial-section-1/testimonial-section-1.component';
import { TestimonialSection2Component } from '../../blocks/testimonial-sections/testimonial-section-2/testimonial-section-2.component';
import { TestimonialSection3Component } from '../../blocks/testimonial-sections/testimonial-section-3/testimonial-section-3.component';
import { TestimonialSection4Component } from '../../blocks/testimonial-sections/testimonial-section-4/testimonial-section-4.component';
import { TestimonialSection5Component } from '../../blocks/testimonial-sections/testimonial-section-5/testimonial-section-5.component';
import { TestimonialSection6Component } from '../../blocks/testimonial-sections/testimonial-section-6/testimonial-section-6.component';
import { TestimonialSection7Component } from '../../blocks/testimonial-sections/testimonial-section-7/testimonial-section-7.component';
import { TestimonialSection8Component } from '../../blocks/testimonial-sections/testimonial-section-8/testimonial-section-8.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'testimonial-section-1',
    label: 'Testimonial Section 1 — 三欄客戶見證',
    registryCategory: 'testimonial-sections',
    component: TestimonialSection1Component,
    isFree: false,
  },
  {
    id: 'testimonial-section-2',
    label: 'Testimonial Section 2 — 卡片瀑布流',
    registryCategory: 'testimonial-sections',
    component: TestimonialSection2Component,
    isFree: false,
  },
  {
    id: 'testimonial-section-3',
    label: 'Testimonial Section 3 — 焦點引言',
    registryCategory: 'testimonial-sections',
    component: TestimonialSection3Component,
    isFree: false,
  },
  {
    id: 'testimonial-section-4',
    label: 'Testimonial Section 4 — 評分總覽',
    registryCategory: 'testimonial-sections',
    component: TestimonialSection4Component,
    isFree: false,
  },
  {
    id: 'testimonial-section-5',
    label: 'Testimonial Section 5 — 影音見證輪播',
    registryCategory: 'testimonial-sections',
    component: TestimonialSection5Component,
    isFree: false,
  },
  {
    id: 'testimonial-section-6',
    label: 'Testimonial Section 6 — 品牌標誌牆',
    registryCategory: 'testimonial-sections',
    component: TestimonialSection6Component,
    isFree: false,
  },
  {
    id: 'testimonial-section-7',
    label: 'Testimonial Section 7 — 兩欄推薦組合',
    registryCategory: 'testimonial-sections',
    component: TestimonialSection7Component,
    isFree: false,
  },
  {
    id: 'testimonial-section-8',
    label: 'Testimonial Section 8 — 滑動式評論',
    registryCategory: 'testimonial-sections',
    component: TestimonialSection8Component,
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
      description: '見證內容區塊（客戶頭像、姓名、職稱、引言、評分）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '產品落地頁需要強化社會證明，提高訪客對品牌的信任度',
    '展示真實客戶成功案例，協助潛在客戶做出購買決策',
    '在價格頁附近呈現高滿意度客戶評論，降低成交阻力',
    '需要展示企業客戶 logo 牆，強調品牌規模與信任度',
    '搭配影音見證引導訪客深度了解產品價值',
  ],
  whenNotToUse: [
    '尚未累積足夠真實客戶見證 — 假評論會嚴重損害品牌信任',
    '產品仍在 Beta 階段且使用者反饋尚未明確',
    '見證內容與目標客群定位不符 — 寧缺勿濫',
    '法務或合規敏感領域（金融、醫療）— 需先確認可公開揭露範圍',
  ],
  pitfalls: [
    '使用範本式或機器生成見證，被讀者識破造成反效果',
    '頭像與姓名缺少真實感（卡通圖、模糊照），降低可信度',
    '見證內容過長無重點，讀者無法快速掌握亮點',
    '缺少職稱與公司資訊，無法佐證見證者的可信度與相關性',
    '輪播自動播放速度過快，使用者來不及閱讀',
  ],
  accessibility: [
    '見證區塊使用 role="region" 並搭配 aria-label="客戶見證"',
    '評分星級使用 aria-label 描述（例如 "5 顆星，滿分 5 顆"），避免僅靠視覺',
    '客戶頭像 alt 屬性須描述人物（例如 "張小明，產品經理"），不可留空',
    '輪播元件提供暫停按鈕並支援鍵盤左右鍵切換',
    '影音見證提供字幕與文字稿，符合 WCAG AA 媒體可及性',
  ],
};

const META: CatalogBlockMeta = {
  id: 'testimonial-sections',
  title: 'Testimonial Sections',
  category: 'marketing',
  subcategory: 'Marketing Page Sections',
  summary:
    '客戶見證區塊集合，用於落地頁呈現真實使用者評論、評分、影音見證與品牌標誌牆，強化社會證明與品牌信任度。',
  tags: ['testimonial', 'social-proof', 'marketing', 'reviews'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['hero-sections', 'pricing-sections', 'cta-sections'],
};

@Component({
  selector: 'app-testimonial-sections-catalog-page',
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
export class TestimonialSectionsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
