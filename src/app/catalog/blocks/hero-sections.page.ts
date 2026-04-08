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

import { HeroSection1Component } from '../../blocks/hero-sections/hero-section-1/hero-section-1.component';
import { HeroSection2Component } from '../../blocks/hero-sections/hero-section-2/hero-section-2.component';
import { HeroSection3Component } from '../../blocks/hero-sections/hero-section-3/hero-section-3.component';
import { HeroSection4Component } from '../../blocks/hero-sections/hero-section-4/hero-section-4.component';
import { HeroSection5Component } from '../../blocks/hero-sections/hero-section-5/hero-section-5.component';
import { HeroSection6Component } from '../../blocks/hero-sections/hero-section-6/hero-section-6.component';
import { HeroSection7Component } from '../../blocks/hero-sections/hero-section-7/hero-section-7.component';
import { HeroSection8Component } from '../../blocks/hero-sections/hero-section-8/hero-section-8.component';
import { HeroSection9Component } from '../../blocks/hero-sections/hero-section-9/hero-section-9.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'hero-section-1',
    label: 'Hero Section 1 — 左文右圖英雄區',
    registryCategory: 'hero-sections',
    component: HeroSection1Component,
    isFree: false,
  },
  {
    id: 'hero-section-2',
    label: 'Hero Section 2 — 置中標題與雙按鈕',
    registryCategory: 'hero-sections',
    component: HeroSection2Component,
    isFree: false,
  },
  {
    id: 'hero-section-3',
    label: 'Hero Section 3 — 漸層背景強調',
    registryCategory: 'hero-sections',
    component: HeroSection3Component,
    isFree: false,
  },
  {
    id: 'hero-section-4',
    label: 'Hero Section 4 — 全幅圖像背景',
    registryCategory: 'hero-sections',
    component: HeroSection4Component,
    isFree: false,
  },
  {
    id: 'hero-section-5',
    label: 'Hero Section 5 — 影片背景沉浸式',
    registryCategory: 'hero-sections',
    component: HeroSection5Component,
    isFree: false,
  },
  {
    id: 'hero-section-6',
    label: 'Hero Section 6 — 訂閱表單嵌入',
    registryCategory: 'hero-sections',
    component: HeroSection6Component,
    isFree: false,
  },
  {
    id: 'hero-section-7',
    label: 'Hero Section 7 — 產品截圖展示',
    registryCategory: 'hero-sections',
    component: HeroSection7Component,
    isFree: false,
  },
  {
    id: 'hero-section-8',
    label: 'Hero Section 8 — 多欄特色預覽',
    registryCategory: 'hero-sections',
    component: HeroSection8Component,
    isFree: false,
  },
  {
    id: 'hero-section-9',
    label: 'Hero Section 9 — 大型行動呼籲',
    registryCategory: 'hero-sections',
    component: HeroSection9Component,
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
      description: '英雄區主要內容（標題、副標、行動呼籲按鈕、視覺素材）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '行銷網站首頁：第一屏快速傳達產品定位與核心價值主張',
    '產品著陸頁：搭配主要 CTA 按鈕引導使用者進入註冊或試用流程',
    '活動專屬頁面：以大圖與標題創造強烈視覺記憶點',
    '品牌故事頁：透過情境圖像傳達品牌調性',
    '版本發佈頁：突顯新版本主打功能與升級價值',
  ],
  whenNotToUse: [
    '應用程式內部頁面 — 應使用 Page Heading 或 App Bar 維持資訊密度',
    '需呈現大量列表或表格的頁面 — 巨大英雄區會壓縮主要內容空間',
    '管理後台或儀表板 — 使用者目標明確，毋需行銷導引',
    '法務、條款、政策等純文字頁面 — 應採用簡潔的標題排版',
  ],
  pitfalls: [
    'CTA 按鈕缺乏明確動詞或價值承諾，使用者不知道下一步要做什麼',
    '使用過大的背景圖像導致首屏載入時間過長，影響 LCP 指標',
    '文字與背景對比不足，在不同裝置或亮度下可讀性低落',
    '行動裝置上文字溢出或圖片裁切不當，破壞視覺重點',
    '同時放置過多 CTA 與資訊，分散使用者注意力與決策路徑',
  ],
  accessibility: [
    '主標題使用 h1 語意標籤，確保每頁僅有一個主要標題',
    '背景圖像使用 CSS background 而非 img；裝飾性圖片設定 alt=""',
    'CTA 按鈕需有明確可見文字或 aria-label，避免僅以圖示呈現',
    '文字與背景對比比例至少達 WCAG AA 4.5:1，必要時加上半透明遮罩',
    '影片背景須提供暫停控制，並避免自動播放音訊以符合無障礙規範',
  ],
};

const META: CatalogBlockMeta = {
  id: 'hero-sections',
  title: 'Hero Sections',
  category: 'marketing',
  subcategory: 'Marketing Page Sections',
  summary:
    '行銷頁面首屏英雄區，整合主標題、副標、行動呼籲與視覺素材，是傳達產品核心價值與引導轉換的關鍵版位。',
  tags: ['hero', 'landing', 'marketing', 'cta'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['cta-sections', 'header-sections', 'feature-sections'],
};

@Component({
  selector: 'app-hero-sections-catalog-page',
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
export class HeroSectionsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
