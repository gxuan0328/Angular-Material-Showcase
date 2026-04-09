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

import { FormLayout1Component } from '../../blocks/form-layouts/form-layout-1/form-layout-1.component';
import { FormLayout2Component } from '../../blocks/form-layouts/form-layout-2/form-layout-2.component';
import { FormLayout3Component } from '../../blocks/form-layouts/form-layout-3/form-layout-3.component';
import { FormLayout4Component } from '../../blocks/form-layouts/form-layout-4/form-layout-4.component';
import { FormLayout5Component } from '../../blocks/form-layouts/form-layout-5/form-layout-5.component';
import { FormLayout6Component } from '../../blocks/form-layouts/form-layout-6/form-layout-6.component';

const VARIANTS: readonly BlockVariant[] = [
  { id: 'form-layout-1', label: 'Form Layout 01 — 單欄標準表單', registryCategory: 'form-layouts', component: FormLayout1Component, isFree: false },
  { id: 'form-layout-2', label: 'Form Layout 02 — 含章節分組', registryCategory: 'form-layouts', component: FormLayout2Component, isFree: false },
  { id: 'form-layout-3', label: 'Form Layout 03 — 雙欄並排表單', registryCategory: 'form-layouts', component: FormLayout3Component, isFree: false },
  { id: 'form-layout-4', label: 'Form Layout 04 — 卡片式表單', registryCategory: 'form-layouts', component: FormLayout4Component, isFree: false },
  { id: 'form-layout-5', label: 'Form Layout 05 — 含側邊說明', registryCategory: 'form-layouts', component: FormLayout5Component, isFree: false },
  { id: 'form-layout-6', label: 'Form Layout 06 — 含步驟指示器', registryCategory: 'form-layouts', component: FormLayout6Component, isFree: false },
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
      description: '表單欄位與提交按鈕',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '設定頁面、新增資源、編輯個人資料等需要結構化表單的場景',
    '複雜表單需要分組說明與邏輯章節',
    '雙欄佈局適合桌面寬螢幕下並排欄位以節省縱向空間',
    '含側邊說明的佈局可在表單旁補充使用指引',
  ],
  whenNotToUse: [
    '僅 1-2 個欄位的簡單表單 — 直接使用 MatFormField 即可',
    '資料輸入密度極高的場景 — 使用 Tables 的 inline edit 較佳',
  ],
  pitfalls: [
    '雙欄佈局在窄螢幕未 fallback 成單欄，造成欄位擁擠',
    '欄位間距過大導致視覺凌亂；應統一使用 8px grid',
    '提交按鈕位置不一致（有時底部中央、有時右側）— 應統一為底部右側',
    '缺少必填欄位視覺標示（星號或輔助文字）',
  ],
  accessibility: [
    '每個欄位使用 `<label>` 或 `aria-labelledby` 關聯',
    '錯誤訊息使用 `aria-describedby` 指向欄位',
    '表單提交失敗時聚焦第一個錯誤欄位並宣告錯誤',
    '必填欄位使用 `aria-required="true"` 或 `required` 屬性',
  ],
};

const META: CatalogBlockMeta = {
  id: 'form-layouts',
  title: 'Form Layouts',
  category: 'application',
  subcategory: 'Forms',
  summary:
    '表單版面範本集合，提供單欄、雙欄、分組、卡片式、含側邊說明等多種常見表單佈局骨架。',
  tags: ['form', 'layout', 'settings'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['account-user-management', 'authentication'],
};

@Component({
  selector: 'app-form-layouts-catalog-page',
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
export class FormLayoutsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
