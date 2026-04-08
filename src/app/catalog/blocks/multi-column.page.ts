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

import { FullWidthThreeColumnComponent } from '../../blocks/free-multi-column/full-width-three-column/full-width-three-column.component';
import { ConstrainedThreeColumnComponent } from '../../blocks/multi-column/constrained-three-column/constrained-three-column.component';
import { ConstrainedWithStickyColumnsComponent } from '../../blocks/multi-column/constrained-with-sticky-columns/constrained-with-sticky-columns.component';
import { FullWidthSecondaryRightComponent } from '../../blocks/multi-column/full-width-secondary-right/full-width-secondary-right.component';
import { FullWidthWithNarrowSidebarComponent } from '../../blocks/multi-column/full-width-with-narrow-sidebar/full-width-with-narrow-sidebar.component';
import { FullWidthWithNarrowSidebarHeaderComponent } from '../../blocks/multi-column/full-width-with-narrow-sidebar-header/full-width-with-narrow-sidebar-header.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'full-width-three-column',
    label: 'Full Width Three Column — 全寬三欄 (Free)',
    registryCategory: 'free-multi-column',
    component: FullWidthThreeColumnComponent,
    isFree: true,
  },
  {
    id: 'constrained-three-column',
    label: 'Constrained Three Column — 受限三欄',
    registryCategory: 'multi-column',
    component: ConstrainedThreeColumnComponent,
    isFree: false,
  },
  {
    id: 'constrained-with-sticky-columns',
    label: 'Constrained With Sticky Columns — 受限含黏性欄',
    registryCategory: 'multi-column',
    component: ConstrainedWithStickyColumnsComponent,
    isFree: false,
  },
  {
    id: 'full-width-secondary-right',
    label: 'Full Width Secondary Right — 全寬右側次要欄',
    registryCategory: 'multi-column',
    component: FullWidthSecondaryRightComponent,
    isFree: false,
  },
  {
    id: 'full-width-with-narrow-sidebar',
    label: 'Full Width With Narrow Sidebar — 全寬含窄側邊欄',
    registryCategory: 'multi-column',
    component: FullWidthWithNarrowSidebarComponent,
    isFree: false,
  },
  {
    id: 'full-width-with-narrow-sidebar-header',
    label: 'Full Width With Narrow Sidebar Header — 全寬含窄側邊欄 Header',
    registryCategory: 'multi-column',
    component: FullWidthWithNarrowSidebarHeaderComponent,
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
      description: '頁面主要內容區塊（各欄位內容由版型內部佔位元件示意）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '需要同時呈現主內容與側邊欄，例如 dashboard、文件閱讀器、設定頁面',
    '複雜後台應用需要固定導覽列搭配可捲動主區域的情境',
    '需要「主欄 + 次要欄」的非對稱兩欄或三欄版型',
    '希望在大螢幕展示豐富資訊，同時在小螢幕自動收合側欄的響應式設計',
  ],
  whenNotToUse: [
    '內容單一線性，無需多欄並排（請改用 Page Shells 或 Stacked Layouts）',
    '行動裝置為主要目標平台，多欄版型會造成大量 CSS 複雜度',
    '側欄內容量極少，不足以支撐獨立欄位的視覺重量',
  ],
  pitfalls: [
    '響應式折疊時務必確認側欄正確隱藏，避免在小螢幕產生水平捲軸',
    '黏性（sticky）欄位需搭配 overflow 設定，父容器不可設 overflow:hidden 否則 sticky 失效',
    '多欄並排時要平衡視覺重量，避免主欄寬度過窄造成閱讀困難',
    '可捲動獨立欄位（scrollable columns）需明確設定 height 或 max-height，否則內容會無限延伸',
    '不要在 Multi-column 內再嵌套另一個 Multi-column，避免 sidenav 容器衝突',
  ],
  accessibility: [
    '側邊欄需使用 <aside> 或 role="complementary" 語意標籤，主內容區需使用 <main>',
    'Focus 順序應與視覺呈現順序一致：導覽列 → 主內容 → 側欄，避免跳躍式 Tab 順序',
    '響應式折疊時，隱藏的側欄元素應設 aria-hidden="true" 並移除可 Focus 元素的 tabindex',
    '鍵盤使用者需能以 Skip Link 跳過重複的側欄導覽直達主內容',
    '導覽區塊須包含 aria-label 以區分頁面中多個 <nav> landmark（例如「主要導覽」vs「次要導覽」）',
  ],
};

const META: CatalogBlockMeta = {
  id: 'multi-column',
  title: 'Multi-column',
  category: 'application',
  subcategory: 'Application Shells',
  summary: '多欄式應用殼，提供主內容區與側邊欄的彈性版型，適合 dashboard、文件閱讀器、複雜後台。',
  tags: ['layout', 'shell', 'columns', 'application'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['page-shells', 'stacked-layouts'],
};

@Component({
  selector: 'app-multi-column-catalog-page',
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
export class MultiColumnCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
