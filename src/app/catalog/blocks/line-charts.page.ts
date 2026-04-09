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

import { LineChart1Component } from '../../blocks/free-line-charts/line-chart-1/line-chart-1.component';
import { LineChart2Component } from '../../blocks/line-charts/line-chart-2/line-chart-2.component';
import { LineChart3Component } from '../../blocks/line-charts/line-chart-3/line-chart-3.component';
import { LineChart4Component } from '../../blocks/line-charts/line-chart-4/line-chart-4.component';
import { LineChart5Component } from '../../blocks/line-charts/line-chart-5/line-chart-5.component';
import { LineChart6Component } from '../../blocks/line-charts/line-chart-6/line-chart-6.component';
import { LineChart7Component } from '../../blocks/line-charts/line-chart-7/line-chart-7.component';
import { LineChart8Component } from '../../blocks/line-charts/line-chart-8/line-chart-8.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'line-chart-1',
    label: 'Line Chart 01 — 基本折線圖（Free）',
    registryCategory: 'free-line-charts',
    component: LineChart1Component,
    isFree: true,
  },
  {
    id: 'line-chart-2',
    label: 'Line Chart 02 — 多序列比較',
    registryCategory: 'line-charts',
    component: LineChart2Component,
    isFree: false,
  },
  {
    id: 'line-chart-3',
    label: 'Line Chart 03 — 含資料點標記',
    registryCategory: 'line-charts',
    component: LineChart3Component,
    isFree: false,
  },
  {
    id: 'line-chart-4',
    label: 'Line Chart 04 — 平滑曲線',
    registryCategory: 'line-charts',
    component: LineChart4Component,
    isFree: false,
  },
  {
    id: 'line-chart-5',
    label: 'Line Chart 05 — 含平均基準線',
    registryCategory: 'line-charts',
    component: LineChart5Component,
    isFree: false,
  },
  {
    id: 'line-chart-6',
    label: 'Line Chart 06 — 含區間標註',
    registryCategory: 'line-charts',
    component: LineChart6Component,
    isFree: false,
  },
  {
    id: 'line-chart-7',
    label: 'Line Chart 07 — 雙軸折線',
    registryCategory: 'line-charts',
    component: LineChart7Component,
    isFree: false,
  },
  {
    id: 'line-chart-8',
    label: 'Line Chart 08 — 含截斷軸',
    registryCategory: 'line-charts',
    component: LineChart8Component,
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
      description: '主要折線顏色',
    },
    {
      name: '--mat-sys-secondary',
      type: 'color',
      default: '#575e71',
      required: false,
      description: '次要 dataset 顏色',
    },
    {
      name: '--mat-sys-on-surface-variant',
      type: 'color',
      default: '#44474e',
      required: false,
      description: '軸標籤文字顏色',
    },
  ],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '呈現時間序列的連續變化趨勢',
    '比較多個序列的變動方向與幅度',
    '標註特定事件發生前後的數據變化',
    '觀察長期走向（週、月、季、年）',
  ],
  whenNotToUse: [
    '離散類別比較 — 使用 Bar Chart',
    '整體與部分比例 — 使用 Donut Chart',
    '資料點極少（< 3）時折線缺乏意義',
    '需要精確讀出單一數值 — 改用 Tables',
  ],
  pitfalls: [
    'y 軸截斷造成趨勢視覺誇大',
    '多個序列顏色過近難以區分',
    '缺少時間間隔說明，tooltip 顯示不完整',
    '混用絕對值與百分比造成比例失真',
  ],
  accessibility: [
    '提供描述性 `aria-label` 包含主題與時間範圍',
    '同時提供資料表作為螢幕閱讀器替代',
    '使用 dash/dot pattern 搭配顏色區分 datasets',
    '鍵盤可切換 tooltip 焦點',
  ],
};

const META: CatalogBlockMeta = {
  id: 'line-charts',
  title: 'Line Charts',
  category: 'application',
  subcategory: 'Charts',
  summary:
    '折線圖集合，呈現時間序列與連續變化趨勢，支援多序列、雙軸、平滑曲線、區間標註等變體。',
  tags: ['chart', 'line', 'trend', 'time-series'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['area-charts', 'bar-charts', 'spark-area-charts', 'chart-compositions'],
};

@Component({
  selector: 'app-line-charts-catalog-page',
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
export class LineChartsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
