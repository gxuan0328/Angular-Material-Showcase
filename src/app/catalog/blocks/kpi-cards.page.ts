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

import { KpiCard01Component } from '../../blocks/kpi-cards/kpi-card-01/kpi-card-01.component';
import { KpiCard02Component } from '../../blocks/kpi-cards/kpi-card-02/kpi-card-02.component';
import { KpiCard03Component } from '../../blocks/kpi-cards/kpi-card-03/kpi-card-03.component';
import { KpiCard04Component } from '../../blocks/kpi-cards/kpi-card-04/kpi-card-04.component';
import { KpiCard05Component } from '../../blocks/kpi-cards/kpi-card-05/kpi-card-05.component';
import { KpiCard06Component } from '../../blocks/kpi-cards/kpi-card-06/kpi-card-06.component';
import { KpiCard07Component } from '../../blocks/kpi-cards/kpi-card-07/kpi-card-07.component';
import { KpiCard08Component } from '../../blocks/kpi-cards/kpi-card-08/kpi-card-08.component';
import { KpiCard09Component } from '../../blocks/kpi-cards/kpi-card-09/kpi-card-09.component';
import { KpiCard10Component } from '../../blocks/kpi-cards/kpi-card-10/kpi-card-10.component';
import { KpiCard11Component } from '../../blocks/kpi-cards/kpi-card-11/kpi-card-11.component';
import { KpiCard12Component } from '../../blocks/kpi-cards/kpi-card-12/kpi-card-12.component';
import { KpiCard13Component } from '../../blocks/kpi-cards/kpi-card-13/kpi-card-13.component';
import { KpiCard14Component } from '../../blocks/kpi-cards/kpi-card-14/kpi-card-14.component';
import { KpiCard15Component } from '../../blocks/kpi-cards/kpi-card-15/kpi-card-15.component';
import { KpiCard16Component } from '../../blocks/kpi-cards/kpi-card-16/kpi-card-16.component';
import { KpiCard17Component } from '../../blocks/kpi-cards/kpi-card-17/kpi-card-17.component';
import { KpiCard18Component } from '../../blocks/kpi-cards/kpi-card-18/kpi-card-18.component';
import { KpiCard19Component } from '../../blocks/kpi-cards/kpi-card-19/kpi-card-19.component';
import { KpiCard20Component } from '../../blocks/kpi-cards/kpi-card-20/kpi-card-20.component';
import { KpiCard21Component } from '../../blocks/kpi-cards/kpi-card-21/kpi-card-21.component';
import { KpiCard22Component } from '../../blocks/kpi-cards/kpi-card-22/kpi-card-22.component';
import { KpiCard23Component } from '../../blocks/kpi-cards/kpi-card-23/kpi-card-23.component';
import { KpiCard24Component } from '../../blocks/kpi-cards/kpi-card-24/kpi-card-24.component';
import { KpiCard25Component } from '../../blocks/kpi-cards/kpi-card-25/kpi-card-25.component';
import { KpiCard26Component } from '../../blocks/kpi-cards/kpi-card-26/kpi-card-26.component';
import { KpiCard27Component } from '../../blocks/kpi-cards/kpi-card-27/kpi-card-27.component';
import { KpiCard28Component } from '../../blocks/kpi-cards/kpi-card-28/kpi-card-28.component';
import { KpiCard29Component } from '../../blocks/kpi-cards/kpi-card-29/kpi-card-29.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'kpi-card-01',
    label: 'KPI Card 01 — 單一指標卡',
    registryCategory: 'kpi-cards',
    component: KpiCard01Component,
    isFree: false,
  },
  {
    id: 'kpi-card-02',
    label: 'KPI Card 02 — 指標加趨勢箭頭',
    registryCategory: 'kpi-cards',
    component: KpiCard02Component,
    isFree: false,
  },
  {
    id: 'kpi-card-03',
    label: 'KPI Card 03 — 指標加比較差值',
    registryCategory: 'kpi-cards',
    component: KpiCard03Component,
    isFree: false,
  },
  {
    id: 'kpi-card-04',
    label: 'KPI Card 04 — 指標加小型走勢圖',
    registryCategory: 'kpi-cards',
    component: KpiCard04Component,
    isFree: false,
  },
  {
    id: 'kpi-card-05',
    label: 'KPI Card 05 — 指標加進度條',
    registryCategory: 'kpi-cards',
    component: KpiCard05Component,
    isFree: false,
  },
  {
    id: 'kpi-card-06',
    label: 'KPI Card 06 — 指標加圖示強調',
    registryCategory: 'kpi-cards',
    component: KpiCard06Component,
    isFree: false,
  },
  {
    id: 'kpi-card-07',
    label: 'KPI Card 07 — 指標加目標達成率',
    registryCategory: 'kpi-cards',
    component: KpiCard07Component,
    isFree: false,
  },
  {
    id: 'kpi-card-08',
    label: 'KPI Card 08 — 指標加區段色塊',
    registryCategory: 'kpi-cards',
    component: KpiCard08Component,
    isFree: false,
  },
  {
    id: 'kpi-card-09',
    label: 'KPI Card 09 — 指標加日期範圍',
    registryCategory: 'kpi-cards',
    component: KpiCard09Component,
    isFree: false,
  },
  {
    id: 'kpi-card-10',
    label: 'KPI Card 10 — 指標加輔助資訊列',
    registryCategory: 'kpi-cards',
    component: KpiCard10Component,
    isFree: false,
  },
  {
    id: 'kpi-card-11',
    label: 'KPI Card 11 — 多指標對比卡',
    registryCategory: 'kpi-cards',
    component: KpiCard11Component,
    isFree: false,
  },
  {
    id: 'kpi-card-12',
    label: 'KPI Card 12 — 指標加長條圖',
    registryCategory: 'kpi-cards',
    component: KpiCard12Component,
    isFree: false,
  },
  {
    id: 'kpi-card-13',
    label: 'KPI Card 13 — 指標加面積走勢',
    registryCategory: 'kpi-cards',
    component: KpiCard13Component,
    isFree: false,
  },
  {
    id: 'kpi-card-14',
    label: 'KPI Card 14 — 指標加環狀圖',
    registryCategory: 'kpi-cards',
    component: KpiCard14Component,
    isFree: false,
  },
  {
    id: 'kpi-card-15',
    label: 'KPI Card 15 — 指標加分類標籤',
    registryCategory: 'kpi-cards',
    component: KpiCard15Component,
    isFree: false,
  },
  {
    id: 'kpi-card-16',
    label: 'KPI Card 16 — 多列指標概覽',
    registryCategory: 'kpi-cards',
    component: KpiCard16Component,
    isFree: false,
  },
  {
    id: 'kpi-card-17',
    label: 'KPI Card 17 — 指標加操作按鈕',
    registryCategory: 'kpi-cards',
    component: KpiCard17Component,
    isFree: false,
  },
  {
    id: 'kpi-card-18',
    label: 'KPI Card 18 — 指標加上下分區',
    registryCategory: 'kpi-cards',
    component: KpiCard18Component,
    isFree: false,
  },
  {
    id: 'kpi-card-19',
    label: 'KPI Card 19 — 指標加背景漸層',
    registryCategory: 'kpi-cards',
    component: KpiCard19Component,
    isFree: false,
  },
  {
    id: 'kpi-card-20',
    label: 'KPI Card 20 — 指標加迷你柱狀圖',
    registryCategory: 'kpi-cards',
    component: KpiCard20Component,
    isFree: false,
  },
  {
    id: 'kpi-card-21',
    label: 'KPI Card 21 — 指標加前期比較',
    registryCategory: 'kpi-cards',
    component: KpiCard21Component,
    isFree: false,
  },
  {
    id: 'kpi-card-22',
    label: 'KPI Card 22 — 指標加圖示分區',
    registryCategory: 'kpi-cards',
    component: KpiCard22Component,
    isFree: false,
  },
  {
    id: 'kpi-card-23',
    label: 'KPI Card 23 — 指標加多維度標籤',
    registryCategory: 'kpi-cards',
    component: KpiCard23Component,
    isFree: false,
  },
  {
    id: 'kpi-card-24',
    label: 'KPI Card 24 — 指標加說明註解',
    registryCategory: 'kpi-cards',
    component: KpiCard24Component,
    isFree: false,
  },
  {
    id: 'kpi-card-25',
    label: 'KPI Card 25 — 指標加明暗對比版型',
    registryCategory: 'kpi-cards',
    component: KpiCard25Component,
    isFree: false,
  },
  {
    id: 'kpi-card-26',
    label: 'KPI Card 26 — 指標加徽章標記',
    registryCategory: 'kpi-cards',
    component: KpiCard26Component,
    isFree: false,
  },
  {
    id: 'kpi-card-27',
    label: 'KPI Card 27 — 指標加下鑽連結',
    registryCategory: 'kpi-cards',
    component: KpiCard27Component,
    isFree: false,
  },
  {
    id: 'kpi-card-28',
    label: 'KPI Card 28 — 指標加多期切換',
    registryCategory: 'kpi-cards',
    component: KpiCard28Component,
    isFree: false,
  },
  {
    id: 'kpi-card-29',
    label: 'KPI Card 29 — 指標加豐富資訊面板',
    registryCategory: 'kpi-cards',
    component: KpiCard29Component,
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
      description: 'KPI 卡片內容區塊（標題、主要數值、趨勢指標、輔助圖表或圖示）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '儀表板概覽區：以一組卡片呈現業務關鍵指標（收入、訂單數、活躍使用者、轉換率）',
    '管理後台首頁：快速讓管理者掌握當日或本期的重要績效',
    '行銷著陸頁成效展示：以數字佐證產品效益與社群證據',
    '多維度比較：同時呈現期間 vs 前期、目標 vs 實際的達成狀態',
    '即時監控面板：搭配自動刷新呈現線上使用者數、交易量等即時指標',
  ],
  whenNotToUse: [
    '需要深入分析的詳細表格資料 — 應使用 DataTable 而非 KPI Card',
    '單筆詳細記錄檢視 — 應使用 Detail Page 或 Description List',
    '超過 12 個指標同時呈現 — 版面雜亂，應改以分頁或 Tabs 區隔',
    '需要使用者自行調整維度的探索式分析 — 應使用 Pivot Table 或 BI 工具',
  ],
  pitfalls: [
    '把低訊雜比的次要指標一律做成大卡片，稀釋使用者對關鍵 KPI 的注意力',
    '僅顯示當期數值而沒有比較基準，使用者無法判斷好壞',
    '使用色彩編碼（紅/綠）時未考慮色盲使用者，必須搭配圖示或文字',
    '在行動裝置上強制保持多欄佈局，造成文字壓縮或卡片溢出',
    '數值更新時沒有動畫過渡或 aria-live 播報，使用者會誤以為畫面凍結',
    '百分比與絕對值混用未明確標示單位，造成解讀錯誤',
  ],
  accessibility: [
    '每張卡片以 role="group" 或 <section> 包裝並提供 aria-label / aria-labelledby 標示卡片主題',
    '趨勢方向不可僅靠顏色，須搭配上下箭頭圖示與文字（例如「上升 12.3%」）',
    '數值變動即時更新時，使用 aria-live="polite" 播報最新值，避免打斷使用者操作',
    '指標內含的迷你圖表需提供替代文字或資料表的隱藏描述',
    '卡片可點擊下鑽時需使用 <a> 或 role="link"，並確保鍵盤可達',
    '文字與背景需符合 WCAG AA 對比度（4.5:1 以上）',
  ],
};

const META: CatalogBlockMeta = {
  id: 'kpi-cards',
  title: 'KPI Cards',
  category: 'marketing',
  subcategory: 'Marketing Page Sections',
  summary:
    '關鍵績效指標卡片集合，涵蓋單一指標、趨勢箭頭、迷你圖表、目標達成率等多種版型，適合儀表板與著陸頁成效展示。',
  tags: ['kpi', 'metric', 'dashboard', 'stat', 'card'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['area-charts', 'spark-area-charts', 'donut-charts'],
};

@Component({
  selector: 'app-kpi-cards-catalog-page',
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
export class KpiCardsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
