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

  // === M2 SHIPPED (18) ===
  {
    path: 'authentication',
    title: 'Authentication · Catalog',
    loadComponent: () =>
      import('./blocks/authentication.page').then(m => m.AuthenticationCatalogPage),
  },
  {
    path: 'area-charts',
    title: 'Area Charts · Catalog',
    loadComponent: () => import('./blocks/area-charts.page').then(m => m.AreaChartsCatalogPage),
  },
  {
    path: 'spark-area-charts',
    title: 'Spark Area Charts · Catalog',
    loadComponent: () =>
      import('./blocks/spark-area-charts.page').then(m => m.SparkAreaChartsCatalogPage),
  },
  {
    path: 'donut-charts',
    title: 'Donut Charts · Catalog',
    loadComponent: () => import('./blocks/donut-charts.page').then(m => m.DonutChartsCatalogPage),
  },
  {
    path: 'lists',
    title: 'Lists · Catalog',
    loadComponent: () => import('./blocks/lists.page').then(m => m.ListsCatalogPage),
  },
  {
    path: 'hero-sections',
    title: 'Hero Sections · Catalog',
    loadComponent: () => import('./blocks/hero-sections.page').then(m => m.HeroSectionsCatalogPage),
  },
  {
    path: 'feature-sections',
    title: 'Feature Sections · Catalog',
    loadComponent: () =>
      import('./blocks/feature-sections.page').then(m => m.FeatureSectionsCatalogPage),
  },
  {
    path: 'pricing-sections',
    title: 'Pricing Sections · Catalog',
    loadComponent: () =>
      import('./blocks/pricing-sections.page').then(m => m.PricingSectionsCatalogPage),
  },
  {
    path: 'cta-sections',
    title: 'CTA Sections · Catalog',
    loadComponent: () => import('./blocks/cta-sections.page').then(m => m.CtaSectionsCatalogPage),
  },
  {
    path: 'header-sections',
    title: 'Header Sections · Catalog',
    loadComponent: () =>
      import('./blocks/header-sections.page').then(m => m.HeaderSectionsCatalogPage),
  },
  {
    path: 'stats-sections',
    title: 'Stats Sections · Catalog',
    loadComponent: () =>
      import('./blocks/stats-sections.page').then(m => m.StatsSectionsCatalogPage),
  },
  {
    path: 'bento-grids',
    title: 'Bento Grids · Catalog',
    loadComponent: () => import('./blocks/bento-grids.page').then(m => m.BentoGridsCatalogPage),
  },
  {
    path: 'testimonial-sections',
    title: 'Testimonial Sections · Catalog',
    loadComponent: () =>
      import('./blocks/testimonial-sections.page').then(m => m.TestimonialSectionsCatalogPage),
  },
  {
    path: 'newsletter-sections',
    title: 'Newsletter Sections · Catalog',
    loadComponent: () =>
      import('./blocks/newsletter-sections.page').then(m => m.NewsletterSectionsCatalogPage),
  },
  {
    path: 'contact-sections',
    title: 'Contact Sections · Catalog',
    loadComponent: () =>
      import('./blocks/contact-sections.page').then(m => m.ContactSectionsCatalogPage),
  },
  {
    path: 'fancy',
    title: 'Fancy · Catalog',
    loadComponent: () => import('./blocks/fancy.page').then(m => m.FancyCatalogPage),
  },
  {
    path: 'blog-sections',
    title: 'Blog Sections · Catalog',
    loadComponent: () => import('./blocks/blog-sections.page').then(m => m.BlogSectionsCatalogPage),
  },
  {
    path: 'kpi-cards',
    title: 'KPI Cards · Catalog',
    loadComponent: () => import('./blocks/kpi-cards.page').then(m => m.KpiCardsCatalogPage),
  },

  // === M3 SHIPPED (8) ===
  {
    path: 'tables',
    title: 'Tables · Catalog',
    loadComponent: () => import('./blocks/tables.page').then(m => m.TablesCatalogPage),
  },
  {
    path: 'stacked-lists',
    title: 'Stacked Lists · Catalog',
    loadComponent: () => import('./blocks/stacked-lists.page').then(m => m.StackedListsCatalogPage),
  },
  {
    path: 'grid-lists',
    title: 'Grid Lists · Catalog',
    loadComponent: () => import('./blocks/grid-lists.page').then(m => m.GridListsCatalogPage),
  },
  {
    path: 'badges',
    title: 'Badges · Catalog',
    loadComponent: () => import('./blocks/badges.page').then(m => m.BadgesCatalogPage),
  },
  {
    path: 'filterbar',
    title: 'Filter Bar · Catalog',
    loadComponent: () => import('./blocks/filterbar.page').then(m => m.FilterbarCatalogPage),
  },
  {
    path: 'form-layouts',
    title: 'Form Layouts · Catalog',
    loadComponent: () => import('./blocks/form-layouts.page').then(m => m.FormLayoutsCatalogPage),
  },
  {
    path: 'account-user-management',
    title: 'Account & User Management · Catalog',
    loadComponent: () =>
      import('./blocks/account-user-management.page').then(m => m.AccountUserManagementCatalogPage),
  },
  {
    path: 'file-upload',
    title: 'File Upload · Catalog',
    loadComponent: () => import('./blocks/file-upload.page').then(m => m.FileUploadCatalogPage),
  },

  // === M4 COMING SOON (7) ===
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
    path: 'line-charts',
    component: ComingSoon,
    title: 'Line Charts · Catalog',
    data: { id: 'line-charts' },
  },
  {
    path: 'status-monitoring',
    component: ComingSoon,
    title: 'Status Monitoring · Catalog',
    data: { id: 'status-monitoring' },
  },
];
