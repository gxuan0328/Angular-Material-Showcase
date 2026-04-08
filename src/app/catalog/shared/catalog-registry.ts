import { BlockDisplayCategory } from '../../core/layout/models';
import { EMPTY_API } from '../models/api-documentation';
import { EMPTY_BEST_PRACTICES } from '../models/best-practice-notes';
import { CatalogBlockMeta, CatalogStatus } from '../models/catalog-block-meta';

/**
 * Single source of truth — every entry maps to a /catalog/<id> route, the
 * left-tree navigation, and the prev/next pager. Variants and metadata are
 * supplied by per-category .page.ts files. Categories with status='shipped'
 * lazy-load their .page.ts in catalog.routes.ts; the others render the
 * shared ComingSoon placeholder.
 */
export interface CatalogRegistryEntry {
  readonly id: string;
  readonly title: string;
  readonly category: BlockDisplayCategory;
  readonly subcategory: string;
  readonly summary: string;
  readonly status: CatalogStatus;
}

export const CATALOG_REGISTRY: readonly CatalogRegistryEntry[] = [
  // Application — 29 entries
  {
    id: 'account-user-management',
    title: 'Account & User Management',
    category: 'application',
    subcategory: 'Forms',
    summary: '帳戶與使用者管理表單',
    status: 'coming-soon',
  },
  {
    id: 'area-charts',
    title: 'Area Charts',
    category: 'application',
    subcategory: 'Charts',
    summary: '面積圖呈現時間序列趨勢',
    status: 'shipped',
  },
  {
    id: 'authentication',
    title: 'Authentication',
    category: 'application',
    subcategory: 'Forms',
    summary: '登入、註冊、密碼重設等表單',
    status: 'shipped',
  },
  {
    id: 'badges',
    title: 'Badges',
    category: 'application',
    subcategory: 'Elements',
    summary: '狀態與計數標籤',
    status: 'coming-soon',
  },
  {
    id: 'bar-charts',
    title: 'Bar Charts',
    category: 'application',
    subcategory: 'Charts',
    summary: '橫向與直向長條圖',
    status: 'coming-soon',
  },
  {
    id: 'bar-lists',
    title: 'Bar Lists',
    category: 'application',
    subcategory: 'Charts',
    summary: '排行榜風格的條列指標',
    status: 'coming-soon',
  },
  {
    id: 'billing-usage',
    title: 'Billing & Usage',
    category: 'application',
    subcategory: 'Forms',
    summary: '訂閱、付款、用量顯示',
    status: 'coming-soon',
  },
  {
    id: 'chart-compositions',
    title: 'Chart Compositions',
    category: 'application',
    subcategory: 'Charts',
    summary: '組合多種圖表類型',
    status: 'coming-soon',
  },
  {
    id: 'chart-tooltips',
    title: 'Chart Tooltips',
    category: 'application',
    subcategory: 'Charts',
    summary: '圖表懸停提示',
    status: 'coming-soon',
  },
  {
    id: 'components',
    title: 'Components',
    category: 'application',
    subcategory: 'Components',
    summary: 'Breadcrumbs、Bar List、Big Button 等基礎元件',
    status: 'shipped',
  },
  {
    id: 'dialogs',
    title: 'Dialogs',
    category: 'application',
    subcategory: 'Overlays',
    summary: '對話框與確認彈窗',
    status: 'shipped',
  },
  {
    id: 'donut-charts',
    title: 'Donut Charts',
    category: 'application',
    subcategory: 'Charts',
    summary: '甜甜圈圖呈現比例分佈',
    status: 'shipped',
  },
  {
    id: 'empty-states',
    title: 'Empty States',
    category: 'application',
    subcategory: 'Feedbacks',
    summary: '空清單、無結果、引導開始',
    status: 'shipped',
  },
  {
    id: 'file-upload',
    title: 'File Upload',
    category: 'application',
    subcategory: 'Forms',
    summary: '檔案上傳與拖放',
    status: 'coming-soon',
  },
  {
    id: 'filterbar',
    title: 'Filter Bar',
    category: 'application',
    subcategory: 'Components',
    summary: '清單篩選列',
    status: 'coming-soon',
  },
  {
    id: 'flyout-menus',
    title: 'Flyout Menus',
    category: 'application',
    subcategory: 'Overlays',
    summary: '彈出式選單',
    status: 'shipped',
  },
  {
    id: 'form-layouts',
    title: 'Form Layouts',
    category: 'application',
    subcategory: 'Forms',
    summary: '表單版面範本',
    status: 'coming-soon',
  },
  {
    id: 'grid-lists',
    title: 'Grid Lists',
    category: 'application',
    subcategory: 'Lists',
    summary: '網格列表',
    status: 'coming-soon',
  },
  {
    id: 'line-charts',
    title: 'Line Charts',
    category: 'application',
    subcategory: 'Charts',
    summary: '折線圖呈現趨勢',
    status: 'coming-soon',
  },
  {
    id: 'lists',
    title: 'Lists',
    category: 'application',
    subcategory: 'Lists',
    summary: '上手清單與訊息流',
    status: 'shipped',
  },
  {
    id: 'multi-column',
    title: 'Multi-column',
    category: 'application',
    subcategory: 'Application Shells',
    summary: '多欄式應用殼',
    status: 'shipped',
  },
  {
    id: 'page-headings',
    title: 'Page Headings',
    category: 'application',
    subcategory: 'Headings',
    summary: '頁面標題列',
    status: 'shipped',
  },
  {
    id: 'page-shells',
    title: 'Page Shells',
    category: 'application',
    subcategory: 'Application Shells',
    summary: '基本頁面外殼',
    status: 'shipped',
  },
  {
    id: 'section-headings',
    title: 'Section Headings',
    category: 'application',
    subcategory: 'Headings',
    summary: '區段標題',
    status: 'shipped',
  },
  {
    id: 'spark-area-charts',
    title: 'Spark Area Charts',
    category: 'application',
    subcategory: 'Charts',
    summary: '迷你面積圖',
    status: 'shipped',
  },
  {
    id: 'stacked-layouts',
    title: 'Stacked Layouts',
    category: 'application',
    subcategory: 'Application Shells',
    summary: '堆疊式應用殼',
    status: 'shipped',
  },
  {
    id: 'stacked-lists',
    title: 'Stacked Lists',
    category: 'application',
    subcategory: 'Lists',
    summary: '堆疊清單',
    status: 'coming-soon',
  },
  {
    id: 'status-monitoring',
    title: 'Status Monitoring',
    category: 'application',
    subcategory: 'Components',
    summary: '系統狀態與健康儀表',
    status: 'coming-soon',
  },
  {
    id: 'tables',
    title: 'Tables',
    category: 'application',
    subcategory: 'Lists',
    summary: '資料表格',
    status: 'coming-soon',
  },

  // Marketing — 14 entries
  {
    id: 'banners',
    title: 'Banners',
    category: 'marketing',
    subcategory: 'Elements',
    summary: '公告與通知橫幅',
    status: 'shipped',
  },
  {
    id: 'bento-grids',
    title: 'Bento Grids',
    category: 'marketing',
    subcategory: 'Page Sections',
    summary: '不規則格狀展示',
    status: 'shipped',
  },
  {
    id: 'blog-sections',
    title: 'Blog Sections',
    category: 'marketing',
    subcategory: 'Page Sections',
    summary: '部落格摘要區塊',
    status: 'shipped',
  },
  {
    id: 'contact-sections',
    title: 'Contact Sections',
    category: 'marketing',
    subcategory: 'Page Sections',
    summary: '聯絡資訊區塊',
    status: 'shipped',
  },
  {
    id: 'cta-sections',
    title: 'CTA Sections',
    category: 'marketing',
    subcategory: 'Page Sections',
    summary: '行動呼籲區塊',
    status: 'shipped',
  },
  {
    id: 'fancy',
    title: 'Fancy',
    category: 'marketing',
    subcategory: 'Page Sections',
    summary: '互動式視覺效果',
    status: 'shipped',
  },
  {
    id: 'feature-sections',
    title: 'Feature Sections',
    category: 'marketing',
    subcategory: 'Page Sections',
    summary: '產品特色介紹',
    status: 'shipped',
  },
  {
    id: 'header-sections',
    title: 'Header Sections',
    category: 'marketing',
    subcategory: 'Page Sections',
    summary: '頂部導覽區塊',
    status: 'shipped',
  },
  {
    id: 'hero-sections',
    title: 'Hero Sections',
    category: 'marketing',
    subcategory: 'Page Sections',
    summary: 'Landing 首屏',
    status: 'shipped',
  },
  {
    id: 'kpi-cards',
    title: 'KPI Cards',
    category: 'marketing',
    subcategory: 'Page Sections',
    summary: '指標卡片',
    status: 'shipped',
  },
  {
    id: 'newsletter-sections',
    title: 'Newsletter Sections',
    category: 'marketing',
    subcategory: 'Page Sections',
    summary: '訂閱電子報區塊',
    status: 'shipped',
  },
  {
    id: 'pricing-sections',
    title: 'Pricing Sections',
    category: 'marketing',
    subcategory: 'Page Sections',
    summary: '方案訂價區塊',
    status: 'shipped',
  },
  {
    id: 'stats-sections',
    title: 'Stats Sections',
    category: 'marketing',
    subcategory: 'Page Sections',
    summary: '公司實績統計',
    status: 'shipped',
  },
  {
    id: 'testimonial-sections',
    title: 'Testimonial Sections',
    category: 'marketing',
    subcategory: 'Page Sections',
    summary: '使用者見證',
    status: 'shipped',
  },
];

export function findCatalogEntry(id: string): CatalogRegistryEntry | undefined {
  return CATALOG_REGISTRY.find(entry => entry.id === id);
}

export function findCatalogIndex(id: string): number {
  return CATALOG_REGISTRY.findIndex(entry => entry.id === id);
}

export function getNextEntry(id: string): CatalogRegistryEntry | undefined {
  const index = findCatalogIndex(id);
  if (index < 0 || index === CATALOG_REGISTRY.length - 1) return undefined;
  return CATALOG_REGISTRY[index + 1];
}

export function getPreviousEntry(id: string): CatalogRegistryEntry | undefined {
  const index = findCatalogIndex(id);
  if (index <= 0) return undefined;
  return CATALOG_REGISTRY[index - 1];
}

export function buildCatalogStub(entry: CatalogRegistryEntry): CatalogBlockMeta {
  return {
    id: entry.id,
    title: entry.title,
    category: entry.category,
    subcategory: entry.subcategory,
    summary: entry.summary,
    tags: [entry.subcategory],
    status: entry.status,
    variants: [],
    api: EMPTY_API,
    bestPractices: EMPTY_BEST_PRACTICES,
    relatedBlockIds: [],
  };
}
