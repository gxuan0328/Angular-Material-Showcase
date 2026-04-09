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

import { BarChart1Component } from '../../blocks/free-bar-charts/bar-chart-1/bar-chart-1.component';
import { BarChart2Component } from '../../blocks/bar-charts/bar-chart-2/bar-chart-2.component';
import { BarChart3Component } from '../../blocks/bar-charts/bar-chart-3/bar-chart-3.component';
import { BarChart4Component } from '../../blocks/bar-charts/bar-chart-4/bar-chart-4.component';
import { BarChart5Component } from '../../blocks/bar-charts/bar-chart-5/bar-chart-5.component';
import { BarChart6Component } from '../../blocks/bar-charts/bar-chart-6/bar-chart-6.component';
import { BarChart7Component } from '../../blocks/bar-charts/bar-chart-7/bar-chart-7.component';
import { BarChart8Component } from '../../blocks/bar-charts/bar-chart-8/bar-chart-8.component';
import { BarChart9Component } from '../../blocks/bar-charts/bar-chart-9/bar-chart-9.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'bar-chart-1',
    label: 'Bar Chart 01 — 基本直向長條圖（Free）',
    registryCategory: 'free-bar-charts',
    component: BarChart1Component,
    isFree: true,
  },
  {
    id: 'bar-chart-2',
    label: 'Bar Chart 02 — 含摘要卡片',
    registryCategory: 'bar-charts',
    component: BarChart2Component,
    isFree: false,
  },
  {
    id: 'bar-chart-3',
    label: 'Bar Chart 03 — 堆疊長條圖',
    registryCategory: 'bar-charts',
    component: BarChart3Component,
    isFree: false,
  },
  {
    id: 'bar-chart-4',
    label: 'Bar Chart 04 — 百分比堆疊',
    registryCategory: 'bar-charts',
    component: BarChart4Component,
    isFree: false,
  },
  {
    id: 'bar-chart-5',
    label: 'Bar Chart 05 — 分組長條圖',
    registryCategory: 'bar-charts',
    component: BarChart5Component,
    isFree: false,
  },
  {
    id: 'bar-chart-6',
    label: 'Bar Chart 06 — 橫向長條圖',
    registryCategory: 'bar-charts',
    component: BarChart6Component,
    isFree: false,
  },
  {
    id: 'bar-chart-7',
    label: 'Bar Chart 07 — 極簡長條圖',
    registryCategory: 'bar-charts',
    component: BarChart7Component,
    isFree: false,
  },
  {
    id: 'bar-chart-8',
    label: 'Bar Chart 08 — 含平均值基準線',
    registryCategory: 'bar-charts',
    component: BarChart8Component,
    isFree: false,
  },
  {
    id: 'bar-chart-9',
    label: 'Bar Chart 09 — 含區間標註',
    registryCategory: 'bar-charts',
    component: BarChart9Component,
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
      description: '主要長條填色（透過 ChartPaletteService 套用至 dataset）',
    },
    {
      name: '--mat-sys-secondary',
      type: 'color',
      default: '#575e71',
      required: false,
      description: '次要 dataset 填色',
    },
    {
      name: '--mat-sys-on-surface',
      type: 'color',
      default: '#1a1b1f',
      required: false,
      description: '軸與圖例文字顏色',
    },
  ],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '比較類別之間的量值差異（銷售、用量、人數等)',
    '呈現時間序列的離散區間值（月度、季度、年度)',
    '堆疊或分組方式呈現多維度組合',
    '數值較少、類別間需要直觀對比時',
  ],
  whenNotToUse: [
    '時間序列趨勢變化 — 使用 Line Chart 或 Area Chart 更易閱讀',
    '單一比例或部分占整體 — 使用 Donut Chart',
    '連續資料或散佈分析 — 使用 Scatter / Area Chart',
    '類別數量過多（> 12）導致 x 軸擁擠 — 改用橫向長條或分頁',
  ],
  pitfalls: [
    'y 軸未從 0 開始，導致視覺誤導放大差距',
    '堆疊與分組混用造成認知負擔',
    '過度使用色彩使類別無法區分',
    '未提供 tooltip 讓使用者看不到精確數值',
  ],
  accessibility: [
    '為圖表提供 `aria-label` 描述資料主題與時間範圍',
    '同時提供對應的資料表供螢幕閱讀器使用（table fallback）',
    '不僅以顏色區分類別 — 配合圖例文字或 pattern fill',
    '鍵盤可聚焦並可讀取 tooltip 內容',
  ],
};

const META: CatalogBlockMeta = {
  id: 'bar-charts',
  title: 'Bar Charts',
  category: 'application',
  subcategory: 'Charts',
  summary:
    '橫向與直向長條圖集合，支援基本、堆疊、百分比堆疊、分組、橫向等多種呈現方式，適合類別間比較。',
  tags: ['chart', 'bar', 'visualization', 'analytics'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['line-charts', 'area-charts', 'bar-lists', 'chart-compositions'],
};

@Component({
  selector: 'app-bar-charts-catalog-page',
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
export class BarChartsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
