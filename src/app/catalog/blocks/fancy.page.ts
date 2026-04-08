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

import { MemoryAlbumComponent } from '../../blocks/free-fancy/memory-album/memory-album.component';
import { WordsAlbumComponent } from '../../blocks/free-fancy/words-album/words-album.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'memory-album',
    label: 'Memory Album — 記憶相簿',
    registryCategory: 'free-fancy',
    component: MemoryAlbumComponent,
    isFree: true,
  },
  {
    id: 'words-album',
    label: 'Words Album — 文字相簿',
    registryCategory: 'free-fancy',
    component: WordsAlbumComponent,
    isFree: true,
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
      description: '互動式視覺區塊內容（圖像、文字、動畫過場）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '個人作品集或品牌故事頁，需以視覺敘事方式展現內容',
    '紀念性網站（婚禮、活動回顧）需呈現照片牆或回憶集錦',
    '創意行銷活動落地頁，希望透過動畫互動吸引使用者停留',
    '展覽介紹網站，需以引人注目的方式呈現主題故事',
  ],
  whenNotToUse: [
    '功能型應用或資料密集型介面 — 動畫會影響操作效率',
    '使用者啟用「reduce motion」偏好時應提供靜態 fallback',
    '行動裝置低階機種主要訪客 — 動畫可能造成卡頓',
    '需要快速取得資訊的工具型網站 — 應以資訊密度為主',
  ],
  pitfalls: [
    '動畫過長或無法跳過，影響使用者快速瀏覽的需求',
    '未考量 prefers-reduced-motion 偏好設定，造成不適感',
    '圖片資源未壓縮或未使用 WebP，初始載入時間過長',
    '動畫元素數量過多，造成 GPU 負擔與電池耗盡',
    '焦點與鍵盤導覽在動畫過程中遺失，破壞無障礙體驗',
  ],
  accessibility: [
    '動畫須尊重 @media (prefers-reduced-motion: reduce) 偏好設定',
    '裝飾性圖片使用 alt="" 並透過 role="presentation" 排除於語意樹外',
    '主要敘事內容仍須以語意化文字呈現，確保螢幕閱讀器可讀',
    '互動元素提供鍵盤可達操作，焦點順序符合視覺呈現',
    '色彩對比度即使在動畫過場中也須符合 WCAG AA',
  ],
};

const META: CatalogBlockMeta = {
  id: 'fancy',
  title: 'Fancy',
  category: 'marketing',
  subcategory: 'Marketing Page Sections',
  summary:
    '富有視覺敘事與動畫效果的互動區塊集合，適用於品牌故事、作品集、紀念性網站與創意行銷落地頁。',
  tags: ['fancy', 'animation', 'visual', 'showcase'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['hero-sections', 'gallery-sections', 'testimonial-sections'],
};

@Component({
  selector: 'app-fancy-catalog-page',
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
export class FancyCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
