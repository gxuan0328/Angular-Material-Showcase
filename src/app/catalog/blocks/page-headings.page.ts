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

import { PageHeading1Component } from '../../blocks/free-page-headings/page-heading-1/page-heading-1.component';
import { PageHeading2Component } from '../../blocks/page-headings/page-heading-2/page-heading-2.component';
import { PageHeading3Component } from '../../blocks/page-headings/page-heading-3/page-heading-3.component';
import { PageHeading4Component } from '../../blocks/page-headings/page-heading-4/page-heading-4.component';
import { PageHeading5Component } from '../../blocks/page-headings/page-heading-5/page-heading-5.component';
import { PageHeading6Component } from '../../blocks/page-headings/page-heading-6/page-heading-6.component';
import { PageHeading7Component } from '../../blocks/page-headings/page-heading-7/page-heading-7.component';
import { PageHeading8Component } from '../../blocks/page-headings/page-heading-8/page-heading-8.component';
import { PageHeading9Component } from '../../blocks/page-headings/page-heading-9/page-heading-9.component';
import { PageHeading10Component } from '../../blocks/page-headings/page-heading-10/page-heading-10.component';
import { PageHeading11Component } from '../../blocks/page-headings/page-heading-11/page-heading-11.component';
import { PageHeading12Component } from '../../blocks/page-headings/page-heading-12/page-heading-12.component';
import { PageHeading13Component } from '../../blocks/page-headings/page-heading-13/page-heading-13.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'page-heading-1',
    label: 'Page Heading 1 — 標題 + Meta 圖示 + 動作按鈕，含行動版 Menu (Free)',
    registryCategory: 'free-page-headings',
    component: PageHeading1Component,
    isFree: true,
  },
  {
    id: 'page-heading-2',
    label: 'Page Heading 2 — 標題 + 動作按鈕（精簡版）',
    registryCategory: 'page-headings',
    component: PageHeading2Component,
    isFree: false,
  },
  {
    id: 'page-heading-3',
    label: 'Page Heading 3 — 標題 + 動作按鈕 + Primary Container 背景',
    registryCategory: 'page-headings',
    component: PageHeading3Component,
    isFree: false,
  },
  {
    id: 'page-heading-4',
    label: 'Page Heading 4 — 麵包屑 + 標題 + 動作按鈕',
    registryCategory: 'page-headings',
    component: PageHeading4Component,
    isFree: false,
  },
  {
    id: 'page-heading-5',
    label: 'Page Heading 5 — 麵包屑 + 標題 + 動作按鈕 + Primary Container 背景',
    registryCategory: 'page-headings',
    component: PageHeading5Component,
    isFree: false,
  },
  {
    id: 'page-heading-6',
    label: 'Page Heading 6 — 標題 + Meta 圖示 + 動作按鈕 + Primary Container 背景',
    registryCategory: 'page-headings',
    component: PageHeading6Component,
    isFree: false,
  },
  {
    id: 'page-heading-7',
    label: 'Page Heading 7 — Banner 圖片 + 頭像（個人資料頁）',
    registryCategory: 'page-headings',
    component: PageHeading7Component,
    isFree: false,
  },
  {
    id: 'page-heading-8',
    label: 'Page Heading 8 — 頭像 + 使用者資訊 + 動作按鈕',
    registryCategory: 'page-headings',
    component: PageHeading8Component,
    isFree: false,
  },
  {
    id: 'page-heading-9',
    label: 'Page Heading 9 — 頭像 + 使用者資訊，Card 樣式',
    registryCategory: 'page-headings',
    component: PageHeading9Component,
    isFree: false,
  },
  {
    id: 'page-heading-10',
    label: 'Page Heading 10 — 麵包屑 + 標題 + Meta 圖示 + 動作按鈕',
    registryCategory: 'page-headings',
    component: PageHeading10Component,
    isFree: false,
  },
  {
    id: 'page-heading-11',
    label: 'Page Heading 11 — 麵包屑 + 標題 + Meta 圖示 + Primary Container 背景',
    registryCategory: 'page-headings',
    component: PageHeading11Component,
    isFree: false,
  },
  {
    id: 'page-heading-12',
    label: 'Page Heading 12 — 標題 + Filter Toggle 群組（Dashboard 式）',
    registryCategory: 'page-headings',
    component: PageHeading12Component,
    isFree: false,
  },
  {
    id: 'page-heading-13',
    label: 'Page Heading 13 — Logo + 公司名稱 + Meta 資訊',
    registryCategory: 'page-headings',
    component: PageHeading13Component,
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
      description:
        '所有 page-heading 變體均為純展示元件，資料以內部 readonly 屬性呈現，不提供外部 input 或 ng-content 插槽。使用時請直接複製程式碼並替換硬編碼的標題、Meta 與按鈕資料。',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '頁面需要清楚識別身份時：在每個主要頁面頂端放置 Page Heading，讓使用者在任何時刻都能確認自身所在位置。',
    '需要集中管理主要操作時：將「新增」「發佈」「匯出」等頁面級 CTA 放在 Heading 的動作區，而非分散在內容區中。',
    '具有導覽層級的頁面時：若路徑超過兩層，搭配麵包屑變體（4、5、10、11）以補充上下文，降低使用者認知負擔。',
    '個人資料或實體詳情頁時：選用 Banner + 頭像變體（7、8、9）以強調實體身份，提升視覺辨識度。',
    '需要過濾切換的列表頁時：選用 Filter Toggle 變體（12）將篩選器整合至標題列，節省頁面垂直空間。',
  ],
  whenNotToUse: [
    '對話框（Dialog）或側邊抽屜（Drawer）內部：此類容器空間有限，應改用 Dialog Title 或自訂 header，而非完整的 Page Heading。',
    '已有 Toolbar 或 App Bar 承擔標題職責時：避免雙重標題，否則會造成視覺層級混亂。',
  ],
  pitfalls: [
    '動作按鈕過多：Page Heading 的動作區最多放置 3 個主要按鈕；額外操作移至下拉 Menu（參考變體 1），以免橫向空間在小螢幕溢出。',
    '未處理行動裝置折疊：在小螢幕上標題與動作列需垂直堆疊（lg:flex），忽略響應式將導致內容被截斷或按鈕重疊。',
    '麵包屑路徑與實際路由不同步：麵包屑的 href 必須對應真實路由，靜態硬編碼會在 SPA 路由變動後失效，應由 Router 動態生成。',
  ],
  accessibility: [
    '為 `<h1>`/`<h2>` 保持頁面唯一且連續的標題層級；Page Heading 通常使用 `<h1>`，避免跳過層級（如直接從 `<h1>` 跳至 `<h3>`）。',
    '麵包屑列表應加上 `aria-label="Breadcrumbs"` 的 `<nav>` 包裹，並以 `aria-current="page"` 標記最後一項。',
    '動作按鈕務必提供可辨識文字（可見文字或 `aria-label`）；Icon-only 按鈕需補上 `aria-label` 及 `title` 屬性。',
    '色彩對比需符合 WCAG AA（正文 4.5:1、大字 3:1）；使用 Primary Container 背景的變體（3、5、6、11）請驗證 `text-on-primary-container` 的對比值是否達標。',
    '焦點順序應從標題 → 麵包屑（若有）→ Meta → 動作按鈕，確保鍵盤使用者能夠依序操作，不被隱藏元素攔截。',
  ],
};

const META: CatalogBlockMeta = {
  id: 'page-headings',
  title: 'Page Headings',
  category: 'application',
  subcategory: 'Headings',
  summary: '頁面頂部標題列，包含麵包屑、標題、副標題與動作按鈕，提供清楚的頁面身份與主要操作入口。',
  tags: ['heading', 'title', 'breadcrumb', 'application'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['section-headings', 'page-shells'],
};

@Component({
  selector: 'app-page-headings-catalog-page',
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
export class PageHeadingsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
