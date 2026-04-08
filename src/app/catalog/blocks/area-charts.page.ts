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

import { AreaChart1Component } from '../../blocks/free-area-charts/area-chart-1/area-chart-1.component';
import { AreaChart2Component } from '../../blocks/area-charts/area-chart-2/area-chart-2.component';
import { AreaChart3Component } from '../../blocks/area-charts/area-chart-3/area-chart-3.component';
import { AreaChart4Component } from '../../blocks/area-charts/area-chart-4/area-chart-4.component';
import { AreaChart5Component } from '../../blocks/area-charts/area-chart-5/area-chart-5.component';
import { AreaChart6Component } from '../../blocks/area-charts/area-chart-6/area-chart-6.component';
import { AreaChart7Component } from '../../blocks/area-charts/area-chart-7/area-chart-7.component';
import { AreaChart8Component } from '../../blocks/area-charts/area-chart-8/area-chart-8.component';
import { AreaChart9Component } from '../../blocks/area-charts/area-chart-9/area-chart-9.component';
import { AreaChart10Component } from '../../blocks/area-charts/area-chart-10/area-chart-10.component';
import { AreaChart11Component } from '../../blocks/area-charts/area-chart-11/area-chart-11.component';
import { AreaChart12Component } from '../../blocks/area-charts/area-chart-12/area-chart-12.component';
import { AreaChart13Component } from '../../blocks/area-charts/area-chart-13/area-chart-13.component';
import { AreaChart14Component } from '../../blocks/area-charts/area-chart-14/area-chart-14.component';
import { AreaChart15Component } from '../../blocks/area-charts/area-chart-15/area-chart-15.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'area-chart-1',
    label: 'Area Chart 1 — 月度營收趨勢面積圖',
    registryCategory: 'free-area-charts',
    component: AreaChart1Component,
    isFree: true,
  },
  {
    id: 'area-chart-2',
    label: 'Area Chart 2 — 多系列堆疊面積圖',
    registryCategory: 'area-charts',
    component: AreaChart2Component,
    isFree: false,
  },
  {
    id: 'area-chart-3',
    label: 'Area Chart 3 — 期間對比面積圖',
    registryCategory: 'area-charts',
    component: AreaChart3Component,
    isFree: false,
  },
  {
    id: 'area-chart-4',
    label: 'Area Chart 4 — 漸層填充面積圖',
    registryCategory: 'area-charts',
    component: AreaChart4Component,
    isFree: false,
  },
  {
    id: 'area-chart-5',
    label: 'Area Chart 5 — 百分比堆疊面積圖',
    registryCategory: 'area-charts',
    component: AreaChart5Component,
    isFree: false,
  },
  {
    id: 'area-chart-6',
    label: 'Area Chart 6 — 多群組比較面積圖',
    registryCategory: 'area-charts',
    component: AreaChart6Component,
    isFree: false,
  },
  {
    id: 'area-chart-7',
    label: 'Area Chart 7 — 帶標記點面積圖',
    registryCategory: 'area-charts',
    component: AreaChart7Component,
    isFree: false,
  },
  {
    id: 'area-chart-8',
    label: 'Area Chart 8 — 平滑曲線面積圖',
    registryCategory: 'area-charts',
    component: AreaChart8Component,
    isFree: false,
  },
  {
    id: 'area-chart-9',
    label: 'Area Chart 9 — 帶參考線面積圖',
    registryCategory: 'area-charts',
    component: AreaChart9Component,
    isFree: false,
  },
  {
    id: 'area-chart-10',
    label: 'Area Chart 10 — 時間範圍選擇面積圖',
    registryCategory: 'area-charts',
    component: AreaChart10Component,
    isFree: false,
  },
  {
    id: 'area-chart-11',
    label: 'Area Chart 11 — 帶圖例切換面積圖',
    registryCategory: 'area-charts',
    component: AreaChart11Component,
    isFree: false,
  },
  {
    id: 'area-chart-12',
    label: 'Area Chart 12 — 多軸對比面積圖',
    registryCategory: 'area-charts',
    component: AreaChart12Component,
    isFree: false,
  },
  {
    id: 'area-chart-13',
    label: 'Area Chart 13 — 深色主題面積圖',
    registryCategory: 'area-charts',
    component: AreaChart13Component,
    isFree: false,
  },
  {
    id: 'area-chart-14',
    label: 'Area Chart 14 — 多事件註解面積圖',
    registryCategory: 'area-charts',
    component: AreaChart14Component,
    isFree: false,
  },
  {
    id: 'area-chart-15',
    label: 'Area Chart 15 — 進階互動面積圖',
    registryCategory: 'area-charts',
    component: AreaChart15Component,
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
      description: '面積圖內容區塊（標題、圖例、座標軸、資料序列與工具提示）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '呈現連續時間序列的趨勢變化（每日、每週、每月的業務指標）',
    '強調累積量或總量隨時間的變化，例如累積訂單、累積使用者',
    '多系列堆疊比較：同時呈現各分類在總量中的貢獻度',
    '期間對比：以不同顏色的面積顯示本期 vs 前期或目標 vs 實際',
    '儀表板卡片內的主要趨勢視覺化元件',
  ],
  whenNotToUse: [
    '類別型資料比較 — 應使用長條圖或圓餅圖',
    '需要精確讀取單一時間點數值 — 應使用折線圖搭配數值標示',
    '資料點稀疏（少於 5 個） — 面積圖難以呈現連續趨勢感',
    '同時比較超過 5 條系列 — 堆疊面積會互相遮蔽，應改用小型倍數圖',
  ],
  pitfalls: [
    '未設定 y 軸起點為 0 導致面積大小比例失真，產生視覺誤導',
    '多系列填充使用高透明度仍然互相覆蓋，難以判斷個別數值',
    '忽略空值（missing data）的處理，直線連接缺漏點產生假趨勢',
    '時間軸密集時未啟用縮放或範圍選擇器，使用者難以鎖定特定期間',
    '在行動裝置上未調整字型與邊距，造成座標軸標籤重疊',
    '缺少工具提示（tooltip），使用者無法讀取精確數值',
  ],
  accessibility: [
    '圖表容器加上 role="img" 與 aria-label，描述圖表主題與時間範圍',
    '提供視覺化替代：可下載 CSV 或展開資料表供螢幕閱讀器讀取',
    '色彩編碼需搭配圖案或不同樣式，支援色盲與單色列印',
    '互動元素（圖例切換、範圍選擇器）須可用鍵盤操作並具備 focus-visible 樣式',
    '工具提示觸發時使用 aria-live 播報目前鎖定的資料點數值',
    '確保字型大小與對比度符合 WCAG AA，避免使用極細字體',
  ],
};

const META: CatalogBlockMeta = {
  id: 'area-charts',
  title: 'Area Charts',
  category: 'application',
  subcategory: 'Charts',
  summary:
    '面積圖集合，涵蓋單系列趨勢、多系列堆疊、百分比堆疊、漸層填充等常見版型，適合儀表板與資料分析頁面。',
  tags: ['chart', 'area-chart', 'visualization', 'trend', 'analytics'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['spark-area-charts', 'donut-charts', 'kpi-cards'],
};

@Component({
  selector: 'app-area-charts-catalog-page',
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
export class AreaChartsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
