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

import { SectionHeading1Component } from '../../blocks/section-headings/section-heading-1/section-heading-1.component';
import { SectionHeading2Component } from '../../blocks/section-headings/section-heading-2/section-heading-2.component';
import { SectionHeading3Component } from '../../blocks/section-headings/section-heading-3/section-heading-3.component';
import { SectionHeading4Component } from '../../blocks/section-headings/section-heading-4/section-heading-4.component';
import { SectionHeading5Component } from '../../blocks/section-headings/section-heading-5/section-heading-5.component';
import { SectionHeading6Component } from '../../blocks/section-headings/section-heading-6/section-heading-6.component';
import { SectionHeading7Component } from '../../blocks/section-headings/section-heading-7/section-heading-7.component';
import { SectionHeading8Component } from '../../blocks/section-headings/section-heading-8/section-heading-8.component';
import { SectionHeading9Component } from '../../blocks/section-headings/section-heading-9/section-heading-9.component';
import { SectionHeading10Component } from '../../blocks/section-headings/section-heading-10/section-heading-10.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'section-heading-1',
    label: 'Section Heading 1 — 基礎底線標題',
    registryCategory: 'section-headings',
    component: SectionHeading1Component,
    isFree: false,
  },
  {
    id: 'section-heading-2',
    label: 'Section Heading 2 — 含描述文字',
    registryCategory: 'section-headings',
    component: SectionHeading2Component,
    isFree: false,
  },
  {
    id: 'section-heading-3',
    label: 'Section Heading 3 — 含操作按鈕',
    registryCategory: 'section-headings',
    component: SectionHeading3Component,
    isFree: false,
  },
  {
    id: 'section-heading-4',
    label: 'Section Heading 4 — 含徽章標籤',
    registryCategory: 'section-headings',
    component: SectionHeading4Component,
    isFree: false,
  },
  {
    id: 'section-heading-5',
    label: 'Section Heading 5 — 含搜尋列',
    registryCategory: 'section-headings',
    component: SectionHeading5Component,
    isFree: false,
  },
  {
    id: 'section-heading-6',
    label: 'Section Heading 6 — 含圖示',
    registryCategory: 'section-headings',
    component: SectionHeading6Component,
    isFree: false,
  },
  {
    id: 'section-heading-7',
    label: 'Section Heading 7 — 含麵包屑導航',
    registryCategory: 'section-headings',
    component: SectionHeading7Component,
    isFree: false,
  },
  {
    id: 'section-heading-8',
    label: 'Section Heading 8 — 含頁籤切換',
    registryCategory: 'section-headings',
    component: SectionHeading8Component,
    isFree: false,
  },
  {
    id: 'section-heading-9',
    label: 'Section Heading 9 — 含統計數字',
    registryCategory: 'section-headings',
    component: SectionHeading9Component,
    isFree: false,
  },
  {
    id: 'section-heading-10',
    label: 'Section Heading 10 — 含頭像與操作',
    registryCategory: 'section-headings',
    component: SectionHeading10Component,
    isFree: false,
  },
];

const API: ApiDocumentation = {
  inputs: [],
  outputs: [],
  slots: [
    {
      name: 'title',
      type: 'string (hardcoded)',
      default: null,
      required: false,
      description: '區段標題文字，各 variant 以元件內部屬性 title 提供展示用預設值',
    },
    {
      name: 'actions',
      type: 'ng-content[slot="actions"]',
      default: null,
      required: false,
      description: '放置操作按鈕（新增、分享等）的具名內容插槽，僅部分 variant 含有此區域',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '長頁面需要將內容分成多個可掃描的章節（如設定頁、表單分組、儀表板區塊）',
    '同一頁面有 3 個以上邏輯群組需要清楚區隔視覺層次',
    '需要在標題旁放置新增、篩選等操作按鈕，讓使用者快速對該區段執行動作',
  ],
  whenNotToUse: [
    '頁面只有單一主題或區域，加入區段標題反而增加視覺噪音',
    '行內小區塊或卡片內的輔助說明，應改用 subheader 或 caption 樣式',
  ],
  pitfalls: [
    'heading 階層跳級（例如從 h2 直接跳到 h4）會破壞無障礙文件結構，務必保持連續性',
    '區段標題視覺權重過大（字型過粗或尺寸過大）會蓋過內容本身，降低可讀性',
    '在行動裝置上未調整間距（padding/margin），導致標題與內容貼邊或過度擁擠',
    '搭配操作按鈕時未設置 flex-wrap，造成小螢幕按鈕溢出容器',
  ],
  accessibility: [
    '必須使用真實的 h2 / h3 等語意 heading 元素，不可僅靠字型大小或顏色假裝標題層次',
    '標題文字顏色對比需符合 WCAG AA 標準（一般文字 ≥ 4.5:1）',
    '不要省略 heading 元素、僅用視覺分隔線（hr 或 border）代替，螢幕閱讀器無法識別區段結構',
    '操作按鈕需有明確的可見文字或 aria-label，避免只用圖示而無文字說明',
  ],
};

const META: CatalogBlockMeta = {
  id: 'section-headings',
  title: 'Section Headings',
  category: 'application',
  subcategory: 'Headings',
  summary:
    '區段標題，用於將頁面內容分組為清楚可掃描的章節，適合長頁面、設定頁、表單分組與儀表板區塊。',
  tags: ['heading', 'section', 'application'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['page-headings'],
};

@Component({
  selector: 'app-section-headings-catalog-page',
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
export class SectionHeadingsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
