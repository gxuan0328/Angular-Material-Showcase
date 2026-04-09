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

import { ChartTooltip1Component } from '../../blocks/chart-tooltips/chart-tooltip-1/chart-tooltip-1.component';
import { ChartTooltip2Component } from '../../blocks/chart-tooltips/chart-tooltip-2/chart-tooltip-2.component';
import { ChartTooltip3Component } from '../../blocks/chart-tooltips/chart-tooltip-3/chart-tooltip-3.component';
import { ChartTooltip4Component } from '../../blocks/chart-tooltips/chart-tooltip-4/chart-tooltip-4.component';
import { ChartTooltip5Component } from '../../blocks/chart-tooltips/chart-tooltip-5/chart-tooltip-5.component';
import { ChartTooltip6Component } from '../../blocks/chart-tooltips/chart-tooltip-6/chart-tooltip-6.component';
import { ChartTooltip7Component } from '../../blocks/chart-tooltips/chart-tooltip-7/chart-tooltip-7.component';
import { ChartTooltip8Component } from '../../blocks/chart-tooltips/chart-tooltip-8/chart-tooltip-8.component';
import { ChartTooltip9Component } from '../../blocks/chart-tooltips/chart-tooltip-9/chart-tooltip-9.component';
import { ChartTooltip10Component } from '../../blocks/chart-tooltips/chart-tooltip-10/chart-tooltip-10.component';
import { ChartTooltip11Component } from '../../blocks/chart-tooltips/chart-tooltip-11/chart-tooltip-11.component';
import { ChartTooltip12Component } from '../../blocks/chart-tooltips/chart-tooltip-12/chart-tooltip-12.component';
import { ChartTooltip13Component } from '../../blocks/chart-tooltips/chart-tooltip-13/chart-tooltip-13.component';
import { ChartTooltip14Component } from '../../blocks/chart-tooltips/chart-tooltip-14/chart-tooltip-14.component';
import { ChartTooltip15Component } from '../../blocks/chart-tooltips/chart-tooltip-15/chart-tooltip-15.component';
import { ChartTooltip16Component } from '../../blocks/chart-tooltips/chart-tooltip-16/chart-tooltip-16.component';
import { ChartTooltip17Component } from '../../blocks/chart-tooltips/chart-tooltip-17/chart-tooltip-17.component';
import { ChartTooltip18Component } from '../../blocks/chart-tooltips/chart-tooltip-18/chart-tooltip-18.component';
import { ChartTooltip19Component } from '../../blocks/chart-tooltips/chart-tooltip-19/chart-tooltip-19.component';
import { ChartTooltip20Component } from '../../blocks/chart-tooltips/chart-tooltip-20/chart-tooltip-20.component';
import { ChartTooltip21Component } from '../../blocks/chart-tooltips/chart-tooltip-21/chart-tooltip-21.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'chart-tooltip-1',
    label: 'Chart Tooltip 01 — 基本懸停提示',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip1Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-2',
    label: 'Chart Tooltip 02 — 含色塊圖例',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip2Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-3',
    label: 'Chart Tooltip 03 — 含百分比差異',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip3Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-4',
    label: 'Chart Tooltip 04 — 多序列對比',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip4Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-5',
    label: 'Chart Tooltip 05 — 含詳細文字',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip5Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-6',
    label: 'Chart Tooltip 06 — 條狀進度提示',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip6Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-7',
    label: 'Chart Tooltip 07 — 含時間戳記',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip7Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-8',
    label: 'Chart Tooltip 08 — 指標變化箭頭',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip8Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-9',
    label: 'Chart Tooltip 09 — 含小圖示',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip9Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-10',
    label: 'Chart Tooltip 10 — 分組顯示',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip10Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-11',
    label: 'Chart Tooltip 11 — 區段統計',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip11Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-12',
    label: 'Chart Tooltip 12 — 豐富敘述文字',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip12Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-13',
    label: 'Chart Tooltip 13 — 含熱點索引',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip13Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-14',
    label: 'Chart Tooltip 14 — 合併 datasets',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip14Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-15',
    label: 'Chart Tooltip 15 — 含附加指標',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip15Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-16',
    label: 'Chart Tooltip 16 — 進度條顯示',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip16Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-17',
    label: 'Chart Tooltip 17 — Category Bar 強化',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip17Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-18',
    label: 'Chart Tooltip 18 — Progress Circle 強化',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip18Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-19',
    label: 'Chart Tooltip 19 — 狀態色碼提示',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip19Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-20',
    label: 'Chart Tooltip 20 — 多維資料提示',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip20Component,
    isFree: false,
  },
  {
    id: 'chart-tooltip-21',
    label: 'Chart Tooltip 21 — 全資訊提示卡',
    registryCategory: 'chart-tooltips',
    component: ChartTooltip21Component,
    isFree: false,
  },
];

const API: ApiDocumentation = {
  inputs: [],
  outputs: [],
  slots: [],
  cssProperties: [
    {
      name: '--mat-sys-inverse-surface',
      type: 'color',
      default: '#2f3033',
      required: false,
      description: 'Tooltip 卡片背景色（dark-on-light 反色）',
    },
    {
      name: '--mat-sys-inverse-on-surface',
      type: 'color',
      default: '#f1f0f4',
      required: false,
      description: 'Tooltip 內文顏色',
    },
    {
      name: '--mat-sys-primary',
      type: 'color',
      default: '#005cbb',
      required: false,
      description: '強調資料標記色',
    },
  ],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '使用者需精確讀取圖表資料點時',
    '為複雜圖表提供額外上下文資訊',
    '補充圖例無法完整呈現的數據維度',
    '強調資料點之間的比較與差異',
  ],
  whenNotToUse: [
    '圖表本身已清楚顯示所有數值 — tooltip 會多餘',
    '行動裝置無 hover 能力 — 改用點擊彈出卡或旁邊面板',
    'tooltip 內容包含無法水平呈現的長段落',
  ],
  pitfalls: [
    'tooltip 遮蔽資料點導致使用者無法繼續探索',
    '延遲過長造成互動感滯緩',
    'dark mode 顏色反差不足難以閱讀',
    '超出視窗邊界而被截斷',
  ],
  accessibility: [
    'tooltip 內容也需可從鍵盤聚焦觸發',
    '避免 tooltip 為唯一呈現資料的方式（資料需有其他可讀形式）',
    'tooltip 文字需符合對比度 4.5:1',
    '支援 Escape 鍵關閉',
  ],
};

const META: CatalogBlockMeta = {
  id: 'chart-tooltips',
  title: 'Chart Tooltips',
  category: 'application',
  subcategory: 'Charts',
  summary:
    '圖表 tooltip 變體集合，提供豐富的資料點懸停提示樣式，從基本色塊到含進度條、附加指標等 21 種風格。',
  tags: ['chart', 'tooltip', 'interaction', 'hover'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['line-charts', 'bar-charts', 'area-charts', 'chart-compositions'],
  previewMinHeight: 520,
};

@Component({
  selector: 'app-chart-tooltips-catalog-page',
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
export class ChartTooltipsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
