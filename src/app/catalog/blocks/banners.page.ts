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

import { Banner1Component } from '../../blocks/banners/banner-1/banner-1.component';
import { Banner2Component } from '../../blocks/banners/banner-2/banner-2.component';
import { Banner3Component } from '../../blocks/banners/banner-3/banner-3.component';
import { Banner4Component } from '../../blocks/banners/banner-4/banner-4.component';
import { Banner5Component } from '../../blocks/banners/banner-5/banner-5.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'banner-1',
    label: 'Banner 1 — 公告橫幅',
    registryCategory: 'banners',
    component: Banner1Component,
    isFree: false,
  },
  {
    id: 'banner-2',
    label: 'Banner 2 — 升級提示',
    registryCategory: 'banners',
    component: Banner2Component,
    isFree: false,
  },
  {
    id: 'banner-3',
    label: 'Banner 3 — 入門導覽',
    registryCategory: 'banners',
    component: Banner3Component,
    isFree: false,
  },
  {
    id: 'banner-4',
    label: 'Banner 4 — Cookie 同意',
    registryCategory: 'banners',
    component: Banner4Component,
    isFree: false,
  },
  {
    id: 'banner-5',
    label: 'Banner 5 — 系統通知',
    registryCategory: 'banners',
    component: Banner5Component,
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
      description: '橫幅內容區塊（標題、說明文字、行動按鈕）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '系統公告：服務維護、版本更新、政策異動等需全站告知的訊息',
    '付費升級提示：引導使用者升級至進階方案的行銷橫幅',
    '新功能上架：簡短介紹最新功能並提供導覽連結',
    'Cookie 同意聲明：符合 GDPR 的使用者同意提示',
    '低優先警告：不需立即處理、可關閉的非緊急資訊',
  ],
  whenNotToUse: [
    '嚴重錯誤或系統故障 — 應使用 Dialog 確保使用者確認',
    '需要使用者輸入或表單填寫 — 應使用 Dialog 或獨立表單頁面',
    '永久性資訊展示 — 應使用 Sidebar、Inline Alert 或專屬頁面區塊',
    '多步驟流程引導 — 應使用 Stepper 或 Tour 元件',
  ],
  pitfalls: [
    '沒有提供 dismiss（關閉）機制，使橫幅持續佔據版面',
    '訊息文字過長，壓縮頁面主要內容的可見範圍',
    '與 Alert / Snackbar 混淆使用：Banner 適合頁面頂部持久提示，Snackbar 適合短暫操作回饋',
    '在行動裝置上佔用過多垂直空間，建議設定最大高度或摺疊模式',
    '同時顯示多個橫幅，造成視覺噪音與使用者困惑',
  ],
  accessibility: [
    '非緊急公告使用 role="region" 並搭配 aria-label 說明區域用途',
    '緊急通知使用 role="alert" 並設定 aria-live="assertive" 讓螢幕閱讀器即時播報',
    '非緊急橫幅使用 aria-live="polite"，避免打斷使用者當前操作',
    '關閉按鈕須有明確的 aria-label，例如 aria-label="關閉公告"',
    '橫幅消失後，焦點應回到觸發前的元素或頁面主要內容',
  ],
};

const META: CatalogBlockMeta = {
  id: 'banners',
  title: 'Banners',
  category: 'marketing',
  subcategory: 'Marketing Elements',
  summary:
    '公告與通知橫幅，用於頁面頂部呈現重要訊息、升級提示、cookie 同意、系統公告等暫時性訊息。',
  tags: ['banner', 'announcement', 'notification', 'marketing'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: [],
};

@Component({
  selector: 'app-banners-catalog-page',
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
export class BannersCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
