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

import { FeatureSection1Component } from '../../blocks/feature-sections/feature-section-1/feature-section-1.component';
import { FeatureSection2Component } from '../../blocks/feature-sections/feature-section-2/feature-section-2.component';
import { FeatureSection3Component } from '../../blocks/feature-sections/feature-section-3/feature-section-3.component';
import { FeatureSection4Component } from '../../blocks/feature-sections/feature-section-4/feature-section-4.component';
import { FeatureSection5Component } from '../../blocks/feature-sections/feature-section-5/feature-section-5.component';
import { FeatureSection6Component } from '../../blocks/feature-sections/feature-section-6/feature-section-6.component';
import { FeatureSection7Component } from '../../blocks/feature-sections/feature-section-7/feature-section-7.component';
import { FeatureSection8Component } from '../../blocks/feature-sections/feature-section-8/feature-section-8.component';
import { FeatureSection9Component } from '../../blocks/feature-sections/feature-section-9/feature-section-9.component';
import { FeatureSection10Component } from '../../blocks/feature-sections/feature-section-10/feature-section-10.component';
import { FeatureSection11Component } from '../../blocks/feature-sections/feature-section-11/feature-section-11.component';
import { FeatureSection12Component } from '../../blocks/feature-sections/feature-section-12/feature-section-12.component';
import { FeatureSection13Component } from '../../blocks/feature-sections/feature-section-13/feature-section-13.component';
import { FeatureSection14Component } from '../../blocks/feature-sections/feature-section-14/feature-section-14.component';
import { FeatureSection15Component } from '../../blocks/feature-sections/feature-section-15/feature-section-15.component';
import { FeatureSection16Component } from '../../blocks/feature-sections/feature-section-16/feature-section-16.component';
import { FeatureSection17Component } from '../../blocks/feature-sections/feature-section-17/feature-section-17.component';
import { FeatureSection18Component } from '../../blocks/feature-sections/feature-section-18/feature-section-18.component';
import { FeatureSection19Component } from '../../blocks/feature-sections/feature-section-19/feature-section-19.component';
import { FeatureSection20Component } from '../../blocks/feature-sections/feature-section-20/feature-section-20.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'feature-section-1',
    label: 'Feature Section 1 — 三欄圖示特色',
    registryCategory: 'feature-sections',
    component: FeatureSection1Component,
    isFree: false,
  },
  {
    id: 'feature-section-2',
    label: 'Feature Section 2 — 左圖右文交錯',
    registryCategory: 'feature-sections',
    component: FeatureSection2Component,
    isFree: false,
  },
  {
    id: 'feature-section-3',
    label: 'Feature Section 3 — 卡片式特色清單',
    registryCategory: 'feature-sections',
    component: FeatureSection3Component,
    isFree: false,
  },
  {
    id: 'feature-section-4',
    label: 'Feature Section 4 — 帶數字編號流程',
    registryCategory: 'feature-sections',
    component: FeatureSection4Component,
    isFree: false,
  },
  {
    id: 'feature-section-5',
    label: 'Feature Section 5 — 圖示加說明網格',
    registryCategory: 'feature-sections',
    component: FeatureSection5Component,
    isFree: false,
  },
  {
    id: 'feature-section-6',
    label: 'Feature Section 6 — 截圖功能展示',
    registryCategory: 'feature-sections',
    component: FeatureSection6Component,
    isFree: false,
  },
  {
    id: 'feature-section-7',
    label: 'Feature Section 7 — 雙欄對比說明',
    registryCategory: 'feature-sections',
    component: FeatureSection7Component,
    isFree: false,
  },
  {
    id: 'feature-section-8',
    label: 'Feature Section 8 — 階梯式特色介紹',
    registryCategory: 'feature-sections',
    component: FeatureSection8Component,
    isFree: false,
  },
  {
    id: 'feature-section-9',
    label: 'Feature Section 9 — 圖示橫向排列',
    registryCategory: 'feature-sections',
    component: FeatureSection9Component,
    isFree: false,
  },
  {
    id: 'feature-section-10',
    label: 'Feature Section 10 — 大型截圖加重點',
    registryCategory: 'feature-sections',
    component: FeatureSection10Component,
    isFree: false,
  },
  {
    id: 'feature-section-11',
    label: 'Feature Section 11 — 圖文交錯多段',
    registryCategory: 'feature-sections',
    component: FeatureSection11Component,
    isFree: false,
  },
  {
    id: 'feature-section-12',
    label: 'Feature Section 12 — 圓形圖示卡片',
    registryCategory: 'feature-sections',
    component: FeatureSection12Component,
    isFree: false,
  },
  {
    id: 'feature-section-13',
    label: 'Feature Section 13 — 深色強調主題',
    registryCategory: 'feature-sections',
    component: FeatureSection13Component,
    isFree: false,
  },
  {
    id: 'feature-section-14',
    label: 'Feature Section 14 — 邊框圖示列表',
    registryCategory: 'feature-sections',
    component: FeatureSection14Component,
    isFree: false,
  },
  {
    id: 'feature-section-15',
    label: 'Feature Section 15 — 浮動資訊卡片',
    registryCategory: 'feature-sections',
    component: FeatureSection15Component,
    isFree: false,
  },
  {
    id: 'feature-section-16',
    label: 'Feature Section 16 — 整合品牌標誌',
    registryCategory: 'feature-sections',
    component: FeatureSection16Component,
    isFree: false,
  },
  {
    id: 'feature-section-17',
    label: 'Feature Section 17 — 互動式分頁特色',
    registryCategory: 'feature-sections',
    component: FeatureSection17Component,
    isFree: false,
  },
  {
    id: 'feature-section-18',
    label: 'Feature Section 18 — 影片預覽嵌入',
    registryCategory: 'feature-sections',
    component: FeatureSection18Component,
    isFree: false,
  },
  {
    id: 'feature-section-19',
    label: 'Feature Section 19 — 圖示加連結列表',
    registryCategory: 'feature-sections',
    component: FeatureSection19Component,
    isFree: false,
  },
  {
    id: 'feature-section-20',
    label: 'Feature Section 20 — 大型網格特色矩陣',
    registryCategory: 'feature-sections',
    component: FeatureSection20Component,
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
      description: '產品特色內容區塊（圖示、標題、說明文字、附加圖像）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '產品著陸頁：條列展示產品的核心特色與差異化價值',
    '功能介紹頁：搭配截圖或圖示說明每項功能的具體效益',
    '版本更新公告：列出本次釋出的新增功能與改進項目',
    'B2B 解決方案頁：以功能矩陣形式呈現可交付的能力',
    '品牌價值主張：透過圖示與標題強調品牌承諾',
  ],
  whenNotToUse: [
    '純技術文件 — 應使用 Documentation Layout 與目錄導覽',
    '需要互動操作的功能展示 — 應使用 Tabs 或 Stepper',
    '比較不同方案差異 — 應使用 Pricing Table 或對照表格',
    '使用者個人化儀表板 — 應使用 Dashboard Card 而非行銷區塊',
  ],
  pitfalls: [
    '特色項目超過 6 項導致認知負擔過重，使用者無法記住重點',
    '圖示風格不一致（線性與填充混用），破壞整體視覺節奏',
    '每個特色文字長度差異過大，造成版面參差不齊',
    '使用過於抽象的圖示，使用者無法直觀理解該功能用途',
    '所有特色都使用相同強度的呈現方式，缺乏主次優先層級',
  ],
  accessibility: [
    '每個特色卡片使用語意化標題標籤（h2 或 h3）建立清晰大綱',
    '裝飾性圖示加上 aria-hidden="true"，避免螢幕閱讀器朗讀',
    '若圖示帶有意義，應使用 role="img" 並提供 aria-label 描述',
    '網格項目使用 role="list" 與 role="listitem" 強化語意結構',
    '互動式特色卡片需支援鍵盤焦點環、Enter/Space 觸發',
  ],
};

const META: CatalogBlockMeta = {
  id: 'feature-sections',
  title: 'Feature Sections',
  category: 'marketing',
  subcategory: 'Marketing Page Sections',
  summary:
    '產品特色展示區塊，以多種版面（網格、列表、圖文交錯、卡片）呈現產品功能與差異化價值，是行銷頁面承接英雄區後的關鍵說服段。',
  tags: ['features', 'marketing', 'landing', 'grid'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['hero-sections', 'cta-sections', 'bento-grids'],
};

@Component({
  selector: 'app-feature-sections-catalog-page',
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
export class FeatureSectionsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
