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

import { DonutChart1Component } from '../../blocks/free-donut-charts/donut-chart-1/donut-chart-1.component';
import { DonutChart2Component } from '../../blocks/donut-charts/donut-chart-2/donut-chart-2.component';
import { DonutChart3Component } from '../../blocks/donut-charts/donut-chart-3/donut-chart-3.component';
import { DonutChart4Component } from '../../blocks/donut-charts/donut-chart-4/donut-chart-4.component';
import { DonutChart5Component } from '../../blocks/donut-charts/donut-chart-5/donut-chart-5.component';
import { DonutChart6Component } from '../../blocks/donut-charts/donut-chart-6/donut-chart-6.component';
import { DonutChart7Component } from '../../blocks/donut-charts/donut-chart-7/donut-chart-7.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'donut-chart-1',
    label: 'Donut Chart 1 — 基本分類佔比環圈圖',
    registryCategory: 'free-donut-charts',
    component: DonutChart1Component,
    isFree: true,
  },
  {
    id: 'donut-chart-2',
    label: 'Donut Chart 2 — 中心值顯示環圈圖',
    registryCategory: 'donut-charts',
    component: DonutChart2Component,
    isFree: false,
  },
  {
    id: 'donut-chart-3',
    label: 'Donut Chart 3 — 多層分群環圈圖',
    registryCategory: 'donut-charts',
    component: DonutChart3Component,
    isFree: false,
  },
  {
    id: 'donut-chart-4',
    label: 'Donut Chart 4 — 帶圖例列表環圈圖',
    registryCategory: 'donut-charts',
    component: DonutChart4Component,
    isFree: false,
  },
  {
    id: 'donut-chart-5',
    label: 'Donut Chart 5 — 目標達成率環圈圖',
    registryCategory: 'donut-charts',
    component: DonutChart5Component,
    isFree: false,
  },
  {
    id: 'donut-chart-6',
    label: 'Donut Chart 6 — 互動式分類環圈圖',
    registryCategory: 'donut-charts',
    component: DonutChart6Component,
    isFree: false,
  },
  {
    id: 'donut-chart-7',
    label: 'Donut Chart 7 — 多指標組合環圈圖',
    registryCategory: 'donut-charts',
    component: DonutChart7Component,
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
      description: '環圈圖內容區塊（中心摘要、分類色塊、圖例列表與工具提示）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '呈現少量分類（建議 3 至 6 項）在整體中的比例分布',
    '達成率與進度指標：例如年度目標達成、儲存空間使用率',
    '儀表板上簡潔呈現預算分配、流量來源組成等占比資訊',
    '中心區域搭配總和或重點摘要，同時傳達整體與局部資訊',
    '需要圓形視覺化符合品牌調性時的靜態數據呈現',
  ],
  whenNotToUse: [
    '分類數超過 7 項 — 扇形過窄難以辨識，應改用橫條圖',
    '分類占比接近均等 — 圓餅扇形角度差異不明顯',
    '需要精確比較大小 — 長條圖的線性比較更精準',
    '時間序列資料 — 圓餅無法呈現趨勢，應使用折線或面積圖',
  ],
  pitfalls: [
    '將太多類別合併呈現，導致標籤重疊或顏色過於相近',
    '依賴顏色傳達分類資訊但未搭配圖例或標籤',
    '中心文字設計太大遮蔽環圈，反而削弱資料視覺化效果',
    '3D 效果或陰影扭曲實際比例，產生視覺誤導',
    '未提供 tooltip 或資料表，使用者無法讀取精確數值',
    '環圈內外邊界模糊，在深色背景或色盲情境下難以分辨',
  ],
  accessibility: [
    '容器提供 role="img" 與 aria-label，描述圖表主題與總計',
    '每個扇形分類的數值與占比須有文字替代（例如 aria-describedby 連結到隱藏的資料表）',
    '避免僅以顏色區分類別，建議加上花紋、圖示或標籤',
    '互動式扇形需支援鍵盤 Tab 切換與 focus-visible 樣式',
    'tooltip 觸發時以 aria-live="polite" 播報該扇形的類別與數值',
    '顏色對比符合 WCAG AA，並提供深色模式的備用配色',
  ],
};

const META: CatalogBlockMeta = {
  id: 'donut-charts',
  title: 'Donut Charts',
  category: 'application',
  subcategory: 'Charts',
  summary:
    '環圈圖集合，涵蓋基本占比、中心摘要值、多層分群、目標達成率等版型，適合儀表板與分類比例視覺化。',
  tags: ['chart', 'donut-chart', 'pie-chart', 'visualization', 'ratio'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['area-charts', 'spark-area-charts', 'kpi-cards'],
};

@Component({
  selector: 'app-donut-charts-catalog-page',
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
export class DonutChartsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
