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

import { Filterbar1Component } from '../../blocks/filterbar/filterbar-1/filterbar-1.component';
import { Filterbar2Component } from '../../blocks/filterbar/filterbar-2/filterbar-2.component';
import { Filterbar3Component } from '../../blocks/filterbar/filterbar-3/filterbar-3.component';
import { Filterbar4Component } from '../../blocks/filterbar/filterbar-4/filterbar-4.component';
import { Filterbar5Component } from '../../blocks/filterbar/filterbar-5/filterbar-5.component';
import { Filterbar6Component } from '../../blocks/filterbar/filterbar-6/filterbar-6.component';
import { Filterbar7Component } from '../../blocks/filterbar/filterbar-7/filterbar-7.component';
import { Filterbar8Component } from '../../blocks/filterbar/filterbar-8/filterbar-8.component';
import { Filterbar9Component } from '../../blocks/filterbar/filterbar-9/filterbar-9.component';
import { Filterbar10Component } from '../../blocks/filterbar/filterbar-10/filterbar-10.component';
import { Filterbar11Component } from '../../blocks/filterbar/filterbar-11/filterbar-11.component';
import { Filterbar12Component } from '../../blocks/filterbar/filterbar-12/filterbar-12.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'filterbar-1',
    label: 'Filter Bar 01 — 基本篩選列',
    registryCategory: 'filterbar',
    component: Filterbar1Component,
    isFree: false,
  },
  {
    id: 'filterbar-2',
    label: 'Filter Bar 02 — 多條件搜尋篩選',
    registryCategory: 'filterbar',
    component: Filterbar2Component,
    isFree: false,
  },
  {
    id: 'filterbar-3',
    label: 'Filter Bar 03 — 日期區間篩選',
    registryCategory: 'filterbar',
    component: Filterbar3Component,
    isFree: false,
  },
  {
    id: 'filterbar-4',
    label: 'Filter Bar 04 — Chip 標籤篩選',
    registryCategory: 'filterbar',
    component: Filterbar4Component,
    isFree: false,
  },
  {
    id: 'filterbar-5',
    label: 'Filter Bar 05 — 側邊抽屜篩選',
    registryCategory: 'filterbar',
    component: Filterbar5Component,
    isFree: false,
  },
  {
    id: 'filterbar-6',
    label: 'Filter Bar 06 — 含進階搜尋',
    registryCategory: 'filterbar',
    component: Filterbar6Component,
    isFree: false,
  },
  {
    id: 'filterbar-7',
    label: 'Filter Bar 07 — 含快速操作',
    registryCategory: 'filterbar',
    component: Filterbar7Component,
    isFree: false,
  },
  {
    id: 'filterbar-8',
    label: 'Filter Bar 08 — 緊湊篩選列',
    registryCategory: 'filterbar',
    component: Filterbar8Component,
    isFree: false,
  },
  {
    id: 'filterbar-9',
    label: 'Filter Bar 09 — 含儲存條件',
    registryCategory: 'filterbar',
    component: Filterbar9Component,
    isFree: false,
  },
  {
    id: 'filterbar-10',
    label: 'Filter Bar 10 — 多選下拉篩選',
    registryCategory: 'filterbar',
    component: Filterbar10Component,
    isFree: false,
  },
  {
    id: 'filterbar-11',
    label: 'Filter Bar 11 — 含分類標籤',
    registryCategory: 'filterbar',
    component: Filterbar11Component,
    isFree: false,
  },
  {
    id: 'filterbar-12',
    label: 'Filter Bar 12 — 全能型篩選列',
    registryCategory: 'filterbar',
    component: Filterbar12Component,
    isFree: false,
  },
];

const API: ApiDocumentation = {
  inputs: [
    {
      name: 'filterOptions',
      type: 'FilterOption[]',
      default: '內建示範選項',
      required: false,
      description: '篩選條件選項清單；實際串接時應由父層提供',
    },
  ],
  outputs: [
    {
      name: 'filterChange',
      type: 'EventEmitter<FilterValue>',
      default: null,
      required: false,
      description: '篩選條件變更事件',
    },
  ],
  slots: [],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '列表或表格上方需要多維度篩選（狀態、角色、日期區間）',
    '報表頁面提供使用者快速切換分析維度',
    '搜尋結果頁需要 facet 細化結果',
    '資料密集的管理後台需要即時縮小檢視範圍',
  ],
  whenNotToUse: [
    '資料筆數少到不需篩選（< 10 筆）',
    '僅需單一關鍵字搜尋 — 直接用 MatFormField + input 即可',
  ],
  pitfalls: [
    '篩選條件變更未觸發立即回饋，使用者誤以為無作用',
    '複雜篩選沒有「清除所有」按鈕，使用者陷入鎖定狀態',
    '篩選結果為空時沒有明確的 Empty State 提示',
    '篩選條件過多擠壓在一行造成水平捲動',
  ],
  accessibility: [
    '篩選元件使用 `<form role="search">` 或 `aria-label` 明確身份',
    '下拉選單遵循 WAI-ARIA Combobox Pattern',
    '即時篩選結果更新透過 `aria-live="polite"` 通知',
    '清除按鈕提供 `aria-label="清除所有篩選條件"`',
  ],
};

const META: CatalogBlockMeta = {
  id: 'filterbar',
  title: 'Filter Bar',
  category: 'application',
  subcategory: 'Components',
  summary:
    '篩選列集合，提供搜尋、下拉、日期區間、Chip 等多種篩選元件組合，適合放置於列表或表格上方縮小檢視範圍。',
  tags: ['filter', 'search', 'facet', 'toolbar'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['tables', 'empty-states'],
};

@Component({
  selector: 'app-filterbar-catalog-page',
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
export class FilterbarCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
