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

import { SimpleTableComponent } from '../../blocks/free-tables/simple-table/simple-table.component';
import { AvatarsMultiLineTableComponent } from '../../blocks/tables/avatars-multi-line-table/avatars-multi-line-table.component';
import { ComparisionTableComponent } from '../../blocks/tables/comparision-table/comparision-table.component';
import { CondensedContentTableComponent } from '../../blocks/tables/condensed-content-table/condensed-content-table.component';
import { FilterHttpDataSourceTableComponent } from '../../blocks/tables/filter-http-data-source-table/filter-http-data-source-table.component';
import { FilterSelectTableComponent } from '../../blocks/tables/filter-select-table/filter-select-table.component';
import { FullWidthAvatarTableComponent } from '../../blocks/tables/full-width-avatar-table/full-width-avatar-table.component';
import { FullWidthTableComponent } from '../../blocks/tables/full-width-table/full-width-table.component';
import { GroupedRowsTableComponent } from '../../blocks/tables/grouped-rows-table/grouped-rows-table.component';
import { HiddenColumnsTableComponent } from '../../blocks/tables/hidden-columns-table/hidden-columns-table.component';
import { HiddenHeadingsTableComponent } from '../../blocks/tables/hidden-headings-table/hidden-headings-table.component';
import { SimpleCardTableComponent } from '../../blocks/tables/simple-card-table/simple-card-table.component';
import { StackedColumnsTableComponent } from '../../blocks/tables/stacked-columns-table/stacked-columns-table.component';
import { StickyHeaderTableComponent } from '../../blocks/tables/sticky-header-table/sticky-header-table.component';
import { StripedRowsTableComponent } from '../../blocks/tables/striped-rows-table/striped-rows-table.component';
import { SummaryRowsTableComponent } from '../../blocks/tables/summary-rows-table/summary-rows-table.component';
import { TableWithChartComponent } from '../../blocks/tables/table-with-chart/table-with-chart.component';
import { VerticalLinesTableComponent } from '../../blocks/tables/vertical-lines-table/vertical-lines-table.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'simple-table',
    label: 'Simple Table — 基本表格（Free）',
    registryCategory: 'free-tables',
    component: SimpleTableComponent,
    isFree: true,
  },
  {
    id: 'avatars-multi-line-table',
    label: 'Avatars Multi-line — 含頭像多行表格',
    registryCategory: 'tables',
    component: AvatarsMultiLineTableComponent,
    isFree: false,
  },
  {
    id: 'comparision-table',
    label: 'Comparison Table — 方案比較表',
    registryCategory: 'tables',
    component: ComparisionTableComponent,
    isFree: false,
  },
  {
    id: 'condensed-content-table',
    label: 'Condensed Content — 緊湊內容表格',
    registryCategory: 'tables',
    component: CondensedContentTableComponent,
    isFree: false,
  },
  {
    id: 'filter-http-data-source-table',
    label: 'Filter + HTTP DataSource — GitHub API 即時查詢',
    registryCategory: 'tables',
    component: FilterHttpDataSourceTableComponent,
    isFree: false,
  },
  {
    id: 'filter-select-table',
    label: 'Filter + Select — 篩選加下拉選擇',
    registryCategory: 'tables',
    component: FilterSelectTableComponent,
    isFree: false,
  },
  {
    id: 'full-width-avatar-table',
    label: 'Full-width Avatar — 滿版頭像表格',
    registryCategory: 'tables',
    component: FullWidthAvatarTableComponent,
    isFree: false,
  },
  {
    id: 'full-width-table',
    label: 'Full-width Table — 滿版基本表格',
    registryCategory: 'tables',
    component: FullWidthTableComponent,
    isFree: false,
  },
  {
    id: 'grouped-rows-table',
    label: 'Grouped Rows — 分組列表格',
    registryCategory: 'tables',
    component: GroupedRowsTableComponent,
    isFree: false,
  },
  {
    id: 'hidden-columns-table',
    label: 'Hidden Columns — 可隱藏欄位表格',
    registryCategory: 'tables',
    component: HiddenColumnsTableComponent,
    isFree: false,
  },
  {
    id: 'hidden-headings-table',
    label: 'Hidden Headings — 隱藏標題行表格',
    registryCategory: 'tables',
    component: HiddenHeadingsTableComponent,
    isFree: false,
  },
  {
    id: 'simple-card-table',
    label: 'Simple Card — 卡片式表格',
    registryCategory: 'tables',
    component: SimpleCardTableComponent,
    isFree: false,
  },
  {
    id: 'stacked-columns-table',
    label: 'Stacked Columns — 堆疊欄位表格',
    registryCategory: 'tables',
    component: StackedColumnsTableComponent,
    isFree: false,
  },
  {
    id: 'sticky-header-table',
    label: 'Sticky Header — 固定表頭表格',
    registryCategory: 'tables',
    component: StickyHeaderTableComponent,
    isFree: false,
  },
  {
    id: 'striped-rows-table',
    label: 'Striped Rows — 斑馬紋表格',
    registryCategory: 'tables',
    component: StripedRowsTableComponent,
    isFree: false,
  },
  {
    id: 'summary-rows-table',
    label: 'Summary Rows — 含小計列表格',
    registryCategory: 'tables',
    component: SummaryRowsTableComponent,
    isFree: false,
  },
  {
    id: 'table-with-chart',
    label: 'Table with Chart — 表格加圖表',
    registryCategory: 'tables',
    component: TableWithChartComponent,
    isFree: false,
  },
  {
    id: 'vertical-lines-table',
    label: 'Vertical Lines — 垂直分隔線表格',
    registryCategory: 'tables',
    component: VerticalLinesTableComponent,
    isFree: false,
  },
];

const API: ApiDocumentation = {
  inputs: [
    {
      name: 'dataSource',
      type: 'MatTableDataSource<T> | T[]',
      default: '內建示範資料',
      required: false,
      description: '表格資料來源，可為陣列或 MatTableDataSource 以支援排序/分頁/篩選',
    },
    {
      name: 'displayedColumns',
      type: 'string[]',
      default: '對應示範資料的欄位',
      required: false,
      description: '顯示欄位的 key 陣列，決定渲染順序',
    },
  ],
  outputs: [],
  slots: [],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '需要呈現大量結構化資料並允許使用者排序、篩選、分頁',
    '資料行之間存在明確可比較的欄位（如使用者管理、訂單列表）',
    '需要支援批次選取與批次動作（停用、刪除、匯出）',
    '希望固定表頭方便使用者捲動時保留欄位對齊資訊',
  ],
  whenNotToUse: [
    '每筆資料擁有大量自由格式內容 — 改用 Stacked Lists 或卡片列表',
    '資料筆數極少（< 5 筆）— 簡單列表或定義清單更容易閱讀',
    '主要為視覺元素展示（圖片、影片）— 改用 Grid Lists',
    '行動裝置為主要使用情境 — 考慮 Stacked Columns 或卡片式變體',
  ],
  pitfalls: [
    '一次載入所有資料卻不分頁 — 大資料量下效能與記憶體問題顯著',
    '欄位寬度未設定 min-width 導致內容溢出或截斷難以閱讀',
    '排序狀態未持久化 — 使用者返回後又需重新排序',
    '批次動作沒有二次確認 — 誤按導致無法復原的資料異動',
    '缺少無障礙標題 `<caption>` 或 `aria-label` 描述表格內容',
  ],
  accessibility: [
    '每個表格提供 `<caption>` 或 `aria-labelledby` 描述內容用途',
    '可排序欄位使用 `mat-sort-header` 並搭配 `aria-sort` 狀態',
    '批次選取欄位使用 `aria-label="全選"` 與 `aria-describedby`',
    '空資料狀態透過 `role="status"` 與 `aria-live="polite"` 宣告',
    '確保鍵盤可存取所有互動元素（sort、篩選、分頁、行內動作）',
  ],
};

const META: CatalogBlockMeta = {
  id: 'tables',
  title: 'Tables',
  category: 'application',
  subcategory: 'Lists',
  summary:
    '表格集合，涵蓋基本排版、固定表頭、可篩選、分組列、含圖表等常見版型，適合使用者管理、訂單列表、報表呈現等資料密集場景。',
  tags: ['table', 'data-grid', 'list', 'crud'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['stacked-lists', 'grid-lists', 'empty-states'],
};

@Component({
  selector: 'app-tables-catalog-page',
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
export class TablesCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
