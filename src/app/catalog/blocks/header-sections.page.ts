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

import { HeaderSection1Component } from '../../blocks/header-sections/header-section-1/header-section-1.component';
import { HeaderSection2Component } from '../../blocks/header-sections/header-section-2/header-section-2.component';
import { HeaderSection3Component } from '../../blocks/header-sections/header-section-3/header-section-3.component';
import { HeaderSection4Component } from '../../blocks/header-sections/header-section-4/header-section-4.component';
import { HeaderSection5Component } from '../../blocks/header-sections/header-section-5/header-section-5.component';
import { HeaderSection6Component } from '../../blocks/header-sections/header-section-6/header-section-6.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'header-section-1',
    label: 'Header Section 1 — 經典導覽列',
    registryCategory: 'header-sections',
    component: HeaderSection1Component,
    isFree: false,
  },
  {
    id: 'header-section-2',
    label: 'Header Section 2 — 含搜尋的導覽',
    registryCategory: 'header-sections',
    component: HeaderSection2Component,
    isFree: false,
  },
  {
    id: 'header-section-3',
    label: 'Header Section 3 — 中央 LOGO 雙側選單',
    registryCategory: 'header-sections',
    component: HeaderSection3Component,
    isFree: false,
  },
  {
    id: 'header-section-4',
    label: 'Header Section 4 — 透明覆蓋英雄區',
    registryCategory: 'header-sections',
    component: HeaderSection4Component,
    isFree: false,
  },
  {
    id: 'header-section-5',
    label: 'Header Section 5 — 含登入按鈕導覽',
    registryCategory: 'header-sections',
    component: HeaderSection5Component,
    isFree: false,
  },
  {
    id: 'header-section-6',
    label: 'Header Section 6 — 多層下拉巨型選單',
    registryCategory: 'header-sections',
    component: HeaderSection6Component,
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
      description: '頁首導覽列內容（品牌標誌、選單項目、行動按鈕、搜尋）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '行銷網站全站頁首：提供品牌識別與主要導覽連結',
    '產品著陸頁：搭配登入、註冊、試用按鈕引導轉換',
    '需要主導覽快速跳轉的多頁面網站',
    '具有複雜資訊架構的網站，可使用 Mega Menu 變體',
    '行動裝置友善的響應式網站，需提供漢堡選單收合',
  ],
  whenNotToUse: [
    '應用程式內部頁面 — 應使用 App Bar 或 Sidenav 而非行銷頁首',
    '專注式單頁流程（結帳、註冊精靈）— 應隱藏導覽避免分心',
    '全螢幕沉浸式體驗（影片播放、遊戲）— 應使用最簡頁首',
    '管理後台 — 應使用 Admin Layout 的固定側邊欄與工具列',
  ],
  pitfalls: [
    '導覽項目過多（超過 7 項），使用者難以快速掃描',
    '行動裝置版未提供漢堡選單收合，導致畫面壅擠',
    '滾動時頁首固定但未處理陰影或邊框，與內容黏在一起',
    '下拉選單階層過深（超過兩層），使用者無法回到上一層',
    'CTA 按鈕與一般選單樣式相同，無法吸引使用者點擊',
  ],
  accessibility: [
    '使用 nav 元素並提供 aria-label="主要導覽" 標識區域用途',
    '當前頁面選單項目使用 aria-current="page" 提示螢幕閱讀器',
    '下拉選單觸發器使用 aria-expanded 與 aria-haspopup 屬性',
    '行動漢堡選單按鈕需有 aria-label 與 aria-controls 對應',
    '提供「跳至主要內容」的隱形快速連結，方便鍵盤使用者略過導覽',
  ],
};

const META: CatalogBlockMeta = {
  id: 'header-sections',
  title: 'Header Sections',
  category: 'marketing',
  subcategory: 'Marketing Page Sections',
  summary:
    '行銷網站頁首導覽列，整合品牌識別、主選單、搜尋與行動呼籲按鈕，是建立品牌印象與全站導覽的入口。',
  tags: ['header', 'navigation', 'menu', 'marketing'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['hero-sections', 'flyout-menus', 'cta-sections'],
};

@Component({
  selector: 'app-header-sections-catalog-page',
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
export class HeaderSectionsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
