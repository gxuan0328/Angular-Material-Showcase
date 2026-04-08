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

import { EmptyState1Component } from '../../blocks/empty-states/empty-state-1/empty-state-1.component';
import { EmptyState2Component } from '../../blocks/empty-states/empty-state-2/empty-state-2.component';
import { EmptyState3Component } from '../../blocks/empty-states/empty-state-3/empty-state-3.component';
import { EmptyState4Component } from '../../blocks/empty-states/empty-state-4/empty-state-4.component';
import { EmptyState5Component } from '../../blocks/empty-states/empty-state-5/empty-state-5.component';
import { EmptyState6Component } from '../../blocks/empty-states/empty-state-6/empty-state-6.component';
import { EmptyState7Component } from '../../blocks/empty-states/empty-state-7/empty-state-7.component';
import { EmptyState8Component } from '../../blocks/empty-states/empty-state-8/empty-state-8.component';
import { EmptyState9Component } from '../../blocks/empty-states/empty-state-9/empty-state-9.component';
import { EmptyState10Component } from '../../blocks/empty-states/empty-state-10/empty-state-10.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'empty-state-1',
    label: 'Empty State 1 — 簡潔置中',
    registryCategory: 'empty-states',
    component: EmptyState1Component,
    isFree: false,
  },
  {
    id: 'empty-state-2',
    label: 'Empty State 2 — 帶 CTA 按鈕',
    registryCategory: 'empty-states',
    component: EmptyState2Component,
    isFree: false,
  },
  {
    id: 'empty-state-3',
    label: 'Empty State 3 — 含圖示與說明',
    registryCategory: 'empty-states',
    component: EmptyState3Component,
    isFree: false,
  },
  {
    id: 'empty-state-4',
    label: 'Empty State 4 — 卡片式佈局',
    registryCategory: 'empty-states',
    component: EmptyState4Component,
    isFree: false,
  },
  {
    id: 'empty-state-5',
    label: 'Empty State 5 — 含資料列表佔位',
    registryCategory: 'empty-states',
    component: EmptyState5Component,
    isFree: false,
  },
  {
    id: 'empty-state-6',
    label: 'Empty State 6 — 搜尋無結果',
    registryCategory: 'empty-states',
    component: EmptyState6Component,
    isFree: false,
  },
  {
    id: 'empty-state-7',
    label: 'Empty State 7 — 權限受限提示',
    registryCategory: 'empty-states',
    component: EmptyState7Component,
    isFree: false,
  },
  {
    id: 'empty-state-8',
    label: 'Empty State 8 — 錯誤回退畫面',
    registryCategory: 'empty-states',
    component: EmptyState8Component,
    isFree: false,
  },
  {
    id: 'empty-state-9',
    label: 'Empty State 9 — 初次造訪引導',
    registryCategory: 'empty-states',
    component: EmptyState9Component,
    isFree: false,
  },
  {
    id: 'empty-state-10',
    label: 'Empty State 10 — 多動作選項',
    registryCategory: 'empty-states',
    component: EmptyState10Component,
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
      description:
        '可選的行動呼籲區塊（按鈕或連結），各 variant 內部已包含預設 CTA，僅需在需要覆寫時投影內容',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '第一次造訪頁面，資料尚未建立時（例如空白的任務清單或儀表板）',
    '搜尋或篩選條件無符合結果，需要告知使用者並提供清除篩選的行動',
    '使用者權限不足，無法存取該資源，需要說明原因與可採取的步驟',
    'API 呼叫失敗作為 fallback，在不中斷流程的前提下顯示友善的錯誤提示',
    '資料區段被清空後，取代空白區塊以維持頁面視覺完整性',
  ],
  whenNotToUse: [
    '資料仍在載入中，應使用 spinner 或 skeleton 而非空狀態',
    '輕微的欄位驗證或區域性錯誤，應使用 inline alert 或 snack bar 提示',
    '內容只是暫時收合或隱藏，不應視為「空」而顯示此元件',
  ],
  pitfalls: [
    '訊息過於冷漠或技術性（如「404 No data found」），應使用貼近使用者情境的文案',
    'Illustration 圖示過大，遮住主要 CTA，導致使用者不知道下一步',
    '未提供可行的引導行動，讓使用者停在空畫面不知所措',
    '將空狀態與錯誤狀態混用，兩者應有明確的視覺與文案區別',
    '在同一頁面多個區段同時顯示空狀態，造成視覺噪音，應考慮整合為單一提示',
  ],
  accessibility: [
    '空狀態容器使用 role="region" 搭配 aria-label 說明用途，讓螢幕閱讀器能識別該區域',
    'Illustration 若為裝飾性圖片應加 aria-hidden="true"；若有語義則需提供 alt 文字',
    '保持 heading 層級的連續性，空狀態標題應符合頁面 DOM 結構中的正確 h 層級',
    'CTA 按鈕需可透過鍵盤觸發（Tab 可聚焦、Enter / Space 可啟動），避免只能點擊',
    '確保文字與背景色的對比度符合 WCAG AA（一般文字 4.5:1、大型文字 3:1）',
  ],
};

const META: CatalogBlockMeta = {
  id: 'empty-states',
  title: 'Empty States',
  category: 'application',
  subcategory: 'Feedbacks',
  summary:
    '空狀態畫面，當清單、搜尋結果、儀表板等資料區無內容時呈現的友善提示，含 illustration、說明文字與引導行動。',
  tags: ['feedback', 'empty', 'placeholder', 'application'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['lists', 'tables'],
};

@Component({
  selector: 'app-empty-states-catalog-page',
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
export class EmptyStatesCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
