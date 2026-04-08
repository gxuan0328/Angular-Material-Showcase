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

import { BlogSection1Component } from '../../blocks/free-blog-sections/blog-section-1/blog-section-1.component';
import { BlogSection2Component } from '../../blocks/blog-sections/blog-section-2/blog-section-2.component';
import { BlogSection3Component } from '../../blocks/blog-sections/blog-section-3/blog-section-3.component';
import { BlogSection4Component } from '../../blocks/blog-sections/blog-section-4/blog-section-4.component';
import { BlogSection5Component } from '../../blocks/blog-sections/blog-section-5/blog-section-5.component';
import { BlogSection6Component } from '../../blocks/blog-sections/blog-section-6/blog-section-6.component';
import { BlogSection7Component } from '../../blocks/blog-sections/blog-section-7/blog-section-7.component';
import { BlogSection8Component } from '../../blocks/blog-sections/blog-section-8/blog-section-8.component';
import { BlogSection9Component } from '../../blocks/blog-sections/blog-section-9/blog-section-9.component';
import { BlogSection10Component } from '../../blocks/blog-sections/blog-section-10/blog-section-10.component';

const VARIANTS: readonly BlockVariant[] = [
  {
    id: 'blog-section-1',
    label: 'Blog Section 1 — 三欄文章卡片',
    registryCategory: 'free-blog-sections',
    component: BlogSection1Component,
    isFree: true,
  },
  {
    id: 'blog-section-2',
    label: 'Blog Section 2 — 圖文左右並排',
    registryCategory: 'blog-sections',
    component: BlogSection2Component,
    isFree: false,
  },
  {
    id: 'blog-section-3',
    label: 'Blog Section 3 — 精選文章 Banner',
    registryCategory: 'blog-sections',
    component: BlogSection3Component,
    isFree: false,
  },
  {
    id: 'blog-section-4',
    label: 'Blog Section 4 — 雙欄縮圖列表',
    registryCategory: 'blog-sections',
    component: BlogSection4Component,
    isFree: false,
  },
  {
    id: 'blog-section-5',
    label: 'Blog Section 5 — 四欄精簡卡片',
    registryCategory: 'blog-sections',
    component: BlogSection5Component,
    isFree: false,
  },
  {
    id: 'blog-section-6',
    label: 'Blog Section 6 — 主圖加文章列表',
    registryCategory: 'blog-sections',
    component: BlogSection6Component,
    isFree: false,
  },
  {
    id: 'blog-section-7',
    label: 'Blog Section 7 — 分類標籤瀏覽',
    registryCategory: 'blog-sections',
    component: BlogSection7Component,
    isFree: false,
  },
  {
    id: 'blog-section-8',
    label: 'Blog Section 8 — 雜誌風瀑布流',
    registryCategory: 'blog-sections',
    component: BlogSection8Component,
    isFree: false,
  },
  {
    id: 'blog-section-9',
    label: 'Blog Section 9 — 作者導覽列表',
    registryCategory: 'blog-sections',
    component: BlogSection9Component,
    isFree: false,
  },
  {
    id: 'blog-section-10',
    label: 'Blog Section 10 — 時間軸文章流',
    registryCategory: 'blog-sections',
    component: BlogSection10Component,
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
      description: '部落格區塊內容（文章縮圖、標題、摘要、作者、發佈日期、分類標籤）',
    },
  ],
  cssProperties: [],
};

const BEST_PRACTICES: BestPracticeNotes = {
  whenToUse: [
    '內容行銷網站需在首頁展示最新文章，引導訪客深度閱讀',
    '部落格首頁需依分類或時間軸組織大量文章',
    '產品頁底部展示相關技術文章，強化專業形象與 SEO',
    '企業官網新聞區，呈現公司動態、產品發表、媒體報導',
    '電子報訂閱頁面搭配精選文章預覽，提升訂閱意願',
  ],
  whenNotToUse: [
    '尚無持續產出文章的內容團隊 — 空蕩的部落格反而扣分',
    '文章內容與目標客群無關 — 應先建立內容策略',
    '需要即時搜尋與篩選大量文章 — 應使用專屬的內容索引頁',
    '極簡品牌定位 — 過多文章區塊會稀釋首頁焦點',
  ],
  pitfalls: [
    '文章縮圖尺寸不一致，造成版面參差不齊',
    '缺少分頁或載入更多機制，全部一次渲染影響效能',
    '文章摘要過長或過短，無法吸引點擊',
    '未顯示發佈日期，讀者無法判斷內容的時效性',
    '分類標籤過多且無階層，使用者無法快速找到目標主題',
  ],
  accessibility: [
    '文章卡片整體可點擊時，使用 <a> 包裹語意元素並確保焦點樣式',
    '縮圖 alt 屬性須描述文章主題（不可留空或重複文章標題）',
    '使用 <article> 與 <time datetime="..."> 提供語意化結構',
    '分類標籤具備鍵盤可達性與 aria-label 說明用途',
    '文章列表使用 <ul> / <li> 結構，方便螢幕閱讀器計算與導覽',
  ],
};

const META: CatalogBlockMeta = {
  id: 'blog-sections',
  title: 'Blog Sections',
  category: 'marketing',
  subcategory: 'Marketing Page Sections',
  summary:
    '部落格與文章列表區塊集合，用於內容行銷網站、企業官網新聞區、產品落地頁的相關文章推薦，強化內容深度與 SEO。',
  tags: ['blog', 'content', 'articles', 'marketing'],
  status: 'shipped',
  variants: VARIANTS,
  api: API,
  bestPractices: BEST_PRACTICES,
  relatedBlockIds: ['hero-sections', 'newsletter-sections', 'footer-sections'],
};

@Component({
  selector: 'app-blog-sections-catalog-page',
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
export class BlogSectionsCatalogPage {
  protected readonly meta = META;
  protected readonly selectedId = signal<string>(VARIANTS[0].id);
  protected readonly currentVariant = computed<BlockVariant>(
    () => VARIANTS.find(v => v.id === this.selectedId()) ?? VARIANTS[0],
  );

  protected onVariantChange(id: string): void {
    this.selectedId.set(id);
  }
}
