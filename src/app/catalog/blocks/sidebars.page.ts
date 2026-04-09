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

import { Sidebar1Component } from '../../blocks/custom-sidebars/sidebar-1/sidebar-1.component';
import { Sidebar2Component } from '../../blocks/custom-sidebars/sidebar-2/sidebar-2.component';
import { Sidebar3Component } from '../../blocks/custom-sidebars/sidebar-3/sidebar-3.component';
import { Sidebar4Component } from '../../blocks/custom-sidebars/sidebar-4/sidebar-4.component';
import { Sidebar5Component } from '../../blocks/custom-sidebars/sidebar-5/sidebar-5.component';
import { Sidebar6Component } from '../../blocks/custom-sidebars/sidebar-6/sidebar-6.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'sidebar-1',
    label: 'Sidebar 01 — 基本固定側邊欄',
    registryCategory: 'custom-sidebars',
    component: Sidebar1Component,
    isFree: true,
  },
  {
    id: 'sidebar-2',
    label: 'Sidebar 02 — 可收合側邊欄',
    registryCategory: 'custom-sidebars',
    component: Sidebar2Component,
    isFree: true,
  },
  {
    id: 'sidebar-3',
    label: 'Sidebar 03 — 分組式導覽',
    registryCategory: 'custom-sidebars',
    component: Sidebar3Component,
    isFree: true,
  },
  {
    id: 'sidebar-4',
    label: 'Sidebar 04 — 含徽章與計數',
    registryCategory: 'custom-sidebars',
    component: Sidebar4Component,
    isFree: true,
  },
  {
    id: 'sidebar-5',
    label: 'Sidebar 05 — 迷你模式（僅圖示）',
    registryCategory: 'custom-sidebars',
    component: Sidebar5Component,
    isFree: true,
  },
  {
    id: 'sidebar-6',
    label: 'Sidebar 06 — 巢狀可展開',
    registryCategory: 'custom-sidebars',
    component: Sidebar6Component,
    isFree: true,
  },
];

const API: ApiDocumentation = {
  inputs: [
    {
      name: 'collapsed',
      type: 'boolean',
      default: 'false',
      required: false,
      description: '是否收合側邊欄（僅顯示圖示）',
    },
    {
      name: 'width',
      type: 'string',
      default: "'240px'",
      required: false,
      description: '展開時的側邊欄寬度',
    },
  ],
  outputs: [
    {
      name: 'navItemClick',
      type: 'string',
      default: null,
      required: false,
      description: '點擊導覽項目時發出項目 ID',
    },
  ],
  slots: [],
  cssProperties: [
    {
      name: '--mat-sys-surface-container-low',
      type: 'color',
      default: '#f4f3f6',
      required: false,
      description: '側邊欄背景色',
    },
    {
      name: '--mat-sys-secondary-container',
      type: 'color',
      default: '#dae2f9',
      required: false,
      description: 'Active 項目背景色',
    },
  ],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '應用程式有 5 個以上的主要功能區需要持久性導覽',
    '使用者需要在不同功能區之間頻繁切換',
    '需要呈現多層級的導覽結構',
    '桌面版應用 — 有足夠水平空間容納側邊欄',
  ],
  whenNotToUse: [
    '僅有 2-3 個頁面 — 使用 Tab 或 Header Nav 即可',
    '行動版為主的應用 — 改用漢堡選單或底部 Tab Bar',
    '導覽項目不固定（由內容動態決定）— 使用 Breadcrumbs',
    '側邊欄會擠壓主要內容到過小的空間',
  ],
  pitfalls: [
    '導覽項目過多造成滾動（超過螢幕高度）',
    '收合狀態下圖示不夠直覺，使用者不知道功能是什麼',
    '巢狀層級超過 3 層導致結構混亂',
    '未提供收合機制造成小螢幕使用者困擾',
    'Active 狀態的視覺回饋不夠明顯',
  ],
  accessibility: [
    '側邊欄使用 `<nav>` 元素並附帶 `aria-label`',
    '可收合的側邊欄按鈕需有 `aria-expanded` 和 `aria-controls`',
    '巢狀項目使用 `aria-expanded` 標記展開/收合狀態',
    '鍵盤可完全操作所有導覽項目（Tab / Enter / Space / Arrow keys）',
    'Active 項目使用 `aria-current="page"`',
  ],
};

const META: CatalogBlockMeta = {
  id: 'sidebars',
  title: 'Sidebars',
  category: 'application',
  subcategory: 'Application Shells',
  summary:
    '側邊欄導覽列集合，提供固定、可收合、分組、含徽章、迷你（僅圖示）、巢狀展開等 6 種實作變體。',
  tags: ['sidebar', 'navigation', 'layout', 'shell'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['stacked-layouts', 'multi-column', 'page-shells'],
  previewMinHeight: 480,
};

@Component({
  selector: 'app-sidebars-catalog-page',
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
export class SidebarsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
