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

import { StatsSection1Component } from '../../blocks/free-stats-sections/stats-section-1/stats-section-1.component';
import { StatsSection2Component } from '../../blocks/free-stats-sections/stats-section-2/stats-section-2.component';
import { StatsSection3Component } from '../../blocks/free-stats-sections/stats-section-3/stats-section-3.component';
import { StatsSection4Component } from '../../blocks/stats-sections/stats-section-4/stats-section-4.component';
import { StatsSection5Component } from '../../blocks/stats-sections/stats-section-5/stats-section-5.component';
import { StatsSection6Component } from '../../blocks/stats-sections/stats-section-6/stats-section-6.component';
import { StatsSection7Component } from '../../blocks/stats-sections/stats-section-7/stats-section-7.component';
import { StatsSection8Component } from '../../blocks/stats-sections/stats-section-8/stats-section-8.component';
import { StatsSection9Component } from '../../blocks/stats-sections/stats-section-9/stats-section-9.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'stats-section-1',
    label: 'Stats Section 1 — 三欄基本數據',
    registryCategory: 'free-stats-sections',
    component: StatsSection1Component,
    isFree: true,
  },
  {
    id: 'stats-section-2',
    label: 'Stats Section 2 — 深色強調數字',
    registryCategory: 'free-stats-sections',
    component: StatsSection2Component,
    isFree: true,
  },
  {
    id: 'stats-section-3',
    label: 'Stats Section 3 — 圖示加數據卡片',
    registryCategory: 'free-stats-sections',
    component: StatsSection3Component,
    isFree: true,
  },
  {
    id: 'stats-section-4',
    label: 'Stats Section 4 — 大型主數字搭配說明',
    registryCategory: 'stats-sections',
    component: StatsSection4Component,
    isFree: false,
  },
  {
    id: 'stats-section-5',
    label: 'Stats Section 5 — 圖文混合成果展示',
    registryCategory: 'stats-sections',
    component: StatsSection5Component,
    isFree: false,
  },
  {
    id: 'stats-section-6',
    label: 'Stats Section 6 — 漸層背景數據區',
    registryCategory: 'stats-sections',
    component: StatsSection6Component,
    isFree: false,
  },
  {
    id: 'stats-section-7',
    label: 'Stats Section 7 — 趨勢百分比強調',
    registryCategory: 'stats-sections',
    component: StatsSection7Component,
    isFree: false,
  },
  {
    id: 'stats-section-8',
    label: 'Stats Section 8 — 多欄關鍵指標',
    registryCategory: 'stats-sections',
    component: StatsSection8Component,
    isFree: false,
  },
  {
    id: 'stats-section-9',
    label: 'Stats Section 9 — 整合 CTA 數據區',
    registryCategory: 'stats-sections',
    component: StatsSection9Component,
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
      description: '數據統計內容（數值、單位、指標說明、趨勢圖示）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '行銷頁面成果展示：以具體數字證明產品價值與市場成績',
    '關於我們頁面：呈現公司規模、客戶數量、服務年資等關鍵里程碑',
    '案例研究頁：列出實際導入後的量化效益（成長率、節省成本）',
    '年度報告或公司簡介：以數據強化企業可信度',
    '招募頁面：透過數字呈現團隊規模與成長動能',
  ],
  whenNotToUse: [
    '即時資料儀表板 — 應使用 KPI Card 或 Chart 元件支援動態更新',
    '需要篩選或鑽取分析的數據 — 應使用 Data Table 或 Pivot Table',
    '財務報表或詳細統計 — 應使用結構化表格而非行銷區塊',
    '單一數據點重點呈現 — 應使用 Hero Section 搭配大型數字',
  ],
  pitfalls: [
    '使用假數據或來源不明的統計，破壞品牌可信度',
    '數字過小或對比不足，無法在掃讀時被使用者注意到',
    '單位與數字脫節（如 99%、100K+）使用者無法快速理解尺度',
    '過度堆疊指標（超過 6 項），失去重點與記憶點',
    '未加上時間範圍或來源註記，使數字失去脈絡與真實感',
  ],
  accessibility: [
    '數字使用語意化標籤包裝（如 strong 或 dt/dd），強化結構',
    '提供完整文字版本，例如「服務超過 10,000 名使用者」而非僅「10K+」',
    '裝飾性圖示加上 aria-hidden="true"，避免螢幕閱讀器朗讀',
    '若使用動畫計數器，需提供 prefers-reduced-motion 替代呈現',
    '色彩編碼的趨勢箭頭（向上綠、向下紅）需搭配文字標籤輔助說明',
  ],
};

const META: CatalogBlockMeta = {
  id: 'stats-sections',
  title: 'Stats Sections',
  category: 'marketing',
  subcategory: 'Marketing Page Sections',
  summary:
    '行銷數據展示區塊，以大型數字、百分比與圖示呈現產品成果、公司規模或關鍵里程碑，建立信任與說服力。',
  tags: ['stats', 'numbers', 'metrics', 'marketing'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['feature-sections', 'cta-sections', 'hero-sections'],
};

@Component({
  selector: 'app-stats-sections-catalog-page',
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
export class StatsSectionsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
