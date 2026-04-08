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

import { Dialog1Component } from '../../blocks/free-dialogs/dialog-1/dialog-1.component';
import { Dialog2Component } from '../../blocks/dialogs/dialog-2/dialog-2.component';
import { Dialog3Component } from '../../blocks/dialogs/dialog-3/dialog-3.component';
import { Dialog4Component } from '../../blocks/dialogs/dialog-4/dialog-4.component';
import { Dialog5Component } from '../../blocks/dialogs/dialog-5/dialog-5.component';
import { Dialog6Component } from '../../blocks/dialogs/dialog-6/dialog-6.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'dialog-1',
    label: 'Dialog 1 — 基礎確認對話框 (Free)',
    registryCategory: 'free-dialogs',
    component: Dialog1Component,
    isFree: true,
  },
  {
    id: 'dialog-2',
    label: 'Dialog 2 — 刪除工作區確認',
    registryCategory: 'dialogs',
    component: Dialog2Component,
    isFree: false,
  },
  {
    id: 'dialog-3',
    label: 'Dialog 3 — 資源轉移對話框',
    registryCategory: 'dialogs',
    component: Dialog3Component,
    isFree: false,
  },
  {
    id: 'dialog-4',
    label: 'Dialog 4 — 建立工作區',
    registryCategory: 'dialogs',
    component: Dialog4Component,
    isFree: false,
  },
  {
    id: 'dialog-5',
    label: 'Dialog 5 — 邀請成員',
    registryCategory: 'dialogs',
    component: Dialog5Component,
    isFree: false,
  },
  {
    id: 'dialog-6',
    label: 'Dialog 6 — 新增應用程式',
    registryCategory: 'dialogs',
    component: Dialog6Component,
    isFree: false,
  },
];

const API: ApiDocumentation = {
  inputs: [],
  outputs: [],
  slots: [],
  cssProperties: [],
};

// NOTE: Each variant renders a trigger button that opens the actual dialog via
// MatDialog.open(). The dialog component itself is not used as inline content;
// all dialog state and result is communicated through MatDialogRef.afterClosed().

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '執行危險或不可逆操作前（刪除、清除資料）需要使用者明確確認',
    '需要使用者填寫表單輸入後才能繼續的流程（建立工作區、邀請成員）',
    '多步驟邀請或設定流程，需要將操作聚焦在獨立視窗中完成',
    '資源轉移等需要選擇目標並確認的複雜單步驟操作',
  ],
  whenNotToUse: [
    '僅需顯示簡短通知或成功訊息，應改用 Snackbar / Toast',
    '表單欄位少且頁面空間足夠，直接以 inline 表單呈現即可',
    '操作可立即撤銷（例如軟刪除 + Undo），不需要強制確認步驟',
  ],
  pitfalls: [
    '未提供明確的「取消」按鈕，導致使用者找不到退出路徑',
    '未設定 Esc 鍵關閉對話框（MatDialog 預設支援，請勿覆寫為 disableClose 除非業務必要）',
    '自動聚焦（autofocus）設在危險操作按鈕（如「刪除」）上，容易造成誤觸',
    '行動裝置版未提供關閉按鈕，且對話框佔滿全螢幕時使用者無法離開',
    '未等待 afterClosed() 就執行後續操作，導致在使用者取消後仍觸發動作',
  ],
  accessibility: [
    '確保對話框容器設有 role="dialog" 與 aria-modal="true"，MatDialog 預設已處理',
    '以 aria-labelledby 指向對話框標題，以 aria-describedby 指向描述段落',
    '對話框開啟時焦點必須移入對話框內（MatDialog 預設行為），關閉後焦點須回到觸發按鈕',
    '對話框內需實作 focus trap，禁止 Tab 跳出對話框範圍（CDK FocusTrap 已內建）',
    '按下 Esc 鍵應關閉對話框並將焦點還原至觸發元素',
  ],
};

const META: CatalogBlockMeta = {
  id: 'dialogs',
  title: 'Dialogs',
  category: 'application',
  subcategory: 'Overlays',
  summary: '對話框與確認彈窗，包含工作區管理、邀請成員、危險操作確認等常見場景的高品質範例。',
  tags: ['dialog', 'modal', 'overlay', 'application'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['flyout-menus'],
};

@Component({
  selector: 'app-dialogs-catalog-page',
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
export class DialogsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
