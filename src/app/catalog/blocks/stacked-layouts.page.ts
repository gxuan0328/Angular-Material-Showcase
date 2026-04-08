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

import { NavWithPageHeaderComponent } from '../../blocks/free-stacked-layouts/nav-with-page-header/nav-with-page-header.component';
import { BrandNavWithOverlapComponent } from '../../blocks/stacked-layouts/brand-nav-with-overlap/brand-nav-with-overlap.component';
import { BrandNavWithPageHeaderComponent } from '../../blocks/stacked-layouts/brand-nav-with-page-header/brand-nav-with-page-header.component';
import { BrandedNavCompactHeaderComponent } from '../../blocks/stacked-layouts/branded-nav-compact-header/branded-nav-compact-header.component';
import { NavCompactHeaderComponent } from '../../blocks/stacked-layouts/nav-compact-header/nav-compact-header.component';
import { NavOnGrayBackgroundComponent } from '../../blocks/stacked-layouts/nav-on-gray-background/nav-on-gray-background.component';
import { NavWithBottomBorderComponent } from '../../blocks/stacked-layouts/nav-with-bottom-border/nav-with-bottom-border.component';
import { NavWithOverlapComponent } from '../../blocks/stacked-layouts/nav-with-overlap/nav-with-overlap.component';
import { TwoRowNavOverlapComponent } from '../../blocks/stacked-layouts/two-row-nav-overlap/two-row-nav-overlap.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'nav-with-page-header',
    label: 'Nav With Page Header — 基礎頂部導覽 + 頁首 (Free)',
    registryCategory: 'free-stacked-layouts',
    component: NavWithPageHeaderComponent,
    isFree: true,
  },
  {
    id: 'brand-nav-with-overlap',
    label: 'Brand Nav With Overlap — 品牌導覽 + 重疊內容區',
    registryCategory: 'stacked-layouts',
    component: BrandNavWithOverlapComponent,
    isFree: false,
  },
  {
    id: 'brand-nav-with-page-header',
    label: 'Brand Nav With Page Header — 品牌導覽 + 頁首',
    registryCategory: 'stacked-layouts',
    component: BrandNavWithPageHeaderComponent,
    isFree: false,
  },
  {
    id: 'branded-nav-compact-header',
    label: 'Branded Nav Compact Header — 品牌導覽 + 緊湊頁首',
    registryCategory: 'stacked-layouts',
    component: BrandedNavCompactHeaderComponent,
    isFree: false,
  },
  {
    id: 'nav-compact-header',
    label: 'Nav Compact Header — 緊湊頁首導覽',
    registryCategory: 'stacked-layouts',
    component: NavCompactHeaderComponent,
    isFree: false,
  },
  {
    id: 'nav-on-gray-background',
    label: 'Nav On Gray Background — 灰色背景導覽',
    registryCategory: 'stacked-layouts',
    component: NavOnGrayBackgroundComponent,
    isFree: false,
  },
  {
    id: 'nav-with-bottom-border',
    label: 'Nav With Bottom Border — 底線導覽列',
    registryCategory: 'stacked-layouts',
    component: NavWithBottomBorderComponent,
    isFree: false,
  },
  {
    id: 'nav-with-overlap',
    label: 'Nav With Overlap — 導覽列 + 重疊內容區',
    registryCategory: 'stacked-layouts',
    component: NavWithOverlapComponent,
    isFree: false,
  },
  {
    id: 'two-row-nav-overlap',
    label: 'Two Row Nav Overlap — 雙列導覽 + 重疊內容區',
    registryCategory: 'stacked-layouts',
    component: TwoRowNavOverlapComponent,
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
      description: '頁面主要內容區塊',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '後台 dashboard 主畫面或管理介面，需要固定頂部導覽列',
    '需要顯眼品牌識別的單欄頁面，例如行銷站台或產品首頁',
    '內容深度較淺、不需要側邊欄的資料瀏覽頁面',
    '需要在頂部提供全域搜尋、通知或帳號切換功能的應用程式',
    '使用重疊（overlap）變體製造視覺層次感，突顯 hero 區塊',
  ],
  whenNotToUse: [
    '多欄編輯器或複雜的並排佈局，應改用 Multi-column 殼層',
    '行動裝置優先的介面，頂部 nav 會佔據過多垂直空間，建議採用底部 Tab Bar',
    '需要持久性側邊欄導覽的管理後台，應改用 Sidebar Layout',
  ],
  pitfalls: [
    '行動裝置未收合導覽列時，nav 高度會推擠主要內容，需實作 hamburger menu',
    '未標示 active link，使用者難以判斷目前所在頁面位置',
    '品牌標誌未正確對齊或解析度不足，在高 DPI 螢幕上模糊失真',
    '重疊（overlap）變體的內容卡片若無明確 z-index，會被 nav 遮蓋',
  ],
  accessibility: [
    '導覽區塊必須使用 <nav role="navigation"> 並加上 aria-label 區分主要與次要導覽',
    '目前頁面的連結需設定 aria-current="page"，協助螢幕閱讀器使用者定位',
    '確保 heading 階層從 h1 開始，不跳過層級，page header 的標題應為 h1',
    '鍵盤使用者需能透過 Tab 鍵存取所有導覽連結，focus ring 不得被隱藏',
    '品牌標誌圖片需提供有意義的 alt 文字，避免空白或重複頁面標題',
  ],
};

const META: CatalogBlockMeta = {
  id: 'stacked-layouts',
  title: 'Stacked Layouts',
  category: 'application',
  subcategory: 'Application Shells',
  summary: '帶有頂部導覽列的堆疊式應用殼，適合單欄式內容、後台主畫面與資料儀表板。',
  tags: ['layout', 'shell', 'navigation', 'application'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['page-shells', 'multi-column'],
};

@Component({
  selector: 'app-stacked-layouts-catalog-page',
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
export class StackedLayoutsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
