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

import { OnboardingFeed1Component } from '../../blocks/free-lists/onboarding-feed-1/onboarding-feed-1.component';
import { SimpleWithIconsComponent } from '../../blocks/free-lists/simple-with-icons/simple-with-icons.component';
import { OnboardingFeed2Component } from '../../blocks/lists/onboarding-feed-2/onboarding-feed-2.component';
import { OnboardingFeed3Component } from '../../blocks/lists/onboarding-feed-3/onboarding-feed-3.component';
import { OnboardingFeed4Component } from '../../blocks/lists/onboarding-feed-4/onboarding-feed-4.component';
import { OnboardingFeed5Component } from '../../blocks/lists/onboarding-feed-5/onboarding-feed-5.component';
import { OnboardingFeed6Component } from '../../blocks/lists/onboarding-feed-6/onboarding-feed-6.component';
import { OnboardingFeed7Component } from '../../blocks/lists/onboarding-feed-7/onboarding-feed-7.component';
import { OnboardingFeed8Component } from '../../blocks/lists/onboarding-feed-8/onboarding-feed-8.component';
import { FeedWithComments01Component } from '../../blocks/lists/feed-with-comments-01/feed-with-comments-01.component';
import { FeedWithUpvote01Component } from '../../blocks/lists/feed-with-upvote-01/feed-with-upvote-01.component';
import { WithCommentsComponent } from '../../blocks/lists/with-comments/with-comments.component';
import { WithMultipleItemTypesComponent } from '../../blocks/lists/with-multiple-item-types/with-multiple-item-types.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'onboarding-feed-1',
    label: 'Onboarding Feed 1 — 入門任務清單',
    registryCategory: 'free-lists',
    component: OnboardingFeed1Component,
    isFree: true,
  },
  {
    id: 'simple-with-icons',
    label: 'Simple With Icons — 帶圖示的簡潔清單',
    registryCategory: 'free-lists',
    component: SimpleWithIconsComponent,
    isFree: true,
  },
  {
    id: 'onboarding-feed-2',
    label: 'Onboarding Feed 2 — 步驟式入門清單',
    registryCategory: 'lists',
    component: OnboardingFeed2Component,
    isFree: false,
  },
  {
    id: 'onboarding-feed-3',
    label: 'Onboarding Feed 3 — 進度追蹤清單',
    registryCategory: 'lists',
    component: OnboardingFeed3Component,
    isFree: false,
  },
  {
    id: 'onboarding-feed-4',
    label: 'Onboarding Feed 4 — 帶插圖入門清單',
    registryCategory: 'lists',
    component: OnboardingFeed4Component,
    isFree: false,
  },
  {
    id: 'onboarding-feed-5',
    label: 'Onboarding Feed 5 — 分類任務清單',
    registryCategory: 'lists',
    component: OnboardingFeed5Component,
    isFree: false,
  },
  {
    id: 'onboarding-feed-6',
    label: 'Onboarding Feed 6 — 互動式入門清單',
    registryCategory: 'lists',
    component: OnboardingFeed6Component,
    isFree: false,
  },
  {
    id: 'onboarding-feed-7',
    label: 'Onboarding Feed 7 — 完成度標記清單',
    registryCategory: 'lists',
    component: OnboardingFeed7Component,
    isFree: false,
  },
  {
    id: 'onboarding-feed-8',
    label: 'Onboarding Feed 8 — 多階段入門清單',
    registryCategory: 'lists',
    component: OnboardingFeed8Component,
    isFree: false,
  },
  {
    id: 'feed-with-comments-01',
    label: 'Feed With Comments 01 — 活動動態加留言',
    registryCategory: 'lists',
    component: FeedWithComments01Component,
    isFree: false,
  },
  {
    id: 'feed-with-upvote-01',
    label: 'Feed With Upvote 01 — 社群投票動態列表',
    registryCategory: 'lists',
    component: FeedWithUpvote01Component,
    isFree: false,
  },
  {
    id: 'with-comments',
    label: 'With Comments — 含留言區域的清單',
    registryCategory: 'lists',
    component: WithCommentsComponent,
    isFree: false,
  },
  {
    id: 'with-multiple-item-types',
    label: 'With Multiple Item Types — 多類型項目混合清單',
    registryCategory: 'lists',
    component: WithMultipleItemTypesComponent,
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
      description: '清單內容區塊（項目卡片、圖示、動作按鈕、次要資訊與狀態標記）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '入門導覽任務清單：引導新使用者完成產品核心設定步驟',
    '活動動態流（Activity Feed）：呈現通知、留言、系統事件等時序資訊',
    '社群互動列表：包含按讚、留言、投票的討論串或內容流',
    '設定或配置清單：分類呈現可切換的選項與偏好設定',
    '混合類型資料：同一頁面需展示多種項目類型（文章、任務、通知）',
  ],
  whenNotToUse: [
    '大量結構化資料的顯示 — 應使用 DataTable 支援排序、過濾、分頁',
    '層級式資料（目錄樹） — 應使用 Tree 元件',
    '純文字標題導覽 — 應使用 Navigation 或 Sidebar 元件',
    '需要拖曳排序且支援多層結構 — 應使用專門的 Kanban 或 Tree',
  ],
  pitfalls: [
    '項目高度差異過大造成列表節奏不一，降低可掃描性',
    '未使用虛擬滾動（CDK Virtual Scroll）就渲染上千筆資料，造成效能瓶頸',
    '動作按鈕（刪除、編輯）擺放位置不一致，使用者難以形成肌肉記憶',
    '缺少空狀態（Empty State）與載入中狀態，使用者會誤以為系統故障',
    '分頁或無限滾動邏輯錯誤，造成重複載入或遺漏資料',
    '項目之間的分隔線與留白過於緊湊，在觸控裝置上不易點擊',
  ],
  accessibility: [
    '以 <ul> / <ol> 或 role="list" 包裹清單，每個項目使用 role="listitem"',
    '每個項目的主要操作需具備可達的鍵盤焦點與 aria-label 描述',
    '狀態標記（已完成、待處理）須有文字或 aria-label，不可僅以顏色呈現',
    '動態新增的項目透過 aria-live="polite" 播報，避免干擾使用者操作',
    '點擊目標至少 44×44 像素，符合 WCAG 2.5.5 觸控目標標準',
    '虛擬滾動下維持正確的 aria-setsize 與 aria-posinset，讓螢幕閱讀器知道總筆數',
  ],
};

const META: CatalogBlockMeta = {
  id: 'lists',
  title: 'Lists',
  category: 'application',
  subcategory: 'Lists',
  summary:
    '清單元件集合，涵蓋入門任務、活動動態、社群投票、多類型混合等版型，適合儀表板、動態流與設定頁面。',
  tags: ['list', 'feed', 'onboarding', 'activity', 'comments'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['banners', 'kpi-cards'],
};

@Component({
  selector: 'app-lists-catalog-page',
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
export class ListsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
