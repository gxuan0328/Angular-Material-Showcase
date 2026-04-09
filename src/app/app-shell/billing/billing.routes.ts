import { Routes } from '@angular/router';

import { BillingShell } from './billing-shell';

export const BILLING_ROUTES: Routes = [
  {
    path: '',
    component: BillingShell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () => import('./billing-overview').then(m => m.BillingOverview),
        title: '計費總覽',
      },
      {
        path: 'invoices',
        loadComponent: () => import('./billing-invoices').then(m => m.BillingInvoices),
        title: '帳單紀錄',
      },
      {
        path: 'usage',
        loadComponent: () => import('./billing-usage').then(m => m.BillingUsage),
        title: '用量',
      },
      {
        path: 'plans',
        loadComponent: () => import('./billing-plans').then(m => m.BillingPlans),
        title: '方案',
      },
    ],
  },
];
