import { GuideCategory } from '../models/guide-chapter';

/** Lightweight registry entry for navigation and routing */
export interface GuideRegistryEntry {
  readonly id: string;
  readonly number: number;
  readonly title: string;
  readonly subtitle: string;
  readonly icon: string;
  readonly category: GuideCategory;
  readonly estimatedMinutes: number;
}

export const GUIDE_REGISTRY: readonly GuideRegistryEntry[] = [
  {
    id: 'components',
    number: 1,
    title: '元件宣告與生命週期',
    subtitle: '@Component 裝飾器、Signal API、模板語法、元件通訊',
    icon: 'widgets',
    category: 'fundamentals',
    estimatedMinutes: 45,
  },
  {
    id: 'dependency-injection',
    number: 2,
    title: '服務與依賴注入',
    subtitle: 'Provider 類型、注入器階層、InjectionToken、inject()',
    icon: 'hub',
    category: 'fundamentals',
    estimatedMinutes: 40,
  },
  {
    id: 'routing',
    number: 3,
    title: '路由與導覽',
    subtitle: '延遲載入、守衛、巢狀路由、參數傳遞',
    icon: 'route',
    category: 'fundamentals',
    estimatedMinutes: 40,
  },
  {
    id: 'state-management',
    number: 4,
    title: '狀態管理',
    subtitle: 'Signals、computed、effect、RxJS 互操作',
    icon: 'data_object',
    category: 'intermediate',
    estimatedMinutes: 50,
  },
  {
    id: 'http-client',
    number: 5,
    title: 'HTTP 與 API 整合',
    subtitle: 'HttpClient、攔截器、錯誤處理、重試策略',
    icon: 'cloud',
    category: 'intermediate',
    estimatedMinutes: 35,
  },
  {
    id: 'forms',
    number: 6,
    title: '表單與驗證',
    subtitle: 'Reactive Forms、自訂驗證器、動態表單',
    icon: 'edit_note',
    category: 'intermediate',
    estimatedMinutes: 45,
  },
  {
    id: 'testing',
    number: 7,
    title: '測試策略',
    subtitle: '單元測試、元件測試、HTTP Mock、覆蓋率',
    icon: 'science',
    category: 'advanced',
    estimatedMinutes: 50,
  },
  {
    id: 'performance',
    number: 8,
    title: '效能最佳化',
    subtitle: 'OnPush、Zoneless、@defer、虛擬捲動、Bundle 優化',
    icon: 'speed',
    category: 'advanced',
    estimatedMinutes: 45,
  },
  {
    id: 'rendering-engine',
    number: 9,
    title: '渲染引擎與變更偵測',
    subtitle: 'Zone.js 原理、CD 演算法、OnPush 內部、Zoneless 架構',
    icon: 'memory',
    category: 'framework-core',
    estimatedMinutes: 60,
  },
  {
    id: 'ivy-compiler',
    number: 10,
    title: 'Ivy 編譯器與模板解析',
    subtitle: 'AOT/JIT、模板編譯流程、指令碼生成、tree-shaking',
    icon: 'build_circle',
    category: 'framework-core',
    estimatedMinutes: 55,
  },
  {
    id: 'view-hierarchy',
    number: 11,
    title: '視圖階層與動態元件',
    subtitle: 'LView/TView、ElementRef、ViewContainerRef、ng-content、Renderer2',
    icon: 'account_tree',
    category: 'framework-core',
    estimatedMinutes: 55,
  },
  {
    id: 'signal-internals',
    number: 12,
    title: 'Signal 響應式核心機制',
    subtitle: 'ReactiveNode、依賴追蹤圖、computed 快取、effect 排程',
    icon: 'bolt',
    category: 'framework-core',
    estimatedMinutes: 55,
  },
];

export function findGuideEntry(id: string): GuideRegistryEntry | undefined {
  return GUIDE_REGISTRY.find(e => e.id === id);
}

export function getNextGuideEntry(id: string): GuideRegistryEntry | undefined {
  const idx = GUIDE_REGISTRY.findIndex(e => e.id === id);
  return idx >= 0 && idx < GUIDE_REGISTRY.length - 1 ? GUIDE_REGISTRY[idx + 1] : undefined;
}

export function getPreviousGuideEntry(id: string): GuideRegistryEntry | undefined {
  const idx = GUIDE_REGISTRY.findIndex(e => e.id === id);
  return idx > 0 ? GUIDE_REGISTRY[idx - 1] : undefined;
}

export function getGuideCategories(): readonly { category: GuideCategory; label: string; entries: readonly GuideRegistryEntry[] }[] {
  return [
    { category: 'fundamentals', label: '基礎概念', entries: GUIDE_REGISTRY.filter(e => e.category === 'fundamentals') },
    { category: 'intermediate', label: '進階應用', entries: GUIDE_REGISTRY.filter(e => e.category === 'intermediate') },
    { category: 'advanced', label: '高階實踐', entries: GUIDE_REGISTRY.filter(e => e.category === 'advanced') },
    { category: 'framework-core', label: '框架核心', entries: GUIDE_REGISTRY.filter(e => e.category === 'framework-core') },
  ];
}
