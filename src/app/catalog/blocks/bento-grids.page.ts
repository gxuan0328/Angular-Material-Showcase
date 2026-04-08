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

import { BentoGrid1Component } from '../../blocks/bento-grids/bento-grid-1/bento-grid-1.component';
import { BentoGrid2Component } from '../../blocks/bento-grids/bento-grid-2/bento-grid-2.component';
import { BentoGrid3Component } from '../../blocks/bento-grids/bento-grid-3/bento-grid-3.component';
import { BentoGrid4Component } from '../../blocks/bento-grids/bento-grid-4/bento-grid-4.component';
import { BentoGrid5Component } from '../../blocks/bento-grids/bento-grid-5/bento-grid-5.component';
import { BentoGrid6Component } from '../../blocks/bento-grids/bento-grid-6/bento-grid-6.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'bento-grid-1',
    label: 'Bento Grid 1 — 經典便當盒佈局',
    registryCategory: 'bento-grids',
    component: BentoGrid1Component,
    isFree: false,
  },
  {
    id: 'bento-grid-2',
    label: 'Bento Grid 2 — 大小錯落特色格',
    registryCategory: 'bento-grids',
    component: BentoGrid2Component,
    isFree: false,
  },
  {
    id: 'bento-grid-3',
    label: 'Bento Grid 3 — 產品截圖拼貼',
    registryCategory: 'bento-grids',
    component: BentoGrid3Component,
    isFree: false,
  },
  {
    id: 'bento-grid-4',
    label: 'Bento Grid 4 — 中央主格周邊副格',
    registryCategory: 'bento-grids',
    component: BentoGrid4Component,
    isFree: false,
  },
  {
    id: 'bento-grid-5',
    label: 'Bento Grid 5 — 深色玻璃擬態風',
    registryCategory: 'bento-grids',
    component: BentoGrid5Component,
    isFree: false,
  },
  {
    id: 'bento-grid-6',
    label: 'Bento Grid 6 — 圖示加說明矩陣',
    registryCategory: 'bento-grids',
    component: BentoGrid6Component,
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
      description: '便當盒網格內容（不同尺寸的特色卡片、圖像、說明文字）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '產品著陸頁：以視覺化拼貼方式同時呈現多個特色，創造記憶點',
    '品牌作品集：用不同尺寸卡片強調主次作品的層級關係',
    '功能總覽頁：整合圖像、文字、互動元件於同一視覺區塊',
    '行銷活動頁：搭配豐富視覺素材建立沉浸式體驗',
    '需要打破制式網格、創造設計亮點的高識別度頁面',
  ],
  whenNotToUse: [
    '純資訊性頁面 — 應使用標準網格保持掃讀效率',
    '需要嚴格對齊的資料展示 — 應使用 Data Table 或對稱網格',
    '行動裝置優先的窄版面 — 便當盒佈局在小螢幕難以維持視覺意圖',
    '無障礙需求極高的政府或法務頁面 — 複雜佈局可能影響螢幕閱讀器順序',
  ],
  pitfalls: [
    '格子尺寸差異過大，主次關係反而混亂無章',
    '行動裝置上未重新排列為單欄，導致內容擠壓變形',
    '每格內容類型差異過大（圖像、長文、按鈕混雜），破壞統一感',
    '過度使用動畫或玻璃擬態效果，犧牲效能與可讀性',
    '主格內容過於複雜，使用者需要仔細解讀才能理解',
  ],
  accessibility: [
    'CSS Grid 視覺順序與 DOM 順序需一致，避免螢幕閱讀器跳躍',
    '每個格子使用語意化標籤（article、section）標識內容角色',
    '裝飾性圖像加上 alt=""，內容性圖像提供完整替代文字',
    '互動格子需可使用鍵盤聚焦，並提供清晰的 focus 視覺指示',
    '色彩對比比例至少達 WCAG AA 標準，玻璃擬態背景需特別留意',
  ],
};

const META: CatalogBlockMeta = {
  id: 'bento-grids',
  title: 'Bento Grids',
  category: 'marketing',
  subcategory: 'Marketing Page Sections',
  summary:
    '便當盒風格的不對稱網格區塊，以大小錯落的格子同時展示多個產品特色與視覺素材，是現代行銷頁面常見的高識別度版位。',
  tags: ['bento', 'grid', 'features', 'marketing'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['feature-sections', 'hero-sections', 'cta-sections'],
};

@Component({
  selector: 'app-bento-grids-catalog-page',
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
export class BentoGridsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
