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

import { ChartComposition1Component } from '../../blocks/chart-compositions/chart-composition-1/chart-composition-1.component';
import { ChartComposition2Component } from '../../blocks/chart-compositions/chart-composition-2/chart-composition-2.component';
import { ChartComposition3Component } from '../../blocks/chart-compositions/chart-composition-3/chart-composition-3.component';
import { ChartComposition4Component } from '../../blocks/chart-compositions/chart-composition-4/chart-composition-4.component';
import { ChartComposition5Component } from '../../blocks/chart-compositions/chart-composition-5/chart-composition-5.component';
import { ChartComposition6Component } from '../../blocks/chart-compositions/chart-composition-6/chart-composition-6.component';
import { ChartComposition8Component } from '../../blocks/chart-compositions/chart-composition-8/chart-composition-8.component';
import { ChartComposition9Component } from '../../blocks/chart-compositions/chart-composition-9/chart-composition-9.component';
import { ChartComposition10Component } from '../../blocks/chart-compositions/chart-composition-10/chart-composition-10.component';
import { ChartComposition11Component } from '../../blocks/chart-compositions/chart-composition-11/chart-composition-11.component';
import { ChartComposition12Component } from '../../blocks/chart-compositions/chart-composition-12/chart-composition-12.component';
import { ChartComposition13Component } from '../../blocks/chart-compositions/chart-composition-13/chart-composition-13.component';
import { ChartComposition14Component } from '../../blocks/chart-compositions/chart-composition-14/chart-composition-14.component';
import { ChartComposition15Component } from '../../blocks/chart-compositions/chart-composition-15/chart-composition-15.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'chart-composition-1',
    label: 'Chart Composition 01 — KPI 卡 + 折線圖',
    registryCategory: 'chart-compositions',
    component: ChartComposition1Component,
    isFree: false,
  },
  {
    id: 'chart-composition-2',
    label: 'Chart Composition 02 — KPI 卡 + 長條圖',
    registryCategory: 'chart-compositions',
    component: ChartComposition2Component,
    isFree: false,
  },
  {
    id: 'chart-composition-3',
    label: 'Chart Composition 03 — 多面板摘要',
    registryCategory: 'chart-compositions',
    component: ChartComposition3Component,
    isFree: false,
  },
  {
    id: 'chart-composition-4',
    label: 'Chart Composition 04 — 類別橫向條與主圖',
    registryCategory: 'chart-compositions',
    component: ChartComposition4Component,
    isFree: false,
  },
  {
    id: 'chart-composition-5',
    label: 'Chart Composition 05 — 多指標儀表',
    registryCategory: 'chart-compositions',
    component: ChartComposition5Component,
    isFree: false,
  },
  {
    id: 'chart-composition-6',
    label: 'Chart Composition 06 — 含 Bar List 對話框',
    registryCategory: 'chart-compositions',
    component: ChartComposition6Component,
    isFree: false,
  },
  {
    id: 'chart-composition-8',
    label: 'Chart Composition 08 — 區域圖 + 摘要',
    registryCategory: 'chart-compositions',
    component: ChartComposition8Component,
    isFree: false,
  },
  {
    id: 'chart-composition-9',
    label: 'Chart Composition 09 — 折線 + 事件標註',
    registryCategory: 'chart-compositions',
    component: ChartComposition9Component,
    isFree: false,
  },
  {
    id: 'chart-composition-10',
    label: 'Chart Composition 10 — 分組 KPI 指標',
    registryCategory: 'chart-compositions',
    component: ChartComposition10Component,
    isFree: false,
  },
  {
    id: 'chart-composition-11',
    label: 'Chart Composition 11 — 多軸比較圖',
    registryCategory: 'chart-compositions',
    component: ChartComposition11Component,
    isFree: false,
  },
  {
    id: 'chart-composition-12',
    label: 'Chart Composition 12 — 時間區段堆疊',
    registryCategory: 'chart-compositions',
    component: ChartComposition12Component,
    isFree: false,
  },
  {
    id: 'chart-composition-13',
    label: 'Chart Composition 13 — 使用量進度',
    registryCategory: 'chart-compositions',
    component: ChartComposition13Component,
    isFree: false,
  },
  {
    id: 'chart-composition-14',
    label: 'Chart Composition 14 — Category Bar + 主圖',
    registryCategory: 'chart-compositions',
    component: ChartComposition14Component,
    isFree: false,
  },
  {
    id: 'chart-composition-15',
    label: 'Chart Composition 15 — 綜合儀表板組合',
    registryCategory: 'chart-compositions',
    component: ChartComposition15Component,
    isFree: false,
  },
];

const API: ApiDocumentation = {
  inputs: [],
  outputs: [],
  slots: [],
  cssProperties: [
    {
      name: '--mat-sys-primary',
      type: 'color',
      default: '#005cbb',
      required: false,
      description: '主要 dataset 色',
    },
    {
      name: '--mat-sys-surface-container',
      type: 'color',
      default: '#f1eff4',
      required: false,
      description: '卡片背景色',
    },
  ],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '儀表板需同時呈現多個相關指標（KPI + 趨勢 + 分布）',
    '一個圖表不足以說明全貌時',
    '使用者需要橫跨多個維度快速解讀資料',
    '報表頁與 Executive Summary 視覺化',
  ],
  whenNotToUse: [
    '只呈現單一指標 — 使用單一 Chart 或 KPI Card',
    '頁面已有太多互動元件 — 組合圖會造成 cognitive overload',
    '行動裝置小螢幕 — 組合圖需較大空間',
  ],
  pitfalls: [
    '卡片與主圖的資料不一致或單位不同造成誤解',
    '過多 KPI 卡讓主圖變小失去意義',
    '顏色系統不統一，副圖與主圖色彩衝突',
    '缺少載入狀態導致使用者看到半成品',
  ],
  accessibility: [
    '為組合圖提供整體 `aria-labelledby` 指向標題',
    '個別子圖也需獨立的 aria-label',
    '確保 KPI 數字有語意標記（`aria-describedby` 指向說明）',
    '支援鍵盤 focus 在每個子區塊間移動',
  ],
};

const META: CatalogBlockMeta = {
  id: 'chart-compositions',
  title: 'Chart Compositions',
  category: 'application',
  subcategory: 'Charts',
  summary:
    '組合式圖表集合，將 KPI 卡、長條圖、折線圖、區域圖等多種視覺元素整合成儀表板面板。',
  tags: ['chart', 'composition', 'dashboard', 'kpi'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['bar-charts', 'line-charts', 'kpi-cards', 'bar-lists'],
  previewMinHeight: 560,
};

@Component({
  selector: 'app-chart-compositions-catalog-page',
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
export class ChartCompositionsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
