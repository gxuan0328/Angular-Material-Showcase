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

import { AnimatedCopyButtonComponent } from '../../blocks/components/animated-copy-button/animated-copy-button.component';
import { BarListComponent } from '../../blocks/components/bar-list/bar-list.component';
import { CategoryBarComponent } from '../../blocks/components/category-bar/category-bar.component';
import { TrackerComponent } from '../../blocks/components/tracker/tracker.component';
import { sampleTrackerData } from '../../blocks/components/tracker/tracker.model';
import { WordRotateComponent } from '../../blocks/components/word-rotate/word-rotate.component';

// Demo wrappers for "headless" vendor blocks that can't be rendered
// directly via ngComponentOutlet (they rely on contentChildren directives
// or <ng-content> projection). Each wrapper provides sample content so the
// Live Preview shows something meaningful to the developer.
import { BigButtonDemo } from './components-demos/big-button-demo';
import { BreadcrumbsDemo } from './components-demos/breadcrumbs-demo';
import { DragElementsDemo } from './components-demos/drag-elements-demo';
import { MarqueeDemo } from './components-demos/marquee-demo';
import { ProgressCircleDemo } from './components-demos/progress-circle-demo';
import { TerminalDemo } from './components-demos/terminal-demo';

// Demo data payloads passed via ngComponentOutlet inputs for the 4 vendor
// blocks with `input.required<T>()` declarations. Without these the preview
// crashes with NG0950 and the component falls back to raw text content.
const DEMO_BAR_LIST_DATA = [
  { name: '/home', value: 1280 },
  { name: '/pricing', value: 854 },
  { name: '/docs', value: 612 },
  { name: '/about', value: 390 },
  { name: '/contact', value: 145 },
];

const DEMO_CATEGORY_BAR_VALUES = [28, 45, 18, 9];

const DEMO_WORDS = ['Faster', 'Sharper', 'Accessible', 'Typed'];

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'animated-copy-button',
    label: 'Animated Copy Button — 動畫複製按鈕',
    registryCategory: 'components',
    component: AnimatedCopyButtonComponent,
    isFree: false,
    demoInputs: { contentToCopy: 'npm install @ngm-dev/cli' },
  },
  {
    id: 'bar-list',
    label: 'Bar List — 條列指標',
    registryCategory: 'components',
    component: BarListComponent,
    isFree: false,
    demoInputs: { data: DEMO_BAR_LIST_DATA },
  },
  {
    id: 'big-button',
    label: 'Big Button — 大型按鈕',
    registryCategory: 'components',
    component: BigButtonDemo,
    isFree: false,
  },
  {
    id: 'breadcrumbs',
    label: 'Breadcrumbs — 麵包屑導覽',
    registryCategory: 'components',
    component: BreadcrumbsDemo,
    isFree: false,
  },
  {
    id: 'category-bar',
    label: 'Category Bar — 分類篩選列',
    registryCategory: 'components',
    component: CategoryBarComponent,
    isFree: false,
    demoInputs: { values: DEMO_CATEGORY_BAR_VALUES },
  },
  {
    id: 'drag-elements',
    label: 'Drag Elements — 可拖曳元素',
    registryCategory: 'components',
    component: DragElementsDemo,
    isFree: false,
  },
  {
    id: 'marquee',
    label: 'Marquee — 跑馬燈',
    registryCategory: 'components',
    component: MarqueeDemo,
    isFree: false,
  },
  {
    id: 'progress-circle',
    label: 'Progress Circle — 進度環',
    registryCategory: 'components',
    component: ProgressCircleDemo,
    isFree: false,
  },
  {
    id: 'terminal',
    label: 'Terminal — 終端機模擬器',
    registryCategory: 'components',
    component: TerminalDemo,
    isFree: false,
  },
  {
    id: 'tracker',
    label: 'Tracker — 狀態追蹤器',
    registryCategory: 'components',
    component: TrackerComponent,
    isFree: false,
    demoInputs: { data: sampleTrackerData },
  },
  {
    id: 'word-rotate',
    label: 'Word Rotate — 文字輪播',
    registryCategory: 'components',
    component: WordRotateComponent,
    isFree: false,
    demoInputs: { words: DEMO_WORDS },
  },
];

const API: ApiDocumentation = {
  inputs: [],
  outputs: [],
  slots: [
    {
      name: 'see source',
      type: 'component',
      default: null,
      required: false,
      description: '各元件公開介面不同，請參閱原始碼或對應元件文件',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '需要小型、可獨立重複使用的 UI 元件快速組合頁面',
    '快速組合 dashboard widgets，例如進度環、條列指標、追蹤器',
    '需要動畫互動效果提升視覺吸引力，例如動畫複製按鈕、文字輪播、跑馬燈',
    '需要清楚呈現頁面階層或分類導覽，例如麵包屑、分類篩選列',
  ],
  whenNotToUse: [
    '需要完整 form layout 結構，請改用 form-layouts 系列',
    '需要資料視覺化或圖表呈現，請改用 charts 系列元件',
  ],
  pitfalls: [
    '動畫效果過多容易分散使用者注意力，應依情境謹慎使用',
    '複製按鈕觸發後須提供明確的視覺或 aria-live 回饋，避免使用者不知道複製是否成功',
    'Breadcrumb 階層斷掉或缺少中間層，會讓使用者迷失在導覽結構中',
    '可拖曳元素應提供鍵盤操作替代方案，避免純滑鼠依賴',
  ],
  accessibility: [
    '動畫元件（Marquee、Word Rotate）必須尊重 prefers-reduced-motion 媒體查詢，靜止或降低動畫速度',
    '複製按鈕應宣告 aria-live="polite" 區域，以便螢幕閱讀器通知複製結果',
    'Breadcrumbs 應使用 <nav aria-label="Breadcrumb"> 包覆，並以 aria-current="page" 標記當前頁面',
    '進度環需附帶 role="progressbar" 與 aria-valuenow / aria-valuemin / aria-valuemax 屬性',
  ],
};

const META: CatalogBlockMeta = {
  id: 'components',
  title: 'Components',
  category: 'application',
  subcategory: 'Components',
  summary:
    '通用元件集合，包含複製按鈕、麵包屑、進度環、跑馬燈等可在多種場景重複使用的小型 UI 元件。',
  tags: ['component', 'utility', 'application'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['badges', 'flyout-menus'],
};

@Component({
  selector: 'app-components-catalog-page',
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
export class ComponentsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
