import { Routes } from '@angular/router';

export const GUIDE_ROUTES: Routes = [
  {
    path: '',
    title: 'Angular 深度教學指南',
    loadComponent: () => import('./guide-index').then(m => m.GuideIndex),
  },
  {
    path: 'components',
    title: '元件宣告與生命週期 · Guide',
    loadComponent: () => import('./chapters/ch01-components').then(m => m.Ch01Components),
  },
  {
    path: 'dependency-injection',
    title: '服務與依賴注入 · Guide',
    loadComponent: () => import('./chapters/ch02-dependency-injection').then(m => m.Ch02DependencyInjection),
  },
  {
    path: 'routing',
    title: '路由與導覽 · Guide',
    loadComponent: () => import('./chapters/ch03-routing').then(m => m.Ch03Routing),
  },
  {
    path: 'state-management',
    title: '狀態管理 · Guide',
    loadComponent: () => import('./chapters/ch04-state-management').then(m => m.Ch04StateManagement),
  },
  {
    path: 'http-client',
    title: 'HTTP 與 API 整合 · Guide',
    loadComponent: () => import('./chapters/ch05-http-client').then(m => m.Ch05HttpClient),
  },
  {
    path: 'forms',
    title: '表單與驗證 · Guide',
    loadComponent: () => import('./chapters/ch06-forms').then(m => m.Ch06Forms),
  },
  {
    path: 'testing',
    title: '測試策略 · Guide',
    loadComponent: () => import('./chapters/ch07-testing').then(m => m.Ch07Testing),
  },
  {
    path: 'performance',
    title: '效能最佳化 · Guide',
    loadComponent: () => import('./chapters/ch08-performance').then(m => m.Ch08Performance),
  },
  {
    path: 'rendering-engine',
    title: '渲染引擎與變更偵測 · Guide',
    loadComponent: () => import('./chapters/ch09-rendering-engine').then(m => m.Ch09RenderingEngine),
  },
  {
    path: 'ivy-compiler',
    title: 'Ivy 編譯器與模板解析 · Guide',
    loadComponent: () => import('./chapters/ch10-ivy-compiler').then(m => m.Ch10IvyCompiler),
  },
  {
    path: 'view-hierarchy',
    title: '視圖階層與動態元件 · Guide',
    loadComponent: () => import('./chapters/ch11-view-hierarchy').then(m => m.Ch11ViewHierarchy),
  },
  {
    path: 'signal-internals',
    title: 'Signal 響應式核心機制 · Guide',
    loadComponent: () => import('./chapters/ch12-signal-internals').then(m => m.Ch12SignalInternals),
  },
];
