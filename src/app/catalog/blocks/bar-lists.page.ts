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

import { BarList1Component } from '../../blocks/bar-lists/bar-list-1/bar-list-1.component';
import { BarList2Component } from '../../blocks/bar-lists/bar-list-2/bar-list-2.component';
import { BarList3Component } from '../../blocks/bar-lists/bar-list-3/bar-list-3.component';
import { BarList4Component } from '../../blocks/bar-lists/bar-list-4/bar-list-4.component';
import { BarList5Component } from '../../blocks/bar-lists/bar-list-5/bar-list-5.component';
import { BarList6Component } from '../../blocks/bar-lists/bar-list-6/bar-list-6.component';
import { BarList7Component } from '../../blocks/bar-lists/bar-list-7/bar-list-7.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'bar-list-1',
    label: 'Bar List 01 — 基本排行榜',
    registryCategory: 'bar-lists',
    component: BarList1Component,
    isFree: false,
  },
  {
    id: 'bar-list-2',
    label: 'Bar List 02 — 含對話框詳情',
    registryCategory: 'bar-lists',
    component: BarList2Component,
    isFree: false,
  },
  {
    id: 'bar-list-3',
    label: 'Bar List 03 — 含圖示標籤',
    registryCategory: 'bar-lists',
    component: BarList3Component,
    isFree: false,
  },
  {
    id: 'bar-list-4',
    label: 'Bar List 04 — 含百分比差異',
    registryCategory: 'bar-lists',
    component: BarList4Component,
    isFree: false,
  },
  {
    id: 'bar-list-5',
    label: 'Bar List 05 — 極簡風排行',
    registryCategory: 'bar-lists',
    component: BarList5Component,
    isFree: false,
  },
  {
    id: 'bar-list-6',
    label: 'Bar List 06 — 含分組標題',
    registryCategory: 'bar-lists',
    component: BarList6Component,
    isFree: false,
  },
  {
    id: 'bar-list-7',
    label: 'Bar List 07 — 含次要動作按鈕',
    registryCategory: 'bar-lists',
    component: BarList7Component,
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
      description: '進度條填色',
    },
    {
      name: '--mat-sys-on-surface',
      type: 'color',
      default: '#1a1b1f',
      required: false,
      description: '項目名稱與數值顏色',
    },
  ],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '排行榜或 Top-N 清單呈現（Top 10 頁面、熱銷商品、搜尋關鍵字）',
    '空間受限時替代橫向長條圖',
    '將數值與文字標籤緊密結合',
    '快速辨識最大值與分佈',
  ],
  whenNotToUse: [
    '連續時間序列 — 使用 Line / Area Chart',
    '多維分組比較 — 使用 Bar Chart（堆疊或分組）',
    '需要精確軸刻度 — Bar Chart 提供更完整座標',
  ],
  pitfalls: [
    'bar 長度未歸一化造成視覺誤判',
    '順序隨機而非由大到小降低可讀性',
    '文字過長被截斷但無 tooltip 顯示完整',
    '進度條顏色單一使分類難以辨識',
  ],
  accessibility: [
    '為每個項目提供 `aria-label` 包含名稱與百分比',
    '使用 `role="list"` 與 `role="listitem"` 讓螢幕閱讀器識別',
    '避免僅以顏色區分狀態',
    '提供鍵盤可聚焦的項目讓使用者閱讀詳情',
  ],
};

const META: CatalogBlockMeta = {
  id: 'bar-lists',
  title: 'Bar Lists',
  category: 'application',
  subcategory: 'Charts',
  summary:
    '排行榜風格的條列指標集合，將項目名稱、數值與進度條結合，適合呈現 Top-N 或分佈資料。',
  tags: ['chart', 'bar', 'list', 'ranking', 'top-n'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['bar-charts', 'stacked-lists', 'kpi-cards', 'chart-compositions'],
};

@Component({
  selector: 'app-bar-lists-catalog-page',
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
export class BarListsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
