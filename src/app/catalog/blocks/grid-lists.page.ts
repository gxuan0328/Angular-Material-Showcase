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

import { GridList1Component } from '../../blocks/free-grid-lists/grid-list-1/grid-list-1.component';
import { GridList2Component } from '../../blocks/grid-lists/grid-list-2/grid-list-2.component';
import { GridList3Component } from '../../blocks/grid-lists/grid-list-3/grid-list-3.component';
import { GridList4Component } from '../../blocks/grid-lists/grid-list-4/grid-list-4.component';
import { GridList5Component } from '../../blocks/grid-lists/grid-list-5/grid-list-5.component';
import { GridList6Component } from '../../blocks/grid-lists/grid-list-6/grid-list-6.component';
import { GridList7Component } from '../../blocks/grid-lists/grid-list-7/grid-list-7.component';
import { GridList8Component } from '../../blocks/grid-lists/grid-list-8/grid-list-8.component';
import { GridList9Component } from '../../blocks/grid-lists/grid-list-9/grid-list-9.component';
import { GridList10Component } from '../../blocks/grid-lists/grid-list-10/grid-list-10.component';
import { GridList11Component } from '../../blocks/grid-lists/grid-list-11/grid-list-11.component';
import { GridList12Component } from '../../blocks/grid-lists/grid-list-12/grid-list-12.component';
import { GridList13Component } from '../../blocks/grid-lists/grid-list-13/grid-list-13.component';
import { GridList14Component } from '../../blocks/grid-lists/grid-list-14/grid-list-14.component';
import { GridList15Component } from '../../blocks/grid-lists/grid-list-15/grid-list-15.component';

const VARIANTS: readonly BlockVariant[] = [
  { id: 'grid-list-1', label: 'Grid List 01 — 基本圖片網格（Free）', registryCategory: 'free-grid-lists', component: GridList1Component, isFree: true },
  { id: 'grid-list-2', label: 'Grid List 02 — 含標題與描述', registryCategory: 'grid-lists', component: GridList2Component, isFree: false },
  { id: 'grid-list-3', label: 'Grid List 03 — 卡片式網格', registryCategory: 'grid-lists', component: GridList3Component, isFree: false },
  { id: 'grid-list-4', label: 'Grid List 04 — 人物頭像網格', registryCategory: 'grid-lists', component: GridList4Component, isFree: false },
  { id: 'grid-list-5', label: 'Grid List 05 — 作品集網格', registryCategory: 'grid-lists', component: GridList5Component, isFree: false },
  { id: 'grid-list-6', label: 'Grid List 06 — 產品目錄網格', registryCategory: 'grid-lists', component: GridList6Component, isFree: false },
  { id: 'grid-list-7', label: 'Grid List 07 — 含 overlay 的圖片網格', registryCategory: 'grid-lists', component: GridList7Component, isFree: false },
  { id: 'grid-list-8', label: 'Grid List 08 — 含標籤的卡片網格', registryCategory: 'grid-lists', component: GridList8Component, isFree: false },
  { id: 'grid-list-9', label: 'Grid List 09 — 整合整合清單', registryCategory: 'grid-lists', component: GridList9Component, isFree: false },
  { id: 'grid-list-10', label: 'Grid List 10 — 檔案管理網格', registryCategory: 'grid-lists', component: GridList10Component, isFree: false },
  { id: 'grid-list-11', label: 'Grid List 11 — 媒體庫網格', registryCategory: 'grid-lists', component: GridList11Component, isFree: false },
  { id: 'grid-list-12', label: 'Grid List 12 — 含動作按鈕的網格', registryCategory: 'grid-lists', component: GridList12Component, isFree: false },
  { id: 'grid-list-13', label: 'Grid List 13 — 緊湊網格', registryCategory: 'grid-lists', component: GridList13Component, isFree: false },
  { id: 'grid-list-14', label: 'Grid List 14 — 含狀態指示器', registryCategory: 'grid-lists', component: GridList14Component, isFree: false },
  { id: 'grid-list-15', label: 'Grid List 15 — 混合尺寸網格', registryCategory: 'grid-lists', component: GridList15Component, isFree: false },
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
      description: '網格列表項目（圖片、卡片、人物等）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '展示視覺優先的內容如圖片、作品集、產品目錄、媒體庫',
    '整合目錄需要以磁磚呈現第三方服務圖示與狀態',
    '檔案管理器以縮圖形式瀏覽大量檔案',
    '人物卡片集合（團隊、客戶、講者介紹）',
  ],
  whenNotToUse: [
    '資料比對導向的場景 — Tables 更適合',
    '需要閱讀流暢的連續文字 — Stacked Lists 較佳',
    '空間有限的窄版介面 — 考慮縮減為單欄 Stacked List',
  ],
  pitfalls: [
    '網格項目大小不一致造成破碎視覺 — 需設定固定寬高比',
    '過多欄位導致行動裝置每欄過窄難以閱讀',
    '圖片載入過慢造成版面位移 — 應使用 NgOptimizedImage 或 placeholder',
    '缺少 hover / focus 視覺回饋，使用者不確定是否可點擊',
  ],
  accessibility: [
    '網格使用 `role="list"` 與 `role="listitem"` 保留語意',
    '純裝飾性圖片使用 `alt=""`，內容圖片提供描述性 alt',
    '可點擊的網格項目應有鍵盤 focus ring 與可聚焦 tabindex',
    '對於 overlay 內容確保文字與背景對比度符合 WCAG AA',
  ],
};

const META: CatalogBlockMeta = {
  id: 'grid-lists',
  title: 'Grid Lists',
  category: 'application',
  subcategory: 'Lists',
  summary:
    '網格式列表集合，適合展示視覺優先內容如圖片、作品集、整合目錄、媒體庫、產品列表等需要並列呈現的場景。',
  tags: ['grid', 'gallery', 'list', 'media'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['stacked-lists', 'tables', 'bento-grids'],
};

@Component({
  selector: 'app-grid-lists-catalog-page',
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
export class GridListsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
