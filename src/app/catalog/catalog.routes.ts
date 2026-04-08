import { Routes } from '@angular/router';

import { CatalogIndex } from './catalog-index';
import { ComingSoon } from './coming-soon';

export const CATALOG_ROUTES: Routes = [
  { path: '', component: CatalogIndex, title: 'Catalog' },

  // === M1 SHIPPED (10) ===
  {
    path: 'page-shells',
    title: 'Page Shells · Catalog',
    loadComponent: () => import('./blocks/page-shells.page').then(m => m.PageShellsCatalogPage),
  },
  {
    path: 'stacked-layouts',
    title: 'Stacked Layouts · Catalog',
    loadComponent: () =>
      import('./blocks/stacked-layouts.page').then(m => m.StackedLayoutsCatalogPage),
  },
  {
    path: 'multi-column',
    title: 'Multi-column · Catalog',
    loadComponent: () => import('./blocks/multi-column.page').then(m => m.MultiColumnCatalogPage),
  },
  {
    path: 'page-headings',
    title: 'Page Headings · Catalog',
    loadComponent: () => import('./blocks/page-headings.page').then(m => m.PageHeadingsCatalogPage),
  },
  {
    path: 'section-headings',
    title: 'Section Headings · Catalog',
    loadComponent: () =>
      import('./blocks/section-headings.page').then(m => m.SectionHeadingsCatalogPage),
  },
  {
    path: 'components',
    title: 'Components · Catalog',
    loadComponent: () => import('./blocks/components.page').then(m => m.ComponentsCatalogPage),
  },
  {
    path: 'flyout-menus',
    title: 'Flyout Menus · Catalog',
    loadComponent: () => import('./blocks/flyout-menus.page').then(m => m.FlyoutMenusCatalogPage),
  },
  {
    path: 'dialogs',
    title: 'Dialogs · Catalog',
    loadComponent: () => import('./blocks/dialogs.page').then(m => m.DialogsCatalogPage),
  },
  {
    path: 'empty-states',
    title: 'Empty States · Catalog',
    loadComponent: () => import('./blocks/empty-states.page').then(m => m.EmptyStatesCatalogPage),
  },
  {
    path: 'banners',
    title: 'Banners · Catalog',
    loadComponent: () => import('./blocks/banners.page').then(m => m.BannersCatalogPage),
  },

  // === M2-M4 COMING SOON (33) ===
  // Application (19 remaining)
  {
    path: 'account-user-management',
    component: ComingSoon,
    title: 'Account & User Management · Catalog',
    data: { id: 'account-user-management' },
  },
  {
    path: 'area-charts',
    component: ComingSoon,
    title: 'Area Charts · Catalog',
    data: { id: 'area-charts' },
  },
  {
    path: 'authentication',
    component: ComingSoon,
    title: 'Authentication · Catalog',
    data: { id: 'authentication' },
  },
  { path: 'badges', component: ComingSoon, title: 'Badges · Catalog', data: { id: 'badges' } },
  {
    path: 'bar-charts',
    component: ComingSoon,
    title: 'Bar Charts · Catalog',
    data: { id: 'bar-charts' },
  },
  {
    path: 'bar-lists',
    component: ComingSoon,
    title: 'Bar Lists · Catalog',
    data: { id: 'bar-lists' },
  },
  {
    path: 'billing-usage',
    component: ComingSoon,
    title: 'Billing & Usage · Catalog',
    data: { id: 'billing-usage' },
  },
  {
    path: 'chart-compositions',
    component: ComingSoon,
    title: 'Chart Compositions · Catalog',
    data: { id: 'chart-compositions' },
  },
  {
    path: 'chart-tooltips',
    component: ComingSoon,
    title: 'Chart Tooltips · Catalog',
    data: { id: 'chart-tooltips' },
  },
  {
    path: 'donut-charts',
    component: ComingSoon,
    title: 'Donut Charts · Catalog',
    data: { id: 'donut-charts' },
  },
  {
    path: 'file-upload',
    component: ComingSoon,
    title: 'File Upload · Catalog',
    data: { id: 'file-upload' },
  },
  {
    path: 'filterbar',
    component: ComingSoon,
    title: 'Filter Bar · Catalog',
    data: { id: 'filterbar' },
  },
  {
    path: 'form-layouts',
    component: ComingSoon,
    title: 'Form Layouts · Catalog',
    data: { id: 'form-layouts' },
  },
  {
    path: 'grid-lists',
    component: ComingSoon,
    title: 'Grid Lists · Catalog',
    data: { id: 'grid-lists' },
  },
  {
    path: 'line-charts',
    component: ComingSoon,
    title: 'Line Charts · Catalog',
    data: { id: 'line-charts' },
  },
  { path: 'lists', component: ComingSoon, title: 'Lists · Catalog', data: { id: 'lists' } },
  {
    path: 'spark-area-charts',
    component: ComingSoon,
    title: 'Spark Area Charts · Catalog',
    data: { id: 'spark-area-charts' },
  },
  {
    path: 'stacked-lists',
    component: ComingSoon,
    title: 'Stacked Lists · Catalog',
    data: { id: 'stacked-lists' },
  },
  {
    path: 'status-monitoring',
    component: ComingSoon,
    title: 'Status Monitoring · Catalog',
    data: { id: 'status-monitoring' },
  },
  { path: 'tables', component: ComingSoon, title: 'Tables · Catalog', data: { id: 'tables' } },

  // Marketing (13)
  {
    path: 'bento-grids',
    component: ComingSoon,
    title: 'Bento Grids · Catalog',
    data: { id: 'bento-grids' },
  },
  {
    path: 'blog-sections',
    component: ComingSoon,
    title: 'Blog Sections · Catalog',
    data: { id: 'blog-sections' },
  },
  {
    path: 'contact-sections',
    component: ComingSoon,
    title: 'Contact Sections · Catalog',
    data: { id: 'contact-sections' },
  },
  {
    path: 'cta-sections',
    component: ComingSoon,
    title: 'CTA Sections · Catalog',
    data: { id: 'cta-sections' },
  },
  { path: 'fancy', component: ComingSoon, title: 'Fancy · Catalog', data: { id: 'fancy' } },
  {
    path: 'feature-sections',
    component: ComingSoon,
    title: 'Feature Sections · Catalog',
    data: { id: 'feature-sections' },
  },
  {
    path: 'header-sections',
    component: ComingSoon,
    title: 'Header Sections · Catalog',
    data: { id: 'header-sections' },
  },
  {
    path: 'hero-sections',
    component: ComingSoon,
    title: 'Hero Sections · Catalog',
    data: { id: 'hero-sections' },
  },
  {
    path: 'kpi-cards',
    component: ComingSoon,
    title: 'KPI Cards · Catalog',
    data: { id: 'kpi-cards' },
  },
  {
    path: 'newsletter-sections',
    component: ComingSoon,
    title: 'Newsletter Sections · Catalog',
    data: { id: 'newsletter-sections' },
  },
  {
    path: 'pricing-sections',
    component: ComingSoon,
    title: 'Pricing Sections · Catalog',
    data: { id: 'pricing-sections' },
  },
  {
    path: 'stats-sections',
    component: ComingSoon,
    title: 'Stats Sections · Catalog',
    data: { id: 'stats-sections' },
  },
  {
    path: 'testimonial-sections',
    component: ComingSoon,
    title: 'Testimonial Sections · Catalog',
    data: { id: 'testimonial-sections' },
  },
];
