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

import { SparkAreaChart1Component } from '../../blocks/spark-area-charts/spark-area-chart-1/spark-area-chart-1.component';
import { SparkAreaChart2Component } from '../../blocks/spark-area-charts/spark-area-chart-2/spark-area-chart-2.component';
import { SparkAreaChart3Component } from '../../blocks/spark-area-charts/spark-area-chart-3/spark-area-chart-3.component';
import { SparkAreaChart4Component } from '../../blocks/spark-area-charts/spark-area-chart-4/spark-area-chart-4.component';
import { SparkAreaChart5Component } from '../../blocks/spark-area-charts/spark-area-chart-5/spark-area-chart-5.component';
import { SparkAreaChart6Component } from '../../blocks/spark-area-charts/spark-area-chart-6/spark-area-chart-6.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'spark-area-chart-1',
    label: 'Spark Area Chart 1 — 迷你面積走勢圖',
    registryCategory: 'spark-area-charts',
    component: SparkAreaChart1Component,
    isFree: false,
  },
  {
    id: 'spark-area-chart-2',
    label: 'Spark Area Chart 2 — 帶數值摘要走勢圖',
    registryCategory: 'spark-area-charts',
    component: SparkAreaChart2Component,
    isFree: false,
  },
  {
    id: 'spark-area-chart-3',
    label: 'Spark Area Chart 3 — 漸層迷你走勢圖',
    registryCategory: 'spark-area-charts',
    component: SparkAreaChart3Component,
    isFree: false,
  },
  {
    id: 'spark-area-chart-4',
    label: 'Spark Area Chart 4 — 多系列對比走勢圖',
    registryCategory: 'spark-area-charts',
    component: SparkAreaChart4Component,
    isFree: false,
  },
  {
    id: 'spark-area-chart-5',
    label: 'Spark Area Chart 5 — 帶趨勢標記走勢圖',
    registryCategory: 'spark-area-charts',
    component: SparkAreaChart5Component,
    isFree: false,
  },
  {
    id: 'spark-area-chart-6',
    label: 'Spark Area Chart 6 — 緊湊型指標走勢圖',
    registryCategory: 'spark-area-charts',
    component: SparkAreaChart6Component,
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
      description: '迷你走勢圖內容區塊（精簡座標軸、資料序列、摘要數值與趨勢指標）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '嵌入 KPI 卡片中提供趨勢的視覺化脈絡',
    '表格列末顯示該筆紀錄近期的走勢（例如使用者活躍度、庫存變化）',
    '儀表板上需要密集呈現多個指標的走向而版面有限',
    '監控類應用中對多個服務或裝置的即時健康指標做縮圖顯示',
    '報表內文中以小圖補充文字敘述，提升閱讀效率',
  ],
  whenNotToUse: [
    '需要精確數值讀取或深入分析 — 應使用完整面積圖或互動式圖表',
    '資料點過多且細節重要 — 迷你圖會過度壓縮細節',
    '僅需要單一當前值 — 直接顯示文字數字即可',
    '需要比較兩個以上長期複雜趨勢時 — 應改用完整尺寸的圖表',
  ],
  pitfalls: [
    '線條過細或顏色對比不足，縮小後完全無法辨識',
    '在極小尺寸下仍顯示座標軸與標籤，破壞迷你圖的精簡特性',
    '缺乏摘要數值或最新值標記，使用者需要依賴記憶判讀',
    '與主內容顏色過於相似，形成視覺噪音',
    '未設定固定 y 軸範圍，單一離群值壓扁整條曲線',
    '忽略 tooltip 與懸停互動，造成使用者無法取得精確資料',
  ],
  accessibility: [
    '容器提供 role="img" 與 aria-label，說明圖表所代表的指標與時間範圍',
    '搭配可見的摘要數值與趨勢文字（例如「上升 5.2%」），不單靠圖形',
    '色彩選擇需符合 WCAG AA 對比度，並支援色盲使用者',
    '若可互動，tooltip 觸發後需以 aria-live 播報資料點',
    '鍵盤焦點樣式清晰可見，避免以顏色唯一標示焦點',
    '提供資料表替代方案供螢幕閱讀器讀取完整序列',
  ],
};

const META: CatalogBlockMeta = {
  id: 'spark-area-charts',
  title: 'Spark Area Charts',
  category: 'application',
  subcategory: 'Charts',
  summary:
    '迷你面積走勢圖集合，適合嵌入 KPI 卡片、表格列與密集型儀表板，以極簡樣式快速傳達趨勢方向。',
  tags: ['chart', 'sparkline', 'area-chart', 'mini-chart', 'trend'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['area-charts', 'kpi-cards', 'donut-charts'],
};

@Component({
  selector: 'app-spark-area-charts-catalog-page',
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
export class SparkAreaChartsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
