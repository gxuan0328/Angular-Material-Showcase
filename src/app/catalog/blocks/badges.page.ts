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

import { Badge1Component } from '../../blocks/free-badges/badge-1/badge-1.component';
import { Badge2Component } from '../../blocks/badges/badge-2/badge-2.component';
import { Badge3Component } from '../../blocks/badges/badge-3/badge-3.component';
import { Badge4Component } from '../../blocks/badges/badge-4/badge-4.component';
import { Badge5Component } from '../../blocks/badges/badge-5/badge-5.component';
import { Badge6Component } from '../../blocks/badges/badge-6/badge-6.component';
import { Badge7Component } from '../../blocks/badges/badge-7/badge-7.component';
import { Badge8Component } from '../../blocks/badges/badge-8/badge-8.component';
import { Badge9Component } from '../../blocks/badges/badge-9/badge-9.component';
import { Badge10Component } from '../../blocks/badges/badge-10/badge-10.component';
import { Badge11Component } from '../../blocks/badges/badge-11/badge-11.component';
import { Badge12Component } from '../../blocks/badges/badge-12/badge-12.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'badge-1',
    label: 'Badge 01 — 基本狀態徽章（Free）',
    registryCategory: 'free-badges',
    component: Badge1Component,
    isFree: true,
  },
  {
    id: 'badge-2',
    label: 'Badge 02 — 含點狀指示器',
    registryCategory: 'badges',
    component: Badge2Component,
    isFree: false,
  },
  {
    id: 'badge-3',
    label: 'Badge 03 — 含圖示徽章',
    registryCategory: 'badges',
    component: Badge3Component,
    isFree: false,
  },
  {
    id: 'badge-4',
    label: 'Badge 04 — 圓形徽章',
    registryCategory: 'badges',
    component: Badge4Component,
    isFree: false,
  },
  {
    id: 'badge-5',
    label: 'Badge 05 — 邊框徽章',
    registryCategory: 'badges',
    component: Badge5Component,
    isFree: false,
  },
  {
    id: 'badge-6',
    label: 'Badge 06 — 大尺寸徽章',
    registryCategory: 'badges',
    component: Badge6Component,
    isFree: false,
  },
  {
    id: 'badge-7',
    label: 'Badge 07 — 含關閉按鈕',
    registryCategory: 'badges',
    component: Badge7Component,
    isFree: false,
  },
  {
    id: 'badge-8',
    label: 'Badge 08 — 多色狀態組',
    registryCategory: 'badges',
    component: Badge8Component,
    isFree: false,
  },
  {
    id: 'badge-9',
    label: 'Badge 09 — 漸層徽章',
    registryCategory: 'badges',
    component: Badge9Component,
    isFree: false,
  },
  {
    id: 'badge-10',
    label: 'Badge 10 — 軟色調徽章',
    registryCategory: 'badges',
    component: Badge10Component,
    isFree: false,
  },
  {
    id: 'badge-11',
    label: 'Badge 11 — 實色強調徽章',
    registryCategory: 'badges',
    component: Badge11Component,
    isFree: false,
  },
  {
    id: 'badge-12',
    label: 'Badge 12 — 含計數徽章',
    registryCategory: 'badges',
    component: Badge12Component,
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
      description: '徽章文字內容與可選的前置圖示或計數',
    },
  ],
  cssProperties: [
    {
      name: '--mat-sys-primary-container',
      type: 'color',
      default: '#d7e3ff',
      required: false,
      description: '主要徽章背景色',
    },
    {
      name: '--mat-sys-tertiary-container',
      type: 'color',
      default: '#e0e0ff',
      required: false,
      description: '次要徽章背景色',
    },
    {
      name: '--mat-sys-error-container',
      type: 'color',
      default: '#ffdad6',
      required: false,
      description: '錯誤/刪除徽章背景色',
    },
  ],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '標示資料狀態（active / pending / suspended / failed）',
    '呈現計數（未讀訊息、購物車數量、通知數）',
    '為列表項目或卡片添加分類標籤',
    '強調新功能、測試版或重要訊息標記',
  ],
  whenNotToUse: [
    '作為主要動作按鈕 — 改用 MatButton',
    '放置長篇文字 — 徽章應為一個字到數個字的短文',
    '過度使用導致介面擁擠、失去強調效果',
  ],
  pitfalls: [
    '顏色語意不一致（如 success 有時綠色有時藍色）',
    '對比度不足導致文字難以閱讀',
    '僅用顏色區分狀態而沒有文字或圖示輔助 — 色盲使用者無法辨識',
    '徽章過大搶走主要內容的焦點',
  ],
  accessibility: [
    '語意狀態使用 `aria-label` 或文字明確表達（不只顏色）',
    '計數徽章使用 `aria-live="polite"` 讓更新被螢幕閱讀器讀出',
    '裝飾性徽章使用 `aria-hidden="true"` 避免干擾閱讀',
    '確保文字顏色與背景對比度 ≥ 4.5:1（WCAG AA）',
  ],
};

const META: CatalogBlockMeta = {
  id: 'badges',
  title: 'Badges',
  category: 'application',
  subcategory: 'Elements',
  summary: '徽章與標籤集合，用於標示狀態、計數、分類與重要性提示，提供多種顏色、尺寸與樣式變體。',
  tags: ['badge', 'tag', 'status', 'label'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['banners', 'empty-states'],
};

@Component({
  selector: 'app-badges-catalog-page',
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
export class BadgesCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
