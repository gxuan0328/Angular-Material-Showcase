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

import { SimpleFlyoutMenuComponent } from '../../blocks/free-flyout-menus/simple-flyout-menu/simple-flyout-menu.component';
import { FlyoutMenuWithIconsComponent } from '../../blocks/flyout-menus/flyout-menu-with-icons/flyout-menu-with-icons.component';
import { FlyoutWithAvatarsComponent } from '../../blocks/flyout-menus/flyout-with-avatars/flyout-with-avatars.component';
import { FlyoutWithCardsComponent } from '../../blocks/flyout-menus/flyout-with-cards/flyout-with-cards.component';
import { FlyoutWithPreviewComponent } from '../../blocks/flyout-menus/flyout-with-preview/flyout-with-preview.component';
import { FlyoutWithStatsComponent } from '../../blocks/flyout-menus/flyout-with-stats/flyout-with-stats.component';
import { FlyoutWithTabsComponent } from '../../blocks/flyout-menus/flyout-with-tabs/flyout-with-tabs.component';
import { MultiColumnFlyoutComponent } from '../../blocks/flyout-menus/multi-column-flyout/multi-column-flyout.component';
import { WideFlyoutMenuComponent } from '../../blocks/flyout-menus/wide-flyout-menu/wide-flyout-menu.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'simple-flyout-menu',
    label: 'Simple Flyout Menu — 基礎分類下拉 (Free)',
    registryCategory: 'free-flyout-menus',
    component: SimpleFlyoutMenuComponent,
    isFree: true,
  },
  {
    id: 'flyout-menu-with-icons',
    label: 'Flyout Menu with Icons — 圖示輔助項目',
    registryCategory: 'flyout-menus',
    component: FlyoutMenuWithIconsComponent,
    isFree: false,
  },
  {
    id: 'flyout-with-avatars',
    label: 'Flyout with Avatars — 頭像清單',
    registryCategory: 'flyout-menus',
    component: FlyoutWithAvatarsComponent,
    isFree: false,
  },
  {
    id: 'flyout-with-cards',
    label: 'Flyout with Cards — 卡片式快捷選單',
    registryCategory: 'flyout-menus',
    component: FlyoutWithCardsComponent,
    isFree: false,
  },
  {
    id: 'flyout-with-preview',
    label: 'Flyout with Preview — 預覽面板',
    registryCategory: 'flyout-menus',
    component: FlyoutWithPreviewComponent,
    isFree: false,
  },
  {
    id: 'flyout-with-stats',
    label: 'Flyout with Stats — 統計數據',
    registryCategory: 'flyout-menus',
    component: FlyoutWithStatsComponent,
    isFree: false,
  },
  {
    id: 'flyout-with-tabs',
    label: 'Flyout with Tabs — Tab 切換內容',
    registryCategory: 'flyout-menus',
    component: FlyoutWithTabsComponent,
    isFree: false,
  },
  {
    id: 'multi-column-flyout',
    label: 'Multi-column Flyout — 多欄佈局',
    registryCategory: 'flyout-menus',
    component: MultiColumnFlyoutComponent,
    isFree: false,
  },
  {
    id: 'wide-flyout-menu',
    label: 'Wide Flyout Menu — 寬幅下拉面板',
    registryCategory: 'flyout-menus',
    component: WideFlyoutMenuComponent,
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
        '所有 Flyout Menu 區塊皆將觸發按鈕與下拉面板內建於元件中，不開放外部插槽。如需客製化內容，請直接修改元件模板。',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '主導覽列的次選單，需展示多個分類連結或功能入口時',
    '富內容下拉情境，例如帶圖示、頭像、統計或預覽的導覽面板',
    '卡片型快捷選單，讓使用者在不跳頁的情況下快速瀏覽重點資訊',
  ],
  whenNotToUse: [
    '選項少且純文字時，使用標準 mat-menu 即可，無需 Flyout 複雜度',
    '行動裝置為主的場景，應改用 Bottom Sheet 以符合手機操作慣例',
    '需要執行多步驟流程時，改用 Dialog 以明確的焦點邊界引導使用者',
  ],
  pitfalls: [
    '點擊面板外部未觸發關閉：確保 CdkOverlayOrigin 正確監聽 overlayOutsideClick 事件',
    'ESC 鍵無法關閉面板：OverlayRef 需訂閱 keydownEvents() 並處理 Escape 鍵',
    '面板開啟後焦點未移入：需在開啟後主動呼叫 focus() 至面板第一個可互動元素',
    '行動裝置與桌機共用同一套模板：應依 DeviceService 切換 Sidenav 與 Overlay 兩種呈現方式',
  ],
  accessibility: [
    '觸發按鈕須宣告 aria-haspopup="true" 告知輔助技術此按鈕會展開選單',
    '面板開啟狀態須同步更新觸發按鈕的 aria-expanded 屬性（true / false）',
    'ESC 鍵與點擊外部兩種方式都必須能關閉面板，並將焦點歸還至觸發按鈕',
    '面板內容須實作 Focus Trap，防止 Tab 鍵跳出可見範圍',
    '面板容器建議加上 role="dialog" 或 role="menu" 並搭配 aria-label 描述用途',
  ],
};

const META: CatalogBlockMeta = {
  id: 'flyout-menus',
  title: 'Flyout Menus',
  category: 'application',
  subcategory: 'Overlays',
  summary: '彈出式選單，從觸發按鈕展開的下拉式內容區，可包含連結、圖示、頭像、統計、Tab 等富內容。',
  tags: ['menu', 'overlay', 'navigation', 'application'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['dialogs', 'components'],
};

@Component({
  selector: 'app-flyout-menus-catalog-page',
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
export class FlyoutMenusCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
