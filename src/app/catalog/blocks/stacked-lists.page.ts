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

import { SimpleStackedListComponent } from '../../blocks/free-stacked-lists/simple/simple.component';
import { StackedListFullWidthWithConstrainedContentComponent } from '../../blocks/stacked-lists/full-width-with-constrained-content/full-width-with-constrained-content.component';
import { StackedListFullWidthWithLinksComponent } from '../../blocks/stacked-lists/full-width-with-links/full-width-with-links.component';
import { NarrowStackedListComponent } from '../../blocks/stacked-lists/narrow/narrow.component';
import { NarrowWithActionsComponent } from '../../blocks/stacked-lists/narrow-with-actions/narrow-with-actions.component';
import { NarrowWithBadgesComponent } from '../../blocks/stacked-lists/narrow-with-badges/narrow-with-badges.component';
import { NarrowWithSmallAvatarsComponent } from '../../blocks/stacked-lists/narrow-with-small-avatars/narrow-with-small-avatars.component';
import { NarrowWithStickyHeadingsComponent } from '../../blocks/stacked-lists/narrow-with-sticky-headings/narrow-with-sticky-headings.component';
import { StackedListWithBadgesButtonActionMenuComponent } from '../../blocks/stacked-lists/with-badges-button-action-menu/with-badges-button-action-menu.component';
import { StackedListWithInlineLinkActionMenuComponent } from '../../blocks/stacked-lists/with-inline-link-action-menu/with-inline-link-action-menu.component';
import { StackedListWithLinksComponent } from '../../blocks/stacked-lists/with-links/with-links.component';
import { StackedListWithLinksAvatarGroupComponent } from '../../blocks/stacked-lists/with-links-avatar-group/with-links-avatar-group.component';
import { StackedListWithLinksInCardComponent } from '../../blocks/stacked-lists/with-links-in-card/with-links-in-card.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'simple',
    label: 'Simple Stacked List — 基本堆疊列表（Free）',
    registryCategory: 'free-stacked-lists',
    component: SimpleStackedListComponent,
    isFree: true,
  },
  {
    id: 'full-width-with-constrained-content',
    label: 'Full-width Constrained — 滿版含限制寬度內容',
    registryCategory: 'stacked-lists',
    component: StackedListFullWidthWithConstrainedContentComponent,
    isFree: false,
  },
  {
    id: 'full-width-with-links',
    label: 'Full-width with Links — 滿版含連結列表',
    registryCategory: 'stacked-lists',
    component: StackedListFullWidthWithLinksComponent,
    isFree: false,
  },
  {
    id: 'narrow',
    label: 'Narrow — 窄版堆疊列表',
    registryCategory: 'stacked-lists',
    component: NarrowStackedListComponent,
    isFree: false,
  },
  {
    id: 'narrow-with-actions',
    label: 'Narrow with Actions — 窄版含動作按鈕',
    registryCategory: 'stacked-lists',
    component: NarrowWithActionsComponent,
    isFree: false,
  },
  {
    id: 'narrow-with-badges',
    label: 'Narrow with Badges — 窄版含標籤',
    registryCategory: 'stacked-lists',
    component: NarrowWithBadgesComponent,
    isFree: false,
  },
  {
    id: 'narrow-with-small-avatars',
    label: 'Narrow with Small Avatars — 窄版含小型頭像',
    registryCategory: 'stacked-lists',
    component: NarrowWithSmallAvatarsComponent,
    isFree: false,
  },
  {
    id: 'narrow-with-sticky-headings',
    label: 'Narrow Sticky Headings — 分組固定標題',
    registryCategory: 'stacked-lists',
    component: NarrowWithStickyHeadingsComponent,
    isFree: false,
  },
  {
    id: 'with-badges-button-action-menu',
    label: 'Badges + Button + Menu — 標籤與動作選單',
    registryCategory: 'stacked-lists',
    component: StackedListWithBadgesButtonActionMenuComponent,
    isFree: false,
  },
  {
    id: 'with-inline-link-action-menu',
    label: 'Inline Link + Menu — 行內連結與選單',
    registryCategory: 'stacked-lists',
    component: StackedListWithInlineLinkActionMenuComponent,
    isFree: false,
  },
  {
    id: 'with-links',
    label: 'With Links — 可點擊列表',
    registryCategory: 'stacked-lists',
    component: StackedListWithLinksComponent,
    isFree: false,
  },
  {
    id: 'with-links-avatar-group',
    label: 'Links + Avatar Group — 含群組頭像',
    registryCategory: 'stacked-lists',
    component: StackedListWithLinksAvatarGroupComponent,
    isFree: false,
  },
  {
    id: 'with-links-in-card',
    label: 'Links in Card — 卡片包裝的連結列表',
    registryCategory: 'stacked-lists',
    component: StackedListWithLinksInCardComponent,
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
      description: '使用者、團隊、訊息或任意可縱向堆疊的項目列表',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '資料行本身包含多行內容（姓名、標題、時間戳、動作），表格會過於擁擠',
    '列表主要用途為導航（點擊進入詳情）而非資料比對',
    '團隊成員名單、活動動態、通知中心等應用情境',
    '需要在窄版行動裝置上維持良好可讀性的列表介面',
  ],
  whenNotToUse: [
    '需要欄位對齊以便比較（如訂單金額、時間） — 改用 Tables',
    '資料筆數極多且需要排序 — Tables 的互動能力更強',
    '主要為視覺化展示（影片/圖片） — Grid Lists 更合適',
  ],
  pitfalls: [
    '每個列項的資訊密度過高，喪失一瞥掌握的優勢',
    '固定標題（sticky headings）在行動裝置縮放時計算錯誤造成重疊',
    '可點擊整行但沒有明確 hover / focus 視覺回饋',
    '行內動作按鈕太小（< 44px）難以在行動裝置上精準點擊',
  ],
  accessibility: [
    '列表根元素使用 `role="list"` 或語意化 `<ul>`，列項使用 `<li>`',
    '可點擊的列項應為 `<a>` 或 `<button>`，確保鍵盤可達性',
    '固定標題區域使用 `role="heading" aria-level="2"` 保留階層資訊',
    '行內動作按鈕提供 `aria-label` 描述作用，如「刪除 Alice Tsai」',
    '空列表狀態透過 `aria-live="polite"` 宣告',
  ],
};

const META: CatalogBlockMeta = {
  id: 'stacked-lists',
  title: 'Stacked Lists',
  category: 'application',
  subcategory: 'Lists',
  summary:
    '堆疊式列表集合，適合呈現多行內容的資料列表如團隊成員、通知中心、活動動態，提供連結、徽章、動作選單等多種變體。',
  tags: ['list', 'stacked', 'feed', 'members'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['tables', 'lists', 'grid-lists'],
};

@Component({
  selector: 'app-stacked-lists-catalog-page',
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
export class StackedListsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
