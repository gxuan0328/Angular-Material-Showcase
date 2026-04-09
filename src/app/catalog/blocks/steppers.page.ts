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

import { Stepper1Component } from '../../blocks/custom-steppers/stepper-1/stepper-1.component';
import { Stepper2Component } from '../../blocks/custom-steppers/stepper-2/stepper-2.component';
import { Stepper3Component } from '../../blocks/custom-steppers/stepper-3/stepper-3.component';
import { Stepper4Component } from '../../blocks/custom-steppers/stepper-4/stepper-4.component';
import { Stepper5Component } from '../../blocks/custom-steppers/stepper-5/stepper-5.component';
import { Stepper6Component } from '../../blocks/custom-steppers/stepper-6/stepper-6.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'stepper-1',
    label: 'Stepper 01 — 水平基本型',
    registryCategory: 'custom-steppers',
    component: Stepper1Component,
    isFree: true,
  },
  {
    id: 'stepper-2',
    label: 'Stepper 02 — 垂直分階段',
    registryCategory: 'custom-steppers',
    component: Stepper2Component,
    isFree: true,
  },
  {
    id: 'stepper-3',
    label: 'Stepper 03 — 非線性含選填步驟',
    registryCategory: 'custom-steppers',
    component: Stepper3Component,
    isFree: true,
  },
  {
    id: 'stepper-4',
    label: 'Stepper 04 — 自訂圖示',
    registryCategory: 'custom-steppers',
    component: Stepper4Component,
    isFree: true,
  },
  {
    id: 'stepper-5',
    label: 'Stepper 05 — 含表單驗證',
    registryCategory: 'custom-steppers',
    component: Stepper5Component,
    isFree: true,
  },
  {
    id: 'stepper-6',
    label: 'Stepper 06 — 可編輯步驟（底部標頭）',
    registryCategory: 'custom-steppers',
    component: Stepper6Component,
    isFree: true,
  },
];

const API: ApiDocumentation = {
  inputs: [
    {
      name: 'linear',
      type: 'boolean',
      default: 'false',
      required: false,
      description: '是否強制線性流程（必須依序完成每個步驟）',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      required: false,
      description: 'Stepper 佈局方向',
    },
    {
      name: 'headerPosition',
      type: "'top' | 'bottom'",
      default: "'top'",
      required: false,
      description: '步驟標頭的位置',
    },
  ],
  outputs: [
    {
      name: 'selectionChange',
      type: 'StepperSelectionEvent',
      default: null,
      required: false,
      description: '使用者切換步驟時觸發',
    },
  ],
  slots: [],
  cssProperties: [
    {
      name: '--mat-stepper-header-selected-state-icon-background-color',
      type: 'color',
      default: 'var(--mat-sys-primary)',
      required: false,
      description: '已選步驟的圖示背景色',
    },
  ],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '多步驟表單流程（註冊、結帳、設定精靈）',
    '將複雜任務分解為可管理的小步驟',
    '需要引導使用者依序完成作業時',
    '收集大量資料但一次顯示太多會造成負擔',
  ],
  whenNotToUse: [
    '只有 1-2 個簡單欄位 — 直接用表單即可',
    '步驟之間沒有邏輯順序 — 改用 Tab',
    '使用者需要同時看到所有資料 — 改用 Accordion',
    '步驟總數超過 7 個 — 考慮重新設計流程',
  ],
  pitfalls: [
    '步驟過多導致使用者放棄',
    '沒有清楚顯示目前進度和總步驟數',
    '使用者無法返回修改先前步驟的內容',
    '最後一步沒有完整摘要讓使用者確認',
    '表單驗證訊息不明確',
  ],
  accessibility: [
    'MatStepper 自動提供 `role="tablist"` 與 `role="tabpanel"` 語意',
    '步驟切換透過鍵盤方向鍵可操作',
    '每個步驟標頭需有描述性文字（不只數字）',
    '驗證錯誤需使用 `aria-live="polite"` 通知螢幕閱讀器',
  ],
};

const META: CatalogBlockMeta = {
  id: 'steppers',
  title: 'Steppers',
  category: 'application',
  subcategory: 'Forms',
  summary:
    '分階段表單導引集合，提供水平、垂直、線性、非線性、自訂圖示、含表單驗證等 6 種實作變體。',
  tags: ['stepper', 'wizard', 'form', 'multi-step'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['form-layouts', 'account-user-management', 'authentication'],
  previewMinHeight: 480,
};

@Component({
  selector: 'app-steppers-catalog-page',
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
export class SteppersCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
