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

import { PageShell1Component } from '../../blocks/free-page-shells/page-shell-1/page-shell-1.component';
import { PageShell2Component } from '../../blocks/page-shells/page-shell-2/page-shell-2.component';
import { PageShell3Component } from '../../blocks/page-shells/page-shell-3/page-shell-3.component';
import { PageShell4Component } from '../../blocks/page-shells/page-shell-4/page-shell-4.component';
import { PageShell5Component } from '../../blocks/page-shells/page-shell-5/page-shell-5.component';
import { PageShell6Component } from '../../blocks/page-shells/page-shell-6/page-shell-6.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'page-shell-1',
    label: 'Page Shell 1 — 基礎中央容器 (Free)',
    registryCategory: 'free-page-shells',
    component: PageShell1Component,
    isFree: true,
  },
  {
    id: 'page-shell-2',
    label: 'Page Shell 2 — 含側邊欄',
    registryCategory: 'page-shells',
    component: PageShell2Component,
    isFree: false,
  },
  {
    id: 'page-shell-3',
    label: 'Page Shell 3 — 含浮動 Header',
    registryCategory: 'page-shells',
    component: PageShell3Component,
    isFree: false,
  },
  {
    id: 'page-shell-4',
    label: 'Page Shell 4 — Tab 切換式',
    registryCategory: 'page-shells',
    component: PageShell4Component,
    isFree: false,
  },
  {
    id: 'page-shell-5',
    label: 'Page Shell 5 — 多欄式內容',
    registryCategory: 'page-shells',
    component: PageShell5Component,
    isFree: false,
  },
  {
    id: 'page-shell-6',
    label: 'Page Shell 6 — Sticky Footer',
    registryCategory: 'page-shells',
    component: PageShell6Component,
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
      description: '頁面主要內容區塊',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '需要為頁面提供一致的最外層容器與寬度限制',
    '想要快速套用 header / footer / 邊距的標準版型',
    '希望整體視覺與其他 Application Shell 元件保持一致',
  ],
  whenNotToUse: [
    '需要客製化整頁版型（建議直接使用 Tailwind grid / flex 佈局）',
    '頁面需要高度互動的多欄編輯器（請改用 Multi-column）',
  ],
  pitfalls: [
    '不要在 Page Shell 內再嵌套另一個 Page Shell（會破壞 max-width 與 padding 假設）',
    '搭配 Sticky Footer 變體時要確認頁面 min-height 設為 100vh',
  ],
  accessibility: [
    'Page Shell 是純佈局容器，務必在內容區放置正確的 landmark（main / nav / footer）',
    '保持 heading 階層的連續性，避免跨層級',
  ],
};

const META: CatalogBlockMeta = {
  id: 'page-shells',
  title: 'Page Shells',
  category: 'application',
  subcategory: 'Application Shells',
  summary: '基礎頁面外殼，提供標準的內容寬度與邊距，適合作為大部分頁面的最外層容器。',
  tags: ['layout', 'shell', 'application'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['stacked-layouts', 'multi-column'],
};

@Component({
  selector: 'app-page-shells-catalog-page',
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
export class PageShellsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
